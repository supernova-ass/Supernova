import React, { useState } from 'react';
import { Message } from '../types';

interface ThinkingMessageProps {
  message: Message;
}

const ThinkingMessage: React.FC<ThinkingMessageProps> = ({ message }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  // Do not parse markdown for the thinking process, show raw text.
  const rawText = message.text;

  return (
    <div className="flex gap-4 items-start my-6">
      <img src="https://img.icons8.com/?size=100&id=iN4oY7OgknqM&format=png&color=FFFFFF" alt="Bot" className="w-8 h-8 rounded-full flex-shrink-0 mt-2" />
      <div 
        className="w-full max-w-xl border border-gray-700/50 bg-[#1A1A1A]/50 rounded-lg cursor-pointer transition-all duration-300 ease-in-out"
        onClick={() => setIsExpanded(!isExpanded)}
        aria-expanded={isExpanded}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setIsExpanded(!isExpanded)}
      >
        <div className="px-4 py-3">
            <div className="flex items-center gap-3">
                <div className="w-6 h-6">
                    <img 
                      src="https://img.icons8.com/?size=100&id=iN4oY7OgknqM&format=png&color=FFFFFF" 
                      alt="Thinking Mascot" 
                      className={`w-full h-full ${message.isStreaming ? 'animate-pulse' : ''}`} 
                    />
                </div>
                <p className="text-gray-300 font-medium">
                  {message.isStreaming ? 'Thinking...' : 'Proses Berpikir'}
                </p>
            </div>
        </div>
        <div 
          className={`overflow-hidden transition-[max-height] duration-500 ease-in-out ${isExpanded ? 'max-h-[100rem]' : 'max-h-0'}`}
        >
          <div className="px-4 pb-3 pt-1 border-t border-gray-700/50">
            <pre className="text-gray-400 text-sm whitespace-pre-wrap break-words font-mono">
                {rawText}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThinkingMessage;