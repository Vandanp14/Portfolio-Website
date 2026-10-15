import DOMPurify from 'dompurify';
import { useDeferredValue, useEffect, useMemo, useRef, useState, type CSSProperties, type KeyboardEvent } from 'react';
import { ButtonGhost, Eyebrow, Shell } from '../components/primitives';
import { Rule } from '../components/motion/Rule';
import { SplitLines } from '../components/motion/SplitLines';
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
  return (
    <section className="band band-paper min-h-[100svh] pt-[var(--nav-h)]">
      {postId ? <PostView key={postId} id={postId} /> : <IndexView />}
    </section>
  );
}

const pad = (n: number) => String(n).padStart(2, '0');

/* --- Index ---------------------------------------------------------------- */

function IndexView() {
  const [state, retry] = useBlogData<PostIndex>('index', getCachedIndex(), fetchPosts);
  usePageMeta({
    title: state.status === 'ready' ? state.data.title : 'Writing',
    description:
      (state.status === 'ready' && state.data.description) ||
      'Notes on systems, tools and the things Vandan Patel ships.',
    path: '/blog',
  });

  const ready = state.status === 'ready';
  const count = ready ? state.data.posts.length : null;

  return (
    <Shell className="pb-[var(--section)] pt-[clamp(32px,5vw,72px)]">
      <header>
        <Rule strong />
        <div className="mt-4 flex items-baseline justify-between gap-6">
          <Eyebrow>Writing</Eyebrow>
          <span className="t-index text-[var(--text-3)]">/blog</span>
        </div>

        <div className="mt-[clamp(40px,6vw,88px)] grid gap-10 lg:grid-cols-12 lg:items-end">
          <div className="min-w-0 lg:col-span-9">
            {ready ? (
              <>
                <SplitLines
                  as="h1"
                  text={state.data.title}
                  className="t-display block max-w-full text-[clamp(3.5rem,13vw,12rem)] uppercase text-[var(--text)] [overflow-wrap:anywhere]"
                />
                {state.data.description && (
                  <p
                    className="reveal mt-8 max-w-[56ch] text-[18px] leading-[1.45] text-[var(--text-2)]"
                    style={{ '--reveal-delay': '240ms' } as CSSProperties}
                  >
                    {state.data.description}
                  </p>
                )}
              </>
            ) : (
              <div aria-hidden="true">
                <div className="skeleton h-[clamp(3.25rem,12vw,11rem)] w-[min(720px,85%)]" />
                <div className="skeleton mt-8 h-5 w-[min(420px,60%)]" />
              </div>
            )}
          </div>

          <dl className="grid grid-cols-2 gap-x-6 gap-y-5 lg:col-span-3 lg:grid-cols-1">
            <MetaItem term="Posts" value={count === null ? '—' : pad(count)} mono />
            <MetaItem term="Written in" value="Google Docs" />
            <div className="border-l border-[var(--line-strong)] pl-2.5">
              <dt className="t-eyebrow text-[var(--text-3)]">Subscribe</dt>
              <dd className="mt-1 text-[15px] tracking-[-0.01em]">
                <a href="/rss.xml" className="link-draw-in inline-flex min-h-[24px] items-center text-[var(--text)]">
                  RSS feed <span aria-hidden="true">↗</span>
                </a>
              </dd>
            </div>
          </dl>
        </div>
      </header>

      {ready && state.data.posts.length > 0 ? (
        <SearchablePosts posts={state.data.posts} />
      ) : (
        <div className="mt-[clamp(56px,8vw,120px)] flex items-baseline justify-between gap-6">
          <Eyebrow>All posts</Eyebrow>
          {count !== null && (
            <span className="t-index text-[var(--text-3)]">
              {count} {count === 1 ? 'post' : 'posts'}
            </span>
          )}
        </div>
      )}

      {state.status === 'loading' && <ListSkeleton />}
      {state.status === 'error' && <ErrorPanel message={state.error} onRetry={retry} />}
      {ready && state.data.posts.length === 0 && (
        <div className="mt-4">
          <Rule />
          <p className="py-12 text-[18px] text-[var(--text-2)]">Nothing published yet — check back soon.</p>
          <Rule />
        </div>
      )}
    </Shell>
  );
}

