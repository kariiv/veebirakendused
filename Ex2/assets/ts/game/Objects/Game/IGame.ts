import IMatchStrategy from "../Card/MatchStrategy/IMatchStrategy";
import ITable from "../Table/ITable";
import ICard from "../Card/ICard";
import Subject from "../../Observer/Subject";

interface IGame extends Subject {

    getMatchStrategy(): IMatchStrategy;

    getTable(): ITable;

    getTime(): number;

    getScore(): number;

    getMisses(): number;

    isStarted(): boolean;

    isFinished(): boolean;

    isSurrender(): boolean;

    showCard(card: ICard): void;

    reset(): void;

    finish(): void;

    start(): void;

    surrender(): void;

    getOptions(): any;
}

export default IGame;