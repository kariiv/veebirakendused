import ICard from "../Card/ICard";
import IShuffle from "./Shuffle/IShuffle";

interface ITable {

    getSize(): string;

    getWidth(): number;
    getHeight(): number;

    getCards(): ICard[];

    getAvailableCards(): ICard[];

    getCardsCount(): number;

    getAvailableCardsCount(): number;

    getPairsCount(): number;

    showCard(ICard);

    hideCard(ICard);

    shuffle(shuffler: IShuffle);
}

export default ITable