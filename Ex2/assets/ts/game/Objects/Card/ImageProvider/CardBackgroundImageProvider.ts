import IImageProvider from "./IImageProvider";
import BaseImageProvider from "./BaseImageProvider";

class CardBackgroundImageProvider extends BaseImageProvider implements IImageProvider {

    static localBackgrounds = "assets/img/cards/back/card";

    index: number

    constructor(index: number) {
        super();
        this.index = index;
    }

    getImageUrl(): string {
        return `${CardBackgroundImageProvider.localBackgrounds}${this.index}.png`;
    }
}

export default CardBackgroundImageProvider