const { test, describe } = require('node:test');
const assert = require('node:assert/strict');
const { suggestCrops } = require('../../src/utils/cropSuggestion');

describe('suggestCrops (static lookup table, no ML)', () => {
  test('rice-favorable conditions rank Rice first with a perfect match score', () => {
    const results = suggestCrops({ n: 100, p: 50, k: 50, temperature: 28, humidity: 80, ph: 6.5, rainfall: 200 }, 3);
    assert.equal(results[0].cropName, 'Rice');
    assert.equal(results[0].score, 100);
    assert.deepEqual(results[0].outOfRangeFactors, []);
  });

  test('results are sorted by score, descending', () => {
    const results = suggestCrops({ n: 100, p: 50, k: 50, temperature: 28, humidity: 80, ph: 6.5, rainfall: 200 }, 5);
    for (let i = 1; i < results.length; i++) {
      assert.ok(results[i - 1].score >= results[i].score);
    }
  });

  test('respects the topN limit', () => {
    const results = suggestCrops({ n: 50, p: 50, k: 50, temperature: 25, humidity: 60, ph: 6.5, rainfall: 100 }, 3);
    assert.equal(results.length, 3);
  });

  test('wildly out-of-range inputs still return a result with a low score, not a crash', () => {
    const results = suggestCrops({ n: 0, p: 0, k: 0, temperature: -5, humidity: 0, ph: 0, rainfall: 0 }, 1);
    assert.equal(results.length, 1);
    assert.ok(results[0].score < 50);
  });
});
