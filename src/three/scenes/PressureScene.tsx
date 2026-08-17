'use client';

/**
 * Section 02 — "Streaming is more demanding than ever."
 *
 * The characters arrive here and nowhere else. They fade in as the reader
 * approaches this block, gather and tighten while the copy lists the demands,
 * then release as the eye reaches "What if you didn't have to stream alone?".
 * Having them appear on approach rather than sit on the hero is what makes it
 * read as an intentional beat instead of ambient decoration.
 */

import AvatarOrbit from './AvatarOrbit';
import { CAST } from '../primitives/cast';
import { frame, range } from '../stage/frame';
import type { SceneProps } from '../stage/SceneSwitch';

export default function PressureScene({ active }: SceneProps) {
  return (
    <AvatarOrbit
      active={active}
      cast={CAST.pressure}
      anchor={[0.06, 0.14]}
      radius={[0.5, 0.95]}
      spread={0.35}
      scale={0.3}
      // Builds through the demands, then settles for the closing question.
      intensityAt={() => {
        const p = frame.section.pressure;
        return Math.min(range(p, 0.05, 0.55), 1 - range(p, 0.62, 0.9));
      }}
    />
  );
}
