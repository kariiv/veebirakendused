#!/usr/bin/python3

import cgi, json, time

current_milli_time = lambda: int(round(time.time() * 1000))

def sendError(msg): 
    print(json.dumps( { "error" : str(msg)}))
    exit()

def create_user(id, name):
    return {"id": id, "name": name, "lastActive": current_milli_time()}

print("Content-type: text/json")
print("Access-Control-Allow-Origin: *")
print()

formdata = cgi.FieldStorage()

# Check user
if "user" in formdata and "username" in formdata:
   user = formdata['user'].value
   username = formdata['username'].value
else:
    sendError("You are missing credentials")

# CheckGame
if "game" in formdata:
   gameId = int(formdata['game'].value)
else:
    sendError("Game ID is not defined")

#Get games
games = {}
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


for game in games["games"]:
    if gameId == game["id"]:
        # Add to first free place player or spectator
        player1 = game["players"][0]
        if player1["user"]:
            if game["multiplayer"] and not game["players"][1]["user"]:
                game["players"][1]["user"] = create_user(user, username)
            else:
                game["spectators"].append(create_user(user, username))
        else:
            player1["user"] = create_user(user, username)
        
        try:
            send = json.dumps(game)
            data = json.dumps(games)
            with open("data/games.json", "w") as file:
                file.write(data)
            print(send)
            exit()
        except Exception as ex:
            sendError("Error json.dump:" + str(ex))

sendError("No games with ID")