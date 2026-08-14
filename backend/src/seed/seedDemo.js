// Populates realistic sample activity data for the 6 existing demo accounts
// (farms, soil reports, crop history, activities, crop/fertilizer advisory,
// disease reports, appointments, marketplace products/orders, government
// schemes) so every role's dashboard has real data to show instead of zeros.
//
// Strictly additive: this file never creates or modifies a User document —
// it only looks up the 6 accounts `npm run seed` already created, by email.
// Every seeded record is either found-or-created by a fixed, recognizable
// name/title, or tagged with a "[DEMO]" marker in a free-text field and
// guarded by that marker — so this script is safe to re-run and never
// duplicates or corrupts data. Each section is isolated in its own
// try/catch so one failure (e.g. Cloudinary not configured) doesn't stop
// the rest of the seed from running.
const mongoose = require('mongoose');
const logger = require('../config/logger');
const connectDB = require('../config/db');

const User = require('../models/User.model');
const Farm = require('../models/Farm.model');
const SoilReport = require('../models/SoilReport.model');
const CropHistory = require('../models/CropHistory.model');
const FarmActivity = require('../models/FarmActivity.model');
const CropSuggestion = require('../models/CropSuggestion.model');
const FertilizerRecommendation = require('../models/FertilizerRecommendation.model');
const DiseaseReport = require('../models/DiseaseReport.model');
const Appointment = require('../models/Appointment.model');
const MarketplaceProduct = require('../models/MarketplaceProduct.model');
const Order = require('../models/Order.model');
const GovernmentScheme = require('../models/GovernmentScheme.model');

const farmService = require('../services/farm.service');
const soilReportService = require('../services/soilReport.service');
const cropHistoryService = require('../services/cropHistory.service');
const farmActivityService = require('../services/farmActivity.service');
const cropSuggestionService = require('../services/cropSuggestion.service');
const fertilizerRecommendationService = require('../services/fertilizerRecommendation.service');
const diseaseReportService = require('../services/diseaseReport.service');
const appointmentService = require('../services/appointment.service');
const marketplaceProductService = require('../services/marketplaceProduct.service');
const marketplaceOrderService = require('../services/marketplaceOrder.service');
const governmentSchemeService = require('../services/governmentScheme.service');

const DEMO = '[DEMO]';
const DEMO_TAG = /^\[DEMO\]/;

// A 1x1 transparent PNG — real, valid image bytes so disease-report seeding
// exercises the actual Cloudinary upload path rather than a fabricated URL.
const PLACEHOLDER_PNG = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=',
  'base64'
);

async function getDemoUsers() {
  const [farmer, expert, seller, govAdmin] = await Promise.all([
    User.findOne({ email: 'farmer.demo@agrismart.test' }),
    User.findOne({ email: 'expert.demo@agrismart.test' }),
    User.findOne({ email: 'seller.demo@agrismart.test' }),
    User.findOne({ email: 'govadmin.demo@agrismart.test' }),
  ]);
  if (!farmer || !expert || !seller || !govAdmin) {
    throw new Error('Core demo accounts are missing — run `npm run seed` first.');
  }
  return { farmer, expert, seller, govAdmin };
}

async function seedFarms(farmerId) {
  const farmDefs = [
    {
      name: 'Green Valley Farm',
      areaAcres: 5,
      soilType: 'alluvial',
      irrigationType: 'canal',
      location: { lat: 28.6139, lng: 77.209, address: 'Green Valley, Delhi NCR' },
    },
    {
      name: 'Riverside Plot',
      areaAcres: 2.5,
      soilType: 'black',
      irrigationType: 'borewell',
      location: { lat: 19.076, lng: 72.8777, address: 'Riverside, Maharashtra' },
    },
  ];

  const farms = [];
  for (const def of farmDefs) {
    let farm = await Farm.findOne({ farmer: farmerId, name: def.name });
    if (farm) {
      logger.info(`[seed:demo] Skipped farm (exists): ${def.name}`);
      farms.push({ farm, isNew: false });
      continue;
    }
    farm = await farmService.createFarm(farmerId, def);
    logger.info(`[seed:demo] Created farm: ${def.name}`);
    farms.push({ farm, isNew: true });
  }
  return farms;
}

