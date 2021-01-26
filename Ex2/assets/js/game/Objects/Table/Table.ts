import ITable from "./ITable";
import ICard from "../Card/ICard";
import IShuffle from "./Shuffle/IShuffle";

class TableError extends Error {
    constructor(message) {
        super(message);
        this.name = "TableError";
    }
}

class Table implements ITable {

    cards: ICard[];
    size: string;

    constructor(size) {
        this.cards = [];
        this.size = size;

        if ((this.getHeight() * this.getWidth()) % 2 !== 0)
            throw new TableError('Table size cannot be odd number')
    }

    getCards(): ICard[] {
        return this.cards;
    }

    getAvailableCards(): ICard[] {
        return this.getCards().filter(c => !c.isVisible());
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
        return 0;
    }

    hideCard(card: ICard) {
        if (this.getCards().indexOf(card) === -1)
            throw new TableError("Card not found on the table")
        card.hide()
    }

    showCard(card: ICard) {
        if (this.getCards().indexOf(card) === -1)
            throw new TableError("Card not found on the table")
        card.show()
    }
}

export default Table;