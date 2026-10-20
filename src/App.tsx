import { lazy, Suspense, useEffect, useRef } from 'react';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Link } from './components/Link';
import { CapabilityGrid } from './components/specimen/CapabilityGrid';
import { ContactBlock } from './components/specimen/ContactBlock';
import { Hero } from './components/specimen/Hero';
import { Ledger } from './components/specimen/Ledger';
import { NotFound } from './components/specimen/NotFound';
import { ProofBand } from './components/specimen/ProofBand';
import { SectionHead, Shell } from './components/specimen/primitives';
import { SiteFooter } from './components/specimen/SiteFooter';
import { TopBar } from './components/specimen/TopBar';
import { WorkAct } from './components/specimen/WorkAct';
import { WritingList } from './components/specimen/WritingList';
import { featuredProjects, profile } from './content/portfolio';
import { trackPageView } from './lib/analytics';
import { loadBlog, loadResume } from './lib/prefetch';
import { isHome, usePath } from './lib/router';
import { pageForPath } from './lib/routes';
import { SITE_ORIGIN, useJsonLd, usePageMeta } from './lib/seo';
import AboutPage from './pages/About';
import ContactPage from './pages/Contact';
import ExperiencePage from './pages/Experience';
import WorkPage from './pages/Work';

const Blog = lazy(loadBlog);
const Resume = lazy(loadResume);

function SkipLink() {
  return (
    <a href="#content" className="skip-link">
      Skip to content
    </a>
  );
}

function usePageViews(path: string) {
  const first = useRef(true);
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    const timer = setTimeout(trackPageView, 400);
    return () => clearTimeout(timer);
  }, [path]);
}

/** Deep links like /work#transit-ledger should land on the case, not the top. */
function useHashScroll(path: string) {
  useEffect(() => {
    const { hash } = window.location;
    if (!hash) return;
    const id = decodeURIComponent(hash.slice(1));
    const frame = requestAnimationFrame(() => {
      const target = document.getElementById(id);
      if (!target) return;
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const header = document.querySelector('.topbar')?.getBoundingClientRect().height ?? 64;
      const top = target.getBoundingClientRect().top + window.scrollY - header - 16;
      window.scrollTo({ top: Math.max(0, top), behavior: reduce ? 'auto' : 'smooth' });
    });
    return () => cancelAnimationFrame(frame);
  }, [path]);
}

const projectsJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'Selected work',
  itemListElement: featuredProjects.map((project, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    item: {
      '@type': 'SoftwareApplication',
      name: project.title,
      description: project.tagline,
      applicationCategory: project.category,
      url: project.liveUrl ?? `${SITE_ORIGIN}/work`,
      ...(project.repoUrl ? { codeRepository: project.repoUrl } : {}),
      author: { '@id': `${SITE_ORIGIN}/#person` },
    },
  })),
};

function Home() {
  usePageMeta({ title: `${profile.name} — ${profile.role}`, exactTitle: true, path: '/' });
  useJsonLd('ld-projects', projectsJsonLd);

  return (
    <>
      <Hero />

      <section className="band band-paper section" id="work">
        <Shell>
          <SectionHead
            index="01 — Selected work"
            title={
              <>
                Three products. <em>End to end.</em>
              </>
            }
            note="Designed, built, deployed and maintained alone — data model through interface."
          />
          <div>
            {featuredProjects.map((project, i) => (
              <WorkAct key={project.id} project={project} position={i} />
            ))}
          </div>
          <p style={{ marginTop: 40 }}>
            <Link to="/work" className="link">
              Every case in detail <span className="arrow" aria-hidden="true">→</span>
            </Link>
          </p>
        </Shell>
      </section>

      <ProofBand />
      <Ledger />
      <CapabilityGrid />
      <WritingList />
      <ContactBlock />
    </>
  );
}

function Page({ path }: { path: string }) {
  if (isHome(path)) return <Home />;

  const blog = path.match(/^\/blog\/?(?:([^/]+)\/?)?$/);
  if (blog) {
    return (
      <Suspense fallback={<div className="band band-paper" style={{ minHeight: '100svh' }} />}>
        <Blog postId={blog[1] ?? null} />
      </Suspense>
    );
  }

  switch (path.replace(/\/+$/, '')) {
    case '/work':
      return <WorkPage />;
    case '/experience':
      return <ExperiencePage />;
    case '/about':
      return <AboutPage />;
    case '/contact':
      return <ContactPage />;
    case '/resume':
      return (
        <Suspense fallback={<div className="band band-paper" style={{ minHeight: '100svh' }} />}>
          <Resume />
        </Suspense>
      );
    default:
      return <NotFound />;
  }
}

export default function App() {
  const path = usePath();
  usePageViews(path);
  useHashScroll(path);

  return (
    <>
      <SkipLink />
      <TopBar current={isHome(path) ? null : (pageForPath(path)?.id ?? null)} />
      <main id="content" key={path} className="page-enter">
        <ErrorBoundary>
          <Page path={path} />
        </ErrorBoundary>
      </main>
      <SiteFooter />
    </>
  );
}
