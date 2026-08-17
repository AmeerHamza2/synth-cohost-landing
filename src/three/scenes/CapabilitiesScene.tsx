'use client';

/**
 * Section 03 — "MEET YOUR SYN".
 *
 * This plate is a rim-lit figure against a near-black ground, which no
 * luminance threshold can separate into layers (measured: ~80% of the character
 * band is near-black). So rather than a hard cut-out it uses the single-plane
 * treatment — a soft mask over where she stands, displaced against the rest of
 * the image — plus the same breathing, float and scroll-follow as the hero, so
 * she takes over as the hero's character hands off.
 *
 * A supplied cut-out PNG would upgrade this to true layers with no code change.
 */

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import ParallaxImage from '../primitives/ParallaxImage';
import { useDomQuad } from '../primitives/useDomQuad';
import { damp } from '../stage/frame';
import type { SceneProps } from '../stage/SceneSwitch';

export default function CapabilitiesScene({ active }: SceneProps) {
  const desktop = useDomQuad('[data-parallax="meet-desktop"]');
  const mobile = useDomQuad('[data-parallax="meet-mobile"]');
  const presence = useRef(0);

  useFrame((_, rawDelta) => {
    presence.current = damp(presence.current, active ? 1 : 0, 4, Math.min(rawDelta, 0.05));
  });

  return (
    <>
      <ParallaxImage
        src="/change_lossless.webp"
        quad={desktop}
        // She stands in the left eighth of this very wide plate.
        focus={[0.11, 0.5]}
        ellipse={[0.09, 0.48]}
        parallax={0.014}
        light={0.14}
        presence={presence}
        section="capabilities"
        follow={0.32}
        handoff
      />
      <ParallaxImage
        // Same asset as the DOM plate, copied to a clean filename: the original
        // has spaces and commas that the static handler will not serve to
        // TextureLoader even encoded.
        src="/parallax/meet-mobile.png"
        quad={mobile}
        useAlpha
        parallax={0.026}
        presence={presence}
        section="capabilities"
        follow={0.24}
        handoff
      />
    </>
  );
}
