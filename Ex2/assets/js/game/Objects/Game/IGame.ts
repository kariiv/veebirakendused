import IMatchStrategy from "../Card/MatchStrategy/IMatchStrategy";
import ITable from "../Table/ITable";

interface IGame {

    getMatchStrategy(): IMatchStrategy;

    getTable(): ITable;

    getScore(): number;

    getMisses(): number;

    isStarted(): boolean;

    isFinished(): boolean;

    showCard(ICard);

    reset();

    finish();

    start();

}

export default IGame;