const UNIT_MS = { s: 1000, m: 60_000, h: 3_600_000, d: 86_400_000 };

// Parses simple durations like '15m', '7d', '30s' into milliseconds.
// Only handles the suffixes this project actually uses in .env values.
function parseDurationMs(value) {
  const match = /^(\d+)(s|m|h|d)$/.exec(value);
  if (!match) throw new Error(`Invalid duration format: ${value}`);
  const [, amount, unit] = match;
  return Number(amount) * UNIT_MS[unit];
}

module.exports = parseDurationMs;
