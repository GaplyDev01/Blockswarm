import React, { useState, useRef, useEffect } from 'react';
import { useAI } from '../../context/AIContext';
import { Send, ChevronDown } from 'lucide-react';

interface ChatMessage {
  role: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

export const ChatWithAgent: React.FC = () => {
  const { isLoading, chatHistory, directChatHistory, addUserMessage, useDirectAnthropicAPI } = useAI();
  const [inputMessage, setInputMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'ai',
      content: "Welcome to TradesXBT - Your Degen Market Analyst. Ask me anything about market conditions, technical analysis, or trading strategies.\nCurrent SOL price: $170.93",
      timestamp: new Date()
    }
  ]);
  const [showScrollButton, setShowScrollButton] = useState(false);
  
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const endOfMessagesRef = useRef<HTMLDivElement>(null);
  
  // Convert LangChain messages to our chat format whenever chatHistory changes
  useEffect(() => {
    if (!useDirectAnthropicAPI && chatHistory.length > 0) {
      const newMessages: ChatMessage[] = [
        // Keep the welcome message
        messages[0]
      ];
      
      chatHistory.forEach(msg => {
        if (msg._getType() === 'human') {
          newMessages.push({
            role: 'user',
            content: msg.content as string,
            timestamp: new Date()
          });
        } else if (msg._getType() === 'ai') {
          newMessages.push({
            role: 'ai',
            content: msg.content as string,
            timestamp: new Date()
          });
        }
      });
      
      setMessages(newMessages);
    }
  }, [chatHistory, useDirectAnthropicAPI]);
  
  // Convert direct Anthropic API messages to our chat format
  useEffect(() => {
    if (useDirectAnthropicAPI && directChatHistory.length > 0) {
      const newMessages: ChatMessage[] = [
        // Keep the welcome message
        messages[0]
      ];
      
      directChatHistory.forEach(msg => {
        newMessages.push({
          role: msg.role === 'user' ? 'user' : 'ai',
          content: msg.content,
          timestamp: new Date()
        });
      });
      
      setMessages(newMessages);
    }
  }, [directChatHistory, useDirectAnthropicAPI]);
  
  // Smart scroll handler
  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;
    
    const handleScroll = () => {
      if (!container) return;
      
      const { scrollTop, scrollHeight, clientHeight } = container;
      const atBottom = scrollHeight - scrollTop - clientHeight < 100;
      
      setShowScrollButton(!atBottom);
    };
    
    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Scroll to bottom when messages change, but only if we're already near the bottom
  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;
    
    const { scrollTop, scrollHeight, clientHeight } = container;
    const atBottom = scrollHeight - scrollTop - clientHeight < 100;
    
    if (atBottom || isLoading) {
      scrollToBottom();
    }
  }, [messages, isLoading]);
  
  const scrollToBottom = () => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
    setShowScrollButton(false);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputMessage.trim() || isLoading) return;
    
    // Add message to our UI immediately
    setMessages(prev => [
      ...prev,
      {
        role: 'user',
        content: inputMessage,
        timestamp: new Date()
      }
    ]);
    
    const messageToSend = inputMessage;
    setInputMessage('');
    
    // Always scroll to bottom when sending a message
    scrollToBottom();
    
    // Send to AI context
    await addUserMessage(messageToSend);
  };

  // Function to format AI messages with sentiment score styling
  const formatAIMessage = (content: string) => {
    // Look for sentiment score patterns
    const scoreRegex = /Sentiment Score: (\d+)\/100/i;
    const ratingRegex = /(BEARISH 🔴|DYOR 🟡|BULLISH 🟢)/i;
    const apeRegex = /(APE IN SIGNAL 🚀)/i;
    
    // Check if the message contains a sentiment score
    if (scoreRegex.test(content) && ratingRegex.test(content)) {
      // Split the content at the sentiment score line
      const parts = content.split(/(Sentiment Score: \d+\/100)/i);
      
      // If we have before and after parts
      if (parts.length >= 2) {
        const scorePart = parts[1];
        const score = scorePart.match(/\d+/)?.[0];
        
        // Find the rating
        let ratingMatch = content.match(ratingRegex);
        const rating = ratingMatch ? ratingMatch[0] : '';
        
        // Find APE IN signal if present
        let apeMatch = content.match(apeRegex);
        const apeSignal = apeMatch ? apeMatch[0] : '';
        
        // Determine colors based on rating
        let ratingClass = '';
        if (rating.includes('BEARISH')) {
          ratingClass = 'text-red-500 dark:text-red-400';
        } else if (rating.includes('DYOR')) {
          ratingClass = 'text-yellow-500 dark:text-yellow-400';
        } else if (rating.includes('BULLISH')) {
          ratingClass = 'text-lime dark:text-lime';
        }
        
        // Format the message parts with styled ratings
        return (
          <div className="whitespace-pre-line">
            {parts[0]}
            <div className="my-2 p-3 bg-viridian/10 dark:bg-viridian/20 rounded-lg border border-viridian/30">
              <div className="font-semibold">
                Sentiment Score: <span className="text-viridian">{score}/100</span>
              </div>
              <div className={`font-bold text-lg ${ratingClass}`}>
                {rating}
              </div>
              {apeSignal && (
                <div className="font-bold text-lg text-viridian mt-1">
                  {apeSignal}
                </div>
              )}
            </div>
            {parts.slice(2).join('')}
          </div>
        );
      }
    }
    
    // Default case - just return the content as is
    return <div className="whitespace-pre-line">{content}</div>;
  };
  
  return (
    <div className="flex flex-col h-full relative">
      {/* Circuit Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 opacity-20">
        <div className="circuit-line horizontal-line-1"></div>
        <div className="circuit-line horizontal-line-2"></div>
        <div className="circuit-line vertical-line-1"></div>
        <div className="circuit-line vertical-line-2"></div>
        <div className="circuit-node node-1"></div>
        <div className="circuit-node node-2"></div>
        <div className="circuit-node node-3"></div>
        <div className="circuit-node node-4"></div>
      </div>
      
      <div 
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto py-6 px-8 space-y-6 relative circuit-container"
      >
        {messages.map((message, index) => (
          <div 
            key={index} 
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`max-w-[80%] rounded-lg p-4 message-box ${
                message.role === 'user' 
                  ? 'user-message circuit-pulse bg-viridian/10 text-white' 
                  : 'ai-message circuit-glow bg-[#171717] text-white'
              }`}
            >
              {message.role === 'ai' ? formatAIMessage(message.content) : <div className="whitespace-pre-line">{message.content}</div>}
            </div>
          </div>
        ))}
        
        {/* Show typing indicator when loading */}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-[#171717] border border-viridian/30 rounded-lg p-4 typing-indicator-container">
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={endOfMessagesRef} />
      </div>
      
      {/* Scroll to bottom button */}
      {showScrollButton && (
        <button 
          onClick={scrollToBottom}
          className="scroll-button circuit-pulse-subtle"
          aria-label="Scroll to bottom"
        >
          <ChevronDown size={20} />
        </button>
      )}
      
      <div className="p-4 border-t border-viridian/30 relative z-10">
        <form onSubmit={handleSubmit} className="bg-[#171717] border border-viridian/40 rounded-lg p-1 flex">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Ask about market analysis..."
            className="flex-1 bg-transparent px-4 py-2.5 text-white placeholder:text-gray-500 focus:outline-none"
            disabled={isLoading}
          />
          <button
            type="submit"
            className="p-2.5 rounded-lg bg-viridian hover:bg-viridian/90 text-white disabled:opacity-50 send-button"
            disabled={!inputMessage.trim() || isLoading}
          >
            Send
            <Send size={16} className="ml-2 inline-block" />
          </button>
        </form>
      </div>
    </div>
  );
};