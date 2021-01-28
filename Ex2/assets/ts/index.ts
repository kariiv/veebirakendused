"use strict"
import createElement from "./game/shortcuts/createElement";
import IGame from "./game/Objects/Game/IGame";
import IMatchStrategy from "./game/Objects/Card/MatchStrategy/IMatchStrategy";
import CardType from "./game/Objects/Card/CardType";


const timerElement = document.getElementById("game-timer") as HTMLSpanElement;
const scoreboardElement = document.getElementById("scoreboard") as HTMLUListElement;
const liveScoreElement = document.getElementById("game-score")! as HTMLSpanElement;

const gameTableElement = document.getElementById("game-table") as HTMLTableElement;
const gameResultElement = document.getElementById("game-result") as HTMLDivElement;

const btnGameStartElement = document.getElementById("game-start") as HTMLDivElement;
const selectGameModeElement = document.getElementById("game-mode") as HTMLSelectElement;
const selectGameCardsElement = document.getElementById("game-cards") as HTMLSelectElement;
const selectGameSizeElement = document.getElementById("game-size") as HTMLSelectElement;
const selectGameDelayElement = document.getElementById("game-delay") as HTMLInputElement;
const btnRevealCardsElement = document.getElementById("reveal-cards") as HTMLDivElement;


function millisToMinutesAndSeconds(millis: number) {
    const minutes = Math.floor(millis / 60000);
    const seconds = ((millis % 60000) / 1000).toFixed(0);
    return `${minutes}:${seconds}`;
}


function createSelectElementOptions(selectEl: HTMLSelectElement, options: any[]) {
    selectEl.innerText = ""
    for (let opt of options)
        createElement('option', null, selectEl, opt.text, opt.value)
}

