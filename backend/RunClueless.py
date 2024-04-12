from Game import *
from flask import Flask, render_template, request
from flask_socketio import SocketIO, send, emit, join_room, leave_room
import random
from flask_cors import CORS

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})
socketio = SocketIO(app, async_handlers=False, cors_allowed_origins="http://localhost:3000")

# Server State Variables
#-----------------------------------------------------------------------
game_ids = [] # list of lobby codes 
player_ids = [] # UID for each player
game_id_game = {} # map each game_id to a Game object
players_in_game = {} 

# Testing
#-----------------------------------------------------------------------
def printState():
    print("--------------------------------------------")
    print("GIDs: ", game_ids)
    print("PIDs: ", player_ids)
    print("GIDs -> Game: ")
    for game_id, game in game_id_game.items():
        print("\t", game_id, "->", game)
    print("PIDs -> GIDs")
    print("\t", players_in_game)
    print("--------------------------------------------")

# Message Handling
#-----------------------------------------------------------------------
        
@socketio.on('LOBBY_CREATE')
def handle_create_game():
    # give the player an ID
    pid = request.sid
    player_ids.append(pid)

    # make a Game and game ID
    gid = 0
    while True:
        gid = random.randint(1000,9999)
        if gid not in game_ids:
            game_ids.append(gid)
            break

    #associate game id to game
    newGame = Game(gid)
    game_id_game[gid] = newGame
    
    # associate player ID to the new game
    players_in_game[pid] = gid 
    newGame.addPlayer(pid)
    join_room(gid)
     
    # send the client their id and the lobby code for others to join
    emit("LOBBY_CODE", [pid, gid])
    emit("LOBBY_STATUS", game_id_game[gid].getPlayerIds(), to=gid)
    emit("NOTIFICATION", ["You created a Clue-less game lobby."])
    printState()

@socketio.on('LOBBY_JOIN')
def handle_lobby_join(gid):
    gid=int(gid)

    # validate GID
    if gid not in game_ids:
        emit("NOTIFICATION", ["Invalid lobby code!"])
        return

    # assign PID 
    pid = request.sid
    player_ids.append(pid)
    
    # associate PID to the game
    players_in_game[pid] = gid
    game_id_game[gid].addPlayer(pid)
    join_room(gid)

    emit("LOBBY_CODE", [pid, gid])
    emit("LOBBY_STATUS", game_id_game[gid].getPlayerIds(), to=gid)
    emit("NOTIFICATION", ["User " + str(pid) + " has joined the lobby."], to=gid)
    printState()
    
@socketio.on('GAME_START')
def handle_game_start(gid):    
    # validate GID and sender in GID
    gid = int(gid)
    if gid not in game_ids:
        emit("NOTIFICATION", ["Invalid lobby code!"])
        return
    if request.sid not in player_ids:
        emit("NOTIFICATION", ["You are not registered for this lobby!"])
        return
            
    # get Game from list
    game = game_id_game[gid]
    game.setupGame()

    # tell each player their character and hand
    for pid in game.getPlayerIds():
        emit("PLAYER_WHOAMI", [game.getCharacterForPlayer(pid)], to=pid)
        emit("PLAYER_HAND", game.getHandForPlayer(pid), to=pid)
    
    # send game board, turn order, and current turn to all players
    currentPlayer, currentCharacter = game.getCurrentTurn()
    emit("TURN_CURRENT", [currentCharacter], to=gid)
    emit("TURN_ORDER", [game.getTurnOrder()], to=gid)
    emit("GAME_BOARD", game.getBoard(), to=gid) 

    # send starting player their available turn actions
    emit("PLAYER_ACTIONS", [game.getTurnActions(currentPlayer)], to=currentPlayer)
    printState()

