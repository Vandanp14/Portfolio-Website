import { useEffect, type DependencyList } from 'react';
import { startReveals } from '../lib/reveal';

/**
 * Kept for existing call sites. Reveals are now handled page-wide by
 * `startReveals()` (src/lib/reveal.ts), which also catches nodes that mount
 * later, so `deps` is no longer needed — calling this just ensures the engine
 * is running.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function useRevealObserver(_deps: DependencyList = []) {
  useEffect(() => {
    startReveals();
  }, []);
}
