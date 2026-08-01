const { test, describe, before, after, beforeEach } = require('node:test');
const assert = require('node:assert/strict');
const request = require('supertest');
const { startTestDB, stopTestDB, clearTestDB } = require('../setup');
const { authHeader } = require('../helpers');
const app = require('../../src/app');
const User = require('../../src/models/User.model');
const DiseaseReport = require('../../src/models/DiseaseReport.model');
const { ROLES } = require('../../src/config/roles');

describe('Disease report flow', () => {
  before(startTestDB);
  after(stopTestDB);
  beforeEach(clearTestDB);

  test('submitting a report without a photo is rejected before touching Cloudinary', async () => {
    const farmer = await User.create({ name: 'Farmer', email: 'farmer@test.com', password: 'Passw0rd1', role: ROLES.FARMER });

    const res = await request(app)
      .post('/api/v1/disease-reports')
      .set(authHeader(farmer._id.toString(), ROLES.FARMER))
      .field('cropName', 'Wheat')
      .field('symptoms', 'Yellow spots on lower leaves');

    assert.equal(res.status, 400);
    assert.match(res.body.message, /leaf photo/i);
  });

  test('the full review flow: pending report -> in the expert queue -> resolved -> visible to the farmer', async () => {
    const farmer = await User.create({ name: 'Farmer', email: 'farmer2@test.com', password: 'Passw0rd1', role: ROLES.FARMER });
    const expert = await User.create({ name: 'Expert', email: 'expert@test.com', password: 'Passw0rd1', role: ROLES.EXPERT });

    // Seeded directly, bypassing the multipart upload step (already covered
    // by manual smoke-testing in Phase 4) — this test focuses on the
    // review workflow itself: queue visibility, response, and resolution.
    const report = await DiseaseReport.create({
      farmer: farmer._id,
      cropName: 'Wheat',
      symptoms: 'Yellow spots on lower leaves',
      imageUrl: 'https://example.com/leaf.jpg',
      imagePublicId: 'agrismart/disease-reports/leaf',
      status: 'pending',
    });

    const expertAuth = authHeader(expert._id.toString(), ROLES.EXPERT);
    const farmerAuth = authHeader(farmer._id.toString(), ROLES.FARMER);

    const queueRes = await request(app).get('/api/v1/disease-reports/queue').set(expertAuth);
    assert.equal(queueRes.status, 200);
    assert.equal(queueRes.body.data.reports.length, 1);
    assert.equal(queueRes.body.data.reports[0]._id, report._id.toString());

    const respondRes = await request(app)
      .put(`/api/v1/disease-reports/${report._id}/respond`)
      .set(expertAuth)
      .send({ diagnosis: 'Leaf rust', treatment: 'Apply a recommended fungicide and remove affected leaves.' });
    assert.equal(respondRes.status, 200);
    assert.equal(respondRes.body.data.report.status, 'resolved');

    const secondRespondRes = await request(app)
      .put(`/api/v1/disease-reports/${report._id}/respond`)
      .set(expertAuth)
      .send({ diagnosis: 'Different diagnosis', treatment: 'Different treatment' });
    assert.equal(secondRespondRes.status, 409);

    const farmerViewRes = await request(app).get(`/api/v1/disease-reports/${report._id}`).set(farmerAuth);
    assert.equal(farmerViewRes.status, 200);
    assert.equal(farmerViewRes.body.data.report.status, 'resolved');
    assert.equal(farmerViewRes.body.data.report.diagnosis, 'Leaf rust');

    const emptyQueueRes = await request(app).get('/api/v1/disease-reports/queue').set(expertAuth);
    assert.equal(emptyQueueRes.body.data.reports.length, 0);
  });

  test('a farmer cannot view another farmer\'s disease report', async () => {
    const owner = await User.create({ name: 'Owner', email: 'owner@test.com', password: 'Passw0rd1', role: ROLES.FARMER });
    const intruder = await User.create({ name: 'Intruder', email: 'intruder@test.com', password: 'Passw0rd1', role: ROLES.FARMER });

    const report = await DiseaseReport.create({
      farmer: owner._id,
      cropName: 'Maize',
      symptoms: 'Wilting',
      imageUrl: 'https://example.com/maize.jpg',
      imagePublicId: 'agrismart/disease-reports/maize',
    });

    const res = await request(app).get(`/api/v1/disease-reports/${report._id}`).set(authHeader(intruder._id.toString(), ROLES.FARMER));
    assert.equal(res.status, 404);
  });
});
