import React from 'react';
import { useState } from 'react';
import '../App.css';

const NotificationChatbox = ({notifications, sendChat}) => {
  const chatlog = notifications.map((entry) =>
  <div key={entry.timestamp}>[{entry.timestamp}] {entry.message}</div>
);

  const [input, setInput] = useState("");
  const handleSendChat = (e) => {
    e.preventDefault();
    sendChat(input);
    setInput('');
  }

  return (
    <div>
      <h1 style={{textAlign:"center"}}>Notifications</h1>
      
      <div className='chatlog'>{chatlog}</div>

      <form onSubmit={handleSendChat}>
        <label for="chatEntry">Chat: </label> 
        <input type="text" className="text-entry" name="chatEntry" value={input} onChange={e => setInput(e.target.value)}/>
        <button type="submit" className="button-custom" onClick={handleSendChat}>Submit</button>
      </form>
    </div>
  );
}

export default NotificationChatbox;
