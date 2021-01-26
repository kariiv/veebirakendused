import IImageProvider from "./IImageProvider";
import ClassicCard from "../ClassicCard";

class PlayCardImageProvider implements IImageProvider {

    getImage(card: ClassicCard)  {
        return new Image()
    }
}

export default PlayCardImageProvider