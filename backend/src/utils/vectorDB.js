// src/utils/vectorDB.js
import duckdb from 'duckdb';
import fs from 'fs';
import path from 'path';
import { pipeline } from '@xenova/transformers';
import zlib from 'zlib';

// 1️⃣ Initialize DuckDB database (file-based, local directory)
const dbDir = 'C:\\Users\\patel\\knowly';
const dbFile = path.join(dbDir, 'vectorDB.duckdb');

// Create directory if it doesn't exist
if (!fs.existsSync(dbDir)) {
  console.log(`Creating directory: ${dbDir}`);
  fs.mkdirSync(dbDir, { recursive: true });
} else {
  console.log(`Directory exists: ${dbDir}`);
}

if (fs.existsSync(dbFile)) {
  console.log('Using existing database file...');
  // Removed fs.unlinkSync(dbFile) for persistence
}
const db = new duckdb.Database(dbFile, (err) => {
  if (err) {
    console.error('Failed to initialize DuckDB:', err);
    process.exit(1);
  }
  console.log('DuckDB initialized ✅');
});
const conn = db.connect();

// 2️⃣ Create table to store vectors and add index
try {
  console.log('Creating documents table...');
  conn.exec(`
    CREATE TABLE IF NOT EXISTS documents (
      id VARCHAR PRIMARY KEY,
      text VARCHAR,
      embedding VARCHAR,
      metadata VARCHAR
    )
  `, (err) => {
    if (err) {
      console.error('Failed to create table:', err);
      process.exit(1);
    }
    console.log('Documents table created ✅');
    conn.exec(`CREATE INDEX IF NOT EXISTS idx_id ON documents(id)`, (err) => {
      if (err) {
        console.error('Index creation error:', err);
      } else {
        console.log('Index created ✅');
      }
    });
  });
} catch (err) {
  console.error('Error during table creation:', err);
  process.exit(1);
}

// 3️⃣ Initialize embedder
export let embedder;
export let embedderReady = false;

export async function loadEmbedder() {
  console.log('Waiting for embedder to load...');
  try {
    embedder = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
    embedderReady = true;
    console.log('Embedder loaded ✅');
  } catch (err) {
    console.error('Failed to load embedder:', err);
    throw err;
  }
}

// 4️⃣ Normalize embedding with mean pooling
function normalizeEmbedding(emb) {
  const EXPECTED_DIM = 384;

  let embeddingData;
  if (emb && typeof emb === 'object' && emb.data && ArrayBuffer.isView(emb.data)) {
    console.log('Raw embedding dims:', emb.dims, 'Data length:', emb.data.length);
    const seqLen = emb.dims[1];
    embeddingData = emb.data;
    const reshaped = [];
    for (let i = 0; i < seqLen; i++) {
      reshaped.push(Array.from(embeddingData.slice(i * EXPECTED_DIM, (i + 1) * EXPECTED_DIM)));
    }
    embeddingData = reshaped[0].map((_, colIndex) =>
      reshaped.reduce((sum, row) => sum + row[colIndex], 0) / seqLen
    );
  } else {
    throw new Error(`Unexpected embedding type: ${typeof emb}`);
  }

  if (!Array.isArray(embeddingData) || embeddingData.length !== EXPECTED_DIM || embeddingData.some(val => val == null || !isFinite(val))) {
    throw new Error(`Invalid embedding data: ${JSON.stringify(embeddingData)}`);
  }

  const magnitude = Math.sqrt(embeddingData.reduce((sum, val) => sum + val * val, 0));
  if (magnitude === 0) throw new Error('Zero-length embedding');
  return embeddingData.map(val => val / magnitude);
}

