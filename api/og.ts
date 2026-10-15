// Open Graph card (Vercel Function), rendered with @vercel/og (Satori +
// resvg) in the site's slate band. Nodes are plain objects, not JSX, so
// api/ needs no React/JSX setup. The font is Geist Regular, bundled with
// @vercel/og.
//
//   GET /api/og?v=1                              → home card
//   GET /api/og?v=1&title=…&date=ISO&min=N       → blog post card
//
// Output depends only on the query string, so every URL caches forever;
// bump `v` (api/_lib/site.ts) after changing the design.

import { ImageResponse } from '@vercel/og';
import type { ReactElement } from 'react';

const WIDTH = 1200;
const HEIGHT = 630;
const SLATE = '#1E2124';
const CHALK = '#F4F4F2';
const DIM = 'rgba(244, 244, 242, 0.55)';
const LINE = 'rgba(244, 244, 242, 0.22)';
const VIOLET = '#9F8FFF';
const HOME_TITLE = 'I build the systems other people build on.';

type Style = Record<string, string | number>;
type Node = { type: string; props: { style?: Style; children?: Node | string | (Node | string)[] } };

function el(type: string, style: Style, children?: Node['props']['children']): Node {
  return { type, props: { style, children } };
}

function clean(value: string | null, max: number): string {
  const text = (value ?? '').replace(/\s+/g, ' ').trim();
  return text.length > max ? `${text.slice(0, max - 1).trimEnd()}…` : text;
}

function formatDate(value: string | null): string {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', timeZone: 'UTC' });
}

/** Big type for short titles, stepping down so long ones still fit in three lines. */
function titleSize(title: string): number {
  if (title.length <= 28) return 96;
  if (title.length <= 48) return 80;
  if (title.length <= 72) return 66;
  if (title.length <= 96) return 56;
  return 48;
}

function card(eyebrow: string, title: string, meta: string): Node {
  const size = titleSize(title);
  return el(
    'div',
    {
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      padding: '64px 72px 56px',
      background: SLATE,
      color: CHALK,
      fontFamily: 'Geist',
    },
    [
      el('div', { display: 'flex', alignItems: 'center', justifyContent: 'space-between' }, [
        el('div', { display: 'flex', alignItems: 'center' }, [
          el(
            'div',
            {
              width: 56,
              height: 56,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: CHALK,
              color: SLATE,
              fontSize: 26,
              letterSpacing: '-0.04em',
            },
            'VP',
          ),
          el('div', { marginLeft: 20, fontSize: 30, letterSpacing: '-0.035em' }, 'Vandan Patel'),
        ]),
        el('div', { fontSize: 20, letterSpacing: '0.12em', color: DIM }, eyebrow),
      ]),
      el(
        'div',
        {
          display: 'flex',
          maxWidth: 1000,
          fontSize: size,
          lineHeight: 1.02,
          letterSpacing: '-0.045em',
          color: CHALK,
        },
        title,
      ),
      el('div', { display: 'flex', flexDirection: 'column' }, [
        el('div', { height: 1, width: '100%', background: LINE }),
        el('div', { display: 'flex', justifyContent: 'space-between', marginTop: 22, fontSize: 24 }, [
          el('div', { color: VIOLET, letterSpacing: '-0.01em' }, 'vandanpatel.me'),
          el('div', { color: DIM, letterSpacing: '-0.01em' }, meta),
        ]),
      ]),
    ],
  );
}

export async function GET(request: Request): Promise<Response> {
  const params = new URL(request.url).searchParams;
  const title = clean(params.get('title'), 120);

  let node: Node;
  if (title) {
    const minutes = Number.parseInt(params.get('min') ?? '', 10);
    const parts = [formatDate(params.get('date'))];
    if (Number.isInteger(minutes) && minutes >= 1 && minutes <= 99) parts.push(`${minutes} min read`);
    node = card('WRITING', title, parts.filter(Boolean).join(' · '));
  } else {
    node = card('PORTFOLIO', HOME_TITLE, 'Backend · Distributed systems · Applied AI');
  }

  return new ImageResponse(node as unknown as ReactElement, {
    width: WIDTH,
    height: HEIGHT,
    headers: { 'Cache-Control': 'public, max-age=86400, s-maxage=31536000, immutable' },
  });
}
