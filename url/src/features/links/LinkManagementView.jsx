import React, { useState, useMemo } from 'react';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import CustomQR from '../../components/common/CustomQR';
import {
  IconLink,
  IconCopy,
  IconCheck,
  IconExternalLink,
  IconQrCode,
  IconTrash,
  IconEdit,
  IconSearch,
  IconLock,
  IconBarChart,
  IconFolder,
} from '../../components/common/Icons';

export const LinkManagementView = ({
  links = [],
  folders = [],
  onUpdateLink,
  onDeleteLink,
  onOpenShortener,
  onViewAnalytics,
}) => {
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterFolder, setFilterFolder] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [selectedIds, setSelectedIds] = useState([]);
  const [copiedId, setCopiedId] = useState(null);

  // Edit Link Modal state
  const [editingLink, setEditingLink] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editOriginalUrl, setEditOriginalUrl] = useState('');
  const [editFolderId, setEditFolderId] = useState('');

  // QR Modal state
  const [qrModalLink, setQrModalLink] = useState(null);

  // Filter & Sort
  const filteredLinks = useMemo(() => {
    return links.filter((l) => {
      const matchSearch =
        search === '' ||
        l.shortCode.toLowerCase().includes(search.toLowerCase()) ||
        l.originalUrl.toLowerCase().includes(search.toLowerCase()) ||
        (l.title && l.title.toLowerCase().includes(search.toLowerCase())) ||
        (l.tags && l.tags.some((t) => t.toLowerCase().includes(search.toLowerCase())));

      const isExpired = l.expiresAt && new Date(l.expiresAt) < new Date();
      let matchStatus = true;
      if (filterStatus === 'active') matchStatus = l.isActive && !isExpired;
      if (filterStatus === 'inactive') matchStatus = !l.isActive || isExpired;
      if (filterStatus === 'protected') matchStatus = l.isPasswordProtected;

      let matchFolder = true;
      if (filterFolder !== 'all') {
        matchFolder = l.folderId === filterFolder;
      }

      return matchSearch && matchStatus && matchFolder;
    }).sort((a, b) => {
      if (sortBy === 'clicks') return (b.clicks || 0) - (a.clicks || 0);
      if (sortBy === 'oldest') return new Date(a.createdAt) - new Date(b.createdAt);
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
  }, [links, search, filterStatus, filterFolder, sortBy]);

  const copyUrl = (link) => {
    const full = `https://${link.customDomain || 'short.io'}/${link.shortCode}`;
    navigator.clipboard.writeText(full);
    setCopiedId(link.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(filteredLinks.map((l) => l.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleToggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleBulkDelete = () => {
    if (window.confirm(`Are you sure you want to delete ${selectedIds.length} links?`)) {
      selectedIds.forEach((id) => onDeleteLink?.(id));
      setSelectedIds([]);
    }
  };

  const openEdit = (link) => {
    setEditingLink(link);
    setEditTitle(link.title || '');
    setEditOriginalUrl(link.originalUrl);
    setEditFolderId(link.folderId || '');
  };

  const saveEdit = (e) => {
    e.preventDefault();
    if (!editingLink) return;
    onUpdateLink?.({
      ...editingLink,
      title: editTitle,
      originalUrl: editOriginalUrl,
      folderId: editFolderId || null,
    });
    setEditingLink(null);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
      {/* Title & Action Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <h1 style={{ fontSize: '20px', fontWeight: 600, letterSpacing: '-0.02em', color: 'var(--color-text-primary)' }}>
            Link Management
          </h1>
          <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', marginTop: '2px' }}>
            {filteredLinks.length} total links in workspace
          </p>
        </div>

        <button
          onClick={onOpenShortener}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 16px',
            backgroundColor: 'var(--color-primary)',
            color: '#FFFFFF',
            borderRadius: 'var(--radius-md)',
            fontSize: '13px',
            fontWeight: 500,
            border: 'none',
            transition: 'background-color var(--transition-fast)',
          }}
        >
          <IconLink size={15} /> Shorten New URL
        </button>
      </div>

      {/* Filter and Search Controls */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '10px',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '14px 16px',
          borderRadius: 'var(--radius-xl)',
          backgroundColor: 'var(--color-bg-paper)',
          border: '1px solid var(--color-border-subtle)',
          boxShadow: 'var(--shadow-card)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, minWidth: '240px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: 'var(--color-bg-elevated)',
              padding: '7px 12px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-border-subtle)',
              flex: 1,
            }}
          >
            <IconSearch size={15} color="var(--color-text-muted)" />
            <input
              type="text"
              placeholder="Search links, aliases or tags..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--color-text-primary)',
                fontSize: '13px',
                width: '100%',
              }}
            />
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            style={{
              padding: '7px 12px',
              backgroundColor: 'var(--color-bg-elevated)',
              border: '1px solid var(--color-border-subtle)',
              borderRadius: 'var(--radius-md)',
              color: 'var(--color-text-primary)',
              fontSize: '12.5px',
            }}
          >
            <option value="all">All Status</option>
            <option value="active">Active Only</option>
            <option value="inactive">Inactive / Expired</option>
            <option value="protected">Password Protected</option>
          </select>

          {/* Folder Filter */}
          <select
            value={filterFolder}
            onChange={(e) => setFilterFolder(e.target.value)}
            style={{
              padding: '7px 12px',
              backgroundColor: 'var(--color-bg-elevated)',
              border: '1px solid var(--color-border-subtle)',
              borderRadius: 'var(--radius-md)',
              color: 'var(--color-text-primary)',
              fontSize: '12.5px',
            }}
          >
            <option value="all">All Folders</option>
            {folders.map((f) => (
              <option key={f.id} value={f.id}>
                {f.name}
              </option>
            ))}
          </select>

          {/* Sort By */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={{
              padding: '7px 12px',
              backgroundColor: 'var(--color-bg-elevated)',
              border: '1px solid var(--color-border-subtle)',
              borderRadius: 'var(--radius-md)',
              color: 'var(--color-text-primary)',
              fontSize: '12.5px',
            }}
          >
            <option value="newest">Newest First</option>
            <option value="clicks">Most Clicks</option>
            <option value="oldest">Oldest First</option>
          </select>
        </div>
      </div>

      {/* Bulk Action Bar */}
      {selectedIds.length > 0 && (
        <div
          style={{
            padding: '10px 16px',
            backgroundColor: 'var(--color-bg-paper)',
            border: '1px solid var(--color-primary)',
            borderRadius: 'var(--radius-md)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <span style={{ fontSize: '13px', fontWeight: 500, color: 'var(--color-primary)' }}>
            {selectedIds.length} links selected
          </span>
          <button
            onClick={handleBulkDelete}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '5px 12px',
              backgroundColor: 'rgba(242, 0, 57, 0.12)',
              color: 'var(--color-status-error)',
              borderRadius: 'var(--radius-sm)',
              fontSize: '12px',
              fontWeight: 500,
              border: '1px solid rgba(242, 0, 57, 0.25)',
            }}
          >
            <IconTrash size={14} /> Delete Selected
          </button>
        </div>
      )}

      {/* DataGrid Table in Muse.ai Card Style */}
      <div
        style={{
          backgroundColor: 'var(--color-bg-card)',
          borderRadius: 'var(--radius-xl)',
          border: '1px solid var(--color-border-subtle)',
          boxShadow: 'var(--shadow-card)',
          overflow: 'hidden',
        }}
      >
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
            <thead>
              <tr
                style={{
                  borderBottom: '1px solid var(--color-border-subtle)',
                  backgroundColor: 'var(--color-bg-surface)',
                  color: 'var(--color-text-muted)',
                  fontSize: '11px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  fontWeight: 600,
                }}
              >
                <th style={{ padding: '12px 16px', width: '36px' }}>
                  <input
                    type="checkbox"
                    checked={selectedIds.length > 0 && selectedIds.length === filteredLinks.length}
                    onChange={handleSelectAll}
                  />
                </th>
                <th style={{ padding: '12px 16px' }}>Short Link & Destination</th>
                <th style={{ padding: '12px 16px' }}>Folder & Tags</th>
                <th style={{ padding: '12px 16px' }}>Clicks</th>
                <th style={{ padding: '12px 16px' }}>Status</th>
                <th style={{ padding: '12px 16px' }}>Created</th>
                <th style={{ padding: '12px 16px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredLinks.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ padding: '40px', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                    No shortened links found.
                  </td>
                </tr>
              ) : (
                filteredLinks.map((link) => {
                  const fullShort = `https://${link.customDomain || 'short.io'}/${link.shortCode}`;
                  const isCopied = copiedId === link.id;
                  const isSelected = selectedIds.includes(link.id);
                  const isExpired = link.expiresAt && new Date(link.expiresAt) < new Date();
                  const folder = folders.find((f) => f.id === link.folderId);

                  return (
                    <tr
                      key={link.id}
                      style={{
                        borderBottom: '1px solid var(--color-border-subtle)',
                        backgroundColor: isSelected ? 'var(--color-bg-hover)' : 'transparent',
                        transition: 'background-color var(--transition-fast)',
                      }}
                    >
                      {/* Checkbox */}
                      <td style={{ padding: '12px 16px' }}>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleToggleSelect(link.id)}
                        />
                      </td>

                      {/* Title & URLs */}
                      <td style={{ padding: '12px 16px', maxWidth: '320px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>
                              {link.title || link.shortCode}
                            </span>
                            {link.isPasswordProtected && (
                              <span title="Password Protected">
                                <IconLock size={12} color="var(--color-text-muted)" />
                              </span>
                            )}
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span
                              style={{
                                fontFamily: 'var(--font-code)',
                                color: 'var(--color-primary)',
                                fontWeight: 500,
                                fontSize: '12px',
                              }}
                            >
                              {fullShort}
                            </span>
                            <button
                              onClick={() => copyUrl(link)}
                              style={{
                                background: 'transparent',
                                color: isCopied ? 'var(--color-status-success)' : 'var(--color-text-muted)',
                                padding: '2px',
                              }}
                              title="Copy URL"
                            >
                              {isCopied ? <IconCheck size={13} /> : <IconCopy size={13} />}
                            </button>
                          </div>

                          <a
                            href={link.originalUrl}
                            target="_blank"
                            rel="noreferrer"
                            style={{
                              fontSize: '11px',
                              color: 'var(--color-text-muted)',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px',
                            }}
                          >
                            {link.originalUrl} <IconExternalLink size={10} />
                          </a>
                        </div>
                      </td>

                      {/* Folder & Tags */}
                      <td style={{ padding: '12px 16px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          {folder ? (
                            <span style={{ fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--color-text-secondary)' }}>
                              <IconFolder size={12} /> {folder.name}
                            </span>
                          ) : (
                            <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>—</span>
                          )}

                          {link.tags && link.tags.length > 0 && (
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                              {link.tags.map((t, idx) => (
                                <Badge key={idx} size="sm">
                                  #{t}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Clicks */}
                      <td style={{ padding: '12px 16px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <span style={{ fontWeight: 600, color: 'var(--color-text-primary)', fontSize: '13.5px' }}>
                            {link.clicks.toLocaleString()}
                          </span>
                          <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
                            {link.uniqueVisitors || Math.round(link.clicks * 0.75)} unique
                          </span>
                        </div>
                      </td>

                      {/* Status */}
                      <td style={{ padding: '12px 16px' }}>
                        {isExpired ? (
                          <Badge variant="warning" dot size="sm">Expired</Badge>
                        ) : link.isActive ? (
                          <Badge variant="success" dot size="sm">Active</Badge>
                        ) : (
                          <Badge variant="error" dot size="sm">Disabled</Badge>
                        )}
                      </td>

                      {/* Created */}
                      <td style={{ padding: '12px 16px', color: 'var(--color-text-muted)', fontSize: '12px' }}>
                        {new Date(link.createdAt).toLocaleDateString()}
                      </td>

                      {/* Action buttons */}
                      <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                          <button
                            onClick={() => setQrModalLink(link)}
                            title="QR Code"
                            style={{
                              background: 'transparent',
                              color: 'var(--color-text-secondary)',
                              padding: '5px',
                              borderRadius: 'var(--radius-sm)',
                            }}
                          >
                            <IconQrCode size={14} />
                          </button>

                          <button
                            onClick={() => onViewAnalytics?.(link)}
                            title="Analytics"
                            style={{
                              background: 'transparent',
                              color: 'var(--color-text-secondary)',
                              padding: '5px',
                              borderRadius: 'var(--radius-sm)',
                            }}
                          >
                            <IconBarChart size={14} />
                          </button>

                          <button
                            onClick={() => openEdit(link)}
                            title="Edit Link"
                            style={{
                              background: 'transparent',
                              color: 'var(--color-text-secondary)',
                              padding: '5px',
                              borderRadius: 'var(--radius-sm)',
                            }}
                          >
                            <IconEdit size={14} />
                          </button>

                          <button
                            onClick={() => onDeleteLink?.(link.id)}
                            title="Delete Link"
                            style={{
                              background: 'transparent',
                              color: 'var(--color-status-error)',
                              padding: '5px',
                              borderRadius: 'var(--radius-sm)',
                            }}
                          >
                            <IconTrash size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Link Modal */}
      {editingLink && (
        <Modal
          isOpen={true}
          onClose={() => setEditingLink(null)}
          title="Edit Short Link"
        >
          <form onSubmit={saveEdit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <label style={{ fontSize: '12.5px', fontWeight: 500, color: 'var(--color-text-secondary)' }}>
                Title
              </label>
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                style={{
                  padding: '9px 12px',
                  backgroundColor: 'var(--color-bg-elevated)',
                  border: '1px solid var(--color-border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  color: 'var(--color-text-primary)',
                  fontSize: '13px',
                }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <label style={{ fontSize: '12.5px', fontWeight: 500, color: 'var(--color-text-secondary)' }}>
                Destination URL
              </label>
              <input
                type="url"
                value={editOriginalUrl}
                onChange={(e) => setEditOriginalUrl(e.target.value)}
                required
                style={{
                  padding: '9px 12px',
                  backgroundColor: 'var(--color-bg-elevated)',
                  border: '1px solid var(--color-border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  color: 'var(--color-text-primary)',
                  fontSize: '13px',
                }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <label style={{ fontSize: '12.5px', fontWeight: 500, color: 'var(--color-text-secondary)' }}>
                Folder
              </label>
              <select
                value={editFolderId}
                onChange={(e) => setEditFolderId(e.target.value)}
                style={{
                  padding: '9px 12px',
                  backgroundColor: 'var(--color-bg-elevated)',
                  border: '1px solid var(--color-border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  color: 'var(--color-text-primary)',
                  fontSize: '13px',
                }}
              >
                <option value="">No Folder</option>
                {folders.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.name}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '8px' }}>
              <button
                type="button"
                onClick={() => setEditingLink(null)}
                style={{
                  padding: '8px 14px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'transparent',
                  color: 'var(--color-text-secondary)',
                  border: '1px solid var(--color-border-subtle)',
                  fontSize: '12.5px',
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                style={{
                  padding: '8px 18px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--color-primary)',
                  color: '#FFFFFF',
                  fontSize: '12.5px',
                  fontWeight: 500,
                  border: 'none',
                }}
              >
                Save Changes
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* QR Code Modal Preview */}
      {qrModalLink && (
        <Modal
          isOpen={true}
          onClose={() => setQrModalLink(null)}
          title={`QR Code: ${qrModalLink.shortCode}`}
        >
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px' }}>
            <span style={{ fontSize: '12.5px', color: 'var(--color-text-muted)' }}>
              Scan to route directly to destination
            </span>
            <CustomQR
              value={`https://${qrModalLink.customDomain || 'short.io'}/${qrModalLink.shortCode}`}
              size={200}
              fgColor="var(--color-primary)"
              bgColor="var(--color-bg-paper)"
            />
          </div>
        </Modal>
      )}
    </div>
  );
};

export default LinkManagementView;
