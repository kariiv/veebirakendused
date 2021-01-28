import Table from "./Table";
import ITable from "./ITable";
import CardType from "../Card/CardType";
import IPairProvider from "../Card/PairProvider/IPairProvider";

class TableFactoryError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "TableFactoryError";
    }
}

class TableFactory {

    static createEmptyTable(size: string): ITable {
        return new Table(size)
    }

    static createFilledTable(size: string, cardType: CardType, pairProvider: IPairProvider): ITable {
        return TableFactory.tableFiller(new Table(size), cardType, pairProvider)
    }

    static tableFiller(table: ITable, cardType: CardType, pairProvider: IPairProvider): ITable {

        return table
    }

}

export default TableFactory;