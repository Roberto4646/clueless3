# from Character.py import Character
# from Card.py import Card
# from Board.py import Board
# from Enums.py import Hallways
#from character import Character
#from card import Card
#from board import Board
#from enums import Hallways

from Character import * 
from Card import *
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

        self.playerIds = [] # some type of way to keep track of who to send messages to. Can be changed when we get to the messaging
        self.playerToCharacter = {}
        self.currentTurn = 0 # whose turn = playerIds[currentTurn]


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
        dummyCard = Card()

        #couldn't we just loop over the ranges? i think the weights are a little unnecessary
        #for category in ["Suspect", "Weapon", "Room"]:
        for chosen_range in ranges:
            #chosen_range = random.choices(ranges, weights=weights)[0] 
            #This doesn't behave in the way we think it does. Weights didn't guarantee that the [0th] choice would be a type of card that we didn't have already
            card_number = random.choice(chosen_range)
            card_info = dummyCard.get_card_by_number(card_number)
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
        # characterPlayers = [(character, playerId) for playerId, character in self.playerToCharacter.items()]
        # sorted_characterPlayers = sorted(characterPlayers, key=lambda x: x[0].name.upper()) # sort by the order the enums are defined, hopefully
        # # rearrange playerId list - probably most non-repetitive way
        # newPlayerIds = [x[1] for x in sorted_characterPlayers]
        # self.playerIds = newPlayerIds
        self.currentTurn = 0
    
    def getCharacter(self, character_name):
        for c in self.characters:
            if c.name == character_name:
                return c

    def getCharacterForPlayer(self, playerId):
        return self.playerToCharacter[playerId].name.value

    def getHandForPlayer(self, playerId):
        return self.playerToCharacter[playerId].hand

    def getBoard(self):
        # accumulate all character and weapon positions
        # the client should have a representation of the board hard coded
        character_locations = [(c.name.value, c.location.value) for c in self.characters]
        weapon_locations = [(w.value, l.value) for w,l in self.board.weaponLocations.items()]
        return character_locations + weapon_locations # as just 1 array of (name, location)

    def getCurrentTurn(self):
        playerId = self.playerIds[self.currentTurn]
        return playerId, self.getCharacterForPlayer(playerId)

    def getTurnOrder(self):
        characterList = [s.value for s in list(Suspects)]
        charactersInOrderFromCurrent = characterList[self.currentTurn:] + characterList[:self.currentTurn]
        return charactersInOrderFromCurrent

    def getPlayerIds(self):
        return self.playerIds

    def getTurnActions(self, playerId):
        character = self.playerToCharacter[playerId] # TODO: check playerid is in here
        canMove = False
        canSuggest = False
        canAccuse = False

        # if player is still active in game
        if not character.hasAccused:
            # if player is not blocked
            if len(self.board.getMoveChoices(character, self.characters)) > 0:
                canMove = True

            # if player has not made a suggestion this turn
            canSuggest = not character.hasSuggested

            # if player has not made an accusation this game
            canSuggest = not character.hasAccused

        return canMove, canSuggest, canAccuse

    def startMove(self, character):
        #choices = self.board.getMoveChoices(character)
        # TODO: send list of choices to player
        # TODO: get choice from player
        # character.location = choice
        # TODO: notify everyone of player move
        return
        

    def processSuggestion(self, character, suggestion):
        #order = [Suspects.MISS_SCARLET, Suspects.COLONEL_MUSTARD, Suspects.MRS_WHITE, SUSPECTS.MR_GREEN ]
        # TODO: for each other player starting from the "left" clockwise
            # TODO: notify player to disprove the suggestion
            # TODO: get reponse (card)
            # TODO: if a card is returned
                # TODO: notify everyone the player disproved it
                # TODO: notify suggester of the card
                # TODO: break
            # TODO: notify everyone the player couldn't disprove it
        # TODO: notify the suggester no one could disprove it
        return # << placeholder to get rid of error

    def processAccusation(self, character, accusation):
        if not accusation == self.solution:
            character.hasAccused = True

            # move player if they are in a hallway
            # if character.location in Hallways:
            #     choices = self.board.getMoveChoices(character)
            #     character.location = random.choice(choices)

            # TODO: notify the player they're wrong and can no longer take turns
        else:
            return # << placeholder to get rid of error
            # TODO: end game, notify everyone of solution and winner

    def processTurn(self, player):
        # TODO: notify player it's their turn
        
        # process turn actions until turn ends
        activeTurn = True
        while (activeTurn):
            actions = self.getTurnActions(player) 
            # TODO: notify player of available turn actions
            # TODO: get response
            action = "" 

            #if action == "MOVE":
                #processMove()
            #elif action == "SUGGEST":
                #processSuggestion()
            #elif action == "ACCUSE":
                #processAccusation():
            #elif action == "END_TURN":
            #    break
            
        
#TODO: make functions accept PID not character object     
        



    