import express from "express";
import * as utils from "../utils/baseUtils";
import * as dbUtils from "../utils/DBUtils";
import { Liquibase } from "../utils/liquibase";
import * as config from "../utils/config";
import { DBConnectionUtil as dbConnectionUtil } from "../utils/DBConnectionUtil";
import { ConnectionInterface } from "../utils/Connection";
import {
  IDBHanaCredentialsType,
  IDBPgCredentialsType,
  SnapshotCopyConfig,
  SnapshotQueryObject,
  SnapshotFilterColumns,
  IQuestionnaire,
  IItem,
  SchemaVersionInfo,
  DataModelSchemaMappingType,
} from "../utils/types";
import { v4 as uuidv4 } from "uuid";
import * as parquet from "parquetjs";
import { Readable } from "stream";
import * as Minio from "minio";

class DBDAO {
  private dialect: string;
  private logger = config.getLogger();
  private properties = config.getProperties();
  private skipAuth: boolean = this.properties.skip_auth;

  constructor(dialect: string) {
    this.dialect = dialect;
  }

  getVersionInfoForSchemas = async (
    db: any,
    tenant,
    changelogFilepath: string | undefined,
    classpath: string | undefined,
    datamodelSchemaMappingList: DataModelSchemaMappingType[]
  ) => {
    try {
      const successfulSchemasInfo: any[] = [];
      const failedSchemas: any[] = [];

      // attempt to retrieve schemaName, dataModel, & currentVersionID for each schema
      for (const datamodelSchemaMapping of datamodelSchemaMappingList) {
        try {
          const schemaObj: SchemaVersionInfo = await this.getDBChangeLogInfo(
            db,
            datamodelSchemaMapping
          );

          // schemaObj only contains key schemaName
          if (
            schemaObj.hasOwnProperty("schemaName") &&
            schemaObj.hasOwnProperty("dataModel") &&
            schemaObj.hasOwnProperty("vocabSchemaName") &&
            schemaObj.hasOwnProperty("changelogFilepath") &&
            schemaObj.hasOwnProperty("currentVersionID")
          ) {
            successfulSchemasInfo.push(schemaObj); // return schemaName if its relation error
          } else {
            failedSchemas.push(schemaObj);
          }
        } catch (err) {
          throw err;
        }
      }

      const successfulSchemasDeploymentInfo: any[] = [];

      // attempt to retrieve undeployed changesets for each schema that was successful in previous step
      for (const schemaObj of successfulSchemasInfo) {
        try {
          const latestAvailableVersionID: string =
            await this.getLatestAvailableVersion(tenant, schemaObj, classpath);
          schemaObj["latestVersionID"] =
            latestAvailableVersionID === "up to date"
              ? schemaObj.currentVersionID
              : latestAvailableVersionID;
          schemaObj["updatesAvailable"] =
            latestAvailableVersionID === "up to date" ? false : true;
          successfulSchemasDeploymentInfo.push(schemaObj);
        } catch (err) {
          failedSchemas.push(schemaObj);
        }
      }

      // for deugging and cleanup
      // return true long as there was 1 schema that failed
      let resErrorOccured = failedSchemas.length > 0 ? true : false;

      const httpResponse = {
        message: "Retrieved version information for schemas",
        function: "Get Version Info",
        successfulSchemas: successfulSchemasDeploymentInfo,
        failedSchemas: failedSchemas,
        errorOccured: resErrorOccured,
      };
      return httpResponse;
    } catch (errorMsg) {
      this.logger.error(
        `An error occured while retrieving version information for schemas: ${errorMsg}`
      );
      const errorHttpResponse = {
        message:
          "An error occured while retrieving version information for schemas",
        error: errorMsg,
      };
      throw errorHttpResponse;
    }
  };

  getLatestAvailableVersion = (
    tenant,
    schemaObj: SchemaVersionInfo,
    classpath: string | undefined
  ) => {
    return new Promise<string>((resolve, reject) => {
      try {
        let liquibaseAction: string = "status"; // status command checks for undeployed changesets
        let liquibaseActionParams: Array<string> = [
          `-DVOCAB_SCHEMA=${schemaObj.vocabSchemaName}`,
          `--verbose`,
        ]; // use ["--verbose"] to see which changesets haven't been deployed
        let liquibase;

        liquibase = new Liquibase(
          config.getMigrationToolConfig(
            this.dialect,
            tenant,
            schemaObj.schemaName,
            schemaObj.dataModel!,
            schemaObj.changelogFilepath!,
            classpath
          )
        );

        this.logger.info(
          `Running liquibase for schema ${schemaObj.schemaName}`
        );

        liquibase
          .run(liquibaseAction, liquibaseActionParams)
          .then((stdoutMsg) => {
            const latestVersionID = config.parseLatestVersion(stdoutMsg);
            resolve(latestVersionID);
          })
          .catch((error) => {
            this.logger.error(
              `Error while retrieving liquibase undeployed changesets for schema ${schemaObj.schemaName}: ${error}`
            );
            reject(error);
          });
      } catch (err) {
        this.logger.error(
          `Error while retrieving liquibase undeployed changesets for schema ${schemaObj.schemaName}: ${err}`
        );
        reject(err);
      }
    });
  };

  // this will map the datamodel, lastupdated, version to a schema
  getDBChangeLogInfo = async (
    db: any,
    datamodelSchemaMapping: DataModelSchemaMappingType
  ) => {
    this.logger.info(
      `Running db query for schema ${datamodelSchemaMapping.schemaName}..`
    );
    return new Promise<SchemaVersionInfo>((resolve, reject) => {
      try {
        db.executeQuery(
          `SELECT filename, dateexecuted from ${datamodelSchemaMapping.schemaName}.databasechangelog ORDER BY dateexecuted DESC`,
          [],
          (err: any, result: any) => {
            if (err) {
              // we want to return schema name if it is relation error
              if (
                err.code === "42P01" || // schema/table doesn't exist in postgres
                err.code === 362 || // schema doesn't exist in hana
                err.code === 259 // table does't exist in hana
              ) {
                this.logger.warn(
                  `Error retrieving list of changelog filepaths from ${datamodelSchemaMapping.schemaName} schema: ${err}. Continuing onto to next schema.`
                );
                resolve(datamodelSchemaMapping);
              } else {
                this.logger.error(err);
                reject(err); // send error response if syntax error
              }
            } else {
              this.logger.info(
                `Successfully retrieved list of changelog filepaths from ${datamodelSchemaMapping.schemaName} schema`
              );

              let currentVersionID: string;
              if (result.length === 0) {
                // If there are no records in databasechangelog table, set current version as Not Available
                currentVersionID = "Not Available";
              } else {
                const latestChangelogFilepath =
                  this.dialect === config.DB.HANA
                    ? result[0].FILENAME
                    : result[0].filename;

                currentVersionID = config.getVersionID(latestChangelogFilepath);
              }

              resolve({
                schemaName: datamodelSchemaMapping.schemaName,
                vocabSchemaName: datamodelSchemaMapping.vocabSchemaName,
                dataModel: datamodelSchemaMapping.dataModel,
                changelogFilepath: datamodelSchemaMapping.changelogFilepath,
                currentVersionID: currentVersionID,
                //lastUpdated: lastUpdated,
              });
            }
          }
        );
      } catch (err) {
        this.logger.error(
          `Error while retrieving information from databasechangelog table for schema ${datamodelSchemaMapping.schemaName}: ${err}`
        );
        reject(err);
      }
    });
  };

  // Gets column names for input SCHEMA.TABLENAME, optional input(columnExclusions) to exclude certain columns
  private getTableColumnNames = (
    db: any,
    schema: string,
    table: string,
    columnExclusions: string[] = []
  ) => {
    return new Promise<string[]>((resolve, reject) => {
      db.executeQuery(
        `SELECT COLUMN_NAME FROM SYS.TABLE_COLUMNS WHERE SCHEMA_NAME = ? AND TABLE_NAME = ? ORDER BY POSITION;`,
        [{ value: schema }, { value: table }],
        (err: any, result: any) => {
          if (err) {
            reject(err);
          } else {
            this.logger.info(
              `Retrieved table column names from: ${schema}.${table}`
            );
            const columns: string[] = [];
            result.forEach((elem: { COLUMN_NAME: string }) => {
              // Add column name to columns object only if it is not in columnExclusions
              if (!columnExclusions.includes(elem["COLUMN_NAME"])) {
                columns.push(elem["COLUMN_NAME"]);
              }
            });
            resolve(columns);
          }
        }
      );
    });
  };

  // Gets all the tables except DATABASECHANGELOG and DATABASECHANGELOGLOCK for schema
  private getSnapshotSchemaTables = (db: any, schema: string) => {
    return new Promise<string[]>((resolve, reject) => {
      db.executeQuery(
        `SELECT TABLE_NAME FROM SYS.M_TABLES WHERE SCHEMA_NAME=? AND (TABLE_NAME NOT IN ('DATABASECHANGELOG', 'DATABASECHANGELOGLOCK'));`,
        [{ value: schema }],
        (err: any, result: any) => {
          if (err) {
            reject(err);
          } else {
            this.logger.info(
              `Retrieved schema snapshot tables for Schema: ${schema}`
            );
            const tables: string[] = [];
            result.forEach((elem: { TABLE_NAME: string }) => {
              tables.push(elem["TABLE_NAME"]);
            });
            resolve(tables);
          }
        }
      );
    });
  };

