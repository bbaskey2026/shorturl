import React, { useState } from 'react';
import BentoCard from '../../components/common/BentoCard';
import Modal from '../../components/common/Modal';
import {
  IconFolder,
  IconPlus,
  IconTrash,
  IconTag,
} from '../../components/common/Icons';

export const FoldersView = ({ folders = [], links = [], onCreateFolder, onDeleteFolder }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [folderName, setFolderName] = useState('');
  const [folderColor, setFolderColor] = useState('#0074E4');

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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <h1 style={{ fontSize: '20px', fontWeight: 600, letterSpacing: '-0.02em', color: 'var(--color-text-primary)' }}>
            Folders & Tags
          </h1>
          <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', marginTop: '2px' }}>
            Group shortened campaigns, marketing projects, and tags into organized spaces.
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
          <IconPlus size={15} /> New Folder
        </button>
      </div>

      {/* Folders Bento Grid */}
      <div>
        <h2 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '12px', color: 'var(--color-text-primary)' }}>
          Folders ({folders.length})
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
          {folders.map((f) => {
            const count = links.filter((l) => l.folderId === f.id).length;
            return (
              <BentoCard key={f.id}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: 'var(--radius-md)',
                        backgroundColor: 'var(--color-bg-elevated)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: f.color || 'var(--color-primary)',
                      }}
                    >
                      <IconFolder size={17} />
                    </div>
                    <div>
                      <h4 style={{ fontSize: '13.5px', fontWeight: 600, color: 'var(--color-text-primary)' }}>
                        {f.name}
                      </h4>
                      <span style={{ fontSize: '11.5px', color: 'var(--color-text-muted)' }}>
                        {count} links
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => onDeleteFolder?.(f.id)}
                    style={{ background: 'transparent', color: 'var(--color-status-error)', padding: '4px', border: 'none' }}
                    title="Delete folder"
                  >
                    <IconTrash size={14} />
                  </button>
                </div>
              </BentoCard>
            );
          })}
        </div>
      </div>

      {/* Tags Cloud */}
      <BentoCard title="Tags Taxonomy" subtitle="Discovered tags across your active short links" icon={<IconTag size={17} color="var(--color-primary)" />}>
        {allTags.length === 0 ? (
          <p style={{ color: 'var(--color-text-muted)', fontSize: '12.5px' }}>
            No tags assigned yet. Add tags when creating or editing links.
          </p>
        ) : (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {allTags.map((tag, idx) => {
              const taggedCount = links.filter((l) => l.tags && l.tags.includes(tag)).length;
              return (
                <div
                  key={idx}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '5px',
                    padding: '5px 10px',
                    backgroundColor: 'var(--color-bg-elevated)',
                    border: '1px solid var(--color-border-subtle)',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '12px',
                    color: 'var(--color-text-primary)',
                  }}
                >
                  <IconTag size={12} color="var(--color-primary)" />
                  <span>#{tag}</span>
                  <span style={{ fontSize: '10.5px', color: 'var(--color-text-muted)', fontWeight: 600 }}>
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
        <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            <label style={{ fontSize: '12.5px', fontWeight: 500, color: 'var(--color-text-secondary)' }}>
              Folder Name
            </label>
            <input
              type="text"
              placeholder="e.g. Q4 Growth Campaigns"
              value={folderName}
              onChange={(e) => setFolderName(e.target.value)}
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

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <label style={{ fontSize: '12.5px', fontWeight: 500, color: 'var(--color-text-secondary)' }}>
              Color Accent:
            </label>
            <input
              type="color"
              value={folderColor}
              onChange={(e) => setFolderColor(e.target.value)}
              style={{ width: '32px', height: '32px', border: 'none', borderRadius: 'var(--radius-sm)', cursor: 'pointer' }}
            />
          </div>

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
              Create Folder
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default FoldersView;
