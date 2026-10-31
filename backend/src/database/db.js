// db.js - PostgreSQL Pool with graceful degradation
const { Pool } = require('pg');
const config = require('../config/db.config');

const pool = new Pool(
  config.connectionString
    ? { connectionString: config.connectionString, max: config.max }
    : {
        host: config.host,
        port: config.port,
        database: config.database,
        user: config.user,
        password: config.password,
        max: config.max,
      }
);

let isConnected = false;

pool.on('connect', () => {
  isConnected = true;
});

pool.on('error', (err) => {
  console.warn('⚠️  PostgreSQL pool error:', err.message);
  isConnected = false;
});

// Parameterized query execution wrapper
const query = async (text, params = []) => {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    if (process.env.NODE_ENV === 'development') {
      console.log(`Executed query (${duration}ms):`, { text: text.trim().substring(0, 100), rows: res.rowCount });
    }
    return res;
  } catch (error) {
    console.error('Database query error:', { text, error: error.message });
    throw error;
  }
};

// Transaction wrapper
const transaction = async (callback) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const result = await callback(client);
    await client.query('COMMIT');
    return result;
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
};

const checkConnection = async () => {
  try {
    await pool.query('SELECT 1');
    isConnected = true;
    return true;
  } catch (e) {
    isConnected = false;
    return false;
  }
};

module.exports = {
  pool,
  query,
  transaction,
  checkConnection,
  get isConnected() {
    return isConnected;
  },
};

