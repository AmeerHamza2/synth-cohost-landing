'use client';

/**
 * The SYN cast, floating.
 *
 * These are the client's own characters — cut out of the supplied sheet by
 * `scripts/extract-characters.mjs` — drawn as camera-facing sprites that drift
 * around the section's main avatar. Sprites rather than geometry because the
 * art *is* the character; nothing here is rebuilt or reinterpreted.
 *
 * Each one keeps its own aspect ratio, bobs on its own clock, and turns very
 * slightly with the cursor so the group has parallax against the page.
 */

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { frame } from '../stage/frame';
import { hashRandom } from '../scenes/shared';

export interface FloatingCharactersProps {
  /** Sprite paths, already cut out and transparent. */
  srcs: string[];
  /** Centre of the drift, in scene-local units. */
  center?: [number, number, number];
  /** Inner and outer radius, measured on screen. */
  radius?: [number, number];
  /** Depth spread, in front of and behind the plane. */
  spread?: number;
  /** 0..1 master fade, driven by the owning scene. */
  presence: React.RefObject<number>;
  /**
   * 0..1 agitation. Section 02 ramps this so the cast crowds in as the copy
   * describes mounting pressure, then releases.
   */
  intensity?: React.RefObject<number>;
  /** Height of a sprite in world units, before per-character variation. */
  size?: number;
}

export default function FloatingCharacters({
  srcs,
  center = [0, 0, 0],
  radius = [0.8, 1.35],
  spread = 0.5,
  presence,
  intensity,
  size = 0.34,
}: FloatingCharactersProps) {
  const textures = useTexture(srcs);
  const list = useMemo(
    () => (Array.isArray(textures) ? textures : [textures]),
    [textures],
  );

  const groupRef = useRef<THREE.Group>(null);

  // Stable orbit per character, evenly spaced so the ring never clumps.
  const members = useMemo(
    () =>
      list.map((texture, i) => {
        const image = texture.image as { width: number; height: number } | undefined;
        const aspect = image?.width ? image.width / image.height : 0.75;
        return {
          aspect,
          angle:
            (i / Math.max(list.length, 1)) * Math.PI * 2 +
            (hashRandom(i * 2.7) - 0.5) * 0.4,
          radius: radius[0] + hashRandom(i * 5.1) * (radius[1] - radius[0]),
          depth: (hashRandom(i * 7.3) - 0.5) * spread,
          squash: 0.66 + hashRandom(i * 6.4) * 0.24,
          speed: (0.05 + hashRandom(i * 9.7) * 0.12) * (hashRandom(i * 4.2) > 0.5 ? 1 : -1),
          size: 0.75 + hashRandom(i * 11.9) * 0.5,
          seed: hashRandom(i * 13.1) * Math.PI * 2,
        };
      }),
    [list, radius, spread],
  );

  useFrame(() => {
    const group = groupRef.current;
    if (!group) return;
    const p = presence.current ?? 0;
    group.visible = p > 0.01;
    if (!group.visible) return;

    const hot = intensity?.current ?? 0;
    const t = frame.time * (frame.reducedMotion ? 0.15 : 1);
    const sway = frame.reducedMotion ? 0.2 : 1;

    group.children.forEach((child, i) => {
      const m = members[i];
      if (!m) return;

      const r = m.radius * (1 - hot * 0.2);
      const angle = m.angle + t * m.speed * (1 + hot * 1.4);
      // Each bobs on its own clock, so the group never pulses in unison.
      const bob = Math.sin(t * 0.9 + m.seed) * 0.05 * (1 + hot);

      child.position.set(
        center[0] + Math.cos(angle) * r + frame.pointer.x * 0.06 * sway,
        center[1] + Math.sin(angle) * r * m.squash + bob + frame.pointer.y * 0.04 * sway,
        center[2] + m.depth,
      );
      // Flat art, so they stay square to the camera and only tilt a little.
      child.rotation.z = Math.sin(t * 0.7 + m.seed) * 0.09;

      const s = m.size * size * p;
      child.scale.set(s * m.aspect, s, 1);
    });
  });

  return (
    <group ref={groupRef}>
      {list.map((texture, i) => (
        <mesh key={i}>
          <planeGeometry args={[1, 1]} />
          <meshBasicMaterial
            map={texture}
            transparent
            depthWrite={false}
            toneMapped={false}
            // Slightly back off full opacity so they sit in the page rather
            // than punching out of it.
            opacity={0.96}
          />
        </mesh>
      ))}
    </group>
  );
}
