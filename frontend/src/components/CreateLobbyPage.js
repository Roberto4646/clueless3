import React from 'react';
import '../App.css';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import NotificationChatbox from './NotificationChatbox';

function CreateLobbyPage({ onCreateLobby, onJoinLobby, gidInput, setGIDInput }) {
  const navigate = useNavigate();

  const handleCreateLobby = () => {
    onCreateLobby();
    navigate('/game-lobby'); // Navigate to GameLobbyPage after creating lobby
  }

  const handleJoinLobby = () => {
    onJoinLobby();
    navigate('/game-lobby'); // Navigate to GameLobbyPage after creating lobby
  }
    return (

      <div>
        <div style={{color: "#fff"}}>
          <button className="button-custom extra-right-margin" onClick={handleCreateLobby}>Create Lobby</button>
          generate a lobby code for your friends
        </div>
        <button className="button-custom extra-right-margin" onClick={handleJoinLobby}>Join Lobby</button>
          <input type="text" className="text-entry" value={gidInput} onChange={e => setGIDInput(e.target.value)} />
      </div>

    );
  }

export default CreateLobbyPage;
