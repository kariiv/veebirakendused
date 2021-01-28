import IImageProvider from "./IImageProvider";

abstract class BaseImageProvider implements IImageProvider {

    getImage(): HTMLImageElement {
        const img =  new Image(100, 150)
        img.alt = 'Card'
        img.src = this.getImageUrl()
        return img
    }

    abstract getImageUrl(): string;
}

export default BaseImageProvider;