async function seedFarmChildren(farmerId, farms) {
  for (const { farm, isNew } of farms) {
    if (!isNew) {
      logger.info(`[seed:demo] Skipped soil/crop/activity data for "${farm.name}" (farm already existed)`);
      continue;
    }

    await soilReportService.addSoilReport(farm._id, farmerId, {
      nitrogen: 60,
      phosphorus: 35,
      potassium: 45,
      ph: 6.5,
      organicCarbon: 0.6,
      moisturePercent: 22,
    });
    await soilReportService.addSoilReport(farm._id, farmerId, {
      nitrogen: 75,
      phosphorus: 40,
      potassium: 50,
      ph: 6.8,
      organicCarbon: 0.7,
      moisturePercent: 25,
    });

    await cropHistoryService.addCropHistory(farm._id, farmerId, {
      cropName: 'Wheat',
      season: 'rabi',
      sowingDate: new Date('2025-11-05'),
      harvestDate: new Date('2026-04-01'),
      yieldQuantityKg: 1800,
      notes: `${DEMO} Good yield season.`,
    });
    await cropHistoryService.addCropHistory(farm._id, farmerId, {
      cropName: 'Rice',
      season: 'kharif',
      sowingDate: new Date('2025-06-15'),
      harvestDate: new Date('2025-10-20'),
      yieldQuantityKg: 2200,
      notes: `${DEMO} First kharif crop on this plot.`,
    });

    await farmActivityService.addActivity(farm._id, farmerId, {
      activityType: 'sowing',
      title: `${DEMO} Sowed wheat`,
      description: 'Broadcast sowing after first rains.',
      date: new Date('2025-11-05'),
      costInr: 4500,
    });
    await farmActivityService.addActivity(farm._id, farmerId, {
      activityType: 'irrigation',
      title: `${DEMO} Canal irrigation`,
      description: 'First irrigation cycle.',
      date: new Date('2025-11-20'),
      costInr: 1200,
    });
    await farmActivityService.addActivity(farm._id, farmerId, {
      activityType: 'fertilizing',
      title: `${DEMO} Applied urea`,
      description: 'Top dressing as per fertilizer recommendation.',
      date: new Date('2025-12-10'),
      costInr: 2000,
    });

    logger.info(`[seed:demo] Seeded soil reports, crop history, and activities for "${farm.name}"`);
  }
}

async function seedAdvisory(farmerId, primaryFarmId) {
  if ((await CropSuggestion.countDocuments({ farmer: farmerId })) === 0) {
    await cropSuggestionService.createSuggestion(farmerId, {
      farmId: primaryFarmId,
      n: 70,
      p: 38,
      k: 48,
      temperature: 26,
      humidity: 65,
      ph: 6.6,
      rainfall: 900,
    });
    logger.info('[seed:demo] Created a crop suggestion for farmer.demo');
  } else {
    logger.info('[seed:demo] Skipped crop suggestion (already has history)');
  }

  if ((await FertilizerRecommendation.countDocuments({ farmer: farmerId })) === 0) {
    await fertilizerRecommendationService.createRecommendation(farmerId, {
      farmId: primaryFarmId,
      nitrogen: 60,
      phosphorus: 35,
      potassium: 45,
      ph: 6.5,
    });
    logger.info('[seed:demo] Created a fertilizer recommendation for farmer.demo');
  } else {
    logger.info('[seed:demo] Skipped fertilizer recommendation (already has history)');
  }
}

async function seedDiseaseReports(farmerId, expertId, primaryFarmId) {
  if ((await DiseaseReport.countDocuments({ farmer: farmerId })) > 0) {
    logger.info('[seed:demo] Skipped disease reports (already has some)');
    return;
  }

  const resolved = await diseaseReportService.createReport(
    farmerId,
    {
      cropName: 'Tomato',
      symptoms: `${DEMO} Yellowing leaves with brown spots spreading from the edges.`,
      farmId: primaryFarmId,
    },
    { buffer: PLACEHOLDER_PNG }
  );
  await diseaseReportService.respondToReport(expertId, resolved._id, {
    diagnosis: 'Early blight (Alternaria solani).',
    treatment: 'Apply a copper-based fungicide every 7-10 days and remove affected leaves. Avoid overhead watering.',
  });

  await diseaseReportService.createReport(
    farmerId,
    {
      cropName: 'Rice',
      symptoms: `${DEMO} White powdery patches on the underside of leaves.`,
      farmId: primaryFarmId,
    },
    { buffer: PLACEHOLDER_PNG }
  );

  logger.info('[seed:demo] Created 2 disease reports for farmer.demo (1 resolved, 1 pending)');
}

