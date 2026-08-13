'use client';

/**
 * Drives the stage from the DOM.
 *
 * Reads the `[data-stage]` markers the existing sections carry, converts scroll
 * position into per-section progress, and decides which section owns the stage.
 * Everything continuous is written into `frame`; only the active-section change
 * touches React state.
 */

import { useEffect } from 'react';
import { clamp01, damp, frame } from './frame';
import { readStage, useStage } from './store';
import { prefersReducedMotion } from './quality';
import type { SectionId } from './types';
import { SECTION_ORDER } from './types';

type Marker = { id: SectionId; el: HTMLElement };

function collectMarkers(): Marker[] {
  const nodes = Array.from(
    document.querySelectorAll<HTMLElement>('[data-stage]'),
  );
  const markers: Marker[] = [];
  for (const el of nodes) {
    const id = el.dataset.stage as SectionId | undefined;
    if (id && SECTION_ORDER.includes(id)) markers.push({ id, el });
  }
  // Narrative order, not DOM order, so the mount window stays meaningful.
  markers.sort((a, b) => SECTION_ORDER.indexOf(a.id) - SECTION_ORDER.indexOf(b.id));
  return markers;
}

export function useStageDriver() {
  const setActive = useStage((s) => s.setActive);

  useEffect(() => {
    frame.reducedMotion = prefersReducedMotion();

    let markers = collectMarkers();
    let raf = 0;
    let lastScrollY = window.scrollY;
    let lastTime = performance.now();

    const measure = () => {
      markers = collectMarkers();
    };

    const tick = () => {
      raf = requestAnimationFrame(tick);

      const now = performance.now();
      const dt = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      const vh = window.innerHeight;
      const vw = window.innerWidth;
      frame.viewport.width = vw;
      frame.viewport.height = vh;
      frame.time += dt;

      // Pointer easing. The raw target is set by the listeners below; easing it
      // here keeps SYN's gaze from snapping and costs nothing extra.
      const lambda = frame.reducedMotion ? 20 : 6;
      frame.pointer.x = damp(frame.pointer.x, frame.pointerTarget.x, lambda, dt);
      frame.pointer.y = damp(frame.pointer.y, frame.pointerTarget.y, lambda, dt);

      // Document scroll.
      const scrollY = window.scrollY;
      const maxScroll = Math.max(
        1,
        document.documentElement.scrollHeight - vh,
      );
      frame.scroll = clamp01(scrollY / maxScroll);
      frame.scrollVelocity = damp(
        frame.scrollVelocity,
        (scrollY - lastScrollY) / Math.max(dt, 0.001) / 1000,
        8,
        dt,
      );
      lastScrollY = scrollY;

      // Per-section progress + active pick.
      const centre = vh / 2;
      let bestId: SectionId | null = null;
      let bestDistance = Infinity;

      for (const { id, el } of markers) {
        const rect = el.getBoundingClientRect();
        if (rect.height === 0) continue;

        // 0 when the top edge is at the viewport bottom, 1 when the bottom edge
        // has passed the viewport top.
        const travelled = vh - rect.top;
        const total = vh + rect.height;
        frame.section[id] = clamp01(travelled / total);

        const elementCentre = rect.top + rect.height / 2;
        const distance = Math.abs(elementCentre - centre);
        // Only sections actually overlapping the viewport may take the stage.
        const visible = rect.bottom > 0 && rect.top < vh;
        if (visible && distance < bestDistance) {
          bestDistance = distance;
          bestId = id;
        }
      }

      if (bestId !== readStage().active) setActive(bestId);
    };

    const onPointerMove = (e: PointerEvent) => {
      frame.pointerTarget.x = (e.clientX / window.innerWidth) * 2 - 1;
      frame.pointerTarget.y = -((e.clientY / window.innerHeight) * 2 - 1);
      frame.pointerActive = true;
    };

    // Touch: treat a drag as a gaze target, then release back to centre so SYN
    // does not stay locked looking at wherever the finger last was.
    const onTouchMove = (e: TouchEvent) => {
      const t = e.touches[0];
      if (!t) return;
      frame.pointerTarget.x = (t.clientX / window.innerWidth) * 2 - 1;
      frame.pointerTarget.y = -((t.clientY / window.innerHeight) * 2 - 1);
      frame.pointerActive = true;
    };
    const onTouchEnd = () => {
      frame.pointerTarget.x = 0;
      frame.pointerTarget.y = 0;
    };

    const onPointerLeave = () => {
      frame.pointerTarget.x = 0;
      frame.pointerTarget.y = 0;
    };

    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onMotionChange = () => {
      frame.reducedMotion = motionQuery.matches;
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchend', onTouchEnd, { passive: true });
    document.addEventListener('pointerleave', onPointerLeave);
    window.addEventListener('resize', measure, { passive: true });
    motionQuery.addEventListener('change', onMotionChange);

    // Sections mount progressively (images, fonts); re-collect once settled.
    const settle = window.setTimeout(measure, 1000);
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(settle);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
      document.removeEventListener('pointerleave', onPointerLeave);
      window.removeEventListener('resize', measure);
      motionQuery.removeEventListener('change', onMotionChange);
    };
  }, [setActive]);
}
