import React, { useState } from 'react';
import BentoCard from '../../components/common/BentoCard';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import {
  IconGlobe,
  IconPlus,
  IconCheck,
  IconCopy,
  IconTrash,
} from '../../components/common/Icons';

export const CustomDomainsView = ({ domains = [], onAddDomain, onDeleteDomain, onSetDefaultDomain }) => {
  const [newDomain, setNewDomain] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [copiedToken, setCopiedToken] = useState(null);

  const handleAdd = (e) => {
    e.preventDefault();
    if (!newDomain.trim()) return;

    const cleanDomain = newDomain.trim().toLowerCase().replace(/^https?:\/\//, '').split('/')[0];
    const created = {
      id: `dom-${Date.now()}`,
      domain: cleanDomain,
      isVerified: false,
      isDefault: false,
      verificationToken: `v=verify-${cleanDomain.replace(/[^a-z0-9]/g, '-')}-${Math.random().toString(36).substring(2, 8)}`,
      dnsConfig: {
        type: 'CNAME',
        name: '@',
        value: 'cname.shorturl.io',
        status: 'Pending Verification',
      },
      createdAt: new Date().toISOString(),
    };

    onAddDomain?.(created);
    setNewDomain('');
    setIsModalOpen(false);
  };

  const copyText = (token, id) => {
    navigator.clipboard.writeText(token);
    setCopiedToken(id);
    setTimeout(() => setCopiedToken(null), 2000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <h1 style={{ fontSize: '20px', fontWeight: 600, letterSpacing: '-0.02em', color: 'var(--color-text-primary)' }}>
            Custom Branded Domains
          </h1>
          <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', marginTop: '2px' }}>
            Serve short links from your own apex domain or subdomains.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
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
          }}
        >
          <IconPlus size={15} /> Add Custom Domain
        </button>
      </div>

      {/* Domain Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {domains.map((dom) => (
          <BentoCard key={dom.id}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--color-bg-elevated)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '1px solid var(--color-border-subtle)',
                    color: 'var(--color-primary)',
                  }}
                >
                  <IconGlobe size={18} />
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '15px', fontWeight: 600, color: 'var(--color-text-primary)' }}>
                      {dom.domain}
                    </span>
                    {dom.isDefault && <Badge variant="info" size="sm">Default</Badge>}
                    {dom.isVerified ? (
                      <Badge variant="success" dot size="sm">Verified SSL</Badge>
                    ) : (
                      <Badge variant="warning" dot size="sm">DNS Pending</Badge>
                    )}
                  </div>
                  <span style={{ fontSize: '11.5px', color: 'var(--color-text-muted)' }}>
                    Added on {new Date(dom.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {!dom.isDefault && dom.isVerified && (
                  <button
                    onClick={() => onSetDefaultDomain?.(dom.id)}
                    style={{
                      padding: '5px 12px',
                      borderRadius: 'var(--radius-sm)',
                      backgroundColor: 'var(--color-bg-elevated)',
                      color: 'var(--color-text-secondary)',
                      fontSize: '12px',
                      border: '1px solid var(--color-border-subtle)',
                    }}
                  >
                    Set as Default
                  </button>
                )}

                <button
                  onClick={() => onDeleteDomain?.(dom.id)}
                  style={{
                    padding: '5px',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: 'transparent',
                    color: 'var(--color-status-error)',
                    border: 'none',
                  }}
                  title="Remove domain"
                >
                  <IconTrash size={15} />
                </button>
              </div>
            </div>

            {/* DNS Instructions if not verified */}
            {!dom.isVerified && (
              <div
                style={{
                  marginTop: '14px',
                  padding: '12px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--color-bg-elevated)',
                  border: '1px solid var(--color-border-subtle)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                }}
              >
                <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-text-primary)' }}>
                  Required DNS Record:
                </span>
                <div style={{ display: 'grid', gridTemplateColumns: '70px 90px 1fr 50px', gap: '8px', fontSize: '12px', alignItems: 'center' }}>
                  <span style={{ color: 'var(--color-text-muted)' }}>Type</span>
                  <span style={{ color: 'var(--color-text-muted)' }}>Name</span>
                  <span style={{ color: 'var(--color-text-muted)' }}>Value</span>
                  <span></span>

                  <span style={{ fontWeight: 600 }}>TXT</span>
                  <span>_shorturl</span>
                  <span style={{ fontFamily: 'var(--font-code)', color: 'var(--color-primary)' }}>
                    {dom.verificationToken}
                  </span>
                  <button
                    onClick={() => copyText(dom.verificationToken, dom.id)}
                    style={{ background: 'transparent', color: copiedToken === dom.id ? 'var(--color-status-success)' : 'var(--color-text-muted)' }}
                  >
                    {copiedToken === dom.id ? <IconCheck size={13} /> : <IconCopy size={13} />}
                  </button>
                </div>
              </div>
            )}
          </BentoCard>
        ))}
      </div>

      {/* Add Domain Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add Custom Domain">
        <form onSubmit={handleAdd} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            <label style={{ fontSize: '12.5px', fontWeight: 500, color: 'var(--color-text-secondary)' }}>
              Domain or Subdomain
            </label>
            <input
              type="text"
              placeholder="e.g. go.mycompany.com or brand.link"
              value={newDomain}
              onChange={(e) => setNewDomain(e.target.value)}
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

          <p style={{ fontSize: '11.5px', color: 'var(--color-text-muted)' }}>
            After adding the domain, configure your DNS provider (Cloudflare, Route53, Namecheap) with the provided verification record.
          </p>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '6px' }}>
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
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
              Add Domain
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default CustomDomainsView;
