import IImageProvider from "./IImageProvider";


class RandomImageProvider implements IImageProvider {

    url: string;

    constructor(url) {
        this.url = url
    }

    getImageUrl(): string {
        return
    }
}

export default RandomImageProvider