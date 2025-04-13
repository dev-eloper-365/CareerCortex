import { useState } from 'react';

export default function QuizCenterPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState(Array(15).fill(null));
  const [showResults, setShowResults] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Static quiz data - Blockchain MCQ questions
  const quizData = [
    {
      question: "What is a blockchain?",
      options: [
        "A type of cryptocurrency",
        "A distributed ledger technology",
        "A cloud storage system",
        "A database management system"
      ]
    },
    {
      question: "Which consensus mechanism does Bitcoin use?",
      options: [
        "Proof of Stake (PoS)",
        "Proof of Work (PoW)",
        "Delegated Proof of Stake (DPoS)",
        "Proof of Authority (PoA)"
      ]
    },
    {
      question: "What is a smart contract?",
      options: [
        "A legal document in digital form",
        "A self-executing contract with terms written in code",
        "A type of cryptocurrency wallet",
        "A blockchain transaction"
      ]
    },
    {
      question: "What is the purpose of a nonce in blockchain?",
      options: [
        "To encrypt transactions",
        "To create unique block hashes",
        "To store user data",
        "To validate smart contracts"
      ]
    },
    {
      question: "Which of these is NOT a blockchain platform?",
      options: [
        "Ethereum",
        "Hyperledger",
        "Ripple",
        "MySQL"
      ]
    },
    {
      question: "What is a 51% attack in blockchain?",
      options: [
        "When a user controls 51% of the network's mining power",
        "When 51% of nodes are offline",
        "When 51% of transactions are invalid",
        "When 51% of blocks are empty"
      ]
    },
    {
      question: "What is the main advantage of blockchain technology?",
      options: [
        "High transaction speed",
        "Decentralization and immutability",
        "Low energy consumption",
        "Simple implementation"
      ]
    },
    {
      question: "What is a Merkle Tree in blockchain?",
      options: [
        "A data structure for efficient transaction verification",
        "A type of cryptocurrency",
        "A consensus algorithm",
        "A smart contract template"
      ]
    },
    {
      question: "Which of these is a layer-2 scaling solution for Ethereum?",
      options: [
        "Bitcoin Lightning Network",
        "Polygon",
        "Ripple",
        "Cardano"
      ]
    },
    {
      question: "What is the purpose of gas in Ethereum?",
      options: [
        "To power the network",
        "To measure computational effort",
        "To store data",
        "To create new tokens"
      ]
    },
    {
      question: "What is a DAO in blockchain?",
      options: [
        "Digital Asset Organization",
        "Decentralized Autonomous Organization",
        "Distributed Application Object",
        "Digital Application Operator"
      ]
    },
    {
      question: "Which of these is NOT a type of blockchain?",
      options: [
        "Public blockchain",
        "Private blockchain",
        "Hybrid blockchain",
        "Centralized blockchain"
      ]
    },
    {
      question: "What is the role of miners in a blockchain network?",
      options: [
        "To store user data",
        "To validate transactions and create new blocks",
        "To develop smart contracts",
        "To manage cryptocurrency wallets"
      ]
    },
    {
      question: "What is a hard fork in blockchain?",
      options: [
        "A permanent divergence in the blockchain",
        "A temporary network issue",
        "A type of cryptocurrency",
        "A smart contract error"
      ]
    },
    {
      question: "What is the main purpose of a blockchain wallet?",
      options: [
        "To store physical cryptocurrency",
        "To manage private and public keys",
        "To mine new blocks",
        "To develop smart contracts"
      ]
    }
  ];

  const handleAnswerSelect = (answerIndex) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestion] = answerIndex;
    setSelectedAnswers(newAnswers);
  };

  const handleNextQuestion = () => {
    if (currentQuestion < quizData.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setShowResults(true);
      setIsSubmitting(false);
    }, 1500);
  };

  const isQuizCompleted = selectedAnswers.filter(answer => answer !== null).length === quizData.length;
  const progressPercentage = (selectedAnswers.filter(answer => answer !== null).length / quizData.length) * 100;

  if (showResults) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Assessment Complete!</h1>
              <p className="mt-4 text-gray-600">Thank you for completing the career assessment quiz. Our AI is analyzing your responses to generate personalized career recommendations.</p>
            </div>
            
            <div className="bg-blue-50 rounded-lg p-6 mb-8 border border-blue-100">
              <h2 className="text-xl font-semibold text-blue-800 mb-4">What happens next?</h2>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-500 flex items-center justify-center mt-0.5">
                    <span className="text-white text-sm font-bold">1</span>
                  </div>
                  <p className="ml-3 text-gray-700">Our AI will analyze your responses and compare them with current job market data</p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-500 flex items-center justify-center mt-0.5">
                    <span className="text-white text-sm font-bold">2</span>
                  </div>
                  <p className="ml-3 text-gray-700">You'll receive personalized career recommendations based on your skills and preferences</p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-500 flex items-center justify-center mt-0.5">
                    <span className="text-white text-sm font-bold">3</span>
                  </div>
                  <p className="ml-3 text-gray-700">We'll provide resources for skill development and networking opportunities</p>
                </li>
              </ul>
            </div>
            
            <div className="text-center">
              <button 
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg shadow-md hover:from-blue-700 hover:to-purple-700 transition duration-300"
              >
                View Your Career Profile
              </button>
              <p className="mt-4 text-sm text-gray-500">Your results are being processed and will be ready shortly</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4">
            <h1 className="text-2xl font-bold text-white">Career Assessment Quiz</h1>
            <p className="text-blue-100">Discover your ideal career path based on your skills and preferences</p>
          </div>
          
          {/* Progress bar */}
          <div className="w-full bg-gray-200 h-2">
            <div 
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 transition-all duration-300 ease-in-out" 
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
          
          {/* Question counter */}
          <div className="px-6 py-3 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
            <span className="text-sm font-medium text-gray-500">Question {currentQuestion + 1} of {quizData.length}</span>
            <span className="text-sm font-medium text-blue-600">{Math.round(progressPercentage)}% Complete</span>
          </div>
          
          {/* Question */}
          <div className="px-6 py-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">{quizData[currentQuestion].question}</h2>
            
            <div className="space-y-4">
              {quizData[currentQuestion].options.map((option, index) => (
                <div 
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                    selectedAnswers[currentQuestion] === index 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                  }`}
                >
                  <div className="flex items-center">
                    <div className={`h-5 w-5 rounded-full border flex items-center justify-center mr-3 ${
                      selectedAnswers[currentQuestion] === index 
                        ? 'border-blue-500 bg-blue-500' 
                        : 'border-gray-400'
                    }`}>
                      {selectedAnswers[currentQuestion] === index && (
                        <div className="h-2 w-2 rounded-full bg-white"></div>
                      )}
                    </div>
                    <span className="text-gray-700">{option}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Navigation buttons */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-between">
            <button
              onClick={handlePreviousQuestion}
              disabled={currentQuestion === 0}
              className={`px-4 py-2 rounded-lg font-medium ${
                currentQuestion === 0
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              Previous
            </button>
            
            {currentQuestion < quizData.length - 1 ? (
              <button
                onClick={handleNextQuestion}
                disabled={selectedAnswers[currentQuestion] === null}
                className={`px-4 py-2 rounded-lg font-medium ${
                  selectedAnswers[currentQuestion] === null
                    ? 'bg-blue-300 text-white cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                Next Question
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={!isQuizCompleted || isSubmitting}
                className={`px-4 py-2 rounded-lg font-medium ${
                  !isQuizCompleted || isSubmitting
                    ? 'bg-blue-300 text-white cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700'
                }`}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Answers'}
              </button>
            )}
          </div>
          
          {/* Quiz completion status */}
          <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
            <div className="flex items-center justify-center">
              <div className="flex items-center space-x-1">
                {quizData.map((_, index) => (
                  <div 
                    key={index}
                    className={`h-2 w-2 rounded-full ${
                      selectedAnswers[index] !== null
                        ? 'bg-blue-500'
                        : currentQuestion === index
                          ? 'bg-blue-300'
                          : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* Additional info */}
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>Your responses will help our AI suggest the most suitable career paths for you</p>
        </div>
      </div>
    </div>
  );
}