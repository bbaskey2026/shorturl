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
          bg: 'rgba(16, 185, 129, 0.12)',
          color: '#10B981',
          border: 'rgba(16, 185, 129, 0.25)',
        };
      case 'warning':
        return {
          bg: 'rgba(245, 158, 11, 0.12)',
          color: '#F59E0B',
          border: 'rgba(245, 158, 11, 0.25)',
        };
      case 'error':
        return {
          bg: 'rgba(239, 68, 68, 0.12)',
          color: '#EF4444',
          border: 'rgba(239, 68, 68, 0.25)',
        };
      case 'info':
        return {
          bg: 'rgba(59, 130, 246, 0.12)',
          color: '#3B82F6',
          border: 'rgba(59, 130, 246, 0.25)',
        };
      case 'purple':
        return {
          bg: 'rgba(139, 92, 246, 0.12)',
          color: '#8B5CF6',
          border: 'rgba(139, 92, 246, 0.25)',
        };
      default:
        return {
          bg: 'var(--color-bg-hover)',
          color: 'var(--color-text-secondary)',
          border: 'var(--color-border-subtle)',
        };
    }
  };

  const c = getColors();
  const padding = size === 'sm' ? '2px 8px' : '4px 10px';
  const fontSize = size === 'sm' ? '11px' : '12px';

  return (
    <span
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
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
            width: '6px',
            height: '6px',
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

