import React, { useState } from 'react';
import BentoCard from '../../components/common/BentoCard';
import Badge from '../../components/common/Badge';
import {
  IconShield,
  IconUsers,
} from '../../components/common/Icons';

export const AdminDashboardView = ({ links = [], domains = [] }) => {
  const [auditLogs] = useState([
    { id: 'log-1', action: 'DOMAIN_VERIFIED', target: 'brand.link', user: 'alex@shorturl.io', time: '10 mins ago', status: 'SUCCESS' },
    { id: 'log-2', action: 'RATE_LIMIT_FLAG', target: '192.168.1.104', user: 'anonymous', time: '42 mins ago', status: 'WARNING' },
    { id: 'log-3', action: 'LINK_DELETED', target: 'gh-conc', user: 'alex@shorturl.io', time: '2 hours ago', status: 'INFO' },
    { id: 'log-4', action: 'USER_REGISTERED', target: 'sarah@startup.co', user: 'system', time: '5 hours ago', status: 'SUCCESS' },
  ]);

  const [platformUsers] = useState([
    { id: 'u1', name: 'Alex Mercer', email: 'alex@shorturl.io', role: 'admin', linksCount: 5, plan: 'pro', status: 'active' },
    { id: 'u2', name: 'Dev Team', email: 'team@infra.internal', role: 'user', linksCount: 142, plan: 'business', status: 'active' },
    { id: 'u3', name: 'Spam Probe', email: 'bot98@tempmail.xyz', role: 'user', linksCount: 1, plan: 'free', status: 'suspended' },
  ]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h1 style={{ fontSize: '20px', fontWeight: 600, letterSpacing: '-0.02em', color: 'var(--color-text-primary)' }}>
              Platform Administration & Audit
            </h1>
            <Badge variant="info" size="sm">Staff Access</Badge>
          </div>
          <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', marginTop: '2px' }}>
            System-wide user controls, audit logs, domain whitelisting, and routing telemetry.
          </p>
        </div>
      </div>

      {/* Platform KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
        <BentoCard>
          <span style={{ fontSize: '12.5px', color: 'var(--color-text-muted)', fontWeight: 500 }}>Registered Tenants</span>
          <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--color-text-primary)', marginTop: '6px', letterSpacing: '-0.02em' }}>
            {platformUsers.length}
          </div>
          <span style={{ fontSize: '11px', color: 'var(--color-status-success)', marginTop: '4px' }}>100% database health</span>
        </BentoCard>

        <BentoCard>
          <span style={{ fontSize: '12.5px', color: 'var(--color-text-muted)', fontWeight: 500 }}>Active Short Codes</span>
          <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--color-text-primary)', marginTop: '6px', letterSpacing: '-0.02em' }}>
            {links.length}
          </div>
          <span style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginTop: '4px' }}>Across all workspaces</span>
        </BentoCard>

        <BentoCard>
          <span style={{ fontSize: '12.5px', color: 'var(--color-text-muted)', fontWeight: 500 }}>Custom Domains</span>
          <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--color-primary)', marginTop: '6px', letterSpacing: '-0.02em' }}>
            {domains.length}
          </div>
          <span style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginTop: '4px' }}>DNS TXT verified</span>
        </BentoCard>

        <BentoCard>
          <span style={{ fontSize: '12.5px', color: 'var(--color-text-muted)', fontWeight: 500 }}>Security Incidents</span>
          <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--color-status-success)', marginTop: '6px', letterSpacing: '-0.02em' }}>
            0
          </div>
          <span style={{ fontSize: '11px', color: 'var(--color-status-success)', marginTop: '4px' }}>SSRF & Open-Redirect Safe</span>
        </BentoCard>
      </div>

      {/* Users Management */}
      <BentoCard title="User Accounts" subtitle="Manage tenant roles, quotas, and access permissions" icon={<IconUsers size={17} color="var(--color-primary)" />}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '12.5px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--color-border-subtle)', color: 'var(--color-text-muted)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                <th style={{ padding: '10px 12px' }}>User</th>
                <th style={{ padding: '10px 12px' }}>Role</th>
                <th style={{ padding: '10px 12px' }}>Plan</th>
                <th style={{ padding: '10px 12px' }}>Links</th>
                <th style={{ padding: '10px 12px' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {platformUsers.map((u) => (
                <tr key={u.id} style={{ borderBottom: '1px solid var(--color-border-subtle)' }}>
                  <td style={{ padding: '10px 12px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>{u.name}</span>
                      <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>{u.email}</span>
                    </div>
                  </td>
                  <td style={{ padding: '10px 12px' }}>
                    <Badge variant={u.role === 'admin' ? 'info' : 'neutral'} size="sm">
                      {u.role.toUpperCase()}
                    </Badge>
                  </td>
                  <td style={{ padding: '10px 12px', textTransform: 'capitalize' }}>{u.plan}</td>
                  <td style={{ padding: '10px 12px', fontWeight: 600 }}>{u.linksCount}</td>
                  <td style={{ padding: '10px 12px' }}>
                    {u.status === 'active' ? (
                      <Badge variant="success" dot size="sm">Active</Badge>
                    ) : (
                      <Badge variant="error" dot size="sm">Suspended</Badge>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </BentoCard>

      {/* Audit Logs */}
      <BentoCard title="Security & Audit Trail" subtitle="Chronological system and moderator activity" icon={<IconShield size={17} color="var(--color-primary)" />}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {auditLogs.map((log) => (
            <div
              key={log.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '9px 12px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--color-bg-elevated)',
                border: '1px solid var(--color-border-subtle)',
                fontSize: '12px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span
                  style={{
                    fontFamily: 'var(--font-code)',
                    fontWeight: 500,
                    color: log.status === 'WARNING' ? 'var(--color-status-warning)' : 'var(--color-primary)',
                  }}
                >
                  {log.action}
                </span>
                <span style={{ color: 'var(--color-text-primary)' }}>Target: {log.target}</span>
                <span style={{ color: 'var(--color-text-muted)' }}>by {log.user}</span>
              </div>
              <span style={{ color: 'var(--color-text-muted)', fontSize: '11px' }}>{log.time}</span>
            </div>
          ))}
        </div>
      </BentoCard>
    </div>
  );
};

export default AdminDashboardView;