  rollbackCount = (
    tenant: string,
    dataModel: string,
    schemas: string[],
    rollbackCount: number,
    changelogFilepath: string | undefined,
    classpath: string | undefined,
    callback: (err: any, result: any) => any
  ) => {
    const tasks = (<string[]>schemas).map((schema) => {
      return (callback: any) => {
        const originalStderrWrite = process.stderr.write.bind(process.stderr);

        if (process.env.NODE_ENV === "production") {
          process.stderr.write = (data: string | Buffer, cb?: any): boolean => {
            let msg = data.toString().replace(/password=\S+/i, "***");
            return originalStderrWrite(msg, cb);
          };
        }

        const vocabSchema = this.properties["omop_vocab_schema"];
        const liquibase = new Liquibase(
          config.getMigrationToolConfig(
            this.dialect,
            tenant,
            schema,
            dataModel,
            changelogFilepath,
            classpath
          )
        );
        liquibase
          .run("rollbackCount", [
            rollbackCount,
            `-DVOCAB_SCHEMA=${vocabSchema}`,
          ])
          .then(() => {
            if (process.env.NODE_ENV === "production") {
              process.stderr.write = originalStderrWrite;
            }
            utils
              .createMultiLogs(
                `${schema} Schema Successfully Rollbacked with count ${rollbackCount}`,
                {
                  tenant,
                  schema,
                  op: `rollback count ${rollbackCount} liquibase`,
                }
              )
              .print();
            callback(null, schema);
          })
          .catch((err: any) => {
            if (process.env.NODE_ENV === "production") {
              process.stderr.write = originalStderrWrite;
            }
            utils
              .createMultiLogs(
                `${schema} Schema Rollback Failed`,
                {
                  tenant,
                  schema,
                  op: `rollback count ${rollbackCount} liquibase`,
                },
                true
              )
              .print();
            err.message = schema;
            callback(err);
          });
      };
    });
    utils.runAsyncParallel(tasks, callback);
  };

  rollbackTag = (
    tenant: string,
    dataModel: string,
    schemas: string[],
    rollbackTag: string,
    changelogFilepath: string | undefined,
    classpath: string | undefined,
    callback: (err: any, result: any) => any
  ) => {
    const tasks = (<string[]>schemas).map((schema) => {
      return (callback: any) => {
        const originalStderrWrite = process.stderr.write.bind(process.stderr);
        if (process.env.NODE_ENV === "production") {
          process.stderr.write = (data: string | Buffer, cb?: any): boolean => {
            let msg = data.toString().replace(/password=\S+/i, "***");
            return originalStderrWrite(msg, cb);
          };
        }
        const vocabSchema = this.properties["omop_vocab_schema"];
        const liquibase = new Liquibase(
          config.getMigrationToolConfig(
            this.dialect,
            tenant,
            schema,
            dataModel,
            changelogFilepath,
            classpath
          )
        );

        liquibase
          .run("rollback", [rollbackTag, `-DVOCAB_SCHEMA=${vocabSchema}`])
          .then(() => {
            if (process.env.NODE_ENV === "production") {
              process.stderr.write = originalStderrWrite;
            }
            utils
              .createMultiLogs(
                `${schema} Schema Successfully Rollbacked Until tag ${rollbackTag}`,
                {
                  tenant,
                  schema,
                  op: `rollback tag ${rollbackTag} liquibase`,
                }
              )
              .print();
            callback(null, schema);
          })
          .catch((err: any) => {
            if (process.env.NODE_ENV === "production") {
              process.stderr.write = originalStderrWrite;
            }
            utils
              .createMultiLogs(
                `${schema} Schema Rollback failed Until tag ${rollbackTag}`,
                {
                  tenant,
                  schema,
                  op: `rollback tag ${rollbackTag} liquibase`,
                },
                true
              )
              .print();
            err.message = schema;
            callback(err);
          });
      };
    });
    utils.runAsyncParallel(tasks, callback);
  };

  createSchema = (
    tenant: string,
    schema: string,
    dbConnection: ConnectionInterface,
    callback: Function
  ) => {
    // this.logger.log("info", `Starting schema[tenant: ${tenant}; schema: ${schema}] creation...`);
    dbConnection.execute(
      `CREATE SCHEMA ${schema}`,
      [],
      (err: any, result: any) => {
        if (err) return callback(err);
        const response = utils.createMultiLogs(
          `Empty Schema ${schema} created successfully`,
          {
            tenant,
            schema,
          }
        );
        callback(null, response);
      }
    );
  };

  dropSchema = (db: ConnectionInterface, schema: string) => {
    this.logger.info(`Dropping schema: ${schema}`);

    return new Promise((resolve, reject) => {
      db.execute(
        `DROP SCHEMA ${schema} CASCADE`,
        [],
        (err: any, result: any) => {
          if (err) {
            return reject(err);
          }
          const message = `Schema ${schema} successfully dropped`;
          this.logger.info(message);
          resolve(message);
        }
      );
    });
  };

  rollbackSchema = (
    err: Error,
    schema: string,
    dbConnection: ConnectionInterface,
    callback: Function
  ) => {
    dbConnection.execute(
      `DROP SCHEMA ${schema} CASCADE`,
      [],
      (rollbackSchemaErr: any) => {
        if (rollbackSchemaErr) {
          return callback(rollbackSchemaErr);
        }
        this.logger.log(
          "error",
          `[Rollback] Empty Schema ${schema} successfully created earlier on has been deleted due to liquidbase script failure`
        );
        callback(err);
      }
    );
  };

  enableAuditing = (
    tenant: string,
    schema: string,
    tenantConfig: any,
    dbConnection: ConnectionInterface,
    callback: Function
  ) => {
    if (tenantConfig["enableAuditPolicies"]) {
      dbConnection.execute(
        `ALTER SYSTEM ALTER CONFIGURATION ('global.ini','SYSTEM') set ('auditing configuration','global_auditing_state' ) = 'true' with reconfigure`,
        [],
        (err: any) => {
          if (err) return callback(err);
          const response = utils.createMultiLogs(
            `Altered system configuration successfully`,
            {
              tenant,
              schema,
              op: "Enabled global_auditing_state",
            }
          );
          callback(null, response);
        }
      );
    } else {
      const response = utils.createMultiLogs(
        `Skipping Alteration of system configuration`,
        {
          tenant,
          schema,
          op: "Skipped enabling global_auditing_state",
        }
      );
      callback(null, response);
    }
  };

  createSystemAuditPolicy = (
    tenant: string,
    schema: string,
    tenantConfig: any,
    dbConnection: ConnectionInterface,
    callback: Function
  ) => {
    if (tenantConfig["enableAuditPolicies"]) {
      dbConnection.execute(
        `SELECT * from SYS.AUDIT_POLICIES WHERE AUDIT_POLICY_NAME = 'alp_conf_changes'`,
        [],
        (err: any, result: any) => {
          if (err) return callback(err);
          if (!result) {
            dbConnection.execute(
              `CREATE AUDIT POLICY "alp_conf_changes" AUDITING SUCCESSFUL SYSTEM CONFIGURATION CHANGE LEVEL INFO`,
              [],
              (err: any, result: any) => {
                if (err) return callback(err);
                dbConnection.execute(
                  `ALTER AUDIT POLICY "alp_conf_changes" ENABLE`,
                  [],
                  (err: any, result: any) => {
                    if (err) return callback(err);
                    const response = utils.createMultiLogs(
                      `New audit policy for system configuration created & enabled successfully`,
                      {
                        tenant,
                        schema,
                        op: "Enabled Audit for system configuration level info",
                      }
                    );
                    callback(null, response);
                  }
                );
              }
            );
          } else {
            const response = utils.createMultiLogs(
              `Audit policy for system configuration Exists Already`,
              {
                tenant,
                schema,
                op: "Verified alp_conf_changes exists already",
              }
            );
            callback(null, response);
          }
        }
      );
    } else {
      const response = utils.createMultiLogs(
        `Skipping creation of Audit policy for system configuration`,
        {
          tenant,
          schema,
          op: "Skipping creation of alp_conf_changes",
        }
      );
      callback(null, response);
    }
  };

