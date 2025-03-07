import axios from 'axios';

// Get API key from environment variables
const API_KEY = import.meta.env.VITE_COINGECKO_API_KEY;

// List of Solana ecosystem token IDs for filtering
const SOLANA_ECOSYSTEM_TOKENS = [
  'solana',
  'raydium',
  'bonk',
  'jito',
  'pyth-network',
  'render-token',
  'serum',
  'bonfida',
  'step-finance',
  'oxygen',
  'mango-markets',
  'star-atlas',
  'samoyedcoin',
  'marinade-staked-sol',
  'jito-staked-sol'
];

// Create a base API instance
const api = axios.create({
  baseURL: 'https://pro-api.coingecko.com/api/v3',
  timeout: 15000, // Increase timeout
  headers: {
    'x-cg-pro-api-key': API_KEY,
    'Content-Type': 'application/json'
  }
});

// Add request interceptor for retries
api.interceptors.request.use(
  config => {
    // Add cache-busting parameter and API key
    const timestamp = Date.now();
    config.params = {
      ...config.params,
      _t: timestamp,
      x_cg_pro_api_key: API_KEY
    };
    return config;
  },
  error => Promise.reject(error)
);

// Add response interceptor for better error handling
api.interceptors.response.use(
  response => response,
  async error => {
    const errorMessage = error.response?.data?.error || error.message || 'An unknown error occurred';
    console.error('API Error:', errorMessage);

    if (error.code === 'ECONNABORTED') {
      throw new Error('Request timed out. Please try again.');
    }
    
    if (!error.response) {
      throw new Error('Network error. Please check your connection.');
    }
    
    const { status, data } = error.response;
    
    switch (status) {
      case 401:
        throw new Error('API key is missing or invalid. Please check your VITE_COINGECKO_API_KEY.');
      case 429:
        throw new Error('Rate limit exceeded. Please try again later.');
      case 403:
        throw new Error('API key invalid or expired.');
      case 404:
        throw new Error('Resource not found.');
      default:
        throw new Error(errorMessage);
    }
  }
);

// Error handler
const handleApiError = (error: any) => {
  if (error.message) {
    console.error('API Error:', error.message);
  } else {
    console.error('API Error:', error);
  }
  throw error;
};

