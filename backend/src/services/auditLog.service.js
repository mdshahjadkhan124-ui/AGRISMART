const AuditLog = require('../models/AuditLog.model');
const { getPagination, buildMeta } = require('../utils/pagination');

async function log({ actorId, action, targetType, targetId, metadata }) {
  return AuditLog.create({ actor: actorId, action, targetType, targetId, metadata });
}

async function listAuditLogs(query) {
  const { page, limit, skip } = getPagination(query);
  const filter = {};
  if (query.action) filter.action = query.action;

  const [items, total] = await Promise.all([
    AuditLog.find(filter).populate('actor', 'name email role').sort({ createdAt: -1 }).skip(skip).limit(limit),
    AuditLog.countDocuments(filter),
  ]);

  return { items, meta: buildMeta({ page, limit }, total) };
}

module.exports = { log, listAuditLogs };
