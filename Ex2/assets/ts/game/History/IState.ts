interface IState {

    snapshot(): IState;

    restore(state: IState): void;

}