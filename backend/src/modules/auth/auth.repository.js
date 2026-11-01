// auth.repository.js - PostgreSQL Data Access for Users, Sessions, and Refresh Tokens
const crypto = require('crypto');
const db = require('../../database/db');

// In-memory store fallback for isolated unit testing or offline environments
const memoryStore = {
  users: new Map(),
  refreshTokens: new Map(),
  auditLogs: [],
};

class AuthRepository {
  async findByEmail(email) {
    const normalized = email.toLowerCase().trim();
    if (db.isConnected) {
      try {
        const res = await db.query(
          `SELECT id, email, password_hash, COALESCE(name, full_name) as name, role, plan, status, 
                  COALESCE(email_verified, is_verified) as email_verified, created_at, updated_at
           FROM users 
           WHERE LOWER(email) = $1 AND (deleted_at IS NULL)`,
          [normalized]
        );
        return res.rows[0] || null;
      } catch (err) {
        console.warn('DB query error in findByEmail, using fallback store:', err.message);
      }
    }

    // Memory store fallback
    for (const u of memoryStore.users.values()) {
      if (u.email.toLowerCase() === normalized && !u.deleted_at) {
        return { ...u };
      }
    }
    return null;
  }

  async findById(id) {
    if (db.isConnected) {
      try {
        const res = await db.query(
          `SELECT id, email, password_hash, COALESCE(name, full_name) as name, role, plan, status, 
                  COALESCE(email_verified, is_verified) as email_verified, created_at, updated_at
           FROM users 
           WHERE id = $1 AND (deleted_at IS NULL)`,
          [id]
        );
        return res.rows[0] || null;
      } catch (err) {
        console.warn('DB query error in findById, using fallback store:', err.message);
      }
    }

    const u = memoryStore.users.get(id);
    return u && !u.deleted_at ? { ...u } : null;
  }

  async create({ email, passwordHash, name, role = 'CUSTOMER', plan = 'free', status = 'ACTIVE' }) {
    const normalizedEmail = email.toLowerCase().trim();
    const normalizedRole = role.toUpperCase();
    const id = crypto.randomUUID();
    const now = new Date();

    if (db.isConnected) {
      try {
        const res = await db.query(
          `INSERT INTO users (id, email, password_hash, name, full_name, role, plan, status, email_verified, is_verified, created_at, updated_at)
           VALUES ($1, $2, $3, $4, $4, $5, $6, $7, true, true, $8, $8)
           RETURNING id, email, name, role, plan, status, email_verified, created_at`,
          [id, normalizedEmail, passwordHash, name, normalizedRole, plan, status, now]
        );
        return res.rows[0];
      } catch (err) {
        console.warn('DB query error in create, using fallback store:', err.message);
      }
    }

    const user = {
      id,
      email: normalizedEmail,
      password_hash: passwordHash,
      name,
      role: normalizedRole,
      plan,
      status,
      email_verified: true,
      created_at: now,
      updated_at: now,
    };
    memoryStore.users.set(id, user);

    const { password_hash, ...safeUser } = user;
    return safeUser;
  }

  async updatePassword(userId, passwordHash) {
    const now = new Date();
    if (db.isConnected) {
      try {
        await db.query(
          `UPDATE users SET password_hash = $1, updated_at = $2 WHERE id = $3`,
          [passwordHash, now, userId]
        );
        return true;
      } catch (err) {
        console.warn('DB query error in updatePassword, using fallback store:', err.message);
      }
    }

    const u = memoryStore.users.get(userId);
    if (u) {
      u.password_hash = passwordHash;
      u.updated_at = now;
      return true;
    }
    return false;
  }

  async updateStatus(userId, status) {
    const now = new Date();
    if (db.isConnected) {
      try {
        await db.query(
          `UPDATE users SET status = $1, updated_at = $2 WHERE id = $3`,
          [status, now, userId]
        );
        return true;
      } catch (err) {
        console.warn('DB query error in updateStatus, using fallback store:', err.message);
      }
    }

    const u = memoryStore.users.get(userId);
    if (u) {
      u.status = status;
      u.updated_at = now;
      return true;
    }
    return false;
  }

  // ================= REFRESH TOKEN SESSIONS =================

  async createRefreshToken({ userId, tokenHash, tokenFamilyId, sessionId, expiresAt, userAgent, ipAddress }) {
    const id = crypto.randomUUID();
    const now = new Date();

    if (db.isConnected) {
      try {
        const res = await db.query(
          `INSERT INTO refresh_tokens (id, user_id, token_hash, token_family_id, session_id, expires_at, created_at, last_used_at, user_agent, ip_address)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $7, $8, $9)
           RETURNING id, user_id, token_hash, token_family_id, session_id, expires_at, created_at`,
          [id, userId, tokenHash, tokenFamilyId, sessionId, expiresAt, now, userAgent || null, ipAddress || null]
        );
        return res.rows[0];
      } catch (err) {
        console.warn('DB query error in createRefreshToken, using fallback store:', err.message);
      }
    }

    const record = {
      id,
      user_id: userId,
      token_hash: tokenHash,
      token_family_id: tokenFamilyId,
      session_id: sessionId,
      expires_at: expiresAt,
      revoked_at: null,
      replaced_by_token_id: null,
      created_at: now,
      last_used_at: now,
      user_agent: userAgent || null,
      ip_address: ipAddress || null,
    };
    memoryStore.refreshTokens.set(tokenHash, record);
    return record;
  }

