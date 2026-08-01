const { test, describe, before, after, beforeEach } = require('node:test');
const assert = require('node:assert/strict');
const request = require('supertest');
const { startTestDB, stopTestDB, clearTestDB } = require('../setup');
const { authHeader } = require('../helpers');
const app = require('../../src/app');
const User = require('../../src/models/User.model');
const { ROLES } = require('../../src/config/roles');

describe('Crop suggestion route', () => {
  before(startTestDB);
  after(stopTestDB);
  beforeEach(clearTestDB);

  test('a farmer gets ranked, persisted crop suggestions', async () => {
    const farmer = await User.create({ name: 'Farmer', email: 'farmer@test.com', password: 'Passw0rd1', role: ROLES.FARMER });
    const farmerId = farmer._id.toString();

    const res = await request(app)
      .post('/api/v1/crop-suggestions')
      .set(authHeader(farmerId, ROLES.FARMER))
      .send({ n: 100, p: 50, k: 50, temperature: 28, humidity: 80, ph: 6.5, rainfall: 200 });

    assert.equal(res.status, 201);
    const { results } = res.body.data.suggestion;
    assert.ok(Array.isArray(results) && results.length > 0);
    assert.equal(results[0].cropName, 'Rice');
    for (let i = 1; i < results.length; i++) {
      assert.ok(results[i - 1].score >= results[i].score);
    }

    const historyRes = await request(app).get('/api/v1/crop-suggestions').set(authHeader(farmerId, ROLES.FARMER));
    assert.equal(historyRes.status, 200);
    assert.equal(historyRes.body.data.suggestions.length, 1);
  });

  test('rejects invalid input', async () => {
    const farmer = await User.create({ name: 'Farmer2', email: 'farmer2@test.com', password: 'Passw0rd1', role: ROLES.FARMER });
    const res = await request(app)
      .post('/api/v1/crop-suggestions')
      .set(authHeader(farmer._id.toString(), ROLES.FARMER))
      .send({ n: -5 });
    assert.equal(res.status, 400);
  });

  test('non-farmers cannot request crop suggestions', async () => {
    const expert = await User.create({ name: 'Expert', email: 'expert@test.com', password: 'Passw0rd1', role: ROLES.EXPERT });
    const res = await request(app)
      .post('/api/v1/crop-suggestions')
      .set(authHeader(expert._id.toString(), ROLES.EXPERT))
      .send({ n: 100, p: 50, k: 50, temperature: 28, humidity: 80, ph: 6.5, rainfall: 200 });
    assert.equal(res.status, 403);
  });
});
