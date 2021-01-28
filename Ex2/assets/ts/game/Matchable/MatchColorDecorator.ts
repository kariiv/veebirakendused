import IMatch from "./IMatch";

class MatchColorDecorator implements IMatch {

    protected base: IMatch

    constructor(base) {
        this.base = base;
    }

    isMatching(another: IMatch): boolean {
        return this.base.isMatching(another)
    }

}

export default MatchColorDecorator;