  async findRefreshTokenByHash(tokenHash) {
    if (db.isConnected) {
      try {
        const res = await db.query(
          `SELECT id, user_id, token_hash, token_family_id, session_id, expires_at, revoked_at, replaced_by_token_id, created_at, last_used_at
           FROM refresh_tokens 
           WHERE token_hash = $1`,
          [tokenHash]
        );
        return res.rows[0] || null;
      } catch (err) {
        console.warn('DB query error in findRefreshTokenByHash, using fallback store:', err.message);
      }
    }

    const token = memoryStore.refreshTokens.get(tokenHash);
    return token ? { ...token } : null;
  }

  async rotateRefreshToken({ oldTokenId, oldTokenHash, newTokenHash, newExpiresAt, userAgent, ipAddress, tokenFamilyId, sessionId, userId }) {
    const newId = crypto.randomUUID();
    const now = new Date();

    if (db.isConnected) {
      try {
        return await db.transaction(async (client) => {
          // 1. Insert new rotated token
          await client.query(
            `INSERT INTO refresh_tokens (id, user_id, token_hash, token_family_id, session_id, expires_at, created_at, last_used_at, user_agent, ip_address)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $7, $8, $9)`,
            [newId, userId, newTokenHash, tokenFamilyId, sessionId, newExpiresAt, now, userAgent || null, ipAddress || null]
          );

          // 2. Mark old token as revoked and record succession
          await client.query(
            `UPDATE refresh_tokens 
             SET revoked_at = $1, replaced_by_token_id = $2, last_used_at = $1 
             WHERE id = $3`,
            [now, newId, oldTokenId]
          );

          return { id: newId, token_hash: newTokenHash, expires_at: newExpiresAt };
        });
      } catch (err) {
        console.warn('DB transaction error in rotateRefreshToken, using fallback store:', err.message);
      }
    }

    // Memory store fallback atomic rotation
    const oldRecord = memoryStore.refreshTokens.get(oldTokenHash);
    if (oldRecord) {
      oldRecord.revoked_at = now;
      oldRecord.replaced_by_token_id = newId;
      oldRecord.last_used_at = now;
    }

    const newRecord = {
      id: newId,
      user_id: userId,
      token_hash: newTokenHash,
      token_family_id: tokenFamilyId,
      session_id: sessionId,
      expires_at: newExpiresAt,
      revoked_at: null,
      replaced_by_token_id: null,
      created_at: now,
      last_used_at: now,
      user_agent: userAgent || null,
      ip_address: ipAddress || null,
    };
    memoryStore.refreshTokens.set(newTokenHash, newRecord);
    return newRecord;
  }

  async revokeTokenFamily(tokenFamilyId) {
    const now = new Date();
    if (db.isConnected) {
      try {
        await db.query(
          `UPDATE refresh_tokens SET revoked_at = $1 WHERE token_family_id = $2 AND revoked_at IS NULL`,
          [now, tokenFamilyId]
        );
        return;
      } catch (err) {
        console.warn('DB query error in revokeTokenFamily, using fallback store:', err.message);
      }
    }

    for (const record of memoryStore.refreshTokens.values()) {
      if (record.token_family_id === tokenFamilyId && !record.revoked_at) {
        record.revoked_at = now;
      }
    }
  }

  async revokeToken(tokenHash) {
    const now = new Date();
    if (db.isConnected) {
      try {
        await db.query(
          `UPDATE refresh_tokens SET revoked_at = $1 WHERE token_hash = $2 AND revoked_at IS NULL`,
          [now, tokenHash]
        );
        return;
      } catch (err) {
        console.warn('DB query error in revokeToken, using fallback store:', err.message);
      }
    }

    const token = memoryStore.refreshTokens.get(tokenHash);
    if (token && !token.revoked_at) {
      token.revoked_at = now;
    }
  }

  async revokeAllUserTokens(userId) {
    const now = new Date();
    if (db.isConnected) {
      try {
        await db.query(
          `UPDATE refresh_tokens SET revoked_at = $1 WHERE user_id = $2 AND revoked_at IS NULL`,
          [now, userId]
        );
        return;
      } catch (err) {
        console.warn('DB query error in revokeAllUserTokens, using fallback store:', err.message);
      }
    }

    for (const record of memoryStore.refreshTokens.values()) {
      if (record.user_id === userId && !record.revoked_at) {
        record.revoked_at = now;
      }
    }
  }

  async logSecurityEvent({ userId, action, ipAddress, userAgent, details }) {
    const now = new Date();
    if (db.isConnected) {
      try {
        await db.query(
          `INSERT INTO security_audit_logs (user_id, action, ip_address, user_agent, details, created_at)
           VALUES ($1, $2, $3, $4, $5, $6)`,
          [userId || null, action, ipAddress || null, userAgent || null, details ? JSON.stringify(details) : null, now]
        );
        return;
      } catch (err) {
        // Log locally if db fails
      }
    }
    memoryStore.auditLogs.push({ userId, action, ipAddress, userAgent, details, created_at: now });
  }

  // Clean memory store (useful between test runs)
  _clearMemoryStore() {
    memoryStore.users.clear();
    memoryStore.refreshTokens.clear();
    memoryStore.auditLogs = [];
  }
}

module.exports = new AuthRepository();