/** Metadata line with a 1px left rule. */
function MetaItem({ term, value, mono = false }: { term: string; value: string; mono?: boolean }) {
  return (
    <div className="border-l border-[var(--line-strong)] pl-2.5">
      <dt className="t-eyebrow text-[var(--text-3)]">{term}</dt>
      <dd className={`mt-1 text-[var(--text)] ${mono ? 't-index text-[15px]' : 'text-[15px] tracking-[-0.01em]'}`}>
        {value}
      </dd>
    </div>
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
      <div className="mt-[clamp(56px,8vw,120px)] flex items-baseline justify-between gap-6">
        <Eyebrow>{searching ? 'Results' : 'All posts'}</Eyebrow>
        <span className="t-index text-[var(--text-3)]" aria-live="polite">
          {searching
            ? `${results.length} of ${total} ${total === 1 ? 'post' : 'posts'}`
            : `${total} ${total === 1 ? 'post' : 'posts'}`}
        </span>
      </div>

      <div role="search" className="relative mt-6">
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
          className="field pr-24 text-[clamp(1.25rem,2.2vw,1.625rem)] tracking-[-0.02em] [&::-webkit-search-cancel-button]:hidden"
        />
        <div className="absolute inset-y-0 right-0 flex items-center">
          {query ? (
            <button
              type="button"
              onClick={() => {
                setQuery('');
                input.current?.focus();
              }}
              className="t-eyebrow inline-flex min-h-[44px] items-center px-2 text-[var(--text-2)] hover:text-[var(--text)]"
            >
              Clear
            </button>
          ) : (
            <kbd
              aria-hidden="true"
              className="t-index hidden h-7 min-w-7 items-center justify-center border border-[var(--line)] px-2 text-[12px] text-[var(--text-3)] sm:inline-flex"
            >
              /
            </kbd>
          )}
        </div>
      </div>

      {results.length > 0 ? (
        <PostList posts={results} all={posts} previews={previews} />
      ) : (
        <div className="mt-4 border-b border-[var(--line)] py-12">
          <p className="text-[clamp(1.5rem,2.6vw,2.125rem)] leading-[1.1] tracking-[-0.03em] text-[var(--text)]">
            No posts match “{query.trim()}”.
          </p>
          <p className="mt-3 text-[17px] text-[var(--text-2)]">Try fewer words, or browse everything.</p>
          <ButtonGhost onClick={() => setQuery('')} className="mt-6">
            Show all posts
          </ButtonGhost>
        </div>
      )}
    </>
  );
}

function PostList({
  posts,
  all,
  previews,
}: {
  posts: PostSummary[];
  /** The unfiltered list: numbering and "Latest" stay stable while searching. */
  all: PostSummary[];
  previews: Record<string, PostPreview | null>;
}) {
  return (
    <ol className="mt-4 border-b border-[var(--line)]">
      {posts.map((post, i) => (
        <li
          key={post.id}
          className={i < 8 ? 'reveal' : undefined}
          style={i < 8 ? ({ '--reveal-delay': `${i * 80}ms` } as CSSProperties) : undefined}
        >
          <Rule delay={i < 8 ? i * 80 : 0} strong={i === 0} />
          <PostRow post={post} preview={previews[post.id]} index={all.indexOf(post) + 1} latest={post === all[0]} />
        </li>
      ))}
    </ol>
  );
}

function PostRow({
  post,
  preview,
  index,
  latest,
}: {
  post: PostSummary;
  preview: PostPreview | null | undefined;
  index: number;
  latest: boolean;
}) {
  return (
    <Link
      to={`/blog/${post.id}`}
      className="hover-glitch group grid gap-x-[var(--gutter)] gap-y-4 py-8 md:grid-cols-12 md:py-12"
    >
      <div className="t-index flex flex-wrap items-baseline gap-x-4 gap-y-1 text-[var(--text-3)] md:col-span-2 md:flex-col md:gap-y-2">
        <span className="glitch-target inline-block text-[var(--text)]">/{pad(index)}</span>
        <time dateTime={post.date}>{formatDate(post.date)}</time>
        <ReadTime preview={preview} />
        {latest && <span className="t-eyebrow text-[var(--accent)]">Latest</span>}
      </div>

      <div className={`min-w-0 ${preview?.image ? 'md:col-span-7' : 'md:col-span-9'}`}>
        <span className="t-display block max-w-[22ch] text-[clamp(2rem,4.6vw,3.5rem)] leading-[1] tracking-[-0.04em] text-[var(--text)] transition-transform duration-[var(--t-medium)] ease-[var(--ease-out-expo)] [overflow-wrap:anywhere] group-hover:translate-x-2">
          {post.title}
        </span>
        <Excerpt
          preview={preview}
          chars={latest ? 340 : 220}
          lines={latest ? 3 : 2}
          className="mt-5 max-w-[62ch] text-[17px] leading-[1.5]"
        />
      </div>

      <div className="flex items-start justify-between gap-6 md:col-span-3 md:justify-end">
        {preview?.image && <Thumb src={preview.image} className="aspect-[4/3] w-full max-w-[280px]" />}
        <span
          aria-hidden="true"
          className={`arrow-nudge text-[22px] leading-none text-[var(--text)] ${preview?.image ? 'hidden md:inline-block' : ''}`}
        >
          ↗
        </span>
      </div>
    </Link>
  );
}

