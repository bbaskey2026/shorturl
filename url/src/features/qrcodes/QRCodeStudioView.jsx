import React, { useState } from 'react';
import BentoCard from '../../components/common/BentoCard';
import CustomQR from '../../components/common/CustomQR';
import { IconQrCode } from '../../components/common/Icons';

export const QRCodeStudioView = ({ links = [] }) => {
  const [selectedLinkId, setSelectedLinkId] = useState(links[0]?.id || '');
  const [customValue, setCustomValue] = useState('');
  const [qrSize, setQrSize] = useState(200);
  const [fgColor, setFgColor] = useState('#0074E4');
  const [bgColor, setBgColor] = useState('#252628');

  const selectedLink = links.find((l) => l.id === selectedLinkId);
  const activeUrl = selectedLink
    ? `https://${selectedLink.customDomain || 'short.io'}/${selectedLink.shortCode}`
    : customValue || 'https://short.io/demo';

  const colorPresets = [
    { label: 'Muse Blue', fg: '#0074E4', bg: '#252628' },
    { label: 'Muse Dark', fg: '#FFFFFF', bg: '#17171A' },
    { label: 'Muse Light', fg: '#111112', bg: '#FFFFFF' },
    { label: 'Muse Green', fg: '#00A919', bg: '#1F1F20' },
    { label: 'Muse Amber', fg: '#F86A00', bg: '#252628' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div>
        <h1 style={{ fontSize: '20px', fontWeight: 600, letterSpacing: '-0.02em', color: 'var(--color-text-primary)' }}>
          QR Code Studio
        </h1>
        <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', marginTop: '2px' }}>
          Generate and download scalable vector SVG and raster PNG QR codes.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '20px' }}>
        {/* Controls Card */}
        <BentoCard title="Design Parameters" icon={<IconQrCode size={17} color="var(--color-primary)" />}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Select Link */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <label style={{ fontSize: '12.5px', fontWeight: 500, color: 'var(--color-text-secondary)' }}>
                Target Shortened Link
              </label>
              <select
                value={selectedLinkId}
                onChange={(e) => {
                  setSelectedLinkId(e.target.value);
                  setCustomValue('');
                }}
                style={{
                  padding: '9px 12px',
                  backgroundColor: 'var(--color-bg-elevated)',
                  border: '1px solid var(--color-border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  color: 'var(--color-text-primary)',
                  fontSize: '13px',
                }}
              >
                <option value="">Custom Destination URL...</option>
                {links.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.title || l.shortCode} (https://{l.customDomain || 'short.io'}/{l.shortCode})
                  </option>
                ))}
              </select>
            </div>

            {/* Custom URL Input if no link selected */}
            {!selectedLinkId && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                <label style={{ fontSize: '12.5px', fontWeight: 500, color: 'var(--color-text-secondary)' }}>
                  Custom Destination URL
                </label>
                <input
                  type="url"
                  placeholder="https://mywebsite.com"
                  value={customValue}
                  onChange={(e) => setCustomValue(e.target.value)}
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
            )}

            {/* Size Slider */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px' }}>
                <span style={{ color: 'var(--color-text-secondary)' }}>Dimension Size</span>
                <span style={{ fontWeight: 600 }}>{qrSize} x {qrSize} px</span>
              </div>
              <input
                type="range"
                min="160"
                max="280"
                step="20"
                value={qrSize}
                onChange={(e) => setQrSize(Number(e.target.value))}
                style={{ accentColor: 'var(--color-primary)' }}
              />
            </div>

            {/* Color Presets */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <span style={{ fontSize: '12.5px', fontWeight: 500, color: 'var(--color-text-secondary)' }}>
                Theme Palettes
              </span>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(90px, 1fr))', gap: '6px' }}>
                {colorPresets.map((p, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setFgColor(p.fg);
                      setBgColor(p.bg);
                    }}
                    style={{
                      padding: '7px',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: 'var(--color-bg-elevated)',
                      border: fgColor === p.fg ? '1px solid var(--color-primary)' : '1px solid var(--color-border-subtle)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      fontSize: '11px',
                      color: 'var(--color-text-primary)',
                    }}
                  >
                    <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: p.fg }} />
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {p.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Manual Color Pickers */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input
                  type="color"
                  value={fgColor}
                  onChange={(e) => setFgColor(e.target.value)}
                  style={{ width: '32px', height: '32px', border: 'none', borderRadius: 'var(--radius-sm)', cursor: 'pointer' }}
                />
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>Foreground</span>
                  <span style={{ fontSize: '11.5px', fontFamily: 'var(--font-code)' }}>{fgColor}</span>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input
                  type="color"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  style={{ width: '32px', height: '32px', border: 'none', borderRadius: 'var(--radius-sm)', cursor: 'pointer' }}
                />
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>Background</span>
                  <span style={{ fontSize: '11.5px', fontFamily: 'var(--font-code)' }}>{bgColor}</span>
                </div>
              </div>
            </div>
          </div>
        </BentoCard>

        {/* Live Preview Card */}
        <BentoCard title="Live QR Render" subtitle={activeUrl}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', minHeight: '280px', gap: '16px' }}>
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
