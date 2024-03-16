import './App.css';
import io from 'socket.io-client';
import React from 'react';
import { useState, useEffect} from 'react';

function App() {
  const [socket, setSocket] = useState(null);
  const [pid, setPID] = useState(-1);
  const [gid, setGID] = useState(-1);
  
  useEffect(() => {
    const newSocket = io('http://localhost:5000');
    setSocket(newSocket);
  }, []);

  const createLobby = () => {
    socket.emit('LOBBY_CREATE');
    socket.on('message', function (data) {
      console.log(data);
      setPID(data[0]);
      setGID(data[1]);
    });
  }

  return (
    <div className="App">
      <header >
        Clue-less
      </header>
      
        {/* buttons for each message */}
        <button onClick={() => createLobby()}>Create Lobby</button>
        <div>
          The PID: {pid}
        </div>
        <div>The GID: {gid}</div>
      
    </div>
  );
}

export default App;
