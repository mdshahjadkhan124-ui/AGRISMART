// Seeds one demo account per role so every role can be logged into and
// tested immediately. Safe to re-run: existing accounts are left as-is.
const mongoose = require('mongoose');
const env = require('../config/env');
const logger = require('../config/logger');
const connectDB = require('../config/db');
const User = require('../models/User.model');
const { ROLES } = require('../config/roles');

const DEMO_PASSWORD = 'Passw0rd!123';

const demoUsers = [
  { name: 'Farmer Demo', email: 'farmer.demo@agrismart.test', role: ROLES.FARMER },
  { name: 'Expert Demo', email: 'expert.demo@agrismart.test', role: ROLES.EXPERT },
  { name: 'Officer Demo', email: 'officer.demo@agrismart.test', role: ROLES.OFFICER },
  { name: 'Seller Demo', email: 'seller.demo@agrismart.test', role: ROLES.SELLER },
  { name: 'Gov Admin Demo', email: 'govadmin.demo@agrismart.test', role: ROLES.GOV_ADMIN },
  { name: 'Super Admin Demo', email: 'superadmin.demo@agrismart.test', role: ROLES.SUPER_ADMIN },
];

async function seed() {
  await connectDB();

  for (const demo of demoUsers) {
    const existing = await User.findOne({ email: demo.email });
    if (existing) {
      logger.info(`Skipped (already exists): ${demo.email}`);
      continue;
    }
    await User.create({ ...demo, password: DEMO_PASSWORD, isEmailVerified: true });
    logger.info(`Created: ${demo.email} [${demo.role}]`);
  }

  console.log('\nDemo credentials (password is the same for all):');
  console.table(demoUsers.map(({ email, role }) => ({ email, role, password: DEMO_PASSWORD })));

  await mongoose.disconnect();
}

seed().catch((err) => {
  logger.error(`Seed failed: ${err.stack}`);
  process.exit(1);
});
