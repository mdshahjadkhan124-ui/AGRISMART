const { test, describe } = require('node:test');
const assert = require('node:assert/strict');
const { computeSoilHealth } = require('../../src/utils/soilHealthScore');

describe('computeSoilHealth (rule-based, no ML)', () => {
  test('balanced N/P/K and neutral pH scores Excellent with no deficiency tips', () => {
    const result = computeSoilHealth({ nitrogen: 400, phosphorus: 15, potassium: 150, ph: 6.8, organicCarbon: 0.6 });
    assert.equal(result.healthLabel, 'Excellent');
    assert.ok(result.healthScore >= 85);
    assert.deepEqual(result.recommendations, ['Soil nutrient levels are well balanced. Maintain current fertilization practices.']);
  });

  test('deficient, acidic soil scores Poor and lists a recommendation per problem', () => {
    const result = computeSoilHealth({ nitrogen: 150, phosphorus: 5, potassium: 60, ph: 5.0, organicCarbon: 0.3 });
    assert.equal(result.healthLabel, 'Poor');
    assert.ok(result.recommendations.length >= 4);
    assert.ok(result.recommendations.some((tip) => /nitrogen/i.test(tip)));
    assert.ok(result.recommendations.some((tip) => /acidic/i.test(tip)));
  });

  test('is deterministic — same inputs always produce the same score', () => {
    const inputs = { nitrogen: 250, phosphorus: 20, potassium: 90, ph: 7.0 };
    const first = computeSoilHealth(inputs);
    const second = computeSoilHealth(inputs);
    assert.deepEqual(first, second);
  });

  test('organic carbon is optional and excluded from scoring when absent', () => {
    const withoutOC = computeSoilHealth({ nitrogen: 400, phosphorus: 15, potassium: 150, ph: 6.8 });
    assert.equal(withoutOC.healthLabel, 'Excellent');
  });
});
