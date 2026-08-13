'use client';

/**
 * Section 07 — "The next generation of creators won't stream alone."
 *
 * Brief: the cinematic payoff. Everything seen so far recedes into the
 * background, SYN stands beside a human creator in a dark futuristic studio,
 * and the camera pulls slowly back to reveal the two of them surrounded by the
 * elements from every earlier section — then the existing CTA arrives.
 *
 * The pull-back is driven by scroll rather than a timer, so the reveal happens
 * at the reader's pace and lands exactly on the CTA.
 */

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { damp, frame, range } from '../stage/frame';
import { directCamera } from '../stage/camera';
import { directSyn } from '../syn/director';
import { useQuality } from '../stage/useQuality';
import { densityFor } from '../stage/quality';
import { hashRandom, useIsNarrow, useViewportAnchor } from './shared';
import type { SceneProps } from '../stage/SceneSwitch';

/**
 * The human creator standing beside her.
 *
 * Deliberately a silhouette rather than a second character: the section is
 * about the pairing, and an under-detailed second figure would compete with
 * SYN. It is also the honest answer to there being no second rigged model —
 * this reads as an intentional silhouette, not an unfinished character.
 */
function Creator({ reveal }: { reveal: React.RefObject<number> }) {
  const groupRef = useRef<THREE.Group>(null);
  const breath = useRef(0);

  useFrame((_, rawDelta) => {
    const group = groupRef.current;
    if (!group) return;
    const p = reveal.current ?? 0;
    group.visible = p > 0.01;
    if (!group.visible) return;

    breath.current += Math.min(rawDelta, 0.05) * (frame.reducedMotion ? 0.1 : 0.28);
    // Same breathing language as SYN, at a slightly different rate so the two
    // figures never look mechanically synchronised.
    const swell = Math.sin(breath.current * Math.PI * 2) * 0.008;
    group.scale.set(p, p * (1 + swell), p);
    group.position.y = 0;
  });

  return (
    <group ref={groupRef} position={[0.72, 0, -0.12]} rotation={[0, -0.24, 0]}>
      {/* Head */}
      <mesh position={[0, 1.6, 0]}>
        <sphereGeometry args={[0.1, 18, 14]} />
        <meshStandardMaterial color="#0f0b1c" roughness={0.7} metalness={0.1} />
      </mesh>
      {/* Torso */}
      <mesh position={[0, 1.2, 0]}>
        <capsuleGeometry args={[0.135, 0.34, 4, 12]} />
        <meshStandardMaterial color="#0f0b1c" roughness={0.75} metalness={0.08} />
      </mesh>
      {/* Arms */}
      {[-1, 1].map((side) => (
        <mesh key={side} position={[side * 0.18, 1.16, 0.02]} rotation={[0.06, 0, side * 0.1]}>
          <capsuleGeometry args={[0.042, 0.44, 4, 8]} />
          <meshStandardMaterial color="#0f0b1c" roughness={0.75} />
        </mesh>
      ))}
      {/* Legs */}
      {[-1, 1].map((side) => (
        <mesh key={side} position={[side * 0.075, 0.44, 0]}>
          <capsuleGeometry args={[0.055, 0.72, 4, 8]} />
          <meshStandardMaterial color="#0d0917" roughness={0.8} />
        </mesh>
      ))}
      {/* Rim so the silhouette separates from the black. */}
      <pointLight position={[0.8, 1.5, 0.4]} intensity={3} distance={2.4} decay={2} color="#7c3aed" />
    </group>
  );
}

/**
 * The callback ring: one element from every earlier section, orbiting far out
 * and only revealed as the camera retreats.
 */
