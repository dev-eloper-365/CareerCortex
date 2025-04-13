const express = require('express');
const router = express.Router();
const { createNewChat, chatWithBot, getChatHistory, deleteChat } = require('../controllers/smartBotController');
const auth = require('../middleware/auth');

// Create new chat
router.post('/', auth, createNewChat);

// Chat with bot
router.post('/:chatId/message', auth, chatWithBot);

// Get chat history
router.get('/:chatId', auth, getChatHistory);

// Delete chat
router.delete('/:chatId', auth, deleteChat);

module.exports = router; 