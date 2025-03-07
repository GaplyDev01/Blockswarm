import React from 'react';
import { useToken } from '../../context/TokenContext';
import { Brain, ExternalLink, TrendingUp, TrendingDown, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAI } from '../../context/AIContext';

export const TokenDetailsCard: React.FC = () => {
  const navigate = useNavigate();
  const { selectedToken, loadingToken, tokenError } = useToken();
  const { addUserMessage } = useAI();
  
  const handleAIInsights = async () => {
    if (!selectedToken) return;
    
    // Format initial message for AI
    const initialMessage = `Analyze ${selectedToken.name} (${selectedToken.symbol}) for me. 
Current price: $${selectedToken.current_price.toLocaleString()}
24h change: ${selectedToken.price_change_percentage_24h.toFixed(2)}%
Market cap: $${selectedToken.market_cap.toLocaleString()}
    
Please provide a detailed analysis including:
1. Current market sentiment based on 5min, 15min, and 30min volume and market cap data
2. Technical analysis with key indicators
3. Support and resistance levels
4. Potential trading opportunities and risks
5. Short-term price forecast
6. Momentum sentiment score (0-100)
7. Your recommendation (BEARISH, DYOR, or BULLISH)`;
    
    // Navigate to chat view
    navigate('/portal?tab=chat');
    
    // Send message to AI after a short delay to ensure chat view is loaded
    setTimeout(() => {
      addUserMessage(initialMessage);
    }, 100);
  };
  
  if (loadingToken) {
    return (
      <div className="dashboard-card flex justify-center items-center h-full">
        <div className="w-6 h-6 border-2 border-viridian border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
  
  if (tokenError) {
    return (
      <div className="dashboard-card flex flex-col items-center justify-center h-full text-center p-4">
        <p className="text-red-500 dark:text-red-400 mb-2 text-sm">Error loading token details</p>
        <p className="text-light-subtext dark:text-dark-subtext text-xs">{tokenError}</p>
      </div>
    );
  }
  
  if (!selectedToken) {
    return (
      <div className="dashboard-card flex flex-col items-center justify-center h-full text-center p-4">
        <p className="text-base font-semibold text-light-text dark:text-dark-text mb-2">No Token Selected</p>
        <p className="text-light-subtext dark:text-dark-subtext text-xs">Search and select a token to view detailed information</p>
      </div>
    );
  }
  
  // Format numbers for display
  const formatNumber = (num: number) => {
    if (num >= 1_000_000_000) {
      return `$${(num / 1_000_000_000).toFixed(2)}B`;
    } else if (num >= 1_000_000) {
      return `$${(num / 1_000_000).toFixed(2)}M`;
    } else if (num >= 1_000) {
      return `$${(num / 1_000).toFixed(2)}K`;
    } else {
      return `$${num.toFixed(2)}`;
    }
  };
  
  // Format price with appropriate decimal places
  const formatPrice = (price: number) => {
    if (price < 0.000001) {
      return `$${price.toFixed(10)}`;
    } else if (price < 0.001) {
      return `$${price.toFixed(8)}`;
    } else if (price < 1) {
      return `$${price.toFixed(6)}`;
    } else if (price < 10) {
      return `$${price.toFixed(4)}`;
    } else {
      return `$${price.toFixed(2)}`;
    }
  };
  
  // Extract first letter for placeholder logo
  const firstLetter = selectedToken.symbol.charAt(0);
  
  return (
    <div className="dashboard-card flex flex-col h-full">
      {/* Header Section - Fixed */}
      <div className="flex items-center gap-2 mb-2">
        {selectedToken.image ? (
          <img src={selectedToken.image} alt={selectedToken.symbol} className="w-7 h-7 rounded-full" />
        ) : (
          <div className="w-7 h-7 bg-white dark:bg-dark-bg border-0 dark:border-2 dark:border-viridian rounded-full flex items-center justify-center text-xs font-bold text-black dark:text-viridian">
            {firstLetter}
          </div>
        )}
        <div>
          <div className="flex items-center gap-1">
            <h3 className="text-sm font-bold text-light-text dark:text-dark-text">{selectedToken.symbol}</h3>
            <span className={`${selectedToken.price_change_percentage_24h >= 0 ? 'text-smaragdine dark:text-smaragdine' : 'text-red-600 dark:text-red-400'} text-xs flex items-center gap-0.5`}>
              {selectedToken.price_change_percentage_24h >= 0 ? (
                <TrendingUp size={12} />
              ) : (
                <TrendingDown size={12} />
              )}
              {selectedToken.price_change_percentage_24h >= 0 ? '+' : ''}{selectedToken.price_change_percentage_24h.toFixed(2)}%
            </span>
          </div>
          <p className="text-base text-light-text dark:text-dark-text">{formatPrice(selectedToken.current_price)}</p>
        </div>
      </div>
      
      {/* Scrollable Content Area */}
      <div className="flex-grow overflow-y-auto dashboard-card-content space-y-2">
        <div className="grid grid-cols-2 gap-2">
          <div>
            <p className="stat-label">Market Cap</p>
            <p className="stat-value text-sm">{formatNumber(selectedToken.market_cap)}</p>
          </div>
          <div>
            <p className="stat-label">Rank</p>
            <p className="stat-value text-sm">#{selectedToken.market_cap_rank || '--'}</p>
          </div>
        </div>
        
        {/* Additional Token Metrics */}
        <div className="bg-light-bg/80 dark:bg-forest/60 rounded-lg p-2 border border-emerald/10 dark:border-emerald/20">
          <h4 className="font-medium text-light-text dark:text-dark-text mb-1.5 flex items-center gap-1 text-xs">
            <AlertCircle size={12} className="text-viridian" />
            Market Metrics
          </h4>
          <div className="grid grid-cols-2 gap-x-2 gap-y-1.5">
            <div>
              <p className="text-[0.65rem] text-light-subtext dark:text-dark-subtext mb-0.5">24h Volume</p>
              <p className="text-xs font-medium text-light-text dark:text-dark-text">
                {formatNumber(selectedToken.total_volume || 0)}
              </p>
            </div>
            <div>
              <p className="text-[0.65rem] text-light-subtext dark:text-dark-subtext mb-0.5">Market Dominance</p>
              <p className="text-xs font-medium text-light-text dark:text-dark-text">
                {((selectedToken.market_cap / (selectedToken.total_market_cap || 1)) * 100).toFixed(2)}%
              </p>
            </div>
            <div>
              <p className="text-[0.65rem] text-light-subtext dark:text-dark-subtext mb-0.5">7d Change</p>
              <p className={`text-xs font-medium ${
                (selectedToken.price_change_percentage_7d || 0) >= 0 
                  ? 'text-smaragdine dark:text-smaragdine' 
                  : 'text-red-600 dark:text-red-400'
              }`}>
                {(selectedToken.price_change_percentage_7d || 0) >= 0 ? '+' : ''}
                {(selectedToken.price_change_percentage_7d || 0).toFixed(2)}%
              </p>
            </div>
            <div>
              <p className="text-[0.65rem] text-light-subtext dark:text-dark-subtext mb-0.5">30d Change</p>
              <p className={`text-xs font-medium ${
                (selectedToken.price_change_percentage_30d || 0) >= 0 
                  ? 'text-smaragdine dark:text-smaragdine' 
                  : 'text-red-600 dark:text-red-400'
              }`}>
                {(selectedToken.price_change_percentage_30d || 0) >= 0 ? '+' : ''}
                {(selectedToken.price_change_percentage_30d || 0).toFixed(2)}%
              </p>
            </div>
          </div>
        </div>
        
        {/* Technical Indicators */}
        <div className="bg-light-bg/80 dark:bg-forest/60 rounded-lg p-2 border border-emerald/10 dark:border-emerald/20">
          <h4 className="font-medium text-light-text dark:text-dark-text mb-1.5 flex items-center gap-1 text-xs">
            <TrendingUp size={12} className="text-viridian" />
            Technical Indicators
          </h4>
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <span className="text-[0.65rem] text-light-subtext dark:text-dark-subtext">RSI (14)</span>
              <span className="text-xs font-medium text-light-text dark:text-dark-text">67.8</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[0.65rem] text-light-subtext dark:text-dark-subtext">MACD</span>
              <span className="text-xs font-medium text-smaragdine dark:text-smaragdine">Bullish</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[0.65rem] text-light-subtext dark:text-dark-subtext">MA (50)</span>
              <span className="text-xs font-medium text-light-text dark:text-dark-text">
                {formatPrice(selectedToken.current_price * 0.95)}
              </span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer Section - Fixed */}
      <div className="mt-2 pt-2 border-t border-light-border/10 dark:border-viridian/20">
        <button 
          onClick={handleAIInsights}
          className="w-full py-1.5 mb-1 bg-viridian/20 dark:bg-viridian/20 text-viridian font-semibold rounded-md hover:bg-viridian/30 transition-colors dark:border dark:border-viridian flex items-center justify-center gap-1.5 text-xs"
        >
          <Brain size={12} />
          AI INSIGHTS
        </button>
        <a 
          href={`https://www.coingecko.com/en/coins/${selectedToken.id}`} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-[0.65rem] text-light-subtext dark:text-dark-subtext hover:text-viridian dark:hover:text-viridian flex items-center justify-center gap-0.5 transition-colors"
        >
          View on CoinGecko
          <ExternalLink size={9} />
        </a>
      </div>
    </div>
  );
};