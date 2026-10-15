import { useTheme } from '../lib/theme';

/**
 * Square, hairline-bordered switch matching the menu button. The glyph is a
 * half-filled square: filled half flips sides with the theme. Colours come
 * from the caller's variables (`--nav-*` in the bar, band vars in the menu).
 */
export function ThemeToggle({ className = '' }: { className?: string }) {
  const [theme, toggle] = useTheme();
  const dark = theme === 'dark';

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={dark}
      aria-label="Dark theme"
      title={dark ? 'Switch to light theme' : 'Switch to dark theme'}
      className={`flex h-10 w-10 flex-none items-center justify-center border transition-colors duration-[var(--t-base)] ease-[var(--ease-out-expo)] ${className}`}
    >
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <rect x="0.5" y="0.5" width="15" height="15" stroke="currentColor" />
        <rect
          x={dark ? 8 : 1}
          y="1"
          width="7"
          height="14"
          fill="currentColor"
          className="transition-[x] duration-[var(--t-base)] ease-[var(--ease-out-expo)]"
        />
      </svg>
    </button>
  );
}
