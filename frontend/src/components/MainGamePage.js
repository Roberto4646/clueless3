import React from 'react';
import '../App.css';
import { Link } from 'react-router-dom';

function MainGamePage({ suggest, renderAccusation, move, moveChoices, renderMoveChoice, endTurn }) {
    return (
      <div className="App">
        {/* Your existing main game UI component */}
        <div className="button-column">
          <div><button className="button-modern" onClick={suggest}>Make Suggestion</button></div>
          {renderAccusation()}
          <div><button style={{ marginRight: "15px" }} className="button-modern" onClick={move}>Move</button>
            Move Choices: {moveChoices.map(renderMoveChoice)} </div>
          <div><button className="button-modern" onClick={endTurn}>End Turn</button></div>
        </div>
      </div>
    );
  }

export default MainGamePage;

