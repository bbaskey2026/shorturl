import React, { useState } from 'react';
import styles from './Layout.module.css';
import Sidebar from './Sidebar';
import Header from './Header';

export const MuseLayout = ({
  children,
  currentTab,
  onSelectTab,
  onOpenShortener,
  searchQuery,
  setSearchQuery,
  user,
  role = 'CUSTOMER',
  isAuthenticated = false,
  onOpenAuth,
  onLogout,
  onRequireAdminAuth,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className={styles.wrapper}>
      <Sidebar
        currentTab={currentTab}
        onSelectTab={onSelectTab}
        isCollapsed={isCollapsed}
        onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
        role={role}
        onRequireAdminAuth={onRequireAdminAuth}
      />
      <div className={styles.mainArea}>
        <Header
          onOpenShortener={onOpenShortener}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          user={user}
          isAuthenticated={isAuthenticated}
          onOpenAuth={onOpenAuth}
          onLogout={onLogout}
        />
        <main className={styles.contentContainer}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default MuseLayout;
