// analytics.controller.js
const analyticsService = require('./analytics.service');
const { success } = require('../../utils/response');

class AnalyticsController {
  async getOverview(req, res, next) {
    try {
      const days = req.query.days ? parseInt(req.query.days, 10) : 7;
      const data = await analyticsService.getDashboardAnalytics(req.user.id, days);
      return success(res, data, 200);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new AnalyticsController();

