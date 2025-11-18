import React, { forwardRef } from "react";
import { motion } from "framer-motion";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  source?: string;
  text?: string;
  sender?: string;
}

interface ChatWindowProps {
  messages: ChatMessage[];
  loading: boolean;
  className?: string;
  renderItem: (message: ChatMessage, index: number) => React.ReactNode;
}

const ChatWindow = forwardRef<HTMLDivElement, ChatWindowProps>(
  ({ messages, loading, className, renderItem }, ref) => {
    return (
      <motion.div
        className={`flex flex-col gap-2 ${className}`}
        ref={ref}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {messages.map((message, index) => renderItem(message, index))}
        {loading && messages.length > 0 && (
          <div className="text-center py-4">
            <span className="text-gray-500 text-sm">Loading...</span>
          </div>
        )}
      </motion.div>
    );
  }
);

ChatWindow.displayName = "ChatWindow";

export default ChatWindow;