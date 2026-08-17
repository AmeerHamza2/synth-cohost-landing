'use client';

/**
 * The SYN cast, standing in the world.
 *
 * These are the client's own characters, cut from the supplied sheet. They are
 * placed as objects in the 3D space — standing on the floor, at real distances,
 * reflected in it — rather than floating over the page as an overlay. Near ones
 * sweep past as the camera moves, far ones barely shift, and station geometry
 * passes in front of them.
 *
 * They stay as camera-facing sprites because the artwork is 2D. That is the one
 * remaining place a real model would change things, and it is exactly the swap
 * an image-to-3D pass would make: same positions, same lighting, replace the
 * plane with a mesh.
 */

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { frame } from '../stage/frame';
import { hashRandom } from '../scenes/shared';
import { stationZ } from './World';
import { ALL_CHARACTERS } from '../primitives/cast';

/** Which characters stand at which station, and roughly where. */
interface Spot {
  station: number;
  /** Offset from the station centre. */
  x: number;
  z: number;
  /** Height off the floor; most stand on it, a few hover. */
  y?: number;
  scale?: number;
  /**
   * Use a specific sprite rather than the next one from the sheet. Lets a
   * particular slot be cast deliberately — the athlete in the hero, say —
   * without disturbing the ordering of everyone else.
   */
  src?: string;
}

/**
 * Placed by hand rather than scattered.
 *
 * They line the route the camera actually takes — off to the sides, at varying
 * depths — so the reader passes through a populated world instead of looking at
 * a crowd arranged on a shelf.
 */
const SPOTS: Spot[] = [
  // 01 hero — the original two cast members.
  //
  // The hero has four things competing for one band of frame: the copy column,
  // the rigged figure, the lead avatar and the labels down the right margin.
  // These are placed against the gaps between those, not scattered.
  { station: 0, x: -6.5, z: 2.5 },
  // Pushed well back and across, into the gap between the rigged figure and the
  // lead avatar, so a generic cast member is not competing with either.
  { station: 0, x: -1.25, z: -14 },
  // The athlete is an addition here, not a replacement. He was at x 3.4, which
  // is barely a world unit from the lead avatar at 2.4 — she stands nearer the
  // camera and covered all but his shoulder. Out here he is beside her, clear
  // of her silhouette and still inside the ENGAGE / SUPPORT / COLLABORATE
  // labels down the right margin.
  { station: 0, x: 7.1, z: -2.2, scale: 2, src: '/avatars/syn-athlete.webp' },
  // 02 pressure — crowding the corridor, which is the point of the section.
  { station: 1, x: -4.2, z: 3.5 },
  { station: 1, x: 4.6, z: 2 },
  { station: 1, x: -5.4, z: -2 },
  { station: 1, x: 5.2, z: -4 },
  { station: 1, x: -2.4, z: -6, y: 2.4 },
  // 03 meet — flanking the arch.
  { station: 2, x: -5.6, z: 1 },
  { station: 2, x: 5.2, z: 0 },
  // 04 roles — between the bays.
  { station: 3, x: -8.2, z: 4 },
  { station: 3, x: 8.4, z: 3 },
  // 05 studio — the crew, off to the side of the set.
  { station: 4, x: -7.5, z: 3.5 },
  { station: 4, x: 7.8, z: 2.5 },
  { station: 4, x: -5.2, z: 5.5, scale: 0.8 },
  // 06 knowledge — drifting inside the lattice.
  { station: 5, x: -6.4, z: 4, y: 1.6 },
  { station: 5, x: 6.2, z: 2, y: 2.8 },
  // 07 finale — the whole world gathered on the platform.
  { station: 6, x: -5.5, z: 4 },
  { station: 6, x: 5.8, z: 3.5 },
  { station: 6, x: -8.5, z: 0 },
  { station: 6, x: 8.2, z: -1 },
  { station: 6, x: 0, z: 6.5, scale: 0.85 },
];

/** Baseline height of a character in world units. */
const CHARACTER_HEIGHT = 2.0;
/** Floor level, matching the station plinths. */
const FLOOR_Y = -1.95;

export default function WorldCast() {
  // A spot either names its own sprite or takes the next one from the sheet.
  //
  // Sheet characters are dealt out by their own running count, not by the spot
  // index: a spot with an explicit `src` must not consume a slot, or adding one
  // pushes every later spot along and the last runs off the end of the list —
  // which resolves to `undefined` and 404s.
  const srcs = useMemo(() => {
    const out: string[] = [];
    let next = 0;
    for (const spot of SPOTS) {
      if (spot.src) {
        out.push(spot.src);
        continue;
      }
      out.push(ALL_CHARACTERS[next % ALL_CHARACTERS.length]);
      next += 1;
    }
    return out;
  }, []);
  const textures = useTexture(srcs);
  const list = useMemo(
    () => (Array.isArray(textures) ? textures : [textures]),
    [textures],
  );

  const groupRef = useRef<THREE.Group>(null);

  const members = useMemo(
    () =>
      SPOTS.map((spot, i) => {
        const texture = list[i];
        const image = texture?.image as { width: number; height: number } | undefined;
        const aspect = image?.width ? image.width / image.height : 0.7;
        const scale = (spot.scale ?? 1) * (0.85 + hashRandom(i * 7.3) * 0.35);
        return {
          spot,
          aspect,
          scale,
          seed: hashRandom(i * 11.9) * Math.PI * 2,
          hovers: spot.y !== undefined,
        };
      }),
    [list],
  );

  useFrame(() => {
    const group = groupRef.current;
    if (!group) return;
    const t = frame.time * (frame.reducedMotion ? 0.15 : 1);

    group.children.forEach((child, i) => {
      const m = members[i];
      if (!m) return;
      const { spot } = m;

      // Cull by journey: only the stations either side of the reader draw.
      const near = Math.abs(frame.journey - spot.station) < 1.6;
      child.visible = near;
      if (!near) return;

      const height = CHARACTER_HEIGHT * m.scale;
      // Standing characters sit on the floor; hovering ones bob in the air.
      const base = m.hovers ? FLOOR_Y + (spot.y ?? 0) : FLOOR_Y + height / 2;
      const bob = Math.sin(t * 0.7 + m.seed) * (m.hovers ? 0.18 : 0.05);

      child.position.set(spot.x, base + bob, stationZ(spot.station) + spot.z);
      child.scale.set(height * m.aspect, height, 1);
      // Face the camera, and lean very slightly as they breathe.
      child.rotation.z = Math.sin(t * 0.5 + m.seed) * 0.03;
    });
  });

  return (
    <group ref={groupRef}>
      {members.map((m, i) => (
        <mesh key={i}>
          <planeGeometry args={[1, 1]} />
          <meshBasicMaterial
            map={list[i]}
            transparent
            depthWrite={false}
            toneMapped={false}
          />
        </mesh>
      ))}
    </group>
  );
}
