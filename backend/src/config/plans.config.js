// plans.config.js - Centralized subscription and entitlement limits
module.exports = {
  free: {
    name: 'Free',
    maxLinks: 50,
    maxMonthlyClicks: 2500,
    maxCustomDomains: 0,
    analyticsRetentionDays: 30,
    allowPasswordProtection: false,
    allowCustomQr: false,
    allowApiAccess: false,
  },
  starter: {
    name: 'Starter',
    maxLinks: 500,
    maxMonthlyClicks: 25000,
    maxCustomDomains: 1,
    analyticsRetentionDays: 90,
    allowPasswordProtection: true,
    allowCustomQr: true,
    allowApiAccess: true,
  },
  pro: {
    name: 'Pro',
    maxLinks: 5000,
    maxMonthlyClicks: 250000,
    maxCustomDomains: 5,
    analyticsRetentionDays: 365,
    allowPasswordProtection: true,
    allowCustomQr: true,
    allowApiAccess: true,
  },
  business: {
    name: 'Business',
    maxLinks: 100000,
    maxMonthlyClicks: 2000000,
    maxCustomDomains: 25,
    analyticsRetentionDays: 730,
    allowPasswordProtection: true,
    allowCustomQr: true,
    allowApiAccess: true,
  },
};

