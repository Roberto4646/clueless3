# from Character.py import Character
# from Card.py import Card
# from Board.py import Board
# from Enums.py import Hallways
#from character import Character
#from card import Card
#from board import Board
#from enums import Hallways

from Character import * 
import Card
from Board import * 
from Enums import *

#from Enums.py import Suspects#, CharacterStarts, Weapons, Rooms
import random

class Game:
    def __init__(self, gid):
        self.characters = []
        self.board = Board()
        self.solution = {}
        self.gid = gid

        self.playerIds = [] # kept in turn order
        self.playerToCharacter = {}
        self.currentTurn = 0 # whose turn = playerIds[currentTurn]

        self.suggestionTracker = (None, None) # (playerId, (suspect, room, weapon), nextPlayerToDisprove)

    def addPlayer(self, playerId):
        self.playerIds.append(playerId)

    def __str__(self):
        return "GID: " + str(self.gid) + ", Solution: " + str(self.solution)

    def setupGame(self):
        # set up the solution for the game 
        solutionCardNumbers = [] # to generate player hands later
        suspect_range = range(1, 7)
        weapon_range = range(7, 13)
        room_range = range(13, 22)
        ranges = [suspect_range, weapon_range, room_range]
        weights = [1, 1, 2]

        #couldn't we just loop over the ranges? i think the weights are a little unnecessary
        #for category in ["Suspect", "Weapon", "Room"]:
        for chosen_range in ranges:
            #chosen_range = random.choices(ranges, weights=weights)[0] 
            #This doesn't behave in the way we think it does. Weights didn't guarantee that the [0th] choice would be a type of card that we didn't have already
            card_number = random.choice(chosen_range)
            card_info = Card.get_card_by_number(card_number)
            if card_info:
                card_type, name = card_info
                self.solution[card_type] = name
                solutionCardNumbers.append(card_number) 
        
        # set name and location of all characters on board
        all_characters = list(Suspects)
        all_character_starts = list(CharacterStarts)
        for i in range(len(all_characters)): 
            character = Character(all_characters[i], all_character_starts[i])
            self.characters.append(character)

        # set up remaining card
        allCards = list(range(1,22)) 
        randomizedCardsLeft = [card for card in allCards if card not in solutionCardNumbers]
        random.shuffle(randomizedCardsLeft)
        numHands = len(self.playerIds) #what happens if divide by 0?
        numCardsPerHand = len(randomizedCardsLeft) // numHands
        
        leftover = len(randomizedCardsLeft) % numHands
        cardsDealt = 0

        # assign which player gets what character and give them a hand
        playersAssigned = 0
        random.shuffle(self.characters)
        for random_character in self.characters:
            # exit if all players have been assigned a character
            if playersAssigned == len(self.playerIds):
                break 
            
            random_character.isPlayer = True
            self.playerToCharacter[self.playerIds[playersAssigned]] = random_character #character?
            playersAssigned += 1

            # deal cards
            numCardsToDeal = numCardsPerHand
            if leftover > 0:
                numCardsToDeal += 1
                leftover -= 1
            
            cards = randomizedCardsLeft[cardsDealt:cardsDealt+numCardsToDeal]
            cardsDealt += numCardsToDeal
            random_character.setHand(cards)

        # set up weapon locations
        shuffledRooms = list(Rooms)
        random.shuffle(shuffledRooms)
        weaponsList = list(Weapons)
        for i in range(len(weaponsList)):
            self.board.weaponLocations[weaponsList[i]] = shuffledRooms[i]        

        # set up player order
        # some ugly code but hopefully it workds
        ordered_playerIds = []        
        for c in list(Suspects):
            for p in self.playerIds:
                if self.playerToCharacter[p].name == c:
                    ordered_playerIds.append(p)
        self.playerIds = ordered_playerIds

        self.currentTurn = 0
    
    def _getCharacterByName(self, character_name):
        for c in self.characters:
            if c.getName() == character_name:
                return c
            
        print(character_name + " not found in " + str(self.characters))
    
    def _getCharacterByPid(self, playerId):
        return self.playerToCharacter[playerId]

    def getCharacterForPlayer(self, playerId):
        return self.playerToCharacter[playerId].getName()

    def getHandForPlayer(self, playerId):
        return self.playerToCharacter[playerId].getHandCards()

    def getBoard(self):
        # accumulate all character and weapon positions
        # the client should have a representation of the board hard coded
        character_locations = [(c.getName(), c.location.value) for c in self.characters]
        weapon_locations = [(w.value, l.value) for w,l in self.board.weaponLocations.items()]
        return character_locations + weapon_locations # as just 1 array of (name, location)

    def getCurrentTurn(self):
        playerId = self.playerIds[self.currentTurn]
        return playerId, self.getCharacterForPlayer(playerId)

    def getTurnOrder(self):
        turns = self.playerIds[self.currentTurn:] + self.playerIds[:self.currentTurn]
        return [self.getCharacterForPlayer(p) for p in turns]

    def getPlayerIds(self):
        return self.playerIds

    def getTurnActions(self, playerId):
        character = self.playerToCharacter[playerId] # TODO: check playerid is in here
        canMove = False
        canSuggest = False
        canAccuse = not character.hasAccused

        # if player is still active in game
        if not character.hasAccused:
            # if player is not blocked
            if not character.hasMoved and len(self.board.getMoveChoices(character, self.characters)) > 0:
                canMove = True

            # if player has not made a suggestion this turn
            canSuggest = not character.hasSuggested

            # if player has not made an accusation this game
            canSuggest = not character.hasAccused

        return canMove, canSuggest, canAccuse

    def startMove(self, playerId):
        character = self.playerToCharacter[playerId]
        choices = self.board.getMoveChoices(character, self.characters)
        return choices
    
    def move(self, playerId, location):
        character = self.playerToCharacter[playerId]
        valid = location in self.board.getMoveChoices(character, self.characters)

        if valid:
            character = self.playerToCharacter[playerId]
            if location in set(room.value for room in Rooms):
                character.location = Rooms(location)
            elif location in set(hall.value for hall in Hallways):
                character.location = Hallways(location)

            character.hasMoved = True

        return valid
        
    def endTurn(self, playerId):
        # TODO: set next turn player
        return

    def processSuggestion(self, playerId, suspect, room, weapon):
        character = self.playerToCharacter[playerId]
        character.hasSuggested = True
        # TODO: track the player who made the suggestion
        # TODO: track the suggestion
        # TODO: track the next player to request proof, starts "left" clockwise 
        nextPidToDisprove = self.playerIds[(self.currentTurn + 1)%len(self.playerIds)]
        self.suggestionTracker = (playerId, (suspect, room, weapon), nextPidToDisprove)

        # move suspect to room 
        suspect_character = self._getCharacterByName(suspect)

        suspect_character.moveViaSuggestion(Rooms(room)) # cast should be valid. Room should've be obtained from character location

        # TODO: return next to player to request proof
        return nextPidToDisprove 

    
    def disproveSuggestion(self, playerId, proof):
        success = False
        nextPlayerToDisprove = -1
        suggester = -1
        suggestion = []
        # TODO: validate player to disprove
        # TODO: validate proof with player
        # TODO: validate proof to suggestion
        # TODO: iterate to next player if cannot disprove
        # TODO: end disprove tracking if can disprove
        return success, nextPlayerToDisprove, suggester, suggestion

    def processAccusation(self, playerId, suspect, room, weapon):
        character = self.playerToCharacter[playerId]
        character.hasAccused = True
        success = False
        
        if (not self.solution['Suspects'] == suspect) or \
            (not self.solution['Rooms'] == room) or \
                (not self.solution['Weapons'] == weapon):
                
            # TODO: move player to one of the neighboring rooms if they are in a hallway
            if(character.location in Hallways):
                #array of strings
                location = random.choice(self.board.getMoveChoices(character, self.characters))
                self.move(self, playerId, Rooms(location))
        else:
            success = True # << placeholder to get rid of error
            #TODO: end game

        
        return success
    
    def suggestionValid(self, playerId, suspect, weapon):

        character = self._getCharacterByPid(playerId)
        location = character.getLocation()
        
        # if in a room and 
        if not self.board.isRoom(location): 
            return False, "You are not allowed to make a suggestion. You are not in a room"
        # if not (all exits blocked && not in corner rooms && weren't moved to another room by a player making a suggestion)
        # if you weren't moved to the room by another player making a suggestion

        exits = self.board.getAdjacents(location)
        char_locations = [c.location.value for c in self.characters]

        all_exits_blocked = len([loc for loc in exits if loc in char_locations]) == len(exits)
        if (all_exits_blocked and not self.board.isCornerRoom(location) and not character.wasMovedViaSuggestion()):
            return False, "You are not allowed to make a suggestion. All exits are blocked & you're not in a corner & you weren't moved to the room by another player via suggestion this round"

        # check contents of suspect and weapon
        try:
            Suspects(suspect)
        except ValueError:
            return False, "Suggestion contents invalid: " + suspect
        
        try: 
            Weapons(weapon)
        except ValueError:
            return False, "Suggestion contents invalid: " + weapon
        
        return True, location.value

    