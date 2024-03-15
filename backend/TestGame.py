import unittest
# from ..Game.py import Game
 # attempted relative import with no known parent package
from game import Game


class TestGame(unittest.TestCase):

    def test_sanity(self):
        assert 0 == 0, "should be 0"

    def test_init(self):
        game = Game()

    def test_addPlayer(self):
        game = Game()
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

    # def test_setupGame(self):
        


if __name__ == '__main__':
    unittest.main()