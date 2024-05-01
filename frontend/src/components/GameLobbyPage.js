import React from 'react';
import '../App.css';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

function GameLobbyPage({ onStartGame, pid, playerName, gid, renderLobbyList, renderMainMenuButton, gameStatus}) {
  const navigate = useNavigate();

  const handleStartGame = () => {
    onStartGame();
  }

  React.useEffect(() => {
    console.log(pid); // Ensure that pid is updated
    if (gameStatus == "GAME STARTED"){
      navigate('/main-game');
    } 
  }, [pid, gameStatus]);
  
  return (
    <div style={{ textAlign: "-webkit-center" }}>
      {pid !== -1 && <div>Lobby Code: {gid}</div>}
      {pid !== -1 && <div>Player ID: {pid} ({playerName})</div>}
      <br />
      <div> Lobby Members: {renderLobbyList()}</div>
      <br />
      <div style={{ display: "inline-flex" }}>
        {renderMainMenuButton()}
        <button className="button-custom" onClick={handleStartGame}>Start Game</button>
      </div>
    </div>
  )
}
  

export default GameLobbyPage;
