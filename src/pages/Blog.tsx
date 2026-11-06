import DOMPurify from 'dompurify';
import { useDeferredValue, useEffect, useMemo, useRef, useState, type KeyboardEvent } from 'react';
import { Meta, PageTitle, SectionTitle, Shell } from '../components/primitives';
import {
  fetchPost,
  fetchPosts,
  formatDate,
  getCachedIndex,
  getCachedPost,
  buildPreview,
  readingMinutes,
  type BlogResult,
  type PostPreview,
  type PostSummary,
  type Post,
  type PostIndex,
} from '../lib/blog';
import { Link } from '../components/Link';
import { pageById } from '../lib/routes';
import { usePageMeta } from '../lib/seo';

// Post HTML comes from our own Apps Script converter, but it lands on this
// origin — sanitize anyway, and strip inline styling so every post inherits
// the site's typography instead of whatever Google Docs emitted.
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

type Load<T> =
  | { status: 'loading' }
  | { status: 'ready'; data: T }
  | { status: 'error'; error: string; notFound?: boolean };

/** Loads once per `key`, seeding from cache so back/forward renders instantly. */
function useBlogData<T>(key: string, cached: T | null, load: () => Promise<BlogResult<T>>) {
  const [attempt, setAttempt] = useState(0);
  const [state, setState] = useState<Load<T>>(() =>
    cached ? { status: 'ready', data: cached } : { status: 'loading' },
  );

  useEffect(() => {
    let live = true;
    if (cached) {
      setState({ status: 'ready', data: cached });
      return;
    }
    setState({ status: 'loading' });
    load().then((result) => {
      if (!live) return;
      setState(result.ok ? { status: 'ready', data: result.data } : { status: 'error', ...result });
    });
    return () => {
      live = false;
    };
    // `cached` and `load` are derived from `key`.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, attempt]);

  return [state, () => setAttempt((n) => n + 1)] as const;
}

export default function Blog({ postId }: { postId: string | null }) {
  return postId ? <PostView key={postId} id={postId} /> : <IndexView />;
}

/* --- Index ---------------------------------------------------------------- */

function IndexView() {
  const page = pageById('blog');
  const [state, retry] = useBlogData<PostIndex>('index', getCachedIndex(), fetchPosts);
  usePageMeta({
    title: page.label,
    description: (state.status === 'ready' && state.data.description) || page.description,
    path: '/blog',
  });

  const ready = state.status === 'ready';

  return (
    <Shell className="py-12 sm:py-16">
      <PageTitle>{page.label}</PageTitle>
      {ready && state.data.description && <p className="mt-4 text-[var(--text-2)]">{state.data.description}</p>}
      <Meta className="mt-2">
        <a href="/rss.xml" className="text-link">
          RSS feed
        </a>
      </Meta>

      <div className="mt-8">
        {ready && state.data.posts.length > 0 && <SearchablePosts posts={state.data.posts} />}
        {state.status === 'loading' && <ListSkeleton />}
        {state.status === 'error' && <ErrorPanel message={state.error} onRetry={retry} />}
        {ready && state.data.posts.length === 0 && (
          <p className="border-y border-[var(--line)] py-8 text-[var(--text-2)]">No posts yet.</p>
        )}
      </div>
    </Shell>
  );
}

/* --- Previews ------------------------------------------------------------ */

const PREVIEW_CONCURRENCY = 3;

/**
 * The index API only returns titles, so previews are built by fetching each
 * post in the background (a few at a time). Every fetched post lands in the
 * post cache, so opening one afterwards is instant.
 */
function usePreviews(posts: PostSummary[]) {
  const [previews, setPreviews] = useState<Record<string, PostPreview | null>>(() => {
    const seeded: Record<string, PostPreview | null> = {};
    posts.forEach((post) => {
      const cached = getCachedPost(post.id);
      if (cached) seeded[post.id] = buildPreview(cached.html);
    });
    return seeded;
  });

  useEffect(() => {
    let live = true;
    const queue = posts.filter((post) => !getCachedPost(post.id)).map((post) => post.id);

    const worker = async () => {
      for (let id = queue.shift(); id && live; id = queue.shift()) {
        const result = await fetchPost(id);
        if (!live) return;
        const key = id;
        // null = failed: the card simply stays title-only.
        setPreviews((prev) => ({ ...prev, [key]: result.ok ? buildPreview(result.data.html) : null }));
      }
    };
    Array.from({ length: PREVIEW_CONCURRENCY }, worker);

    return () => {
      live = false;
    };
  }, [posts]);

  return previews;
}

/* --- Search -------------------------------------------------------------- */

// Plain text of each post, extracted once per id. Inert DOMParser document,
// so nothing in the HTML executes.
const textCache = new Map<string, string>();

function postText(id: string): string {
  const hit = textCache.get(id);
  if (hit !== undefined) return hit;
  const post = getCachedPost(id);
  if (!post) return '';
  const text = (new DOMParser().parseFromString(post.html, 'text/html').body.textContent ?? '').toLowerCase();
  textCache.set(id, text);
  return text;
}

function readQuery(): string {
  return new URLSearchParams(window.location.search).get('q') ?? '';
}

/**
 * Filters on title, excerpt and full text. Full text comes from the post
 * cache that `usePreviews` fills in the background, so results sharpen as
 * posts arrive. The query lives in `?q=` (replaceState, no history spam).
 */
function SearchablePosts({ posts }: { posts: PostSummary[] }) {
  const previews = usePreviews(posts);
  const [query, setQuery] = useState(readQuery);
  const deferred = useDeferredValue(query.trim().toLowerCase());
  const input = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const url = new URL(window.location.href);
    if (query.trim()) url.searchParams.set('q', query.trim());
    else url.searchParams.delete('q');
    window.history.replaceState(window.history.state, '', url.pathname + url.search + url.hash);
  }, [query]);

  // "/" jumps to search from anywhere on the page, unless already typing.
  useEffect(() => {
    const onKey = (event: globalThis.KeyboardEvent) => {
      if (event.key !== '/' || event.metaKey || event.ctrlKey || event.altKey) return;
      const target = event.target as HTMLElement | null;
      if (target && (target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName))) return;
      event.preventDefault();
      input.current?.focus();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const results = useMemo(() => {
    if (!deferred) return posts;
    const terms = deferred.split(/\s+/);
    return posts.filter((post) => {
      const haystack = `${post.title.toLowerCase()} ${previews[post.id]?.excerpt.toLowerCase() ?? ''} ${postText(post.id)}`;
      return terms.every((term) => haystack.includes(term));
    });
  }, [deferred, posts, previews]);

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape' && query) {
      event.preventDefault();
      setQuery('');
    }
  };

  const searching = deferred !== '';
  const total = posts.length;

  return (
    <>
      <div role="search" className="relative">
        <label htmlFor="blog-search" className="sr-only">
          Search posts
        </label>
        <input
          ref={input}
          id="blog-search"
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onKeyDown={onKeyDown}
          placeholder="Search posts"
          autoComplete="off"
          spellCheck={false}
          className="field pr-20 [&::-webkit-search-cancel-button]:hidden"
        />
        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery('');
              input.current?.focus();
            }}
            className="absolute inset-y-0 right-0 inline-flex min-h-[44px] items-center px-3 text-[14px] text-[var(--text-2)] hover:text-[var(--text)]"
          >
            Clear
          </button>
        )}
      </div>

      <p className="t-meta mt-3" aria-live="polite">
        {searching
          ? `${results.length} of ${total} ${total === 1 ? 'post' : 'posts'}`
          : `${total} ${total === 1 ? 'post' : 'posts'}`}
      </p>

      {results.length > 0 ? (
        <PostList posts={results} previews={previews} />
      ) : (
        <div className="mt-4 border-y border-[var(--line)] py-8">
          <p className="text-[var(--text)]">No posts match “{query.trim()}”.</p>
          <button type="button" onClick={() => setQuery('')} className="text-link mt-2 min-h-[44px] text-[var(--text-2)]">
            Show all posts
          </button>
        </div>
      )}
    </>
  );
}

