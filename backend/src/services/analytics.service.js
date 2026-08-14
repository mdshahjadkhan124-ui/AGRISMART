const mongoose = require('mongoose');
const Farm = require('../models/Farm.model');
const SoilReport = require('../models/SoilReport.model');
const DiseaseReport = require('../models/DiseaseReport.model');
const Appointment = require('../models/Appointment.model');
const MarketplaceProduct = require('../models/MarketplaceProduct.model');
const Order = require('../models/Order.model');
const GovernmentScheme = require('../models/GovernmentScheme.model');
const User = require('../models/User.model');
const { ROLES } = require('../config/roles');

// Turns Mongo's [{ _id: 'x', count: N }] aggregate shape into a plain
// { x: N, ... } map, pre-filled with 0 for every expected key so the
// frontend never has to guard against a missing bucket.
function toCountMap(aggResult, allKeys = []) {
  const map = Object.fromEntries(allKeys.map((key) => [key, 0]));
  for (const { _id, count } of aggResult) {
    if (_id != null) map[_id] = count;
  }
  return map;
}

async function sumDeliveredRevenue(filter) {
  const [result] = await Order.aggregate([
    { $match: { ...filter, status: 'delivered' } },
    { $group: { _id: null, total: { $sum: '$totalAmountInr' } } },
  ]);
  return result?.total ?? 0;
}

async function getFarmerAnalytics(userId) {
  const farmIds = await Farm.find({ farmer: userId }).distinct('_id');

  const [farmCount, soilReports, diseaseStatusAgg, ordersCount, appointmentsCount] = await Promise.all([
    Farm.countDocuments({ farmer: userId }),
    SoilReport.find({ farm: { $in: farmIds } }).sort({ testedAt: 1 }).select('testedAt healthScore').limit(20),
    DiseaseReport.aggregate([
      { $match: { farmer: new mongoose.Types.ObjectId(userId) } },
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]),
    Order.countDocuments({ buyer: userId }),
    Appointment.countDocuments({ farmer: userId }),
  ]);

  return {
    farmCount,
    soilHealthTrend: soilReports.map((r) => ({ date: r.testedAt, score: r.healthScore })),
    diseaseReportsByStatus: toCountMap(diseaseStatusAgg, ['pending', 'in_review', 'resolved']),
    ordersCount,
    appointmentsCount,
  };
}

async function getExpertAnalytics(userId) {
  const [appointmentStatusAgg, diseaseReportsResolved] = await Promise.all([
    Appointment.aggregate([
      { $match: { expert: new mongoose.Types.ObjectId(userId) } },
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]),
    DiseaseReport.countDocuments({ expert: userId, status: 'resolved' }),
  ]);

  return {
    appointmentsByStatus: toCountMap(appointmentStatusAgg, ['pending', 'confirmed', 'rejected', 'completed', 'cancelled']),
    diseaseReportsResolved,
  };
}

async function getSellerAnalytics(userId) {
  const [productCount, orderStatusAgg, totalRevenueInr] = await Promise.all([
    MarketplaceProduct.countDocuments({ seller: userId }),
    Order.aggregate([
      { $match: { seller: new mongoose.Types.ObjectId(userId) } },
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]),
    sumDeliveredRevenue({ seller: new mongoose.Types.ObjectId(userId) }),
  ]);

  return {
    productCount,
    ordersByStatus: toCountMap(orderStatusAgg, ['pending', 'paid', 'shipped', 'delivered', 'cancelled']),
    totalRevenueInr,
  };
}

async function getGovAnalytics() {
  const [categoryAgg, activeSchemesCount, totalSchemesCount] = await Promise.all([
    GovernmentScheme.aggregate([{ $group: { _id: '$category', count: { $sum: 1 } } }]),
    GovernmentScheme.countDocuments({ isActive: true }),
    GovernmentScheme.countDocuments(),
  ]);

  return {
    schemesByCategory: toCountMap(categoryAgg, ['subsidy', 'loan', 'insurance', 'training', 'equipment', 'other']),
    activeSchemesCount,
    totalSchemesCount,
  };
}

async function getOfficerAnalytics() {
  const [totalFarmers, totalFarms, diseaseStatusAgg] = await Promise.all([
    User.countDocuments({ role: ROLES.FARMER }),
    Farm.countDocuments(),
    DiseaseReport.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
  ]);

  return {
    totalFarmers,
    totalFarms,
    diseaseReportsByStatus: toCountMap(diseaseStatusAgg, ['pending', 'in_review', 'resolved']),
  };
}

async function getSuperAdminAnalytics() {
  const [roleAgg, totalFarms, totalOrders, totalAppointments, totalDiseaseReports, totalRevenueInr] = await Promise.all([
    User.aggregate([{ $group: { _id: '$role', count: { $sum: 1 } } }]),
    Farm.countDocuments(),
    Order.countDocuments(),
    Appointment.countDocuments(),
    DiseaseReport.countDocuments(),
    sumDeliveredRevenue({}),
  ]);

  return {
    usersByRole: toCountMap(roleAgg, Object.values(ROLES)),
    totalFarms,
    totalOrders,
    totalAppointments,
    totalDiseaseReports,
    totalRevenueInr,
  };
}

async function getAnalyticsForUser(userId, role) {
  switch (role) {
    case ROLES.FARMER:
      return { role, data: await getFarmerAnalytics(userId) };
    case ROLES.EXPERT:
      return { role, data: await getExpertAnalytics(userId) };
    case ROLES.SELLER:
      return { role, data: await getSellerAnalytics(userId) };
    case ROLES.OFFICER:
      return { role, data: await getOfficerAnalytics() };
    case ROLES.GOV_ADMIN:
      return { role, data: await getGovAnalytics() };
    case ROLES.SUPER_ADMIN:
      return { role, data: await getSuperAdminAnalytics() };
    default:
      return { role, data: {} };
  }
}

module.exports = { getAnalyticsForUser };
