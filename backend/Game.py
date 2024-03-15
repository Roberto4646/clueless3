from Character.py import Character
from Card.py import Card
from Board.py import Board
from Enums.py import Suspects, CharacterStarts, Weapons, Rooms, Hallways
import random

ALL_CHARACTERS = ["Miss Scarlet", "Professor Plum", "Mr. Green", "Mrs. White", "Mrs. Peacock"]
ALL_CHARACTER_STARTS = ["Miss Scarlet Start", "Professor Plum Start", "Mr. Green Start", "Mrs. White Start", "Mrs. Peacock Start"]

ALL_WEAPONS = ["Rope", "Lead Pipe", "Knife", "Wrench", "Candlestick", "Revolver"]
ALL_ROOMS = ["Study", "Hall", "Lounge", "Library", "Billiard Room", "Dining Room", "Conservatory", "Ballroom", "Kitchen"]
ALL_HALLWAYS = ["Study-Hall", "Hall-Lounge", "Lounge-Dining Room", "Dining Room-Kitchen", "Kitchen-Ballroom", "Ballroom-Conservatory",
     "Conservatory-Library", "Library-Study", "Hall-Billiard Room", "Dining Room-Billiard Room", "Ballroom-Billiard Room", "Library-Billiard Room"]

class Game:
    def __init__(self):
        self.characters = []
        self.board = Board()
        self.solution = {}

        self.playerIds = [] # some type of way to keep track of who to send messages to. Can be changed when we get to the messaging
        self.playerToCharacter = {}

    def addPlayer(self, playerId):
        self.playerIds.append(playerId)

    def setupGame(self):
        # set up the solution for the game 
        solutionCardNumbers = [] # to generate player hands later
        suspect_range = range(1, 7)
        weapon_range = range(7, 13)
        room_range = range(13, 22)
        ranges = [suspect_range, weapon_range, room_range]
        weights = [1, 1, 2]
        
        for category in ["Suspect", "Weapon", "Room"]:
            chosen_range = random.choices(ranges, weights=weights)[0]
            card_number = random.choice(chosen_range)
            card_info = Card().get_card_by_number(card_number)
            if card_info:
                card_type, name = card_info
                self.solutions[card_type] = name
                solutionCardNumbers.append(card_number) 

        # set name and location of all characters on board
        for i in range(len(ALL_CHARACTERS)): 
            character = Character(ALL_CHARACTERS[i], ALL_CHARACTER_STARTS[i])
            self.characters.append(character)

        # set up remaining card
        allCards = [range(1,22)]
        randomizedCardsLeft = random.shuffle([card in card in allCards if item not in solutionCardNumbers])
        numHands = len(self.playerIds)
        numCardsPerHand = cardsLeft // numHands
        leftover = cardsLeft % numHands
        cardsDealt = 0

        # assign which player gets what character and give them a hand
        playersAssigned = 0
        for random_character in random.shuffle(self.characters):
            # exit if all players have been assigned a character
            if playersAssigned == len(self.playerIds):
                break 
            
            random_character.isPlayer = True
            playerToCharacter[playerId[playersAssigned]] = character
            playersAssigned += 1

            # deal cards
            numCardsToDeal = numCardsPerHand
            if leftover > 0:
                numCardsToDeal += 1
                leftover -= 1
            
            cards = randomizedCardsLeft[cardsDealt:cardsDealt+numCardsToDeal]
            cardsDealt += numCardsToDeal
            random_character.setHand(cards)

    def getCharacter(self, character_name):
        for c in self.characters:
            if c.name == character_name:
                return c

    def getTurnActions(self, character):
        canMove = False
        canSuggest = False
        canAccuse = False

        # if player is still active in game
        if not character.hasAccused:
            # if player is not blocked
            if self.board.getMoveChoices(character.location) > 0:
                canMove = True

            # if player has not made a suggestion this turn
            canSuggest = not character.hasSuggested

            # if player has not made an accusation this game
            canSuggest = not character.hasAccused

        return canMove, canSuggest, canAccuse

    def processMove(self, choice, character):
        self.board.fa

    def processTurn(self, character):
        # TODO: notify player it's their turn
        
        # process turn actions until turn ends
        activeTurn = True
        while (activeTurn):
            actions = self.getTurnActions(character) 
            # TODO: notify player of available turn actions
            # TODO: get response
            action = "" 

            #if action == "MOVE":
                #processMove()
            #elif action == "SUGGEST":
                #processSuggest()
            #elif action == "ACCUSE":
                #processAccuse():
            #elif action == "END_TURN":
            #    break
            
        
        
        



    