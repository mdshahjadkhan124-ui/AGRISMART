const mongoose = require('mongoose');

const marketplaceProductSchema = new mongoose.Schema(
  {
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    name: { type: String, required: [true, 'Product name is required'], trim: true, maxlength: 150 },
    description: { type: String, trim: true, maxlength: 1000, default: '' },
    category: {
      type: String,
      enum: ['seeds', 'fertilizers', 'pesticides', 'tools', 'machinery', 'other'],
      default: 'other',
    },
    priceInr: { type: Number, required: [true, 'Price is required'], min: 0 },
    unit: { type: String, trim: true, default: 'unit', maxlength: 30 },
    stockQuantity: { type: Number, required: [true, 'Stock quantity is required'], min: 0 },
    imageUrl: { type: String, default: '' },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

marketplaceProductSchema.index({ name: 'text', description: 'text' });

module.exports = mongoose.model('MarketplaceProduct', marketplaceProductSchema);
