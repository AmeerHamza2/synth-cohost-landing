'use client';

/**
 * Where the subject currently is in the world.
 *
 * Written by `WorldSyn` each frame, read by the camera. It exists because the
 * stations are wide, horizontal compositions: on a desktop frame you see the
 * whole set, but a phone frame is a narrow vertical slice through the middle of
 * it, which often lands on empty floor between objects.
 *
 * On narrow viewports the camera tracks this instead of the station centre, so
 * whatever the section is actually about is guaranteed to be in shot.
 *
 * Mutable and outside React on purpose — it changes every frame.
 */
export const focus = { x: 0, y: 0, z: 0 };
