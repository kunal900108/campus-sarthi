const mongoose = require('mongoose');

const ApplicationSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  },
  status: {
    type: String,
    enum: ['applied', 'shortlisted', 'rejected', 'selected'],
    default: 'applied'
  },
  appliedAt: { type: Date, default: Date.now }
});

// Ensure a student can only apply once per company
ApplicationSchema.index({ student: 1, company: 1 }, { unique: true });

module.exports = mongoose.model('Application', ApplicationSchema);
