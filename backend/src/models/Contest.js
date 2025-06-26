const mongoose = require('mongoose');

const contestSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String,
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  duration: {
    type: Number, // in minutes
    required: true
  },
  problems: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ContestProblem'
  }],
  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  }],
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true
  },
  status: {
    type: String,
    enum: ['upcoming', 'ongoing', 'completed'],
    default: 'upcoming'
  },
  rules: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

contestSchema.pre('save', function(next) {
  const now = new Date();
  if (this.startDate <= now && this.endDate > now) {
    this.status = 'ongoing';
  } else if (this.endDate <= now) {
    this.status = 'completed';
  }
  next();
});

const Contest = mongoose.model('Contest', contestSchema);
module.exports = Contest;