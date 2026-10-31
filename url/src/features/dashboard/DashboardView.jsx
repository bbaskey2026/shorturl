import React, { useState } from 'react';
import BentoCard from '../../components/common/BentoCard';
import Badge from '../../components/common/Badge';
import {
  IconLink,
  IconBarChart,
  IconUsers,
  IconZap,
  IconArrowUpRight,
  IconCopy,
  IconCheck,
  IconExternalLink,
  IconGlobe,
  IconCalendar,
  IconLock,
} from '../../components/common/Icons';

export const DashboardView = ({
  links = [],
  analytics,
  onOpenShortener,
  onSelectTab,
  onToggleLinkActive,
  onSelectLinkForAnalytics,
}) => {
  const [quickUrl, setQuickUrl] = useState('');
  const [copiedId, setCopiedId] = useState(null);

  const totalLinks = links.length;
  const totalClicks = links.reduce((acc, l) => acc + (l.clicks || 0), 0);
  const totalUnique = links.reduce((acc, l) => acc + (l.uniqueVisitors || 0), 0);
  const activeCount = links.filter((l) => l.isActive).length;
  const expiredCount = links.filter((l) => !l.isActive || (l.expiresAt && new Date(l.expiresAt) < new Date())).length;

  const copyLink = (link) => {
    const full = `https://${link.customDomain || 'short.io'}/${link.shortCode}`;
    navigator.clipboard.writeText(full);
    setCopiedId(link.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Top performing links
  const topLinks = [...links].sort((a, b) => (b.clicks || 0) - (a.clicks || 0)).slice(0, 4);

  // SVG Trend Chart Data
  const clickPoints = analytics?.clicksByDay || [
    { date: 'Mon', clicks: 420 },
    { date: 'Tue', clicks: 680 },
    { date: 'Wed', clicks: 920 },
    { date: 'Thu', clicks: 710 },
    { date: 'Fri', clicks: 1340 },
    { date: 'Sat', clicks: 1120 },
    { date: 'Sun', clicks: 1540 },
  ];

  const maxClicks = Math.max(...clickPoints.map((p) => p.clicks), 1);
  const chartHeight = 160;
  const chartWidth = 500;
  const stepX = chartWidth / (clickPoints.length - 1);

  const pointsString = clickPoints
    .map((p, i) => {
      const x = i * stepX;
      const y = chartHeight - (p.clicks / maxClicks) * (chartHeight - 30) - 15;
      return `${x},${y}`;
    })
    .join(' ');

  const areaString = `${pointsString} ${chartWidth},${chartHeight} 0,${chartHeight}`;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Welcome & Quick Bar */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          padding: '24px',
          borderRadius: 'var(--radius-lg)',
          background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(6, 182, 212, 0.05) 100%)',
          border: '1px solid rgba(59, 130, 246, 0.2)',
          position: 'relative',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--color-text-primary)' }}>
              Shorten & Route Intelligence
            </h1>
            <p style={{ fontSize: '14px', color: 'var(--color-text-muted)', marginTop: '4px' }}>
              High-concurrency URL platform powered by Go Redirection Engine & PostgreSQL.
            </p>
          </div>

          <button
            onClick={onOpenShortener}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 20px',
              backgroundColor: 'var(--color-primary)',
              color: 'white',
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: 600,
              boxShadow: '0 4px 14px rgba(59, 130, 246, 0.35)',
            }}
          >
            <IconZap size={16} /> Advanced Shortener
          </button>
        </div>
      </div>

      {/* Top 4 Metrics Bento Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '16px',
        }}
      >
        <BentoCard withAccent>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '13px', color: 'var(--color-text-muted)', fontWeight: 500 }}>
              Total Links
            </span>
            <div style={{ color: 'var(--color-primary-light)' }}>
              <IconLink size={18} />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '12px' }}>
            <span style={{ fontSize: '28px', fontWeight: 700, color: 'var(--color-text-primary)' }}>
              {totalLinks}
            </span>
            <Badge variant="success" size="sm">+12%</Badge>
          </div>
          <span style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginTop: '6px' }}>
            {activeCount} active · {expiredCount} expired
          </span>
        </BentoCard>

        <BentoCard withAccent>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '13px', color: 'var(--color-text-muted)', fontWeight: 500 }}>
              Total Clicks
            </span>
            <div style={{ color: 'var(--color-secondary)' }}>
              <IconBarChart size={18} />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '12px' }}>
            <span style={{ fontSize: '28px', fontWeight: 700, color: 'var(--color-text-primary)' }}>
              {totalClicks.toLocaleString()}
            </span>
            <Badge variant="success" size="sm">+28.4%</Badge>
          </div>
          <span style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginTop: '6px' }}>
            Sub-millisecond resolution
          </span>
        </BentoCard>

        <BentoCard withAccent>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '13px', color: 'var(--color-text-muted)', fontWeight: 500 }}>
              Unique Visitors
            </span>
            <div style={{ color: '#8B5CF6' }}>
              <IconUsers size={18} />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '12px' }}>
            <span style={{ fontSize: '28px', fontWeight: 700, color: 'var(--color-text-primary)' }}>
              {totalUnique.toLocaleString()}
            </span>
            <Badge variant="purple" size="sm">78% Ratio</Badge>
          </div>
          <span style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginTop: '6px' }}>
            SHA-256 privacy hashed
          </span>
        </BentoCard>

        <BentoCard withAccent>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '13px', color: 'var(--color-text-muted)', fontWeight: 500 }}>
              Go Engine Health
            </span>
            <Badge variant="success" dot size="sm">Healthy</Badge>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '12px' }}>
            <span style={{ fontSize: '28px', fontWeight: 700, color: '#10B981' }}>
              0.8 ms
            </span>
            <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>avg latency</span>
          </div>
          <span style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginTop: '6px' }}>
            Async click pipeline active
          </span>
        </BentoCard>
      </div>

      {/* Main Visual Bento Grid: Chart + Top Links */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))',
          gap: '20px',
        }}
      >
        {/* Trend Area Chart */}
        <BentoCard
          title="Click Velocity & Traffic Trends"
          subtitle="Real-time click traffic across all links (Last 7 Days)"
          icon={<IconBarChart size={18} color="var(--color-primary-light)" />}
          action={
            <button
              onClick={() => onSelectTab('analytics')}
              style={{
                background: 'transparent',
                color: 'var(--color-primary-light)',
                fontSize: '12.5px',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              Full Analytics <IconArrowUpRight size={14} />
            </button>
          }
        >
          <div style={{ width: '100%', height: chartHeight + 40, marginTop: '8px' }}>
            <svg
              viewBox={`0 0 ${chartWidth} ${chartHeight + 30}`}
              style={{ width: '100%', height: '100%', overflow: 'visible' }}
            >
              <defs>
                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="var(--color-primary)" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Area fill */}
              <polygon points={areaString} fill="url(#chartGradient)" />

              {/* Line stroke */}
              <polyline
                points={pointsString}
                fill="none"
                stroke="var(--color-primary)"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Data circles & labels */}
              {clickPoints.map((p, i) => {
                const x = i * stepX;
                const y = chartHeight - (p.clicks / maxClicks) * (chartHeight - 30) - 15;
                return (
                  <g key={i}>
                    <circle
                      cx={x}
                      cy={y}
                      r="4"
                      fill="var(--color-bg-card)"
                      stroke="var(--color-primary)"
                      strokeWidth="2"
                    />
                    <text
                      x={x}
                      y={chartHeight + 20}
                      textAnchor="middle"
                      fill="var(--color-text-muted)"
                      fontSize="11"
                    >
                      {p.date}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </BentoCard>

        {/* Top Performing Links Bento */}
        <BentoCard
          title="Top Performing Links"
          subtitle="Highest engagement shortened URLs"
          icon={<IconZap size={18} color="var(--color-secondary)" />}
          action={
            <button
              onClick={() => onSelectTab('links')}
              style={{
                background: 'transparent',
                color: 'var(--color-primary-light)',
                fontSize: '12.5px',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              Manage All <IconArrowUpRight size={14} />
            </button>
          }
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {topLinks.map((link) => {
              const fullShort = `https://${link.customDomain || 'short.io'}/${link.shortCode}`;
              const isCopied = copiedId === link.id;

              return (
                <div
                  key={link.id}
                  style={{
                    padding: '12px',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--color-bg-elevated)',
                    border: '1px solid var(--color-border-subtle)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '12px',
                    transition: 'border-color 0.2s',
                  }}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '13.5px', fontWeight: 600, color: 'var(--color-text-primary)' }}>
                        {link.title || link.shortCode}
                      </span>
                      {link.isPasswordProtected && (
                        <IconLock size={12} color="var(--color-secondary)" />
                      )}
                      {!link.isActive && <Badge variant="error" size="sm">Inactive</Badge>}
                    </div>
                    <span
                      style={{
                        fontSize: '12px',
                        fontFamily: 'var(--font-code)',
                        color: 'var(--color-primary-light)',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {fullShort}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--color-text-primary)' }}>
                        {link.clicks.toLocaleString()}
                      </span>
                      <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>clicks</div>
                    </div>

                    <button
                      onClick={() => copyLink(link)}
                      title="Copy short URL"
                      style={{
                        background: 'transparent',
                        color: isCopied ? '#10B981' : 'var(--color-text-secondary)',
                        padding: '6px',
                        borderRadius: '6px',
                        border: '1px solid var(--color-border-subtle)',
                      }}
                    >
                      {isCopied ? <IconCheck size={14} /> : <IconCopy size={14} />}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </BentoCard>
      </div>

      {/* Referrers & Device Distribution Bento Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '20px',
        }}
      >
        {/* Referrers */}
        <BentoCard
          title="Traffic Channels"
          subtitle="Top referrers leading to redirects"
          icon={<IconGlobe size={18} color="#10B981" />}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {analytics?.referrers?.map((r, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px' }}>
                  <span style={{ color: 'var(--color-text-primary)', fontWeight: 500 }}>{r.source}</span>
                  <span style={{ color: 'var(--color-text-muted)' }}>{r.count.toLocaleString()} ({r.percentage}%)</span>
                </div>
                {/* Progress bar */}
                <div
                  style={{
                    height: '6px',
                    width: '100%',
                    backgroundColor: 'var(--color-bg-elevated)',
                    borderRadius: '3px',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      height: '100%',
                      width: `${r.percentage}%`,
                      backgroundColor: 'var(--color-primary)',
                      borderRadius: '3px',
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </BentoCard>

        {/* Device Breakdown */}
        <BentoCard
          title="Device Categorization"
          subtitle="User-Agent parsed client platforms"
          icon={<IconUsers size={18} color="#F59E0B" />}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {analytics?.devices?.map((d, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span
                    style={{
                      width: '10px',
                      height: '10px',
                      borderRadius: '50%',
                      backgroundColor: i === 0 ? 'var(--color-primary)' : i === 1 ? 'var(--color-secondary)' : '#8B5CF6',
                    }}
                  />
                  <span style={{ fontSize: '13px', fontWeight: 500, color: 'var(--color-text-primary)' }}>
                    {d.type}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                  <span style={{ fontSize: '13.5px', fontWeight: 600, color: 'var(--color-text-primary)' }}>
                    {d.count.toLocaleString()}
                  </span>
                  <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
                    ({d.percentage}%)
                  </span>
                </div>
              </div>
            ))}
          </div>
        </BentoCard>
      </div>
    </div>
  );
};

export default DashboardView;

