const mongoose = require('mongoose');

const OfferSchema = new mongoose.Schema({
  amount: {
    type: Number,
    required: true
  },
  from: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'declined'],
    default: 'pending'
  }
}, { timestamps: true });

const SessionSchema = new mongoose.Schema({
  sessionId: {
    type: String,
    required: true,
    unique: true
  },
  offers: [OfferSchema],
  ended: {
    type: Boolean,
    default: false
  }

}, { timestamps: true });

module.exports = mongoose.model('Session', SessionSchema);
