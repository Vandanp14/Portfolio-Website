import { useEffect, useState } from 'react';
import DOMPurify from 'dompurify';
import { Link } from '../components/Link';
import { Eyebrow, Shell, TextLink } from '../components/specimen/primitives';
import {
  fetchPost,
  fetchPosts,
  formatDate,
  getCachedIndex,
  getCachedPost,
  readingMinutes,
  type BlogResult,
  type Post,
  type PostIndex,
} from '../lib/blog';
import { usePageMeta } from '../lib/seo';

type Load<T> =
  | { status: 'loading' }
  | { status: 'ready'; data: T }
  | { status: 'error'; error: string; notFound?: boolean };

// Post HTML comes from our own Apps Script converter but lands on this origin:
// sanitize anyway, and strip Google Docs' inline styling so posts inherit the
// site's typography.
DOMPurify.addHook('afterSanitizeAttributes', (node) => {
  if (node.tagName === 'A') {
    const href = node.getAttribute('href') ?? '';
    if (/^https?:\/\//i.test(href) && !href.startsWith(window.location.origin)) {
      node.setAttribute('target', '_blank');
      node.setAttribute('rel', 'noopener noreferrer');
    }
  }
  if (node.tagName === 'IMG') {
    node.setAttribute('loading', 'lazy');
    node.setAttribute('decoding', 'async');
  }
});

function sanitize(html: string): string {
  return DOMPurify.sanitize(html, { FORBID_ATTR: ['style', 'class'], FORBID_TAGS: ['style'] });
}

function useBlogData<T>(key: string, cached: T | null, load: () => Promise<BlogResult<T>>) {
  const [attempt, setAttempt] = useState(0);
  const [state, setState] = useState<Load<T>>(() =>
    cached ? { status: 'ready', data: cached } : { status: 'loading' },
  );

  useEffect(() => {
    let live = true;
    if (attempt === 0 && cached) {
      setState({ status: 'ready', data: cached });
      return () => {
        live = false;
      };
    }
    setState({ status: 'loading' });
    load().then((result) => {
      if (!live) return;
      setState(
        result.ok
          ? { status: 'ready', data: result.data }
          : { status: 'error', error: result.error, notFound: result.notFound },
      );
    });
    return () => {
      live = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, attempt]);

  return { state, retry: () => setAttempt((n) => n + 1) };
}

function LoadingRows() {
  return (
    <div className="writing" aria-busy="true">
      {[0, 1, 2].map((i) => (
        <div className="writing__row" key={i} aria-hidden="true">
          <span className="mono">—</span>
          <span className="writing__title" style={{ opacity: 0.25 }}>
            Loading
          </span>
          <span />
        </div>
      ))}
    </div>
  );
}

function ErrorLine({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="writing">
      <div className="writing__row">
        <span className="mono">Status</span>
        <span className="writing__title">{message}</span>
        <button type="button" className="link" onClick={onRetry}>
          Try again <span className="arrow" aria-hidden="true">↻</span>
        </button>
      </div>
    </div>
  );
}

function Index({ onRetry, state }: { state: Load<PostIndex>; onRetry: () => void }) {
  usePageMeta({
    title: 'Writing',
    description: 'Notes on backend boundaries, data integrity and building software end to end.',
    path: '/blog',
  });

  return (
    <div className="band band-paper">
      <section className="page-intro">
        <Shell>
          <Eyebrow>Writing — updated when there is something to say</Eyebrow>
          <h1 className="display page-intro__claim" style={{ marginTop: 20 }}>
            Notes from <em>building</em> the thing.
          </h1>
          <div className="page-intro__note">
            <p className="small col-6" style={{ maxWidth: '52ch' }}>
              {state.status === 'ready' ? state.data.description : 'Essays on systems, data and the parts of shipping nobody puts in a demo.'}
            </p>
            <p className="small col-4 start-9 align-end">
              {state.status === 'ready' ? `${state.data.posts.length} entries` : '—'}
            </p>
          </div>
        </Shell>
      </section>

      <section className="section--tight">
        <Shell>
          {state.status === 'loading' ? <LoadingRows /> : null}
          {state.status === 'error' ? <ErrorLine message={state.error} onRetry={onRetry} /> : null}
          {state.status === 'ready' && state.data.posts.length === 0 ? (
            <ErrorLine message="The first entry is in draft." onRetry={onRetry} />
          ) : null}
          {state.status === 'ready' && state.data.posts.length > 0 ? (
            <div className="writing">
              {state.data.posts.map((post) => (
                <Link key={post.id} to={`/blog/${post.id}`} className="writing__row">
                  <span className="mono">{formatDate(post.date)}</span>
                  <span className="writing__title">{post.title}</span>
                  <span className="mono" aria-hidden="true">
                    Read →
                  </span>
                </Link>
              ))}
            </div>
          ) : null}
        </Shell>
      </section>
    </div>
  );
}

function PostView({ id }: { id: string }) {
  const { state, retry } = useBlogData<Post>(`post:${id}`, getCachedPost(id), () => fetchPost(id));

  usePageMeta({
    title: state.status === 'ready' ? state.data.title : 'Writing',
    description: state.status === 'ready' ? state.data.title : undefined,
    path: `/blog/${id}`,
    noindex: state.status === 'error' && Boolean(state.notFound),
  });

  return (
    <div className="band band-paper">
      <section className="page-intro">
        <Shell>
          <p className="mono">
            <Link to="/blog" className="link-mono">
              ← Writing
            </Link>
          </p>

          {state.status === 'ready' ? (
            <>
              <p className="eyebrow" style={{ marginTop: 24 }}>
                {formatDate(state.data.date)} · {readingMinutes(state.data.html)} min read
              </p>
              <h1 className="display-sm" style={{ marginTop: 16, maxWidth: '20ch' }}>
                {state.data.title}
              </h1>
            </>
          ) : null}

          {state.status === 'loading' ? <div style={{ height: 160 }} aria-busy="true" /> : null}

          {state.status === 'error' ? (
            <div style={{ marginTop: 24 }}>
              <h1 className="display-sm">{state.notFound ? 'That entry does not exist.' : 'Could not load this entry.'}</h1>
              <p className="lead" style={{ marginTop: 16 }}>
                {state.notFound ? 'It may have been renamed or removed.' : state.error}
              </p>
              <p style={{ marginTop: 24, display: 'flex', gap: 24 }}>
                <button type="button" className="link" onClick={retry}>
                  Try again <span className="arrow" aria-hidden="true">↻</span>
                </button>
                <TextLink to="/blog">All entries</TextLink>
              </p>
            </div>
          ) : null}
        </Shell>
      </section>

      {state.status === 'ready' ? (
        <section className="section--tight post-body">
          <Shell>
            <div className="prose" dangerouslySetInnerHTML={{ __html: sanitize(state.data.html) }} />
            <div style={{ marginTop: 56, paddingTop: 24, borderTop: '1px solid var(--rule)' }}>
              <TextLink to="/blog">Back to writing</TextLink>
            </div>
          </Shell>
        </section>
      ) : null}
    </div>
  );
}

export default function BlogPage({ postId }: { postId: string | null }) {
  const indexState = useBlogData<PostIndex>('index', getCachedIndex(), fetchPosts);

  if (postId) return <PostView id={postId} />;

  return <Index state={indexState.state} onRetry={indexState.retry} />;
}
