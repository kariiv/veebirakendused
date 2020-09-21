#!/usr/bin/python3
# -*- coding: utf-8 -*-

import cgi, json

print("Content-type: text/json")
print("Access-Control-Allow-Origin: *")
print()

formdata = cgi.FieldStorage()

with open("../../prax3/data/scores.json", "r") as file:
    scores = json.load(file)

if "s" in formdata:
    search = formdata['s'].value
    result = []
    for score in scores["scores"]:
        if search.lower() in score["player1"]["name"].lower():
            result.append(score)
        if score["multiplayer"]:
            if search.lower() in score["player2"]["name"].lower():
                result.append(score)
    scores["scores"] = result
    print(json.dumps(scores))
else:
    # Check user
    if "v" in formdata and str(formdata["v"].value) == str(scores["version"]):
        print(json.dumps(scores))
    else:
        print(json.dumps(scores))