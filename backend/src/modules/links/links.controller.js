// links.controller.js
const linksService = require('./links.service');
const { success, error } = require('../../utils/response');

class LinksController {
  async create(req, res, next) {
    try {
      const { originalUrl, customSlug, domainId, folderId, title, password, expiresAt } = req.body;
      if (!originalUrl) {
        return error(res, 'Destination originalUrl is required', 400);
      }

      const userId = req.user.id;
      const userPlan = req.user.plan || 'free';

      const link = await linksService.createLink(userId, userPlan, {
        originalUrl,
        customSlug,
        domainId,
        folderId,
        title,
        password,
        expiresAt,
      });

      return success(res, link, 201);
    } catch (err) {
      next(err);
    }
  }

  async getAll(req, res, next) {
    try {
      const { search, folderId, limit, offset } = req.query;
      const links = await linksService.getUserLinks(req.user.id, {
        search,
        folderId,
        limit: limit ? parseInt(limit, 10) : 50,
        offset: offset ? parseInt(offset, 10) : 0,
      });
      return success(res, links, 200);
    } catch (err) {
      next(err);
    }
  }

  async getOne(req, res, next) {
    try {
      const link = await linksService.getLinkById(req.params.id, req.user.id);
      return success(res, link, 200);
    } catch (err) {
      next(err);
    }
  }

  async update(req, res, next) {
    try {
      const updated = await linksService.updateLink(req.params.id, req.user.id, req.body);
      return success(res, updated, 200);
    } catch (err) {
      next(err);
    }
  }

  async delete(req, res, next) {
    try {
      const result = await linksService.deleteLink(req.params.id, req.user.id);
      return success(res, result, 200);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new LinksController();

