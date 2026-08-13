'use client';

/**
 * Section 04 — "One personality. Many roles."
 *
 * Brief: instead of five disconnected static cards, one SYN model transitions
 * between Educator → Moderator → Interviewer → Research Assistant → Companion,
 * changing costume, environment, lighting, posture, expression and supporting
 * UI as she goes.
 *
 * That thesis is only true if it is literally one model, so this scene never
 * swaps meshes: it drives the *same* rig — `applyVariant` toggles the outfit
 * pieces the model already carries, the mood changes posture and expression,
 * and the lights and prop ring re-colour around her. The existing role cards
 * stay exactly where they are and simply publish which role is showing.
 */

import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Panel, Ring } from '../primitives/Panel';
import { damp, frame, range } from '../stage/frame';
import { directCamera } from '../stage/camera';
import { directSyn } from '../syn/director';
import { useStage } from '../stage/store';
import { useQuality } from '../stage/useQuality';
import { densityFor } from '../stage/quality';
import { useIsNarrow, useViewportAnchor } from './shared';
import { sinceManualRole } from '../bindings';
import { ROLE_ORDER, type RoleId, type SynMood } from '../stage/types';
import type { SceneProps } from '../stage/SceneSwitch';

interface RoleLook {
  /** Key light colour — the "environment" changing around her. */
  key: string;
  /** Rim colour, which is what actually reads as a change of room. */
  rim: string;
  mood: SynMood;
  /** Body yaw, so each role also has its own stance. */
  yaw: number;
  /** Supporting UI: how many panels orbit her, and how they are arranged. */
  props: number;
  propRadius: number;
  propTilt: number;
  /** Ring radius under her feet; tighter reads as more intimate. */
  ring: number;
}

const LOOKS: Record<RoleId, RoleLook> = {
  // Bright, frontal, open — a teaching light.
  educator: {
    key: '#e9d5ff',
    rim: '#3b82f6',
    mood: 'presenting',
    yaw: -0.1,
    props: 5,
    propRadius: 0.95,
    propTilt: 0.1,
    ring: 0.72,
  },
  // Harder, cooler, more vertical — authority.
  moderator: {
    key: '#c7d2fe',
    rim: '#22d3ee',
    mood: 'focused',
    yaw: 0,
    props: 4,
    propRadius: 0.78,
    propTilt: -0.05,
    ring: 0.6,
  },
  // Turned into the conversation, warm key from one side.
  interviewer: {
    key: '#fde68a',
    rim: '#f472b6',
    mood: 'listening',
    yaw: 0.26,
    props: 3,
    propRadius: 0.85,
    propTilt: 0.22,
    ring: 0.66,
  },
  // Cold, analytical, surrounded by more material than any other role.
  researcher: {
    key: '#bfdbfe',
    rim: '#818cf8',
    mood: 'thinking',
    yaw: -0.18,
    props: 8,
    propRadius: 1.05,
    propTilt: 0.35,
    ring: 0.8,
  },
  // Soft, close, low contrast.
  companion: {
    key: '#fbcfe8',
    rim: '#a855f7',
    mood: 'together',
    yaw: 0.12,
    props: 3,
    propRadius: 0.66,
    propTilt: 0.05,
    ring: 0.52,
  },
};

/**
 * The supporting UI that surrounds her in each role. One pool of panels is
 * reused across all five; only how many are shown, and where, changes.
 */
