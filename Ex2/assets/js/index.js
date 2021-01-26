"use strict"


const timerElement = document.getElementById("game-timer");
const scoreboardElement = document.getElementById("scoreboard");
const liveScoreElement = document.getElementById("game-score");

const gameTableElement = document.getElementById("game-table");
const gameResultElement = document.getElementById("game-result");

const btnGameStartElement = document.getElementById("game-start");
const selectGameModeElement = document.getElementById("game-mode");
const selectGameCardsElement = document.getElementById("game-cards");
const selectGameSizeElement = document.getElementById("game-size");
const selectGameDelayElement = document.getElementById("game-delay");
const btnRevealCardsElement = document.getElementById("reveal-cards");


class memoryController {

    scoreInterval = null;

    constructor() {
        this.games = []
        this.currentGame = null
    }

    getCurrentGame() {
        return this.currentGame
    }

    startScoreInterval(ms) {
        this.scoreInterval = setInterval(() => {
            liveScoreElement.innerText = this.getCurrentGame().getScore()
        }, ms)
    }

    stopScoreInterval() {
        clearInterval(this.scoreInterval)
    }




}

let score = [
    // current games
];

let currentGame = {
    size: "3x4",
    score: 200,
    time: 543,
    miss: 2,
    cards: 24,
    type: "Classic",
    strategy: "Rank",
    noDelay: false
};

const strategy = (ob1, ob2) => ob1.id === ob2.id && ob1.color === ob2.color;

let noDelay = false;

const validStrategies = [
    "Rank", // 0
    "Rank & Color" // 1
];

const validTypes = [
    "Classic", // 0
    "Fancy" // 1
];

let selectSize;
let selectType;
let selectStrat;

let state = [];
let gameState = { finished: false, started: false };
let pressed = "";
let timeout = false;

let timerInterval;

const playCardsValues = {
    suits: ["S", "D", "C", "H"],
    ranks: ["A", "K", "Q", "J", "T", "9", "8", "7", "6", "5", "4", "3", "2"],
    jokers: ["YR", "YB"]
};

const colorMap = { S: "C", C: "S", D: "H", H: "D" };
const getColor = { S: "black", C: "black", D: "red", H: "red" };

const apiUrl = "https://picsum.photos/100/150?random=";

const localCards = "assets/img/cards/front/png/";
const localBackCards = "assets/img/cards/back/card";

const validSize = [
    "2x3", // 6
    "4x4", // 16
    "2x13", // 26
    "4x13", // 52
];

const backs = 8;
const randomness = 200;

function createElement(el, className, parent, innerHTML, value) {
    let element = document.createElement(el);
    if (className) element.className = className
    if (innerHTML !== null && innerHTML !== undefined) element.innerHTML = innerHTML
    if (value !== null && value !== undefined) element.value = value;
    if (parent !== null && parent !== undefined) parent.appendChild(element)
    return element
}


// call this when the document is ready
// this function protects itself against being called more than once
function ready() {
    buildControls();
    setupLayout();
}

