import React from 'react';
import '../App.css';
import { Link } from 'react-router-dom';

function GameLobbyPage({ onStartGame }) {
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
            <div><button className="button-modern">Start Game</button></div>
            <div><Link className="button-modern" to="/main-game">Back to Game</Link></div>
          </div>
        </div>
      </div>
    );
  }
  

export default GameLobbyPage;
