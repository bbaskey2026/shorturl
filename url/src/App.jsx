import React, { useState, useEffect } from 'react';
import { ThemeProvider } from './theme/ThemeContext';
import { AuthProvider, useAuth } from './features/auth/AuthContext';
import MuseLayout from './components/layout/MuseLayout';
import DashboardView from './features/dashboard/DashboardView';
import LinkManagementView from './features/links/LinkManagementView';
import AnalyticsView from './features/analytics/AnalyticsView';
import CustomDomainsView from './features/domains/CustomDomainsView';
import QRCodeStudioView from './features/qrcodes/QRCodeStudioView';
import FoldersView from './features/folders/FoldersView';
import SubscriptionView from './features/subscriptions/SubscriptionView';
import AdminDashboardView from './features/admin/AdminDashboardView';
import PlatformServicesView from './features/services/PlatformServicesView';
import LandingShowcaseView from './features/landing/LandingShowcaseView';
import LinkShortenerModal from './features/links/LinkShortenerModal';
import AuthModal from './features/auth/AuthModal';
import Badge from './components/common/Badge';
import { IconShield } from './components/common/Icons';
import {
  initialLinks,
  initialFolders,
  initialDomains,
  initialUser,
  initialAnalytics,
} from './services/mockData';
import './styles/theme.css';

