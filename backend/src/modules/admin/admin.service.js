// admin.service.js
const adminRepo = require('./admin.repository');

class AdminService {
  async getDashboard() {
    const stats = await adminRepo.getSystemStats();
    const users = await adminRepo.getAllUsers(20);
    const logs = await adminRepo.getAuditLogs(20);
    return {
      stats,
      users,
      logs,
    };
  }
}

module.exports = new AdminService();

