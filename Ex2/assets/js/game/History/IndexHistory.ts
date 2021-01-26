import IHistory from "./IHistory";

class IndexHistory extends IHistory {

    constructor() {
        super()
        this.history = []
        this.index = -1
    }

    push(state=null) {
        if (state) {
            this.history.splice(0,this.index)
            this.history.push(state)
            this.index = this.history.length - 1
        }
        else
            this.index++
    }

    pop() {
        if (this.index !== -1)
            return this.history[--this.index]
        return null
    }


}

export default IndexHistory;