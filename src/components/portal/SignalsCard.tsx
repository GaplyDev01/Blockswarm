import React, { useState, useEffect } from 'react';
import { ArrowRight, DollarSign, TrendingUp, TrendingDown, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { coinGeckoAPI } from '../../services/api';

interface TokenSignal {
  id: string;
  name: string;
  symbol: string;
  image: string;
  current_price: number;
  market_cap: number;
  price_change_percentage_30m: number;
  price_change_percentage_24h: number;
  last_updated: string;
  confidence_score: number;
  type: 'AI' | 'MEME' | 'DEFI';
  entry_price: number;
  target_price: number;
  stop_loss: number;
  risk_reward: number;
}

export const SignalsCard: React.FC = () => {
  const navigate = useNavigate();
  const [signals, setSignals] = useState<TokenSignal[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  
  // Format market cap
  const formatMarketCap = (marketCap: number) => {
    if (marketCap >= 1e9) return `$${(marketCap / 1e9).toFixed(2)}B`;
    if (marketCap >= 1e6) return `$${(marketCap / 1e6).toFixed(2)}M`;
    return `$${(marketCap / 1e3).toFixed(2)}K`;
  };

  // Calculate 30-minute price change
  const calculate30MinChange = (prices: [number, number][]) => {
    if (prices.length < 2) return 0;
    const currentPrice = prices[prices.length - 1][1];
    const thirtyMinAgo = prices[prices.length - 30]?.[1] || prices[0][1];
    return ((currentPrice - thirtyMinAgo) / thirtyMinAgo) * 100;
  };

  // Calculate confidence score based on various metrics
  const calculateConfidence = (token: any) => {
    let score = 50; // Base score
    
    if (!token) return score;

    // Volume/Market cap ratio impact
    const volumeMarketCapRatio = (token.total_volume || 0) / (token.market_cap || 1);
    score += volumeMarketCapRatio * 100; // Adjust weight as needed

    // Price momentum
    if (token.price_change_percentage_24h > 0) {
      score += 10;
    }

    // Market cap ranking impact
    if (token.market_cap_rank < 100) {
      score += 10;
    }

    // Cap the score between 0 and 100
    return Math.min(Math.max(Math.round(score), 0), 100);
  };

  // Calculate optimal entry and exit points
  const calculateTradingPoints = (token: any) => {
    if (!token || !token.current_price) {
      return {
        entry_price: 0,
        target_price: 0,
        stop_loss: 0,
        risk_reward: 0
      };
    }

    const currentPrice = token.current_price;
    const volatility = Math.abs(token.price_change_percentage_24h || 0) / 100;
    
    // Entry price slightly below current price for better entry
    const entryPrice = currentPrice * (1 - volatility * 0.2);
    
    // Target price based on historical performance and volatility
    const targetPrice = currentPrice * (1 + volatility * 2);
    
    // Stop loss with reasonable buffer
    const stopLoss = entryPrice * (1 - volatility);
    
    // Calculate risk/reward ratio
    const potentialGain = targetPrice - entryPrice;
    const potentialLoss = entryPrice - stopLoss;
    const riskReward = potentialLoss === 0 ? 0 : potentialGain / potentialLoss;
    
    return {
      entry_price: entryPrice,
      target_price: targetPrice,
      stop_loss: stopLoss,
      risk_reward: riskReward
    };
  };

  // Fetch trading signals
  useEffect(() => {
    const fetchSignals = async () => {
      setLoading(true);
      setError(null);

      try {
        // Get different types of tokens
        const aiTokens = ['solana', 'pyth-network', 'render-token'];
        const memeTokens = ['bonk', 'samoyedcoin'];
        const defiTokens = ['raydium', 'marinade-staked-sol', 'jito-staked-sol'];
        
        const allTokens = [...aiTokens, ...memeTokens, ...defiTokens];
        
        // Get detailed market data
        const marketData = await coinGeckoAPI.getMarketData(allTokens);
        
        // Process and transform the data
        const signalData: TokenSignal[] = marketData.map((token: any) => {
          const tradingPoints = calculateTradingPoints(token);
          const type = aiTokens.includes(token.id) ? 'AI' :
                      memeTokens.includes(token.id) ? 'MEME' : 'DEFI';
          
          return {
            id: token.id,
            name: token.name,
            symbol: token.symbol.toUpperCase(),
            image: token.image,
            current_price: token.current_price,
            market_cap: token.market_cap,
            price_change_percentage_30m: token.sparkline_in_7d?.price 
              ? calculate30MinChange(token.sparkline_in_7d.price)
              : 0,
            price_change_percentage_24h: token.price_change_percentage_24h,
            last_updated: token.last_updated,
            confidence_score: calculateConfidence(token),
            type,
            ...tradingPoints
          };
        });
        
        setSignals(signalData);
        setLastUpdate(new Date());
      } catch (err) {
        console.error('Error fetching signals:', err);
        setError('Failed to load trading signals');
      } finally {
        setLoading(false);
      }
    };
    
    fetchSignals();
    
    // Refresh every 5 minutes
    const interval = setInterval(fetchSignals, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);
  
  const handleViewAllSignals = () => {
    // Navigate to the signals tab
    navigate('/portal?tab=signals');
  };
  
  return (
    <div className="dashboard-card flex flex-col h-full">
      <div className="flex justify-between items-center mb-3">
        <h3 className="card-title">Latest Trading Signals</h3>
        <div className="flex items-center gap-1.5">
          <span className="card-label flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-lime rounded-full animate-pulse"></span>
            LIVE
          </span>
          <span className="text-xs text-light-subtext dark:text-dark-subtext">
            Updated {Math.round((new Date().getTime() - lastUpdate.getTime()) / 1000 / 60)}m ago
          </span>
        </div>
      </div>
      
      <div className="space-y-2.5 mb-3 flex-grow dashboard-card-content">
        {loading ? (
          <div className="flex justify-center items-center py-4">
            <div className="w-5 h-5 border-2 border-viridian border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : error ? (
          <div className="p-2.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
            {error}
          </div>
        ) : (
          signals.map((signal) => (
            <div
              key={signal.id}
              className="p-3 rounded-lg bg-light-bg/80 dark:bg-forest/60 border border-emerald/10 dark:border-emerald/20"
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                  <img 
                    src={signal.image} 
                    alt={signal.name}
                    className="w-8 h-8 rounded-full"
                  />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="font-semibold text-light-text dark:text-dark-text text-sm">
                        {signal.symbol}
                      </h4>
                      <span className={`text-xs px-1.5 py-0.5 rounded ${
                        signal.type === 'AI' ? 'bg-viridian/20 text-viridian' :
                        signal.type === 'MEME' ? 'bg-pink-500/20 text-pink-500' :
                        'bg-blue-500/20 text-blue-500'
                      }`}>
                        {signal.type}
                      </span>
                      <span className={`text-xs ${
                        signal.price_change_percentage_30m >= 0 
                          ? 'text-lime dark:text-lime' 
                          : 'text-red-500 dark:text-red-400'
                      }`}>
                        {signal.price_change_percentage_30m >= 0 ? '+' : ''}
                        {signal.price_change_percentage_30m.toFixed(2)}% (30m)
                      </span>
                    </div>
                    <p className="text-xs text-light-subtext dark:text-dark-subtext">
                      {formatMarketCap(signal.market_cap)}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-light-text dark:text-dark-text text-sm">
                    ${signal.current_price.toLocaleString()}
                  </p>
                  <p className={`text-xs ${
                    signal.price_change_percentage_24h >= 0 
                      ? 'text-lime dark:text-lime' 
                      : 'text-red-500 dark:text-red-400'
                  }`}>
                    24h: {signal.price_change_percentage_24h >= 0 ? '+' : ''}
                    {signal.price_change_percentage_24h.toFixed(2)}%
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-4 gap-1.5 mb-2 text-[0.65rem]">
                <div className="p-1.5 rounded bg-light-bg/50 dark:bg-dark-bg/50">
                  <p className="text-light-subtext dark:text-dark-subtext mb-0.5">Entry</p>
                  <p className="font-medium text-light-text dark:text-dark-text">
                    ${signal.entry_price.toFixed(4)}
                  </p>
                </div>
                <div className="p-1.5 rounded bg-light-bg/50 dark:bg-dark-bg/50">
                  <p className="text-light-subtext dark:text-dark-subtext mb-0.5">Target</p>
                  <p className="font-medium text-lime dark:text-lime">
                    ${signal.target_price.toFixed(4)}
                  </p>
                </div>
                <div className="p-1.5 rounded bg-light-bg/50 dark:bg-dark-bg/50">
                  <p className="text-light-subtext dark:text-dark-subtext mb-0.5">Stop Loss</p>
                  <p className="font-medium text-red-500 dark:text-red-400">
                    ${signal.stop_loss.toFixed(4)}
                  </p>
                </div>
                <div className="p-1.5 rounded bg-light-bg/50 dark:bg-dark-bg/50">
                  <p className="text-light-subtext dark:text-dark-subtext mb-0.5">R/R Ratio</p>
                  <p className="font-medium text-light-text dark:text-dark-text">
                    {signal.risk_reward.toFixed(2)}
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <div className={`px-1.5 py-0.5 rounded text-[0.65rem] font-medium ${
                    signal.confidence_score >= 70 
                      ? 'bg-lime/20 text-lime' 
                      : signal.confidence_score >= 50
                        ? 'bg-yellow-500/20 text-yellow-500'
                        : 'bg-red-500/20 text-red-500'
                  }`}>
                    {signal.confidence_score}% Confidence
                  </div>
                  <span className="text-[0.65rem] text-light-subtext dark:text-dark-subtext">
                    Updated {new Date(signal.last_updated).toLocaleTimeString()}
                  </span>
                </div>
                <button className="px-2 py-1 bg-viridian/20 text-viridian rounded-md text-[0.65rem] font-medium hover:bg-viridian/30 transition-colors">
                  BUY {signal.symbol}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
      
      <button 
        className="secondary-btn w-full flex items-center justify-center gap-1.5 mt-auto text-xs"
        onClick={handleViewAllSignals}
      >
        VIEW ALL SIGNALS
        <ArrowRight size={14} />
      </button>
    </div>
  );
};