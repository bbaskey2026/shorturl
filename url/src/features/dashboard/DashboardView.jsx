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
  IconGlobe,
  IconLock,
} from '../../components/common/Icons';

export const DashboardView = ({
  links = [],
  analytics,
  onOpenShortener,
  onSelectTab,
}) => {
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Welcome & Overview Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
          padding: '22px 24px',
          borderRadius: 'var(--radius-xl)',
          backgroundColor: 'var(--color-bg-paper)',
          border: '1px solid var(--color-border-subtle)',
          boxShadow: 'var(--shadow-card)',
        }}
      >
        <div>
          <h1 style={{ fontSize: '20px', fontWeight: 600, letterSpacing: '-0.02em', color: 'var(--color-text-primary)' }}>
            Overview & Link Intelligence
          </h1>
          <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', marginTop: '4px' }}>
            Production short links, traffic analytics, and Go redirection performance.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={() => onSelectTab('services')}
            style={{
              padding: '8px 14px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--color-bg-elevated)',
              color: 'var(--color-text-secondary)',
              fontSize: '12.5px',
              fontWeight: 500,
              border: '1px solid var(--color-border-subtle)',
              cursor: 'pointer',
            }}
          >
            Platform Services
          </button>
          <button
            onClick={onOpenShortener}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '9px 18px',
              backgroundColor: 'var(--color-primary)',
              color: '#FFFFFF',
              borderRadius: 'var(--radius-md)',
              fontSize: '13px',
              fontWeight: 500,
              border: 'none',
              cursor: 'pointer',
              transition: 'background-color var(--transition-fast)',
            }}
          >
            <IconZap size={15} /> Create Short Link
          </button>
        </div>
      </div>

      {/* Shortie 5-Step Quick Action Selector (from Image 1) */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
          padding: '12px 18px',
          borderRadius: 'var(--radius-lg)',
          background: 'var(--color-bg-paper)',
          border: '1px solid var(--color-border-subtle)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            HOW WE WORK ♾️
          </span>
          <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>• Fast 5-Step URL Lifecycle:</span>
        </div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {[
            { id: 1, label: 'Put Link', action: onOpenShortener },
            { id: 2, label: 'Click Shortener', action: onOpenShortener },
            { id: 3, label: 'Create Custom URL', action: () => onSelectTab('domains') },
            { id: 4, label: 'Create QR Code', action: () => onSelectTab('qrcodes') },
            { id: 5, label: 'Put Tracker Link', action: () => onSelectTab('analytics') },
          ].map((item) => (
            <button
              key={item.id}
              onClick={item.action}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '5px 12px',
                borderRadius: '9999px',
                background: 'var(--color-bg-surface)',
                border: '1px solid var(--color-border-subtle)',
                color: 'var(--color-text-secondary)',
                fontSize: '11.5px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              <span
                style={{
                  width: '16px',
                  height: '16px',
                  borderRadius: '50%',
                  background: 'var(--color-primary)',
                  color: '#ffffff',
                  fontSize: '9.5px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                }}
              >
                {item.id}
              </span>
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Top 4 Metrics Bento Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
          gap: '16px',
        }}
      >
        <BentoCard>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '13px', color: 'var(--color-text-muted)', fontWeight: 500 }}>
              Total Links
            </span>
            <div style={{ color: 'var(--color-primary)' }}>
              <IconLink size={17} />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '12px' }}>
            <span style={{ fontSize: '26px', fontWeight: 700, color: 'var(--color-text-primary)', letterSpacing: '-0.02em' }}>
              {totalLinks}
            </span>
            <Badge variant="success" size="sm">+12%</Badge>
          </div>
          <span style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginTop: '6px' }}>
            {activeCount} active · {expiredCount} expired
          </span>
        </BentoCard>

        <BentoCard>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '13px', color: 'var(--color-text-muted)', fontWeight: 500 }}>
              Total Clicks
            </span>
            <div style={{ color: 'var(--color-primary)' }}>
              <IconBarChart size={17} />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '12px' }}>
            <span style={{ fontSize: '26px', fontWeight: 700, color: 'var(--color-text-primary)', letterSpacing: '-0.02em' }}>
              {totalClicks.toLocaleString()}
            </span>
            <Badge variant="success" size="sm">+28.4%</Badge>
          </div>
          <span style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginTop: '6px' }}>
            Real-time redirect events
          </span>
        </BentoCard>

        <BentoCard>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '13px', color: 'var(--color-text-muted)', fontWeight: 500 }}>
              Unique Visitors
            </span>
            <div style={{ color: 'var(--color-text-secondary)' }}>
              <IconUsers size={17} />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '12px' }}>
            <span style={{ fontSize: '26px', fontWeight: 700, color: 'var(--color-text-primary)', letterSpacing: '-0.02em' }}>
              {totalUnique.toLocaleString()}
            </span>
            <Badge variant="info" size="sm">78% Ratio</Badge>
          </div>
          <span style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginTop: '6px' }}>
            Privacy-safe hashed IP
          </span>
        </BentoCard>

        <BentoCard>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '13px', color: 'var(--color-text-muted)', fontWeight: 500 }}>
              Gateway Latency
            </span>
            <Badge variant="success" dot size="sm">Active</Badge>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '12px' }}>
            <span style={{ fontSize: '26px', fontWeight: 700, color: 'var(--color-status-success)', letterSpacing: '-0.02em' }}>
              0.8 ms
            </span>
            <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>Go runtime</span>
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
          gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
          gap: '16px',
        }}
      >
        {/* Trend Area Chart */}
        <BentoCard
          title="Click Velocity & Traffic Trends"
          subtitle="Real-time redirect traffic over the last 7 days"
          icon={<IconBarChart size={17} color="var(--color-primary)" />}
          action={
            <button
              onClick={() => onSelectTab('analytics')}
              style={{
                background: 'transparent',
                color: 'var(--color-primary)',
                fontSize: '12.5px',
                fontWeight: 500,
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              Full Analytics <IconArrowUpRight size={13} />
            </button>
          }
        >
          <div style={{ width: '100%', height: chartHeight + 40, marginTop: '8px' }}>
            <svg
              viewBox={`0 0 ${chartWidth} ${chartHeight + 30}`}
              style={{ width: '100%', height: '100%', overflow: 'visible' }}
            >
              <defs>
                <linearGradient id="museChartGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="var(--color-primary)" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Area fill */}
              <polygon points={areaString} fill="url(#museChartGradient)" />

              {/* Line stroke */}
              <polyline
                points={pointsString}
                fill="none"
                stroke="var(--color-primary)"
                strokeWidth="2.2"
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
                      r="3.5"
                      fill="var(--color-bg-paper)"
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
          icon={<IconZap size={17} color="var(--color-primary)" />}
          action={
            <button
              onClick={() => onSelectTab('links')}
              style={{
                background: 'transparent',
                color: 'var(--color-primary)',
                fontSize: '12.5px',
                fontWeight: 500,
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              Manage All <IconArrowUpRight size={13} />
            </button>
          }
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {topLinks.map((link) => {
              const fullShort = `https://${link.customDomain || 'short.io'}/${link.shortCode}`;
              const isCopied = copiedId === link.id;

              return (
                <div
                  key={link.id}
                  style={{
                    padding: '10px 12px',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--color-bg-elevated)',
                    border: '1px solid var(--color-border-subtle)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '12px',
                    transition: 'border-color var(--transition-fast)',
                  }}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text-primary)' }}>
                        {link.title || link.shortCode}
                      </span>
                      {link.isPasswordProtected && (
                        <IconLock size={12} color="var(--color-text-muted)" />
                      )}
                      {!link.isActive && <Badge variant="error" size="sm">Inactive</Badge>}
                    </div>
                    <span
                      style={{
                        fontSize: '12px',
                        fontFamily: 'var(--font-code)',
                        color: 'var(--color-primary)',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {fullShort}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: '13.5px', fontWeight: 600, color: 'var(--color-text-primary)' }}>
                        {link.clicks.toLocaleString()}
                      </span>
                      <div style={{ fontSize: '10.5px', color: 'var(--color-text-muted)' }}>clicks</div>
                    </div>

                    <button
                      onClick={() => copyLink(link)}
                      title="Copy short URL"
                      style={{
                        background: 'transparent',
                        color: isCopied ? 'var(--color-status-success)' : 'var(--color-text-muted)',
                        padding: '5px',
                        borderRadius: 'var(--radius-sm)',
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
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '16px',
        }}
      >
        {/* Referrers */}
        <BentoCard
          title="Traffic Channels"
          subtitle="Top sources directing traffic to short links"
          icon={<IconGlobe size={17} color="var(--color-primary)" />}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {analytics?.referrers?.map((r, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                  <span style={{ color: 'var(--color-text-primary)', fontWeight: 500 }}>{r.source}</span>
                  <span style={{ color: 'var(--color-text-muted)' }}>{r.count.toLocaleString()} ({r.percentage}%)</span>
                </div>
                {/* Progress bar */}
                <div
                  style={{
                    height: '5px',
                    width: '100%',
                    backgroundColor: 'var(--color-bg-elevated)',
                    borderRadius: 'var(--radius-full)',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      height: '100%',
                      width: `${r.percentage}%`,
                      backgroundColor: 'var(--color-primary)',
                      borderRadius: 'var(--radius-full)',
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
          subtitle="Client browser and platform distribution"
          icon={<IconUsers size={17} color="var(--color-text-secondary)" />}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {analytics?.devices?.map((d, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span
                    style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      backgroundColor: i === 0 ? 'var(--color-primary)' : 'var(--color-text-muted)',
                    }}
                  />
                  <span style={{ fontSize: '12.5px', fontWeight: 500, color: 'var(--color-text-primary)' }}>
                    {d.type}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                  <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text-primary)' }}>
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
