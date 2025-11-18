
import fetch from 'node-fetch';
import faiss from 'faiss-node';

const EMBEDDING_API = 'https://api-inference.huggingface.co/pipeline/feature-extraction/sentence-transformers/all-MiniLM-L6-v2';
const HF_API_KEY = process.env.HF_API_KEY;

const documents = [];
const index = new faiss.IndexFlatL2(384);

async function getEmbedding(text) {
  const response = await fetch(EMBEDDING_API, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${HF_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ inputs: text }),
  });
  if (!response.ok) throw new Error('Failed to generate embedding');
  return await response.json();
}

export async function performSearch(query, userId) {
  try {
    const queryEmbedding = await getEmbedding(query);
    const { distances, indices } = index.search(queryEmbedding, 3);

    const results = [];
    indices.forEach((idx, i) => {
      if (idx >= 0 && idx < documents.length) {
        results.push({
          id: documents[idx].id,
          title: documents[idx].title,
          content: documents[idx].text.substring(0, 200),
          similarity: 1 - distances[i],
          sourceNumber: i + 1,
        });
      }
    });

    return results;
  } catch (err) {
    console.error('Search error:', err);
    throw err;
  }
}
