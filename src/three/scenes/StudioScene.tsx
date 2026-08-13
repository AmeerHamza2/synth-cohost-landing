'use client';

/**
 * Section 05 — "See Syns in action where it matters."
 *
 * Brief: turn the streaming section into an actual 3D studio. The existing
 * stream UI — viewer count, live chat, Syn activity, upcoming segment — stays
 * in the DOM where it is readable and accessible; what this adds is the room it
 * all sits in, with SYN inside rather than beside it.
 *
 * The part that makes the capability feel *demonstrated* rather than advertised
 * is the chat reaction: when a message lands, she turns toward the side it came
 * from and answers.
 *
 * The cue is emitted here, on a cadence, while this section owns the stage.
 * `LivestreamShowcase` also emits one when a chat row is hovered, but it cannot
 * be the only source: its rows animate in on `useInView` as the section
 * *enters* the viewport, which is strictly before the section becomes active,
 * so every one of those cues would arrive while the scene is still a warm
 * neighbour and be dropped.
 */

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Panel } from '../primitives/Panel';
import { damp, frame } from '../stage/frame';
import { directCamera } from '../stage/camera';
import { directSyn } from '../syn/director';
import { readStage } from '../stage/store';
import { pushChatCue } from '../bindings';
import { useQuality } from '../stage/useQuality';
import { densityFor, shadowsFor } from '../stage/quality';
import { hashRandom, useIsNarrow, useViewportAnchor } from './shared';
import type { SceneProps } from '../stage/SceneSwitch';

