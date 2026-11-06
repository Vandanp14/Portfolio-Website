import { Component, type ErrorInfo, type ReactNode } from 'react';
import { Shell } from './primitives';

const RELOAD_KEY = 'chunk-reload-at';
const RELOAD_WINDOW_MS = 30_000;

/**
 * After a deploy, an open tab still references the old hashed chunks, so the
 * first lazy import 404s. One automatic reload picks up the new build; the
 * timestamp stops a reload loop when the failure is something else.
 */
function isChunkError(error: Error): boolean {
  return /Failed to fetch dynamically imported module|Importing a module script failed|error loading dynamically imported module/i.test(
    error.message,
  );
}

function reloadOnce(): boolean {
  try {
    const last = Number(sessionStorage.getItem(RELOAD_KEY) ?? 0);
    if (Date.now() - last < RELOAD_WINDOW_MS) return false;
    sessionStorage.setItem(RELOAD_KEY, String(Date.now()));
  } catch {
    return false;
  }
  window.location.reload();
  return true;
}

type State = { error: Error | null };

export class ErrorBoundary extends Component<{ children: ReactNode }, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    if (isChunkError(error) && reloadOnce()) return;
    console.error(error, info.componentStack);
  }

  render() {
    if (!this.state.error) return this.props.children;
    return (
      <Shell className="py-12 sm:py-16">
        <div role="alert">
          <h1 className="t-page text-[var(--text)]">This page failed to load.</h1>
          <p className="mt-4 text-[var(--text-2)]">
            A reload usually fixes it, since the site may have just been updated. The rest of the site should still
            work.
          </p>
          <p className="mt-4 flex gap-x-5">
            <button type="button" onClick={() => window.location.reload()} className="text-link min-h-[44px]">
              Reload
            </button>
            <button type="button" onClick={() => window.location.assign('/')} className="text-link min-h-[44px]">
              Home
            </button>
          </p>
        </div>
      </Shell>
    );
  }
}
