'use client';

/**
 * Section 05 — "See Syns in action where it matters."
 *
 * The idea: the stream is not a screenshot, it is a broadcast with an audience.
 *
 *   - The player throws light into the room, pulsing as though the stream is
 *     cutting between shots.
 *   - Chat messages lift out of the live-chat panel and drift up past the
 *     player, so the conversation visibly leaves the box it is printed in.
 *   - The SYN cast gathers on the open side of the layout, facing the stream —
 *     an audience watching it, rather than decoration in the margin.
 *
 * Everything is anchored to the real dashboard elements, so it stays attached
 * as the section scrolls and reflows, and nothing is drawn over the copy.

 * No floating cast here: this section is dense on both sides, and the screen
 * glow and rising chat already carry it. The cast appears where there is room
 * for it — sections 02, 04 and the finale.
 */

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Panel } from '../primitives/Panel';
import { useDomQuad, type Quad } from '../primitives/useDomQuad';
import { damp, frame, range } from '../stage/frame';
import { densityFor } from '../stage/quality';
import { useQuality } from '../stage/useQuality';
import type { SceneProps } from '../stage/SceneSwitch';

/** Light spilling off the player, pulsing as though the stream is cutting. */
function ScreenGlow({
  quad,
  presence,
}: {
  quad: React.RefObject<Quad>;
  presence: React.RefObject<number>;
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    const mesh = meshRef.current;
    if (!mesh) return;
    const rect = quad.current;
    const p = presence.current ?? 0;
    mesh.visible = p > 0.01 && !!rect?.valid;
    if (!mesh.visible || !rect) return;

    mesh.position.set(rect.x, rect.y, -0.35);
    // Generously larger than the player: this is spill, not a border.
    mesh.scale.set(rect.width * 1.9, rect.height * 2.2, 1);

    const t = frame.time;
    // Two detuned pulses read as content changing rather than a sine wave.
    const pulse = 0.55 + Math.sin(t * 1.7) * 0.2 + Math.sin(t * 0.63) * 0.25;
    (mesh.material as THREE.MeshBasicMaterial).opacity =
      p * (frame.reducedMotion ? 0.22 : 0.18 + pulse * 0.2);
  });

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial
        color="#8b5cf6"
        transparent
        opacity={0}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}

/** Messages lifting out of the chat panel and drifting away above it. */
function RisingChat({
  quad,
  presence,
  count,
}: {
  quad: React.RefObject<Quad>;
  presence: React.RefObject<number>;
  count: number;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const bubbles = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        phase: i / count,
        lane: ((i * 37) % 100) / 100 - 0.5,
        width: 0.26 + ((i * 53) % 40) / 200,
        // Every third is SYN answering, so it reads as a dialogue.
        isSyn: i % 3 === 2,
      })),
    [count],
  );

  useFrame(() => {
    const group = groupRef.current;
    if (!group) return;
    const rect = quad.current;
    const p = presence.current ?? 0;
    group.visible = p > 0.01 && !!rect?.valid;
    if (!group.visible || !rect) return;

    const t = frame.time * (frame.reducedMotion ? 0.05 : 0.16);
    group.children.forEach((child, i) => {
      const b = bubbles[i];
      if (!b) return;
      // Rise out of the panel and continue up past the player.
      const u = (t + b.phase) % 1;
      child.position.set(
        rect.x + b.lane * rect.width * 0.72,
        rect.y + rect.height * 0.35 + u * rect.height * 3.4,
        0.25,
      );
      // Fade in as it leaves the panel, out as it clears the player.
      const fade = Math.min(range(u, 0, 0.14), 1 - range(u, 0.55, 1));
      child.scale.setScalar(p * fade);
    });
  });

  return (
    <group ref={groupRef}>
      {bubbles.map((b, i) => (
        <group key={i}>
          <Panel
            width={b.width}
            height={0.085}
            radius={0.03}
            lines={1}
            color={b.isSyn ? '#2a1250' : '#150f28'}
            emissive={b.isSyn ? '#b58af7' : '#7c3aed'}
            lineColor={b.isSyn ? '#e9d5ff' : '#8b5cf6'}
          />
        </group>
      ))}
    </group>
  );
}

export default function StudioScene({ active }: SceneProps) {
  const quality = useQuality();
  const density = densityFor(quality);
  const player = useDomQuad('[data-anchor="stream-player"]');
  const chat = useDomQuad('[data-anchor="stream-chat"]');
  const presence = useRef(0);

  useFrame((_, rawDelta) => {
    presence.current = damp(presence.current, active ? 1 : 0, 4, Math.min(rawDelta, 0.05));
  });

  return (
    <>
      <ScreenGlow quad={player} presence={presence} />
      <RisingChat
        quad={chat}
        presence={presence}
        count={Math.max(3, Math.round(7 * Math.max(density, 0.5)))}
      />
    </>
  );
}
