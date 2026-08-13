'use client';

/**
 * Section 02 — "Streaming is more demanding than ever."
 *
 * Brief: let the environment tell the story. The five demands the copy names —
 * chat, viewers, content, alerts, stream activity — accumulate around SYN as
 * the reader moves through the block, building visual pressure. Then, as the
 * eye reaches "What if you didn't have to stream alone?", it all settles and
 * she becomes the focal point again.
 *
 * The copy is untouched. This visualises what it already says.
 */

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { clamp01, damp, frame, range } from '../stage/frame';
import { directCamera } from '../stage/camera';
import { directSyn } from '../syn/director';
import { densityFor } from '../stage/quality';
import { useQuality } from '../stage/useQuality';
import { hashRandom, useIsNarrow, useViewportAnchor } from './shared';
import type { SceneProps } from '../stage/SceneSwitch';

/**
 * The five demand streams. Each gets its own silhouette so the cloud reads as
 * *different kinds* of pressure rather than undifferentiated noise.
 */
const KINDS = [
  { id: 'chat', color: '#8b5cf6', share: 0.34, size: 0.055 },
  { id: 'viewers', color: '#c4b5fd', share: 0.24, size: 0.016 },
  { id: 'content', color: '#6d28d9', share: 0.16, size: 0.07 },
  { id: 'alerts', color: '#f472b6', share: 0.12, size: 0.03 },
  { id: 'activity', color: '#a78bfa', share: 0.14, size: 0.038 },
] as const;

interface Item {
  kind: (typeof KINDS)[number];
  /** Where it sits in the swarm, in spherical-ish coordinates. */
  radius: number;
  theta: number;
  phi: number;
  speed: number;
  seed: number;
  /** 0..1 — the accumulation level at which this item appears. */
  threshold: number;
}

function buildItems(count: number): Item[] {
  const items: Item[] = [];
  let index = 0;
  for (const kind of KINDS) {
    const n = Math.max(2, Math.round(count * kind.share));
    for (let i = 0; i < n; i++) {
      const seed = index++;
      items.push({
        kind,
        radius: 0.45 + hashRandom(seed * 1.7) * 0.42,
        theta: hashRandom(seed * 3.3) * Math.PI * 2,
        phi: (hashRandom(seed * 5.1) - 0.5) * 1.5,
        speed: 0.18 + hashRandom(seed * 7.9) * 0.4,
        seed,
        // Staggered so the swarm builds up rather than popping in at once.
        threshold: hashRandom(seed * 11.3) * 0.85,
      });
    }
  }
  return items;
}

/** One instanced mesh per kind keeps the whole swarm at five draw calls. */
function Swarm({
  items,
  kind,
  accumulation,
  settle,
}: {
  items: Item[];
  kind: (typeof KINDS)[number];
  accumulation: React.RefObject<number>;
  settle: React.RefObject<number>;
}) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const own = useMemo(() => items.filter((i) => i.kind.id === kind.id), [items, kind.id]);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame(() => {
    const mesh = meshRef.current;
    if (!mesh) return;

    const build = accumulation.current ?? 0;
    const calm = settle.current ?? 0;
    const t = frame.time * (frame.reducedMotion ? 0.25 : 1);

    for (let i = 0; i < own.length; i++) {
      const item = own[i];

      // Appear once the build passes this item's threshold; on settle they all
      // drift outward and shrink away together.
      const alive = clamp01((build - item.threshold) / 0.18);
      const presence = alive * (1 - calm);

      // Pressure pulls the swarm inward and speeds it up; settling releases it.
      const radius = item.radius * (1.18 - build * 0.34 + calm * 0.9);
      const spin = t * item.speed * (0.6 + build * 1.5);
      const theta = item.theta + spin;
      const phi = item.phi + Math.sin(t * 0.5 + item.seed) * 0.12 * build;

      const wobble = build * (1 - calm) * 0.05;
      dummy.position.set(
        Math.cos(theta) * Math.cos(phi) * radius + Math.sin(t * 5 + item.seed) * wobble,
        1.32 + Math.sin(phi) * radius * 0.72 + Math.cos(t * 4.3 + item.seed) * wobble,
        Math.sin(theta) * Math.cos(phi) * radius * 0.7,
      );

      // Panels face the camera; the small markers just tumble.
      dummy.rotation.set(0, -theta + Math.PI / 2, Math.sin(t + item.seed) * 0.2);

      const scale = presence * kind.size * (1 + build * 0.25);
      dummy.scale.setScalar(Math.max(scale, 0.0001));
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    }
    mesh.instanceMatrix.needsUpdate = true;

    const material = mesh.material as THREE.MeshBasicMaterial;
    material.opacity = Math.max(0, (0.22 + build * 0.3) * (1 - calm));
  });

  return (
    <instancedMesh
      ref={meshRef}
      args={[undefined, undefined, own.length]}
      frustumCulled={false}
    >
      {/* Chat and content read as panels; viewers and alerts as markers. */}
      {kind.id === 'chat' || kind.id === 'content' ? (
        <planeGeometry args={[1.6, 1]} />
      ) : kind.id === 'alerts' ? (
        <tetrahedronGeometry args={[1, 0]} />
      ) : (
        <sphereGeometry args={[1, 8, 6]} />
      )}
      <meshBasicMaterial
        color={kind.color}
        transparent
        opacity={0.5}
        side={THREE.DoubleSide}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </instancedMesh>
  );
}

