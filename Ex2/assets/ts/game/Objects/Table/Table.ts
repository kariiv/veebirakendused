import ITable from "./ITable";
import ICard from "../Card/ICard";
import IShuffle from "./Shuffle/IShuffle";

class TableError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "TableError";
    }
}

class Table implements ITable {

    cards: ICard[];
    size: string;

    pair: ICard[]

    constructor(size: string) {
        this.cards = [];
        this.size = size;
        this.pair = []

        if ((this.getHeight() * this.getWidth()) % 2 !== 0)
            throw new TableError('Table size cannot be odd number')
    }

    getCards(): ICard[] {
        return this.cards;
    }

    getRandomCard(cards: ICard[] = []): ICard | null {
        if (!cards) cards = this.getCards()
        if (cards.length === 0) return null
        return cards[Math.floor(Math.random() * cards.length)]
    }

    getAvailableCards(): ICard[] {
        return this.getCards().filter(c => !c.isPaired());
    }

    getAvailableCardsCount(): number {
        return this.getAvailableCards().length;
    }

    getCardsCount(): number {
        return this.getCards().length;
    }

    getHeight(): number {
        return parseInt(this.size.split("x")[1]);
    }

    getSize(): string {
        return this.size;
    }

    getWidth(): number {
        return parseInt(this.size.split("x")[0]);
    }

    shuffle(shuffler: IShuffle) {
        shuffler.shuffle(this.getCards())
    }

    getPairsCount(): number {
        return (this.getCardsCount() - this.getAvailableCardsCount()) / 2;
    }

    hideCard(card: ICard) {
        if (this.getCards().indexOf(card) === -1)
            throw new TableError("Card not found on the table")
        card.hide()
    }

    showCard(card: ICard): ICard[] {
        if (this.getCards().indexOf(card) === -1)
            throw new TableError("Card not found on the table")
        card.show()
        this.pair.push(card)
        const ret = this.pair
        if (this.pair.length === 2) this.pair = []
        return ret
    }

    reset(): void {
        this.getCards().forEach( card => card.hide())
        this.pair = []
    }

    getInvisibleCards(): ICard[] {
        return this.getCards().filter(c => !c.isVisible());
    }

    getVisibleCards(): ICard[] {
        return this.getCards().filter(c => c.isVisible());
    }
}

export default Table;