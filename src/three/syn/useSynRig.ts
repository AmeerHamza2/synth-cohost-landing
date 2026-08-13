'use client';

/**
 * The SYN animation state machine.
 *
 * Everything the brief asks for in section 1 — "subtle breathing, blinking,
 * small head movements, and eye/head tracking toward the cursor" — is produced
 * here procedurally, layered on top of whatever pose the model ships with:
 *
 *   rest pose  →  mood posture  →  breath  →  gaze  →  micro-motion  →  blink
 *
 * The layers are additive and none of them require the model to carry a single
 * animation clip. If a production GLB later arrives *with* clips, they blend in
 * underneath (see `SynPresence`) and these layers still ride on top, which is
 * how a real character rig is built.
 */

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { damp, frame } from '../stage/frame';
import { readStage } from '../stage/store';
import type { SynMood } from '../stage/types';
import { director } from './director';
import { setJointOffset, type SynRig } from './rig';

interface MoodPose {
  /** Additive joint offsets in radians, applied on top of the rest pose. */
  spine: [number, number, number];
  chest: [number, number, number];
  neck: [number, number, number];
  headTilt: number;
  /** Arms hang from the shoulder; positive z closes them toward the body. */
  armIn: number;
  shoulderLift: number;
  /** Breaths per second and how deep each one is. */
  breathRate: number;
  breathDepth: number;
  /** 0..1 — how strongly SYN follows the cursor in this mood. */
  gaze: number;
  /** Blinks per minute. */
  blinkRate: number;
  /** 0..1 — amplitude of restless micro-movement. */
  restlessness: number;
  /** 0..1 — resting smile. */
  warmth: number;
}

const MOODS: Record<SynMood, MoodPose> = {
  idle: {
    spine: [0.01, 0, 0],
    chest: [0, 0, 0],
    neck: [0.02, 0, 0],
    headTilt: 0.03,
    armIn: 0.06,
    shoulderLift: 0,
    breathRate: 0.24,
    breathDepth: 1,
    gaze: 1,
    blinkRate: 16,
    restlessness: 0.35,
    warmth: 0.25,
  },
  // Section 02 build-up: the environment is closing in and she feels it.
  overwhelmed: {
    spine: [0.07, 0, 0],
    chest: [0.05, 0, 0],
    neck: [0.09, 0, 0],
    headTilt: -0.02,
    armIn: 0.2,
    shoulderLift: 0.12,
    breathRate: 0.46,
    breathDepth: 1.55,
    gaze: 0.45,
    blinkRate: 30,
    restlessness: 1,
    warmth: 0,
  },
  // "What if you didn't have to stream alone?" — everything settles.
  focused: {
    spine: [-0.01, 0, 0],
    chest: [-0.02, 0, 0],
    neck: [0, 0, 0],
    headTilt: 0.02,
    armIn: 0.04,
    shoulderLift: -0.03,
    breathRate: 0.19,
    breathDepth: 0.85,
    gaze: 1,
    blinkRate: 12,
    restlessness: 0.18,
    warmth: 0.45,
  },
  presenting: {
    spine: [-0.04, 0, 0],
    chest: [-0.05, 0, 0],
    neck: [-0.02, 0, 0],
    headTilt: 0,
    armIn: 0,
    shoulderLift: -0.05,
    breathRate: 0.26,
    breathDepth: 1.1,
    gaze: 0.85,
    blinkRate: 14,
    restlessness: 0.3,
    warmth: 0.6,
  },
  listening: {
    spine: [0.02, 0, 0],
    chest: [0.01, 0, 0],
    neck: [0.04, 0, 0],
    headTilt: 0.08,
    armIn: 0.08,
    shoulderLift: 0,
    breathRate: 0.22,
    breathDepth: 0.9,
    gaze: 0.5,
    blinkRate: 18,
    restlessness: 0.25,
    warmth: 0.5,
  },
  thinking: {
    spine: [0.03, 0, 0],
    chest: [0.01, 0, 0],
    neck: [0.05, 0, 0],
    headTilt: 0.11,
    armIn: 0.1,
    shoulderLift: 0.02,
    breathRate: 0.2,
    breathDepth: 0.8,
    gaze: 0.25,
    blinkRate: 9,
    restlessness: 0.5,
    warmth: 0.15,
  },
  together: {
    spine: [-0.02, 0, 0],
    chest: [-0.03, 0, 0],
    neck: [0.01, 0, 0],
    headTilt: 0.04,
    armIn: 0.02,
    shoulderLift: -0.04,
    breathRate: 0.18,
    breathDepth: 0.95,
    gaze: 0.7,
    blinkRate: 12,
    restlessness: 0.15,
    warmth: 0.75,
  },
};

