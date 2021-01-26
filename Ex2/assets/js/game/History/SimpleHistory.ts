import IHistory from "./IHistory";

class SimpleHistory extends IHistory {

    constructor(limit=0) {
        super()
        this.history = []
    }

    push(state) {
        this.history.push(state)
    }

    pop() {
        return this.history.pop()
    }
}

export default SimpleHistory;