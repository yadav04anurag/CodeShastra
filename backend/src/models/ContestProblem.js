const mongoose = require('mongoose');

const contestProblemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    required: true
  },
  constraints: [String],
  sampleTestCases: [{
    input: String,
    output: String,
    explanation: String
  }],
  testCases: [{
    input: String,
    output: String
  }],
  contest: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Contest',
    required: true
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const ContestProblem = mongoose.model('ContestProblem', contestProblemSchema);
module.exports = ContestProblem;