// Define API endpoints
export const coinGeckoAPI = {
  // Get detailed market data for a specific coin
  getCoinDetails: async (coinId: string) => {
    try {
      const { data } = await api.get(`/coins/${coinId}`, {
        params: {
          localization: false,
          tickers: true,
          market_data: true,
          community_data: false,
          developer_data: false,
          sparkline: true
        }
      });
      return data;
    } catch (error) {
      handleApiError(error);
    }
  },

  // Get OHLC data for charts
  getOHLCData: async (coinId: string, days = 1, vsCurrency = 'usd') => {
    try {
      const { data } = await api.get(`/coins/${coinId}/ohlc`, {
        params: {
          vs_currency: vsCurrency,
          days: days,
          precision: 'full'
        }
      });
      return data;
    } catch (error) {
      handleApiError(error);
    }
  },

  // Get coin market chart
  getCoinMarketChart: async (coinId: string, days = 1, vsCurrency = 'usd') => {
    try {
      const { data } = await api.get(`/coins/${coinId}/market_chart`, {
        params: {
          vs_currency: vsCurrency,
          days: days,
          interval: days === 1 ? 'minute' : days <= 90 ? 'hourly' : 'daily',
          precision: 'full'
        }
      });
      return data;
    } catch (error) {
      handleApiError(error);
    }
  },

  // Search for tokens
  searchCoins: async (query: string) => {
    try {
      // Validate query
      if (!query?.trim()) {
        return { coins: [] };
      }

      // Make API request with proper headers and error handling
      const { data } = await api.get('/search', {
        params: {
          query: query.trim()
        }
      });
      
      // Validate response
      if (!data || !Array.isArray(data.coins)) {
        throw new Error('Invalid API response format');
      }
      
      // Sort results by market cap rank and take top results
      const sortedCoins = data.coins
        .filter(coin => coin && coin.id && coin.symbol)
        // Sort by market cap rank
        .sort((a, b) => (a.market_cap_rank || 999999) - (b.market_cap_rank || 999999))
        // Take top 6 results
        .slice(0, 6);
      
      return { ...data, coins: sortedCoins };
    } catch (error) {
      console.error('Search API error:', error);
      handleApiError(error);
    }
  },
  
  // Get market data for multiple coins
  getMarketData: async (ids: string[], vsCurrency = 'usd') => {
    try {
      if (!ids.length) return [];
      
      const { data } = await api.get('/coins/markets', {
        params: {
          vs_currency: vsCurrency,
          ids: ids.join(','),
          order: 'market_cap_desc',
          per_page: 100,
          page: 1,
          sparkline: false, // Reduce payload size
          price_change_percentage: '24h,7d,30d',
          include_market_cap: true,
          include_24h_vol: true,
          include_24h_change: true,
          include_last_updated_at: true,
          precision: 'full'
        }
      });
      
      if (!data || !Array.isArray(data)) {
        throw new Error('Invalid response format');
      }
      
      return data;
    } catch (error) {
      handleApiError(error);
    }
  },
  
  // Get trending coins
  getTrendingCoins: async () => {
    try {
      const { data } = await api.get('/search/trending', {
        params: {
          include_platform: false
        }
      });
      
      // Take top 5 trending coins
      const trendingCoins = data.coins.slice(0, 5);
      
      return { ...data, coins: trendingCoins };
    } catch (error) {
      throw error;
    }
  },
  
  // Get trending pools across all networks
  getTrendingPools: async (params?: { include?: string; page?: number; duration?: string }) => {
    try {
      const { data } = await api.get('/onchain/networks/trending_pools', { params });
      
      // Filter for Solana pools
      const filteredPools = data.data.filter((pool: any) => 
        pool.id.startsWith('solana_') ||
        pool.relationships?.base_token?.data?.symbol?.toLowerCase().includes('sol') ||
        pool.relationships?.quote_token?.data?.symbol?.toLowerCase().includes('sol')
      );
      
      return { ...data, data: filteredPools };
    } catch (error) {
      console.error('Error fetching trending pools:', error);
      throw error;
    }
  },
  
  // Get new pools across all networks
  getNewPools: async (params?: { include?: string; page?: number }) => {
    try {
      const { data } = await api.get('/onchain/networks/new_pools', { params });
      
      // Filter for Solana pools
      const filteredPools = data.data.filter((pool: any) => 
        pool.id.startsWith('solana_') ||
        pool.relationships?.base_token?.data?.symbol?.toLowerCase().includes('sol') ||
        pool.relationships?.quote_token?.data?.symbol?.toLowerCase().includes('sol')
      );
      
      return { ...data, data: filteredPools };
    } catch (error) {
      console.error('Error fetching new pools:', error);
      throw error;
    }
  },
  
  // Get OHLCV data for a specific pool
  getPoolOHLCV: async (
    network: string,
    poolAddress: string,
    timeframe: string,
    params?: {
      aggregate?: string;
      before_timestamp?: number;
      limit?: number;
      currency?: string;
      token?: string;
    }
  ) => {
    try {
      const response = await api.get(
        `/onchain/networks/${network}/pools/${poolAddress}/ohlcv/${timeframe}`,
        { params }
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching pool OHLCV data:', error);
      throw error;
    }
  },
  
  // Get global crypto data
  getGlobalData: async () => {
    try {
      const response = await api.get('/global');
      return response.data;
    } catch (error) {
      console.error('Error fetching global data:', error);
      handleApiError(error);
    }
  }
};

// Use mock data only if API key is not available
export const USE_MOCK_DATA = !API_KEY;