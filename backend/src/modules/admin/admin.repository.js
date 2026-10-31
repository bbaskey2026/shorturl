// admin.repository.js
const db = require('../../database/db');

class AdminRepository {
  async getSystemStats() {
    const usersCount = await db.query('SELECT COUNT(*) FROM users');
    const linksCount = await db.query('SELECT COUNT(*) FROM short_links');
    const clicksCount = await db.query('SELECT COUNT(*) FROM click_events');
    const domainsCount = await db.query('SELECT COUNT(*) FROM custom_domains');

    return {
      totalUsers: parseInt(usersCount.rows[0].count, 10),
      totalLinks: parseInt(linksCount.rows[0].count, 10),
      totalClicks: parseInt(clicksCount.rows[0].count, 10),
      totalDomains: parseInt(domainsCount.rows[0].count, 10),
    };
  }

  async getAllUsers(limit = 100, offset = 0) {
    const res = await db.query(
      `SELECT u.id, u.email, u.full_name, u.role, u.plan, u.is_verified, u.created_at,
              COUNT(l.id)::int as links_count
       FROM users u
       LEFT JOIN short_links l ON u.id = l.user_id
       GROUP BY u.id
       ORDER BY u.created_at DESC
       LIMIT $1 OFFSET $2`,
      [limit, offset]
    );
    return res.rows;
  }

  async getAuditLogs(limit = 50) {
    const res = await db.query(
      `SELECT a.*, u.email as user_email
       FROM audit_logs a
       LEFT JOIN users u ON a.user_id = u.id
       ORDER BY a.created_at DESC
       LIMIT $1`,
      [limit]
    );
    return res.rows;
  }
}

module.exports = new AdminRepository();

