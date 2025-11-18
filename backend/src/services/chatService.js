import { getMockResponse } from "./mockOpenAI.js";

export async function getChatReply(message) {
  // If NODE_ENV is development, use mock
  if (process.env.NODE_ENV === "development") {
    return await getMockResponse(message);
  }

  // Otherwise, call real OpenAI API
  // const response = await openai.createChatCompletion({ ... });
  // return response.data.choices[0].message.content;
}