function PostList({ posts, previews }: { posts: PostSummary[]; previews: Record<string, PostPreview | null> }) {
  return (
    <ol className="mt-4 border-b border-[var(--line)]">
      {posts.map((post) => (
        <li key={post.id}>
          <PostRow post={post} preview={previews[post.id]} />
        </li>
      ))}
    </ol>
  );
}

function PostRow({ post, preview }: { post: PostSummary; preview: PostPreview | null | undefined }) {
  return (
    <Link to={`/blog/${post.id}`} className="block border-t border-[var(--line)] py-5 hover:bg-[var(--surface)]">
      <span className="flex items-baseline justify-between gap-4">
        <span className="min-w-0 break-words text-[var(--text)]">{post.title}</span>
        <time dateTime={post.date} className="t-meta shrink-0 tabular-nums">
          {formatDate(post.date)}
        </time>
      </span>
      <Excerpt preview={preview} chars={220} lines={2} className="mt-1 block text-[var(--text-2)]" />
    </Link>
  );
}

/** Skeleton lines hold the excerpt's space while the post loads. */
function Excerpt({
  preview,
  chars,
  lines,
  className,
}: {
  preview: PostPreview | null | undefined;
  chars: number;
  lines: number;
  className: string;
}) {
  if (preview === null) return null;

  if (preview === undefined) {
    return (
      <span className={className} aria-hidden="true">
        {Array.from({ length: lines }, (_, i) => (
          <span
            key={i}
            className="skeleton my-[0.45em] block h-[0.8em]"
            style={{ width: i === lines - 1 ? '58%' : `${100 - i * 4}%` }}
          />
        ))}
      </span>
    );
  }

  const text = trimExcerpt(preview.excerpt, chars);
  if (!text) return null;
  return <span className={className}>{text}</span>;
}

