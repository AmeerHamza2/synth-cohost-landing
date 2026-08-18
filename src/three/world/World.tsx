'use client';

/**
 * The world.
 *
 * One continuous 3D space that the whole page takes place inside. Seven
 * *stations* are laid out along it in a line; scrolling flies the camera from
 * one to the next, and the DOM copy rides on top as an overlay.
 *
 * This is the difference between a 3D website and a 2D one with effects: the
 * geometry is really there, it has volume, it is really lit, and moving through
 * it reveals parallax you could not fake — near objects sweep past, far ones
 * barely move, and things occlude each other because they are actually in
 * front of one another.
 */

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { MeshReflectorMaterial } from '@react-three/drei';
import { frame, damp, NARROW_WIDTH } from '../stage/frame';
import { hashRandom } from '../scenes/shared';
import { focus } from './focus';

/** Distance between stations, in world units. */
export const STATION_GAP = 22;

/** Where a station sits along the journey. */
export const stationZ = (index: number) => -index * STATION_GAP;

/**
 * The ground.
 *
 * A single large plane with a grid worked into the shader rather than geometry,
 * so it stays sharp at any distance and costs one draw call. The grid is what
 * makes the movement legible — without a reference surface, flying through a
 * dark space reads as nothing moving at all.
 */
function Ground({ reflect }: { reflect: boolean }) {
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        uniforms: {
          uColor: { value: new THREE.Color('#7c3aed') },
          uFade: { value: 150 },
          uCam: { value: new THREE.Vector3() },
        },
        vertexShader: /* glsl */ `
          varying vec3 vWorld;
          void main() {
            vec4 world = modelMatrix * vec4(position, 1.0);
            vWorld = world.xyz;
            gl_Position = projectionMatrix * viewMatrix * world;
          }
        `,
        fragmentShader: /* glsl */ `
          uniform vec3 uColor;
          uniform float uFade;
          uniform vec3 uCam;
          varying vec3 vWorld;

          // Analytic grid: thickness stays constant on screen no matter how far
          // away the floor is, which a texture cannot do without mipmap mush.
          float grid(vec2 p, float scale) {
            vec2 c = p / scale;
            vec2 d = fwidth(c);
            vec2 g = abs(fract(c - 0.5) - 0.5) / max(d, vec2(0.0001));
            return 1.0 - min(min(g.x, g.y), 1.0);
          }

          void main() {
            float fine = grid(vWorld.xz, 2.0) * 0.35;
            float coarse = grid(vWorld.xz, 10.0) * 0.6;
            float line = max(fine, coarse);

            // Fade with distance so the plane never shows a hard edge.
            float dist = length(vWorld.xz - uCam.xz);
            float falloff = 1.0 - smoothstep(uFade * 0.25, uFade, dist);

            float alpha = line * falloff * 0.55;
            if (alpha < 0.002) discard;
            gl_FragColor = vec4(uColor, alpha);
          }
        `,
      }),
    [],
  );

  useFrame((state) => {
    material.uniforms.uCam.value.copy(state.camera.position);
  });

  return (
    <group>
      {/* Reflective base. Real reflections of the station geometry are what
          stop a dark floor reading as an empty void, and they double the
          apparent amount of geometry in the scene for one extra pass. */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.45, 0]} frustumCulled={false}>
        <planeGeometry args={[400, 400]} />
        <MeshReflectorMaterial
          resolution={reflect ? 1024 : 256}
          mixBlur={1.1}
          mixStrength={reflect ? 34 : 14}
          blur={[420, 120]}
          depthScale={1.1}
          minDepthThreshold={0.4}
          maxDepthThreshold={1.35}
          mirror={0.65}
          color="#0a0714"
          metalness={0.75}
          roughness={0.72}
        />
      </mesh>

      {/* Grid, laid over the reflection. */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.4, 0]} frustumCulled={false}>
        <planeGeometry args={[400, 400]} />
        <primitive object={material} attach="material" />
      </mesh>
    </group>
  );
}

/**
 * Light shafts.
 *
 * Cones of additive geometry standing in for volumetric light. Real volumetrics
 * mean a raymarch pass and a depth prepass; at this scale the cones are
 * indistinguishable and cost a handful of triangles.
 */
