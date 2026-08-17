'use client';

/**
 * Section 04 — "One personality. Many roles."
 *
 * This section is already busy: five role cards, each a product in its own
 * right. So it is left clean — no floating cast here — and gets a single 3D
 * statement that lifts off the page instead.
 *
 * The type is extruded in depth and turns with the cursor, so you see round the
 * side of the letters. It arrives as the section takes the stage and settles.
 */

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import ExtrudedText from '../primitives/ExtrudedText';
import { useDomQuad } from '../primitives/useDomQuad';
import { damp, frame, range } from '../stage/frame';
import type { SceneProps } from '../stage/SceneSwitch';

export default function RolesScene({ active }: SceneProps) {
  const presence = useRef(0);
  // Travels with the section rather than sitting at a fixed point on screen.
  const section = useDomQuad('[data-stage="roles"]');

  useFrame((_, rawDelta) => {
    const dt = Math.min(rawDelta, 0.05);
    // Rises as the section arrives and eases out before the next one, so it
    // never fights the section either side of it.
    const progress = frame.section.roles;
    const window_ = active
      ? Math.min(range(progress, 0.12, 0.34), 1 - range(progress, 0.72, 0.94))
      : 0;
    presence.current = damp(presence.current, window_, 3.2, dt);
  });

  return (
    <ExtrudedText
      lines={['Create. Customize.', 'Train Your SYN.']}
      widthFraction={0.33}
      depth={0.3}
      presence={presence}
      anchor={section}
      // The card row fills this section edge to edge, so the type sits in the
      // clear band just above it rather than over the products.
      anchorOffset={[0.06, 0.66]}
      position={[0, 0, 0.4]}
    />
  );
}
