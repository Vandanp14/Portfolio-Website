import { Link } from '../Link';
import { Shell } from './primitives';

export function NotFound() {
  return (
    <section className="band band-paper" style={{ minHeight: '70svh', display: 'grid', placeItems: 'center' }}>
      <Shell>
        <p className="eyebrow">404 — Not found</p>
        <h1 className="display" style={{ marginTop: 16, maxWidth: '14ch' }}>
          This page never <em>shipped</em>.
        </h1>
        <p className="lead" style={{ marginTop: 24 }}>
          The URL is wrong, or the page moved. The work is still where you left it.
        </p>
        <p style={{ marginTop: 32 }}>
          <Link to="/" className="pill">
            Back to the index
          </Link>
        </p>
      </Shell>
    </section>
  );
}
