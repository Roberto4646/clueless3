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
  const [moveChoices, setMoveChoices] = useState([]); // just temp for skeletal
  
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

      socket.on('LOBBY_CODE', function (data) {
        setPID(data[0]);
        setGID(data[1]);
      });

      socket.on('LOBBY_STATUS', function (data) {
        setLobbyList(data.join());
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

      socket.on('MOVE_CHOICES', function (data) {
        setMoveChoices(data);
      });
    }
  }, [socket]);

  // Client Actions ------------------------------------------------
  const createLobby = () => {
    socket.emit('LOBBY_CREATE');
  }

  const joinLobby = () => {
    socket.emit('LOBBY_JOIN', gidInput);
    setGIDInput("");
  }

  const startGame = () => {
    socket.emit("GAME_START", gid);
  }

  const endTurn = () => {
    socket.emit("TURN_ACTION", ["END_TURN"]);
  }

  const move = () => {
    socket.emit("TURN_ACTION", ["MOVE"]);
  }

  const suggest = () => {
    // TODO: Send form input in the TURN_ACTION message
    socket.emit("TURN_ACTION", ["SUGGEST"]);
  }

  const accuse = () => {
    // TODO: Send form input in the TURN_ACTION message
    socket.emit("TURN_ACTION", ["ACCUSE"]);
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

  const renderMoveChoice = (data) => {
    return (
      <button onClick={() => socket.emit("TURN_ACTION", ["MOVE", data])}> {data} </button>
    )
  }

  const renderAccusation = () => {
    return (
      <div>
        <button onClick={() => accuse()}>Make Accusation</button>
        {/* TODO: Make form for accusation choices*/}
        {/* <form>
          <fieldset id="suspects">
            <label><input type="radio" value="Colonel Mustard" name="suspects"></input>Colonel Mustard</label>
            <label><input type="radio" value="Miss Scarlet" name="suspects"></input>Miss Scarlet</label>
            <label><input type="radio" value="Professor Plum" name="suspects"></input>Professor Plum</label>
            <label><input type="radio" value="Mr.Green" name="suspects"></input>Mr.Green</label>
            <label><input type="radio" value="Mrs.White" name="suspects"></input>Mrs.White</label>
            <label><input type="radio" value="Mrs.Peacock" name="characters"></input>Mrs.Peacock</label>
          </fieldset>
          <fieldset id="weapons">
            <label><input type="radio" value="Rope" name="weapons"></input>Rope</label>
            <label><input type="radio" value="Lead Pipe" name="weapons"></input>Lead Pipe</label>
            <label><input type="radio" value="Knife" name="weapons"></input>Knife</label>
            <label><input type="radio" value="Wrench" name="weapons"></input>Wrench</label>
            <label><input type="radio" value="Candlestick" name="weapons"></input>Candlestick</label>
            <label><input type="radio" value="Revolver" name="weapons"></input>Revolver</label>
          </fieldset>
          <fieldset id="room">
            <label><input type="radio" value="Study" name="room"></input>Study</label>
            <label><input type="radio" value="Hall" name="room"></input>Hall</label>
            <label><input type="radio" value="Lounge" name="room"></input>Lounge</label>
            <label><input type="radio" value="Library" name="room"></input>Library</label>
            <label><input type="radio" value="Billiard Room" name="room"></input>Billiard Room</label>
            <label><input type="radio" value="Dining Room" name="room"></input>Dining Room</label>
            <label><input type="radio" value="Conservatory" name="room"></input>Conservatory</label>
            <label><input type="radio" value="Ballroom" name="room"></input>Ballroom</label>
            <label><input type="radio" value="Kitchen" name="room"></input>Kitchen</label>
          </fieldset>
        </form> */}
      </div>
      
    )
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
        <div><button onClick={() => move()}>Move</button></div>
        <div> Move Choices: {moveChoices.map(renderMoveChoice, this)} </div> {/* temp for skeletal */}
        <div><button onClick={() => suggest()}>Make Suggestion</button></div>
        {renderAccusation()}
        <div><button onClick={() => endTurn()}>End Turn</button></div>
        
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
