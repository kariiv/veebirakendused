import ISubject from "../../Observer/ISubject";

interface ICard extends ISubject {

    getBackImage(): string;

    getFrontImage(): string;

    getValues(): Object;

    show(): void;

    hide(): void;

    flip(): void;

    isVisible(): boolean;

    isPaired(): boolean;

    getPair(): ICard | null;

    setPair(card: ICard): void;

}

export default ICard