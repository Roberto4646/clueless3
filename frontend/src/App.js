import './App.css';
import io from 'socket.io-client';
import React from 'react';
import { useState, useEffect} from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Link } from 'react-router-dom';


import GameLobbyPage from './components/GameLobbyPage';
import CreateLobbyPage from './components/CreateLobbyPage';
import MainGamePage from './components/MainGamePage';
import NotificationChatbox from './components/NotificationChatbox';

import clueless_logo from './clueless_logo.png';

const dummyBoard = [
  ['Mrs. Peacock', 'Billiard Room'],
  ['Professor Plum', 'Professor Plum Start'],
  ['Miss Scarlet', 'Miss Scarlet Start'],
  ['Colonel Mustard', 'Colonel Mustard Start'],
  ['Mr. Green', 'Mr. Green Start'],
  ['Mrs. White', 'Mrs. White Start'],
  ['Rope', 'Hall'],
  ['Lead Pipe', 'Kitchen'],
  ['Knife', 'Ballroom'],
  ['Wrench', 'Conservatory'],
  ['Candlestick', 'Library'],
  ['Revolver', 'Billiard Room']
]

const dummyTurnOrder = ['Miss Scarlet', 'Mrs. Peacock', 'Colonel Mustard', 'Mr. Green', ,'Mrs. White', 'Professor Plum']

