const mongoose = require('mongoose');

const CompanySchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  industry: { type: String, required: true },
  location: { type: String, required: true },
  description: { type: String },
  logoUrl: { type: String },
  package: {
    min: { type: Number },
    max: { type: Number },
    currency: { type: String, default: 'INR' }
  },
  eligibility: {
    minCgpa: { type: Number, default: 6.0 },
    allowedBranches: [{ type: String }],
    maxBacklogs: { type: Number, default: 0 },
    allowedYears: [{ type: String }]
  },
  skillsRequired: [
    {
      skill: { type: String },
      importance: { type: String, enum: ['mandatory', 'preferred'], default: 'preferred' }
    }
  ],
  jobProfile: { type: String },
  registrationDeadline: { type: Date },
  status: {
    type: String,
    enum: ['open', 'upcoming', 'closed'],
    default: 'open'
  },
  applicants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Company', CompanySchema);