function PropRing({
  look,
  transition,
  count,
}: {
  look: React.RefObject<RoleLook>;
  transition: React.RefObject<number>;
  count: number;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const panels = useMemo(
    () => Array.from({ length: count }, (_, i) => ({ seed: i * 2.7, index: i })),
    [count],
  );

  useFrame(() => {
    const group = groupRef.current;
    if (!group) return;
    const current = look.current;
    if (!current) return;

    const t = frame.time * (frame.reducedMotion ? 0.1 : 0.22);
    // Mid-transition everything contracts and dims, so the change of role reads
    // as a single beat rather than props teleporting between arrangements.
    const swap = 1 - (transition.current ?? 0);

    group.children.forEach((child, i) => {
      const panel = panels[i];
      if (!panel) return;
      const visible = panel.index < current.props;
      const angle =
        (panel.index / Math.max(current.props, 1)) * Math.PI * 2 + t + panel.seed * 0.05;
      const radius = current.propRadius * (0.55 + swap * 0.45);

      child.position.set(
        Math.sin(angle) * radius,
        1.28 + Math.sin(angle * 2 + panel.seed) * current.propTilt,
        Math.cos(angle) * radius * 0.55 - 0.15,
      );
      // Always face outward toward the reader.
      child.rotation.set(0, angle, 0);
      const scale = visible ? swap : 0;
      child.scale.setScalar(Math.max(scale, 0.0001));
    });
  });

  return (
    <group ref={groupRef}>
      {panels.map((panel) => (
        <group key={panel.index}>
          <Panel
            width={0.26}
            height={0.16}
            radius={0.02}
            lines={panel.index % 2 === 0 ? 3 : 2}
            color="#241640"
            emissive="#c4b5fd"
            lineColor="#ddd6fe"
            opacity={0.88}
          />
        </group>
      ))}
    </group>
  );
}

export default function RolesScene({ active }: SceneProps) {
  const role = useStage((s) => s.role);
  const quality = useQuality();
  const setRole = useStage((s) => s.setRole);
  const anchor = useViewportAnchor();
  const narrow = useIsNarrow();
  const density = densityFor(quality);

  const keyRef = useRef<THREE.SpotLight>(null);
  const rimRef = useRef<THREE.PointLight>(null);
  const ringRef = useRef<THREE.Group>(null);
  const groupRef = useRef<THREE.Group>(null);
  const onStage = useRef(0);

  // Blended look, so lighting and layout cross-fade between roles rather than
  // cutting. Seeded from the current role and eased toward the target each frame.
  const look = useRef<RoleLook>({ ...LOOKS[role] });
  const transition = useRef(0);
  const previousRole = useRef<RoleId>(role);

  const keyColor = useMemo(() => new THREE.Color(LOOKS[role].key), [role]);
  const rimColor = useMemo(() => new THREE.Color(LOOKS[role].rim), [role]);

  // A role change kicks the transition value, which contracts the props and
  // dips the lights through the swap.
  useEffect(() => {
    if (previousRole.current !== role) {
      previousRole.current = role;
      transition.current = 1;
    }
  }, [role]);

  // Costume itself is applied in `SynStage`, which owns the rig: the pieces are
  // tagged by role on the model, so changing outfit is a visibility toggle on
  // one skeleton and never a second model.

  useFrame((_, rawDelta) => {
    const dt = Math.min(rawDelta, 0.05);
    const progress = frame.section.roles;

    onStage.current = damp(onStage.current, active ? 1 : 0, 6, dt);
    transition.current = damp(transition.current, 0, 4.5, dt);

    const target = LOOKS[role];
    const l = look.current;
    l.props = target.props;
    l.propRadius = damp(l.propRadius, target.propRadius, 4, dt);
    l.propTilt = damp(l.propTilt, target.propTilt, 4, dt);
    l.ring = damp(l.ring, target.ring, 4, dt);
    l.yaw = damp(l.yaw, target.yaw, 3, dt);

    const dip = 1 - transition.current * 0.55;

    const key = keyRef.current;
    if (key) {
      key.color.lerp(keyColor, 1 - Math.exp(-4 * dt));
      key.intensity = onStage.current * 26 * dip;
    }
    const rim = rimRef.current;
    if (rim) {
      rim.color.lerp(rimColor, 1 - Math.exp(-4 * dt));
      rim.intensity = onStage.current * 15 * dip;
      // Sweeps around her as the role changes, so the room itself moves.
      const sweep = l.yaw * 2.2;
      rim.position.set(Math.sin(sweep) * 2 - 1.4, 1.6, Math.cos(sweep) * 1.6 - 1.2);
    }

    const ring = ringRef.current;
    if (ring) {
      ring.scale.setScalar(l.ring * onStage.current);
      ring.rotation.z = frame.time * 0.1;
    }

    if (!active) return;

    // Centre stage: this section's copy sits in a narrow left rail on desktop
    // and above the cards on mobile, so the middle is hers.
    const { x } = anchor(narrow ? 0 : 0.12, 0, 0);
    // The prop ring and floor ring belong to her, so the whole scene rides the
    // same anchor she does.
    const group = groupRef.current;
    if (group) group.position.x = x;

    directSyn('roles', {
      position: [x, 0, 0],
      rotation: [0, l.yaw, 0],
      scale: 1,
      mood: target.mood,
      gazeScale: 0.75,
      speaking: false,
      bodyYaw: 0,
      opacity: 1,
      // Slower than elsewhere: the transformation should be legible.
      lambda: 1.8,
    });

    directCamera('roles', {
      position: [0, 1.5, 3.0 - range(progress, 0.1, 0.9) * 0.35],
      target: [x * 0.3, 1.32, 0],
      fov: narrow ? 48 : 38,
      lambda: 1.7,
      parallax: 0.7,
      roll: 0,
    });
  });

  // With no interaction the section walks through the roles on its own, so the
  // transformation is always seen. It yields as soon as the reader takes over,
  // and resumes a few seconds after they stop.
  useEffect(() => {
    if (!active) return;
    const id = window.setInterval(() => {
      if (sinceManualRole() < 6) return;
      const stage = useStage.getState();
      const index = ROLE_ORDER.indexOf(stage.role);
      setRole(ROLE_ORDER[(index + 1) % ROLE_ORDER.length]);
    }, 3600);
    return () => window.clearInterval(id);
  }, [active, setRole]);

  return (
    <group ref={groupRef}>
      <PropRing
        look={look}
        transition={transition}
        count={Math.max(3, Math.round(8 * Math.max(density, 0.5)))}
      />

      <group ref={ringRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <Ring radius={1} thickness={0.012} color="#8b5cf6" opacity={0.45} />
      </group>

      {/* Per-role key and rim. These are what sell "different environment"
          far more cheaply than building five rooms. */}
      <spotLight
        ref={keyRef}
        position={[1.4, 3.2, 2.4]}
        angle={0.7}
        penumbra={0.85}
        intensity={0}
        distance={12}
        decay={2}
      />
      <pointLight ref={rimRef} position={[-1.4, 1.6, -1.2]} intensity={0} distance={8} decay={2} />
    </group>
  );
}
