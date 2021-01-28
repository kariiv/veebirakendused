import ICard from "./ICard"
import Subject from "../../Observer/Subject";

class CardError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "CardError";
    }
}

class Card extends Subject implements ICard {

    backImage: string;
    frontImage: string;
    pair: ICard | null;
    visible: boolean

    constructor(backImage:string, frontImage:string) {
        super()
        this.backImage = backImage;
        this.frontImage = frontImage;
        this.visible = false;
        this.pair = null;
    }

    getBackImage(): string {
        return this.backImage
    }

    getFrontImage(): string {
        return this.frontImage
    }

    getPair(): ICard | null {
        return this.pair;
    }

    isVisible(): boolean {
        return false;
    }

    setPair(card: ICard) {
        this.pair = card;
        this.notify()
    }

    isPaired(): boolean {
        return !!this.pair;
    }

    flip() {
        this.visible = !this.visible;
        this.notify()
    }

    hide() {
        this.visible = false;
        this.notify()
    }

    show() {
        this.visible = true;
        this.notify()
    }

    getValues(): Object {
        return {
            back: this.getFrontImage(),
        }
    }

}

export default Card;