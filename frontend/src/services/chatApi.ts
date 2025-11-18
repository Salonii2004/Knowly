import axios from "axios";

// Base URL of your backend
const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

export async function sendMessage(message: string, token: string) {
  try {
    const response = await axios.post(
      `${BASE_URL}/chat/send`,
      { message },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data; // { message: "...", timestamp: "...", ... }
  } catch (err: any) {
    console.error("Error sending message:", err.response?.data || err.message);
    throw err;
  }
}

export async function fetchChatHistory(token: string) {
  try {
    const response = await axios.get(`${BASE_URL}/chat/history`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data; // array of messages
  } catch (err: any) {
    console.error("Error fetching chat history:", err.response?.data || err.message);
    throw err;
  }
}
