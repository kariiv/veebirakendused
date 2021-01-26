import ISubject from "./ISubject";

interface IObserver {

    update(subject: ISubject): void;
}

export default IObserver;