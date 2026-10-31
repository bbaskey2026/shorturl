// links.service.js
const crypto = require('crypto');
const linksRepo = require('./links.repository');
const { isValidUrl, isValidSlug } = require('../../utils/urlValidator');
const { hashPassword } = require('../../utils/hash');
const plansConfig = require('../../config/plans.config');

class LinksService {
  async createLink(userId, userPlan = 'free', {
    originalUrl,
    customSlug,
    domainId,
    folderId,
    title,
    password,
    expiresAt,
  }) {
    // 1. Validate destination URL
    const urlCheck = isValidUrl(originalUrl);
    if (!urlCheck.valid) {
      const err = new Error(urlCheck.reason);
      err.statusCode = 400;
      throw err;
    }

    // 2. Enforce Plan Limits
    const planLimits = plansConfig[userPlan] || plansConfig.free;
    const currentCount = await linksRepo.countByUser(userId);
    if (currentCount >= planLimits.maxLinks) {
      const err = new Error(`Link creation limit reached (${planLimits.maxLinks} links max on ${planLimits.name} plan). Please upgrade.`);
      err.statusCode = 403;
      throw err;
    }

    // 3. Resolve Short Code
    let shortCode = customSlug ? customSlug.trim() : null;
    if (shortCode) {
      if (!isValidSlug(shortCode)) {
        const err = new Error('Custom slug contains invalid characters. Use letters, numbers, hyphens, and underscores only.');
        err.statusCode = 400;
        throw err;
      }

      // Check collision
      const existing = await linksRepo.findByCode(shortCode, domainId);
      if (existing) {
        const err = new Error(`The alias '${shortCode}' is already taken.`);
        err.statusCode = 409;
        throw err;
      }
    } else {
      // Generate 6-char random alphanumeric code
      let attempts = 0;
      while (!shortCode && attempts < 5) {
        const candidate = crypto.randomBytes(4).toString('base64url').substring(0, 6);
        const existing = await linksRepo.findByCode(candidate, domainId);
        if (!existing) {
          shortCode = candidate;
        }
        attempts++;
      }
      if (!shortCode) {
        shortCode = Date.now().toString(36).slice(-6);
      }
    }

    // 4. Handle Password Protection
    let passwordHash = null;
    if (password) {
      if (!planLimits.allowPasswordProtection) {
        const err = new Error('Password protection is available on Starter and higher plans.');
        err.statusCode = 403;
        throw err;
      }
      passwordHash = await hashPassword(password);
    }

    // 5. Create in Repository
    const link = await linksRepo.create({
      userId,
      domainId: domainId || null,
      folderId: folderId || null,
      originalUrl: urlCheck.url,
      shortCode,
      title: title || originalUrl.replace(/^https?:\/\//, '').split('/')[0],
      passwordHash,
      expiresAt: expiresAt ? new Date(expiresAt) : null,
      isActive: true,
    });

    return link;
  }

  async getUserLinks(userId, queryOptions) {
    return linksRepo.findByUser(userId, queryOptions);
  }

  async getLinkById(id, userId) {
    const link = await linksRepo.findById(id);
    if (!link || link.user_id !== userId) {
      const err = new Error('Link not found');
      err.statusCode = 404;
      throw err;
    }
    return link;
  }

  async updateLink(id, userId, updates) {
    const link = await linksRepo.findById(id);
    if (!link || link.user_id !== userId) {
      const err = new Error('Link not found');
      err.statusCode = 404;
      throw err;
    }

    const allowedUpdates = {};
    if (updates.title !== undefined) allowedUpdates.title = updates.title;
    if (updates.folder_id !== undefined) allowedUpdates.folder_id = updates.folder_id;
    if (updates.is_active !== undefined) allowedUpdates.is_active = updates.is_active;
    if (updates.expires_at !== undefined) allowedUpdates.expires_at = updates.expires_at;

    if (updates.original_url) {
      const check = isValidUrl(updates.original_url);
      if (!check.valid) {
        const err = new Error(check.reason);
        err.statusCode = 400;
        throw err;
      }
      allowedUpdates.original_url = check.url;
    }

    return linksRepo.update(id, userId, allowedUpdates);
  }

  async deleteLink(id, userId) {
    const deleted = await linksRepo.delete(id, userId);
    if (!deleted) {
      const err = new Error('Link not found or already deleted');
      err.statusCode = 404;
      throw err;
    }
    return { id };
  }
}

module.exports = new LinksService();

