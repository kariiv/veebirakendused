import ICard from "../ICard";
import CardType from "../CardType";


interface IMatchStrategy {

    cardTypeAllowed(cardType: CardType): boolean;

    isMatchingCards(card1: ICard, card2: ICard): boolean;
}

export default IMatchStrategy;