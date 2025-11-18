import { openai } from '../config/openai.js';

export const getEmbeddings = async (text) => {
  const response = await openai.embeddings.create({
    model: 'text-embedding-3-small',
    input: text,
  });

  return response.data[0].embedding;
};
