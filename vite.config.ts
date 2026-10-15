import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { imagetools } from 'vite-imagetools';

// Mirrors the vercel.json rewrites that point at functions, so the same URLs
// work under `npm run dev`. Page routes (/blog, /resume) are left to Vite's
// own index.html; the client-side meta hook covers them in dev.
const DEV_REWRITES: Record<string, string> = {
  '/sitemap.xml': '/api/sitemap',
  '/rss.xml': '/api/rss',
  '/resume.pdf': '/api/resume',
};

/**
 * Runs the Vercel Functions in `api/*.ts` under `npm run dev`, so the blog,
 * résumé, OG images and feeds work locally without `vercel dev`.
 * `/api/<name>` loads `api/<name>.ts`; `_`-prefixed files are helpers.
 */
function devApi(): Plugin {
  return {
    name: 'dev-api',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const url = new URL(req.originalUrl ?? req.url ?? '/', 'http://localhost');
        const rewrite = DEV_REWRITES[url.pathname];
        if (rewrite) url.pathname = rewrite;

        const name = url.pathname.match(/^\/api\/([a-z][\w-]*)\/?$/)?.[1];
        if (!name) return next();

        let mod: { GET?: (request: Request) => Promise<Response> };
        try {
          mod = await server.ssrLoadModule(`/api/${name}.ts`);
        } catch {
          res.statusCode = 404;
          res.end(`No function at /api/${name}`);
          return;
        }
        if (typeof mod.GET !== 'function') {
          res.statusCode = 405;
          res.end('Method not allowed');
          return;
        }

        try {
          const headers = new Headers();
          Object.entries(req.headers).forEach(([key, value]) => {
            if (typeof value === 'string') headers.set(key, value);
          });
          const response = await mod.GET(new Request(url, { method: req.method, headers }));
          res.statusCode = response.status;
          response.headers.forEach((value, key) => res.setHeader(key, value));
          res.end(new Uint8Array(await response.arrayBuffer()));
        } catch (err) {
          res.statusCode = 500;
          res.end(String(err));
        }
      });
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), imagetools(), devApi()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
