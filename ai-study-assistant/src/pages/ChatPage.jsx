import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { sendMessage } from '../utils/aiService';

function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [currentMode, setCurrentMode] = useState('explain');
  const [currentSubject, setCurrentSubject] = useState('Matematika');
  const [isLoading, setIsLoading] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [connectionError, setConnectionError] = useState(null);
  
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  const subjects = [
    'Matematika',
    'Fisika',
    'Kimia',
    'Pemrograman Web',
    'Basis Data',
    'Jaringan Komputer',
  ];

  const modes = [
    { id: 'explain', icon: '📖', label: 'Explain Mode' },
    { id: 'quiz', icon: '🧩', label: 'Quiz Mode' },
    { id: 'summary', icon: '📋', label: 'Summary Mode' },
  ];

  // Auto-scroll to bottom when messages change or loading state changes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 160) + 'px';
    }
  }, [inputValue]);

  // Passive API key check on page load (no API call)
  useEffect(() => {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey || apiKey === 'your-api-key-here' || apiKey === '') {
      setConnectionError('API Key tidak valid — cek VITE_GEMINI_API_KEY');
    }
  }, []);

  // Update document title based on mode
  useEffect(() => {
    const modeLabel = modes.find((m) => m.id === currentMode)?.label || 'Explain Mode';
    document.title = `StudyMate AI — ${modeLabel}`;
  }, [currentMode]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage = {
      role: 'user',
      content: inputValue.trim(),
      id: Date.now(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      // Convert messages to OpenAI format for API
      const messagesForAPI = messages.map((msg) => ({
        role: msg.role,
        content: msg.content,
      }));

      const response = await sendMessage(messagesForAPI, currentMode, currentSubject);

      const aiMessage = {
        role: 'assistant',
        content: response,
        id: Date.now() + 1,
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      const errorMessage = {
        role: 'assistant',
        content: `Error: ${error.message}`,
        id: Date.now() + 1,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleNewChat = () => {
    setMessages([]);
    setInputValue('');
  };

  const handleModeChange = (newMode) => {
    if (newMode !== currentMode) {
      const modeLabel = modes.find((m) => m.id === newMode)?.label || newMode;
      const systemMessage = {
        role: 'system',
        content: `— Beralih ke ${modeLabel} —`,
        id: Date.now(),
      };
      setMessages((prev) => [...prev, systemMessage]);
      setCurrentMode(newMode);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col md:flex-row">
      {/* Mobile Menu Toggle */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 bg-gray-800 p-2 rounded-lg border border-gray-700 text-white"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        {isMobileMenuOpen ? '✕' : '☰'}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed md:static inset-y-0 left-0 z-40 w-72 max-w-[85vw] bg-gray-800 border-r border-gray-700 transform transition-transform duration-300 ease-in-out ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="flex flex-col h-full p-4">
          {/* Logo */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">
              StudyMate AI
            </h2>
          </div>

          {/* Subject Dropdown */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-400 mb-2">Subject</label>
            <select
              value={currentSubject}
              onChange={(e) => setCurrentSubject(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {subjects.map((subject) => (
                <option key={subject} value={subject}>
                  {subject}
                </option>
              ))}
            </select>
          </div>

          {/* Mode Buttons */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-400 mb-2">Mode</label>
            <div className="space-y-2">
              {modes.map((mode) => (
                <button
                  key={mode.id}
                  onClick={() => handleModeChange(mode.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    currentMode === mode.id
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  <span className="text-xl">{mode.icon}</span>
                  <span className="font-medium">{mode.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* New Chat Button */}
          <button
            onClick={handleNewChat}
            className="mb-4 w-full bg-gray-700 hover:bg-gray-600 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 border border-gray-600"
          >
            New Chat
          </button>

          {/* Back to Home */}
          <div className="mt-auto">
            <Link
              to="/"
              className="block w-full text-center text-gray-400 hover:text-white py-2 transition-colors duration-200"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Main Chat Area */}
      <main className="flex-1 flex flex-col h-screen">
        {/* Error Banner */}
        {connectionError && (
          <div className="bg-red-900 border-l-4 border-red-500 text-red-100 p-4">
            <div className="flex items-center">
              <span className="text-xl mr-3">⚠️</span>
              <p className="font-medium">{connectionError}</p>
            </div>
          </div>
        )}

        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto p-3 md:p-6">
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center px-4">
                <div className="text-5xl md:text-6xl mb-4">🎓</div>
                <h3 className="text-xl md:text-2xl font-bold text-gray-200 mb-2">Start Learning</h3>
                <p className="text-gray-400 text-sm md:text-base">Ask anything about {currentSubject}</p>
                <p className="text-gray-500 text-xs md:text-sm mt-2">Mode: {currentMode}</p>
              </div>
            </div>
          ) : (
            <div className="max-w-4xl mx-auto space-y-3 md:space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {message.role === 'system' ? (
                    <div className="w-full text-center py-2">
                      <span className="inline-block bg-gray-700 text-gray-400 text-xs md:text-sm px-3 md:px-4 py-1 rounded-full">
                        {message.content}
                      </span>
                    </div>
                  ) : (
                    <div
                      className={`max-w-[85%] md:max-w-[70%] rounded-2xl px-3 py-2 md:px-4 md:py-3 text-sm md:text-base ${
                        message.role === 'user'
                          ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white'
                          : 'bg-gray-800 text-gray-200 border border-gray-700'
                      }`}
                    >
                      {message.role === 'assistant' ? (
                        <div className="prose prose-invert prose-sm max-w-none">
                          <ReactMarkdown
                            components={{
                              code({ node, inline, className, children, ...props }) {
                                const match = /language-(\w+)/.exec(className || '');
                                return !inline && match ? (
                                  <code className={className} {...props}>
                                    {children}
                                  </code>
                                ) : (
                                  <code className="bg-gray-900 px-1 py-0.5 rounded text-blue-300 font-mono text-sm" {...props}>
                                    {children}
                                  </code>
                                );
                              },
                              pre({ children, ...props }) {
                                return (
                                  <pre className="bg-gray-900 p-4 rounded-lg overflow-x-auto border border-gray-700" {...props}>
                                    {children}
                                  </pre>
                                );
                              },
                              ul({ children, ...props }) {
                                return <ul className="list-disc pl-5 space-y-1 my-2" {...props}>{children}</ul>;
                              },
                              ol({ children, ...props }) {
                                return <ol className="list-decimal pl-5 space-y-1 my-2" {...props}>{children}</ol>;
                              },
                              li({ children, ...props }) {
                                return <li className="text-gray-300" {...props}>{children}</li>;
                              },
                              strong({ children, ...props }) {
                                return <strong className="font-bold text-white" {...props}>{children}</strong>;
                              },
                              hr({ ...props }) {
                                return <hr className="border-gray-700 my-4" {...props} />;
                              },
                            }}
                          >
                            {message.content}
                          </ReactMarkdown>
                        </div>
                      ) : (
                        <p className="whitespace-pre-wrap">{message.content}</p>
                      )}
                    </div>
                  )}
                </div>
              ))}
              
              {/* Loading Indicator */}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-800 border border-gray-700 rounded-2xl px-4 py-3">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="border-t border-gray-700 bg-gray-800 p-3 md:p-4">
          <div className="max-w-4xl mx-auto">
            {/* Mode Badge */}
            <div className="mb-2">
              <span className="inline-flex items-center gap-1 text-xs text-gray-400">
                <span>{modes.find((m) => m.id === currentMode)?.icon}</span>
                <span>{currentMode} mode</span>
              </span>
            </div>

            {/* Input Container */}
            <div className="flex gap-2 md:gap-3">
              <textarea
                ref={textareaRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={`Ask about ${currentSubject}... (Shift+Enter for new line)`}
                disabled={isLoading}
                className="flex-1 bg-gray-700 border border-gray-600 rounded-xl px-3 py-2 md:px-4 md:py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none text-sm md:text-base"
                rows={1}
                style={{ maxHeight: '160px' }}
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isLoading}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-600 disabled:to-gray-600 disabled:cursor-not-allowed text-white font-medium px-4 md:px-6 py-2 md:py-3 rounded-xl transition-all duration-200 flex items-center justify-center text-sm md:text-base"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <span>Send</span>
                )}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default ChatPage;
