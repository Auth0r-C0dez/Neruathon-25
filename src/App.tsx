import React, { useState, useEffect } from 'react';
import { Send, Loader2, Download, RefreshCw, Home, Sun, Moon, Menu, X, AlertTriangle } from 'lucide-react';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

function App() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hi! I'm your floor plan assistant. Tell me about the space you'd like to design. For example: 'Create a 2-bedroom apartment with an open kitchen and living area.'",
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentPlan, setCurrentPlan] = useState<string | null>(null);
  const [isDark, setIsDark] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    document.documentElement.classList.add('dark');
    
    // Test the server connection
    fetch('http://localhost:5000/ping')
      .then(response => {
        if (!response.ok) throw new Error('Flask server is not responding');
        return response.json();
      })
      .then(data => {
        console.log('Server connection:', data.message);
      })
      .catch(err => {
        console.error('Server connection error:', err);
        setError('Cannot connect to backend server. Make sure Flask is running on port 5000.');
      });
  }, []);

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
  };

  const downloadImage = () => {
    if (!currentPlan) return;
    
    const link = document.createElement('a');
    link.href = currentPlan;
    link.download = 'floor-plan.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const regenerateImage = () => {
    if (!messages.some(m => m.sender === 'user')) return;
    
    // Get the last user message
    const lastUserMessage = [...messages]
      .filter(m => m.sender === 'user')
      .pop();
      
    if (lastUserMessage) {
      setInput(lastUserMessage.content);
      handleSubmit(new CustomEvent('regenerate') as unknown as React.FormEvent);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      content: input,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setInput('');
    setIsLoading(true);
    setIsSidebarOpen(false);
    setError(null);

    try {
      // Call the Flask backend to generate the image
      const response = await fetch('http://localhost:5000/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: input }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Server returned status: ${response.status}`);
      }

      // Get the image blob from the response
      const imageBlob = await response.blob();
      
      // Check if we actually received an image
      if (!imageBlob.type.includes('image')) {
        throw new Error('Received invalid data from server (not an image)');
      }
      
      const imageUrl = URL.createObjectURL(imageBlob);

      // Update the current plan with the new image
      setCurrentPlan(imageUrl);

      // Add the bot response to the messages
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: "I've generated a floor plan based on your requirements. You can see it in the preview area.",
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botResponse]);
    } catch (error) {
      console.error('Error:', error);
      const errorMessage = error instanceof Error ? error.message : String(error);
      setError(errorMessage);
      
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: `Sorry, something went wrong while generating the floor plan: ${errorMessage}`,
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botResponse]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col lg:flex-row">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-20 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Home className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Floor Plan AI</h1>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
            >
              {isDark ? (
                <Sun className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              ) : (
                <Moon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              )}
            </button>
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
            >
              {isSidebarOpen ? (
                <X className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              ) : (
                <Menu className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed lg:static inset-y-0 left-0 w-full sm:w-80 lg:w-1/4 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 p-4 flex flex-col z-40 transform transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="hidden lg:flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Home className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Floor Plan AI</h1>
          </div>
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
          >
            {isDark ? (
              <Sun className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            ) : (
              <Moon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            )}
          </button>
        </div>
        
        <div className="flex-grow overflow-y-auto mt-16 lg:mt-0">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`p-3 rounded-lg ${
                  message.sender === 'user'
                    ? 'bg-blue-100 dark:bg-blue-900 ml-4'
                    : 'bg-gray-100 dark:bg-gray-700 mr-4'
                }`}
              >
                <p className="text-sm text-gray-800 dark:text-gray-200">{message.content}</p>
                <span className="text-xs text-gray-500 dark:text-gray-400 mt-1 block">
                  {message.timestamp.toLocaleTimeString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen">
        <div className="flex-1 p-4 lg:p-8 mt-16 lg:mt-0 overflow-y-auto">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 lg:p-6 h-full flex flex-col">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <h2 className="text-xl lg:text-2xl font-semibold text-gray-900 dark:text-white">Generated Floor Plan</h2>
              <div className="flex flex-wrap gap-2">
                <button
                  className="px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 flex items-center gap-2 disabled:opacity-50"
                  onClick={regenerateImage}
                  disabled={!currentPlan || isLoading}
                >
                  <RefreshCw className="w-4 h-4" />
                  <span className="hidden sm:inline">Regenerate</span>
                </button>
                <button
                  className="px-3 py-2 text-sm font-medium text-white bg-blue-600 dark:bg-blue-500 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 flex items-center gap-2 disabled:opacity-50"
                  onClick={downloadImage}
                  disabled={!currentPlan || isLoading}
                >
                  <Download className="w-4 h-4" />
                  <span className="hidden sm:inline">Download</span>
                </button>
              </div>
            </div>

            <div className="flex-1 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden relative">
              {error && (
                <div className="absolute top-4 left-4 right-4 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 p-3 rounded-lg flex items-start gap-2 z-10">
                  <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-medium">Error</h3>
                    <p className="text-sm">{error}</p>
                  </div>
                </div>
              )}
              
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10">
                  <div className="p-4 bg-white dark:bg-gray-800 rounded-lg flex flex-col items-center gap-3">
                    <Loader2 className="w-8 h-8 text-blue-600 dark:text-blue-400 animate-spin" />
                    <p className="text-gray-800 dark:text-gray-200">Generating your floor plan...</p>
                  </div>
                </div>
              )}
              
              {currentPlan ? (
                <img
                  src={currentPlan}
                  alt="Generated floor plan"
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-500 dark:text-gray-400">
                  No floor plan generated yet. Describe what you want in the chat.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Chat Input - Fixed at bottom */}
        <div className="fixed bottom-0 left-0 right-0 lg:relative bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4">
          <form onSubmit={handleSubmit}>
            <div className="relative max-w-3xl mx-auto">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Describe your ideal floor plan..."
                className="w-full p-3 pr-12 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Send className="w-5 h-5" />
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default App;