async function seedAppointments(farmerId, expertId) {
  const existing = await Appointment.countDocuments({ farmer: farmerId, expert: expertId, reason: DEMO_TAG });
  if (existing > 0) {
    logger.info('[seed:demo] Skipped appointments (demo ones already exist)');
    return;
  }

  const confirmed = await appointmentService.bookAppointment(farmerId, {
    expertId,
    requestedDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    meetingType: 'video',
    reason: `${DEMO} Need advice on managing early blight in my tomato crop.`,
  });
  await appointmentService.updateStatus(confirmed._id, expertId, { status: 'confirmed' });

  await appointmentService.bookAppointment(farmerId, {
    expertId,
    requestedDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    meetingType: 'chat',
    reason: `${DEMO} Would like guidance on crop rotation for next season.`,
  });

  logger.info('[seed:demo] Created 2 appointments between farmer.demo and expert.demo (1 confirmed, 1 pending)');
}

async function seedMarketplace(sellerId, farmerId) {
  const productDefs = [
    {
      name: 'Hybrid Tomato Seeds (500g)',
      description: `${DEMO} High-yield disease-resistant hybrid tomato seeds.`,
      category: 'seeds',
      priceInr: 450,
      unit: 'pack',
      stockQuantity: 120,
    },
    {
      name: 'Organic Urea Fertilizer (50kg)',
      description: `${DEMO} Slow-release nitrogen fertilizer for cereal crops.`,
      category: 'fertilizers',
      priceInr: 1200,
      unit: 'bag',
      stockQuantity: 60,
    },
    {
      name: 'Neem Oil Pesticide (1L)',
      description: `${DEMO} Organic pest control concentrate.`,
      category: 'pesticides',
      priceInr: 380,
      unit: 'bottle',
      stockQuantity: 90,
    },
    {
      name: 'Hand Tiller (Manual)',
      description: `${DEMO} Durable manual soil tiller for small plots.`,
      category: 'tools',
      priceInr: 850,
      unit: 'unit',
      stockQuantity: 25,
    },
  ];

  const products = [];
  for (const def of productDefs) {
    let product = await MarketplaceProduct.findOne({ seller: sellerId, name: def.name });
    if (product) {
      logger.info(`[seed:demo] Skipped product (exists): ${def.name}`);
    } else {
      // No image — kept dependency-free of Cloudinary for the product catalog.
      product = await marketplaceProductService.createProduct(sellerId, def, null);
      logger.info(`[seed:demo] Created product: ${def.name}`);
    }
    products.push(product);
  }

  const existingOrders = await Order.countDocuments({ buyer: farmerId, seller: sellerId, shippingAddress: DEMO_TAG });
  if (existingOrders > 0) {
    logger.info('[seed:demo] Skipped orders (demo ones already exist)');
    return;
  }

  const address = `${DEMO} 12 Farm Road, Nashik, Maharashtra 422001`;

  await marketplaceOrderService.createOrder(farmerId, {
    items: [{ productId: products[0]._id.toString(), quantity: 2 }],
    shippingAddress: address,
    paymentMethod: 'cod',
  });

  const order2 = await marketplaceOrderService.createOrder(farmerId, {
    items: [{ productId: products[1]._id.toString(), quantity: 1 }],
    shippingAddress: address,
    paymentMethod: 'mock_online',
  });
  await marketplaceOrderService.updateOrderStatus(sellerId, order2._id, 'shipped');
  await marketplaceOrderService.updateOrderStatus(sellerId, order2._id, 'delivered');

  const order3 = await marketplaceOrderService.createOrder(farmerId, {
    items: [{ productId: products[2]._id.toString(), quantity: 3 }],
    shippingAddress: address,
    paymentMethod: 'mock_online',
  });
  await marketplaceOrderService.updateOrderStatus(sellerId, order3._id, 'shipped');

  logger.info('[seed:demo] Created 3 orders from farmer.demo to seller.demo (pending/cod, delivered, shipped)');
}

