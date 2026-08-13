'use client';

/**
 * Progressive scene loading.
 *
 * The brief is explicit: "don't load the entire 3D world at once". Each section
 * owns a scene module that is code-split and only imported when the reader is
 * within one section of it. Leaving that window unmounts the scene and releases
 * its GPU resources.
 *
 * Only the *active* section drives the camera and SYN; its neighbours are
 * mounted purely so their geometry and textures are warm before they are seen.
 */

import { Suspense, lazy, useMemo } from 'react';
import { useStage } from './store';
import type { SectionId } from './types';

export interface SceneProps {
  /** True when this section owns the camera and SYN. */
  active: boolean;
}

const SCENES: Record<SectionId, React.LazyExoticComponent<React.ComponentType<SceneProps>>> = {
  hero: lazy(() => import('../scenes/HeroScene')),
  pressure: lazy(() => import('../scenes/PressureScene')),
  capabilities: lazy(() => import('../scenes/CapabilitiesScene')),
  roles: lazy(() => import('../scenes/RolesScene')),
  studio: lazy(() => import('../scenes/StudioScene')),
  knowledge: lazy(() => import('../scenes/KnowledgeScene')),
  finale: lazy(() => import('../scenes/FinaleScene')),
};

export default function SceneSwitch() {
  const mounted = useStage((s) => s.mounted);
  const active = useStage((s) => s.active);

  // Stable list so a change of `active` alone does not rebuild the subtree.
  const scenes = useMemo(
    () => mounted.map((id) => ({ id, Component: SCENES[id] })),
    [mounted],
  );

  return (
    <>
      {scenes.map(({ id, Component }) => (
        <Suspense key={id} fallback={null}>
          <Component active={id === active} />
        </Suspense>
      ))}
    </>
  );
}
