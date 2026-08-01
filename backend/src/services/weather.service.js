const env = require('../config/env');
const ApiError = require('../utils/ApiError');
const WeatherLog = require('../models/WeatherLog.model');

const BASE_URL = 'https://api.openweathermap.org/data/2.5';

function isConfigured() {
  return Boolean(env.openWeatherApiKey);
}

function assertConfigured() {
  if (!isConfigured()) {
    throw new ApiError(501, 'Weather service is not configured yet. Set OPENWEATHER_API_KEY in backend/.env.');
  }
}

async function callOpenWeather(path, params) {
  const url = new URL(`${BASE_URL}/${path}`);
  url.searchParams.set('appid', env.openWeatherApiKey);
  url.searchParams.set('units', 'metric');
  Object.entries(params).forEach(([key, value]) => url.searchParams.set(key, value));

  const res = await fetch(url);
  if (!res.ok) {
    if (res.status === 404) throw new ApiError(404, 'Location not found');
    throw new ApiError(502, 'Weather provider request failed');
  }
  return res.json();
}

function summarizeCurrent(raw) {
  return {
    temperatureC: raw.main?.temp,
    feelsLikeC: raw.main?.feels_like,
    humidityPercent: raw.main?.humidity,
    windSpeedMs: raw.wind?.speed,
    condition: raw.weather?.[0]?.description ?? '',
    conditionIcon: raw.weather?.[0]?.icon ?? '',
    locationName: raw.name ?? '',
  };
}

// OpenWeather's free forecast endpoint returns 3-hour steps for 5 days.
// Reducing that to a simple daily min/max/condition list is plain
// aggregation, not a prediction model — no ML involved.
function summarizeForecast(raw) {
  const byDay = new Map();

  for (const entry of raw.list ?? []) {
    const day = entry.dt_txt.slice(0, 10);
    if (!byDay.has(day)) {
      byDay.set(day, { date: day, minTempC: entry.main.temp_min, maxTempC: entry.main.temp_max, conditions: [] });
    }
    const bucket = byDay.get(day);
    bucket.minTempC = Math.min(bucket.minTempC, entry.main.temp_min);
    bucket.maxTempC = Math.max(bucket.maxTempC, entry.main.temp_max);
    bucket.conditions.push(entry.weather?.[0]?.main ?? '');
  }

  return Array.from(byDay.values()).map((day) => ({
    ...day,
    // Most frequent condition of the day, a simple mode calculation.
    condition: day.conditions.sort((a, b) =>
      day.conditions.filter((c) => c === b).length - day.conditions.filter((c) => c === a).length
    )[0],
    conditions: undefined,
  }));
}

async function logQuery({ userId, farmId, type, lat, lon, locationName, summary }) {
  try {
    await WeatherLog.create({
      requestedBy: userId,
      farm: farmId,
      type,
      lat,
      lon,
      locationName,
      summary: {
        temperatureC: summary.temperatureC,
        feelsLikeC: summary.feelsLikeC,
        humidityPercent: summary.humidityPercent,
        windSpeedMs: summary.windSpeedMs,
        condition: summary.condition,
      },
    });
  } catch {
    // Logging is best-effort — never fail a weather request over it.
  }
}

async function getCurrentWeather({ lat, lon, userId, farmId }) {
  assertConfigured();
  const raw = await callOpenWeather('weather', { lat, lon });
  const summary = summarizeCurrent(raw);
  await logQuery({ userId, farmId, type: 'current', lat, lon, locationName: summary.locationName, summary });
  return summary;
}

async function getForecast({ lat, lon, userId, farmId }) {
  assertConfigured();
  const raw = await callOpenWeather('forecast', { lat, lon });
  const days = summarizeForecast(raw);
  await logQuery({
    userId,
    farmId,
    type: 'forecast',
    lat,
    lon,
    locationName: raw.city?.name ?? '',
    summary: { condition: days[0]?.condition ?? '' },
  });
  return { locationName: raw.city?.name ?? '', days };
}

module.exports = { isConfigured, getCurrentWeather, getForecast };
