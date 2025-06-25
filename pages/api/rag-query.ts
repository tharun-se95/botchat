import type { NextApiRequest, NextApiResponse } from "next";
import { pineconeIndex } from "../../src/lib/pinecone-client";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }
  try {
    const { message, sessionId, topK = 5 } = req.body;
    if (!message || !sessionId) {
      res.status(400).json({ error: "Missing message or sessionId" });
      return;
    }
    // 1. Search Pinecone for relevant chunks (filter by sessionId, use integrated embedding)
    const namespace = pineconeIndex.namespace("__default__");
    const results = await namespace.searchRecords({
      query: {
        topK,
        filter: { sessionId },
        inputs: { text: message },
      },
      // Optionally, specify fields: ["text", ...] if you want to limit returned fields
      // Optionally, add rerank: { ... } if you want reranking
    });
    // 2. Build context from top chunks
    const hits = results.result?.hits || [];
    const contextChunks = hits
      .map((hit: any) => hit.fields?.text || hit.fields?.chunk_text || "")
      .filter(Boolean);
    const context = contextChunks.join("\n---\n");
    // 3. Return context (LLM call can be added next)
    res.status(200).json({ context, hits });
  } catch (err: any) {
    res.status(500).json({
      error: "RAG retrieval failed",
      details: err.message || err.toString(),
    });
  }
}