function ReadTime({ preview }: { preview: PostPreview | null | undefined }) {
  if (!preview) return null;
  return <span className="preview-in">{preview.minutes} min read</span>;
}

/**
 * Skeleton lines hold the excerpt's space while the post loads, then the text
 * arrives word by word (blur → sharp, rising) so previews land as one
 * deliberate motion instead of popping in. Total stagger is capped so long
 * excerpts don't drag.
 */
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
      <div className={className} aria-hidden="true">
        {Array.from({ length: lines }, (_, i) => (
          <div
            key={i}
            className="skeleton my-[0.45em] h-[0.8em]"
            style={{ width: i === lines - 1 ? '58%' : `${100 - i * 4}%` }}
          />
        ))}
      </div>
    );
  }

  const text = trimExcerpt(preview.excerpt, chars);
  if (!text) return null;
  const words = text.split(' ');
  const step = Math.min(18, 520 / words.length);

  return (
    <p className={`${className} text-[var(--text-2)]`}>
      <span className="sr-only">{text}</span>
      {words.map((word, i) => (
        <span key={i} aria-hidden="true">
          <span className="preview-word" style={{ '--word-delay': `${Math.round(i * step)}ms` } as CSSProperties}>
            {word}
          </span>{' '}
        </span>
      ))}
    </p>
  );
}

function trimExcerpt(text: string, max: number): string {
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  return `${cut.slice(0, cut.lastIndexOf(' ')).replace(/[\s,;:.—–-]+$/, '')}…`;
}

function Thumb({ src, className }: { src: string; className: string }) {
  return (
    <div data-reveal="cover" className={`bg-[var(--surface-2)] ${className}`}>
      <img src={src} alt="" loading="lazy" decoding="async" className="h-full w-full object-cover" />
    </div>
  );
}

