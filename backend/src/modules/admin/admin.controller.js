// admin.controller.js
const adminService = require('./admin.service');
const { success } = require('../../utils/response');

class AdminController {
  async getDashboard(req, res, next) {
    try {
      const data = await adminService.getDashboard();
      return success(res, data, 200);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new AdminController();

