import React, { useEffect } from 'react';
import { Widget, addResponseMessage } from 'react-chat-widget';
import 'react-chat-widget/lib/styles.css';
import axios from 'axios';

const ChatWidget = () => {
  useEffect(() => {
    addResponseMessage('Welcome to the chat!');
  }, []);

  const handleNewUserMessage = (newMessage) => {
    console.log(`New message incoming! ${newMessage}`);
    // Send message to Rasa server
    axios.post('http://localhost:5005/webhooks/rest/webhook', {
      sender: 'user',
      message: newMessage
    }).then(response => {
      if (response.data.length > 0) {
        response.data.forEach(res => {
          if (res.text) {
            addResponseMessage(res.text);
          }
        });
      }
    }).catch(error => {
      console.error('Error sending message to Rasa server:', error);
    });
  };

  return (
    <div>
      <Widget style="background-color: red"
        handleNewUserMessage={handleNewUserMessage}
        title="Espritook Chatbot"
        subtitle="How can I help you?"
      />
    </div>
  );
};

export default ChatWidget;
