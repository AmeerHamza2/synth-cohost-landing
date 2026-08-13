'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { cameraDirector } from './camera';
import { damp, frame } from './frame';

/**
 * Eases the single page camera toward whatever the active section asked for,
 * and adds the small cursor parallax that makes the scene feel like a window
 * rather than a video.
 */
export default function CameraRig() {
  // Scratch vectors, created once. Only ever touched inside `useFrame`.
  const scratch = useRef({
    smoothTarget: new THREE.Vector3(0, 1.35, 0),
    lookAt: new THREE.Vector3(),
  });

  // The camera is taken from the frame state rather than `useThree`, because
  // it is mutated every frame and must not be treated as a render value.
  useFrame((state, rawDelta) => {
    const camera = state.camera;
    const { smoothTarget, lookAt } = scratch.current;
    const dt = Math.min(rawDelta, 0.05);
    const d = cameraDirector.target;
    const lambda = d.lambda;
    const calm = frame.reducedMotion;

    // Cursor parallax is applied as an offset to the *desired* position, so it
    // never fights the section transition.
    const sway = calm ? 0 : d.parallax;
    const offsetX = frame.pointer.x * 0.22 * sway;
    const offsetY = frame.pointer.y * 0.14 * sway;

    camera.position.x = damp(camera.position.x, d.position[0] + offsetX, lambda, dt);
    camera.position.y = damp(camera.position.y, d.position[1] + offsetY, lambda, dt);
    camera.position.z = damp(camera.position.z, d.position[2], lambda, dt);

    smoothTarget.x = damp(smoothTarget.x, d.target[0] + offsetX * 0.35, lambda, dt);
    smoothTarget.y = damp(smoothTarget.y, d.target[1] + offsetY * 0.35, lambda, dt);
    smoothTarget.z = damp(smoothTarget.z, d.target[2], lambda, dt);

    lookAt.copy(smoothTarget);
    camera.lookAt(lookAt);
    if (d.roll !== 0 || camera.rotation.z !== 0) {
      camera.rotation.z = damp(camera.rotation.z, d.roll, lambda, dt);
    }

    const perspective = camera as THREE.PerspectiveCamera;
    if (perspective.isPerspectiveCamera) {
      const nextFov = damp(perspective.fov, d.fov, lambda, dt);
      if (Math.abs(nextFov - perspective.fov) > 0.01) {
        perspective.fov = nextFov;
        perspective.updateProjectionMatrix();
      }
    }
  });

  return null;
}
