const DiseaseReport = require('../models/DiseaseReport.model');
const ApiError = require('../utils/ApiError');
const imageUploadService = require('./imageUpload.service');
const { getPagination, buildMeta } = require('../utils/pagination');

async function createReport(userId, { cropName, symptoms, farmId }, file) {
  if (!file) throw new ApiError(400, 'A leaf photo is required');

  const uploadResult = await imageUploadService.uploadBuffer(file.buffer, 'agrismart/disease-reports');

  return DiseaseReport.create({
    farmer: userId,
    farm: farmId || undefined,
    cropName,
    symptoms,
    imageUrl: uploadResult.secure_url,
    imagePublicId: uploadResult.public_id,
  });
}

async function listMyReports(userId, query) {
  const { page, limit, skip } = getPagination(query);
  const [items, total] = await Promise.all([
    DiseaseReport.find({ farmer: userId }).sort({ createdAt: -1 }).skip(skip).limit(limit),
    DiseaseReport.countDocuments({ farmer: userId }),
  ]);
  return { items, meta: buildMeta({ page, limit }, total) };
}

async function getMyReport(userId, reportId) {
  const report = await DiseaseReport.findOne({ _id: reportId, farmer: userId });
  if (!report) throw new ApiError(404, 'Disease report not found');
  return report;
}

// The review queue: anything not yet resolved, oldest first (first come,
// first served for experts).
async function listQueue(query) {
  const { page, limit, skip } = getPagination(query);
  const filter = { status: { $in: ['pending', 'in_review'] } };

  const [items, total] = await Promise.all([
    DiseaseReport.find(filter).sort({ createdAt: 1 }).skip(skip).limit(limit).populate('farmer', 'name email'),
    DiseaseReport.countDocuments(filter),
  ]);
  return { items, meta: buildMeta({ page, limit }, total) };
}

async function respondToReport(expertId, reportId, { diagnosis, treatment }) {
  const report = await DiseaseReport.findById(reportId);
  if (!report) throw new ApiError(404, 'Disease report not found');
  if (report.status === 'resolved') throw new ApiError(409, 'This report has already been resolved');

  report.diagnosis = diagnosis;
  report.treatment = treatment;
  report.status = 'resolved';
  report.expert = expertId;
  report.reviewedAt = new Date();
  await report.save();
  return report;
}

module.exports = { createReport, listMyReports, getMyReport, listQueue, respondToReport };
