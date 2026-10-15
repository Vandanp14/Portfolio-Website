// Vercel serves dist/404.html (with a real 404 status) for any path that
// matches no file or rewrite. Making it a copy of the SPA shell means the
// app boots there and renders its own NotFound page.
import { copyFileSync } from 'node:fs';

copyFileSync('dist/index.html', 'dist/404.html');
console.log('postbuild: dist/404.html');