  createSchemaAuditPolicy = (
    tenant: string,
    schema: string,
    tenantConfig: any,
    dbConnection: ConnectionInterface,
    callback: Function
  ) => {
    if (tenantConfig["enableAuditPolicies"]) {
      dbConnection.execute(
        `CREATE 
          AUDIT POLICY ALP_AUDIT_POLICY_${schema} AUDITING ALL 
          INSERT, SELECT, UPDATE, DELETE ON 
          ${schema}.* 
          LEVEL INFO`,
        [],
        (err: any) => {
          if (err) {
            return callback(err);
          }
          dbConnection.execute(
            `ALTER AUDIT POLICY ALP_AUDIT_POLICY_${schema} ENABLE`,
            [],
            (err: any) => {
              if (err) {
                return callback(err);
              }

              const response = utils.createMultiLogs(
                `New audit policy for ${schema} created & enabled successfully`,
                {
                  tenant,
                  schema,
                  op: `Audit policy ALP_AUDIT_POLICY_${schema} Created and Enabled`,
                  audit_actions: "INSERT, SELECT, UPDATE, DELETE",
                  user: "Except System",
                  audit_events: "ALL",
                  audit_level: "INFO",
                }
              );
              callback(null, response);
            }
          );
        }
      );
    } else {
      const response = utils.createMultiLogs(
        `Skipping creation of new audit policy for ${schema}`,
        {
          tenant,
          schema,
          op: `Audit policy ALP_AUDIT_POLICY_${schema} creation skipped`,
        }
      );
      callback(null, response);
    }
  };

  checkIfSchemaExist = (
    schema: string,
    db: ConnectionInterface,
    callback: Function
  ) => {
    db.executeQuery(
      `SELECT schema_name FROM schemas WHERE schema_name=?`,
      [{ value: schema }],
      (err: any, result: any) => {
        if (err) {
          callback(err);
        } else {
          this.logger.debug(
            `Check if schema exists ${schema} Result: ${JSON.stringify(result)}`
          );
          // Look for either SCHEMA_NAME or schema_name in object this is due to, hana returning headers in uppercase and postgres in lowercase
          let schemaExist =
            result[0]?.schema_name === schema ||
            result[0]?.SCHEMA_NAME === schema;
          callback(null, schemaExist);
        }
      }
    );
  };

  getDBConnectionByTenantPromise = (
    tenant: string,
    req?: any,
    res?: express.Response
  ): Promise<ConnectionInterface> => {
    return new Promise<ConnectionInterface>(async (resolve, reject) => {
      try {
        const dbClient = await this.getDBClientByTenant(tenant);
        const dbConnection: ConnectionInterface = <ConnectionInterface>(
          await dbConnectionUtil.getConnection(this.dialect, dbClient)
        );
        if (res != null) {
          this.addCloseDBConnectionCallback(res, dbConnection);
        }
        // might not be needed for postgres db connections
        if (this.skipAuth) {
          resolve(dbConnection);
        } else {
          const sub = req.user.userId ? req.user.userId : req.user.idpUserId;
          dbConnection.setCurrentUserToDbSession(sub, () => {
            resolve(dbConnection);
          });
        }
      } catch (err) {
        reject(err);
      }
    });
  };

  getDBConnectionByTenant = (
    tenant: string,
    req: any,
    res: express.Response,
    callback: Function
  ): void => {
    (async () => {
      try {
        const dbClient = await this.getDBClientByTenant(tenant);
        const dbConnection: ConnectionInterface = <ConnectionInterface>(
          await dbConnectionUtil.getConnection(this.dialect, dbClient)
        );
        this.addCloseDBConnectionCallback(res, dbConnection);
        return dbConnection;
      } catch (err) {
        callback(err);
      }
    })()
      .then((db) => {
        // might not be needed for postgres db connections
        if (this.skipAuth) {
          callback(null, db);
        } else {
          const sub = req.user.userId ? req.user.userId : req.user.idpUserId;
          db?.setCurrentUserToDbSession(sub, () => {
            callback(null, db);
          });
        }
      })
      .catch((err) => {
        callback(err);
      });
  };

  private getDBClientByTenant = (tenant: string, schema?: string) => {
    return new Promise(async (resolve, reject) => {
      let credentials: IDBHanaCredentialsType | IDBPgCredentialsType;
      // Get connection by tenant and dialect
      credentials = config.getDBConfigByTenant(this.dialect, tenant);
      try {
        const client = await dbConnectionUtil.getDbClient(credentials);
        resolve(client);
      } catch (err) {
        this.logger.error(err);
        reject(err);
      }
    });
  };

  addCloseDBConnectionCallback = (
    res: express.Response,
    conn: ConnectionInterface
  ) => {
    let resEnd = res.end;

    res.end = function (): any {
      let resEndArgs: any = arguments;
      try {
        conn.close();
        config.getLogger().info("DB connection closed");
      } catch (err) {
        config.getLogger().error(`Error while closing DB connection!\n${err}`);
      }
      res.end = resEnd;
      res.end.apply(res, resEndArgs);
    };
  };

  // hana and postgres
  insertCDMVersion = (
    db: any,
    schema: string,
    cdmVersion: config.OMOP_VERSIONS
  ) => {
    this.logger.info("inserting cdm version");

    const abbreviation = schema.slice(0, 25); // Uses VARCHAR(25)
    return new Promise((resolve, reject) => {
      db.executeQuery(
        `INSERT INTO ${schema}.cdm_source (cdm_source_name, cdm_source_abbreviation, cdm_holder, source_release_date, cdm_release_date, cdm_version) VALUES(?, ? ,'D4L', NOW(), NOW(), ?)`,
        [{ value: schema }, { value: abbreviation }, { value: cdmVersion }],
        (err: any, result: any) => {
          if (err) {
            return reject(err);
          }
          this.logger.info(`Inserted cdm version for ${schema}`);
          resolve(result);
        }
      );
    });
  };

  updateCDMVersion = (
    db: any,
    schema: string,
    cdmVersion: config.OMOP_VERSIONS
  ) => {
    this.logger.info(`updating cdm version for ${schema}`);

    return new Promise((resolve, reject) => {
      db.executeQuery(
        `UPDATE ${schema}.cdm_source SET cdm_version = ? where cdm_source_name = ?`,
        [{ value: cdmVersion }, { value: schema }],
        (err: any, result: any) => {
          if (err) {
            this.logger.info(`Failed to update cdm version for ${schema}`);
            return reject(err);
          }
          this.logger.info(`Updated cdm version for ${schema}`);
          resolve(result);
        }
      );
    });
  };

