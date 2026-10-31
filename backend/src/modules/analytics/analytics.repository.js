// analytics.repository.js
const db = require('../../database/db');

class AnalyticsRepository {
  async getOverviewMetrics(userId) {
    const totalLinksRes = await db.query(
      'SELECT COUNT(*) as count FROM short_links WHERE user_id = $1',
      [userId]
    );

    const clicksRes = await db.query(
      'SELECT COALESCE(SUM(click_count), 0) as total_clicks FROM short_links WHERE user_id = $1',
      [userId]
    );

    const uniqueRes = await db.query(
      `SELECT COUNT(DISTINCT c.visitor_hash) as unique_visitors
       FROM click_events c
       JOIN short_links l ON c.link_id = l.id
       WHERE l.user_id = $1`,
      [userId]
    );

    const activeRes = await db.query(
      `SELECT 
         COUNT(*) FILTER (WHERE is_active = true AND (expires_at IS NULL OR expires_at > NOW())) as active_links,
         COUNT(*) FILTER (WHERE is_active = false OR (expires_at IS NOT NULL AND expires_at <= NOW())) as expired_links
       FROM short_links
       WHERE user_id = $1`,
      [userId]
    );

    return {
      totalLinks: parseInt(totalLinksRes.rows[0].count, 10),
      totalClicks: parseInt(clicksRes.rows[0].total_clicks, 10),
      uniqueVisitors: parseInt(uniqueRes.rows[0].unique_visitors, 10),
      activeLinks: parseInt(activeRes.rows[0].active_links, 10),
      expiredLinks: parseInt(activeRes.rows[0].expired_links, 10),
    };
  }

  async getClicksByDay(userId, days = 7) {
    const res = await db.query(
      `SELECT 
         to_char(c.clicked_at, 'Mon DD') as date,
         COUNT(*) as clicks,
         COUNT(DISTINCT c.visitor_hash) as unique
       FROM click_events c
       JOIN short_links l ON c.link_id = l.id
       WHERE l.user_id = $1 AND c.clicked_at >= NOW() - ($2 || ' days')::INTERVAL
       GROUP BY to_char(c.clicked_at, 'Mon DD'), date_trunc('day', c.clicked_at)
       ORDER BY date_trunc('day', c.clicked_at) ASC`,
      [userId, days]
    );
    return res.rows;
  }

  async getTopReferrers(userId, limit = 5) {
    const res = await db.query(
      `SELECT 
         COALESCE(NULLIF(c.referrer, ''), 'Direct / Email / App') as source,
         COUNT(*) as count
       FROM click_events c
       JOIN short_links l ON c.link_id = l.id
       WHERE l.user_id = $1
       GROUP BY source
       ORDER BY count DESC
       LIMIT $2`,
      [userId, limit]
    );
    return res.rows;
  }

  async getDeviceBreakdown(userId) {
    const res = await db.query(
      `SELECT 
         COALESCE(c.device_type, 'Desktop') as type,
         COUNT(*) as count
       FROM click_events c
       JOIN short_links l ON c.link_id = l.id
       WHERE l.user_id = $1
       GROUP BY type
       ORDER BY count DESC`,
      [userId]
    );
    return res.rows;
  }

  async getCountryBreakdown(userId, limit = 5) {
    const res = await db.query(
      `SELECT 
         COALESCE(c.country, 'Unknown') as country,
         COUNT(*) as clicks
       FROM click_events c
       JOIN short_links l ON c.link_id = l.id
       WHERE l.user_id = $1
       GROUP BY country
       ORDER BY clicks DESC
       LIMIT $2`,
      [userId, limit]
    );
    return res.rows;
  }
}

module.exports = new AnalyticsRepository();

