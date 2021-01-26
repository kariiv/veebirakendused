class IGameModeError extends Error {
    constructor(message) {
        super(message);
        this.name = "IGameModeError";
    }
}


class IGameMode {

    getTable() {
        throw new IGameModeError("Method not implemented!")
    }

    getScore() {
        throw new IGameModeError("Method not implemented!")
    }

}

export default IGameMode;