  // For each key in snapshotCopyConfig, return an array of <SnapshotQueryObject> objects which represents the configured sql queries for the corresponding table based on SnapshotCopyConfig
  private async generateSchemaSnapshotSelectQueries(
    db: any,
    sourceSchema: string,
    snapshotCopyConfig: SnapshotCopyConfig
  ) {
    // Helper function to return WHERE clause if there is a timestamp provided or if there are specific patients to be copied, else returns empty string(meaning that select statement is not modified)
    // Takes in filter column name and generates filter statement for column, will not generate if column name i undefined
    const filterStatementGenerator = (filterColumns: SnapshotFilterColumns) => {
      // If snapshotCopyConfig is undefined, skip statement generation
      if (!snapshotCopyConfig) {
        return "";
      }

      let whereStatements: string[] = [];
      // If timestamp is provided by endpoint and table is to be filtered by timestamp(as timestampColumn is not null)
      // Generate TIMESTAMP WHERE statement
      if (snapshotCopyConfig.timestamp && filterColumns.timestampColumn) {
        whereStatements.push(
          `${filterColumns.timestampColumn} <= '${snapshotCopyConfig.timestamp}'`
        );
      }

      // If patientsToBeCopied is provided by endpoint and table is to be filtered by list of person_ids (as personIdColumn is not null)
      if (
        snapshotCopyConfig.patientsToBeCopied &&
        filterColumns.personIdColumn
      ) {
        // Wrap each element in patientsToBeCopied with single quites and join them with a comma
        const patientsToBeCopiedSqlString =
          snapshotCopyConfig.patientsToBeCopied
            ?.map((e) => "'" + e + "'")
            .join(", ");
        whereStatements.push(
          `${filterColumns.personIdColumn} IN (${patientsToBeCopiedSqlString})`
        );
      }

      // If no where statements were pushed into array, return empty string
      if (whereStatements.length === 0) {
        return "";
      } else {
        //  Return string with all elements joined by a AND operator, if there is only one element, it will just return without joining the "AND"
        return "WHERE " + whereStatements.join(" AND ");
      }
    };
    let baseQueries: SnapshotQueryObject[] = [
      {
        name: "GDM.QUESTIONNAIRE_RESPONSE",
        query: `SELECT * FROM "${sourceSchema}"."GDM.QUESTIONNAIRE_RESPONSE" ${filterStatementGenerator(
          { timestampColumn: "AUTHORED", personIdColumn: "PERSON_ID" }
        )}`,
      },
      {
        name: "GDM.RESEARCH_SUBJECT",
        query: `SELECT * FROM "${sourceSchema}"."GDM.RESEARCH_SUBJECT" ${filterStatementGenerator(
          { timestampColumn: undefined, personIdColumn: "PERSON_ID" }
        )}`,
      },
      {
        name: "GDM.ITEM",
        query: `SELECT * FROM "${sourceSchema}"."GDM.ITEM" i WHERE i.GDM_QUESTIONNAIRE_RESPONSE_ID in (SELECT ID FROM "${sourceSchema}"."GDM.QUESTIONNAIRE_RESPONSE" ${filterStatementGenerator(
          { timestampColumn: "AUTHORED", personIdColumn: "PERSON_ID" }
        )})`,
      },
      {
        name: "GDM.ANSWER",
        query: `SELECT * FROM "${sourceSchema}"."GDM.ANSWER" a WHERE a.GDM_ITEM_ID IN (
        SELECT ID FROM "${sourceSchema}"."GDM.ITEM" i WHERE i.GDM_QUESTIONNAIRE_RESPONSE_ID in (
        SELECT ID FROM "${sourceSchema}"."GDM.QUESTIONNAIRE_RESPONSE" ${filterStatementGenerator(
          { timestampColumn: "AUTHORED", personIdColumn: "PERSON_ID" }
        )}))`,
      },
      {
        name: "CONCEPT",
        query: `SELECT * FROM "${sourceSchema}"."CONCEPT" ${filterStatementGenerator(
          { timestampColumn: "VALID_START_DATE", personIdColumn: undefined }
        )}`,
      },
      { name: "DOMAIN", query: `SELECT * FROM "${sourceSchema}"."DOMAIN"` },
      {
        name: "CONCEPT_CLASS",
        query: `SELECT * FROM "${sourceSchema}"."CONCEPT_CLASS"`,
      },
      {
        name: "CONCEPT_RELATIONSHIP",
        query: `SELECT * FROM "${sourceSchema}"."CONCEPT_RELATIONSHIP" ${filterStatementGenerator(
          { timestampColumn: "VALID_START_DATE", personIdColumn: undefined }
        )}`,
      },
      {
        name: "RELATIONSHIP",
        query: `SELECT * FROM "${sourceSchema}"."RELATIONSHIP"`,
      },
      {
        name: "CONCEPT_SYNONYM",
        query: `SELECT * FROM "${sourceSchema}"."CONCEPT_SYNONYM"`,
      },
      {
        name: "CONCEPT_ANCESTOR",
        query: `SELECT * FROM "${sourceSchema}"."CONCEPT_ANCESTOR"`,
      },
      {
        name: "SOURCE_TO_CONCEPT_MAP",
        query: `SELECT * FROM "${sourceSchema}"."SOURCE_TO_CONCEPT_MAP" ${filterStatementGenerator(
          { timestampColumn: "VALID_START_DATE", personIdColumn: undefined }
        )}`,
      },
      {
        name: "DRUG_STRENGTH",
        query: `SELECT * FROM "${sourceSchema}"."DRUG_STRENGTH" ${filterStatementGenerator(
          { timestampColumn: "VALID_START_DATE", personIdColumn: undefined }
        )}`,
      },
      {
        name: "COHORT_DEFINITION",
        query: `SELECT * FROM "${sourceSchema}"."COHORT_DEFINITION" ${filterStatementGenerator(
          {
            timestampColumn: "COHORT_INITIATION_DATE",
            personIdColumn: undefined,
          }
        )}`,
      },
      {
        name: "COHORT_ATTRIBUTE",
        query: `SELECT * FROM "${sourceSchema}"."COHORT_ATTRIBUTE" ${filterStatementGenerator(
          { timestampColumn: "COHORT_START_DATE", personIdColumn: undefined }
        )}`,
      },
      {
        name: "ATTRIBUTE_DEFINITION",
        query: `SELECT * FROM "${sourceSchema}"."ATTRIBUTE_DEFINITION"`,
      },
      {
        name: "PERSON",
        query: `SELECT * FROM "${sourceSchema}"."PERSON" ${filterStatementGenerator(
          { timestampColumn: undefined, personIdColumn: "PERSON_ID" }
        )}`,
      },
      {
        name: "OBSERVATION_PERIOD",
        query: `SELECT * FROM "${sourceSchema}"."OBSERVATION_PERIOD" ${filterStatementGenerator(
          {
            timestampColumn: "OBSERVATION_PERIOD_START_DATE",
            personIdColumn: "PERSON_ID",
          }
        )}`,
      },
      {
        name: "SPECIMEN",
        query: `SELECT * FROM "${sourceSchema}"."SPECIMEN" ${filterStatementGenerator(
          { timestampColumn: "SPECIMEN_DATE", personIdColumn: "PERSON_ID" }
        )}`,
      },
      {
        name: "DEATH",
        query: `SELECT * FROM "${sourceSchema}"."DEATH" ${filterStatementGenerator(
          { timestampColumn: "DEATH_DATE", personIdColumn: "PERSON_ID" }
        )}`,
      },
      {
        name: "VISIT_OCCURRENCE",
        query: `SELECT * FROM "${sourceSchema}"."VISIT_OCCURRENCE" ${filterStatementGenerator(
          { timestampColumn: "VISIT_START_DATE", personIdColumn: "PERSON_ID" }
        )}`,
      },
      {
        name: "PROCEDURE_OCCURRENCE",
        query: `SELECT * FROM "${sourceSchema}"."PROCEDURE_OCCURRENCE" ${filterStatementGenerator(
          { timestampColumn: "PROCEDURE_DATETIME", personIdColumn: "PERSON_ID" }
        )}`,
      },
      {
        name: "DRUG_EXPOSURE",
        query: `SELECT * FROM "${sourceSchema}"."DRUG_EXPOSURE" ${filterStatementGenerator(
          {
            timestampColumn: "DRUG_EXPOSURE_START_DATETIME",
            personIdColumn: "PERSON_ID",
          }
        )}`,
      },
      {
        name: "DEVICE_EXPOSURE",
        query: `SELECT * FROM "${sourceSchema}"."DEVICE_EXPOSURE" ${filterStatementGenerator(
          {
            timestampColumn: "DEVICE_EXPOSURE_START_DATETIME",
            personIdColumn: "PERSON_ID",
          }
        )}`,
      },
      {
        name: "CONDITION_OCCURRENCE",
        query: `SELECT * FROM "${sourceSchema}"."CONDITION_OCCURRENCE" ${filterStatementGenerator(
          {
            timestampColumn: "CONDITION_START_DATETIME",
            personIdColumn: "PERSON_ID",
          }
        )}`,
      },
      {
        name: "MEASUREMENT",
        query: `SELECT * FROM "${sourceSchema}"."MEASUREMENT" ${filterStatementGenerator(
          { timestampColumn: "MEASUREMENT_DATE", personIdColumn: "PERSON_ID" }
        )}`,
      },
      {
        name: "NOTE",
        query: `SELECT * FROM "${sourceSchema}"."NOTE" ${filterStatementGenerator(
          { timestampColumn: "NOTE_DATE", personIdColumn: "PERSON_ID" }
        )}`,
      },
      {
        name: "NOTE_NLP",
        query: `SELECT * FROM "${sourceSchema}"."NOTE_NLP" ${filterStatementGenerator(
          { timestampColumn: "NLP_DATE", personIdColumn: undefined }
        )}`,
      },
      {
        name: "OBSERVATION",
        query: `SELECT * FROM "${sourceSchema}"."OBSERVATION" ${filterStatementGenerator(
          { timestampColumn: "OBSERVATION_DATE", personIdColumn: "PERSON_ID" }
        )}`,
      },
      {
        name: "FACT_RELATIONSHIP",
        query: `SELECT * FROM "${sourceSchema}"."FACT_RELATIONSHIP"`,
      },
      {
        name: "CARE_SITE",
        query: `SELECT * FROM "${sourceSchema}"."CARE_SITE"`,
      },
      {
        name: "PROVIDER",
        query: `SELECT * FROM "${sourceSchema}"."PROVIDER"`,
      },
      {
        name: "PAYER_PLAN_PERIOD",
        query: `SELECT * FROM "${sourceSchema}"."PAYER_PLAN_PERIOD" ${filterStatementGenerator(
          {
            timestampColumn: "PAYER_PLAN_PERIOD_START_DATE",
            personIdColumn: "PERSON_ID",
          }
        )}`,
      },
      {
        name: "COST",
        query: `SELECT * FROM "${sourceSchema}"."COST" ${filterStatementGenerator(
          { timestampColumn: undefined, personIdColumn: "PAID_BY_PATIENT" }
        )}`,
      },
      {
        name: "COHORT",
        query: `SELECT * FROM "${sourceSchema}"."COHORT" ${filterStatementGenerator(
          { timestampColumn: "COHORT_START_DATE", personIdColumn: undefined }
        )}`,
      },
      {
        name: "COHORT_ATTRIBUTE",
        query: `SELECT * FROM "${sourceSchema}"."COHORT_ATTRIBUTE" ${filterStatementGenerator(
          { timestampColumn: "COHORT_START_DATE", personIdColumn: undefined }
        )}`,
      },
      {
        name: "DRUG_ERA",
        query: `SELECT * FROM "${sourceSchema}"."DRUG_ERA" ${filterStatementGenerator(
          {
            timestampColumn: "DRUG_ERA_START_DATE",
            personIdColumn: "PERSON_ID",
          }
        )}`,
      },
      {
        name: "DOSE_ERA",
        query: `SELECT * FROM "${sourceSchema}"."DOSE_ERA" ${filterStatementGenerator(
          {
            timestampColumn: "DOSE_ERA_START_DATE",
            personIdColumn: "PERSON_ID",
          }
        )}`,
      },
      {
        name: "CONDITION_ERA",
        query: `SELECT * FROM "${sourceSchema}"."CONDITION_ERA" ${filterStatementGenerator(
          {
            timestampColumn: "CONDITION_ERA_START_DATE",
            personIdColumn: "PERSON_ID",
          }
        )}`,
      },
      {
        name: "CONCEPT_RECOMMENDED",
        query: `SELECT * FROM "${sourceSchema}"."CONCEPT_RECOMMENDED"`,
      },
    ];

    const sourceSchemaTables = await this.getSnapshotSchemaTables(
      db,
      sourceSchema
    );
    // Filter baseQueries to remove elements which are not corresponding to any tables in sourceSchema
    const filteredBaseQueries = baseQueries.filter((baseQuery) => {
      return sourceSchemaTables.includes(baseQuery.name);
    });

    let snapshotSqlQueries: SnapshotQueryObject[] = [];

    if (snapshotCopyConfig) {
      // Modify queries based on snapshotcopyconfig.tableconfig, such that the query only select the tables and columns that user has selected
      if (snapshotCopyConfig.tableConfig) {
        for (const snapshotCopyTableConfig of snapshotCopyConfig.tableConfig) {
          // Get index of array for matching table based on current snapshotcopyTableconfig iteration
          let configuredQueriesIndex = baseQueries.findIndex(
            (queryObj) => queryObj.name == snapshotCopyTableConfig.tableName
          );

          // If tableName is not found in baseQueries, it means that the table has not been configured yet for copying
          if (configuredQueriesIndex === -1) {
            this.logger.warn(
              `Table:${snapshotCopyTableConfig.tableName} found in snapshotCopyConfig but not in baseQueries. SELECT query is not generated and this table will not be copied to snapshot`
            );
            continue;
          }

          // If columnsToBeCopied is empty, skip
          if (snapshotCopyTableConfig.columnsToBeCopied.length === 0) {
            this.logger.warn(
              `Table:${snapshotCopyTableConfig.tableName} key "columnsToBeCopied" list is empty. SELECT query is not generated and this table will not be copied to snapshot`
            );
            continue;
          }

          // Replace SELECT * FROM with specific columns based on snapshotconfig
          let snapshotSelectColumnsSQL = `SELECT ${snapshotCopyTableConfig.columnsToBeCopied.join(
            ", "
          )} FROM`;
          let configuredQuery = baseQueries[
            configuredQueriesIndex
          ].query.replace("SELECT * FROM", snapshotSelectColumnsSQL);

          // Append tablename and configured query to snapshotSqlQueries
          snapshotSqlQueries.push({
            name: snapshotCopyTableConfig.tableName,
            query: configuredQuery,
          });
        }
        return snapshotSqlQueries;
      }
    }

    // If snapshotCopyConfig is undefined or no snapshotCopyConfig.tableConfig is given, by default copy all tables and columns
    // Specifically for HANA, replace SELECT * FROM with specific column names, this is needed due to addition of ["SYSTEM_VALID_FROM", "SYSTEM_VALID_UNTIL"] column names
    if (this.dialect === config.DB.HANA) {
      for (const baseQuery of filteredBaseQueries as SnapshotQueryObject[]) {
        const tableName = baseQuery.name;
        // Get list of columns in each individual ${SCHEMA}.${TABLE}
        const columnNamesWithoutSystemDateTime = await this.getTableColumnNames(
          db,
          sourceSchema,
          tableName,
          ["SYSTEM_VALID_FROM", "SYSTEM_VALID_UNTIL"]
        );

        // Replace SELECT * FROM with SELECT [col1, col2, col3...] FROM
        let snapshotSelectColumnsSQL = `SELECT ${columnNamesWithoutSystemDateTime.join(
          ", "
        )} FROM`;
        let configuredQuery = baseQuery.query.replace(
          "SELECT * FROM",
          snapshotSelectColumnsSQL
        );
        snapshotSqlQueries.push({
          name: tableName,
          query: configuredQuery,
        });
      }
      return snapshotSqlQueries;
    } else {
      return filteredBaseQueries;
    }
  }

