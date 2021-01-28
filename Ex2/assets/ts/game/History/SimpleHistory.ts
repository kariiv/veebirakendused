import IHistory from "./IHistory";

class SimpleHistory implements IHistory {

    history: IState[]
    limit: number

    constructor(limit= 0) { // 0 - unlimited
        this.history = []
        this.limit = limit
    }

    push(state:IState) {
        this.history.push(state);
    }

    pop() {
        if (this.history.length === 0) return null
        return this.history.pop();
    }
}

export default SimpleHistory;