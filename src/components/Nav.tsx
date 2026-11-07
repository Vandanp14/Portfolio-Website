import { pages, type PageId } from '../lib/routes';
import { Link } from './Link';
import { Shell } from './primitives';
import { ThemeToggle } from './ThemeToggle';

export function Nav({ current }: { current: PageId | null }) {
  return (
    <header>
      <Shell className="flex flex-wrap items-center justify-between gap-x-6">
        <Link to="/" className="inline-flex min-h-[44px] items-center text-[15px] font-medium text-[var(--text)]">
          Vandan Patel
        </Link>
        <nav aria-label="Pages">
          <ul className="flex flex-wrap items-center gap-x-4 sm:gap-x-5">
            {pages.map((item) => {
              const active = current === item.id;
              return (
                <li key={item.id}>
                  <Link
                    to={item.path}
                    aria-current={active ? 'page' : undefined}
                    className={`inline-flex min-h-[44px] items-center text-[14px] transition-colors duration-150 hover:text-[var(--text)] ${
                      active ? 'text-[var(--text)]' : 'text-[var(--text-2)]'
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
            <li>
              <ThemeToggle />
            </li>
          </ul>
        </nav>
      </Shell>
    </header>
  );
}
