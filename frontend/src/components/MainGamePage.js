import React from 'react';
import '../App.css';
import Map from './MapComponent';

import char_green from '../char_green.png';
import char_mustard from '../char_mustard.png';
import char_peacock from '../char_peacock.png';
import char_plum from '../char_plum.png';
import char_scarlet from '../char_scarlet.png';
import char_white from '../char_white.png';

import weap_candlestick from '../weap_candlestick.png';
import weap_knife from '../weap_knife.png';
import weap_leadpipe from '../weap_leadpipe.png';
import weap_revolver from '../weap_revolver.png';
import weap_rope from '../weap_rope.png';
import weap_wrench from '../weap_wrench.png';

import room_ballroom from '../room_ballroom.png';
import room_billiard from '../room_billiard.png';
import room_conservatory from '../room_conservatory.png';
import room_dining from '../room_dining.png';
import room_hall from '../room_hall.png';
import room_kitchen from '../room_kitchen.png';
import room_library from '../room_library.png';

import room_lounge from '../room_lounge.png';
import room_study from '../room_study.png';

const renderTurnOrder = (turnOrder, turnCurr, charName) => {
  if (!turnOrder) return;
  return turnOrder.map((player) => {
    return <div style={{display:'flex'}}>
          <div className='piece-circle' style={{backgroundColor: (turnCurr == player) ? 'white' : 'transparent'}}/>
          <div>{player} {charName == player ? " (You)" : ""}</div>
      </div>
  } )
};

const cardImgMap = {
  "Miss Scarlet" : char_scarlet,
  "Colonel Mustard" : char_mustard,
  "Mrs. White" : char_white,
  "Mr. Green" : char_green,
  "Mrs. Peacock" : char_peacock,
  "Professor Plum" : char_plum,
  "Rope" : weap_rope,
  "Lead Pipe" : weap_leadpipe,
  "Knife" : weap_knife,
  "Wrench" : weap_wrench,
  "Candlestick" : weap_candlestick,
  "Revolver" : weap_revolver,
  "Ballroom" : room_ballroom,
  "Billiard Room" : room_billiard, 
  "Conservatory" : room_conservatory,
  "Dining Room" : room_dining,
  "Lounge" : room_lounge,
  "Study" : room_study, 
  "Hall" : room_hall, 
  "Library" : room_library,
  "Kitchen" : room_kitchen
}



const renderHandCards = (hand) => {
  return <div className='hand-container'>
   { hand.map((card) => {
      console.log(card)

      return <img src={cardImgMap[card]} className='card' key={card}/>;
    })}
  </div>
}


function MainGamePage({ renderAccusation, move, moveChoices, renderMoveChoice, endTurn, 
  notifBanner, renderLobbyList, turnCurr, renderBoard, board, renderSuggestion, renderDisprove, charName, actions, turnOrder, hand}) {
    let isMyTurn = turnCurr === charName;
    let canMove = actions[0]

    

    return (
      <div style={{ marginLeft: "10px"}}>
          <Map board={board}/>

          <div style={{ marginRight: "auto", marginBottom: "15px"}}>
            <strong>Player Hand:</strong>
            <div style={{ display: "flex", flexWrap: "wrap" }}>
              {renderHandCards(hand)}
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

