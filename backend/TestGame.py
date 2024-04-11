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
    
    def test_suggestionValid_1(self):
        # player is not in a room --> false
        c = Character(Suspects.COLONEL_MUSTARD, Hallways.BALLROOM_BILLIARD)
        playerId = "playerId1"
        game = Game(0)
        game.characters.append(c)
        game.playerToCharacter[playerId] = c

        valid, details = game.suggestionValid(playerId, "Professor Plum", "Candlestick")
        assert valid == False

    def test_suggestionValid_2(self):
        # player is in a room && all exits are blocked && was not moved via suggestion --> false
        c = Character(Suspects.COLONEL_MUSTARD, Rooms.HALL) # default not moved by suggestion
        playerId = "playerId1"
        game = Game(0)
        game.characters.append(c)
        game.playerToCharacter[playerId] = c
        # insert characters to block exit
        game.characters.append(Character(Suspects.MISS_SCARLET, Hallways.STUDY_HALL))
        game.characters.append(Character(Suspects.MR_GREEN, Hallways.HALL_LOUNGE))
        game.characters.append(Character(Suspects.MRS_PEACOCK, Hallways.HALL_BILLIARD))

        valid, details = game.suggestionValid(playerId, "Professor Plum", "Candlestick")
        assert valid == False

    def test_suggestionValid_3(self):
        # player is in a room && all exits are blocked && not corner room && was moved via suggestion; valid suspect/weapon --> true
        c = Character(Suspects.COLONEL_MUSTARD, Rooms.STUDY) 
        c.moveViaSuggestion(Rooms.HALL)
        playerId = "playerId1"
        game = Game(0)
        game.characters.append(c)
        game.playerToCharacter[playerId] = c
        # insert characters to block exit
        game.characters.append(Character(Suspects.MISS_SCARLET, Hallways.STUDY_HALL))
        game.characters.append(Character(Suspects.MR_GREEN, Hallways.HALL_LOUNGE))
        game.characters.append(Character(Suspects.MRS_PEACOCK, Hallways.HALL_BILLIARD))
        
        valid, details = game.suggestionValid(playerId, "Professor Plum", "Candlestick")
        assert valid == True
    
    def test_suggestionValid_4(self):
        # player is in a room && all exits are blocked && corner room; valid suspect/weapon --> true
        c = Character(Suspects.COLONEL_MUSTARD, Rooms.STUDY) 
        playerId = "playerId1"
        game = Game(0)
        game.characters.append(c)
        game.playerToCharacter[playerId] = c
        # insert characters to block exit
        game.characters.append(Character(Suspects.MISS_SCARLET, Rooms.HALL))
        game.characters.append(Character(Suspects.MR_GREEN, Rooms.STUDY))
        
        valid, details = game.suggestionValid(playerId, "Professor Plum", "Candlestick")
        assert valid == True
    
    def test_suggestionValid_5(self):
        # in a room && not blocked; valid suspect/weapon --> true
        c = Character(Suspects.COLONEL_MUSTARD, Rooms.STUDY) 
        playerId = "playerId1"
        game = Game(0)
        game.characters.append(c)
        game.playerToCharacter[playerId] = c
        
        valid, details = game.suggestionValid(playerId, "Professor Plum", "Candlestick")
        assert valid == True
    
    def test_suggestionValid_6(self):
        # in a room && not blocked; invalid suspect --> false
        c = Character(Suspects.COLONEL_MUSTARD, Rooms.STUDY) 
        playerId = "playerId1"
        game = Game(0)
        game.characters.append(c)
        game.playerToCharacter[playerId] = c
        
        valid, details = game.suggestionValid(playerId, "kernel musto", "Candlestick")
        assert valid == False


    def test_suggestionValid_7(self):
        # in a room && not blocked; invalid weapon --> false
        c = Character(Suspects.COLONEL_MUSTARD, Rooms.STUDY) 
        playerId = "playerId1"
        game = Game(0)
        game.characters.append(c)
        game.playerToCharacter[playerId] = c
        
        valid, details = game.suggestionValid(playerId, "Professor Plum", "not a knife")
        assert valid == False

    def test_processSuggestion(self):
        # suggestion should be valid for the game already
        c = Character(Suspects.COLONEL_MUSTARD, Rooms.STUDY) 
        playerId = "playerId1"
        game = Game(0)
        game.characters.append(c)
        game.playerToCharacter[playerId] = c
        # accused character
        suspect_character = Character(Suspects.MRS_PEACOCK, Hallways.HALL_BILLIARD)
        playerId2 = "playerId2"
        game.characters.append(suspect_character)
        game.playerToCharacter[playerId2] = suspect_character 
        
        # need at least another player in the game for disprove tracking
        game.playerIds = [playerId, playerId2]

        suspect, weapon = "Mrs. Peacock", "Candlestick"

        valid, details = game.suggestionValid(playerId, suspect, weapon)
        assert valid == True

        if valid == True: 
            room = details
            nextPidToDisprove = game.processSuggestion(playerId, suspect, room, weapon)

            assert suspect_character.location == Rooms(room) # study, where the suggester was
            assert suspect_character.wasMovedViaSuggestion() == True
            assert c.hasSuggested == True
            assert nextPidToDisprove == playerId2

            


if __name__ == '__main__':
    unittest.main()