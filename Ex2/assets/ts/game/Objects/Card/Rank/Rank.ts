import IRank from "./IRank";
import RankType from "./RankType";

// @ts-ignore
class Rank implements IRank {

    private readonly symbol: string;

    constructor(symbol: string) {
        this.symbol = symbol
    }

    getName(): string {
        return RankType.getName(this.symbol);
    }

    getSymbol(): string {
        return this.symbol;
    }

}

export default Rank;