  private appendSchemaSnapshotInsertQueries(
    destSchema: string,
    queries: SnapshotQueryObject[],
    snapshotCopyConfig: SnapshotCopyConfig
  ) {
    // if snapshotCopyConfig is not provided, append default insert statement to all queries
    if (!snapshotCopyConfig) {
      for (const snapshotQueryObj of queries) {
        let snapshotinsertColumnsSQL = `INSERT INTO "${destSchema}"."${snapshotQueryObj.name}" (`;
        snapshotQueryObj.query =
          snapshotinsertColumnsSQL + snapshotQueryObj.query + ")";
      }
    } else {
      // Modify queries based on snapshotcopyconfig
      if (snapshotCopyConfig.tableConfig) {
        for (const snapshotCopyTableConfig of snapshotCopyConfig.tableConfig) {
          // Get index of array for matching table based on current snapshotcopyTableconfig iteration
          let queriesObjIndex = queries.findIndex(
            (queryObj) => queryObj.name == snapshotCopyTableConfig.tableName
          );

          // Skip if columnsToBeCopied is empty or if tablename is not found in queries
          if (
            snapshotCopyTableConfig.columnsToBeCopied.length === 0 ||
            queriesObjIndex === -1
          ) {
            continue;
          }

          // Append insert statement with specific columns based on snapshotconfig
          let snapshotinsertColumnsSQL = `INSERT INTO "${destSchema}"."${
            snapshotCopyTableConfig.tableName
          }" (${snapshotCopyTableConfig.columnsToBeCopied.join(", ")}) (`;
          queries[queriesObjIndex].query =
            snapshotinsertColumnsSQL + queries[queriesObjIndex].query + ")";
        }
      } else {
        // If snapshotCopyConfig.tableConfig is not provided, append default insert statement to all queries
        for (const snapshotQueryObj of queries) {
          let snapshotinsertColumnsSQL = `INSERT INTO "${destSchema}"."${snapshotQueryObj.name}" (`;
          snapshotQueryObj.query =
            snapshotinsertColumnsSQL + snapshotQueryObj.query + ")";
        }
      }
    }

    return queries;
  }

  saveSnapshotToDb(
    db: any,
    sourceSchema: string,
    destSchema: string,
    snapshotCopyConfig: SnapshotCopyConfig
  ) {
    return new Promise(async (resolve, reject) => {
      // Get select queries
      let snapshotSelectQueries =
        await this.generateSchemaSnapshotSelectQueries(
          db,
          sourceSchema,
          snapshotCopyConfig
        );

      // Append insert query statements to existing select queries
      let snapshotInsertQueries = this.appendSchemaSnapshotInsertQueries(
        destSchema,
        snapshotSelectQueries,
        snapshotCopyConfig
      );
      const successfultable: string[] = [];
      const failedtable: string[] = [];
      var count = 0;
      for (const snapshotQueryObj of snapshotInsertQueries) {
        db.executeQuery(
          snapshotQueryObj["query"],
          [],
          async (err: any, result: any) => {
            if (err) {
              failedtable.push(snapshotQueryObj["name"]);
              const errormessage = {
                name: snapshotQueryObj["name"],
                status: "Fail",
                error: `${err}`,
              };
              this.logger.error(JSON.stringify(errormessage));
              count++;
              if (count == snapshotInsertQueries.length) {
                const value = [successfultable, failedtable];
                resolve(value);
              }
            } else if (result.length === 0) {
              failedtable.push(snapshotQueryObj["name"]);
              const errormessage = {
                name: snapshotQueryObj["name"],
                status: "Fail",
                error: `No results in ${snapshotQueryObj["name"]}`,
              };
              this.logger.error(JSON.stringify(errormessage));
              count++;
              if (count == snapshotInsertQueries.length) {
                const value = [successfultable, failedtable];
                resolve(value);
              }
            } else {
              count++;
              if (count == snapshotInsertQueries.length) {
                const value = [successfultable, failedtable];
                resolve(value);
              }
            }
          }
        );
      }
    });
  }