async function seedSchemes(govAdminId) {
  const schemeDefs = [
    {
      title: 'PM-KISAN Direct Income Support',
      description: `${DEMO} Direct income support of ₹6,000/year to eligible farmer families.`,
      category: 'subsidy',
      eligibility: 'Small and marginal farmer families with cultivable land.',
      state: 'All India',
    },
    {
      title: 'Kisan Credit Card Scheme',
      description: `${DEMO} Short-term credit at subsidized interest rates for crop production needs.`,
      category: 'loan',
      eligibility: 'All farmers, including tenant farmers and sharecroppers.',
      state: 'All India',
    },
    {
      title: 'Pradhan Mantri Fasal Bima Yojana',
      description: `${DEMO} Crop insurance against yield loss due to natural calamities.`,
      category: 'insurance',
      eligibility: 'Farmers growing notified crops in notified areas.',
      state: 'All India',
    },
    {
      title: 'Sub-Mission on Agricultural Mechanization',
      description: `${DEMO} Subsidy on purchase of farm machinery and equipment.`,
      category: 'equipment',
      eligibility: 'Individual farmers and farmer cooperatives.',
      state: 'Maharashtra',
    },
  ];

  for (const def of schemeDefs) {
    const existing = await GovernmentScheme.findOne({ title: def.title });
    if (existing) {
      logger.info(`[seed:demo] Skipped scheme (exists): ${def.title}`);
      continue;
    }
    await governmentSchemeService.createScheme(govAdminId, def);
    logger.info(`[seed:demo] Created scheme: ${def.title}`);
  }
}

async function seed() {
  await connectDB();

  const { farmer, expert, seller, govAdmin } = await getDemoUsers();
  logger.info('[seed:demo] Starting — core accounts found, none will be modified.');

  let farms = [];
  try {
    farms = await seedFarms(farmer.id);
    await seedFarmChildren(farmer.id, farms);
  } catch (err) {
    logger.error(`[seed:demo] Farms/soil/crop/activity section failed: ${err.message}`);
  }

  try {
    await seedAdvisory(farmer.id, farms[0]?.farm?._id);
  } catch (err) {
    logger.error(`[seed:demo] Advisory section failed: ${err.message}`);
  }

  try {
    await seedDiseaseReports(farmer.id, expert.id, farms[0]?.farm?._id);
  } catch (err) {
    logger.error(`[seed:demo] Disease report section failed: ${err.message}`);
  }

  try {
    await seedAppointments(farmer.id, expert.id);
  } catch (err) {
    logger.error(`[seed:demo] Appointments section failed: ${err.message}`);
  }

  try {
    await seedMarketplace(seller.id, farmer.id);
  } catch (err) {
    logger.error(`[seed:demo] Marketplace section failed: ${err.message}`);
  }

  try {
    await seedSchemes(govAdmin.id);
  } catch (err) {
    logger.error(`[seed:demo] Schemes section failed: ${err.message}`);
  }

  const summary = {
    farms: await Farm.countDocuments({ farmer: farmer.id }),
    soilReports: await SoilReport.countDocuments(),
    cropHistory: await CropHistory.countDocuments(),
    activities: await FarmActivity.countDocuments(),
    cropSuggestions: await CropSuggestion.countDocuments({ farmer: farmer.id }),
    fertilizerRecs: await FertilizerRecommendation.countDocuments({ farmer: farmer.id }),
    diseaseReports: await DiseaseReport.countDocuments({ farmer: farmer.id }),
    appointments: await Appointment.countDocuments({ farmer: farmer.id, expert: expert.id }),
    products: await MarketplaceProduct.countDocuments({ seller: seller.id }),
    orders: await Order.countDocuments({ buyer: farmer.id, seller: seller.id }),
    schemes: await GovernmentScheme.countDocuments(),
  };
  console.log('\n[seed:demo] Current totals for the demo accounts:');
  console.table(summary);

  logger.info('[seed:demo] Done.');
  await mongoose.disconnect();
}

seed().catch((err) => {
  logger.error(`[seed:demo] Failed: ${err.stack}`);
  process.exit(1);
});
