import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { injectSpeedInsights } from '@vercel/speed-insights';
import { startReveals } from './lib/reveal';
import { supportsViewTransitions } from './lib/router';

// Before the first render, so the mutation observer sees every node mount.
startReveals();

// Page changes slide via View Transitions; without them, index.css falls
// back to a CSS slide-in on the incoming page (`.no-vt .page-enter`).
if (!supportsViewTransitions()) document.documentElement.classList.add('no-vt');

// Real-user Core Web Vitals → Vercel Speed Insights (enable it in the project
// settings). Inert in dev and anywhere /_vercel/speed-insights isn't served.
injectSpeedInsights();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
