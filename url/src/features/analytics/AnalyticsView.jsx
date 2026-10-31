import React, { useState } from 'react';
import BentoCard from '../../components/common/BentoCard';
import Badge from '../../components/common/Badge';
import {
  IconBarChart,
  IconUsers,
  IconGlobe,
  IconCalendar,
  IconLink,
  IconZap,
} from '../../components/common/Icons';

export const AnalyticsView = ({ analytics, links = [], selectedLink, onClearSelectedLink }) => {
  const [timeRange, setTimeRange] = useState('7d'); // today, 7d, 30d, 90d

  const data = analytics || {};
  const clickPoints = data.clicksByDay || [];
  const maxClicks = Math.max(...clickPoints.map((p) => p.clicks), 1);
  const chartHeight = 200;
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header and Filter bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h1 style={{ fontSize: '22px', fontWeight: 700, color: 'var(--color-text-primary)' }}>
              Analytics & Traffic Telemetry
            </h1>
            {selectedLink && (
              <Badge variant="info">
                Filtering: {selectedLink.shortCode}
              </Badge>
            )}
          </div>
          <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', marginTop: '2px' }}>
            High-precision click tracking recorded asynchronously by the Go redirection worker.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {selectedLink && (
            <button
              onClick={onClearSelectedLink}
              style={{
                padding: '6px 12px',
                borderRadius: '6px',
                backgroundColor: 'var(--color-bg-hover)',
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
                padding: '7px 14px',
                borderRadius: '8px',
                backgroundColor: timeRange === range ? 'var(--color-primary)' : 'var(--color-bg-card)',
                color: timeRange === range ? 'white' : 'var(--color-text-secondary)',
                border: '1px solid var(--color-border-subtle)',
                fontSize: '12.5px',
                fontWeight: 600,
                transition: 'all 0.15s',
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
          <span style={{ fontSize: '12.5px', color: 'var(--color-text-muted)' }}>Total Redirect Events</span>
          <div style={{ fontSize: '28px', fontWeight: 700, color: 'var(--color-text-primary)', marginTop: '8px' }}>
            {(selectedLink ? selectedLink.clicks : data.totalClicks)?.toLocaleString()}
          </div>
          <span style={{ fontSize: '12px', color: '#10B981', marginTop: '4px' }}>+18.2% vs previous period</span>
        </BentoCard>

        <BentoCard>
          <span style={{ fontSize: '12.5px', color: 'var(--color-text-muted)' }}>Unique Visitors (Hashed)</span>
          <div style={{ fontSize: '28px', fontWeight: 700, color: 'var(--color-text-primary)', marginTop: '8px' }}>
            {(selectedLink ? selectedLink.uniqueVisitors : data.uniqueVisitors)?.toLocaleString()}
          </div>
          <span style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginTop: '4px' }}>
            SHA-256(IP + Salt + Date)
          </span>
        </BentoCard>

        <BentoCard>
          <span style={{ fontSize: '12.5px', color: 'var(--color-text-muted)' }}>Conversion / Engagement</span>
          <div style={{ fontSize: '28px', fontWeight: 700, color: 'var(--color-secondary)', marginTop: '8px' }}>
            78.2%
          </div>
          <span style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginTop: '4px' }}>
            Direct engagement rate
          </span>
        </BentoCard>

        <BentoCard>
          <span style={{ fontSize: '12.5px', color: 'var(--color-text-muted)' }}>Worker Pipeline Latency</span>
          <div style={{ fontSize: '28px', fontWeight: 700, color: '#10B981', marginTop: '8px' }}>
            ~0.8ms
          </div>
          <span style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginTop: '4px' }}>
            Non-blocking Redis stream
          </span>
        </BentoCard>
      </div>

      {/* Interactive Time-series Chart */}
      <BentoCard
        title="Clicks Over Time"
        subtitle="Chronological volume of redirection requests"
        icon={<IconBarChart size={18} color="var(--color-primary-light)" />}
      >
        <div style={{ width: '100%', height: chartHeight + 40, marginTop: '12px' }}>
          <svg
            viewBox={`0 0 ${chartWidth} ${chartHeight + 30}`}
            style={{ width: '100%', height: '100%', overflow: 'visible' }}
          >
            <defs>
              <linearGradient id="analyticsGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0.4" />
                <stop offset="100%" stopColor="var(--color-primary)" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            <polygon points={areaString} fill="url(#analyticsGradient)" />
            <polyline
              points={pointsString}
              fill="none"
              stroke="var(--color-primary)"
              strokeWidth="2.5"
            />

            {clickPoints.map((p, i) => {
              const x = i * stepX;
              const y = chartHeight - (p.clicks / maxClicks) * (chartHeight - 40) - 20;
              return (
                <g key={i}>
                  <circle cx={x} cy={y} r="4" fill="var(--color-bg-card)" stroke="var(--color-primary)" strokeWidth="2" />
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
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
        {/* Country breakdown */}
        <BentoCard
          title="Geographic Distribution"
          subtitle="Country origin identified via IP"
          icon={<IconGlobe size={18} color="#10B981" />}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {data.countries?.map((c, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                  <span style={{ fontWeight: 500, color: 'var(--color-text-primary)' }}>{c.country}</span>
                  <span style={{ color: 'var(--color-text-muted)' }}>{c.clicks.toLocaleString()} ({c.percentage}%)</span>
                </div>
                <div style={{ height: '5px', backgroundColor: 'var(--color-bg-elevated)', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${c.percentage}%`, backgroundColor: 'var(--color-secondary)' }} />
                </div>
              </div>
            ))}
          </div>
        </BentoCard>

        {/* Browser breakdown */}
        <BentoCard
          title="Client Browsers"
          subtitle="User-Agent parsed browsers"
          icon={<IconUsers size={18} color="#8B5CF6" />}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {data.browsers?.map((b, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#8B5CF6' }} />
                  <span style={{ fontSize: '13px', fontWeight: 500, color: 'var(--color-text-primary)' }}>{b.name}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                  <span style={{ fontSize: '13.5px', fontWeight: 600 }}>{b.count.toLocaleString()}</span>
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