export default function PressureScene({ active }: SceneProps) {
  const quality = useQuality();
  const anchor = useViewportAnchor();
  const narrow = useIsNarrow();
  const density = densityFor(quality);

  const items = useMemo(
    () => buildItems(Math.max(14, Math.round(56 * density))),
    [density],
  );

  // Continuous values shared with the swarms. Refs, never state — these change
  // every frame and must not re-render anything.
  const accumulation = useRef(0);
  const settle = useRef(0);
  const groupRef = useRef<THREE.Group>(null);
  const pressureLight = useRef<THREE.PointLight>(null);

  useFrame((_, rawDelta) => {
    const dt = Math.min(rawDelta, 0.05);
    const progress = frame.section.pressure;

    // Build through the demands copy, then release as the eye reaches
    // "What if you didn't have to stream alone?" and hands off to section 03.
    //
    // Forced fully settled whenever this section is not the one on stage: the
    // scene stays mounted as a warm neighbour, but a swarm that kept swirling
    // over the next section's copy would be clutter, not storytelling.
    const buildTarget = active ? range(progress, 0.05, 0.58) : 0;
    const settleTarget = active ? range(progress, 0.62, 0.9) : 1;

    accumulation.current = damp(accumulation.current, buildTarget, 3, dt);
    settle.current = damp(settle.current, settleTarget, 2.4, dt);

    const build = accumulation.current;
    const calm = settle.current;

    const light = pressureLight.current;
    if (light) {
      light.intensity = 6 + build * 14 * (1 - calm);
      light.color.setHSL(0.74, 0.7, 0.42 + build * 0.12);
    }

    if (!active) return;

    const { x } = anchor(narrow ? 0 : -0.02, 0, 0);
    const group = groupRef.current;
    if (group) group.position.x = x;

    directSyn('pressure', {
      // She stands well back through this beat. The copy runs in two columns
      // either side of her here, so depth — not brightness — is what keeps her
      // present without competing with the words. She comes forward as it
      // settles, which is the "SYN becomes the focal point" the brief asks for.
      position: [x, 0, -1.55 + calm * 1.15],
      rotation: [0, 0, 0],
      scale: 1,
      // She feels the pressure while it builds, and settles with the copy.
      mood: calm > 0.45 ? 'focused' : build > 0.25 ? 'overwhelmed' : 'idle',
      // Under load she is too busy to follow the cursor; as it settles her
      // attention returns to the reader.
      gazeScale: 0.35 + calm * 0.65,
      speaking: false,
      // Slightly recessed while the noise is at its worst, fully present again
      // once it clears.
      opacity: 0.72 + calm * 0.28,
      lambda: 2.2,
    });

    directCamera('pressure', {
      // Pushes in as the pressure mounts, then eases back out as it resolves —
      // the claustrophobia is in the lens as much as the swarm.
      position: [0, 1.5, 3.4 - build * 0.55 + calm * 0.5],
      target: [x * 0.4, 1.34, 0],
      fov: narrow ? 50 : 38 + build * 3,
      lambda: 1.8,
      parallax: 0.6,
      roll: 0,
    });
  });

  return (
    <group ref={groupRef}>
      {KINDS.map((kind) => (
        <Swarm
          key={kind.id}
          kind={kind}
          items={items}
          accumulation={accumulation}
          settle={settle}
        />
      ))}

      {/* Rises with the swarm so the pressure literally lights the scene. */}
      <pointLight
        ref={pressureLight}
        position={[0, 1.5, 1.2]}
        intensity={6}
        distance={7}
        decay={2}
        color="#7c3aed"
      />
    </group>
  );
}
