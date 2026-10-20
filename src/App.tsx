import { lazy, Suspense, useEffect, useRef } from 'react';
import { ErrorBoundary } from './components/ErrorBoundary';
import { AtlasAbout, AtlasContact, AtlasExperience, AtlasFooter, AtlasHome, AtlasNav, AtlasNotFound, AtlasWork } from './studio/Atlas';
import { featuredProjects, profile } from './content/portfolio';
import { trackPageView } from './lib/analytics';
import { loadBlog, loadResume } from './lib/prefetch';
import { isHome, usePath } from './lib/router';
import { pageForPath } from './lib/routes';
import { SITE_ORIGIN, useJsonLd, usePageMeta } from './lib/seo';

const Blog = lazy(loadBlog);
const Resume = lazy(loadResume);

function SkipLink({ href }: { href: string }) {
  return <a href={href} className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:bg-black focus:px-4 focus:py-2 focus:text-white">Skip to content</a>;
}

function usePageViews(path: string) {
  const first = useRef(true);
  useEffect(() => {
    if (first.current) { first.current = false; return; }
    const timer = setTimeout(trackPageView, 400);
    return () => clearTimeout(timer);
  }, [path]);
}

const projectsJsonLd = {
  '@context': 'https://schema.org', '@type': 'ItemList', name: 'Selected work',
  itemListElement: featuredProjects.map((project, i) => ({ '@type': 'ListItem', position: i + 1, item: {
    '@type': 'SoftwareApplication', name: project.title, description: project.tagline,
    applicationCategory: project.category, url: project.liveUrl ?? `${SITE_ORIGIN}/work`,
    ...(project.repoUrl ? { codeRepository: project.repoUrl } : {}), author: { '@id': `${SITE_ORIGIN}/#person` },
  } })),
};

function Page({ path }: { path: string }) {
  const clean = path.replace(/\/+$/, '') || '/';
  const home = isHome(path);
  const blog = path.match(/^\/blog\/?(?:([^/]+)\/?)?$/);
  const page = pageForPath(clean);
  usePageMeta(blog || clean === '/resume' ? null : { title: home ? `${profile.name} — ${profile.role}` : page?.label ?? 'Page not found', description: page?.description, exactTitle: home, path: clean });
  useJsonLd('ld-projects', clean === '/work' ? projectsJsonLd : null);
  if (home) return <AtlasHome/>;
  if (blog) return <Suspense fallback={<div className="atlas-loading"/>}><Blog postId={blog[1] ?? null}/></Suspense>;
  switch (path.replace(/\/+$/, '')) {
    case '/work': return <AtlasWork/>;
    case '/experience': return <AtlasExperience/>;
    case '/about': return <AtlasAbout/>;
    case '/contact': return <AtlasContact/>;
    case '/resume': return <Suspense fallback={<div className="atlas-loading"/>}><Resume/></Suspense>;
    default: return <AtlasNotFound/>;
  }
}

export default function App() {
  const path = usePath();
  usePageViews(path);
  return <div className="atlas-site" id="top"><SkipLink href="#content"/><AtlasNav current={isHome(path)?null:(pageForPath(path)?.id??null)}/><main id="content" key={path} className="atlas-page-enter"><ErrorBoundary><Page path={path}/></ErrorBoundary></main><AtlasFooter/></div>;
}