/** Mutable copy of a pose, used as the blend accumulator. */
function clonePose(pose: MoodPose): MoodPose {
  return {
    ...pose,
    spine: [...pose.spine] as [number, number, number],
    chest: [...pose.chest] as [number, number, number],
    neck: [...pose.neck] as [number, number, number],
  };
}

function blendPose(current: MoodPose, target: MoodPose, lambda: number, dt: number) {
  for (let i = 0; i < 3; i++) {
    current.spine[i] = damp(current.spine[i], target.spine[i], lambda, dt);
    current.chest[i] = damp(current.chest[i], target.chest[i], lambda, dt);
    current.neck[i] = damp(current.neck[i], target.neck[i], lambda, dt);
  }
  current.headTilt = damp(current.headTilt, target.headTilt, lambda, dt);
  current.armIn = damp(current.armIn, target.armIn, lambda, dt);
  current.shoulderLift = damp(current.shoulderLift, target.shoulderLift, lambda, dt);
  current.breathRate = damp(current.breathRate, target.breathRate, lambda, dt);
  current.breathDepth = damp(current.breathDepth, target.breathDepth, lambda, dt);
  current.gaze = damp(current.gaze, target.gaze, lambda, dt);
  current.blinkRate = damp(current.blinkRate, target.blinkRate, lambda, dt);
  current.restlessness = damp(current.restlessness, target.restlessness, lambda, dt);
  current.warmth = damp(current.warmth, target.warmth, lambda, dt);
}

/** Cheap deterministic noise. Three detuned sines read as organic drift. */
function noise(t: number, seed: number) {
  return (
    Math.sin(t * 0.9 + seed) * 0.5 +
    Math.sin(t * 1.73 + seed * 2.1) * 0.32 +
    Math.sin(t * 3.11 + seed * 4.7) * 0.18
  );
}

/**
 * Blink shape: fast close, slower open, which is what a real eyelid does.
 * `p` runs 0..1 across the blink.
 */
function blinkCurve(p: number) {
  if (p < 0.32) return p / 0.32;
  return 1 - (p - 0.32) / 0.68;
}

export interface SynRigOptions {
  /**
   * Overrides the mood the director is currently asking for. Only needed when
   * driving the rig outside the normal page flow (a test harness, say).
   */
  mood?: SynMood;
  gazeScale?: number;
  speaking?: boolean;
  bodyYaw?: number;
}

/**
 * Drive a rig.
 *
 * The per-frame inputs — mood, gaze weight, speaking, body yaw — are read from
 * the director inside `useFrame` rather than taken as props. That is what keeps
 * a mood change from costing a React render: the active scene writes into the
 * director every frame and this samples it.
 */
