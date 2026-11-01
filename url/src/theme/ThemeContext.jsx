import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { tokens } from './tokens';

const ThemeContext = createContext({
  themeMode: 'dark',
  activeMode: 'dark',
  tokens: tokens.dark,
  setThemeMode: () => {},
  toggleTheme: () => {},
});

export const ThemeProvider = ({ children }) => {
  const [themeMode, setThemeModeState] = useState(() => {
    try {
      return localStorage.getItem('shorturl_theme_mode') || 'shortie';
    } catch {
      return 'shortie';
    }
  });

  const [systemIsDark, setSystemIsDark] = useState(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return true;
  });

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e) => setSystemIsDark(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  const setThemeMode = (mode) => {
    setThemeModeState(mode);
    try {
      localStorage.setItem('shorturl_theme_mode', mode);
    } catch (e) {
      console.warn('Could not persist theme mode', e);
    }
  };

  const toggleTheme = () => {
    const cycle = ['shortie', 'tinu', 'dark', 'light'];
    const nextIdx = (cycle.indexOf(themeMode) + 1) % cycle.length;
    setThemeMode(cycle[nextIdx]);
  };

  const activeMode = themeMode === 'system'
    ? (systemIsDark ? 'shortie' : 'tinu')
    : themeMode;

  const currentTokens = tokens[activeMode] || (activeMode === 'light' ? tokens.light : tokens.shortie || tokens.dark);

  // Sync CSS variables to document root
  useEffect(() => {
    const root = document.documentElement;
    const p = currentTokens.palette;

    root.style.setProperty('--color-bg-default', p.background.default);
    root.style.setProperty('--color-bg-surface', p.background.surface);
    root.style.setProperty('--color-bg-paper', p.background.paper);
    root.style.setProperty('--color-bg-card', p.background.card);
    root.style.setProperty('--color-bg-elevated', p.background.elevated);
    root.style.setProperty('--color-bg-hover', p.background.hover);
    root.style.setProperty('--color-bg-active', p.background.active);
    root.style.setProperty('--color-bg-backdrop', p.background.backdrop);

    root.style.setProperty('--color-text-primary', p.text.primary);
    root.style.setProperty('--color-text-secondary', p.text.secondary);
    root.style.setProperty('--color-text-muted', p.text.muted);

    root.style.setProperty('--color-primary', p.primary.main);
    root.style.setProperty('--color-primary-light', p.primary.light);
    root.style.setProperty('--color-primary-dark', p.primary.dark);

    root.style.setProperty('--color-secondary', p.secondary.main);
    root.style.setProperty('--color-border-subtle', p.border.subtle);
    root.style.setProperty('--color-border-medium', p.border.medium);

    root.style.setProperty('--color-status-success', p.status.success);
    root.style.setProperty('--color-status-warning', p.status.warning);
    root.style.setProperty('--color-status-error', p.status.error);
    root.style.setProperty('--color-status-info', p.status.info);

    root.style.setProperty('--shadow-card', currentTokens.shadows.card);
    root.style.setProperty('--shadow-card-hover', currentTokens.shadows.cardHover);
    root.style.setProperty('--shadow-dropdown', currentTokens.shadows.dropdown);

    root.style.setProperty('--font-family', tokens.typography.fontFamily);
    root.style.setProperty('--font-body', tokens.typography.bodyFamily);
    root.style.setProperty('--font-code', tokens.typography.codeFamily);

    root.setAttribute('data-theme', activeMode);
    document.body.style.backgroundColor = p.background.default;
    document.body.style.color = p.text.primary;
  }, [activeMode, currentTokens]);

  const value = useMemo(() => ({
    themeMode,
    activeMode,
    tokens: currentTokens,
    setThemeMode,
    toggleTheme,
  }), [themeMode, activeMode, currentTokens]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
