import React from 'react';
import styles from './Layout.module.css';
import { useTheme } from '../../theme/ThemeContext';
import {
  IconSearch,
  IconPlus,
  IconSun,
  IconMoon,
} from '../common/Icons';

export const Header = ({ onOpenShortener, searchQuery, setSearchQuery, user }) => {
  const { themeMode, activeMode, toggleTheme } = useTheme();

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

        <button
          className={styles.iconBtn}
          onClick={toggleTheme}
          title={`Theme: ${themeMode} (${activeMode}). Click to switch.`}
        >
          {activeMode === 'dark' ? <IconSun size={16} /> : <IconMoon size={16} />}
        </button>

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

        {/* User Profile */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            paddingLeft: '6px',
            borderLeft: '1px solid var(--color-border-subtle)',
          }}
        >
          <img
            src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&h=120&q=80'}
            alt="User avatar"
            style={{
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              objectFit: 'cover',
              border: '1px solid var(--color-border-subtle)',
            }}
          />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-text-primary)', lineHeight: 1.2 }}>
              {user?.name || 'Architect'}
            </span>
            <span style={{ fontSize: '10.5px', color: 'var(--color-text-muted)', lineHeight: 1.2 }}>
              {user?.role?.toUpperCase() || 'PRO'}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
