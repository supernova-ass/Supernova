export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  isStreaming?: boolean;
  model?: 'gemini-2.5-flash' | 'gemini-2.5-pro';
}