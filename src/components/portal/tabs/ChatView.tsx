import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChatWithAgent } from '../ChatWithAgent';
import { 
  Search, 
  Bot, 
  Settings, 
  ChevronRight, 
  ChevronLeft, 
  BarChart2, 
  TrendingUp, 
  TrendingDown, 
  AlertCircle, 
  Layers,
  LineChart, 
  CandlestickChart as Candlestick, 
  Activity, 
  Gauge, 
  Clock, 
  Zap,
  BookOpen, 
  Newspaper, 
  MessageSquare, 
  Layout, 
  Eye, 
  EyeOff, 
  Move,
  Bell,
  Star,
  X,
  Loader2
} from 'lucide-react';
import { useAI } from '../../../context/AIContext';
import { useToken } from '../../../context/TokenContext';
import { coinGeckoAPI } from '../../../services/api';
import { useDebounce } from '../../../hooks/useDebounce';
import type { CoinGeckoSearchCoin, TokenData } from '../../../types';

// Import all the tool components
import { ChartTool } from '../tools/ChartTool';
import { NewsFeedTool } from '../tools/NewsFeedTool';
import { TechnicalIndicatorsTool } from '../tools/TechnicalIndicatorsTool';
import { VolumeProfileTool } from '../tools/VolumeProfileTool';
import { OrderFlowTool } from '../tools/OrderFlowTool';
import { LiquidityTool } from '../tools/LiquidityTool';
import { MomentumTool } from '../tools/MomentumTool';
import { PatternAlertsTool } from '../tools/PatternAlertsTool';
import { TradingViewTool } from '../tools/TradingViewTool';
import { MarketDepthTool } from '../tools/MarketDepthTool';
import { SocialFeedTool } from '../tools/SocialFeedTool';

interface SidebarTool {
  id: string;
  name: string;
  icon: React.ReactNode;
  category: 'analysis' | 'charts' | 'news' | 'alerts';
  visible: boolean;
}

type SentimentRating = 'BEARISH' | 'DYOR' | 'BULLISH' | 'APE IN' | null;

