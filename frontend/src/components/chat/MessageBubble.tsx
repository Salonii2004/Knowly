interface MessageBubbleProps {
  sender: "user" | "bot";
  text: string;
}

export default function MessageBubble({ sender, text }: MessageBubbleProps) {
  const isUser = sender === "user";

  return (
    <div
      className={`flex ${
        isUser ? "justify-end" : "justify-start"
      } mb-2`}
    >
      <div
        className={`px-4 py-2 rounded-lg max-w-md ${
          isUser
            ? "bg-blue-600 text-white rounded-br-none"
            : "bg-gray-200 text-gray-900 rounded-bl-none"
        }`}
      >
        {text}
      </div>
    </div>
  );
}
