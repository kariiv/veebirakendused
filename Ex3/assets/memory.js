(function() {
  "use strict";

  // const newGameEP = "/cgi-bin/newGame.py";
  // const joinGameEP = "/cgi-bin/joinGame.py";
  // const gameEP = "/cgi-bin/game.py";
  // const moveEP = "/cgi-bin/move.py";
  // const scoresEP = "/cgi-bin/scores.py";
  // const gamesEP = "/cgi-bin/games.py";

  // const newGameEP = "http://dijkstra.cs.ttu.ee/~kariiv/cgi-bin/prax3/newGame.py";
  // const joinGameEP = "http://dijkstra.cs.ttu.ee/~kariiv/cgi-bin/prax3/joinGame.py";
  // const gameEP = "http://dijkstra.cs.ttu.ee/~kariiv/cgi-bin/prax3/game.py";
  // const moveEP = "http://dijkstra.cs.ttu.ee/~kariiv/cgi-bin/prax3/move.py";
  // const scoresEP = "http://dijkstra.cs.ttu.ee/~kariiv/cgi-bin/prax3/scores.py";
  // const gamesEP = "http://dijkstra.cs.ttu.ee/~kariiv/cgi-bin/prax3/games.py";

  const newGameEP = "/~kariiv/cgi-bin/prax3/newGame.py";
  const joinGameEP = "/~kariiv/cgi-bin/prax3/joinGame.py";
  const gameEP = "/~kariiv/cgi-bin/prax3/game.py";
  const moveEP = "/~kariiv/cgi-bin/prax3/move.py";
  const scoresEP = "/~kariiv/cgi-bin/prax3/scores.py";
  const gamesEP = "/~kariiv/cgi-bin/prax3/games.py";

  const localCards = "cards/front/png/";
  const validSize = [
    "2x3", // 6
    "4x4", // 16
    "2x13", // 26
    "4x13" // 52
  ];
  const backs = 8;

  var game;
  var table;
  var displayList;
  var liveScoreEl;
  var resultsEl;
  var controls;
  var timer;

  var selectSize;
  var selectMode;
  var nameField;

  var player1Label;
  var player2Label;

  var spectators;

  var id;
  var searching = "";

  var scoreboard = { version: 0 };

  var lastGame = {};

  var gameState = {
    size: "3x4",
    strategy: 0,
    cards: {},
    gameId: ""
  };
  var mainGameSycle = null;

  var setup = { size: "3x4", mode: 0, multiplayer: false };

  const gameMode = [
    "Rank", // 0
    "Rank & Color" // 1
  ];

  var pressed = "";
  var timeout = false;

  var tab;

  function ready() {
    console.log("Document ready!");
    game = document.getElementById("memory");
    timer = document.getElementById("game-timer");
    displayList = document.getElementById("list-items");
    liveScoreEl = document.getElementById("game-score");
    controls = document.getElementById("controls");

    var tabScore = document.getElementById("tabScore");
    var tabSP = document.getElementById("tabSingleplayer");
    var tabMP = document.getElementById("tabMultiplayer");
    tab = [tabScore, tabSP, tabMP];
    tabScore.onmouseup = () => {
      refreshScoreboard();
      changeTabView(tabScore);
    };
    tabSP.onmouseup = () => {
      refreshSinglePlayerBoard();
      changeTabView(tabSP);
    };
    tabMP.onmouseup = () => {
      refreshMultiPlayerBoard();
      changeTabView(tabMP);
    };

    setupLayout();
    id = new Date().getTime().toString();
    tabScore.onmouseup();
  }

  function changeTabView(element) {
    for (var tab_i of tab) {
      if (tab_i === element) {
        tab_i.classList.add("visible");
      } else {
        tab_i.classList.remove("visible");
      }
    }
  }

  function gamePre() {
    if (nameField.value === "") {
      console.log("Error: Name is not specified!");
      return false;
    } 
    player1Label.innerHTML = nameField.value;
    player2Label.innerHTML = "";
    nameField.classList.add("name-hidden");
    player1Label.classList.remove("name-hidden");
    player2Label.classList.remove("name-hidden");
    timer.innerHTML = 0;
    resultsEl.style.display = "none";
    return true
  }

  function newGameConsept() {
    if (!gamePre()) return; 

    setup.size = selectSize.options[selectSize.selectedIndex].value;
    setup.mode = selectMode.selectedIndex;

    console.log("ID", id);
    console.log("Username", nameField.value);

    let formData = new FormData();
    formData.append("user", id);
    formData.append("username", nameField.value);
    formData.append("table_size", setup.size);
    formData.append("multiplayer", setup.multiplayer);
    formData.append("gm", setup.mode);

    fetch(newGameEP, {
      method: "POST",
      body: formData
    })
      .then(data => data.json())
      .then(json => {
        console.log(json);
        if (json.error) return console.log(json.error);
        runGame(json);
      })
      .catch(err => console.log(err));
  }

  function joinGame(gameid) {
    if (!gamePre()) return; 

    console.log("ID", id);
    console.log("Username", nameField.value);

    let formData = new FormData();
    formData.append("user", id);
    formData.append("username", nameField.value);
    formData.append("game", gameid);

    fetch(joinGameEP, {
      method: "POST",
      body: formData
    })
      .then(data => data.json())
      .then(json => {
        console.log(json);
        if (json.error) return console.log(json.error);
        console.log('Game Request!');
        console.log(json)
        runGame(json);
      })
      .catch(err => console.log(err));
  }

  function runGame(json) {
    console.log(json);

    setup.mode = json.gm
    setup.multiplayer = json.multiplayer
    setup.size = json.table.size

    let userFrom = new FormData();
    userFrom.append("user", id);
    userFrom.append("game", json.id);

    setupTable(json.table, userFrom);

    if (mainGameSycle !== null) {
      clearInterval(mainGameSycle);
      mainGameSycle = null;
    }

    mainGameSycle = setInterval(() => updateState(userFrom), 500);
  }

  function updateState(userForm) {
    fetch(gameEP, { method: "POST", body: userForm })
      .then(data => data.json())
      .then(json => {
        if (json.error) return console.log(json.error);

        if (json.isFinished) endGame(json.score);

        for (var card in gameState.cards) {
          let cardState = gameState.cards[card];

          if (json.table.pairs.includes(card)) {
            if (!cardState.state.paired) {
              cardState.state.paired = true;
              cardState.pair();
            }
          } else if (json.table.turned.includes(card)) {
            if (!cardState.state.turned) cardState.turn(true);
          } else cardState.turn(false);
        }
        var tempPlayer = getPlayerById(json.players, id);
        if (tempPlayer) {
          timer.innerHTML = Math.floor(getPlayerById(json.players, id).time / 1000);
          liveScoreEl.innerText = calculateScore(tempPlayer, getSizeObj(setup.size).count);
        }
        refreshPlayers(json.players);
        refreshSpectators(json.spectators);
      })
      .catch(err => console.log(err));
  }

  function getPlayerById(players, id) {
    for (var a of players) {
      if (a.user && a.user.id.toString() === id.toString()) {
        return a;
      }
    }
  }

  function refreshPlayers(players) {
    player1Label.innerHTML = players[0].user.name;
    if (setup.multiplayer) {
      if (players[1].user.name != undefined)
        player2Label.innerHTML = players[1].user.name;
      playerLabelState(player2Label, !players[0].turn);
      playerLabelState(player1Label, players[0].turn);
    } else {
      playerLabelState(player1Label, true);
    }
  }

  function playerLabelState(playerlabel, show) {
    if (show) playerlabel.classList.add("name-active");
    else playerlabel.classList.remove("name-active");
  }

  function refreshSpectators(game_spectators) {
    game_spectators = game_spectators.map(i => i["name"])
    spectators.innerHTML = game_spectators.join(", ");
  }

  function setupTable(tableData, userForm) {
    let size = getSizeObj(tableData.size);
    let backUrl = "cards/back/card2.png";

    table.innerHTML = "";
    for (let x = 0; x < size.x; x++) {
      let row = document.createElement("tr");
      for (let y = 0; y < size.y; y++) {
        let place = document.createElement("td");
        let cardId = tableData.cards.pop();

        let card = createCard({ cardId, backUrl });

        let form = userForm;

        card.onclick = () => {
          if (card.state.turned) return;
          fetch(moveEP + "?card=" + cardId, {
            method: "POST",
            body: form
          })
            .then(data => data.json())
            .then(json => console.log(json.error))
            .catch(err => console.log(err));
        };

        gameState.cards[cardId] = card;
        place.appendChild(card);
        row.appendChild(place);
      }
      table.appendChild(row);
    }
  }

  function calculateScore(player, count) {
    return Math.floor(100 + count * player.pairs - player.misses * (20 + player.time / 1000) + player.pairs);
  }

  function createCard(card) {
    let flipCard = document.createElement("div");
    flipCard.setAttribute("class", "flip-card box");

    let inner = document.createElement("div");
    inner.setAttribute("class", "flip-card-inner");

    let front = document.createElement("div");
    front.setAttribute("class", "flip-card-front");

    var lal = document.createElement("canvas");
    lal.height = 150;
    lal.width = 100;

    var backimg = new Image();
    backimg.onload = () => {
      lal
        .getContext("2d")
        .drawImage(
          backimg,
          0,
          0,
          backimg.width,
          backimg.height,
          0,
          0,
          100,
          150
        );
    };
    backimg.src = card.backUrl;

    front.appendChild(lal);

    var canvas = document.createElement("canvas");
    let ctx = canvas.getContext("2d");

    canvas.height = 150;
    canvas.width = 100;

    var img = new Image();
    img.src = localCards + card.cardId + ".png";

    img.onload = () => {
      ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, 100, 150);
    };

    let back = document.createElement("div");
    back.setAttribute("class", "flip-card-back");
    back.appendChild(canvas);

    inner.appendChild(front);
    inner.appendChild(back);

    flipCard.appendChild(inner);

    flipCard.state = {
      flipTimeout: null,
      drawTimeout: null,
      html: inner,
      turned: false,
      paired: false
    };

    flipCard.turn = visible => {
      flipCard.state.turned = visible;

      if (visible) flipCard.state.html.classList.add("clicked");
      else flipCard.state.html.classList.remove("clicked");
    };

    flipCard.pair = () => {
      flipCard.state.paired = true;
      flipCard.state.html.classList.add("hide");
    };

    return flipCard;
  }

  function endGame(score) {
    console.log('Game over!');
    clearInterval(mainGameSycle);
    displayResults(score);
  }

  function displayResults(game, customTitle) {
    let title = customTitle ? customTitle : "Game Results";
    console.log(game);

    resultsEl.style.display = "block";
    resultsEl.innerHTML = "";

    let s = document.createElement("strong");
    s.innerText = title + ":";
    resultsEl.appendChild(s);

    let div1 = document.createElement("div");
    div1.appendChild(document.createTextNode(game.size + " " + (game.gm == 0 ? "Rank":"Color")));
    resultsEl.appendChild(div1);

    if (game.multiplayer) {
      var winner = calculateScore(game.player1, getSizeObj(game.size).count) > calculateScore(game.player2, getSizeObj(game.size).count) ?  game.player1 : game.player2;

      div1 = document.createElement("div");
      div1.appendChild(document.createTextNode("Winner is " + winner.name));
      div1.className = "result-item";
      resultsEl.appendChild(div1);
  
    } else {
      resultsEl.appendChild(document.createElement("br"));
    }

    div1 = document.createElement("div");
    div1.appendChild(document.createTextNode("Score: " + calculateScore(game.player1, getSizeObj(game.size).count) + (game.multiplayer? "/" + calculateScore(game.player2, getSizeObj(game.size).count) :"")));
    div1.className = "result-item";
    resultsEl.appendChild(div1);

    div1 = document.createElement("div");
    div1.appendChild(document.createTextNode("Time: " + Math.floor(game.player1.time/1000) + (game.multiplayer? "/" + Math.floor(game.player2.time/1000) :"")));
    div1.className = "result-item";
    resultsEl.appendChild(div1);

    div1 = document.createElement("div");
    div1.appendChild(document.createTextNode("Pairs: " + game.player1.pairs + (game.multiplayer? "/" + game.player2.pairs :"")));
    div1.className = "result-item";
    resultsEl.appendChild(div1);

    div1 = document.createElement("div");
    div1.appendChild(document.createTextNode("Misses: " + game.player1.misses + (game.multiplayer? "/" + game.player2.misses :"")));
    div1.className = "result-item";
    resultsEl.appendChild(div1);

    if (game.multiplayer) {
      div1 = document.createElement("div");
      div1.appendChild(document.createTextNode("Total time: " + (Math.floor(game.player1.time/1000) + Math.floor(game.player2.time/1000))));
      div1.className = "result-item";
      resultsEl.appendChild(div1);
    }
  }

  function refreshMultiPlayerBoard() {
    searching = "";
    fetch(gamesEP).then(res => res.json()).then(json => {
      console.log(json);
      var data = []
      
      for (var score of json) {
        if (!score.multiplayer) continue;
        if (score.isFinished) continue;

        var item = [];
        item.push((score.gm == 0? "Rank": "Color"));
        item.push( getSizeObj(score.table).count);

        if (score.players[0].user.name != undefined) {
          item.push(score.players[0].user.name);
        } else {
          item.push("-");
        }
        if (score.players[1].user.name != undefined) {
          item.push(score.players[1].user.name);
        } else {
          item.push("-");
        }
        
        item.push((score.isStarted? "Yes": "No"));

        var date = new Date(score.id);
        item.push(getDateTime(date));
        
        item.push(score.id);
        data.push(item)
      }
      var columns = [
        { title: "Mode" },
        { title: "Size" },
        { title: "P1" },
        { title: "P2" },
        { title: "Started" },
        { title: "Created" }
      ]
      displayListTableCreator(data, columns, true);
    })
  }

  function refreshSinglePlayerBoard() {
    searching = "";
    fetch(gamesEP).then(res => res.json()).then(json => {
      console.log(json);
      
      var data = []
      
      for (var score of json) {
        if (score.multiplayer) continue;
        if (score.isFinished) continue;

        var item = [];
        item.push((score.gm == 0? "Rank": "Color"));
        item.push( getSizeObj(score.table).count);

        if (score.players[0].user.name != undefined) {
          item.push(score.players[0].user.name);
        } else {
          item.push("-");
        }
        item.push((score.isStarted? "Yes": "No"));

        var date = new Date(score.id);
        item.push(getDateTime(date));
        item.push(score.id);
        data.push(item)
      }

      var columns = [
        { title: "Mode" },
        { title: "Size" },
        { title: "Player" },
        { title: "Started" },
        { title: "Created" }
      ]
      displayListTableCreator(data, columns, true);
    })
  }

  function refreshScoreboard() {
    fetch(scoresEP + "?v=" + scoreboard.version+ "&s=" + searching)
      .then(data => data.json())
      .then(json => {
        if (json.msg) {
          console.log(json.msg);
        } else {
          scoreboard.version = json.version;
          scoreboard.scores = json.scores;
        }
        console.log(json);

        var data = []

        for (var score of scoreboard.scores) {
          var item = [];
          item.push((score.gm == 0? "Rank": "Color"));
          item.push( getSizeObj(score.size).count );
          item.push((score.multiplayer? "Yes": "No"));

          if (score.multiplayer) {
            item.push(score.player1.name);
            item.push(calculateScore(score.player1, getSizeObj(score.size).count) + "/" + calculateScore(score.player2, getSizeObj(score.size).count) );
            item.push(Math.floor(score.player1.time / 1000).toString() + "/" + Math.floor(score.player2.time / 1000).toString());
            item.push(score.player1.pairs + "/" + score.player2.pairs);
            item.push(score.player1.misses + "/" + score.player2.misses);
            item.push(score.player2.name);
            item.push( calculateScore(score.player1, getSizeObj(score.size).count) + calculateScore(score.player2, getSizeObj(score.size).count) );
          } else {
            item.push(score.player1.name);
            item.push(calculateScore(score.player1, getSizeObj(score.size).count));
            item.push(Math.floor(score.player1.time / 1000));
            item.push(score.player1.pairs);
            item.push(score.player1.misses);
            item.push("-");
            item.push("-");
          }
          var date = new Date(score.timestamp);
          item.push(getDateTime(date));
          data.push(item);
        }

        var columns = [
          { title: "Mode" },
          { title: "Size" },
          { title: "MP" },
          { title: "P1" },
          { title: "Score" },
          { title: "Time" },
          { title: "Pair" },
          { title: "Miss" },
          { title: "P2" },
          { title: "Total time" },
          { title: "Datetime" }
        ]

        displayListTableCreator(data, columns, false)
      });
  }

  function getDateTime(date) {
    var m = doubleDigit(date.getMonth().toString())
    var d = doubleDigit(date.getDay().toString())
    var h = doubleDigit(date.getHours().toString())
    var min = doubleDigit(date.getMinutes().toString())

    return [date.getFullYear(), m, d].join(".") + " " + h + ":" + min;
  }

  function doubleDigit(digit) {
    return digit.length < 2 ? "0" + digit : digit;
  }

  function displayListTableCreator(data, columns, join) {
    if (join) {
      displayList.innerHTML = "</input><table id=\"example\" class=\"display\" width=\"100%\"></table>";
      loadData(data, columns, join)
    }
    else {
      displayList.innerHTML = "<input type=\"text\" id=\"input\"></input><table id=\"example\" class=\"display\" width=\"100%\"></table>";
      var search = document.getElementById("input");
      search.onchange = () => {
        searching = search.value
        refreshScoreboard();
      }
      loadData(data, columns, join)
    }

  }

  function loadData(data, columns, join) {
    $('#example').DataTable( {
      "lengthMenu": [[5, 10, 15], [5, 10, 15]],
      data: data,
      columns,
      "rowCallback": (join ? ( row, data ) => {
        console.log(row, data);
        row.onclick = () => joinGame(data[data.length-1])
      }:() =>{}),
    });  
  }
  

  function buildControls() {
    var newGameButton = document.createElement("div");
    newGameButton.setAttribute("class", "start-button");
    newGameButton.innerHTML = "Start new Game";
    newGameButton.onclick = newGameConsept;

    let multi = document.createElement("input");
    multi.setAttribute("type", "checkbox");
    multi.onclick = () => {
      setup.multiplayer = multi.checked;
    };

    selectSize = document.createElement("select");
    selectSize.setAttribute("class", "custom-select");
    for (let opt of validSize) {
      let op = document.createElement("option");
      op.value = opt;
      op.innerText = parseInt(opt.split("x")[0]) * parseInt(opt.split("x")[1]);
      selectSize.appendChild(op);
    }

    selectMode = document.createElement("select");
    selectMode.setAttribute("class", "custom-select");
    for (let strat of gameMode) {
      let op = document.createElement("option");
      op.innerText = strat;
      selectMode.appendChild(op);
    }

    controls.innerHTML = "";
    controls.appendChild(newGameButton);
    controls.appendChild(document.createTextNode("Size:"));
    controls.appendChild(selectSize);
    controls.appendChild(document.createElement("br"));
    controls.appendChild(document.createTextNode("GM:"));
    controls.appendChild(selectMode);
    controls.appendChild(document.createElement("br"));
    controls.appendChild(document.createTextNode("Multiplayer:"));
    controls.appendChild(multi);
  }

  function setupLayout() {
    game.innerHTML = "";
    let g = document.createElement("div");
    g.setAttribute("class", "game-components");

    var nameWrapper = document.createElement("div");
    nameWrapper.classList = "name-wrapper";

    nameField = document.createElement("Input");
    nameField.classList = "name-field";
    nameField.setAttribute("placeholder", "Name");

    player1Label = document.createElement("span");
    player1Label.classList = "name-player1 name-hidden name-active";
    player1Label.innerHTML = "Hehe";

    player2Label = document.createElement("span");
    player2Label.classList = "name-player2 name-hidden";
    player2Label.innerHTML = "Hehe";

    nameWrapper.appendChild(nameField);
    nameWrapper.appendChild(player1Label);
    nameWrapper.appendChild(player2Label);

    g.appendChild(nameWrapper);

    // Controls
    buildControls();

    // Table
    let tableWrapper = document.createElement("div");
    tableWrapper.setAttribute("class", "table-wrapper");

    table = document.createElement("table");
    table.setAttribute("class", "game-table");
    tableWrapper.appendChild(table);

    resultsEl = document.createElement("div");
    resultsEl.setAttribute("class", "show-results");
    resultsEl.style.display = "none";

    tableWrapper.appendChild(resultsEl);

    g.appendChild(tableWrapper);

    spectators = document.createElement("p");
    spectators.classList = "spectators";
    

    g.appendChild(spectators);

    game.appendChild(g);
  }

  function getSizeObj(size) {
    var spl = size.split("x");
    let x = parseInt(spl[0]);
    let y = parseInt(spl[1]);
    return { x, y, count: x * y, str: size };
  }

  document.addEventListener("DOMContentLoaded", ready, false);
})();
