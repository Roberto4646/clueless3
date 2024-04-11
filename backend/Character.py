import Card
class Character: 

    def __init__(self, name, location):
        self.hand = None
        self.location = location
        self.name = name
        self.hasMoved = False
        self.hasSuggested = False
        self.hasAccused = False
        self.isPlayer = False
        self.wasMoved = False

    def setHand(self, hand):
        self.hand = hand

    def getHand(self): 
        return self.hand
    
    def getHandCards(self):
        return [Card.get_card_by_number(index)[1] for index in self.hand]
    
    def getName(self):
        return self.name.value
    
    def getLocation(self): 
        return self.location

    def wasMovedViaSuggestion(self):
        return self.wasMoved
    
    def moveViaSuggestion(self, location):
        self.location = location
        self.wasMoved = True
    
    def currentTurnReset(self):
        self.wasMoved = False
        # add any other applicable code here. hasSuggested? hasMoved?