export function useSynRig(
  rigRef: React.RefObject<SynRig | null>,
  options: SynRigOptions = {},
) {
  const { mood: moodOverride } = options;

  const pose = useMemo(() => clonePose(MOODS.idle), []);
  const stateRef = useRef({
    breathPhase: 0,
    blinkTimer: 1.5,
    blinkProgress: -1,
    /** Occasionally blink twice; humans do. */
    blinkQueue: 0,
    gaze: new THREE.Vector2(),
    eyeGaze: new THREE.Vector2(),
    /** Saccade offset — eyes never sit perfectly still. */
    saccade: new THREE.Vector2(),
    saccadeTimer: 0.6,
    /** Chat-cue reaction: seconds remaining and which side to look at. */
    cueTime: 0,
    cueSide: 0,
    cueToken: 0,
    bodyYaw: 0,
    mouth: 0,
    /** Last mood seen, so a change can reset transient timers. */
    lastMood: 'idle' as SynMood,
  });

  useFrame((_, rawDelta) => {
    const rig = rigRef.current;
    if (!rig) return;

    const state = stateRef.current;
    const dt = Math.min(rawDelta, 0.05);
    const stage = readStage();
    const directive = director.target;

    const mood = moodOverride ?? directive.mood ?? stage.mood;
    const gazeScale = options.gazeScale ?? directive.gazeScale;
    const speaking = options.speaking ?? directive.speaking;
    const bodyYaw = options.bodyYaw ?? directive.bodyYaw;

    if (mood !== state.lastMood) {
      state.lastMood = mood;
      state.blinkTimer = 0.8;
      state.blinkProgress = -1;
    }

    const target = MOODS[mood] ?? MOODS.idle;
    const calm = frame.reducedMotion;

    blendPose(pose, target, 2.2, dt);

    // ---------------------------------------------------------------- breath
    state.breathPhase += dt * pose.breathRate * (calm ? 0.6 : 1);
    const breath = Math.sin(state.breathPhase * Math.PI * 2);
    // Inhale is quicker than exhale — squaring the positive half sells it.
    const breathShaped = breath > 0 ? Math.pow(breath, 0.7) : breath * 0.8;
    const depth = pose.breathDepth * (calm ? 0.5 : 1);

    const chest = rig.joints.chest;
    const chestRest = rig.rest.chest;
    if (chest && chestRest) {
      const swell = 1 + breathShaped * 0.022 * depth;
      chest.scale.set(
        chestRest.scale.x * swell,
        chestRest.scale.y * (1 + breathShaped * 0.012 * depth),
        chestRest.scale.z * swell,
      );
    }

    // -------------------------------------------------------------- chat cue
    if (stage.chatCue && stage.chatCue.token !== state.cueToken) {
      state.cueToken = stage.chatCue.token;
      state.cueSide = stage.chatCue.side;
      state.cueTime = 1.9;
      // A cue almost always triggers a blink as the eyes re-fixate.
      if (state.blinkProgress < 0) state.blinkTimer = Math.min(state.blinkTimer, 0.12);
    }
    if (state.cueTime > 0) state.cueTime = Math.max(0, state.cueTime - dt);

    // ----------------------------------------------------------------- gaze
    // Eyes lead, head follows. That lag is most of what reads as "alive".
    const cueStrength = state.cueTime > 0 ? Math.min(1, state.cueTime / 0.35) : 0;
    const pointerX = frame.pointerActive ? frame.pointer.x : 0;
    const pointerY = frame.pointerActive ? frame.pointer.y : 0;

    const gazeAmount = pose.gaze * gazeScale * (calm ? 0.35 : 1);
    const targetX = THREE.MathUtils.lerp(pointerX, state.cueSide * 0.85, cueStrength);
    const targetY = THREE.MathUtils.lerp(pointerY, -0.1, cueStrength);

    state.eyeGaze.x = damp(state.eyeGaze.x, targetX * gazeAmount, 14, dt);
    state.eyeGaze.y = damp(state.eyeGaze.y, targetY * gazeAmount, 14, dt);
    state.gaze.x = damp(state.gaze.x, targetX * gazeAmount, 3.4, dt);
    state.gaze.y = damp(state.gaze.y, targetY * gazeAmount, 3.4, dt);

    // Saccades: tiny jumps between fixation points, re-rolled every ~0.4-1.4s.
    state.saccadeTimer -= dt;
    if (state.saccadeTimer <= 0) {
      state.saccadeTimer = 0.4 + Math.random() * 1.0;
      const spread = calm ? 0.008 : 0.03;
      state.saccade.set(
        (Math.random() - 0.5) * spread,
        (Math.random() - 0.5) * spread * 0.6,
      );
    }

    // --------------------------------------------------------- micro-motion
    const t = frame.time;
    const restless = pose.restlessness * (calm ? 0.15 : 1);
    const driftX = noise(t * 0.5, 1.7) * 0.018 * restless;
    const driftY = noise(t * 0.42, 5.3) * 0.026 * restless;
    const driftZ = noise(t * 0.31, 9.1) * 0.014 * restless;

    // --------------------------------------------------------------- joints
    state.bodyYaw = damp(state.bodyYaw, bodyYaw, 4, dt);

    setJointOffset(
      rig,
      'hips',
      0,
      state.bodyYaw + state.gaze.x * 0.06,
      Math.sin(state.breathPhase * Math.PI * 2 * 0.5) * 0.008 * restless,
    );

    setJointOffset(
      rig,
      'spine',
      pose.spine[0] + breathShaped * 0.008 * depth,
      pose.spine[1] + state.gaze.x * 0.12,
      pose.spine[2] + driftZ,
    );

    setJointOffset(
      rig,
      'chest',
      pose.chest[0] - breathShaped * 0.012 * depth,
      pose.chest[1] + state.gaze.x * 0.1,
      pose.chest[2],
    );

    setJointOffset(
      rig,
      'neck',
      pose.neck[0] - state.gaze.y * 0.16 + driftX,
      pose.neck[1] + state.gaze.x * 0.2 + driftY * 0.4,
      pose.neck[2],
    );

    setJointOffset(
      rig,
      'head',
      -state.gaze.y * 0.3 + driftX * 1.4,
      state.gaze.x * 0.42 + driftY,
      pose.headTilt + state.gaze.x * 0.05 + driftZ * 1.6,
    );

    // Eyes get the remainder of the gaze the head could not cover, so extreme
    // cursor positions are followed by the eyes rather than an owl-like neck.
    const eyeX = (state.eyeGaze.x - state.gaze.x * 0.42) * 0.9 + state.saccade.x;
    const eyeY = (state.eyeGaze.y - state.gaze.y * 0.3) * 0.7 + state.saccade.y;
    const eyeYaw = THREE.MathUtils.clamp(eyeX, -0.5, 0.5);
    const eyePitch = THREE.MathUtils.clamp(-eyeY, -0.32, 0.32);
    setJointOffset(rig, 'eyeLeft', eyePitch, eyeYaw, 0);
    setJointOffset(rig, 'eyeRight', eyePitch, eyeYaw, 0);

    // Limbs hang from bones pointing down -Y. A positive Z rotation swings the
    // left arm *away* from the body, so drawing it in means negating on the
    // left and not on the right. Elbow flexion is X and bends forward on -X.
    const armSwing = breathShaped * 0.01 * depth;
    setJointOffset(rig, 'shoulderLeft', 0, 0, -pose.shoulderLift);
    setJointOffset(rig, 'shoulderRight', 0, 0, pose.shoulderLift);
    setJointOffset(rig, 'armLeft', driftX * 0.5, 0, -pose.armIn - armSwing);
    setJointOffset(rig, 'armRight', driftX * 0.5, 0, pose.armIn + armSwing);
    setJointOffset(rig, 'forearmLeft', -pose.armIn * 0.8, 0, 0);
    setJointOffset(rig, 'forearmRight', -pose.armIn * 0.8, 0, 0);

    // ---------------------------------------------------------------- blink
    if (state.blinkProgress >= 0) {
      state.blinkProgress += dt / 0.13;
      if (state.blinkProgress >= 1) {
        state.blinkProgress = -1;
        if (state.blinkQueue > 0) {
          state.blinkQueue -= 1;
          state.blinkTimer = 0.09;
        } else {
          const perSecond = pose.blinkRate / 60;
          // Poisson-ish spacing so the rhythm never becomes metronomic.
          state.blinkTimer = (0.55 + Math.random() * 1.6) / Math.max(perSecond, 0.05);
          if (Math.random() < 0.18) state.blinkQueue = 1;
        }
      }
    } else {
      state.blinkTimer -= dt;
      if (state.blinkTimer <= 0) state.blinkProgress = 0;
    }

    const blink = state.blinkProgress >= 0 ? blinkCurve(state.blinkProgress) : 0;
    // Looking sharply down narrows the lids a little, independent of blinking.
    const lidFollow = Math.max(0, -state.gaze.y) * 0.25;
    rig.setMorph('blinkLeft', Math.max(blink, lidFollow));
    rig.setMorph('blinkRight', Math.max(blink, lidFollow));

    // ---------------------------------------------------------------- mouth
    const mouthTarget = speaking
      ? 0.18 + Math.abs(noise(t * 6.2, 2.4)) * 0.42
      : 0;
    state.mouth = damp(state.mouth, mouthTarget, 18, dt);
    rig.setMorph('mouthOpen', state.mouth);
    rig.setMorph('mouthSmile', pose.warmth);
    rig.setMorph('browUp', pose.warmth * 0.4 + blink * 0.15);
  });
}
