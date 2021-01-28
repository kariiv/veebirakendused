import ICard from "../Card/ICard";
import IShuffle from "./Shuffle/IShuffle";

interface ITable {

    getSize(): string;

    getWidth(): number;
    getHeight(): number;

    getCards(): ICard[];
    getCardsCount(): number;

    getAvailableCards(): ICard[];
    getAvailableCardsCount(): number;

    getVisibleCards(): ICard[];
    getInvisibleCards(): ICard[];

    getPairsCount(): number;

    showCard(card: ICard): ICard[];

    hideCard(card: ICard): void;

    shuffle(shuffler: IShuffle): void;

    reset(): void;
}

export default ITable