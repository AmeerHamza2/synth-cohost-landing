'use client';

/**
 * Rendering budget as an external store.
 *
 * Device capability is not React state — it is a property of the machine the
 * page happens to be running on, and it cannot be known during server render.
 * `useSyncExternalStore` is the sanctioned way to express exactly that: the
 * server (and the hydration pass) sees `off`, and the client swaps to the real
 * tier in a single controlled re-render, with no setState-in-effect cascade.
 */

import { useSyncExternalStore } from 'react';
import { detectQuality } from './quality';
import type { QualityTier } from './types';

let cached: QualityTier | null = null;
const listeners = new Set<() => void>();

/**
 * Detection runs once and the result is memoised, so repeated `getSnapshot`
 * calls are stable — which is what React requires of an external store.
 */
function getSnapshot(): QualityTier {
  if (cached === null) cached = detectQuality();
  return cached;
}

function getServerSnapshot(): QualityTier {
  return 'off';
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function useQuality(): QualityTier {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

/** Non-reactive read, for use inside `useFrame`. */
export function readQuality(): QualityTier {
  return getSnapshot();
}

/**
 * Re-run detection. Exposed for the dev handle and for tests; a viewport that
 * crosses the mobile breakpoint does not currently re-tier, because tearing a
 * WebGL context down and back up mid-resize costs more than it saves.
 */
export function refreshQuality() {
  cached = detectQuality();
  listeners.forEach((listener) => listener());
}
