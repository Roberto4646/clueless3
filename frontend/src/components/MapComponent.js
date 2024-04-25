import React from 'react';
import '../App.css';

const rooms = ["Study", "Hall", "Lounge", "Library", "Billiard Room", "Dining Room", "Conservatory", "Ballroom", "Kitchen"];
const hallways = ["Study-Hall", "Hall-Lounge", "Lounge-Dining Room", "Dining Room-Kitchen", "Kitchen-Ballroom", "Ballroom-Conservatory", "Conservatory-Library", "Library-Study", "Hall-Billiard Room", "Dining Room-Billiard Room", "Ballroom-Billiard Room", "Library-Billiard Room"];
const starts = [ "Miss Scarlet Start", "Prof. Plum Start", "Col. Mustard Start", "Mrs. Peacock Start", "Mr. Green Start", "Mrs. White Start"]
const hallways_horizontal = ["Study-Hall", "Hall-Lounge", "Kitchen-Ballroom", "Ballroom-Conservatory", "Dining Room-Billiard Room", "Library-Billiard Room"];
const hallways_vertical = ["Lounge-Dining Room", "Dining Room-Kitchen", "Conservatory-Library", "Library-Study", "Hall-Billiard Room", "Ballroom-Billiard Room"]

const containers = [
    ["", "", "", "", "Miss Scarlet Start", "", ""],
    ["", "Study", "Study-Hall", "Hall", "Hall-Lounge", "Lounge", ""],
    ["Prof. Plum Start", "Library-Study", "", "Hall-Billiard Room", "", "Lounge-Dining Room", "Col. Mustard Start"],
    ["", "Library", "Library-Billiard Room", "Billiard Room", "Dining Room-Billiard Room", "Billiard Room", ""],
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

function renderMapComponent(name) {
    if (rooms.includes(name)){
        return <div className='map-room'>{name}</div>
    }

    if (hallways_horizontal.includes(name)) {
        return <div className='map-hallway-horizontal'>{name}</div>
    }

    if (hallways_vertical.includes(name)) {
        return <div className='map-hallway-vertical'>{name}</div>
    }

    if (starts.includes(name)) {
        return <div className='map-start'>{name}</div>
    }
}

function Map({board}) {
    return (
        <div className='map'>
           
            {
                containers.map((row) => {
                    return  <div className='map-row'>
                        {row.map((name) => {
                            return <div className='map-component'>{renderMapComponent(name)}</div>
                        })}
                    </div>
                })
            }
            
        </div>
    )
};
  

export default Map;