export function LightShaft({
  position,
  color = '#8b5cf6',
  height = 14,
  radius = 3.4,
  intensity = 0.05,
}: {
  position: [number, number, number];
  color?: string;
  height?: number;
  radius?: number;
  intensity?: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const worldPos = useRef(new THREE.Vector3());

  useFrame((state) => {
    const mesh = meshRef.current;
    if (!mesh) return;
    // Slow breathe, so the beam feels like it is passing through air.
    const t = frame.time * (frame.reducedMotion ? 0.15 : 0.5);
    // Fade the beam out as the camera gets close: a cone you are standing
    // inside fills the screen with flat colour, which is what makes a shaft
    // read as a pale wedge rather than as light in the air.
    const dist = state.camera.position.distanceTo(mesh.getWorldPosition(worldPos.current));
    const near = Math.min(1, Math.max(0, (dist - 3) / 9));
    (mesh.material as THREE.MeshBasicMaterial).opacity =
      intensity * near * (0.75 + Math.sin(t + position[0]) * 0.25);
  });

  return (
    <mesh ref={meshRef} position={position}>
      <coneGeometry args={[radius, height, 24, 1, true]} />
      <meshBasicMaterial
        color={color}
        transparent
        opacity={intensity}
        side={THREE.DoubleSide}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}

/**
 * Drifting dust through the whole world.
 *
 * Spread across the full journey rather than per section, so it is continuous
 * as the camera travels and gives every movement something to parallax against.
 */
function WorldDust({ count }: { count: number }) {
  const pointsRef = useRef<THREE.Points>(null);

  const geometry = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const span = STATION_GAP * 7;
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (hashRandom(i * 3.1) - 0.5) * 60;
      positions[i * 3 + 1] = (hashRandom(i * 7.7) - 0.5) * 22;
      positions[i * 3 + 2] = -hashRandom(i * 11.3) * span;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return g;
  }, [count]);

  useFrame(() => {
    const points = pointsRef.current;
    if (!points) return;
    points.rotation.y = frame.time * (frame.reducedMotion ? 0.002 : 0.008);
  });

  return (
    <points ref={pointsRef} geometry={geometry} frustumCulled={false}>
      <pointsMaterial
        size={0.09}
        sizeAttenuation
        color="#c4b5fd"
        transparent
        opacity={0.5}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

/**
 * The camera, flying the journey.
 *
 * Position comes from `frame.journey`, so it is tied to the reader's scroll
 * rather than a timeline. The slight lateral weave and the look-ahead are what
 * stop it feeling like a slider: a camera that only ever moves dead straight
 * reads as a scrolling background.
 */
function FlyCamera() {
  const look = useRef(new THREE.Vector3());

  useFrame((state, rawDelta) => {
    const dt = Math.min(rawDelta, 0.05);
    const j = frame.journey;
    const calm = frame.reducedMotion;

    // On a phone the frame is tall and narrow, so the same camera shows a thin
    // slice of each station and everything reads as a close-up. Widen the lens
    // and stand further back, and reduce the weave — lateral movement that
    // feels cinematic on a wide screen just throws the subject off a narrow one.
    const narrow = frame.viewport.width < NARROW_WIDTH;
    const camera = state.camera as THREE.PerspectiveCamera;
    if (camera.isPerspectiveCamera) {
      const wantFov = narrow ? 68 : 52;
      if (Math.abs(camera.fov - wantFov) > 0.1) {
        camera.fov = damp(camera.fov, wantFov, 4, dt);
        camera.updateProjectionMatrix();
      }
    }

    // Weave gently through the space rather than travelling on rails.
    const weave = Math.sin(j * 0.9) * (narrow ? 1.1 : 2.6);
    const rise = Math.sin(j * 0.6 + 1.2) * (narrow ? 0.5 : 0.9);

    // Narrow frames track the subject; wide frames are free to compose the
    // whole set, because they can actually show it.
    // On narrow the camera stands to the *left* of the subject, which puts her
    // in the right of the frame — the column the mobile layout leaves open,
    // with the copy running down the left.
    const targetX = narrow
      ? focus.x - 1.9 + (calm ? 0 : frame.pointer.x * 0.3)
      : weave + (calm ? 0 : frame.pointer.x * 0.9);
    const targetY = (narrow ? 1.5 : 1.1) + rise + (calm ? 0 : frame.pointer.y * 0.5);
    const targetZ = stationZ(j) + (narrow ? 11 : 9.5);

    const cam = state.camera;
    cam.position.x = damp(cam.position.x, targetX, 3, dt);
    cam.position.y = damp(cam.position.y, targetY, 3, dt);
    // Z tracks scroll tightly: lag here reads as the page fighting the reader.
    cam.position.z = damp(cam.position.z, targetZ, 9, dt);

    // Look ahead into the space, not at a fixed point.
    look.current.set(
      narrow ? focus.x - 1.9 : Math.sin(j * 0.9 + 0.8) * 1.8,
      (narrow ? 1.1 : 0.6) + Math.sin(j * 0.5) * 0.5,
      stationZ(j) - 6,
    );
    cam.lookAt(look.current);
  });

  return null;
}

export interface WorldProps {
  /** Scales dust and shaft counts to the rendering budget. */
  density: number;
  /** Full-resolution floor reflections. The costliest thing in the scene. */
  reflect: boolean;
  children?: React.ReactNode;
}

export default function World({ density, reflect, children }: WorldProps) {
  return (
    <>
      <FlyCamera />
      {/* Depth cue: distant geometry dissolves rather than popping at the far
          plane, which is most of what makes a space feel big. */}
      <fogExp2 attach="fog" args={['#07060f', 0.018]} />
      <Ground reflect={reflect} />
      <WorldDust count={Math.max(120, Math.round(650 * density))} />
      {children}
    </>
  );
}
