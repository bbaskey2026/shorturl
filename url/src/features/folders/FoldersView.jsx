import React, { useState } from 'react';
import BentoCard from '../../components/common/BentoCard';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import {
  IconFolder,
  IconPlus,
  IconTrash,
  IconTag,
  IconLink,
  IconEdit,
} from '../../components/common/Icons';

export const FoldersView = ({ folders = [], links = [], onCreateFolder, onDeleteFolder, onSelectFolder }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [folderName, setFolderName] = useState('');
  const [folderColor, setFolderColor] = useState('#3B82F6');

  // Compute all unique tags from links
  const allTags = Array.from(
    new Set(links.flatMap((l) => l.tags || []))
  );

  const handleCreate = (e) => {
    e.preventDefault();
    if (!folderName.trim()) return;

    onCreateFolder?.({
      id: `folder-${Date.now()}`,
      name: folderName.trim(),
      color: folderColor,
      linkCount: 0,
    });

    setFolderName('');
    setIsModalOpen(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: 700, color: 'var(--color-text-primary)' }}>
            Folders & Tags Organization
          </h1>
          <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', marginTop: '2px' }}>
            Group shortened campaigns, projects, and marketing assets into isolated collections.
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
          <IconPlus size={16} /> New Folder
        </button>
      </div>

      {/* Folders Bento Grid */}
      <div>
        <h2 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '14px', color: 'var(--color-text-primary)' }}>
          Folders ({folders.length})
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
          {folders.map((f) => {
            const count = links.filter((l) => l.folderId === f.id).length;
            return (
              <BentoCard key={f.id}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '8px',
                        backgroundColor: 'var(--color-bg-elevated)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: f.color || 'var(--color-primary)',
                      }}
                    >
                      <IconFolder size={20} />
                    </div>
                    <div>
                      <h4 style={{ fontSize: '14.5px', fontWeight: 600, color: 'var(--color-text-primary)' }}>
                        {f.name}
                      </h4>
                      <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
                        {count} links inside
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => onDeleteFolder?.(f.id)}
                    style={{ background: 'transparent', color: '#EF4444', padding: '4px' }}
                    title="Delete folder"
                  >
                    <IconTrash size={15} />
                  </button>
                </div>
              </BentoCard>
            );
          })}
        </div>
      </div>

      {/* Tags Cloud */}
      <BentoCard title="Tags Taxonomy" subtitle="Discovered tags across your active short links" icon={<IconTag size={18} color="#8B5CF6" />}>
        {allTags.length === 0 ? (
          <p style={{ color: 'var(--color-text-muted)', fontSize: '13px' }}>
            No tags assigned yet. Add comma-separated tags when creating or editing links.
          </p>
        ) : (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {allTags.map((tag, idx) => {
              const taggedCount = links.filter((l) => l.tags && l.tags.includes(tag)).length;
              return (
                <div
                  key={idx}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '6px 12px',
                    backgroundColor: 'var(--color-bg-elevated)',
                    border: '1px solid var(--color-border-subtle)',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '13px',
                    color: 'var(--color-text-primary)',
                  }}
                >
                  <IconTag size={13} color="var(--color-primary-light)" />
                  <span>#{tag}</span>
                  <span style={{ fontSize: '11px', color: 'var(--color-text-muted)', fontWeight: 600 }}>
                    ({taggedCount})
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </BentoCard>

      {/* Create Folder Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create New Folder">
        <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '13px', fontWeight: 500, color: 'var(--color-text-secondary)' }}>
              Folder Name
            </label>
            <input
              type="text"
              placeholder="e.g. Q4 Growth Campaigns"
              value={folderName}
              onChange={(e) => setFolderName(e.target.value)}
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

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <label style={{ fontSize: '13px', fontWeight: 500, color: 'var(--color-text-secondary)' }}>
              Accent Color:
            </label>
            <input
              type="color"
              value={folderColor}
              onChange={(e) => setFolderColor(e.target.value)}
              style={{ width: '36px', height: '36px', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
            />
          </div>

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
              Create Folder
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default FoldersView;

