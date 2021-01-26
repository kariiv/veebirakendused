import ICard from "../ICard";


interface IMatchStrategy {

    getPair(): [];

    isMatchingCards(card1: ICard, card2: ICard): boolean;
}

export default IMatchStrategy;