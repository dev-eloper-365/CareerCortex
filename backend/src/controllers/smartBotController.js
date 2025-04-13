const axios = require('axios');
const Chat = require('../models/Chat');
const User = require('../models/User');
const fs = require('fs');
const path = require('path');

const SYSTEM_MESSAGE = {
  role: "system",
  content: `You are a smart and friendly Career Guidance Assistant.

Your job is to help users identify suitable career paths based on their interests, skills, education, and current job market trends.

Keep responses clear, direct, and practical. Avoid using special formatting, asterisks, or markdown.

You must:
- Assess users' skills and personality through questions
- Analyze and match their profile with in-demand job roles
- Provide personalized career suggestions
- Offer skill improvement recommendations
- Assist in building impactful resumes and preparing for interviews
- Suggest networking opportunities

Keep responses motivational and user-friendly. Ask follow-up questions when needed to gather more info.`
};

const createNewChat = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    const newChat = new Chat({
      sender: userId,
      messages: [SYSTEM_MESSAGE]
    });
    await newChat.save();

    user.chats = user.chats || [];
    user.chats.push(newChat._id);
    await user.save();

    res.json({
      success: true,
      chatId: newChat._id
    });
  } catch (error) {
    console.error('Create Chat Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create new chat',
      error: error.message
    });
  }
};

const chatWithBot = async (req, res) => {
  try {
    console.log('Chat request received:', req.body);
    const { message, chatId } = req.body;
    const userId = req.user._id;
    console.log('User ID:', userId);
    console.log('Chat ID:', chatId);

    let chat = await Chat.findOne({ _id: chatId, sender: userId });
    
    if (!chat) {
      console.log('Chat not found for user');
      return res.status(404).json({
        success: false,
        message: "Chat not found"
      });
    }

    console.log('Chat found, adding user message');
    // Add user message to chat history
    chat.messages.push({
      role: "user",
      content: message
    });

    // Prepare messages array for API
    const messageArray = chat.messages.map(msg => ({
      role: msg.role,
      content: msg.content
    }));
    console.log('Prepared message array for API');

    // Trim message history to keep only the most recent messages (system message + last 3 exchanges)
    const trimmedMessages = [];
    if (messageArray.length > 0) {
      // Keep system message for API but don't show it in UI
      const systemMessage = messageArray.find(msg => msg.role === 'system');
      if (systemMessage) {
        trimmedMessages.push(systemMessage);
      }
      
      // Add the most recent non-system messages (up to 6 messages = 3 exchanges)
      const recentMessages = messageArray
        .filter(msg => msg.role !== 'system')
        .slice(-6);
      trimmedMessages.push(...recentMessages);
    }
    
    console.log(`Trimmed message history from ${messageArray.length} to ${trimmedMessages.length} messages`);

    // Check if Groq API key is set
    if (!process.env.GROQ_API_KEY) {
      console.error('Groq API key is not set');
      return res.status(500).json({
        success: false,
        message: 'Groq API key is not configured',
        error: 'Missing API key'
      });
    }

    console.log('Sending request to Groq API');
    try {
      const response = await axios.post(
        "https://api.groq.com/openai/v1/chat/completions",
        {
          model: "llama-3.3-70b-versatile",
          messages: trimmedMessages,
          temperature: 0.7,
          max_tokens: 500,
          stream: false,
          top_p: 0.9,
          frequency_penalty: 0.3,
          presence_penalty: 0.3
        },
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${process.env.GROQ_API_KEY}`
          },
          timeout: 15000 // 15 second timeout
        }
      );

      console.log('Received response from Groq API');
      const botResponse = response.data.choices[0].message.content;

      // Format the response with proper line breaks and spacing
      const formattedResponse = botResponse
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0)
        .map(line => line.replace(/[*_~`]/g, '')) // Remove markdown characters
        .map(line => line.replace(/\s+/g, ' ')) // Normalize spaces
        .join('\n\n');

      // Add bot response to chat history
      chat.messages.push({
        role: "assistant",
        content: formattedResponse
      });

      await chat.save();
      console.log('Chat saved successfully');

      // Create logs directory if it doesn't exist
      const logsDir = path.join(__dirname, '../../logs');
      if (!fs.existsSync(logsDir)) {
        fs.mkdirSync(logsDir, { recursive: true });
      }

      // Use a single log file
      const filePath = path.join(logsDir, 'chat_log.txt');

      // Format the conversation
      const logContent = `=== Chat ID: ${chatId} ===\n` +
        `Timestamp: ${new Date().toISOString()}\n` +
        `User: ${message}\n` +
        `Assistant: ${formattedResponse}\n` +
        '===================================\n\n';

      // Write conversation to file (overwrite existing content)
      fs.writeFileSync(filePath, logContent);

      res.json({
        success: true,
        response: formattedResponse,
        chatId
      });
    } catch (apiError) {
      console.error('Groq API Error:', apiError.response?.data || apiError.message);
      return res.status(500).json({
        success: false,
        message: 'Failed to get response from Groq API',
        error: apiError.response?.data || apiError.message
      });
    }
  } catch (error) {
    console.error('Chat Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get response from smart bot',
      error: error.message
    });
  }
};

