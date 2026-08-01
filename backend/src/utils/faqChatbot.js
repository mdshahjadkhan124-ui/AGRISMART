const { FAQ_ENTRIES, FALLBACK_ANSWER } = require('../data/faq');

// Pure keyword-overlap matching — no LLM/AI generation. Picks the FAQ
// entry whose keyword list has the most matches (as substrings) in the
// user's message; ties go to whichever entry appears first.
function matchFaq(message, lang) {
  const normalized = message.toLowerCase();
  const language = lang === 'hi' ? 'hi' : 'en';

  let best = null;
  let bestScore = 0;

  for (const entry of FAQ_ENTRIES) {
    const keywords = entry.keywords[language] || entry.keywords.en;
    const score = keywords.filter((keyword) => normalized.includes(keyword.toLowerCase())).length;
    if (score > bestScore) {
      bestScore = score;
      best = entry;
    }
  }

  if (!best) {
    return { matched: false, id: null, answer: FALLBACK_ANSWER[language] };
  }

  return { matched: true, id: best.id, answer: best.answer[language] };
}

module.exports = { matchFaq };
