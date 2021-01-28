const rank = { "Y": "Joker", "A": "Ace", "K": "Knight", "Q": "Queen", "J": "Jack", "T": "Ten", "9":"Nine", "8": "Eight", "7": "Seven", "6": "Six", "5": "Five", "4": "Four", "3": "Three", "2": "Two" }

class RankTypeError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "RankTypeError";
    }
}


class RankType {

    static Joker = "Y"
    static Ace = "A"
    static Knight = "K"
    static Queen = "Q"
    static Jack = "J"
    static Ten = "T"
    static Nine = "9"
    static Eight = "8"
    static Seven = "7"
    static Six = "6"
    static Five = "5"
    static Four = "4"
    static Three = "3"
    static Two = "2"

    static getAllRanks(): string[] {
        return Object.keys(rank)
    }

    static getName(symbol: string): string {
        if (symbol in rank) { // @ts-ignore
            return rank[symbol]
        }
        throw new RankTypeError(`Symbol '${symbol}' does not exist`)
    }

}

export default RankType