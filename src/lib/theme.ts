import { useEffect, useState } from 'react';

// Light by default; dark only when the visitor picks it. public/boot.js
// applies the stored choice before first paint, so this module only reads
// the attribute it set and keeps it, storage and theme-color in sync.

export type Theme = 'light' | 'dark';

const KEY = 'theme';
const EVENT = 'app:theme';
const THEME_COLOR: Record<Theme, string> = { light: '#FFFFFF', dark: '#0F1113' };

export function getTheme(): Theme {
  return document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
}

export function setTheme(theme: Theme) {
  document.documentElement.setAttribute('data-theme', theme);
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', THEME_COLOR[theme]);
  try {
    localStorage.setItem(KEY, theme);
  } catch {
    // Storage blocked (private mode etc.): the choice lasts for this page only.
  }
  window.dispatchEvent(new Event(EVENT));
}

/** Subscribe to theme changes made anywhere (nav toggle, menu toggle). */
export function onThemeChange(listener: () => void): () => void {
  window.addEventListener(EVENT, listener);
  return () => window.removeEventListener(EVENT, listener);
}

export function useTheme() {
  const [theme, setState] = useState<Theme>(getTheme);
  useEffect(() => onThemeChange(() => setState(getTheme())), []);
  return [theme, () => setTheme(theme === 'dark' ? 'light' : 'dark')] as const;
}
