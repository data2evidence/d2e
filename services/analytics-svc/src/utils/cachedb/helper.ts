/*
Helepr function to get cachedb database format for protocol A
*/
export const getCachedbDatabaseFormatProtocolA = (
    dialect: string,
    datasetId
) => {
    return `A|${dialect}|${datasetId}`;
};

/*
Helepr function to get cachedb database format for protocol B
*/
export const getCachedbDatabaseFormatProtocolB = (
    dialect: string,
    databaseCode: string,
    schemaName: string = "",
    vocabSchemaName: string = ""
) => {
    let cachedbDatabaseFormat = `B|${dialect}|${databaseCode}`;
    if (schemaName) {
        cachedbDatabaseFormat += `|${schemaName}`;
    }
    if (vocabSchemaName) {
        cachedbDatabaseFormat += `|${vocabSchemaName}`;
    }
    return cachedbDatabaseFormat;
};
