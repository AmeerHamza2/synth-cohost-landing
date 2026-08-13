'use client';

/**
 * Placeholder SYN.
 *
 * There is no SYN GLB in this repository — every existing visual is a flat
 * render. Rather than fake the character with a billboard (which cannot blink,
 * cannot turn, and would share no interface with a real model), this builds an
 * *articulated* stand-in on a genuine bone hierarchy with genuine morph
 * targets, named to the conventions a production export will use.
 *
 * The consequence that matters: `useSynRig` drives this proxy through exactly
 * the same code path it will drive the real model through. When the rigged GLB
 * arrives, set `SYN_MODEL_URL` and delete nothing.
 *
 * It is styled to read as a hologram rather than a finished character, so the
 * outstanding art dependency stays visible instead of looking shipped.
 */

import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { RoleId } from '../stage/types';

const PURPLE = new THREE.Color('#7c3aed');
const PURPLE_SOFT = new THREE.Color('#b58af7');

/** Head-local positions, shared by the head geometry and the eye bones. */
const HEAD_OFFSET = new THREE.Vector3(0, 0.096, 0);
const EYE_LOCAL = { x: 0.038, y: 0.104, z: 0.076 };

interface Built {
  root: THREE.Group;
  headMesh: THREE.Mesh;
  eyeMeshes: THREE.Mesh[];
  disposables: Array<{ dispose: () => void }>;
}

/**
 * Add blendshapes to the head geometry.
 *
 * These are real `morphAttributes.position` channels with ARKit-convention
 * names, so `resolveRig` binds to them the same way it will bind to an
 * artist-authored face.
 */
function addFaceMorphs(geometry: THREE.BufferGeometry) {
  const position = geometry.attributes.position as THREE.BufferAttribute;
  const count = position.count;

  const makeChannel = (
    name: string,
    displace: (x: number, y: number, z: number) => [number, number, number],
  ) => {
    const array = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const x = position.getX(i);
      const y = position.getY(i);
      const z = position.getZ(i);
      const [dx, dy, dz] = displace(x, y, z);
      array[i * 3] = x + dx;
      array[i * 3 + 1] = y + dy;
      array[i * 3 + 2] = z + dz;
    }
    const attribute = new THREE.BufferAttribute(array, 3);
    attribute.name = name;
    return attribute;
  };

  // Eye centres expressed in head-mesh-local space.
  const eyeY = EYE_LOCAL.y - HEAD_OFFSET.y;
  const eyeZ = EYE_LOCAL.z;
  const lidRadius = 0.06;

  const lidFor = (side: 1 | -1) => (x: number, y: number, z: number) => {
    const dx = x - side * EYE_LOCAL.x;
    const dy = y - eyeY;
    const dz = z - eyeZ;
    const d = Math.sqrt(dx * dx + dy * dy + dz * dz);
    if (d > lidRadius) return [0, 0, 0] as [number, number, number];
    const falloff = 1 - d / lidRadius;
    return [0, -0.017 * falloff, 0.004 * falloff] as [number, number, number];
  };

  const jaw = (x: number, y: number, z: number): [number, number, number] => {
    // Everything below the mouth line swings down and slightly back.
    const t = THREE.MathUtils.clamp((eyeY - 0.045 - y) / 0.09, 0, 1);
    if (t <= 0) return [0, 0, 0];
    return [0, -0.026 * t, -0.006 * t * Math.max(0, z)];
  };

  const smile = (x: number, y: number, z: number): [number, number, number] => {
    const dy = y - (eyeY - 0.055);
    const t = Math.exp(-(dy * dy) / 0.0006) * THREE.MathUtils.clamp(z / 0.1, 0, 1);
    return [Math.sign(x) * 0.008 * t, 0.006 * t, 0];
  };

  const brow = (x: number, y: number, z: number): [number, number, number] => {
    const dy = y - (eyeY + 0.03);
    const t = Math.exp(-(dy * dy) / 0.0004) * THREE.MathUtils.clamp(z / 0.1, 0, 1);
    return [0, 0.009 * t, 0.002 * t];
  };

  geometry.morphAttributes.position = [
    makeChannel('eyeBlinkLeft', lidFor(1)),
    makeChannel('eyeBlinkRight', lidFor(-1)),
    makeChannel('jawOpen', jaw),
    makeChannel('mouthSmile', smile),
    makeChannel('browInnerUp', brow),
  ];
  geometry.morphTargetsRelative = false;
}