@socketio.on('TURN_ACTION')
def handle_turn_action(data):    
    # parse turn action
    action = data[0]
    params = data[1:]
    # print(action)
    # print(params)

    pid = request.sid
    gid = players_in_game[pid]
    game = game_id_game[gid]

    #Ensure the pid is the current player's turn
    if not game.checkPlayerTurnValid(pid):
        emit("NOTIFICATION", ["It is not your turn"], to=pid)
        return
    if action == "END_TURN":
        nextPlayerId = game.endTurn(pid)
        emit("PLAYER_ACTIONS", [game.getTurnActions(pid)])
        emit("NOTIFICATION", ["User " + str(pid) + " has ended their turn and User " + str(nextPlayerId) + " is up next."], to=gid)        
        currentPlayer, currentCharacter = game.getCurrentTurn()
        emit("TURN_CURRENT", [currentCharacter], to=gid)
        emit("PLAYER_ACTIONS", [game.getTurnActions(pid)])
    elif action == "MOVE":
        if len(params) == 0:    # player chose to move
            emit("MOVE_CHOICES", game.startMove(pid))
        else:                   # player selected move choice
            success = game.move(pid, params[0])
            if success:
                emit("MOVE_CHOICES", [])
                emit("PLAYER_ACTIONS", [game.getTurnActions(pid)])
                emit("NOTIFICATION", ["User " + str(pid) + " has moved to "+params[0]+"."], to=gid)
                emit("GAME_BOARD", game.getBoard(), to=gid)
            else:
                emit("NOTIFICATION", ["Invalid location choice."])
    elif action == "SUGGEST":
        # TODO: suggest
        if len(params) == 1:    # player is disproving, params = ["<The proof>"]
            success, nextPlayerToDisprove, suggester, suggestion = game.disproveSuggestion(pid, params[0])
            if success:
                emit("NOTIFICATION", ["User " + str(nextPlayerToDisprove) + " has disproved the suggestion!"], to=gid)
                emit("NOTIFICATION", ["User " + str(pid) + " has disproved the suggestion with a "+params[0]+" card!"], to=suggester)
            else:
                emit("REQUEST_PROOF", suggestion, to=nextPlayerToDisprove)
        elif len(params) == 2:                   # player is making a suggestion, params = ["Suspect", "Weapon"]. Room = current room
            # suggestion is valid in game (positions, etc)
            suspect, weapon = params
            valid, details = game.suggestionValid(pid, suspect, weapon)
            # if valid, do suggestion stuff
            if valid: 
                room = details

                nextPidToDisprove = game.processSuggestion(pid, suspect, room, weapon)
                # emit("PLAYER_ACTIONS", [game.getTurnActions(pid)]) # not sure what this was supposed to do

                emit("NOTIFICATION", [game.getCharacterForPlayer(pid) + " suggests "
                                      + suspect +" committed the crime in the "+ room +" with the "+ weapon + 
                                      ". " + suspect + " has been moved to " + room], to=gid)
                emit("GAME_BOARD", game.getBoard(), to=gid) 

                emit("REQUEST_PROOF", [suspect, weapon, room], to=nextPidToDisprove)
                print(game.getCharacterForPlayer(nextPidToDisprove) + "'s turn to disprove") #DELETE

            # else, do failed suggestion stuff
            else: 
                emit("NOTIFICATION", [details], to=pid)

        else: 
            emit("NOTIFICATION", ["Invalid Suggestion -- wrong number of parameters"], to=pid)


    elif action == "ACCUSE":
        success = game.processAccusation(pid, params[0], params[1], params[2])
        
        emit("NOTIFICATION", ["The solution is "+str(game.solution)+"."])
        emit("PLAYER_ACTIONS", [game.getTurnActions(pid)])

        if success:
            emit("NOTIFICATION", ["User " + str(pid) + " has solved the mystery!"], to=gid)
        else:
            emit("NOTIFICATION", ["User " + str(pid) + " made a wrong accusation!"], to=gid)

        return
    
    
         
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    #set up all listeners
    #do game logic later, emit a generic response (simulate what we actually get for the game)
    #send messages via postman see the output, what you'd expect in terms of comms
    #do it in a gui, bunch of buttons that says "x" message, display what you'd get
    

# @socketio.on('')
# def handle_(pid):
#     emit("")

# @socketio.on('')
# def handle_(pid):
#     emit("")


# @socketio.on('json')
# def handle_json(json):
#     print('received json: ' + str(json))

# #to send data example
# @socketio.on('message')
# def handle_message(message):
#     send(message)

# @socketio.on('json')
# def handle_json(json):
#     send(json, json=True)

# #emit for custom named events
# @socketio.on('my event')
# def handle_my_custom_event(json):
#     emit('my response', json)

# #broadcasting example needs broadcast=True optional argument to send() and emit()
# @socketio.on('my event')
# def handle_my_custom_event(data):
#     emit('my response', data, broadcast=True)
#
#def some_function():
#    socketio.emit('some event', {'data': 42})

if __name__ == '__main__':
    socketio.run(app)


