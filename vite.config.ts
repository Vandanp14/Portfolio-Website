import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';

/**
 * Runs the Vercel Function in `api/resume.ts` under `npm run dev`, so the
 * résumé viewer works locally without `vercel dev`.
 */
function devApi(): Plugin {
  return {
    name: 'dev-api-resume',
    configureServer(server) {
      server.middlewares.use('/api/resume', async (req, res) => {
        try {
          const mod = await server.ssrLoadModule('/api/resume.ts');
          const url = new URL(req.originalUrl ?? req.url ?? '/', 'http://localhost');
          const response: Response = await mod.GET(new Request(url, { method: req.method }));
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
  plugins: [react(), devApi()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
