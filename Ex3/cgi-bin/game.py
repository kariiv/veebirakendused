#!/usr/bin/python3
# -*- coding: utf-8 -*-

import cgi, os, json, time

current_milli_time = lambda: int(round(time.time() * 1000))
invert_color = {"S":"C", "C":"S", "H":"D", "D":"H"}
def sendError(msg): 
    print(json.dumps( { "error" : str(msg)}))
    exit()

print("Content-type: text/json")
print("Access-Control-Allow-Origin: *")
print()

def updateUser(user):
    user["lastActive"] = current_milli_time()

def getGameState(game, userId):
    try:
        for userId in game["banned"]:
            sendError("You are banned from this game!")
    except Exception as ex:
        sendError("Checking banned list:" + str(ex))
        
    current_time = current_milli_time()

    try:
        if not game["isStarted"]:
            player1 = game["players"][0]
            if player1["user"]:
                if not game["multiplayer"] or game["multiplayer"] and game["players"][1]["user"]:
                    player1["turn"] = True
    except Exception as ex:
        sendError("Start game initial:" + str(ex))

    try:
        for player in game["players"]:
            # calculate new time
            user = player["user"]
            if user:
                if current_time - user["lastActive"] > 10000:
                    player["user"] = {}
                    continue
                # last active
                if user["id"] == userId:
                    updateUser(user)
            if game["isStarted"] and player["turn"]:
                turning_player = player
                if game["timestamp"]:
                    player["time"] = player["time"] + current_time - game["timestamp"]
                    game["timestamp"] = current_time
                else:
                    game["timestamp"] = current_time
    except Exception as ex:
        sendError("Update players: " + str(ex))
        
    try:
        if not game["isFinished"] and game["turnDelay"] and current_time - game["turnDelay"] > 1000:
            table = game["table"]
            #Calculate score and give turn

            is_pair = table["turned"][0][0] == table["turned"][1][0]
            
            if is_pair and game["gm"]:
                is_pair = invert_color[table["turned"][0][1]] == table["turned"][1][1]
            
            if not is_pair:
                # add miss and switch if multi
                turning_player["misses"] = turning_player["misses"] + 1
                if game["multiplayer"]:
                    turning_player["turn"] = False
                    game["players"][(game["players"].index(turning_player) + 1) % 2]["turn"] = True
            else:
                [table["pairs"].append(card) for card in table["turned"]]

                turning_player["pairs"] = turning_player["pairs"] + 1
            
            table["turned"] = []
            game["turnDelay"] = 0

            if len(table["pairs"]) == len(table["cards"]):
                # Save 
                scores = {}
                with open("data/scores.json", "r") as file:
                    scores = json.load(file)
                    
                player_stat = game["players"][0]
                player_stat = {"name": player_stat["user"]["name"], "time": player_stat["time"], "misses": player_stat["misses"], "pairs": player_stat["pairs"]}

                score = { "id":game["id"], "multiplayer":game["multiplayer"], "gm":game["gm"], "size": game["table"]["size"], "player1": player_stat, "timestamp": current_milli_time()}
                
                if game["multiplayer"]:
                    player_stat = game["players"][1]
                    score["player2"] = {"name": player_stat["user"]["name"], "time": player_stat["time"], "misses": player_stat["misses"], "pairs": player_stat["pairs"]}
                scores["scores"].append(score)
                scores["version"] = current_milli_time()

                game["score"] = score

                with open("data/scores.json", "w") as file:
                    json.dump(scores, file)

                game["isFinished"] = True
    except Exception as ex:
        sendError("Pair Checking:" + str(ex))
    
    try:
        remove = []
        for user in game["spectators"]:
            if user["id"] == userId:
                updateUser(user)
            else:
                if current_time - user["lastActive"] > 10000:
                    remove.append(user)
        [game["spectators"].remove(user) for user in remove]
    except Exception as ex:
        sendError("Removing spectators: " + str(ex))

    state = { "players": game["players"] }
    if game["isFinished"]:
        state["score"] = game["score"]
    state["table"] = {"pairs": game["table"]["pairs"], "turned": game["table"]["turned"]  } 
    state["spectators"] = game["spectators"]
    state["isFinished"] = game["isFinished"]

    return json.dumps(state)

formdata = cgi.FieldStorage()

if "game" in formdata:
   gameId = int(formdata['game'].value)
else:
    # QUERY ALL GAMES AND SEND
    sendError("Game ID is not defined")

if "user" in formdata:
   user = formdata['user'].value
else:
    sendError("You are missing ID")


with open("data/games.json", "r") as file:
    games = json.load(file)


for game in games["games"]:
    if gameId == game["id"]:
        try:
            send = getGameState(game, user)
            data = json.dumps(games)
            with open("data/games.json", "w") as file:
                file.write(data)
            print(send)
            exit()
        except Exception as ex:
            sendError("Writing:" + str(ex))

sendError("Game: was not found")