function ListSkeleton() {
  return (
    <ul className="mt-4 divide-y divide-[var(--line)] border-y border-[var(--line)]" aria-busy="true">
      <li className="sr-only">Loading posts…</li>
      {[0, 1, 2].map((i) => (
        <li key={i} className="grid gap-x-[var(--gutter)] gap-y-4 py-8 md:grid-cols-12 md:py-12" aria-hidden="true">
          <div className="skeleton h-3 w-24 md:col-span-2" />
          <div className="md:col-span-9">
            <div className="skeleton h-[clamp(2rem,4.6vw,3.5rem)]" style={{ width: `${72 - i * 14}%` }} />
            <div className="skeleton mt-5 h-4 w-[60%]" />
          </div>
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
    <Shell className="pb-[var(--section)] pt-[clamp(32px,5vw,72px)]">
      <article>
        <BackLink />

        {state.status === 'loading' && <ArticleSkeleton />}

        {state.status === 'error' &&
          (state.notFound ? (
            <div className="mt-12">
              <Rule strong />
              <p className="t-index mt-4 text-[var(--text-3)]">/404</p>
              <h1 className="t-display mt-8 max-w-[14ch] text-[clamp(3rem,9vw,7.5rem)] uppercase text-[var(--text)]">
                This post doesn’t exist.
              </h1>
              <p className="mt-8 max-w-[56ch] text-[18px] leading-[1.45] text-[var(--text-2)]">
                It may have been unpublished or the link is mistyped.
              </p>
            </div>
          ) : (
            <ErrorPanel message={state.error} onRetry={retry} />
          ))}

        {state.status === 'ready' && (
          <>
            <header className="mt-10">
              <Rule strong />
              <div className="t-index mt-4 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 text-[var(--text-3)]">
                <span className="flex flex-wrap gap-x-4 gap-y-1">
                  <time dateTime={state.data.date}>{formatDate(state.data.date)}</time>
                  <span>{minutes} min read</span>
                </span>
                {position >= 0 && <span>/{pad(position + 1)}</span>}
              </div>
              <SplitLines
                as="h1"
                text={state.data.title}
                className="t-display mt-[clamp(32px,5vw,72px)] block max-w-[20ch] text-[clamp(2.75rem,7vw,5.5rem)] text-[var(--text)] [overflow-wrap:anywhere]"
              />
            </header>

            <div className="mt-[clamp(48px,7vw,104px)] grid gap-x-[var(--gutter)] xl:grid-cols-12">
              <aside className="hidden xl:col-span-3 xl:block" aria-label="Post details">
                <dl className="sticky top-[var(--nav-h)] grid gap-5">
                  <MetaItem term="Published" value={formatDate(state.data.date)} />
                  <MetaItem term="Reading time" value={`${minutes} min`} mono />
                  {index && position >= 0 && (
                    <MetaItem term="Entry" value={`${pad(position + 1)} / ${pad(index.posts.length)}`} mono />
                  )}
                </dl>
              </aside>
              <div className="min-w-0 xl:col-span-9">
                <div className="post-body max-w-[68ch]" dangerouslySetInnerHTML={{ __html: html }} />
              </div>
            </div>

            <footer className="mt-[clamp(64px,8vw,120px)]">
              <Rule strong />
              {(newer || older) && (
                <nav aria-label="More posts" className="grid sm:grid-cols-2">
                  {older && <Neighbour post={older} label="Older" />}
                  {newer && <Neighbour post={newer} label="Newer" alignEnd />}
                </nav>
              )}
              <div className={newer || older ? 'border-t border-[var(--line)] pt-6' : 'pt-6'}>
                <Link
                  to="/blog"
                  className="link-draw-in inline-flex min-h-[44px] items-center gap-2 text-[16px] text-[var(--text)]"
                >
                  <span aria-hidden="true">↳</span> Back to all writing
                </Link>
              </div>
            </footer>
          </>
        )}
      </article>
    </Shell>
  );
}

function BackLink() {
  return (
    <Link
      to="/blog"
      className="t-eyebrow group inline-flex min-h-[44px] items-center gap-2 text-[var(--text-2)] transition-colors duration-[var(--t-fast)] ease-[var(--ease-out-expo)] hover:text-[var(--text)]"
    >
      <span aria-hidden="true" className="arrow-nudge-x inline-block transition-transform duration-[var(--t-base)] ease-[var(--ease-out-expo)]">
        ↳
      </span>
      <span className="link-draw-in">All writing</span>
    </Link>
  );
}

function Neighbour({
  post,
  label,
  alignEnd = false,
}: {
  post: { id: string; title: string };
  label: string;
  alignEnd?: boolean;
}) {
  return (
    <Link
      to={`/blog/${post.id}`}
      className={`group block py-8 ${
        alignEnd
          ? '[&:not(:first-child)]:border-t [&:not(:first-child)]:border-[var(--line)] sm:col-start-2 sm:pl-[var(--gutter)] sm:text-right sm:[&:not(:first-child)]:border-l sm:[&:not(:first-child)]:border-t-0'
          : 'sm:pr-[var(--gutter)]'
      }`}
    >
      <span className="t-index flex items-center gap-2 text-[var(--text-3)] sm:inline-flex">
        {alignEnd ? null : <span aria-hidden="true">←</span>}
        {label}
        {alignEnd ? <span aria-hidden="true">→</span> : null}
      </span>
      <span className="mt-4 block text-[clamp(1.5rem,2.6vw,2.125rem)] leading-[1.08] tracking-[-0.035em] text-[var(--text)] transition-transform duration-[var(--t-medium)] ease-[var(--ease-out-expo)] group-hover:translate-x-1.5">
        {post.title}
      </span>
    </Link>
  );
}

function ArticleSkeleton() {
  return (
    <div className="mt-10" aria-busy="true">
      <span className="sr-only">Loading post…</span>
      <div aria-hidden="true">
        <div className="h-px bg-[var(--line-strong)]" />
        <div className="skeleton mt-4 h-3 w-40" />
        <div className="skeleton mt-[clamp(32px,5vw,72px)] h-[clamp(2.75rem,7vw,5.5rem)] w-[90%]" />
        <div className="skeleton mt-3 h-[clamp(2.75rem,7vw,5.5rem)] w-[60%]" />
        <div className="mt-[clamp(48px,7vw,104px)] max-w-[68ch] xl:ml-[25%]">
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
    <div role="alert" className="mt-8 border-y border-[var(--line)] py-8 sm:flex sm:items-center sm:justify-between sm:gap-6">
      <div>
        <p className="t-eyebrow text-[var(--signal)]">Couldn’t load</p>
        <p className="mt-2 text-[17px] leading-[1.45] text-[var(--text-2)]">{message}</p>
      </div>
      <ButtonGhost onClick={onRetry} className="mt-6 sm:mt-0 sm:shrink-0">
        Try again <span aria-hidden="true">↻</span>
      </ButtonGhost>
    </div>
  );
}
