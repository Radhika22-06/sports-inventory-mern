const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, required: true }, // Equipment type
  sport: { type: String, required: true }, // Which sport
  brand: { type: String, required: true },
  quantity: { type: Number, required: true, default: 0 },
  price: { type: Number, required: true },
  purchaseDate: { type: Date, required: true },
  minStockLevel: { type: Number, default: 5 },
  description: { type: String },
  size: { type: String },
  color: { type: String },
  condition: { type: String, enum: ['new', 'good', 'fair', 'poor'], default: 'new' },
  location: { type: String }, // Storage location
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

// Virtual for stock status
itemSchema.virtual('stockStatus').get(function() {
  if (this.quantity === 0) return 'out-of-stock';
  if (this.quantity <= this.minStockLevel) return 'low-stock';
  return 'in-stock';
});

itemSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Item', itemSchema);