'use client';

/**
 * Helpers shared by the seven section scenes.
 */

import { useCallback } from 'react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * Convert a screen-space fraction into world units at a given depth.
 *
 * Sections are laid out in CSS (SYN sits in the right third of the hero, the
 * left third of the capabilities block, and so on). Hard-coding world X would
 * put her under the copy at some aspect ratios; this measures the frustum
 * instead so the composition holds from an ultrawide monitor to a phone.
 *
 * `fx`/`fy` are -0.5..0.5 from the centre of the viewport.
 */
export function useViewportAnchor() {
  const camera = useThree((s) => s.camera);
  const size = useThree((s) => s.size);

  return useCallback(
    (fx: number, fy: number, depth: number) => {
      const perspective = camera as THREE.PerspectiveCamera;
      const distance = Math.abs(camera.position.z - depth);
      const height =
        2 * Math.tan(THREE.MathUtils.degToRad(perspective.fov ?? 38) / 2) * distance;
      const width = height * (size.width / Math.max(size.height, 1));
      return { x: fx * width, y: fy * height, width, height };
    },
    [camera, size.width, size.height],
  );
}

/** True when the layout is narrow enough that side-by-side framing breaks. */
export function useIsNarrow() {
  const size = useThree((s) => s.size);
  return size.width < 900;
}

/** Nominal height of the SYN rig in metres, used for screen-space placement. */
export const SYN_HEIGHT = 1.68;

/**
 * Place a standing figure so its *centre* lands at a given screen fraction.
 *
 * Needed because the canvas is viewport-sized while the sections it illustrates
 * are not: on a phone the hero's art column is a few hundred pixels tall, and
 * simply standing SYN on the ground plane puts her head off the top of the
 * screen. This solves for the ground position that puts her where the layout
 * has room for her.
 *
 * Returns the world position her feet should sit at.
 */
export function useFigurePlacement() {
  const anchor = useViewportAnchor();
  return useCallback(
    (fx: number, fy: number, scale: number, cameraTargetY: number, depth = 0) => {
      const { x, y } = anchor(fx, fy, depth);
      return { x, y: cameraTargetY + y - (SYN_HEIGHT * scale) / 2 };
    },
    [anchor],
  );
}

/** Deterministic pseudo-random in 0..1, so layouts are stable across reloads. */
export function hashRandom(seed: number) {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}

/** Evenly distribute `count` points on a sphere of `radius`. */
export function fibonacciSphere(count: number, radius: number) {
  const points: Array<[number, number, number]> = [];
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < count; i++) {
    const y = 1 - (i / Math.max(count - 1, 1)) * 2;
    const r = Math.sqrt(Math.max(0, 1 - y * y));
    const theta = golden * i;
    points.push([Math.cos(theta) * r * radius, y * radius, Math.sin(theta) * r * radius]);
  }
  return points;
}
