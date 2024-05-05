import React from 'react';
import '../App.css';

const rooms = ["Study", "Hall", "Lounge", "Library", "Billiard Room", "Dining Room", "Conservatory", "Ballroom", "Kitchen"];
const hallways = ["Study-Hall", "Hall-Lounge", "Lounge-Dining Room", "Dining Room-Kitchen", "Kitchen-Ballroom", "Ballroom-Conservatory", "Conservatory-Library", "Library-Study", "Hall-Billiard Room", "Dining Room-Billiard Room", "Ballroom-Billiard Room", "Library-Billiard Room"];
const starts = [ "Miss Scarlet Start", "Professor Plum Start", "Colonel Mustard Start", "Mrs. Peacock Start", "Mr. Green Start", "Mrs. White Start"]
const hallways_horizontal = ["Study-Hall", "Hall-Lounge", "Kitchen-Ballroom", "Ballroom-Conservatory", "Dining Room-Billiard Room", "Library-Billiard Room"];
const hallways_vertical = ["Lounge-Dining Room", "Dining Room-Kitchen", "Conservatory-Library", "Library-Study", "Hall-Billiard Room", "Ballroom-Billiard Room"]

const containers = [
    ["", "", "", "", "Miss Scarlet Start", "", ""],
    ["", "Study", "Study-Hall", "Hall", "Hall-Lounge", "Lounge", ""],
    ["Professor Plum Start", "Library-Study", "", "Hall-Billiard Room", "", "Lounge-Dining Room", "Colonel Mustard Start"],
    ["", "Library", "Library-Billiard Room", "Billiard Room", "Dining Room-Billiard Room", "Dining Room", ""],
    ["Mrs. Peacock Start", "Conservatory-Library", "", "Ballroom-Billiard Room", "", "Dining Room-Kitchen", ""],
    ["", "Conservatory", "Ballroom-Conservatory", "Ballroom", "Kitchen-Ballroom", "Kitchen", ""],
    ["", "", "Mr. Green Start", "", "Mrs. White Start", "", ""]
]

// relative [x,y] coords for object center
const locations = { 
    "Study": [-1,-1],
    "Hall": [0, -1],
    "Lounge": [1, -1],
    "Library": [-1, 0],
    "Billiard Room": [0, 0], 
    "Dining Room": [0, 1], 
    "Conservatory": [-1, 1], 
    "Ballroom": [0, -1], 
    "Kitchen": [1, -1]
}

const characterColors = {
    'Mrs. Peacock': 'blue',
    'Professor Plum': 'purple',
    'Miss Scarlet': 'red',
    'Colonel Mustard': 'yellow',
    'Mr. Green': 'green',
    'Mrs. White': 'white'
}

function nameOfStyleClass(name) {
    if (rooms.includes(name)) {
        return 'map-room';
    } else if (hallways_horizontal.includes(name)) {
        return 'map-hallway-horizontal';
    } else if (hallways_vertical.includes(name)) {
        return 'map-hallway-vertical';
    } else if (starts.includes(name)) {
        return 'map-start';
    }
}

function renderMapComponent(name, board) {
    return <div className={nameOfStyleClass(name)}>{name}{putPiecesOnComponent(name, board)}</div>
}


function putPiecesOnComponent(name, board) {
    const piecesInComponent = board.filter(function(obj_loc) {
        return obj_loc[1] == name;
    });
    // console.log(name + ": " + piecesInComponent);

    const pieces = piecesInComponent.map(function(obj_loc) {
        return <div className='piece-circle' style={{backgroundColor:characterColors[obj_loc[0]]}}></div>
    });

    return <div className='piece-container'>
        {pieces}
    </div>
}

function Map({board}) {
    return (
        <div className='map' style={{marginLeft: "25%"}}>
           
            {
                containers.map((row) => {
                    return  <div className='map-row'>
                        {row.map((name) => {
                            return <div className='map-component'>
                                {renderMapComponent(name, board)}
                            </div>
                        })}                                

                    </div>
                })
            }
            
        </div>
    )
};
  

export default Map;
