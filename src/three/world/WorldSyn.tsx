'use client';

/**
 * The characters in the world.
 *
 * Two separate things live here, and they are deliberately independent:
 *
 *   1. The rigged figure — a real skeleton with real morph targets, driven by
 *      `useSynRig`. It breathes, blinks, makes small head movements and tracks
 *      the cursor, and it travels the whole journey, changing posture per
 *      station. This is the animated character in the scene.
 *
 *   2. The supplied avatar artwork — static planes standing at the stations
 *      where those characters already appear in the client's own design.
 *
 * The artwork is *added alongside* the rigged figure, never in place of it.
 * Swapping one for the other loses every bit of behaviour the rig provides,
 * because a flat image cannot breathe, blink or look at anyone.
 */

import { Suspense, useCallback, useMemo, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';
import SynProxy from '../syn/SynProxy';
import { resolveRig, type SynRig } from '../syn/rig';
import { useSynRig } from '../syn/useSynRig';
import { director } from '../syn/director';
import { damp, frame } from '../stage/frame';
import { stationZ } from './World';
import { focus } from './focus';
import type { SynMood } from '../stage/types';

/** Where the rigged figure stands at each station, and what it is doing. */
interface Placement {
  /** Offset from the station centre. */
  offset: [number, number, number];
  yaw: number;
  scale: number;
  mood: SynMood;
  /**
   * Where the artwork stands, when this station carries a piece of it.
   *
   * A phone frame is about as wide as one character, so the two cannot stand
   * side by side there. The camera holds the artwork — that framing is the one
   * already signed off — and the figure steps behind it.
   */
  artworkX?: number;
  /**
   * Where the figure stands on a narrow frame, when contracting its wide-screen
   * offset toward the middle does not land somewhere sensible — usually because
   * the artwork the camera is holding would then cover it.
   */
  narrowX?: number;
}

/**
 * How a narrow viewport treats the figure.
 *
 * Everything contracts toward the middle of the set, because a phone frame
 * shows roughly a third of the width a desktop one does, and the figure steps
 * back so that where it does fall behind copy it reads as depth rather than as
 * something sitting on the words.
 */
const NARROW_X = 0.5;
// Only a modest step back: the finale artwork is twice as wide as it is tall
// and covers a narrow frame corner to corner, so pushing the figure further
// than this simply parks it behind a wall.
const NARROW_Z = -2.5;
/** Matches the fly camera's own narrow test in `World.tsx`. */
const NARROW_BREAKPOINT = 900;

/**
 * The rigged figure walks the entire journey — that continuity is the point.
 *
 * The camera sits at `stationZ + 9.5`, so a placement's `z` is what actually
 * controls how large it reads: +5 puts it almost on the lens, -3 puts it
 * comfortably inside the set. Adjust depth before scale.
 *
 * Stations that also carry a piece of supplied artwork put the figure off to
 * one side, so the two share the space rather than overlapping.
 */
const PLACEMENTS: Placement[] = [
  // 01 hero — in the gap between the copy column and the lead avatar artwork.
  { offset: [-1.6, -1.95, 0.5], yaw: 0.25, scale: 2.0, mood: 'idle', artworkX: 2.4 },
  // 02 pressure — down the corridor, hemmed in by the panels.
  { offset: [0, -1.95, -2.5], yaw: 0.1, scale: 2.0, mood: 'overwhelmed' },
  // 03 meet — right of the second avatar artwork, under the arch.
  // Narrow: the arch character is held on the right of the frame and is wide,
  // so the figure crosses to her far side instead of standing behind her.
  {
    offset: [3.2, -1.95, -1],
    yaw: -0.35,
    scale: 2.0,
    mood: 'focused',
    artworkX: -3.4,
    narrowX: -4.3,
  },
  // 04 roles — the card row and the copy take the full width here, so it comes
  // forward into the right margin instead of standing behind a paragraph.
  { offset: [6.0, -1.85, 1], yaw: -0.6, scale: 2.0, mood: 'presenting' },
  // 05 studio — on set, in the gap between the copy and the stream panel.
  { offset: [-5.4, -1.85, -2.5], yaw: 0.5, scale: 1.9, mood: 'presenting' },
  // 06 knowledge — the upload copy runs almost the full width and the document
  // panel takes the rest, so it stands clear of both in the right margin.
  { offset: [6.6, -1.95, -1.5], yaw: -0.35, scale: 1.9, mood: 'thinking' },
  // 07 finale — beside the creators artwork, looking out at the skyline.
  { offset: [-3.6, -1.95, 0.5], yaw: 0.3, scale: 2.0, mood: 'together', artworkX: 3.6 },
];

/**
 * A piece of supplied artwork, standing at one station.
 *
 * Static by nature — it is a painting, not a rig — so it gets only the gentle
 * float and cursor lean that keep it from reading as a sticker.
 */
/**
 * Where a piece of artwork goes on a narrow frame.
 *
 * Contracting the wide-screen offset toward the middle is a reasonable default,
 * but the mobile layout is a different composition, not a squeezed copy of the
 * desktop one — it leaves a specific column open for a specific character. When
 * that is so, the placement is stated outright rather than derived.
 */
interface NarrowArt {
  x: number;
  /** Centre of the plane. Omitted means standing on the floor, as on desktop. */
  y?: number;
  /** Replaces the default narrow shrink. */
  scale?: number;
}

function StaticAvatar({
  src,
  station,
  x,
  z = 0,
  height,
  yaw = 0,
  fallbackAspect = 1,
  narrowArt,
}: {
  src: string;
  station: number;
  x: number;
  z?: number;
  height: number;
  yaw?: number;
  fallbackAspect?: number;
  narrowArt?: NarrowArt;
}) {
  const texture = useTexture(src);
  const meshRef = useRef<THREE.Mesh>(null);
  const aspect = useMemo(() => {
    const image = texture.image as { width: number; height: number } | undefined;
    return image?.width ? image.width / image.height : fallbackAspect;
  }, [texture, fallbackAspect]);

  useFrame(() => {
    const mesh = meshRef.current;
    if (!mesh) return;
    // Tight enough that a piece of artwork belongs to its own section: a wide
    // window leaves the finale's creators hanging over the knowledge copy,
    // because the world is fixed while the page scrolls past it.
    const distance = Math.abs(frame.journey - station);
    mesh.visible = distance < 0.95;
    if (!mesh.visible) return;

    const calm = frame.reducedMotion;
    const narrow = frame.viewport.width < NARROW_BREAKPOINT;
    const breath = Math.sin(frame.time * 0.5 + station) * (calm ? 0.002 : 0.006);
    // A phone frame is roughly a third the width, so the artwork comes in with
    // it — otherwise a character composed against a desktop layout stands off
    // the side of a narrow one.
    // 0.64 rather than something closer to 1 because the narrow camera holds
    // its subject well right of centre, to leave the left column for the copy —
    // artwork any larger than this runs off the right edge from there.
    const art = narrow ? narrowArt : undefined;
    const h = height * (narrow ? (art?.scale ?? 0.64) : 1) * (1 + breath);
    mesh.scale.set(h * aspect, h, 1);
    // Standing on the floor is the default. A stated `y` overrides it, which is
    // how a head-and-shoulders crop gets to sit where the layout wants it
    // rather than where a pair of feet would put it.
    const floorY = h / 2 - 1.95;
    mesh.position.set(
      art ? art.x : narrow ? x * NARROW_X : x,
      (art?.y ?? floorY) +
        Math.sin(frame.time * 0.33 + station) * (calm ? 0.01 : 0.05),
      stationZ(station) + z,
    );
    mesh.rotation.y = yaw + (calm ? 0 : frame.pointer.x * 0.12);
    // Fade at the edges of its station rather than popping out.
    (mesh.material as THREE.MeshBasicMaterial).opacity = Math.min(
      1,
      (0.95 - distance) / 0.3,
    );
  });

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial map={texture} transparent depthWrite={false} toneMapped={false} />
    </mesh>
  );
}

