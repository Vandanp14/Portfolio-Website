import { GlobalWorkerOptions, getDocument } from 'pdfjs-dist/legacy/build/pdf.mjs';
import type { PDFDocumentLoadingTask, PDFDocumentProxy, PDFPageProxy } from 'pdfjs-dist/legacy/build/pdf.mjs';
import workerUrl from 'pdfjs-dist/legacy/build/pdf.worker.min.mjs?url';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Eyebrow, Shell, TextLink } from '../components/specimen/primitives';
import { track } from '../lib/analytics';
import { usePageMeta } from '../lib/seo';
import { formatUpdated, loadResume, pdfUrl, RESUME_FILENAME, type ResumeFile } from '../lib/resume';

// Legacy build: the modern one leans on JS features older mobile Safari lacks.
GlobalWorkerOptions.workerSrc = workerUrl;

const MIN_SCALE = 0.5;
const MAX_SCALE = 3;
const STEP = 0.25;
const MAX_DPR = 2.5;
const MAX_FIT = 1.5;

type State =
  | { kind: 'loading'; step: 'checking' | 'downloading' | 'rendering'; progress?: number }
  | { kind: 'error'; error: string }
  | { kind: 'ready'; file: ResumeFile; doc: PDFDocumentProxy; pages: PDFPageProxy[] };

