export interface ChatMessage {
  text: string;
  sender: string;
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  source?: string; // Add this if needed
}

// Chat session (optional if you want to track sessions)
export interface ChatSession {
  id: string;
  title: string;
  messages: ChatMessage[];
}
