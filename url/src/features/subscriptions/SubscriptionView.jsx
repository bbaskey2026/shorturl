import React, { useState } from 'react';
import BentoCard from '../../components/common/BentoCard';
import Badge from '../../components/common/Badge';
import {
  IconCreditCard,
  IconCheck,
  IconZap,
  IconGlobe,
  IconLink,
  IconBarChart,
} from '../../components/common/Icons';
import { subscriptionPlans } from '../../services/mockData';

export const SubscriptionView = ({ currentPlan = 'pro', onUpgradePlan }) => {
  const [billingCycle, setBillingCycle] = useState('monthly'); // monthly, annual

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: 700, color: 'var(--color-text-primary)' }}>
            Subscription & Quota Management
          </h1>
          <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', marginTop: '2px' }}>
            Scale redirection throughput, high-volume click capacity, and custom domains as your business expands.
          </p>
        </div>

        {/* Current Plan Indicator */}
        <Badge variant="purple" size="md">
          Current Plan: {currentPlan.toUpperCase()}
        </Badge>
      </div>

      {/* Usage Quota Bento Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
        <BentoCard title="Shortened Links" subtitle="Allocated link capacity">
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '8px' }}>
            <span style={{ fontWeight: 600 }}>2,100 / 5,000</span>
            <span style={{ color: 'var(--color-text-muted)' }}>42%</span>
          </div>
          <div style={{ height: '6px', backgroundColor: 'var(--color-bg-elevated)', borderRadius: '3px', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: '42%', backgroundColor: 'var(--color-primary)' }} />
          </div>
        </BentoCard>

        <BentoCard title="Monthly Clicks" subtitle="High-throughput Go redirection events">
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '8px' }}>
            <span style={{ fontWeight: 600 }}>48,534 / 250,000</span>
            <span style={{ color: 'var(--color-text-muted)' }}>19.4%</span>
          </div>
          <div style={{ height: '6px', backgroundColor: 'var(--color-bg-elevated)', borderRadius: '3px', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: '19.4%', backgroundColor: 'var(--color-secondary)' }} />
          </div>
        </BentoCard>

        <BentoCard title="Custom Domains" subtitle="Verified branded DNS routing">
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '8px' }}>
            <span style={{ fontWeight: 600 }}>2 / 5</span>
            <span style={{ color: 'var(--color-text-muted)' }}>40%</span>
          </div>
          <div style={{ height: '6px', backgroundColor: 'var(--color-bg-elevated)', borderRadius: '3px', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: '40%', backgroundColor: '#10B981' }} />
          </div>
        </BentoCard>

        <BentoCard title="Analytics Retention" subtitle="Granular event history in PostgreSQL">
          <div style={{ fontSize: '20px', fontWeight: 700, color: 'var(--color-text-primary)' }}>
            365 Days
          </div>
          <span style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginTop: '4px' }}>
            Full raw & aggregated telemetry
          </span>
        </BentoCard>
      </div>

      {/* Pricing Tiers Grid */}
      <div>
        <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '16px', color: 'var(--color-text-primary)' }}>
          Available Subscription Tiers
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
          {subscriptionPlans.map((plan) => {
            const isCurrent = plan.id === currentPlan;
            return (
              <div
                key={plan.id}
                style={{
                  borderRadius: 'var(--radius-lg)',
                  backgroundColor: 'var(--color-bg-card)',
                  border: isCurrent
                    ? '2px solid var(--color-primary)'
                    : plan.popular
                    ? '1px solid rgba(59, 130, 246, 0.4)'
                    : '1px solid var(--color-border-subtle)',
                  padding: '24px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px',
                  position: 'relative',
                  boxShadow: isCurrent ? 'var(--shadow-card-hover)' : 'var(--shadow-card)',
                }}
              >
                {plan.popular && !isCurrent && (
                  <span
                    style={{
                      position: 'absolute',
                      top: '12px',
                      right: '12px',
                      fontSize: '11px',
                      fontWeight: 600,
                      padding: '2px 8px',
                      borderRadius: 'var(--radius-full)',
                      backgroundColor: 'rgba(59, 130, 246, 0.15)',
                      color: 'var(--color-primary-light)',
                    }}
                  >
                    Popular
                  </span>
                )}

                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--color-text-primary)' }}>
                    {plan.name}
                  </h3>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginTop: '8px' }}>
                    <span style={{ fontSize: '28px', fontWeight: 800, color: 'var(--color-text-primary)' }}>
                      ${plan.price}
                    </span>
                    <span style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>
                      /{plan.billing}
                    </span>
                  </div>
                </div>

                <div style={{ borderTop: '1px solid var(--color-border-subtle)', paddingTop: '16px' }}>
                  <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {plan.features.map((feat, i) => (
                      <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12.5px', color: 'var(--color-text-secondary)' }}>
                        <IconCheck size={14} color="#10B981" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div style={{ marginTop: 'auto', paddingTop: '12px' }}>
                  <button
                    disabled={isCurrent}
                    onClick={() => onUpgradePlan?.(plan.id)}
                    style={{
                      width: '100%',
                      padding: '10px',
                      borderRadius: '8px',
                      backgroundColor: isCurrent ? 'var(--color-bg-elevated)' : 'var(--color-primary)',
                      color: isCurrent ? 'var(--color-text-muted)' : 'white',
                      fontWeight: 600,
                      fontSize: '13px',
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

