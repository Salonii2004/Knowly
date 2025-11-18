import React, { useState, useRef, useEffect } from 'react';

export interface ChatInputProps {
  onSend: (message: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

const ChatInput: React.FC<ChatInputProps> = ({ 
  onSend, 
  placeholder = "Type your message...", 
  disabled = false,
  className = "" 
}) => {
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSend(message.trim());
      setMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [message]);

  return (
    <form onSubmit={handleSubmit} className={`relative ${className}`}>
      <div className="flex items-end gap-2">
        <textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={placeholder}
          disabled={disabled}
          className={`
            flex-1 p-3 border border-gray-300 rounded-lg resize-none 
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
            transition-all duration-200 min-h-[44px] max-h-32
            ${disabled ? 'bg-gray-100 cursor-not-allowed opacity-60' : 'bg-white'}
          `}
          rows={1}
        />
        <button
          type="submit"
          disabled={!message.trim() || disabled}
          className={`
            px-6 py-3 rounded-lg font-semibold transition-all duration-200
            flex items-center justify-center min-w-[80px]
            ${!message.trim() || disabled
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
              : 'bg-blue-500 text-white hover:bg-blue-600 shadow-lg hover:shadow-xl'
            }
          `}
        >
          Send🚀
        </button>
      </div>
      
      {/* Helper text */}
      <div className="mt-2 text-xs text-gray-500 text-center">
        Press Enter to send, Shift+Enter for new line
        {disabled && <span className="text-orange-600 ml-2">• Input disabled</span>}
      </div>
    </form>
  );
};

export default ChatInput;