from enum import Enum

class Suspects(Enum):
  MISS_SCARLET = "Miss Scarlet"
  PROFESSOR_PLUM = "Professor Plum"
  MR_GREEN = "Mr. Green"
  MRS_WHITE = "Mrs. White"
  MRS_PEACOCK = "Mrs. Peacock"

#character = Suspects.MISS_SCARLET
#print(character.name)  # Output: Miss Scarlet    

class CharacterStarts(Enum):
  MISS_SCARLET_START = "Miss Scarlet Start"
  PROFESSOR_PLUM_START = "Professor Plum Start"
  MR_GREEN_START = "Mr. Green Start"
  MRS_WHITE_START = "Mrs. White Start"
  MRS_PEACOCK_START = "Mrs. Peacock Start"

class Weapons(Enum):
  ROPE = "Rope"
  LEAD_PIPE = "Lead Pipe"
  KNIFE = "Knife"
  WRENCH = "Wrench"
  CANDLESTICK = "Candlestick"
  REVOLVER = "Revolver"

class Rooms(Enum):
  STUDY = "Study"
  HALL = "Hall"
  LOUNGE = "Lounge"
  LIBRARY = "Library"
  BILLIARD = "Billiard Room"
  DINING = "Dining Room"
  CONSERVATORY = "Conservatory"
  BALLROOM = "Ballroom"
  KITCHEN = "Kitchen"

class Hallways(Enum):
  STUDY_HALL = "Study-Hall"
  HALL_LOUNGE = "Hall-Lounge"
  LOUNGE_DINING = "Lounge-Dining Room"
  DINING_KITCHEN = "Dining Room-Kitchen"
  KITCHEN_BALLROOM = "Kitchen-Ballroom"
  BALLROOM_CONSERVATORY = "Ballroom-Conservatory"
  CONSERVATORY_LIBRARY = "Conservatory-Library"
  LIBRARY_STUDY = "Library-Study"
  HALL_BILLIARD = "Hall-Billiard Room"
  DINING_BILLIARD = "Dining Room-Billiard Room"
  BALLROOM_BILLIARD = "Ballroom-Billiard Room"
  LIBRARY_BILLIARD = "Library-Billiard Room"