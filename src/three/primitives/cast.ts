'use client';

/**
 * The SYN cast, and who appears where.
 *
 * Sprites are produced by `scripts/extract-characters.mjs` from the sheet the
 * client supplied. They deliberately do not all appear at once — each section
 * gets a small, distinct group, so the cast reads as a world the reader moves
 * through rather than a crowd dumped on every screen.
 */

const all = Array.from(
  { length: 21 },
  (_, i) => `/characters/syn-${String(i + 1).padStart(2, '0')}.png`,
);

/** Pick by 1-based index, matching the filenames. */
const pick = (...ids: number[]) => ids.map((id) => all[id - 1]).filter(Boolean);

export const CAST = {
  /** Section 02 — the demands crowding in. The largest group on the page. */
  pressure: pick(1, 2, 3, 5, 6, 7, 9, 12, 14, 16, 19),
  /** Section 04 — a few companions around the roles. */
  roles: pick(4, 10, 13, 18),
  /** Section 05 — the stream's regulars. */
  studio: pick(2, 8, 15, 17),
  /** Section 06 — the quieter, more curious ones. */
  knowledge: pick(3, 11, 20),
  /** Section 07 — the whole world gathering for the payoff. */
  finale: pick(1, 4, 6, 8, 11, 13, 16, 19, 21),
} as const;

export const ALL_CHARACTERS = all;