function build(): Built {
  const disposables: Array<{ dispose: () => void }> = [];
  const track = <T extends { dispose: () => void }>(item: T) => {
    disposables.push(item);
    return item;
  };

  const body = track(
    new THREE.MeshStandardMaterial({
      color: '#1b1230',
      emissive: PURPLE,
      emissiveIntensity: 0.32,
      roughness: 0.42,
      metalness: 0.18,
      transparent: true,
      opacity: 0.94,
    }),
  );

  const accent = track(
    new THREE.MeshStandardMaterial({
      color: '#2a1a4a',
      emissive: PURPLE_SOFT,
      emissiveIntensity: 0.85,
      roughness: 0.25,
      metalness: 0.3,
    }),
  );

  const eyeMaterial = track(
    new THREE.MeshStandardMaterial({
      color: '#0a0812',
      emissive: '#d9c8ff',
      emissiveIntensity: 1.6,
      roughness: 0.1,
    }),
  );

  const root = new THREE.Group();
  root.name = 'SynProxyRoot';

  const bone = (name: string, x: number, y: number, z: number) => {
    const b = new THREE.Bone();
    b.name = name;
    b.position.set(x, y, z);
    return b;
  };

  const limb = (
    radius: number,
    length: number,
    material: THREE.Material,
    taper = 0.85,
  ) => {
    const geometry = track(
      new THREE.CapsuleGeometry(radius, Math.max(length - radius * 2, 0.01), 4, 10),
    );
    const mesh = new THREE.Mesh(geometry, material);
    // Capsules are built around the origin; shift so the joint sits at the top.
    mesh.position.y = -length / 2;
    mesh.scale.z = taper;
    mesh.castShadow = true;
    return mesh;
  };

  // ------------------------------------------------------------------ spine
  const hips = bone('Hips', 0, 0.94, 0);
  const spine = bone('Spine', 0, 0.11, 0);
  const chest = bone('Chest', 0, 0.15, 0);
  const neck = bone('Neck', 0, 0.17, 0);
  const head = bone('Head', 0, 0.075, 0);

  root.add(hips);
  hips.add(spine);
  spine.add(chest);
  chest.add(neck);
  neck.add(head);

  const pelvisGeometry = track(new THREE.CapsuleGeometry(0.105, 0.05, 4, 12));
  const pelvis = new THREE.Mesh(pelvisGeometry, body);
  pelvis.scale.set(1, 0.8, 0.72);
  pelvis.castShadow = true;
  hips.add(pelvis);

  const torsoGeometry = track(new THREE.CapsuleGeometry(0.118, 0.16, 4, 14));
  const torso = new THREE.Mesh(torsoGeometry, body);
  torso.position.y = 0.02;
  torso.scale.set(1, 1, 0.66);
  torso.castShadow = true;
  chest.add(torso);

  // Yoke across the top of the chest. Without it the shoulders read as narrower
  // than the head and the whole figure looks like a bobblehead.
  const yokeGeometry = track(new THREE.CapsuleGeometry(0.056, 0.2, 4, 12));
  const yoke = new THREE.Mesh(yokeGeometry, body);
  yoke.rotation.z = Math.PI / 2;
  yoke.position.y = 0.15;
  yoke.scale.set(1, 1, 0.72);
  yoke.castShadow = true;
  chest.add(yoke);

  const neckGeometry = track(new THREE.CylinderGeometry(0.032, 0.042, 0.07, 10));
  const neckMesh = new THREE.Mesh(neckGeometry, body);
  neckMesh.position.y = 0.03;
  neck.add(neckMesh);

  // ------------------------------------------------------------------- head
  const headGeometry = track(new THREE.SphereGeometry(0.097, 28, 22));
  headGeometry.scale(0.92, 1.16, 1);
  addFaceMorphs(headGeometry);

  const headMesh = new THREE.Mesh(headGeometry, body);
  headMesh.name = 'SynHead';
  headMesh.position.copy(HEAD_OFFSET);
  headMesh.castShadow = true;
  headMesh.updateMorphTargets(); // builds morphTargetDictionary + influences
  head.add(headMesh);

  // Eye bones sit where the eyes are, so the driver can aim them directly.
  const eyeLeft = bone('LeftEye', EYE_LOCAL.x, EYE_LOCAL.y, EYE_LOCAL.z);
  const eyeRight = bone('RightEye', -EYE_LOCAL.x, EYE_LOCAL.y, EYE_LOCAL.z);
  head.add(eyeLeft, eyeRight);

  const eyeGeometry = track(new THREE.SphereGeometry(0.0135, 14, 12));
  const eyeMeshes = [eyeLeft, eyeRight].map((eyeBone) => {
    const mesh = new THREE.Mesh(eyeGeometry, eyeMaterial);
    mesh.position.z = 0.01;
    mesh.scale.set(1.15, 1.15, 0.6);
    eyeBone.add(mesh);
    return mesh;
  });

  // A visor reads as "synthetic" and hides the fact that the proxy has no face.
  // A band across the eye line. Reads as "synthetic" and gives the otherwise
  // featureless head an orientation you can actually see it turn.
  const visorGeometry = track(new THREE.CapsuleGeometry(0.026, 0.1, 4, 12));
  const visorMaterial = track(
    new THREE.MeshStandardMaterial({
      color: '#120a24',
      emissive: PURPLE,
      emissiveIntensity: 0.7,
      roughness: 0.12,
      metalness: 0.65,
      transparent: true,
      opacity: 0.72,
    }),
  );
  const visor = new THREE.Mesh(visorGeometry, visorMaterial);
  visor.rotation.z = Math.PI / 2;
  visor.position.set(0, EYE_LOCAL.y, 0.05);
  visor.scale.set(1, 1, 0.62);
  head.add(visor);

  // ------------------------------------------------------------------- arms
  const buildArm = (side: 1 | -1) => {
    const label = side === 1 ? 'Left' : 'Right';
    const shoulder = bone(`${label}Shoulder`, side * 0.06, 0.155, 0);
    const upper = bone(`${label}Arm`, side * 0.115, -0.012, 0);
    const fore = bone(`${label}ForeArm`, 0, -0.26, 0);
    const hand = bone(`${label}Hand`, 0, -0.24, 0);

    chest.add(shoulder);
    shoulder.add(upper);
    upper.add(fore);
    fore.add(hand);

    const deltoidGeometry = track(new THREE.SphereGeometry(0.046, 12, 10));
    const deltoid = new THREE.Mesh(deltoidGeometry, body);
    upper.add(deltoid);

    upper.add(limb(0.042, 0.26, body));
    fore.add(limb(0.034, 0.24, body));

    const handGeometry = track(new THREE.SphereGeometry(0.038, 12, 10));
    const handMesh = new THREE.Mesh(handGeometry, body);
    handMesh.scale.set(0.8, 1.05, 0.55);
    hand.add(handMesh);

    // Resting pose: arms hanging close to the body and slightly forward, with a
    // little elbow flexion. Negative Z draws the arm inward on the left side and
    // the sign flips on the right, hence `-side`.
    upper.rotation.z = -side * 0.09;
    upper.rotation.x = 0.07;
    fore.rotation.x = -0.11;

    return { shoulder, upper, fore, hand };
  };

  const armLeft = buildArm(1);
  const armRight = buildArm(-1);

  // ------------------------------------------------------------------- legs
  const buildLeg = (side: 1 | -1) => {
    const label = side === 1 ? 'Left' : 'Right';
    const up = bone(`${label}UpLeg`, side * 0.075, -0.02, 0);
    const lower = bone(`${label}Leg`, 0, -0.42, 0);
    const foot = bone(`${label}Foot`, 0, -0.42, 0);

    hips.add(up);
    up.add(lower);
    lower.add(foot);

    up.add(limb(0.056, 0.42, body));
    lower.add(limb(0.042, 0.42, body));

    const footGeometry = track(new THREE.BoxGeometry(0.075, 0.045, 0.17));
    const footMesh = new THREE.Mesh(footGeometry, accent);
    footMesh.position.set(0, 0.02, 0.045);
    foot.add(footMesh);

    return { up, lower, foot };
  };

  buildLeg(1);
  buildLeg(-1);

  // -------------------------------------------------------- role accessories
  // Tagged with `userData.variant` so `applyVariant` can swap them per role.
  // A production GLB carries its own outfit meshes tagged the same way.
  const addVariant = (parent: THREE.Object3D, mesh: THREE.Object3D, variant: RoleId) => {
    mesh.userData.variant = variant;
    mesh.visible = false;
    parent.add(mesh);
  };

  // Educator: a floating slate beside the hand.
  const slateGeometry = track(new THREE.BoxGeometry(0.2, 0.14, 0.008));
  const slate = new THREE.Mesh(slateGeometry, accent);
  slate.position.set(0.16, -0.02, 0.12);
  slate.rotation.set(-0.3, -0.4, 0.1);
  addVariant(armLeft.hand, slate, 'educator');

  // Moderator: shoulder guards.
  const guardGeometry = track(new THREE.SphereGeometry(0.062, 12, 10, 0, Math.PI * 2, 0, Math.PI / 2));
  const guardLeft = new THREE.Mesh(guardGeometry, accent);
  guardLeft.position.y = 0.01;
  addVariant(armLeft.upper, guardLeft, 'moderator');
  const guardRight = new THREE.Mesh(guardGeometry, accent);
  guardRight.position.y = 0.01;
  addVariant(armRight.upper, guardRight, 'moderator');

  // Interviewer: handheld mic.
  const micGroup = new THREE.Group();
  const micBody = track(new THREE.CylinderGeometry(0.014, 0.014, 0.11, 10));
  const micHead = track(new THREE.SphereGeometry(0.026, 12, 10));
  micGroup.add(new THREE.Mesh(micBody, accent));
  const micTop = new THREE.Mesh(micHead, eyeMaterial);
  micTop.position.y = 0.062;
  micGroup.add(micTop);
  micGroup.position.set(0, -0.05, 0.05);
  micGroup.rotation.x = -0.5;
  addVariant(armRight.hand, micGroup, 'interviewer');

  // Research assistant: a data visor ring around the head.
  const ringGeometry = track(new THREE.TorusGeometry(0.125, 0.007, 8, 32));
  const ring = new THREE.Mesh(ringGeometry, accent);
  ring.position.copy(HEAD_OFFSET);
  ring.rotation.x = Math.PI / 2.3;
  addVariant(head, ring, 'researcher');

  // Companion: a soft mantle across the shoulders.
  const mantleGeometry = track(
    new THREE.SphereGeometry(0.165, 18, 14, 0, Math.PI * 2, 0, Math.PI / 2.6),
  );
  const mantleMaterial = track(
    new THREE.MeshStandardMaterial({
      color: '#3b2566',
      emissive: PURPLE_SOFT,
      emissiveIntensity: 0.3,
      roughness: 0.8,
      transparent: true,
      opacity: 0.85,
      side: THREE.DoubleSide,
    }),
  );
  const mantle = new THREE.Mesh(mantleGeometry, mantleMaterial);
  mantle.position.y = 0.09;
  mantle.scale.set(1, 0.85, 0.8);
  addVariant(chest, mantle, 'companion');

  return { root, headMesh, eyeMeshes, disposables };
}

