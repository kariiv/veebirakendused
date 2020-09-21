(function() {
  "use strict";

  var game;
  var table;
  var scoreboard;
  var liveScore;
  var controls;
  var results;

  var score = [
    // current games
  ];

  var currentGame = {
    size: "3x4",
    score: 200,
    time: 543,
    miss: 2,
    cards: 24,
    type: "Classic",
    strategy: "Rank",
    noDelay: false
  };

  const strategy = (ob1, ob2) => ob1.id === ob2.id && ob1.color == ob2.color;

  var noDelay = false;
  const validStrategies = [
    "Rank", // 0
    "Rank & Color" // 1
  ];

  const validTypes = [
    "Classic", // 0
    "Fancy" // 1
  ];

  var selectSize;
  var selectType;
  var selectStrat;

  var state = [];
  var gameState = { finished: false, started: false };
  var timer;
  var pressed = "";
  var timeout = false;

  var timerInterval;

  const playCardsValues = {
    suits: ["S", "D", "C", "H"],
    ranks: ["A", "K", "Q", "J", "T", "9", "8", "7", "6", "5", "4", "3", "2"],
    jokers: ["YR", "YB"]
  };

  const colorMap = { S: "C", C: "S", D: "H", H: "D" };
  const getColor = { S: "black", C: "black", D: "red", H: "red" };

  const apiUrl = "https://picsum.photos/100/150?random=";
  const localCards = "cards/front/png/";
  const validSize = [
    "2x3", // 6
    "4x4", // 16
    "2x13", // 26
    "4x13", // 52
  ];
  const backs = 8;
  const randomness = 200;

  // call this when the document is ready
  // this function protects itself against being called more than once
  function ready() {
    console.log("Document ready!");
    game = document.getElementById("memory");
    timer = document.getElementById("game-timer");
    scoreboard = document.getElementById("scoreboard");
    liveScore = document.getElementById("game-score");
    controls = document.getElementById("controls");
    setupLayout();
  }

  function startNewGame() {
    clearInterval(timerInterval);

    gameState.finished = false;
    gameState.started = false;

    state = [];

    results.style.display = "none";

    // initial game table
    var size = selectSize.options[selectSize.selectedIndex].value;

    if (!validSize.includes(size)) setupLayout();
    var spl = size.split("x");
    let sizeX = parseInt(spl[0]);
    let sizeY = parseInt(spl[1]);

    currentGame = {
      size,
      score: 0,
      time: 0,
      cards: sizeX * sizeY,
      miss: 0,
      noDelay
    };
    currentGame.strategy = selectStrat.options[selectStrat.selectedIndex].text;

    if (!validStrategies.includes(currentGame.strategy)) {
      console.log("Error! Strat changed!");
      setupLayout();
    }

    currentGame.type = selectType.options[selectType.selectedIndex].text;
    if (!validTypes.includes(currentGame.type)) {
      console.log("Error! Type changed!");
      setupLayout();
    }

    setupTable(sizeX, sizeY);

    calculateScore();
  }

  function getCardValueByRank(rank) {
    if (rank === "Y")
      return playCardsValues.jokers[
        Math.floor(Math.random() * playCardsValues.jokers.length)
      ];
    return (
      rank +
      playCardsValues.suits[
        Math.floor(Math.random() * playCardsValues.suits.length)
      ]
    );
  }

  function getCardValueInSameRank(card) {
    if (card.charAt(0) === "Y") {
      return playCardsValues.jokers[0] === card
        ? playCardsValues.jokers[1]
        : playCardsValues.jokers[0];
    }
    return (
      card.charAt(0) +
      playCardsValues.suits.slice().filter(i => i !== card.charAt(1))[
        Math.floor(Math.random() * 3)
      ]
    );
  }

  function setupTable(sizeX, sizeY) {
    let backIndex = Math.floor(Math.random() * backs) + 1;
    let backUrl = "cards/back/card" + backIndex + ".png";

    // collect new card faces
    let cardDataList = [];

    if (validTypes.indexOf(currentGame.type) === 0) {
      // classic
      console.log(currentGame.cards);
      if (currentGame.cards > 54) {
        console.log("Not enaugh cards!");
        return;
      }
      console.log("Classic");
      let ranks = playCardsValues.ranks.slice();

      if (validStrategies.indexOf(currentGame.strategy) === 0) {
        console.log("Joker included!");
        ranks.push("Y");
      }

      for (let i = (sizeX * sizeY) / 2; i > 0; i--) {
        // RandomUrls
        let rnd = getCardValueByRank(
          ranks[Math.floor(Math.random() * ranks.length)]
        );
        while (cardDataList.find(i => i.value === rnd))
          rnd = getCardValueByRank(
            ranks[Math.floor(Math.random() * ranks.length)]
          );

        let cr = {
          id: rnd.charAt(0),
          value: rnd,
          backUrl,
          frontUrl: localCards + rnd + ".png",
          color: ""
        };
        cardDataList.push(cr);

        if (validStrategies.indexOf(currentGame.strategy) === 0) {
          // Kaart + Sama rank(Not invluded jet)
          let rdn = getCardValueInSameRank(rnd);
          while (cardDataList.find(i => i.value === rdn))
            rdn = getCardValueInSameRank(rnd);

          let crs = {
            id: rdn.charAt(0),
            value: rdn,
            backUrl,
            frontUrl: localCards + rdn + ".png",
            color: ""
          };
          cardDataList.push(crs);
        } else {
          // Kaart + Sama Värv
          let rdn = rnd.charAt(0) + colorMap[rnd.charAt(1)];

          cr.color = getColor[rnd.charAt(1)];
          let crs = {
            id: rdn.charAt(0),
            value: rdn,
            backUrl,
            frontUrl: localCards + rdn + ".png",
            color: getColor[rdn.charAt(1)]
          };
          cardDataList.push(crs);
        }
      }
    } else {
      // Fancy
      currentGame.strategy = selectStrat.options[0].text;

      console.log("Fancy");
      for (let i = (sizeX * sizeY) / 2; i > 0; i--) {
        let rnd = Math.floor(Math.random() * randomness);
        while (cardDataList.find(i => i.id === rnd))
          rnd = Math.floor(Math.random() * randomness);

        let cr = { id: rnd, backUrl, frontUrl: apiUrl + rnd, color: "" };
        cardDataList.push(cr);
        cardDataList.push(cr);
      }
    }

    let cardList = [];

    for (let i = sizeX * sizeY; i > 0; i--) {
      // Cards To List
      cardList.push(createCard(cardDataList.pop()));
    }

    for (let s = sizeX * sizeY; s > 0; s--) shuffle(cardList);

    table.innerHTML = "";

    for (let x = 0; x < sizeX; x++) {
      let row = document.createElement("tr");
      for (let y = 0; y < sizeY; y++) {
        let card = document.createElement("td");
        // GetRandom index and remove one item from list and add it to the view
        // card.appendChild(cardList.splice(Math.floor(Math.random() * cardList.length), 1).pop());
        card.appendChild(cardList.pop());
        row.appendChild(card);
      }
      table.appendChild(row);
    }
  }

  function getOpenCardsCount() {
    return state.filter(i => i.paired).length;
  }

  function calculateScore() {
    // start count 100;
    // Miss -20p
    // Time 1sec -1 point
    // openCards * 200 // MAX Score: cards * 200
    // openCards * 200 // MAX Score: cards * 200
    currentGame.score =
      100 +
      getOpenCardsCount() * 20 * currentGame.cards -
      currentGame.miss * (20 + currentGame.time);
    liveScore.innerText = currentGame.score;
  }

  function ticking() {
    currentGame.time++;
    timer.innerText = currentGame.time;
    calculateScore();
  }

  function turnCard(obj) {
    if (timeout) return;
    if (!gameState.started) {
      // First Click start!!!
      gameState.started = true;
      timerInterval = setInterval(ticking, 1000);
    }

    if (!obj.clicked) {
      obj.turn(true);

      if (pressed === "") {
        pressed = obj;
      } else { // match and turn
        timeout = true;
        let temp = pressed;

        if (noDelay) pair(temp, obj, strategy(temp, obj));
        else { // wait before can check new cards
          setTimeout(() => {
              pair(temp, obj, strategy(temp, obj));
            }, strategy(temp, obj) ? 800 : 1400);
        }
      }
    }
  }

  function pair(card1, card2, isPair) {
    if (isPair) {
      console.log("PAIR!");
      console.log(card1, card2);
      card1.pair();
      card2.pair();
      checkGameEnd();
    } else {
      console.log("Nope!");
      currentGame.miss++;
      card1.turn(false);
      card2.turn(false);
    }
    pressed = "";
    timeout = false;
    calculateScore();
  }

  function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function checkGameEnd() {
    if (!state.find(i => !i.paired)) endGame(true);
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
      lal.getContext("2d").drawImage(backimg,0,0,backimg.width,backimg.height,0,0,100,150);
    };
    backimg.src = card.backUrl;

    front.appendChild(lal);

    var canvas = document.createElement("canvas");
    let ctx = canvas.getContext("2d");

    canvas.height = 150;
    canvas.width = 100;

    var img = new Image();
    img.src = card.frontUrl;

    let back = document.createElement("div");
    back.setAttribute("class", "flip-card-back");
    back.appendChild(canvas);

    inner.appendChild(front);
    inner.appendChild(back);

    flipCard.appendChild(inner);

    let objState = {
      flipTimeout: null,
      drawTimeout: null,
      id: card.id,
      color: card.color,
      clicked: false,
      html: inner,
      paired: false
    };

    objState.turn = visible => {
      if (visible) {
        ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, 100, 150);
      } else {
        if (objState.drawTimeout != null) clearTimeout(objState.drawTimeout);
        objState.drawTimeout = setTimeout(() => {
          if (!objState.clicked) ctx.clearRect(0, 0, 100, 150);
          objState.drawTimeout = null;
        }, noDelay ? 2200 : 800);
      }

      objState.clicked = visible;
      if (visible) objState.html.classList.add("clicked");
      else if (noDelay) {
        if (objState.flipTimeout != null) clearTimeout(objState.flipTimeout);
        objState.flipTimeout = setTimeout(() => {
          if (!objState.clicked) objState.html.classList.remove("clicked");
          objState.flipTimeout = null;
        }, 1400);
      } else objState.html.classList.remove("clicked");
    };

    objState.pair = () => {
      objState.paired = true;
      if (noDelay) setTimeout(() => objState.html.classList.add("hide"), 800);
      else objState.html.classList.add("hide");
    };

    if (validTypes.indexOf(currentGame.type) === 1) {
      objState.color = "";
    }

    state.push(objState);
    flipCard.onclick = () => turnCard(objState);
    return flipCard;
  }

  function revealAllNonVisibleCards() {
    var un = state.find(s => !s.clicked);
    if (un) {
      un.turn(true);
      setTimeout(revealAllNonVisibleCards, 100);
    }
  }

  function endGame(finished) {
    if (gameState.finished) return;
    clearInterval(timerInterval);
    calculateScore();
    gameState.finished = true;
    if (finished) {
      score.push(currentGame);
      refreshScoreboard();
      displayResults(currentGame);
    } else revealAllNonVisibleCards();
  }

  function displayResults(game, customTitle) {
    let title = customTitle ? customTitle : "Game Results";

    results.style.display = "block";
    results.innerHTML = "";

    let s = document.createElement("strong");
    s.innerText = title + ":";
    results.appendChild(s);

    // size,type  score, time, miss,
    let div1 = document.createElement("div");
    div1.appendChild(document.createTextNode(game.size + " " + game.type));
    results.appendChild(div1);

    div1 = document.createElement("div");
    div1.className = "result-item";
    div1.appendChild(document.createTextNode("Gamemode: " + game.strategy));
    results.appendChild(div1);

    div1 = document.createElement("div");
    div1.className = "result-item";
    div1.appendChild(
      document.createTextNode("NoDelay: " + (game.noDelay ? "Yes" : "No"))
    );
    results.appendChild(div1);

    results.appendChild(document.createElement("br"));

    div1 = document.createElement("div");
    div1.appendChild(document.createTextNode("Score: " + game.score));
    div1.className = "result-item";
    results.appendChild(div1);

    div1 = document.createElement("div");
    div1.appendChild(document.createTextNode("Time: " + game.time + "sec"));
    div1.className = "result-item";
    results.appendChild(div1);

    div1 = document.createElement("div");
    div1.appendChild(document.createTextNode("Misses: " + game.miss + "x"));
    div1.className = "result-item";
    results.appendChild(div1);
  }

  function refreshScoreboard() {
    scoreboard.innerHTML =
      score.length === 0
        ? "There is no finished gameplays!\n<br>Start new now!"
        : "";

    for (let n = score.length - 1; n >= 0; n--) {
      let si = score[n];
      let j = document.createElement("li");
      j.className = "scoreboard-item";

      j.onmouseenter = () => displayResults(si, "Game History");
      j.onmouseleave = () => {
        gameState.finished
          ? displayResults(currentGame)
          : (results.style.display = "none");
      };

      j.innerHTML =
        "<div><strong>" +
        si.size +
        "</strong> | " +
        si.score +
        "p | " +
        si.time +
        "s | " +
        si.miss +
        "miss<div>";
      scoreboard.appendChild(j);
    }
  }

  function buildControls() {
    var newGame = document.createElement("div");
    newGame.setAttribute("class", "start-button");
    newGame.innerHTML = "Start new Game";
    newGame.onclick = startNewGame;

    // Continue later
    let reveal = document.createElement("div");
    reveal.setAttribute("class", "reveal");
    reveal.innerHTML = "Reveal cards";
    reveal.onclick = () => endGame(false);

    let del = document.createElement("input");
    del.setAttribute("type", "checkbox");
    del.onclick = () => {
      noDelay = del.checked;
    };

    selectSize = document.createElement("select");
    selectSize.setAttribute("class", "custom-select");
    for (let opt of validSize) {
      let op = document.createElement("option");
      op.value = opt;
      op.innerText = parseInt(opt.split("x")[0]) * parseInt(opt.split("x")[1]);;
      selectSize.appendChild(op);
    }

    selectType = document.createElement("select");
    selectType.setAttribute("class", "custom-select");
    for (let opt of validTypes) {
      let op = document.createElement("option");
      op.innerText = opt;
      selectType.appendChild(op);
    }

    selectStrat = document.createElement("select");
    selectStrat.setAttribute("class", "custom-select");
    for (let strat of validStrategies) {
      let op = document.createElement("option");
      op.innerText = strat;
      selectStrat.appendChild(op);
    }
    controls.innerHTML = "";
    controls.appendChild(newGame);
    controls.appendChild(document.createTextNode("Size:"));
    controls.appendChild(selectSize);
    controls.appendChild(document.createElement("br"));
    controls.appendChild(document.createTextNode("Cards:"));
    controls.appendChild(selectType);
    controls.appendChild(document.createElement("br"));
    controls.appendChild(document.createTextNode("GM:"));
    controls.appendChild(selectStrat);
    controls.appendChild(document.createElement("br"));
    controls.appendChild(document.createTextNode("NoDelay:"));
    controls.appendChild(del);
    controls.appendChild(reveal);
  }

  function setupLayout() {
    game.innerHTML = "";
    let g = document.createElement("div");
    g.setAttribute("class", "game-components");

    // Controls
    buildControls();

    // Table
    let tableWrapper = document.createElement("div");
    tableWrapper.setAttribute("class", "table-wrapper");

    table = document.createElement("table");
    table.setAttribute("class", "game-table");
    tableWrapper.appendChild(table);

    results = document.createElement("div");
    results.setAttribute("class", "show-results");
    results.style.display = "none";

    results.appendChild(document.createTextNode("Testing"));

    tableWrapper.appendChild(results);

    g.appendChild(tableWrapper);

    game.appendChild(g);

    refreshScoreboard();
    // startNewGame();
  }

  document.addEventListener("DOMContentLoaded", ready, false);
})();
