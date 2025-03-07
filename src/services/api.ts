import axios from 'axios';
import { getCachedData, setCachedData } from './redis';

// Get API key from environment variables
const API_KEY = import.meta.env.VITE_COINGECKO_API_KEY;

// Cache TTL values (in seconds)
const CACHE_TTL = {
  SHORT: 60 * 5,      // 5 minutes
  MEDIUM: 60 * 15,    // 15 minutes
  LONG: 60 * 60,      // 1 hour
  VERY_LONG: 60 * 60 * 24  // 24 hours
};

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

// Helper function to generate cache keys
const generateCacheKey = (endpoint: string, params: Record<string, any> = {}): string => {
  const sortedParams = Object.entries(params)
    .filter(([key]) => !['_t', 'x_cg_pro_api_key'].includes(key))
    .sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
    .map(([key, value]) => `${key}=${value}`)
    .join('&');
  
  return `cg:${endpoint}${sortedParams ? `:${sortedParams}` : ''}`;
};

// Helper function to fetch data with caching
const fetchWithCache = async <T>(
  endpoint: string, 
  params: Record<string, any> = {}, 
  ttl: number = CACHE_TTL.SHORT
): Promise<T> => {
  const cacheKey = generateCacheKey(endpoint, params);
  
  // Try to get data from cache first
  const cachedData = await getCachedData<T>(cacheKey);
  if (cachedData) {
    console.log(`Cache hit for ${cacheKey}`);
    return cachedData;
  }
  
  // If not in cache, fetch from API
  console.log(`Cache miss for ${cacheKey}, fetching from API`);
  const response = await api.get<T>(endpoint, { params });
  
  // Cache the response
  await setCachedData(cacheKey, response.data, ttl);
  
  return response.data;
};

// Define API endpoints
export const coinGeckoAPI = {
  // Get detailed market data for a specific coin
  getCoinDetails: async (coinId: string) => {
    try {
      const params = {
        localization: false,
        tickers: true,
        market_data: true,
        community_data: false,
        developer_data: false,
        sparkline: true
      };
      
      return await fetchWithCache(
        `/coins/${coinId}`,
        params,
        CACHE_TTL.MEDIUM
      );
    } catch (error) {
      handleApiError(error);
    }
  },

  // Get OHLC data for charts
  getOHLCData: async (coinId: string, days = 1, vsCurrency = 'usd') => {
    try {
      const params = {
        vs_currency: vsCurrency,
        days: days,
        precision: 'full'
      };
      
      return await fetchWithCache(
        `/coins/${coinId}/ohlc`,
        params,
        CACHE_TTL.SHORT
      );
    } catch (error) {
      handleApiError(error);
    }
  },

  // Get coin market chart
  getCoinMarketChart: async (coinId: string, days = 1, vsCurrency = 'usd') => {
    try {
      const params = {
        vs_currency: vsCurrency,
        days: days,
        interval: days === 1 ? 'minute' : days <= 90 ? 'hourly' : 'daily',
        precision: 'full'
      };
      
      return await fetchWithCache(
        `/coins/${coinId}/market_chart`,
        params,
        CACHE_TTL.SHORT
      );
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
      const data = await fetchWithCache<any>(
        '/search',
        { query: query.trim() },
        CACHE_TTL.MEDIUM
      );
      
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
      
      const params = {
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
      };
      
      const data = await fetchWithCache<any[]>(
        '/coins/markets',
        params,
        CACHE_TTL.SHORT
      );
      
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
      const data = await fetchWithCache<any>(
        '/search/trending',
        { include_platform: false },
        CACHE_TTL.MEDIUM
      );
      
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
      const data = await fetchWithCache<any>(
        '/onchain/networks/trending_pools',
        params || {},
        CACHE_TTL.MEDIUM
      );
      
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
      const data = await fetchWithCache<any>(
        '/onchain/networks/new_pools',
        params || {},
        CACHE_TTL.MEDIUM
      );
      
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
      const endpoint = `/onchain/networks/${network}/pools/${poolAddress}/ohlcv/${timeframe}`;
      return await fetchWithCache<any>(endpoint, params || {}, CACHE_TTL.SHORT);
    } catch (error) {
      console.error('Error fetching pool OHLCV data:', error);
      throw error;
    }
  },
  
  // Get global crypto data
  getGlobalData: async () => {
    try {
      return await fetchWithCache<any>('/global', {}, CACHE_TTL.LONG);
    } catch (error) {
      console.error('Error fetching global data:', error);
      handleApiError(error);
    }
  },
  
  // Mock data function for testing without API key
  getMockMarketData: (ids: string[]) => {
    // Return mock data for the requested IDs
    return ids.map(id => ({
      id,
      symbol: id.substring(0, 3).toUpperCase(),
      name: `${id.charAt(0).toUpperCase()}${id.slice(1)} Token`,
      image: `https://via.placeholder.com/64/1c1c1c/FFFFFF?text=${id.substring(0, 3).toUpperCase()}`,
      current_price: Math.random() * 1000,
      market_cap: Math.random() * 1000000000,
      market_cap_rank: Math.floor(Math.random() * 100) + 1,
      fully_diluted_valuation: Math.random() * 2000000000,
      total_volume: Math.random() * 100000000,
      high_24h: Math.random() * 1200,
      low_24h: Math.random() * 800,
      price_change_24h: (Math.random() * 200) - 100,
      price_change_percentage_24h: (Math.random() * 20) - 10,
      price_change_percentage_7d_in_currency: (Math.random() * 40) - 20,
      price_change_percentage_30d_in_currency: (Math.random() * 60) - 30,
      market_cap_change_24h: (Math.random() * 50000000) - 25000000,
      market_cap_change_percentage_24h: (Math.random() * 20) - 10,
      circulating_supply: Math.random() * 100000000,
      total_supply: Math.random() * 200000000,
      max_supply: Math.random() * 300000000,
      ath: Math.random() * 2000,
      ath_change_percentage: (Math.random() * 200) - 100,
      ath_date: new Date().toISOString(),
      atl: Math.random() * 10,
      atl_change_percentage: Math.random() * 1000,
      atl_date: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString(),
      last_updated: new Date().toISOString()
    }));
  }
};

// Use mock data only if API key is not available
export const USE_MOCK_DATA = !API_KEY;