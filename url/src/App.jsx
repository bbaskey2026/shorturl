import React, { useState, useEffect } from 'react';
import { ThemeProvider } from './theme/ThemeContext';
import MuseLayout from './components/layout/MuseLayout';
import DashboardView from './features/dashboard/DashboardView';
import LinkManagementView from './features/links/LinkManagementView';
import AnalyticsView from './features/analytics/AnalyticsView';
import CustomDomainsView from './features/domains/CustomDomainsView';
import QRCodeStudioView from './features/qrcodes/QRCodeStudioView';
import FoldersView from './features/folders/FoldersView';
import SubscriptionView from './features/subscriptions/SubscriptionView';
import AdminDashboardView from './features/admin/AdminDashboardView';
import LinkShortenerModal from './features/links/LinkShortenerModal';
import {
  initialLinks,
  initialFolders,
  initialDomains,
  initialUser,
  initialAnalytics,
} from './services/mockData';
import './styles/theme.css';

export const App = () => {
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [isShortenerOpen, setIsShortenerOpen] = useState(false);
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

  return (
    <ThemeProvider>
      <MuseLayout
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        onOpenShortener={() => setIsShortenerOpen(true)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        user={user}
      >
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
          <AdminDashboardView links={links} domains={domains} />
        )}

        {/* Global Shortener Modal */}
        <LinkShortenerModal
          isOpen={isShortenerOpen}
          onClose={() => setIsShortenerOpen(false)}
          domains={domains}
          folders={folders}
          onCreateLink={handleCreateLink}
        />
      </MuseLayout>
    </ThemeProvider>
  );
};

export default App;