export default function Resume() {
  const [state, setState] = useState<State>({ kind: 'loading', step: 'checking' });
  const [attempt, setAttempt] = useState(0);

  usePageMeta({
    title: 'Résumé',
    description:
      'Vandan Patel’s current résumé — backend, distributed systems and applied AI. View in the browser or download the PDF.',
    path: '/resume',
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
        // pdf.js detaches the buffer it is given — hand it a copy so the
        // original bytes stay intact for the download.
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
  const size =
    state.kind === 'ready' && state.file.meta.size
      ? `${Math.max(1, Math.round(state.file.meta.size / 1024))} KB`
      : '';

  return (
    <div className="band band-paper">
      <section className="page-intro">
        <Shell>
          <Eyebrow>Résumé — always the latest</Eyebrow>
          <h1 className="display page-intro__claim" style={{ marginTop: 20 }}>
            The <em>short</em> version.
          </h1>
          <div className="page-intro__note">
            <p className="small col-6" style={{ maxWidth: '52ch' }}>
              Read it here or take the PDF. Both come from the same file, so what you see is what
              recruiters get.
            </p>
            <dl className="mono col-4 start-9 align-end" style={{ lineHeight: 2 }}>
              <div>Updated — {updated || (state.kind === 'ready' ? 'latest' : '—')}</div>
              <div>Pages — {state.kind === 'ready' ? String(state.pages.length).padStart(2, '0') : '—'}</div>
              <div>Format — {size ? `PDF · ${size}` : 'PDF'}</div>
            </dl>
          </div>
        </Shell>
      </section>

      <section className="section--tight">
        <Shell>
          {state.kind === 'ready' ? (
            <Viewer file={state.file} pages={state.pages} />
          ) : state.kind === 'error' ? (
            <ErrorPanel message={state.error} onRetry={() => setAttempt((n) => n + 1)} />
          ) : (
            <LoadingPaper step={state.step} progress={state.progress} />
          )}
        </Shell>
      </section>
    </div>
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

  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  useEffect(() => {
    const url = URL.createObjectURL(new Blob([file.bytes], { type: 'application/pdf' }));
    setBlobUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  return (
    <div>
      <div role="toolbar" aria-label="Résumé viewer" className="toolbar">
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span className="mono" style={{ padding: '0 12px' }} aria-live="polite">
            {String(current).padStart(2, '0')} / {String(pages.length).padStart(2, '0')}
          </span>
          <button type="button" className="tool" onClick={() => zoomBy(-STEP)} disabled={scale <= MIN_SCALE} aria-label="Zoom out">
            <span aria-hidden="true">−</span>
          </button>
          <span className="mono" style={{ width: 56, textAlign: 'center', color: 'var(--fg)' }} aria-live="polite">
            {Math.round(scale * 100)}%
          </span>
          <button type="button" className="tool" onClick={() => zoomBy(STEP)} disabled={scale >= MAX_SCALE} aria-label="Zoom in">
            <span aria-hidden="true">+</span>
          </button>
          <button
            type="button"
            className={`tool tool--text ${zoom === 'fit' ? 'is-active' : ''}`}
            onClick={() => setZoom('fit')}
            aria-pressed={zoom === 'fit'}
          >
            Fit
          </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <a className="tool tool--text" href={pdfUrl(file.meta.version)} target="_blank" rel="noopener noreferrer">
            Open ↗
          </a>
          <a
            className="pill"
            href={blobUrl ?? pdfUrl(file.meta.version, true)}
            download={RESUME_FILENAME}
            onClick={() =>
              track('file_download', {
                file_name: RESUME_FILENAME,
                file_extension: 'pdf',
                resume_version: file.meta.updatedAt,
              })
            }
          >
            Download PDF ↓
          </a>
        </div>
      </div>

      <div ref={stageRef} style={{ marginTop: 24, overflowX: 'auto' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24, width: 'max-content', minWidth: '100%' }}>
          {pages.map((page) => (
            <PageCanvas key={page.pageNumber} page={page} scale={scale} />
          ))}
        </div>
      </div>

      <p style={{ marginTop: 24 }}>
        <TextLink href={pdfUrl(file.meta.version)}>Open in a new tab</TextLink>
      </p>
    </div>
  );
}

/* --- Page canvas ---------------------------------------------------------- */

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
      style={{
        position: 'relative',
        overflow: 'hidden',
        width: viewport.width,
        height: viewport.height,
        background: '#fff',
        border: '1px solid var(--rule)',
      }}
    >
      <canvas
        ref={canvasRef}
        aria-label={`Résumé page ${page.pageNumber}`}
        role="img"
        style={{ display: 'block', width: '100%', height: '100%', opacity: drawn ? 1 : 0, transition: 'opacity 240ms var(--ease)' }}
      />
      {links.map((link, i) => (
        <a
          key={i}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={link.url.replace(/^mailto:/, '')}
          style={{
            position: 'absolute',
            left: link.left,
            top: link.top,
            width: link.width,
            height: link.height,
            background: 'transparent',
          }}
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
  const percent = step === 'downloading' && progress ? Math.round(progress * 100) : null;
  const label = step === 'downloading' && percent === null ? 'Preparing the PDF' : STEP_LABEL[step];

  return (
    <div aria-busy="true">
      <div className="toolbar" style={{ position: 'static' }}>
        <span className="mono" role="status">
          {label}
          {percent !== null ? ` · ${percent}%` : '…'}
        </span>
      </div>
      <div style={{ height: 1, background: 'var(--rule)', overflow: 'hidden' }} aria-hidden="true">
        <div
          className={percent === null ? 'resume-indeterminate' : undefined}
          style={{
            height: '100%',
            background: 'var(--ink)',
            width: percent !== null ? `${Math.max(4, percent)}%` : '33%',
            transition: 'width 240ms var(--ease)',
          }}
        />
      </div>

      <div
        aria-hidden="true"
        style={{
          marginTop: 24,
          marginInline: 'auto',
          aspectRatio: '8.5 / 11',
          width: '100%',
          maxWidth: 918,
          border: '1px solid var(--rule)',
          background: '#fff',
          padding: '7%',
        }}
      >
        <div className="skeleton" style={{ height: '4%', width: '45%' }} />
        <div className="skeleton" style={{ height: '1.6%', width: '70%', marginTop: '2%' }} />
        {[0, 1, 2].map((block) => (
          <div key={block} style={{ marginTop: '7%' }}>
            <div className="skeleton" style={{ height: '1.8%', width: '28%' }} />
            {[96, 100, 88, 92].map((w, i) => (
              <div
                key={i}
                className="skeleton"
                style={{ height: '1.3%', width: `${w - block * 4}%`, marginTop: '1.6%' }}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function ErrorPanel({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div role="alert" style={{ borderTop: '1px solid var(--rule-strong)', borderBottom: '1px solid var(--rule)', padding: '32px 0' }}>
      <p className="eyebrow">Status</p>
      <p className="body" style={{ marginTop: 8 }}>
        {message}
      </p>
      <p style={{ marginTop: 20 }}>
        <button type="button" className="pill" onClick={onRetry}>
          Try again ↻
        </button>
      </p>
      <p style={{ marginTop: 16 }}>
        <TextLink href="/resume.pdf">Download the PDF directly</TextLink>
      </p>
    </div>
  );
}
