const mongoose = require('mongoose');

const contestSubmissionSchema = new mongoose.Schema({
  problem: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ContestProblem',
    required: true
  },
  contest: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Contest',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true
  },
  code: {
    type: String,
    required: true
  },
  language: {
    type: String,
    enum: ['cpp', 'java', 'javascript'],
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'wrong answer', 'time limit exceeded', 'runtime error'],
    default: 'pending'
  },
  executionTime: Number, // in milliseconds
  submittedAt: {
    type: Date,
    default: Date.now
  },
testCasesPassed: {
    type: Number,
    default: 0
},
errorMessage: {
    type: String,
    default: ''
},
memory: {
    type: Number // in kilobytes
}
});

const ContestSubmission = mongoose.model('ContestSubmission', contestSubmissionSchema);
module.exports = ContestSubmission;