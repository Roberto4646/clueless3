import React from 'react';
import '../App.css';
import Map from './MapComponent';


const renderTurnOrder = (turnOrder, turnCurr, charName) => {
  if (!turnOrder) return;
  return turnOrder.map((player) => {
    return <div style={{display:'flex'}}>
          <div className='piece-circle' style={{backgroundColor: (turnCurr == player) ? 'white' : 'transparent'}}/>
          <div>{player} {charName == player ? " (You)" : ""}</div>
      </div>
  } )
};

function MainGamePage({ renderAccusation, move, moveChoices, renderMoveChoice, endTurn, 
  renderHand, notifBanner, renderLobbyList, turnCurr, renderBoard, board, renderSuggestion, renderDisprove, charName, actions, turnOrder}) {
    let isMyTurn = turnCurr === charName;
    let canMove = actions[0]

    

    return (
      <div style={{ marginLeft: "10px"}}>
          <Map board={board}/>

          <div style={{ marginRight: "auto", marginBottom: "15px"}}>
            <strong>Player Hand:</strong>
            <div style={{ display: "flex", flexWrap: "wrap" }}>
              {renderHand().split(",").map((item, index, array) => (
              <div key={index} style={{ width: "25%", marginRight: "10px" }}>
                {item.trim()}{index !== array.length - 1 && ", "}
              </div>
              ))}
            </div>
          </div>
          
          <strong>Turn order:</strong> {renderTurnOrder(turnOrder, turnCurr, charName)}

          {renderDisprove()}
          <div>
            <button style={{ marginRight: "15px" }} className="button-modern" onClick={move} disabled={!isMyTurn || !canMove}>Move</button>
            <strong>Move Choices: </strong>{moveChoices.map(renderMoveChoice)}
          </div>
          {renderSuggestion()}
          {renderAccusation()}
          <div><button className="button-modern" onClick={endTurn} disabled={!isMyTurn}>End Turn</button></div>

      </div>
    );
  }
//<div style={{ marginRight: "auto" }}> <strong>Lobby Members: </strong> <pre>{renderLobbyList()}</pre></div>
export default MainGamePage;

