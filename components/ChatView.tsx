import React, { useRef, useEffect } from 'react';
import { Message } from '../types';
import ThinkingMessage from './ThinkingMessage';
import FinalBotMessage from './FinalBotMessage';

declare global {
  interface Window {
    marked: {
      parse: (markdownString: string) => string;
    };
  }
}

interface ChatViewProps {
  messages: Message[];
  isLoading: boolean;
}

const WelcomeScreen: React.FC = () => (
  <div className="flex flex-col items-center justify-center h-full text-center">
    <div className="flex items-center gap-4">
      <img src="https://img.icons8.com/?size=100&id=iN4oY7OgknqM&format=png&color=FFFFFF" alt="Mascot" className="w-16 h-16" />
      <h1 className="text-5xl font-bold bg-gradient-to-r from-[#00c6ff] via-[#8a2be2] to-[#00eaff] bg-clip-text text-transparent animate-gradient">
        Supernova
      </h1>
    </div>
    <p className="mt-4 text-xl text-gray-400">Ada yang bisa saya bantu?</p>
  </div>
);

const UserMessage: React.FC<{ message: Message }> = ({ message }) => (
  <div className="flex items-start my-6 justify-end">
    <div className="max-w-xl text-right">
      <p className="font-medium text-gray-200">You</p>
      <p className="text-gray-400 whitespace-pre-wrap">{message.text}</p>
    </div>
  </div>
);


const ChatView: React.FC<ChatViewProps> = ({ messages, isLoading }) => {
  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);
  
  return (
    <div className="h-[calc(100vh-17rem)] overflow-y-auto px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {messages.length === 0 ? (
          <WelcomeScreen />
        ) : (
          <div>
            {messages.map((msg) => {
              if (msg.sender === 'user') {
                return <UserMessage key={msg.id} message={msg} />;
              }
              if (msg.sender === 'bot') {
                 // For Pro model, show both the thinking process and the final answer.
                 if (msg.model === 'gemini-2.5-pro') {
                    return (
                        <React.Fragment key={msg.id}>
                            <ThinkingMessage message={msg} />
                            <FinalBotMessage message={msg} />
                        </React.Fragment>
                    );
                 }
                 // For Flash model, only show the final answer component (which handles shimmer).
                 if (msg.model === 'gemini-2.5-flash') {
                    return <FinalBotMessage key={msg.id} message={msg} />;
                 }
                 // Fallback for any other case
                 return <FinalBotMessage key={msg.id} message={msg} />;
              }
              return null;
            })}
            <div ref={endOfMessagesRef} />
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatView;