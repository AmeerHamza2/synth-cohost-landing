'use client';

/**
 * Rig resolution.
 *
 * The animation driver never reaches for a specific mesh or bone object — it
 * asks for a *logical* joint ("head", "eyeLeft") or a *logical* morph
 * ("blinkLeft"), and this module maps that onto whatever the loaded model
 * actually calls it. Aliases cover the conventions a GLB is realistically
 * exported with: Mixamo, VRM (`J_Bip_*` / `Fcl_*`), ARKit blendshapes, and
 * plain Blender/Maya naming.
 *
 * Consequence: the placeholder proxy and a production SYN model are driven by
 * identical code. Anything a model does not provide resolves to `null` and the
 * driver silently skips it rather than throwing.
 */

import * as THREE from 'three';

export type JointName =
  | 'hips'
  | 'spine'
  | 'chest'
  | 'neck'
  | 'head'
  | 'eyeLeft'
  | 'eyeRight'
  | 'shoulderLeft'
  | 'shoulderRight'
  | 'armLeft'
  | 'armRight'
  | 'forearmLeft'
  | 'forearmRight';

export type MorphName =
  | 'blinkLeft'
  | 'blinkRight'
  | 'mouthOpen'
  | 'mouthSmile'
  | 'browUp';

const JOINT_ALIASES: Record<JointName, string[]> = {
  hips: ['Hips', 'hips', 'mixamorigHips', 'J_Bip_C_Hips', 'Bip01_Pelvis', 'pelvis'],
  spine: ['Spine', 'spine', 'mixamorigSpine', 'J_Bip_C_Spine', 'Bip01_Spine'],
  chest: [
    'Chest',
    'UpperChest',
    'Spine2',
    'Spine1',
    'mixamorigSpine2',
    'mixamorigSpine1',
    'J_Bip_C_Chest',
    'J_Bip_C_UpperChest',
  ],
  neck: ['Neck', 'neck', 'mixamorigNeck', 'J_Bip_C_Neck', 'Bip01_Neck'],
  head: ['Head', 'head', 'mixamorigHead', 'J_Bip_C_Head', 'Bip01_Head'],
  eyeLeft: ['LeftEye', 'eye_L', 'Eye_L', 'mixamorigLeftEye', 'J_Adj_L_FaceEye'],
  eyeRight: ['RightEye', 'eye_R', 'Eye_R', 'mixamorigRightEye', 'J_Adj_R_FaceEye'],
  shoulderLeft: ['LeftShoulder', 'mixamorigLeftShoulder', 'J_Bip_L_Shoulder'],
  shoulderRight: ['RightShoulder', 'mixamorigRightShoulder', 'J_Bip_R_Shoulder'],
  armLeft: ['LeftArm', 'UpperArm_L', 'mixamorigLeftArm', 'J_Bip_L_UpperArm'],
  armRight: ['RightArm', 'UpperArm_R', 'mixamorigRightArm', 'J_Bip_R_UpperArm'],
  forearmLeft: ['LeftForeArm', 'LowerArm_L', 'mixamorigLeftForeArm', 'J_Bip_L_LowerArm'],
  forearmRight: ['RightForeArm', 'LowerArm_R', 'mixamorigRightForeArm', 'J_Bip_R_LowerArm'],
};

const MORPH_ALIASES: Record<MorphName, string[]> = {
  blinkLeft: ['eyeBlinkLeft', 'eyeBlink_L', 'blinkLeft', 'blink_l', 'Fcl_EYE_Close_L', 'blink'],
  blinkRight: ['eyeBlinkRight', 'eyeBlink_R', 'blinkRight', 'blink_r', 'Fcl_EYE_Close_R', 'blink'],
  mouthOpen: ['jawOpen', 'mouthOpen', 'viseme_aa', 'Fcl_MTH_A', 'A'],
  mouthSmile: ['mouthSmile', 'mouthSmileLeft', 'Fcl_MTH_Joy', 'smile'],
  browUp: ['browInnerUp', 'browUp', 'Fcl_BRW_Joy', 'brow_up'],
};

interface MorphBinding {
  influences: number[];
  index: number;
}

export interface RestPose {
  quaternion: THREE.Quaternion;
  position: THREE.Vector3;
  scale: THREE.Vector3;
}

