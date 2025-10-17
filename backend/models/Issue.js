const mongoose = require('mongoose');

const issueSchema = new mongoose.Schema({
  itemId: { type: mongoose.Schema.Types.ObjectId, ref: 'Item', required: true },
  playerName: { type: String, required: true },
  teamName: { type: String },
  issueDate: { type: Date, required: true, default: Date.now },
  expectedReturnDate: { type: Date, required: true },
  returnDate: { type: Date },
  returnCondition: { type: String, enum: ['good', 'damaged', 'lost'] },
  fine: { type: Number, default: 0 },
  status: { type: String, enum: ['issued', 'return-requested', 'returned'], default: 'issued' },
  returnRequestDate: { type: Date },
  notes: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Issue', issueSchema);