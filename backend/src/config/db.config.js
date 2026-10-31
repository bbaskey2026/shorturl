// db.config.js
const dotenv = require('dotenv');
dotenv.config();

module.exports = {
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/shorturl_db',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  database: process.env.DB_NAME || 'shorturl_db',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  max: parseInt(process.env.DB_POOL_MAX || '20', 10),
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
};