export interface SynRig {
  root: THREE.Object3D;
  joints: Partial<Record<JointName, THREE.Object3D>>;
  rest: Partial<Record<JointName, RestPose>>;
  /** Logical morph name -> every mesh channel that should receive it. */
  morphs: Partial<Record<MorphName, MorphBinding[]>>;
  /** Meshes exposing an `outfit` variant, keyed by the variant they belong to. */
  variants: Map<string, THREE.Object3D[]>;
  setMorph: (name: MorphName, value: number) => void;
  hasMorph: (name: MorphName) => boolean;
  animations: THREE.AnimationClip[];
}

function findJoint(root: THREE.Object3D, aliases: string[]): THREE.Object3D | undefined {
  for (const name of aliases) {
    const found = root.getObjectByName(name);
    if (found) return found;
  }
  // Fall back to a case-insensitive exact match — some exporters lowercase.
  const wanted = new Set(aliases.map((a) => a.toLowerCase()));
  let hit: THREE.Object3D | undefined;
  root.traverse((child) => {
    if (!hit && wanted.has(child.name.toLowerCase())) hit = child;
  });
  return hit;
}

/**
 * Walk the model once and build the logical rig.
 *
 * Also records the rest pose of every joint, because the driver applies its
 * rotations as offsets from rest rather than absolute values — that is what
 * lets a hand-built proxy and an artist-posed GLB behave the same.
 */
export function resolveRig(
  root: THREE.Object3D,
  animations: THREE.AnimationClip[] = [],
): SynRig {
  const joints: Partial<Record<JointName, THREE.Object3D>> = {};
  const rest: Partial<Record<JointName, RestPose>> = {};

  for (const key of Object.keys(JOINT_ALIASES) as JointName[]) {
    const joint = findJoint(root, JOINT_ALIASES[key]);
    if (!joint) continue;
    joints[key] = joint;
    rest[key] = {
      quaternion: joint.quaternion.clone(),
      position: joint.position.clone(),
      scale: joint.scale.clone(),
    };
  }

  const morphs: Partial<Record<MorphName, MorphBinding[]>> = {};
  const variants = new Map<string, THREE.Object3D[]>();

  root.traverse((child) => {
    const variant = child.userData?.variant;
    if (typeof variant === 'string') {
      const list = variants.get(variant) ?? [];
      list.push(child);
      variants.set(variant, list);
    }

    const mesh = child as THREE.Mesh;
    const dictionary = mesh.morphTargetDictionary;
    const influences = mesh.morphTargetInfluences;
    if (!dictionary || !influences) return;

    for (const key of Object.keys(MORPH_ALIASES) as MorphName[]) {
      for (const alias of MORPH_ALIASES[key]) {
        const index = dictionary[alias];
        if (index === undefined) continue;
        const list = morphs[key] ?? [];
        list.push({ influences, index });
        morphs[key] = list;
        break;
      }
    }
  });

  const setMorph = (name: MorphName, value: number) => {
    const bindings = morphs[name];
    if (!bindings) return;
    const clamped = value < 0 ? 0 : value > 1 ? 1 : value;
    for (const binding of bindings) binding.influences[binding.index] = clamped;
  };

  return {
    root,
    joints,
    rest,
    morphs,
    variants,
    setMorph,
    hasMorph: (name) => Boolean(morphs[name]?.length),
    animations,
  };
}

/**
 * Rotate a joint to `rest * euler`. Every driver rotation goes through here so
 * an artist's rest pose is respected instead of overwritten.
 */
const _offset = new THREE.Quaternion();
const _euler = new THREE.Euler();

export function setJointOffset(
  rig: SynRig,
  name: JointName,
  x: number,
  y: number,
  z: number,
) {
  const joint = rig.joints[name];
  const restPose = rig.rest[name];
  if (!joint || !restPose) return;
  _euler.set(x, y, z, 'YXZ');
  _offset.setFromEuler(_euler);
  joint.quaternion.copy(restPose.quaternion).multiply(_offset);
}

/** Show only the meshes belonging to `variant`; hide every other variant. */
export function applyVariant(rig: SynRig, variant: string) {
  rig.variants.forEach((objects, key) => {
    const visible = key === variant;
    for (const object of objects) object.visible = visible;
  });
}
