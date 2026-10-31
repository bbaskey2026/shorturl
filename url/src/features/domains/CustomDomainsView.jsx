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
  IconExternalLink,
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: 700, color: 'var(--color-text-primary)' }}>
            Custom Branded Domains
          </h1>
          <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', marginTop: '2px' }}>
            Serve short links from your own root domain or subdomain (e.g. `links.brand.com/deal`).
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '9px 18px',
            backgroundColor: 'var(--color-primary)',
            color: 'white',
            borderRadius: '8px',
            fontSize: '13px',
            fontWeight: 600,
          }}
        >
          <IconPlus size={16} /> Add Custom Domain
        </button>
      </div>

      {/* Domain Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {domains.map((dom) => (
          <BentoCard key={dom.id}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '10px',
                    backgroundColor: 'var(--color-bg-elevated)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '1px solid var(--color-border-subtle)',
                  }}
                >
                  <IconGlobe size={20} color="var(--color-primary-light)" />
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '16px', fontWeight: 700, color: 'var(--color-text-primary)' }}>
                      {dom.domain}
                    </span>
                    {dom.isDefault && <Badge variant="info" size="sm">Default</Badge>}
                    {dom.isVerified ? (
                      <Badge variant="success" dot size="sm">Verified SSL Active</Badge>
                    ) : (
                      <Badge variant="warning" dot size="sm">DNS Pending</Badge>
                    )}
                  </div>
                  <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
                    Added on {new Date(dom.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                {!dom.isDefault && dom.isVerified && (
                  <button
                    onClick={() => onSetDefaultDomain?.(dom.id)}
                    style={{
                      padding: '6px 12px',
                      borderRadius: '6px',
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
                    padding: '6px',
                    borderRadius: '6px',
                    backgroundColor: 'transparent',
                    color: '#EF4444',
                    border: 'none',
                  }}
                  title="Remove domain"
                >
                  <IconTrash size={16} />
                </button>
              </div>
            </div>

            {/* DNS Instructions if not verified */}
            {!dom.isVerified && (
              <div
                style={{
                  marginTop: '16px',
                  padding: '14px',
                  borderRadius: '8px',
                  backgroundColor: 'var(--color-bg-elevated)',
                  border: '1px solid var(--color-border-subtle)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                }}
              >
                <span style={{ fontSize: '12.5px', fontWeight: 600, color: 'var(--color-text-primary)' }}>
                  Required DNS Records (at your DNS Registrar):
                </span>
                <div style={{ display: 'grid', gridTemplateColumns: '80px 100px 1fr 60px', gap: '8px', fontSize: '12px', alignItems: 'center' }}>
                  <span style={{ color: 'var(--color-text-muted)' }}>Type</span>
                  <span style={{ color: 'var(--color-text-muted)' }}>Name</span>
                  <span style={{ color: 'var(--color-text-muted)' }}>Value</span>
                  <span></span>

                  <span style={{ fontWeight: 600 }}>TXT</span>
                  <span>_shorturl</span>
                  <span style={{ fontFamily: 'var(--font-code)', color: 'var(--color-primary-light)' }}>
                    {dom.verificationToken}
                  </span>
                  <button
                    onClick={() => copyText(dom.verificationToken, dom.id)}
                    style={{ background: 'transparent', color: copiedToken === dom.id ? '#10B981' : 'var(--color-text-muted)' }}
                  >
                    {copiedToken === dom.id ? <IconCheck size={14} /> : <IconCopy size={14} />}
                  </button>
                </div>
              </div>
            )}
          </BentoCard>
        ))}
      </div>

      {/* Add Domain Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add Custom Domain">
        <form onSubmit={handleAdd} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '13px', fontWeight: 500, color: 'var(--color-text-secondary)' }}>
              Domain or Subdomain
            </label>
            <input
              type="text"
              placeholder="e.g. go.mycompany.com or brand.link"
              value={newDomain}
              onChange={(e) => setNewDomain(e.target.value)}
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

          <p style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
            After adding the domain, configure your DNS provider (Cloudflare, Route53, Namecheap) with the provided challenge token for automatic SSL provisioning.
          </p>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '8px' }}>
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              style={{
                padding: '8px 16px',
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
                padding: '8px 20px',
                borderRadius: '8px',
                backgroundColor: 'var(--color-primary)',
                color: 'white',
                fontSize: '13px',
                fontWeight: 600,
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

