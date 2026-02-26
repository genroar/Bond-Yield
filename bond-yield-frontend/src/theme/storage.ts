import type { ThemeMode } from './theme';

const STORAGE_KEY = 'bond-calculator-theme';

export function getStoredThemeMode(): ThemeMode {
  if (typeof window === 'undefined') return 'light';
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (stored === 'dark' || stored === 'light') return stored;
  return 'light';
}

export function setStoredThemeMode(mode: ThemeMode): void {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(STORAGE_KEY, mode);
}
