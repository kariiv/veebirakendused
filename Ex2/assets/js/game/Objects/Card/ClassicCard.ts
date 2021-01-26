import Card from "./Card"

const suit = {"S": "Spades", "D":"Diamond", "C": "Clubs", "H": "Hearts"}
const rank = { "Y": "Joker", "A": "Ace", "K": "Knight", "Q": "Queen", "J": "Jack", "T": "Ten", "9":"Nine", "8": "Eight", "7": "Seven", "6": "Six", "5": "Five", "4": "Four", "3": "Three", "2": "Two" }

class ClassicCard extends Card {

    suit: string;
    rank: string;

    constructor(backImage:string, frontImage:string, suit, rank) {
        super(backImage, frontImage);

        this.suit = suit;
        this.rank = rank;
    }

    getValue(): string {
        return this.suit
    }

    getRank(): string {
        return this.rank
    }

}

export default ClassicCard;

export const Suit = suit
export const Rank = rank