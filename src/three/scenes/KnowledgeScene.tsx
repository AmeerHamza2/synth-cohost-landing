'use client';

/**
 * Section 06 — "Teach your Syn what matters."
 *
 * Brief: visualise something abstract. Documents enter, get processed, become
 * connected knowledge nodes, that knowledge becomes part of SYN's memory, and
 * memory produces a response:
 *
 *   DOCUMENT → KNOWLEDGE → MEMORY → RESPONSE
 *
 * The whole pipeline runs as one continuous loop with several documents in
 * flight at different phases, so the reader sees every stage at once instead of
 * having to wait for a cycle. Each document carries a single normalised
 * lifetime `u` in 0..1 and every stage is a window on that value — which is why
 * there is no per-document state and no allocation per frame.
 */

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Panel } from '../primitives/Panel';
import { clamp01, damp, frame, range } from '../stage/frame';
import { directCamera } from '../stage/camera';
import { directSyn } from '../syn/director';
import { useQuality } from '../stage/useQuality';
import { densityFor } from '../stage/quality';
import { fibonacciSphere, hashRandom, useIsNarrow, useViewportAnchor } from './shared';
import { useDisposable } from '../primitives/useDisposable';
import type { SceneProps } from '../stage/SceneSwitch';

/** Where each stage of the pipeline happens, in scene-local space. */
const INTAKE = new THREE.Vector3(-1.75, 1.55, 0.4);
const PROCESSOR = new THREE.Vector3(-0.75, 1.5, 0.15);
const MEMORY = new THREE.Vector3(0, 1.46, 0);

/** Lifetime windows. Consecutive, so the stages hand off cleanly. */
const ARRIVE = [0, 0.24] as const; // DOCUMENT: flying in
const PROCESS = [0.24, 0.44] as const; // being read
const KNOW = [0.44, 0.68] as const; // becoming a knowledge node
const REMEMBER = [0.68, 0.86] as const; // absorbed into memory
const RESPOND = [0.86, 1] as const; // emitted as an answer

/** Documents arriving and being read. */
function Documents({
  count,
  onStage,
  cycle,
}: {
  count: number;
  onStage: React.RefObject<number>;
  cycle: React.RefObject<number>;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const docs = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        phase: i / count,
        lane: (hashRandom(i * 5.3) - 0.5) * 0.7,
        depth: (hashRandom(i * 9.1) - 0.5) * 0.5,
        lines: 3 + (i % 3),
      })),
    [count],
  );

  useFrame(() => {
    const group = groupRef.current;
    if (!group) return;
    const p = onStage.current ?? 0;
    group.visible = p > 0.01;
    if (!group.visible) return;

    const clock = cycle.current ?? 0;

    group.children.forEach((child, i) => {
      const doc = docs[i];
      if (!doc) return;
      const u = (clock + doc.phase) % 1;

      // A document only exists visually until it dissolves into knowledge.
      const arriving = range(u, ARRIVE[0], ARRIVE[1]);
      const processing = range(u, PROCESS[0], PROCESS[1]);
      const gone = u > PROCESS[1];

      if (gone) {
        child.scale.setScalar(0.0001);
        return;
      }

      // Travel intake → processor, then compress into the processor.
      const t = arriving;
      child.position.set(
        THREE.MathUtils.lerp(INTAKE.x, PROCESSOR.x, t),
        THREE.MathUtils.lerp(INTAKE.y + doc.lane, PROCESSOR.y, t),
        THREE.MathUtils.lerp(INTAKE.z + doc.depth, PROCESSOR.z, t),
      );
      child.rotation.set(0, 0.5 - t * 0.5, (1 - t) * 0.3);

      // Fades up on entry, then squeezes flat as it is read.
      const appear = Math.min(range(u, 0, 0.06), 1);
      const squeeze = 1 - processing;
      child.scale.set(p * appear * squeeze, p * appear * squeeze, p * appear);
    });
  });

  return (
    <group ref={groupRef}>
      {docs.map((doc, i) => (
        <group key={i}>
          <Panel
            width={0.22}
            height={0.28}
            radius={0.012}
            lines={doc.lines}
            color="#1a1130"
            emissive="#c4b5fd"
            lineColor="#e9d5ff"
            opacity={0.9}
          />
        </group>
      ))}
    </group>
  );
}

