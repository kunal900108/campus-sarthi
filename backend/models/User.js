const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  role: {
    type: String,
    enum: ['student', 'faculty', 'recruiter', 'admin'],
    default: 'student'
  },
  // Student-specific fields
  rollNumber: { type: String },
  department: { type: String },
  year: { type: String },
  cgpa: { type: Number, default: 8.0 },
  backlogs: { type: Number, default: 0 },
  skills: [{ type: String }],
  // Faculty-specific fields
  facultyId: { type: String },
  // Recruiter-specific fields
  company: { type: String },
  designation: { type: String },

  createdAt: { type: Date, default: Date.now }
});

// Hash password before saving
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);
