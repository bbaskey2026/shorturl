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
  IconMenu,
  IconLayers,
} from '../common/Icons';

export const Sidebar = ({
  currentTab,
  onSelectTab,
  isCollapsed,
  onToggleCollapse,
  role = 'CUSTOMER',
  onRequireAdminAuth,
}) => {
  const isAdmin = role === 'ADMIN';

  const navItems = [
    { id: 'landing', label: 'Home Showcase', icon: <IconZap size={17} />, badge: 'Shortie' },
    { id: 'dashboard', label: 'Overview', icon: <IconBarChart size={17} /> },
    { id: 'services', label: 'Platform Services', icon: <IconLayers size={17} />, badge: 'Core' },
    { id: 'links', label: 'Links', icon: <IconLink size={17} />, badge: '5' },
    { id: 'analytics', label: 'Analytics', icon: <IconBarChart size={17} /> },
    { id: 'domains', label: 'Custom Domains', icon: <IconGlobe size={17} /> },
    { id: 'qrcodes', label: 'QR Studio', icon: <IconQrCode size={17} /> },
    { id: 'folders', label: 'Folders & Tags', icon: <IconFolder size={17} /> },
    { id: 'subscriptions', label: 'Plans & Limits', icon: <IconCreditCard size={17} /> },
    { id: 'admin', label: 'Admin Portal', icon: <IconShield size={17} />, badge: isAdmin ? 'Staff' : 'Protected' },
  ];

  const handleItemClick = (id) => {
    if (id === 'admin' && !isAdmin) {
      if (typeof onRequireAdminAuth === 'function') {
        onRequireAdminAuth();
        return;
      }
    }
    onSelectTab(id);
  };

  return (
    <aside className={`${styles.sidebar} ${isCollapsed ? styles.sidebarCollapsed : ''}`}>
      <div className={styles.logoArea}>
        {!isCollapsed && (
          <div
            className={styles.logo}
            onClick={() => onSelectTab('landing')}
            style={{ cursor: 'pointer' }}
            title="Go to Home Showcase"
          >
            <div className={styles.logoIcon}>
              <IconZap size={16} />
            </div>
            <span>ShortSaaS ♾️</span>
          </div>
        )}
        {isCollapsed && (
          <div
            className={styles.logoIcon}
            onClick={() => onSelectTab('landing')}
            style={{ margin: '0 auto', cursor: 'pointer' }}
            title="Go to Home Showcase"
          >
            <IconZap size={16} />
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
              onClick={() => handleItemClick(item.id)}
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
                        borderRadius: 'var(--radius-full)',
                        backgroundColor: item.badge === 'Staff' ? 'rgba(242, 0, 57, 0.12)' : 'var(--color-bg-elevated)',
                        color: item.badge === 'Staff' ? '#F20039' : 'var(--color-text-secondary)',
                        fontWeight: 500,
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
              <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-text-primary)' }}>
                Pro Plan
              </span>
              <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>42% used</span>
            </div>
            {/* Progress bar */}
            <div
              style={{
                height: '4px',
                width: '100%',
                backgroundColor: 'var(--color-border-subtle)',
                borderRadius: 'var(--radius-full)',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  height: '100%',
                  width: '42%',
                  backgroundColor: 'var(--color-primary)',
                  borderRadius: 'var(--radius-full)',
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
