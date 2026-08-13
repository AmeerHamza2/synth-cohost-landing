'use client';

/**
 * DOM → stage bindings.
 *
 * The existing components stay in charge of the content and the interaction;
 * these helpers just publish what the reader is doing into the stage store so
 * the 3D layer can respond. Spreading a handler set onto an element is the
 * whole integration — no component gets restructured.
 *
 * The elements they are spread onto are plain `div`s, so the handler sets also
 * supply the role and accessible name that make them reachable and announced;
 * a bare `tabIndex` would only add an unlabelled focus stop.
 */

import { useStage } from './stage/store';
import type { CapabilityId, RoleId } from './stage/types';

const CAPABILITY_LABELS: Record<CapabilityId, string> = {
  chat: 'Preview: Syn responds to chat',
  context: 'Preview: Syn understands context',
  workflow: 'Preview: Syn supports your workflow',
};

/**
 * Section 03 — the three capability cards.
 * Hover or focus a card and the matching 3D cluster materialises around SYN.
 */
export function capabilityTrigger(id: CapabilityId) {
  const set = (value: CapabilityId | null) => useStage.getState().setCapability(value);
  return {
    role: 'button' as const,
    tabIndex: 0,
    'aria-label': CAPABILITY_LABELS[id],
    onMouseEnter: () => set(id),
    onMouseLeave: () => set(null),
    onFocus: () => set(id),
    onBlur: () => set(null),
    // Touch: tapping a card latches it rather than requiring a hover.
    onTouchStart: () => set(id),
  };
}

const ROLE_LABELS: Record<RoleId, string> = {
  educator: 'Educator',
  moderator: 'Moderator',
  interviewer: 'Interviewer',
  researcher: 'Research Assistant',
  companion: 'Companion',
};

/**
 * Timestamp of the reader's last deliberate role choice.
 *
 * The roles section walks through the five roles on its own so the
 * transformation is always seen, but that must never fight someone who is
 * actively exploring — the scene checks this before advancing.
 */
let lastManualRole = 0;

/** Seconds since the reader last chose a role themselves; `Infinity` if never. */
export function sinceManualRole() {
  return lastManualRole === 0
    ? Infinity
    : (performance.now() - lastManualRole) / 1000;
}

/**
 * Section 04 — the role cards. Hovering (desktop grid) or paging (mobile
 * carousel) drives which role the single SYN model transforms into.
 */
export function roleTrigger(id: RoleId) {
  const set = (value: RoleId) => {
    lastManualRole = performance.now();
    useStage.getState().setRole(value);
  };
  return {
    role: 'button' as const,
    tabIndex: 0,
    'aria-label': `Show Syn as ${ROLE_LABELS[id]}`,
    onMouseEnter: () => set(id),
    onFocus: () => set(id),
    onTouchStart: () => set(id),
  };
}

/**
 * The role the 3D layer is currently showing.
 *
 * The section advances on its own when nobody is interacting, so the DOM needs
 * to follow along — otherwise the cards give no indication of which one the
 * figure on stage corresponds to.
 */
export function useActiveRole(): RoleId {
  return useStage((s) => s.role);
}

/** Section 04 mobile carousel, and anywhere else role changes programmatically. */
export function setStageRole(id: RoleId) {
  lastManualRole = performance.now();
  useStage.getState().setRole(id);
}

/**
 * Section 05 — a chat message arriving. Pushes a cue that makes SYN turn
 * toward the side it came from.
 */
export function pushChatCue(side: -1 | 1) {
  useStage.getState().pushChatCue(side);
}
