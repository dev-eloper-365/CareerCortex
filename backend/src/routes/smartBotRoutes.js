const express = require('express');
const router = express.Router();
const { createNewChat, chatWithBot, getChatHistory, deleteChat, saveAnalysis, getAnalysisHistory } = require('../controllers/smartBotController');
const auth = require('../middleware/auth');

// Create a new chat
router.post('/new', auth, createNewChat);

// Chat with the bot
router.post('/chat', auth, chatWithBot);

// Get chat history
router.get('/history', auth, getChatHistory);

// Delete a chat
router.delete('/chat/:chatId', auth, deleteChat);

// Save analysis
router.post('/save-analysis', auth, saveAnalysis);

// Get analysis history
router.get('/analysis-history', auth, getAnalysisHistory);

module.exports = router; 