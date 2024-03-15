class Character: 

    def __init__(self, name, location):
        self.hand = None
        self.location = location
        self.name = name
        self.hasSuggested = False
        self.hasAccused = False
        self.isPlayer = False

    def setHand(self, hand):
        self.hand = hand

    