// 5️⃣ Add documents with batch insertion
export async function addDocuments(docs) {
  if (!embedderReady) throw new Error('Embedder not ready yet');

  console.log('Generating embeddings for batch...');
  const embeddings = await Promise.all(
    docs.map(async (doc) => {
      if (!doc.text || typeof doc.text !== 'string') {
        throw new Error(`Invalid document text for ID ${doc.id}: ${doc.text}`);
      }
      console.log(`Processing document ${doc.id}...`);
      const embRaw = await embedder(doc.text);
      const emb = normalizeEmbedding(embRaw);
      const embJSON = JSON.stringify(emb);
      const embCompressed = zlib.deflateSync(embJSON).toString('base64');
      return { id: doc.id, text: doc.text, embedding: embCompressed, metadata: JSON.stringify(doc.metadata || {}) };
    })
  );

  console.log('Preparing batch statement...');
  await new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      console.error('Timeout during batch insertion');
      reject(new Error('Timeout during batch insertion'));
    }, 10000);

    const stmt = conn.prepare(
      `INSERT OR REPLACE INTO documents (id, text, embedding, metadata) VALUES (?, ?, ?, ?)`,
      (err) => {
        if (err) {
          clearTimeout(timeout);
          console.error('Prepare error:', err);
          reject(err);
        } else {
          console.log('Batch statement prepared ✅');
          embeddings.forEach(({ id, text, embedding, metadata }, index) => {
            console.log(`Inserting document ${id} in batch:`, {
              id,
              text,
              embeddingLength: JSON.parse(zlib.inflateSync(Buffer.from(embedding, 'base64')).toString()).length,
              embeddingCompressedLength: embedding.length,
              metadata,
            });
            stmt.run(id, text, embedding, metadata, (err) => {
              if (err) {
                console.error(`Insert error for document ${id}:`, err);
              } else {
                console.log(`Document ${id} inserted successfully`);
              }
            });
          });
          console.log('Finalizing batch statement...');
          stmt.finalize((err) => {
            clearTimeout(timeout);
            if (err) {
              console.error('Finalize error:', err);
              reject(err);
            } else {
              console.log('Batch insertion completed ✅');
              resolve();
            }
          });
        }
      }
    );
  });
}

// 6️⃣ Query documents
export async function queryDocuments(query, topK = 3) {
  if (!embedderReady) throw new Error('Embedder not ready yet');

  console.log('Generating query embedding...');
  const queryEmbRaw = await embedder(query);
  const queryEmb = normalizeEmbedding(queryEmbRaw);
  console.log('Query embedding length:', queryEmb.length);

  console.log('Querying documents...');
  const rows = await new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      console.error('Timeout querying documents');
      reject(new Error('Timeout querying documents'));
    }, 5000);

    conn.all(`SELECT * FROM documents`, (err, res) => {
      clearTimeout(timeout);
      if (err) {
        console.error('Failed to query documents:', err);
        reject(err);
      } else {
        resolve(res);
      }
    });
  });

  function cosine(a, b) {
    let dot = 0.0,
      normA = 0.0,
      normB = 0.0;
    for (let i = 0; i < a.length; i++) {
      dot += a[i] * b[i];
      normA += a[i] * a[i];
      normB += b[i] * b[i];
    }
    const denom = Math.sqrt(normA) * Math.sqrt(normB);
    if (denom === 0) {
      console.warn('Zero denominator in cosine similarity, returning 0');
      return 0;
    }
    return dot / (denom + 1e-10);
  }

  console.log('Computing cosine similarities...');
  const results = rows
    .map((row) => {
      let emb;
      try {
        const embJSON = zlib.inflateSync(Buffer.from(row.embedding, 'base64')).toString();
        emb = JSON.parse(embJSON);
        if (!Array.isArray(emb) || emb.length !== 384 || !emb.every(num => typeof num === 'number' && isFinite(num))) {
          throw new Error(`Invalid embedding for document ${row.id}: ${JSON.stringify(emb)}`);
        }
      } catch (err) {
        console.error(`Failed to parse embedding for document ${row.id}:`, err);
        return null;
      }
      const score = cosine(queryEmb, emb);
      console.log(`Score for document ${row.id}:`, score);
      return {
        id: row.id,
        text: row.text,
        metadata: JSON.parse(row.metadata),
        score,
      };
    })
    .filter(result => result !== null)
    .sort((a, b) => b.score - a.score)
    .slice(0, topK);

  return results;
}

// 7️⃣ Close connection on process exit
process.on('exit', () => {
  console.log('Closing DuckDB connection...');
  conn.close();
  db.close();
});