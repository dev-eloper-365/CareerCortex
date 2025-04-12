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
    type: String,
    required: true
  },
  analysis: {
    skills: {
      type: Object,
      required: true
    },
    career1: {
      title: {
        type: String,
        required: true
      },
      description: {
        type: String,
        required: true
      }
    },
    career2: {
      title: {
        type: String,
        required: true
      },
      description: {
        type: String,
        required: true
      }
    },
    career3: {
      title: {
        type: String,
        required: true
      },
      description: {
        type: String,
        required: true
      }
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Analysis', analysisSchema); 