const { test, describe } = require('node:test');
const assert = require('node:assert/strict');
const { matchFaq } = require('../../src/utils/faqChatbot');

describe('matchFaq (keyword matching, no LLM/AI generation)', () => {
  test('matches an English crop-suggestion question', () => {
    const result = matchFaq('which crop should I plant this season?', 'en');
    assert.equal(result.matched, true);
    assert.equal(result.id, 'crop-suggestion');
  });

  test('matches a Hindi disease question', () => {
    const result = matchFaq('मेरी फसल में कीट लगे हैं क्या करूं', 'hi');
    assert.equal(result.matched, true);
    assert.equal(result.id, 'disease-report');
  });

  test('falls back gracefully for unrecognized input, in the requested language', () => {
    const en = matchFaq('asdkjaslkdj random gibberish', 'en');
    assert.equal(en.matched, false);
    assert.equal(en.id, null);

    const hi = matchFaq('asdkjaslkdj random gibberish', 'hi');
    assert.equal(hi.matched, false);
    assert.notEqual(hi.answer, en.answer);
  });

  test('defaults to English for an unrecognized language code', () => {
    const result = matchFaq('which fertilizer should I use', 'fr');
    assert.equal(result.matched, true);
    assert.equal(result.id, 'fertilizer-recommendation');
  });
});
