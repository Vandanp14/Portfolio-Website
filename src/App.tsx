import { lazy, Suspense, useEffect, useRef } from 'react';
import { About } from './components/About';
import { Contact } from './components/Contact';
import { Experience } from './components/Experience';
import { FanaticsBanner } from './components/FanaticsBanner';
import { Footer } from './components/Footer';
import { Hero } from './components/Hero';
import { Nav } from './components/Nav';
import { NotFound } from './components/NotFound';
import { OtherWork } from './components/OtherWork';
import { Work } from './components/Work';
import type { SectionId } from './content/portfolio';
import { useRevealObserver } from './hooks/useReveal';
import { scrollToSection, useScrollSpy } from './hooks/useScrollSpy';
import { trackPageView } from './lib/analytics';
import { isHome, usePath } from './lib/router';

// Code-split: the blog (and DOMPurify) only load when someone visits /blog.
const Blog = lazy(() => import('./pages/Blog'));
// pdf.js is large — it only loads on /resume.
const Resume = lazy(() => import('./pages/Resume'));

function SkipLink({ href }: { href: string }) {
  return (
    <a
      href={href}
      className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-[var(--r-md)] focus:bg-[#1F6FEB] focus:px-4 focus:py-2 focus:text-[#FFFFFF]"
    >
      Skip to content
    </a>
  );
}

/**
 * GA4's own config call reports the first page; every client-side route
 * change after that is reported here (the property's history-based
 * enhanced measurement is off, and must stay off to avoid double counts).
 */
function usePageViews(path: string) {
  const first = useRef(true);
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    // Short delay so lazy pages have mounted and set document.title.
    const timer = setTimeout(trackPageView, 400);
    return () => clearTimeout(timer);
  }, [path]);
}

function Home() {
  const active = useScrollSpy();
  useRevealObserver();

  // Arriving from another page via `/#work` etc: the section didn't exist at
  // page load, so the browser's own anchor jump never happened.
  useEffect(() => {
    const id = window.location.hash.slice(1);
    if (id) requestAnimationFrame(() => scrollToSection(id as SectionId));
  }, []);

  return (
    <>
      <SkipLink href="#work" />
      <Nav active={active} />
      <main>
        <Hero />
        <FanaticsBanner />
        <Work />
        <OtherWork />
        <Experience />
        <About />
        <Contact />
      </main>
      <Footer />
    </>
  );
}

export default function App() {
  const path = usePath();
  usePageViews(path);

  if (isHome(path)) return <Home />;

  const blog = path.match(/^\/blog\/?(?:([^/]+)\/?)?$/);
  const resume = /^\/resume\/?$/.test(path);

  return (
    <>
      <SkipLink href="#content" />
      <Nav active={null} page={blog ? 'blog' : resume ? 'resume' : null} />
      <main id="content">
        {blog ? (
          <Suspense fallback={<div className="band band-paper min-h-[100svh]" />}>
            <Blog postId={blog[1] ?? null} />
          </Suspense>
        ) : resume ? (
          <Suspense fallback={<div className="band band-mist min-h-[100svh]" />}>
            <Resume />
          </Suspense>
        ) : (
          <NotFound />
        )}
      </main>
      <Footer />
    </>
  );
}