const AppContent = () => {
  const { user: authUser, role, isAuthenticated, logout } = useAuth();

  const [currentTab, setCurrentTab] = useState('landing');
  const [searchQuery, setSearchQuery] = useState('');
  const [isShortenerOpen, setIsShortenerOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState('customer-login');
  const [selectedLinkForAnalytics, setSelectedLinkForAnalytics] = useState(null);

  // Initialize links: merge existing localStorage with rich initial fixtures if empty
  const [links, setLinks] = useState(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('urls'));
      if (stored && Array.isArray(stored) && stored.length > 0) {
        // Normalize any old format entries from original demo
        return stored.map((item, idx) => ({
          id: item.id || `legacy-${idx}`,
          originalUrl: item.originalUrl || item.original || 'https://example.com',
          shortCode: item.shortCode || (item.short ? item.short.split('/').pop() : `short${idx}`),
          customDomain: item.customDomain || 'short.io',
          title: item.title || 'Imported Link',
          createdAt: item.createdAt || new Date().toISOString(),
          expiresAt: item.expiresAt || null,
          isActive: item.isActive !== undefined ? item.isActive : true,
          isPasswordProtected: !!item.isPasswordProtected,
          folderId: item.folderId || null,
          tags: item.tags || ['imported'],
          clicks: item.clicks || 0,
          uniqueVisitors: item.uniqueVisitors || Math.round((item.clicks || 0) * 0.75),
        }));
      }
    } catch (e) {
      console.warn('Could not read existing urls from localStorage', e);
    }
    return initialLinks;
  });

  const [folders, setFolders] = useState(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('shorturl_folders'));
      if (stored) return stored;
    } catch {}
    return initialFolders;
  });

  const [domains, setDomains] = useState(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('shorturl_domains'));
      if (stored) return stored;
    } catch {}
    return initialDomains;
  });

  const [analytics, setAnalytics] = useState(initialAnalytics);
  const [user, setUser] = useState(initialUser);

  // Sync user profile when authenticated user changes
  const effectiveUser = authUser
    ? {
        ...user,
        name: authUser.name || user.name,
        email: authUser.email || user.email,
        role: authUser.role || 'CUSTOMER',
      }
    : user;

  // Save links whenever updated
  useEffect(() => {
    try {
      localStorage.setItem('urls', JSON.stringify(links));
    } catch (e) {
      console.warn('Could not persist urls', e);
    }
  }, [links]);

  // Save folders
  useEffect(() => {
    try {
      localStorage.setItem('shorturl_folders', JSON.stringify(folders));
    } catch {}
  }, [folders]);

  // Save domains
  useEffect(() => {
    try {
      localStorage.setItem('shorturl_domains', JSON.stringify(domains));
    } catch {}
  }, [domains]);

  // Link actions
  const handleCreateLink = (newLink) => {
    setLinks((prev) => [newLink, ...prev]);
  };

  const handleUpdateLink = (updated) => {
    setLinks((prev) => prev.map((l) => (l.id === updated.id ? updated : l)));
  };

  const handleDeleteLink = (id) => {
    setLinks((prev) => prev.filter((l) => l.id !== id));
  };

  const handleToggleLinkActive = (id) => {
    setLinks((prev) =>
      prev.map((l) => (l.id === id ? { ...l, isActive: !l.isActive } : l))
    );
  };

  const handleViewAnalyticsForLink = (link) => {
    setSelectedLinkForAnalytics(link);
    setCurrentTab('analytics');
  };

  // Domain actions
  const handleAddDomain = (dom) => {
    setDomains((prev) => [...prev, dom]);
  };

  const handleDeleteDomain = (id) => {
    setDomains((prev) => prev.filter((d) => d.id !== id));
  };

  const handleSetDefaultDomain = (id) => {
    setDomains((prev) =>
      prev.map((d) => ({
        ...d,
        isDefault: d.id === id,
      }))
    );
  };

  // Folder actions
  const handleCreateFolder = (f) => {
    setFolders((prev) => [...prev, f]);
  };

  const handleDeleteFolder = (id) => {
    setFolders((prev) => prev.filter((f) => f.id !== id));
    // Remove folder association from links
    setLinks((prev) =>
      prev.map((l) => (l.folderId === id ? { ...l, folderId: null } : l))
    );
  };

  const handleUpgradePlan = (planId) => {
    setUser((prev) => ({ ...prev, plan: planId }));
    alert(`Upgraded to ${planId.toUpperCase()} plan successfully!`);
  };

  const handleOpenAuth = (tab = 'customer-login') => {
    setAuthModalTab(tab);
    setIsAuthModalOpen(true);
  };

  const handleRequireAdminAuth = () => {
    setAuthModalTab('admin-login');
    setIsAuthModalOpen(true);
  };

  return (
    <MuseLayout
      currentTab={currentTab}
      onSelectTab={setCurrentTab}
      onOpenShortener={() => setIsShortenerOpen(true)}
      searchQuery={searchQuery}
      setSearchQuery={setSearchQuery}
      user={effectiveUser}
      role={role}
      isAuthenticated={isAuthenticated}
      onOpenAuth={handleOpenAuth}
      onLogout={logout}
      onRequireAdminAuth={handleRequireAdminAuth}
    >
      {currentTab === 'landing' && (
        <LandingShowcaseView
          onSelectTab={setCurrentTab}
          onOpenShortener={() => setIsShortenerOpen(true)}
          onCreateLink={handleCreateLink}
          onOpenAuth={handleOpenAuth}
          links={links}
          domains={domains.map((d) => (typeof d === 'string' ? d : d.domain || 'shortie.link'))}
        />
      )}

      {currentTab === 'dashboard' && (
        <DashboardView
          links={links}
          analytics={analytics}
          onOpenShortener={() => setIsShortenerOpen(true)}
          onSelectTab={setCurrentTab}
          onToggleLinkActive={handleToggleLinkActive}
          onSelectLinkForAnalytics={handleViewAnalyticsForLink}
        />
      )}

      {currentTab === 'services' && (
        <PlatformServicesView
          onSelectTab={setCurrentTab}
          onOpenShortener={() => setIsShortenerOpen(true)}
          onCreateLink={handleCreateLink}
          domains={domains}
          links={links}
        />
      )}

      {currentTab === 'links' && (
        <LinkManagementView
          links={links}
          folders={folders}
          domains={domains}
          onUpdateLink={handleUpdateLink}
          onDeleteLink={handleDeleteLink}
          onToggleActive={handleToggleLinkActive}
          onOpenShortener={() => setIsShortenerOpen(true)}
          onViewAnalytics={handleViewAnalyticsForLink}
        />
      )}

      {currentTab === 'analytics' && (
        <AnalyticsView
          analytics={analytics}
          links={links}
          selectedLink={selectedLinkForAnalytics}
          onClearSelectedLink={() => setSelectedLinkForAnalytics(null)}
        />
      )}

      {currentTab === 'domains' && (
        <CustomDomainsView
          domains={domains}
          onAddDomain={handleAddDomain}
          onDeleteDomain={handleDeleteDomain}
          onSetDefaultDomain={handleSetDefaultDomain}
        />
      )}

      {currentTab === 'qrcodes' && (
        <QRCodeStudioView links={links} />
      )}

      {currentTab === 'folders' && (
        <FoldersView
          folders={folders}
          links={links}
          onCreateFolder={handleCreateFolder}
          onDeleteFolder={handleDeleteFolder}
        />
      )}

      {currentTab === 'subscriptions' && (
        <SubscriptionView
          currentPlan={user.plan}
          onUpgradePlan={handleUpgradePlan}
        />
      )}

      {currentTab === 'admin' && (
        role === 'ADMIN' ? (
          <AdminDashboardView links={links} domains={domains} />
        ) : (
          <div
            style={{
              maxWidth: '560px',
              margin: '60px auto',
              textAlign: 'center',
              padding: '40px 32px',
              background: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-lg)',
              boxShadow: 'var(--shadow-card)',
            }}
          >
            <div
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.25)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 18px',
                color: 'var(--color-status-error, #ef4444)',
              }}
            >
              <IconShield size={28} />
            </div>
            <Badge variant="error" size="sm" style={{ marginBottom: '12px' }}>
              RESTRICTED ACCESS
            </Badge>
            <h2
              style={{
                fontSize: '20px',
                fontWeight: 600,
                color: 'var(--color-text-primary)',
                marginBottom: '8px',
              }}
            >
              Administrative Privileges Required
            </h2>
            <p
              style={{
                fontSize: '13.5px',
                color: 'var(--color-text-muted)',
                lineHeight: '1.6',
                marginBottom: '24px',
              }}
            >
              The Administrator Portal contains platform tenant management, telemetry, and security
              audit logs. Access is strictly limited to authenticated staff administrators.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
              <button
                onClick={() => setCurrentTab('dashboard')}
                style={{
                  padding: '9px 18px',
                  fontSize: '13px',
                  fontWeight: 500,
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--color-surface-hover)',
                  border: '1px solid var(--color-border)',
                  color: 'var(--color-text-primary)',
                  cursor: 'pointer',
                }}
              >
                Return to Dashboard
              </button>
              <button
                onClick={handleRequireAdminAuth}
                style={{
                  padding: '9px 18px',
                  fontSize: '13px',
                  fontWeight: 600,
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--color-primary)',
                  border: 'none',
                  color: '#ffffff',
                  cursor: 'pointer',
                }}
              >
                Authenticate as Staff Admin
              </button>
            </div>
          </div>
        )
      )}

      {/* Global Shortener Modal */}
      <LinkShortenerModal
        isOpen={isShortenerOpen}
        onClose={() => setIsShortenerOpen(false)}
        domains={domains}
        folders={folders}
        onCreateLink={handleCreateLink}
      />

      {/* Centralized Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialTab={authModalTab}
        onSuccess={(authRole) => {
          if (authRole === 'admin') {
            setCurrentTab('admin');
          }
        }}
      />
    </MuseLayout>
  );
};

export const App = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
