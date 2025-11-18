import { esClient } from '../config/elasticsearch.js';

export const searchDocuments = async (query) => {
  const { body } = await esClient.search({
    index: 'documents',
    query: {
      multi_match: {
        query,
        fields: ['title', 'content', 'source']
      }
    }
  });

  return body.hits.hits.map(hit => hit._source);
};
