const test = require('node:test');
const assert = require('node:assert/strict');
const subService = require('../src/modules/subscriptions/subscriptions.service');
const { isValidUrl, isValidSlug } = require('../src/utils/urlValidator');
const { hashPassword, comparePassword } = require('../src/utils/hash');

test('Subscription Service Entitlements', async (t) => {
  await t.test('returns all configured subscription tiers', () => {
    const plans = subService.getPlans();
    assert.ok(Array.isArray(plans));
    assert.equal(plans.length, 4);

    const pro = plans.find((p) => p.id === 'pro');
    assert.ok(pro);
    assert.equal(pro.maxLinks, 5000);
    assert.equal(pro.maxMonthlyClicks, 250000);
    assert.equal(pro.maxCustomDomains, 5);
    assert.equal(pro.allowPasswordProtection, true);
  });
});

test('Password Hashing & Authentication Security', async (t) => {
  await t.test('hashes password and verifies match correctly', async () => {
    const password = 'SuperSecretPassword2026!';
    const hash = await hashPassword(password);
    assert.ok(hash);
    assert.notEqual(hash, password);

    const isMatch = await comparePassword(password, hash);
    assert.equal(isMatch, true);

    const isWrongMatch = await comparePassword('WrongPassword', hash);
    assert.equal(isWrongMatch, false);
  });
});

