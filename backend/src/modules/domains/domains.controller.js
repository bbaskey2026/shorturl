// domains.controller.js
const domainsService = require('./domains.service');
const { success, error } = require('../../utils/response');

class DomainsController {
  async add(req, res, next) {
    try {
      const { domain } = req.body;
      if (!domain) return error(res, 'Domain is required', 400);

      const created = await domainsService.addDomain(req.user.id, req.user.plan, domain);
      return success(res, created, 201);
    } catch (err) {
      next(err);
    }
  }

  async getAll(req, res, next) {
    try {
      const domains = await domainsService.getUserDomains(req.user.id);
      return success(res, domains, 200);
    } catch (err) {
      next(err);
    }
  }

  async verify(req, res, next) {
    try {
      const verified = await domainsService.verifyDomain(req.params.id, req.user.id);
      return success(res, verified, 200);
    } catch (err) {
      next(err);
    }
  }

  async setDefault(req, res, next) {
    try {
      const result = await domainsService.setDefaultDomain(req.params.id, req.user.id);
      return success(res, result, 200);
    } catch (err) {
      next(err);
    }
  }

  async delete(req, res, next) {
    try {
      const result = await domainsService.deleteDomain(req.params.id, req.user.id);
      return success(res, result, 200);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new DomainsController();

