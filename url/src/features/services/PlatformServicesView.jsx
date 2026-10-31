import React, { useState } from 'react';
import Badge from '../../components/common/Badge';
import CustomQR from '../../components/common/CustomQR';
import {
  IconZap,
  IconGlobe,
  IconBarChart,
  IconQrCode,
  IconShield,
  IconCode,
  IconCheck,
  IconCopy,
  IconExternalLink,
  IconCpu,
  IconTerminal,
  IconLock,
  IconChevronRight,
  IconArrowUpRight,
  IconUsers,
} from '../../components/common/Icons';

export const PlatformServicesView = ({
  onSelectTab,
  onOpenShortener,
  onCreateLink,
  domains = [],
  links = [],
}) => {
  const [quickUrl, setQuickUrl] = useState('');
  const [quickAlias, setQuickAlias] = useState('');
  const [quickDomain, setQuickDomain] = useState(domains[0]?.domain || 'short.io');
  const [createdResult, setCreatedResult] = useState(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [error, setError] = useState('');
  const [securityAllowed, setSecurityAllowed] = useState(true);

  const handleQuickShorten = (e) => {
    e.preventDefault();
    setError('');

    if (!quickUrl.trim()) {
      setError('Please provide a destination URL to shorten.');
      return;
    }

    try {
      new URL(quickUrl);
    } catch {
      setError('Please enter a valid URL including http:// or https://');
      return;
    }

    const shortCode = quickAlias.trim() || Math.random().toString(36).substring(2, 8);
    const newLink = {
      id: `link-${Date.now()}`,
      originalUrl: quickUrl.trim(),
      shortCode,
      customDomain: quickDomain,
      title: quickUrl.replace(/^https?:\/\//, '').split('/')[0],
      createdAt: new Date().toISOString(),
      expiresAt: null,
      isActive: true,
      isPasswordProtected: false,
      folderId: null,
      tags: ['quick-service'],
      clicks: 0,
      uniqueVisitors: 0,
    };

    onCreateLink?.(newLink);
    setCreatedResult(newLink);
    setQuickUrl('');
    setQuickAlias('');
  };

  const fullCreatedUrl = createdResult
    ? `https://${createdResult.customDomain}/${createdResult.shortCode}`
    : '';

  const copyCreatedLink = () => {
    if (!fullCreatedUrl) return;
    navigator.clipboard.writeText(fullCreatedUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const scrollToServices = () => {
    const elem = document.getElementById('platform-services-section');
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '80px', paddingBottom: '60px' }}>
      {/* =========================================================================
          SECTION 1: HERO & INSTANT SERVICE INPUT (Exact match: Screenshot 041212.png)
          ========================================================================= */}
      <section
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          padding: '40px 16px 20px',
          maxWidth: '720px',
          margin: '0 auto',
          width: '100%',
        }}
      >
        {/* Blue Signature M Glyph */}
        <div style={{ marginBottom: '24px' }}>
          <svg width="68" height="68" viewBox="0 0 100 100" fill="none">
            <path
              d="M20 70 C 20 40, 32 25, 45 45 C 55 60, 65 30, 80 50 C 85 58, 80 75, 70 70 C 60 65, 52 48, 45 55 C 38 62, 30 75, 20 70 Z"
              fill="#0074E4"
            />
          </svg>
        </div>

        {/* Big Bold Headline with embedded badge */}
        <h1
          style={{
            fontSize: '44px',
            fontWeight: 700,
            letterSpacing: '-0.03em',
            lineHeight: 1.15,
            color: 'var(--color-text-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          <span>ShortSaaS</span>
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '42px',
              height: '42px',
              borderRadius: '50%',
              backgroundColor: '#EBE5D8',
              fontSize: '22px',
              verticalAlign: 'middle',
            }}
          >
            ⚡
          </span>
          <span>, URL platform that</span>
          <span>accelerates your reach</span>
          <span style={{ fontSize: '36px' }}>🚀</span>
        </h1>

        <p
          style={{
            fontSize: '15px',
            color: 'var(--color-text-muted)',
            marginTop: '28px',
            marginBottom: '16px',
            fontWeight: 500,
          }}
        >
          Shorten a destination link or connect your custom domain
        </p>

        {/* Hero Form with Muse.ai styling */}
        <form
          onSubmit={handleQuickShorten}
          style={{
            width: '100%',
            maxWidth: '520px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
          }}
        >
          <div
            style={{
              backgroundColor: 'var(--color-bg-elevated)',
              border: '1px solid var(--color-border-subtle)',
              borderRadius: 'var(--radius-xl)',
              padding: '6px 14px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <input
              type="url"
              placeholder="Destination URL (e.g. https://mybrand.com/launch)"
              value={quickUrl}
              onChange={(e) => setQuickUrl(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '12px 0',
                background: 'transparent',
                border: 'none',
                color: 'var(--color-text-primary)',
                fontSize: '14.5px',
              }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            <input
              type="text"
              placeholder="Custom alias (optional)"
              value={quickAlias}
              onChange={(e) => setQuickAlias(e.target.value.toLowerCase().replace(/[^a-z0-9-_]/g, ''))}
              style={{
                padding: '10px 14px',
                backgroundColor: 'var(--color-bg-elevated)',
                border: '1px solid var(--color-border-subtle)',
                borderRadius: 'var(--radius-xl)',
                color: 'var(--color-text-primary)',
                fontSize: '13px',
              }}
            />
            <select
              value={quickDomain}
              onChange={(e) => setQuickDomain(e.target.value)}
              style={{
                padding: '10px 14px',
                backgroundColor: 'var(--color-bg-elevated)',
                border: '1px solid var(--color-border-subtle)',
                borderRadius: 'var(--radius-xl)',
                color: 'var(--color-text-primary)',
                fontSize: '13px',
              }}
            >
              {domains.map((d) => (
                <option key={d.id} value={d.domain}>
                  {d.domain}
                </option>
              ))}
            </select>
          </div>

          <span style={{ fontSize: '11.5px', color: 'var(--color-text-muted)', marginTop: '2px' }}>
            High-concurrency Go redirection engine ready. Instant sub-millisecond execution.
          </span>

          {/* Full-width blue pill continue button */}
          <button
            type="submit"
            style={{
              width: '100%',
              padding: '14px',
              borderRadius: 'var(--radius-full)',
              backgroundColor: 'var(--color-primary)',
              color: '#FFFFFF',
              fontSize: '15px',
              fontWeight: 600,
              border: 'none',
              cursor: 'pointer',
              marginTop: '4px',
              transition: 'background-color var(--transition-fast), transform var(--transition-fast)',
            }}
          >
            Continue
          </button>
        </form>

        {error && (
          <div style={{ marginTop: '12px', color: 'var(--color-status-error)', fontSize: '13px' }}>
            {error}
          </div>
        )}

        {/* Live Created Notification */}
        {createdResult && (
          <div
            style={{
              marginTop: '16px',
              width: '100%',
              maxWidth: '520px',
              padding: '12px 16px',
              borderRadius: 'var(--radius-xl)',
              backgroundColor: 'var(--color-bg-paper)',
              border: '1px solid var(--color-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px',
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '2px', minWidth: 0 }}>
              <span style={{ fontSize: '11px', color: 'var(--color-status-success)', fontWeight: 600 }}>
                SHORT URL READY
              </span>
              <span style={{ fontFamily: 'var(--font-code)', fontSize: '13.5px', color: 'var(--color-text-primary)', fontWeight: 600 }}>
                {fullCreatedUrl}
              </span>
            </div>
            <button
              onClick={copyCreatedLink}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                padding: '6px 14px',
                borderRadius: 'var(--radius-full)',
                backgroundColor: copiedLink ? 'var(--color-status-success)' : 'var(--color-primary)',
                color: '#FFFFFF',
                fontSize: '12.5px',
                fontWeight: 500,
                border: 'none',
              }}
            >
              {copiedLink ? <IconCheck size={13} /> : <IconCopy size={13} />}
              {copiedLink ? 'Copied' : 'Copy'}
            </button>
          </div>
        )}

        {/* Dark pill button: Learn more ↓ */}
        <button
          onClick={scrollToServices}
          style={{
            marginTop: '36px',
            padding: '9px 18px',
            borderRadius: 'var(--radius-full)',
            backgroundColor: 'var(--color-bg-elevated)',
            color: 'var(--color-text-primary)',
            fontSize: '13px',
            fontWeight: 500,
            border: '1px solid var(--color-border-subtle)',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          <span>Learn more</span>
          <span>↓</span>
        </button>
      </section>

      {/* =========================================================================
          SECTION 2: "Built around your whole infrastructure" (Screenshot 041233.png)
          ========================================================================= */}
      <section
        id="platform-services-section"
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          maxWidth: '860px',
          margin: '0 auto',
          width: '100%',
        }}
      >
        <h2 style={{ fontSize: '36px', fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--color-text-primary)' }}>
          Built around your whole infrastructure
        </h2>
        <p style={{ fontSize: '14.5px', color: 'var(--color-text-muted)', marginTop: '12px', maxWidth: '640px', lineHeight: 1.5 }}>
          Give ShortSaaS a goal or destination and it handles the rest, from sub-millisecond Go redirects
          to deep engagement telemetry, branded custom domains, and automated QR generation.
        </p>

        {/* White / High-contrast rounded preview container */}
        <div
          style={{
            marginTop: '36px',
            width: '100%',
            maxWidth: '620px',
            backgroundColor: '#FFFFFF',
            borderRadius: '28px',
            padding: '24px 20px',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.4)',
            color: '#111112',
            textAlign: 'left',
          }}
        >
          {/* Header pill bar */}
          <div
            style={{
              height: '24px',
              borderRadius: 'var(--radius-full)',
              backgroundColor: '#F3F4F6',
              margin: '0 auto 18px',
              maxWidth: '240px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '11px',
              color: '#8E9296',
              fontWeight: 500,
            }}
          >
            shorturl.io/gateway
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', padding: '0 6px' }}>
            <span style={{ fontSize: '18px', fontWeight: 700, color: '#111112' }}>Live Routing Stream</span>
            <span style={{ fontSize: '12px', color: '#008332', fontWeight: 600 }}>● Active</span>
          </div>

          {/* Stacked notification-style cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {links.slice(0, 3).map((link, idx) => (
              <div
                key={link.id || idx}
                style={{
                  padding: '14px 16px',
                  borderRadius: '16px',
                  backgroundColor: '#F7F8FA',
                  border: '1px solid #EBECEF',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  cursor: 'pointer',
                  transition: 'transform 0.15s',
                }}
                onClick={() => onSelectTab('links')}
              >
                <div
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '50%',
                    backgroundColor: idx === 0 ? '#E87A90' : idx === 1 ? '#4F8A8B' : '#0074E4',
                    color: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: '13px',
                    flexShrink: 0,
                  }}
                >
                  {link.title ? link.title.substring(0, 2).toUpperCase() : 'LK'}
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <span style={{ fontWeight: 600, fontSize: '13.5px', color: '#111112' }}>
                      {link.title || link.shortCode}
                    </span>
                    <span style={{ fontSize: '11.5px', color: '#707477' }}>
                      {link.clicks.toLocaleString()} clicks &gt;
                    </span>
                  </div>
                  <div style={{ fontSize: '12px', color: '#0074E4', fontWeight: 500, marginTop: '2px' }}>
                    https://{link.customDomain || 'short.io'}/{link.shortCode}
                  </div>
                  <div style={{ fontSize: '11.5px', color: '#707477', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginTop: '2px' }}>
                    routes to {link.originalUrl}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 3: "Every link routes through our sub-millisecond Go engine" (Screenshot 041248.png)
          ========================================================================= */}
      <section
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
          gap: '48px',
          alignItems: 'center',
          maxWidth: '1060px',
          margin: '0 auto',
          width: '100%',
        }}
      >
        {/* Left: Device Simulator Mockup */}
        <div
          style={{
            backgroundColor: 'var(--color-bg-paper)',
            border: '1px solid var(--color-border-subtle)',
            borderRadius: '28px',
            padding: '24px',
            boxShadow: 'var(--shadow-card)',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
            maxWidth: '420px',
            margin: '0 auto',
            width: '100%',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--color-status-success)' }} />
              <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-text-primary)' }}>
                Go Redirect Engine v1.23
              </span>
            </div>
            <Badge variant="success" size="sm">0.8ms</Badge>
          </div>

          {/* Simulated prompt bubbles */}
          <div
            style={{
              padding: '12px 14px',
              borderRadius: '16px',
              backgroundColor: 'var(--color-bg-elevated)',
              fontSize: '12.5px',
              color: 'var(--color-text-secondary)',
              lineHeight: 1.4,
            }}
          >
            Redirect requested for <strong>short.io/launch</strong>. Looking up memory cache...
          </div>

          <div
            style={{
              alignSelf: 'flex-end',
              padding: '10px 16px',
              borderRadius: 'var(--radius-full)',
              backgroundColor: 'var(--color-primary)',
              color: '#FFFFFF',
              fontSize: '13px',
              fontWeight: 500,
            }}
          >
            HTTP 302 Found → https://target.com
          </div>

          {/* Interactive Benchmark Card */}
          <div
            style={{
              padding: '14px',
              borderRadius: '16px',
              backgroundColor: 'var(--color-bg-default)',
              border: '1px solid var(--color-border-subtle)',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
              <span style={{ color: 'var(--color-text-muted)' }}>Throughput Benchmarking</span>
              <span style={{ color: 'var(--color-status-success)', fontWeight: 600 }}>124,500 req/sec</span>
            </div>
            <div style={{ height: '4px', backgroundColor: 'var(--color-bg-elevated)', borderRadius: '2px', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: '92%', backgroundColor: 'var(--color-primary)' }} />
            </div>
            <button
              onClick={() => onSelectTab('dashboard')}
              style={{
                width: '100%',
                padding: '8px',
                borderRadius: 'var(--radius-full)',
                backgroundColor: 'var(--color-bg-elevated)',
                color: 'var(--color-text-primary)',
                fontSize: '12px',
                fontWeight: 600,
                border: 'none',
                marginTop: '4px',
                cursor: 'pointer',
              }}
            >
              Open Redirection Telemetry
            </button>
          </div>
        </div>

        {/* Right: Large Typography */}
        <div>
          <h2 style={{ fontSize: '36px', fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--color-text-primary)', lineHeight: 1.2 }}>
            Every link routes through our sub-millisecond Go engine in the cloud.
          </h2>
          <p style={{ fontSize: '14.5px', color: 'var(--color-text-muted)', marginTop: '16px', lineHeight: 1.6 }}>
            ShortSaaS Redirect Engine is a persistent, compiled microservice built with Go 1.23.
            It evaluates aliases in-memory with zero garbage collection overhead, resolving targets
            in under 1 millisecond and streaming telemetry asynchronously to PostgreSQL.
          </p>
        </div>
      </section>

      {/* =========================================================================
          SECTION 4: "Designed around the way you communicate" (Screenshot 041309.png)
          ========================================================================= */}
      <section
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
          gap: '48px',
          alignItems: 'center',
          maxWidth: '1060px',
          margin: '0 auto',
          width: '100%',
        }}
      >
        {/* Left: Typography */}
        <div>
          <h2 style={{ fontSize: '36px', fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--color-text-primary)', lineHeight: 1.2 }}>
            Designed around the way your audience engages
          </h2>
          <p style={{ fontSize: '14.5px', color: 'var(--color-text-muted)', marginTop: '16px', lineHeight: 1.6 }}>
            Deploy your shortened links seamlessly across email newsletters, SMS alerts, social cards,
            or vector QR codes for physical print. There is no learning curve — just share and monitor results.
          </p>
        </div>

        {/* Right: QR Studio Device Mockup */}
        <div
          style={{
            backgroundColor: 'var(--color-bg-paper)',
            border: '1px solid var(--color-border-subtle)',
            borderRadius: '28px',
            padding: '24px',
            boxShadow: 'var(--shadow-card)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '16px',
            maxWidth: '380px',
            margin: '0 auto',
            width: '100%',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '12.5px', fontWeight: 600, color: 'var(--color-text-primary)' }}>
              Branded QR Vector
            </span>
            <Badge variant="info" size="sm">Vector SVG</Badge>
          </div>

          <CustomQR
            value="https://short.io/demo"
            size={180}
            fgColor="var(--color-primary)"
            bgColor="var(--color-bg-elevated)"
          />

          <button
            onClick={() => onSelectTab('qrcodes')}
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: 'var(--radius-full)',
              backgroundColor: 'var(--color-primary)',
              color: '#FFFFFF',
              fontSize: '12.5px',
              fontWeight: 600,
              border: 'none',
              cursor: 'pointer',
            }}
          >
            Launch QR Code Studio →
          </button>
        </div>
      </section>

      {/* =========================================================================
          SECTION 5: "Stay in control of what your short links do" (Screenshot 041325.png)
          ========================================================================= */}
      <section
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
          gap: '48px',
          alignItems: 'center',
          maxWidth: '1060px',
          margin: '0 auto',
          width: '100%',
        }}
      >
        {/* Left: Security & Action Approval Card */}
        <div
          style={{
            backgroundColor: 'var(--color-bg-paper)',
            border: '1px solid var(--color-border-subtle)',
            borderRadius: '28px',
            padding: '24px',
            boxShadow: 'var(--shadow-card)',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
            maxWidth: '380px',
            margin: '0 auto',
            width: '100%',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <IconShield size={16} color="var(--color-primary)" />
            <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text-primary)' }}>
              Security & Policy Enforcement
            </span>
          </div>

          <div
            style={{
              padding: '14px',
              borderRadius: '16px',
              backgroundColor: 'var(--color-bg-elevated)',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              fontSize: '12.5px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--color-text-muted)' }}>Target:</span>
              <span style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>partner.corp/deal</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--color-text-muted)' }}>Protection:</span>
              <span style={{ color: 'var(--color-status-success)', fontWeight: 600 }}>Bcrypt Passcode</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--color-text-muted)' }}>Expiration:</span>
              <span style={{ color: 'var(--color-text-primary)' }}>30 Days</span>
            </div>
          </div>

          {/* Exact pill action buttons: Allow (Blue) & Deny (Dark) */}
          <button
            onClick={() => setSecurityAllowed(true)}
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: 'var(--radius-full)',
              backgroundColor: securityAllowed ? 'var(--color-primary)' : 'var(--color-bg-elevated)',
              color: '#FFFFFF',
              fontSize: '13.5px',
              fontWeight: 600,
              border: 'none',
              cursor: 'pointer',
            }}
          >
            Allow Redirection
          </button>
          <button
            onClick={() => setSecurityAllowed(false)}
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: 'var(--radius-full)',
              backgroundColor: !securityAllowed ? 'var(--color-status-error)' : 'var(--color-bg-elevated)',
              color: '#FFFFFF',
              fontSize: '13.5px',
              fontWeight: 600,
              border: 'none',
              cursor: 'pointer',
            }}
          >
            Deny & Block Alias
          </button>
        </div>

        {/* Right: Typography */}
        <div>
          <h2 style={{ fontSize: '36px', fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--color-text-primary)', lineHeight: 1.2 }}>
            Stay in control of what your short links do
          </h2>
          <p style={{ fontSize: '14.5px', color: 'var(--color-text-muted)', marginTop: '16px', lineHeight: 1.6 }}>
            Set access controls before campaigns go live, including password gates and expiration dates.
            Maintain a comprehensive audit trail of every visitor redirect, device fingerprint, and policy event.
          </p>
        </div>
      </section>

      {/* =========================================================================
          SECTION 6: "Learn more about our services" (Screenshot 041402.png)
          ========================================================================= */}
      <section
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '40px',
          alignItems: 'flex-start',
          maxWidth: '1060px',
          margin: '0 auto',
          width: '100%',
        }}
      >
        <div>
          <h2 style={{ fontSize: '36px', fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--color-text-primary)', lineHeight: 1.2 }}>
            Learn more about ShortSaaS
          </h2>
          <p style={{ fontSize: '14.5px', color: 'var(--color-text-muted)', marginTop: '14px', lineHeight: 1.5 }}>
            Explore the architectural choices behind our URL Shortener SaaS and how our high-throughput
            infrastructure is built to guarantee 99.99% uptime.
          </p>
        </div>

        {/* Stack of 3 rounded cards matching Screenshot 041402.png */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {/* Card 1 */}
          <div
            onClick={() => onSelectTab('dashboard')}
            style={{
              padding: '20px 22px',
              borderRadius: '20px',
              backgroundColor: 'var(--color-bg-paper)',
              border: '1px solid var(--color-border-subtle)',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '16px',
              cursor: 'pointer',
              boxShadow: 'var(--shadow-card)',
              transition: 'border-color var(--transition-fast)',
            }}
          >
            <div style={{ marginTop: '2px', color: 'var(--color-primary)' }}>
              <IconCpu size={20} />
            </div>
            <div style={{ flex: 1 }}>
              <h4 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--color-text-primary)' }}>
                How We Designed The Go Gateway
              </h4>
              <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', marginTop: '4px', lineHeight: 1.4 }}>
                Sub-millisecond latency, in-memory LRU routing cache, and asynchronous Redis click stream.
              </p>
            </div>
            <div style={{ color: 'var(--color-text-muted)', marginTop: '2px' }}>
              <IconChevronRight size={18} />
            </div>
          </div>

          {/* Card 2 */}
          <div
            onClick={() => onSelectTab('admin')}
            style={{
              padding: '20px 22px',
              borderRadius: '20px',
              backgroundColor: 'var(--color-bg-paper)',
              border: '1px solid var(--color-border-subtle)',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '16px',
              cursor: 'pointer',
              boxShadow: 'var(--shadow-card)',
              transition: 'border-color var(--transition-fast)',
            }}
          >
            <div style={{ marginTop: '2px', color: 'var(--color-status-success)' }}>
              <IconShield size={20} />
            </div>
            <div style={{ flex: 1 }}>
              <h4 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--color-text-primary)' }}>
                How We Built Safety Into Every Redirect
              </h4>
              <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', marginTop: '4px', lineHeight: 1.4 }}>
                SSRF destination blacklists, Bcrypt passcodes, and automated rate-limiting.
              </p>
            </div>
            <div style={{ color: 'var(--color-text-muted)', marginTop: '2px' }}>
              <IconChevronRight size={18} />
            </div>
          </div>

          {/* Card 3 */}
          <div
            onClick={() => onSelectTab('domains')}
            style={{
              padding: '20px 22px',
              borderRadius: '20px',
              backgroundColor: 'var(--color-bg-paper)',
              border: '1px solid var(--color-border-subtle)',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '16px',
              cursor: 'pointer',
              boxShadow: 'var(--shadow-card)',
              transition: 'border-color var(--transition-fast)',
            }}
          >
            <div style={{ marginTop: '2px', color: 'var(--color-primary)' }}>
              <IconGlobe size={20} />
            </div>
            <div style={{ flex: 1 }}>
              <h4 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--color-text-primary)' }}>
                ShortSaaS for Business & Custom Domains
              </h4>
              <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', marginTop: '4px', lineHeight: 1.4 }}>
                Custom apex and subdomain CNAME routing with automated TLS certificate management.
              </p>
            </div>
            <div style={{ color: 'var(--color-text-muted)', marginTop: '2px' }}>
              <IconChevronRight size={18} />
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 7: CTA & FOOTER (Exact match: Screenshot 041416.png)
          ========================================================================= */}
      <section
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          padding: '60px 16px 20px',
          maxWidth: '680px',
          margin: '0 auto',
          width: '100%',
        }}
      >
        <h2 style={{ fontSize: '38px', fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--color-text-primary)' }}>
          Ready to try ShortSaaS?
        </h2>

        {/* Big blue pill button */}
        <button
          onClick={() => onSelectTab('dashboard')}
          style={{
            marginTop: '24px',
            padding: '14px 42px',
            borderRadius: 'var(--radius-full)',
            backgroundColor: 'var(--color-primary)',
            color: '#FFFFFF',
            fontSize: '15px',
            fontWeight: 600,
            border: 'none',
            cursor: 'pointer',
          }}
        >
          Open Workspace Dashboard
        </button>

        {/* Minimal Footer matching Screenshot 041416.png */}
        <footer
          style={{
            marginTop: '80px',
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '16px',
            fontSize: '12px',
            color: 'var(--color-text-muted)',
            borderTop: '1px solid var(--color-border-subtle)',
            paddingTop: '24px',
          }}
        >
          <span>© ShortSaaS 2026</span>
          <div style={{ display: 'flex', gap: '20px' }}>
            <span>Privacy Policy</span>
            <span>Cookie Policy</span>
            <span>Terms</span>
          </div>
          <span style={{ color: 'var(--color-text-secondary)', fontWeight: 500 }}>
            Powered by Go & PostgreSQL
          </span>
        </footer>
      </section>
    </div>
  );
};

export default PlatformServicesView;
