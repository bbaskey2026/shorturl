// auth.repository.js - Database queries for authentication
const db = require('../../database/db');

class AuthRepository {
  async findByEmail(email) {
    const res = await db.query(
      'SELECT id, email, password_hash, full_name, role, plan, is_verified, created_at FROM users WHERE email = $1',
      [email.toLowerCase()]
    );
    return res.rows[0] || null;
  }

  async findById(id) {
    const res = await db.query(
      'SELECT id, email, full_name, role, plan, is_verified, created_at FROM users WHERE id = $1',
      [id]
    );
    return res.rows[0] || null;
  }

  async create({ email, passwordHash, fullName, role = 'user', plan = 'free' }) {
    const res = await db.query(
      `INSERT INTO users (email, password_hash, full_name, role, plan, is_verified)
       VALUES ($1, $2, $3, $4, $5, true)
       RETURNING id, email, full_name, role, plan, created_at`,
      [email.toLowerCase(), passwordHash, fullName, role, plan]
    );
    return res.rows[0];
  }
}

module.exports = new AuthRepository();

