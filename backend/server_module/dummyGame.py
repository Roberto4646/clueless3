

class dummyGame:
    def __init__(self):
        self.playerIds = [] # some type of way to keep track of who to send messages to. Can be changed when we get to the messaging

    def addPlayer(self, playerId):
        self.playerIds.append(playerId)
