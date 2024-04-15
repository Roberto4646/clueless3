import React from 'react';
import '../App.css';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

function JoinLobbyPage({ pid, gid, charName, renderLobbyList}) {
  const navigate = useNavigate();
  React.useEffect(() => {
    if (charName !== ""){
        navigate('/main-game');
    } 
    // Add other useEffect dependencies as needed
  }, [charName]);

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
            <div> Lobby Members: <pre>{renderLobbyList()}</pre></div>
            <div><Link className="button-modern" to="/">Back to MainMenu</Link></div>
          </div>
        </div>
      </div>
    );
  }
  

export default JoinLobbyPage;