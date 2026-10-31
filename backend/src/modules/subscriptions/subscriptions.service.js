// subscriptions.service.js
const plansConfig = require('../../config/plans.config');
const db = require('../../database/db');

class SubscriptionsService {
  getPlans() {
    return Object.entries(plansConfig).map(([key, config]) => ({
      id: key,
      ...config,
    }));
  }

  async getCurrentUsage(userId, currentPlan) {
    const limits = plansConfig[currentPlan] || plansConfig.free;

    const linksRes = await db.query('SELECT COUNT(*) FROM short_links WHERE user_id = $1', [userId]);
    const domainsRes = await db.query('SELECT COUNT(*) FROM custom_domains WHERE user_id = $1', [userId]);
    const clicksRes = await db.query(
      `SELECT COUNT(*) FROM click_events c 
       JOIN short_links l ON c.link_id = l.id 
       WHERE l.user_id = $1 AND c.clicked_at >= date_trunc('month', NOW())`,
      [userId]
    );

    return {
      plan: currentPlan,
      limits,
      usage: {
        linksCount: parseInt(linksRes.rows[0].count, 10),
        domainsCount: parseInt(domainsRes.rows[0].count, 10),
        monthlyClicksCount: parseInt(clicksRes.rows[0].count, 10),
      },
    };
  }

  async upgradePlan(userId, targetPlan) {
    if (!plansConfig[targetPlan]) {
      const err = new Error('Invalid plan selection');
      err.statusCode = 400;
      throw err;
    }

    const res = await db.query(
      'UPDATE users SET plan = $1, updated_at = NOW() WHERE id = $2 RETURNING id, email, plan',
      [targetPlan, userId]
    );
    return res.rows[0];
  }
}

module.exports = new SubscriptionsService();

