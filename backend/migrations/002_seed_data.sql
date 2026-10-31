-- 002_seed_data.sql
-- Initial Seed Data for development and testing

-- Password for admin is 'Admin@123' (bcrypt hash: $2a$10$wN1r0EaKqmR7oE/KSp.0eehV3gGf70Kq.gZvhMhyx7D.sKjZ62oT.)
INSERT INTO users (id, email, password_hash, full_name, role, plan, is_verified)
VALUES (
    'a0000000-0000-0000-0000-000000000001',
    'admin@shorturl.io',
    '$2a$10$wN1r0EaKqmR7oE/KSp.0eehV3gGf70Kq.gZvhMhyx7D.sKjZ62oT.',
    'System Architect',
    'admin',
    'business',
    true
) ON CONFLICT (email) DO NOTHING;

-- Seed default custom domain
INSERT INTO custom_domains (id, user_id, domain, verification_token, is_verified, is_default)
VALUES (
    'b0000000-0000-0000-0000-000000000001',
    'a0000000-0000-0000-0000-000000000001',
    'short.io',
    'v=verify-short-io-seed',
    true,
    true
) ON CONFLICT (domain) DO NOTHING;

-- Seed folders
INSERT INTO folders (id, user_id, name, color)
VALUES 
    ('c0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'Engineering & OSS', '#3B82F6'),
    ('c0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000001', 'Marketing Campaigns', '#10B981')
ON CONFLICT DO NOTHING;

-- Seed links
INSERT INTO short_links (id, user_id, domain_id, folder_id, original_url, short_code, title, is_active, click_count)
VALUES 
    (
        'd0000000-0000-0000-0000-000000000001',
        'a0000000-0000-0000-0000-000000000001',
        'b0000000-0000-0000-0000-000000000001',
        'c0000000-0000-0000-0000-000000000001',
        'https://github.com/golang/go',
        'golang-repo',
        'Golang Official Repository',
        true,
        1420
    ),
    (
        'd0000000-0000-0000-0000-000000000002',
        'a0000000-0000-0000-0000-000000000001',
        'b0000000-0000-0000-0000-000000000001',
        'c0000000-0000-0000-0000-000000000002',
        'https://postgresql.org',
        'pg-docs',
        'PostgreSQL Documentation',
        true,
        864
    )
ON CONFLICT DO NOTHING;

