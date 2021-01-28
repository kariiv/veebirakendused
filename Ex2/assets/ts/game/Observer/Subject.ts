import ISubject from "./ISubject";
import IObserver from "./IObserver";

class Subject implements ISubject {

    private observers: IObserver[] = []

    attach(observer: IObserver): void {
        if (this.observers.indexOf(observer) !== -1) return
        this.observers.push(observer);
    }

    detach(observer: IObserver): void {
        const observerIndex = this.observers.indexOf(observer);
        if (observerIndex === -1) return

        this.observers.splice(observerIndex, 1);
    }

    notify(): void {
        for (const observer of this.observers) observer.update(this);
    }

}

export default Subject