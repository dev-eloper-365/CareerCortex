import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { ArrowLeftIcon, ChatBubbleLeftRightIcon, TrashIcon, PaperClipIcon, XMarkIcon, ChartBarIcon } from '@heroicons/react/24/outline';
import { Link, useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { createWorker } from 'tesseract.js';
import * as pdfjsLib from 'pdfjs-dist';

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

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    // Load chat history and create new chat if needed
    const initializeChat = async () => {
      try {
        console.log('Initializing chat...');
        await loadChatHistory();
        
        // If no active chat, create a new one
        if (!chatId) {
          console.log('No active chat found, creating new chat...');
          await startNewChat();
        }
      } catch (error) {
        console.error('Error initializing chat:', error);
        if (error.response?.status === 401) {
          navigate('/login');
        }
      }
    };
    
    initializeChat();
    
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
        // If there are chats, set the most recent one as active
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

  const startNewChat = async () => {
    try {
      console.log('Creating new chat...');
      const response = await axios.post('http://localhost:5000/api/smart-bot/new', {}, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      console.log('New chat response:', response.data);
      
      if (response.data.success) {
        // Clear current chat state
        setMessages([]);
        setChatId(response.data.chatId);
        
        // Refresh chat history
        await loadChatHistory();
        
        // On mobile, hide sidebar after starting a new chat
        if (window.innerWidth < 768) {
          setShowSidebar(false);
        }

        console.log('New chat created with ID:', response.data.chatId);
        toast.success('New chat started successfully');
      } else {
        console.error('Failed to create new chat:', response.data);
        toast.error('Failed to create new chat. Please try again.');
      }
    } catch (error) {
      console.error('Error creating new chat:', error.response?.data || error.message);
      if (error.response?.status === 401) {
        navigate('/login');
      } else {
        toast.error('Failed to create new chat. Please try again.');
      }
    }
  };

  const handleNewChat = async () => {
    try {
      // Clear current state first
      setMessages([]);
      setChatId(null);
      setInput('');
      
      // Create new chat
      await startNewChat();
    } catch (error) {
      console.error('Error handling new chat:', error);
    }
  };

  const extractTextFromImage = async (file) => {
    setIsProcessingFile(true);
    try {
      const worker = await createWorker();
      const { data: { text } } = await worker.recognize(file);
      await worker.terminate();
      return text;
    } catch (error) {
      console.error('Error extracting text from image:', error);
      toast.error('Failed to extract text from image');
      return '';
    }
  };

  const extractTextFromPDF = async (file) => {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      let text = '';
      
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        text += content.items.map(item => item.str).join(' ');
      }
      
      return text;
    } catch (error) {
      console.error('Error extracting text from PDF:', error);
      toast.error('Failed to extract text from PDF');
      return '';
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Create preview URL for images
    if (file.type.includes('image')) {
      setFilePreview(URL.createObjectURL(file));
    } else if (file.type === 'application/pdf') {
      setFilePreview('pdf');
    }
    
    setCurrentFile(file);
    setIsProcessingFile(true);

    try {
      let extractedText = '';
      
      if (file.type.includes('image')) {
        extractedText = await extractTextFromImage(file);
      } else if (file.type === 'application/pdf') {
        extractedText = await extractTextFromPDF(file);
      } else {
        toast.error('Unsupported file type. Please upload an image or PDF.');
        return;
      }

      if (extractedText) {
        // Store the extracted text but don't show it
        setFileContent(extractedText);
        toast.success('File processed successfully!');
      } else {
        toast.error('Could not process file');
      }
    } catch (error) {
      console.error('Error processing file:', error);
      toast.error('Error processing file');
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if ((!input.trim() && !fileContent) || !chatId || isProcessingFile) return;

    // Display message - only shows user's instruction and file preview
    const displayMessage = {
      role: 'user',
      content: input.trim() || "Please analyze this file.",
      filePreview: filePreview,
      fileName: currentFile?.name,
      fileType: currentFile?.type
    };

    // Add user message to chat
    setMessages(prev => [...prev, displayMessage]);
    setIsLoading(true);

    try {
      // Send both instruction and extracted text to backend
      const response = await axios.post(
        'http://localhost:5000/api/smart-bot/chat', 
        {
          message: fileContent 
            ? `${input.trim()}\n\nFile Content:\n${fileContent}`
            : input.trim(),
          chatId
        },
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      if (response.data.success) {
        // Add AI response to chat
        const assistantMessage = { 
          role: 'assistant', 
          content: response.data.message 
        };
        setMessages(prev => [...prev, assistantMessage]);
        loadChatHistory();
      }
    } catch (error) {
      console.error('Error:', error);
      if (error.response?.status === 401) {
        navigate('/login');
      } else {
        toast.error('Failed to get response');
        const errorMessage = { 
          role: 'assistant', 
          content: 'Sorry, I encountered an error. Please try again.' 
        };
        setMessages(prev => [...prev, errorMessage]);
      }
    } finally {
      setInput('');
      setFileContent('');
      clearFileUpload();
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

  const handleAnalyzeChat = async () => {
    if (!chatId) {
      toast.error('No active chat to analyze');
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:5000/api/smart-bot/analyze/${chatId}`,
        {},
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      if (response.data.success) {
        toast.success(
          <div>
            <p>Chat analysis saved successfully!</p>
            <p className="text-xs mt-1">Chat log: {response.data.filename}</p>
            <p className="text-xs">Analysis: {response.data.formattedResponseFilename}</p>
          </div>
        );
      } else {
        toast.error(response.data.message || 'Failed to analyze chat');
      }
    } catch (error) {
      console.error('Error analyzing chat:', error);
      if (error.response?.status === 401) {
        navigate('/login');
      } else {
        toast.error(error.response?.data?.message || 'Failed to analyze chat. Please try again.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster 
        position="top-right"
        toastOptions={{
          success: {
            style: {
              background: '#4ade80',
              color: 'white',
            },
          },
          error: {
            style: {
              background: '#ef4444',
              color: 'white',
            },
          },
          loading: {
            style: {
              background: '#3b82f6',
              color: 'white',
            },
          },
        }}
      />
      {/* Header */}
      <div className="bg-blue-600 text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/" className="mr-4">
                <ArrowLeftIcon className="h-6 w-6" />
              </Link>
              <h1 className="text-2xl font-bold">Career Guidance Assistant</h1>
            </div>
            {chatId && (
              <button
                onClick={handleAnalyzeChat}
                className="p-2 rounded-full hover:bg-blue-700 transition-colors"
                title="Analyze chat"
              >
                <ChartBarIcon className="h-6 w-6" />
              </button>
            )}
            <button 
              onClick={toggleSidebar}
              className="md:hidden p-2 rounded-full hover:bg-blue-700 transition-colors"
            >
              <ChatBubbleLeftRightIcon className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col md:flex-row h-[calc(100vh-12rem)]">
          {/* Chat History Sidebar */}
          <div 
            className={`${
              showSidebar ? 'block' : 'hidden'
            } md:block w-full md:w-1/4 border-r p-4 overflow-y-auto bg-gray-50`}
          >
            <button
              onClick={handleNewChat}
              className="w-full mb-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              New Chat
            </button>
            <div className="space-y-2">
              {chatHistory.length === 0 ? (
                <div className="text-center text-gray-500 py-4">
                  <p>No chat history yet</p>
                  <p className="text-sm">Start a new chat to begin</p>
                </div>
              ) : (
                chatHistory.map((chat) => (
                  <div
                    key={chat._id}
                    className="p-2 rounded transition-colors hover:bg-gray-100 flex justify-between items-center"
                  >
                    <div 
                      onClick={() => loadChat(chat)}
                      className={`flex-1 min-w-0 mr-2 cursor-pointer p-2 rounded ${
                        chat._id === chatId ? 'bg-blue-100' : ''
                      }`}
                    >
                      <div className="font-medium truncate text-gray-800">
                        {chat.messages[0]?.content.substring(0, 30)}...
                      </div>
                      <div className="text-sm text-gray-500">
                        {new Date(chat.updatedAt).toLocaleDateString()}
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        if (window.confirm('Are you sure you want to delete this chat?')) {
                          handleDeleteChat(chat._id);
                        }
                      }}
                      className="p-2 hover:bg-red-100 rounded-full transition-colors flex items-center justify-center min-w-[40px] min-h-[40px]"
                      title="Delete chat"
                    >
                      <TrashIcon className="h-5 w-5 text-red-500" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Chat Area */}
          <div className="flex-1 flex flex-col">
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 ? (
                <div className="h-full flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <p className="text-lg font-medium mb-2">Welcome to Career Guidance Assistant!</p>
                    <p>Start a new chat or select an existing one to begin.</p>
                    <p className="text-sm mt-2">You can also upload PDFs or images for analysis.</p>
                  </div>
                </div>
              ) : (
                messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${
                      message.role === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <div
                      className={`max-w-[80%] p-3 rounded-lg ${
                        message.role === 'user'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {message.filePreview && (
                        <div className="mb-2">
                          {/* Commenting out image preview
                          {message.fileType?.includes('image') ? (
                            <div className="relative">
                              <img 
                                src={message.filePreview} 
                                alt="Uploaded content"
                                className="max-w-full rounded-lg mb-2"
                                style={{ maxHeight: '200px' }}
                              />
                              <div className="text-xs opacity-75 mt-1">
                                {message.fileName}
                              </div>
                            </div>
                          ) : message.filePreview === 'pdf' && (
                            <div className="flex items-center space-x-2 mb-2 p-2 bg-gray-700 rounded">
                              <svg className="w-8 h-8 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M4 18h12a2 2 0 002-2V6a2 2 0 00-2-2h-3.93a2 2 0 01-1.66-.89l-.812-1.22A2 2 0 008.93 1H4a2 2 0 00-2 2v13a2 2 0 002 2z" />
                              </svg>
                              <span className="text-sm text-white">{message.fileName}</span>
                            </div>
                          )}
                          */}
                          {/* Only show file name */}
                          <div className="text-xs text-gray-500">
                            {message.fileName}
                          </div>
                        </div>
                      )}
                      <div className="whitespace-pre-wrap">{message.content}</div>
                    </div>
                  </div>
                ))
              )}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 p-3 rounded-lg">
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                  </div>
                </div>
              )}
              {isProcessingFile && (
                <div className="flex justify-center">
                  <div className="bg-blue-100 text-blue-800 p-2 rounded-lg">
                    Processing file... Please wait.
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSubmit} className="p-4 border-t">
              {filePreview && (
                <div className="mb-4 relative">
                  <div className="flex items-start space-x-2 p-2 bg-gray-50 rounded-lg">
                    {filePreview === 'pdf' ? (
                      <div className="flex items-center space-x-2 p-2 bg-gray-200 rounded">
                        <svg className="w-8 h-8 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M4 18h12a2 2 0 002-2V6a2 2 0 00-2-2h-3.93a2 2 0 01-1.66-.89l-.812-1.22A2 2 0 008.93 1H4a2 2 0 00-2 2v13a2 2 0 002 2z" />
                        </svg>
                        <span className="text-sm">{currentFile?.name}</span>
                      </div>
                    ) : (
                      <div className="relative">
                        <img 
                          src={filePreview} 
                          alt="Preview" 
                          className="max-h-32 rounded"
                        />
                        <div className="text-xs text-gray-500 mt-1">
                          {currentFile?.name}
                        </div>
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={clearFileUpload}
                      className="p-1 hover:bg-gray-200 rounded-full"
                    >
                      <XMarkIcon className="w-5 h-5 text-gray-500" />
                    </button>
                  </div>
                </div>
              )}
              <div className="flex space-x-2">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept="image/*,.pdf"
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="p-2 text-gray-500 hover:text-blue-600 transition-colors"
                  disabled={isLoading || isProcessingFile}
                  title="Upload PDF or Image"
                >
                  <PaperClipIcon className="h-6 w-6" />
                </button>
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={fileContent ? "What would you like to know about this file?" : "Ask me anything about your career..."}
                  className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={isLoading || isProcessingFile}
                />
                <button
                  type="submit"
                  disabled={isLoading || isProcessingFile || (!input.trim() && !fileContent)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 transition-colors"
                >
                  Send
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SmartBotPage; 