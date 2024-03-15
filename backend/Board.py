from enums import Rooms, Hallways
from character import Character

class Board:

    def __init__(self):
        self.weaponLocations = {}
        self.board = {
            Rooms.STUDY: [Hallways.STUDY_HALL, Hallways.LIBRARY_STUDY],
            Rooms.HALL: [Hallways.STUDY_HALL, Hallways.HALL_LOUNGE, Hallways.HALL_BILLIARD],
            Rooms.LOUNGE: [Hallways.HALL_LOUNGE, Hallways.LOUNGE_DINING],
            Rooms.LIBRARY: [Hallways.LIBRARY_STUDY, Hallways.CONSERVATORY_LIBRARY],
            Rooms.BILLIARD: [Hallways.HALL_BILLIARD, Hallways.DINING_BILLIARD, Hallways.BALLROOM_BILLIARD, Hallways.LIBRARY_BILLIARD],
            Rooms.DINING: [Hallways.LOUNGE_DINING, Hallways.DINING_KITCHEN, Hallways.DINING_BILLIARD],
            Rooms.CONSERVATORY: [Hallways.BALLROOM_CONSERVATORY, Hallways.CONSERVATORY_LIBRARY],
            Rooms.BALLROOM: [Hallways.KITCHEN_BALLROOM, Hallways.BALLROOM_CONSERVATORY, Hallways.BALLROOM_BILLIARD],
            Rooms.KITCHEN: [Hallways.KITCHEN_BALLROOM, Hallways.DINING_KITCHEN],
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
            Hallways.LIBRARY_BILLIARD: [Rooms.LIBRARY, Rooms.BILLIARD]
        }

    def getMoveChoices(self, character, characters):
        possible_moves = []
        current_location = character.location

        # Check connected rooms based on the board data
        for connection in self.board[current_location]:
            if isinstance(connection, Rooms):  # Check if it's a room
                possible_moves.append(connection.value)

        # Check connected hallways if theyre not occupied
        for connection in self.board[current_location]:
            if isinstance(connection, Hallways):
                other_room = (set(self.board[current_location]) - {connection}).pop()  # Get connected room
                if not any(char.location == other_room.value for char in characters):  # Check if unoccupied
                    possible_moves.append(connection.value)

        return possible_moves
