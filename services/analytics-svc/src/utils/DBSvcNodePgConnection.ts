import {
    DBSvcConnectionInterface,
    CallBackInterface,
    ParameterInterface,
    flattenParameter,
    DBValues,
} from "./DBSvcConnection";
import { Client } from "pg";
import * as config from "./DBSvcConfig";
const logger = config.getLogger();

function _getRows(result: any) {
    if ("rows" in result) {
        return result.rows;
    }
    return null;
}

export class NodePgConnection implements DBSvcConnectionInterface {
    private constructor(public conn: Client) {}

    public static createConnection(
        client: Client,
        callback: CallBackInterface
    ) {
        try {
            const conn = new NodePgConnection(client);
            callback(null, conn);
        } catch (err) {
            callback(err, null);
        }
    }

    public parseResults(result: any, metadata: any) {
        function formatResult(columnKey: string, value: any) {
            if (!metadata) {
                return value;
            }

            switch (getType(columnKey, value)) {
                case 20: //INT8
                case 21: //INT2
                case 23: //INT4
                    return Number(value) * 1;
                case 1082: //DATE
                case 1114: //TIMESTAMP
                    return value.toISOString();
                case 1560: //BIT
                    return value.toString("hex").toUpperCase();
                default:
                    return value;
            }
        }

        function getType(columnKey: string, value: any) {
            for (const md of metadata) {
                if (md.name === columnKey) {
                    logger.debug(
                        `${md.name} ---- ${md.dataTypeID} ---- value: ${value}`
                    );
                    return md.dataTypeID;
                }
            }
        }
        Object.keys(result).forEach((rowId) => {
            Object.keys(result[rowId]).forEach((colKey) => {
                if (
                    result[rowId][colKey] === null ||
                    typeof result[rowId][colKey] === "undefined"
                ) {
                    result[rowId][colKey] = DBValues.NOVALUE;
                } else {
                    result[rowId][colKey] = formatResult(
                        colKey,
                        result[rowId][colKey]
                    );
                }
            });
        });
        return result;
    }

    public async execute(
        sql: string,
        parameters: ParameterInterface[],
        callback: CallBackInterface
    ) {
        try {
            logger.debug(`Sql: ${sql}`);
            logger.debug(
                `parameters: ${JSON.stringify(flattenParameter(parameters))}`
            );
            let temp = sql;
            temp = this.parseSql(temp);
            this.conn.query(
                temp,
                flattenParameter(parameters),
                (err, result) => {
                    if (err) {
                        logger.error(err);
                        return callback(err, null);
                    }
                    callback(null, result);
                }
            );
        } catch (err) {
            callback(err, null);
        }
    }

