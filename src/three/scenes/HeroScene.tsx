'use client';

/**
 * Section 01 — Hero.
 *
 * The artwork is the character, split into two real layers: a background that
 * keeps the purple star exactly where it was, and a cut-out of her drawn in
 * front of it. She separates from the background as the cursor moves, breathes,
 * floats, and — the part that matters — lags the page as you scroll, so she
 * travels with you and hands over to the next section's character rather than
 * scrolling away with her plate.
 *
 * No orbiting characters here: they belong to section 02, arriving as the
 * reader approaches it.
 */

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import ParallaxImage from '../primitives/ParallaxImage';
import { useDomQuad } from '../primitives/useDomQuad';
import { damp } from '../stage/frame';
import type { SceneProps } from '../stage/SceneSwitch';

export default function HeroScene({ active }: SceneProps) {
  const desktop = useDomQuad('[data-parallax="hero-desktop"]');
  const mobile = useDomQuad('[data-parallax="hero-mobile"]');
  const presence = useRef(0);

  useFrame((_, rawDelta) => {
    presence.current = damp(presence.current, active ? 1 : 0, 4, Math.min(rawDelta, 0.05));
  });

  return (
    <>
      {/* The plate stays put; only the character travels. */}
      <ParallaxImage
        src="/parallax/hero-background.webp"
        quad={desktop}
        wholePlane
        useAlpha
        parallax={0.004}
        light={0.08}
        presence={presence}
      />
      <ParallaxImage
        src="/parallax/hero-character.webp"
        quad={desktop}
        wholePlane
        useAlpha
        parallax={0.022}
        light={0.16}
        presence={presence}
        section="hero"
        follow={0.42}
        handoff
        // Measured off the plate: her irises sit here in UV space. Supplying
        // them is what lets a flat painting look at the reader and blink.
        eyes={[
          [0.598, 0.396],
          [0.649, 0.391],
        ]}
        eyeSize={0.026}
        eyeTrack={0.005}
      />

      {/* Mobile plate ships already cut out, so it needs no split. */}
      <ParallaxImage
        src="/cdcdc.png"
        quad={mobile}
        useAlpha
        parallax={0.028}
        presence={presence}
        section="hero"
        follow={0.3}
        handoff
      />
    </>
  );
}