const getChatHistory = async (req, res) => {
  try {
    const userId = req.user._id;
    const chats = await Chat.find({ sender: userId })
      .sort({ updatedAt: -1 })
      .select('_id title messages updatedAt');
    
    // Filter out empty chats and remove system messages
    const filteredChats = chats.map(chat => ({
      ...chat.toObject(),
      messages: chat.messages.filter(msg => msg.role !== 'system')
    })).filter(chat => chat.messages.length > 0);
    
    res.json({
      success: true,
      chats: filteredChats
    });
  } catch (error) {
    console.error('Get Chat History Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get chat history',
      error: error.message
    });
  }
};

const deleteChat = async (req, res) => {
  try {
    const { chatId } = req.params;
    const userId = req.user._id;

    // Find and delete the chat
    const deletedChat = await Chat.findOneAndDelete({ _id: chatId, sender: userId });

    if (!deletedChat) {
      return res.status(404).json({
        success: false,
        message: "Chat not found"
      });
    }

    // Remove chat reference from user's chats array
    await User.findByIdAndUpdate(userId, {
      $pull: { chats: chatId }
    });

    res.json({
      success: true,
      message: "Chat deleted successfully"
    });
  } catch (error) {
    console.error('Delete Chat Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete chat',
      error: error.message
    });
  }
};

