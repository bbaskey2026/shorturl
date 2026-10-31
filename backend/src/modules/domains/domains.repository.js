// domains.repository.js
const db = require('../../database/db');

class DomainsRepository {
  async findByUser(userId) {
    const res = await db.query(
      'SELECT * FROM custom_domains WHERE user_id = $1 ORDER BY created_at DESC',
      [userId]
    );
    return res.rows;
  }

  async findByDomain(domain) {
    const res = await db.query(
      'SELECT * FROM custom_domains WHERE domain = $1',
      [domain.toLowerCase()]
    );
    return res.rows[0] || null;
  }

  async countByUser(userId) {
    const res = await db.query('SELECT COUNT(*) FROM custom_domains WHERE user_id = $1', [userId]);
    return parseInt(res.rows[0].count, 10);
  }

  async create({ userId, domain, verificationToken }) {
    const res = await db.query(
      `INSERT INTO custom_domains (user_id, domain, verification_token, is_verified, is_default)
       VALUES ($1, $2, $3, false, false)
       RETURNING *`,
      [userId, domain.toLowerCase(), verificationToken]
    );
    return res.rows[0];
  }

  async verify(id, userId) {
    const res = await db.query(
      `UPDATE custom_domains SET is_verified = true WHERE id = $1 AND user_id = $2 RETURNING *`,
      [id, userId]
    );
    return res.rows[0] || null;
  }

  async setDefault(id, userId) {
    await db.query('UPDATE custom_domains SET is_default = false WHERE user_id = $1', [userId]);
    const res = await db.query(
      'UPDATE custom_domains SET is_default = true WHERE id = $1 AND user_id = $2 RETURNING *',
      [id, userId]
    );
    return res.rows[0] || null;
  }

  async delete(id, userId) {
    const res = await db.query(
      'DELETE FROM custom_domains WHERE id = $1 AND user_id = $2 RETURNING id',
      [id, userId]
    );
    return res.rowCount > 0;
  }
}

module.exports = new DomainsRepository();

