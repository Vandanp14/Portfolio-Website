import { Component, type ErrorInfo, type ReactNode } from 'react';
import { Shell } from './specimen/primitives';

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
      <div className="band band-paper" style={{ minHeight: '70svh' }}>
        <Shell>
          <div role="alert" className="section--tight" style={{ borderTop: '1px solid var(--rule-strong)' }}>
            <p className="eyebrow">Error — 500</p>
            <h1 className="display" style={{ marginTop: 20, maxWidth: '14ch' }}>
              This page failed to <em>load</em>.
            </h1>
            <p className="lead" style={{ marginTop: 24 }}>
              Usually a reload fixes it — the site may have just been updated. If it keeps happening,
              the rest of the site still works.
            </p>
            <div style={{ marginTop: 32, display: 'flex', gap: 16, flexWrap: 'wrap' }}>
              <button type="button" className="pill" onClick={() => window.location.reload()}>
                Reload ↻
              </button>
              <button type="button" className="link" onClick={() => window.location.assign('/')}>
                Home <span className="arrow" aria-hidden="true">→</span>
              </button>
            </div>
          </div>
        </Shell>
      </div>
    );
  }
}
