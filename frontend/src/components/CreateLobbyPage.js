import React from 'react';
import '../App.css';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import NotificationChatbox from './NotificationChatbox';

function CreateLobbyPage({ onCreateLobby, onJoinLobby, gidInput, setGIDInput, playerName, setPlayerName, gameStatus }) {
  const navigate = useNavigate();

  const handleCreateLobby = () => {
    onCreateLobby();
  }

  const handleJoinLobby = () => {
    onJoinLobby();
  }

  React.useEffect(() => {
    if (gameStatus == "IN LOBBY"){
      navigate('/game-lobby');
    } 
  }, [gameStatus]);

    return (

      <div>
        <div style={{color: "#fff"}}>
          <button className="button-custom extra-right-margin" onClick={handleCreateLobby}>Create Lobby</button>
          generate a lobby code for your friends
        </div>
        <div>
          <button className="button-custom extra-right-margin" onClick={handleJoinLobby}>Join Lobby</button>
          <input type="text" className="text-entry" value={gidInput} onChange={e => setGIDInput(e.target.value)} />
        </div>
        <div style={{color: "#fff"}}>
          <label for="nameBox">Enter your name:</label>
          <input type="text" className="text-entry" name="nameBox" value={playerName} onChange={e => setPlayerName(e.target.value)}/>
        </div>
      </div>

    );
  }

export default CreateLobbyPage;
