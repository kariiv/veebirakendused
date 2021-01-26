import CardType from "./CardType";
import ICard from "./ICard";
import ClassicCard from "./ClassicCard";
import ImageCard from "./ImageCard";
import createElement from "../../shortcuts/createElement";
import IGame from "../Game/IGame";
import IObserver from "../../Observer/IObserver";
import ISubject from "../../Observer/ISubject";

class CardFactory {

    static createCard(cardType: CardType, frontImage: string, backImage: string, options = { value: '', rank: '' }): ICard {
        if (cardType === CardType.Classic)
            return new ClassicCard(backImage, frontImage, options.value, options.rank)
        if (cardType === CardType.Fancy)
            return new ImageCard(backImage, frontImage)
    }

    static createHTMLCardElement(card: ICard, game: IGame): Element {
        const flipCard = createElement('div', "flip-card box") as HTMLDivElement;
        const inner = createElement("div", "flip-card-inner", flipCard);

        const front = createElement("div", "flip-card-front", inner);
        const back = createElement("div", "flip-card-back", inner);

        const frontCanvas = createElement("canvas", null, front) as HTMLCanvasElement;
        frontCanvas.height = 150;
        frontCanvas.width = 100;

        const backImg = new Image();
        backImg.onload = () => frontCanvas.getContext("2d").drawImage(backImg,0,0,backImg.width,backImg.height,0,0,100,150);
        backImg.src = card.getBackImage();

        const canvas = createElement("canvas", null, back) as HTMLCanvasElement;
        const ctx = canvas.getContext("2d");

        canvas.height = 150;
        canvas.width = 100;

        let img = new Image();
        img.src = card.getFrontImage();

        // let objState = {
        //     flipTimeout: null,
        //     drawTimeout: null,
        //     id: card.id,
        //     color: card.color,
        //     clicked: false,
        //     html: inner,
        //     paired: false
        // };
        //
        // objState.turn = visible => {
        //     if (visible) {
        //         ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, 100, 150);
        //     } else {
        //         if (objState.drawTimeout != null) clearTimeout(objState.drawTimeout);
        //         objState.drawTimeout = setTimeout(() => {
        //             if (!objState.clicked) ctx.clearRect(0, 0, 100, 150);
        //             objState.drawTimeout = null;
        //         }, noDelay ? 2200 : 800);
        //     }
        //
        //     objState.clicked = visible;
        //     if (visible) objState.html.classList.add("clicked");
        //     else if (noDelay) {
        //         if (objState.flipTimeout != null) clearTimeout(objState.flipTimeout);
        //         objState.flipTimeout = setTimeout(() => {
        //             if (!objState.clicked) objState.html.classList.remove("clicked");
        //             objState.flipTimeout = null;
        //         }, 1400);
        //     } else objState.html.classList.remove("clicked");
        // };
        //
        // objState.pair = () => {
        //     objState.paired = true;
        //     if (noDelay) setTimeout(() => objState.html.classList.add("hide"), 800);
        //     else objState.html.classList.add("hide");
        // };
        //
        // if (validTypes.indexOf(currentGame.type) === 1) {
        //     objState.color = "";
        // }

        card.attach(new class implements IObserver {
            update(subject: ISubject) {
                const updatedCard = subject as ICard
                if (updatedCard.isPaired()) inner.classList.add("hide")
                else if (updatedCard.isVisible()) inner.classList.add("clicked")
                else inner.classList.remove("clicked")
            }
        })

        flipCard.onclick = () => game.showCard(card);

        return flipCard;
    }

}

export default CardFactory;