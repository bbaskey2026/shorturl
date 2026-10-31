// links.repository.js
const db = require('../../database/db');

class LinksRepository {
  async findByCode(shortCode, domainId = null) {
    const res = await db.query(
      `SELECT l.*, d.domain as custom_domain
       FROM short_links l
       LEFT JOIN custom_domains d ON l.domain_id = d.id
       WHERE l.short_code = $1 
         AND (l.domain_id = $2 OR ($2 IS NULL AND l.domain_id IS NULL))`,
      [shortCode, domainId]
    );
    return res.rows[0] || null;
  }

  async findById(id) {
    const res = await db.query(
      `SELECT l.*, d.domain as custom_domain, f.name as folder_name
       FROM short_links l
       LEFT JOIN custom_domains d ON l.domain_id = d.id
       LEFT JOIN folders f ON l.folder_id = f.id
       WHERE l.id = $1`,
      [id]
    );
    return res.rows[0] || null;
  }

  async findByUser(userId, { search, folderId, limit = 50, offset = 0 } = {}) {
    let queryText = `
      SELECT l.*, d.domain as custom_domain, f.name as folder_name,
        COALESCE(
          (SELECT json_agg(t.name) FROM link_tags lt JOIN tags t ON lt.tag_id = t.id WHERE lt.link_id = l.id),
          '[]'::json
        ) as tags
      FROM short_links l
      LEFT JOIN custom_domains d ON l.domain_id = d.id
      LEFT JOIN folders f ON l.folder_id = f.id
      WHERE l.user_id = $1
    `;
    const params = [userId];

    if (folderId) {
      params.push(folderId);
      queryText += ` AND l.folder_id = $${params.length}`;
    }

    if (search) {
      params.push(`%${search.toLowerCase()}%`);
      queryText += ` AND (LOWER(l.title) LIKE $${params.length} OR LOWER(l.short_code) LIKE $${params.length} OR LOWER(l.original_url) LIKE $${params.length})`;
    }

    queryText += ` ORDER BY l.created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(limit, offset);

    const res = await db.query(queryText, params);
    return res.rows;
  }

  async countByUser(userId) {
    const res = await db.query('SELECT COUNT(*) FROM short_links WHERE user_id = $1', [userId]);
    return parseInt(res.rows[0].count, 10);
  }

  async create({
    userId,
    domainId = null,
    folderId = null,
    originalUrl,
    shortCode,
    title,
    passwordHash = null,
    expiresAt = null,
    isActive = true,
  }) {
    const res = await db.query(
      `INSERT INTO short_links (
        user_id, domain_id, folder_id, original_url, short_code, title, password_hash, expires_at, is_active
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *`,
      [userId, domainId, folderId, originalUrl, shortCode, title, passwordHash, expiresAt, isActive]
    );
    return res.rows[0];
  }

  async update(id, userId, updates) {
    const fields = [];
    const values = [];
    let idx = 1;

    for (const [key, val] of Object.entries(updates)) {
      fields.push(`${key} = $${idx}`);
      values.push(val);
      idx++;
    }

    fields.push(`updated_at = NOW()`);
    values.push(id, userId);

    const queryText = `
      UPDATE short_links
      SET ${fields.join(', ')}
      WHERE id = $${idx} AND user_id = $${idx + 1}
      RETURNING *
    `;

    const res = await db.query(queryText, values);
    return res.rows[0] || null;
  }

  async delete(id, userId) {
    const res = await db.query(
      'DELETE FROM short_links WHERE id = $1 AND user_id = $2 RETURNING id',
      [id, userId]
    );
    return res.rowCount > 0;
  }

  async incrementClicks(id) {
    await db.query('UPDATE short_links SET click_count = click_count + 1 WHERE id = $1', [id]);
  }
}

module.exports = new LinksRepository();

