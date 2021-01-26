import ISubject from "../../Observer/ISubject";

interface ICard extends ISubject {

    getBackImage(): string;

    getFrontImage(): string;

    show();

    hide();

    flip();

    isVisible(): boolean;

    isPaired(): boolean;

    getPair(): ICard;

    setPair(card: ICard);

}

export default ICard