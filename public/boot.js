// Runs before first paint (render-blocking, in <head>). Kept as a file rather
// than inline so the Content-Security-Policy can forbid inline scripts.

// Theme: light unless the visitor chose dark (see src/lib/theme.ts).
(function () {
  var theme = 'light';
  try {
    if (localStorage.getItem('theme') === 'dark') theme = 'dark';
  } catch (e) {
    /* storage blocked — stay light */
  }
  document.documentElement.setAttribute('data-theme', theme);
  if (theme === 'dark') {
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', '#0F1113');
  }
})();

// Google Analytics (GA4). Production domain only, so local dev and Vercel
// preview deployments don't pollute the numbers. Client-side route changes
// are reported by usePageViews in src/App.tsx.
if (/(^|\.)vandanpatel\.me$/.test(location.hostname)) {
  window.dataLayer = window.dataLayer || [];
  window.gtag = function () {
    dataLayer.push(arguments);
  };
  gtag('js', new Date());
  gtag('config', 'G-4J59D7CV40');
  var ga = document.createElement('script');
  ga.async = true;
  ga.src = 'https://www.googletagmanager.com/gtag/js?id=G-4J59D7CV40';
  document.head.appendChild(ga);
}
