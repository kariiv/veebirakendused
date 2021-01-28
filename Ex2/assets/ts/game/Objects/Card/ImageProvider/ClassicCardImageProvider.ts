import IImageProvider from "./IImageProvider";
import BaseImageProvider from "./BaseImageProvider";
import IRank from "../Rank/IRank";
import ISuit from "../Suit/ISuit";

class ClassicCardImageProvider extends BaseImageProvider implements IImageProvider {

    static localCardFaces = "assets/img/cards/front/png/"

    rank: IRank;
    suit: ISuit;

    constructor(rank: IRank, suit:ISuit) {
        super();

        this.rank = rank
        this.suit = suit
    }

    getImageUrl(): string {
        return `${ClassicCardImageProvider.localCardFaces}${this.rank.getSymbol()}${this.suit.getSymbol()}.png`
    }
}

export default ClassicCardImageProvider