function buildControls() {
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

const cardTypes = []
const matchStrategies = []
const tableSizes = []


const validTypes = [
    "Classic", // 0
    "Fancy" // 1
];

const validStrategies = [
    "Rank", // 0
    "Rank & Color" // 1
];

const validSize = [
    "2x3", // 6
    "4x4", // 16
    "2x13", // 26
    "4x13", // 52
];

class MemoryGameController {

    static SCORE_TIMER_INTERVAL = 500;

    games: IGame[];
    currentGame: IGame | null;

    timerInterval: number | undefined;

    size: string;
    cardType: CardType;
    strategy: IMatchStrategy | null;
    noDelay: boolean;


    constructor() {
        this.games = []
        this.currentGame = null
        this.timerInterval = undefined

        this.size = ''
        this.cardType = ''
        this.strategy = null
        this.noDelay = false
    }

    getCurrentGame(): IGame | null {
        return this.currentGame
    }
    getAllGames(): IGame[] {
        return this.games;
    }

    stopTimerInterval() {
        clearInterval(this.timerInterval)
    }

    startTimerInterval(ms: number): void {
        this.stopTimerInterval() // Stop Old Interval
        this.timerInterval = window.setInterval(() => this.timerTick(), ms)
    }

    timerTick() {
        timerElement.innerText = millisToMinutesAndSeconds(this.getCurrentGame()!.getTime())
        liveScoreElement.innerText = this.getCurrentGame()!.getScore().toString()
    }

    startNewGame() {
        gameResultElement.style.display = "none";

        // GET Size, CardType, Strategy

        // const newTable = TableFactory.createFilledTable(this.size, this.cardType)
        // this.currentGame = new Game(newTable,)

        this.setupTable(this.getCurrentGame()!)

        this.startTimerInterval(MemoryGameController.SCORE_TIMER_INTERVAL)
    }

    setupTable(game:IGame) {

    }

    revealCards() {
        if (!confirm("Are you sure You want to surrender?\nGame progress will be lost")) return
        if (this.getCurrentGame()) {
            this.getCurrentGame()!.surrender();
        }
    }

    endGame(game: IGame) {
        this.games.push(game)

        this.refreshScoreboard();
        this.displayResults(game);
        this.stopTimerInterval()
        this.timerTick()
    }

    refreshScoreboard() {
        const games = this.getAllGames()
        scoreboardElement.innerHTML = games.length === 0 ? "There is no finished gameplay!\n<br>Start new now!" : "";

        for (let n = games.length - 1; n >= 0; n--) {
            const game = games[n];

            let j = createElement("li", 'scoreboard-item', scoreboardElement) as HTMLLIElement

            j.onmouseenter = () => this.displayResults(game, "Game History");

            j.onmouseleave = () => {
                const currentGame = this.getCurrentGame()

                if (currentGame && currentGame!.isFinished())
                    this.displayResults(this.getCurrentGame()!)
                else gameResultElement.style.display = "none"
            }

            j.innerHTML =
                "<div><strong>" +
                game.getTable().getSize() +
                "</strong> | " +
                game.getScore() +
                "p | " +
                game.getTime() +
                "s | " +
                game.getMisses() +
                "miss<div>";
        }
    }

    displayResults(game: IGame, title = "Game Results") {

        gameResultElement.style.display = "block";
        gameResultElement.innerHTML = "";

        createElement('strong', null, gameResultElement, title)

        // size,type  score, time, miss,
        // createElement('div', null, gameResultElement, game.getTable().getSize() + " " + game.type)
        // createElement('div', "result-item", gameResultElement, "Gamemode: " + game.strategy)
        createElement('div', "result-item", gameResultElement, "NoDelay: " + (game.getOptions().waitPairFlip ? "Yes" : "No"))

        gameResultElement.appendChild(document.createElement("br"));

        createElement('div', "result-item", gameResultElement, "Score: " + game.getScore())
        createElement('div', "result-item", gameResultElement, "Time: " + millisToMinutesAndSeconds(game.getTime()))
        createElement('div', "result-item", gameResultElement, "Misses: " + game.getMisses() + "x")
    }
}
const controller = new MemoryGameController()


// function getCardValueByRank(rank) {
//     if (rank === "Y")
//         return playCardsValues.jokers[
//             Math.floor(Math.random() * playCardsValues.jokers.length)
//             ];
//     return (
//         rank +
//         playCardsValues.suits[
//             Math.floor(Math.random() * playCardsValues.suits.length)
//             ]
//     );
// }
//
// function getCardValueInSameRank(card) {
//     if (card.charAt(0) === "Y") {
//         return playCardsValues.jokers[0] === card
//             ? playCardsValues.jokers[1]
//             : playCardsValues.jokers[0];
//     }
//     return (
//         card.charAt(0) +
//         playCardsValues.suits.slice().filter(i => i !== card.charAt(1))[
//             Math.floor(Math.random() * 3)
//             ]
//     );
// }

// function setupTable(sizeX, sizeY) {
//     let backIndex = Math.floor(Math.random() * backs) + 1;
//     let backUrl = localBackCards + backIndex + ".png";
//
//     // collect new card faces
//     let cardDataList = [];
//
//     if (validTypes.indexOf(currentGame.type) === 0) {
//         // classic
//         console.log(currentGame.cards);
//         if (currentGame.cards > 54) {
//             console.log("Not enaugh cards!");
//             return;
//         }
//         console.log("Classic");
//         let ranks = playCardsValues.ranks.slice();
//
//         if (validStrategies.indexOf(currentGame.strategy) === 0) {
//             console.log("Joker included!");
//             ranks.push("Y");
//         }
//
//         for (let i = (sizeX * sizeY) / 2; i > 0; i--) {
//             // RandomUrls
//             let rnd = getCardValueByRank(
//                 ranks[Math.floor(Math.random() * ranks.length)]
//             );
//             while (cardDataList.find(i => i.value === rnd))
//                 rnd = getCardValueByRank(
//                     ranks[Math.floor(Math.random() * ranks.length)]
//                 );
//
//             let cr = {
//                 id: rnd.charAt(0),
//                 value: rnd,
//                 backUrl,
//                 frontUrl: localCards + rnd + ".png",
//                 color: ""
//             };
//             cardDataList.push(cr);
//
//             if (validStrategies.indexOf(currentGame.strategy) === 0) {
//                 // Kaart + Sama rank(Not invluded jet)
//                 let rdn = getCardValueInSameRank(rnd);
//                 while (cardDataList.find(i => i.value === rdn))
//                     rdn = getCardValueInSameRank(rnd);
//
//                 let crs = {
//                     id: rdn.charAt(0),
//                     value: rdn,
//                     backUrl,
//                     frontUrl: localCards + rdn + ".png",
//                     color: ""
//                 };
//                 cardDataList.push(crs);
//             } else {
//                 // Kaart + Sama Värv
//                 let rdn = rnd.charAt(0) + colorMap[rnd.charAt(1)];
//
//                 cr.color = getColor[rnd.charAt(1)];
//                 let crs = {
//                     id: rdn.charAt(0),
//                     value: rdn,
//                     backUrl,
//                     frontUrl: localCards + rdn + ".png",
//                     color: getColor[rdn.charAt(1)]
//                 };
//                 cardDataList.push(crs);
//             }
//         }
//     } else {
//         // Fancy
//         currentGame.strategy = selectStrat.options[0].text;
//
//         console.log("Fancy");
//         for (let i = (sizeX * sizeY) / 2; i > 0; i--) {
//             let rnd = Math.floor(Math.random() * randomness);
//             while (cardDataList.find(i => i.id === rnd))
//                 rnd = Math.floor(Math.random() * randomness);
//
//             let cr = { id: rnd, backUrl, frontUrl: apiUrl + rnd, color: "" };
//             cardDataList.push(cr);
//             cardDataList.push(cr);
//         }
//     }
//
//     let cardList = [];
//
//     for (let i = sizeX * sizeY; i > 0; i--) {
//         // Cards To List
//         cardList.push(createCard(cardDataList.pop()));
//     }
//
//     for (let s = sizeX * sizeY; s > 0; s--) shuffle(cardList);
//
//     gameTableElement.innerHTML = "";
//
//     for (let x = 0; x < sizeX; x++) {
//         let row = document.createElement("tr");
//         for (let y = 0; y < sizeY; y++) {
//             let card = document.createElement("td");
//             // GetRandom index and remove one item from list and add it to the view
//             // card.appendChild(cardList.splice(Math.floor(Math.random() * cardList.length), 1).pop());
//             card.appendChild(cardList.pop());
//             row.appendChild(card);
//         }
//         gameTableElement.appendChild(row);
//     }
// }

function ready() {
    gameTableElement.innerHTML = "";

    buildControls();
    controller.refreshScoreboard()

    btnRevealCardsElement.onclick = () => controller.revealCards()
    btnGameStartElement.onclick = () => controller.startNewGame()
    selectGameDelayElement.onclick = () => controller.noDelay = selectGameDelayElement.checked;
}

document.addEventListener("DOMContentLoaded", ready, false);