export interface SynProxyProps {
  /** Called once the object graph exists so the parent can resolve the rig. */
  onBuilt?: (root: THREE.Object3D) => void;
}

export default function SynProxy({ onBuilt }: SynProxyProps) {
  const built = useMemo(() => build(), []);
  const blinkIndex = useRef<{ left: number; right: number }>({ left: -1, right: -1 });

  useEffect(() => {
    const dictionary = built.headMesh.morphTargetDictionary ?? {};
    blinkIndex.current = {
      left: dictionary.eyeBlinkLeft ?? -1,
      right: dictionary.eyeBlinkRight ?? -1,
    };
    onBuilt?.(built.root);
  }, [built, onBuilt]);

  useEffect(() => {
    return () => {
      for (const item of built.disposables) item.dispose();
    };
  }, [built]);

  // Presentation-only: mirror the blink morph onto the eye meshes so the blink
  // is legible on a proxy that has no eyelid geometry. A real model does this
  // through its own blendshapes and this loop simply finds nothing to do.
  useFrame(() => {
    const influences = built.headMesh.morphTargetInfluences;
    if (!influences) return;
    const { left, right } = blinkIndex.current;
    const lids = [left, right];
    built.eyeMeshes.forEach((mesh, i) => {
      const index = lids[i];
      if (index < 0) return;
      const closed = influences[index] ?? 0;
      mesh.scale.y = 1.15 * (1 - closed * 0.94);
    });
  });

  return <primitive object={built.root} />;
}
