import React from 'react';
import '../App.css';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

function GameLobbyPage({ onStartGame, pid, gid, renderLobbyList, gameStatus}) {
  const navigate = useNavigate();

  const handleStartGame = () => {
    onStartGame();

    // if (gameStatus == "IN PROGRESS") {
    //   navigate('/main-game'); // Navigate to MainGamePage after starting the game
    // }
  }

  React.useEffect(() => {
    console.log(pid); // Ensure that pid is updated
    if (gameStatus == "IN PROGRESS"){
      navigate('/main-game');
    } 
    // Add other useEffect dependencies as needed
  }, [pid, gameStatus]);
  
    // return (
    //   <div className="App">
    //     <header className="header">
    //       Clue-less
    //     </header>
    //     <div className="left-box">
    //       <header className="box-header">
    //         Options
    //       </header>
    //       <div className="button-column">
    //         {pid !== -1 && <div>Lobby Code: {gid}</div>}
    //         {pid !== -1 && <div>Player ID: {pid}</div>}
    //         <div> Lobby Members: <pre>{renderLobbyList()}</pre></div>
    //         <div><button className="button-modern" onClick={handleStartGame}>Start Game</button></div>
    //         <div><Link className="button-modern" to="/">Back to MainMenu</Link></div>
    //       </div>
    //     </div>
    //   </div>
    // );

  return (
    <div style={{textAlign:"-webkit-center"}}>
      {pid !== -1 && <div>Lobby Code: {gid}</div>}
      {pid !== -1 && <div>Player ID: {pid}</div>}
      <br/>
      <div> Lobby Members: {renderLobbyList()}</div>
      <br/>
      <div style={{display: "inline-flex"}}>
      <div className='button-custom'><Link className='link' to="/">Main Menu</Link></div>
      <button className="button-custom" onClick={handleStartGame}>Start Game</button>
      </div>
    </div>
    )
  }
  

export default GameLobbyPage;
