import {
    CohortType,
    CohortDefinitionTableType,
    QueryObjectType,
} from "../../types";
import { Logger, QueryObject as qo } from "@alp/alp-base-utils";
import CreateLogger = Logger.CreateLogger;
import QueryObject = qo.QueryObject;
import { Connection as connLib } from "@alp/alp-base-utils";
import ConnectionInterface = connLib.ConnectionInterface;

const logger = CreateLogger("analytics-log");

export class CohortEndpoint {
    constructor(
        public connection: ConnectionInterface,
        public schemaName: string
    ) {}

    private parseDateToString(date: Date): string {
        return date.toISOString().slice(0, 19).replace("T", " ");
    }

    private getInsertSyntaxQuery(): string {
        return `JOIN
        (SELECT DISTINCT * FROM 
        (SELECT TO_NVARCHAR(COHORT_DEFINITION_SYNTAX) AS syntax FROM $$SCHEMA$$.COHORT_DEFINITION cd) as cd_syntax
        WHERE syntax LIKE %s AND syntax LIKE %s) as cdd
        ON syntax=TO_NVARCHAR(COHORT_DEFINITION_SYNTAX)`;
    }

    private createCohortQuery(
        selectQueryString: string,
        queryParams: Object,
        offset?: number,
        limit?: number
    ) {
        let queryValues = [];

        for (const key in queryParams) {
            switch (key.toUpperCase()) {
                case "ID":
                    selectQueryString += `WHERE COHORT_DEFINITION_ID = %s`;
                    queryValues.push(queryParams[key]);
                    break;
                case "DATE":
                    selectQueryString += `WHERE TO_DATE(COHORT_INITIATION_DATE) = TO_DATE(%s)`;
                    queryValues.push(queryParams[key]);
                    break;
                case "OWNER":
                    selectQueryString += `WHERE UPPER(OWNER) = UPPER(%s)`;
                    queryValues.push(queryParams[key]);
                    break;
                case "SYNTAX":
                    // query by bookmark id
                    // COHORT_DEFINITION_SYNTAX column type text, has to be converted to NVARCHAR.
                    selectQueryString += this.getInsertSyntaxQuery();
                    queryValues.push(`%${queryParams[key].datasetId}%`);
                    queryValues.push(`%${queryParams[key].bookmarkId}%`);
                    break;
                default:
                    break;
            }
        }

        // Add limit and/or offset keyword if is it included
        if (limit) {
            queryValues.push(limit);
            selectQueryString += `LIMIT %l`;
            if (offset) {
                queryValues.push(offset);
                selectQueryString += `OFFSET %l`;
            }
        }

        return QueryObject.format(selectQueryString, ...queryValues);
    }

    public async queryCohorts(
        queryParams: Object,
        offset?: number,
        limit?: number
    ) {
        let selectQueryString = `SELECT 
        COHORT_DEFINITION_ID AS "COHORT_DEFINITION_ID",
        COHORT_DEFINITION_NAME AS "COHORT_DEFINITION_NAME",
        TO_VARCHAR(COHORT_DEFINITION_DESCRIPTION) AS "COHORT_DEFINITION_DESCRIPTION",
        COHORT_INITIATION_DATE AS "COHORT_INITIATION_DATE",
        COHORT_MODIFICATION_DATE AS "COHORT_MODIFICATION_DATE",
        TO_NVARCHAR(COHORT_DEFINITION_SYNTAX) AS "COHORT_DEFINITION_SYNTAX",
        OWNER AS "OWNER"
        FROM $$SCHEMA$$.COHORT_DEFINITION
        `;

        let cohortArray = [];

        try {
            const selectQuery = this.createCohortQuery(
                selectQueryString,
                queryParams,
                offset,
                limit
            );

            let selectQueryResult = await selectQuery.executeQuery(
                this.connection
            );

            // For each cohort definition, query cohort table for list of patient ids
            for (const cohortObj of selectQueryResult.data as any[]) {
                let patientIds = await this.queryPatientIds(
                    cohortObj.COHORT_DEFINITION_ID
                );
                cohortArray.push(<CohortType>{
                    id: cohortObj.COHORT_DEFINITION_ID,
                    patientIds,
                    name: cohortObj.COHORT_DEFINITION_NAME,
                    description: cohortObj.COHORT_DEFINITION_DESCRIPTION,
                    creationTimestamp: cohortObj.COHORT_INITIATION_DATE,
                    modificationTimestamp: cohortObj.COHORT_MODIFICATION_DATE,
                    owner: cohortObj.OWNER,
                    syntax: cohortObj.COHORT_DEFINITION_SYNTAX,
                });
            }

            return cohortArray;
        } catch (err) {
            logger.error(`Failed to query cohort with data: ${queryParams}`);
            throw err;
        }
    }

    // Get count of cohort definitions
    public async queryCohortDefinitionCount(queryParams: Object) {
        let selectQueryString = `SELECT COUNT(*) as count FROM $$SCHEMA$$.COHORT_DEFINITION
        `;

        try {
            const selectQuery = this.createCohortQuery(
                selectQueryString,
                queryParams
            );

            let selectQueryResult = await selectQuery.executeQuery(
                this.connection
            );
            return selectQueryResult.data[0].COUNT;
        } catch (err) {
            logger.error(`Failed to query cohort definition counts`);
            throw err;
        }
    }

