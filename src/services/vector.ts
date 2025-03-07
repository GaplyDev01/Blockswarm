import { Vector } from '@upstash/vector';

// Environment variables for Vector DB
const VECTOR_URL = process.env.UPSTASH_VECTOR_REST_URL || 'https://loved-longhorn-74151-us1-vector.upstash.io';
const VECTOR_TOKEN = process.env.UPSTASH_VECTOR_REST_TOKEN || 'ABgFMGxvdmVkLWxvbmdob3JuLTc0MTUxLXVzMWFkbWluWXpCa05EQTRZV1F0T1RBd05pMDBPVEZsTFRsaVpEY3RPVEUzTURVME9XWTROakJo';
const VECTOR_READ_ONLY_TOKEN = process.env.UPSTASH_VECTOR_REST_READONLY_TOKEN || 'ABgIMGxvdmVkLWxvbmdob3JuLTc0MTUxLXVzMXJlYWRvbmx5TWpjMk5USXpaRFF0TWpZMVlpMDBaak0wTFdFMU5tTXRaVGRsTnpNMlpHVTFNR0pt';

// Initialize the Vector client
export const vectorClient = new Vector({
  url: VECTOR_URL,
  token: VECTOR_TOKEN,
});

// Initialize a read-only Vector client for safer operations
export const readOnlyVectorClient = new Vector({
  url: VECTOR_URL,
  token: VECTOR_READ_ONLY_TOKEN,
});

/**
 * Upsert vectors into the database
 * @param indexName The name of the index
 * @param vectors Array of vectors to upsert
 * @returns Result of the upsert operation
 */
export const upsertVectors = async (
  indexName: string,
  vectors: Array<{ id: string; vector: number[]; metadata?: Record<string, any> }>
) => {
  try {
    const result = await vectorClient.upsert({
      indexName,
      vectors,
    });
    console.log(`Successfully upserted ${vectors.length} vectors to index ${indexName}`);
    return result;
  } catch (error) {
    console.error(`Error upserting vectors to index ${indexName}:`, error);
    throw error;
  }
};

/**
 * Query vectors from the database
 * @param indexName The name of the index
 * @param vector The query vector
 * @param topK Number of results to return
 * @param includeMetadata Whether to include metadata in the results
 * @param includeVectors Whether to include vectors in the results
 * @returns Query results
 */
export const queryVectors = async (
  indexName: string,
  vector: number[],
  topK: number = 10,
  includeMetadata: boolean = true,
  includeVectors: boolean = false
) => {
  try {
    const result = await readOnlyVectorClient.query({
      indexName,
      vector,
      topK,
      includeMetadata,
      includeVectors,
    });
    console.log(`Successfully queried index ${indexName} with topK=${topK}`);
    return result;
  } catch (error) {
    console.error(`Error querying vectors from index ${indexName}:`, error);
    throw error;
  }
};

/**
 * Create a new index
 * @param indexName The name of the index
 * @param dimensions The dimensions of the vectors
 * @returns Result of the create operation
 */
export const createIndex = async (indexName: string, dimensions: number) => {
  try {
    const result = await vectorClient.createIndex({
      indexName,
      dimensions,
    });
    console.log(`Successfully created index ${indexName} with ${dimensions} dimensions`);
    return result;
  } catch (error) {
    console.error(`Error creating index ${indexName}:`, error);
    throw error;
  }
};

/**
 * Delete vectors from the database
 * @param indexName The name of the index
 * @param ids Array of vector IDs to delete
 * @returns Result of the delete operation
 */
export const deleteVectors = async (indexName: string, ids: string[]) => {
  try {
    const result = await vectorClient.delete({
      indexName,
      ids,
    });
    console.log(`Successfully deleted ${ids.length} vectors from index ${indexName}`);
    return result;
  } catch (error) {
    console.error(`Error deleting vectors from index ${indexName}:`, error);
    throw error;
  }
};

/**
 * List all indexes
 * @returns Array of index names
 */
export const listIndexes = async () => {
  try {
    const result = await vectorClient.listIndexes();
    console.log(`Successfully listed ${result.length} indexes`);
    return result;
  } catch (error) {
    console.error('Error listing indexes:', error);
    throw error;
  }
};

/**
 * Reset an index (delete all vectors)
 * @param indexName The name of the index
 * @returns Result of the reset operation
 */
export const resetIndex = async (indexName: string) => {
  try {
    const result = await vectorClient.reset({
      indexName,
    });
    console.log(`Successfully reset index ${indexName}`);
    return result;
  } catch (error) {
    console.error(`Error resetting index ${indexName}:`, error);
    throw error;
  }
}; 