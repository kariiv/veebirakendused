import IImageProvider from "./IImageProvider";
import BaseImageProvider from "./BaseImageProvider";


class RandomImageProvider extends BaseImageProvider implements IImageProvider {

    url: string;

    static DEFAULT_RANGE = 200;
    range: number | undefined

    constructor(range: number | undefined) {
        super()
        this.range = range
        this.url = "https://picsum.photos/100/150?random="
    }

    private getRange() {
        return this.range ? this.range : RandomImageProvider.DEFAULT_RANGE;
    }

    private randomNumber(): number {
        return Math.floor(Math.random() * this.getRange())
    }

    getImageUrl(): string {
        return "https://picsum.photos/100/150?random=" + this.randomNumber()
    }
}

export default RandomImageProvider