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

    def setHand(self, hand):
        self.hand = hand

    def getHand(self): 
        return self.hand
    
    def getHandCards(self):
        return [Card.get_card_by_number(index)[1] for index in self.hand]

    
