'use client';

/**
 * Single entry point for the 3D layer.
 *
 * Mounted once in the root layout, behind all page content. When the device or
 * the reader's motion preference rules WebGL out, this renders nothing at all
 * and the original 2D page is what ships — that is the whole fallback story,
 * and it is why `stage-active` gates every visual change in CSS rather than the
 * markup being rewritten.
 */

import { useEffect } from 'react';
import StageRoot from './stage/StageRoot';
import { useQuality } from './stage/useQuality';

function StageClassToggle() {
  const quality = useQuality();
  // Deliberately NOT gated on `canvasReady`.
  //
  // Waiting for the canvas meant the page's original 2D artwork stayed visible
  // for as long as the three.js bundle took to arrive, then disappeared — which
  // read as two versions of the page stacked on top of each other. The inline
  // boot script in the root layout has already added this class before first
  // paint; this only has to agree with it, or take it away when the device
  // turns out not to qualify.
  const live = quality !== 'off';

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('stage-active', live);
    return () => root.classList.remove('stage-active');
  }, [live]);

  return null;
}

export default function Stage() {
  return (
    <>
      <StageClassToggle />
      <StageRoot />
    </>
  );
}
