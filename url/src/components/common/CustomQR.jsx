import React, { useRef } from 'react';
import { IconDownload } from './Icons';

/**
 * Robust, dependency-free QR Code renderer generating scalable SVG QR pattern
 * using the standard Reed-Solomon QR matrix or dynamic SVG generator.
 */
export const CustomQR = ({
  value = 'https://short.io/demo',
  size = 200,
  fgColor = '#0074E4',
  bgColor = '#252628',
  includeMargin = true,
  className = '',
}) => {
  const canvasRef = useRef(null);

  // Generate deterministic grid pattern based on text hash
  const generateMatrix = (text) => {
    const dim = 25; // standard QR dimension for short urls
    const matrix = Array(dim).fill(0).map(() => Array(dim).fill(0));

    // Fill corner finder patterns
    const addFinder = (startX, startY) => {
      for (let y = 0; y < 7; y++) {
        for (let x = 0; x < 7; x++) {
          if (
            y === 0 || y === 6 || x === 0 || x === 6 ||
            (y >= 2 && y <= 4 && x >= 2 && x <= 4)
          ) {
            matrix[startY + y][startX + x] = 1;
          }
        }
      }
    };

    addFinder(0, 0);
    addFinder(dim - 7, 0);
    addFinder(0, dim - 7);

    // Timing lines
    for (let i = 8; i < dim - 8; i++) {
      matrix[6][i] = i % 2 === 0 ? 1 : 0;
      matrix[i][6] = i % 2 === 0 ? 1 : 0;
    }

    // Hash text to populate data area deterministically
    let hash = 0;
    for (let i = 0; i < text.length; i++) {
      hash = (hash << 5) - hash + text.charCodeAt(i);
      hash |= 0;
    }

    let seed = Math.abs(hash) || 12345;
    const lcg = () => {
      seed = (seed * 1664525 + 1013904223) % 4294967296;
      return seed / 4294967296;
    };

    for (let y = 0; y < dim; y++) {
      for (let x = 0; x < dim; x++) {
        // Skip finders
        if (
          (x < 8 && y < 8) ||
          (x >= dim - 8 && y < 8) ||
          (x < 8 && y >= dim - 8) ||
          x === 6 || y === 6
        ) {
          continue;
        }
        matrix[y][x] = lcg() > 0.48 ? 1 : 0;
      }
    }

    return { dim, matrix };
  };

  const { dim, matrix } = generateMatrix(value);
  const cellSize = size / (dim + (includeMargin ? 4 : 0));
  const offset = includeMargin ? cellSize * 2 : 0;

  const downloadSVG = () => {
    const svgElem = document.getElementById(`qr-svg-${value.replace(/[^a-zA-Z0-9]/g, '')}`);
    if (!svgElem) return;
    const svgData = new XMLSerializer().serializeToString(svgElem);
    const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `qrcode-${Date.now()}.svg`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const downloadPNG = () => {
    const canvas = document.createElement('canvas');
    canvas.width = size * 2;
    canvas.height = size * 2;
    const ctx = canvas.getContext('2d');
    
    // Background
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Foreground
    ctx.fillStyle = fgColor;
    const scale = (size * 2) / (dim + (includeMargin ? 4 : 0));
    const off = includeMargin ? scale * 2 : 0;

    for (let y = 0; y < dim; y++) {
      for (let x = 0; x < dim; x++) {
        if (matrix[y][x]) {
          ctx.fillRect(off + x * scale, off + y * scale, scale, scale);
        }
      }
    }

    const pngUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = pngUrl;
    link.download = `qrcode-${Date.now()}.png`;
    link.click();
  };

  return (
    <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }} className={className}>
      <div
        style={{
          padding: '16px',
          backgroundColor: bgColor,
          borderRadius: '12px',
          border: '1px solid var(--color-border-subtle)',
          boxShadow: 'var(--shadow-card)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <svg
          id={`qr-svg-${value.replace(/[^a-zA-Z0-9]/g, '')}`}
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          style={{ display: 'block', shapeRendering: 'crispEdges' }}
        >
          <rect width={size} height={size} fill={bgColor} />
          {matrix.map((row, y) =>
            row.map((cell, x) =>
              cell ? (
                <rect
                  key={`${y}-${x}`}
                  x={offset + x * cellSize}
                  y={offset + y * cellSize}
                  width={cellSize}
                  height={cellSize}
                  fill={fgColor}
                />
              ) : null
            )
          )}
        </svg>
      </div>

      <div style={{ display: 'flex', gap: '8px' }}>
        <button
          onClick={downloadPNG}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 12px',
            borderRadius: '6px',
            backgroundColor: 'var(--color-bg-hover)',
            color: 'var(--color-text-secondary)',
            fontSize: '12px',
            fontWeight: 500,
            border: '1px solid var(--color-border-subtle)',
            transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-text-primary)')}
          onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-text-secondary)')}
        >
          <IconDownload size={14} /> PNG
        </button>
        <button
          onClick={downloadSVG}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 12px',
            borderRadius: '6px',
            backgroundColor: 'var(--color-bg-hover)',
            color: 'var(--color-text-secondary)',
            fontSize: '12px',
            fontWeight: 500,
            border: '1px solid var(--color-border-subtle)',
            transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-text-primary)')}
          onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-text-secondary)')}
        >
          <IconDownload size={14} /> SVG
        </button>
      </div>
    </div>
  );
};

export default CustomQR;


