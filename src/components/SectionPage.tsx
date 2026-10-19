import type { ReactNode } from 'react';
import { nextPage, pageById, pages, type PageId } from '../lib/routes';
import { usePageMeta } from '../lib/seo';
import { Rule } from './motion/Rule';
import { IndexRow } from './PageIndex';
import { Eyebrow, Shell } from './primitives';

/**
 * A top-level page built from home sections. Leaves the fixed utility nav
 * above the page, sets the page's meta, and ends with a
 * "Next" row so visitors can keep moving without going back to the index.
 */
export function SectionPage({
  id,
  band,
  children,
}: {
  id: PageId;
  /** Band of the first section, so the nav spacer blends into it. */
  band: 'paper' | 'mist' | 'slate';
  children: ReactNode;
}) {
  const page = pageById(id);
  usePageMeta({ title: page.label, description: page.description, path: page.path });
  const next = nextPage(id);

  return (
    <div>
      <div aria-hidden="true" className={`band band-${band} h-0`} />
      {children}
      <nav aria-label="Next page" className="band band-paper pb-[clamp(64px,8vw,120px)] pt-[clamp(64px,8vw,120px)]">
        <Shell>
          <Eyebrow className="pb-5">Next</Eyebrow>
          <IndexRow page={next} index={pages.indexOf(next)} meta="" />
          <Rule strong />
        </Shell>
      </nav>
    </div>
  );
}
