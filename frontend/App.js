import './App.css';
import io from 'socket.io-client';
import React from 'react';
import { useState, useEffect} from 'react';

function App() {
  const [socket, setSocket] = useState(null);
  const [pid, setPID] = useState(-1);
  const [gid, setGID] = useState(-1);
  const [notifBanner, setNotifBanner] = useState("");
  const [gidInput, setGIDInput] = useState("");
  const [lobbyList, setLobbyList] = useState("");
  const [charName, setCharName] = useState("");
  const [actions, setActions] = useState([]);
  const [hand, setHand] = useState([]);
  const [turnOrder, setTurnOrder] = useState([]);
  const [turnCurr, setTurnCurr] = useState("");
  const [board, setBoard] = useState([]);
  const [suggestion, setSuggestion] = useState([]); // just temp for skeletal
  
  useEffect(() => {
    const newSocket = io('http://localhost:5000');
    setSocket(newSocket);
  }, []);

  // Set up listeners
  useEffect(() => {
    if (socket != null) {
      socket.on('NOTIFICATION', function (data) {
        setNotifBanner(data[0]);
      });

      socket.on('PLAYER_WHOAMI', function (data) {
        setCharName(data[0]);
      });

      socket.on('PLAYER_ACTIONS', function (data) {
        setActions(data);
      });

      socket.on('PLAYER_HAND', function (data) {
        setHand(data);
      });

      socket.on('TURN_ORDER', function (data) {
        setTurnOrder(data);
      });

      socket.on('TURN_CURRENT', function (data) {
        setTurnCurr(data[0]);
      });

      socket.on('GAME_BOARD', function (data) {
        setBoard(data);
      });

      socket.on('REQUEST_PROOF', function (data) {
        setSuggestion(data);
      });
    }
  }, [socket]);

  // Client Actions ------------------------------------------------
  const createLobby = () => {
    socket.emit('LOBBY_CREATE');
    socket.on('LOBBY_CODE', function (data) {
      setPID(data[0]);
      setGID(data[1]);
      setLobbyList(lobbyList+pid+", ");
    });
  }

  const joinLobby = () => {
    socket.emit('LOBBY_JOIN', gidInput);
    socket.on('LOBBY_STATUS', function (data) {
      setPID(data[0]);
      setGID(data[1]);
      setLobbyList(lobbyList+pid+", ");
    });
  }

  const startGame = () => {
    socket.emit("GAME_START", gid);
  }

  // HTML Rendering --------------------------------------------------
  const renderActions = () => {
    return actions.join();
  }

  const renderHand = () => {
    return hand.join();
  }
  
  const renderTurnOrder = () => {
    return turnOrder.join();
  }
  
  const renderBoard = () => {
    return board.join();
  }

  const renderSuggestion = () => {
    return suggestion.join();
  }

  return (
    <div className="App">
      <header>
        Clue-less
      </header>
      
        {/* buttons for each message */}
        <div><button onClick={() => createLobby()}>Create Lobby</button></div>
        <div>
          <button onClick={() => joinLobby()}>Join Lobby</button>
          <input type="text" value={gidInput} onChange={e => setGIDInput(e.target.value)} />
        </div>
        <div><button onClick={() => startGame()}>Start Game</button></div>
        
        {/* display info */}
        <div> The PID: {pid} </div>
        <div> The GID: {gid} </div>
        <div> Current Notification : {notifBanner} </div>
        <div> Character Name: {charName} </div>
        <div> Available Actions: {renderActions()} </div>
        <div> Player Hand: {renderHand()} </div>
        <div> Turn Order: {renderTurnOrder()} </div>
        <div> Current Turn: {turnCurr} </div>
        <div> Board: {renderBoard()} </div>
        <div> Disprove this Suggestion: {renderSuggestion()} </div> {/* temp for skeletal */}
        <div> Lobby Members: {lobbyList}</div>
      
    </div>
  );
}

export default App;
