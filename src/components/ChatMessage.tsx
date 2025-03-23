import React from 'react';
import { Bot, User } from 'lucide-react';

interface ChatMessageProps {
  message: {
    type: 'user' | 'bot';
    content: string;
    image?: string;
  };
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  return (
    <div className={`flex items-start space-x-3 ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
        message.type === 'user' ? 'bg-blue-500' : 'bg-gray-600'
      }`}>
        {message.type === 'user' ? <User className="w-5 h-5 text-white" /> : <Bot className="w-5 h-5 text-white" />}
      </div>
      <div className={`flex flex-col space-y-2 max-w-[80%] ${message.type === 'user' ? 'items-end' : 'items-start'}`}>
        <div className={`rounded-lg px-4 py-2 ${
          message.type === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-700 text-gray-100'
        }`}>
          {message.content}
        </div>
        {message.image && (
          <img src={message.image} alt="Generated floor plan" className="rounded-lg max-w-sm" />
        )}
      </div>
    </div>
  );
}

export default ChatMessage