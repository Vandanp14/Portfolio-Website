import { lazy, Suspense, useEffect, useRef } from 'react';
import { About } from './components/About';
import { Contact } from './components/Contact';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Experience } from './components/Experience';
import { Footer } from './components/Footer';
import { Home } from './components/Home';
import { Nav } from './components/Nav';
import { NotFound } from './components/NotFound';
import { ProjectDetail } from './components/ProjectDetail';
import { SectionPage } from './components/SectionPage';
import { Work } from './components/Work';
import { featuredProjects, projectById } from './content/portfolio';
import { trackPageView } from './lib/analytics';
import { loadBlog, loadResume } from './lib/prefetch';
import { isHome, usePath } from './lib/router';
import { pageForPath } from './lib/routes';
import { SITE_ORIGIN, useJsonLd } from './lib/seo';

// Code-split: the blog (and DOMPurify) and the résumé (pdf.js) only load
// when someone heads there — links prefetch them on hover/focus.
const Blog = lazy(loadBlog);
const Resume = lazy(loadResume);

function SkipLink({ href }: { href: string }) {
  return (
    <a
      href={href}
      className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:bg-[var(--text)] focus:px-4 focus:py-2 focus:text-[var(--bg)]"
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
      url: project.liveUrl ?? `${SITE_ORIGIN}/work/${project.id}`,
      ...(project.repoUrl ? { codeRepository: project.repoUrl } : {}),
      author: { '@id': `${SITE_ORIGIN}/#person` },
    },
  })),
};

function WorkPage() {
  useJsonLd('ld-projects', projectsJsonLd);
  return (
    <SectionPage id="work">
      <Work />
    </SectionPage>
  );
}

function Page({ path }: { path: string }) {
  if (isHome(path)) return <Home />;

  const blog = path.match(/^\/blog\/?(?:([^/]+)\/?)?$/);
  if (blog) {
    return (
      <Suspense fallback={<div className="min-h-[100svh]" />}>
        <Blog postId={blog[1] ?? null} />
      </Suspense>
    );
  }

  const work = path.match(/^\/work\/([^/]+)\/?$/);
  if (work) {
    const project = projectById(work[1]);
    return project ? <ProjectDetail project={project} /> : <NotFound />;
  }

  switch (path.replace(/\/+$/, '')) {
    case '/work':
      return <WorkPage />;
    case '/experience':
      return (
        <SectionPage id="experience">
          <Experience />
        </SectionPage>
      );
    case '/about':
      return (
        <SectionPage id="about">
          <About />
        </SectionPage>
      );
    case '/contact':
      return (
        <SectionPage id="contact">
          <Contact />
        </SectionPage>
      );
    case '/resume':
      return (
        <Suspense fallback={<div className="min-h-[100svh]" />}>
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

  return (
    <>
      <SkipLink href="#content" />
      <Nav current={isHome(path) ? null : (pageForPath(path)?.id ?? null)} />
      <main id="content" key={path} className="page-enter">
        <ErrorBoundary>
          <Page path={path} />
        </ErrorBoundary>
      </main>
      <Footer />
    </>
  );
}
