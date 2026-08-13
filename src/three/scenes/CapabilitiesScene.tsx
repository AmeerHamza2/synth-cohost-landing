'use client';

/**
 * Section 03 — "MEET YOUR SYN".
 *
 * Brief: SYN stands in the centre with the existing capabilities presented
 * around her as interactive elements. Interacting with one brings it to life:
 *
 *   Responds to chat      → a chat interface appears and SYN responds
 *   Understands context   → contextual information gathers around her
 *   Supports your workflow→ stream controls and interface elements appear
 *
 * The three cards stay exactly where they are in the DOM; hovering or focusing
 * one publishes `capability` to the stage store and this scene answers. Driving
 * it from the existing HTML rather than from 3D hit-testing keeps the whole
 * interaction keyboard-accessible for free.
 */

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Panel, Ring } from '../primitives/Panel';
import { clamp01, damp, frame, range } from '../stage/frame';
import { directCamera } from '../stage/camera';
import { directSyn } from '../syn/director';
import { densityFor } from '../stage/quality';
import { useStage } from '../stage/store';
import { useQuality } from '../stage/useQuality';
import { fibonacciSphere, useIsNarrow, useViewportAnchor } from './shared';
import type { CapabilityId } from '../stage/types';
import type { SceneProps } from '../stage/SceneSwitch';

/** Smoothed 0..1 presence per capability, updated in `useFrame`. */
type Presence = Record<CapabilityId, number>;

/**
 * "Responds to chat" — messages rise past her on the right and she answers,
 * turning toward them as they arrive.
 */
function ChatCluster({ presence }: { presence: React.RefObject<Presence> }) {
  const groupRef = useRef<THREE.Group>(null);
  const messages = useMemo(
    () =>
      Array.from({ length: 6 }, (_, i) => ({
        y: i * 0.26,
        x: (i % 2 === 0 ? 0.06 : -0.06) + 0.02,
        width: 0.34 + (i % 3) * 0.06,
        /** Every third message is SYN answering, so it reads as a dialogue. */
        isSyn: i % 3 === 2,
        seed: i * 1.7,
      })),
    [],
  );

  useFrame(() => {
    const group = groupRef.current;
    if (!group) return;
    const p = presence.current?.chat ?? 0;
    group.visible = p > 0.01;
    if (!group.visible) return;

    const t = frame.time * (frame.reducedMotion ? 0.2 : 0.55);
    group.children.forEach((child, i) => {
      const message = messages[i];
      if (!message) return;
      // Continuous upward drift with wrap-around: a live chat, not a static list.
      const cycle = (t + message.seed * 0.42) % 1;
      const y = 0.82 + cycle * 1.5;
      child.position.set(message.x, y, 0);
      // Fade in at the bottom, out at the top.
      const fade = Math.min(range(cycle, 0, 0.12), 1 - range(cycle, 0.78, 1));
      child.scale.setScalar(p * (0.85 + fade * 0.15));
      (child as THREE.Group).traverse((node) => {
        const mesh = node as THREE.Mesh;
        const material = mesh.material as THREE.Material | undefined;
        if (material && 'opacity' in material) {
          (material as THREE.MeshBasicMaterial).opacity = fade * p * 0.85;
        }
      });
    });
  });

  return (
    <group ref={groupRef} position={[0.72, 0, 0.1]}>
      {messages.map((message, i) => (
        <group key={i}>
          <Panel
            width={message.width}
            height={0.11}
            radius={0.035}
            lines={1}
            color={message.isSyn ? '#2a1250' : '#150f28'}
            emissive={message.isSyn ? '#b58af7' : '#7c3aed'}
            lineColor={message.isSyn ? '#e9d5ff' : '#8b5cf6'}
          />
        </group>
      ))}
    </group>
  );
}

/**
 * "Understands context" — a shell of context nodes forms around her head and
 * links itself together, i.e. she is holding the thread of the stream.
 */
function ContextCluster({
  presence,
  count,
}: {
  presence: React.RefObject<Presence>;
  count: number;
}) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const ringRef = useRef<THREE.Group>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const nodes = useMemo(() => fibonacciSphere(count, 0.55), [count]);

  useFrame(() => {
    const mesh = meshRef.current;
    if (!mesh) return;
    const p = presence.current?.context ?? 0;
    mesh.visible = p > 0.01;

    const ring = ringRef.current;
    if (ring) {
      ring.visible = p > 0.01;
      ring.rotation.y = frame.time * 0.25;
      ring.rotation.x = Math.PI / 2.1 + Math.sin(frame.time * 0.4) * 0.05;
      ring.scale.setScalar(p);
    }
    if (!mesh.visible) return;

    const t = frame.time * (frame.reducedMotion ? 0.15 : 0.5);
    for (let i = 0; i < nodes.length; i++) {
      const [x, y, z] = nodes[i];
      // Nodes settle inward as the capability engages.
      const expand = 1.35 - p * 0.35;
      const breathe = 1 + Math.sin(t + i * 0.7) * 0.04;
      dummy.position.set(x * expand * breathe, 1.42 + y * expand * breathe, z * expand * breathe);
      dummy.scale.setScalar(p * 0.02 * (0.7 + ((i * 13) % 7) / 10));
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    }
    mesh.instanceMatrix.needsUpdate = true;
    (mesh.material as THREE.MeshBasicMaterial).opacity = p * 0.9;
  });

  return (
    <group>
      <instancedMesh
        ref={meshRef}
        args={[undefined, undefined, nodes.length]}
        frustumCulled={false}
      >
        <octahedronGeometry args={[1, 0]} />
        <meshBasicMaterial
          color="#c4b5fd"
          transparent
          opacity={0}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </instancedMesh>
      <group ref={ringRef} position={[0, 1.42, 0]}>
        <Ring radius={0.5} thickness={0.003} color="#8b5cf6" opacity={0.4} />
      </group>
    </group>
  );
}

