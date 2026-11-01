// app.js - Production-Ready Express Application
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const db = require('./database/db');
const { errorHandler } = require('./middleware/error.middleware');
const { success, error } = require('./utils/response');

// Import Module Routes
const authRoutes = require('./modules/auth/auth.routes');
const adminAuthRoutes = require('./modules/auth/admin-auth.routes');
const linksRoutes = require('./modules/links/links.routes');
const analyticsRoutes = require('./modules/analytics/analytics.routes');
const domainsRoutes = require('./modules/domains/domains.routes');
const foldersRoutes = require('./modules/folders/folders.routes');
const subscriptionsRoutes = require('./modules/subscriptions/subscriptions.routes');
const adminRoutes = require('./modules/admin/admin.routes');
const linksRepo = require('./modules/links/links.repository');
const { comparePassword } = require('./utils/hash');
const { cookieParser } = require('./middleware/cookie.middleware');

const app = express();

// Security & Parsing Middleware
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-CSRF-Token', 'X-Requested-With'],
  })
);
app.use(express.json());
app.use(cookieParser);

// Health & Telemetry Check
app.get('/health', async (req, res) => {
  const dbOk = await db.checkConnection();
  return success(res, {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    database: dbOk ? 'connected' : 'disconnected (offline mode)',
    service: 'shorturl-node-gateway',
    version: '2.0.0',
  });
});

// Mount Versioned API Modules (v1)
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/admin/auth', adminAuthRoutes);
app.use('/api/v1/links', linksRoutes);
app.use('/api/v1/analytics', analyticsRoutes);
app.use('/api/v1/domains', domainsRoutes);
app.use('/api/v1/folders', foldersRoutes);
app.use('/api/v1/subscriptions', subscriptionsRoutes);
app.use('/api/v1/admin', adminRoutes);

// Backwards-Compatible Unversioned Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin/auth', adminAuthRoutes);
app.use('/api/links', linksRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/domains', domainsRoutes);
app.use('/api/folders', foldersRoutes);
app.use('/api/subscriptions', subscriptionsRoutes);
app.use('/api/admin', adminRoutes);

// Backwards-Compatible Short URL Redirection
// (When traffic hits Node directly rather than the Go Redirection Engine)
app.get('/:shortCode', async (req, res, next) => {
  const { shortCode } = req.params;
  const host = (req.headers.host || '').split(':')[0];

  // Skip favicon / api routes
  if (shortCode === 'favicon.ico' || shortCode.startsWith('api')) {
    return res.status(404).send('Not found');
  }

  try {
    const link = await linksRepo.findByCode(shortCode);
    if (!link) {
      return res.status(404).send(`
        <!DOCTYPE html>
        <html>
        <head><title>Link Not Found</title></head>
        <body style="font-family:sans-serif; background:#08090D; color:#F9FAFB; display:flex; align-items:center; justify-content:center; height:100vh; margin:0;">
          <div style="text-align:center; padding:32px; border:1px solid rgba(255,255,255,0.1); border-radius:12px; background:#12141A;">
            <h1 style="color:#EF4444; margin-bottom:8px;">404 - Link Not Found</h1>
            <p style="color:#9CA3AF;">The short link code '<b>${shortCode}</b>' does not exist or has been removed.</p>
          </div>
        </body>
        </html>
      `);
    }

    // Check active
    if (!link.is_active) {
      return res.status(410).send('This short link has been disabled by its owner.');
    }

    // Check expiration
    if (link.expires_at && new Date(link.expires_at) < new Date()) {
      return res.status(410).send('This short link has expired.');
    }

    // Check password protection
    if (link.password_hash) {
      const providedPwd = req.query.pwd;
      if (!providedPwd) {
        return res.status(401).send(`
          <!DOCTYPE html>
          <html>
          <head><title>Password Required</title></head>
          <body style="font-family:sans-serif; background:#08090D; color:#F9FAFB; display:flex; align-items:center; justify-content:center; height:100vh; margin:0;">
            <form method="GET" style="padding:32px; border:1px solid rgba(255,255,255,0.1); border-radius:12px; background:#12141A; display:flex; flex-direction:column; gap:16px; min-width:300px;">
              <h2 style="margin:0; font-size:18px;">🔒 Password Protected Link</h2>
              <input type="password" name="pwd" placeholder="Enter access password" required style="padding:10px; border-radius:8px; border:1px solid rgba(255,255,255,0.2); background:#1D2232; color:#FFF;" />
              <button type="submit" style="padding:10px; border-radius:8px; border:none; background:#3B82F6; color:#FFF; font-weight:600; cursor:pointer;">Access Destination</button>
            </form>
          </body>
          </html>
        `);
      }

      const match = await comparePassword(providedPwd, link.password_hash);
      if (!match) {
        return res.status(403).send('Invalid password provided.');
      }
    }

    // Asynchronously record click (non-blocking)
    linksRepo.incrementClicks(link.id).catch((e) => console.error('Click increment error:', e.message));

    // Redirect with 302 Found
    return res.redirect(302, link.original_url);
  } catch (err) {
    next(err);
  }
});

// Centralized error handling
app.use(errorHandler);

const PORT = parseInt(process.env.PORT || '5000', 10);

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`🚀 Layered Node.js API Gateway listening on http://localhost:${PORT}`);
  });
}

module.exports = app;

