import ISuit from "./ISuit";

class Suit implements ISuit {

    symbol: string;

    constructor(symbol: string) {
        this.symbol = symbol;
    }

    getName(): string {
        return "";
    }

    getSymbol(): string {
        return this.symbol;
    }

}

export default Suit;