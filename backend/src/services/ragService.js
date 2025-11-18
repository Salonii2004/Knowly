import { openai } from '../config/openai.js';

export const generateChatResponse = async (message) => {
  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [{ role: 'user', content: message }],
  });

  return completion.choices[0].message.content;
};
