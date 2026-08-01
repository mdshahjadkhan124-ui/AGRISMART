const { test, describe, before, after, beforeEach } = require('node:test');
const assert = require('node:assert/strict');
const request = require('supertest');
const { startTestDB, stopTestDB, clearTestDB } = require('../setup');
const { authHeader } = require('../helpers');
const app = require('../../src/app');
const User = require('../../src/models/User.model');
const { ROLES } = require('../../src/config/roles');

async function createUser(role, email) {
  const user = await User.create({ name: `Test ${role}`, email, password: 'Passw0rd1', role });
  return user._id.toString();
}

describe('RBAC boundaries', () => {
  before(startTestDB);
  after(stopTestDB);
  beforeEach(clearTestDB);

  test('a farmer is blocked from the expert disease-report queue', async () => {
    const farmerId = await createUser(ROLES.FARMER, 'farmer@test.com');
    const res = await request(app).get('/api/v1/disease-reports/queue').set(authHeader(farmerId, ROLES.FARMER));
    assert.equal(res.status, 403);
  });

  test('an expert can reach the disease-report queue', async () => {
    const expertId = await createUser(ROLES.EXPERT, 'expert@test.com');
    const res = await request(app).get('/api/v1/disease-reports/queue').set(authHeader(expertId, ROLES.EXPERT));
    assert.equal(res.status, 200);
  });

  test('a farmer cannot read, update, or delete another farmer\'s farm', async () => {
    const ownerId = await createUser(ROLES.FARMER, 'owner@test.com');
    const intruderId = await createUser(ROLES.FARMER, 'intruder@test.com');

    const createRes = await request(app)
      .post('/api/v1/farms')
      .set(authHeader(ownerId, ROLES.FARMER))
      .send({ name: 'My Farm', areaAcres: 2, soilType: 'black', irrigationType: 'rainfed' });
    assert.equal(createRes.status, 201);
    const farmId = createRes.body.data.farm._id;

    const getRes = await request(app).get(`/api/v1/farms/${farmId}`).set(authHeader(intruderId, ROLES.FARMER));
    assert.equal(getRes.status, 403);

    const updateRes = await request(app)
      .put(`/api/v1/farms/${farmId}`)
      .set(authHeader(intruderId, ROLES.FARMER))
      .send({ name: 'Hijacked' });
    assert.equal(updateRes.status, 403);

    const deleteRes = await request(app).delete(`/api/v1/farms/${farmId}`).set(authHeader(intruderId, ROLES.FARMER));
    assert.equal(deleteRes.status, 403);

    const ownerGetRes = await request(app).get(`/api/v1/farms/${farmId}`).set(authHeader(ownerId, ROLES.FARMER));
    assert.equal(ownerGetRes.status, 200);
  });

  test('only a seller can create a marketplace product', async () => {
    const farmerId = await createUser(ROLES.FARMER, 'buyer@test.com');
    const sellerId = await createUser(ROLES.SELLER, 'seller@test.com');

    const blockedRes = await request(app)
      .post('/api/v1/marketplace/products')
      .set(authHeader(farmerId, ROLES.FARMER))
      .send({ name: 'Seeds', priceInr: 100, stockQuantity: 10 });
    assert.equal(blockedRes.status, 403);

    const allowedRes = await request(app)
      .post('/api/v1/marketplace/products')
      .set(authHeader(sellerId, ROLES.SELLER))
      .send({ name: 'Seeds', priceInr: 100, stockQuantity: 10 });
    assert.equal(allowedRes.status, 201);
  });

  test('only a super admin can reach the admin panel', async () => {
    const farmerId = await createUser(ROLES.FARMER, 'notadmin@test.com');
    const adminId = await createUser(ROLES.SUPER_ADMIN, 'admin@test.com');

    const blockedRes = await request(app).get('/api/v1/admin/users').set(authHeader(farmerId, ROLES.FARMER));
    assert.equal(blockedRes.status, 403);

    const allowedRes = await request(app).get('/api/v1/admin/users').set(authHeader(adminId, ROLES.SUPER_ADMIN));
    assert.equal(allowedRes.status, 200);
  });

  test('a super admin cannot change their own role or deactivate themselves', async () => {
    const adminId = await createUser(ROLES.SUPER_ADMIN, 'selfadmin@test.com');

    const roleRes = await request(app)
      .put(`/api/v1/admin/users/${adminId}/role`)
      .set(authHeader(adminId, ROLES.SUPER_ADMIN))
      .send({ role: ROLES.FARMER });
    assert.equal(roleRes.status, 400);

    const statusRes = await request(app)
      .put(`/api/v1/admin/users/${adminId}/status`)
      .set(authHeader(adminId, ROLES.SUPER_ADMIN))
      .send({ isActive: false });
    assert.equal(statusRes.status, 400);
  });
});
