import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import LoadingIndicator from './LoadingIndicator';
import { sendMessage, clearChat } from '../slices/chatSlice';
import './ChatContainer.css';

const ChatContainer = () => {
  const { messages, isLoading, error } = useSelector((state) => state.chat);
  const dispatch = useDispatch();

  const handleSendMessage = (message) => {
    if (message.trim()) {
      dispatch(sendMessage(message));
    }
  };

  const handleClearChat = () => {
    dispatch(clearChat());
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <button className="clear-button" onClick={handleClearChat}>
          Clear Chat
        </button>
      </div>
      
      <MessageList messages={messages} />
      
      {isLoading && <LoadingIndicator />}
      
      {error && (
        <div className="error-message">
          Error: {error}
        </div>
      )}
      
      <MessageInput onSendMessage={handleSendMessage} isDisabled={isLoading} />
    </div>
  );
};

export default ChatContainer;