'use client';

/**
 * Section 07 — "The next generation of creators won't stream alone."
 *
 * The original artwork of the two figures against the city is the payoff and is
 * left exactly as it is. It gets the same treatment as the other plates —
 * breathing, float, cursor-driven light and depth — so the pair feel present
 * rather than pasted, and the section's character arrives on the hand-off from
 * the one before it.
 */

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import AvatarOrbit from './AvatarOrbit';
import { CAST } from '../primitives/cast';
import ParallaxImage from '../primitives/ParallaxImage';
import { useDomQuad } from '../primitives/useDomQuad';
import { damp } from '../stage/frame';
import type { SceneProps } from '../stage/SceneSwitch';

export default function FinaleScene({ active }: SceneProps) {
  const desktop = useDomQuad('[data-parallax="finale-desktop"]');
  const mobile = useDomQuad('[data-parallax="finale-mobile"]');
  const presence = useRef(0);

  useFrame((_, rawDelta) => {
    presence.current = damp(presence.current, active ? 1 : 0, 4, Math.min(rawDelta, 0.05));
  });

  return (
    <>
      <ParallaxImage
        src="/background_lossless.webp"
        quad={desktop}
        // The pair stand right of centre against the skyline.
        focus={[0.76, 0.55]}
        ellipse={[0.12, 0.55]}
        parallax={0.012}
        light={0.16}
        lightColor="#a855f7"
        presence={presence}
        section="finale"
        follow={0.28}
      />
      <ParallaxImage
        src="/background_lossless.webp"
        quad={mobile}
        focus={[0.76, 0.55]}
        ellipse={[0.12, 0.55]}
        parallax={0.012}
        light={0.16}
        lightColor="#a855f7"
        presence={presence}
        section="finale"
        follow={0.2}
      />

      {/* The world the page has been introducing gathers around the pair. */}
      <AvatarOrbit
        active={active}
        cast={CAST.finale}
        anchor={[0.26, -0.06]}
        radius={[0.9, 1.7]}
        spread={0.6}
        scale={0.3}
        motes={false}
      />
    </>
  );
}