  retrieveSchemaSnapshot = (
    db: any,
    sourceSchema: string,
    destSchema: string,
    snapshotCopyConfig: SnapshotCopyConfig
  ) => {
    return new Promise(async (resolve, reject) => {
      // Get select queries
      const snapshotSelectQueries =
        await this.generateSchemaSnapshotSelectQueries(
          db,
          sourceSchema,
          snapshotCopyConfig
        );
      const successfultable: string[] = [];
      const failedtable: string[] = [];
      var count = 0;
      for (const snapshotQueryObj of snapshotSelectQueries) {
        db.executeQuery(
          snapshotQueryObj["query"],
          [],
          async (err: any, result: any) => {
            if (err) {
              failedtable.push(snapshotQueryObj["name"]);
              const errormessage = {
                name: snapshotQueryObj["name"],
                status: "Fail",
                error: `${err}`,
              };
              this.logger.error(JSON.stringify(errormessage));
              count++;
              if (count == snapshotSelectQueries.length) {
                const value = [successfultable, failedtable];
                resolve(value);
              }
            } else if (result.length === 0) {
              failedtable.push(snapshotQueryObj["name"]);
              const errormessage = {
                name: snapshotQueryObj["name"],
                status: "Fail",
                error: `No results in ${snapshotQueryObj["name"]}`,
              };
              this.logger.error(JSON.stringify(errormessage));
              count++;
              if (count == snapshotSelectQueries.length) {
                const value = [successfultable, failedtable];
                resolve(value);
              }
            } else {
              this.logger.info(
                `Retrieved data from ${snapshotQueryObj["name"]}`
              );
              await this.createAndPopulateParquet(
                db,
                sourceSchema,
                destSchema,
                snapshotQueryObj["name"],
                result
              )
                .then((finalresult) => {
                  if (finalresult) {
                    const successmessage = {
                      name: snapshotQueryObj["name"],
                      status: "Success",
                      message: `Successfully uploaded ${snapshotQueryObj["name"]} parquet file`,
                    };
                    this.logger.info(JSON.stringify(successmessage));
                    successfultable.push(snapshotQueryObj["name"]);
                    count++;
                    if (count == snapshotSelectQueries.length) {
                      const value = [successfultable, failedtable];
                      resolve(value);
                    }
                  }
                })
                .catch((err) => {
                  failedtable.push(snapshotQueryObj["name"]);
                  const errormessage = {
                    name: snapshotQueryObj["name"],
                    status: "Fail",
                    error: `${err}`,
                  };
                  this.logger.error(JSON.stringify(errormessage));
                  count++;
                  if (count == snapshotSelectQueries.length) {
                    const value = [successfultable, failedtable];
                    resolve(value);
                  }
                });
            }
          }
        );
      }
    });
  };

  createAndPopulateParquet = (
    db: any,
    sourceSchema: string,
    destSchema: string,
    table: string,
    res: any
  ) => {
    return new Promise((resolve, reject) => {
      const maplist: any = {
        STRING: "UTF8",
        VARCHAR: "UTF8",
        INT: "INT64",
        VAL32: "INT64",
        VAL64: "INT64",
        BIGINT: "INT64",
        SECONDDATE: "UTF8",
        VARBINARY: "UTF8",
        BLOB: "UTF8",
        NVARCHAR: "UTF8",
        INTEGER: "INT32",
        TIMESTAMP: "UTF8",
        LONGDATE: "UTF8",
        DATE: "DATE",
        DECIMAL: "UTF8",
        TEXT: "UTF8",
      };
      db.executeQuery(
        `SELECT COLUMN_NAME, DATA_TYPE_NAME FROM SYS.TABLE_COLUMNS WHERE SCHEMA_NAME = ? AND TABLE_NAME = ?`,
        [{ value: sourceSchema }, { value: table }],
        async (err: any, result: any) => {
          if (err) {
            this.logger.error(
              `${err},Unable to get metadata from ${table} in ${sourceSchema}`
            );
            return reject(err);
          } else {
            try {
              let parquetSchema = await getSchemaParquet(result);
              async function getSchemaParquet(result: any) {
                var fields: any = {};
                for (let i = 0; i < result.length; i++) {
                  var name = result[i].COLUMN_NAME;
                  fields[name] = {
                    type: maplist[result[i].DATA_TYPE_NAME],
                    optional: true,
                  };
                }
                let schema = new parquet.ParquetSchema(fields);
                return schema;
              }

              this.logger.info(
                `Parquet schema for ${table} successfully created`
              );
              let parquetTransform = new parquet.ParquetTransformer(
                parquetSchema
              );
              const readableStream = new Readable({
                objectMode: true,
                read() {
                  for (let i = 0; i < res.length; i++) {
                    for (let key in res[i]) {
                      if (res[i][key] == "NoValue") {
                        delete res[i][key];
                      }
                    }
                    readableStream.push(res[i]);
                  }
                  readableStream.push(null);
                },
              });

              const fileName = `${destSchema}-${table}-${new Date().valueOf()}.parquet`;
              this.logger.info(`Establishing connection to MinIO`);

              const client = new Minio.Client({
                endPoint: this.properties["minio_endpoint"],
                port: parseInt(this.properties["minio_port"]),
                useSSL: this.properties["minio_ssl"] === "true",
                accessKey: this.properties["minio_access_key"],
                secretKey: this.properties["minio_secret_key"],
              });

              const bucketName = `parquetsnapshots-${this.properties["alp_system_id"]}`;
              await client.makeBucket(
                bucketName,
                this.properties["minio_region"]
              );
              const convertStream = readableStream.pipe(parquetTransform);
              this.logger.info(`Piping stream`);
              readableStream.pipe(parquetTransform).on("finish", async () => {
                await client.putObject(bucketName, fileName, convertStream);
                this.logger.info("S3 object successfully uploaded");
                resolve("success");
              });
            } catch (e) {
              this.logger.error(e);
              reject(e);
            }
          }
        }
      );
    });
  };

