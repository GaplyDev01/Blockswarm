# Project File Structure

## Core Services

```
src/
└── services/
    ├── api.ts                 # CoinGecko API integration with Redis caching
    ├── redis.ts               # Redis service for caching API responses
    ├── vector.ts              # Vector database service for embeddings storage
    └── ai/
        └── langchain.ts       # AI service using LangChain
```

## Service Relationships

### API Service (`src/services/api.ts`)
- **Dependencies**:
  - `axios`: For making HTTP requests to CoinGecko API
  - `redis.ts`: For caching API responses
- **Used by**: Various components that need cryptocurrency data
- **Size**: ~350 lines
- **Features**:
  - Fetches coin details, market data, charts
  - Searches for coins and tokens
  - Gets trending coins and pools
  - Implements caching with configurable TTLs

### Redis Service (`src/services/redis.ts`)
- **Dependencies**:
  - `@upstash/redis`: Redis client for Upstash
- **Used by**:
  - `api.ts`: For caching API responses
- **Size**: ~70 lines
- **Features**:
  - Initializes Redis client with environment variables
  - Provides functions for cache operations
  - Handles TTL management

### Vector Service (`src/services/vector.ts`)
- **Dependencies**:
  - `@upstash/vector`: Vector database client for Upstash
- **Used by**:
  - AI components for semantic search
  - Data analysis features
- **Size**: ~100 lines
- **Features**:
  - Manages vector embeddings storage and retrieval
  - Provides similarity search capabilities
  - Supports metadata storage with vectors
  - Handles index management

### AI Service (`src/services/ai/langchain.ts`)
- **Dependencies**:
  - LangChain libraries
  - Groq and Anthropic APIs
  - `vector.ts`: For storing and retrieving embeddings
- **Used by**: Components requiring AI functionality
- **Size**: ~230 lines
- **Features**:
  - Creates trade analyses
  - Manages AI model selection
  - Handles prompt engineering

## Environment Configuration

The project relies on the following environment variables:
- `KV_URL` or `KV_REST_API_URL`: Upstash Redis URL
- `KV_REST_API_TOKEN`: Upstash Redis authentication token
- `KV_REST_API_READ_ONLY_TOKEN`: Optional read-only token
- `UPSTASH_VECTOR_REST_URL`: Upstash Vector URL
- `UPSTASH_VECTOR_REST_TOKEN`: Upstash Vector authentication token
- `UPSTASH_VECTOR_REST_READONLY_TOKEN`: Optional read-only token
- `X_CG_PRO_API_KEY`: CoinGecko API key

## Data Flow

```
User Request → Component → API Service → Redis Cache → CoinGecko API
                                          ↑
                                          | (cache hit)
                                          ↓
                                      Component Response

AI Request → LangChain Service → Vector DB → Embedding Storage/Retrieval
                              ↓
                          AI Response
```

1. User requests data through a component
2. Component calls API service function
3. API service checks Redis cache for data
4. If cache hit, return cached data
5. If cache miss, fetch from CoinGecko API
6. Cache the API response with appropriate TTL
7. Return data to component

For AI and vector operations:
1. User submits query requiring semantic search
2. LangChain service converts query to vector embedding
3. Vector service searches for similar vectors
4. Results are processed and returned to user

## Performance Metrics

- **API Calls**: Reduced by ~70% with caching
- **Response Time**:
  - Cache hit: ~50ms
  - Cache miss: ~500-1000ms (depends on CoinGecko API)
  - Vector search: ~100-200ms
- **Cache Size**: Varies based on usage patterns
- **TTL Strategy**: Tiered based on data volatility
- **Vector Indexes**: Optimized for specific use cases

## Future Structure Changes

- Add cache analytics service
- Implement cache warming service
- Add cache invalidation triggers
- Consider Redis Streams for real-time updates
- Integrate vector embeddings with real-time market data
- Implement hybrid search combining vector and keyword search 