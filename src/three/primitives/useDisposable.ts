'use client';

import { useEffect } from 'react';

/**
 * Dispose GPU resources created with `useMemo` when the component unmounts.
 *
 * R3F disposes what it constructs from JSX, but a geometry built in `useMemo`
 * and handed over as a prop is ours to clean up. Scenes here mount and unmount
 * every time the reader scrolls past a section, so without this the geometry
 * count climbs for the whole session.
 */
export function useDisposable(...resources: Array<{ dispose: () => void } | null | undefined>) {
  useEffect(() => {
    return () => {
      for (const resource of resources) resource?.dispose();
    };
    // Resources are created once per mount by `useMemo`; re-running on identity
    // change would dispose a geometry that is still in use.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
