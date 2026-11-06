import { GlobalWorkerOptions, getDocument } from 'pdfjs-dist/legacy/build/pdf.mjs';
import type { PDFDocumentLoadingTask, PDFDocumentProxy, PDFPageProxy } from 'pdfjs-dist/legacy/build/pdf.mjs';
import workerUrl from 'pdfjs-dist/legacy/build/pdf.worker.min.mjs?url';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Meta, PageTitle, SectionTitle, Shell } from '../components/primitives';
import { track } from '../lib/analytics';
import { pageById } from '../lib/routes';
import { usePageMeta } from '../lib/seo';
import { formatUpdated, loadResume, pdfUrl, RESUME_FILENAME, type ResumeFile } from '../lib/resume';

// Legacy build: the modern one leans on very recent JS features that older
// mobile Safari versions lack.
GlobalWorkerOptions.workerSrc = workerUrl;

const MIN_SCALE = 0.5;
const MAX_SCALE = 3;
const STEP = 0.25;
const MAX_DPR = 2.5;
/** Fit-to-width never blows the page up past this on wide screens. */
const MAX_FIT = 1.5;

type State =
  | { kind: 'loading'; step: 'checking' | 'downloading' | 'rendering'; progress?: number }
  | { kind: 'error'; error: string }
  | { kind: 'ready'; file: ResumeFile; doc: PDFDocumentProxy; pages: PDFPageProxy[] };

export default function Resume() {
  const [state, setState] = useState<State>({ kind: 'loading', step: 'checking' });
  const [attempt, setAttempt] = useState(0);
  const page = pageById('resume');

  usePageMeta({
    title: page.label,
    description: page.description,
    path: page.path,
  });

  useEffect(() => {
    let live = true;
    let task: PDFDocumentLoadingTask | null = null;
    setState({ kind: 'loading', step: 'checking' });

    (async () => {
      const result = await loadResume((step, progress) => {
        if (live) setState({ kind: 'loading', step, progress });
      });
      if (!live) return;
      if (!result.ok) {
        setState({ kind: 'error', error: result.error });
        return;
      }

      setState({ kind: 'loading', step: 'rendering' });
      try {
        // pdf.js transfers (detaches) the buffer it's given — hand it a copy so
        // the original bytes stay intact for the Download button.
        task = getDocument({ data: result.data.bytes.slice() });
        const doc = await task.promise;
        const pages = await Promise.all(Array.from({ length: doc.numPages }, (_, i) => doc.getPage(i + 1)));
        if (live) setState({ kind: 'ready', file: result.data, doc, pages });
      } catch {
        if (live) setState({ kind: 'error', error: 'The résumé file couldn’t be opened.' });
      }
    })();

    return () => {
      live = false;
      task?.destroy();
    };
  }, [attempt]);


  const updated = state.kind === 'ready' && state.file.meta.updatedAt ? formatUpdated(state.file.meta.updatedAt) : '';
  const size = state.kind === 'ready' && state.file.meta.size ? `${Math.max(1, Math.round(state.file.meta.size / 1024))} KB` : '';

  return (
    <Shell className="py-12 sm:py-16">
      <PageTitle>{page.label}</PageTitle>
      <Meta className="mt-2">
        {[updated && `Updated ${updated}`, state.kind === 'ready' && `${state.pages.length} ${state.pages.length === 1 ? 'page' : 'pages'}`, size && `PDF, ${size}`]
          .filter(Boolean)
          .join(' · ') || 'The newest PDF, shown here.'}
      </Meta>

      <div className="mt-8">
        {state.kind === 'ready' ? (
          <Viewer file={state.file} pages={state.pages} />
        ) : state.kind === 'error' ? (
          <ErrorPanel message={state.error} onRetry={() => setAttempt((n) => n + 1)} />
        ) : (
          <LoadingPaper step={state.step} progress={state.progress} />
        )}
      </div>
    </Shell>
  );
}

/* --- Viewer --------------------------------------------------------------- */

