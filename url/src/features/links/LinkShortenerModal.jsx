import React, { useState } from 'react';
import Modal from '../../components/common/Modal';
import { CustomQR } from '../../components/common/CustomQR';
import {
  IconCopy,
  IconCheck,
  IconCalendar,
  IconLock,
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
      title={createdResult ? 'Link Created Successfully' : 'Create Short Link'}
    >
      {createdResult ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div
            style={{
              padding: '14px',
              backgroundColor: 'var(--color-bg-elevated)',
              border: '1px solid var(--color-border-subtle)',
              borderRadius: 'var(--radius-lg)',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-status-success)', letterSpacing: '0.04em' }}>
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
                  fontSize: '11.5px',
                  color: 'var(--color-primary)',
                }}
              >
                Test destination <IconExternalLink size={12} />
              </a>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: 'var(--color-bg-paper)',
                padding: '8px 12px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--color-border-subtle)',
              }}
            >
              <span style={{ flex: 1, fontFamily: 'var(--font-code)', fontSize: '13.5px', fontWeight: 600, color: 'var(--color-text-primary)' }}>
                {fullShortUrl}
              </span>
              <button
                onClick={copyToClipboard}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                  padding: '5px 12px',
                  backgroundColor: copied ? 'var(--color-status-success)' : 'var(--color-primary)',
                  color: '#FFFFFF',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '12px',
                  fontWeight: 500,
                  transition: 'background-color var(--transition-fast)',
                }}
              >
                {copied ? <IconCheck size={13} /> : <IconCopy size={13} />}
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', padding: '6px 0' }}>
            <CustomQR value={fullShortUrl} size={180} fgColor="var(--color-primary)" bgColor="var(--color-bg-paper)" />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
            <button
              onClick={handleReset}
              style={{
                padding: '8px 14px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'transparent',
                color: 'var(--color-text-secondary)',
                border: '1px solid var(--color-border-subtle)',
                fontSize: '12.5px',
              }}
            >
              Create Another
            </button>
            <button
              onClick={handleClose}
              style={{
                padding: '8px 18px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--color-primary)',
                color: '#FFFFFF',
                fontSize: '12.5px',
                fontWeight: 500,
              }}
            >
              Done
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {error && (
            <div
              style={{
                padding: '9px 12px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'rgba(242, 0, 57, 0.1)',
                border: '1px solid rgba(242, 0, 57, 0.25)',
                color: 'var(--color-status-error)',
                fontSize: '12.5px',
              }}
            >
              {error}
            </div>
          )}

          {/* Destination URL */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            <label style={{ fontSize: '12.5px', fontWeight: 500, color: 'var(--color-text-secondary)' }}>
              Destination URL <span style={{ color: 'var(--color-status-error)' }}>*</span>
            </label>
            <input
              type="url"
              placeholder="https://example.com/long-landing-page-url"
              value={originalUrl}
              onChange={(e) => setOriginalUrl(e.target.value)}
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

          {/* Domain and Custom Slug */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <label style={{ fontSize: '12.5px', fontWeight: 500, color: 'var(--color-text-secondary)' }}>
                Domain
              </label>
              <select
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                style={{
                  padding: '9px 12px',
                  backgroundColor: 'var(--color-bg-elevated)',
                  border: '1px solid var(--color-border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  color: 'var(--color-text-primary)',
                  fontSize: '13px',
                }}
              >
                {domains.map((d) => (
                  <option key={d.id} value={d.domain}>
                    {d.domain} {d.isDefault ? '(Default)' : ''}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <label style={{ fontSize: '12.5px', fontWeight: 500, color: 'var(--color-text-secondary)' }}>
                Custom Alias (optional)
              </label>
              <input
                type="text"
                placeholder="e.g. spring-sale"
                value={customSlug}
                onChange={(e) => setCustomSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-_]/g, ''))}
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
          </div>

          {/* Title & Folder */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '10px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <label style={{ fontSize: '12.5px', fontWeight: 500, color: 'var(--color-text-secondary)' }}>
                Link Title (optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Product Campaign"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
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
                value={folderId}
                onChange={(e) => setFolderId(e.target.value)}
                style={{
                  padding: '9px 12px',
                  backgroundColor: 'var(--color-bg-elevated)',
                  border: '1px solid var(--color-border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  color: 'var(--color-text-primary)',
                  fontSize: '13px',
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
          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            <label style={{ fontSize: '12.5px', fontWeight: 500, color: 'var(--color-text-secondary)' }}>
              Tags (comma separated)
            </label>
            <input
              type="text"
              placeholder="e.g. marketing, launch"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
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

          {/* Optional Protections */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              padding: '12px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--color-bg-elevated)',
              border: '1px solid var(--color-border-subtle)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12.5px', cursor: 'pointer', color: 'var(--color-text-secondary)' }}>
                <input
                  type="checkbox"
                  checked={hasExpiry}
                  onChange={(e) => setHasExpiry(e.target.checked)}
                />
                <IconCalendar size={14} color="var(--color-primary)" />
                <span>Set Expiration Date</span>
              </label>
              {hasExpiry && (
                <input
                  type="datetime-local"
                  value={expiresAt}
                  onChange={(e) => setExpiresAt(e.target.value)}
                  style={{
                    padding: '3px 8px',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: 'var(--color-bg-paper)',
                    border: '1px solid var(--color-border-subtle)',
                    color: 'var(--color-text-primary)',
                    fontSize: '12px',
                  }}
                />
              )}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12.5px', cursor: 'pointer', color: 'var(--color-text-secondary)' }}>
                <input
                  type="checkbox"
                  checked={hasPassword}
                  onChange={(e) => setHasPassword(e.target.checked)}
                />
                <IconLock size={14} color="var(--color-text-muted)" />
                <span>Password Protection</span>
              </label>
              {hasPassword && (
                <input
                  type="password"
                  placeholder="Secret access code"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{
                    padding: '3px 8px',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: 'var(--color-bg-paper)',
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
            <span>Result:</span>
            <span style={{ color: 'var(--color-primary)', fontWeight: 500, fontFamily: 'var(--font-code)' }}>
              {fullShortUrl}
            </span>
          </div>

          {/* Submit Buttons */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '6px' }}>
            <button
              type="button"
              onClick={handleClose}
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
                padding: '8px 20px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--color-primary)',
                color: '#FFFFFF',
                fontSize: '12.5px',
                fontWeight: 500,
                border: 'none',
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
