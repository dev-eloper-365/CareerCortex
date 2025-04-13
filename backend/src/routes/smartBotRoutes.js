const express = require('express');
const router = express.Router();
const { createNewChat, chatWithBot, getChatHistory, deleteChat, analyzeChat, processPDF, processImage, analyzeChatLog } = require('../controllers/smartBotController');
const auth = require('../middleware/auth');
const fileUpload = require('express-fileupload');

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

// PDF processing route
router.post('/process-pdf', auth, fileUpload(), processPDF);

// Image processing route
router.post('/process-image', auth, fileUpload(), processImage);

// Analyze chat log route
router.post('/analyze-log', auth, async (req, res) => {
  try {
    const result = await analyzeChatLog();
    res.json({
      success: true,
      message: 'Chat log analyzed successfully',
      result
    });
  } catch (error) {
    console.error('Error analyzing chat log:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to analyze chat log',
      error: error.message
    });
  }
});

module.exports = router; 