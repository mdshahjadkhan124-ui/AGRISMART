const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema(
  {
    actor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    action: { type: String, required: true, trim: true, maxlength: 100 },
    targetType: { type: String, trim: true, default: '' },
    targetId: { type: mongoose.Schema.Types.ObjectId },
    metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  {
    timestamps: true,
    // Mongoose's default `minimize: true` strips empty-object fields (like
    // an unused `metadata: {}`) from both storage and JSON output, which
    // silently broke the "metadata is always an object" contract this
    // field is meant to guarantee. Keep it explicit instead.
    minimize: false,
  }
);

auditLogSchema.index({ createdAt: -1 });

module.exports = mongoose.model('AuditLog', auditLogSchema);
