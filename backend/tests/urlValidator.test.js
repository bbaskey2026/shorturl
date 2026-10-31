const test = require('node:test');
const assert = require('node:assert/strict');
const { isValidUrl, isValidSlug } = require('../src/utils/urlValidator');

test('URL Validator Security Checks', async (t) => {
  await t.test('accepts valid https URLs', () => {
    const res = isValidUrl('https://github.com/developer/project');
    assert.equal(res.valid, true);
    assert.equal(res.url, 'https://github.com/developer/project');
  });

  await t.test('accepts valid http URLs', () => {
    const res = isValidUrl('http://example.com/blog');
    assert.equal(res.valid, true);
  });

  await t.test('blocks javascript: URLs (XSS protection)', () => {
    const res = isValidUrl('javascript:alert(1)');
    assert.equal(res.valid, false);
  });

  await t.test('blocks data: URLs', () => {
    const res = isValidUrl('data:text/html,<html>attack</html>');
    assert.equal(res.valid, false);
  });

  await t.test('blocks SSRF to localhost', () => {
    const res = isValidUrl('http://localhost:5432');
    assert.equal(res.valid, false);
  });

  await t.test('blocks SSRF to 127.0.0.1', () => {
    const res = isValidUrl('http://127.0.0.1:8080');
    assert.equal(res.valid, false);
  });

  await t.test('blocks SSRF to AWS metadata 169.254.169.254', () => {
    const res = isValidUrl('http://169.254.169.254/latest/meta-data/');
    assert.equal(res.valid, false);
  });

  await t.test('blocks SSRF to internal 192.168.x.x subnet', () => {
    const res = isValidUrl('http://192.168.1.1/admin');
    assert.equal(res.valid, false);
  });
});

test('Slug Validator Checks', async (t) => {
  await t.test('allows valid alphanumeric slugs', () => {
    assert.equal(isValidSlug('my-custom-slug_2026'), true);
  });

  await t.test('rejects spaces and illegal characters', () => {
    assert.equal(isValidSlug('invalid slug with spaces'), false);
    assert.equal(isValidSlug('slug/with/slash'), false);
    assert.equal(isValidSlug('slug?query=1'), false);
  });
});

