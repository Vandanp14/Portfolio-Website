import { Component, type ErrorInfo, type ReactNode } from 'react';
import { ButtonGhost, Shell } from './primitives';

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
      <section className="band band-paper min-h-[100svh] pt-[var(--nav-h)]">
        <Shell className="pb-[var(--section)] pt-[clamp(32px,5vw,72px)]">
          <div role="alert" className="border-t border-[var(--line-strong)] pt-4">
            <div className="flex items-baseline justify-between gap-6">
              <p className="t-eyebrow text-[var(--signal)]">Something broke</p>
              <span className="t-index text-[var(--text-3)]">/500</span>
            </div>
            <h1 className="t-display mt-[clamp(40px,6vw,88px)] max-w-[14ch] text-[clamp(3rem,9vw,7.5rem)] uppercase text-[var(--text)]">
              This page failed to load.
            </h1>
            <p className="mt-8 max-w-[56ch] text-[18px] leading-[1.45] text-[var(--text-2)]">
              Usually a reload fixes it — the site may have just been updated. If it keeps happening, the rest of the
              site still works.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <ButtonGhost onClick={() => window.location.reload()}>
                Reload <span aria-hidden="true">↻</span>
              </ButtonGhost>
              <ButtonGhost onClick={() => window.location.assign('/')}>
                Home <span aria-hidden="true">→</span>
              </ButtonGhost>
            </div>
          </div>
        </Shell>
      </section>
    );
  }
}