function App() {
  const [socket, setSocket] = useState(null);
  const [pid, setPID] = useState(-1);
  const [gid, setGID] = useState(-1);
  const [gameStatus, setGameStatus] = useState('NONE');  // controls what screen you're on
  const [notifBanner, setNotifBanner] = useState("");
  const [gidInput, setGIDInput] = useState("");
  const [lobbyList, setLobbyList] = useState([]);
  const [charName, setCharName] = useState("");
  const [actions, setActions] = useState([]);
  const [hand, setHand] = useState([]);
  const [turnOrder, setTurnOrder] = useState([]);
  // const [turnOrder, setTurnOrder] = useState(dummyTurnOrder);
  const [turnCurr, setTurnCurr] = useState("");
  const [board, setBoard] = useState([]);
  // const [board, setBoard] = useState(dummyBoard);
  const [suggestion, setSuggestion] = useState([]); // just temp for skeletal
  const [moveChoices, setMoveChoices] = useState([]); // just temp for skeletal
  const [playerName, setPlayerName] = useState("")

  const initial_chatLog = {timestamp: (new Date()).toLocaleTimeString(), message: "This is where game notifications appear"};
  let [chatLog, setChatLog] = useState([]);

  const addToChatLog = (notif) => {
    setChatLog((prevChatLog) => {
      const new_entry = { timestamp: new Date().toLocaleTimeString(), message: notif };
      return [...prevChatLog, new_entry];
    });
  };
  
  useEffect(() => {
    const newSocket = io('http://localhost:5000');
    setSocket(newSocket);
  }, []);

  // Set up listeners
  useEffect(() => {
    if (socket != null) {
      socket.on('NOTIFICATION', function (data) {
        setNotifBanner(data[0]);
        addToChatLog(data[0]);
      });

      socket.on('LOBBY_CODE', function (data) {
        setPID(data[0]);
        setGID(data[1]);
      });

      socket.on('LOBBY_STATUS', function (data) {
        setLobbyList(data);
      });

      socket.on('GAME_STATUS', function (data) {
        setGameStatus(data[0]);
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
        setTurnOrder(data[0]);
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
    socket.emit('LOBBY_CREATE', playerName);
  }

  const joinLobby = () => {
    socket.emit('LOBBY_JOIN', [gidInput, playerName]);
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
    var suspectE = document.getElementById("suggestSuspects");
    var weaponE = document.getElementById("suggestWeapons");
    var suspect = suspectE.options[suspectE.selectedIndex].text;
    var weapon = weaponE.options[weaponE.selectedIndex].text;

    if (suspect && weapon){
      socket.emit("TURN_ACTION", ["SUGGEST", suspect, weapon]);
    } else{
      console.log("Please select both")
    }
  }

  const accuse = () => {
    var suspectE = document.getElementById("accuseSuspects");
    var roomE = document.getElementById("accuseRoom");
    var weaponE = document.getElementById("accuseWeapons");
    var suspect = suspectE.options[suspectE.selectedIndex].text;
    var room = roomE.options[roomE.selectedIndex].text;
    var weapon = weaponE.options[weaponE.selectedIndex].text;
    
    if (suspect && weapon && room){
      socket.emit("TURN_ACTION", ["ACCUSE", suspect, room, weapon]);
    } else{
      console.log("Please select both")
    }
  }

  const disprove = () => {
    var proofE = document.getElementById("proof");
    var proof = proofE.options[proofE.selectedIndex].text;

    if (proof) {
      socket.emit("TURN_ACTION", ["SUGGEST", proof]);
    } else {
      socket.emit("TURN_ACTION", ["SUGGEST", ""]);
    }
    
    setSuggestion([]);
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
    var output = ""
    
    for(var i = 0; i < board.length; i++) {
      //<char> is in <location> 
      output += board[i][0] + " is at " + board[i][1] + "\n";
    }
    return output;
    // {output}
  }

  const renderMainMenuButton = () => {
    return (<div className='button-custom' onClick={setGameStatus('NONE')}><Link className='link' to="/">Main Menu</Link></div>);
  }

  const renderLobbyList = () => {
    return lobbyList.map((entry) =>
      <div key={entry}>{entry}</div>)
  }
  const renderDisprove = () => {
    const commonItems = hand.filter(item => suggestion.includes(item));

    if (suggestion.length > 0) {
      return (
        <div>
          <button className="button-modern" onClick={() => disprove()}>Disprove</button>
          <form>
            <label htmlFor="proof">Proof:</label>
            <select id="proof" name="proof" style={{ whiteSpace: 'pre-wrap' }}>  {/* Added inline style */}
              <option value="" selected disabled hidden>Choose Proof</option>
              {commonItems.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </form>
        </div>
      );
    }
    
  }

  const renderMoveChoice = (data) => {
    return (
      <button className="button-modern" onClick={() => socket.emit("TURN_ACTION", ["MOVE", data])}> {data} </button>
    )
  }
  
  const renderAccusation = () => {
    if (turnCurr !== charName || !actions[2]) {
      return (
        <div>
          <button className="button-modern" disabled>Make Accusation</button>
        </div>
      );
    }

    return (
      <div>
        <button className="button-modern" onClick={() => accuse()}>Make Accusation</button>
        <form>
          <label htmlFor="accuseSuspects">Suspect:</label>
          <select id="accuseSuspects" name="accuseSuspects">
            <option value="" selected disabled hidden></option>
            <option value="Colonel Mustard">Colonel Mustard</option>
            <option value="Miss Scarlet">Miss Scarlet</option>
            <option value="Professor Plum">Professor Plum</option>
            <option value="Mr. Green">Mr. Green</option>
            <option value="Mrs. White">Mrs. White</option>
            <option value="Mrs. Peacock">Mrs. Peacock</option>
          </select>
  
          <label style={{ marginLeft: '7px' }} htmlFor="accuseWeapons">Weapon:</label>
          <select id="accuseWeapons" name="accuseWeapons">
            <option value="" selected disabled hidden></option>
            <option value="Rope">Rope</option>
            <option value="Lead Pipe">Lead Pipe</option>
            <option value="Knife">Knife</option>
            <option value="Wrench">Wrench</option>
            <option value="Candlestick">Candlestick</option>
            <option value="Revolver">Revolver</option>
          </select>
  
          <label style={{ marginLeft: '7px' }} htmlFor="accuseRoom">Room:</label>
          <select id="accuseRoom" name="accuseRoom">
            <option value="" selected disabled hidden></option>
            <option value="Study">Study</option>
            <option value="Hall">Hall</option>
            <option value="Lounge">Lounge</option>
            <option value="Library">Library</option>
            <option value="Billiard Room">Billiard Room</option>
            <option value="Dining Room">Dining Room</option>
            <option value="Conservatory">Conservatory</option>
            <option value="Ballroom">Ballroom</option>
            <option value="Kitchen">Kitchen</option>
          </select>
        </form>
      </div>
    );
  };

  const renderSuggestion = () => {
    if (turnCurr !== charName || !actions[1]) {
      return (
        <div>
          <button className="button-modern" disabled>Make Suggestion</button>
        </div>
      );
    }

    return (
      <div>
        <button className="button-modern" onClick={() => suggest()}>Make Suggestion</button>
        <form>
          <label htmlFor="suggestSuspects">Suspect:</label>
          <select id="suggestSuspects" name="suggestSuspects">
            <option value="" selected disabled hidden></option>
            <option value="Colonel Mustard">Colonel Mustard</option>
            <option value="Miss Scarlet">Miss Scarlet</option>
            <option value="Professor Plum">Professor Plum</option>
            <option value="Mr. Green">Mr. Green</option>
            <option value="Mrs. White">Mrs. White</option>
            <option value="Mrs. Peacock">Mrs. Peacock</option>
          </select>
  
          <label style={{ marginLeft: '7px' }} htmlFor="suggestWeapons">Weapon:</label>
          <select id="suggestWeapons" name="suggestWeapons">
            <option value="" selected disabled hidden></option>
            <option value="Rope">Rope</option>
            <option value="Lead Pipe">Lead Pipe</option>
            <option value="Knife">Knife</option>
            <option value="Wrench">Wrench</option>
            <option value="Candlestick">Candlestick</option>
            <option value="Revolver">Revolver</option>
          </select> 
        </form>
      </div>
    );
  };
  
  return (
    <div className='split-screen'>
      <div className='main-screen'>
        <div className='center'>
        <img src={clueless_logo} alt="Clue-less logo" className='clueless_logo'/>
        </div>
        <Router >
          <Routes>
            <Route path="/" element={<CreateLobbyPage
              onCreateLobby={createLobby}
              onJoinLobby={joinLobby}
              gidInput={gidInput}
              setGIDInput={setGIDInput}
              playerName={playerName}
              setPlayerName={setPlayerName}
              gameStatus={gameStatus}
            />} />
            <Route path="/game-lobby" element={<GameLobbyPage
              onStartGame={startGame}
              pid={pid}
              playerName={playerName}
              gid={gid}
              renderLobbyList={renderLobbyList}
              gameStatus={gameStatus}
              renderMainMenuButton={renderMainMenuButton}
            />} />
            <Route path="/main-game" element={<MainGamePage
              startGame={startGame}
              renderAccusation={renderAccusation}
              move={move}
              moveChoices={moveChoices}
              renderMoveChoice={renderMoveChoice}
              endTurn={endTurn}
              renderHand={renderHand}
              notifBanner={notifBanner}
              renderLobbyList={renderLobbyList}
              turnCurr={turnCurr}
              renderBoard={renderBoard}
              board={board}
              renderSuggestion={renderSuggestion}
              renderDisprove={renderDisprove}
              charName={charName}
              actions={actions}
              turnOrder={turnOrder}
            />} />
          </Routes>
        </Router>
      </div>
      <div className='chatbox'>
        <NotificationChatbox notifications={chatLog} />

      </div>
    </div>
  );
}

export default App;
/*
<div> Player Hand: {renderHand()} </div>
<div> Turn Order: {renderTurnOrder()} </div>
<div> Disprove this Suggestion: {renderSuggestion()} </div> 
</div>
<div className="right-box">
<header class="box-header">
  Dynamic Info
</header>
<div> Current Notification : {notifBanner} </div>
<div> Available Actions: {renderActions()} </div>
<div> Current Turn: {turnCurr} </div>
<div> Lobby Members: <pre>{renderLobbyList()}</pre></div>
<div> Board: <pre>{renderBoard()}</pre> </div>
*/