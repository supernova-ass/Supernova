import React, { useState, useRef, useEffect, useCallback } from 'react';
import { GoogleGenAI, Chat } from "@google/genai";
import Header from './components/Header';
import ChatView from './components/ChatView';
import ChatInput from './components/ChatInput';
import { Message } from './types';

type ModelType = 'gemini-2.5-flash' | 'gemini-2.5-pro';

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [model, setModel] = useState<ModelType>('gemini-2.5-flash');
  const chatRef = useRef<Chat | null>(null);

  useEffect(() => {
    try {
      if (!process.env.API_KEY) {
        console.warn("API_KEY environment variable not set.");
        return;
      }
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      let config = {};
      if (model === 'gemini-2.5-pro') {
        config = {
          thinkingConfig: {
            thinkingBudget: 32768 // Max budget for pro model
          }
        };
      }

      chatRef.current = ai.chats.create({
        model: model,
        config: config
      });
    } catch (error) {
      console.error("Failed to initialize Gemini AI:", error);
    }
  }, [model]);

  const handleModelChange = useCallback((newModel: ModelType) => {
    if (model !== newModel) {
      setModel(newModel);
      setMessages([]);
      setIsLoading(false);
    }
  }, [model]);

  const handleSendMessage = useCallback(async (text: string) => {
    if (isLoading || !text.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text,
      sender: 'user',
    };
    
    setIsLoading(true);
    
    const botMessageId = (Date.now() + 1).toString();
    const initialBotMessage: Message = {
        id: botMessageId,
        text: '',
        sender: 'bot',
        isStreaming: true,
        model: model,
    };

    setMessages(prev => [...prev, userMessage, initialBotMessage]);
    
    try {
      if (!chatRef.current) {
        throw new Error("Chat session not initialized.");
      }
      const stream = await chatRef.current.sendMessageStream({ message: text });
      
      let fullText = '';
      for await (const chunk of stream) {
        fullText += chunk.text;
        setMessages(prev => 
            prev.map(msg => 
                msg.id === botMessageId 
                ? { ...msg, text: fullText } 
                : msg
            )
        );
      }

    } catch (error) {
      console.error("Error sending message:", error);
      const errorMessageText = "Sorry, I couldn't get a response. Please check your API key or try again later.";
       setMessages(prev => 
          prev.map(msg => 
              msg.id === botMessageId 
              ? { ...msg, text: errorMessageText, isStreaming: false } 
              : msg
          )
      );
    } finally {
      setIsLoading(false);
      setMessages(prev => 
          prev.map(msg => 
              msg.id === botMessageId 
              ? { ...msg, isStreaming: false } 
              : msg
          )
      );
    }
  }, [isLoading, model]);

  return (
    <div className="bg-[#0D0D0D] text-gray-200 min-h-screen font-sans">
      <Header model={model} onModelChange={handleModelChange} />
      <main className="pt-20 pb-48">
        <ChatView messages={messages} isLoading={isLoading} />
      </main>
      <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
    </div>
  );
};

export default App;