import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import './Message.css';

const Message = ({ message }) => {
  const { content, sender, timestamp } = message;
  const isAi = sender === 'ai';

  return (
    <div className={`message ${isAi ? 'ai-message' : 'user-message'}`}>
      <div className="message-sender">
        {isAi ? 'DeepSeek-Coder' : 'Du'}
      </div>
      <div className="message-content">
        {isAi ? (
          <ReactMarkdown
            components={{
              code({node, inline, className, children, ...props}) {
                const match = /language-(\w+)/.exec(className || '');
                return !inline && match ? (
                  <SyntaxHighlighter
                    style={vscDarkPlus}
                    language={match[1]}
                    PreTag="div"
                    {...props}
                  >
                    {String(children).replace(/\n$/, '')}
                  </SyntaxHighlighter>
                ) : (
                  <code className={className} {...props}>
                    {children}
                  </code>
                );
              }
            }}
          >
            {content}
          </ReactMarkdown>
        ) : (
          content
        )}
      </div>
      <div className="message-time">
        {new Date(timestamp).toLocaleTimeString()}
      </div>
    </div>
  );
};

export default Message;