'use client';

/**
 * Device capability detection.
 *
 * The stage is an enhancement, never a requirement: the existing 2D page is the
 * baseline and stays fully readable when this returns `off`.
 */

import type { QualityTier } from './types';

interface NavigatorWithMemory extends Navigator {
  deviceMemory?: number;
}

/** Cheap WebGL2 probe. The context is disposed immediately. */
function hasWebGL(): boolean {
  try {
    const canvas = document.createElement('canvas');
    const gl =
      canvas.getContext('webgl2') ??
      canvas.getContext('webgl') ??
      canvas.getContext('experimental-webgl');
    if (!gl) return false;
    const lose = (gl as WebGLRenderingContext).getExtension('WEBGL_lose_context');
    lose?.loseContext();
    return true;
  } catch {
    return false;
  }
}

export function prefersReducedMotion(): boolean {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

/**
 * Resolve the rendering budget.
 *
 * Mobile is NOT excluded — the brief calls for touch interaction — but it runs
 * a reduced tier: lower pixel ratio, simpler lighting, fewer instanced props.
 * Sustained WebGL on a phone is a thermal problem, so `low` is conservative.
 */
export function detectQuality(): QualityTier {
  if (typeof window === 'undefined') return 'off';
  if (prefersReducedMotion()) return 'off';
  if (!hasWebGL()) return 'off';

  const nav = navigator as NavigatorWithMemory;
  const cores = nav.hardwareConcurrency ?? 4;
  const memory = nav.deviceMemory ?? 4;
  const coarsePointer = window.matchMedia('(pointer: coarse)').matches;
  const narrow = window.innerWidth < 768;

  // Phones and tablets: keep the stage, halve the cost.
  //
  // The floor here is deliberately very low. It used to be `cores <= 4`, which
  // reads as cautious but is not: Safari does not implement `deviceMemory` at
  // all, so that term never fires, and plenty of current iPhones report four
  // cores or fewer. The effect was that the same phone model could get either
  // the 3D site or the original 2D page depending on what it reported — two
  // different websites, with no way to tell which you would get.
  //
  // A consistent site matters more than shielding the weakest device from a
  // scene that already runs at the `low` tier: reduced pixel ratio, no
  // shadows, no bloom and a third of the instanced props.
  if (coarsePointer || narrow) {
    if (cores <= 2 || memory <= 1) return 'off';
    return 'low';
  }

  if (cores <= 4 || memory <= 4) return 'low';
  if (cores <= 8) return 'medium';
  return 'high';
}

/** Device pixel ratio clamp — the single biggest lever on Retina displays. */
export function dprFor(tier: QualityTier): [number, number] {
  switch (tier) {
    case 'high':
      return [1, 1.75];
    case 'medium':
      return [1, 1.5];
    case 'low':
      return [1, 1.25];
    default:
      return [1, 1];
  }
}

/** Shadow maps are the first thing to drop; only `high` pays for them. */
export const shadowsFor = (tier: QualityTier) => tier === 'high';

/**
 * Scales instanced/particle counts per tier so scenes can express density once
 * and let the budget decide.
 */
export function densityFor(tier: QualityTier): number {
  switch (tier) {
    case 'high':
      return 1;
    case 'medium':
      return 0.6;
    case 'low':
      return 0.3;
    default:
      return 0;
  }
}
