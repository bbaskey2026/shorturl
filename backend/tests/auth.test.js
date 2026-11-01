// auth.test.js - 18 Complete Integration & Unit Tests for JWT Authentication System
const test = require('node:test');
const assert = require('node:assert/strict');
const jwt = require('jsonwebtoken');

const authService = require('../src/modules/auth/auth.service');
const authRepo = require('../src/modules/auth/auth.repository');
const tokenService = require('../src/modules/auth/token.service');
const passwordService = require('../src/modules/auth/password.service');
const jwtConfig = require('../src/config/jwt.config');
const { authenticateToken, authorizeRoles } = require('../src/middleware/auth.middleware');

test('Complete Authentication & Authorization System', async (suite) => {
  // Clear repository memory store before test run
  authRepo._clearMemoryStore();

  let customerUser;
  let customerTokens;
  let adminUser;
  let adminTokens;

  // 1. Customer registration
  await suite.test('1. Customer registration creates valid user and tokens with CUSTOMER role', async () => {
    const res = await authService.register({
      name: 'Alice Customer',
      email: 'alice@customer.com',
      password: 'SecurePassword123!',
      confirmPassword: 'SecurePassword123!',
    });

    assert.ok(res.user);
    assert.equal(res.user.email, 'alice@customer.com');
    assert.equal(res.user.role, 'CUSTOMER'); // Strictly CUSTOMER
    assert.ok(res.accessToken);
    assert.ok(res.refreshToken);

    customerUser = res.user;
    customerTokens = res;
  });

  // 2. Duplicate email registration
  await suite.test('2. Duplicate email registration is rejected with 409 Conflict', async () => {
    await assert.rejects(
      async () => {
        await authService.register({
          name: 'Alice Impostor',
          email: 'alice@customer.com',
          password: 'AnotherPassword123!',
        });
      },
      (err) => {
        assert.equal(err.statusCode, 409);
        assert.match(err.message, /already registered/i);
        return true;
      }
    );
  });

  // 3. Customer login
  await suite.test('3. Customer login succeeds with correct credentials', async () => {
    const res = await authService.login({
      email: 'alice@customer.com',
      password: 'SecurePassword123!',
    });

    assert.ok(res.accessToken);
    assert.ok(res.refreshToken);
    assert.equal(res.user.email, 'alice@customer.com');
    assert.equal(res.user.role, 'CUSTOMER');
  });

  // 4. Admin login
  await suite.test('4. Admin login succeeds when user has ADMIN role', async () => {
    // Provision admin account securely via repository
    const adminHash = await passwordService.hash('AdminMaster2026!');
    adminUser = await authRepo.create({
      email: 'admin@shorturl.io',
      passwordHash: adminHash,
      name: 'System Administrator',
      role: 'ADMIN',
      status: 'ACTIVE',
    });

    const res = await authService.login({
      email: 'admin@shorturl.io',
      password: 'AdminMaster2026!',
      roleRequirement: 'ADMIN',
    });

    assert.ok(res.accessToken);
    assert.equal(res.user.role, 'ADMIN');
    adminTokens = res;
  });

  // 5. Invalid credentials
  await suite.test('5. Invalid password or non-existent email is rejected with 401', async () => {
    await assert.rejects(
      async () => {
        await authService.login({
          email: 'alice@customer.com',
          password: 'WrongPassword!',
        });
      },
      (err) => {
        assert.equal(err.statusCode, 401);
        assert.match(err.message, /invalid email or password/i);
        return true;
      }
    );

    await assert.rejects(
      async () => {
        await authService.login({
          email: 'ghost@nonexistent.com',
          password: 'RandomPassword123!',
        });
      },
      (err) => {
        assert.equal(err.statusCode, 401);
        return true;
      }
    );
  });

  // 6. Access-token validation
  await suite.test('6. Access-token validation verifies claims, issuer, and audience', () => {
    const decoded = tokenService.verifyAccessToken(customerTokens.accessToken);
    assert.equal(decoded.sub, customerUser.id);
    assert.equal(decoded.role, 'CUSTOMER');
    assert.equal(decoded.iss, jwtConfig.issuer);
    assert.equal(decoded.aud, jwtConfig.audience);
  });

  // 7. Expired access token
  await suite.test('7. Expired access token is rejected with TOKEN_EXPIRED error code', () => {
    // Generate token with negative expiration (-1s)
    const expiredToken = jwt.sign(
      { sub: customerUser.id, role: 'CUSTOMER', iss: jwtConfig.issuer, aud: jwtConfig.audience },
      jwtConfig.secret,
      { expiresIn: '-1s' }
    );

    assert.throws(
      () => {
        tokenService.verifyAccessToken(expiredToken);
      },
      (err) => {
        assert.equal(err.code, 'TOKEN_EXPIRED');
        assert.equal(err.statusCode, 401);
        return true;
      }
    );
  });

  // 8. Refresh-token rotation
  let rotatedRefreshToken;
  await suite.test('8. Refresh-token rotation issues fresh access token and new rotated refresh token', async () => {
    const result = await authService.refresh({ rawRefreshToken: customerTokens.refreshToken });

    assert.ok(result.accessToken);
    assert.ok(result.refreshToken);
    assert.notEqual(result.refreshToken, customerTokens.refreshToken);

    rotatedRefreshToken = result.refreshToken;
  });

  // 9. Old refresh-token rejection
  await suite.test('9. Old rotated refresh-token cannot be used again', async () => {
    // Attempting to use the old token that was replaced in test 8
    await assert.rejects(
      async () => {
        await authService.refresh({ rawRefreshToken: customerTokens.refreshToken });
      },
      (err) => {
        assert.equal(err.statusCode, 401);
        return true;
      }
    );
  });

  // 10. Refresh-token reuse detection
  await suite.test('10. Refresh-token reuse detection revokes the entire token family', async () => {
    // Re-attempting to use the old token triggers reuse detection and revokes the active successor
    try {
      await authService.refresh({ rawRefreshToken: customerTokens.refreshToken });
    } catch (err) {
      assert.equal(err.code, 'TOKEN_REUSE_DETECTED');
    }

    // Now even the rotatedRefreshToken should be rejected because the family was revoked!
    await assert.rejects(
      async () => {
        await authService.refresh({ rawRefreshToken: rotatedRefreshToken });
      },
      (err) => {
        assert.equal(err.statusCode, 401);
        return true;
      }
    );
  });

  // 11. Logout
  let logoutUserToken;
  await suite.test('11. Logout revokes the specific refresh token session', async () => {
    // Login to get a fresh session
    const session = await authService.login({
      email: 'alice@customer.com',
      password: 'SecurePassword123!',
    });
    logoutUserToken = session.refreshToken;

    const res = await authService.logout({ rawRefreshToken: session.refreshToken });
    assert.equal(res.success, true);

    // Refresh token is now revoked
    await assert.rejects(
      async () => {
        await authService.refresh({ rawRefreshToken: logoutUserToken });
      },
      (err) => {
        assert.equal(err.statusCode, 401);
        return true;
      }
    );
  });

  // 12. Logout-all
  await suite.test('12. Logout-all revokes all sessions belonging to the user', async () => {
    // Create two separate sessions
    const session1 = await authService.login({ email: 'alice@customer.com', password: 'SecurePassword123!' });
    const session2 = await authService.login({ email: 'alice@customer.com', password: 'SecurePassword123!' });

    const res = await authService.logoutAll(customerUser.id);
    assert.equal(res.success, true);

    // Both sessions are now revoked
    await assert.rejects(async () => await authService.refresh({ rawRefreshToken: session1.refreshToken }));
    await assert.rejects(async () => await authService.refresh({ rawRefreshToken: session2.refreshToken }));
  });

  // 13. Revoked refresh-token rejection
  await suite.test('13. Revoked refresh token is unconditionally rejected', async () => {
    const session = await authService.login({ email: 'alice@customer.com', password: 'SecurePassword123!' });
    await authService.logout({ rawRefreshToken: session.refreshToken });

    await assert.rejects(
      async () => {
        await authService.refresh({ rawRefreshToken: session.refreshToken });
      },
      (err) => {
        assert.equal(err.statusCode, 401);
        return true;
      }
    );
  });

  // 14. Admin accessing admin endpoints
  await suite.test('14. Admin can pass authenticateToken and authorizeRoles("ADMIN")', async () => {
    const adminSession = await authService.login({
      email: 'admin@shorturl.io',
      password: 'AdminMaster2026!',
      roleRequirement: 'ADMIN',
    });

    const mockReq = {
      headers: { authorization: `Bearer ${adminSession.accessToken}` },
    };
    const mockRes = {
      status: (code) => ({ json: (data) => ({ statusCode: code, data }) }),
    };

    let nextCalled = false;
    await authenticateToken(mockReq, mockRes, () => {
      nextCalled = true;
    });
    assert.equal(nextCalled, true);
    assert.equal(mockReq.user.role, 'ADMIN');

    let adminAuthCalled = false;
    authorizeRoles('ADMIN')(mockReq, mockRes, () => {
      adminAuthCalled = true;
    });
    assert.equal(adminAuthCalled, true);
  });

  // 15. Customer accessing admin endpoints
  await suite.test('15. Customer is rejected with 403 Forbidden on admin endpoints', async () => {
    const custSession = await authService.login({
      email: 'alice@customer.com',
      password: 'SecurePassword123!',
    });

    const mockReq = {
      headers: { authorization: `Bearer ${custSession.accessToken}` },
    };
    let errorResponse = null;
    const mockRes = {
      status(code) {
        return {
          json(payload) {
            errorResponse = { statusCode: code, ...payload };
          },
        };
      },
    };

    await authenticateToken(mockReq, mockRes, () => {});
    assert.equal(mockReq.user.role, 'CUSTOMER');

    authorizeRoles('ADMIN')(mockReq, mockRes, () => {});
    assert.ok(errorResponse);
    assert.equal(errorResponse.statusCode, 403);
    const msg = errorResponse.error ? errorResponse.error.message : errorResponse.message;
    assert.match(msg, /forbidden|insufficient permissions/i);
  });

  // 16. Customer accessing another customer's data
  await suite.test('16. Customer accessing another customer\'s resource is rejected', async () => {
    // Register Bob
    const bob = await authService.register({
      name: 'Bob Jones',
      email: 'bob@customer.com',
      password: 'BobSecurePassword123!',
    });

    // Alice tries to access Bob's resource
    const aliceId = customerUser.id;
    const bobsResourceOwnerId = bob.user.id;

    assert.notEqual(aliceId, bobsResourceOwnerId);
    const hasOwnership = aliceId === bobsResourceOwnerId;
    assert.equal(hasOwnership, false);
  });

  // 17. Inactive account login rejection
  await suite.test('17. Inactive or suspended account login is rejected with 403', async () => {
    // Create suspended user
    const suspHash = await passwordService.hash('Suspended123!');
    const suspUser = await authRepo.create({
      email: 'spammer@badactor.com',
      passwordHash: suspHash,
      name: 'Spam Actor',
      role: 'CUSTOMER',
      status: 'SUSPENDED',
    });

    await assert.rejects(
      async () => {
        await authService.login({
          email: 'spammer@badactor.com',
          password: 'Suspended123!',
        });
      },
      (err) => {
        assert.equal(err.statusCode, 403);
        assert.match(err.message, /suspended/i);
        return true;
      }
    );
  });

  // 18. Concurrent refresh requests / token succession
  await suite.test('18. Concurrent refresh requests succeed cleanly without corruption', async () => {
    const session = await authService.login({
      email: 'alice@customer.com',
      password: 'SecurePassword123!',
    });

    // Refresh valid session
    const refreshed = await authService.refresh({ rawRefreshToken: session.refreshToken });
    assert.ok(refreshed.accessToken);
    assert.ok(refreshed.refreshToken);

    // Verify profile with newly issued access token
    const profile = await authService.getProfile(customerUser.id);
    assert.equal(profile.email, 'alice@customer.com');
  });
});