/**
 * The knowledge graph: nodes condensing out of the processor, linking to each
 * other, then collapsing into her.
 */
function KnowledgeGraph({
  count,
  onStage,
  cycle,
}: {
  count: number;
  onStage: React.RefObject<number>;
  cycle: React.RefObject<number>;
}) {
  const nodesRef = useRef<THREE.InstancedMesh>(null);
  const linksRef = useRef<THREE.LineSegments>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const shell = useMemo(() => fibonacciSphere(count, 0.46), [count]);
  const scratch = useMemo(() => new THREE.Vector3(), []);

  // Links connect each node to the next two, giving a web rather than a chain.
  const linkGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute(
      'position',
      new THREE.BufferAttribute(new Float32Array(count * 2 * 2 * 3), 3),
    );
    return geometry;
  }, [count]);

  useDisposable(linkGeometry);

  const positions = useMemo(
    () => Array.from({ length: count }, () => new THREE.Vector3()),
    [count],
  );

  useFrame(() => {
    const nodes = nodesRef.current;
    const links = linksRef.current;
    if (!nodes || !links) return;

    const p = onStage.current ?? 0;
    nodes.visible = p > 0.01;
    links.visible = nodes.visible;
    if (!nodes.visible) return;

    const clock = cycle.current ?? 0;
    const t = frame.time * (frame.reducedMotion ? 0.08 : 0.3);
    const linkArray = links.geometry.attributes.position.array as Float32Array;
    let cursor = 0;

    for (let i = 0; i < count; i++) {
      // Each node rides the same lifetime, offset around the loop.
      const u = (clock + i / count) % 1;
      const forming = range(u, KNOW[0], KNOW[1]);
      const absorbing = range(u, REMEMBER[0], REMEMBER[1]);

      const [sx, sy, sz] = shell[i];
      // Condense from the processor onto the shell, then collapse into memory.
      const spin = t + i * 0.4;
      const shellPos = scratch.set(
        Math.cos(spin) * sx - Math.sin(spin) * sz,
        sy,
        Math.sin(spin) * sx + Math.cos(spin) * sz,
      );

      const target = positions[i];
      target
        .copy(PROCESSOR)
        .lerp(
          scratch.set(
            MEMORY.x + shellPos.x,
            MEMORY.y + shellPos.y,
            MEMORY.z + shellPos.z,
          ),
          forming,
        )
        .lerp(MEMORY, absorbing);

      dummy.position.copy(target);
      const alive = Math.min(forming, 1 - absorbing);
      dummy.scale.setScalar(Math.max(p * alive * 0.026, 0.0001));
      dummy.updateMatrix();
      nodes.setMatrixAt(i, dummy.matrix);

      // Two links per node, only while the web is actually formed.
      const strength = alive;
      for (let k = 1; k <= 2; k++) {
        const other = positions[(i + k) % count];
        const on = strength > 0.35 ? 1 : 0;
        linkArray[cursor++] = target.x;
        linkArray[cursor++] = target.y;
        linkArray[cursor++] = target.z;
        linkArray[cursor++] = on ? other.x : target.x;
        linkArray[cursor++] = on ? other.y : target.y;
        linkArray[cursor++] = on ? other.z : target.z;
      }
    }

    nodes.instanceMatrix.needsUpdate = true;
    links.geometry.attributes.position.needsUpdate = true;
    (links.material as THREE.LineBasicMaterial).opacity = p * 0.22;
  });

  return (
    <group>
      <instancedMesh
        ref={nodesRef}
        args={[undefined, undefined, count]}
        frustumCulled={false}
      >
        <icosahedronGeometry args={[1, 0]} />
        <meshBasicMaterial
          color="#c4b5fd"
          transparent
          opacity={0.95}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </instancedMesh>
      <lineSegments ref={linksRef} geometry={linkGeometry} frustumCulled={false}>
        <lineBasicMaterial
          color="#8b5cf6"
          transparent
          opacity={0.2}
          depthWrite={false}
        />
      </lineSegments>
    </group>
  );
}

