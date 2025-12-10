import React, { useState, useRef, useEffect } from 'react';
import { GlobeIcon, FileIcon, SendIcon, VoiceIcon } from './Icons';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isLoading }) => {
  const [inputValue, setInputValue] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      const scrollHeight = textarea.scrollHeight;
      textarea.style.height = `${scrollHeight}px`;
    }
  }, [inputValue]);

  const handleSend = () => {
    if (inputValue.trim() && !isLoading) {
      onSendMessage(inputValue);
      setInputValue('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-[#0D0D0D] via-[#0D0D0D] to-transparent z-10">
      <div className="relative max-w-3xl mx-auto">
        {/* Glow effect */}
        <div className="absolute -inset-1 bg-gradient-to-r from-[#00c6ff] via-[#8a2be2] to-[#00eaff] rounded-[22px] blur-xl opacity-60 animate-gradient transition-opacity duration-300"></div>
        
        {/* Main input container */}
        <div className="relative flex flex-col p-3 bg-[#1A1A1A] rounded-[20px]">
          <textarea
            ref={textareaRef}
            rows={1}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Message Supernova..."
            className="w-full px-2 py-2 bg-transparent text-gray-200 placeholder-gray-500 focus:outline-none resize-none max-h-40 overflow-y-auto"
            disabled={isLoading}
          />
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center gap-1">
                <button className="p-2 text-gray-400 hover:text-white transition-colors rounded-full hover:bg-gray-700/50">
                    <GlobeIcon className="w-5 h-5" />
                </button>
                 <button className="p-2 text-gray-400 hover:text-white transition-colors rounded-full hover:bg-gray-700/50">
                    <FileIcon className="w-5 h-5" />
                </button>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 text-gray-400 hover:text-white transition-colors rounded-full hover:bg-gray-700/50">
                  <VoiceIcon className="w-5 h-5" />
              </button>
              <button
                  onClick={handleSend}
                  disabled={isLoading || !inputValue.trim()}
                  className="p-2.5 text-white bg-blue-600 rounded-full disabled:bg-gray-600 disabled:cursor-not-allowed hover:bg-blue-500 transition-colors"
              >
                  <SendIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInput;