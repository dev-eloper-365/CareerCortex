import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { 
  ArrowLeftIcon, 
  ChatBubbleLeftRightIcon, 
  TrashIcon, 
  PaperClipIcon, 
  XMarkIcon, 
  ChartBarIcon, 
  PaperAirplaneIcon, 
  DocumentIcon, 
  PhotoIcon,
  Bars3Icon,
  UserCircleIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';
import { Link, useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { createWorker } from 'tesseract.js';
import * as pdfjsLib from 'pdfjs-dist';
import { motion, AnimatePresence } from 'framer-motion';

const SYSTEM_MESSAGE = {
  role: 'assistant',
  content: `Hello! I am your AI career assistant. I specialize in:

1. Career Guidance
   - Career path recommendations
   - Industry insights
   - Job market trends
   - Skill development advice

2. Resume Analysis
   - Detailed feedback on your resume
   - ATS optimization tips
   - Formatting suggestions
   - Content improvement recommendations

3. Interview Preparation
   - Common interview questions
   - Industry-specific questions
   - Behavioral interview tips
   - Technical interview guidance

Please share your resume or ask specific questions about your career goals, and I'll provide detailed, accurate advice tailored to your needs.`
};

const SmartBotPage = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chatId, setChatId] = useState(null);
  const [chatHistory, setChatHistory] = useState([]);
  const [showSidebar, setShowSidebar] = useState(true);
  const [fileContent, setFileContent] = useState('');
  const [isProcessingFile, setIsProcessingFile] = useState(false);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const [filePreview, setFilePreview] = useState(null);
  const [currentFile, setCurrentFile] = useState(null);
  const [conversationHistory, setConversationHistory] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);
  const [autoScroll, setAutoScroll] = useState(true);
  const [theme, setTheme] = useState('light');

  const scrollToBottom = () => {
    if (autoScroll) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, autoScroll]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    // Create a new chat every time the component mounts
    createNewChat(false); // Pass false to prevent toast message

    // Check if we're on mobile and hide sidebar by default
    const checkMobile = () => {
      if (window.innerWidth < 768) {
        setShowSidebar(false);
      } else {
        setShowSidebar(true);
      }
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    // Load chat history
    loadChatHistory();
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  const loadChatHistory = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/smart-bot/history', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.data.success) {
        setChatHistory(response.data.chats);
        if (response.data.chats.length > 0) {
          const mostRecentChat = response.data.chats[0];
          setChatId(mostRecentChat._id);
          setMessages(mostRecentChat.messages || []);
        }
      }
    } catch (error) {
      console.error('Error loading chat history:', error);
      if (error.response?.status === 401) {
        navigate('/login');
      }
    }
  };

  const createNewChat = async (showToast = true) => {
    try {
      const response = await axios.post('http://localhost:5000/api/smart-bot/new', {}, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.data.success) {
        setChatId(response.data.chatId);
        setMessages([SYSTEM_MESSAGE]);
        setConversationHistory([SYSTEM_MESSAGE]);
        setInput('');
        setFileContent('');
        setFilePreview(null);
        setCurrentFile(null);
        if (showToast) {
          toast.success('New conversation started', {
            icon: '✨',
            style: {
              borderRadius: '10px',
              background: '#333',
              color: '#fff',
            },
          });
        }
      }
    } catch (error) {
      console.error('Error creating new chat:', error);
      if (error.response?.status === 401) {
        navigate('/login');
      } else {
        toast.error('Failed to create new chat');
      }
    }
  };

  const handleNewChat = async () => {
    await createNewChat(true); // Pass true to show toast message
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setCurrentFile(file);
    setIsProcessingFile(true);

    // Create preview for image files
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFilePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    } else {
      setFilePreview(null);
    }

    try {
      let extractedText = '';
      
      if (file.type.startsWith('image/')) {
        // Process image using Tesseract.js
        const worker = await createWorker();
        const { data: { text } } = await worker.recognize(file);
        await worker.terminate();
        extractedText = text;
      } else if (file.type === 'application/pdf') {
        // Process PDF using pdf.js
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        let text = '';
        
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const content = await page.getTextContent();
          text += content.items.map(item => item.str).join(' ');
        }
        
        extractedText = text;
      } else {
        toast.error('Unsupported file type. Please upload an image or PDF.');
        return;
      }

      if (extractedText) {
        setFileContent(extractedText);
        toast.success('File processed successfully!', {
          icon: '🎉',
        });
      } else {
        toast.error('Could not extract text from file');
      }
    } catch (error) {
      console.error('Error processing file:', error);
      toast.error('Failed to process file');
    } finally {
      setIsProcessingFile(false);
    }
  };

  const clearFileUpload = () => {
    if (filePreview && filePreview !== 'pdf') {
      URL.revokeObjectURL(filePreview);
    }
    setFilePreview(null);
    setFileContent('');
    setCurrentFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const saveConversationToFile = () => {
    const conversationText = conversationHistory.map(msg => {
      const timestamp = new Date().toLocaleString();
      return `${timestamp} - ${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}\n`;
    }).join('\n');

    const blob = new Blob([conversationText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'conversation.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success('Conversation saved to file', {
      icon: '📄',
    });
  };

  const simulateTyping = (message, callback) => {
    setIsTyping(true);
    
    // Show typing indicator for a minimum time
    setTimeout(() => {
      setIsTyping(false);
      callback(message);
    }, Math.max(1500, message.length * 20)); // Minimum 1.5s or 20ms per character
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() && !fileContent) return;

    // Create display message (what user sees)
    const displayMessage = {
      role: 'user',
      content: input,
      file: currentFile ? {
        name: currentFile.name,
        type: currentFile.type,
        preview: filePreview
      } : null
    };

    // Create backend message with enhanced context
    const backendMessage = {
      role: 'user',
      content: `Context: I am a career assistant specializing in career guidance, resume analysis, and interview preparation.
User Query: ${input}
${fileContent ? `\n\nFile Content:\n${fileContent}` : ''}
Please provide a detailed, accurate response focusing on career-related advice.`
    };

    // Add only the display message to chat
    setMessages(prev => [...prev, displayMessage]);
    setConversationHistory(prev => [...prev, displayMessage]);
    
    setInput('');
    setFileContent('');
    setFilePreview(null);
    setCurrentFile(null);
    setIsLoading(true);

    try {
      const response = await axios.post(
        'http://localhost:5000/api/smart-bot/chat',
        {
          message: backendMessage.content,
          chatId
        },
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      if (response.data.success) {
        const assistantMessage = {
          role: 'assistant',
          content: response.data.message
        };
        
        // Simulate typing
        simulateTyping(assistantMessage, (typedMessage) => {
          setMessages(prev => [...prev, typedMessage]);
          setConversationHistory(prev => [...prev, typedMessage]);
        });
      }
    } catch (error) {
      console.error('Error sending message:', error);
      if (error.response?.status === 401) {
        navigate('/login');
      } else {
        toast.error('Failed to send message');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const loadChat = (chat) => {
    setChatId(chat._id);
    setMessages(chat.messages || []);
    
    // On mobile, hide sidebar after loading a chat
    if (window.innerWidth < 768) {
      setShowSidebar(false);
    }
  };

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  const handleDeleteChat = async (chatIdToDelete) => {
    try {
      toast.promise(
        axios.delete(`http://localhost:5000/api/smart-bot/chat/${chatIdToDelete}`, {
          headers: {
             'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }),
        {
          loading: 'Deleting chat...',
          success: () => {
            // Remove the deleted chat from state
            setChatHistory(prev => prev.filter(chat => chat._id !== chatIdToDelete));
            
            // If the deleted chat was the active chat, clear the messages
            if (chatIdToDelete === chatId) {
              setMessages([]);
              setChatId(null);
            }
            
            return 'Chat deleted successfully!';
          },
          error: 'Failed to delete chat'
        }
      );
    } catch (error) {
      console.error('Error deleting chat:', error);
      if (error.response?.status === 401) {
        navigate('/login');
      }
    }
  };

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const sidebarVariants = {
    open: { x: 0, transition: { type: "spring", stiffness: 300, damping: 30 } },
    closed: { x: "-100%", transition: { type: "spring", stiffness: 300, damping: 30 } }
  };

  const messageContainerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { type: "spring", stiffness: 500, damping: 30 }
    },
    exit: { opacity: 0, y: -20, transition: { duration: 0.2 } }
  };

  return (
    <div className={`h-screen flex flex-col ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <Toaster 
        position="top-right"
        toastOptions={{
          success: {
            style: {
              background: theme === 'dark' ? '#10B981' : '#4ade80',
              color: 'white',
              borderRadius: '12px',
              padding: '16px',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            },
            iconTheme: {
              primary: 'white',
              secondary: theme === 'dark' ? '#10B981' : '#4ade80',
            },
          },
          error: {
            style: {
              background: theme === 'dark' ? '#EF4444' : '#ef4444',
              color: 'white',
              borderRadius: '12px',
              padding: '16px',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            },
          },
          loading: {
            style: {
              background: theme === 'dark' ? '#3B82F6' : '#3b82f6',
              color: 'white',
              borderRadius: '12px',
              padding: '16px',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            },
          },
        }}
      />
      
      {/* Header */}
      <div className={`${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b shadow-sm z-10`}>
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <button
              onClick={toggleSidebar}
              className={`p-2 rounded-full hover:bg-${theme === 'dark' ? 'gray-700' : 'gray-100'} transition-colors`}
            >
              <Bars3Icon className={`h-6 w-6 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-600'}`} />
            </button>
            <div className="flex items-center">
              <SparklesIcon className={`h-7 w-7 mr-2 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`} />
              <h1 className="text-xl font-bold">AI Career Assistant</h1>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-full ${theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'} transition-colors`}
            >
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>
            
            <button
              onClick={saveConversationToFile}
              className={`p-2 rounded-full ${theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'} transition-colors`}
              title="Save conversation"
            >
              <DocumentIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <AnimatePresence>
          {showSidebar && (
            <motion.div
              initial="closed"
              animate="open"
              exit="closed"
              variants={sidebarVariants}
              className={`${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-r w-72 flex-shrink-0 overflow-y-auto z-20 absolute md:relative h-full`}
            >
              <div className="p-4">
                <button
                  onClick={handleNewChat}
                  className={`w-full flex items-center justify-center px-4 py-3 rounded-lg ${theme === 'dark' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-600 hover:bg-blue-700'} text-white transition-colors shadow-md`}
                >
                  <ChatBubbleLeftRightIcon className="h-5 w-5 mr-2" />
                  New Conversation
                </button>
                
                <div className="mt-6">
                  <h2 className={`text-sm font-semibold ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} uppercase tracking-wider mb-2`}>
                    Recent Conversations
                  </h2>
                  <div className="space-y-2">
                    {chatHistory.map((chat) => (
                      <div
                        key={chat._id}
                        className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all ${
                          chatId === chat._id
                            ? theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-blue-50 text-blue-800'
                            : theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                        }`}
                        onClick={() => loadChat(chat)}
                      >
                        <div className="flex items-center space-x-3 flex-1 min-w-0">
                          <ChatBubbleLeftRightIcon className={`h-5 w-5 ${chatId === chat._id ? (theme === 'dark' ? 'text-blue-400' : 'text-blue-600') : (theme === 'dark' ? 'text-gray-400' : 'text-gray-500')}`} />
                          <div className="flex-1 min-w-0">
                            <p className="truncate font-medium">
                              {chat.title || `Conversation ${chatHistory.indexOf(chat) + 1}`}
                            </p>
                            <p className={`text-xs truncate ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                              {new Date(chat.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteChat(chat._id);
                          }}
                          className={`p-1 rounded-full ${theme === 'dark' ? 'hover:bg-gray-600' : 'hover:bg-gray-200'} opacity-60 hover:opacity-100 transition-opacity`}
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                    
                    {chatHistory.length === 0 && (
                      <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-500'} text-center`}>
                        <p>No conversation history</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col overflow-hidden relative">
          {/* Chat Messages */}
          <div 
            className={`flex-1 overflow-y-auto p-4 space-y-4 ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}
            onClick={(e) => {
              if (window.innerWidth < 768 && showSidebar) {
                setShowSidebar(false);
              }
            }}
          >
            <AnimatePresence>
              {messages.map((message, index) => (
                <motion.div
                  key={index}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  variants={messageContainerVariants}
                  className={`flex ${
                    message.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-3xl rounded-2xl p-4 ${
                      message.role === 'user'
                        ? theme === 'dark' 
                          ? 'bg-blue-700 text-white' 
                          : 'bg-blue-600 text-white shadow-blue-100'
                        : theme === 'dark'
                          ? 'bg-gray-800 text-white shadow-md' 
                          : 'bg-white text-gray-800 shadow-sm'
                    } ${message.role === 'user' ? 'shadow-lg' : 'shadow-md'}`}
                  >
                    {message.file && (
                      <div className="mb-3 rounded-lg overflow-hidden">
                        {message.file.type.startsWith('image/') ? (
                          <motion.img
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.3 }}
                            src={message.file.preview}
                            alt="Uploaded content"
                            className="max-w-xs rounded-lg"
                          />
                        ) : (
                          <div className={`flex items-center p-3 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}>
                            <DocumentIcon className="h-5 w-5 mr-2" />
                            <span>{message.file.name}</span>
                          </div>
                        )}
                      </div>
                    )}
                    <div className="whitespace-pre-wrap">{message.content}</div>
                  </div>
                </motion.div>
              ))}

              {isTyping && (
                <motion.div 
                  initial="hidden"
                  animate="visible"
                  variants={messageContainerVariants}
                  className="flex justify-start"
                >
                  <div 
                    className={`rounded-2xl p-4 ${
                      theme === 'dark' 
                        ? 'bg-gray-800 text-white' 
                        : 'bg-white text-gray-800'
                    } shadow-sm`}
                  >
                    <div className="flex space-x-2">
                      <motion.div 
                        className={`w-2 h-2 rounded-full ${theme === 'dark' ? 'bg-blue-400' : 'bg-blue-600'}`} 
                        animate={{ y: [0, -5, 0] }}
                        transition={{ duration: 0.6, repeat: Infinity, repeatType: "loop" }}
                      />
                      <motion.div 
                        className={`w-2 h-2 rounded-full ${theme === 'dark' ? 'bg-blue-400' : 'bg-blue-600'}`} 
                        animate={{ y: [0, -5, 0] }}
                        transition={{ duration: 0.6, delay: 0.2, repeat: Infinity, repeatType: "loop" }}
                      />
                      <motion.div 
                        className={`w-2 h-2 rounded-full ${theme === 'dark' ? 'bg-blue-400' : 'bg-blue-600'}`} 
                        animate={{ y: [0, -5, 0] }}
                        transition={{ duration: 0.6, delay: 0.4, repeat: Infinity, repeatType: "loop" }}
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className={`${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-t p-4`}>
            {currentFile && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`mb-3 p-2 rounded-lg flex items-center justify-between ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}
              >
                <div className="flex items-center space-x-2">
                  {currentFile.type.startsWith('image/') ? (
                    <PhotoIcon className="h-5 w-5" />
                  ) : (
                    <DocumentIcon className="h-5 w-5" />
                  )}
                  <span className="truncate max-w-xs">{currentFile.name}</span>
                </div>
                <button
                  onClick={() => {
                    setCurrentFile(null);
                    setFilePreview(null);
                    setFileContent('');
                  }}
                  className="p-1 rounded-full hover:bg-gray-600 transition-colors"
                >
                  <XMarkIcon className="h-4 w-4" />
                </button>
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className={`p-2 rounded-full ${
                  theme === 'dark' 
                    ? 'hover:bg-gray-600' 
                    : 'hover:bg-gray-200'
                } transition-colors`}
              >
                <PaperClipIcon className="h-5 w-5" />
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                className="hidden"
                accept="image/*,.pdf"
              />
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type your message..."
                  className={`w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    theme === 'dark' 
                      ? 'bg-gray-700 text-white placeholder-gray-400' 
                      : 'bg-gray-100 text-gray-900 placeholder-gray-500'
                  }`}
                />
              </div>
              <button
                type="submit"
                disabled={isLoading || isProcessingFile}
                className={`p-2 rounded-full ${
                  isLoading || isProcessingFile
                    ? 'bg-gray-400 cursor-not-allowed'
                    : theme === 'dark'
                      ? 'bg-blue-600 hover:bg-blue-700'
                      : 'bg-blue-600 hover:bg-blue-700'
                } text-white transition-colors`}
              >
                {isLoading || isProcessingFile ? (
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 rounded-full bg-white animate-bounce" />
                    <div className="w-2 h-2 rounded-full bg-white animate-bounce" style={{ animationDelay: '0.2s' }} />
                    <div className="w-2 h-2 rounded-full bg-white animate-bounce" style={{ animationDelay: '0.4s' }} />
                  </div>
                ) : (
                  <PaperAirplaneIcon className="h-5 w-5" />
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SmartBotPage;