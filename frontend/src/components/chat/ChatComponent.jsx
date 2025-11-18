import { useState } from 'react';
import { sendChatMessage } from '../api/api.js';

const ChatComponent = () => {
  const [message, setMessage] = useState('');
  const [reply, setReply] = useState('');

  const handleSubmit = async () => {
    try {
      const response = await sendChatMessage(message);
      setReply(response);
    } catch (error) {
      alert('Failed to send message: ' + error.message);
    }
  };

  return (
    <div>
      <input value={message} onChange={(e) => setMessage(e.target.value)} />
      <button onClick={handleSubmit}>Send</button>
      <p>Reply: {reply}</p>
    </div>
  );
};

export default ChatComponent;