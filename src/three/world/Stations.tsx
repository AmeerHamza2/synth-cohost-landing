'use client';

/**
 * The seven places the journey passes through.
 *
 * Each is built from real geometry standing in real space — not planes with
 * effects on them. That is the whole point: as the camera moves, near pillars
 * sweep past far ones, beams cut across surfaces, and objects hide each other
 * because they are genuinely in front of one another.
 *
 * Everything is procedural. No models are needed to make the *space* feel
 * three-dimensional, which is why this can be built now and the characters can
 * arrive into it later.
 */

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { frame } from '../stage/frame';
import { hashRandom } from '../scenes/shared';
import { LightShaft, stationZ } from './World';
import WorldText from './WorldText';

/**
 * Mounts its contents only while the camera is near.
 *
 * Distant stations are behind fog and contribute nothing but draw calls, so
 * they are switched off — which is also how the page keeps its promise of
 * loading progressively rather than running the whole world at once.
 */
function Station({
  index,
  reach = 1.6,
  children,
}: {
  index: number;
  reach?: number;
  children: React.ReactNode;
}) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(() => {
    const group = groupRef.current;
    if (!group) return;
    group.visible = Math.abs(frame.journey - index) < reach;
  });

  return (
    <group ref={groupRef} position={[0, 0, stationZ(index)]}>
      {children}
    </group>
  );
}

/** Emissive strip, the recurring motif that ties the world together. */
function Strip({
  position,
  size = [0.12, 3, 0.12],
  color = '#8b5cf6',
  rotation = [0, 0, 0],
}: {
  position: [number, number, number];
  size?: [number, number, number];
  color?: string;
  rotation?: [number, number, number];
}) {
  return (
    <mesh position={position} rotation={rotation}>
      <boxGeometry args={size} />
      <meshStandardMaterial
        color="#1a1130"
        emissive={color}
        emissiveIntensity={0.8}
        roughness={0.4}
      />
    </mesh>
  );
}

/** Dark structural surface, used for plinths, walls and monoliths. */
const SURFACE = {
  color: '#150f26',
  roughness: 0.55,
  metalness: 0.35,
} as const;

