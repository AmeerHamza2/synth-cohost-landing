'use client';

/**
 * Section 06 — "Teach your Syn what matters."
 *
 * The idea: show the thing the copy describes actually happening. Documents
 * arrive from off-screen, cross the section, and are absorbed into the upload
 * panel — where they come back out as knowledge.
 *
 *   DOCUMENT   travels in, tumbling
 *   ABSORBED   squeezes flat into the panel
 *   KNOWLEDGE  bursts back out as a spray of glowing nodes
 *
 * This is the one section where the abstraction is the point, and it is the
 * kind of thing flat UI genuinely cannot show. The panel itself is untouched:
 * everything happens around it and into it.

 * No floating cast here: the document flow is the idea, and the section is
 * short enough that anything else lands on the next section's headline.
 */

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Panel } from '../primitives/Panel';
import { useDomQuad, type Quad } from '../primitives/useDomQuad';
import { clamp01, damp, frame, range } from '../stage/frame';
import { densityFor } from '../stage/quality';
import { useQuality } from '../stage/useQuality';
import { hashRandom } from './shared';
import type { SceneProps } from '../stage/SceneSwitch';

/** Lifetime windows, consecutive so the stages hand off cleanly. */
const TRAVEL = [0, 0.62] as const;
const ABSORB = [0.62, 0.8] as const;

/** Documents crossing the section and being taken in by the panel. */
function Documents({
  quad,
  presence,
  count,
}: {
  quad: React.RefObject<Quad>;
  presence: React.RefObject<number>;
  count: number;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const docs = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        phase: i / count,
        lane: (hashRandom(i * 5.3) - 0.5) * 0.8,
        lines: 3 + (i % 3),
        spin: (hashRandom(i * 9.1) - 0.5) * 1.2,
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

    const t = frame.time * (frame.reducedMotion ? 0.03 : 0.1);
    // Enter just outside the panel's left edge, not from across the section:
    // the copy lives out there and documents must never cross it.
    const startX = rect.x - rect.width * 0.72;

    group.children.forEach((child, i) => {
      const doc = docs[i];
      if (!doc) return;
      const u = (t + doc.phase) % 1;

      if (u > ABSORB[1]) {
        child.scale.setScalar(0.0001);
        return;
      }

      const travel = range(u, TRAVEL[0], TRAVEL[1]);
      const absorb = range(u, ABSORB[0], ABSORB[1]);

      child.position.set(
        THREE.MathUtils.lerp(startX, rect.x, travel),
        rect.y + doc.lane * rect.height * (1 - travel * 0.75),
        0.3,
      );
      child.rotation.set(0, doc.spin * (1 - travel), doc.spin * 0.4 * (1 - travel));

      // Fades up on entry, then squeezes flat as the panel takes it in.
      const appear = clamp01(range(u, 0, 0.08));
      const squeeze = 1 - absorb;
      child.scale.set(p * appear * squeeze, p * appear * squeeze, 1);
    });
  });

  return (
    <group ref={groupRef}>
      {docs.map((doc, i) => (
        <group key={i}>
          <Panel
            width={0.2}
            height={0.26}
            radius={0.012}
            lines={doc.lines}
            color="#1a1130"
            emissive="#c4b5fd"
            lineColor="#e9d5ff"
            opacity={0.92}
          />
        </group>
      ))}
    </group>
  );
}

/**
 * Knowledge coming back out: nodes spraying from the panel and dissolving at
 * the end of their arc. One instanced mesh, so the whole spray is a single
 * draw call.
 */
function KnowledgeBurst({
  quad,
  presence,
  count,
}: {
  quad: React.RefObject<Quad>;
  presence: React.RefObject<number>;
  count: number;
}) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const nodes = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        angle: (i / count) * Math.PI * 2 + hashRandom(i * 3.1) * 0.6,
        reach: 0.45 + hashRandom(i * 7.7) * 0.75,
        phase: hashRandom(i * 11.3),
        size: 0.012 + hashRandom(i * 13.9) * 0.016,
      })),
    [count],
  );

  useFrame(() => {
    const mesh = meshRef.current;
    if (!mesh) return;
    const rect = quad.current;
    const p = presence.current ?? 0;
    mesh.visible = p > 0.01 && !!rect?.valid;
    if (!mesh.visible || !rect) return;

    const t = frame.time * (frame.reducedMotion ? 0.05 : 0.16);
    for (let i = 0; i < nodes.length; i++) {
      const n = nodes[i];
      const u = (t + n.phase) % 1;
      const out = range(u, 0, 0.55);
      const fade = Math.min(range(u, 0, 0.1), 1 - range(u, 0.6, 1));
      const r = out * n.reach;

      dummy.position.set(
        rect.x + Math.cos(n.angle) * r * rect.width * 0.5,
        rect.y + Math.sin(n.angle) * r * rect.height * 0.85,
        0.32,
      );
      dummy.scale.setScalar(Math.max(n.size * fade * p, 0.0001));
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    }
    mesh.instanceMatrix.needsUpdate = true;
    (mesh.material as THREE.MeshBasicMaterial).opacity = p * 0.9;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]} frustumCulled={false}>
      <icosahedronGeometry args={[1, 0]} />
      <meshBasicMaterial
        color="#ddd6fe"
        transparent
        opacity={0}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </instancedMesh>
  );
}

export default function KnowledgeScene({ active }: SceneProps) {
  const quality = useQuality();
  const density = densityFor(quality);
  const panel = useDomQuad('[data-anchor="knowledge-panel"]');
  const presence = useRef(0);

  useFrame((_, rawDelta) => {
    presence.current = damp(presence.current, active ? 1 : 0, 4, Math.min(rawDelta, 0.05));
  });

  return (
    <>
      <Documents
        quad={panel}
        presence={presence}
        count={Math.max(3, Math.round(6 * Math.max(density, 0.5)))}
      />
      <KnowledgeBurst
        quad={panel}
        presence={presence}
        count={Math.max(8, Math.round(24 * Math.max(density, 0.4)))}
      />
    </>
  );
}
