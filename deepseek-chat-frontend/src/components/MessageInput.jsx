import React, { useState } from 'react';
import './MessageInput.css';

const MessageInput = ({ onSendMessage, isDisabled }) => {
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim() && !isDisabled) {
      onSendMessage(message);
      setMessage('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      handleSubmit(e);
    }
  };

  return (
    <form className="message-input-container" onSubmit={handleSubmit}>
      <textarea
        className="message-input"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Schreibe eine Nachricht..."
        disabled={isDisabled}
      />
      <button 
        type="submit" 
        className="send-button"
        disabled={isDisabled || !message.trim()}
      >
        Senden
      </button>
    </form>
  );
};

export default MessageInput;