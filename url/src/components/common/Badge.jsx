import React from 'react';

export const Badge = ({
  variant = 'neutral',
  children,
  size = 'md',
  dot = false,
  className = '',
}) => {
  const getColors = () => {
    switch (variant) {
      case 'success':
        return {
          bg: 'var(--color-status-success-bg, rgba(0, 169, 25, 0.12))',
          color: 'var(--color-status-success)',
          border: 'rgba(0, 169, 25, 0.25)',
        };
      case 'warning':
        return {
          bg: 'var(--color-status-warning-bg, rgba(248, 106, 0, 0.12))',
          color: 'var(--color-status-warning)',
          border: 'rgba(248, 106, 0, 0.25)',
        };
      case 'error':
        return {
          bg: 'var(--color-status-error-bg, rgba(242, 0, 57, 0.12))',
          color: 'var(--color-status-error)',
          border: 'rgba(242, 0, 57, 0.25)',
        };
      case 'info':
        return {
          bg: 'var(--color-status-info-bg, rgba(0, 116, 228, 0.12))',
          color: 'var(--color-primary)',
          border: 'rgba(0, 116, 228, 0.25)',
        };
      case 'purple':
        return {
          bg: 'rgba(128, 90, 213, 0.12)',
          color: '#9F7AEA',
          border: 'rgba(128, 90, 213, 0.25)',
        };
      default:
        return {
          bg: 'var(--color-bg-elevated)',
          color: 'var(--color-text-secondary)',
          border: 'var(--color-border-subtle)',
        };
    }
  };

  const c = getColors();
  const padding = size === 'sm' ? '2px 7px' : '3px 9px';
  const fontSize = size === 'sm' ? '11px' : '11.5px';

  return (
    <span
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '5px',
        padding,
        fontSize,
        fontWeight: 500,
        borderRadius: 'var(--radius-full)',
        backgroundColor: c.bg,
        color: c.color,
        border: `1px solid ${c.border}`,
        lineHeight: 1.2,
      }}
    >
      {dot && (
        <span
          style={{
            width: '5px',
            height: '5px',
            borderRadius: '50%',
            backgroundColor: c.color,
          }}
        />
      )}
      {children}
    </span>
  );
};

export default Badge;
