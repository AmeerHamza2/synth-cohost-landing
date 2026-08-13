'use client';

/**
 * The one and only WebGL context on the page.
 *
 * A single fixed canvas sits behind the DOM; the existing markup keeps carrying
 * all of the information and stays fully selectable and screen-reader visible.
 * Seven canvases would mean seven contexts and browser eviction, so scenes swap
 * inside this one.
 *
 * Bails out entirely — no context created — when the device or the reader's
 * preferences say the page should stay 2D.
 */

import { useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { PerformanceMonitor } from '@react-three/drei';
import CameraRig from './CameraRig';
import SceneSwitch from './SceneSwitch';
import StageLights from './StageLights';
import SynStage from '../syn/SynStage';
import { dprFor, shadowsFor } from './quality';
import { resetFrame } from './frame';
import { useStage } from './store';
import { useQuality } from './useQuality';
import { useStageDriver } from './useStageDriver';
import type { QualityTier } from './types';
import { resetDirector } from '../syn/director';
import { resetCameraDirector } from './camera';

function StageCanvas({ quality }: { quality: QualityTier }) {
  const mountedCount = useStage((s) => s.mounted.length);
  const setCanvasReady = useStage((s) => s.setCanvasReady);
  const [visible, setVisible] = useState(true);
  const [dpr, setDpr] = useState<number>(() => dprFor(quality)[1]);

  useEffect(() => {
    const onVisibility = () => setVisible(!document.hidden);
    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, []);

  // Nothing on screen and nothing to animate: stop the loop outright.
  const running = visible && mountedCount > 0;
  const [min, max] = dprFor(quality);

  return (
    <Canvas
      className="stage-canvas"
      frameloop={running ? 'always' : 'never'}
      dpr={dpr}
      shadows={shadowsFor(quality)}
      gl={{
        alpha: true,
        antialias: quality === 'high',
        powerPreference: 'high-performance',
        // The page is dark and the canvas composites under DOM content; a
        // cheap tone map keeps the purple emissives from clipping to white.
        stencil: false,
        depth: true,
      }}
      camera={{ fov: 38, near: 0.1, far: 60, position: [0, 1.55, 3.1] }}
      onCreated={({ gl, scene, camera }) => {
        gl.setClearAlpha(0);
        setCanvasReady(true);
        // Development handle for inspecting what the stage is actually drawing.
        // Stripped from production builds.
        if (process.env.NODE_ENV !== 'production') {
          (window as unknown as { __stage?: unknown }).__stage = { scene, camera, gl };
        }
      }}
    >
      {/* Auto-degrade rather than stutter: if the frame budget slips, drop
          pixel ratio before anything else. */}
      <PerformanceMonitor
        onDecline={() => setDpr(min)}
        onIncline={() => setDpr(max)}
        flipflops={3}
      />
      <StageLights quality={quality} />
      <CameraRig />
      <SynStage />
      <SceneSwitch />
    </Canvas>
  );
}

export default function StageRoot() {
  // Device capability comes from an external store, so the server render and
  // the hydration pass both see `off` and the client swaps to the real tier in
  // one controlled step — no guessing, and no hydration mismatch.
  const quality = useQuality();

  // Clear any state left over from a previous mount or a hot reload.
  useEffect(() => {
    resetFrame();
    resetDirector();
    resetCameraDirector();
  }, []);

  useStageDriver();

  if (quality === 'off') return null;

  return (
    <div className="stage-root" aria-hidden="true">
      <StageCanvas quality={quality} />
    </div>
  );
}
