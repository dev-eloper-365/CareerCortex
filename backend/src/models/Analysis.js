const mongoose = require('mongoose');

const analysisSchema = new mongoose.Schema({
  chatId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Chat',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  analysis: {
    skills: {
      tech: Number,
      communication: Number,
      problem_solving: Number,
      creativity: Number,
      leadership: Number
    },
    career1: {
      title: String,
      description: String
    },
    career2: {
      title: String,
      description: String
    },
    career3: {
      title: String,
      description: String
    }
  }
});

module.exports = mongoose.model('Analysis', analysisSchema); 