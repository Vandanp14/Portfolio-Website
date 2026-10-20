import { useEffect, useState } from 'react';
import { fetchPosts, formatDate, getCachedIndex, type PostSummary } from '../../lib/blog';
import { Link } from '../Link';
import { SectionHead, Shell, TextLink } from './primitives';

type State = { status: 'loading' } | { status: 'ready'; posts: PostSummary[] } | { status: 'error' };

export function WritingList() {
  const cached = getCachedIndex();
  const [state, setState] = useState<State>(() =>
    cached ? { status: 'ready', posts: cached.posts } : { status: 'loading' },
  );

  useEffect(() => {
    if (cached) return;
    let live = true;
    fetchPosts().then((result) => {
      if (!live) return;
      setState(result.ok ? { status: 'ready', posts: result.data.posts } : { status: 'error' });
    });
    return () => {
      live = false;
    };
  }, [cached]);

  const posts = state.status === 'ready' ? state.posts.slice(0, 3) : [];

  return (
    <section className="band band-paper section">
      <Shell>
        <SectionHead
          index="05 — Writing"
          title={
            <>
              Notes from building <em>the thing</em>.
            </>
          }
          note="Short essays on backend boundaries, data integrity and the parts of shipping nobody puts in a demo."
        />

        <div className="writing writing--after-head" style={{ marginTop: 'clamp(32px, 4vw, 56px)' }}>
          {state.status === 'loading' ? (
            <>
              <p className="sr-only">Loading notes…</p>
              {[0, 1, 2].map((i) => (
                <div className="writing__row writing__row--skeleton" key={i} aria-hidden="true">
                  <span className="mono" />
                  <span className="writing__title" />
                  <span />
                </div>
              ))}
            </>
          ) : null}

          {state.status === 'error' ? (
            <div className="writing__row">
              <span className="mono">Status</span>
              <span className="writing__title">The writing index is out of reach right now.</span>
              <Link to="/blog" className="link">
                Open the archive <span className="arrow" aria-hidden="true">→</span>
              </Link>
            </div>
          ) : null}

          {state.status === 'ready' && posts.length === 0 ? (
            <div className="writing__row">
              <span className="mono">Status</span>
              <span className="writing__title">The first essay is in draft.</span>
              <Link to="/blog" className="link">
                Visit the archive <span className="arrow" aria-hidden="true">→</span>
              </Link>
            </div>
          ) : null}

          {posts.map((post) => (
            <Link key={post.id} to={`/blog/${post.id}`} className="writing__row">
              <span className="mono">{formatDate(post.date)}</span>
              <span className="writing__title">{post.title}</span>
              <span className="mono" aria-hidden="true">
                Read →
              </span>
            </Link>
          ))}
        </div>

        <p style={{ marginTop: 32 }}>
          <TextLink to="/blog">Every note</TextLink>
        </p>
      </Shell>
    </section>
  );
}