/**
 * "Supports your workflow" — the control surface of a stream assembles beside
 * her: a deck of scene tiles and a run-of-show strip.
 */
function WorkflowCluster({ presence }: { presence: React.RefObject<Presence> }) {
  const groupRef = useRef<THREE.Group>(null);
  const tiles = useMemo(
    () =>
      Array.from({ length: 6 }, (_, i) => ({
        x: (i % 3) * 0.19 - 0.19,
        y: Math.floor(i / 3) * -0.14,
        seed: i * 2.3,
      })),
    [],
  );

  useFrame(() => {
    const group = groupRef.current;
    if (!group) return;
    const p = presence.current?.workflow ?? 0;
    group.visible = p > 0.01;
    if (!group.visible) return;

    const t = frame.time;
    group.scale.setScalar(p);
    group.children.forEach((child, i) => {
      const tile = tiles[i];
      if (!tile) return;
      // Tiles assemble from below with a stagger, then idle-float.
      const settle = clamp01((p - i * 0.06) / 0.5);
      child.position.set(
        tile.x,
        1.62 + tile.y - (1 - settle) * 0.22,
        Math.sin(t * 0.6 + tile.seed) * 0.015,
      );
      child.scale.setScalar(settle);
    });
  });

  return (
    <group ref={groupRef} position={[-0.78, 0, 0.12]} rotation={[0, 0.42, 0]}>
      {tiles.map((_, i) => (
        <group key={i}>
          <Panel
            width={0.16}
            height={0.1}
            radius={0.014}
            lines={i === 5 ? 2 : 0}
            color="#180f2e"
            emissive={i === 0 ? '#f472b6' : '#7c3aed'}
          />
        </group>
      ))}
    </group>
  );
}

const CAPABILITIES: CapabilityId[] = ['chat', 'context', 'workflow'];

export default function CapabilitiesScene({ active }: SceneProps) {
  const quality = useQuality();
  const capability = useStage((s) => s.capability);
  const anchor = useViewportAnchor();
  const narrow = useIsNarrow();
  const density = densityFor(quality);
  const groupRef = useRef<THREE.Group>(null);

  const presence = useRef<Presence>({ chat: 0, context: 0, workflow: 0 });
  // Fades the whole cluster set out while this section is only a warm
  // neighbour, so its elements never drift over the previous section's copy.
  const onStage = useRef(0);
  const floorRef = useRef<THREE.Mesh>(null);
  const nodeCount = Math.max(10, Math.round(34 * density));

  useFrame((_, rawDelta) => {
    const dt = Math.min(rawDelta, 0.05);
    const progress = frame.section.capabilities;

    onStage.current = damp(onStage.current, active ? 1 : 0, 6, dt);

    const floor = floorRef.current;
    if (floor) {
      (floor.material as THREE.MeshBasicMaterial).opacity = onStage.current * 0.12;
    }

    // Before anything is hovered, the section cycles slowly through the three
    // capabilities on its own, so the interaction is discoverable rather than
    // hidden behind a hover the reader may never try.
    const auto = !capability && progress > 0.15;
    const autoIndex = auto
      ? Math.floor(frame.time / 3.4) % CAPABILITIES.length
      : -1;
    const shown = capability ?? (autoIndex >= 0 ? CAPABILITIES[autoIndex] : null);

    for (const id of CAPABILITIES) {
      const target = (shown === id ? 1 : 0) * onStage.current;
      presence.current[id] = damp(presence.current[id], target, 3.6, dt);
    }

    if (!active) return;

    // She holds the left of the frame; the existing copy sits to the right of
    // centre in this block, exactly as the original plate had it.
    const { x } = anchor(narrow ? -0.16 : -0.31, 0, 0);
    const group = groupRef.current;
    if (group) group.position.x = x;

    const chatting = presence.current.chat;

    directSyn('capabilities', {
      position: [x, 0, 0],
      rotation: [0, chatting * 0.26, 0],
      scale: 1,
      mood: presence.current.context > 0.5 ? 'thinking' : 'focused',
      gazeScale: 0.7,
      // She answers the chat rather than the copy claiming she does.
      speaking: chatting > 0.55,
      bodyYaw: chatting * 0.16,
      opacity: 1,
      lambda: 2.4,
    });

    directCamera('capabilities', {
      position: [0, 1.52, 2.9 - progress * 0.25],
      // Only a fraction of her offset, or the pan cancels the composition
      // and puts her back over the copy.
      target: [x * 0.12, 1.42, 0],
      fov: narrow ? 50 : 40,
      lambda: 1.9,
      parallax: 0.8,
      roll: 0,
    });
  });

  return (
    <group ref={groupRef}>
      <ChatCluster presence={presence} />
      <ContextCluster presence={presence} count={nodeCount} />
      <WorkflowCluster presence={presence} />

      {/* Floor pool so she is grounded in this darker room too. */}
      <mesh ref={floorRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.002, 0]}>
        <circleGeometry args={[1.4, 36]} />
        <meshBasicMaterial
          color="#7c3aed"
          transparent
          opacity={0}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}
