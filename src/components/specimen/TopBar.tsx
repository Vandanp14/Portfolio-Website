import { useEffect, useRef, useState } from 'react';
import { profile } from '../../content/portfolio';
import { Link } from '../Link';
import { usePath } from '../../lib/router';
import type { PageId } from '../../lib/routes';

/** Registration mark: a frame crossed by two hairlines. */
function Mark() {
  return (
    <svg className="wordmark__mark" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <rect x="2.5" y="2.5" width="9" height="9" stroke="currentColor" />
      <path d="M7 0v14M0 7h14" stroke="currentColor" strokeOpacity="0.35" />
    </svg>
  );
}

const LINKS = [
  { to: '/work', label: 'Work', id: 'work' },
  { to: '/experience', label: 'Experience', id: 'experience' },
  { to: '/about', label: 'About', id: 'about' },
  { to: '/blog', label: 'Writing', id: 'blog' },
] as const;

export function TopBar({ current }: { current: PageId | null }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const path = usePath();
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // A route change always dismisses the menu.
  useEffect(() => {
    setOpen(false);
  }, [path]);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.querySelector<HTMLAnchorElement>('#site-menu .menu__link')?.focus();

    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
        toggleRef.current?.focus();
        return;
      }

      // Keep Tab inside the dialog: the page behind is scroll-locked, so focus
      // should not be able to wander into it.
      if (event.key === 'Tab') {
        const items = Array.from(
          document.querySelectorAll<HTMLElement>(
            '#site-menu a[href], #site-menu button:not([disabled])',
          ),
        );
        if (items.length === 0) return;
        const first = items[0];
        const last = items[items.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <>
      <header className="topbar" data-scrolled={scrolled}>
        <div className="shell topbar__inner">
          <Link to="/" className="wordmark" aria-label={`${profile.name} — home`}>
            <Mark />
            <span>{profile.name}</span>
          </Link>

          <nav className="topbar__links" aria-label="Primary">
            <span className="availability">
              <span className="dot" aria-hidden="true" />
              Open to Summer 2027
            </span>
            {LINKS.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="navlink"
                aria-current={current === link.id ? 'page' : undefined}
              >
                {link.label}
              </Link>
            ))}
            <Link to="/resume" className="navlink" aria-label="Résumé">
              Résumé
            </Link>
          </nav>

          <button
            ref={toggleRef}
            type="button"
            className="menu-toggle"
            aria-expanded={open}
            aria-controls="site-menu"
            onClick={() => setOpen((value) => !value)}
          >
            {open ? 'Close' : 'Index'}
          </button>
        </div>
      </header>

      {open ? (
        <div className="menu" id="site-menu" role="dialog" aria-modal="true" aria-label="Site menu">
          <div className="shell menu__head">
            <span className="eyebrow">Menu</span>
            <button
              type="button"
              className="menu-toggle is-open"
              onClick={() => {
                setOpen(false);
                toggleRef.current?.focus();
              }}
            >
              Close
            </button>
          </div>

          <nav className="shell menu__links" aria-label="Site">
            {LINKS.map((link, i) => (
              <Link key={link.to} to={link.to} className="menu__link">
                <span>{link.label}</span>
                <span className="mono">{String(i + 1).padStart(2, '0')}</span>
              </Link>
            ))}
            <Link to="/resume" className="menu__link">
              <span>Résumé</span>
              <span className="mono">PDF</span>
            </Link>
          </nav>

          <div className="shell menu__foot">
            <p className="mono">{profile.location} · Eastern Time</p>
            <a className="link" href={`mailto:${profile.email}`}>
              {profile.email}
            </a>
            <span className="availability">
              <span className="dot" aria-hidden="true" />
              Open to Summer 2027
            </span>
          </div>
        </div>
      ) : null}
    </>
  );
}
