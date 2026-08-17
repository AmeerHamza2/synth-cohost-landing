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

import { Suspense, useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { PerformanceMonitor } from '@react-three/drei';
import { Bloom, EffectComposer, Vignette } from '@react-three/postprocessing';
import World from '../world/World';
import Stations from '../world/Stations';
import WorldSyn from '../world/WorldSyn';
import WorldCast from '../world/WorldCast';
import { densityFor, dprFor, shadowsFor } from './quality';
import { frame, resetFrame } from './frame';
import { useStage } from './store';
import { useQuality } from './useQuality';
import { useStageDriver } from './useStageDriver';
import type { QualityTier } from './types';
import { resetDirector } from '../syn/director';

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
      camera={{ fov: 52, near: 0.1, far: 180, position: [0, 1.1, 9.5] }}
      onCreated={({ gl, scene, camera }) => {
        gl.setClearAlpha(0);
        setCanvasReady(true);
        // Development handle for inspecting what the stage is actually drawing.
        // Stripped from production builds.
        if (process.env.NODE_ENV !== 'production') {
          (window as unknown as { __stage?: unknown }).__stage = {
            scene,
            camera,
            gl,
            store: useStage,
            frame,
          };
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
      {/* Enough ambient to read the forms; every station brings its own key
          and rim lighting, which is what gives the geometry volume. */}
      <ambientLight intensity={0.35} color="#6c5b9a" />
      <hemisphereLight args={['#8b6cf5', '#07060f', 0.4]} />
      <World density={densityFor(quality)} reflect={quality === 'high'}>
        <Stations />
        <WorldSyn />
        <Suspense fallback={null}>
          <WorldCast />
        </Suspense>
      </World>

      {/* Bloom is what makes emissive geometry read as light rather than as
          bright paint, and it is the single largest step between "a 3D scene"
          and "a finished one". Dropped entirely on the low tier. */}
      {quality !== 'low' && (
        <EffectComposer enableNormalPass={false}>
          <Bloom
            intensity={0.62}
            luminanceThreshold={0.42}
            luminanceSmoothing={0.5}
            mipmapBlur
            radius={0.72}
          />
          <Vignette offset={0.28} darkness={0.62} />
        </EffectComposer>
      )}
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
  }, []);

  useStageDriver();

  if (quality === 'off') return null;

  return (
    <div className="stage-root" aria-hidden="true">
      <StageCanvas quality={quality} />
    </div>
  );
}
