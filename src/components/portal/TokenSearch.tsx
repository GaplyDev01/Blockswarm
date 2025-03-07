import React, { useState, useEffect } from 'react';
import { Search, Loader2, TrendingUp } from 'lucide-react';
import { TokenData, CoinGeckoSearchCoin } from '../../types';
import { coinGeckoAPI } from '../../services/api';
import { useDebounce } from '../../hooks/useDebounce';
import { useToken } from '../../context/TokenContext';
import { useAI } from '../../context/AIContext';

export const TokenSearch: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<CoinGeckoSearchCoin[]>([]);
  const [tokens, setTokens] = useState<TokenData[]>([]);
  const [trendingTokens, setTrendingTokens] = useState<TokenData[]>([]);
  const [loading, setLoading] = useState(false);
  const [trendingLoading, setTrendingLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { setSelectedToken } = useToken();
  const { addUserMessage } = useAI();
  
  // Debounce search term to prevent excessive API calls
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // Fetch trending tokens on component mount
  useEffect(() => {
    const fetchTrendingTokens = async () => {
      setTrendingLoading(true);
      setError(null);
      
      try {
        const trendingData = await coinGeckoAPI.getTrendingCoins();
        const coinIds = trendingData.coins
          .filter(coin => coin.item)
          .map(coin => coin.item.id)
          .slice(0, 5);
        
        // Get market data for these trending coins
        const marketData = await coinGeckoAPI.getMarketData(coinIds);
        
        // Convert to TokenData format
        const tokenData: TokenData[] = (marketData || []).map(coin => ({
          id: coin.id,
          symbol: coin.symbol.toUpperCase(),
          name: coin.name,
          image: coin.image,
          current_price: coin.current_price || 0,
          market_cap: coin.market_cap || 0,
          market_cap_rank: coin.market_cap_rank || null,
          price_change_percentage_24h: coin.price_change_percentage_24h || 0
        }));
        
        setTrendingTokens(tokenData);
      } catch (err) {
        console.error('Error fetching trending tokens:', err);
        setError('Failed to load trending tokens');
      } finally {
        setTrendingLoading(false);
      }
    };
    
    fetchTrendingTokens();
  }, []);

  // Fetch detailed market data for the token IDs
  const fetchMarketData = async (coinIds: string[]) => {
    if (coinIds.length === 0) {
      setTokens([]);
      return;
    }
    
    try {
      const marketData = await coinGeckoAPI.getMarketData(coinIds);
      
      // Convert to TokenData format
      const tokenData: TokenData[] = (marketData || []).map(coin => ({
        id: coin.id,
        symbol: coin.symbol.toUpperCase(),
        name: coin.name,
        image: coin.image,
        current_price: coin.current_price || 0,
        market_cap: coin.market_cap || 0,
        market_cap_rank: coin.market_cap_rank || null,
        price_change_percentage_24h: coin.price_change_percentage_24h || 0
      }));
      
      setTokens(tokenData);
    } catch (err) {
      console.error('Market data error:', err);
      setError('Error fetching token details.');
    }
  };

  // Search coins when debounced search term changes
  useEffect(() => {
    const searchCoins = async () => {
      // Clear results if search term is too short
      if (!debouncedSearchTerm || debouncedSearchTerm.length < 2) {
        setSearchResults([]);
        setTokens([]);
        return;
      }
      
      setLoading(true);
      setError(null);
      setSearchResults([]);
      setTokens([]);
      
      try {
        // Search for tokens
        const { coins } = await coinGeckoAPI.searchCoins(debouncedSearchTerm);
        
        if (!coins || !Array.isArray(coins)) {
          throw new Error('Invalid search response');
        }
        
        setSearchResults(coins);
        
        if (coins.length > 0) {
          // Now get market data for these coins
          await fetchMarketData(coins.map(coin => coin.id));
        }
      } catch (err) {
        console.error('Search error:', err);
        setError(
          err instanceof Error 
            ? err.message 
            : 'Failed to search tokens. Please try again.'
        );
      } finally {
        setLoading(false);
      }
    };
    
    searchCoins();
  }, [debouncedSearchTerm]);

  // Handle search input change
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
    
    // Clear results if search is emptied
    if (!term) {
      setSearchResults([]);
      setTokens([]);
    }
  };

  // Handle token selection and initiate AI conversation
  const handleTokenSelect = async (token: TokenData) => {
    setSelectedToken(token);
    
    // Format initial message for AI
    const initialMessage = `Analyze ${token.name} (${token.symbol}) for me. Current price: $${token.current_price.toLocaleString()}, 24h change: ${token.price_change_percentage_24h.toFixed(2)}%. Market cap: $${token.market_cap.toLocaleString()}. Please provide a detailed analysis including current market conditions, technical indicators, and potential trading opportunities.`;
    
    // Send message to AI
    await addUserMessage(initialMessage);
    
    // Clear search
    setSearchTerm('');
    setSearchResults([]);
  };

  return (
    <div className="dashboard-card flex flex-col h-full">
      <div className="relative mb-3">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-light-subtext dark:text-dark-subtext" size={16} />
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearch}
          placeholder="Search Solana tokens..."
          className="w-full bg-light-bg/90 dark:bg-dark-bg/90 border border-light-border/20 dark:border-viridian/40 rounded-lg py-1.5 pl-8 pr-3 text-light-text dark:text-dark-text placeholder:text-light-subtext dark:placeholder:text-dark-subtext focus:outline-none focus:border-viridian/40 dark:focus:border-viridian/70 text-sm"
        />
      </div>
      
      {loading && (
        <div className="flex justify-center items-center p-4">
          <Loader2 className="w-6 h-6 text-viridian animate-spin" />
        </div>
      )}
      
      {error && (
        <div className="p-3 bg-red-100 dark:bg-red-900/20 border border-red-300 dark:border-red-700 rounded-lg text-red-600 dark:text-red-400 text-xs mb-3">
          {error}
        </div>
      )}
      
      {!loading && !error && searchTerm && searchResults.length === 0 && (
        <div className="text-center p-4 text-light-subtext dark:text-dark-subtext text-sm">
          No tokens found matching "{searchTerm}"
        </div>
      )}
      
      {!loading && tokens.length > 0 && (
        <div className="space-y-2 flex-grow overflow-y-auto dashboard-card-content">
          {tokens.map(token => (
            <div
              key={token.id}
              className="flex items-center justify-between p-2.5 rounded-lg bg-light-bg/90 dark:bg-dark-bg/90 hover:bg-light-bg/70 dark:hover:bg-viridian/10 transition-colors border border-light-border/10 dark:border-viridian/30 hover:border-viridian/30 dark:hover:border-viridian/70 cursor-pointer"
              onClick={() => handleTokenSelect(token)}
            >
              <div className="flex items-center gap-2">
                <img src={token.image} alt={token.name} className="w-6 h-6 rounded-full" />
                <div>
                  <h3 className="font-semibold text-light-text dark:text-dark-text text-sm">{token.name}</h3>
                  <p className="text-xs text-light-subtext dark:text-dark-subtext">{token.symbol}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium text-light-text dark:text-dark-text text-sm">${token.current_price.toLocaleString()}</p>
                <p className={`text-xs ${token.price_change_percentage_24h >= 0 ? 'text-smaragdine dark:text-smaragdine' : 'text-red-600 dark:text-red-400'}`}>
                  {token.price_change_percentage_24h >= 0 ? '+' : ''}{token.price_change_percentage_24h.toFixed(2)}%
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {!loading && !searchTerm && (
        <div className="flex-grow overflow-y-auto dashboard-card-content">
          <div className="flex items-center gap-1.5 mb-2">
            <TrendingUp size={16} className="text-viridian" />
            <h3 className="font-semibold text-light-text dark:text-dark-text text-sm">Trending Tokens</h3>
          </div>
          
          {trendingLoading ? (
            <div className="flex justify-center items-center p-4">
              <Loader2 className="w-5 h-5 text-viridian animate-spin" />
            </div>
          ) : (
            <div className="space-y-2">
              {trendingTokens.map(token => (
                <div
                  key={token.id}
                  className="flex items-center justify-between p-2.5 rounded-lg bg-light-bg/90 dark:bg-dark-bg/90 hover:bg-light-bg/70 dark:hover:bg-viridian/10 transition-colors border border-light-border/10 dark:border-viridian/30 hover:border-viridian/30 dark:hover:border-viridian/70 cursor-pointer"
                  onClick={() => handleTokenSelect(token)}
                >
                  <div className="flex items-center gap-2">
                    <img src={token.image} alt={token.name} className="w-6 h-6 rounded-full" />
                    <div>
                      <h3 className="font-semibold text-light-text dark:text-dark-text text-sm">{token.name}</h3>
                      <p className="text-xs text-light-subtext dark:text-dark-subtext">{token.symbol}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-light-text dark:text-dark-text text-sm">${token.current_price.toLocaleString()}</p>
                    <p className={`text-xs ${token.price_change_percentage_24h >= 0 ? 'text-smaragdine dark:text-smaragdine' : 'text-red-600 dark:text-red-400'}`}>
                      {token.price_change_percentage_24h >= 0 ? '+' : ''}{token.price_change_percentage_24h.toFixed(2)}%
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};