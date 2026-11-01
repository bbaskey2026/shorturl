import React, { useState } from 'react';
import { CustomQR } from '../../components/common/CustomQR';
import {
  IconLink,
  IconCopy,
  IconCheck,
  IconExternalLink,
  IconDownload,
  IconZap,
  IconGlobe,
  IconQrCode,
  IconShield,
  IconBarChart,
  IconUsers,
  IconArrowUpRight,
  IconChevronDown,
  IconChevronUp,
} from '../../components/common/Icons';

export const LandingShowcaseView = ({
  onSelectTab,
  onOpenShortener,
  onCreateLink,
  onOpenAuth,
  links = [],
  domains = ['shortie.link', 'tinu.be', 'short.io'],
}) => {
  // Hero Instant Shortener state (from Image 1 & Image 2)
  const [longUrl, setLongUrl] = useState('');
  const [customSuffix, setCustomSuffix] = useState('');
  const [selectedDomain, setSelectedDomain] = useState(domains[0] || 'shortie.link');
  const [createdShortLink, setCreatedShortLink] = useState(null);
  const [copied, setCopied] = useState(false);
  const [isShortening, setIsShortening] = useState(false);

  // How We Work Interactive Tabs (from Image 1)
  const [activeStep, setActiveStep] = useState(0);

  // FAQ Accordion (from Image 2)
  const [expandedFaq, setExpandedFaq] = useState(0);

  const steps = [
    { id: 0, title: 'Put Link', desc: 'Paste any long URL, marketing link, or campaign destination' },
    { id: 1, title: 'Click Shortener', desc: 'Generate an instant sub-10ms redirection short code' },
    { id: 2, title: 'Create Custom URL', desc: 'Attach your branded domain and personalized readable alias' },
    { id: 3, title: 'Create QR Code', desc: 'Export dynamic vector SVG & high-res PNG QR codes' },
    { id: 4, title: 'Put Tracker Link', desc: 'Deploy with UTM parameters and monitor real-time conversions' },
  ];

  const faqs = [
    {
      q: 'How does custom domain shortening work?',
      a: 'You can connect any domain or subdomain (e.g. go.yourbrand.com) via standard CNAME or A records. Our edge routing network automatically verifies DNS TXT records, issues an SSL certificate, and routes clicks with zero latency.',
    },
    {
      q: 'Can I customize the generated QR Codes?',
      a: 'Yes! Our built-in QR Studio lets you customize foreground colors, background contrast, finder pattern margins, and download high-resolution PNG or vector SVG files ready for print and digital campaigns.',
    },
    {
      q: 'What detailed click analytics are captured?',
      a: 'For every click, we log geographic country and city, referrer source (Twitter, LinkedIn, Google), operating system, browser engine, device type, and timestamp, all aggregated into real-time interactive charts.',
    },
    {
      q: 'Can I set password protection and link expiration?',
      a: 'Absolutely. You can set expiration dates, click quotas, or secure links with password authentication so only authorized users can access the target destination.',
    },
    {
      q: 'Is there an API for automated high-volume shortening?',
      a: 'Yes, our platform provides a RESTful API with JWT bearer authentication, enabling your backend services and bots to programmatically shorten links, generate QR codes, and read analytics.',
    },
  ];

  const handleQuickShorten = (e) => {
    e.preventDefault();
    if (!longUrl || !longUrl.trim()) return;

    setIsShortening(true);

    setTimeout(() => {
      let cleanUrl = longUrl.trim();
      if (!cleanUrl.startsWith('http://') && !cleanUrl.startsWith('https://')) {
        cleanUrl = 'https://' + cleanUrl;
      }

      const shortCode = customSuffix.trim()
        ? customSuffix.trim().replace(/[^a-zA-Z0-9-_]/g, '')
        : Math.random().toString(36).substring(2, 8);

      const newLinkObj = {
        id: `link-${Date.now()}`,
        originalUrl: cleanUrl,
        shortCode,
        customDomain: selectedDomain,
        title: customSuffix ? `Branded /${customSuffix}` : 'Quick Short Link',
        createdAt: new Date().toISOString(),
        clicks: 0,
        uniqueVisitors: 0,
        isActive: true,
        tags: ['quick', 'landing'],
      };

      if (typeof onCreateLink === 'function') {
        onCreateLink(newLinkObj);
      }

      setCreatedShortLink(newLinkObj);
      setIsShortening(false);
    }, 400);
  };

  const copyCreatedLink = () => {
    if (!createdShortLink) return;
    const url = `https://${createdShortLink.customDomain}/${createdShortLink.shortCode}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '48px', margin: '-10px -8px' }}>
      {/* ──────────────────────────────────────────────────────────────────────────
          SECTION 1: HERO SECTION (Shortie + Tinu.be Hybrid Hero)
          ────────────────────────────────────────────────────────────────────────── */}
      <section
        style={{
          borderRadius: 'var(--radius-2xl)',
          padding: '44px 36px',
          background: 'linear-gradient(145deg, var(--color-bg-paper) 0%, var(--color-bg-surface) 100%)',
          border: '1px solid var(--color-border-subtle)',
          boxShadow: 'var(--shadow-card)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Subtle decorative glow */}
        <div
          style={{
            position: 'absolute',
            top: '-120px',
            right: '-120px',
            width: '380px',
            height: '380px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(0, 85, 255, 0.15) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '36px', alignItems: 'center' }}>
          {/* Left Hero Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', zIndex: 1 }}>
            {/* Pill Tag */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 14px',
                borderRadius: '9999px',
                background: 'rgba(0, 85, 255, 0.10)',
                border: '1px solid rgba(0, 85, 255, 0.25)',
                color: 'var(--color-primary)',
                fontSize: '12px',
                fontWeight: 600,
                width: 'fit-content',
                letterSpacing: '0.01em',
              }}
            >
              <span>✨ Let's make link simply one click</span>
              <span style={{ opacity: 0.7 }}>• Now with 100k+ users</span>
            </div>

            {/* Big Bold Headline */}
            <h1
              style={{
                fontSize: 'clamp(28px, 4.2vw, 44px)',
                fontWeight: 800,
                lineHeight: 1.15,
                letterSpacing: '-0.03em',
                color: 'var(--color-text-primary)',
                margin: 0,
              }}
            >
              BIO LINK & LINK SHORTENER <span style={{ color: 'var(--color-primary)' }}>♾️</span> FOR BUSINESS NEEDS
            </h1>

            {/* Subtitle */}
            <p
              style={{
                fontSize: '15px',
                lineHeight: 1.6,
                color: 'var(--color-text-secondary)',
                margin: 0,
                maxWidth: '520px',
              }}
            >
              One single platform: you'll find all the tools you need to connect audiences worldwide,
              manage links, generate dynamic QR codes, customize branded domains, and create lasting brand relationships.
            </p>

            {/* CTAs */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
              <button
                onClick={() => (typeof onOpenAuth === 'function' ? onOpenAuth('register') : onSelectTab('links'))}
                style={{
                  padding: '12px 24px',
                  borderRadius: '9999px',
                  backgroundColor: 'var(--color-primary)',
                  color: '#ffffff',
                  fontWeight: 600,
                  fontSize: '14px',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 14px rgba(0, 85, 255, 0.35)',
                  transition: 'transform 0.15s ease',
                }}
              >
                <span>Get Started For Free</span>
                <IconZap size={16} />
              </button>

              <button
                onClick={() => onSelectTab('dashboard')}
                style={{
                  padding: '12px 22px',
                  borderRadius: '9999px',
                  backgroundColor: 'transparent',
                  color: 'var(--color-text-primary)',
                  fontWeight: 500,
                  fontSize: '14px',
                  border: '1px solid var(--color-border-medium)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <span>View Dashboard</span>
                <IconArrowUpRight size={15} />
              </button>
            </div>

            {/* Social Proof */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginTop: '6px' }}>
              <div style={{ display: 'flex', marginLeft: '4px' }}>
                {['#2563eb', '#10b981', '#f59e0b', '#8b5cf6'].map((c, i) => (
                  <div
                    key={i}
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      background: c,
                      border: '2px solid var(--color-bg-paper)',
                      marginLeft: i > 0 ? '-8px' : '0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#ffffff',
                      fontSize: '10px',
                      fontWeight: 700,
                    }}
                  >
                    {String.fromCharCode(65 + i)}
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-text-primary)' }}>
                  ⭐⭐⭐⭐⭐ 4.8 / 5.0
                </span>
                <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
                  from 800+ customer reviews worldwide
                </span>
              </div>
            </div>
          </div>

          {/* Right Hero Visual Cards (QR Code + Custom Link Preview from Image 1) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', zIndex: 1 }}>
            {/* Top Card: QR Code Preview */}
            <div
              style={{
                borderRadius: 'var(--radius-xl)',
                background: 'var(--color-bg-paper)',
                border: '1px solid var(--color-border-subtle)',
                padding: '20px',
                boxShadow: 'var(--shadow-card)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '16px',
              }}
            >
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                <div
                  style={{
                    padding: '8px',
                    borderRadius: 'var(--radius-md)',
                    background: '#ffffff',
                    border: '1px solid var(--color-border-subtle)',
                    display: 'flex',
                  }}
                >
                  <CustomQR value="https://shortie.link/launch2026" size={84} fgColor="#0F1424" bgColor="#FFFFFF" />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    DYNAMIC QR CODE
                  </span>
                  <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-text-primary)' }}>
                    shortie.link/launch2026
                  </span>
                  <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
                    Active • 1,420 Scans logged
                  </span>
                </div>
              </div>

              <button
                onClick={() => onSelectTab('qrcodes')}
                style={{
                  padding: '8px 14px',
                  borderRadius: '9999px',
                  background: 'var(--color-primary)',
                  border: 'none',
                  color: '#ffffff',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  whiteSpace: 'nowrap',
                }}
              >
                <IconDownload size={13} />
                <span>Download</span>
              </button>
            </div>

            {/* Bottom Card: Custom Your Link Card */}
            <div
              style={{
                borderRadius: 'var(--radius-xl)',
                background: 'var(--color-bg-paper)',
                border: '1px solid var(--color-border-subtle)',
                padding: '20px',
                boxShadow: 'var(--shadow-card)',
                display: 'flex',
                flexDirection: 'column',
                gap: '14px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  CUSTOM YOUR LINK PREVIEW
                </span>
                <span
                  style={{
                    padding: '4px 10px',
                    borderRadius: '9999px',
                    background: 'rgba(16, 185, 129, 0.12)',
                    color: 'var(--color-status-success)',
                    fontSize: '11px',
                    fontWeight: 600,
                  }}
                >
                  SSL VERIFIED
                </span>
              </div>

              {/* Browser bar mockup */}
              <div
                style={{
                  padding: '12px 14px',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--color-bg-elevated)',
                  border: '1px solid var(--color-border-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                }}
              >
                <div style={{ display: 'flex', gap: '5px' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#EF4444' }} />
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#F59E0B' }} />
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10B981' }} />
                </div>
                <div style={{ flex: 1, fontSize: '12px', color: 'var(--color-text-primary)', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  https://brand.shortie.link/black-friday-deal
                </div>
                <div
                  style={{
                    width: '26px',
                    height: '26px',
                    borderRadius: '50%',
                    background: 'var(--color-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#ffffff',
                  }}
                >
                  <IconLink size={13} />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', color: 'var(--color-text-muted)' }}>
                <span>Target: https://marketing.agency.com/2026-promo</span>
                <span style={{ color: 'var(--color-primary)', fontWeight: 600 }}>98.6% CTR</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Direct Hero Shortener Bar (Image 2 Tinu.be Style Input) ── */}
        <div
          style={{
            marginTop: '36px',
            padding: '18px 20px',
            borderRadius: 'var(--radius-xl)',
            background: 'var(--color-bg-card)',
            border: '1px solid var(--color-border-medium)',
            boxShadow: '0 8px 30px rgba(0, 0, 0, 0.25)',
          }}
        >
          <form onSubmit={handleQuickShorten} style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center' }}>
            {/* Long URL Input */}
            <div style={{ flex: '2 1 240px', display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--color-bg-surface)', padding: '10px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border-subtle)' }}>
              <IconLink size={16} color="var(--color-primary)" />
              <input
                type="text"
                placeholder="Paste your long link here (e.g. https://website.com/long-page)..."
                value={longUrl}
                onChange={(e) => setLongUrl(e.target.value)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: 'var(--color-text-primary)',
                  fontSize: '13.5px',
                  width: '100%',
                }}
              />
            </div>

            {/* Custom Suffix Input */}
            <div style={{ flex: '1 1 140px', display: 'flex', alignItems: 'center', gap: '6px', background: 'var(--color-bg-surface)', padding: '10px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border-subtle)' }}>
              <span style={{ color: 'var(--color-text-muted)', fontSize: '13px' }}>/</span>
              <input
                type="text"
                placeholder="custom-suffix"
                value={customSuffix}
                onChange={(e) => setCustomSuffix(e.target.value)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: 'var(--color-text-primary)',
                  fontSize: '13.5px',
                  width: '100%',
                }}
              />
            </div>

            {/* Domain Dropdown */}
            <select
              value={selectedDomain}
              onChange={(e) => setSelectedDomain(e.target.value)}
              style={{
                background: 'var(--color-bg-surface)',
                border: '1px solid var(--color-border-subtle)',
                borderRadius: 'var(--radius-md)',
                color: 'var(--color-text-primary)',
                padding: '10px 14px',
                fontSize: '13px',
                outline: 'none',
                cursor: 'pointer',
              }}
            >
              {domains.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isShortening || !longUrl.trim()}
              style={{
                padding: '11px 24px',
                borderRadius: 'var(--radius-md)',
                background: 'var(--color-primary)',
                border: 'none',
                color: '#ffffff',
                fontWeight: 600,
                fontSize: '13.5px',
                cursor: isShortening || !longUrl.trim() ? 'not-allowed' : 'pointer',
                opacity: !longUrl.trim() ? 0.6 : 1,
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                whiteSpace: 'nowrap',
              }}
            >
              <span>{isShortening ? 'Shortening...' : 'Shorten URL'}</span>
              <IconArrowUpRight size={15} />
            </button>
          </form>

          {/* Quick Result Preview if generated */}
          {createdShortLink && (
            <div
              style={{
                marginTop: '16px',
                paddingTop: '16px',
                borderTop: '1px solid var(--color-border-subtle)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '12px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '12px', color: 'var(--color-status-success)', fontWeight: 600 }}>✓ Link Ready:</span>
                <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-primary)' }}>
                  https://{createdShortLink.customDomain}/{createdShortLink.shortCode}
                </span>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={copyCreatedLink}
                  style={{
                    padding: '7px 14px',
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--color-bg-elevated)',
                    border: '1px solid var(--color-border-subtle)',
                    color: 'var(--color-text-primary)',
                    fontSize: '12px',
                    fontWeight: 500,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  {copied ? <IconCheck size={14} color="var(--color-status-success)" /> : <IconCopy size={14} />}
                  <span>{copied ? 'Copied!' : 'Copy Link'}</span>
                </button>
                <button
                  onClick={() => onSelectTab('links')}
                  style={{
                    padding: '7px 14px',
                    borderRadius: 'var(--radius-md)',
                    background: 'transparent',
                    border: '1px solid var(--color-border-subtle)',
                    color: 'var(--color-text-secondary)',
                    fontSize: '12px',
                    cursor: 'pointer',
                  }}
                >
                  Manage in Dashboard →
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────────────────────
          SECTION 2: MARQUEE TICKER BANNER (Electric Blue from Image 1)
          ────────────────────────────────────────────────────────────────────────── */}
      <div
        style={{
          background: 'var(--color-primary)',
          color: '#ffffff',
          padding: '12px 0',
          borderRadius: 'var(--radius-md)',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          boxShadow: '0 4px 18px rgba(0, 85, 255, 0.3)',
        }}
      >
        <div
          style={{
            display: 'flex',
            gap: '32px',
            whiteSpace: 'nowrap',
            fontWeight: 800,
            fontSize: '13px',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            animation: 'marquee 25s linear infinite',
          }}
        >
          <span>✦ SHORTLINK</span>
          <span>•</span>
          <span>MICROSERVE</span>
          <span>•</span>
          <span>CUSTOM LINK</span>
          <span>•</span>
          <span>MANAGE</span>
          <span>•</span>
          <span>QR CODES</span>
          <span>•</span>
          <span>REAL-TIME ANALYTICS</span>
          <span>•</span>
          <span>BRANDED DOMAINS</span>
          <span>•</span>
          <span>SHORTLINK</span>
          <span>•</span>
          <span>SSRF SECURED</span>
          <span>•</span>
          <span>HIGH-CONVERSION BIO LINKS</span>
        </div>
      </div>

      {/* ──────────────────────────────────────────────────────────────────────────
          SECTION 3: HOW WE WORK (5-Step Interactive Showcase from Image 1)
          ────────────────────────────────────────────────────────────────────────── */}
      <section
        style={{
          borderRadius: 'var(--radius-2xl)',
          background: 'var(--color-bg-card)',
          border: '1px solid var(--color-border-subtle)',
          padding: '40px 32px',
          boxShadow: 'var(--shadow-card)',
          display: 'flex',
          flexDirection: 'column',
          gap: '28px',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h2 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--color-text-primary)', margin: 0 }}>
              HOW WE WORK <span style={{ fontSize: '20px' }}>👇</span>
            </h2>
            <p style={{ fontSize: '13.5px', color: 'var(--color-text-secondary)', marginTop: '6px', margin: 0 }}>
              All the products you need to build brand connections, manage links and QR Codes, and connect with audiences.
            </p>
          </div>

          {/* 5-Step Buttons */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {steps.map((s, idx) => (
              <button
                key={s.id}
                onClick={() => setActiveStep(idx)}
                style={{
                  padding: '7px 14px',
                  borderRadius: '9999px',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  border: activeStep === idx ? 'none' : '1px solid var(--color-border-subtle)',
                  background: activeStep === idx ? 'var(--color-primary)' : 'var(--color-bg-surface)',
                  color: activeStep === idx ? '#ffffff' : 'var(--color-text-secondary)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'all 0.15s ease',
                }}
              >
                <span
                  style={{
                    width: '18px',
                    height: '18px',
                    borderRadius: '50%',
                    background: activeStep === idx ? 'rgba(255, 255, 255, 0.25)' : 'var(--color-border-medium)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '10px',
                  }}
                >
                  {idx + 1}
                </span>
                <span>{s.title}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Dashboard Showcase Preview Box (Exact layout from Image 1 showcase) */}
        <div
          style={{
            borderRadius: 'var(--radius-xl)',
            background: 'var(--color-bg-paper)',
            border: '1px solid var(--color-border-subtle)',
            padding: '24px',
            boxShadow: 'inset 0 1px 3px rgba(0, 0, 0, 0.2)',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '24px',
          }}
        >
          {/* Performance & Charts Panel */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-text-primary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                PERFORMANCE TELEMETRY
              </span>
              <span style={{ fontSize: '11px', color: 'var(--color-primary)', fontWeight: 600 }}>• Live Real-Time</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div style={{ padding: '14px', borderRadius: 'var(--radius-md)', background: 'var(--color-bg-surface)', border: '1px solid var(--color-border-subtle)' }}>
                <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>Total Clicks</span>
                <div style={{ fontSize: '22px', fontWeight: 700, color: 'var(--color-text-primary)', marginTop: '4px' }}>
                  2,380
                </div>
                <span style={{ fontSize: '10.5px', color: 'var(--color-status-success)' }}>+28.4% this week</span>
              </div>

              <div style={{ padding: '14px', borderRadius: 'var(--radius-md)', background: 'var(--color-bg-surface)', border: '1px solid var(--color-border-subtle)' }}>
                <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>Total Conversions</span>
                <div style={{ fontSize: '22px', fontWeight: 700, color: 'var(--color-primary)', marginTop: '4px' }}>
                  1,756
                </div>
                <span style={{ fontSize: '10.5px', color: 'var(--color-status-success)' }}>73.7% visit rate</span>
              </div>
            </div>

            {/* Interactive Bar Chart Mockup */}
            <div style={{ padding: '16px', borderRadius: 'var(--radius-md)', background: 'var(--color-bg-surface)', border: '1px solid var(--color-border-subtle)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-text-secondary)' }}>Click Distribution</span>
                <span style={{ fontSize: '11px', background: 'rgba(0, 85, 255, 0.1)', color: 'var(--color-primary)', padding: '2px 8px', borderRadius: '4px', fontWeight: 600 }}>
                  Weekly View
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: '10px', height: '110px', paddingBottom: '6px' }}>
                {[
                  { day: 'Mon', h: '45%' },
                  { day: 'Tue', h: '60%' },
                  { day: 'Wed', h: '85%', active: true },
                  { day: 'Thu', h: '55%' },
                  { day: 'Fri', h: '95%' },
                  { day: 'Sat', h: '70%' },
                  { day: 'Sun', h: '80%' },
                ].map((b, i) => (
                  <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', height: '100%', justifyContent: 'flex-end' }}>
                    <div
                      style={{
                        width: '100%',
                        height: b.h,
                        borderRadius: '4px',
                        background: b.active ? 'var(--color-primary)' : 'rgba(0, 85, 255, 0.35)',
                        transition: 'height 0.3s ease',
                      }}
                    />
                    <span style={{ fontSize: '10px', color: 'var(--color-text-muted)' }}>{b.day}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Create Link & Link Status Panel */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ padding: '18px', borderRadius: 'var(--radius-md)', background: 'var(--color-bg-surface)', border: '1px solid var(--color-border-subtle)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text-primary)' }}>CREATE NEW LINK</span>
                <span style={{ fontSize: '10.5px', color: 'var(--color-text-muted)' }}>Step {activeStep + 1} of 5</span>
              </div>
              <div style={{ fontSize: '12px', color: 'var(--color-primary)', fontWeight: 500, padding: '8px 12px', borderRadius: '4px', background: 'rgba(0, 85, 255, 0.08)' }}>
                {steps[activeStep].desc}
              </div>
              <div style={{ padding: '10px 12px', borderRadius: 'var(--radius-sm)', background: 'var(--color-bg-paper)', border: '1px solid var(--color-border-subtle)', fontSize: '12px', color: 'var(--color-text-muted)' }}>
                https://shortie.com/brand-promo-2026
              </div>
              <button
                onClick={() => onSelectTab('links')}
                style={{
                  padding: '9px 16px',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--color-primary)',
                  border: 'none',
                  color: '#ffffff',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Generate Link →
              </button>
            </div>

            {/* Status of Your Link */}
            <div style={{ padding: '16px', borderRadius: 'var(--radius-md)', background: 'var(--color-bg-surface)', border: '1px solid var(--color-border-subtle)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-text-secondary)' }}>STATUS OF YOUR LINK</span>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '12.5px', fontWeight: 600, color: 'var(--color-text-primary)' }}>shortie.link/blackfriday</span>
                  <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>Original: shopify.store/deals</span>
                </div>
                <span style={{ padding: '3px 8px', borderRadius: '4px', background: 'rgba(16, 185, 129, 0.15)', color: 'var(--color-status-success)', fontSize: '11px', fontWeight: 600 }}>
                  Active
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────────────────────
          SECTION 4: COMPANIES THAT TRUST US (Electric Blue Banner from Image 1)
          ────────────────────────────────────────────────────────────────────────── */}
      <section
        style={{
          borderRadius: 'var(--radius-xl)',
          background: 'var(--color-primary)',
          color: '#ffffff',
          padding: '36px 32px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          gap: '24px',
          boxShadow: '0 8px 30px rgba(0, 85, 255, 0.35)',
        }}
      >
        <span style={{ fontSize: '13px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.12em', opacity: 0.9 }}>
          COMPANIES THAT TRUST US
        </span>
        <p style={{ fontSize: '13.5px', opacity: 0.85, maxWidth: '640px', margin: 0 }}>
          We're already used by more than 8,000 businesses, 10k individuals, influencers, and creative professionals
          worldwide to monetize and power their audience link relationships.
        </p>

        {/* Logos */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '38px', flexWrap: 'wrap', opacity: 0.95 }}>
          <span style={{ fontSize: '20px', fontWeight: 900, letterSpacing: '-0.02em' }}>BIG FISH</span>
          <span style={{ fontSize: '18px', fontWeight: 800, letterSpacing: '0.04em' }}>NOVASOL</span>
          <span style={{ fontSize: '17px', fontWeight: 800, letterSpacing: '0.08em' }}>MARRIOTT BONVOY</span>
          <span style={{ fontSize: '19px', fontWeight: 900 }}>monday.com</span>
          <span style={{ fontSize: '18px', fontWeight: 800 }}>Spotify</span>
        </div>

        <button
          onClick={() => onSelectTab('subscriptions')}
          style={{
            padding: '8px 18px',
            borderRadius: '9999px',
            background: 'rgba(255, 255, 255, 0.2)',
            border: '1px solid rgba(255, 255, 255, 0.4)',
            color: '#ffffff',
            fontSize: '12px',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          See Enterprise Case Studies →
        </button>
      </section>

      {/* ──────────────────────────────────────────────────────────────────────────
          SECTION 5: WHY USE OUR SERVICE (Stats Bento Grid from Image 1)
          ────────────────────────────────────────────────────────────────────────── */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div>
          <h2 style={{ fontSize: '22px', fontWeight: 700, color: 'var(--color-text-primary)', margin: 0 }}>
            WHY USE OUR SERVICE
          </h2>
          <p style={{ fontSize: '13.5px', color: 'var(--color-text-secondary)', marginTop: '4px', margin: 0 }}>
            Built from scratch to deliver high-converting links, unmetered bandwidth, and enterprise uptime.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
          <div style={{ padding: '22px', borderRadius: 'var(--radius-lg)', background: 'var(--color-bg-card)', border: '1px solid var(--color-border-subtle)', boxShadow: 'var(--shadow-card)' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(0, 85, 255, 0.12)', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px' }}>
              <IconUsers size={18} />
            </div>
            <div style={{ fontSize: '26px', fontWeight: 800, color: 'var(--color-text-primary)' }}>100k+</div>
            <div style={{ fontSize: '13px', color: 'var(--color-text-secondary)', marginTop: '4px' }}>Active Customers</div>
          </div>

          <div style={{ padding: '22px', borderRadius: 'var(--radius-lg)', background: 'var(--color-bg-card)', border: '1px solid var(--color-border-subtle)', boxShadow: 'var(--shadow-card)' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.12)', color: 'var(--color-status-success)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px' }}>
              <IconLink size={18} />
            </div>
            <div style={{ fontSize: '26px', fontWeight: 800, color: 'var(--color-text-primary)' }}>50k+</div>
            <div style={{ fontSize: '13px', color: 'var(--color-text-secondary)', marginTop: '4px' }}>Links Created Monthly</div>
          </div>

          <div style={{ padding: '22px', borderRadius: 'var(--radius-lg)', background: 'var(--color-bg-card)', border: '1px solid var(--color-border-subtle)', boxShadow: 'var(--shadow-card)' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(245, 158, 11, 0.12)', color: 'var(--color-status-warning)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px' }}>
              <IconZap size={18} />
            </div>
            <div style={{ fontSize: '26px', fontWeight: 800, color: 'var(--color-text-primary)' }}>500+</div>
            <div style={{ fontSize: '13px', color: 'var(--color-text-secondary)', marginTop: '4px' }}>Integrations & Webhooks</div>
          </div>

          <div style={{ padding: '22px', borderRadius: 'var(--radius-lg)', background: 'var(--color-bg-card)', border: '1px solid var(--color-border-subtle)', boxShadow: 'var(--shadow-card)' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(0, 85, 255, 0.12)', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px' }}>
              <IconShield size={18} />
            </div>
            <div style={{ fontSize: '26px', fontWeight: 800, color: 'var(--color-text-primary)' }}>99.9%</div>
            <div style={{ fontSize: '13px', color: 'var(--color-text-secondary)', marginTop: '4px' }}>Uptime SLA Guarantee</div>
          </div>
        </div>

        {/* Featured Big Blue Card: SSL and Redirection (Image 1) */}
        <div
          style={{
            borderRadius: 'var(--radius-xl)',
            background: 'linear-gradient(135deg, var(--color-primary) 0%, #003ECC 100%)',
            color: '#ffffff',
            padding: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '20px',
            boxShadow: '0 8px 32px rgba(0, 85, 255, 0.35)',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxWidth: '540px' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', opacity: 0.9 }}>
              SECURITY ARCHITECTURE
            </span>
            <h3 style={{ fontSize: '22px', fontWeight: 800, margin: 0 }}>
              SSL and redirection URL with no worries
            </h3>
            <p style={{ fontSize: '13.5px', opacity: 0.88, margin: 0, lineHeight: 1.5 }}>
              Automatic TLS 1.3 certificates, zero unencrypted traffic, SSRF protection against private network probing,
              and sub-15ms edge redirects powered by distributed cloud nodes.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={() => onSelectTab('domains')}
              style={{
                padding: '10px 20px',
                borderRadius: '9999px',
                background: '#ffffff',
                color: 'var(--color-primary)',
                fontWeight: 700,
                fontSize: '13px',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              Add Custom Domain →
            </button>
          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────────────────────
          SECTION 6: CUSTOMIZE URLS OF YOUR WAY (Editorial Split from Image 2)
          ────────────────────────────────────────────────────────────────────────── */}
      <section
        style={{
          borderRadius: 'var(--radius-2xl)',
          background: 'var(--color-bg-paper)',
          border: '1px solid var(--color-border-subtle)',
          padding: '40px 32px',
          boxShadow: 'var(--shadow-card)',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '36px',
          alignItems: 'center',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div
            style={{
              padding: '4px 12px',
              borderRadius: '9999px',
              background: 'rgba(22, 163, 74, 0.12)',
              color: 'var(--color-status-success)',
              fontSize: '11.5px',
              fontWeight: 600,
              width: 'fit-content',
            }}
          >
            EDITORIAL CUSTOMIZATION
          </div>

          <h2 style={{ fontSize: '28px', fontWeight: 800, color: 'var(--color-text-primary)', margin: 0, lineHeight: 1.2 }}>
            Customize URLs of <span style={{ color: 'var(--color-primary)' }}>your way</span>
          </h2>

          <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', lineHeight: 1.6, margin: 0 }}>
            Every link you create can be customized with branded subdomains, readable slug aliases, UTM campaign tags,
            and password encryption. Make every touchpoint memorable and build trust with your brand.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[
              { title: 'Branded Root & Subdomains', desc: 'Use your own verified domain name for all generated short links.' },
              { title: 'Dynamic Expiration & Quotas', desc: 'Schedule expiration dates or maximum click limits automatically.' },
              { title: 'Folders & Collaborative Tags', desc: 'Organize your campaign links into team-shared folders.' },
            ].map((f, i) => (
              <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: 'rgba(0, 85, 255, 0.12)', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '2px' }}>
                  <IconCheck size={13} />
                </div>
                <div>
                  <div style={{ fontSize: '13.5px', fontWeight: 600, color: 'var(--color-text-primary)' }}>{f.title}</div>
                  <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>{f.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Visual Mockup Card */}
        <div
          style={{
            padding: '28px',
            borderRadius: 'var(--radius-xl)',
            background: 'var(--color-bg-card)',
            border: '1px solid var(--color-border-subtle)',
            boxShadow: 'var(--shadow-card)',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-text-primary)' }}>
              LIVE LINK CONFIGURATION
            </span>
            <span style={{ fontSize: '11px', color: 'var(--color-status-success)', fontWeight: 600 }}>Active</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>Branded Target</div>
            <div style={{ padding: '8px 12px', borderRadius: 'var(--radius-sm)', background: 'var(--color-bg-surface)', fontSize: '13px', color: 'var(--color-text-primary)', fontWeight: 500 }}>
              https://tinu.be/summer-sale
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div style={{ padding: '10px', borderRadius: 'var(--radius-sm)', background: 'var(--color-bg-surface)' }}>
              <div style={{ fontSize: '10.5px', color: 'var(--color-text-muted)' }}>Clicks Recorded</div>
              <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--color-text-primary)', marginTop: '2px' }}>4,920</div>
            </div>
            <div style={{ padding: '10px', borderRadius: 'var(--radius-sm)', background: 'var(--color-bg-surface)' }}>
              <div style={{ fontSize: '10.5px', color: 'var(--color-text-muted)' }}>Conversion Rate</div>
              <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--color-primary)', marginTop: '2px' }}>82.4%</div>
            </div>
          </div>

          <button
            onClick={() => onSelectTab('links')}
            style={{
              padding: '10px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--color-primary)',
              border: 'none',
              color: '#ffffff',
              fontSize: '12.5px',
              fontWeight: 600,
              cursor: 'pointer',
              marginTop: '4px',
            }}
          >
            Configure Links in Studio →
          </button>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────────────────────
          SECTION 7: FAQ ACCORDION (Interactive from Image 2)
          ────────────────────────────────────────────────────────────────────────── */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
        <div>
          <h2 style={{ fontSize: '22px', fontWeight: 700, color: 'var(--color-text-primary)', margin: 0 }}>
            Frequently Asked Questions
          </h2>
          <p style={{ fontSize: '13.5px', color: 'var(--color-text-secondary)', marginTop: '4px', margin: 0 }}>
            Everything you need to know about link shortening, custom domains, and platform security.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {faqs.map((f, idx) => (
            <div
              key={idx}
              style={{
                borderRadius: 'var(--radius-lg)',
                background: 'var(--color-bg-card)',
                border: '1px solid var(--color-border-subtle)',
                overflow: 'hidden',
                transition: 'all 0.2s ease',
              }}
            >
              <button
                onClick={() => setExpandedFaq(expandedFaq === idx ? -1 : idx)}
                style={{
                  width: '100%',
                  padding: '16px 20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-text-primary)' }}>
                  {f.q}
                </span>
                <span style={{ color: 'var(--color-primary)', display: 'flex', alignItems: 'center' }}>
                  {expandedFaq === idx ? <IconChevronUp size={16} /> : <IconChevronDown size={16} />}
                </span>
              </button>

              {expandedFaq === idx && (
                <div
                  style={{
                    padding: '0 20px 18px 20px',
                    fontSize: '13.5px',
                    lineHeight: 1.6,
                    color: 'var(--color-text-secondary)',
                  }}
                >
                  {f.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────────────────────
          SECTION 8: GROWTH HACK BOTTOM CTA (From Image 1 & 2)
          ────────────────────────────────────────────────────────────────────────── */}
      <section
        style={{
          borderRadius: 'var(--radius-2xl)',
          background: 'linear-gradient(145deg, #121829 0%, #0B0F1C 100%)',
          color: '#ffffff',
          padding: '48px 36px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 12px 40px rgba(0, 0, 0, 0.5)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          gap: '20px',
        }}
      >
        <span
          style={{
            padding: '6px 14px',
            borderRadius: '9999px',
            background: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            color: '#EF4444',
            fontSize: '12px',
            fontWeight: 700,
          }}
        >
          🔥 Growth Hack your way to the Top!
        </span>

        <h2 style={{ fontSize: 'clamp(24px, 3.8vw, 36px)', fontWeight: 800, margin: 0, letterSpacing: '-0.02em' }}>
          GET CLOSER TO YOUR CUSTOMERS TODAY
        </h2>

        <p style={{ fontSize: '14px', color: '#94A3B8', maxWidth: '560px', margin: 0, lineHeight: 1.5 }}>
          Start creating custom branded links, generating dynamic QR codes, and analyzing campaign conversions
          with zero setup fee.
        </p>

        <button
          onClick={() => (typeof onOpenAuth === 'function' ? onOpenAuth('register') : onSelectTab('links'))}
          style={{
            padding: '12px 28px',
            borderRadius: '9999px',
            background: 'var(--color-primary)',
            color: '#ffffff',
            fontWeight: 700,
            fontSize: '14px',
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 4px 18px rgba(0, 85, 255, 0.45)',
          }}
        >
          Get Started For Free
        </button>
      </section>

      {/* ──────────────────────────────────────────────────────────────────────────
          SECTION 9: COMPREHENSIVE FOOTER (From Image 1 & 2)
          ────────────────────────────────────────────────────────────────────────── */}
      <footer
        style={{
          borderTop: '1px solid var(--color-border-subtle)',
          paddingTop: '36px',
          paddingBottom: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '30px',
        }}
      >
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '28px' }}>
          {/* Brand Info */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div
                style={{
                  width: '26px',
                  height: '26px',
                  borderRadius: '6px',
                  background: 'var(--color-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                }}
              >
                <IconZap size={14} />
              </div>
              <span style={{ fontSize: '16px', fontWeight: 800, color: 'var(--color-text-primary)' }}>
                SHORTIE <span style={{ color: 'var(--color-primary)' }}>♾️</span>
              </span>
            </div>
            <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', lineHeight: 1.5, margin: 0 }}>
              The modern bio link, QR generator, and custom domain shortener platform.
            </p>
          </div>

          {/* Menu */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12.5px' }}>
            <span style={{ fontWeight: 700, color: 'var(--color-text-primary)', textTransform: 'uppercase', fontSize: '11px', letterSpacing: '0.06em' }}>
              MENU
            </span>
            <span onClick={() => onSelectTab('landing')} style={{ color: 'var(--color-text-secondary)', cursor: 'pointer' }}>Home</span>
            <span onClick={() => onSelectTab('dashboard')} style={{ color: 'var(--color-text-secondary)', cursor: 'pointer' }}>Dashboard</span>
            <span onClick={() => onSelectTab('subscriptions')} style={{ color: 'var(--color-text-secondary)', cursor: 'pointer' }}>Pricing</span>
            <span onClick={() => onSelectTab('services')} style={{ color: 'var(--color-text-secondary)', cursor: 'pointer' }}>Platform Services</span>
          </div>

          {/* Services */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12.5px' }}>
            <span style={{ fontWeight: 700, color: 'var(--color-text-primary)', textTransform: 'uppercase', fontSize: '11px', letterSpacing: '0.06em' }}>
              SERVICES
            </span>
            <span onClick={() => onSelectTab('links')} style={{ color: 'var(--color-text-secondary)', cursor: 'pointer' }}>Link Shortener</span>
            <span onClick={() => onSelectTab('qrcodes')} style={{ color: 'var(--color-text-secondary)', cursor: 'pointer' }}>QR Code Studio</span>
            <span onClick={() => onSelectTab('domains')} style={{ color: 'var(--color-text-secondary)', cursor: 'pointer' }}>Custom Domains</span>
            <span onClick={() => onSelectTab('analytics')} style={{ color: 'var(--color-text-secondary)', cursor: 'pointer' }}>Real-time Analytics</span>
          </div>

          {/* Newsletter */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12.5px' }}>
            <span style={{ fontWeight: 700, color: 'var(--color-text-primary)', textTransform: 'uppercase', fontSize: '11px', letterSpacing: '0.06em' }}>
              SUBSCRIBE TO NEWSLETTER
            </span>
            <div style={{ display: 'flex', gap: '6px' }}>
              <input
                type="email"
                placeholder="your.email@brand.com"
                style={{
                  padding: '7px 10px',
                  borderRadius: 'var(--radius-sm)',
                  background: 'var(--color-bg-card)',
                  border: '1px solid var(--color-border-subtle)',
                  color: 'var(--color-text-primary)',
                  fontSize: '12px',
                  flex: 1,
                  outline: 'none',
                }}
              />
              <button
                style={{
                  padding: '7px 14px',
                  borderRadius: 'var(--radius-sm)',
                  background: 'var(--color-primary)',
                  border: 'none',
                  color: '#ffffff',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Join
              </button>
            </div>
            <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
              Call Us: +1 (800) 456-7890 • hello@shortie.com
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', paddingTop: '16px', borderTop: '1px solid var(--color-border-subtle)', fontSize: '11.5px', color: 'var(--color-text-muted)' }}>
          <span>© 2026 ShortSaaS (Shortie & tinu.be design edition). All Rights Reserved.</span>
          <div style={{ display: 'flex', gap: '16px' }}>
            <span>Terms of Service</span>
            <span>Privacy Policy</span>
            <span>Security Whitepaper</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingShowcaseView;

