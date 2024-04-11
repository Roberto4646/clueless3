import React from 'react';
import '../App.css';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

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
      <div className="App">
        <header className="header">
          Clue-less
        </header>
        <div className="left-box">
          <header className="box-header">
            Options
          </header>
          <div className="button-column">
            <div><button className="button-modern" onClick={handleCreateLobby}>Create Lobby</button></div>
            <div>
              <button className="button-modern" onClick={handleJoinLobby}>Join Lobby</button>
              <input type="text" className="input-modern" value={gidInput} onChange={e => setGIDInput(e.target.value)} />
            </div>
          </div>
        </div>
      </div>
    );
  }

export default CreateLobbyPage;
