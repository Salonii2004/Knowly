import { Client } from '@elastic/elasticsearch';
import { ELASTICSEARCH_NODE } from './constants.js';

export const esClient = new Client({ node: ELASTICSEARCH_NODE });

export const connectElasticsearch = async () => {
  try {
    const health = await esClient.cluster.health();
    console.log('Elasticsearch cluster status:', health.body.status);
  } catch (err) {
    console.error('Elasticsearch connection error:', err);
    process.exit(1);
  }
};