    private parseSql(temp: string) {
        // The first few queries to replace are very specific query which does not require further string replacements
        // subsequent lines, hence early return is used.
        const regex1 =
            /UPSERT \"ConfigDbModels_UserDefaultConfig\" \(\"User\", \"ConfigType\", \"ConfigId\", \"ConfigVersion\"\) VALUES \((%s|\?),(%s|\?),(%s|\?),(%s|\?)\) WITH PRIMARY KEY/gi;
        if (temp.match(regex1)) {
            // replace is used with a function as "$1" gets interpreted as a capture group, and will become "?" instead of the desired "$1"
            // For example, "UPSERT "ConfigDbModels_UserDefaultConfig" ("User", "ConfigType", "ConfigId", "ConfigVersion") VALUES (?,?,?,?) WITH PRIMARY KEY"
            // will replace $1, $2, $3, $4 with "?" since these 4 values are captured in the match.
            return temp.replace(
                regex1,
                () => `INSERT INTO "ConfigDbModels_UserDefaultConfig" ("User", "ConfigType", "ConfigId", "ConfigVersion")
          VALUES ($1,$2,$3,$4) on
          conflict ("User", "ConfigType") do
          update
          set "User" = $1, "ConfigType" = $2, "ConfigId" = $3, "ConfigVersion" = $4`
            );
        }

        // const regex2 = /SELECT DISTINCT\(TABLE_NAME\) FROM TABLES WHERE SCHEMA_NAME=\? AND IS_USER_DEFINED_TYPE='FALSE'/
        const regex2 =
            /SELECT DISTINCT\(TABLE_NAME\) FROM TABLES WHERE SCHEMA_NAME='(.*?)' AND IS_USER_DEFINED_TYPE='FALSE'/;
        if (temp.match(regex2)) {
            const regexResult = regex2.exec(temp);
            if (regexResult) {
                const schemaName = regexResult[1];
                return `
        SELECT DISTINCT(table_name) as "(TABLE_NAME)"
        FROM information_schema.tables
        WHERE table_schema = '${schemaName}'
            AND table_type = 'BASE TABLE'`;
            }
        }

        const regex3 =
            /SELECT TABLE_NAME, COLUMN_NAME, DATA_TYPE_NAME, POSITION FROM TABLE_COLUMNS WHERE SCHEMA_NAME='(.*?)' AND TABLE_NAME='(.*?)' GROUP BY TABLE_NAME, COLUMN_NAME, DATA_TYPE_NAME, POSITION ORDER BY POSITION/;
        if (temp.match(regex3)) {
            const regexResult = regex3.exec(temp);
            if (regexResult) {
                const schemaName = regexResult[1];
                const tableName = regexResult[2];
                return `
          SELECT table_name AS "TABLE_NAME",
              column_name AS "COLUMN_NAME",
              UPPER(udt_name) AS "DATA_TYPE_NAME",
              ordinal_position AS "POSITION"
          FROM information_schema.columns
          WHERE table_schema = '${schemaName}'
              AND table_name = '${tableName}'
          GROUP BY table_name,
              column_name,
              udt_name,
              ordinal_position
          ORDER BY ordinal_position`;
            }
        }

        // Grant read privileges to role
        const regex4 =
            /GRANT SELECT, EXECUTE, CREATE TEMPORARY TABLE ON SCHEMA ([\w]+) TO ([\w]+)/;
        if (temp.match(regex4)) {
            const regexResult = regex4.exec(temp);
            if (regexResult) {
                const schemaName = regexResult[1];
                const roleName = regexResult[2];
                return `
        GRANT USAGE ON SCHEMA "${schemaName}" TO "${roleName}";
        GRANT SELECT ON ALL TABLES IN SCHEMA "${schemaName}" TO "${roleName}";
        GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA "${schemaName}" TO "${roleName}";
        GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA "${schemaName}" TO "${roleName}";
        GRANT EXECUTE ON ALL PROCEDURES IN SCHEMA "${schemaName}" TO "${roleName}";
        ALTER DEFAULT PRIVILEGES IN SCHEMA "${schemaName}" GRANT SELECT ON TABLES TO "${roleName}";
        ALTER DEFAULT PRIVILEGES IN SCHEMA "${schemaName}" GRANT USAGE, SELECT ON SEQUENCES TO "${roleName}";
        ALTER DEFAULT PRIVILEGES IN SCHEMA "${schemaName}" GRANT EXECUTE ON FUNCTIONS TO "${roleName}";`;
            }
        }
        // Grant write privileges to role
        const regex5 =
            /GRANT DELETE, EXECUTE, INSERT, SELECT, UPDATE, CREATE TEMPORARY TABLE ON SCHEMA ([\w]+) TO ([\w]+)/;
        if (temp.match(regex5)) {
            const regexResult = regex5.exec(temp);
            if (regexResult) {
                const schemaName = regexResult[1];
                const roleName = regexResult[2];
                return `
        GRANT USAGE ON SCHEMA "${schemaName}" TO "${roleName}";
        GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA "${schemaName}" TO "${roleName}";
        GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA "${schemaName}" TO "${roleName}";
        GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA "${schemaName}" TO "${roleName}";
        ALTER DEFAULT PRIVILEGES IN SCHEMA "${schemaName}" GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO "${roleName}";
        ALTER DEFAULT PRIVILEGES IN SCHEMA "${schemaName}" GRANT EXECUTE ON FUNCTIONS TO "${roleName}";
        ALTER DEFAULT PRIVILEGES IN SCHEMA "${schemaName}" GRANT USAGE, SELECT ON SEQUENCES TO "${roleName}";`;
            }
        }

        // Grant All privileges to role
        // `GRANT ALL PRIVILEGES ON DATABASE "${databaseName}" TO "${roleName}";
        const regex6 =
            /GRANT CREATE ANY, CREATE OBJECT STRUCTURED PRIVILEGE, DELETE, DROP, EXECUTE, INDEX, INSERT, SELECT, SELECT CDS METADATA, SELECT METADATA, UPDATE ON SCHEMA ([\w]+) TO ([\w]+)/;
        if (temp.match(regex6)) {
            const regexResult = regex6.exec(temp);
            if (regexResult) {
                const schemaName = regexResult[1];
                const roleName = regexResult[2];
                return `
        GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA "${schemaName}" TO "${roleName}";
        GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA "${schemaName}" TO "${roleName}";
        GRANT ALL PRIVILEGES ON ALL FUNCTIONS IN SCHEMA "${schemaName}" TO "${roleName}";
        GRANT ALL PRIVILEGES ON ALL PROCEDURES IN SCHEMA "${schemaName}" TO "${roleName}";
        GRANT ALL PRIVILEGES ON ALL ROUTINES IN SCHEMA "${schemaName}" TO "${roleName}";
        ALTER DEFAULT PRIVILEGES IN SCHEMA "${schemaName}" GRANT ALL ON TABLES TO "${roleName}";
        ALTER DEFAULT PRIVILEGES IN SCHEMA "${schemaName}" GRANT ALL ON SEQUENCES TO "${roleName}";
        ALTER DEFAULT PRIVILEGES IN SCHEMA "${schemaName}" GRANT ALL ON FUNCTIONS TO "${roleName}";`;
            }
        }

        // Create user
        const regex7 =
            /CREATE USER ([\w]+) PASSWORD ([\w]+) NO FORCE_FIRST_PASSWORD_CHANGE/;
        if (temp.match(regex7)) {
            const regexResult = regex7.exec(temp);
            if (regexResult) {
                const username = regexResult[1];
                const password = regexResult[2];
                return `
        CREATE USER "${username}" WITH PASSWORD '${password}';`;
            }
        }

        // grant role to user
        const regex8 = /GRANT "([\w]+)" TO ([\w]+)/;
        if (temp.match(regex8)) {
            const regexResult = regex8.exec(temp);
            if (regexResult) {
                const rolename = regexResult[1];
                const username = regexResult[2];
                return `
        GRANT "${rolename}" TO "${username}"`;
            }
        }

        // Grant table write privileges to role
        const regex9 =
            /GRANT DELETE, INSERT, UPDATE ON ([\w]+)\.([\w]+) TO ([\w]+)/;
        if (temp.match(regex9)) {
            const regexResult = regex9.exec(temp);
            if (regexResult) {
                const schemaName = regexResult[1];
                const tableName = regexResult[2];
                const roleName = regexResult[3];
                return `
        GRANT INSERT, UPDATE, DELETE ON "${schemaName}"."${tableName}" TO "${roleName}";
        `;
            }
        }
        // Get snapshot schema table metadata
        const regex10 =
            /SELECT tc.SCHEMA_NAME, tc.TABLE_NAME, tc.COLUMN_NAME, tc.IS_NULLABLE, c.IS_PRIMARY_KEY, rc.COLUMN_NAME AS IS_FOREIGN_KEY FROM SYS.TABLE_COLUMNS AS tc LEFT JOIN SYS."CONSTRAINTS" AS c ON \(tc.TABLE_NAME=c.TABLE_NAME AND tc.SCHEMA_NAME=c.SCHEMA_NAME AND tc.COLUMN_NAME=c.COLUMN_NAME\) LEFT JOIN SYS."REFERENTIAL_CONSTRAINTS" AS rc ON \(tc.TABLE_NAME=rc.TABLE_NAME AND tc.SCHEMA_NAME=rc.SCHEMA_NAME AND tc.COLUMN_NAME=rc.COLUMN_NAME\) WHERE tc.SCHEMA_NAME = \? AND tc.TABLE_NAME = \?/;
        if (temp.match(regex10)) {
            const regexResult = regex10.exec(temp);
            if (regexResult) {
                return `
                    SELECT
                        c.table_schema as "SCHEMA_NAME",
                        c.table_name as "TABLE_NAME",
                        c.column_name as "COLUMN_NAME",
                        case
                            when c.is_nullable = 'YES' then 'TRUE'
                            else 'FALSE'
                        end as "IS_NULLABLE",
                        case
                            when constraint_type = 'PRIMARY KEY' then 'TRUE'
                            else 'NoValue'
                        end as "IS_PRIMARY_KEY",
                        case
                            when constraint_type = 'FOREIGN KEY' then 'TRUE'
                            else 'NoValue'
                        end as "IS_FOREIGN_KEY"
                    FROM
                        information_schema.columns as c
                        LEFT JOIN information_schema.key_column_usage AS kcu ON (
                            kcu.table_name = c.table_name
                            AND kcu.table_schema = c.table_schema
                            AND kcu.column_name = c.column_name
                        )
                        LEFT JOIN information_schema.constraint_column_usage AS ccu ON (
                            ccu.table_name = c.table_name
                            AND ccu.table_schema = c.table_schema
                            AND ccu.column_name = c.column_name
                        )
                        left join information_schema.table_constraints AS tc ON (
                            tc.constraint_name = kcu.constraint_name
                            AND tc.table_schema = kcu.table_schema
                        )
                    where
                        c.table_schema = $1
                        and c.table_name = $2`;
            }
        }

        // remove line breaks and multiple spaces
        temp = temp.replace(/\r?\n|\r/g, "");
        temp = temp.replace(/\s+/g, " ");

        temp = temp.replace(
            /ADD_SECONDS\(([\w]+)\,([0-9]+)\)/g,
            `$1 + interval\'$2 seconds\'`
        );
        // Replace CURRENT_UTCTIMESTAMP with timezone('utc', now())
        temp = temp.replace(/CURRENT_UTCTIMESTAMP/gi, "timezone('utc', now())");
        // Remove FROM DUMMY
        temp = temp.replace(/FROM DUMMY/gi, "");

        // Replace TABLE_COLUMNS with information_schema.columns
        temp = temp.replace(
            /COLUMN_NAME FROM TABLE_COLUMNS WHERE SCHEMA_NAME/gi,
            'COLUMN_NAME AS "COLUMN_NAME" from information_schema.columns where table_schema'
        );
        temp = temp.replace(
            /COLUMN_NAME as "value" FROM TABLE_COLUMNS WHERE SCHEMA_NAME/gi,
            'COLUMN_NAME AS "value" from information_schema.columns where table_schema'
        );

        // Replace TABLE_NAME FROM SYS.M_TABLES WHERE SCHEMA_NAME=
        temp = temp.replace(
            /TABLE_NAME FROM SYS.M_TABLES WHERE SCHEMA_NAME=(\%s|\?) AND \(TABLE_NAME/gi,
            `tablename as "TABLE_NAME" from pg_catalog.pg_tables where schemaname=? AND (UPPER(tablename)`
        );

        // Replace VIEW_COLUMNS with pg_attribute
        temp = temp.replace(
            /COLUMN_NAME as \"value\" FROM VIEW_COLUMNS WHERE SCHEMA_NAME = (\%s|\?) AND VIEW_NAME = (\%s|\?)/gi,
            "attname as value from pg_attribute WHERE  attrelid = concat(%s::text, '.\"', %s::text, '\"')::regclass"
        );
        temp = temp.replace(
            /COLUMN_NAME FROM VIEW_COLUMNS WHERE SCHEMA_NAME = (\%s|\?) AND VIEW_NAME = (\%s|\?)/gi,
            "attname as \"COLUMN_NAME\" from pg_attribute WHERE  attrelid = concat(%s::text, '.\"', %s::text, '\"')::regclass"
        );
        // Query is not parameterized, persist the values in use
        temp = temp.replace(
            /DATA_TYPE_NAME as dataType from TABLE_COLUMNS WHERE TABLE_NAME = (\'[\w.::]*\') AND COLUMN_NAME/gi,
            `data_type as \"dataType\" from information_schema.columns where table_schema=$1 and column_name`
        );
        temp = temp.replace(
            /data_type_name as dataType FROM VIEW_COLUMNS where VIEW_NAME = (\'[\w.::]*\') and column_name/gi,
            `format_type(atttypid, atttypmod) as \"dataType\" from pg_attribute WHERE attrelid = (SELECT oid FROM pg_class WHERE relname = $1) and attname`
        );

        temp = temp.replace(
            /SELECT DISTINCT COLUMN_NAME AS BASIC_TYPE, 'PATIENT' AS origin, DATA_TYPE_NAME as DATATYPE FROM VIEW_COLUMNS WHERE VIEW_NAME=(\'[\w.::]*\')/gi,
            `select distinct attname as \"BASIC_TYPE\", 'PATIENT' AS origin, format_type(atttypid, atttypmod) as \"DATATYPE\" FROM pg_attribute where attrelid= (SELECT oid FROM pg_class WHERE relname = $1)`
        );

        // Replace TABLES, VIEWS with PG_TABLES and PG_VIEWS
        temp = temp.replace(
            /SELECT COUNT\(\*\) AS tableCount from tables where schema_name=(\%s|\?) and table_name=(\%s|\?)/gi,
            'select count(*) as "TABLECOUNT" from pg_tables where schemaname=%s and tablename=%s'
        );
        temp = temp.replace(
            /SELECT COUNT\(\*\) AS tableCount from views where schema_name=(\%s|\?) and view_name=(\%s|\?)/gi,
            'select count(*) as "TABLECOUNT" from pg_views where schemaname=%s and viewname=%s'
        );

        // Replace Upsert with Insert On Conflict
        temp = temp.replace(
            `/UPSERT \"legacy\.config\.db\.models::Configuration\.Config\" \(\"Id\", \"Version\", \"Status\", \"Name\", \"Type\", \"ParentId\", \"ParentVersion\", \"Creator\", \"Created\", \"Modifier\", \"Modified\", \"Data\"\) VALUES \(\'MRI\/PA\/FHIRSCHEMA\', %s, \'FHIR Schema\', \'MRI\/PA\/FHIRSCHEMA\', \'\', \'\', \'\', \'\', \'\', \'\', \'\', TO_NCLOB\(%s\)\) WHERE \"Id\" = \'MRI\/PA\/FHIRSCHEMA\' AND \"Version\" = %s/ig`,
            `INSERT INTO "ConfigDbModels_Config" ("Id", "Version", "Status", "Name", "Type",
      "ParentId", "ParentVersion", "Creator", "Created", "Modifier", "Modified",
      "Data") VALUES ('MRI/PA/FHIRSCHEMA', %s, 'FHIR Schema', 'MRI/PA/FHIRSCHEMA', '', '', '',
      '', '', '', '', TO_NCLOB(%s)) on
      conflict (WHERE "Id" = 'MRI/PA/FHIRSCHEMA' AND "Version" = %s) do
      update "ConfigDbModels_Config"
      set "Id"='MRI/PA/FHIRSCHEMA' , "Version"=$1 , "Status"='FHIR Schema' , "Name"='MRI/PA/FHIRSCHEMA' , "Type"='' ,
     "ParentId"='' , "ParentVersion"='' ,
      "Creator"='' , "Created"='' , "Modifier"='' , "Modified"='' , "Data"=$2`
        );

        // Replace CONTAINS with LIKE and Remove FUZZY
        temp = temp.replace(
            /WHERE CONTAINS\(([\w\.]+), ([\%\w]+), FUZZY\(([\%\s\w\,\'\=]+|[\%\s\w]+)\)\)/gi,
            `WHERE $1 LIKE $2`
        );

        // Remove SNIPPETS
        temp = temp.replace(/SNIPPETS\(([\w\.]+)\)/g, `$1`);

        // Remove NO GRANT TO CREATOR from CREATE ROLE query
        temp = temp.replace(/NO GRANT TO CREATOR/g, "");

        temp = temp.replace(/SCORE\(\)/gi, `'NA'`);
        // Replace Top 1 with Limit 1
        temp = temp.replace(/select Top 1 (.*)/gi, `SELECT $1 Limit 1`);

        // Replace user_name with usename
        temp = temp.replace(/user_name/gi, `usename`);
        // Replace "SYS"."USERS" with pg_user
        temp = temp.replace(/"SYS"."USERS"/gi, `pg_user`);

        // Replace user_name with usename
        temp = temp.replace(/role_name/gi, `rolname`);
        // Replace "SYS"."ROLES" with pg_user
        temp = temp.replace(/"SYS"."ROLES"/gi, `pg_roles`);

        // Replace schemas with information_schema.schemata
        temp = temp.replace(
            /FROM SCHEMAS/gi,
            "FROM information_schema.schemata"
        );

        // Replace
        temp = temp.replace(/TO_NCLOB/gi, "");
        temp = temp.replace(/TO_VARCHAR/gi, "");
        // temp = temp.replace(/TO_INTEGER\(([^\*]*)\)\ \*/ig, "($1)::integer *");
        temp = temp.replace(/TO_INTEGER(\(\"[\w]*\"\))/gi, "$1::integer");
        temp = temp.replace(/TO_BIGINT(\(\"[\w]*\"\))/gi, "$1::bigint");
        temp = temp.replace(
            /TO_DOUBLE(\(\"[\w]*\"\))/gi,
            "$1::double precision"
        );
        temp = temp.replace(/to_nvarchar/gi, "");
        temp = temp.replace(/nvarchar/gi, "VARCHAR");
        temp = temp.replace(/\(SYSUUID\)/gi, "uuid_generate_v4()");

        // Replace %s or `?` with $n
        let n = 0;
        temp = temp.replace(/\%[s]{1}(?![a-zA-Z0-9%])|%UNSAFE|\?/g, () => {
            return "$" + ++n;
        });

        return temp;
    }

    public executeQuery(
        sql: string,
        parameters: ParameterInterface[],
        callback: CallBackInterface
    ) {
        try {
            this.execute(sql, parameters, (err, resultSet) => {
                if (err) {
                    logger.error(err);
                    callback(err, null);
                } else {
                    logger.debug(`${JSON.stringify(resultSet, null, 2)}`);
                    const result = this.parseResults(
                        _getRows(resultSet),
                        resultSet.fields
                    );
                    callback(null, result);
                }
            });
        } catch (err) {
            callback(err, null);
        }
    }

    public executeStreamQuery(
        sql: string,
        parameters: ParameterInterface[],
        callback: CallBackInterface
    ) {
        throw "executeStreamQuery is not yet implemented";
    }

    public executeUpdate(
        sql: string,
        parameters: ParameterInterface[],
        callback: CallBackInterface
    ) {
        try {
            this.execute(sql, parameters, (err, result) => {
                if (err) {
                    callback(err, null);
                }
                callback(null, result.rowCount);
            });
        } catch (error) {
            callback(error, null);
        }
    }

    public executeProc(
        procedure: string,
        parameters: string[],
        callback: CallBackInterface
    ) {
        try {
            const params = parameters.map((param) => "?");
            const sql = `select count(*) from \"${procedure}\"(${params.join()})`;
            logger.debug(`Sql: ${sql}`);
            let temp = sql;
            temp = this.parseSql(temp);
            this.conn.query(temp, parameters, (err, result) => {
                if (err) {
                    return callback(err, null);
                }
                callback(null, result.rowCount);
            });
        } catch (err) {
            callback(err, null);
        }
    }

    public executeProcWithSchema(
        procedure: string,
        parameters: string[],
        schema,
        callback: CallBackInterface
    ) {
        try {
            const params = parameters.map((param) => "?");
            const sql = `select count(*) from ${schema}.\"${procedure}\"(${params.join()})`;
            logger.debug(`Sql: ${sql}`);
            let temp = sql;
            temp = this.parseSql(temp);
            this.conn.query(temp, parameters, (err, result) => {
                if (err) {
                    return callback(err, null);
                }
                callback(null, result.rowCount);
            });
        } catch (err) {
            callback(err, null);
        }
    }

    public commit(callback?: CallBackInterface) {
        this.conn.query("COMMIT", (err: any) => {
            if (err) {
                logger.error(err);
                if (callback) callback(err, null);
                else {
                    throw err;
                }
            } else {
                if (callback)
                    callback(
                        null,
                        "Committed Successfully and END Transaction for postgres"
                    );
            }
        });
    }

    public setAutoCommitToFalse(callback?: CallBackInterface) {
        // BEGIN Transaction, aka. Set AUTO COMMIT to false
        this.conn.query("BEGIN", (err: any) => {
            if (err) {
                logger.error(err);
                if (callback) {
                    callback(err, null);
                } else {
                    throw err;
                }
            } else {
                if (callback) {
                    callback(null, "BEGIN Transaction for postgres");
                }
            }
        });
    }

    public close() {
        if (this.conn.end) {
            this.conn.end();
        } else {
            logger.debug(
                "PostgresConnection is using a pool. Connection is not closed"
            );
        }
    }

    public executeBulkUpdate(
        sql: string,
        parameters: ParameterInterface[][],
        callback: CallBackInterface
    ) {
        throw "executeBulkUpdate is not yet implemented";
    }

    public executeBulkInsert(
        sql: string,
        parameters: null[][],
        callback: CallBackInterface
    ) {
        throw "executeBulkInsert is not yet implemented";
    }
    /**
     * This methods sets the current application user to the DB session (i.e. XS.APPLICATIONUSER).
     * This method must be called in the respective endpoints before performing any queries involving the guarded patients.
     */
    public setCurrentUserToDbSession(
        user: string,
        callback: CallBackInterface
    ) {
        try {
            const sql = `set session.application_user = "${user}"`;
            this.conn.query(sql, [], callback);
        } catch (error) {
            callback(error, null);
        }
    }

    public rollback(callback: CallBackInterface) {
        throw "rollback is not yet implemented";
    }

    public setTemporalSystemTimeToDbSession(
        systemTime: string,
        cb: CallBackInterface
    ) {
        throw "Setting Temporal System Time to DB session is not yet implemented";
    }
}