/**
 * The supplied artwork, each at the station where that character already
 * appears in the client's own design.
 *
 * Kept in its own component behind a Suspense boundary so that waiting on these
 * textures never holds up the rigged figure — the character starts breathing the
 * moment the scene is up, and the artwork fades in when it has decoded.
 *
 * The athlete is not here: he already stands in the hero as part of the cast in
 * `WorldCast`, and one character should not appear twice on the same journey.
 */
function SuppliedArtwork() {
  return (
    <>
      <StaticAvatar
        src="/avatars/syn-lead.webp"
        station={0}
        x={2.4}
        z={0}
        height={4.3}
        yaw={-0.3}
        fallbackAspect={0.94}
      />
      <StaticAvatar
        src="/avatars/syn-second.webp"
        station={2}
        x={-3.4}
        z={-1}
        height={4.2}
        yaw={0.35}
        fallbackAspect={1.62}
        // The mobile layout opens the whole left column for her and runs the
        // copy down the right. Left to the default she landed bottom-right,
        // behind the feature list, with her own column empty.
        narrowArt={{ x: -5.5, y: 4, scale: 0.53 }}
      />
      <StaticAvatar
        src="/avatars/creators.webp"
        station={6}
        x={3.6}
        z={-3}
        height={7}
        fallbackAspect={2}
        // Twice as wide as it is tall, so on a phone it is wider than the frame.
        // Held at the camera's own axis rather than offset to the right, which
        // is what was cropping the second figure out of the shot.
        narrowArt={{ x: -0.1 }}
      />
    </>
  );
}

