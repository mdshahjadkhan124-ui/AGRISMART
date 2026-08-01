const { test, describe } = require('node:test');
const assert = require('node:assert/strict');
const { getFertilizerRecommendation } = require('../../src/utils/fertilizerRecommendation');

describe('getFertilizerRecommendation (rule-based mapping table, no ML)', () => {
  test('low N/P/K and acidic pH recommends urea, phosphate, potash, and lime', () => {
    const rec = getFertilizerRecommendation({ nitrogen: 150, phosphorus: 5, potassium: 60, ph: 5.0 });
    assert.equal(rec.levels.nitrogen, 'Low');
    assert.equal(rec.levels.phosphorus, 'Low');
    assert.equal(rec.levels.potassium, 'Low');
    assert.match(rec.nutrients.nitrogen.fertilizer, /urea/i);
    assert.match(rec.nutrients.phosphorus.fertilizer, /dap|ssp/i);
    assert.match(rec.nutrients.potassium.fertilizer, /mop|potash/i);
    assert.ok(rec.nutrients.nitrogen.dosageKgPerAcre > 0);
    assert.equal(rec.phAmendment.amendment, 'Agricultural lime');
  });

  test('sufficient nutrients and neutral pH recommend no fertilizer or amendment', () => {
    const rec = getFertilizerRecommendation({ nitrogen: 600, phosphorus: 30, potassium: 300, ph: 7.0 });
    assert.equal(rec.levels.nitrogen, 'High');
    assert.equal(rec.nutrients.nitrogen.dosageKgPerAcre, 0);
    assert.equal(rec.phAmendment.amendment, 'None');
  });

  test('strongly alkaline soil recommends gypsum', () => {
    const rec = getFertilizerRecommendation({ nitrogen: 300, phosphorus: 15, potassium: 150, ph: 9.0 });
    assert.equal(rec.phAmendment.amendment, 'Gypsum');
  });
});
