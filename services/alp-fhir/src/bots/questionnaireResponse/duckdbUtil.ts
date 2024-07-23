import { Connection, Database } from "duckdb-async";

export class DuckdbConnection{
    private connection: Connection;
    constructor(){}
    public async createConnection(){
        const duckdDB = await Database.create(
            `../duckdb/cdmdefault.duckdb`
        );
        this.connection = await duckdDB.connect();
    }

    private async execute(sql, parameters?: []) {
        try {
            let temp = sql;
            const result = await this.connection.all(
                temp,
                parameters
            );
            return result
        } catch (err) {
            throw(err);
        }
    }

    public async executeQuery(sql, parameters?: []) {
        try {
            const resultset = await this.execute(sql, parameters)
            const result = this.parseResults(resultset);
            return result;
        } catch (err) {
            throw err;
        }
    }

    public parseResults(result: any) {
        function formatResult(value: any) {
            // TODO: investigate if more cases are needed to handle DATE, TIMESTAMP and BIT datetypes
            switch (typeof value) {
                case "bigint": //bigint
                    return Number(value) * 1;
                default:
                    return value;
            }
        }
        Object.keys(result).forEach((rowId) => {
            Object.keys(result[rowId]).forEach((colKey) => {
                if (
                    result[rowId][colKey] === null ||
                    typeof result[rowId][colKey] === "undefined"
                ) {
                    result[rowId][colKey] ='NoValues';
                } else {
                    result[rowId][colKey] = formatResult(result[rowId][colKey]);
                }
            });
        });
        return result;
    }

    public close(){
        this.connection.close();
    }
}