  importCsvFilesIntoSchema = (
    dbConnection: ConnectionInterface,
    schema: string,
    csvFiles: string[],
    callback: any
  ) => {
    dbConnection.setAutoCommitToFalse();

    for (let i = 0; i < csvFiles.length; i++) {
      let result: any;
      let tableName: string = dbUtils.getTableNameFromFile(
        csvFiles[i],
        this.dialect
      );
      const content: string[] = dbUtils.getCsvFileContent(csvFiles[i]);
      const headers: string[] = dbUtils.getCsvContentHeaders(content);
      const rows: string[][] = dbUtils.getCsvContentRows(content);
      this.logger.info(
        `Loading ${csvFiles[i]} into "${schema}"."${tableName}"....`
      );

      switch (tableName) {
        case "care_site":
        case "CARE_SITE":
          result = dbUtils.excludeColumns(headers, rows, { LOCATION_ID: true });
          break;
        case "condition_era":
        case "CONDITION_ERA":
          result = dbUtils.excludeColumns(headers, rows, {});
          break;
        case "condition_occurrence":
        case "CONDITION_OCCURRENCE":
          result = dbUtils.excludeColumns(headers, rows, {
            CONDITION_END_DATETIME: true,
            PROVIDER_ID: true,
            VISIT_DETAIL_ID: true,
          });
          break;
        case "cost":
        case "COST":
          result = dbUtils.excludeColumns(headers, rows, {
            TOTAL_CHARGE: true,
            TOTAL_COST: true,
            PAID_BY_PAYER: true,
            PAID_PATIENT_COPAY: true,
            PAID_PATIENT_DEDUCTIBLE: true,
            PAID_BY_PRIMARY: true,
            PAID_INGREDIENT_COST: true,
            PAID_DISPENSING_FEE: true,
            PAYER_PLAN_PERIOD_ID: true,
            AMOUNT_ALLOWED: true,
            REVENUE_CODE_CONCEPT_ID: true,
            REVENUE_CODE_SOURCE_VALUE: true,
            DRG_SOURCE_VALUE: true,
          });
          break;
        case "death":
        case "DEATH":
          result = dbUtils.excludeColumns(headers, rows, {
            CAUSE_CONCEPT_ID: true,
            DEATH_DATETIME: true,
          });
          break;
        case "device_exposure":
        case "DEVICE_EXPOSURE":
          result = dbUtils.excludeColumns(headers, rows, {
            DEVICE_EXPOSURE_END_DATETIME: true,
            UNIQUE_DEVICE_ID: true,
            QUANTITY: true,
            PROVIDER_ID: true,
            VISIT_DETAIL_ID: true,
            UNIT_CONCEPT_ID: true,
            UNIT_SOURCE_VALUE: true,
            UNIT_SOURCE_CONCEPT_ID: true,
          });
          break;
        case "drug_era":
        case "DRUG_ERA":
          result = dbUtils.excludeColumns(headers, rows, {});
          break;
        case "drug_exposure":
        case "DRUG_EXPOSURE":
          result = dbUtils.excludeColumns(headers, rows, {
            DRUG_EXPOSURE_END_DATETIME: true,
            VERBATIM_END_DATE: true,
            REFILLS: true,
            QUANTITY: true,
            DAYS_SUPPLY: true,
            ROUTE_CONCEPT_ID: true,
            LOT_NUMBER: true,
            PROVIDER_ID: true,
            VISIT_OCCURRENCE_ID: true,
            VISIT_DETAIL_ID: true,
            ROUTE_SOURCE_VALUE: true,
            DOSE_UNIT_SOURCE_VALUE: true,
          });
          break;
        case "location":
        case "LOCATION":
          result = dbUtils.excludeColumns(headers, rows, {});
          break;
        case "measurement":
        case "MEASUREMENT":
          result = dbUtils.excludeColumns(headers, rows, {
            MEASUREMENT_DATETIME: true,
            MEASUREMENT_TIME: true,
            OPERATOR_CONCEPT_ID: true,
            VALUE_AS_NUMBER: true,
            UNIT_CONCEPT_ID: true,
            RANGE_LOW: true,
            RANGE_HIGH: true,
            PROVIDER_ID: true,
            VISIT_DETAIL_ID: true,
            MEASUREMENT_SOURCE_CONCEPT_ID: true,
            VALUE_SOURCE_VALUE: true,
          });
          break;
        case "observation_period":
        case "OBSERVATION_PERIOD":
          result = dbUtils.excludeColumns(headers, rows, {});
          break;
        case "observation":
        case "OBSERVATION":
          result = dbUtils.excludeColumns(headers, rows, {
            OBSERVATION_DATETIME: true,
            OBSERVATION_EVENT_ID: true,
            VALUE_AS_NUMBER: true,
            VALUE_AS_STRING: true,
            VALUE_AS_DATETIME: true,
            QUALIFIER_CONCEPT_ID: true,
            UNIT_CONCEPT_ID: true,
            PROVIDER_ID: true,
            VISIT_DETAIL_ID: true,
            UNIT_SOURCE_VALUE: true,
            QUALIFIER_SOURCE_VALUE: true,
            OBS_EVENT_FIELD_CONCEPT_ID: true,
          });
          break;
        case "payer_plan_period":
        case "PAYER_PLAN_PERIOD":
          result = dbUtils.excludeColumns(headers, rows, {
            PAYER_CONCEPT_ID: true,
            PAYER_SOURCE_VALUE: true,
            PAYER_SOURCE_CONCEPT_ID: true,
            PLAN_CONCEPT_ID: true,
            PLAN_SOURCE_CONCEPT_ID: true,
            SPONSOR_CONCEPT_ID: true,
            SPONSOR_SOURCE_VALUE: true,
            SPONSOR_SOURCE_CONCEPT_ID: true,
            FAMILY_SOURCE_VALUE: true,
            STOP_REASON_CONCEPT_ID: true,
            STOP_REASON_SOURCE_VALUE: true,
            STOP_REASON_SOURCE_CONCEPT_ID: true,
          });
          break;
        case "person":
        case "PERSON":
          result = dbUtils.excludeColumns(headers, rows, {
            BIRTH_DATETIME: true,
            PROVIDER_ID: true,
            CARE_SITE_ID: true,
            GENDER_SOURCE_CONCEPT_ID: true,
            RACE_SOURCE_CONCEPT_ID: true,
            ETHNICITY_SOURCE_CONCEPT_ID: true,
          });
          break;
        case "procedure_occurrence":
        case "PROCEDURE_OCCURRENCE":
          result = dbUtils.excludeColumns(headers, rows, {
            PROCEDURE_END_DATE: true,
            PROCEDURE_END_DATETIME: true,
            MODIFIER_CONCEPT_ID: true,
            QUANTITY: true,
            PROVIDER_ID: true,
            VISIT_DETAIL_ID: true,
            MODIFIER_SOURCE_VALUE: true,
          });
          break;
        case "provider":
        case "PROVIDER":
          result = dbUtils.excludeColumns(headers, rows, {
            YEAR_OF_BIRTH: true,
            SPECIALTY_SOURCE_VALUE: true,
            GENDER_SOURCE_VALUE: true,
          });
          break;
        case "visit_occurrence":
        case "VISIT_OCCURRENCE":
          result = dbUtils.excludeColumns(headers, rows, {
            VISIT_START_DATETIME: true,
            VISIT_END_DATETIME: true,
            PROVIDER_ID: true,
            CARE_SITE_ID: true,
            VISIT_SOURCE_CONCEPT_ID: true,
            ADMITTING_SOURCE_VALUE: true,
            DISCHARGE_TO_SOURCE_VALUE: true,
            PRECEDING_VISIT_OCCURRENCE_ID: true,
          });
          break;
        case "gdm_research_subject":
        case "GDM.RESEARCH_SUBJECT":
          result = dbUtils.excludeColumns(headers, rows, {
            STUDY_REFERENCE: true,
            STUDY_TYPE: true,
            STUDY_IDENTIFIER_USE: true,
            STUDY_IDENTIFIER_TYPE: true,
            STUDY_DISPLAY: true,
            STUDY_IDENTIFIER_PERIOD_START: true,
            STUDY_IDENTIFIER_PERIOD_END: true,
            INDIVIDUAL_IDENTIFIER_PERIOD_START: true,
            INDIVIDUAL_IDENTIFIER_PERIOD_END: true,
            INDIVIDUAL_REFERENCE: true,
            INDIVIDUAL_TYPE: true,
            INDIVIDUAL_IDENTIFIER_USE: true,
            INDIVIDUAL_IDENTIFIER_TYPE: true,
            INDIVIDUAL_DISPLAY: true,
            ASSIGNED_ARM: true,
            ACTUAL_ARM: true,
          });
          break;
        case "gdm_questionnaire_response":
        case "GDM.QUESTIONNAIRE_RESPONSE":
          result = dbUtils.excludeColumns(headers, rows, {});
          break;
        case "gdm_item":
        case "GDM.ITEM":
          result = dbUtils.excludeColumns(headers, rows, {
            DEFINITION: true,
          });
          break;
        case "gdm_answer":
        case "GDM.ANSWER":
          result = dbUtils.excludeColumns(headers, rows, {
            VALUEATTACHMENT_CONTENTTYPE: true,
            VALUEATTACHMENT_LANGUAGE: true,
            VALUEATTACHMENT_DATA: true,
            VALUEATTACHMENT_URL: true,
            VALUEATTACHMENT_SIZE: true,
            VALUEATTACHMENT_HASH: true,
            VALUEATTACHMENT_TITLE: true,
            VALUEATTACHMENT_CREATION: true,
            VALUEQUANTITY_VALUE: true,
            VALUEQUANTITY_COMPARATOR: true,
            VALUEQUANTITY_UNIT: true,
            VALUEQUANTITY_SYSTEM: true,
            VALUEQUANTITY_CODE: true,
            VALUEREFERENCE_REFERENCE: true,
            VALUEREFERENCE_TYPE: true,
            VALUEREFERENCE_IDENTIFIER: true,
            VALUEREFERENCE_DISPLAY: true,
          });
          break;
        default:
          return callback("Unknown table to import.");
      }

      if (this.dialect === config.DB.HANA) {
        dbConnection.executeBulkInsert(
          dbUtils.generateSqlTemplateForDataLoadingForHana(
            schema,
            tableName,
            result.headers
          ),
          result.rows,
          (err: any, _result: any) => {
            if (err) {
              this.logger.error(`Error loading ${csvFiles[i]} into ${schema}.`);
              return callback(err);
            }

            this.logger.info(
              `Complete loading ${csvFiles[i]} into "${schema}"."${tableName}".`
            );

            if (i === csvFiles.length - 1) {
              dbConnection.commit((err: any) => {
                if (err) {
                  return callback(err);
                }
                this.logger.info(
                  `All csv file successfully loaded into ${schema}.`
                );
                return callback(null);
              });
            }
          }
        );
      } else if (this.dialect === config.DB.POSTGRES) {
        const rowCount: number = result.rows.length;
        const chunkSize: number = 50000;
        const chunkCount: number = Math.ceil(rowCount / chunkSize);

        for (let j = 0; j < chunkCount; j++) {
          const start = j * chunkSize;
          const end = start > rowCount ? rowCount : (j + 1) * chunkSize;

          dbConnection.executeQuery(
            dbUtils.generateSqlTemplateForDataLoadingForPostgres(
              schema,
              tableName,
              result.headers,
              result.rows.slice(start, end)
            ),
            [],
            (err: any, _result: any) => {
              if (err) {
                this.logger.error(
                  `Error inserting data into ${schema}.${tableName}: ${err}`
                );
                return callback(err);
              }

              if (j === chunkCount - 1) {
                this.logger.info(
                  `Complete loading ${csvFiles[i]} into "${schema}"."${tableName}".`
                );

                if (i === csvFiles.length - 1) {
                  dbConnection.commit((err) => {
                    if (err) {
                      return callback(err);
                    }
                    this.logger.info(
                      `All csv file successfully loaded into ${schema}.`
                    );
                    return callback(null);
                  });
                }
              }
            }
          );
        }
      }
    }
  };

