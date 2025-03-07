# Development Notes

## Redis Integration - 2024-03-07

### System Architecture

#### Redis Caching Layer
We've implemented a Redis caching layer using Upstash Redis to improve performance and reduce API calls to CoinGecko. The caching layer sits between our application and the CoinGecko API, storing API responses for a configurable period of time.

```
[Application] ↔ [Redis Cache] ↔ [CoinGecko API]
```

#### Implementation Details

1. **Redis Service (`src/services/redis.ts`)**
   - Uses `@upstash/redis` client
   - Configured with environment variables:
     - `KV_URL` or `KV_REST_API_URL` for the Redis instance URL
     - `KV_REST_API_TOKEN` for authentication
   - Provides core caching functions:
     - `getCachedData`: Retrieve data from cache
     - `setCachedData`: Store data in cache with TTL
     - `deleteCachedData`: Remove data from cache
     - `keyExists`: Check if key exists in cache
     - `getKeyTTL`: Get time-to-live for a key

2. **API Service Enhancement (`src/services/api.ts`)**
   - Added cache TTL constants:
     - `SHORT`: 5 minutes (for volatile data like prices)
     - `MEDIUM`: 15 minutes (for semi-stable data)
     - `LONG`: 1 hour (for stable data)
     - `VERY_LONG`: 24 hours (for rarely changing data)
   - Implemented helper functions:
     - `generateCacheKey`: Creates consistent cache keys based on endpoint and parameters
     - `fetchWithCache`: Handles cache retrieval and API fetching
   - Updated all API endpoints to use the caching mechanism

### Cache Key Strategy

Cache keys are generated using the following format:
```
`cg:${endpoint}:${sortedParamsString}`
```

Where:
- `cg:` is the prefix for CoinGecko API
- `endpoint` is the API endpoint path
- `sortedParamsString` is a sorted string representation of the query parameters

Parameters are sorted to ensure consistent cache keys regardless of the order in which parameters are provided.

### Cache TTL Strategy

TTL values are assigned based on data volatility:
- **SHORT (5 minutes)**: For frequently changing data like prices, OHLC data
- **MEDIUM (15 minutes)**: For search results, trending coins
- **LONG (1 hour)**: For coin details, global market data
- **VERY_LONG (24 hours)**: For static data (not currently used)

### Error Handling

The caching mechanism includes robust error handling:
- Cache misses are logged and fallback to API calls
- API errors are properly propagated
- Cache errors don't prevent API calls

### Performance Considerations

- Redis operations are asynchronous and don't block the main thread
- Cache hits completely bypass API calls, reducing latency
- Cache keys are designed to be compact yet unique
- TTL values balance freshness with performance

### Future Enhancements

1. **Cache Invalidation**: Implement mechanisms to invalidate cache entries when data changes
2. **Cache Warming**: Proactively cache frequently accessed data
3. **Cache Analytics**: Track cache hit/miss ratios to optimize TTL values
4. **Selective Caching**: Only cache successful responses with status 200
5. **Compression**: Compress large responses before caching to reduce memory usage 