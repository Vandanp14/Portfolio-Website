import { ArrowLeft } from 'lucide-react';
import { useEffect } from 'react';
import { Link } from './Link';
import { Shell } from './primitives';

export function NotFound() {
  useEffect(() => {
    const previous = document.title;
    document.title = 'Page not found — Vandan Patel';
    return () => {
      document.title = previous;
    };
  }, []);

  return (
    <section className="band band-paper flex min-h-[80svh] items-center pt-16">
      <Shell className="py-[var(--section)]">
        <p className="label text-[var(--accent)]">404</p>
        <h1 className="font-editorial mt-5 max-w-[16ch] text-[clamp(2.5rem,6vw,4.5rem)] text-[var(--text)]">
          This page doesn’t exist.
        </h1>
        <Link
          to="/"
          className="label mt-10 inline-flex items-center gap-2 text-[var(--text-2)] transition-colors duration-[var(--t-fast)] ease-[var(--ease-out-expo)] hover:text-[var(--accent)]"
        >
          <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
          Back home
        </Link>
      </Shell>
    </section>
  );
}
