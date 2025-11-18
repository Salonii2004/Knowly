// src/hooks/useChat.ts
import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { sendChatMessage } from "../api/api"
import { ChatMessage } from "../types/chat";

export function useChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const { getToken, refreshAuthToken } = useAuth();

  const sendMessage = async (content: string) => {
    if (!content.trim()) return;

    const newMessage: ChatMessage = {
      role: "user", content,
      id: "",
      timestamp: ""
    };
    setMessages((prev) => [...prev, newMessage]);
    setLoading(true);
    setError(null);

    try {
      const token = getToken();
      if (!token) throw new Error("No access token. Please log in.");

      const response = await sendChatMessage(content, token);
      const aiMessage: ChatMessage = {
        role: "assistant", content: response,
        id: "",
        timestamp: ""
      };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (err) {
      const errorMessage = err instanceof Error ? err : new Error("Failed to send message");
      setError(errorMessage);
      if (errorMessage.message.includes("401")) {
        const newToken = await refreshAuthToken();
        if (newToken) {
          const response = await sendChatMessage(content, newToken);
          const aiMessage: ChatMessage = {
            role: "assistant", content: response,
            id: "",
            timestamp: ""
          };
          setMessages((prev) => [...prev, aiMessage]);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([]);
    setError(null);
  };

  return { messages, sendMessage, loading, error, clearChat };
}