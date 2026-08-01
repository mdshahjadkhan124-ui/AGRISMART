const { test, describe, before, after, beforeEach } = require('node:test');
const assert = require('node:assert/strict');
const request = require('supertest');
const { startTestDB, stopTestDB, clearTestDB } = require('../setup');
const app = require('../../src/app');

describe('Auth routes', () => {
  before(startTestDB);
  after(stopTestDB);
  beforeEach(clearTestDB);

  test('register creates a farmer account and sets a refresh cookie', async () => {
    const res = await request(app)
      .post('/api/v1/auth/register')
      .send({ name: 'Test Farmer', email: 'farmer@test.com', password: 'Passw0rd1' });

    assert.equal(res.status, 201);
    assert.equal(res.body.data.user.role, 'farmer');
    assert.equal(res.body.data.user.email, 'farmer@test.com');
    assert.ok(res.body.data.accessToken);
    assert.ok(res.headers['set-cookie']?.some((c) => c.startsWith('refreshToken=')));
  });

  test('a client cannot self-assign a privileged role on register', async () => {
    const res = await request(app)
      .post('/api/v1/auth/register')
      .send({ name: 'Sneaky User', email: 'sneaky@test.com', password: 'Passw0rd1', role: 'super_admin' });

    assert.equal(res.status, 201);
    assert.equal(res.body.data.user.role, 'farmer');
  });

  test('register rejects a duplicate email', async () => {
    const first = await request(app)
      .post('/api/v1/auth/register')
      .send({ name: 'First User', email: 'dup@test.com', password: 'Passw0rd1' });
    assert.equal(first.status, 201);

    const res = await request(app)
      .post('/api/v1/auth/register')
      .send({ name: 'Second User', email: 'dup@test.com', password: 'Passw0rd1' });
    assert.equal(res.status, 409);
  });

  test('register rejects a weak password', async () => {
    const res = await request(app)
      .post('/api/v1/auth/register')
      .send({ name: 'Weak Password User', email: 'weak@test.com', password: '123' });
    assert.equal(res.status, 400);
  });

  test('login with the wrong password is rejected', async () => {
    const registerRes = await request(app)
      .post('/api/v1/auth/register')
      .send({ name: 'Login Test User', email: 'd@test.com', password: 'Passw0rd1' });
    assert.equal(registerRes.status, 201);

    const res = await request(app).post('/api/v1/auth/login').send({ email: 'd@test.com', password: 'WrongPass1' });
    assert.equal(res.status, 401);
  });

  test('login succeeds and the token works on /auth/me', async () => {
    const registerRes = await request(app)
      .post('/api/v1/auth/register')
      .send({ name: 'Me Route User', email: 'e@test.com', password: 'Passw0rd1' });
    assert.equal(registerRes.status, 201);

    const loginRes = await request(app).post('/api/v1/auth/login').send({ email: 'e@test.com', password: 'Passw0rd1' });
    assert.equal(loginRes.status, 200);

    const meRes = await request(app).get('/api/v1/auth/me').set('Authorization', `Bearer ${loginRes.body.data.accessToken}`);
    assert.equal(meRes.status, 200);
    assert.equal(meRes.body.data.user.email, 'e@test.com');
  });

  test('/auth/me without a token is rejected', async () => {
    const res = await request(app).get('/api/v1/auth/me');
    assert.equal(res.status, 401);
  });

  test('/auth/me with a garbage token is rejected', async () => {
    const res = await request(app).get('/api/v1/auth/me').set('Authorization', 'Bearer not-a-real-token');
    assert.equal(res.status, 401);
  });

  test('refresh rotates the session and returns a new access token', async () => {
    const agent = request.agent(app); // persists the httpOnly refresh cookie across requests
    const registerRes = await agent
      .post('/api/v1/auth/register')
      .send({ name: 'Refresh Test User', email: 'f@test.com', password: 'Passw0rd1' });
    assert.equal(registerRes.status, 201);

    const refreshRes = await agent.post('/api/v1/auth/refresh');
    assert.equal(refreshRes.status, 200);
    assert.ok(refreshRes.body.data.accessToken);
  });

  test('refresh without a cookie is rejected', async () => {
    const res = await request(app).post('/api/v1/auth/refresh');
    assert.equal(res.status, 401);
  });

  test('logout clears the session so a subsequent refresh fails', async () => {
    const agent = request.agent(app);
    const registerRes = await agent
      .post('/api/v1/auth/register')
      .send({ name: 'Logout Test User', email: 'g@test.com', password: 'Passw0rd1' });
    assert.equal(registerRes.status, 201);

    const logoutRes = await agent.post('/api/v1/auth/logout');
    assert.equal(logoutRes.status, 200);

    const refreshRes = await agent.post('/api/v1/auth/refresh');
    assert.equal(refreshRes.status, 401);
  });
});
