'use client';

/**
 * The 3D treatment applied around an avatar.
 *
 * Every section shares this: a crowd of miniature characters orbiting the
 * artwork, a drift of motes, and a light that answers the cursor. The avatar
 * itself is the page's own image, untouched behind the canvas — this is what
 * moves around it.
 *
 * Anchoring is in *screen space*: each section says which fraction of the
 * viewport its avatar occupies, and the orbit is placed there. That keeps the
 * crowd centred on the character from an ultrawide monitor down to a phone,
 * without anyone hand-tuning world coordinates per breakpoint.
 */

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import FloatingCharacters from '../primitives/FloatingCharacters';
import { useDisposable } from '../primitives/useDisposable';
import { damp, frame } from '../stage/frame';
import { densityFor } from '../stage/quality';
import { useQuality } from '../stage/useQuality';
import { hashRandom, useViewportAnchor } from './shared';

/** Ambient drift, kept very light — it is texture, not a feature. */
function Motes({ count, presence }: { count: number; presence: React.RefObject<number> }) {
  const pointsRef = useRef<THREE.Points>(null);

  const geometry = useMemo(() => {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (hashRandom(i * 3.1) - 0.5) * 5;
      positions[i * 3 + 1] = (hashRandom(i * 7.7) - 0.5) * 3;
      positions[i * 3 + 2] = (hashRandom(i * 11.3) - 0.5) * 2.4;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    g.userData.base = positions.slice();
    return g;
  }, [count]);

  useDisposable(geometry);

  useFrame(() => {
    const points = pointsRef.current;
    if (!points) return;
    const p = presence.current ?? 0;
    points.visible = p > 0.01;
    if (!points.visible) return;

    const attribute = points.geometry.attributes.position as THREE.BufferAttribute;
    const base = points.geometry.userData.base as Float32Array;
    const t = frame.time * (frame.reducedMotion ? 0.1 : 0.35);
    for (let i = 0; i < count; i++) {
      attribute.array[i * 3] = base[i * 3] + Math.sin(t + i) * 0.08;
      attribute.array[i * 3 + 1] = base[i * 3 + 1] + Math.sin(t * 0.7 + i * 1.7) * 0.11;
    }
    attribute.needsUpdate = true;
    (points.material as THREE.PointsMaterial).opacity = p * 0.5;
  });

  return (
    <points ref={pointsRef} geometry={geometry} frustumCulled={false}>
      <pointsMaterial
        size={0.022}
        sizeAttenuation
        color="#a78bfa"
        transparent
        opacity={0}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

export interface AvatarOrbitProps {
  /** True while this section owns the stage. */
  active: boolean;
  /** Where the avatar sits, as a fraction of the viewport from centre. */
  anchor: [number, number];
  /** Orbit radius range, in world units. */
  radius?: [number, number];
  /** Depth spread of the crowd, in front of and behind the orbit plane. */
  spread?: number;
  /** Which of the SYN cast appear in this section. */
  cast: string[];
  /** Height of a sprite in world units. */
  scale?: number;
  /**
   * 0..1 target agitation, evaluated per frame. Section 02 ramps this to build
   * the pressure the copy describes.
   */
  intensityAt?: () => number;
  /** Include the ambient motes. */
  motes?: boolean;
}

export default function AvatarOrbit({
  active,
  anchor,
  radius = [1.0, 1.45],
  spread = 0.5,
  cast,
  scale = 0.34,
  intensityAt,
  motes = true,
}: AvatarOrbitProps) {
  const quality = useQuality();
  const density = densityFor(quality);
  const viewportAnchor = useViewportAnchor();

  const presence = useRef(0);
  const intensity = useRef(0);
  const groupRef = useRef<THREE.Group>(null);
  const lightRef = useRef<THREE.PointLight>(null);

  const moteCount = Math.max(10, Math.round(45 * density));

  useFrame((_, rawDelta) => {
    const dt = Math.min(rawDelta, 0.05);
    presence.current = damp(presence.current, active ? 1 : 0, 4, dt);
    intensity.current = damp(intensity.current, intensityAt ? intensityAt() : 0, 2.5, dt);

    // Follow the artwork: the anchor is resolved every frame so a resize or an
    // orientation change re-centres the orbit without a remount.
    const group = groupRef.current;
    if (group) {
      const { x, y } = viewportAnchor(anchor[0], anchor[1], 0);
      group.position.set(x, y, 0);
    }

    // A light that tracks the pointer, so moving the cursor visibly changes how
    // the crowd around the avatar is lit.
    const light = lightRef.current;
    if (light) {
      const sway = frame.reducedMotion ? 0.2 : 1;
      light.position.x = damp(light.position.x, frame.pointer.x * 2.2 * sway, 3, dt);
      light.position.y = damp(light.position.y, 1 + frame.pointer.y * 1.2 * sway, 3, dt);
      light.intensity = presence.current * (14 + intensity.current * 10);
    }
  });

  return (
    <group ref={groupRef}>
      <FloatingCharacters
        srcs={cast}
        center={[0, 0, 0]}
        radius={radius}
        spread={spread}
        presence={presence}
        intensity={intensity}
        size={scale}
      />
      {motes && <Motes count={moteCount} presence={presence} />}
      <pointLight
        ref={lightRef}
        position={[0, 1, 1.6]}
        intensity={0}
        distance={9}
        decay={2}
        color="#b58af7"
      />
    </group>
  );
}
