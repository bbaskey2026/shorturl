import React from 'react';
import styles from './Layout.module.css';
import {
  IconLink,
  IconBarChart,
  IconGlobe,
  IconQrCode,
  IconFolder,
  IconCreditCard,
  IconShield,
  IconZap,
  IconChevronRight,
  IconMenu,
} from '../common/Icons';

export const Sidebar = ({
  currentTab,
  onSelectTab,
  isCollapsed,
  onToggleCollapse,
}) => {
  const navItems = [
    { id: 'dashboard', label: 'Overview', icon: <IconBarChart size={18} /> },
    { id: 'links', label: 'Links', icon: <IconLink size={18} />, badge: '5' },
    { id: 'analytics', label: 'Analytics', icon: <IconBarChart size={18} /> },
    { id: 'domains', label: 'Custom Domains', icon: <IconGlobe size={18} /> },
    { id: 'qrcodes', label: 'QR Studio', icon: <IconQrCode size={18} /> },
    { id: 'folders', label: 'Folders & Tags', icon: <IconFolder size={18} /> },
    { id: 'subscriptions', label: 'Plans & Limits', icon: <IconCreditCard size={18} /> },
    { id: 'admin', label: 'Admin Portal', icon: <IconShield size={18} />, badge: 'Staff' },
  ];

  return (
    <aside className={`${styles.sidebar} ${isCollapsed ? styles.sidebarCollapsed : ''}`}>
      <div className={styles.logoArea}>
        {!isCollapsed && (
          <div className={styles.logo}>
            <div className={styles.logoIcon}>
              <IconZap size={18} />
            </div>
            <span>ShortSaaS</span>
          </div>
        )}
        {isCollapsed && (
          <div className={styles.logoIcon} style={{ margin: '0 auto' }}>
            <IconZap size={18} />
          </div>
        )}
        <button
          className={styles.collapseBtn}
          onClick={onToggleCollapse}
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <IconMenu size={16} />
        </button>
      </div>

      <div className={styles.navSection}>
        {!isCollapsed && <div className={styles.navLabel}>Workspace</div>}
        {navItems.map((item) => {
          const isActive = currentTab === item.id;
          return (
            <div
              key={item.id}
              className={`${styles.navItem} ${isActive ? styles.navItemActive : ''}`}
              onClick={() => onSelectTab(item.id)}
              title={isCollapsed ? item.label : undefined}
            >
              {item.icon}
              {!isCollapsed && (
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span>{item.label}</span>
                  {item.badge && (
                    <span
                      style={{
                        fontSize: '11px',
                        padding: '1px 6px',
                        borderRadius: '10px',
                        backgroundColor: item.badge === 'Staff' ? 'rgba(239, 68, 68, 0.15)' : 'var(--color-bg-hover)',
                        color: item.badge === 'Staff' ? '#EF4444' : 'var(--color-text-muted)',
                        fontWeight: 600,
                      }}
                    >
                      {item.badge}
                    </span>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {!isCollapsed && (
        <div className={styles.sidebarFooter}>
          <div className={styles.planCard}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-primary-light)' }}>
                Pro Plan
              </span>
              <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>42% used</span>
            </div>
            {/* Progress bar */}
            <div
              style={{
                height: '4px',
                width: '100%',
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                borderRadius: '2px',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  height: '100%',
                  width: '42%',
                  backgroundColor: 'var(--color-primary)',
                  borderRadius: '2px',
                }}
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--color-text-muted)' }}>
              <span>2,100 / 5,000 links</span>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;

