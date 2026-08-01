// Must run before anything requires src/config/env.js, so env.nodeEnv is
// 'test' by the time the app (and its rate limiters) are constructed.
process.env.NODE_ENV = 'test';

const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongod;

// Integration tests run against a real, in-memory MongoDB — not Atlas, and
// not a mock — so they exercise actual Mongoose validation/queries without
// needing network access or a live database connection.
async function startTestDB() {
  mongod = await MongoMemoryServer.create();
  await mongoose.connect(mongod.getUri());
}

async function stopTestDB() {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongod.stop();
}

async function clearTestDB() {
  const { collections } = mongoose.connection;
  await Promise.all(Object.values(collections).map((collection) => collection.deleteMany({})));
}

module.exports = { startTestDB, stopTestDB, clearTestDB };
