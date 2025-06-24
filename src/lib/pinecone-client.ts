import { Pinecone } from '@pinecone-database/pinecone';

const apiKey = process.env.PINECONE_API_KEY!;
const environment = process.env.PINECONE_ENVIRONMENT!;
const indexName = process.env.PINECONE_INDEX!;

if (!apiKey || !environment || !indexName) {
  throw new Error('Missing Pinecone environment variables.');
}

const pinecone = new Pinecone({
  apiKey,
});

export const pineconeIndex = pinecone.Index(indexName); 