export const ChatView: React.FC = () => {
  const navigate = useNavigate();
  const { useDirectAnthropicAPI, setUseDirectAnthropicAPI, addUserMessage, chatHistory, directChatHistory } = useAI();
  const { setSelectedToken, selectTokenById } = useToken();
  
  // Panel visibility and sizing
  const [leftPanelEnabled, setLeftPanelEnabled] = useState<boolean>(true);
  const [rightPanelEnabled, setRightPanelEnabled] = useState<boolean>(true);
  const [leftPanelCollapsed, setLeftPanelCollapsed] = useState<boolean>(false);
  const [rightPanelCollapsed, setRightPanelCollapsed] = useState<boolean>(false);
  const [leftPanelWidth, setLeftPanelWidth] = useState<number>(260); // Default width in pixels
  const [rightPanelWidth, setRightPanelWidth] = useState<number>(260); // Default width in pixels
  
  // Sentiment tracking
  const [currentSentiment, setCurrentSentiment] = useState<SentimentRating>(null);
  const [sentimentScore, setSentimentScore] = useState<number | null>(null);
  
  // Resizing state
  const [isResizingLeft, setIsResizingLeft] = useState<boolean>(false);
  const [isResizingRight, setIsResizingRight] = useState<boolean>(false);
  const resizeStartXRef = useRef<number>(0);
  const initialWidthRef = useRef<number>(0);
  
  // Other UI state
  const [showCustomizeModal, setShowCustomizeModal] = useState<boolean>(false);
  const [showSettingsModal, setShowSettingsModal] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [searchResults, setSearchResults] = useState<CoinGeckoSearchCoin[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showResults, setShowResults] = useState<boolean>(false);
  const [tokenLoading, setTokenLoading] = useState<boolean>(false);
  
  const menuRef = useRef<HTMLDivElement>(null);
  const settingsMenuRef = useRef<HTMLDivElement>(null);
  
  const [sidebarTools, setSidebarTools] = useState<SidebarTool[]>([
    { id: 'price-chart', name: 'Price Chart', icon: <LineChart size={18} />, category: 'charts', visible: true },
    { id: 'trading-view', name: 'TradingView', icon: <Candlestick size={18} />, category: 'charts', visible: true },
    { id: 'indicators', name: 'Technical Indicators', icon: <Activity size={18} />, category: 'analysis', visible: true },
    { id: 'volume-profile', name: 'Volume Profile', icon: <BarChart2 size={18} />, category: 'analysis', visible: true },
    { id: 'momentum', name: 'Momentum Scanner', icon: <Gauge size={18} />, category: 'analysis', visible: true },
    { id: 'market-depth', name: 'Market Depth', icon: <Layers size={18} />, category: 'analysis', visible: true },
    { id: 'order-flow', name: 'Order Flow', icon: <TrendingUp size={18} />, category: 'analysis', visible: true },
    { id: 'liquidity', name: 'Liquidity Analysis', icon: <Zap size={18} />, category: 'analysis', visible: true },
    { id: 'news-feed', name: 'News Feed', icon: <Newspaper size={18} />, category: 'news', visible: true },
    { id: 'social-feed', name: 'Social Sentiment', icon: <MessageSquare size={18} />, category: 'news', visible: true },
    { id: 'research', name: 'Research Reports', icon: <BookOpen size={18} />, category: 'news', visible: true },
    { id: 'price-alerts', name: 'Price Alerts', icon: <Bell size={18} />, category: 'alerts', visible: true },
    { id: 'pattern-alerts', name: 'Pattern Alerts', icon: <Star size={18} />, category: 'alerts', visible: true },
    { id: 'volume-alerts', name: 'Volume Alerts', icon: <Activity size={18} />, category: 'alerts', visible: true },
  ]);
  
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  
  // Extract sentiment from AI responses
  useEffect(() => {
    const extractSentiment = () => {
      let messages;
      if (useDirectAnthropicAPI) {
        messages = directChatHistory;
      } else {
        messages = chatHistory;
      }
      
      if (!messages || messages.length === 0) return;
      
      // Get the latest assistant message
      let latestMessage;
      if (useDirectAnthropicAPI) {
        latestMessage = [...messages]
          .reverse()
          .find(msg => msg.role === 'assistant')?.content;
      } else {
        latestMessage = [...messages]
          .reverse()
          .find(msg => msg._getType && msg._getType() === 'ai')?.content;
      }
      
      if (!latestMessage) return;
      
      // Extract sentiment score using regex
      const scoreMatch = latestMessage.toString().match(/Sentiment Score: (\d+)\/100/i);
      if (scoreMatch && scoreMatch[1]) {
        const score = parseInt(scoreMatch[1]);
        setSentimentScore(score);
        
        // Determine sentiment rating
        if (score <= 35) {
          setCurrentSentiment('BEARISH');
        } else if (score <= 66) {
          setCurrentSentiment('DYOR');
        } else {
          setCurrentSentiment('BULLISH');
        }
        
        // Check for APE IN signal
        if (score > 65 && latestMessage.toString().includes('APE IN SIGNAL')) {
          setCurrentSentiment('APE IN');
        }
      }
    };
    
    extractSentiment();
  }, [chatHistory, directChatHistory, useDirectAnthropicAPI]);
  
  // Load preferences from localStorage on component mount
  useEffect(() => {
    const savedLeftEnabled = localStorage.getItem('leftPanelEnabled');
    const savedRightEnabled = localStorage.getItem('rightPanelEnabled');
    const savedLeftWidth = localStorage.getItem('leftPanelWidth');
    const savedRightWidth = localStorage.getItem('rightPanelWidth');
    
    if (savedLeftEnabled !== null) {
      setLeftPanelEnabled(savedLeftEnabled === 'true');
    }
    
    if (savedRightEnabled !== null) {
      setRightPanelEnabled(savedRightEnabled === 'true');
    }
    
    if (savedLeftWidth !== null) {
      const width = parseInt(savedLeftWidth);
      if (!isNaN(width) && width >= 200 && width <= 600) {
        setLeftPanelWidth(width);
      }
    }
    
    if (savedRightWidth !== null) {
      const width = parseInt(savedRightWidth);
      if (!isNaN(width) && width >= 200 && width <= 600) {
        setRightPanelWidth(width);
      }
    }
  }, []);
  
  // Save preferences to localStorage when they change
  useEffect(() => {
    localStorage.setItem('leftPanelEnabled', String(leftPanelEnabled));
    localStorage.setItem('rightPanelEnabled', String(rightPanelEnabled));
    localStorage.setItem('leftPanelWidth', String(leftPanelWidth));
    localStorage.setItem('rightPanelWidth', String(rightPanelWidth));
  }, [leftPanelEnabled, rightPanelEnabled, leftPanelWidth, rightPanelWidth]);
  
  // Handle left panel resize
  const startLeftResize = (e: React.MouseEvent) => {
    setIsResizingLeft(true);
    resizeStartXRef.current = e.clientX;
    initialWidthRef.current = leftPanelWidth;
    document.body.style.cursor = 'ew-resize';
    document.body.style.userSelect = 'none';
  };
  
  // Handle right panel resize
  const startRightResize = (e: React.MouseEvent) => {
    setIsResizingRight(true);
    resizeStartXRef.current = e.clientX;
    initialWidthRef.current = rightPanelWidth;
    document.body.style.cursor = 'ew-resize';
    document.body.style.userSelect = 'none';
  };
  
  // Handle mouse move for resizing
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isResizingLeft) {
        const delta = e.clientX - resizeStartXRef.current;
        const newWidth = Math.max(200, Math.min(600, initialWidthRef.current + delta));
        setLeftPanelWidth(newWidth);
      } else if (isResizingRight) {
        const delta = resizeStartXRef.current - e.clientX;
        const newWidth = Math.max(200, Math.min(600, initialWidthRef.current + delta));
        setRightPanelWidth(newWidth);
      }
    };
    
    const handleMouseUp = () => {
      if (isResizingLeft || isResizingRight) {
        setIsResizingLeft(false);
        setIsResizingRight(false);
        document.body.style.cursor = 'default';
        document.body.style.userSelect = 'auto';
      }
    };
    
    if (isResizingLeft || isResizingRight) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizingLeft, isResizingRight]);
  
  // Handle toggling both panels
  const toggleBothPanels = () => {
    if (leftPanelEnabled || rightPanelEnabled) {
      setLeftPanelEnabled(false);
      setRightPanelEnabled(false);
    } else {
      setLeftPanelEnabled(true);
      setRightPanelEnabled(true);
    }
  };

  useEffect(() => {
    const searchCoins = async () => {
      if (!debouncedSearchTerm) {
        setSearchResults([]);
        setShowResults(false);
        return;
      }
      
      setLoading(true);
      setError(null);
      
      try {
        const searchData = await coinGeckoAPI.searchCoins(debouncedSearchTerm);
        setSearchResults(searchData.coins.slice(0, 6));
        setShowResults(true);
      } catch (err) {
        console.error('Search error:', err);
        setError('Failed to search tokens');
      } finally {
        setLoading(false);
      }
    };
    
    searchCoins();
  }, [debouncedSearchTerm]);

  const toggleToolVisibility = (toolId: string) => {
    setSidebarTools(prev => 
      prev.map(tool => 
        tool.id === toolId ? { ...tool, visible: !tool.visible } : tool
      )
    );
  };

  const handleTitleClick = () => {
    navigate('/portal?tab=dashboard');
  };

  // Render sentiment indicator with neon effect
  const renderSentimentIndicator = useCallback(() => {
    if (!currentSentiment || !sentimentScore) return null;
    
    let bgColor = '';
    let textColor = '';
    let shadowColor = '';
    let emoji = '';
    
    switch(currentSentiment) {
      case 'BEARISH':
        bgColor = 'bg-red-600/20';
        textColor = 'text-red-500';
        shadowColor = 'rgba(239, 68, 68, 1)';
        emoji = '🔴';
        break;
      case 'DYOR':
        bgColor = 'bg-yellow-500/20';
        textColor = 'text-yellow-300';
        shadowColor = 'rgba(252, 211, 77, 1)';
        emoji = '🟡';
        break;
      case 'BULLISH':
        bgColor = 'bg-green-500/20';
        textColor = 'text-green-400';
        shadowColor = 'rgba(161, 206, 63, 1)';
        emoji = '🟢';
        break;
      case 'APE IN':
        bgColor = 'bg-purple-500/20';
        textColor = 'text-purple-300';
        shadowColor = 'rgba(168, 85, 247, 1)';
        emoji = '🚀';
        break;
    }
    
    return (
      <div 
        className={`px-4 py-2 rounded-full ${bgColor} flex items-center gap-2 ml-4 neon-sentiment-indicator`}
        style={{
          boxShadow: `0 0 10px ${shadowColor}, 0 0 20px ${shadowColor}`,
          border: `1px solid ${shadowColor}`,
          animation: 'neon-pulse 1.5s infinite alternate'
        }}
      >
        <span 
          className={`font-bold text-lg ${textColor}`} 
          style={{
            textShadow: `0 0 5px ${shadowColor}, 0 0 10px ${shadowColor}, 0 0 15px ${shadowColor}`,
          }}
        >
          {currentSentiment} {emoji}
        </span>
        <span 
          className={`text-sm ${textColor} opacity-90`}
          style={{
            textShadow: `0 0 5px ${shadowColor}`
          }}
        >
          {sentimentScore}/100
        </span>
      </div>
    );
  }, [currentSentiment, sentimentScore]);

  // Handle token selection and initiate AI conversation
  const handleTokenSelect = async (coin: CoinGeckoSearchCoin) => {
    try {
      setTokenLoading(true);
      
      // First fetch full token market data to get price and stats
      await selectTokenById(coin.id);
      
      // Fetch the market data directly to construct the AI message
      const marketData = await coinGeckoAPI.getMarketData([coin.id]);
      
      if (marketData && marketData.length > 0) {
        const token = marketData[0];
        
        // Update UI with token data
        setSelectedToken({
          id: token.id,
          symbol: token.symbol.toUpperCase(),
          name: token.name,
          image: token.image,
          current_price: token.current_price || 0,
          market_cap: token.market_cap || 0,
          price_change_percentage_24h: token.price_change_percentage_24h || 0
        });
        
        // Format a detailed message for the AI with all available data
        const initialMessage = `Analyze ${token.name} (${token.symbol.toUpperCase()}) for me. 
Current price: $${token.current_price?.toLocaleString() || 'N/A'}
24h change: ${token.price_change_percentage_24h?.toFixed(2) || 'N/A'}%
Market cap: $${token.market_cap?.toLocaleString() || 'N/A'}
Volume (24h): $${token.total_volume?.toLocaleString() || 'N/A'}
Circulating supply: ${token.circulating_supply?.toLocaleString() || 'N/A'} ${token.symbol.toUpperCase()}
${token.ath ? `All-time high: $${token.ath.toLocaleString()}` : ''}
${token.atl ? `All-time low: $${token.atl.toLocaleString()}` : ''}

Please provide a detailed analysis including:
1. Current market sentiment based on 5min, 15min, and 30min volume and market cap data
2. Technical analysis with key indicators (RSI, MACD, moving averages)
3. Support and resistance levels
4. Potential trading opportunities and risks
5. Short-term price forecast
6. Momentum sentiment score (0-100) 
7. Your recommendation (BEARISH, DYOR, or BULLISH)`;
        
        // Send message to AI
        await addUserMessage(initialMessage);
      } else {
        // Fallback if we couldn't get market data
        const message = `Analyze ${coin.name} (${coin.symbol.toUpperCase()}) for me. What's your assessment of this token and its current market conditions?`;
        await addUserMessage(message);
      }
      
      // Clear search
      setSearchTerm('');
      setSearchResults([]);
      setShowResults(false);
      
    } catch (err) {
      console.error('Error fetching token details:', err);
      // Even on error, still try to initiate a chat about the token with basic info
      const fallbackMessage = `Analyze ${coin.name} (${coin.symbol.toUpperCase()}) for me. What can you tell me about this token?`;
      await addUserMessage(fallbackMessage);
    } finally {
      setTokenLoading(false);
    }
  };

  // Handle clicks outside the customize modal
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowCustomizeModal(false);
      }
      if (settingsMenuRef.current && !settingsMenuRef.current.contains(event.target as Node)) {
        setShowSettingsModal(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const getSideTools = (side: 'left' | 'right') => {
    const categories = side === 'left' 
      ? ['analysis', 'charts'] 
      : ['news', 'alerts'];
    
    return sidebarTools.filter(tool => 
      tool.visible && categories.includes(tool.category)
    );
  };

  // Render the appropriate tool component based on the tool id
  const renderToolComponent = (toolId: string) => {
    switch (toolId) {
      case 'price-chart':
        return <ChartTool />;
      case 'trading-view':
        return <TradingViewTool symbol="SOLUSDT" />;
      case 'indicators':
        return <TechnicalIndicatorsTool />;
      case 'volume-profile':
        return <VolumeProfileTool />;
      case 'momentum':
        return <MomentumTool />;
      case 'market-depth':
        return <MarketDepthTool />;
      case 'order-flow':
        return <OrderFlowTool />;
      case 'liquidity':
        return <LiquidityTool />;
      case 'news-feed':
        return <NewsFeedTool />;
      case 'social-feed':
        return <SocialFeedTool />;
      case 'pattern-alerts':
        return <PatternAlertsTool />;
      default:
        return <div className="text-gray-400 text-center py-4">Tool not implemented yet</div>;
    }
  };

  const renderToolPanel = (side: 'left' | 'right') => {
    const sideTools = getSideTools(side);
    const title = side === 'left' ? 'Trading Tools' : 'News & Alerts';
    
    return (
      <div className="h-full flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-viridian/20">
          <h3 className="text-lg font-bold text-viridian">{title}</h3>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setShowCustomizeModal(true)}
              className="p-2 rounded-lg hover:bg-viridian/10 text-viridian"
              title="Customize Tools"
            >
              <Layout size={16} />
            </button>
            <button 
              onClick={() => side === 'left' ? setLeftPanelCollapsed(true) : setRightPanelCollapsed(true)}
              className="p-2 rounded-lg hover:bg-viridian/10 text-viridian"
              title={side === 'left' ? "Collapse Left Panel" : "Collapse Right Panel"}
            >
              {side === 'left' ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {sideTools.length > 0 ? (
            sideTools.map((tool) => (
              <div
                key={tool.id}
                className="tool-card"
              >
                <div className="tool-card-header">
                  <div className="flex items-center gap-2">
                    <span className="text-viridian">{tool.icon}</span>
                    <h4 className="text-white font-medium">{tool.name}</h4>
                  </div>
                </div>
                
                <div className="tool-card-content">
                  {renderToolComponent(tool.id)}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center p-6 text-gray-400">
              <p>No tools selected</p>
              <button 
                onClick={() => setShowCustomizeModal(true)}
                className="mt-4 px-4 py-2 bg-viridian/20 text-viridian rounded hover:bg-viridian/30 transition-colors"
              >
                Customize
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };
  
  // Define max panel constraints - ensures there's a minimum viable space for the chat
  const minChatWidth = 400; // Minimum width for the chat area
  const containerWidth = typeof window !== 'undefined' ? window.innerWidth : 1200;
  const maxLeftWidth = containerWidth - rightPanelWidth - minChatWidth;
  const maxRightWidth = containerWidth - leftPanelWidth - minChatWidth;
  
  // Ensure panel sizes are valid
  const constrainedLeftWidth = Math.min(leftPanelWidth, maxLeftWidth);
  const constrainedRightWidth = Math.min(rightPanelWidth, maxRightWidth);

  return (
    <div className="absolute inset-0 flex overflow-hidden select-none">
      {/* Left Panel */}
      <div 
        className={`h-full transition-all duration-300 border-r border-viridian/20 bg-[#0C1016] flex-shrink-0`}
        style={{ 
          width: leftPanelEnabled ? (leftPanelCollapsed ? 0 : constrainedLeftWidth) : 0,
          minWidth: leftPanelEnabled ? (leftPanelCollapsed ? 0 : 200) : 0,
          maxWidth: leftPanelEnabled ? 600 : 0
        }}
      >
        {leftPanelEnabled && !leftPanelCollapsed && renderToolPanel('left')}
        
        {/* Resize Handle */}
        {leftPanelEnabled && !leftPanelCollapsed && (
          <div 
            className="absolute top-0 bottom-0 w-1 bg-transparent hover:bg-viridian/30 cursor-ew-resize z-20"
            style={{ left: constrainedLeftWidth }}
            onMouseDown={startLeftResize}
          />
        )}
        
        {/* Collapse/Expand Button */}
        <button 
          onClick={() => setLeftPanelCollapsed(!leftPanelCollapsed)}
          className={`absolute top-1/2 transform -translate-y-1/2 z-30 w-8 h-12 rounded-r-full bg-viridian/30 border border-viridian/60 flex items-center justify-center transition-colors hover:bg-viridian/40`}
          style={{ 
            left: leftPanelCollapsed ? 0 : constrainedLeftWidth - 4,
            opacity: leftPanelEnabled ? 1 : 0,
            pointerEvents: leftPanelEnabled ? 'auto' : 'none'
          }}
        >
          {leftPanelCollapsed ? (
            <ChevronRight size={18} className="text-viridian" />
          ) : (
            <ChevronLeft size={18} className="text-viridian" />
          )}
        </button>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <div className="flex-shrink-0 border-b border-viridian/20 p-4 flex items-center justify-between bg-[#0C1016]">
          <div className="flex items-center">
            <button 
              onClick={handleTitleClick}
              className="flex items-center gap-3 hover:opacity-80 transition-opacity"
            >
              <Bot size={24} className="text-viridian" />
              <h2 className="text-xl font-bold text-viridian">TradesXBT AI</h2>
            </button>
            
            {/* Sentiment Indicator */}
            {renderSentimentIndicator()}
          </div>

          <div className="flex items-center gap-4">
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search tokens..."
                className="w-64 py-2 px-4 rounded-lg bg-black/30 border border-viridian/40 text-white placeholder:text-gray-500 focus:outline-none focus:border-viridian/70"
                disabled={tokenLoading}
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-viridian">
                {loading || tokenLoading ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <Search size={18} />
                )}
              </div>
              
              {showResults && searchResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-[#0C1016] border border-viridian/40 rounded-lg shadow-lg overflow-hidden z-50">
                  {searchResults.map((coin) => (
                    <button
                      key={coin.id}
                      className="w-full px-4 py-3 flex items-center gap-3 hover:bg-viridian/10 text-left border-b border-viridian/20 last:border-0"
                      onClick={() => handleTokenSelect(coin)}
                      disabled={tokenLoading}
                    >
                      <img src={coin.large} alt={coin.name} className="w-8 h-8 rounded-full" />
                      <div>
                        <div className="text-white font-medium">{coin.symbol.toUpperCase()}</div>
                        <div className="text-sm text-gray-400">{coin.name}</div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={() => setShowSettingsModal(true)}
              className="p-2 rounded-lg bg-viridian/10 text-viridian hover:bg-viridian/20 transition-colors"
              title="Settings"
            >
              <Settings size={18} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-hidden bg-[#0C1016]">
          <ChatWithAgent />
        </div>
      </div>

      {/* Right Panel */}
      <div 
        className={`h-full transition-all duration-300 border-l border-viridian/20 bg-[#0C1016] flex-shrink-0`}
        style={{ 
          width: rightPanelEnabled ? (rightPanelCollapsed ? 0 : constrainedRightWidth) : 0,
          minWidth: rightPanelEnabled ? (rightPanelCollapsed ? 0 : 200) : 0,
          maxWidth: rightPanelEnabled ? 600 : 0
        }}
      >
        {rightPanelEnabled && !rightPanelCollapsed && renderToolPanel('right')}
        
        {/* Resize Handle */}
        {rightPanelEnabled && !rightPanelCollapsed && (
          <div 
            className="absolute top-0 bottom-0 w-1 bg-transparent hover:bg-viridian/30 cursor-ew-resize z-20"
            style={{ right: constrainedRightWidth }}
            onMouseDown={startRightResize}
          />
        )}
        
        {/* Collapse/Expand Button */}
        <button 
          onClick={() => setRightPanelCollapsed(!rightPanelCollapsed)}
          className={`absolute top-1/2 transform -translate-y-1/2 z-30 w-8 h-12 rounded-l-full bg-viridian/30 border border-viridian/60 flex items-center justify-center transition-colors hover:bg-viridian/40`}
          style={{ 
            right: rightPanelCollapsed ? 0 : constrainedRightWidth - 4,
            opacity: rightPanelEnabled ? 1 : 0,
            pointerEvents: rightPanelEnabled ? 'auto' : 'none'
          }}
        >
          {rightPanelCollapsed ? (
            <ChevronLeft size={18} className="text-viridian" />
          ) : (
            <ChevronRight size={18} className="text-viridian" />
          )}
        </button>
      </div>

      {/* Customize Modal */}
      {showCustomizeModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div ref={menuRef} className="bg-[#0C1016] border border-viridian/30 rounded-xl p-6 w-[480px] max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-white">Customize Trading Tools</h3>
              <button 
                onClick={() => setShowCustomizeModal(false)}
                className="p-2 hover:bg-viridian/10 rounded-lg"
              >
                <X size={20} className="text-viridian" />
              </button>
            </div>

            <div className="space-y-6">
              {['analysis', 'charts', 'news', 'alerts'].map(category => (
                <div key={category} className="space-y-3">
                  <h4 className="text-white font-medium capitalize">{category}</h4>
                  <div className="space-y-2">
                    {sidebarTools
                      .filter(tool => tool.category === category)
                      .map(tool => (
                        <div
                          key={tool.id}
                          className="flex items-center justify-between p-3 rounded-lg bg-black/30 border border-viridian/20"
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-viridian">{tool.icon}</span>
                            <span className="text-white">{tool.name}</span>
                          </div>
                          <button
                            onClick={() => toggleToolVisibility(tool.id)}
                            className="p-2 rounded-lg bg-viridian/10 hover:bg-viridian/20 transition-colors"
                          >
                            {tool.visible ? (
                              <Eye size={18} className="text-viridian" />
                            ) : (
                              <EyeOff size={18} className="text-gray-400" />
                            )}
                          </button>
                        </div>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      
      {/* Settings Modal */}
      {showSettingsModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div ref={settingsMenuRef} className="bg-[#0C1016] border border-viridian/30 rounded-xl p-6 w-[480px]">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-white">AI Settings</h3>
              <button 
                onClick={() => setShowSettingsModal(false)}
                className="p-2 hover:bg-viridian/10 rounded-lg"
              >
                <X size={20} className="text-viridian" />
              </button>
            </div>

            <div className="space-y-6">
              <div className="space-y-4">
                <h4 className="text-white font-medium">API Provider</h4>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => setUseDirectAnthropicAPI(true)}
                    className={`flex-1 py-3 px-4 rounded-lg transition-colors ${
                      useDirectAnthropicAPI 
                        ? 'bg-viridian/20 border-2 border-viridian text-viridian'
                        : 'bg-black/30 border border-gray-700 text-gray-400'
                    }`}
                  >
                    Anthropic Claude
                  </button>
                  
                  <button
                    onClick={() => setUseDirectAnthropicAPI(false)}
                    className={`flex-1 py-3 px-4 rounded-lg transition-colors ${
                      !useDirectAnthropicAPI 
                        ? 'bg-viridian/20 border-2 border-viridian text-viridian'
                        : 'bg-black/30 border border-gray-700 text-gray-400'
                    }`}
                  >
                    LangChain
                  </button>
                </div>
              </div>
              
              <div className="space-y-4">
                <h4 className="text-white font-medium">Panel Settings</h4>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Left Panel</span>
                    <button 
                      onClick={() => setLeftPanelEnabled(!leftPanelEnabled)}
                      className={`relative w-12 h-6 rounded-full transition-colors ${
                        leftPanelEnabled ? 'bg-viridian/80' : 'bg-gray-700'
                      }`}
                    >
                      <span 
                        className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${
                          leftPanelEnabled ? 'left-7' : 'left-1'
                        }`}
                      />
                    </button>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Right Panel</span>
                    <button 
                      onClick={() => setRightPanelEnabled(!rightPanelEnabled)}
                      className={`relative w-12 h-6 rounded-full transition-colors ${
                        rightPanelEnabled ? 'bg-viridian/80' : 'bg-gray-700'
                      }`}
                    >
                      <span 
                        className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${
                          rightPanelEnabled ? 'left-7' : 'left-1'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="pt-4 border-t border-gray-700">
                <button
                  onClick={() => setShowSettingsModal(false)}
                  className="w-full py-3 bg-viridian hover:bg-viridian/90 text-white rounded-lg transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};