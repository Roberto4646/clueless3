import React from 'react';
import '../App.css';

const NotificationChatbox = ({notifications}) => {
  const chatlog = notifications.map((entry) =>
  <div key={entry.timestamp}>[{entry.timestamp}] {entry.message}</div>
);

  return (
    <div>
      <h1 style={{textAlign:"center"}}>Notifications</h1>
      
      <div className='chatlog'>{chatlog}</div>

    </div>
  );
}

export default NotificationChatbox;
