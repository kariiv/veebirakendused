#!/usr/bin/python3

import cgi, json, time, random

playCardsValues = {
    "suits": ["S", "D", "C", "H"],
    "ranks": ["A", "K", "Q", "J", "T", "9", "8", "7", "6", "5", "4", "3", "2"],
    "jokers": ["YR", "YB"]}

color_map = { "S": "C", "C": "S", "D": "H", "H": "D" }
getColor = { "S": "black", "C": "black", "D": "red", "H": "red" }

current_milli_time = lambda: int(round(time.time() * 1000))

def sendError(msg): 
    print(json.dumps( { "error" : str(msg)}))
    exit()

def create_user(id, name):
    return {"id": id, "name": name, "lastActive": current_milli_time()}

def create_player(id, name):
    return {"user": create_user(id, name) if id and name else {}, "time": 0, "misses": 0, "pairs": 0, "turn": False}

def getCardValueByRank(rank):
    if rank == "Y":
        return random.choice(playCardsValues["jokers"])
    return rank + random.choice(playCardsValues["suits"])

def getCardValueInSameRank(card):
    if card[0] == "Y":
        return playCardsValues["jokers"][1] if playCardsValues["jokers"][0] == card else playCardsValues["jokers"][0]
    return card[0] + random.choice(list(filter(lambda x: x != card[1], playCardsValues["suits"])))


def create_table(size):
    r = size.strip().split("x")
    c = int(r[1])
    r = int(r[0])
    cards = []

    for n in range(c*r//2):
        rnd = getCardValueByRank(random.choice(playCardsValues["ranks"]))
        while len(list(filter(lambda x: x == rnd, cards))):
            rnd = getCardValueByRank(random.choice(playCardsValues["ranks"]))
        cards.append(rnd)

        if gm:
            cards.append(rnd[0] + color_map[rnd[1]])
        else:
            rnd = getCardValueInSameRank(rnd)
            while len(list(filter(lambda x: x == rnd, cards))):
                rnd = getCardValueInSameRank(rnd)
            cards.append(rnd)
    for n in range(r*c):
        random.shuffle(cards)
    return {"size": size, "cards": cards, "pairs": [], "turned": []}

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

# Check table
if "table_size" in formdata and "multiplayer" in formdata and "gm" in formdata:
   table_size = formdata['table_size'].value
   is_mutiplayer = True if str(formdata['multiplayer'].value) == "true" else False
   gm = int(formdata['gm'].value)
else:
    sendError("You are missing some table information")


#Get games
games = {}
with open("data/games.json", "r") as file:
    games = json.load(file)

remove = []
#Remove old inactive games
for game in games["games"]:
    current_time = current_milli_time()

    remove_acc = []
    for acc in game["spectators"]:
        if current_time - acc["lastActive"] > 10000:
            remove_acc.append(acc)
    [game["spectators"].remove(acc) for acc in remove_acc]

    inactive_player = []
    for acc in game["players"]:
        if not acc["user"] or current_time - acc["user"]["lastActive"] > 10000:
            inactive_player.append(acc)
    
    if (len(inactive_player) > 1 or not game["multiplayer"] and inactive_player) and not game["spectators"]:
        remove.append(game)

#Removing
[games["games"].remove(game) for game in remove]

#Add newGame
game = {"id": current_milli_time() }
game["players"] = [create_player(user, username), ]
if is_mutiplayer:
    game["players"].append(create_player("", "")) 
game["gm"] = gm
game["multiplayer"] = is_mutiplayer
game["isStarted"] = False
game["isFinished"] = False
game["timestamp"] = 0
game["turnDelay"] = 0

try:
    game["table"] = create_table(table_size)
except Exception as ex:
    sendError(ex)

game["banned"] = []
game["spectators"] = []

games["games"].append(game)

data = json.dumps(games)

try:
    with open("data/games.json", "w") as file:
        file.write(data)
    print(json.dumps(game))
except Exception as ex:
    sendError("Error json.dump:" + str(ex))