const analyzeChat = async (req, res) => {
  try {
    const { chatId } = req.params;
    const userId = req.user._id;

    // Find the chat
    const chat = await Chat.findOne({ _id: chatId, sender: userId });
    
    if (!chat) {
      return res.status(404).json({
        success: false,
        message: "Chat not found"
      });
    }

    // Create a formatted conversation string
    const conversation = chat.messages
      .filter(msg => msg.role !== 'system') // Exclude system messages
      .map(msg => `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`)
      .join('\n\n');

    try {
      // Create logs directory if it doesn't exist
      const logsDir = path.join(__dirname, '../../logs');
      if (!fs.existsSync(logsDir)) {
        fs.mkdirSync(logsDir, { recursive: true });
      }

      // Generate filename with timestamp
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const filename = `chat_${chatId}_${timestamp}.txt`;
      const filePath = path.join(logsDir, filename);

      // Write conversation to file
      fs.writeFileSync(filePath, conversation, 'utf8');

      // Now analyze the conversation using Groq API
      const analysisPrompt = `Analyze the following conversation and extract insights about the user's interests and potential. Your tasks are:

Identify 5 relevant skill categories based on the conversation (e.g., tech, creativity, business, research, communication, etc.). You may define any 5 custom skill names that are most applicable to the user's context.

Score each skill as an integer from 0 to 10 (do not use /10 or any extra text).

Suggest 3 career paths based on the conversation:

career1: the most suitable career.

career2: a closely related alternate career.

career3: another alternate career in the same domain.

Include a brief description for each career.

Return the result strictly in the following JSON format:

{
  "chatId": "${chatId}",
  "timestamp": "${new Date().toISOString()}",
  "analysis": {
    "skills": {
      "skill_1": x,
      "skill_2": x,
      "skill_3": x,
      "skill_4": x,
      "skill_5": x
    },
    "career1": {
      "title": "Career Title Here",
      "description": "Brief description of the career1"
    },
    "career2": {
      "title": "Career Title Here",
      "description": "Brief description of the career2"
    },
    "career3": {
      "title": "Career Title Here",
      "description": "Brief description of the career3"
    }
  }
}

Rules:

Use exactly 5 skill categories relevant to the conversation.

Skill values must be plain integers (e.g., "tech": 8), not strings, and must not exceed 10.

Each career must include a title and a description.

chatId and timestamp should be string fields (you can use placeholders if necessary).

Return only valid JSON. No extra explanations, markdown, or formatting.

Conversation to analyze:
${conversation}`;

      // Check if Groq API key is set
      if (!process.env.GROQ_API_KEY) {
        console.error('Groq API key is not set');
        return res.status(500).json({
          success: false,
          message: 'Groq API key is not configured',
          error: 'Missing API key'
        });
      }

      // Send request to Groq API
      const analysisResponse = await axios.post(
        "https://api.groq.com/openai/v1/chat/completions",
        {
          model: "llama-3.3-70b-versatile",
          messages: [
            {
              role: "user",
              content: analysisPrompt
            }
          ],
          temperature: 0.7,
          max_tokens: 1000
        },
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${process.env.GROQ_API_KEY}`
          }
        }
      );

      // Extract the analysis result
      const analysisResult = analysisResponse.data.choices[0].message.content;

      // Create FormattedResponse directory if it doesn't exist
      const formattedResponseDir = path.join(__dirname, '../../FormattedResponse');
      if (!fs.existsSync(formattedResponseDir)) {
        fs.mkdirSync(formattedResponseDir, { recursive: true });
      }

      // Save the formatted response to a file
      const formattedResponseFilename = `analysis_${chatId}_${timestamp}.txt`;
      const formattedResponsePath = path.join(formattedResponseDir, formattedResponseFilename);
      fs.writeFileSync(formattedResponsePath, analysisResult, 'utf8');

      res.json({
        success: true,
        message: "Chat analysis saved successfully",
        filename,
        formattedResponseFilename
      });
    } catch (fileError) {
      console.error('File operation error:', fileError);
      return res.status(500).json({
        success: false,
        message: 'Failed to save chat analysis',
        error: fileError.message
      });
    }
  } catch (error) {
    console.error('Analyze Chat Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to analyze chat',
      error: error.message
    });
  }
};

const processPDF = async (req, res) => {
  try {
    if (!req.files || !req.files.pdf) {
      return res.status(400).json({ error: 'No PDF file uploaded' });
    }

    const pdfFile = req.files.pdf;
    const instructions = req.body.instructions || '';
    const chatId = req.body.chatId;

    // Convert PDF file to base64
    const pdfBase64 = pdfFile.data.toString('base64');

    // Call PDF.co API to extract text
    const response = await axios.post('https://api.pdf.co/v1/pdf/convert/to/text', {
      url: `data:application/pdf;base64,${pdfBase64}`,
      apiKey: process.env.PDF_CO_API_KEY
    });

    if (!response.data || !response.data.url) {
      throw new Error('Failed to extract text from PDF');
    }

    // Get the extracted text
    const textResponse = await axios.get(response.data.url);
    const extractedText = textResponse.data;

    // Combine extracted text with user instructions
    const combinedText = `${extractedText}\n\nUser Instructions: ${instructions}`;

    // Send the combined text to the chat
    if (chatId) {
      // Create a mock response object
      const mockRes = {
        json: (data) => {
          res.json(data);
        },
        status: (code) => {
          return {
            json: (data) => {
              res.status(code).json(data);
            }
          };
        }
      };

      // Call chatWithBot with the combined text
      await chatWithBot({
        ...req,
        body: {
          message: combinedText,
          chatId: chatId
        }
      }, mockRes);
    } else {
      res.json({
        success: true,
        message: `I've processed your PDF. Here's what I found: ${extractedText.substring(0, 200)}...`,
        extractedText,
      });
    }
  } catch (error) {
    console.error('Error processing PDF:', error);
    res.status(500).json({ error: 'Failed to process PDF file' });
  }
};

const processImage = async (req, res) => {
  try {
    if (!req.files || !req.files.image) {
      return res.status(400).json({ error: 'No image file uploaded' });
    }

    const imageFile = req.files.image;
    const instructions = req.body.instructions || '';
    const chatId = req.body.chatId;

    // Convert image file to base64
    const imageBase64 = imageFile.data.toString('base64');

    // Call PDF.co API to extract text from image using OCR
    const response = await axios.post('https://api.pdf.co/v1/ocr/recognize', {
      url: `data:image/jpeg;base64,${imageBase64}`,
      apiKey: process.env.PDF_CO_API_KEY,
      language: 'eng', // Default to English
      output: 'text'
    });

    if (!response.data || !response.data.url) {
      throw new Error('Failed to extract text from image');
    }

    // Get the extracted text
    const textResponse = await axios.get(response.data.url);
    const extractedText = textResponse.data;

    // Combine extracted text with user instructions
    const combinedText = `${extractedText}\n\nUser Instructions: ${instructions}`;

    // Send the combined text to the chat
    if (chatId) {
      // Create a mock response object
      const mockRes = {
        json: (data) => {
          res.json(data);
        },
        status: (code) => {
          return {
            json: (data) => {
              res.status(code).json(data);
            }
          };
        }
      };

      // Call chatWithBot with the combined text
      await chatWithBot({
        ...req,
        body: {
          message: combinedText,
          chatId: chatId
        }
      }, mockRes);
    } else {
      res.json({
        success: true,
        message: `I've processed your image. Here's what I found: ${extractedText.substring(0, 200)}...`,
        extractedText,
      });
    }
  } catch (error) {
    console.error('Error processing image:', error);
    res.status(500).json({ error: 'Failed to process image file' });
  }
};

const analyzeChatLog = async () => {
  try {
    // Read the chat log file
    const logsDir = path.join(__dirname, '../../logs');
    const logFilePath = path.join(logsDir, 'chat_log.txt');
    
    if (!fs.existsSync(logFilePath)) {
      console.error('Chat log file not found');
      return;
    }

    const chatLog = fs.readFileSync(logFilePath, 'utf8');

    // Prepare the prompt with the chat log
    const analysisPrompt = `Analyze the following conversation and extract insights about the user's interests and potential. Your tasks are:

Identify 5 relevant skill categories based on the conversation (e.g., tech, creativity, business, research, communication, etc.). You may define any 5 custom skill names that are most applicable to the user's context.

Score each skill as an integer from 0 to 10 (do not use /10 or any extra text).

Suggest 3 career paths based on the conversation:

career1: the most suitable career.

career2: a closely related alternate career.

career3: another alternate career in the same domain.

Include a brief description for each career.

Return the result strictly in the following JSON format:

{
  "chatId": "chat_id_here",
  "timestamp": "current_timestamp",
  "analysis": {
    "skills": {
      "skill_1": x,
      "skill_2": x,
      "skill_3": x,
      "skill_4": x,
      "skill_5": x
    },
    "career1": {
      "title": "Career Title Here",
      "description": "Brief description of the career1"
    },
    "career2": {
      "title": "Career Title Here",
      "description": "Brief description of the career2"
    },
    "career3": {
      "title": "Career Title Here",
      "description": "Brief description of the career3"
    }
  }
}

Rules:

Use exactly 5 skill categories relevant to the conversation.

Skill values must be plain integers (e.g., "tech": 8), not strings, and must not exceed 10.

Each career must include a title and a description.

chatId and timestamp should be string fields (you can use placeholders if necessary).

Return only valid JSON. No extra explanations, markdown, or formatting.

Conversation to analyze:
${chatLog}`;

    // Send to Groq API
    const response = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        model: 'llama-3.3-70b-versatile',
        messages: [
          {
            role: 'user',
            content: analysisPrompt
          }
        ],
        temperature: 0.7,
        max_tokens: 1000
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
        }
      }
    );

    const analysisResult = response.data.choices[0].message.content;

    // Create FormattedLogs directory if it doesn't exist
    const formattedLogsDir = path.join(__dirname, '../../FormattedLogs');
    if (!fs.existsSync(formattedLogsDir)) {
      fs.mkdirSync(formattedLogsDir, { recursive: true });
    }

    // Save the formatted response
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const formattedLogPath = path.join(formattedLogsDir, `analysis_${timestamp}.json`);
    fs.writeFileSync(formattedLogPath, analysisResult, 'utf8');

    console.log('Analysis saved successfully:', formattedLogPath);
    return analysisResult;
  } catch (error) {
    console.error('Error analyzing chat log:', error);
    throw error;
  }
};

module.exports = {
  createNewChat,
  chatWithBot,
  getChatHistory,
  deleteChat,
  analyzeChat,
  processPDF,
  processImage,
  analyzeChatLog
}; 