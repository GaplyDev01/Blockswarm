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

## Vector Database Integration - 2024-03-08

### System Architecture

#### Vector Storage Layer
We've implemented a Vector database using Upstash Vector to enable semantic search and similarity-based retrieval of data. This vector storage layer allows us to store and query high-dimensional embeddings for various AI and data analysis features.

```
[Application] ↔ [Vector DB] ↔ [AI Models/Semantic Search]
```

#### Implementation Details

1. **Vector Service (`src/services/vector.ts`)**
   - Uses `@upstash/vector` client
   - Configured with environment variables:
     - `UPSTASH_VECTOR_REST_URL` for the Vector instance URL
     - `UPSTASH_VECTOR_REST_TOKEN` for write operations
     - `UPSTASH_VECTOR_REST_READONLY_TOKEN` for read-only operations
   - Provides core vector operations:
     - `upsertVectors`: Store vectors with optional metadata
     - `queryVectors`: Perform similarity search
     - `createIndex`: Create a new vector index
     - `deleteVectors`: Remove vectors from an index
     - `listIndexes`: List all available indexes
     - `resetIndex`: Clear all vectors from an index

### Vector Index Strategy

Vector indexes are organized by data domain and use case:
- `market-analysis`: For storing embeddings related to market analysis
- `token-descriptions`: For semantic search of token descriptions
- `user-queries`: For storing and retrieving similar user queries
- `news-articles`: For semantic search and clustering of news content

### Vector Embedding Strategy

Vectors are stored with the following structure:
```typescript
{
  id: string;           // Unique identifier
  vector: number[];     // The embedding vector (typically 768 or 1536 dimensions)
  metadata?: {          // Optional metadata for filtering and retrieval
    timestamp: number;  // When the vector was created
    source: string;     // Source of the data
    category: string;   // Category for filtering
    [key: string]: any; // Additional metadata fields
  }
}
```

### Error Handling

The vector service includes comprehensive error handling:
- Connection errors are properly logged and propagated
- Index creation failures are handled gracefully
- Query timeouts have appropriate fallbacks
- Rate limiting is respected with exponential backoff

### Performance Considerations

- Vector operations are optimized for batch processing
- Similarity search uses approximate nearest neighbors for speed
- Metadata filtering reduces the search space
- Index size is monitored to maintain performance
- Read-only client is used for query operations to improve security

### Integration with AI Services

The Vector database integrates with our AI services to enable:
- Semantic search of token descriptions and market data
- Similar query retrieval for improved user experience
- Clustering of related market events
- Anomaly detection in market trends
- Personalized recommendations based on user behavior

### Future Enhancements

1. **Hybrid Search**: Combine vector search with keyword search for better results
2. **Vector Compression**: Implement techniques to reduce vector size
3. **Incremental Updates**: Optimize for partial updates of vectors
4. **Filtering Optimization**: Improve metadata filtering performance
5. **Multi-modal Vectors**: Support for image and text embeddings
6. **Real-time Embeddings**: Generate and store embeddings for streaming data 