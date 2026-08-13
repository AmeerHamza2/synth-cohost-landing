'use client';

/**
 * SYN is one instance for the whole page.
 *
 * Scenes do not create their own SYN — there is a single rig mounted for as
 * long as the canvas lives, and each section *directs* it: where to stand, how
 * to feel, how much to follow the cursor. Damping between directives is what
 * makes her appear to walk the narrative rather than teleport between seven
 * disconnected renders.
 *
 * This is a plain mutable object for the same reason as `frame.ts`: it is
 * written every frame and must never re-render React.
 */

import type { SectionId, SynMood } from '../stage/types';

export interface SynDirective {
  position: [number, number, number];
  /** Euler XYZ, radians. */
  rotation: [number, number, number];
  scale: number;
  mood: SynMood;
  /** 0..1 — how strongly cursor tracking applies in this section. */
  gazeScale: number;
  speaking: boolean;
  /** Extra body yaw, e.g. turning toward an incoming chat message. */
  bodyYaw: number;
  /** 0..1 — fades the whole rig, for hand-offs between sections. */
  opacity: number;
  /** How fast to converge on this directive. Higher snaps sooner. */
  lambda: number;
}

export const DEFAULT_DIRECTIVE: SynDirective = {
  position: [0, 0, 0],
  rotation: [0, 0, 0],
  scale: 1,
  mood: 'idle',
  gazeScale: 1,
  speaking: false,
  bodyYaw: 0,
  opacity: 1,
  lambda: 2.4,
};

interface Director {
  /** The section that currently owns SYN. */
  owner: SectionId | null;
  target: SynDirective;
}

export const director: Director = {
  owner: null,
  target: { ...DEFAULT_DIRECTIVE },
};

/**
 * Called by the active scene, every frame. Sections that are mounted but not
 * active (the pre-warm neighbours) must not call this.
 */
export function directSyn(section: SectionId, directive: Partial<SynDirective>) {
  director.owner = section;
  const t = director.target;
  if (directive.position) {
    t.position[0] = directive.position[0];
    t.position[1] = directive.position[1];
    t.position[2] = directive.position[2];
  }
  if (directive.rotation) {
    t.rotation[0] = directive.rotation[0];
    t.rotation[1] = directive.rotation[1];
    t.rotation[2] = directive.rotation[2];
  }
  if (directive.scale !== undefined) t.scale = directive.scale;
  if (directive.mood !== undefined) t.mood = directive.mood;
  if (directive.gazeScale !== undefined) t.gazeScale = directive.gazeScale;
  if (directive.speaking !== undefined) t.speaking = directive.speaking;
  if (directive.bodyYaw !== undefined) t.bodyYaw = directive.bodyYaw;
  if (directive.opacity !== undefined) t.opacity = directive.opacity;
  if (directive.lambda !== undefined) t.lambda = directive.lambda;
}

export function resetDirector() {
  director.owner = null;
  director.target = { ...DEFAULT_DIRECTIVE, position: [0, 0, 0], rotation: [0, 0, 0] };
}
