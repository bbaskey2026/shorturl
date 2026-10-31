// domains.service.js
const crypto = require('crypto');
const dns = require('dns').promises;
const domainsRepo = require('./domains.repository');
const plansConfig = require('../../config/plans.config');

class DomainsService {
  async addDomain(userId, userPlan, domainName) {
    const cleanDomain = domainName.toLowerCase().trim().replace(/^https?:\/\//, '').split('/')[0];

    // Check plan limits
    const limits = plansConfig[userPlan] || plansConfig.free;
    const current = await domainsRepo.countByUser(userId);
    if (current >= limits.maxCustomDomains) {
      const err = new Error(`Custom domain limit reached (${limits.maxCustomDomains} domains max on ${limits.name} plan). Please upgrade.`);
      err.statusCode = 403;
      throw err;
    }

    const existing = await domainsRepo.findByDomain(cleanDomain);
    if (existing) {
      const err = new Error('This domain is already registered in the platform');
      err.statusCode = 409;
      throw err;
    }

    const verificationToken = `shorturl-verify-${crypto.randomBytes(8).toString('hex')}`;
    return domainsRepo.create({
      userId,
      domain: cleanDomain,
      verificationToken,
    });
  }

  async verifyDomain(id, userId) {
    const domain = await domainsRepo.verify(id, userId);
    if (!domain) {
      const err = new Error('Domain not found');
      err.statusCode = 404;
      throw err;
    }
    return domain;
  }

  async getUserDomains(userId) {
    return domainsRepo.findByUser(userId);
  }

  async setDefaultDomain(id, userId) {
    return domainsRepo.setDefault(id, userId);
  }

  async deleteDomain(id, userId) {
    const deleted = await domainsRepo.delete(id, userId);
    if (!deleted) {
      const err = new Error('Domain not found');
      err.statusCode = 404;
      throw err;
    }
    return { id };
  }
}

module.exports = new DomainsService();

