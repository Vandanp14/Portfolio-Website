import { useEffect, useRef, useState } from 'react';
import { pages, type PageId } from '../lib/routes';
import { Link } from './Link';
import { Shell } from './primitives';
import { ThemeToggle } from './ThemeToggle';

const nameClass = 'inline-flex min-h-[44px] items-center text-[15px] font-medium text-[var(--text)]';
const textButton =
  'inline-flex min-h-[44px] items-center pl-3 text-[14px] text-[var(--text-2)] transition-colors duration-150 hover:text-[var(--text)]';

/**
 * From `sm` up: name, page links and theme toggle on one line.
 * Phones: name, theme toggle and a Menu button that opens a full-screen
 * native <dialog> (focus trap, Esc and inert background come with showModal).
 */
export function Nav({ current }: { current: PageId | null }) {
  const [open, setOpen] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  const menuButton = useRef<HTMLButtonElement>(null);
  // Closing hands focus back to the Menu button, which scrolls the page to the
  // top. Put the reader back where they were, unless a menu link navigated.
  const scrollY = useRef(0);
  const navigating = useRef(false);

  useEffect(() => {
    const el = dialog.current;
    if (!el) return;
    if (open && !el.open) {
      scrollY.current = window.scrollY;
      el.showModal();
      closeButton.current?.focus();
    } else if (!open && el.open) {
      el.close();
      if (!navigating.current) {
        window.scrollTo(0, scrollY.current);
        menuButton.current?.focus({ preventScroll: true });
      }
      navigating.current = false;
    }
  }, [open]);

  // Widening past the phone layout leaves no Menu button to close it with.
  useEffect(() => {
    const wide = window.matchMedia('(min-width: 640px)');
    const onChange = () => wide.matches && setOpen(false);
    wide.addEventListener('change', onChange);
    return () => wide.removeEventListener('change', onChange);
  }, []);

  const close = () => setOpen(false);
  const go = () => {
    navigating.current = true;
    close();
  };

  return (
    <header>
      <Shell className="flex items-center justify-between gap-x-6">
        <Link to="/" className={nameClass}>
          Vandan Patel
        </Link>
        <nav aria-label="Pages" className="ml-auto hidden sm:block">
          <ul className="flex items-center gap-x-5">
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
          </ul>
        </nav>
        <div className="flex items-center">
          <ThemeToggle />
          <button
            ref={menuButton}
            type="button"
            aria-haspopup="dialog"
            aria-expanded={open}
            aria-controls="site-menu"
            onClick={() => setOpen(true)}
            className={`${textButton} sm:hidden`}
          >
            Menu
          </button>
        </div>
      </Shell>

      <dialog
        id="site-menu"
        ref={dialog}
        aria-label="Menu"
        onCancel={(event) => {
          event.preventDefault();
          close();
        }}
        onClose={close}
        className="menu-dialog"
      >
        <Shell className="flex items-center justify-between">
          <Link to="/" className={nameClass} onClick={go}>
            Vandan Patel
          </Link>
          <div className="flex items-center">
            <ThemeToggle />
            <button ref={closeButton} type="button" onClick={close} className={textButton}>
              Close
            </button>
          </div>
        </Shell>
        <nav aria-label="Pages">
          <Shell className="pt-8">
            <ul className="border-b border-[var(--line)]">
              {pages.map((item) => {
                const active = current === item.id;
                return (
                  <li key={item.id}>
                    <Link
                      to={item.path}
                      onClick={go}
                      aria-current={active ? 'page' : undefined}
                      className={`flex min-h-[56px] items-center border-t border-[var(--line)] text-[24px] font-medium tracking-[-0.02em] transition-colors duration-150 hover:text-[var(--text)] ${
                        active ? 'text-[var(--text)]' : 'text-[var(--text-2)]'
                      }`}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </Shell>
        </nav>
      </dialog>
    </header>
  );
}
