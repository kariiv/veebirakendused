import IGame from "./IGame";
import ITable from "./../Table/ITable";
import IMatchStrategy from "../Card/MatchStrategy/IMatchStrategy";
import Subject from "../../Observer/Subject";
import ICard from "../Card/ICard";
import FisherYatesShuffle from "../Table/Shuffle/FisherYatesShuffle";

class Game extends Subject implements IGame {

    table: ITable;
    matchStrategy: IMatchStrategy;

    _isStarted: boolean;
    _startTime: number;
    _isFinished: boolean;
    _finishTime: number;
    _isSurrender: boolean;

    cardVisibilityTime: number;
    waitPairFlip: boolean;

    private misses: number;

    constructor(table: ITable, matchStrategy: IMatchStrategy, options = { cardVisibilityTime: 1500, waitPairFlip: true }) {
        super()

        this.table = table;
        this.matchStrategy = matchStrategy;

        this._isStarted = false;
        this._isFinished = false;
        this._startTime = 0;
        this._finishTime = 0;
        this._isSurrender = false;

        this.misses = 0;

        const { cardVisibilityTime, waitPairFlip } = options
        this.cardVisibilityTime = cardVisibilityTime
        this.waitPairFlip = waitPairFlip
    }

    showCard(card: ICard) {
        const result = this.getTable().showCard(card) // ICard[]
        if (result.length === 2) {
            const card1 = result[0]
            const card2 = result[1]

            if (this.getMatchStrategy().isMatchingCards(card1, card2)){
                card1.setPair(card2)
                card2.setPair(card1)
                this.checkGameEnd()
            } else {
                // Todo: handle Rotate delay
                this.misses++
                card1.hide()
                card2.hide()
            }
        }
    }

    checkGameEnd() {
        if (this.getTable().getAvailableCards().length === 0) this.finish()
    }

    getTable(): ITable {
        return this.table;
    }
    getMatchStrategy(): IMatchStrategy {
        return this.matchStrategy;
    }

    getTime(): number {
        if (!this._isStarted)
            return 0
        if (!this.isFinished())
            return new Date().getTime() - this._startTime
        return this._finishTime - this._startTime
    }

    getScore(): number {
        // start count 100;
        // Miss -20p
        // Time 1sec -1 point
        // openCards * 200 // MAX Score: cards * 200
        // openCards * 200 // MAX Score: cards * 200
        return 100 +
            this.getTable().getPairsCount() * 20 * this.getTable().getCardsCount() -
            this.getMisses() * (20 + this.getTime() / 1000);
    }

    getMisses(): number {
        return this.misses;
    }


    isFinished(): boolean {
        return this._isFinished;
    }
    isStarted(): boolean {
        return this._isStarted;
    }
    isSurrender(): boolean {
        return this._isSurrender;
    }

    reset() {
        this._isFinished = false
        this._isStarted = false
        this.misses = 0
        this.getTable().reset()
        this.notify()
    }
    finish() {
        this._isFinished = true
        this._finishTime = new Date().getTime()
        this.notify()
    }
    start() {
        this._isStarted = true
        this._startTime = new Date().getTime()
        this.notify()
    }
    surrender() {
        const cards = this.getTable().getInvisibleCards()
        new FisherYatesShuffle().shuffle(cards)
        for (const card of cards) {
            card.show()
        }
        this._isSurrender = true
        this.notify()
    }

    getOptions(): { waitPairFlip: boolean, cardVisibilityTime:number } {
        return {
            waitPairFlip: this.waitPairFlip,
            cardVisibilityTime: this.cardVisibilityTime,
        }
    }

}

export default Game;