import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { XMarkIcon, PaperClipIcon, TrashIcon } from '@heroicons/react/24/outline';
import toast, { Toaster } from 'react-hot-toast';
import { createWorker } from 'tesseract.js';
import * as pdfjsLib from 'pdfjs-dist';

const SmartBot = ({ onClose }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [fileContent, setFileContent] = useState('');
  const [isProcessingFile, setIsProcessingFile] = useState(false);
  const [chatId, setChatId] = useState(null);
  const [chatHistory, setChatHistory] = useState([]);
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);
  const fileInputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Load chat history when component mounts
    loadChatHistory();
  }, []);

  // Handle clicks outside the chat container
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (chatContainerRef.current && !chatContainerRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  const loadChatHistory = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/smart-bot/history', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.data.success) {
        setChatHistory(response.data.chats);
      }
    } catch (error) {
      console.error('Error loading chat history:', error);
    }
  };

  const startNewChat = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/smart-bot/newchat', {}, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.data.success) {
        setChatId(response.data.chatId);
        setMessages([]);
        loadChatHistory();
      }
    } catch (error) {
      console.error('Error creating new chat:', error);
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
        setFileContent(extractedText);
        toast.success('File processed successfully! Please add your instructions.');
      } else {
        toast.error('Could not extract text from file');
      }
    } catch (error) {
      console.error('Error processing file:', error);
      toast.error('Error processing file');
    } finally {
      setIsProcessingFile(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if ((!input.trim() && !fileContent) || isProcessingFile) return;

    const userMessage = fileContent 
      ? `${input.trim()}\n\nFile Content:\n${fileContent}`
      : input.trim();

    setInput('');
    setFileContent('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await axios.post('https://openrouter.ai/api/v1/chat/completions', {
        model: "deepseek/deepseek-r1:free",
        messages: [
          {
            role: "system",
            content: "You are a helpful career guidance assistant for computer science students. You provide personalized advice based on their skills, interests, and goals."
          },
          ...messages,
          { role: "user", content: userMessage }
        ]
      }, {
        headers: {
          'Authorization': `Bearer ${process.env.REACT_APP_OPENROUTER_API_KEY}`,
          'HTTP-Referer': window.location.origin,
          'X-Title': 'Career Guidance Assistant'
        }
      });

      if (response.data.choices && response.data.choices[0]) {
        setMessages(prev => [...prev, { 
          role: 'assistant', 
          content: response.data.choices[0].message.content 
        }]);
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to get response');
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Sorry, I encountered an error. Please try again.' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteChat = () => {
    toast.promise(
      new Promise((resolve) => {
        setMessages([]);
        setInput('');
        setFileContent('');
        setTimeout(resolve, 500);
      }),
      {
        loading: 'Deleting chat...',
        success: 'Chat deleted successfully!',
        error: 'Failed to delete chat',
      }
    );
  };

  const loadChat = (chat) => {
    setChatId(chat._id);
    setMessages(chat.messages);
  };

  return (
    <>
      <Toaster position="top-right" />
      <div 
        ref={chatContainerRef}
        className="fixed bottom-4 right-4 w-[800px] h-[600px] bg-white rounded-lg shadow-xl flex z-50"
        style={{ 
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
          border: '1px solid #e5e7eb'
        }}
      >
        <div className="flex-1 flex flex-col">
          <div className="p-4 bg-blue-600 text-white rounded-t-lg">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">Career Guidance Assistant</h2>
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleDeleteChat}
                  className="p-1 rounded-full hover:bg-blue-500 transition-colors"
                  title="Delete chat"
                >
                  <TrashIcon className="h-5 w-5 text-white" />
                </button>
                <button
                  onClick={onClose}
                  className="p-1 rounded-full hover:bg-blue-500 transition-colors"
                >
                  <XMarkIcon className="h-5 w-5 text-white" />
                </button>
              </div>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-white">
            {messages.length === 0 ? (
              <div className="h-full flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <p className="text-lg font-medium mb-2">Welcome to Career Guidance Assistant!</p>
                  <p>Ask me anything about your career path in computer science.</p>
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
                    {message.content}
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

          <form onSubmit={handleSubmit} className="p-4 border-t bg-white">
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
                placeholder={fileContent ? "Add your instructions about the uploaded file..." : "Ask me anything about your career..."}
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
            {fileContent && (
              <div className="mt-2 text-sm text-gray-500">
                File content loaded. Please add your instructions above.
              </div>
            )}
          </form>
        </div>
      </div>
    </>
  );
};

export default SmartBot; 