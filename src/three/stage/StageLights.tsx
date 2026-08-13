'use client';

/**
 * Page-wide lighting.
 *
 * Scenes add their own accents, but the key/fill/rim set lives here so SYN is
 * lit consistently as she moves between sections — and so the brief's "lighting
 * can also react subtly to cursor movement" is true everywhere, not just in the
 * hero.
 */

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { damp, frame } from './frame';
import type { QualityTier } from './types';
import { shadowsFor } from './quality';

export interface StageLightsProps {
  quality: QualityTier;
}

export default function StageLights({ quality }: StageLightsProps) {
  const keyRef = useRef<THREE.DirectionalLight>(null);
  const rimRef = useRef<THREE.PointLight>(null);
  const castShadow = shadowsFor(quality);

  useFrame((_, rawDelta) => {
    const dt = Math.min(rawDelta, 0.05);
    const sway = frame.reducedMotion ? 0.25 : 1;

    // The key light orbits a little with the cursor. Kept deliberately small —
    // the intent is "the room responds to you", not a disco.
    const key = keyRef.current;
    if (key) {
      key.position.x = damp(key.position.x, 2.4 + frame.pointer.x * 1.6 * sway, 3, dt);
      key.position.y = damp(key.position.y, 3.4 + frame.pointer.y * 0.9 * sway, 3, dt);
      key.intensity = damp(key.intensity, 2.1 + frame.pointer.y * 0.25 * sway, 3, dt);
    }

    // The rim light counter-moves, so turning your head around SYN reveals her
    // silhouette from the opposite side.
    const rim = rimRef.current;
    if (rim) {
      rim.position.x = damp(rim.position.x, -2.2 - frame.pointer.x * 1.4 * sway, 3, dt);
      rim.position.z = damp(rim.position.z, -1.8 + frame.pointer.y * 0.8 * sway, 3, dt);
    }
  });

  return (
    <>
      <ambientLight intensity={0.55} color="#6c5b9a" />
      <hemisphereLight args={['#8b6cf5', '#0a0812', 0.5]} />

      <directionalLight
        ref={keyRef}
        position={[2.4, 3.4, 3.2]}
        intensity={2.1}
        color="#efe7ff"
        castShadow={castShadow}
        shadow-mapSize-width={castShadow ? 1024 : 256}
        shadow-mapSize-height={castShadow ? 1024 : 256}
        shadow-camera-near={0.5}
        shadow-camera-far={14}
        shadow-camera-left={-3}
        shadow-camera-right={3}
        shadow-camera-top={4}
        shadow-camera-bottom={-1}
        shadow-bias={-0.0012}
      />

      {/* Brand-purple rim, the signature edge on SYN's silhouette. */}
      <pointLight
        ref={rimRef}
        position={[-2.2, 2.1, -1.8]}
        intensity={9}
        distance={11}
        decay={2}
        color="#7c3aed"
      />

      {/* Cool bounce from below so she never sits in a black void. */}
      <pointLight
        position={[0, -0.6, 1.6]}
        intensity={3.4}
        distance={7}
        decay={2}
        color="#3b1d78"
      />
    </>
  );
}
