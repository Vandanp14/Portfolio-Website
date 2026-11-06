import type { ReactNode } from 'react';
import { pageById, type PageId } from '../lib/routes';
import { usePageMeta } from '../lib/seo';
import { PageTitle, Shell } from './primitives';

/** A top-level page: sets the page's meta and renders its title in the reading column. */
export function SectionPage({ id, children }: { id: PageId; children: ReactNode }) {
  const page = pageById(id);
  usePageMeta({ title: page.label, description: page.description, path: page.path });

  return (
    <Shell className="py-12 sm:py-16">
      <PageTitle>{page.label}</PageTitle>
      <div className="mt-8">{children}</div>
    </Shell>
  );
}
