#from enums import Rooms, Hallways
#from character import Character
from Enums import *
from Character import *

class Board:

    def __init__(self):
        self.weaponLocations = {}
        self.board = {
            Rooms.STUDY: [Hallways.STUDY_HALL, Hallways.LIBRARY_STUDY, Rooms.KITCHEN],
            Rooms.HALL: [Hallways.STUDY_HALL, Hallways.HALL_LOUNGE, Hallways.HALL_BILLIARD],
            Rooms.LOUNGE: [Hallways.HALL_LOUNGE, Hallways.LOUNGE_DINING, Rooms.CONSERVATORY],
            Rooms.LIBRARY: [Hallways.LIBRARY_STUDY, Hallways.CONSERVATORY_LIBRARY],
            Rooms.BILLIARD: [Hallways.HALL_BILLIARD, Hallways.DINING_BILLIARD, Hallways.BALLROOM_BILLIARD, Hallways.LIBRARY_BILLIARD],
            Rooms.DINING: [Hallways.LOUNGE_DINING, Hallways.DINING_KITCHEN, Hallways.DINING_BILLIARD],
            Rooms.CONSERVATORY: [Hallways.BALLROOM_CONSERVATORY, Hallways.CONSERVATORY_LIBRARY, Rooms.LOUNGE],
            Rooms.BALLROOM: [Hallways.KITCHEN_BALLROOM, Hallways.BALLROOM_CONSERVATORY, Hallways.BALLROOM_BILLIARD],
            Rooms.KITCHEN: [Hallways.KITCHEN_BALLROOM, Hallways.DINING_KITCHEN, Rooms.STUDY],
            Hallways.STUDY_HALL: [Rooms.STUDY, Rooms.HALL],
            Hallways.HALL_LOUNGE: [Rooms.HALL, Rooms.LOUNGE],
            Hallways.LOUNGE_DINING: [Rooms.LOUNGE, Rooms.DINING],
            Hallways.DINING_KITCHEN: [Rooms.DINING, Rooms.KITCHEN],
            Hallways.KITCHEN_BALLROOM: [Rooms.KITCHEN, Rooms.BALLROOM],
            Hallways.BALLROOM_CONSERVATORY: [Rooms.BALLROOM, Rooms.CONSERVATORY],
            Hallways.CONSERVATORY_LIBRARY: [Rooms.CONSERVATORY, Rooms.LIBRARY],
            Hallways.LIBRARY_STUDY: [Rooms.LIBRARY, Rooms.STUDY],
            Hallways.HALL_BILLIARD: [Rooms.HALL, Rooms.BILLIARD],
            Hallways.DINING_BILLIARD: [Rooms.DINING, Rooms.BILLIARD],
            Hallways.BALLROOM_BILLIARD: [Rooms.BALLROOM, Rooms.BILLIARD],
            Hallways.LIBRARY_BILLIARD: [Rooms.LIBRARY, Rooms.BILLIARD],
            CharacterStarts.MISS_SCARLET_START: [Hallways.HALL_LOUNGE],
            CharacterStarts.COLONEL_MUSTARD_START: [Hallways.LOUNGE_DINING],
            CharacterStarts.MR_GREEN_START: [Hallways.BALLROOM_CONSERVATORY],
            CharacterStarts.MRS_WHITE_START: [Hallways.KITCHEN_BALLROOM],
            CharacterStarts.PROFESSOR_PLUM_START: [Hallways.LIBRARY_STUDY],
            CharacterStarts.MRS_PEACOCK_START: [Hallways.CONSERVATORY_LIBRARY]
        }
        #self.playerLocations = {}
    def getMoveChoices(self, player, characters):
        possible_moves = []
        current_location = player.location

        # Check connected rooms based on the board data
        for connection in self.board[current_location]:
            if isinstance(connection, Rooms):  # Check if it's a room
                possible_moves.append(connection.value)

        # Check connected hallways if theyre not occupied
        for connection in self.board[current_location]:
            if isinstance(connection, Hallways):
                if not any(char.location == connection for char in characters):  # Check if unoccupied
                    possible_moves.append(connection.value)

        return possible_moves

    def getAdjacents(self, location):
        return self.board[location]

    def isCornerRoom(self, location): 
        return location in [Rooms.STUDY, Rooms.LOUNGE, Rooms.CONSERVATORY, Rooms.KITCHEN]
    
    def isRoom(self, location):
        return isinstance(location, Rooms)