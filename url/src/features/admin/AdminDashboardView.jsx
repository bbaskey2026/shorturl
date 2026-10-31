import React, { useState } from 'react';
import BentoCard from '../../components/common/BentoCard';
import Badge from '../../components/common/Badge';
import {
  IconShield,
  IconUsers,
  IconLink,
  IconGlobe,
  IconBarChart,
  IconTrash,
  IconLock,
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h1 style={{ fontSize: '22px', fontWeight: 700, color: 'var(--color-text-primary)' }}>
              Platform Administration & Audit
            </h1>
            <Badge variant="purple" size="sm">SuperAdmin</Badge>
          </div>
          <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', marginTop: '2px' }}>
            System-wide user control, security audit logs, domain whitelisting, and routing health.
          </p>
        </div>
      </div>

      {/* Platform KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
        <BentoCard>
          <span style={{ fontSize: '12.5px', color: 'var(--color-text-muted)' }}>Registered Tenants</span>
          <div style={{ fontSize: '26px', fontWeight: 700, color: 'var(--color-text-primary)', marginTop: '6px' }}>
            {platformUsers.length}
          </div>
          <span style={{ fontSize: '11px', color: '#10B981', marginTop: '4px' }}>100% database health</span>
        </BentoCard>

        <BentoCard>
          <span style={{ fontSize: '12.5px', color: 'var(--color-text-muted)' }}>Active Short Codes</span>
          <div style={{ fontSize: '26px', fontWeight: 700, color: 'var(--color-text-primary)', marginTop: '6px' }}>
            {links.length}
          </div>
          <span style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginTop: '4px' }}>Across all tenants</span>
        </BentoCard>

        <BentoCard>
          <span style={{ fontSize: '12.5px', color: 'var(--color-text-muted)' }}>Custom Domains</span>
          <div style={{ fontSize: '26px', fontWeight: 700, color: 'var(--color-primary-light)', marginTop: '6px' }}>
            {domains.length}
          </div>
          <span style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginTop: '4px' }}>DNS TXT verified</span>
        </BentoCard>

        <BentoCard>
          <span style={{ fontSize: '12.5px', color: 'var(--color-text-muted)' }}>Security Incidents</span>
          <div style={{ fontSize: '26px', fontWeight: 700, color: '#10B981', marginTop: '6px' }}>
            0
          </div>
          <span style={{ fontSize: '11px', color: '#10B981', marginTop: '4px' }}>SSRF & Open-Redirect Safe</span>
        </BentoCard>
      </div>

      {/* Users Management */}
      <BentoCard title="User Accounts" subtitle="Manage tenant roles, quotas, and access control" icon={<IconUsers size={18} color="var(--color-primary-light)" />}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--color-border-subtle)', color: 'var(--color-text-muted)' }}>
                <th style={{ padding: '10px 14px' }}>User</th>
                <th style={{ padding: '10px 14px' }}>Role</th>
                <th style={{ padding: '10px 14px' }}>Plan</th>
                <th style={{ padding: '10px 14px' }}>Links</th>
                <th style={{ padding: '10px 14px' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {platformUsers.map((u) => (
                <tr key={u.id} style={{ borderBottom: '1px solid var(--color-border-subtle)' }}>
                  <td style={{ padding: '12px 14px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>{u.name}</span>
                      <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>{u.email}</span>
                    </div>
                  </td>
                  <td style={{ padding: '12px 14px' }}>
                    <Badge variant={u.role === 'admin' ? 'purple' : 'neutral'} size="sm">
                      {u.role.toUpperCase()}
                    </Badge>
                  </td>
                  <td style={{ padding: '12px 14px', textTransform: 'capitalize' }}>{u.plan}</td>
                  <td style={{ padding: '12px 14px', fontWeight: 600 }}>{u.linksCount}</td>
                  <td style={{ padding: '12px 14px' }}>
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
      <BentoCard title="Security & Audit Trail" subtitle="Chronological system and moderator activity" icon={<IconShield size={18} color="#10B981" />}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {auditLogs.map((log) => (
            <div
              key={log.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 14px',
                borderRadius: '8px',
                backgroundColor: 'var(--color-bg-elevated)',
                border: '1px solid var(--color-border-subtle)',
                fontSize: '12.5px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span
                  style={{
                    fontFamily: 'var(--font-code)',
                    fontWeight: 600,
                    color: log.status === 'WARNING' ? '#F59E0B' : 'var(--color-primary-light)',
                  }}
                >
                  {log.action}
                </span>
                <span style={{ color: 'var(--color-text-primary)' }}>Target: {log.target}</span>
                <span style={{ color: 'var(--color-text-muted)' }}>by {log.user}</span>
              </div>
              <span style={{ color: 'var(--color-text-muted)', fontSize: '11.5px' }}>{log.time}</span>
            </div>
          ))}
        </div>
      </BentoCard>
    </div>
  );
};

export default AdminDashboardView;

