import React, { useState } from 'react';
import BentoCard from '../../components/common/BentoCard';
import Badge from '../../components/common/Badge';
import {
  IconBarChart,
  IconUsers,
  IconGlobe,
} from '../../components/common/Icons';

export const AnalyticsView = ({ analytics, selectedLink, onClearSelectedLink }) => {
  const [timeRange, setTimeRange] = useState('7d');

  const data = analytics || {};
  const clickPoints = data.clicksByDay || [];
  const maxClicks = Math.max(...clickPoints.map((p) => p.clicks), 1);
  const chartHeight = 180;
  const chartWidth = 600;
  const stepX = chartWidth / (Math.max(clickPoints.length - 1, 1));

  const pointsString = clickPoints
    .map((p, i) => {
      const x = i * stepX;
      const y = chartHeight - (p.clicks / maxClicks) * (chartHeight - 40) - 20;
      return `${x},${y}`;
    })
    .join(' ');

  const areaString = `${pointsString} ${chartWidth},${chartHeight} 0,${chartHeight}`;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header and Filter bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h1 style={{ fontSize: '20px', fontWeight: 600, letterSpacing: '-0.02em', color: 'var(--color-text-primary)' }}>
              Analytics & Traffic Telemetry
            </h1>
            {selectedLink && (
              <Badge variant="info">
                Filtering: {selectedLink.shortCode}
              </Badge>
            )}
          </div>
          <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', marginTop: '2px' }}>
            High-precision click telemetry recorded asynchronously by the Go redirection worker.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          {selectedLink && (
            <button
              onClick={onClearSelectedLink}
              style={{
                padding: '6px 12px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'transparent',
                color: 'var(--color-text-secondary)',
                fontSize: '12px',
                border: '1px solid var(--color-border-subtle)',
              }}
            >
              Clear Filter
            </button>
          )}

          {['today', '7d', '30d', '90d'].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              style={{
                padding: '6px 12px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: timeRange === range ? 'var(--color-primary)' : 'var(--color-bg-paper)',
                color: timeRange === range ? '#FFFFFF' : 'var(--color-text-secondary)',
                border: `1px solid ${timeRange === range ? 'var(--color-primary)' : 'var(--color-border-subtle)'}`,
                fontSize: '12px',
                fontWeight: 500,
                transition: 'all var(--transition-fast)',
              }}
            >
              {range === 'today' ? 'Today' : range === '7d' ? '7 Days' : range === '30d' ? '30 Days' : '90 Days'}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
        <BentoCard>
          <span style={{ fontSize: '12.5px', color: 'var(--color-text-muted)', fontWeight: 500 }}>Total Redirect Events</span>
          <div style={{ fontSize: '26px', fontWeight: 700, color: 'var(--color-text-primary)', marginTop: '8px', letterSpacing: '-0.02em' }}>
            {(selectedLink ? selectedLink.clicks : data.totalClicks)?.toLocaleString()}
          </div>
          <span style={{ fontSize: '12px', color: 'var(--color-status-success)', marginTop: '4px' }}>+18.2% vs previous period</span>
        </BentoCard>

        <BentoCard>
          <span style={{ fontSize: '12.5px', color: 'var(--color-text-muted)', fontWeight: 500 }}>Unique Visitors (Hashed)</span>
          <div style={{ fontSize: '26px', fontWeight: 700, color: 'var(--color-text-primary)', marginTop: '8px', letterSpacing: '-0.02em' }}>
            {(selectedLink ? selectedLink.uniqueVisitors : data.uniqueVisitors)?.toLocaleString()}
          </div>
          <span style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginTop: '4px' }}>
            SHA-256 privacy compliant
          </span>
        </BentoCard>

        <BentoCard>
          <span style={{ fontSize: '12.5px', color: 'var(--color-text-muted)', fontWeight: 500 }}>Conversion / Engagement</span>
          <div style={{ fontSize: '26px', fontWeight: 700, color: 'var(--color-text-primary)', marginTop: '8px', letterSpacing: '-0.02em' }}>
            78.2%
          </div>
          <span style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginTop: '4px' }}>
            Direct engagement rate
          </span>
        </BentoCard>

        <BentoCard>
          <span style={{ fontSize: '12.5px', color: 'var(--color-text-muted)', fontWeight: 500 }}>Worker Pipeline Latency</span>
          <div style={{ fontSize: '26px', fontWeight: 700, color: 'var(--color-status-success)', marginTop: '8px', letterSpacing: '-0.02em' }}>
            ~0.8ms
          </div>
          <span style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginTop: '4px' }}>
            Async Go redirection
          </span>
        </BentoCard>
      </div>

      {/* Interactive Time-series Chart */}
      <BentoCard
        title="Clicks Over Time"
        subtitle="Chronological volume of redirection requests"
        icon={<IconBarChart size={17} color="var(--color-primary)" />}
      >
        <div style={{ width: '100%', height: chartHeight + 40, marginTop: '12px' }}>
          <svg
            viewBox={`0 0 ${chartWidth} ${chartHeight + 30}`}
            style={{ width: '100%', height: '100%', overflow: 'visible' }}
          >
            <defs>
              <linearGradient id="analyticsGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0.3" />
                <stop offset="100%" stopColor="var(--color-primary)" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            <polygon points={areaString} fill="url(#analyticsGradient)" />
            <polyline
              points={pointsString}
              fill="none"
              stroke="var(--color-primary)"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {clickPoints.map((p, i) => {
              const x = i * stepX;
              const y = chartHeight - (p.clicks / maxClicks) * (chartHeight - 40) - 20;
              return (
                <g key={i}>
                  <circle cx={x} cy={y} r="3.5" fill="var(--color-bg-paper)" stroke="var(--color-primary)" strokeWidth="2" />
                  <text x={x} y={chartHeight + 20} textAnchor="middle" fill="var(--color-text-muted)" fontSize="11">
                    {p.date}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      </BentoCard>

      {/* Geo and Breakdown Bento Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
        {/* Country breakdown */}
        <BentoCard
          title="Geographic Distribution"
          subtitle="Country origin identified via IP telemetry"
          icon={<IconGlobe size={17} color="var(--color-primary)" />}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {data.countries?.map((c, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px' }}>
                  <span style={{ fontWeight: 500, color: 'var(--color-text-primary)' }}>{c.country}</span>
                  <span style={{ color: 'var(--color-text-muted)' }}>{c.clicks.toLocaleString()} ({c.percentage}%)</span>
                </div>
                <div style={{ height: '5px', backgroundColor: 'var(--color-bg-elevated)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${c.percentage}%`, backgroundColor: 'var(--color-primary)', borderRadius: 'var(--radius-full)' }} />
                </div>
              </div>
            ))}
          </div>
        </BentoCard>

        {/* Browser breakdown */}
        <BentoCard
          title="Client Browsers"
          subtitle="User-Agent parsed client user software"
          icon={<IconUsers size={17} color="var(--color-text-secondary)" />}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {data.browsers?.map((b, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: i === 0 ? 'var(--color-primary)' : 'var(--color-text-muted)' }} />
                  <span style={{ fontSize: '12.5px', fontWeight: 500, color: 'var(--color-text-primary)' }}>{b.name}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                  <span style={{ fontSize: '13px', fontWeight: 600 }}>{b.count.toLocaleString()}</span>
                  <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>({b.percentage}%)</span>
                </div>
              </div>
            ))}
          </div>
        </BentoCard>
      </div>
    </div>
  );
};

export default AnalyticsView;
