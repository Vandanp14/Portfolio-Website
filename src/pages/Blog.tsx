import DOMPurify from 'dompurify';
import { ArrowLeft, ArrowRight, ArrowUpRight, RotateCw } from 'lucide-react';
import { useEffect, useMemo, useState, type CSSProperties } from 'react';
import { Shell } from '../components/primitives';
import { useRevealObserver } from '../hooks/useReveal';
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

function useDocumentTitle(title: string | null) {
  useEffect(() => {
    if (!title) return;
    const previous = document.title;
    document.title = `${title} — Vandan Patel`;
    return () => {
      document.title = previous;
    };
  }, [title]);
}

export default function Blog({ postId }: { postId: string | null }) {
  return (
    <section className="band band-paper min-h-[100svh] pt-16">
      {postId ? <PostView key={postId} id={postId} /> : <IndexView />}
    </section>
  );
}

/* --- Index ---------------------------------------------------------------- */

function IndexView() {
  const [state, retry] = useBlogData<PostIndex>('index', getCachedIndex(), fetchPosts);
  useRevealObserver([state.status]);
  useDocumentTitle(state.status === 'ready' ? state.data.title : 'Writing');

  const ready = state.status === 'ready';

  return (
    <Shell className="pb-[var(--section)] pt-[clamp(56px,8vw,112px)]">
      <header>
        <div className="flex items-center gap-3">
          <span className="label text-[var(--accent)]">05</span>
          <span className="h-px w-8 bg-[var(--line-strong)]" aria-hidden="true" />
          <span className="label text-[var(--text-3)]">Writing</span>
        </div>
        {ready ? (
          <>
            <h1 className="font-editorial mt-5 max-w-[16ch] text-[clamp(2.75rem,7vw,5.25rem)] text-[var(--text)]">
              {state.data.title}
            </h1>
            {state.data.description && (
              <p className="mt-5 max-w-[58ch] text-[17px] leading-[1.65] text-[var(--text-2)]">
                {state.data.description}
              </p>
            )}
          </>
        ) : (
          <div aria-hidden="true">
            <div className="skeleton mt-6 h-[clamp(2.75rem,7vw,5.25rem)] w-[min(520px,80%)]" />
            <div className="skeleton mt-6 h-5 w-[min(360px,60%)]" />
          </div>
        )}
      </header>

      <div className="mt-[clamp(48px,7vw,88px)] flex items-baseline justify-between border-t border-[var(--line)] pt-10">
        <span className="label text-[var(--text-3)]">All posts</span>
        {ready && (
          <span className="label text-[var(--text-3)]">
            {state.data.posts.length} {state.data.posts.length === 1 ? 'post' : 'posts'}
          </span>
        )}
      </div>

      {state.status === 'loading' && <ListSkeleton />}
      {state.status === 'error' && <ErrorPanel message={state.error} onRetry={retry} />}
      {ready && state.data.posts.length === 0 && (
        <p className="mt-6 border-y border-[var(--line)] py-10 text-[15px] text-[var(--text-2)]">
          Nothing published yet — check back soon.
        </p>
      )}
      {ready && state.data.posts.length > 0 && <PostList posts={state.data.posts} />}
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

function PostList({ posts }: { posts: PostSummary[] }) {
  const previews = usePreviews(posts);
  const [featured, ...rest] = posts;

  return (
    <div className="mt-6">
      <FeaturedCard post={featured} preview={previews[featured.id]} />
      {rest.length > 0 && (
        <ul className="mt-4 divide-y divide-[var(--line)] border-y border-[var(--line)]">
          {rest.map((post, i) => (
            <li
              key={post.id}
              className={i < 8 ? 'reveal' : undefined}
              style={i < 8 ? ({ '--reveal-delay': `${(i + 1) * 80}ms` } as CSSProperties) : undefined}
            >
              <PostRow post={post} preview={previews[post.id]} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function FeaturedCard({ post, preview }: { post: PostSummary; preview: PostPreview | null | undefined }) {
  return (
    <Link
      to={`/blog/${post.id}`}
      className="reveal group relative block overflow-hidden rounded-[var(--r-xl)] border border-[var(--line)] bg-[var(--surface)] p-[clamp(24px,4vw,48px)] transition-[border-color,box-shadow,transform] duration-[var(--t-base)] ease-[var(--ease-out-expo)] hover:-translate-y-[2px] hover:border-[var(--line-strong)] hover:shadow-[var(--shadow)]"
    >
      <div className={preview?.image ? 'grid gap-8 md:grid-cols-[1.4fr_1fr] md:items-center' : ''}>
        <div>
          <div className="label flex flex-wrap items-center gap-x-3 gap-y-1 text-[var(--text-3)]">
            <span className="text-[var(--accent)]">Latest</span>
            <span className="h-px w-5 bg-[var(--line-strong)]" aria-hidden="true" />
            <time dateTime={post.date}>{formatDate(post.date)}</time>
            <ReadTime preview={preview} />
          </div>
          <h2 className="font-editorial mt-5 max-w-[22ch] text-[clamp(2rem,4.4vw,3.25rem)] text-[var(--text)] transition-colors duration-[var(--t-fast)] ease-[var(--ease-out-expo)] group-hover:text-[var(--accent)]">
            {post.title}
          </h2>
          <Excerpt preview={preview} chars={340} lines={4} className="mt-5 line-clamp-5 max-w-[62ch] text-[17px] leading-[1.7] md:line-clamp-none" />
          <span className="label mt-8 inline-flex items-center gap-2 text-[var(--text)]">
            Read the post
            <ArrowRight
              className="h-3.5 w-3.5 transition-transform duration-[var(--t-base)] ease-[var(--ease-out-expo)] group-hover:translate-x-1"
              aria-hidden="true"
            />
          </span>
        </div>
        {preview?.image && <Thumb src={preview.image} className="aspect-[4/3]" />}
      </div>
    </Link>
  );
}

function PostRow({ post, preview }: { post: PostSummary; preview: PostPreview | null | undefined }) {
  return (
    <Link
      to={`/blog/${post.id}`}
      className="group -mx-3 grid gap-x-8 gap-y-2 rounded-[var(--r-md)] px-3 py-7 transition-colors duration-[var(--t-fast)] ease-[var(--ease-out-expo)] hover:bg-[var(--surface)] md:grid-cols-[140px_1fr_auto] md:py-8"
    >
      <div className="label flex gap-3 text-[var(--text-3)] md:flex-col md:gap-1.5 md:pt-1.5">
        <time dateTime={post.date}>{formatDate(post.date)}</time>
        <ReadTime preview={preview} bare />
      </div>
      <div className="min-w-0">
        <span className="block text-[clamp(1.15rem,2vw,1.4rem)] font-medium leading-[1.3] tracking-[-0.015em] text-[var(--text)] transition-colors duration-[var(--t-fast)] ease-[var(--ease-out-expo)] group-hover:text-[var(--accent)]">
          {post.title}
        </span>
        <Excerpt preview={preview} chars={220} lines={2} className="mt-2.5 max-w-[66ch] text-[15px] leading-[1.65]" />
      </div>
      <div className="hidden items-start gap-6 md:flex">
        {preview?.image && <Thumb src={preview.image} className="aspect-[4/3] w-36" />}
        <ArrowUpRight
          className="mt-1.5 h-4 w-4 text-[var(--text-3)] transition-[transform,color] duration-[var(--t-fast)] ease-[var(--ease-out-expo)] group-hover:-translate-y-[2px] group-hover:translate-x-[2px] group-hover:text-[var(--accent)]"
          aria-hidden="true"
        />
      </div>
    </Link>
  );
}

function ReadTime({ preview, bare = false }: { preview: PostPreview | null | undefined; bare?: boolean }) {
  if (!preview) return null;
  return (
    <span className="preview-in inline-flex items-center gap-3">
      {!bare && <span className="h-px w-5 bg-[var(--line-strong)]" aria-hidden="true" />}
      {preview.minutes} min read
    </span>
  );
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
    <div className={`preview-in overflow-hidden rounded-[var(--r-lg)] border border-[var(--line)] bg-[var(--surface-2)] ${className}`}>
      <img
        src={src}
        alt=""
        loading="lazy"
        decoding="async"
        className="h-full w-full object-cover transition-transform duration-[var(--t-slow)] ease-[var(--ease-out-expo)] group-hover:scale-[1.03]"
      />
    </div>
  );
}

function ListSkeleton() {
  return (
    <ul className="mt-6 divide-y divide-[var(--line)] border-y border-[var(--line)]" aria-busy="true">
      <li className="sr-only">Loading posts…</li>
      {[0, 1, 2].map((i) => (
        <li key={i} className="grid gap-x-8 gap-y-3 py-7 md:grid-cols-[140px_1fr]" aria-hidden="true">
          <div className="skeleton h-3 w-24" />
          <div className="skeleton h-6" style={{ width: `${72 - i * 14}%` }} />
        </li>
      ))}
    </ul>
  );
}

/* --- Post ----------------------------------------------------------------- */

function PostView({ id }: { id: string }) {
  const [state, retry] = useBlogData<Post>(id, getCachedPost(id), () => fetchPost(id));
  useDocumentTitle(
    state.status === 'ready' ? state.data.title : state.status === 'error' && state.notFound ? 'Post not found' : null,
  );

  const html = useMemo(() => (state.status === 'ready' ? sanitize(state.data.html) : ''), [state]);
  const minutes = useMemo(() => (state.status === 'ready' ? readingMinutes(state.data.html) : 0), [state]);

  // Neighbours come from the index if it's already loaded — never fetched just for this.
  const index = getCachedIndex();
  const position = index ? index.posts.findIndex((post) => post.id === id) : -1;
  const newer = position > 0 ? index!.posts[position - 1] : null;
  const older = position >= 0 && index ? (index.posts[position + 1] ?? null) : null;

  return (
    <Shell className="pb-[var(--section)] pt-[clamp(40px,6vw,80px)]">
      <article className="mx-auto max-w-[68ch]">
        <BackLink />

        {state.status === 'loading' && <ArticleSkeleton />}

        {state.status === 'error' &&
          (state.notFound ? (
            <div className="mt-12">
              <p className="label text-[var(--accent)]">404</p>
              <h1 className="font-editorial mt-5 text-[clamp(2.25rem,5vw,3.5rem)] text-[var(--text)]">
                This post doesn’t exist.
              </h1>
              <p className="mt-4 text-[16px] leading-[1.65] text-[var(--text-2)]">
                It may have been unpublished or the link is mistyped.
              </p>
            </div>
          ) : (
            <ErrorPanel message={state.error} onRetry={retry} />
          ))}

        {state.status === 'ready' && (
          <>
            <header className="mt-12">
              <div className="label flex flex-wrap items-center gap-x-3 gap-y-1 text-[var(--text-3)]">
                <time dateTime={state.data.date}>{formatDate(state.data.date)}</time>
                <span className="h-px w-5 bg-[var(--line-strong)]" aria-hidden="true" />
                <span>{minutes} min read</span>
              </div>
              <h1 className="font-editorial mt-6 text-[clamp(2.4rem,6vw,4rem)] text-[var(--text)]">
                {state.data.title}
              </h1>
            </header>
            <div className="mt-10 h-px bg-[var(--line)]" aria-hidden="true" />
            <div className="post-body mt-10" dangerouslySetInnerHTML={{ __html: html }} />

            <footer className="mt-16 border-t border-[var(--line)] pt-8">
              {(newer || older) && (
                <nav aria-label="More posts" className="grid gap-4 sm:grid-cols-2">
                  {older ? <Neighbour post={older} label="Older" /> : <span />}
                  {newer && <Neighbour post={newer} label="Newer" alignEnd />}
                </nav>
              )}
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
      className="group label inline-flex items-center gap-2 text-[var(--text-2)] transition-colors duration-[var(--t-fast)] ease-[var(--ease-out-expo)] hover:text-[var(--accent)]"
    >
      <ArrowLeft
        className="h-3.5 w-3.5 transition-transform duration-[var(--t-fast)] ease-[var(--ease-out-expo)] group-hover:-translate-x-0.5"
        aria-hidden="true"
      />
      All writing
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
      className={`group block rounded-[var(--r-lg)] border border-[var(--line)] p-5 transition-[border-color,background-color] duration-[var(--t-fast)] ease-[var(--ease-out-expo)] hover:border-[var(--line-strong)] hover:bg-[var(--surface)] ${
        alignEnd ? 'sm:col-start-2 sm:text-right' : ''
      }`}
    >
      <span
        className={`label inline-flex items-center gap-1.5 text-[var(--text-3)] ${alignEnd ? 'sm:flex-row-reverse' : ''}`}
      >
        {alignEnd ? <ArrowRight className="h-3 w-3" aria-hidden="true" /> : <ArrowLeft className="h-3 w-3" aria-hidden="true" />}
        {label}
      </span>
      <span className="mt-2 block text-[16px] font-medium leading-[1.4] text-[var(--text)] transition-colors duration-[var(--t-fast)] ease-[var(--ease-out-expo)] group-hover:text-[var(--accent)]">
        {post.title}
      </span>
    </Link>
  );
}

function ArticleSkeleton() {
  return (
    <div className="mt-12" aria-busy="true">
      <span className="sr-only">Loading post…</span>
      <div aria-hidden="true">
        <div className="skeleton h-3 w-40" />
        <div className="skeleton mt-6 h-12 w-[90%]" />
        <div className="skeleton mt-3 h-12 w-[60%]" />
        <div className="mt-10 h-px bg-[var(--line)]" />
        {[100, 96, 98, 72, 0, 100, 94, 85].map((w, i) =>
          w === 0 ? <div key={i} className="h-6" /> : <div key={i} className="skeleton mt-4 h-4" style={{ width: `${w}%` }} />,
        )}
      </div>
    </div>
  );
}

/* --- Shared --------------------------------------------------------------- */

function ErrorPanel({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div
      role="alert"
      className="mt-8 rounded-[var(--r-lg)] border border-[var(--line)] bg-[var(--surface)] p-6 sm:flex sm:items-center sm:justify-between sm:gap-6"
    >
      <div>
        <p className="label text-[var(--signal)]">Couldn’t load</p>
        <p className="mt-2 text-[15px] leading-[1.6] text-[var(--text-2)]">{message}</p>
      </div>
      <button
        type="button"
        onClick={onRetry}
        className="mt-5 inline-flex items-center gap-2 rounded-[var(--r-md)] border border-[var(--line-strong)] px-4 py-2.5 text-[14px] font-medium text-[var(--text)] transition-[border-color,background-color] duration-[var(--t-fast)] ease-[var(--ease-out-expo)] hover:border-[var(--text-3)] hover:bg-[var(--surface-2)] sm:mt-0 sm:shrink-0"
      >
        <RotateCw className="h-3.5 w-3.5" aria-hidden="true" />
        Try again
      </button>
    </div>
  );
}
