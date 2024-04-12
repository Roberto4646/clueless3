import React from 'react';
import '../App.css';
import { Link } from 'react-router-dom';

function MainGamePage({ suggest, renderAccusation, move, moveChoices, renderMoveChoice, endTurn, 
  renderHand, notifBanner, renderLobbyList, turnCurr, renderBoard, renderSuggestion, renderDisprove, charName}) {
    return (
      <div className="App">
        <div className="button-column">
        <div style={{ marginRight: "auto" }}> <strong>Character Name: </strong> {charName} </div>
        <div style={{ marginRight: "auto" }}> <strong>Lobby Members: </strong> <pre>{renderLobbyList()}</pre></div>
        <div style={{ marginRight: "auto" }}>
          <strong>Player Hand:</strong>
          <div style={{ display: "flex", flexWrap: "wrap" }}>
            {renderHand().split(",").map((item, index, array) => (
            <div key={index} style={{ width: "25%", marginRight: "10px" }}>
              {item.trim()}{index !== array.length - 1 && ", "}
            </div>
            ))}
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", marginBottom: "15px" }}> <strong>Current Turn: </strong> {turnCurr} </div>
          {renderSuggestion()}
          {renderDisprove()}
          {renderAccusation()}
          <div><button style={{ marginRight: "15px" }} className="button-modern" onClick={move}>Move</button>
            <strong>Move Choices: </strong>{moveChoices.map(renderMoveChoice)} </div>
          <div><button className="button-modern" onClick={endTurn}>End Turn</button></div>
          <div style={{ marginRight: "auto", marginBottom: "15px",  marginTop: "15px" }}> <strong>Current Notification : </strong> {notifBanner} </div>
          <div style={{ marginRight: "auto" }}> <strong>Board: </strong> <pre>{renderBoard()}</pre> </div>
        </div>
      </div>
    );
  }

export default MainGamePage;