/** The set: floor, back wall, and a rig of panels behind her. */
function StudioSet({ onStage }: { onStage: React.RefObject<number> }) {
  const wallRef = useRef<THREE.Group>(null);
  const floorRef = useRef<THREE.Mesh>(null);

  const slats = useMemo(
    () =>
      Array.from({ length: 9 }, (_, i) => ({
        x: (i - 4) * 0.42,
        height: 0.5 + hashRandom(i * 3.7) * 1.5,
        seed: i * 1.9,
      })),
    [],
  );

  useFrame(() => {
    const wall = wallRef.current;
    if (!wall) return;
    const p = onStage.current ?? 0;

    // The floor is opaque, so it has to leave with the rest of the set —
    // otherwise a dark disc from this section drifts under the neighbours.
    const floor = floorRef.current;
    if (floor) {
      floor.visible = p > 0.01;
      const material = floor.material as THREE.MeshStandardMaterial;
      material.transparent = true;
      material.opacity = p;
    }

    wall.visible = p > 0.01;
    if (!wall.visible) return;

    const t = frame.time * (frame.reducedMotion ? 0.1 : 0.6);
    wall.children.forEach((child, i) => {
      const slat = slats[i];
      if (!slat) return;
      const mesh = child as THREE.Mesh;
      const material = mesh.material as THREE.MeshBasicMaterial;
      // Slow, offset pulse — a lit backdrop breathing behind the set.
      material.opacity = p * (0.1 + (Math.sin(t + slat.seed) * 0.5 + 0.5) * 0.22);
    });
  });

  return (
    <group>
      {/* Studio floor. Dark and slightly reflective-looking via a soft pool. */}
      <mesh ref={floorRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <circleGeometry args={[3.4, 48]} />
        <meshStandardMaterial
          color="#0a0714"
          roughness={0.55}
          metalness={0.35}
        />
      </mesh>

      {/* Back wall of vertical light slats. */}
      <group ref={wallRef} position={[0, 0, -1.9]}>
        {slats.map((slat, i) => (
          <mesh key={i} position={[slat.x, slat.height / 2 + 0.15, 0]}>
            <planeGeometry args={[0.13, slat.height]} />
            <meshBasicMaterial
              color={i % 3 === 0 ? '#a855f7' : '#4c1d95'}
              transparent
              opacity={0}
              depthWrite={false}
            />
          </mesh>
        ))}
      </group>
    </group>
  );
}

/**
 * The stream UI, staged in depth around her. These are the same four surfaces
 * the DOM lists — viewers, chat, activity, next segment — given a position in
 * the room so the reader can see her standing *inside* the broadcast.
 */
function StreamUI({
  onStage,
  chatPulse,
}: {
  onStage: React.RefObject<number>;
  chatPulse: React.RefObject<number>;
}) {
  const groupRef = useRef<THREE.Group>(null);

  const surfaces = useMemo(
    () => [
      // [x, y, z, yaw, w, h, lines]
      { p: [-1.16, 1.62, -0.35], yaw: 0.5, w: 0.5, h: 0.34, lines: 4, accent: '#7c3aed' },
      { p: [1.18, 1.5, -0.3], yaw: -0.5, w: 0.46, h: 0.56, lines: 6, accent: '#a855f7' },
      { p: [-1.05, 0.95, 0.35], yaw: 0.62, w: 0.4, h: 0.22, lines: 3, accent: '#f472b6' },
      { p: [1.02, 0.92, 0.4], yaw: -0.62, w: 0.38, h: 0.2, lines: 2, accent: '#22d3ee' },
    ],
    [],
  );

  useFrame(() => {
    const group = groupRef.current;
    if (!group) return;
    const p = onStage.current ?? 0;
    group.visible = p > 0.01;
    if (!group.visible) return;

    const t = frame.time;
    group.children.forEach((child, i) => {
      const surface = surfaces[i];
      if (!surface) return;
      const [x, y, z] = surface.p;
      // Assemble outward from her as the section takes the stage.
      child.position.set(x * (0.55 + p * 0.45), y + Math.sin(t * 0.5 + i) * 0.012, z);
      child.scale.setScalar(p);
    });

    // The chat surface brightens as a message lands.
    const chat = group.children[1] as THREE.Group | undefined;
    if (chat) {
      const pulse = 1 + (chatPulse.current ?? 0) * 0.06;
      chat.scale.setScalar(p * pulse);
    }
  });

  return (
    <group ref={groupRef}>
      {surfaces.map((surface, i) => (
        <group key={i} rotation={[0, surface.yaw, 0]}>
          <Panel
            width={surface.w}
            height={surface.h}
            radius={0.02}
            lines={surface.lines}
            color="#120c22"
            emissive={surface.accent}
            opacity={0.78}
          />
        </group>
      ))}
    </group>
  );
}

/**
 * Messages flying in from the side a cue came from. This is the visible half of
 * "she reacts to chat" — the other half is the head turn in `useSynRig`.
 */
function ChatBurst({
  count,
  onStage,
}: {
  count: number;
  onStage: React.RefObject<number>;
}) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const state = useRef({ token: 0, age: 99, side: 1 as -1 | 1 });

  useFrame((_, rawDelta) => {
    const mesh = meshRef.current;
    if (!mesh) return;

    // Only while this section owns the stage. `LivestreamShowcase` pushes a cue
    // as each chat row animates in, which happens as soon as the section enters
    // the viewport — without this gate the burst plays over whichever section is
    // actually on screen.
    const p = onStage.current ?? 0;
    if (p < 0.01) {
      mesh.visible = false;
      return;
    }

    // Read the cue non-reactively: a burst must not re-render the tree.
    const cue = readStage().chatCue;
    if (cue && cue.token !== state.current.token) {
      state.current.token = cue.token;
      state.current.side = cue.side;
      state.current.age = 0;
    }

    state.current.age += Math.min(rawDelta, 0.05);

    const age = state.current.age;
    const side = state.current.side;
    const alive = age < 2.4;
    mesh.visible = alive;
    if (!alive) return;

    for (let i = 0; i < count; i++) {
      const offset = i * 0.13;
      const local = age - offset;
      if (local < 0 || local > 1.6) {
        dummy.scale.setScalar(0.0001);
      } else {
        const travel = local / 1.6;
        // Arc in from off-set toward her, then dissolve near her shoulder.
        dummy.position.set(
          side * (1.9 - travel * 1.35),
          1.15 + travel * 0.5 + Math.sin(travel * Math.PI) * 0.12,
          0.2 - travel * 0.35,
        );
        const fade = Math.sin(travel * Math.PI) * p;
        dummy.scale.set(0.16 * fade, 0.06 * fade, 0.06 * fade);
      }
      dummy.rotation.set(0, side * 0.4, 0);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    }
    mesh.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]} frustumCulled={false}>
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial
        color="#c4b5fd"
        transparent
        opacity={0.85}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </instancedMesh>
  );
}

