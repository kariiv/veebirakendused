#!/usr/bin/python3
# -*- coding: utf-8 -*-

import cgi, os, json, time

current_milli_time = lambda: int(round(time.time() * 1000))

def sendError(msg): 
    print(json.dumps( { "error" : str(msg)}))
    exit()

print("Content-type: text/json")
print("Access-Control-Allow-Origin: *")
print()

formdata = cgi.FieldStorage()


if "game" in formdata:
   gameId = int(formdata['game'].value)
else:
    sendError("Game ID is not defined")

if "user" in formdata:
   user = formdata['user'].value
else:
    sendError("You are missing ID")

if "card" in formdata:
   card = formdata['card'].value
else:
    sendError("You are missing selected card")

with open("data/games.json", "r") as file:
    games = json.load(file)

def get_turn_player(current):
    for player in current["players"]:
        if player["turn"]:
            return player


for game in games["games"]:
    if gameId == game["id"]:
        player = get_turn_player(game)
        if player and player["user"] and player["user"]["id"] == user:

            table =  game["table"]
            if card not in table["cards"]:
                game["banned"].append(user)
                sendError("Banned: TryHardHacker - Selected card do not exists on the table.")
            if len(table["turned"]) > 1:
                sendError("Maximum 2 cards can be turned at the time!")
            if card in table["turned"]:
                sendError("Card is already turned")
            elif card in table["pairs"]:
                sendError("Card is already paired")
            else:
                if not game["isStarted"]:
                    game["isStarted"] = True
                table["turned"].append(card)

            if len(table["turned"]) == 2:
                game["turnDelay"] = current_milli_time()
            
            try:
                data = json.dumps(games)
                with open("data/games.json", "w") as file:
                    file.write(data)
            except Exception as ex:
                sendError("Writing:" + str(ex))

            sendError(str(table["turned"]))
        else:
            sendError("Its not your turn")

sendError("Game: was not found")

    

