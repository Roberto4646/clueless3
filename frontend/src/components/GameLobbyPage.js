import React from 'react';
import '../App.css';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

function GameLobbyPage({ onStartGame }) {
  const navigate = useNavigate();

  const handleStartGame = () => {
    onStartGame();
    navigate('/main-game'); // Navigate to MainGamePage after starting the game
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
            <div><button className="button-modern" onClick={handleStartGame}>Start Game</button></div>
            <div><Link className="button-modern" to="/main-game">Back to Game</Link></div>
          </div>
        </div>
      </div>
    );
  }
  

export default GameLobbyPage;
