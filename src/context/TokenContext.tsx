import React, { createContext, useContext, useState, useEffect } from 'react';
import { TokenData } from '../types';
import { coinGeckoAPI, USE_MOCK_DATA } from '../services/api';

type TokenContextType = {
  selectedToken: TokenData | null;
  setSelectedToken: (token: TokenData | null) => void;
  selectTokenById: (id: string) => Promise<void>;
  loadingToken: boolean;
  tokenError: string | null;
};

const TokenContext = createContext<TokenContextType | undefined>(undefined);

export const TokenProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedToken, setSelectedToken] = useState<TokenData | null>(null);
  const [loadingToken, setLoadingToken] = useState<boolean>(false);
  const [tokenError, setTokenError] = useState<string | null>(null);

  // Function to fetch token details by ID
  const selectTokenById = async (id: string) => {
    if (!id) return;
    
    setLoadingToken(true);
    setTokenError(null);
    
    try {
      let marketData;
      
      if (USE_MOCK_DATA) {
        const mockData = coinGeckoAPI.getMockMarketData([id]);
        marketData = mockData[0];
      } else {
        const data = await coinGeckoAPI.getMarketData([id]);
        marketData = data[0];
      }
      
      if (marketData) {
        const tokenData: TokenData = {
          id: marketData.id,
          symbol: marketData.symbol.toUpperCase(),
          name: marketData.name,
          image: marketData.image,
          current_price: marketData.current_price,
          market_cap: marketData.market_cap,
          price_change_percentage_24h: marketData.price_change_percentage_24h
        };
        
        setSelectedToken(tokenData);
      } else {
        setTokenError('Token not found');
        setSelectedToken(null);
      }
    } catch (err) {
      console.error('Error fetching token:', err);
      setTokenError('Failed to load token details');
      setSelectedToken(null);
    } finally {
      setLoadingToken(false);
    }
  };

  return (
    <TokenContext.Provider 
      value={{ 
        selectedToken, 
        setSelectedToken, 
        selectTokenById,
        loadingToken,
        tokenError
      }}
    >
      {children}
    </TokenContext.Provider>
  );
};

// Custom hook to use the token context
export const useToken = () => {
  const context = useContext(TokenContext);
  if (context === undefined) {
    throw new Error('useToken must be used within a TokenProvider');
  }
  return context;
};