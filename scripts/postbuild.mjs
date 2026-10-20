// Vercel serves dist/404.html (with a real 404 status) for any path that
// matches no file or rewrite. It starts as a copy of the SPA shell so the app
// boots and renders its own NotFound page; the head is then rewritten so link
// previews and non-JS clients don't see the home page's metadata.
import { readFileSync, writeFileSync } from 'node:fs';

const title = 'Page not found — Vandan Patel';
const description = 'The page you were looking for does not exist. Head back to the index.';

const html = readFileSync('dist/index.html', 'utf8')
  .replace(/<title>[^<]*<\/title>/, `<title>${title}</title>`)
  .replace(
    /<meta\s+name="description"\s+content="[^"]*"\s*\/>/s,
    `<meta name="description" content="${description}" />`,
  )
  .replace(/<link rel="canonical" href="[^"]*" \/>\s*/, '')
  .replace(/<meta property="og:url" content="[^"]*" \/>\s*/, '')
  .replaceAll('content="Vandan Patel — Software Engineer"', `content="${title}"`)
  .replace(
    /<meta\s+property="og:description"\s+content="[^"]*"\s*\/>/s,
    `<meta property="og:description" content="${description}" />`,
  )
  .replace(
    /<meta\s+name="twitter:description"\s+content="[^"]*"\s*\/>/s,
    `<meta name="twitter:description" content="${description}" />`,
  )
  .replace('</head>', '    <meta name="robots" content="noindex" />\n  </head>');

writeFileSync('dist/404.html', html);
console.log('postbuild: dist/404.html');
