'use client';

/**
 * The single SYN instance.
 *
 * Mounted once for the lifetime of the canvas and never per-section. Scenes
 * push a `SynDirective` and this component eases toward it, which is what gives
 * the page the feeling of one character moving through a story rather than
 * seven separate visuals.
 */

import { Suspense, lazy, useCallback, useEffect, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { damp } from '../stage/frame';
import { useStage } from '../stage/store';
import { SYN_MODEL_URL } from './config';
import { director } from './director';
import { applyVariant, resolveRig, type SynRig } from './rig';
import SynProxy from './SynProxy';
import { useSynRig } from './useSynRig';

// Only pulled into the bundle when a production model actually exists.
const SynModel = SYN_MODEL_URL
  ? lazy(() => import('./SynModel'))
  : null;

export default function SynStage() {
  const groupRef = useRef<THREE.Group>(null);
  const rigRef = useRef<SynRig | null>(null);
  const [rigVersion, forceRender] = useState(0);

  // Costume. The roles section is the only place SYN wears one, and it is a
  // visibility toggle over meshes the single model already carries — the whole
  // point of "one personality, many roles" is that it is never a second model.
  const role = useStage((s) => s.role);
  const inRoles = useStage((s) => s.active === 'roles');

  useEffect(() => {
    const rig = rigRef.current;
    if (!rig) return;
    // An id no variant uses hides every costume piece at once.
    applyVariant(rig, inRoles ? role : '__none__');
  }, [role, inRoles, rigVersion]);

  const handleBuilt = useCallback(
    (root: THREE.Object3D, animations: THREE.AnimationClip[] = []) => {
      rigRef.current = resolveRig(root, animations);
      // One render so the rig-dependent subtree (nothing today, but scenes may
      // attach to joints) sees a resolved rig.
      forceRender((n) => n + 1);
    },
    [],
  );

  // Mood, gaze, speech and yaw are sampled straight from the director inside
  // the rig's own frame loop, so none of them cost a render here.
  useSynRig(rigRef);

  const opacityRef = useRef(1);

  useFrame((_, rawDelta) => {
    const group = groupRef.current;
    if (!group) return;

    const dt = Math.min(rawDelta, 0.05);
    const t = director.target;
    const lambda = t.lambda;

    group.position.x = damp(group.position.x, t.position[0], lambda, dt);
    group.position.y = damp(group.position.y, t.position[1], lambda, dt);
    group.position.z = damp(group.position.z, t.position[2], lambda, dt);

    group.rotation.x = damp(group.rotation.x, t.rotation[0], lambda, dt);
    group.rotation.y = damp(group.rotation.y, t.rotation[1], lambda, dt);
    group.rotation.z = damp(group.rotation.z, t.rotation[2], lambda, dt);

    const scale = damp(group.scale.x, t.scale, lambda, dt);
    group.scale.setScalar(scale);

    const nextOpacity = damp(opacityRef.current, t.opacity, lambda, dt);
    if (Math.abs(nextOpacity - opacityRef.current) > 0.001) {
      opacityRef.current = nextOpacity;
      group.visible = nextOpacity > 0.01;
      group.traverse((child) => {
        const mesh = child as THREE.Mesh;
        const material = mesh.material as THREE.Material | THREE.Material[] | undefined;
        if (!material) return;
        const apply = (m: THREE.Material) => {
          // Reset rather than latch: leaving `transparent` on after she fades
          // back in would keep a dozen overlapping body parts in the sorted
          // transparent pass for the rest of the session.
          m.transparent = nextOpacity < 0.999;
          m.opacity = nextOpacity;
        };
        if (Array.isArray(material)) material.forEach(apply);
        else apply(material);
      });
    }
  });

  return (
    <group ref={groupRef} name="SynStage">
      {SynModel ? (
        <Suspense fallback={null}>
          <SynModel onBuilt={handleBuilt} />
        </Suspense>
      ) : (
        <SynProxy onBuilt={handleBuilt} />
      )}
    </group>
  );
}
