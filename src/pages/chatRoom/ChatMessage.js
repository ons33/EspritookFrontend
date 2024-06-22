import React from 'react';

const ChatMessage = ({ message, user }) => {
  const { senderId, message: text } = message;
  const messageClass = senderId === user.uid ? 'sent' : 'received';

  return (
    <div className={`message ${messageClass}`}>
      <p>{text}</p>
    </div>
  );
};

export default ChatMessage;
