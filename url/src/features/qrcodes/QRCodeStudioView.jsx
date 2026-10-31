import React, { useState } from 'react';
import BentoCard from '../../components/common/BentoCard';
import CustomQR from '../../components/common/CustomQR';
import { IconQrCode, IconDownload, IconGlobe, IconLink } from '../../components/common/Icons';

export const QRCodeStudioView = ({ links = [] }) => {
  const [selectedLinkId, setSelectedLinkId] = useState(links[0]?.id || '');
  const [customValue, setCustomValue] = useState('');
  const [qrSize, setQrSize] = useState(220);
  const [fgColor, setFgColor] = useState('#3B82F6');
  const [bgColor, setBgColor] = useState('#151824');

  const selectedLink = links.find((l) => l.id === selectedLinkId);
  const activeUrl = selectedLink
    ? `https://${selectedLink.customDomain || 'short.io'}/${selectedLink.shortCode}`
    : customValue || 'https://short.io/demo';

  const colorPresets = [
    { label: 'Electric Blue', fg: '#3B82F6', bg: '#151824' },
    { label: 'Cyan Glow', fg: '#06B6D4', bg: '#0F172A' },
    { label: 'Emerald Mint', fg: '#10B981', bg: '#064E3B' },
    { label: 'Monochrome Dark', fg: '#F9FAFB', bg: '#08090D' },
    { label: 'Monochrome Light', fg: '#0F172A', bg: '#FFFFFF' },
    { label: 'Royal Purple', fg: '#8B5CF6', bg: '#1E1B4B' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h1 style={{ fontSize: '22px', fontWeight: 700, color: 'var(--color-text-primary)' }}>
          QR Code Design Studio
        </h1>
        <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', marginTop: '2px' }}>
          Generate, style, and download crisp vector SVG and raster PNG QR codes for marketing materials and print.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '24px' }}>
        {/* Controls Card */}
        <BentoCard title="Design Parameters" icon={<IconQrCode size={18} color="var(--color-primary-light)" />}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Select Link */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '13px', fontWeight: 500, color: 'var(--color-text-secondary)' }}>
                Target Shortened Link
              </label>
              <select
                value={selectedLinkId}
                onChange={(e) => {
                  setSelectedLinkId(e.target.value);
                  setCustomValue('');
                }}
                style={{
                  padding: '10px 14px',
                  backgroundColor: 'var(--color-bg-elevated)',
                  border: '1px solid var(--color-border-subtle)',
                  borderRadius: '8px',
                  color: 'var(--color-text-primary)',
                  fontSize: '13.5px',
                }}
              >
                <option value="">Custom URL...</option>
                {links.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.title || l.shortCode} (https://{l.customDomain || 'short.io'}/{l.shortCode})
                  </option>
                ))}
              </select>
            </div>

            {/* Custom URL Input if no link selected */}
            {!selectedLinkId && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '13px', fontWeight: 500, color: 'var(--color-text-secondary)' }}>
                  Custom Destination URL
                </label>
                <input
                  type="url"
                  placeholder="https://mywebsite.com"
                  value={customValue}
                  onChange={(e) => setCustomValue(e.target.value)}
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
            )}

            {/* Size Slider */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                <span style={{ color: 'var(--color-text-secondary)' }}>Dimension Size</span>
                <span style={{ fontWeight: 600 }}>{qrSize} x {qrSize} px</span>
              </div>
              <input
                type="range"
                min="160"
                max="320"
                step="20"
                value={qrSize}
                onChange={(e) => setQrSize(Number(e.target.value))}
              />
            </div>

            {/* Color Presets */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <span style={{ fontSize: '13px', fontWeight: 500, color: 'var(--color-text-secondary)' }}>
                Color Palettes
              </span>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: '8px' }}>
                {colorPresets.map((p, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setFgColor(p.fg);
                      setBgColor(p.bg);
                    }}
                    style={{
                      padding: '8px',
                      borderRadius: '8px',
                      backgroundColor: 'var(--color-bg-elevated)',
                      border: fgColor === p.fg ? '1px solid var(--color-primary)' : '1px solid var(--color-border-subtle)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      fontSize: '11.5px',
                      color: 'var(--color-text-primary)',
                    }}
                  >
                    <span style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: p.fg }} />
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {p.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Manual Color Pickers */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input
                  type="color"
                  value={fgColor}
                  onChange={(e) => setFgColor(e.target.value)}
                  style={{ width: '36px', height: '36px', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
                />
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>Foreground</span>
                  <span style={{ fontSize: '12px', fontFamily: 'var(--font-code)' }}>{fgColor}</span>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input
                  type="color"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  style={{ width: '36px', height: '36px', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
                />
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>Background</span>
                  <span style={{ fontSize: '12px', fontFamily: 'var(--font-code)' }}>{bgColor}</span>
                </div>
              </div>
            </div>
          </div>
        </BentoCard>

        {/* Live Preview Card */}
        <BentoCard title="Live QR Render" subtitle={activeUrl}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', minHeight: '320px', gap: '20px' }}>
            <CustomQR
              value={activeUrl}
              size={qrSize}
              fgColor={fgColor}
              bgColor={bgColor}
            />
          </div>
        </BentoCard>
      </div>
    </div>
  );
};

export default QRCodeStudioView;

