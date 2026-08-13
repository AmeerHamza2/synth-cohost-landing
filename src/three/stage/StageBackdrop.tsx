'use client';

/**
 * The environment plate, painted *behind* the canvas.
 *
 * The 3D layer is transparent and the DOM sits in front of it, so something has
 * to provide the room SYN stands in. Doing it in CSS rather than with a 3D
 * skybox is deliberate: it is free, it cross-fades cleanly, and it lets each
 * section change its environment (a brief requirement for the roles section)
 * without touching the render budget.
 *
 * Plates are positioned in *document* space rather than being one fixed layer
 * that swaps on the active section. That matters because the hero is light and
 * every section after it is dark: a single swapping layer turns the hero's dark
 * copy unreadable the moment the next section takes over, while both are still
 * on screen. Each plate now covers exactly its own section and cross-fades with
 * its neighbours across the boundary.
 *
 * Sections that want SYN visible mark themselves `stage-transparent`, which
 * drops their own background so this shows through.
 */

import { useEffect, useState } from 'react';
import { useQuality } from './useQuality';
import type { SectionId } from './types';
import { SECTION_ORDER } from './types';

interface Plate {
  /** Base wash, bottom-most layer. */
  base: string;
  /** Radial accents layered over the base. */
  glow: string;
  /**
   * Narrow-viewport override. Only the hero needs one: its desktop copy is
   * dark-on-light while its mobile copy is light-on-dark, so a single plate
   * would make one of the two unreadable.
   */
  narrowBase?: string;
  narrowGlow?: string;
}

const PLATES: Record<SectionId, Plate> = {
  // Matches the light lavender of the original hero plate, so the existing
  // dark hero copy keeps its contrast exactly as designed.
  hero: {
    base: 'linear-gradient(160deg, #f4f2fb 0%, #ece8f8 45%, #e4dcf5 100%)',
    glow: 'radial-gradient(120% 90% at 78% 42%, rgba(157,92,246,0.20) 0%, rgba(157,92,246,0) 60%)',
    narrowBase: 'linear-gradient(180deg, #141021 0%, #0d0b14 100%)',
    narrowGlow:
      'radial-gradient(90% 60% at 70% 38%, rgba(124,58,237,0.30) 0%, rgba(124,58,237,0) 62%)',
  },
  // The pressure builds: the room darkens as the demands accumulate.
  pressure: {
    base: 'linear-gradient(180deg, #0a0812 0%, #05040a 100%)',
    glow: 'radial-gradient(90% 70% at 50% 45%, rgba(124,58,237,0.22) 0%, rgba(124,58,237,0) 65%)',
  },
  capabilities: {
    base: 'linear-gradient(180deg, #0b0916 0%, #08060f 100%)',
    glow: 'radial-gradient(75% 65% at 34% 50%, rgba(139,92,246,0.30) 0%, rgba(139,92,246,0) 62%)',
  },
  roles: {
    base: 'linear-gradient(180deg, #08060f 0%, #0d0a1c 100%)',
    glow: 'radial-gradient(80% 70% at 50% 40%, rgba(124,58,237,0.24) 0%, rgba(124,58,237,0) 66%)',
  },
  // Studio: the warmer, tighter pool of light of a broadcast set.
  studio: {
    base: 'linear-gradient(180deg, #0a0714 0%, #060410 100%)',
    glow: 'radial-gradient(70% 60% at 42% 46%, rgba(168,85,247,0.28) 0%, rgba(168,85,247,0) 60%)',
  },
  knowledge: {
    base: 'linear-gradient(180deg, #07060f 0%, #0a0818 100%)',
    glow: 'radial-gradient(85% 75% at 55% 45%, rgba(96,66,214,0.26) 0%, rgba(96,66,214,0) 64%)',
  },
  // The finale opens out — deepest black, widest falloff.
  finale: {
    base: 'linear-gradient(180deg, #050409 0%, #020105 100%)',
    glow: 'radial-gradient(120% 100% at 50% 55%, rgba(124,58,237,0.20) 0%, rgba(124,58,237,0) 70%)',
  },
};

/** How far each plate bleeds past its section, giving the cross-fade room. */
const BLEED = 120;

interface Measured {
  id: SectionId;
  top: number;
  height: number;
}

/**
 * Measure each `[data-stage]` marker in document coordinates.
 *
 * Only on mount, resize, and once more after images settle — never per frame.
 */
function useMeasuredSections() {
  const [sections, setSections] = useState<Measured[]>([]);

  useEffect(() => {
    const measure = () => {
      const scrollY = window.scrollY;
      const found: Measured[] = [];
      for (const id of SECTION_ORDER) {
        const el = document.querySelector<HTMLElement>(`[data-stage="${id}"]`);
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        if (rect.height === 0) continue;
        found.push({ id, top: rect.top + scrollY, height: rect.height });
      }
      setSections((prev) => {
        const same =
          prev.length === found.length &&
          prev.every(
            (p, i) =>
              p.id === found[i].id &&
              Math.abs(p.top - found[i].top) < 1 &&
              Math.abs(p.height - found[i].height) < 1,
          );
        return same ? prev : found;
      });
    };

    measure();
    const settle = window.setTimeout(measure, 1200);
    window.addEventListener('resize', measure, { passive: true });

    // Section heights change as fonts and images land.
    const observer = new ResizeObserver(measure);
    observer.observe(document.body);

    return () => {
      window.clearTimeout(settle);
      window.removeEventListener('resize', measure);
      observer.disconnect();
      clearTimeout(settle);
    };
  }, []);

  return sections;
}

export default function StageBackdrop() {
  const quality = useQuality();
  const sections = useMeasuredSections();

  // With the stage off the original section backgrounds are still in place, so
  // painting a plate here would only fight them.
  if (quality === 'off') return null;

  return (
    <div className="stage-backdrop" aria-hidden="true">
      {sections.map(({ id, top, height }) => {
        const plate = PLATES[id];
        const style = {
          top: `${top - BLEED}px`,
          height: `${height + BLEED * 2}px`,
        };
        return (
          <div key={id} className="stage-plate" style={style}>
            <div className="stage-plate__wide">
              <div
                className="stage-backdrop__layer"
                style={{ backgroundImage: plate.base }}
              />
              <div
                className="stage-backdrop__layer"
                style={{ backgroundImage: plate.glow }}
              />
            </div>
            <div className="stage-plate__narrow">
              <div
                className="stage-backdrop__layer"
                style={{ backgroundImage: plate.narrowBase ?? plate.base }}
              />
              <div
                className="stage-backdrop__layer"
                style={{ backgroundImage: plate.narrowGlow ?? plate.glow }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