/** The answer: a pulse leaving her and travelling out to the reader. */
function Responses({
  count,
  onStage,
  cycle,
}: {
  count: number;
  onStage: React.RefObject<number>;
  cycle: React.RefObject<number>;
}) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame(() => {
    const mesh = meshRef.current;
    if (!mesh) return;
    const p = onStage.current ?? 0;
    mesh.visible = p > 0.01;
    if (!mesh.visible) return;

    const clock = cycle.current ?? 0;
    for (let i = 0; i < count; i++) {
      const u = (clock + i / count) % 1;
      const emit = range(u, RESPOND[0], RESPOND[1]);
      if (emit <= 0 || emit >= 1) {
        dummy.scale.setScalar(0.0001);
      } else {
        const arc = emit;
        dummy.position.set(
          MEMORY.x + arc * 1.5,
          MEMORY.y + Math.sin(arc * Math.PI) * 0.22,
          MEMORY.z + arc * 0.5,
        );
        const fade = Math.sin(arc * Math.PI);
        dummy.scale.set(0.3 * fade * p, 0.1 * fade * p, 1);
      }
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    }
    mesh.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]} frustumCulled={false}>
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial
        color="#e9d5ff"
        transparent
        opacity={0.8}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </instancedMesh>
  );
}

export default function KnowledgeScene({ active }: SceneProps) {
  const quality = useQuality();
  const anchor = useViewportAnchor();
  const narrow = useIsNarrow();
  const density = densityFor(quality);

  const onStage = useRef(0);
  const cycle = useRef(0);
  const groupRef = useRef<THREE.Group>(null);
  const processorRef = useRef<THREE.Mesh>(null);

  const nodeCount = Math.max(8, Math.round(26 * density));
  const docCount = Math.max(3, Math.round(6 * Math.max(density, 0.5)));

  useFrame((_, rawDelta) => {
    const dt = Math.min(rawDelta, 0.05);
    const progress = frame.section.knowledge;

    onStage.current = damp(onStage.current, active ? 1 : 0, 6, dt);
    // One shared clock drives every stage of the pipeline.
    cycle.current = (cycle.current + dt * (frame.reducedMotion ? 0.03 : 0.09)) % 1;

    const processor = processorRef.current;
    if (processor) {
      const pulse = 1 + Math.sin(frame.time * 4) * 0.08;
      processor.scale.setScalar(onStage.current * 0.09 * pulse);
      (processor.material as THREE.MeshBasicMaterial).opacity = onStage.current * 0.55;
    }

    if (!active) return;

    const { x } = anchor(narrow ? 0 : -0.3, 0, 0);
    const group = groupRef.current;
    if (group) group.position.x = x;

    directSyn('knowledge', {
      // Set back: this section is about the process, and she is where it
      // arrives rather than the subject of the frame.
      position: [x + MEMORY.x, 0, -1.1],
      rotation: [0, -0.1, 0],
      scale: 1,
      mood: 'thinking',
      gazeScale: 0.45,
      // She answers at the end of each cycle.
      speaking: clamp01(range((cycle.current + 0.0) % 1, RESPOND[0], RESPOND[1])) > 0.1,
      bodyYaw: 0,
      opacity: 1,
      lambda: 2.2,
    });

    directCamera('knowledge', {
      position: [0, 1.55, 3.5 - progress * 0.25],
      target: [x * 0.15, 1.44, 0],
      fov: narrow ? 52 : 42,
      lambda: 1.8,
      parallax: 0.6,
      roll: 0,
    });
  });

  return (
    <group ref={groupRef}>
      <Documents count={docCount} onStage={onStage} cycle={cycle} />
      <KnowledgeGraph count={nodeCount} onStage={onStage} cycle={cycle} />
      <Responses count={3} onStage={onStage} cycle={cycle} />

      {/* The processor: where a document stops being a file and starts being
          knowledge. */}
      <mesh ref={processorRef} position={PROCESSOR}>
        <icosahedronGeometry args={[1, 1]} />
        <meshBasicMaterial
          color="#a855f7"
          transparent
          opacity={0}
          wireframe
          depthWrite={false}
        />
      </mesh>

      <pointLight position={[PROCESSOR.x, PROCESSOR.y, PROCESSOR.z + 0.4]} intensity={5} distance={3} decay={2} color="#a855f7" />
    </group>
  );
}
