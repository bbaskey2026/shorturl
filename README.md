# ShortSaaS — Modern URL Shortener Platform

A high-concurrency, scalable URL Shortener SaaS platform inspired by the dark, minimalist visual language of **Muse.ai**.

---

## 🏗️ Architectural Overview

This platform uses a **hybrid Node.js + Golang architecture**:

```
                       ┌────────────────────────┐
                       │     Visitor Traffic    │
                       └───────────┬────────────┘
                                   │
                                   ▼
                       ┌────────────────────────┐
                       │   Reverse Proxy / Host │
                       └─────┬────────────┬─────┘
                             │            │
            /api/v1/* (Admin,│            │  /:shortCode (High-speed redirects)
            Auth, Management)│            │
                             ▼            ▼
                   ┌──────────────┐  ┌──────────────────────┐
                   │   Node.js    │  │     Golang Engine    │
                   │  Express API │  │  (Redirect Service)  │
                   └──────┬───────┘  └──────────┬───────────┘
                          │                     │
                          │                     ▼ (Non-blocking Channel/Queue)
                          ▼              ┌─────────────┐
                   ┌──────────────┐      │  Analytics  │
                   │  PostgreSQL  │◄─────┤   Worker    │
                   │ (Relational) │      │  (Batched)  │
                   └──────────────┘      └─────────────┘
```

1. **Frontend (`/url`)**: Feature-based React 19 application with a Muse.ai-inspired tokenized theme engine (Dark, Light, System themes, strictly without Tailwind CSS).
2. **Node.js Express API (`/backend`)**: Modular 4-layer architecture (`Repository` -> `Service` -> `Controller` -> `Routes`) handling Auth (JWT + RBAC), link CRUD, custom domain verification, folder/tag taxonomy, subscription entitlements, and admin controls.
3. **Golang Redirection Engine (`/golang-services`)**: Sub-millisecond URL resolution with in-memory hot caching, password protection checks, expiration enforcement, and non-blocking asynchronous event queuing.
4. **PostgreSQL Relational DB (`/backend/migrations`)**: Normalized schema with UUID primary keys, compound indexes, and audit logs.

---

## 🚀 Getting Started

### 1. Frontend (React 19 + Muse.ai Design System)
```bash
cd url
npm install
npm run dev
# Open http://localhost:3000
```

### 2. Node.js API Gateway & Management Backend
```bash
cd backend
npm install
npm start
# Server listens on http://localhost:5000
```

### 3. Golang High-Concurrency Redirection Engine
```bash
cd golang-services
go run ./cmd/redirect
# Redirection service listens on http://localhost:8080
```

---

## 🧪 Testing

### Node.js Security & Layer Tests
```bash
node --test backend/tests/urlValidator.test.js
```

### Go Redirection & Visitor Telemetry Tests
```bash
cd golang-services
go test ./...
```

---

## 🛡️ Security Features
- **SSRF Protection**: Rejects localhost, 127.0.0.1, private IP ranges (10.x, 192.168.x, 172.16.x), and cloud metadata endpoints (`169.254.169.254`).
- **Malicious Protocol Defense**: Only `http:` and `https:` destination protocols are allowed (blocks `javascript:`, `data:`, `file:`).
- **Password Protection**: Optional bcrypt/SHA-256 password challenge before redirection.
- **Privacy Telemetry**: IP addresses are not stored in raw plaintext; daily salted SHA-256 visitor hashes are computed for unique visitor analytics.
- **Rate Limiting**: Sliding window rate limiting on sensitive routes (authentication, link shortening).