function trimExcerpt(text: string, max: number): string {
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  return `${cut.slice(0, cut.lastIndexOf(' ')).replace(/[\s,;:.—–-]+$/, '')}…`;
}

function ListSkeleton() {
  return (
    <ul className="border-b border-[var(--line)]" aria-busy="true">
      <li className="sr-only">Loading posts…</li>
      {[0, 1, 2].map((i) => (
        <li key={i} className="border-t border-[var(--line)] py-5" aria-hidden="true">
          <div className="skeleton h-5" style={{ width: `${72 - i * 14}%` }} />
          <div className="skeleton mt-3 h-4 w-[60%]" />
        </li>
      ))}
    </ul>
  );
}

/* --- Post ----------------------------------------------------------------- */

function PostView({ id }: { id: string }) {
  const [state, retry] = useBlogData<Post>(id, getCachedPost(id), () => fetchPost(id));
  const excerpt = useMemo(() => (state.status === 'ready' ? buildPreview(state.data.html, 160).excerpt : ''), [state]);
  usePageMeta({
    title:
      state.status === 'ready' ? state.data.title : state.status === 'error' && state.notFound ? 'Post not found' : null,
    description: excerpt || undefined,
    path: `/blog/${id}`,
    noindex: state.status === 'error' && state.notFound,
  });

  const html = useMemo(() => (state.status === 'ready' ? sanitize(state.data.html) : ''), [state]);
  const minutes = useMemo(() => (state.status === 'ready' ? readingMinutes(state.data.html) : 0), [state]);

  // Neighbours come from the index if it's already loaded — never fetched just for this.
  const index = getCachedIndex();
  const position = index ? index.posts.findIndex((post) => post.id === id) : -1;
  const newer = position > 0 ? index!.posts[position - 1] : null;
  const older = position >= 0 && index ? (index.posts[position + 1] ?? null) : null;

  return (
    <Shell className="py-12 sm:py-16">
      <article>
        <Link to="/blog" className="text-link inline-flex min-h-[44px] items-center text-[14px] text-[var(--text-2)]">
          All writing
        </Link>

        {state.status === 'loading' && <ArticleSkeleton />}

        {state.status === 'error' &&
          (state.notFound ? (
            <div className="mt-6">
              <PageTitle>This post doesn’t exist.</PageTitle>
              <p className="mt-4 text-[var(--text-2)]">It may have been unpublished, or the link is mistyped.</p>
            </div>
          ) : (
            <ErrorPanel message={state.error} onRetry={retry} />
          ))}

        {state.status === 'ready' && (
          <>
            <header className="mt-4">
              <h1 className="t-page text-[var(--text)] [overflow-wrap:anywhere]">{state.data.title}</h1>
              <Meta className="mt-2">
                <time dateTime={state.data.date}>{formatDate(state.data.date)}</time> · {minutes} min read
              </Meta>
            </header>

            <div className="post-body mt-8" dangerouslySetInnerHTML={{ __html: html }} />

            {(newer || older) && (
              <nav aria-label="More posts" className="mt-12 border-t border-[var(--line)]">
                {older && <Neighbour post={older} label="Older" />}
                {newer && <Neighbour post={newer} label="Newer" />}
              </nav>
            )}
          </>
        )}
      </article>
    </Shell>
  );
}

function Neighbour({ post, label }: { post: { id: string; title: string }; label: string }) {
  return (
    <Link to={`/blog/${post.id}`} className="block border-b border-[var(--line)] py-4 hover:bg-[var(--surface)]">
      <span className="t-meta block">{label}</span>
      <span className="block break-words text-[var(--text)]">{post.title}</span>
    </Link>
  );
}

function ArticleSkeleton() {
  return (
    <div className="mt-4" aria-busy="true">
      <span className="sr-only">Loading post…</span>
      <div aria-hidden="true">
        <div className="skeleton h-8 w-[80%]" />
        <div className="skeleton mt-3 h-4 w-40" />
        <div className="mt-8">
          {[100, 96, 98, 72, 0, 100, 94, 85].map((w, i) =>
            w === 0 ? <div key={i} className="h-6" /> : <div key={i} className="skeleton mt-4 h-4" style={{ width: `${w}%` }} />,
          )}
        </div>
      </div>
    </div>
  );
}

/* --- Shared --------------------------------------------------------------- */

function ErrorPanel({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div role="alert" className="mt-6 border-y border-[var(--line)] py-6">
      <SectionTitle>Couldn’t load</SectionTitle>
      <p className="mt-2 text-[var(--text-2)]">{message}</p>
      <button type="button" onClick={onRetry} className="text-link mt-3 min-h-[44px]">
        Try again
      </button>
    </div>
  );
}
