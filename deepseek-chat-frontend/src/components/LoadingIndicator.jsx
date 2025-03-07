import React from 'react';
import './LoadingIndicator.css';

const LoadingIndicator = () => {
  return (
    <div className="loading-container">
      <div className="typing-indicator">
        <span></span>
        <span></span>
        <span></span>
      </div>
      <p>DeepSeek-Coder denkt nach...</p>
    </div>
  );
};

export default LoadingIndicator;