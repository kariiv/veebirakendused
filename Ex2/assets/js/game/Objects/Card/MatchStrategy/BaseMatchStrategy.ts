import IMatchStrategy from "./IMatchStrategy";
import ICard from "../ICard";

abstract class BaseMatchStrategy implements IMatchStrategy {

    abstract getPair(): [];

    isMatchingCards(card1: ICard, card2: ICard): boolean {
        return card1.getHashCode() === card2.getHashCode();
    }

}