  createQuestionnaireDefinition = (
    definition: string,
    schema: string,
    dbConnection: ConnectionInterface,
    callback: Function
  ) => {
    let convertedJson = JSON.parse(definition);
    let questionnaireObj: IQuestionnaire = convertedJson;

    let hanaQuestionnaireTable = "GDM.QUESTIONNAIRE";

    let tableName =
      this.dialect === config.DB.HANA
        ? hanaQuestionnaireTable
        : dbUtils.convertNameToPg(hanaQuestionnaireTable);

    dbConnection.execute(
      `INSERT INTO  "${schema}"."${tableName}" (
        id,identifier, uri, version, name, title,derivedfrom,status,experimental,subjecttype,contact,date,publisher,description,use_context, jurisdiction, purpose,copyright,copyright_label,approval_date,last_review_date,effective_period, code, created_at)
      VALUES ( ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
      [
        { value: questionnaireObj.id == undefined ? "" : questionnaireObj.id },
        {
          value:
            questionnaireObj.identifier == undefined
              ? ""
              : JSON.stringify(questionnaireObj.identifier),
        },
        {
          value: questionnaireObj.url == undefined ? "" : questionnaireObj.url,
        },
        {
          value:
            questionnaireObj.version == undefined
              ? ""
              : JSON.stringify(questionnaireObj.version),
        },
        {
          value:
            questionnaireObj.name == undefined ? "" : questionnaireObj.name,
        },
        {
          value:
            questionnaireObj.title == undefined ? "" : questionnaireObj.title,
        },
        {
          value:
            questionnaireObj.derivedFrom == undefined
              ? ""
              : questionnaireObj.derivedFrom,
        },
        { value: questionnaireObj.status },
        {
          value:
            questionnaireObj.experimental == undefined
              ? ""
              : questionnaireObj.experimental.toString(),
        },
        {
          value:
            questionnaireObj.subjectType == undefined
              ? ""
              : questionnaireObj.subjectType,
        },
        {
          value:
            questionnaireObj.contact == undefined
              ? ""
              : JSON.stringify(questionnaireObj.contact),
        },
        {
          value:
            questionnaireObj.date == undefined
              ? ""
              : questionnaireObj.date.toString(),
        },
        {
          value:
            questionnaireObj.publisher == undefined
              ? ""
              : questionnaireObj.publisher,
        },
        {
          value:
            questionnaireObj.description == undefined
              ? ""
              : questionnaireObj.description,
        },
        {
          value:
            questionnaireObj.useContext == undefined
              ? ""
              : JSON.stringify(questionnaireObj.useContext),
        },
        {
          value:
            questionnaireObj.jurisdiction == undefined
              ? ""
              : JSON.stringify(questionnaireObj.jurisdiction),
        },
        {
          value:
            questionnaireObj.purpose == undefined
              ? ""
              : questionnaireObj.purpose,
        },
        {
          value:
            questionnaireObj.copyright == undefined
              ? ""
              : questionnaireObj.copyright,
        },
        {
          value:
            questionnaireObj.copyright_label == undefined
              ? ""
              : questionnaireObj.copyright_label,
        },
        {
          value:
            questionnaireObj.approvalDate == undefined
              ? ""
              : questionnaireObj.approvalDate,
        },
        {
          value:
            questionnaireObj.lastReviewDate == undefined
              ? ""
              : questionnaireObj.lastReviewDate,
        },
        {
          value:
            questionnaireObj.effectivePeriod == undefined
              ? ""
              : JSON.stringify(questionnaireObj.effectivePeriod),
        },
        {
          value:
            questionnaireObj.code == undefined
              ? ""
              : JSON.stringify(questionnaireObj.code),
        },
      ],
      (err: any, result: any) => {
        if (err) {
          callback(err, [{ error: { message: definition } }]);
        } else {
          this.logger.info(`Inserted questionnaire definition successfully`);
          this.createQuestionnaireItem(
            questionnaireObj.item,
            schema,
            dbConnection,
            questionnaireObj.id == undefined ? "" : questionnaireObj.id,
            "",
            (err: Error, result: any) => {
              this.logger.info(`Inserted questionnaire items successfully`);
              callback(null, [{ value: schema, changelogs: result }]);
            }
          );
        }
      }
    );
  };

  createQuestionnaireItem = (
    items: IItem[],
    schema: string,
    dbConnection: ConnectionInterface,
    questionnaireId: string,
    parentItemId: string,
    callback: Function
  ) => {
    let countOfItemResponse = 0;
    let dbChildExecuteCount = 0;
    let countOfItemsWithSubItems = 0;
    let QuesionnaireQuestions = "";
    let hanaItemQuestionnaireTable = "GDM.ITEM_QUESTIONNAIRE";

    let tableName =
      this.dialect === config.DB.HANA
        ? hanaItemQuestionnaireTable
        : dbUtils.convertNameToPg(hanaItemQuestionnaireTable);

    for (let i = 0; i <= items.length - 1; i++) {
      let obj = items[i];
      if (obj.type !== "group")
        QuesionnaireQuestions = obj.text == undefined ? "" : "," + obj.text;
      obj.id = uuidv4();

      const hanaColumns: string[] = [
        "ID",
        "GDM.QUESTIONNAIRE_ID",
        "GDM.ITEM_QUESIONNAIRE_PARENT_ID",
        "LINKID",
        "DEFINITION",
        "CODE",
        "PREFIX",
        "TEXT",
        "TYPE",
        "ENABLE_WHEN",
        "ENABLE_BEHAVIOR",
        "DISABLED_DISPLAY",
        "REQUIRED",
        "REPEATS",
        "READONLY",
        "MAXLENGTH",
        "ANSWER_CONSTRAINT",
        "ANSWER_OPTION",
        "ANSWER_VALUESET",
        "INITIAL_VALUE",
        "CREATED_AT",
      ];

      let headersToLoad =
        this.dialect === config.DB.HANA
          ? hanaColumns
          : dbUtils.convertColumnsToPg(hanaColumns);

      dbConnection.execute(
        `INSERT INTO "${schema}"."${tableName}" (
          ${headersToLoad.map((header) => `"${header}"`).join(",")})
            VALUES ( ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
        [
          { value: obj.id },
          { value: questionnaireId == undefined ? "" : questionnaireId },
          { value: parentItemId == undefined ? "" : parentItemId },
          { value: obj.linkId },
          { value: obj.definition == undefined ? "" : obj.definition },
          { value: obj.code == undefined ? "" : JSON.stringify(obj.code) },
          { value: obj.prefix == undefined ? "" : obj.prefix },
          { value: obj.text == undefined ? "" : obj.text },
          { value: obj.type },
          {
            value:
              obj.enableWhen == undefined ? "" : JSON.stringify(obj.enableWhen),
          },
          {
            value:
              obj.enableBehavior == undefined
                ? ""
                : obj.enableBehavior.toString(),
          },
          {
            value:
              obj.disbledDisplay == undefined
                ? ""
                : obj.disbledDisplay.toString(),
          },
          { value: obj.required == undefined ? "" : obj.required },
          { value: obj.repeats == undefined ? "" : obj.repeats },
          { value: obj.readOnly == undefined ? "" : obj.readOnly },
          { value: obj.maxLength == undefined ? 0 : Number(obj.maxLength) },
          {
            value:
              obj.answerConstraint == undefined ? "" : obj.answerConstraint,
          },
          {
            value:
              obj.answerOption == undefined
                ? ""
                : JSON.stringify(obj.answerOption),
          },
          {
            value:
              obj.answerValueSet == undefined
                ? ""
                : JSON.stringify(obj.answerValueSet),
          },
          {
            value: obj.initial == undefined ? "" : JSON.stringify(obj.initial),
          },
        ],
        (err: any, result: any) => {
          countOfItemResponse++;
          if (err) {
            callback(err, [{ error: { message: items } }]);
          } else {
            this.logger.info(
              `Inserted questionnaire item with linkId ${obj.linkId} successfully`
            );
            //Create sub items
            if (obj.item !== undefined && obj.item.length > 0) {
              countOfItemsWithSubItems++;
              this.createQuestionnaireItem(
                obj.item,
                schema,
                dbConnection,
                questionnaireId,
                obj.id,
                (err: Error, resultChildItems: any) => {
                  if (err) {
                    this.logger.error(
                      `Error unable to get DB Connection!\n${err.stack}`
                    );
                    return callback(err);
                  }
                  this.logger.info(
                    `Created a sub items of linkId ${obj.linkId} successfully`
                  );
                  dbChildExecuteCount++;
                  if (dbChildExecuteCount == countOfItemsWithSubItems) {
                    callback(null, [
                      { value: items, changelogs: resultChildItems },
                    ]);
                  }
                }
              );
            }
            if (
              countOfItemsWithSubItems == 0 &&
              countOfItemResponse == items.length
            ) {
              callback(null, [{ value: items, changelogs: result }]);
            }
          }
        }
      );
    }
  };

  getResponsedByQuestionnaireId = (
    questionnaire: string,
    schema: string,
    dbConnection: ConnectionInterface,
    callback: Function
  ) => {
    dbConnection.executeProcWithSchema(
      `SP::GET_QUESTIONNAIRE_RESPONSE`,
      [questionnaire],
      schema,
      (err: any, result: any) => {
        if (err) {
          callback(err, [{ error: { message: questionnaire } }]);
        } else {
          //this.logger.info(`Inserted questionnaire definition successfully`);
          const resultset = dbConnection.parseResults(result, result.metadata);
          var array = typeof result != "object" ? JSON.parse(result) : result;
          const escapeToken = "~~~~";
          var csv;

          for (var i = 0; i < array.length; i++) {
            for (var index in array[i]) {
              array[i][index] = array[i][index].replace(/,/g, escapeToken);
            }
          }
          csv = array.map((row) => Object.values(row));
          csv.unshift(Object.keys(array[0]));
          csv = `"${csv.join('"\n"').replace(/,/g, '","')}"`;
          csv = csv.replace(new RegExp(`${escapeToken}`, "g"), ",");
          callback(null, csv);
        }
      }
    );
  };
}

export default DBDAO;
