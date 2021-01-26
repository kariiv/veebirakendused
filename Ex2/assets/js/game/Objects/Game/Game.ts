import IGame from "./IGame";
import ITable from "./../Table/ITable";
import IMatchStrategy from "../Card/MatchStrategy/IMatchStrategy";

class Game implements IGame {

    table: ITable;
    matchStrategy: IMatchStrategy;

    _isStarted: boolean;
    _startTime: number;
    _isFinished: boolean;
    _finishTime: number;

    cardVisibilityTime: number;
    waitPairFlip: boolean;

    private misses: 0;

    constructor(table: ITable, matchStrategy: IMatchStrategy, options = { cardVisibilityTime: 1500, waitPairFlip: true }) {
        this.table = table;
        this.matchStrategy = matchStrategy;

        const { cardVisibilityTime, waitPairFlip } = options
        this.cardVisibilityTime = cardVisibilityTime
        this.waitPairFlip = waitPairFlip
    }

    showCard(ICard) {
        this.getTable().showCard(ICard)
    }


    getTable(): ITable {
        return this.table;
    }
    getMatchStrategy(): IMatchStrategy {
        return this.matchStrategy;
    }
    getScore(): number {
        return 0
    }

    getMisses(): number {
        return this.misses;
    }


    isFinished(): boolean {
        return false;
    }
    isStarted(): boolean {
        return false;
    }

    reset() {
        this._isFinished = false
        this._isStarted = false
        this.misses = 0
    }
    finish() {
        this._isFinished = true
        this._finishTime = new Date().getTime()
    }
    start() {
        this._isStarted = true
        this._startTime = new Date().getTime()
    }

}

export default Game;