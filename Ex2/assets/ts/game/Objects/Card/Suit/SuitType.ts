const suit = {"S": "Spades", "D":"Diamond", "C": "Clubs", "H": "Hearts"}
const color = { "S": "Black", "C": "Black", "H": "Red", "D": "Diamond" }

class SuitTypeError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "SuiteTypeError";
    }
}

class SuitType {

    static Spades: 'S'
    static Diamond: "D"
    static Clubs: "C"
    static Hearts: "H"

    static getAllSuits(): string[] {
        return Object.keys(suit)
    }

    static getSuitName(symbol: string): string {
        // @ts-ignore
        if (symbol in suit) return suit[symbol]
        throw new SuitTypeError(`Symbol '${symbol}' does not exist`)
    }

    static getSuitColor(symbol: string): string {
        // @ts-ignore
        if (symbol in color) return color[symbol]
        throw new SuitTypeError(`Symbol '${symbol}' does not exist`)
    }
}

export default SuitType;