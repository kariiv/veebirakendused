import IMatchStrategy from "../Card/MatchStrategy/IMatchStrategy";
import ITable from "../Table/ITable";
import Game from "./Game";

class GameFactoryError extends Error {
    constructor(message) {
        super(message);
        this.name = "GameFactoryError";
    }
}

class GameFactory {

    static createGame(table:ITable, matchStrategy: IMatchStrategy) {
        return new Game(table, matchStrategy)
    }

}

export default GameFactory;