#!/usr/bin/python3
# -*- coding: utf-8 -*-

import json, time

current_milli_time = lambda: int(round(time.time() * 1000))

print("Content-type: text/json")
print("Access-Control-Allow-Origin: *")
print()

with open("data/games.json", "r") as file:
    games = json.load(file)


for game in games["games"]:
    current_time = current_milli_time()

    remove_acc = []
    for acc in game["spectators"]:
        if current_time - acc["lastActive"] > 10000:
            remove_acc.append(acc)
    [game["spectators"].remove(acc) for acc in remove_acc]

    for acc in game["players"]:
        if not acc["user"] or current_time - acc["user"]["lastActive"] > 10000:
            acc["user"] = {}

data = []
for game in games["games"]:
    game_data = {}
    game_data["id"] = game["id"]
    game_data["players"] = game["players"]
    game_data["gm"] = game["gm"]
    game_data["multiplayer"] = game["multiplayer"]
    game_data["isStarted"] = game["isStarted"]
    game_data["isFinished"] = game["isFinished"]
    game_data["table"] = game["table"]["size"]
    data.append(game_data)

print(json.dumps(data))


    

