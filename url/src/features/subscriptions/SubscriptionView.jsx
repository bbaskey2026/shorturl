import React from 'react';
import BentoCard from '../../components/common/BentoCard';
import Badge from '../../components/common/Badge';
import {
  IconCheck,
} from '../../components/common/Icons';
import { subscriptionPlans } from '../../services/mockData';

export const SubscriptionView = ({ currentPlan = 'pro', onUpgradePlan }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <h1 style={{ fontSize: '20px', fontWeight: 600, letterSpacing: '-0.02em', color: 'var(--color-text-primary)' }}>
            Plans & Usage Quotas
          </h1>
          <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', marginTop: '2px' }}>
            Scale redirection throughput, high-volume click capacity, and custom domains.
          </p>
        </div>

        {/* Current Plan Indicator */}
        <Badge variant="info" size="md">
          Current Tier: {currentPlan.toUpperCase()}
        </Badge>
      </div>

      {/* Usage Quota Bento Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px' }}>
        <BentoCard title="Shortened Links" subtitle="Allocated link capacity">
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px', marginBottom: '8px' }}>
            <span style={{ fontWeight: 600 }}>2,100 / 5,000</span>
            <span style={{ color: 'var(--color-text-muted)' }}>42%</span>
          </div>
          <div style={{ height: '5px', backgroundColor: 'var(--color-bg-elevated)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: '42%', backgroundColor: 'var(--color-primary)' }} />
          </div>
        </BentoCard>

        <BentoCard title="Monthly Clicks" subtitle="High-throughput Go redirection events">
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px', marginBottom: '8px' }}>
            <span style={{ fontWeight: 600 }}>48,534 / 250,000</span>
            <span style={{ color: 'var(--color-text-muted)' }}>19.4%</span>
          </div>
          <div style={{ height: '5px', backgroundColor: 'var(--color-bg-elevated)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: '19.4%', backgroundColor: 'var(--color-primary)' }} />
          </div>
        </BentoCard>

        <BentoCard title="Custom Domains" subtitle="Verified branded DNS routing">
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px', marginBottom: '8px' }}>
            <span style={{ fontWeight: 600 }}>2 / 5</span>
            <span style={{ color: 'var(--color-text-muted)' }}>40%</span>
          </div>
          <div style={{ height: '5px', backgroundColor: 'var(--color-bg-elevated)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: '40%', backgroundColor: 'var(--color-status-success)' }} />
          </div>
        </BentoCard>

        <BentoCard title="Analytics Retention" subtitle="Granular event history in PostgreSQL">
          <div style={{ fontSize: '18px', fontWeight: 600, color: 'var(--color-text-primary)' }}>
            365 Days
          </div>
          <span style={{ fontSize: '11.5px', color: 'var(--color-text-muted)', marginTop: '4px' }}>
            Full raw & aggregated telemetry
          </span>
        </BentoCard>
      </div>

      {/* Pricing Tiers Grid */}
      <div>
        <h2 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '14px', color: 'var(--color-text-primary)' }}>
          Subscription Tiers
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '14px' }}>
          {subscriptionPlans.map((plan) => {
            const isCurrent = plan.id === currentPlan;
            return (
              <div
                key={plan.id}
                style={{
                  borderRadius: 'var(--radius-xl)',
                  backgroundColor: 'var(--color-bg-card)',
                  border: isCurrent
                    ? '1.5px solid var(--color-primary)'
                    : '1px solid var(--color-border-subtle)',
                  padding: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '14px',
                  position: 'relative',
                  boxShadow: 'var(--shadow-card)',
                }}
              >
                {plan.popular && !isCurrent && (
                  <span
                    style={{
                      position: 'absolute',
                      top: '12px',
                      right: '12px',
                      fontSize: '10.5px',
                      fontWeight: 600,
                      padding: '2px 7px',
                      borderRadius: 'var(--radius-full)',
                      backgroundColor: 'rgba(0, 116, 228, 0.12)',
                      color: 'var(--color-primary)',
                    }}
                  >
                    Popular
                  </span>
                )}

                <div>
                  <h3 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--color-text-primary)' }}>
                    {plan.name}
                  </h3>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginTop: '6px' }}>
                    <span style={{ fontSize: '24px', fontWeight: 700, color: 'var(--color-text-primary)', letterSpacing: '-0.02em' }}>
                      ${plan.price}
                    </span>
                    <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
                      /{plan.billing}
                    </span>
                  </div>
                </div>

                <div style={{ borderTop: '1px solid var(--color-border-subtle)', paddingTop: '12px' }}>
                  <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {plan.features.map((feat, i) => (
                      <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: 'var(--color-text-secondary)' }}>
                        <IconCheck size={13} color="var(--color-status-success)" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div style={{ marginTop: 'auto', paddingTop: '10px' }}>
                  <button
                    disabled={isCurrent}
                    onClick={() => onUpgradePlan?.(plan.id)}
                    style={{
                      width: '100%',
                      padding: '8px',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: isCurrent ? 'var(--color-bg-elevated)' : 'var(--color-primary)',
                      color: isCurrent ? 'var(--color-text-muted)' : '#FFFFFF',
                      fontWeight: 500,
                      fontSize: '12.5px',
                      cursor: isCurrent ? 'default' : 'pointer',
                      border: isCurrent ? '1px solid var(--color-border-subtle)' : 'none',
                    }}
                  >
                    {isCurrent ? 'Current Plan' : 'Select Plan'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SubscriptionView;
