import { useTheme } from '../lib/theme';

/** Half-filled square; the filled half flips sides with the theme. */
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
      className={`flex h-[44px] w-[44px] flex-none items-center justify-center text-[var(--text-2)] transition-colors duration-150 hover:text-[var(--text)] ${className}`}
    >
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <rect x="0.5" y="0.5" width="15" height="15" stroke="currentColor" />
        <rect x={dark ? 8 : 1} y="1" width="7" height="14" fill="currentColor" />
      </svg>
    </button>
  );
}
