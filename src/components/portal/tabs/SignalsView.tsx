import React, { useState } from 'react';
import { ArrowUp, ArrowDown, AlertCircle, AlertTriangle, Rocket, TrendingUp, TrendingDown, DollarSign, Clock, BadgeCheck, Target, Star } from 'lucide-react';
import { useUser } from '../../../context/UserContext';

// Signal types and interfaces
interface SignalRiskLevel {
  entryPrice: string;
  targetPrice: string;
  stopLoss: string;
  potentialGain: string;
  riskReward: string;
}

interface Signal {
  id: string;
  token: string;
  symbol: string;
  image?: string;
  price: string;
  action: 'BUY' | 'SELL';
  confidence: number;
  timestamp: string;
  timeframe: string;
  analysis: string;
  pnl: {
    daily: number;
    weekly: number;
    monthly: number;
  };
  risk: {
    conservative: SignalRiskLevel;
    moderate: SignalRiskLevel;
    aggressive: SignalRiskLevel;
  };
  success: boolean;
  status: 'ACTIVE' | 'COMPLETED' | 'INVALIDATED';
  userBought?: boolean;
  userAmount?: number;
  userPnl?: number;
}

// Mock data for signals
const MOCK_SIGNALS: Signal[] = [
  {
    id: 'sig-001',
    token: 'Solana',
    symbol: 'SOL',
    image: 'https://assets.coingecko.com/coins/images/4128/large/solana.png',
    price: '$122.45',
    action: 'BUY',
    confidence: 87,
    timestamp: '2025-06-30T08:25:00Z',
    timeframe: '4H',
    analysis: 'Solana is showing strong bullish momentum with increasing volume and positive on-chain metrics. Significant whale accumulation detected in the last 24 hours suggests a potential breakout above the $130 resistance level.',
    pnl: {
      daily: 3.6,
      weekly: 12.5,
      monthly: 28.4
    },
    risk: {
      conservative: {
        entryPrice: '$122.45',
        targetPrice: '$146.94',
        stopLoss: '$110.20',
        potentialGain: '20%',
        riskReward: '2.0'
      },
      moderate: {
        entryPrice: '$122.45',
        targetPrice: '$183.67',
        stopLoss: '$110.20',
        potentialGain: '50%',
        riskReward: '4.1'
      },
      aggressive: {
        entryPrice: '$122.45',
        targetPrice: '$244.90',
        stopLoss: '$110.20',
        potentialGain: '100%',
        riskReward: '8.2'
      }
    },
    success: true,
    status: 'ACTIVE'
  },
  {
    id: 'sig-002',
    token: 'Raydium',
    symbol: 'RAY',
    image: 'https://assets.coingecko.com/coins/images/13928/large/PSigc4ie_400x400.jpg',
    price: '$0.8740',
    action: 'BUY',
    confidence: 73,
    timestamp: '2025-06-30T06:12:00Z',
    timeframe: '1D',
    analysis: 'Raydium is forming a potential reversal pattern at a strong support level. Technical indicators suggest oversold conditions and a potential bounce. Increased DEX volumes indicate growing interest.',
    pnl: {
      daily: -1.2,
      weekly: 8.7,
      monthly: 15.3
    },
    risk: {
      conservative: {
        entryPrice: '$0.8740',
        targetPrice: '$1.0488',
        stopLoss: '$0.8130',
        potentialGain: '20%',
        riskReward: '3.3'
      },
      moderate: {
        entryPrice: '$0.8740',
        targetPrice: '$1.3110',
        stopLoss: '$0.8130',
        potentialGain: '50%',
        riskReward: '8.2'
      },
      aggressive: {
        entryPrice: '$0.8740',
        targetPrice: '$1.7480',
        stopLoss: '$0.8130',
        potentialGain: '100%',
        riskReward: '16.5'
      }
    },
    success: true,
    status: 'ACTIVE'
  },
  {
    id: 'sig-003',
    token: 'Pyth Network',
    symbol: 'PYTH',
    image: 'https://assets.coingecko.com/coins/images/27055/large/pyth-200x200.png',
    price: '$0.5420',
    action: 'BUY',
    confidence: 82,
    timestamp: '2025-06-29T21:45:00Z',
    timeframe: '4H',
    analysis: 'PYTH is breaking out of a consolidation phase with high volume. Recent protocol upgrades and growing adoption as an oracle provider indicate strong fundamentals.',
    pnl: {
      daily: 7.2,
      weekly: 15.4,
      monthly: 24.8
    },
    risk: {
      conservative: {
        entryPrice: '$0.5420',
        targetPrice: '$0.6504',
        stopLoss: '$0.4880',
        potentialGain: '20%',
        riskReward: '2.3'
      },
      moderate: {
        entryPrice: '$0.5420',
        targetPrice: '$0.8130',
        stopLoss: '$0.4880',
        potentialGain: '50%',
        riskReward: '5.9'
      },
      aggressive: {
        entryPrice: '$0.5420',
        targetPrice: '$1.0840',
        stopLoss: '$0.4880',
        potentialGain: '100%',
        riskReward: '11.7'
      }
    },
    success: true,
    status: 'ACTIVE',
    userBought: true,
    userAmount: 1850,
    userPnl: 7.2
  },
  {
    id: 'sig-004',
    token: 'Bonk',
    symbol: 'BONK',
    image: 'https://assets.coingecko.com/coins/images/28600/large/bonk.png',
    price: '$0.00002953',
    action: 'SELL',
    confidence: 65,
    timestamp: '2025-06-29T18:30:00Z',
    timeframe: '1D',
    analysis: 'BONK is showing signs of exhaustion after a strong rally. Social sentiment metrics indicate potential short-term cooling off. Consider taking profits or reducing exposure temporarily.',
    pnl: {
      daily: -2.1,
      weekly: 33.5,
      monthly: 65.7
    },
    risk: {
      conservative: {
        entryPrice: '$0.00002953',
        targetPrice: '$0.00002362',
        stopLoss: '$0.00003100',
        potentialGain: '20%',
        riskReward: '3.4'
      },
      moderate: {
        entryPrice: '$0.00002953',
        targetPrice: '$0.00001476',
        stopLoss: '$0.00003100',
        potentialGain: '50%',
        riskReward: '8.5'
      },
      aggressive: {
        entryPrice: '$0.00002953',
        targetPrice: '$0.00000000',
        stopLoss: '$0.00003100',
        potentialGain: '100%',
        riskReward: '20.7'
      }
    },
    success: false,
    status: 'COMPLETED'
  },
  {
    id: 'sig-005',
    token: 'Jito',
    symbol: 'JTO',
    image: 'https://assets.coingecko.com/coins/images/33969/large/jito.jpeg',
    price: '$3.24',
    action: 'BUY',
    confidence: 78,
    timestamp: '2025-06-29T14:15:00Z',
    timeframe: '12H',
    analysis: 'JTO is forming a bullish pattern after recent protocol upgrades. MEV value captured is increasing, suggesting growing demand for the token in the Solana ecosystem.',
    pnl: {
      daily: 3.8,
      weekly: 9.7,
      monthly: 17.5
    },
    risk: {
      conservative: {
        entryPrice: '$3.24',
        targetPrice: '$3.88',
        stopLoss: '$2.91',
        potentialGain: '20%',
        riskReward: '2.5'
      },
      moderate: {
        entryPrice: '$3.24',
        targetPrice: '$4.86',
        stopLoss: '$2.91',
        potentialGain: '50%',
        riskReward: '6.2'
      },
      aggressive: {
        entryPrice: '$3.24',
        targetPrice: '$6.48',
        stopLoss: '$2.91',
        potentialGain: '100%',
        riskReward: '12.4'
      }
    },
    success: true,
    status: 'ACTIVE',
    userBought: true,
    userAmount: 250,
    userPnl: 3.8
  }
];