function startNewGame() {
    clearInterval(timerInterval);

    gameState.finished = false;
    gameState.started = false;

    state = [];

    gameResultElement.style.display = "none";

    // initial game table
    const size = selectGameSizeElement.options[selectGameSizeElement.selectedIndex].value;

    if (!validSize.includes(size))
        setupLayout();
    let spl = size.split("x");
    const sizeX = parseInt(spl[0]);
    const sizeY = parseInt(spl[1]);

    currentGame = {
        size,
        score: 0,
        time: 0,
        cards: sizeX * sizeY,
        miss: 0,
        noDelay
    };
    currentGame.strategy = selectGameModeElement.options[selectGameModeElement.selectedIndex].text;

    if (!validStrategies.includes(currentGame.strategy)) {
        console.log("Error! Strat changed!");
        setupLayout();
    }

    currentGame.type = selectGameCardsElement.options[selectGameCardsElement.selectedIndex].text;
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
    let backUrl = localBackCards + backIndex + ".png";

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

    gameTableElement.innerHTML = "";

    for (let x = 0; x < sizeX; x++) {
        let row = document.createElement("tr");
        for (let y = 0; y < sizeY; y++) {
            let card = document.createElement("td");
            // GetRandom index and remove one item from list and add it to the view
            // card.appendChild(cardList.splice(Math.floor(Math.random() * cardList.length), 1).pop());
            card.appendChild(cardList.pop());
            row.appendChild(card);
        }
        gameTableElement.appendChild(row);
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
    liveScoreElement.innerText = currentGame.score;
}

function ticking() {
    currentGame.time++;
    timerElement.innerText = currentGame.time;
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
    const flipCard = createElement('div', "flip-card box");
    const inner = createElement("div", "flip-card-inner", flipCard);

    const front = createElement("div", "flip-card-front", inner);
    const back = createElement("div", "flip-card-back", inner);

    const frontCanvas = createElement("canvas", null, front);
    frontCanvas.height = 150;
    frontCanvas.width = 100;

    const backImg = new Image();
    backImg.onload = () =>
        frontCanvas.getContext("2d").drawImage(backImg,0,0,backImg.width,backImg.height,0,0,100,150);
    backImg.src = card.backUrl;

    const canvas = createElement("canvas", null, back);
    const ctx = canvas.getContext("2d");

    canvas.height = 150;
    canvas.width = 100;

    let img = new Image();
    img.src = card.frontUrl;

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
    const un = state.find(s => !s.clicked);
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

function displayResults(game, title = "Game Results") {

    gameResultElement.style.display = "block";
    gameResultElement.innerHTML = "";

    createElement('strong', null, gameResultElement, title)

    // size,type  score, time, miss,
    createElement('div', null, gameResultElement, game.size + " " + game.type)
    createElement('div', "result-item", gameResultElement, "Gamemode: " + game.strategy)
    createElement('div', "result-item", gameResultElement, "NoDelay: " + (game.noDelay ? "Yes" : "No"))

    gameResultElement.appendChild(document.createElement("br"));

    createElement('div', "result-item", gameResultElement, "Score: " + game.score)
    createElement('div', "result-item", gameResultElement, "Time: " + game.time + "sec")
    createElement('div', "result-item", gameResultElement, "Misses: " + game.miss + "x")
}

function refreshScoreboard() {
    scoreboardElement.innerHTML = score.length === 0 ? "There is no finished gameplay!\n<br>Start new now!" : "";

    for (let n = score.length - 1; n >= 0; n--) {
        let si = score[n];

        let j = createElement("li", 'scoreboard-item', scoreboardElement)
        j.onmouseenter = () => displayResults(si, "Game History");
        j.onmouseleave = () => gameState.finished ? displayResults(currentGame) : (gameResultElement.style.display = "none");

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
    }
}



function createSelectElementOptions(selectEl, options) {
    selectEl.innerText = ""
    for (let opt of options)
        createElement('option', null, selectEl, opt.text, opt.value)
}

function buildControls() {
    btnGameStartElement.onclick = startNewGame;
    btnRevealCardsElement.onclick = () => endGame(false);
    selectGameDelayElement.onclick = () => noDelay = selectGameDelayElement.checked;

    createSelectElementOptions(selectGameSizeElement, validSize.map(value => {
        const split = value.split("x")
        const text = (parseInt(split[0]) * parseInt(split[1])).toString()
        return { value, text }
    }))

    createSelectElementOptions(selectGameCardsElement, validTypes.map(value => {
        return { text:value }
    }))

    createSelectElementOptions(selectGameModeElement, validStrategies.map(value => {
        return { text: value }
    }))
}

function setupLayout() {
    gameTableElement.innerHTML = "";

    refreshScoreboard();
    // startNewGame();
}

document.addEventListener("DOMContentLoaded", ready, false);