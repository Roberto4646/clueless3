import React from 'react';
import '../App.css';
import { Link } from 'react-router-dom';

function CreateLobbyPage({ onCreateLobby, onJoinLobby, gidInput, setGIDInput }) {
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
            <div><button className="button-modern" onClick={onCreateLobby}>Create Lobby</button></div>
            <div>
              <button className="button-modern" onClick={onJoinLobby}>Join Lobby</button>
              <input type="text" className="input-modern" value={gidInput} onChange={e => setGIDInput(e.target.value)} />
            </div>
          </div>
        </div>
      </div>
    );
  }

export default CreateLobbyPage;
