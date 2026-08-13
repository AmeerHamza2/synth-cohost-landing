'use client';

/**
 * Scroll-driven camera.
 *
 * One camera for the whole page. Each section describes where it wants the
 * camera to be and what it should be looking at; `CameraRig` eases between
 * those descriptions. Because the transition is a damp rather than a cut, the
 * seven sections read as one continuous move through a space.
 */

import type { SectionId } from './types';

export interface CameraDirective {
  position: [number, number, number];
  target: [number, number, number];
  fov: number;
  /** Convergence rate. Lower is more cinematic; higher feels responsive. */
  lambda: number;
  /** 0..1 — how much the cursor parallaxes the camera. */
  parallax: number;
  /** Roll in radians. Used sparingly, mostly in the finale. */
  roll: number;
}

export const DEFAULT_CAMERA: CameraDirective = {
  position: [0, 1.55, 3.1],
  target: [0, 1.35, 0],
  fov: 38,
  lambda: 1.9,
  parallax: 1,
  roll: 0,
};

interface CameraDirector {
  owner: SectionId | null;
  target: CameraDirective;
}

export const cameraDirector: CameraDirector = {
  owner: null,
  target: { ...DEFAULT_CAMERA },
};

export function directCamera(section: SectionId, directive: Partial<CameraDirective>) {
  cameraDirector.owner = section;
  const t = cameraDirector.target;
  if (directive.position) {
    t.position[0] = directive.position[0];
    t.position[1] = directive.position[1];
    t.position[2] = directive.position[2];
  }
  if (directive.target) {
    t.target[0] = directive.target[0];
    t.target[1] = directive.target[1];
    t.target[2] = directive.target[2];
  }
  if (directive.fov !== undefined) t.fov = directive.fov;
  if (directive.lambda !== undefined) t.lambda = directive.lambda;
  if (directive.parallax !== undefined) t.parallax = directive.parallax;
  if (directive.roll !== undefined) t.roll = directive.roll;
}

export function resetCameraDirector() {
  cameraDirector.owner = null;
  cameraDirector.target = {
    ...DEFAULT_CAMERA,
    position: [...DEFAULT_CAMERA.position] as [number, number, number],
    target: [...DEFAULT_CAMERA.target] as [number, number, number],
  };
}
