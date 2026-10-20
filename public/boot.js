// Runs before first paint (render-blocking, in <head>). Kept as a file rather
// than inline so the Content-Security-Policy can forbid inline scripts.

// One ground, one signal colour. The site has no dark mode; a stored
// preference from an earlier version is cleared so nobody is left stranded.
(function () {
  document.documentElement.setAttribute('data-theme', 'light');
  try {
    if (localStorage.getItem('theme')) localStorage.removeItem('theme');
  } catch (e) {
    /* storage blocked — nothing to clear */
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
