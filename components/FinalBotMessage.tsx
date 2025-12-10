import React from 'react';
import { Message } from '../types';

interface FinalBotMessageProps {
  message: Message;
}

const ShimmerPlaceholder: React.FC = () => (
    <div className="space-y-3">
        <div className="h-4 bg-gray-700 rounded w-3/4 shimmer-bg"></div>
        <div className="h-4 bg-gray-700 rounded w-full shimmer-bg"></div>
        <div className="h-4 bg-gray-700 rounded w-5/6 shimmer-bg"></div>
    </div>
);

const FinalBotMessage: React.FC<FinalBotMessageProps> = ({ message }) => {
  // While streaming, show the shimmer placeholder.
  if (message.isStreaming) {
    return (
        <div className="flex gap-4 items-start my-6">
            <div className="w-8 h-8 rounded-full bg-gray-700 flex-shrink-0 mt-2 shimmer-bg"></div>
            <div className="w-full max-w-xl border border-gray-700/50 bg-[#1A1A1A]/80 rounded-lg p-4">
                <ShimmerPlaceholder />
            </div>
        </div>
    );
  }

  // After streaming is done, if there is text, show the final message.
  if (!message.text) return null;

  const finalAnswerHtml = typeof window.marked?.parse === 'function'
      ? window.marked.parse(message.text)
      : `<p>${message.text.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</p>`;

  return (
    <div className="flex gap-4 items-start my-6">
      <img src="https://img.icons8.com/?size=100&id=iN4oY7OgknqM&format=png&color=FFFFFF" alt="Bot Final" className="w-8 h-8 rounded-full flex-shrink-0 mt-2" />
      <div className="w-full max-w-xl border border-blue-500/30 bg-gradient-to-br from-[#1A1A1A]/80 to-[#1A1A1A]/50 backdrop-blur-sm rounded-lg p-4">
        <div
          className="prose"
          dangerouslySetInnerHTML={{ __html: finalAnswerHtml }}
        />
      </div>
    </div>
  );
};

export default FinalBotMessage;