/** 01 — a lit plinth in an open hall, with light falling from above. */
function HeroStation() {
  return (
    <Station index={0}>
      <mesh position={[0, -2.2, 0]} receiveShadow castShadow>
        <cylinderGeometry args={[4.6, 5.2, 0.5, 48]} />
        <meshStandardMaterial {...SURFACE} />
      </mesh>
      {/* Laid flat: a torus is authored in the XY plane, so without this it
          stands vertically and reads as a giant arch across the whole frame. */}
      <mesh position={[0, -1.9, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <torusGeometry args={[4.4, 0.05, 8, 64]} />
        <meshStandardMaterial color="#1a1130" emissive="#a78bfa" emissiveIntensity={0.9} />
      </mesh>

      {/* Colonnade: near pillars sweep past far ones as the camera moves. */}
      {Array.from({ length: 8 }, (_, i) => {
        const a = (i / 8) * Math.PI * 2;
        return (
          <mesh key={i} position={[Math.cos(a) * 11, 1.5, Math.sin(a) * 11]} castShadow>
            <boxGeometry args={[1.1, 9, 1.1]} />
            <meshStandardMaterial {...SURFACE} />
          </mesh>
        );
      })}

      <LightShaft position={[0, 4.5, 0]} radius={4.2} height={13} intensity={0.06} />
      <spotLight
        position={[0, 11, 2]}
        angle={0.6}
        penumbra={0.9}
        intensity={220}
        distance={26}
        color="#efe7ff"
        castShadow
      />
    </Station>
  );
}

/**
 * 02 — a corridor of panels closing in.
 *
 * The demands flank the path and lean inward overhead rather than filling it.
 * A cloud of slabs in the middle of the frame reads as debris and buries the
 * copy; a corridor reads as pressure and leaves the centre channel clear, which
 * is what the two columns of text in this section need.
 */
function PressureStation() {
  const panels = useMemo(
    () =>
      Array.from({ length: 34 }, (_, i) => {
        const side = i % 2 === 0 ? -1 : 1;
        const row = Math.floor(i / 2);
        return {
          side,
          // Marching away from the camera down both walls.
          z: 6 - row * 1.9,
          // Held out of the centre channel so the copy always has a clear run.
          x: side * (5.2 + hashRandom(i * 3.1) * 2.6),
          y: -1 + hashRandom(i * 5.7) * 6,
          tilt: side * (0.5 + hashRandom(i * 9.3) * 0.5),
          s: 0.55 + hashRandom(i * 6.6) * 0.7,
          seed: i * 1.7,
        };
      }),
    [],
  );
  const groupRef = useRef<THREE.Group>(null);

  useFrame(() => {
    const group = groupRef.current;
    if (!group) return;
    const t = frame.time * (frame.reducedMotion ? 0.06 : 0.3);
    // Closes in as the reader moves through the section, opens as they leave.
    const close = Math.max(0, 1 - Math.abs(frame.journey - 1)) ;

    group.children.forEach((child, i) => {
      const p = panels[i];
      if (!p) return;
      child.position.set(
        p.x * (1 - close * 0.3),
        p.y + Math.sin(t + p.seed) * 0.35,
        p.z,
      );
      child.rotation.set(0, p.tilt, p.side * (0.12 + close * 0.2));
    });
  });

  return (
    <Station index={1}>
      <group ref={groupRef}>
        {panels.map((p, i) => (
          <mesh key={i} castShadow>
            <boxGeometry args={[2.6 * p.s, 1.6 * p.s, 0.1]} />
            <meshStandardMaterial
              color="#1c1233"
              emissive="#6d28d9"
              emissiveIntensity={0.22}
              roughness={0.5}
              metalness={0.4}
            />
          </mesh>
        ))}
      </group>

      {/* Ribs overhead, so the corridor has a ceiling and the space closes. */}
      {Array.from({ length: 7 }, (_, i) => (
        <mesh key={i} position={[0, 6.4, 4 - i * 2.6]} rotation={[0, 0, Math.PI / 2]}>
          <capsuleGeometry args={[0.08, 15, 4, 8]} />
          <meshStandardMaterial color="#1a1130" emissive="#7c3aed" emissiveIntensity={0.4} />
        </mesh>
      ))}

      <pointLight position={[0, 2, 6]} intensity={90} distance={20} color="#7c3aed" />
      <pointLight position={[0, 4, -6]} intensity={70} distance={22} color="#a855f7" />
    </Station>
  );
}

/** 03 — an arch and a pool of light: the noise resolves into one focus. */
function MeetStation() {
  return (
    <Station index={2}>
      <mesh position={[0, 1, -3]} castShadow>
        <torusGeometry args={[5.2, 0.28, 12, 48, Math.PI]} />
        <meshStandardMaterial color="#1a1130" emissive="#8b5cf6" emissiveIntensity={0.6} />
      </mesh>
      <mesh position={[0, -2.2, 0]} receiveShadow>
        <cylinderGeometry args={[5, 5, 0.4, 40]} />
        <meshStandardMaterial {...SURFACE} />
      </mesh>
      {Array.from({ length: 12 }, (_, i) => (
        <Strip
          key={i}
          position={[-9 + i * 1.6, -1.9, -7]}
          size={[0.08, 0.08, 5]}
          color="#a78bfa"
        />
      ))}
      <LightShaft position={[0, 4, 0]} radius={3.2} height={12} intensity={0.07} />
      <spotLight position={[0, 9, 3]} angle={0.5} penumbra={0.9} intensity={200} distance={22} color="#e9d5ff" castShadow />
    </Station>
  );
}

/** 04 — five lit alcoves in a row: one personality, many roles. */
function RolesStation() {
  const bays = [0, 1, 2, 3, 4];
  return (
    <Station index={3}>
      {/* The statement, extruded and standing above the bays. */}
      <WorldText
        lines={['Customize your avatar.', 'Train its personality.']}
        // The camera at this station sits at z = +9.5 and around y = 1, so
        // this is roughly 8 units ahead of it — far enough that the whole
        // statement fits the frame, close enough to read as an object.
        // Kept low and close to the card row it belongs to, so even at the
        // edges of its window it never reaches the previous section's copy.
        position={[0, 3.15, 1.2]}
        size={0.72}
        depth={0.6}
        station={3}
        narrowAnchor='[data-stage="roles"]'
      />

      {bays.map((i) => {
        const x = (i - 2) * 5.4;
        return (
          <group key={i} position={[x, 0, -2]}>
            <mesh position={[0, 0.5, -1.2]} castShadow receiveShadow>
              <boxGeometry args={[4.2, 8, 0.4]} />
              <meshStandardMaterial {...SURFACE} />
            </mesh>
            <Strip position={[-2.1, 0.5, -0.9]} size={[0.1, 7.4, 0.1]} color="#a78bfa" />
            <Strip position={[2.1, 0.5, -0.9]} size={[0.1, 7.4, 0.1]} color="#a78bfa" />
            <mesh position={[0, -2.1, 0]} receiveShadow>
              <boxGeometry args={[4, 0.4, 3]} />
              <meshStandardMaterial {...SURFACE} />
            </mesh>
            <pointLight
              position={[0, 1.5, 1.4]}
              intensity={60}
              distance={9}
              // Each bay is lit differently, so the row reads as five moods.
              color={['#e9d5ff', '#c7d2fe', '#fde68a', '#bfdbfe', '#fbcfe8'][i]}
            />
          </group>
        );
      })}
    </Station>
  );
}

/**
 * 05 — a broadcast set, built around the dashboard rather than behind it.
 *
 * The stream UI occupies the centre of the screen in this section, so anything
 * placed there is simply hidden by it. The set lives in the margins instead: a
 * camera rig and flight cases to one side, a monitor bank to the other, and the
 * lighting truss high enough to clear the panel. What the reader sees is the
 * room the dashboard is sitting in.
 */
function StudioStation() {
  const trussRef = useRef<THREE.Group>(null);

  useFrame(() => {
    const truss = trussRef.current;
    if (!truss) return;
    truss.children.forEach((child, i) => {
      const light = child as THREE.PointLight;
      if (!light.isPointLight) return;
      // Lights cycle as though a gallery is cutting between shots.
      const t = frame.time * (frame.reducedMotion ? 0.2 : 1.1) + i * 1.7;
      light.intensity = 24 + (Math.sin(t) * 0.5 + 0.5) * 40;
    });
  });

  return (
    <Station index={4}>
      {/* Back wall, well behind and dimmer, so it reads as depth not pattern. */}
      <mesh position={[0, 2, -12]} receiveShadow>
        <boxGeometry args={[34, 16, 0.5]} />
        <meshStandardMaterial {...SURFACE} />
      </mesh>
      {Array.from({ length: 13 }, (_, i) => (
        <mesh key={i} position={[-13 + i * 2.2, 2, -11.6 + (i % 3) * 0.5]}>
          <boxGeometry args={[0.5, 6 + (i % 3) * 2.4, 0.3]} />
          <meshStandardMaterial
            color="#1a1130"
            emissive={i % 3 === 0 ? '#a855f7' : '#4c1d95'}
            emissiveIntensity={0.35}
          />
        </mesh>
      ))}

      {/* Lighting truss, high enough to clear the dashboard. */}
      <mesh position={[0, 9.5, -2]}>
        <boxGeometry args={[26, 0.3, 0.3]} />
        <meshStandardMaterial color="#241a3d" metalness={0.8} roughness={0.3} />
      </mesh>
      {Array.from({ length: 6 }, (_, i) => (
        <mesh key={i} position={[-10 + i * 4, 9.1, -2]}>
          <cylinderGeometry args={[0.28, 0.4, 0.7, 10]} />
          <meshStandardMaterial color="#1a1130" emissive="#f3e8ff" emissiveIntensity={0.5} />
        </mesh>
      ))}
      <group ref={trussRef}>
        {Array.from({ length: 5 }, (_, i) => (
          <pointLight key={i} position={[-8 + i * 4, 8.6, -2]} intensity={40} distance={20} color="#f3e8ff" />
        ))}
      </group>

      {/* Left margin: a camera on a pedestal, and cases on the floor. */}
      <group position={[-10.5, 0, 3]} rotation={[0, 0.5, 0]}>
        <mesh position={[0, -1.2, 0]} castShadow>
          <cylinderGeometry args={[0.18, 0.5, 2.4, 12]} />
          <meshStandardMaterial color="#241a3d" metalness={0.7} roughness={0.35} />
        </mesh>
        <mesh position={[0, 0.4, 0]} castShadow>
          <boxGeometry args={[1.5, 0.9, 2.2]} />
          <meshStandardMaterial {...SURFACE} />
        </mesh>
        <mesh position={[0, 0.4, 1.2]}>
          <cylinderGeometry args={[0.38, 0.38, 0.5, 16]} />
          <meshStandardMaterial color="#0d0a18" emissive="#22d3ee" emissiveIntensity={0.7} />
        </mesh>
        <mesh position={[0, 1, -0.6]}>
          <boxGeometry args={[0.3, 0.2, 0.3]} />
          <meshStandardMaterial color="#1a1130" emissive="#ef4444" emissiveIntensity={1.6} />
        </mesh>
      </group>
      {[0, 1, 2].map((i) => (
        <mesh key={i} position={[-8.5 + i * 1.6, -1.85, 6.5]} castShadow receiveShadow>
          <boxGeometry args={[1.4, 0.9, 1]} />
          <meshStandardMaterial color="#191129" roughness={0.7} metalness={0.3} />
        </mesh>
      ))}

      {/* Right margin: a bank of monitors on a stand. */}
      <group position={[10.8, 0, 2.5]} rotation={[0, -0.55, 0]}>
        <mesh position={[0, -1.2, 0]} castShadow>
          <boxGeometry args={[3.4, 0.25, 1.2]} />
          <meshStandardMaterial color="#241a3d" metalness={0.7} roughness={0.35} />
        </mesh>
        {[-1.1, 0, 1.1].map((x, i) => (
          <mesh key={i} position={[x, 0, 0]}>
            <boxGeometry args={[1, 0.65, 0.07]} />
            <meshStandardMaterial
              color="#0d0a18"
              emissive={['#7c3aed', '#a855f7', '#22d3ee'][i]}
              emissiveIntensity={0.8}
            />
          </mesh>
        ))}
      </group>

      <LightShaft position={[0, 5, -4]} radius={4} height={12} intensity={0.05} color="#a855f7" />
    </Station>
  );
}

/**
 * 06 — an archive: two tall banks of slabs flanking the route.
 *
 * The previous version scattered slabs across the whole frame, which washed out
 * the copy and read as debris. Ranking them into shelves either side reads as
 * stored knowledge, keeps the centre clear for the upload panel, and gives the
 * camera something to travel between.
 */
function KnowledgeStation() {
  const slots = useMemo(() => {
    const list: Array<{ p: [number, number, number]; side: number; seed: number }> = [];
    for (const side of [-1, 1]) {
      for (let col = 0; col < 4; col++) {
        for (let row = 0; row < 5; row++) {
          list.push({
            p: [side * (7.5 + col * 1.5), -1 + row * 1.9, 5 - col * 3.2],
            side,
            seed: col * 3 + row,
          });
        }
      }
    }
    return list;
  }, []);

  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame(() => {
    const mesh = meshRef.current;
    if (!mesh) return;
    const t = frame.time * (frame.reducedMotion ? 0.08 : 0.35);
    slots.forEach((s2, i) => {
      // Each slab eases in and out of its shelf, like something being filed.
      const slide = Math.sin(t + s2.seed * 0.9) * 0.35;
      dummy.position.set(s2.p[0] + slide * s2.side, s2.p[1], s2.p[2]);
      dummy.rotation.set(0, s2.side * 0.35, 0);
      dummy.scale.setScalar(1);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    });
    mesh.instanceMatrix.needsUpdate = true;
  });

  return (
    <Station index={5}>
      <instancedMesh
        ref={meshRef}
        args={[undefined, undefined, slots.length]}
        castShadow
        frustumCulled={false}
      >
        <boxGeometry args={[1.9, 1.4, 0.14]} />
        <meshStandardMaterial
          color="#160f28"
          emissive="#7c3aed"
          emissiveIntensity={0.22}
          roughness={0.5}
          metalness={0.4}
        />
      </instancedMesh>

      {/* Uprights, so the banks read as structure rather than floating tiles. */}
      {[-1, 1].map((side) =>
        [0, 1, 2, 3].map((col) => (
          <mesh key={`${side}-${col}`} position={[side * (7.5 + col * 1.5), 3, 5 - col * 3.2]}>
            <boxGeometry args={[0.12, 12, 0.12]} />
            <meshStandardMaterial color="#1a1130" emissive="#a78bfa" emissiveIntensity={0.4} />
          </mesh>
        )),
      )}

      <pointLight position={[0, 2, 6]} intensity={70} distance={20} color="#8b5cf6" />
      <pointLight position={[0, 4, -6]} intensity={60} distance={22} color="#6042d6" />
    </Station>
  );
}

/** 07 — the space opens out onto a skyline. */
function FinaleStation() {
  const towers = useMemo(
    () =>
      Array.from({ length: 40 }, (_, i) => ({
        x: (hashRandom(i * 3.7) - 0.5) * 90,
        z: -14 - hashRandom(i * 5.1) * 55,
        h: 6 + hashRandom(i * 7.9) * 30,
        w: 1.6 + hashRandom(i * 9.3) * 3,
      })),
    [],
  );

  return (
    <Station index={6} reach={2.2}>
      <mesh position={[0, -2.2, 0]} receiveShadow>
        <cylinderGeometry args={[7, 7.6, 0.5, 48]} />
        <meshStandardMaterial {...SURFACE} />
      </mesh>
      <mesh position={[0, -1.9, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <torusGeometry args={[6.8, 0.06, 8, 64]} />
        <meshStandardMaterial color="#1a1130" emissive="#a78bfa" emissiveIntensity={0.8} />
      </mesh>

      {/* Skyline. Far enough back that it parallaxes slowly and reads as scale. */}
      {towers.map((t, i) => (
        <mesh key={i} position={[t.x, t.h / 2 - 2.4, t.z]}>
          <boxGeometry args={[t.w, t.h, t.w]} />
          <meshStandardMaterial
            color="#0d0a18"
            emissive="#4c1d95"
            emissiveIntensity={0.28 + (i % 5) * 0.08}
            roughness={0.6}
          />
        </mesh>
      ))}

      <pointLight position={[0, 3, 6]} intensity={120} distance={26} color="#7c3aed" />
      <LightShaft position={[0, 6, -4]} radius={5} height={16} intensity={0.035} />
    </Station>
  );
}

export default function Stations() {
  return (
    <>
      <HeroStation />
      <PressureStation />
      <MeetStation />
      <RolesStation />
      <StudioStation />
      <KnowledgeStation />
      <FinaleStation />
    </>
  );
}
