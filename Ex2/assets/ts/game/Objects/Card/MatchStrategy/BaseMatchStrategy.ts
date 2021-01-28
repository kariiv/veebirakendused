import IMatchStrategy from "./IMatchStrategy";
import ICard from "../ICard";
import CardType from "../CardType";


abstract class BaseMatchStrategy implements IMatchStrategy {

    isMatchingCards(card1: ICard, card2: ICard): boolean {
        return false
    }

    cardTypeAllowed(cardType: CardType): boolean {
        return false;
    }

}