import './App.css';
import io from 'socket.io-client';
import React from 'react';
import { useState, useEffect} from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';


import GameLobbyPage from './components/GameLobbyPage';
import CreateLobbyPage from './components/CreateLobbyPage';
import MainGamePage from './components/MainGamePage';

function App() {
  const [socket, setSocket] = useState(null);
  const [pid, setPID] = useState(-1);
  const [gid, setGID] = useState(-1);
  const [notifBanner, setNotifBanner] = useState("");
  const [gidInput, setGIDInput] = useState("");
  const [lobbyList, setLobbyList] = useState([]);
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
        setLobbyList(data);
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
    var suspect, weapon
    var suspectRadios = document.getElementsByName("suspects");
    var weaponRadios = document.getElementsByName("weapons");
    for(var i = 0; i < suspectRadios.length; i++) {
        if(suspectRadios[i].checked) {
          suspect = suspectRadios[i].value;
          console.log(suspectRadios[i].value);
          break;
        }
    }
    for(i = 0; i < weaponRadios.length; i++) {
      if(weaponRadios[i].checked) {
        weapon = weaponRadios[i].value;
        console.log(weaponRadios[i].value);
        break;
      }
    }
    
    socket.emit("TURN_ACTION", ["SUGGEST", suspect, weapon]);
  }

  const accuse = () => {
    var suspect, room, weapon
    var suspectRadios = document.getElementsByName("suspects");
    var roomRadios = document.getElementsByName("room");
    var weaponRadios = document.getElementsByName("weapons");
    for(var i = 0; i < suspectRadios.length; i++) {
        if(suspectRadios[i].checked) {
          suspect = suspectRadios[i].value;
          console.log(suspectRadios[i].value);
          break;
        }
    }
    for(i = 0; i < weaponRadios.length; i++) {
      if(weaponRadios[i].checked) {
        weapon = weaponRadios[i].value;
        console.log(weaponRadios[i].value);
        break;
      }
    }
    for(i = 0; i < roomRadios.length; i++) {
      if(roomRadios[i].checked) {
        room = roomRadios[i].value;
        console.log(roomRadios[i].value);
        break;
      }
    }
    
    socket.emit("TURN_ACTION", ["ACCUSE", suspect, room, weapon]);
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
    console.log(board)
    var output = ""
    
    for(var i = 0; i < board.length; i++) {
      //<char> is in <location> 
      output += board[i][0] + " is at " + board[i][1] + "\n";
    }
    return output;
    // {output}
  }

  const renderLobbyList = () => {
    var output = ""

    for(var i = 0; i < lobbyList.length; i++) {
      //<char> is in <location> 
      output += lobbyList[i] + "\n";
    }
    return output;
    // {output}
  }
  const renderSuggestion = () => {
    return suggestion.join();
  }

  const renderMoveChoice = (data) => {
    return (
      <button className="button-modern" onClick={() => socket.emit("TURN_ACTION", ["MOVE", data])}> {data} </button>
    )
  }

  const renderAccusation = () => {
    return (
      <div>
        <button className="button-modern" onClick={() => accuse()}>Make Accusation</button>
        {<form>
          <fieldset id="suspects">
            <label><input type="radio" class="radio-button" value="Colonel Mustard" name="suspects"></input>Colonel Mustard</label>
            <label><input type="radio" class="radio-button" value="Miss Scarlet" name="suspects"></input>Miss Scarlet</label>
            <label><input type="radio" class="radio-button" value="Professor Plum" name="suspects"></input>Professor Plum</label>
            <label><input type="radio" class="radio-button" value="Mr. Green" name="suspects"></input>Mr.Green</label>
            <label><input type="radio" class="radio-button" value="Mrs. White" name="suspects"></input>Mrs.White</label>
            <label><input type="radio" class="radio-button" value="Mrs. Peacock" name="suspects"></input>Mrs.Peacock</label>
          </fieldset>
          <fieldset id="weapons">
            <label><input type="radio" class="radio-button" value="Rope" name="weapons"></input>Rope</label>
            <label><input type="radio" class="radio-button" value="Lead Pipe" name="weapons"></input>Lead Pipe</label>
            <label><input type="radio" class="radio-button" value="Knife" name="weapons"></input>Knife</label>
            <label><input type="radio" class="radio-button" value="Wrench" name="weapons"></input>Wrench</label>
            <label><input type="radio" class="radio-button" value="Candlestick" name="weapons"></input>Candlestick</label>
            <label><input type="radio" class="radio-button" value="Revolver" name="weapons"></input>Revolver</label>
          </fieldset>
          <fieldset id="room">
            <label><input type="radio" class="radio-button" value="Study" name="room"></input>Study</label>
            <label><input type="radio" class="radio-button" value="Hall" name="room"></input>Hall</label>
            <label><input type="radio" class="radio-button" value="Lounge" name="room"></input>Lounge</label>
            <label><input type="radio" class="radio-button" value="Library" name="room"></input>Library</label>
            <label><input type="radio" class="radio-button" value="Billiard Room" name="room"></input>Billiard Room</label>
            <label><input type="radio" class="radio-button" value="Dining Room" name="room"></input>Dining Room</label>
            <label><input type="radio" class="radio-button" value="Conservatory" name="room"></input>Conservatory</label>
            <label><input type="radio" class="radio-button" value="Ballroom" name="room"></input>Ballroom</label>
            <label><input type="radio" class="radio-button" value="Kitchen" name="room"></input>Kitchen</label>
          </fieldset>
        </form>}
      </div>
      
    )
  }

  return (
    <Router>
        <Routes>
          <Route path="/" element={<CreateLobbyPage
              onCreateLobby={createLobby}
              onJoinLobby={joinLobby}
              gidInput={gidInput}
              setGIDInput={setGIDInput} 
              />} />
          <Route path="/game-lobby" element={<GameLobbyPage onStartGame={startGame} />} />
          <Route path="/main-game" element={<MainGamePage
              startGame={startGame}
              suggest={suggest}
              renderAccusation={renderAccusation}
              move={move}
              moveChoices={moveChoices}
              renderMoveChoice={renderMoveChoice}
              endTurn={endTurn}
            />} />
        </Routes>
    </Router>
  );
}

export default App;
