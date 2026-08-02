const { FAQ_ENTRIES, FALLBACK_ANSWER } = require('../data/faq');

// Rule-based, no LLM/AI generation anywhere. Matching is token-overlap
// scoring, not verbatim substring matching: the query and every keyword
// phrase are normalized and split into words, common filler words (English
// and romanized Hindi/Hinglish) are dropped, and a keyword phrase only
// "hits" when ALL of its remaining words appear somewhere in the query —
// order and insertions don't matter, so "book an expert" still matches the
// "book expert" keyword. An intent's score is the sum of the word-counts of
// every keyword phrase that fully hits (both its English and Hindi/Hinglish
// keyword lists are checked regardless of the requested reply language, so
// matching still works if someone types Hinglish with the "EN" toggle on).
// The highest-scoring intent above the threshold wins; ties go to whichever
// entry is listed first in data/faq.js.

const STOP_WORDS = new Set([
  // English filler
  'a', 'an', 'the', 'is', 'are', 'am', 'was', 'were', 'do', 'does', 'did',
  'i', 'you', 'we', 'they', 'he', 'she', 'it', 'me', 'my', 'your', 'our',
  'how', 'what', 'which', 'who', 'whom', 'whose', 'why', 'when', 'where',
  'to', 'for', 'of', 'in', 'on', 'at', 'with', 'about', 'from',
  'can', 'could', 'should', 'would', 'will', 'shall', 'may', 'might',
  'tell', 'please', 'need', 'want', 'get', 'this', 'that', 'and', 'or',
  // Romanized Hindi (Hinglish) filler
  'kaise', 'kya', 'kyu', 'kyun', 'hai', 'ho', 'hoga', 'ka', 'ki', 'ke',
  'ko', 'se', 'mein', 'liye', 'kar', 'karu', 'karoon', 'karna', 'karo',
  'kro', 'milega', 'milegi', 'dekhu', 'dekhun', 'daalu', 'daalun', 'daal',
  'chahiye', 'batao', 'bata', 'konsa', 'konsi', 'kaunsa', 'kaunsi',
  'wala', 'wali',
]);

// Strips punctuation while keeping letters/digits from any script, collapses
// whitespace, lowercases. Devanagari vowel signs (matras) are combining
// marks (\p{M}), not letters — without keeping \p{M} too, this would shred
// every Devanagari word apart at each vowel sign (e.g. "बीमारी" -> "ब म र").
function normalize(text) {
  return text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\p{M}\s]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

// Light suffix-trimming — just enough to fold simple English plurals
// ("schemes" -> "scheme", "subsidies" -> "subsidy") into their singular
// form. Not real morphological analysis, just two safe suffix rules; a
// no-op on Devanagari tokens since they never end in these ASCII suffixes.
function stem(word) {
  if (word.length > 4 && word.endsWith('ies')) return word.slice(0, -3) + 'y';
  if (word.length > 3 && word.endsWith('s') && !word.endsWith('ss')) return word.slice(0, -1);
  return word;
}

function significantTokens(text) {
  return normalize(text)
    .split(' ')
    .filter((word) => word && !STOP_WORDS.has(word))
    .map(stem);
}

// Precompute each keyword phrase's significant tokens once at module load
// rather than on every request.
const SCORED_ENTRIES = FAQ_ENTRIES.map((entry) => {
  const phrases = [...(entry.keywords.en || []), ...(entry.keywords.hi || [])];
  const phraseTokenSets = phrases.map((phrase) => significantTokens(phrase)).filter((tokens) => tokens.length > 0);
  return { entry, phraseTokenSets };
});

const MATCH_THRESHOLD = 1;

function matchFaq(message, lang) {
  const language = lang === 'hi' ? 'hi' : 'en';
  const queryTokens = new Set(significantTokens(message));

  let best = null;
  let bestScore = 0;

  for (const { entry, phraseTokenSets } of SCORED_ENTRIES) {
    let score = 0;
    for (const phraseTokens of phraseTokenSets) {
      const fullyPresent = phraseTokens.every((token) => queryTokens.has(token));
      if (fullyPresent) score += phraseTokens.length;
    }
    if (score > bestScore) {
      bestScore = score;
      best = entry;
    }
  }

  if (!best || bestScore < MATCH_THRESHOLD) {
    return { matched: false, id: null, answer: FALLBACK_ANSWER[language] };
  }

  return { matched: true, id: best.id, answer: best.answer[language] };
}

module.exports = { matchFaq };