function Viewer({ file, pages }: { file: ResumeFile; pages: PDFPageProxy[] }) {
  const stageRef = useRef<HTMLDivElement>(null);
  const [fitScale, setFitScale] = useState(1);
  const [zoom, setZoom] = useState<number | 'fit'>('fit');
  const [current, setCurrent] = useState(1);

  const scale = zoom === 'fit' ? fitScale : zoom;
  const baseWidth = useMemo(() => pages[0].getViewport({ scale: 1 }).width, [pages]);

  // Fit-to-width tracks the stage's width (rotation, resize, sidebar, …).
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const observer = new ResizeObserver(([entry]) => {
      const width = entry.contentRect.width;
      if (width > 0) setFitScale(Math.min(MAX_FIT, width / baseWidth));
    });
    observer.observe(stage);
    return () => observer.disconnect();
  }, [baseWidth]);

  const zoomBy = useCallback(
    (delta: number) =>
      setZoom((z) => {
        const from = z === 'fit' ? fitScale : z;
        const snapped = Math.round((from + delta) / STEP) * STEP;
        return Math.min(MAX_SCALE, Math.max(MIN_SCALE, snapped));
      }),
    [fitScale],
  );

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      const target = event.target as HTMLElement | null;
      if (target && /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName)) return;
      if (event.key === '+' || event.key === '=') zoomBy(STEP);
      else if (event.key === '-') zoomBy(-STEP);
      else if (event.key === '0') setZoom('fit');
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [zoomBy]);

  // Current page = the one most in view.
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const nodes = Array.from(stage.querySelectorAll<HTMLElement>('[data-page]'));
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setCurrent(Number((visible.target as HTMLElement).dataset.page));
      },
      { threshold: [0.25, 0.5, 0.75] },
    );
    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, [pages]);

  // Download hands over exactly the bytes being previewed. Created inside the
  // effect (not useMemo) so the URL is never revoked while still rendered.
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  useEffect(() => {
    const url = URL.createObjectURL(new Blob([file.bytes], { type: 'application/pdf' }));
    setBlobUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);


  const toolButton =
    'inline-flex h-11 min-w-11 items-center justify-center px-2 text-[18px] leading-none text-[var(--text-2)] transition-colors duration-150 hover:bg-[var(--surface-2)] hover:text-[var(--text)] disabled:pointer-events-none disabled:opacity-40';

  return (
    <div>
      <div
        role="toolbar"
        aria-label="Résumé viewer"
        className="sticky top-2 z-20 flex flex-wrap items-center justify-between gap-2 border border-[var(--line)] bg-[var(--bg)] p-1"
      >
        <div className="flex items-center">
          <span className="hidden px-3 text-[14px] tabular-nums text-[var(--text-2)] sm:inline" aria-live="polite">
            Page {current} of {pages.length}
          </span>
          <span className="mx-1 hidden h-6 w-px bg-[var(--line)] sm:block" aria-hidden="true" />
          <button
            type="button"
            className={toolButton}
            onClick={() => zoomBy(-STEP)}
            disabled={scale <= MIN_SCALE}
            aria-label="Zoom out"
          >
            <span aria-hidden="true">−</span>
          </button>
          <span className="w-12 text-center text-[14px] tabular-nums text-[var(--text)] sm:w-14" aria-live="polite">
            {Math.round(scale * 100)}%
          </span>
          <button
            type="button"
            className={toolButton}
            onClick={() => zoomBy(STEP)}
            disabled={scale >= MAX_SCALE}
            aria-label="Zoom in"
          >
            <span aria-hidden="true">+</span>
          </button>
          <button
            type="button"
            className={`${toolButton} ml-1 px-3 text-[14px] ${zoom === 'fit' ? 'text-[var(--text)] underline decoration-1 underline-offset-4' : ''}`}
            onClick={() => setZoom('fit')}
            aria-label="Fit to width"
            aria-pressed={zoom === 'fit'}
          >
            Fit
          </button>
        </div>

        <div className="flex items-center gap-1">
          <a
            href={pdfUrl(file.meta.version)}
            target="_blank"
            rel="noopener noreferrer"
            className={`${toolButton} hidden gap-1.5 px-3 text-[14px] sm:inline-flex`}
            aria-label="Open PDF in a new tab"
          >
            Open <span aria-hidden="true">↗</span>
          </a>
          <a
            href={blobUrl ?? pdfUrl(file.meta.version, true)}
            download={RESUME_FILENAME}
            onClick={() =>
              track('file_download', {
                file_name: RESUME_FILENAME,
                file_extension: 'pdf',
                resume_version: file.meta.updatedAt,
              })
            }
            className="inline-flex min-h-[44px] items-center justify-center border border-[var(--text)] bg-[var(--text)] px-5 text-[16px] text-[var(--bg)] transition-[background-color,color] duration-150 hover:bg-transparent hover:text-[var(--text)]"
          >
            Download PDF
          </a>
        </div>
      </div>

      <div ref={stageRef} className="mt-6 overflow-x-auto pb-2">
        <div className="mx-auto flex w-max min-w-full flex-col items-center gap-6">
          {pages.map((page) => (
            <PageCanvas key={page.pageNumber} page={page} scale={scale} />
          ))}
        </div>
      </div>
    </div>
  );
}


type LinkBox = { url: string; left: number; top: number; width: number; height: number };

