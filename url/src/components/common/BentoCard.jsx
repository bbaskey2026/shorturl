import React from 'react';
import styles from './BentoCard.module.css';

export const BentoCard = ({
  title,
  subtitle,
  icon,
  action,
  children,
  className = '',
  style = {},
  withAccent = false,
}) => {
  return (
    <div className={`${styles.card} ${className}`} style={style}>
      {withAccent && <div className={styles.accentBorder} />}
      {(title || action || icon) && (
        <div className={styles.header}>
          <div className={styles.titleGroup}>
            {title && (
              <h3 className={styles.title}>
                {icon}
                {title}
              </h3>
            )}
            {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
          </div>
          {action && <div className={styles.action}>{action}</div>}
        </div>
      )}
      <div className={styles.content}>{children}</div>
    </div>
  );
};

export default BentoCard;

