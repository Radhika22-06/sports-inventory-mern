const mongoose = require('mongoose');

const equipmentRequestSchema = new mongoose.Schema({
  requestType: { type: String, enum: ['team', 'individual'], required: true },
  teamName: { type: String },
  playerName: { type: String, required: true },
  sport: { type: String, required: true },
  itemsRequested: [{
    itemType: { type: String, required: true },
    quantity: { type: Number, required: true, default: 1 },
    priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' }
  }],
  requestDate: { type: Date, default: Date.now },
  expectedDate: { type: Date, required: true },
  reason: { type: String, required: true },
  status: { type: String, enum: ['pending', 'approved', 'rejected', 'issued'], default: 'pending' },
  issuedItemId: { type: mongoose.Schema.Types.ObjectId, ref: 'Item' },
  adminNotes: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('EquipmentRequest', equipmentRequestSchema);