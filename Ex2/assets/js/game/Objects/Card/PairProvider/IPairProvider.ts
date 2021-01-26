import ICard from "../ICard";

interface IPairProvider {

    getPair(): ICard[];
}

export default IPairProvider