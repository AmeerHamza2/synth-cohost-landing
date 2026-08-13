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
import StageBackdrop from './stage/StageBackdrop';
import StageRoot from './stage/StageRoot';
import { useStage } from './stage/store';
import { useQuality } from './stage/useQuality';

function StageClassToggle() {
  const quality = useQuality();
  const canvasReady = useStage((s) => s.canvasReady);
  const live = quality !== 'off' && canvasReady;

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
      <StageBackdrop />
      <StageRoot />
    </>
  );
}
