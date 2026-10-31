import React, { useState } from 'react';
import Modal from '../../components/common/Modal';
import { CustomQR } from '../../components/common/CustomQR';
import {
  IconLink,
  IconCopy,
  IconCheck,
  IconCalendar,
  IconLock,
  IconGlobe,
  IconFolder,
  IconTag,
  IconQrCode,
  IconExternalLink,
} from '../../components/common/Icons';

export const LinkShortenerModal = ({
  isOpen,
  onClose,
  domains = [],
  folders = [],
  onCreateLink,
}) => {
  const [originalUrl, setOriginalUrl] = useState('');
  const [domain, setDomain] = useState(domains[0]?.domain || 'short.io');
  const [customSlug, setCustomSlug] = useState('');
  const [title, setTitle] = useState('');
  const [folderId, setFolderId] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [expiresAt, setExpiresAt] = useState('');
  const [password, setPassword] = useState('');
  const [hasPassword, setHasPassword] = useState(false);
  const [hasExpiry, setHasExpiry] = useState(false);
  const [showQR, setShowQR] = useState(false);

  const [createdResult, setCreatedResult] = useState(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  const handleReset = () => {
    setOriginalUrl('');
    setCustomSlug('');
    setTitle('');
    setFolderId('');
    setTagsInput('');
    setExpiresAt('');
    setPassword('');
    setHasPassword(false);
    setHasExpiry(false);
    setCreatedResult(null);
    setShowQR(false);
    setError('');
  };

  const handleClose = () => {
    handleReset();
    onClose();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!originalUrl.trim()) {
      setError('Original destination URL is required.');
      return;
    }

    try {
      new URL(originalUrl);
    } catch {
      setError('Please provide a valid URL including http:// or https://');
      return;
    }

    const shortCode = customSlug.trim() || Math.random().toString(36).substring(2, 8);
    const tags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const newLink = {
      id: `link-${Date.now()}`,
      originalUrl: originalUrl.trim(),
      shortCode,
      customDomain: domain,
      title: title.trim() || originalUrl.replace(/^https?:\/\//, '').split('/')[0],
      createdAt: new Date().toISOString(),
      expiresAt: hasExpiry && expiresAt ? new Date(expiresAt).toISOString() : null,
      isActive: true,
      isPasswordProtected: hasPassword && !!password,
      password: hasPassword ? password : null,
      folderId: folderId || null,
      tags,
      clicks: 0,
      uniqueVisitors: 0,
    };

    onCreateLink?.(newLink);
    setCreatedResult(newLink);
  };

  const fullShortUrl = createdResult
    ? `https://${createdResult.customDomain}/${createdResult.shortCode}`
    : `https://${domain}/${customSlug || 'xyz123'}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(fullShortUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={createdResult ? 'Link Created Successfully!' : 'Create Short Link'}
    >
      {createdResult ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div
            style={{
              padding: '16px',
              backgroundColor: 'rgba(16, 185, 129, 0.08)',
              border: '1px solid rgba(16, 185, 129, 0.25)',
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '12px', fontWeight: 600, color: '#10B981' }}>
                LIVE SHORT URL
              </span>
              <a
                href={createdResult.originalUrl}
                target="_blank"
                rel="noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '12px',
                  color: 'var(--color-primary-light)',
                }}
              >
                Test destination <IconExternalLink size={13} />
              </a>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: 'var(--color-bg-card)',
                padding: '8px 12px',
                borderRadius: '8px',
                border: '1px solid var(--color-border-subtle)',
              }}
            >
              <span style={{ flex: 1, fontFamily: 'var(--font-code)', fontSize: '14px', fontWeight: 600 }}>
                {fullShortUrl}
              </span>
              <button
                onClick={copyToClipboard}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 12px',
                  backgroundColor: copied ? '#10B981' : 'var(--color-primary)',
                  color: 'white',
                  borderRadius: '6px',
                  fontSize: '12px',
                  fontWeight: 600,
                  transition: 'all 0.2s',
                }}
              >
                {copied ? <IconCheck size={14} /> : <IconCopy size={14} />}
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', padding: '10px 0' }}>
            <CustomQR value={fullShortUrl} size={180} fgColor="#3B82F6" />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
            <button
              onClick={handleReset}
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                backgroundColor: 'var(--color-bg-hover)',
                color: 'var(--color-text-primary)',
                border: '1px solid var(--color-border-subtle)',
                fontSize: '13px',
              }}
            >
              Create Another
            </button>
            <button
              onClick={handleClose}
              style={{
                padding: '8px 20px',
                borderRadius: '8px',
                backgroundColor: 'var(--color-primary)',
                color: 'white',
                fontSize: '13px',
                fontWeight: 600,
              }}
            >
              Done
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {error && (
            <div
              style={{
                padding: '10px 14px',
                borderRadius: '8px',
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                color: '#EF4444',
                fontSize: '13px',
              }}
            >
              {error}
            </div>
          )}

          {/* Destination URL */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '13px', fontWeight: 500, color: 'var(--color-text-secondary)' }}>
              Destination URL <span style={{ color: '#EF4444' }}>*</span>
            </label>
            <input
              type="url"
              placeholder="https://example.com/long-landing-page-url"
              value={originalUrl}
              onChange={(e) => setOriginalUrl(e.target.value)}
              required
              style={{
                padding: '10px 14px',
                backgroundColor: 'var(--color-bg-elevated)',
                border: '1px solid var(--color-border-subtle)',
                borderRadius: '8px',
                color: 'var(--color-text-primary)',
                fontSize: '13.5px',
              }}
            />
          </div>

          {/* Domain and Custom Slug */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '13px', fontWeight: 500, color: 'var(--color-text-secondary)' }}>
                Domain
              </label>
              <select
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                style={{
                  padding: '10px 14px',
                  backgroundColor: 'var(--color-bg-elevated)',
                  border: '1px solid var(--color-border-subtle)',
                  borderRadius: '8px',
                  color: 'var(--color-text-primary)',
                  fontSize: '13.5px',
                }}
              >
                {domains.map((d) => (
                  <option key={d.id} value={d.domain}>
                    {d.domain} {d.isDefault ? '(Default)' : ''}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '13px', fontWeight: 500, color: 'var(--color-text-secondary)' }}>
                Custom Alias (optional)
              </label>
              <input
                type="text"
                placeholder="e.g. spring-sale"
                value={customSlug}
                onChange={(e) => setCustomSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-_]/g, ''))}
                style={{
                  padding: '10px 14px',
                  backgroundColor: 'var(--color-bg-elevated)',
                  border: '1px solid var(--color-border-subtle)',
                  borderRadius: '8px',
                  color: 'var(--color-text-primary)',
                  fontSize: '13.5px',
                }}
              />
            </div>
          </div>

          {/* Title & Folder */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '12px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '13px', fontWeight: 500, color: 'var(--color-text-secondary)' }}>
                Link Title (optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Product Campaign"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                style={{
                  padding: '10px 14px',
                  backgroundColor: 'var(--color-bg-elevated)',
                  border: '1px solid var(--color-border-subtle)',
                  borderRadius: '8px',
                  color: 'var(--color-text-primary)',
                  fontSize: '13.5px',
                }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '13px', fontWeight: 500, color: 'var(--color-text-secondary)' }}>
                Folder
              </label>
              <select
                value={folderId}
                onChange={(e) => setFolderId(e.target.value)}
                style={{
                  padding: '10px 14px',
                  backgroundColor: 'var(--color-bg-elevated)',
                  border: '1px solid var(--color-border-subtle)',
                  borderRadius: '8px',
                  color: 'var(--color-text-primary)',
                  fontSize: '13.5px',
                }}
              >
                <option value="">No folder</option>
                {folders.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Tags */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '13px', fontWeight: 500, color: 'var(--color-text-secondary)' }}>
              Tags (comma separated)
            </label>
            <input
              type="text"
              placeholder="e.g. marketing, 2026, launch"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              style={{
                padding: '10px 14px',
                backgroundColor: 'var(--color-bg-elevated)',
                border: '1px solid var(--color-border-subtle)',
                borderRadius: '8px',
                color: 'var(--color-text-primary)',
                fontSize: '13.5px',
              }}
            />
          </div>

          {/* Optional Protections (Accordion/Toggles) */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
              padding: '14px',
              borderRadius: '8px',
              backgroundColor: 'var(--color-bg-elevated)',
              border: '1px solid var(--color-border-subtle)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={hasExpiry}
                  onChange={(e) => setHasExpiry(e.target.checked)}
                />
                <IconCalendar size={15} color="var(--color-primary-light)" />
                <span>Set Expiration Date</span>
              </label>
              {hasExpiry && (
                <input
                  type="datetime-local"
                  value={expiresAt}
                  onChange={(e) => setExpiresAt(e.target.value)}
                  style={{
                    padding: '4px 8px',
                    borderRadius: '6px',
                    backgroundColor: 'var(--color-bg-card)',
                    border: '1px solid var(--color-border-subtle)',
                    color: 'var(--color-text-primary)',
                    fontSize: '12px',
                  }}
                />
              )}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={hasPassword}
                  onChange={(e) => setHasPassword(e.target.checked)}
                />
                <IconLock size={15} color="var(--color-secondary)" />
                <span>Password Protection</span>
              </label>
              {hasPassword && (
                <input
                  type="password"
                  placeholder="Secret access code"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{
                    padding: '4px 8px',
                    borderRadius: '6px',
                    backgroundColor: 'var(--color-bg-card)',
                    border: '1px solid var(--color-border-subtle)',
                    color: 'var(--color-text-primary)',
                    fontSize: '12px',
                  }}
                />
              )}
            </div>
          </div>

          {/* Live Preview Bar */}
          <div
            style={{
              fontSize: '12px',
              color: 'var(--color-text-muted)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <span>Result will be:</span>
            <span style={{ color: 'var(--color-primary-light)', fontWeight: 600, fontFamily: 'var(--font-code)' }}>
              {fullShortUrl}
            </span>
          </div>

          {/* Submit Buttons */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '8px' }}>
            <button
              type="button"
              onClick={handleClose}
              style={{
                padding: '10px 16px',
                borderRadius: '8px',
                backgroundColor: 'transparent',
                color: 'var(--color-text-secondary)',
                border: '1px solid var(--color-border-subtle)',
                fontSize: '13px',
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={{
                padding: '10px 24px',
                borderRadius: '8px',
                backgroundColor: 'var(--color-primary)',
                color: 'white',
                fontSize: '13.5px',
                fontWeight: 600,
                boxShadow: '0 2px 10px rgba(59, 130, 246, 0.3)',
              }}
            >
              Create Short Link
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
};

export default LinkShortenerModal;

