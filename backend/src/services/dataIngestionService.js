import { esClient } from '../config/elasticsearch.js';
import Document from '../models/Document.js';

export const ingestData = async (documents) => {
  const results = [];

  for (const doc of documents) {
    const newDoc = await Document.create(doc);
    results.push(newDoc);

    // Index in Elasticsearch
    await esClient.index({
      index: 'documents',
      id: newDoc._id.toString(),
      document: doc
    });
  }

  await esClient.indices.refresh({ index: 'documents' });

  return results;
};
