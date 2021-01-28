interface IMatch { // Act as decorator

    isMatching(another: IMatch): boolean;

}

export default IMatch;