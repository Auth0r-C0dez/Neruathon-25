import React, { useState } from 'react';
import { Send } from 'lucide-react';
import ChatMessage from '../components/ChatMessage';
import LoadingIndicator from '../components/LoadingIndicator';

interface Message {
  type: 'user' | 'bot';
  content: string;
  image?: string;
}

const GREETING_MESSAGES = [
  "Hello! I'm your ControlNet floor plan assistant. How can I help you today?",
  "I can help you generate floor plans using natural language. Try something like:",
  "• Generate a modern open-concept living room and kitchen layout",
  "• Create a 2-bedroom apartment with a balcony",
  "• Design a minimalist studio apartment floor plan"
];

const ControlNetAI = () => {
  const [messages, setMessages] = useState<Message[]>([
    { type: 'bot', content: GREETING_MESSAGES[0] },
    { type: 'bot', content: GREETING_MESSAGES[1] },
    { type: 'bot', content: GREETING_MESSAGES.slice(2).join('\n') }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { type: 'user' as const, content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    // Simulate AI response - Replace with actual backend integration
    setTimeout(() => {
      setMessages(prev => [...prev, {
        type: 'bot',
        content: 'Here\'s your generated floor plan based on your description:',
        image: 'https://images.unsplash.com/photo-1574691250077-03a929faece5?w=800&auto=format&fit=crop'
      }]);
      setLoading(false);
    }, 3000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-gray-800/50 rounded-lg shadow-xl border border-gray-700 h-[600px] flex flex-col">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message, index) => (
            <ChatMessage key={index} message={message} />
          ))}
          {loading && (
            <div className="flex justify-center py-4">
              <LoadingIndicator />
            </div>
          )}
        </div>
        
        <form onSubmit={handleSubmit} className="p-4 border-t border-gray-700">
          <div className="flex space-x-4">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Describe your floor plan idea..."
              className="flex-1 bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white rounded-lg px-4 py-2 flex items-center space-x-2"
              disabled={loading}
            >
              <Send className="w-5 h-5" />
              <span>Send</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ControlNetAI