export const SignalsView: React.FC = () => {
  const { user } = useUser();
  const [timeFilter, setTimeFilter] = useState<'1D' | '7D' | '30D'>('1D');
  const [activeSignal, setActiveSignal] = useState<Signal>(MOCK_SIGNALS[0]);
  const [selectedRisk, setSelectedRisk] = useState<'conservative' | 'moderate' | 'aggressive'>('moderate');
  const [showTradingForm, setShowTradingForm] = useState(false);
  const [tradeAmount, setTradeAmount] = useState<string>('1000');
  
  // Calculate aggregated PnL data
  const calculatePnL = () => {
    const pnl = {
      daily: 0,
      weekly: 0,
      monthly: 0,
      totalSignals: MOCK_SIGNALS.length,
      successRate: 0
    };
    
    let successCount = 0;
    MOCK_SIGNALS.forEach(signal => {
      pnl.daily += signal.pnl.daily;
      pnl.weekly += signal.pnl.weekly;
      pnl.monthly += signal.pnl.monthly;
      
      if (signal.success) successCount++;
    });
    
    pnl.successRate = (successCount / MOCK_SIGNALS.length) * 100;
    return pnl;
  };
  
  const pnlData = calculatePnL();
  
  // Format time ago
  const formatTimeAgo = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.round(diffMs / 60000);
    
    if (diffMins < 60) {
      return `${diffMins}m ago`;
    } else if (diffMins < 1440) {
      return `${Math.floor(diffMins / 60)}h ago`;
    } else {
      return `${Math.floor(diffMins / 1440)}d ago`;
    }
  };
  
  // Handle buy/sell action
  const handleTradeAction = () => {
    // In a real app, this would call an API to process the trade
    // For now, we'll just update the local state to simulate a successful trade
    setShowTradingForm(false);
    
    // Here we'd typically call an API to record the user's trade
    console.log(`User ${user.id} bought ${tradeAmount} of ${activeSignal.symbol} at ${activeSignal.risk[selectedRisk].entryPrice}`);
  };
  
  // Handle trade amount change
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setTradeAmount(value);
    }
  };
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Performance Overview */}
      <div className="lg:col-span-3 dashboard-card">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-light-text dark:text-dark-text">Trading Signals Performance</h2>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setTimeFilter('1D')}
              className={`px-3 py-1 rounded-md ${timeFilter === '1D' ? 'bg-viridian/20 dark:bg-viridian/30 text-viridian dark:text-viridian dark:border dark:border-viridian/70' : 'text-light-subtext dark:text-dark-subtext'}`}
            >
              Daily
            </button>
            <button 
              onClick={() => setTimeFilter('7D')}
              className={`px-3 py-1 rounded-md ${timeFilter === '7D' ? 'bg-viridian/20 dark:bg-viridian/30 text-viridian dark:text-viridian dark:border dark:border-viridian/70' : 'text-light-subtext dark:text-dark-subtext'}`}
            >
              Weekly
            </button>
            <button 
              onClick={() => setTimeFilter('30D')}
              className={`px-3 py-1 rounded-md ${timeFilter === '30D' ? 'bg-viridian/20 dark:bg-viridian/30 text-viridian dark:text-viridian dark:border dark:border-viridian/70' : 'text-light-subtext dark:text-dark-subtext'}`}
            >
              Monthly
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
          <div className="p-4 rounded-lg bg-light-bg/80 dark:bg-forest/60 border border-emerald/10 dark:border-emerald/20">
            <p className="text-light-subtext dark:text-dark-subtext text-sm mb-1">Daily PnL</p>
            <p className={`text-2xl font-semibold ${pnlData.daily >= 0 ? 'text-lime dark:text-lime' : 'text-red-500 dark:text-red-400'}`}>
              {pnlData.daily >= 0 ? '+' : ''}{pnlData.daily.toFixed(2)}%
            </p>
          </div>
          
          <div className="p-4 rounded-lg bg-light-bg/80 dark:bg-forest/60 border border-emerald/10 dark:border-emerald/20">
            <p className="text-light-subtext dark:text-dark-subtext text-sm mb-1">Weekly PnL</p>
            <p className={`text-2xl font-semibold ${pnlData.weekly >= 0 ? 'text-lime dark:text-lime' : 'text-red-500 dark:text-red-400'}`}>
              {pnlData.weekly >= 0 ? '+' : ''}{pnlData.weekly.toFixed(2)}%
            </p>
          </div>
          
          <div className="p-4 rounded-lg bg-light-bg/80 dark:bg-forest/60 border border-emerald/10 dark:border-emerald/20">
            <p className="text-light-subtext dark:text-dark-subtext text-sm mb-1">Monthly PnL</p>
            <p className={`text-2xl font-semibold ${pnlData.monthly >= 0 ? 'text-lime dark:text-lime' : 'text-red-500 dark:text-red-400'}`}>
              {pnlData.monthly >= 0 ? '+' : ''}{pnlData.monthly.toFixed(2)}%
            </p>
          </div>
          
          <div className="p-4 rounded-lg bg-light-bg/80 dark:bg-forest/60 border border-emerald/10 dark:border-emerald/20">
            <p className="text-light-subtext dark:text-dark-subtext text-sm mb-1">Success Rate</p>
            <p className="text-2xl font-semibold text-lime dark:text-lime">
              {pnlData.successRate.toFixed(1)}%
            </p>
            <p className="text-xs text-light-subtext dark:text-dark-subtext">
              {pnlData.totalSignals} signals total
            </p>
          </div>
        </div>
      </div>
      
      {/* Signals List */}
      <div className="dashboard-card overflow-hidden">
        <h3 className="card-title mb-6 flex items-center gap-2">
          <AlertCircle size={20} className="text-viridian" />
          Latest Trading Signals
        </h3>
        
        <div className="space-y-3 max-h-[700px] overflow-y-auto pr-2">
          {MOCK_SIGNALS.map((signal) => (
            <div 
              key={signal.id}
              className={`p-4 rounded-lg cursor-pointer transition-all duration-200 ${
                activeSignal.id === signal.id 
                  ? 'bg-viridian/10 dark:bg-viridian/20 border border-viridian/30 dark:border-viridian/70' 
                  : 'bg-light-bg/80 dark:bg-forest/60 border border-emerald/10 dark:border-emerald/20 hover:border-viridian/30 dark:hover:border-viridian/50'
              }`}
              onClick={() => setActiveSignal(signal)}
            >
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2">
                  {signal.image ? (
                    <img src={signal.image} alt={signal.symbol} className="w-8 h-8 rounded-full" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-viridian/20 flex items-center justify-center text-xs font-bold text-viridian">
                      {signal.symbol.charAt(0)}
                    </div>
                  )}
                  <div>
                    <div className="flex items-center gap-1">
                      <span className="font-semibold text-light-text dark:text-dark-text">{signal.symbol}</span>
                      {signal.userBought && (
                        <div className="px-1.5 py-0.5 bg-viridian/20 text-viridian text-xs rounded-sm flex items-center">
                          <BadgeCheck size={10} className="mr-1" />
                          BOUGHT
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-light-subtext dark:text-dark-subtext">{signal.token}</p>
                  </div>
                </div>
                <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                  signal.action === 'BUY' 
                    ? 'bg-lime/20 text-lime' 
                    : 'bg-red-500/20 text-red-600 dark:text-red-400'
                }`}>
                  {signal.action}
                </span>
              </div>
              
              <div className="flex justify-between text-sm mb-1">
                <span className="text-light-subtext dark:text-dark-subtext">Price: {signal.price}</span>
                <span className="text-light-subtext dark:text-dark-subtext">
                  <Clock size={12} className="inline mr-1" />
                  {formatTimeAgo(signal.timestamp)}
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <span className="text-xs py-0.5 px-1.5 rounded bg-viridian/10 dark:bg-viridian/20 text-viridian">
                    {signal.timeframe}
                  </span>
                </div>
                <div className="flex items-center">
                  <span className={`text-xs flex items-center ${
                    signal.pnl.daily >= 0 
                      ? 'text-lime dark:text-lime' 
                      : 'text-red-500 dark:text-red-400'
                  }`}>
                    {signal.pnl.daily >= 0 ? (
                      <TrendingUp size={12} className="mr-1" />
                    ) : (
                      <TrendingDown size={12} className="mr-1" />
                    )}
                    {signal.pnl.daily >= 0 ? '+' : ''}{signal.pnl.daily.toFixed(1)}%
                  </span>
                </div>
              </div>
              
              {signal.userBought && (
                <div className="mt-2 pt-2 border-t border-light-border/10 dark:border-viridian/20">
                  <div className="flex justify-between text-xs">
                    <span className="text-light-subtext dark:text-dark-subtext">Your position:</span>
                    <span className="text-light-text dark:text-dark-text">{signal.userAmount} {signal.symbol}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-light-subtext dark:text-dark-subtext">Your PnL:</span>
                    <span className={`${
                      signal.userPnl! >= 0 
                        ? 'text-lime dark:text-lime' 
                        : 'text-red-500 dark:text-red-400'
                    }`}>
                      {signal.userPnl! >= 0 ? '+' : ''}{signal.userPnl!.toFixed(1)}%
                    </span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      
      {/* Signal Detail */}
      <div className="lg:col-span-2 space-y-6">
        {/* Signal Details Card */}
        <div className="dashboard-card">
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center gap-3">
              {activeSignal.image ? (
                <img src={activeSignal.image} alt={activeSignal.symbol} className="w-12 h-12 rounded-full" />
              ) : (
                <div className="w-12 h-12 rounded-full bg-viridian/20 flex items-center justify-center text-lg font-bold text-viridian">
                  {activeSignal.symbol.charAt(0)}
                </div>
              )}
              <div>
                <h3 className="text-2xl font-bold text-light-text dark:text-dark-text flex items-center gap-2">
                  {activeSignal.symbol}
                  <span className={`text-sm px-2 py-0.5 rounded-full ${
                    activeSignal.action === 'BUY' 
                      ? 'bg-lime/20 text-lime' 
                      : 'bg-red-500/20 text-red-600 dark:text-red-400'
                  }`}>
                    {activeSignal.action}
                  </span>
                </h3>
                <p className="text-light-subtext dark:text-dark-subtext">{activeSignal.token}</p>
              </div>
            </div>
            
            <div className="flex flex-col items-end">
              <div className="flex items-center gap-1 mb-1">
                <Star size={16} className="text-yellow-400 fill-yellow-400" />
                <span className="text-light-text dark:text-dark-text font-medium">{activeSignal.confidence}% Confidence</span>
              </div>
              <p className="text-light-subtext dark:text-dark-subtext text-sm flex items-center">
                <Clock size={14} className="mr-1" />
                {formatTimeAgo(activeSignal.timestamp)} · {activeSignal.timeframe} timeframe
              </p>
            </div>
          </div>
          
          <div className="mb-6">
            <h4 className="font-medium text-light-text dark:text-dark-text mb-2">AI Analysis</h4>
            <p className="text-light-subtext dark:text-dark-subtext">
              {activeSignal.analysis}
            </p>
          </div>
          
          <div className="mb-6">
            <h4 className="font-medium text-light-text dark:text-dark-text mb-3">Performance</h4>
            <div className="grid grid-cols-3 gap-4">
              <div className="p-3 rounded-lg bg-light-bg/80 dark:bg-forest/60 border border-emerald/10 dark:border-emerald/20">
                <p className="text-light-subtext dark:text-dark-subtext text-xs mb-1">Daily</p>
                <p className={`text-xl font-semibold ${activeSignal.pnl.daily >= 0 ? 'text-lime dark:text-lime' : 'text-red-500 dark:text-red-400'}`}>
                  {activeSignal.pnl.daily >= 0 ? '+' : ''}{activeSignal.pnl.daily.toFixed(1)}%
                </p>
              </div>
              
              <div className="p-3 rounded-lg bg-light-bg/80 dark:bg-forest/60 border border-emerald/10 dark:border-emerald/20">
                <p className="text-light-subtext dark:text-dark-subtext text-xs mb-1">Weekly</p>
                <p className={`text-xl font-semibold ${activeSignal.pnl.weekly >= 0 ? 'text-lime dark:text-lime' : 'text-red-500 dark:text-red-400'}`}>
                  {activeSignal.pnl.weekly >= 0 ? '+' : ''}{activeSignal.pnl.weekly.toFixed(1)}%
                </p>
              </div>
              
              <div className="p-3 rounded-lg bg-light-bg/80 dark:bg-forest/60 border border-emerald/10 dark:border-emerald/20">
                <p className="text-light-subtext dark:text-dark-subtext text-xs mb-1">Monthly</p>
                <p className={`text-xl font-semibold ${activeSignal.pnl.monthly >= 0 ? 'text-lime dark:text-lime' : 'text-red-500 dark:text-red-400'}`}>
                  {activeSignal.pnl.monthly >= 0 ? '+' : ''}{activeSignal.pnl.monthly.toFixed(1)}%
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Risk Levels Card */}
        <div className="dashboard-card">
          <h3 className="card-title mb-6 flex items-center gap-2">
            <Target size={20} className="text-viridian" />
            Entry & Exit Targets
          </h3>
          
          {!showTradingForm ? (
            <>
              <div className="flex items-center gap-4 mb-8">
                <button 
                  onClick={() => setSelectedRisk('conservative')}
                  className={`flex-1 p-4 text-center rounded-lg border ${
                    selectedRisk === 'conservative' 
                      ? 'bg-viridian/10 dark:bg-viridian/20 border-viridian text-viridian dark:border-viridian' 
                      : 'border-light-border/10 dark:border-dark-border/30'
                  }`}
                >
                  <div className="text-base font-medium mb-1">Conservative</div>
                  <div className="text-sm text-light-subtext dark:text-dark-subtext">20% Gain</div>
                </button>
                
                <button 
                  onClick={() => setSelectedRisk('moderate')}
                  className={`flex-1 p-4 text-center rounded-lg border ${
                    selectedRisk === 'moderate' 
                      ? 'bg-viridian/10 dark:bg-viridian/20 border-viridian text-viridian dark:border-viridian' 
                      : 'border-light-border/10 dark:border-dark-border/30'
                  }`}
                >
                  <div className="text-base font-medium mb-1">Moderate</div>
                  <div className="text-sm text-light-subtext dark:text-dark-subtext">50% Gain</div>
                </button>
                
                <button 
                  onClick={() => setSelectedRisk('aggressive')}
                  className={`flex-1 p-4 text-center rounded-lg border ${
                    selectedRisk === 'aggressive' 
                      ? 'bg-viridian/10 dark:bg-viridian/20 border-viridian text-viridian dark:border-viridian' 
                      : 'border-light-border/10 dark:border-dark-border/30'
                  }`}
                >
                  <div className="text-base font-medium mb-1">XBT Full Send</div>
                  <div className="text-sm text-light-subtext dark:text-dark-subtext">100% Gain</div>
                </button>
              </div>
              
              <div className="bg-light-bg/80 dark:bg-forest/60 rounded-lg p-6 mb-8">
                <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                  <div>
                    <p className="text-sm text-light-subtext dark:text-dark-subtext mb-1">Entry Price</p>
                    <p className="text-xl text-light-text dark:text-dark-text font-medium">
                      {activeSignal.risk[selectedRisk].entryPrice}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-light-subtext dark:text-dark-subtext mb-1">Target Price</p>
                    <p className="text-xl text-lime dark:text-lime font-medium">
                      {activeSignal.risk[selectedRisk].targetPrice}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-light-subtext dark:text-dark-subtext mb-1">Stop Loss</p>
                    <p className="text-xl text-red-500 dark:text-red-400 font-medium">
                      {activeSignal.risk[selectedRisk].stopLoss}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-light-subtext dark:text-dark-subtext mb-1">Potential Gain</p>
                    <p className="text-xl text-lime dark:text-lime font-medium">
                      {activeSignal.risk[selectedRisk].potentialGain}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-light-subtext dark:text-dark-subtext mb-1">Risk/Reward Ratio</p>
                    <p className="text-xl text-light-text dark:text-dark-text font-medium">
                      {activeSignal.risk[selectedRisk].riskReward}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-light-subtext dark:text-dark-subtext mb-1">Timeframe</p>
                    <p className="text-xl text-light-text dark:text-dark-text font-medium">
                      {activeSignal.timeframe}
                    </p>
                  </div>
                </div>
              </div>
              
              {activeSignal.userBought ? (
                <div className="bg-viridian/10 dark:bg-viridian/20 rounded-lg p-6 border border-viridian/30 dark:border-viridian/40 mb-2">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-medium text-viridian dark:text-viridian flex items-center gap-2">
                      <BadgeCheck size={18} />
                      Your Position
                    </h4>
                    <div className="px-2 py-0.5 bg-viridian/20 dark:bg-viridian/30 rounded text-xs text-viridian">
                      ACTIVE
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-x-4 gap-y-3 mb-6">
                    <div>
                      <p className="text-xs text-viridian/70 dark:text-viridian/70 mb-1">Amount</p>
                      <p className="text-light-text dark:text-dark-text font-medium">
                        {activeSignal.userAmount} {activeSignal.symbol}
                      </p>
                    </div>
                    
                    <div>
                      <p className="text-xs text-viridian/70 dark:text-viridian/70 mb-1">Entry Price</p>
                      <p className="text-light-text dark:text-dark-text font-medium">
                        {activeSignal.risk[selectedRisk].entryPrice}
                      </p>
                    </div>
                    
                    <div>
                      <p className="text-xs text-viridian/70 dark:text-viridian/70 mb-1">Current PnL</p>
                      <p className={`font-medium ${
                        activeSignal.userPnl! >= 0 
                          ? 'text-lime dark:text-lime' 
                          : 'text-red-500 dark:text-red-400'
                      }`}>
                        {activeSignal.userPnl! >= 0 ? '+' : ''}{activeSignal.userPnl!.toFixed(2)}%
                      </p>
                    </div>
                    
                    <div>
                      <p className="text-xs text-viridian/70 dark:text-viridian/70 mb-1">Risk Level</p>
                      <p className="text-light-text dark:text-dark-text font-medium capitalize">
                        {selectedRisk}
                      </p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <button className="secondary-btn py-3">
                      INCREASE POSITION
                    </button>
                    <button className="primary-btn py-3">
                      CLOSE POSITION
                    </button>
                  </div>
                </div>
              ) : (
                <button 
                  className="primary-btn w-full py-4 flex items-center justify-center gap-2 text-base mt-2"
                  onClick={() => setShowTradingForm(true)}
                >
                  {activeSignal.action === 'BUY' ? (
                    <>
                      <ArrowUp size={20} />
                      BUY {activeSignal.symbol} NOW
                    </>
                  ) : (
                    <>
                      <ArrowDown size={20} />
                      SELL {activeSignal.symbol} NOW
                    </>
                  )}
                </button>
              )}
            </>
          ) : (
            <div className="space-y-4">
              <h4 className="font-medium text-light-text dark:text-dark-text">
                {activeSignal.action === 'BUY' ? 'Buy' : 'Sell'} {activeSignal.symbol} ({activeSignal.risk[selectedRisk].potentialGain} potential gain)
              </h4>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-light-subtext dark:text-dark-subtext block mb-2">
                    Enter {activeSignal.action === 'BUY' ? 'buy' : 'sell'} amount:
                  </label>
                  
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-light-subtext dark:text-dark-subtext">
                      <DollarSign size={18} />
                    </div>
                    <input
                      type="text"
                      value={tradeAmount}
                      onChange={handleAmountChange}
                      className="w-full bg-light-bg/90 dark:bg-dark-bg/90 border border-light-border/20 dark:border-viridian/40 rounded-lg py-3 pl-10 pr-4 text-light-text dark:text-dark-text focus:outline-none focus:border-viridian/40 dark:focus:border-viridian/70"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-x-4 gap-y-3 bg-light-bg/80 dark:bg-forest/60 rounded-lg p-5 mb-3">
                  <div>
                    <p className="text-xs text-light-subtext dark:text-dark-subtext mb-1">Entry Price</p>
                    <p className="text-light-text dark:text-dark-text font-medium">
                      {activeSignal.risk[selectedRisk].entryPrice}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-xs text-light-subtext dark:text-dark-subtext mb-1">Target Price</p>
                    <p className="text-lime dark:text-lime font-medium">
                      {activeSignal.risk[selectedRisk].targetPrice}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-xs text-light-subtext dark:text-dark-subtext mb-1">Stop Loss</p>
                    <p className="text-red-500 dark:text-red-400 font-medium">
                      {activeSignal.risk[selectedRisk].stopLoss}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-xs text-light-subtext dark:text-dark-subtext mb-1">Risk Level</p>
                    <p className="text-light-text dark:text-dark-text font-medium capitalize">
                      {selectedRisk}
                    </p>
                  </div>
                </div>
                
                <p className="text-xs text-light-subtext dark:text-dark-subtext mb-2">
                  Note: By executing this trade, you confirm that you understand the risks involved and are following the trade signal as recommended by the AI.
                </p>
                
                <div className="grid grid-cols-2 gap-4 pt-2">
                  <button 
                    className="secondary-btn py-3"
                    onClick={() => setShowTradingForm(false)}
                  >
                    CANCEL
                  </button>
                  
                  <button 
                    className="primary-btn py-3"
                    onClick={handleTradeAction}
                  >
                    CONFIRM {activeSignal.action}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};