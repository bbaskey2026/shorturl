// subscriptions.controller.js
const subService = require('./subscriptions.service');
const { success } = require('../../utils/response');

class SubscriptionsController {
  getPlans(req, res) {
    const plans = subService.getPlans();
    return success(res, plans, 200);
  }

  async getUsage(req, res, next) {
    try {
      const usage = await subService.getCurrentUsage(req.user.id, req.user.plan || 'free');
      return success(res, usage, 200);
    } catch (err) {
      next(err);
    }
  }

  async upgrade(req, res, next) {
    try {
      const { plan } = req.body;
      const updated = await subService.upgradePlan(req.user.id, plan);
      return success(res, updated, 200);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new SubscriptionsController();

