import React from 'react';
import styles from './Layout.module.css';
import { useTheme } from '../../theme/ThemeContext';
import {
  IconSearch,
  IconPlus,
  IconSun,
  IconMoon,
  IconShield,
  IconActivity,
} from '../common/Icons';

export const Header = ({ onOpenShortener, searchQuery, setSearchQuery, user }) => {
  const { themeMode, activeMode, toggleTheme } = useTheme();

  return (
    <header className={styles.header}>
      <div className={styles.headerLeft}>
        <div className={styles.searchBox}>
          <IconSearch size={16} color="var(--color-text-muted)" />
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
          <IconPlus size={16} />
          <span>New Link</span>
        </button>

        <button
          className={styles.iconBtn}
          onClick={toggleTheme}
          title={`Current: ${themeMode} (${activeMode}). Click to toggle.`}
        >
          {activeMode === 'dark' ? <IconSun size={17} /> : <IconMoon size={17} />}
        </button>

        {/* Live system status pill */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '5px 10px',
            borderRadius: 'var(--radius-full)',
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            border: '1px solid rgba(16, 185, 129, 0.25)',
            fontSize: '12px',
            color: '#10B981',
            fontWeight: 500,
          }}
          title="High Concurrency Go Gateway Ready"
        >
          <span
            style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              backgroundColor: '#10B981',
              boxShadow: '0 0 8px #10B981',
            }}
          />
          <span>Go Engine</span>
        </div>

        {/* User Avatar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            paddingLeft: '8px',
            borderLeft: '1px solid var(--color-border-subtle)',
          }}
        >
          <img
            src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&h=120&q=80'}
            alt="User avatar"
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              objectFit: 'cover',
              border: '1px solid var(--color-border-subtle)',
            }}
          />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '12.5px', fontWeight: 600, color: 'var(--color-text-primary)' }}>
              {user?.name || 'Architect'}
            </span>
            <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
              {user?.role?.toUpperCase() || 'PRO'}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

