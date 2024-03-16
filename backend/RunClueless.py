from Game import *
from flask import Flask, render_template
from flask_socketio import SocketIO, send, emit
import uuid
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
game_id_game = {}
players_in_game = {}

# Testing
#-----------------------------------------------------------------------
def printState():
    print("\nNew State:")
    print("GIDs: ", game_ids)
    print("PIDs: ", player_ids)
    print("GIDs -> Game: ")
    for game_id, game in game_id_game.items():
        print("\t", game_id, "->", game)
    print("PIDs -> GIDs")
    print("\t", players_in_game)

# Message Handling
#-----------------------------------------------------------------------
        
@socketio.on('LOBBY_CREATE')
def handle_create_game():
    # give the player an ID
    pid = 0
    while True:
        pid = random.randint(1000,9999)
        if pid not in player_ids:
            player_ids.append(pid)
            break
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
     
    # send the client their id and the lobby code for others to join
    emit("message", [pid, gid])
    printState()

@socketio.on('LOBBY_JOIN')
def handle_lobby_join(gid):
    gid=int(gid)

    # validate GID
    if gid not in game_ids:
        emit("message", [-1])
        return    
    pid = 0
    while True:
        pid = random.randint(1000, 9999)
        if pid not in player_ids:
            player_ids.append(pid)
            break
    
    players_in_game[pid] = gid
    game_id_game[gid].addPlayer(pid)

    emit("message", [pid])
    printState()
    


@socketio.on('GAME_START')
def handle_game_start(gid):
    print("brian was here")
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


