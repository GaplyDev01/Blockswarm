import React, { createContext, useContext, useState, ReactNode } from 'react';
import { AIMessage, HumanMessage } from "@langchain/core/messages";
import { createTradeAnalysis, chatWithAgent, directAnthropicChat } from '../services/ai/langchain';

interface TradeSignal {
  action: 'BUY' | 'SELL';
  confidence: number;
  target: number;
  stopLoss: number;
  explanation: string;
  riskReward: number;
}

interface AIContextType {
  isLoading: boolean;
  error: string | null;
  chatHistory: Array<HumanMessage | AIMessage>;
  directChatHistory: Array<{role: string, content: string}>; // For direct Anthropic API calls
  addUserMessage: (message: string) => Promise<void>;
  clearChatHistory: () => void;
  generateTradeSignal: (tokenName: string, currentPrice: number, marketData: any) => Promise<TradeSignal | null>;
  useDirectAnthropicAPI: boolean;
  setUseDirectAnthropicAPI: (value: boolean) => void;
}

const AIContext = createContext<AIContextType | undefined>(undefined);

export const AIProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [chatHistory, setChatHistory] = useState<Array<HumanMessage | AIMessage>>([]);
  const [directChatHistory, setDirectChatHistory] = useState<Array<{role: string, content: string}>>([]);
  const [useDirectAnthropicAPI, setUseDirectAnthropicAPI] = useState<boolean>(false);

  const addUserMessage = async (message: string) => {
    setIsLoading(true);
    setError(null);

    try {
      if (useDirectAnthropicAPI) {
        // Use direct Anthropic API
        const newUserMessage = { role: 'user', content: message };
        setDirectChatHistory(prev => [...prev, newUserMessage]);
        
        const response = await directAnthropicChat(message, directChatHistory);
        
        const aiMessage = { role: 'assistant', content: response.content };
        setDirectChatHistory(prev => [...prev, aiMessage]);
      } else {
        // Use LangChain integration
        // Add user message to chat history
        const userMessage = new HumanMessage(message);
        setChatHistory(prev => [...prev, userMessage]);
        
        // Get AI response
        const response = await chatWithAgent(message, chatHistory);
        
        // Add AI response to chat history
        const aiMessage = new AIMessage(response);
        setChatHistory(prev => [...prev, aiMessage]);
      }
    } catch (err) {
      setError('Failed to get a response. Please try again.');
      console.error('Error in chat:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChatHistory = () => {
    setChatHistory([]);
    setDirectChatHistory([]);
  };

  const generateTradeSignal = async (tokenName: string, currentPrice: number, marketData: any): Promise<TradeSignal | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const signal = await createTradeAnalysis(tokenName, currentPrice, marketData);
      return signal;
    } catch (err) {
      setError('Failed to generate trading signal');
      console.error('Error generating signal:', err);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AIContext.Provider
      value={{
        isLoading,
        error,
        chatHistory,
        directChatHistory,
        addUserMessage,
        clearChatHistory,
        generateTradeSignal,
        useDirectAnthropicAPI,
        setUseDirectAnthropicAPI
      }}
    >
      {children}
    </AIContext.Provider>
  );
};

export const useAI = () => {
  const context = useContext(AIContext);
  if (context === undefined) {
    throw new Error('useAI must be used within an AIProvider');
  }
  return context;
};