    // Save cohort definition to db
    public async saveCohortDefinitionToDb(
        cohortDefinition: CohortDefinitionTableType
    ) {
        let queryString = `
        INSERT INTO $$SCHEMA$$.COHORT_DEFINITION (
            COHORT_DEFINITION_NAME,
            COHORT_DEFINITION_DESCRIPTION,
            COHORT_INITIATION_DATE,
            OWNER,
            DEFINITION_TYPE_CONCEPT_ID,
            COHORT_DEFINITION_SYNTAX,
            SUBJECT_CONCEPT_ID
            )
        VALUES (%s, %s, %s, %s, %s, %s, %s)`;

        try {
            const query = QueryObject.format(
                queryString,
                cohortDefinition.name,
                cohortDefinition.description,
                this.parseDateToString(cohortDefinition.creationTimestamp),
                cohortDefinition.owner,
                cohortDefinition.definitionTypeConceptId,
                cohortDefinition.syntax,
                cohortDefinition.subjectConceptId
            );
            let result = await query.executeQuery(this.connection);
            return result;
        } catch (err) {
            logger.error(
                `Failed to insert cohort definition with data: ${cohortDefinition}`
            );
            throw err;
        }
    }

    public async saveCohortToDb(
        cohortDefinitionId: number,
        cohort: CohortType,
        queryObject: QueryObjectType
    ) {
        try {
            const partialInsertQuery = QueryObject.formatDict(
                queryObject.queryString,
                { cohortDefinitionId }
            );
            const insertQuery = new QueryObject(
                partialInsertQuery.queryString,
                [
                    ...queryObject.parameterPlaceholders,
                    ...partialInsertQuery.parameterPlaceholders,
                ]
            );
            const rowCount = await insertQuery.executeQuery(this.connection);
            return rowCount;
        } catch (err) {
            logger.error(`Failed to insert cohort with data: ${cohort}`);
            // Cleanup previously inserted cohort definition and cohort rows
            await this.deleteCohortDefinitionFromDb(cohortDefinitionId);
            await this.deleteCohortFromDb(cohortDefinitionId);
            throw err;
        }
    }

    public async deleteCohortDefinitionFromDb(cohortId: number) {
        // Delete from cohort definition table
        let queryString = `DELETE FROM $$SCHEMA$$.COHORT_DEFINITION WHERE COHORT_DEFINITION_ID = %s`;

        try {
            const query = QueryObject.format(queryString, cohortId);
            let result = await query.executeQuery(this.connection);
            return result;
        } catch (err) {
            logger.error(`Failed to delete cohort with ID: ${cohortId}`);
            throw err;
        }
    }

    public async deleteCohortFromDb(cohortId: number) {
        // Delete from cohort table
        let queryString = `DELETE FROM $$SCHEMA$$.COHORT WHERE COHORT_DEFINITION_ID = %s`;

        try {
            const query = QueryObject.format(queryString, cohortId);
            let result = await query.executeQuery(this.connection);
            return result;
        } catch (err) {
            logger.error(`Failed to delete cohort with ID: ${cohortId}`);
            throw err;
        }
    }

    // Get patient list based on cohort definition ID
    async queryPatientIds(cohortDefinitionId: string): Promise<string[]> {
        let selectQueryString = `SELECT SUBJECT_ID FROM $$SCHEMA$$.COHORT
        WHERE COHORT_DEFINITION_ID=%s
        `;
        try {
            const selectQuery = QueryObject.format(
                selectQueryString,
                cohortDefinitionId
            );
            let selectQueryResult = await selectQuery.executeQuery(
                this.connection
            );
            // Extract subject ids from array of objects
            let patientIds;
            if (selectQueryResult.data instanceof Array) {
                patientIds = selectQueryResult.data.map((obj) => {
                    if ("subject_id" in obj) {
                        return obj.subject_id;
                    } else if ("SUBJECT_ID" in obj) {
                        return obj.SUBJECT_ID;
                    }
                });
            }
            return patientIds;
        } catch (err) {
            logger.error(
                `Failed to query cohort definition id with id: ${cohortDefinitionId}`
            );
            throw err;
        }
    }

    // Get ID of cohort definition based on incoming cohort object
    public async queryCohortDefinitionId(
        cohortDefinition: CohortDefinitionTableType
    ): Promise<number> {
        let selectQueryString = `SELECT COHORT_DEFINITION_ID AS "COHORT_DEFINITION_ID" FROM $$SCHEMA$$.COHORT_DEFINITION 
        WHERE COHORT_DEFINITION_NAME=%s AND 
        TO_VARCHAR(COHORT_DEFINITION_DESCRIPTION)=%s AND 
        TO_TIMESTAMP(TO_VARCHAR(COHORT_INITIATION_DATE, 'YYYY-MM-DD HH24:MI:SS'), 'YYYY-MM-DD HH24:MI:SS')=TO_TIMESTAMP(%s, 'YYYY-MM-DD HH24:MI:SS') AND
        OWNER=%s
        `;

        try {
            const selectQuery = QueryObject.format(
                selectQueryString,
                cohortDefinition.name,
                cohortDefinition.description,
                this.parseDateToString(cohortDefinition.creationTimestamp),
                cohortDefinition.owner
            );
            let selectQueryResult = await selectQuery.executeQuery(
                this.connection
            );
            let cohortDefinitionId =
                selectQueryResult.data[0].COHORT_DEFINITION_ID;

            return cohortDefinitionId;
        } catch (err) {
            logger.error(
                `Failed to query cohort definition id with data: ${cohortDefinition}`
            );
            throw err;
        }
    }
}
