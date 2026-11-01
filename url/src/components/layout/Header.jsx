import React from 'react';
import styles from './Layout.module.css';
import { useTheme } from '../../theme/ThemeContext';
import {
  IconSearch,
  IconPlus,
  IconSun,
  IconMoon,
} from '../common/Icons';

export const Header = ({
  onOpenShortener,
  searchQuery,
  setSearchQuery,
  user,
  isAuthenticated,
  onOpenAuth,
  onLogout,
}) => {
  const { themeMode, activeMode, toggleTheme, setThemeMode } = useTheme();

  return (
    <header className={styles.header}>
      <div className={styles.headerLeft}>
        <div className={styles.searchBox}>
          <IconSearch size={15} color="var(--color-text-muted)" />
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Search links, aliases, domains, or tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className={styles.headerRight}>
        <button
          className={styles.primaryBtn}
          onClick={onOpenShortener}
          title="Create a new short link"
        >
          <IconPlus size={15} />
          <span>New Link</span>
        </button>

        {/* Visual Design Style Selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <select
            value={themeMode}
            onChange={(e) => setThemeMode(e.target.value)}
            style={{
              background: 'var(--color-bg-surface)',
              border: '1px solid var(--color-border-subtle)',
              borderRadius: '9999px',
              color: 'var(--color-text-primary)',
              fontSize: '11.5px',
              fontWeight: 600,
              padding: '5px 10px',
              cursor: 'pointer',
              outline: 'none',
            }}
            title="Switch UI Design Theme"
          >
            <option value="shortie">⚡ Shortie UI (Design 1)</option>
            <option value="tinu">🌱 Tinu.be UI (Design 2)</option>
            <option value="dark">🌙 Muse Dark</option>
            <option value="light">☀️ Clean Light</option>
          </select>

          <button
            className={styles.iconBtn}
            onClick={toggleTheme}
            title={`Active: ${themeMode} (${activeMode}). Click to cycle.`}
          >
            {activeMode === 'dark' || themeMode === 'shortie' ? <IconSun size={15} /> : <IconMoon size={15} />}
          </button>
        </div>

        {/* Live system status pill */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '4px 9px',
            borderRadius: 'var(--radius-full)',
            backgroundColor: 'var(--color-bg-paper)',
            border: '1px solid var(--color-border-subtle)',
            fontSize: '12px',
            color: 'var(--color-status-success)',
            fontWeight: 500,
          }}
          title="High Concurrency Go Gateway Active"
        >
          <span
            style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              backgroundColor: 'var(--color-status-success)',
            }}
          />
          <span style={{ color: 'var(--color-text-secondary)', fontSize: '11.5px' }}>Go Engine</span>
        </div>

        {/* Authentication / User Profile Controls */}
        {isAuthenticated ? (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              paddingLeft: '6px',
              borderLeft: '1px solid var(--color-border-subtle)',
            }}
          >
            <div
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                backgroundColor: user?.role === 'ADMIN' ? 'var(--color-primary)' : 'var(--color-bg-elevated)',
                color: user?.role === 'ADMIN' ? '#FFFFFF' : 'var(--color-text-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '11px',
                fontWeight: 600,
                border: '1px solid var(--color-border-subtle)',
              }}
            >
              {user?.name ? user.name.substring(0, 2).toUpperCase() : 'US'}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-text-primary)', lineHeight: 1.2 }}>
                {user?.name || 'Customer'}
              </span>
              <span
                style={{
                  fontSize: '10px',
                  fontWeight: 600,
                  color: user?.role === 'ADMIN' ? 'var(--color-primary)' : 'var(--color-text-muted)',
                  lineHeight: 1.2,
                }}
              >
                {user?.role || 'CUSTOMER'}
              </span>
            </div>
            <button
              onClick={onLogout}
              style={{
                padding: '4px 8px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'transparent',
                color: 'var(--color-text-muted)',
                fontSize: '11.5px',
                border: '1px solid var(--color-border-subtle)',
                cursor: 'pointer',
                transition: 'color var(--transition-fast)',
              }}
              title="Log out"
            >
              Log out
            </button>
          </div>
        ) : (
          <button
            onClick={() => onOpenAuth('customer-login')}
            style={{
              padding: '6px 16px',
              borderRadius: 'var(--radius-full)',
              backgroundColor: 'var(--color-primary)',
              color: '#FFFFFF',
              fontSize: '12.5px',
              fontWeight: 500,
              border: 'none',
              cursor: 'pointer',
            }}
          >
            Log in
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;