function PageCanvas({ page, scale }: { page: PDFPageProxy; scale: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [links, setLinks] = useState<LinkBox[]>([]);
  const [drawn, setDrawn] = useState(false);
  const viewport = page.getViewport({ scale });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
    const sharp = page.getViewport({ scale: scale * dpr });

    // Debounced so stepping through zoom levels doesn't queue a render each.
    let task: ReturnType<PDFPageProxy['render']> | null = null;
    const timer = setTimeout(() => {
      canvas.width = Math.floor(sharp.width);
      canvas.height = Math.floor(sharp.height);
      task = page.render({ canvas, viewport: sharp });
      task.promise.then(
        () => setDrawn(true),
        () => {
          /* cancelled by a newer render */
        },
      );
    }, 60);

    return () => {
      clearTimeout(timer);
      task?.cancel();
    };
  }, [page, scale]);

  // Real links from the PDF (email, LinkedIn, GitHub…) overlaid as anchors.
  useEffect(() => {
    let live = true;
    page.getAnnotations().then((annotations) => {
      if (!live) return;
      const css = page.getViewport({ scale });
      setLinks(
        annotations
          .filter((a) => a.subtype === 'Link' && typeof a.url === 'string' && /^(https?:|mailto:)/i.test(a.url))
          .map((a) => {
            const [x1, y1] = css.convertToViewportPoint(a.rect[0], a.rect[1]);
            const [x2, y2] = css.convertToViewportPoint(a.rect[2], a.rect[3]);
            return {
              url: a.url as string,
              left: Math.min(x1, x2),
              top: Math.min(y1, y2),
              width: Math.abs(x2 - x1),
              height: Math.abs(y2 - y1),
            };
          }),
      );
    });
    return () => {
      live = false;
    };
  }, [page, scale]);

  return (
    <div
      data-page={page.pageNumber}
      className="relative overflow-hidden border border-[var(--line)] bg-white"
      style={{ width: viewport.width, height: viewport.height }}
    >
      <canvas
        ref={canvasRef}
        aria-label={`Résumé page ${page.pageNumber}`}
        role="img"
        className={`block h-full w-full transition-opacity duration-150 ${
          drawn ? 'opacity-100' : 'opacity-0'
        }`}
      />
      {links.map((link, i) => (
        <a
          key={i}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={link.url.replace(/^mailto:/, '')}
          className="absolute rounded-[2px] hover:bg-black/10"
          style={{ left: link.left, top: link.top, width: link.width, height: link.height }}
        />
      ))}
    </div>
  );
}

/* --- States --------------------------------------------------------------- */

const STEP_LABEL = {
  checking: 'Checking for the latest version',
  downloading: 'Downloading',
  rendering: 'Rendering',
} as const;


function LoadingPaper({ step, progress }: { step: keyof typeof STEP_LABEL; progress?: number }) {
  // 0% = the server is still stitching chunks together; show that honestly
  // as indeterminate rather than a bar stuck at zero.
  const percent = step === 'downloading' && progress ? Math.round(progress * 100) : null;
  const label = step === 'downloading' && percent === null ? 'Preparing the PDF' : STEP_LABEL[step];

  return (
    <div aria-busy="true">
      <div className="flex min-h-[54px] items-center justify-between gap-4 border border-[var(--line)] bg-[var(--bg)] px-4">
        <span className="text-[14px] text-[var(--text-2)]" role="status">
          {label}
          {percent !== null ? ` · ${percent}%` : '…'}
        </span>
      </div>
      <div className="h-px w-full overflow-hidden bg-[var(--line)]" aria-hidden="true">
        <div
          className={`h-full bg-[var(--text)] transition-[width] duration-150 ${
            percent === null ? 'resume-indeterminate w-1/3' : ''
          }`}
          style={percent !== null ? { width: `${Math.max(4, percent)}%` } : undefined}
        />
      </div>

      <div
        className="mx-auto mt-6 aspect-[8.5/11] w-full border border-[var(--line)] bg-[var(--surface)] p-[7%]"
        aria-hidden="true"
      >
        <div className="skeleton h-[4%] w-[45%]" />
        <div className="skeleton mt-[2%] h-[1.6%] w-[70%]" />
        {[0, 1, 2].map((block) => (
          <div key={block} className="mt-[7%]">
            <div className="skeleton h-[1.8%] min-h-2 w-[28%]" />
            {[96, 100, 88, 92].map((w, i) => (
              <div key={i} className="skeleton mt-[1.6%] h-[1.3%] min-h-1.5" style={{ width: `${w - block * 4}%` }} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function ErrorPanel({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div role="alert" className="border-y border-[var(--line)] py-6">
      <SectionTitle>Couldn’t load the résumé</SectionTitle>
      <p className="mt-2 text-[var(--text-2)]">{message}</p>
      <button type="button" onClick={onRetry} className="text-link mt-3 min-h-[44px]">
        Try again
      </button>
    </div>
  );
}
