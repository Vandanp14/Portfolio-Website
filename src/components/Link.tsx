import type { MouseEvent, ReactNode } from 'react';
import { navigate } from '../lib/router';

/** In-app link: client-side navigation on plain left-click, native `<a>` otherwise. */
export function Link({
  to,
  children,
  className,
  ...rest
}: {
  to: string;
  children: ReactNode;
  className?: string;
  'aria-current'?: 'page' | undefined;
  'aria-label'?: string;
  onClick?: () => void;
}) {
  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    rest.onClick?.();
    if (event.defaultPrevented || event.button !== 0) return;
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    navigate(to);
  };

  return (
    <a
      href={to}
      className={className}
      aria-current={rest['aria-current']}
      aria-label={rest['aria-label']}
      onClick={handleClick}
    >
      {children}
    </a>
  );
}
