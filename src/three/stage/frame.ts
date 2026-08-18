/**
 * Per-frame continuous values.
 *
 * These deliberately live OUTSIDE React. Pointer position and scroll progress
 * change every frame; routing them through state (or a zustand selector) would
 * re-render the component tree on every mousemove. Writers update the mutable
 * object, and readers sample it inside `useFrame`.
 *
 * Discrete state that genuinely should re-render React lives in `store.ts`.
 */

import type { SectionId } from './types';
import { SECTION_ORDER } from './types';

export interface StageFrame {
  /** Smoothed pointer in normalised device coords, -1..1 (y up). */
  pointer: { x: number; y: number };
  /** Raw pointer target the smoothed value eases toward. */
  pointerTarget: { x: number; y: number };
  /** True once the user has actually moved a pointer (vs. the 0,0 default). */
  pointerActive: boolean;

  /** Whole-document scroll progress, 0..1. */
  scroll: number;
  /** Scroll velocity in px/frame, smoothed. Drives inertia-style motion. */
  scrollVelocity: number;

  /**
   * Per-section progress, 0..1, where 0 = section top hits viewport bottom and
   * 1 = section bottom leaves viewport top. Sections not on screen keep their
   * last clamped value.
   */
  section: Record<SectionId, number>;

  /**
   * Continuous position along the page's journey, in section units: 0 at the
   * top of section one, 3.5 halfway through section four, 6 at the end.
   *
   * This is what drives the camera through the 3D world. Section progress alone
   * cannot do it — it resets to 0 at every boundary, which would snap the
   * camera back. The journey is monotonic across the whole page.
   */
  journey: number;

  /** Seconds since the stage mounted. Monotonic, pauses with the frameloop. */
  time: number;

  /** Viewport size in CSS pixels. */
  viewport: { width: number; height: number };

  /** Set when the user asked for reduced motion; scenes damp themselves. */
  reducedMotion: boolean;
}

function emptySectionProgress(): Record<SectionId, number> {
  return SECTION_ORDER.reduce(
    (acc, id) => {
      acc[id] = 0;
      return acc;
    },
    {} as Record<SectionId, number>,
  );
}

export const frame: StageFrame = {
  pointer: { x: 0, y: 0 },
  pointerTarget: { x: 0, y: 0 },
  pointerActive: false,
  scroll: 0,
  scrollVelocity: 0,
  section: emptySectionProgress(),
  journey: 0,
  time: 0,
  viewport: { width: 0, height: 0 },
  reducedMotion: false,
};

/** Reset between hot reloads / remounts so stale progress does not leak. */
export function resetFrame() {
  frame.pointer.x = 0;
  frame.pointer.y = 0;
  frame.pointerTarget.x = 0;
  frame.pointerTarget.y = 0;
  frame.pointerActive = false;
  frame.scroll = 0;
  frame.scrollVelocity = 0;
  frame.section = emptySectionProgress();
  frame.journey = 0;
  frame.time = 0;
}

/** Frame-rate independent exponential smoothing. */
export function damp(current: number, target: number, lambda: number, dt: number) {
  return current + (target - current) * (1 - Math.exp(-lambda * dt));
}

export const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);

/** Remap `v` from [a,b] to [0,1], clamped. */
export function range(v: number, a: number, b: number) {
  if (b === a) return 0;
  return clamp01((v - a) / (b - a));
}

/** Rises 0→1 over [a,b] then falls 1→0 over [c,d]. Used for scene beats. */
export function window4(v: number, a: number, b: number, c: number, d: number) {
  return Math.min(range(v, a, b), 1 - range(v, c, d));
}

/**
 * Below this, the page is laid out for a phone and so is the 3D layer.
 *
 * It is Tailwind's `md` breakpoint, and it has to stay that: the sections carry
 * two separate layouts, `md:hidden` and `hidden md:block`, and the 3D layer
 * anchors artwork to whichever one is live. Any disagreement leaves a band of
 * widths where the layer is looking for elements the layout has switched off,
 * and nothing renders.
 */
export const NARROW_WIDTH = 768;
