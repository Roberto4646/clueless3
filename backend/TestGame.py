import unittest
# from ..Game.py import Game
 # attempted relative import with no known parent package
#from game import Game
from Game import * 

class TestGame(unittest.TestCase):

    def test_sanity(self):
        assert 0 == 0, "should be 0"

    def test_init(self):
        game = Game(1221)

    def test_addPlayer(self):
        game = Game(1221)
        playerId1 = "player1"
        playerId2 = "player2"

        prevLen = len(game.playerIds)
        game.addPlayer(playerId1)
        assert len(game.playerIds) == prevLen + 1
        assert playerId1 in game.playerIds

        prevLen = len(game.playerIds)
        game.addPlayer(playerId2)
        assert len(game.playerIds) == prevLen + 1
        assert playerId1 in game.playerIds
        assert playerId2 in game.playerIds

    def test_setupGame(self):
        game = Game(1221)
        playerId1 = "player1"
        playerId2 = "player2"
        game.addPlayer(playerId1)
        game.addPlayer(playerId2)
        game.setupGame()


    def test_init2(self):
        game = Game(1221)
        
    def test_init3(self):
        game = Game(1221)
        
    def test_init4(self):
        game = Game(1221)
        
    def test_init5(self):
        game = Game(1221)
    
        


if __name__ == '__main__':
    unittest.main()