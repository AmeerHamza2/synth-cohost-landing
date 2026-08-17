'use client';

/**
 * Track a DOM element with a quad in the 3D layer.
 *
 * The canvas is viewport-fixed while the page scrolls underneath it, so a plane
 * standing in for an image has to be repositioned every frame or it drifts off
 * its own artwork. This measures the element and converts its rect into world
 * units, which is what keeps the 2.5D treatment locked to the exact pixels the
 * original `<img>` occupied.
 */

import { useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

export interface Quad {
  x: number;
  y: number;
  width: number;
  height: number;
  /** False when the element is missing or laid out at zero size. */
  valid: boolean;
}

export function useDomQuad(selector: string) {
  const camera = useThree((s) => s.camera);
  const size = useThree((s) => s.size);
  const quad = useRef<Quad>({ x: 0, y: 0, width: 1, height: 1, valid: false });
  const element = useRef<HTMLElement | null>(null);

  const perspective = useMemo(() => camera as THREE.PerspectiveCamera, [camera]);

  useFrame(() => {
    // Re-resolve lazily: the element may mount after the scene does.
    if (!element.current || !element.current.isConnected) {
      element.current = document.querySelector<HTMLElement>(selector);
    }
    const el = element.current;
    if (!el) {
      quad.current.valid = false;
      return;
    }

    const rect = el.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) {
      quad.current.valid = false;
      return;
    }

    // Pixels to world units at the plane's depth (z = 0).
    const distance = Math.abs(camera.position.z);
    const visibleHeight =
      2 * Math.tan(THREE.MathUtils.degToRad(perspective.fov ?? 40) / 2) * distance;
    const scale = visibleHeight / Math.max(size.height, 1);

    quad.current.x = (rect.left + rect.width / 2 - size.width / 2) * scale;
    quad.current.y = (size.height / 2 - (rect.top + rect.height / 2)) * scale;
    quad.current.width = rect.width * scale;
    quad.current.height = rect.height * scale;
    quad.current.valid = true;
  });

  return quad;
}