function Constellation({
  count,
  reveal,
}: {
  count: number;
  reveal: React.RefObject<number>;
}) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const items = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        angle: (i / count) * Math.PI * 2 + hashRandom(i * 2.3) * 0.4,
        radius: 3.1 + hashRandom(i * 4.7) * 2.4,
        height: 0.5 + hashRandom(i * 6.1) * 2.6,
        size: 0.09 + hashRandom(i * 8.9) * 0.16,
        speed: 0.02 + hashRandom(i * 3.1) * 0.05,
        seed: i * 1.7,
      })),
    [count],
  );

  useFrame(() => {
    const mesh = meshRef.current;
    if (!mesh) return;
    const p = reveal.current ?? 0;
    mesh.visible = p > 0.01;
    if (!mesh.visible) return;

    const t = frame.time * (frame.reducedMotion ? 0.15 : 1);
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      const angle = item.angle + t * item.speed;
      dummy.position.set(
        Math.cos(angle) * item.radius,
        item.height + Math.sin(t * 0.3 + item.seed) * 0.1,
        Math.sin(angle) * item.radius,
      );
      dummy.rotation.set(0, -angle, Math.sin(t * 0.2 + item.seed) * 0.2);
      dummy.scale.set(item.size * p, item.size * p * 0.62, 1);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    }
    mesh.instanceMatrix.needsUpdate = true;
    (mesh.material as THREE.MeshBasicMaterial).opacity = p * 0.4;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]} frustumCulled={false}>
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial
        color="#8b5cf6"
        transparent
        opacity={0}
        side={THREE.DoubleSide}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </instancedMesh>
  );
}

export default function FinaleScene({ active }: SceneProps) {
  const quality = useQuality();
  const anchor = useViewportAnchor();
  const narrow = useIsNarrow();
  const density = densityFor(quality);

  const onStage = useRef(0);
  const reveal = useRef(0);
  const groupRef = useRef<THREE.Group>(null);
  const floorRef = useRef<THREE.Mesh>(null);

  useFrame((_, rawDelta) => {
    const dt = Math.min(rawDelta, 0.05);
    const progress = frame.section.finale;

    onStage.current = damp(onStage.current, active ? 1 : 0, 6, dt);
    // The reveal is the scroll. Two figures first, then the world around them.
    const revealTarget = active ? range(progress, 0.2, 0.78) : 0;
    reveal.current = damp(reveal.current, revealTarget, 2, dt);

    const floor = floorRef.current;
    if (floor) {
      (floor.material as THREE.MeshBasicMaterial).opacity = onStage.current * 0.14;
    }

    if (!active) return;

    const { x } = anchor(narrow ? 0 : 0.16, 0, 0);
    const group = groupRef.current;
    if (group) group.position.x = x;

    directSyn('finale', {
      // Beside the creator, not in front of him.
      position: [x - 0.62, 0, 0],
      rotation: [0, 0.2, 0],
      scale: 1,
      mood: 'together',
      gazeScale: 0.4,
      speaking: false,
      bodyYaw: 0,
      opacity: 1,
      lambda: 1.6,
    });

    directCamera('finale', {
      // The pull-back. Slow, wide, and it keeps going right through the CTA.
      position: [0, 1.5 + reveal.current * 0.7, 3.0 + reveal.current * 5.4],
      target: [x * 0.2, 1.25 + reveal.current * 0.1, -0.2],
      fov: (narrow ? 50 : 40) + reveal.current * 8,
      // Deliberately the slowest convergence on the page: this is the one move
      // that should feel like a camera rather than a transition.
      lambda: 1.1,
      parallax: 0.35,
      // A whisper of roll as it opens out.
      roll: reveal.current * 0.015,
    });
  });

  return (
    <group ref={groupRef}>
      <Creator reveal={onStage} />
      <Constellation
        count={Math.max(6, Math.round(22 * Math.max(density, 0.4)))}
        reveal={reveal}
      />

      {/* The pool of light the pair are standing in. */}
      <mesh ref={floorRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.002, 0]}>
        <circleGeometry args={[2.2, 44]} />
        <meshBasicMaterial color="#7c3aed" transparent opacity={0} depthWrite={false} />
      </mesh>

      {/* Cold back light, so both figures read as silhouettes against it. */}
      <pointLight position={[0, 2.4, -2.6]} intensity={22} distance={9} decay={2} color="#6d28d9" />
    </group>
  );
}
