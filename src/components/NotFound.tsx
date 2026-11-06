import { usePageMeta } from '../lib/seo';
import { PageTitle, Shell, TextLink } from './primitives';

export function NotFound() {
  usePageMeta({ title: 'Page not found', noindex: true });

  return (
    <Shell className="py-12 sm:py-16">
      <PageTitle>Page not found</PageTitle>
      <p className="mt-4 text-[var(--text-2)]">
        There is nothing at this address. <TextLink to="/">Go back home</TextLink>.
      </p>
    </Shell>
  );
}
