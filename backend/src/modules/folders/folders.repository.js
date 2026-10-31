// folders.repository.js
const db = require('../../database/db');

class FoldersRepository {
  async findByUser(userId) {
    const res = await db.query(
      `SELECT f.*, COUNT(l.id)::int as link_count
       FROM folders f
       LEFT JOIN short_links l ON f.id = l.folder_id
       WHERE f.user_id = $1
       GROUP BY f.id
       ORDER BY f.created_at DESC`,
      [userId]
    );
    return res.rows;
  }

  async create({ userId, name, color = '#3B82F6' }) {
    const res = await db.query(
      'INSERT INTO folders (user_id, name, color) VALUES ($1, $2, $3) RETURNING *',
      [userId, name, color]
    );
    return res.rows[0];
  }

  async delete(id, userId) {
    const res = await db.query('DELETE FROM folders WHERE id = $1 AND user_id = $2 RETURNING id', [id, userId]);
    return res.rowCount > 0;
  }
}

module.exports = new FoldersRepository();

