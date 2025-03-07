// Original token data type
export interface TokenData {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  price_change_percentage_24h: number;
}

// CoinGecko Search API Response Types
export interface CoinGeckoSearchResponse {
  coins: CoinGeckoSearchCoin[];
  exchanges: any[];
  icos: any[];
  categories: any[];
  nfts: any[];
}

export interface CoinGeckoSearchCoin {
  id: string;
  name: string;
  api_symbol: string;
  symbol: string;
  market_cap_rank: number;
  thumb: string;
  large: string;
}

// CoinGecko Market Data Response Type
export interface CoinGeckoMarketData {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  price_change_percentage_24h: number;
  price_change_percentage_7d?: number;
  price_change_percentage_30d?: number;
}

export interface Signal {
  id: string;
  type: 'BULLISH' | 'BEARISH' | 'NEUTRAL' | 'RUG';
  token: string;
  message: string;
  timestamp: string;
  confidence: number;
}

export interface PortfolioToken {
  symbol: string;
  amount: number;
  value_usd: number;
  price_change_24h: number;
}

export interface DashboardCard {
  id: string;
  type: 'token' | 'chart' | 'signals' | 'portfolio' | 'social';
  title: string;
}