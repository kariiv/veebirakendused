interface IHistory {

    push(state: IState): void;

    pop(): IState | null | undefined;
}

export default IHistory