export default function StudioScene({ active }: SceneProps) {
  const quality = useQuality();
  const anchor = useViewportAnchor();
  const narrow = useIsNarrow();
  const density = densityFor(quality);

  const onStage = useRef(0);
  const chatPulse = useRef(0);
  const cueToken = useRef(0);
  /** Seconds until the next self-emitted chat message. */
  const nextCue = useRef(1.2);
  const cueSide = useRef<-1 | 1>(1);
  const keyRef = useRef<THREE.SpotLight>(null);
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_, rawDelta) => {
    const dt = Math.min(rawDelta, 0.05);
    const progress = frame.section.studio;

    onStage.current = damp(onStage.current, active ? 1 : 0, 6, dt);

    // Messages keep arriving for as long as the reader is here, alternating
    // sides so the head turn is visible in both directions.
    if (active) {
      nextCue.current -= dt;
      if (nextCue.current <= 0) {
        nextCue.current = 3.2 + Math.random() * 1.6;
        cueSide.current = cueSide.current === 1 ? -1 : 1;
        pushChatCue(cueSide.current);
      }
    } else {
      nextCue.current = 1.2;
    }

    // A fresh cue spikes the pulse; it decays on its own.
    const cue = readStage().chatCue;
    if (cue && cue.token !== cueToken.current) {
      cueToken.current = cue.token;
      chatPulse.current = 1;
    }
    chatPulse.current = damp(chatPulse.current, 0, 1.6, dt);

    const key = keyRef.current;
    if (key) key.intensity = onStage.current * (30 + chatPulse.current * 10);

    if (!active) return;

    // Left of centre: the existing stream dashboard occupies the right two
    // thirds of this section's grid.
    const { x } = anchor(narrow ? 0 : -0.28, 0, 0);
    // She stands inside the set, so the set travels with her.
    const group = groupRef.current;
    if (group) group.position.x = x;

    const turn = cue ? cue.side * chatPulse.current : 0;

    directSyn('studio', {
      position: [x, 0, 0],
      rotation: [0, 0, 0],
      scale: 1,
      // She listens while a message is landing, and presents the rest of the time.
      mood: chatPulse.current > 0.35 ? 'listening' : 'presenting',
      gazeScale: 0.55,
      speaking: chatPulse.current > 0.15 && chatPulse.current < 0.8,
      // The turn toward the message: this is the reaction the brief asks for.
      bodyYaw: turn * 0.3,
      opacity: 1,
      lambda: 2.4,
    });

    directCamera('studio', {
      // Slight arc through the section so the room reveals its depth.
      position: [Math.sin(progress * 0.7 - 0.3) * 0.5, 1.46, 3.05],
      target: [x * 0.15, 1.3, -0.3],
      fov: narrow ? 50 : 40,
      lambda: 1.7,
      parallax: 0.5,
      roll: 0,
    });
  });

  return (
    <group ref={groupRef}>
      <StudioSet onStage={onStage} />
      <StreamUI onStage={onStage} chatPulse={chatPulse} />
      <ChatBurst
        count={Math.max(3, Math.round(7 * Math.max(density, 0.45)))}
        onStage={onStage}
      />

      {/* The broadcast key light — hard, frontal, slightly above. */}
      <spotLight
        ref={keyRef}
        position={[0.6, 3.4, 2.2]}
        angle={0.6}
        penumbra={0.7}
        intensity={0}
        distance={11}
        decay={2}
        color="#f3e8ff"
        castShadow={shadowsFor(quality)}
      />
    </group>
  );
}
