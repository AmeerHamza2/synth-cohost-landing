'use client';

/**
 * Discrete stage state.
 *
 * Only values that should genuinely re-render React live here: which section
 * owns the stage, which scenes are mounted, and the interaction state the DOM
 * pushes in (a hovered capability card, the selected role, a chat message the
 * studio scene should react to).
 *
 * Continuous per-frame values live in `frame.ts` and must never be put here.
 */

import { create } from 'zustand';
import type { CapabilityId, RoleId, SectionId, SynMood } from './types';
import { SECTION_ORDER } from './types';

interface StageState {
  /** True once the canvas has rendered a frame, so DOM posters can fade out. */
  canvasReady: boolean;

  /** Section currently nearest the viewport centre. */
  active: SectionId | null;
  /**
   * Scenes allowed to exist right now: the active one plus its immediate
   * neighbours. Anything outside this window is unmounted and its GPU
   * resources released.
   */
  mounted: SectionId[];

  /** Section 03: capability being explored, or null for the resting state. */
  capability: CapabilityId | null;
  /** Section 04: role currently shown. */
  role: RoleId;
  /**
   * Section 05: side the most recent chat message arrived from, plus a token
   * that changes on every message so the scene can retrigger the reaction.
   */
  chatCue: { side: -1 | 1; token: number } | null;

  /** Explicit mood override; scenes normally set this as they take over. */
  mood: SynMood;

  setCanvasReady: (ready: boolean) => void;
  setActive: (id: SectionId | null) => void;
  setCapability: (id: CapabilityId | null) => void;
  setRole: (id: RoleId) => void;
  pushChatCue: (side: -1 | 1) => void;
  setMood: (mood: SynMood) => void;
}

/** Active section plus one neighbour either side, in narrative order. */
function mountWindow(active: SectionId | null): SectionId[] {
  if (!active) return [];
  const i = SECTION_ORDER.indexOf(active);
  if (i === -1) return [];
  return SECTION_ORDER.slice(Math.max(0, i - 1), i + 2);
}

const sameList = (a: SectionId[], b: SectionId[]) =>
  a.length === b.length && a.every((v, i) => v === b[i]);

export const useStage = create<StageState>((set, get) => ({
  canvasReady: false,
  active: null,
  mounted: [],
  capability: null,
  role: 'educator',
  chatCue: null,
  mood: 'idle',

  setCanvasReady: (canvasReady) => set({ canvasReady }),

  setActive: (id) => {
    if (get().active === id) return;
    const next = mountWindow(id);
    // Preserve the array identity when the window is unchanged so scenes that
    // subscribe to `mounted` do not re-render on every section change.
    set(sameList(get().mounted, next) ? { active: id } : { active: id, mounted: next });
  },

  setCapability: (capability) => {
    if (get().capability === capability) return;
    set({ capability });
  },

  setRole: (role) => {
    if (get().role === role) return;
    set({ role });
  },

  pushChatCue: (side) =>
    set((s) => ({ chatCue: { side, token: (s.chatCue?.token ?? 0) + 1 } })),

  setMood: (mood) => {
    if (get().mood === mood) return;
    set({ mood });
  },
}));

/** Non-reactive read, for use inside `useFrame` where subscribing is wrong. */
export const readStage = () => useStage.getState();