export default function WorldSyn() {
  const groupRef = useRef<THREE.Group>(null);
  const lightsRef = useRef<THREE.Group>(null);
  const rigRef = useRef<SynRig | null>(null);
  const [, forceRender] = useState(0);

  const handleBuilt = useCallback((root: THREE.Object3D) => {
    rigRef.current = resolveRig(root);
    root.traverse((child) => {
      const mesh = child as THREE.Mesh;
      if (mesh.isMesh) {
        mesh.castShadow = true;
        mesh.receiveShadow = true;
      }
    });
    forceRender((n) => n + 1);
  }, []);

  // Breathing, blinking, head and eye tracking, mood posture.
  useSynRig(rigRef);

  useFrame((_, rawDelta) => {
    const group = groupRef.current;
    if (!group) return;
    const dt = Math.min(rawDelta, 0.05);

    // It travels with the reader: the station it belongs to is whichever one
    // the journey is nearest, and it eases between placements rather than
    // teleporting, so the hand-off between sections is a walk, not a cut.
    const index = Math.max(
      0,
      Math.min(PLACEMENTS.length - 1, Math.round(frame.journey)),
    );
    const place = PLACEMENTS[index];
    const z = stationZ(index);
    const narrow = frame.viewport.width < NARROW_BREAKPOINT;

    const x = narrow
      ? (place.narrowX ?? place.offset[0] * NARROW_X)
      : place.offset[0];
    const depth = narrow ? place.offset[2] + NARROW_Z : place.offset[2];

    group.position.x = damp(group.position.x, x, 2.2, dt);
    group.position.y = damp(group.position.y, place.offset[1], 2.2, dt);
    group.position.z = damp(group.position.z, z + depth, 2.6, dt);
    group.rotation.y = damp(group.rotation.y, place.yaw, 2.2, dt);
    group.scale.setScalar(damp(group.scale.x, place.scale, 2.2, dt));

    // The lights follow where it stands, but not how large it is drawn.
    lightsRef.current?.position.copy(group.position);

    // Publish what the camera should hold. On a narrow frame that is the
    // artwork wherever a station carries some — the framing already signed off
    // — and the figure itself everywhere else.
    focus.x = narrow
      ? place.artworkX !== undefined
        ? place.artworkX * NARROW_X
        : x
      : x;
    focus.y = group.position.y;
    focus.z = group.position.z;

    // The rig driver reads its mood from the director, so the station sets it.
    director.target.mood = place.mood;
    director.target.gazeScale = 1;
  });

  return (
    <>
      <group ref={groupRef}>
        <SynProxy onBuilt={handleBuilt} />
      </group>

      {/* Its own key and rim, travelling with it, so the station's light wraps
          the figure instead of leaving it flat.

          Deliberately NOT children of the group above: that group is scaled to
          about 2, which multiplies a light's offset while leaving `distance` —
          a world-space value — alone. Inside it, these two sat right at the
          edge of their own falloff and delivered almost nothing, which is what
          turned the figure into a flat purple silhouette. Out here they follow
          the figure's position and ignore its scale. */}
      <group ref={lightsRef}>
        <pointLight position={[1.5, 2.6, 2.2]} intensity={26} distance={9} color="#efe7ff" />
        <pointLight position={[-1.8, 1.8, -1.4]} intensity={18} distance={8} color="#a78bfa" />
      </group>

      {/* Added alongside the figure, never in place of it. */}
      <Suspense fallback={null}>
        <SuppliedArtwork />
      </Suspense>
    </>
  );
}
