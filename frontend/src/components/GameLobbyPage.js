import React from 'react';
import '../App.css';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

function GameLobbyPage({ onStartGame, pid, gid }) {
  const navigate = useNavigate();

  const handleStartGame = () => {
    onStartGame();
    navigate('/main-game'); // Navigate to MainGamePage after starting the game
  }
  React.useEffect(() => {
    console.log(pid); // Ensure that pid is updated

    // Add other useEffect dependencies as needed
  }, [pid]);
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
            {pid !== -1 && <div>Lobby Code: {gid}</div>}
            {pid !== -1 && <div>Player ID: {pid}</div>}
            <div><button className="button-modern" onClick={handleStartGame}>Start Game</button></div>
            <div><Link className="button-modern" to="/">Back to MainMenu</Link></div>
          </div>
        </div>
      </div>
    );
  }
  

export default GameLobbyPage;
