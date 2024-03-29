export interface QueryObjectResultType<T> {
    data: T;
    sql: string;
    sqlParameters: any[];
}
