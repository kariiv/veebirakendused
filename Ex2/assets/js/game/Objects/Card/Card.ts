import ICard from "./ICard"
import IObserver from "../../Observer/IObserver";

class CardError extends Error {
    constructor(message) {
        super(message);
        this.name = "CardError";
    }
}

class Card implements ICard {

    observers: IObserver[];

    backImage: string;
    frontImage: string;
    pair: ICard;
    visible: boolean

    constructor(backImage:string, frontImage:string) {
        this.backImage = backImage;
        this.frontImage = frontImage;
        this.visible = false;
        this.pair = undefined;
        this.observers = []
    }

    getBackImage(): string {
        return this.backImage
    }

    getFrontImage(): string {
        return this.frontImage
    }

    getPair(): ICard {
        return this.pair;
    }

    isVisible(): boolean {
        return false;
    }

    setPair(card: ICard) {
        this.pair = card;
    }

    isPaired(): boolean {
        return !!this.pair;
    }

    flip() {
        this.visible = !this.visible;
    }

    hide() {
        this.visible = false;
    }

    show() {
        this.visible = true;
    }

}

export default Card;