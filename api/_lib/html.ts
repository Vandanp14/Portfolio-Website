// String helpers for server-rendered HTML, XML and post previews. Post HTML
// is never parsed into a DOM here: tags are stripped and the text is escaped
// again wherever it's emitted.

const HTML_ESCAPES: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
};

export function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (char) => HTML_ESCAPES[char]);
}

export function escapeXml(value: string): string {
  return value.replace(/[&<>"']/g, (char) => (char === "'" ? '&apos;' : HTML_ESCAPES[char]));
}

const NAMED_ENTITIES: Record<string, string> = {
  amp: '&',
  lt: '<',
  gt: '>',
  quot: '"',
  apos: "'",
  nbsp: ' ',
  rsquo: '’',
  lsquo: '‘',
  rdquo: '”',
  ldquo: '“',
  mdash: '—',
  ndash: '–',
  hellip: '…',
};

function decodeEntities(text: string): string {
  return text.replace(/&(#x[\da-f]+|#\d+|\w+);/gi, (match, entity: string) => {
    if (entity[0] === '#') {
      const code = entity[1] === 'x' || entity[1] === 'X' ? parseInt(entity.slice(2), 16) : parseInt(entity.slice(1), 10);
      return Number.isFinite(code) && code > 0 && code <= 0x10ffff ? String.fromCodePoint(code) : ' ';
    }
    return NAMED_ENTITIES[entity.toLowerCase()] ?? match;
  });
}

function toText(html: string): string {
  return decodeEntities(
    html
      .replace(/<(script|style)[\s\S]*?<\/\1>/gi, ' ')
      .replace(/<[^>]*>/g, ' '),
  )
    .replace(/\s+/g, ' ')
    .trim();
}

/** Opening paragraph(s) as plain text, trimmed at a word boundary. */
export function excerptFromHtml(html: string, max = 200): string {
  let excerpt = '';
  for (const match of html.matchAll(/<p\b[^>]*>([\s\S]*?)<\/p>/gi)) {
    const text = toText(match[1]);
    if (!text) continue;
    excerpt = excerpt ? `${excerpt} ${text}` : text;
    if (excerpt.length >= max * 0.6) break;
  }
  if (!excerpt) excerpt = toText(html);
  if (excerpt.length <= max) return excerpt;
  const cut = excerpt.slice(0, max);
  return `${cut.slice(0, cut.lastIndexOf(' ')).replace(/[\s,;:.—–-]+$/, '')}…`;
}

export function wordCount(html: string): number {
  return html.replace(/<[^>]*>/g, ' ').replace(/&[#\w]+;/g, ' ').split(/\s+/).filter(Boolean).length;
}

/** Same formula as `readingMinutes` in src/lib/blog.ts (220 wpm). */
export function readingMinutes(html: string): number {
  return Math.max(1, Math.round(wordCount(html) / 220));
}
