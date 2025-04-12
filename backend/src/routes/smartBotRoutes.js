const express = require('express');
const router = express.Router();
const { createNewChat, chatWithBot, getChatHistory, deleteChat, analyzeChat } = require('../controllers/smartBotController');
const auth = require('../middleware/auth');

// Create a new chat
router.post('/new', auth, createNewChat);

// Chat with the bot
router.post('/chat', auth, chatWithBot);

// Get chat history
router.get('/history', auth, getChatHistory);

// Analyze a chat
router.post('/analyze/:chatId', auth, analyzeChat);

// Delete a chat
router.delete('/:chatId', auth, deleteChat);

module.exports = router; 