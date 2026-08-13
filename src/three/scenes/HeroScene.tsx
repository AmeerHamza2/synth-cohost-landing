'use client';

/**
 * Section 01 — Hero.
 *
 * Brief: "SYN is actually inside the page." The existing copy and layout are
 * untouched; the static character plate is replaced by the live rig, which
 * breathes, blinks, makes small head movements, and tracks the cursor with its
 * eyes and head (all of that lives in `useSynRig`), while the key light orbits
 * with the pointer (`StageLights`).
 *
 * This scene's job is only to *stage* her: where she stands, how she is framed,
 * and the ground and air around her that make her feel present rather than
 * composited.
 */

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { ContactShadows } from '@react-three/drei';
import * as THREE from 'three';
import { frame } from '../stage/frame';
import { useQuality } from '../stage/useQuality';
import { directCamera } from '../stage/camera';
import { directSyn } from '../syn/director';
import { densityFor } from '../stage/quality';
import {
  hashRandom,
  useFigurePlacement,
  useIsNarrow,
  useViewportAnchor,
} from './shared';
import { useDisposable } from '../primitives/useDisposable';
import type { SceneProps } from '../stage/SceneSwitch';

/**
 * Narrow-viewport framing. The mobile hero gives its artwork a short right-hand
 * column, so SYN is scaled down and placed by screen fraction rather than left
 * standing on the ground plane, which would run her head off the top.
 */
const NARROW_SCALE = 0.5;
const NARROW_TARGET_Y = 1.0;

/** Slow-drifting motes. Cheap, and they give the air some volume. */
function Motes({ count }: { count: number }) {
  const pointsRef = useRef<THREE.Points>(null);

  const geometry = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const seeds = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (hashRandom(i * 3.1) - 0.5) * 4.2;
      positions[i * 3 + 1] = hashRandom(i * 7.7) * 2.6 + 0.15;
      positions[i * 3 + 2] = (hashRandom(i * 11.3) - 0.5) * 2.2 - 0.3;
      seeds[i] = hashRandom(i * 13.9) * Math.PI * 2;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    g.userData.seeds = seeds;
    g.userData.base = positions.slice();
    return g;
  }, [count]);

  useDisposable(geometry);

  useFrame(() => {
    const points = pointsRef.current;
    if (!points) return;
    const attribute = points.geometry.attributes.position as THREE.BufferAttribute;
    const base = points.geometry.userData.base as Float32Array;
    const seeds = points.geometry.userData.seeds as Float32Array;
    const t = frame.time * (frame.reducedMotion ? 0.12 : 0.4);
    for (let i = 0; i < seeds.length; i++) {
      const seed = seeds[i];
      attribute.array[i * 3] = base[i * 3] + Math.sin(t + seed) * 0.09;
      attribute.array[i * 3 + 1] =
        base[i * 3 + 1] + Math.sin(t * 0.7 + seed * 1.7) * 0.12;
      attribute.array[i * 3 + 2] =
        base[i * 3 + 2] + Math.cos(t * 0.55 + seed) * 0.07;
    }
    attribute.needsUpdate = true;
  });

  return (
    <points ref={pointsRef} geometry={geometry} frustumCulled={false}>
      <pointsMaterial
        size={0.019}
        sizeAttenuation
        color="#8b5cf6"
        transparent
        opacity={0.55}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

/**
 * A faint ring on the floor that pulses with her breath. Small detail, but it
 * is what stops her reading as a cut-out pasted over a gradient.
 */
function PresenceRing() {
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    const ring = ringRef.current;
    if (!ring) return;
    const pulse = 1 + Math.sin(frame.time * 1.5) * 0.02;
    ring.scale.set(pulse, pulse, 1);
    const material = ring.material as THREE.MeshBasicMaterial;
    material.opacity = 0.16 + Math.sin(frame.time * 1.5) * 0.04;
  });

  return (
    <mesh ref={ringRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.012, 0]}>
      <ringGeometry args={[0.42, 0.62, 48]} />
      <meshBasicMaterial
        color="#7c3aed"
        transparent
        opacity={0.16}
        side={THREE.DoubleSide}
        depthWrite={false}
      />
    </mesh>
  );
}

export default function HeroScene({ active }: SceneProps) {
  const quality = useQuality();
  const anchor = useViewportAnchor();
  const place = useFigurePlacement();
  const narrow = useIsNarrow();
  const groupRef = useRef<THREE.Group>(null);
  const density = densityFor(quality);
  const moteCount = Math.max(12, Math.round(70 * density));

  useFrame(() => {
    if (!active) return;

    const progress = frame.section.hero;

    // She lives in the right third, mirroring where the original plate put her,
    // so the existing headline and buttons keep their space untouched.
    //
    // The narrow layout needs more than a different x: the mobile hero gives its
    // artwork a short right-hand column, so she is scaled down and placed by
    // screen fraction rather than simply standing on the ground plane, which
    // would run her head off the top of a phone screen.
    const placement = narrow
      ? place(0.235, -0.02, NARROW_SCALE, NARROW_TARGET_Y)
      : { x: anchor(0.235, 0, 0).x, y: 0 };
    const x = placement.x;

    // The ground props — presence ring, light pool, contact shadow — belong at
    // her feet, so they take the same transform she does.
    const group = groupRef.current;
    if (group) {
      group.position.set(x, placement.y, 0);
      group.scale.setScalar(narrow ? NARROW_SCALE : 1);
    }

    directSyn('hero', {
      position: [x, placement.y, 0],
      // A slight turn toward the copy: she is present *with* the page content,
      // not posing at the camera.
      rotation: [0, -0.16 - frame.pointer.x * 0.05, 0],
      scale: narrow ? NARROW_SCALE : 1,
      mood: 'idle',
      gazeScale: 1,
      bodyYaw: 0,
      opacity: 1,
      lambda: 2.6,
    });

    directCamera('hero', {
      // Portrait framing that matches the original plate: cropped around the
      // hip rather than showing a full figure, so the composition the copy was
      // laid out against is preserved. Pulls back very slightly as the reader
      // scrolls out, handing off to the pressure section without a cut.
      position: narrow
        ? [0, NARROW_TARGET_Y, 2.8]
        : [0, 1.52 + progress * 0.06, 2.05 + progress * 0.55],
      target: [x * 0.3, narrow ? NARROW_TARGET_Y : 1.46, 0],
      // Narrow viewports need a wider frustum or she crops at the shoulders.
      fov: narrow ? 46 : 34,
      lambda: 2.2,
      parallax: 1,
      roll: 0,
    });
  });

  return (
    <group ref={groupRef}>
      <PresenceRing />
      <Motes count={moteCount} />

      {/* Grounding shadow. Skipped on the low tier, where it costs more than
          it returns. */}
      {quality !== 'low' && (
        <ContactShadows
          position={[0, 0.004, 0]}
          scale={3.4}
          resolution={quality === 'high' ? 512 : 256}
          blur={2.6}
          opacity={0.42}
          far={2.4}
          color="#2a1a4a"
        />
      )}

      {/* A soft pool of light on the floor so the lavender plate reads as a
          surface she is standing on. */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.002, 0]}>
        <circleGeometry args={[1.7, 40]} />
        <meshBasicMaterial
          color="#c4b5fd"
          transparent
          opacity={0.28}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}
