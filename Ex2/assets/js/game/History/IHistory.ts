class IHistoryError extends Error {
    constructor(message) {
        super(message);
        this.name = "IHistoryError";
    }
}

class IHistory {

    push() {
        throw new IHistoryError("Method not implemented!")
    }

    pop() {
        throw new IHistoryError("Method not implemented!")
    }
}

export default IHistory