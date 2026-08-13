'use client';

/**
 * Production GLB branch.
 *
 * Only reached when `SYN_MODEL_URL` is set, and only *loaded* then — the module
 * is lazily imported by `SynStage`, so `GLTFLoader` never enters the bundle
 * while the project is running on the placeholder rig.
 *
 * If the model ships with its own animation clips, the first one is played as
 * an idle base layer and the procedural layers in `useSynRig` ride on top of
 * it. That is the normal way a character rig is built: baked body motion
 * underneath, reactive head/eye/breath on top.
 */

import { useEffect, useMemo } from 'react';
import { useAnimations, useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { SkeletonUtils } from 'three-stdlib';
import { SYN_MODEL_URL } from './config';

export interface SynModelProps {
  onBuilt?: (root: THREE.Object3D, animations: THREE.AnimationClip[]) => void;
}

export default function SynModel({ onBuilt }: SynModelProps) {
  // Non-null by construction: this component is only mounted when the URL is set.
  const gltf = useGLTF(SYN_MODEL_URL as string);

  // Clone so the cached GLTF is never mutated by our rig driver.
  const scene = useMemo(() => SkeletonUtils.clone(gltf.scene), [gltf.scene]);
  const { actions, names } = useAnimations(gltf.animations, scene);

  useEffect(() => {
    scene.traverse((child) => {
      const mesh = child as THREE.Mesh;
      if (mesh.isMesh) {
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        mesh.frustumCulled = false; // skinned bounds go stale under our offsets
      }
    });
    onBuilt?.(scene, gltf.animations);
  }, [scene, gltf.animations, onBuilt]);

  useEffect(() => {
    const idle =
      names.find((n) => /idle|breath|stand/i.test(n)) ?? names[0] ?? null;
    if (!idle) return;
    const action = actions[idle];
    action?.reset().fadeIn(0.4).play();
    return () => {
      action?.fadeOut(0.3);
    };
  }, [actions, names]);

  return <primitive object={scene} />;
}

if (SYN_MODEL_URL) useGLTF.preload(SYN_MODEL_URL);
