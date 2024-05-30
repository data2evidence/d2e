import fs from "fs";
import express from "express";
import { Liquibase } from "../utils/liquibase";
import * as config from "../utils/config";
import { registerRouterHandler, HTTP_METHOD } from "../utils/httpUtils";
import async from "async";
import UserDAO from "../dao/UserDAO";
import DBDAO from "../dao/DBDAO";
import * as utils from "../utils/baseUtils";
import { param, query, body } from "express-validator";
import { ConnectionInterface } from "../utils/Connection";
import DataflowMgmtAPI from "../api/DataflowMgmtAPI";
import { DataModelSchemaMappingType } from "../utils/types";

export default class DBRouter {
  public router: express.Router = express.Router();
  private logger = config.getLogger();
  private properties = config.getProperties();
  private dbDao;
  private userDao;
  private dbObjectNameValidationRegExp = /^\w+$/;
  private schemaNameRegExp = /^\w+$/;
  private StagingAreaSchemaNameRegExp = /^\w+$/;
  private tenantConfigs;
  private dialect: string;
  private tenantConfigKeys;

  constructor(dialect: string) {
    this.dialect = dialect;
    this.logger = config.getLogger();
    this.dbDao = new DBDAO(dialect);
    this.userDao = new UserDAO();
    this.tenantConfigs = config.getTenantConfigs(dialect);
    this.tenantConfigKeys = config.getTenantConfigKeys(dialect);

    //POST
    //database/:tenant/prefect/flow-run/update-attributes
    registerRouterHandler(
      this.router,
      HTTP_METHOD.POST,
      "/prefect/flow-run/update-attributes",
      [body().notEmpty().withMessage("Request body is empty")],
      [this.createUpdateAttributesFlowRun]
    );

    //POST
    //database/:tenant/data-model/:dataModel/schema/:schema
    registerRouterHandler(
      this.router,
      HTTP_METHOD.POST,
      "/database/:tenant/data-model/:dataModel/schema/:schema",
      [
        param("tenant")
          .isIn(config.getTenants(dialect))
          .notEmpty()
          .matches(this.dbObjectNameValidationRegExp)
          .withMessage("Tenant database name is invalid"),
        param("schema")
          .notEmpty()
          .matches(this.schemaNameRegExp)
          .withMessage("Schema name is invalid"),
        param("dataModel")
          .notEmpty()
          .isIn([
            config.ALP_DATA_MODELS.OMOP5_4,
            config.ALP_DATA_MODELS.PATHOLOGY,
            config.ALP_DATA_MODELS.BIO_ME,
            config.ALP_DATA_MODELS.CUSTOM_OMOP_MS,
            config.ALP_DATA_MODELS.CUSTOM_OMOP_MS_PHI,
            config.ALP_DATA_MODELS.REPORTING_BI,
            config.ALP_DATA_MODELS.RADIOLOGY,
            config.ALP_DATA_MODELS.GENOMICS,
          ])
          .withMessage("data-model is invalid"),
        body("cleansedSchemaOption").notEmpty().isIn([true, false]),
        body("customChangelogFilepath").optional(),
        body("customClasspath").optional(),
        body("vocabSchema").custom((vocabSchema, { req }) => {
          let omop_vocab_schema =
            this.dialect === "hana"
              ? config
                  .getProperties()
                  ["omop_vocab_schema"].toString()
                  .toUpperCase()
              : config.getProperties()["omop_vocab_schema"];
          return (
            //Concat env defined vocab schemas with the new CDM schema using its own schema for the vocabulary tables
            omop_vocab_schema.concat(req.params?.schema).indexOf(vocabSchema) >
            -1
          );
        }),
      ],
      [this.createCDMSchema]
    );

    //ENDPOINT IS ONLY CONFIGURED FOR HANA DIALECT
    //POST
    //database/:tenant/data-model/omop5-4/schemasnapshot/:schema
    registerRouterHandler(
      this.router,
      HTTP_METHOD.POST,
      "/database/:tenant/data-model/:dataModel/schemasnapshot/:schema",
      [
        param("dialect")
          .isIn([config.DB.HANA])
          .withMessage("Route is not supported for this dialect"),
        param("tenant")
          .isIn(config.getTenants(dialect))
          .notEmpty()
          .matches(this.dbObjectNameValidationRegExp)
          .withMessage("Tenant database name is invalid"),
        param("schema")
          .notEmpty()
          .matches(this.schemaNameRegExp)
          .withMessage("Schema name is invalid"),
        param("dataModel")
          .notEmpty()
          .isIn([
            config.ALP_DATA_MODELS.OMOP5_4,
            config.ALP_DATA_MODELS.PATHOLOGY,
            config.ALP_DATA_MODELS.BIO_ME,
            config.ALP_DATA_MODELS.CUSTOM_OMOP_MS,
            config.ALP_DATA_MODELS.CUSTOM_OMOP_MS_PHI,
            config.ALP_DATA_MODELS.REPORTING_BI,
            config.ALP_DATA_MODELS.RADIOLOGY,
            config.ALP_DATA_MODELS.GENOMICS,
          ])
          .withMessage("data-model is invalid"),
        query("sourceschema")
          .notEmpty()
          .matches(this.schemaNameRegExp)
          .withMessage("Source schema name is invalid"),
        body("customChangelogFilepath").optional(),
        body("customClasspath").optional(),
        body("snapshotCopyConfig").custom((snapshotCopyConfig) => {
          // If snapshotCopyConfig is not sent, skip validation
          if (!snapshotCopyConfig) {
            return true;
          }
          // check timestamp format in snapshotCopyConfig
          if (
            snapshotCopyConfig.timestamp &&
            !snapshotCopyConfig.timestamp.match(
              new RegExp(
                /^([1-2]\d{3}-([0]?[1-9]|1[0-2])-([0-2]?[0-9]|3[0-1])) (20|21|22|23|[0-1]\d):([0-5]\d):([0-5]\d)$/,
                "i"
              )
            )
          ) {
            throw new Error(
              "timestamp must be in the format YYYY-MM-DD HH:mm:ss"
            );
          }
          // Indicates the success of this synchronous custom validator
          return true;
        }),
      ],
      [this.createSnapshotCDMSchema]
    );

    //PUT
    //database/:tenant/importdata
    //only works for OMOP v5.4
    registerRouterHandler(
      this.router,
      HTTP_METHOD.PUT,
      "/database/:tenant/importdata",
      [
        param("tenant")
          .isIn(config.getTenants(dialect))
          .notEmpty()
          .matches(this.dbObjectNameValidationRegExp)
          .withMessage("Tenant database name is invalid"),
        query("schema")
          .notEmpty()
          .matches(this.schemaNameRegExp)
          .withMessage("Schema name is invalid"),
        body("filePath").optional(),
      ],
      [this.loadSynpuf1kData]
    );

    //PUT
    //database/:tenant/data-model/:dataModel
    registerRouterHandler(
      this.router,
      HTTP_METHOD.PUT,
      "/database/:tenant/data-model/:dataModel",
      [
        param("tenant")
          .isIn(config.getTenants(dialect))
          .notEmpty()
          .matches(this.dbObjectNameValidationRegExp)
          .withMessage("Tenant database name is invalid"),
        param("dataModel")
          .notEmpty()
          .isIn([
            config.ALP_DATA_MODELS.OMOP5_4,
            config.ALP_DATA_MODELS.PATHOLOGY,
            config.ALP_DATA_MODELS.BIO_ME,
            config.ALP_DATA_MODELS.CUSTOM_OMOP_MS,
            config.ALP_DATA_MODELS.CUSTOM_OMOP_MS_PHI,
            config.ALP_DATA_MODELS.REPORTING_BI,
            config.ALP_DATA_MODELS.RADIOLOGY,
            config.ALP_DATA_MODELS.GENOMICS,
          ])
          .withMessage("data-model is invalid"),
        query("schema")
          .notEmpty()
          .matches(this.schemaNameRegExp)
          .withMessage("Schema name is invalid"),
        body("customChangelogFilepath").optional(),
        body("customClasspath").optional(),
        body("vocabSchema").custom((vocabSchema, { req }) => {
          let omop_vocab_schema =
            this.dialect === "hana"
              ? config
                  .getProperties()
                  ["omop_vocab_schema"].toString()
                  .toUpperCase()
              : config.getProperties()["omop_vocab_schema"];
          return (
            //Concat env defined vocab schemas with the new CDM schema using its own schema for the vocabulary tables
            omop_vocab_schema.concat(req.params?.schema).indexOf(vocabSchema) >
            -1
          );
        }),
      ],
      [this.updateSchemas]
    );

    //ENDPOINT IS ONLY CONFIGURED FOR HANA DIALECT
    //PUT
    //database/:tenant/maintenance/schema/:schema
    registerRouterHandler(
      this.router,
      HTTP_METHOD.PUT,
      "/database/:tenant/maintenance/schema/:schema",
      [
        param("dialect")
          .isIn([config.DB.HANA])
          .withMessage("Route is not supported for this dialect"),
        param("tenant")
          .isIn(config.getTenants(dialect))
          .notEmpty()
          .matches(this.dbObjectNameValidationRegExp)
          .withMessage("Tenant database name is invalid"),
        param("schema")
          .notEmpty()
          .matches(new RegExp(/_ADMIN_USER$/, "i"))
          .withMessage("Maintenance user schema name is invalid"),
      ],
      [this.updateMaintenanceScript]
    );

    //DELETE
    //database/:tenant/data-model/omop5-4/count/:rollbackCount
    registerRouterHandler(
      this.router,
      HTTP_METHOD.DELETE,
      "/database/:tenant/data-model/:dataModel/count/:rollbackCount",
      [
        param("tenant")
          .isIn(config.getTenants(dialect))
          .notEmpty()
          .matches(this.dbObjectNameValidationRegExp)
          .withMessage("Tenant database name is invalid"),
        param("dataModel")
          .notEmpty()
          .isIn([
            config.ALP_DATA_MODELS.OMOP,
            config.ALP_DATA_MODELS.OMOP5_4,
            config.ALP_DATA_MODELS.PATHOLOGY,
            config.ALP_DATA_MODELS.BIO_ME,
            config.ALP_DATA_MODELS.CUSTOM_OMOP_MS,
            config.ALP_DATA_MODELS.CUSTOM_OMOP_MS_PHI,
            config.ALP_DATA_MODELS.REPORTING_BI,
            config.ALP_DATA_MODELS.GENOMICS,
          ]),
        param("rollbackCount")
          .notEmpty()
          .isInt()
          .withMessage("Rollback count is invalid"),
        query("schema")
          .notEmpty()
          .matches(this.schemaNameRegExp)
          .withMessage("Schema name is invalid"),
        body("customChangelogFilepath").optional(),
        body("customClasspath").optional(),
      ],
      [this.rollbackCount]
    );

    //ENDPOINT IS ONLY CONFIGURED FOR HANA DIALECT
    //DELETE
    //database/:tenant/data-model/omop5-4/tag/:rollbackTag
    registerRouterHandler(
      this.router,
      HTTP_METHOD.DELETE,
      "/database/:tenant/data-model/:dataModel/tag/:rollbackTag",
      [
        param("dialect")
          .isIn([config.DB.HANA])
          .withMessage("Route is not supported for this dialect"),
        param("tenant")
          .isIn(config.getTenants(dialect))
          .notEmpty()
          .matches(this.dbObjectNameValidationRegExp)
          .withMessage("Tenant database name is invalid"),
        param("dataModel")
          .notEmpty()
          .isIn([
            config.ALP_DATA_MODELS.OMOP,
            config.ALP_DATA_MODELS.OMOP5_4,
            config.ALP_DATA_MODELS.PATHOLOGY,
            config.ALP_DATA_MODELS.BIO_ME,
            config.ALP_DATA_MODELS.CUSTOM_OMOP_MS,
            config.ALP_DATA_MODELS.CUSTOM_OMOP_MS_PHI,
            config.ALP_DATA_MODELS.REPORTING_BI,
            config.ALP_DATA_MODELS.GENOMICS,
          ]),
        param("rollbackTag")
          .notEmpty()
          .isAlphanumeric()
          .withMessage("Rollback Tag is invalid"),
        query("schema")
          .notEmpty()
          .matches(this.schemaNameRegExp)
          .withMessage("Schekma name is invalid"),
        body("customChangelogFilepath").optional(),
        body("customClasspath").optional(),
      ],
      [this.rollbackTag]
    );

    //GET
    //database/:tenant/version-info
    registerRouterHandler(
      this.router,
      HTTP_METHOD.POST,
      "/database/:tenant/version-info",
      [
        param("tenant")
          .isIn(config.getTenants(dialect))
          .notEmpty()
          .matches(this.dbObjectNameValidationRegExp)
          .withMessage("Tenant database name is invalid"),
        body("customChangelogFilepath").optional(),
        body("customClasspath").optional(),
        body().notEmpty().withMessage("Request body is empty"),
      ],
      [this.getVersionInfoForSchemas]
    );

    //Staging Area APIs
    //POST
    //database/:tenant/staging-area/:stagingArea/schema/:schema
    //ENDPOINT IS ONLY CONFIGURED FOR POSTGRES DIALECT
    registerRouterHandler(
      this.router,
      HTTP_METHOD.POST,
      "/database/:tenant/staging-area/:stagingArea/schema/:schema",
      [
        param("dialect")
          .isIn([config.DB.POSTGRES])
          .withMessage("Route is not supported for this dialect"),
        param("tenant")
          .isIn(config.getTenants(dialect))
          .notEmpty()
          .matches(this.dbObjectNameValidationRegExp)
          .withMessage("Tenant database name is invalid"),
        param("schema")
          .notEmpty()
          .matches(this.StagingAreaSchemaNameRegExp)
          .withMessage("Schema name is invalid"),
        param("stagingArea")
          .notEmpty()
          .isIn([config.ALP_STAGING_AREAS.FHIR_DATA])
          .withMessage("staging-area is invalid"),
      ],
      [this.createStagingAreaSchema]
    );

    //ENDPOINT IS ONLY CONFIGURED FOR POSTGRES DIALECT
    //PUT
    //database/:tenant/staging-area/:stagingArea
    registerRouterHandler(
      this.router,
      HTTP_METHOD.PUT,
      "/database/:tenant/staging-area/:stagingArea",
      [
        param("dialect")
          .isIn([config.DB.POSTGRES])
          .withMessage("Route is not supported for this dialect"),
        param("tenant")
          .isIn(config.getTenants(dialect))
          .notEmpty()
          .matches(this.dbObjectNameValidationRegExp)
          .withMessage("Tenant database name is invalid"),
        param("stagingArea")
          .notEmpty()
          .isIn([config.ALP_STAGING_AREAS.FHIR_DATA])
          .withMessage("staging-area is invalid"),
      ],
      [this.updateStagingAreaSchemas]
    );

    //This is created for db-svc integration testing purpose
    //Used to create a schema with a subset of changeset
    //POST
    //database/:tenant/data-model/:dataModel/schema/:schema/update-count/:count
    registerRouterHandler(
      this.router,
      HTTP_METHOD.POST,
      "/database/:tenant/data-model/:dataModel/schema/:schema/update-count/:count",
      [
        param("tenant")
          .isIn(config.getTenants(dialect))
          .notEmpty()
          .matches(this.dbObjectNameValidationRegExp)
          .withMessage("Tenant database name is invalid"),
        param("schema")
          .notEmpty()
          .matches(this.schemaNameRegExp)
          .withMessage("Schema name is invalid"),
        param("count")
          .notEmpty()
          .isNumeric({ no_symbols: true })
          .withMessage("Update count must be a unsigned number"),
        param("dataModel")
          .notEmpty()
          .isIn([
            config.ALP_DATA_MODELS.OMOP5_4,
            config.ALP_DATA_MODELS.PATHOLOGY,
            config.ALP_DATA_MODELS.BIO_ME,
            config.ALP_DATA_MODELS.CUSTOM_OMOP_MS,
            config.ALP_DATA_MODELS.CUSTOM_OMOP_MS_PHI,
            config.ALP_DATA_MODELS.REPORTING_BI,
            config.ALP_DATA_MODELS.RADIOLOGY,
            config.ALP_DATA_MODELS.GENOMICS,
          ])
          .withMessage("data-model is invalid"),
        body("customChangelogFilepath").optional(),
        body("customClasspath").optional(),
      ],
      [this.createCDMSchema]
    );

    //ENDPOINT IS ONLY CONFIGURED FOR HANA DIALECT
    //POST
    //database/:tenant/data-model/:dataModel/schemasnapshotparquet/:schema
    registerRouterHandler(
      this.router,
      HTTP_METHOD.POST,
      "/database/:tenant/data-model/:dataModel/schemasnapshotparquet/:schema",
      [
        param("dialect")
          .isIn([config.DB.HANA])
          .withMessage("Route is not supported for this dialect"),
        param("tenant")
          .isIn(config.getTenants(dialect))
          .notEmpty()
          .matches(this.dbObjectNameValidationRegExp)
          .withMessage("Tenant database name is invalid"),
        param("dataModel")
          .notEmpty()
          .isIn([
            config.ALP_DATA_MODELS.OMOP5_4,
            config.ALP_DATA_MODELS.PATHOLOGY,
            config.ALP_DATA_MODELS.BIO_ME,
            config.ALP_DATA_MODELS.CUSTOM_OMOP_MS,
            config.ALP_DATA_MODELS.CUSTOM_OMOP_MS_PHI,
            config.ALP_DATA_MODELS.REPORTING_BI,
            config.ALP_DATA_MODELS.RADIOLOGY,
            config.ALP_DATA_MODELS.GENOMICS,
          ])
          .withMessage("data-model is invalid"),
        param("schema")
          .notEmpty()
          .matches(this.schemaNameRegExp)
          .withMessage("Schema name is invalid"),
        query("sourceschema")
          .notEmpty()
          .matches(this.schemaNameRegExp)
          .withMessage("Source schema name is invalid"),
        body("snapshotCopyConfig").custom((snapshotCopyConfig) => {
          // If snapshotCopyConfig is not sent, skip validation
          if (!snapshotCopyConfig) {
            return true;
          }
          // check timestamp format in snapshotCopyConfig
          if (
            snapshotCopyConfig.timestamp &&
            !snapshotCopyConfig.timestamp.match(
              new RegExp(
                /^([1-2]\d{3}-([0]?[1-9]|1[0-2])-([0-2]?[0-9]|3[0-1])) (20|21|22|23|[0-1]\d):([0-5]\d):([0-5]\d)$/,
                "i"
              )
            )
          ) {
            throw new Error(
              "timestamp must be in the format YYYY-MM-DD HH:mm:ss"
            );
          }
          // Indicates the success of this synchronous custom validator
          return true;
        }),
      ],
      [this.createCDMParquetSnapshot]
    );

    //ENDPOINT IS ONLY CONFIGURED FOR HANA DIALECT
    //POST
    ///database/:tenant/schema/:schema
    registerRouterHandler(
      this.router,
      HTTP_METHOD.POST,
      "/database/:tenant/schema/:schema",
      [
        param("tenant")
          .isIn(config.getTenants(dialect))
          .notEmpty()
          .matches(this.dbObjectNameValidationRegExp)
          .withMessage("Tenant database name is invalid"),
        param("schema")
          .notEmpty()
          .matches(this.schemaNameRegExp)
          .withMessage("Schema name is invalid"),
        body().notEmpty().withMessage("Request body is empty"),
      ],
      [this.createQuestionnaireDefinition]
    );

    //ENDPOINT IS ONLY CONFIGURED FOR HANA DIALECT
    //GET
    //databases/:tenant/schema/:schema/questionnaire/:questionnaire
    registerRouterHandler(
      this.router,
      HTTP_METHOD.GET,
      "/database/:tenant/schema/:schema/questionnaire/:questionnaire",
      [
        param("dialect")
          .isIn([config.DB.HANA])
          .withMessage("Route is not supported for this dialect"),
        param("tenant")
          .isIn(config.getTenants(dialect))
          .notEmpty()
          .matches(this.dbObjectNameValidationRegExp)
          .withMessage("Tenant database name is invalid"),
        param("schema")
          .notEmpty()
          .matches(this.schemaNameRegExp)
          .withMessage("Schema name is invalid"),
        param("questionnaire")
          .notEmpty()
          .withMessage("Questionnaire is invalid"),
      ],
      [this.getResponsesForQuestionnaire]
    );
  }

  createSchemaTasks = (
    res: express.Response,
    dataModel: string,
    schema: string,
    { tenant, tenantConfig }: { tenant: string; tenantConfig: any },
    count: number,
    dbConnection: ConnectionInterface,
    vocabSchema: string,
    changelogFilepath: string | undefined,
    classpath: string | undefined
  ) => {
    return [
      (callback: any) => {
        this.dbDao.createSchema(tenant, schema, dbConnection, callback);
      },
      (callback: any) => {
        let liquibaseAction: String = Number.isInteger(count)
          ? "updateCount"
          : "update";
        let liquibaseActionParams: Array<string>;

        // set liquibaseActionParams based on data model
        switch (dataModel) {
          case config.ALP_DATA_MODELS.OMOP:
          case config.ALP_DATA_MODELS.OMOP5_4:
          case config.ALP_DATA_MODELS.CUSTOM_OMOP_MS:
          case config.ALP_DATA_MODELS.CUSTOM_OMOP_MS_PHI:
            liquibaseActionParams = Number.isInteger(count)
              ? [`--count=${count}`, `-DVOCAB_SCHEMA=${vocabSchema}`]
              : [`-DVOCAB_SCHEMA=${vocabSchema}`];
            break;
          default:
            liquibaseActionParams = Number.isInteger(count)
              ? [`--count=${count}`]
              : [];
            break;
        }

        let liquibase = new Liquibase(
          config.getMigrationToolConfig(
            this.dialect,
            tenant,
            schema,
            dataModel,
            changelogFilepath,
            classpath
          )
        );

        if (liquibase) {
          liquibase
            .run(liquibaseAction, liquibaseActionParams)
            .then(() => {
              const response = utils.createMultiLogs(
                `Successfully created ${schema} schema with ${dataModel} data model`,
                {
                  tenant,
                  schema,
                }
              );
              callback(null, response);
            })
            .catch((err: Error) => {
              this.logger.error(err);
              if (
                process.env
                  .ROLLBACK_SCHEMA_CREATION_FOR_LIQUIBASE_SCRIPT_FAILURE ===
                "TRUE"
              ) {
                this.dbDao.rollbackSchema(err, schema, dbConnection, callback);
              } else {
                callback(err);
              }
            });
        }
      },
      (callback: any) => {
        this.dbDao.enableAuditing(
          tenant,
          schema,
          tenantConfig,
          dbConnection,
          callback
        );
      },
      (callback: any) => {
        this.dbDao.createSystemAuditPolicy(
          tenant,
          schema,
          tenantConfig,
          dbConnection,
          callback
        );
      },
      (callback: any) => {
        this.dbDao.createSchemaAuditPolicy(
          tenant,
          schema,
          tenantConfig,
          dbConnection,
          callback
        );
      },
      // (callback: any) => {
      //   dbConnection.setAutoCommitToFalse(callback);
      // },
      async (callback: any) => {
        try {
          const ifReadRoleExists = await this.userDao.checkIfRoleExist(
            dbConnection,
            `${schema}_READ_ROLE`
          );
          if (!ifReadRoleExists) {
            const message = await this.userDao.createSchemaReadRole(
              dbConnection,
              schema,
              `${schema}_READ_ROLE`
            );
            return message;
          } else {
            return `${schema}_READ_ROLE role Exists Already`;
          }
        } catch (err) {
          callback(err);
        }
      },
      async (callback: any) => {
        try {
          const ifReadUserExists = await this.userDao.checkIfUserExist(
            dbConnection,
            tenantConfig[this.tenantConfigKeys.readUser]
          );
          if (!ifReadUserExists) {
            const message = await this.userDao.createUser(
              dbConnection,
              tenantConfig[this.tenantConfigKeys.readUser],
              tenantConfig[this.tenantConfigKeys.readPassword]
            );
            return message;
          } else {
            return `${
              tenantConfig[this.tenantConfigKeys.readUser]
            } User Exists Already`;
          }
        } catch (err) {
          callback(err);
        }
      },
      async (callback: any) => {
        try {
          const ifReadRoleExists = await this.userDao.checkIfRoleExist(
            dbConnection,
            this.properties[this.tenantConfigKeys.readRole]
          );
          if (!ifReadRoleExists) {
            const message = await this.userDao.createAndAssignRole(
              dbConnection,
              tenantConfig[this.tenantConfigKeys.readUser],
              this.properties[this.tenantConfigKeys.readRole]
            );
            return message;
          } else {
            return `${
              this.properties[this.tenantConfigKeys.readRole]
            } role Exists Already`;
          }
        } catch (err) {
          callback(err);
        }
      },
      async (callback: any) => {
        try {
          const message = await this.userDao.grantReadPrivileges(
            dbConnection,
            schema,
            this.properties[this.tenantConfigKeys.readRole]
          );
          return message;
        } catch (err) {
          callback(err);
        }
      },
      // Grant write cohort and cohort_definition table privileges to read role
      async (callback: any) => {
        try {
          const message = await this.userDao.grantCohortWritePrivileges(
            dbConnection,
            schema,
            this.properties[this.tenantConfigKeys.readRole]
          );
          return message;
        } catch (err) {
          callback(err);
        }
      },
      async (callback: any) => {
        try {
          const cdmVersion: string = config.getCDMVersion(dataModel);

          // only insert if current datamodel is tagged to cdmversion
          if (cdmVersion !== "" && !count) {
            this.logger.info(`Inserting cdm version for ${schema}`);
            await this.dbDao.insertCDMVersion(dbConnection, schema, cdmVersion);
            return `inserted cdmversion for ${dataModel}`;
          } else {
            return `datamodel ${dataModel} does not require cdmversion insert`;
          }
        } catch (err) {
          callback(err);
        }
      },
      // (callback: any) => {
      //   dbConnection.commit(callback);
      // },
    ];
  };

  createSnapshotCDMSchema = (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const targetSchema = req.params.schema;
    const sourceSchema = req.query.sourceschema as string;
    const dataModel = req.params.dataModel;
    const tenant = req.params.tenant;
    const snapshotCopyConfig = req.body.snapshotCopyConfig;
    const tenantConfig = this.tenantConfigs[tenant];
    const changelogFilepath = req.body.customChangelogFilepath;
    const classpath = req.body.customClasspath;

    this.dbDao.getDBConnectionByTenant(
      tenant,
      req,
      res,
      (err: Error, dbConnection: ConnectionInterface) => {
        if (err) {
          this.logger.error(`Error unable to get DB Connection!\n${err.stack}`);
          return next(err);
        }

        this.dbDao.checkIfSchemaExist(
          sourceSchema,
          dbConnection,
          (err: Error, sourceSchemaExist: boolean) => {
            if (err) {
              return next(err);
            } else if (sourceSchemaExist) {
              const tasks = this.createSchemaTasks(
                res,
                dataModel,
                targetSchema,
                { tenant, tenantConfig },
                NaN,
                dbConnection,
                this.properties["omop_vocab_schema"][0],
                changelogFilepath,
                classpath
              );
              async.series(tasks, (err, results: any) => {
                if (err) {
                  this.logger.error(err);
                  const httpResponse = {
                    message: "Schema creation failed!",
                    successfulSchemas: [],
                    failedSchemas: [targetSchema],
                    errorOccurred: true,
                  };
                  const error = { message: JSON.stringify(httpResponse) };
                  next(error);
                } else {
                  // Copy data from source schema to target schema
                  this.dbDao
                    .saveSnapshotToDb(
                      dbConnection,
                      sourceSchema,
                      targetSchema,
                      snapshotCopyConfig
                    )

                    .then(() => {
                      const httpResponse = {
                        message: "Schema snapshot successfully created!",
                        successfulSchemas: [targetSchema],
                        failedSchemas: [],
                        errorOccurred: false,
                      };
                      const response = utils.createMultiLogs(
                        `New ${targetSchema} schema created & loaded successfully`,
                        {
                          schema: targetSchema,
                          op: `${targetSchema} schema created and loaded with configuration ${JSON.stringify(
                            snapshotCopyConfig
                          )}`,
                        }
                      );
                      utils.printLogs([response]);
                      res.json(httpResponse);
                    })
                    .catch((err: Error) => {
                      this.logger.error(err);
                      const httpResponse = {
                        message:
                          "Schema creation successful, but failed to load data!",
                        successfulSchemas: [],
                        failedSchemas: [targetSchema],
                        errorOccurred: true,
                      };
                      res.status(500).json(httpResponse);
                    });
                }
              });
            } else {
              this.logger.error(
                "Create snapshot failure. Source schema not found."
              );
              const httpResponse = {
                message: "Create snapshot failure. Source schema not found.",
                successfulSchemas: [],
                failedSchemas: [sourceSchema],
                errorOccurred: true,
              };
              res.status(500).json(httpResponse);
            }
          }
        );
      }
    );
  };

  createCDMParquetSnapshot = (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const destSchema = req.params.schema;
    const tenant = req.params.tenant;
    const tenantConfig = this.tenantConfigs[tenant];
    const snapshotCopyConfig = req.body.snapshotCopyConfig;
    const sourceSchema = req.query.sourceschema as string;

    this.dbDao.getDBConnectionByTenant(
      tenant,
      req,
      res,
      (err: Error, dbConnection: ConnectionInterface) => {
        if (err) {
          this.logger.error(`Error unable to get DB Connection!\n${err.stack}`);
          return next(err);
        }

        this.dbDao.checkIfSchemaExist(
          sourceSchema,
          dbConnection,
          (err: Error, sourceSchemaExist: boolean) => {
            if (err) {
              return next(err);
            } else if (sourceSchemaExist) {
              this.dbDao
                .retrieveSchemaSnapshot(
                  dbConnection,
                  sourceSchema,
                  destSchema,
                  snapshotCopyConfig
                )
                .then(function (value: any) {
                  const httpResponse = {
                    message: "Parquet uploaded",
                    successful: value[0],
                    failed: value[1],
                  };
                  return res.status(200).json(httpResponse);
                })
                .catch((err: Error) => {
                  this.logger.error(err);
                  const httpResponse = {
                    message: "Error! Parquet cannot be uploaded",
                  };
                  res.status(500).json(httpResponse);
                });
            } else {
              this.logger.error(
                "Create snapshot failure. Source schema not found."
              );
              const httpResponse = {
                message: "Create snapshot failure. Source schema not found.",
                successfulSchemas: [],
                failedSchemas: [sourceSchema],
                errorOccurred: true,
              };
              res.status(500).json(httpResponse);
            }
          }
        );
      }
    );
  };

  createUpdateAttributesFlowRun = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const datasetSchemaMapping = req.body.datasetListFromPortal;
    const portalToken = req.body.token;
    const versionInfoResponse = req.body.versionInfo;

    try {
      this.logger.info(`Creating flow run for update-dataset-attributes-flow`);

      const prefectFlowRun =
        await new DataflowMgmtAPI().createUpdateAttributesFlowRun(
          versionInfoResponse,
          portalToken,
          datasetSchemaMapping
        );

      let response = prefectFlowRun.body;
      res.json(response);
    } catch (err: any) {
      this.logger.error(
        `Error creating flow run for update-dataset-attributes-flow`
      );
      return next(err);
    }
  };

  createCDMSchema = (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const tenant = req.params.tenant;
    const schema = req.params.schema;
    const dataModel = req.params.dataModel;
    const cleansedSchemaOption = req.body.cleansedSchemaOption;
    const count = Number(req.params.count);
    const tenantConfig = this.tenantConfigs[tenant];
    const cleansedSchema = this.getCleansedSchemaName(schema);
    const changelogFilepath = req.body.customChangelogFilepath;
    const classpath = req.body.customClasspath;
    const vocabSchema = req.body.vocabSchema;

    this.dbDao.getDBConnectionByTenant(
      tenant,
      req,
      res,
      (err: Error, dbConnection: ConnectionInterface) => {
        if (err) {
          this.logger.error(`Error unable to get DB Connection!\n${err.stack}`);
          return next(err);
        }

        const createSchemaTasks = this.createSchemaTasks(
          res,
          dataModel,
          schema,
          { tenantConfig, tenant },
          count,
          dbConnection,
          vocabSchema,
          changelogFilepath,
          classpath
        );

        const createCleansedSchemaTasks = this.createCleansedSchemaTasks(
          tenant,
          dataModel,
          cleansedSchema,
          count,
          dbConnection,
          vocabSchema,
          changelogFilepath,
          classpath
        );

        if (cleansedSchemaOption == true) {
          async.series(
            createSchemaTasks,
            // optional callback
            (err, results: any) => {
              if (err) {
                this.logger.error(
                  err.message ? err.message : JSON.stringify(err)
                );
                const httpResponse = {
                  message: "Schema creation failed! Error: ",
                  successfulSchemas: [],
                  failedSchemas: [schema],
                  errorOccurred: true,
                };
                const error = { message: JSON.stringify(httpResponse) };
                next(error);
              } else {
                utils.printLogs(results);
                //Create Cleansed schema
                async.series(
                  createCleansedSchemaTasks,
                  // optional callback
                  (err, results: any) => {
                    if (err) {
                      this.logger.error(
                        err.message ? err.message : JSON.stringify(err)
                      );
                      const httpResponse = {
                        message: "Cleansed Schema creation failed!",
                        successfulSchemas: [],
                        failedSchemas: [cleansedSchema],
                        errorOccurred: true,
                      };
                      const error = { message: JSON.stringify(httpResponse) };
                      next(error);
                    } else {
                      utils.printLogs(results);
                      const httpResponse = {
                        message:
                          "Schema & Cleansed Schema successfully created and privileges assigned!",
                        successfulSchemas: [schema, cleansedSchema],
                        failedSchemas: [],
                        errorOccurred: false,
                      };
                      this.logger.info(JSON.stringify(httpResponse));
                      res.json(httpResponse);
                    }
                  }
                );
              }
              // results is now equal to ['one', 'two']
            }
          );
        } else {
          async.series(
            createSchemaTasks,
            // optional callback
            (err, results: any) => {
              if (err) {
                this.logger.error(
                  err.message ? err.message : JSON.stringify(err)
                );
                const httpResponse = {
                  message: "Schema creation failed! Error: ",
                  successfulSchemas: [],
                  failedSchemas: [schema],
                  errorOccurred: true,
                };
                const error = { message: JSON.stringify(httpResponse) };
                next(error);
              } else {
                utils.printLogs(results);
                const httpResponse = {
                  message:
                    "Schema successfully created and privileges assigned!",
                  successfulSchemas: [schema],
                  failedSchemas: [],
                  errorOccurred: false,
                };
                this.logger.info(JSON.stringify(httpResponse));
                res.json(httpResponse);
              }
              // results is now equal to ['one', 'two']
            }
          );
        }
      }
    );
  };

  createStagingAreaSchemaTasks = (
    res: express.Response,
    stagingArea: string,
    schema: string,
    { tenant, tenantConfig }: { tenant: string; tenantConfig: any },
    count: number,
    dbConnection: ConnectionInterface
  ) => {
    let dbName = this.tenantConfigs[tenant].databaseName;
    let SCHEMA_READ_ROLE = `${dbName.toUpperCase()}_${schema.toUpperCase()}_READ_ROLE`;
    let SCHEMA_ADMIN_ROLE = `${dbName.toUpperCase()}_${schema.toUpperCase()}_ADMIN_ROLE`;
    return [
      (callback: any) => {
        this.dbDao.createSchema(tenant, schema, dbConnection, callback);
      },
      (callback: any) => {
        let liquibaseAction: String = "status";
        let liquibaseActionParams: Array<string> = [];
        let liquibase;

        switch (stagingArea) {
          case config.ALP_STAGING_AREAS.FHIR_DATA:
            liquibaseAction = Number.isInteger(count)
              ? "updateCount"
              : "update";
            liquibaseActionParams = Number.isInteger(count)
              ? [`--count=${count}`]
              : [];
            liquibase = new Liquibase(
              config.getMigrationToolConfig(
                this.dialect,
                tenant,
                schema,
                stagingArea
              )
            );
            break;
        }
        if (liquibase) {
          liquibase
            .run(liquibaseAction, liquibaseActionParams)
            .then(() => {
              const response = utils.createMultiLogs(
                `${stagingArea} Schema ${schema} populated Successfully`,
                {
                  tenant,
                  schema,
                }
              );
              callback(null, response);
            })
            .catch((err: Error) => {
              this.logger.error(err);
              if (
                process.env
                  .ROLLBACK_SCHEMA_CREATION_FOR_LIQUIBASE_SCRIPT_FAILURE ===
                "TRUE"
              ) {
                this.dbDao.rollbackSchema(err, schema, dbConnection, callback);
              } else {
                callback(err);
              }
            });
        }
      },
      // Create staging area schema read role
      async (callback: any) => {
        try {
          const ifReadRoleExists = await this.userDao.checkIfRoleExist(
            dbConnection,
            SCHEMA_READ_ROLE
          );
          if (!ifReadRoleExists) {
            const message = await this.userDao.createRole(
              dbConnection,
              SCHEMA_READ_ROLE
            );
            return message;
          } else {
            return `${SCHEMA_READ_ROLE} role Exists Already`;
          }
        } catch (err) {
          callback(err);
        }
      },
      async (callback: any) => {
        try {
          const message = await this.userDao.grantReadPrivileges(
            dbConnection,
            schema,
            SCHEMA_READ_ROLE
          );
          return message;
        } catch (err) {
          callback(err);
        }
      },
      // Assign read role to database read user
      async (callback: any) => {
        try {
          const ifDatabaseReadUserExists = await this.userDao.checkIfUserExist(
            dbConnection,
            tenantConfig[this.tenantConfigKeys.readUser]
          );
          if (ifDatabaseReadUserExists) {
            const message = await this.userDao.assignRole(
              dbConnection,
              tenantConfig[this.tenantConfigKeys.readUser],
              SCHEMA_READ_ROLE
            );
            return message;
          } else {
            return `Unable to assign ROLE:${SCHEMA_READ_ROLE} to USER:${
              tenantConfig[this.tenantConfigKeys.readUser]
            } as USER does not exist`;
          }
        } catch (err) {
          callback(err);
        }
      },
      // Create staging area schema admin role
      async (callback: any) => {
        try {
          const ifWriteRoleExists = await this.userDao.checkIfRoleExist(
            dbConnection,
            SCHEMA_ADMIN_ROLE
          );
          if (!ifWriteRoleExists) {
            const message = await this.userDao.createRole(
              dbConnection,
              SCHEMA_ADMIN_ROLE
            );
            return message;
          } else {
            return `${SCHEMA_ADMIN_ROLE} role Exists Already`;
          }
        } catch (err) {
          callback(err);
        }
      },
      async (callback: any) => {
        try {
          const message = await this.userDao.grantAdminPrivileges(
            dbConnection,
            schema,
            SCHEMA_ADMIN_ROLE
          );
          return message;
        } catch (err) {
          callback(err);
        }
      },
      // Assign admin role to database manage user
      async (callback: any) => {
        try {
          const ifDatabaseAdminUserExists = await this.userDao.checkIfUserExist(
            dbConnection,
            tenantConfig["user"]
          );
          if (ifDatabaseAdminUserExists) {
            const message = await this.userDao.assignRole(
              dbConnection,
              tenantConfig["user"],
              SCHEMA_ADMIN_ROLE
            );
            return message;
          } else {
            return `Unable to assign ROLE:${SCHEMA_ADMIN_ROLE} to USER:${tenantConfig["user"]} as USER does not exist`;
          }
        } catch (err) {
          callback(err);
        }
      },
      (callback: any) => {
        dbConnection.commit((err: any) => {
          if (err) return callback(err);
          callback(null, "Committed Successfully");
        });
      },
    ];
  };

  createStagingAreaSchema = (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const tenant = req.params.tenant;
    const schema = req.params.schema;
    const stagingArea = req.params.stagingArea;
    const count = Number(req.params.count);
    const tenantConfig = this.tenantConfigs[tenant];
    this.dbDao.getDBConnectionByTenant(
      tenant,
      req,
      res,
      (err: Error, dbConnection: ConnectionInterface) => {
        if (err) {
          this.logger.error(`Error unable to get DB Connection!\n${err.stack}`);
          return next(err);
        }
        const createStagingAreaSchemaTasks = this.createStagingAreaSchemaTasks(
          res,
          stagingArea,
          schema,
          { tenant, tenantConfig },
          count,
          dbConnection
        );

        async.series(createStagingAreaSchemaTasks, (err, results) => {
          if (err) {
            this.logger.error(err.message ? err.message : JSON.stringify(err));
            const httpResponse = {
              message: "Schema creation failed! Error: ",
              successfulSchemas: [],
              failedSchemas: [schema],
              errorOccurred: true,
            };
            const error = { message: JSON.stringify(httpResponse) };
            next(error);
          } else {
            utils.printLogs(results);
            const httpResponse = {
              message: "Schema successfully created and privileges assigned!",
              successfulSchemas: [schema],
              failedSchemas: [],
              errorOccurred: false,
            };
            this.logger.info(JSON.stringify(httpResponse));
            res.json(httpResponse);
          }
        });
      }
    );
  };

  updateSchemas = (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const tenant = req.params.tenant;
    const schemas =
      typeof req.query.schema === "string"
        ? [req.query.schema]
        : req.query.schema;
    const dataModel = req.params.dataModel;
    const customChangelogFilepath = req.body.customChangelogFilepath
      ? req.body.customChangelogFilepath
      : "";
    const customClasspath = req.body.customClasspath
      ? req.body.customClasspath
      : "";
    const vocabSchema = req.body.vocabSchema;
    this.logger.log(
      "info",
      `[Tenant: ${tenant}] Schemas to be updated ${schemas}`
    );

    this.dbDao.getDBConnectionByTenant(
      tenant,
      req,
      res,
      (err: Error, dbConnection: ConnectionInterface) => {
        if (err) {
          this.logger.error(`Error unable to get DB Connection!\n${err.stack}`);
          return next(err);
        }
        this.runUpdateSchemasTasks(
          <string>tenant,
          <string[]>schemas,
          dataModel,
          dbConnection,
          res,
          next,
          vocabSchema,
          customChangelogFilepath,
          customClasspath
        );
      }
    );
  };

  updateStagingAreaSchemas = (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const tenant = req.params.tenant;
    const schemas =
      typeof req.query.schema === "string"
        ? [req.query.schema]
        : req.query.schema;
    const stagingArea = req.params.stagingArea;
    this.logger.log(
      "info",
      `[Tenant: ${tenant}] Schemas to be updated ${schemas}`
    );

    const tasks = this.getUpdateStagingSchemasTasks(
      <string>tenant,
      <string[]>schemas,
      stagingArea
    );

    utils.runAsyncParallel(tasks, (err: Error, updateSchemasResults: any) => {
      utils.sendResponseWithResults(
        utils.prepareResponseForAsyncParallel(updateSchemasResults),
        "All schemas updated successfully!",
        "Update for certain schemas Failed!",
        res,
        next
      );
    });
  };

  getUpdateStagingSchemasTasks = (
    tenant: string,
    schemas: string[],
    stagingArea: string
  ) => {
    return schemas.map((schema) => {
      return (callback: any) => {
        let liquibaseAction;
        let liquibaseActionParams;
        let liquibase;

        switch (stagingArea) {
          case config.ALP_STAGING_AREAS.FHIR_DATA:
            liquibaseAction = "update";
            liquibaseActionParams = [];
            liquibase = new Liquibase(
              config.getMigrationToolConfig(
                this.dialect,
                tenant,
                schema,
                stagingArea
              )
            );
            break;
        }
        if (liquibase) {
          liquibase
            .run(liquibaseAction, liquibaseActionParams)
            .then(() => {
              utils
                .createMultiLogs(
                  `${stagingArea} Schema ${schema} updated Successfully`,
                  {
                    tenant,
                    schema,
                    op: "update schema liquibase",
                  }
                )
                .print();
              callback(null, schema);
            })
            .catch((err: Error) => {
              utils
                .createMultiLogs(
                  `${schema} Schema Update Failed`,
                  {
                    tenant,
                    schema,
                    op: "update schema liquibase",
                  },
                  true
                )
                .print();
              err.message = schema;
              callback(err);
            });
        }
      };
    });
  };

  runUpdateSchemasTasks = (
    tenant: string,
    schemas: string[],
    dataModel: string,
    dbConnection: ConnectionInterface,
    res: express.Response,
    next: express.NextFunction,
    vocabSchema: string,
    customChangelogFilepath: string,
    customClasspath: string
  ) => {
    let tasks = this.createUpdateSchemasTasks(
      tenant,
      schemas,
      dataModel,
      dbConnection,
      vocabSchema,
      customChangelogFilepath,
      customClasspath
    );
    utils.runAsyncParallel(tasks, (err: Error, updateSchemasResults: any) => {
      utils.sendResponseWithResults(
        utils.prepareResponseForAsyncParallel(updateSchemasResults),
        "All schemas updated successfully!",
        "Update for certain schemas Failed!",
        res,
        next
      );
    });
  };

  getCustomSchemaName = (cdmSchema: string) => {
    if (cdmSchema.match(this.schemaNameRegExp) === null) {
      throw new Error("Schema name is invalid");
    }
    if (this.dialect === config.DB.HANA) {
      // Append uppercase _CUSTOM to cdmschema name for HANA
      cdmSchema = cdmSchema.concat("_CUSTOM");
    } else {
      // Append lowercase _custom to cdmschema name for POSTGRES
      cdmSchema = cdmSchema.concat("_custom");
    }
    return cdmSchema;
  };

  getCleansedSchemaName = (cdmSchema: string) => {
    if (cdmSchema.match(this.schemaNameRegExp) === null) {
      throw new Error("Schema name is invalid");
    }
    if (this.dialect === config.DB.HANA) {
      // Append uppercase _CLEANSED to cdmschema name for HANA
      cdmSchema = cdmSchema.concat("_CLEANSED");
    } else {
      // Append lowercase _cleansed to cdmschema name for POSTGRES
      cdmSchema = cdmSchema.concat("_cleansed");
    }
    return cdmSchema;
  };

  createUpdateSchemasTasks = (
    tenant: string,
    schemas: string[],
    dataModel: string,
    dbConnection: ConnectionInterface,
    vocabSchema: string,
    customChangelogFilepath: string | undefined,
    customClasspath: string | undefined
  ) => {
    const tasks = schemas.map((schema) => {
      return (callback: any) => {
        let liquibaseAction: String = "update";
        let liquibaseActionParams: Array<string> = [];

        // add vocab schema to liquibase action params for omop data-models
        switch (dataModel) {
          case config.ALP_DATA_MODELS.OMOP:
          case config.ALP_DATA_MODELS.OMOP5_4:
          case config.ALP_DATA_MODELS.CUSTOM_OMOP_MS:
          case config.ALP_DATA_MODELS.CUSTOM_OMOP_MS_PHI:
            liquibaseActionParams.push(`-DVOCAB_SCHEMA=${vocabSchema}`);
            this.logger.log("info", `${dataModel} changeset selected`);
            break;
          default:
            this.logger.log("info", `${dataModel} changeset selected`);
            break;
        }
        const liquibase = new Liquibase(
          config.getMigrationToolConfig(
            this.dialect,
            tenant,
            schema,
            dataModel,
            customChangelogFilepath,
            customClasspath
          )
        );

        liquibase
          .run(liquibaseAction, liquibaseActionParams)
          .then(() => {
            utils
              .createMultiLogs(`${schema} Schema Successfully Updated`, {
                tenant,
                schema,
                op: "update schema liquibase",
              })
              .print();
          })
          .catch((err: Error) => {
            utils
              .createMultiLogs(
                `${schema} Schema Update Failed`,
                {
                  tenant,
                  schema,
                  op: "update schema liquibase",
                },
                true
              )
              .print();
            err.message = schema;
            callback(err);
          })
          .then(async () => {
            // update cdmversion
            const cdmVersion: string = config.getCDMVersion(dataModel);
            if (cdmVersion !== "") {
              this.logger.info(`updating ${cdmVersion} for schema ${schema}`);
              await this.dbDao.updateCDMVersion(
                dbConnection,
                schema,
                cdmVersion
              );
            } else {
              utils
                .createMultiLogs(
                  `datamodel ${dataModel} does not require cdmversion update`,
                  {
                    tenant,
                    schema,
                    op: "update cdm source",
                  }
                )
                .print();
            }
            callback(null, schema);
          })
          .catch((err: Error) => {
            utils
              .createMultiLogs(
                `${schema} Schema successfully updated but update cdm source Failed`,
                {
                  tenant,
                  schema,
                  op: "update cdm source",
                },
                true
              )
              .print();
            err.message = schema;
            callback(err);
          });
      };
    });
    return tasks;
  };

  createCleansedSchemaTasks = (
    tenant: string,
    dataModel: string,
    cleansedSchema: string,
    count: number,
    dbConnection: ConnectionInterface,
    vocabSchema: string,
    changelogFilepath: string | undefined,
    classpath: string | undefined
  ) => {
    const tenantConfig = this.tenantConfigs[tenant];

    return [
      (callback: any) => {
        this.dbDao.createSchema(tenant, cleansedSchema, dbConnection, callback);
      },
      (callback: any) => {
        let liquibaseAction: String = Number.isInteger(count)
          ? "updateCount"
          : "update";
        let liquibaseActionParams: Array<string>;

        // set liquibaseActionParams based on data model
        switch (dataModel) {
          case config.ALP_DATA_MODELS.OMOP:
          case config.ALP_DATA_MODELS.OMOP5_4:
          case config.ALP_DATA_MODELS.CUSTOM_OMOP_MS:
          case config.ALP_DATA_MODELS.CUSTOM_OMOP_MS_PHI:
            liquibaseActionParams = Number.isInteger(count)
              ? [`--count=${count}`, `-DVOCAB_SCHEMA=${vocabSchema}`]
              : [`-DVOCAB_SCHEMA=${vocabSchema}`];
            break;
          default:
            liquibaseActionParams = Number.isInteger(count)
              ? [`--count=${count}`]
              : [];
            break;
        }

        let liquibase = new Liquibase(
          config.getMigrationToolConfig(
            this.dialect,
            tenant,
            cleansedSchema,
            dataModel,
            changelogFilepath,
            classpath
          )
        );

        if (liquibase) {
          liquibase
            .run(liquibaseAction, liquibaseActionParams)
            .then(() => {
              const response = utils.createMultiLogs(
                `Successfully created ${cleansedSchema} schema with ${dataModel} data model`,
                {
                  tenant,
                  cleansedSchema,
                }
              );
              callback(null, response);
            })
            .catch((err: Error) => {
              this.logger.error(err);
              if (
                process.env
                  .ROLLBACK_SCHEMA_CREATION_FOR_LIQUIBASE_SCRIPT_FAILURE ===
                "TRUE"
              ) {
                this.dbDao.rollbackSchema(
                  err,
                  cleansedSchema,
                  dbConnection,
                  callback
                );
              } else {
                callback(err);
              }
            });
        }
      },
      (callback: any) => {
        this.dbDao.createSchemaAuditPolicy(
          tenant,
          cleansedSchema,
          tenantConfig,
          dbConnection,
          callback
        );
      },
      async (callback: any) => {
        try {
          const message = await this.userDao.grantReadPrivileges(
            dbConnection,
            cleansedSchema,
            this.properties[this.tenantConfigKeys.readRole]
          );
          return message;
        } catch (err) {
          callback(err);
        }
      },
      // Grant write cohort and cohort_definition table privileges to read role
      async (callback: any) => {
        try {
          const message = await this.userDao.grantCohortWritePrivileges(
            dbConnection,
            cleansedSchema,
            this.properties[this.tenantConfigKeys.readRole]
          );
          return message;
        } catch (err) {
          callback(err);
        }
      },
      (callback: any) => {
        utils
          .createMultiLogs(`${cleansedSchema} Schema Successfully Updated`, {
            tenant,
            cleansedSchema,
            op: "create cleansed schema",
          })
          .print();
        callback(null, cleansedSchema);
      },
    ];
  };

  rollbackCount = (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const tenant = req.params.tenant;
    const dataModel = req.params.dataModel;
    const schemas =
      typeof req.query.schema === "string"
        ? [req.query.schema]
        : req.query.schema;
    const changelogFilepath = req.body.customChangelogFilepath;
    const classpath = req.body.customClasspath;

    this.dbDao.rollbackCount(
      <string>tenant,
      <string>dataModel,
      <string[]>schemas,
      Number(req.params.rollbackCount),
      changelogFilepath,
      classpath,
      utils.asyncRouterCallback(
        `All schemas rollbacked successfully for count ${req.params.rollbackCount}!`,
        "Rollback for certain schemas Failed!",
        res,
        next
      )
    );
  };

  rollbackTag = (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const tenant = req.params.tenant;
    const dataModel = req.params.dataModel;
    const schemas =
      typeof req.query.schema === "string"
        ? [req.query.schema]
        : req.query.schema;
    const changelogFilepath = req.body.customChangelogFilepath;
    const classpath = req.body.customClasspath;
    this.dbDao.rollbackTag(
      <string>tenant,
      <string>dataModel,
      <string[]>schemas,
      req.params.rollbackTag,
      changelogFilepath,
      classpath,
      utils.asyncRouterCallback(
        `All schemas rollbacked successfully Until Tag ${req.params.rollbackTag}!`,
        "Rollback for certain schemas Failed!",
        res,
        next
      )
    );
  };

  getVersionInfoForSchemas = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const tenant = req.params.tenant;
    const datasetListFromPortal = req.body.datasetListFromPortal;
    const changelogFilepath = req.body.customChangelogFilepath;
    const classpath = req.body.customClasspath;

    let portalSchemaList: DataModelSchemaMappingType =
      datasetListFromPortal.map(
        ({
          schema_name: schemaName,
          data_model: dataModel,
          vocab_schema: vocabSchemaName,
          changelog_filepath: changelogFilepath,
        }) => ({
          schemaName,
          dataModel,
          vocabSchemaName,
          changelogFilepath,
        })
      );
    try {
      const dbConnection = await this.dbDao.getDBConnectionByTenantPromise(
        tenant,
        req,
        res
      );

      const results = await this.dbDao.getVersionInfoForSchemas(
        dbConnection,
        tenant,
        changelogFilepath,
        classpath,
        portalSchemaList
      );
      res.json(results);
    } catch (err: any) {
      return next(err);
    }
  };

  //only works for OMOP v5.4
  loadSynpuf1kData = (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const tenant = req.params.tenant;
    const schema = req.query.schema as string;
    const filePath = req.body.filePath ? req.body.filePath : "./db/synpuf1k";

    fs.readdir(filePath, (err, files) => {
      if (err) {
        return next({
          message: JSON.stringify({
            message: `Error loading synpuf1k data for schemas! Invalid directory.`,
            successfulSchemas: [],
            failedSchemas: [schema],
            errorOccurred: true,
          }),
        });
      }

      if (files.filter((file) => !file.includes(".csv")).length > 0) {
        return next({
          message: JSON.stringify({
            message: `Error loading synpuf1k data for schemas! Found non-csv files in data directory!`,
            successfulSchemas: [],
            failedSchemas: [schema],
            errorOccurred: true,
          }),
        });
      }

      this.dbDao.getDBConnectionByTenant(
        tenant,
        req,
        res,
        (err: Error, dbConnection: ConnectionInterface) => {
          if (err) {
            this.logger.error(
              `Error loading synpuf1k data for schemas!\n${err.stack}`
            );

            return next({
              message: JSON.stringify({
                message: `Error loading synpuf1k data for schemas!`,
                successfulSchemas: [],
                failedSchemas: [schema],
                errorOccurred: true,
              }),
            });
          }

          this.dbDao.importCsvFilesIntoSchema(
            dbConnection,
            schema,
            files.map((file) => `${filePath}/${file}`),
            (err: Error) => {
              if (err) {
                this.logger.error(
                  `Error loading synpuf1k data for schemas!\n${err.stack}`
                );
                return next({
                  message: JSON.stringify({
                    message: `Error loading synpuf1k data for schemas!`,
                    successfulSchemas: [],
                    failedSchemas: [schema],
                    errorOccurred: true,
                  }),
                });
              }

              this.logger.info("Synpuf1k Data import successful..");
              const httpResponse = {
                message: "Synpuf1k Data import successful!",
                successfulSchemas: [schema],
                failedSchemas: [],
                errorOccurred: false,
              };
              res.json(httpResponse);
            }
          );
        }
      );
    });
  };

  updateMaintenanceScript = (
    req: express.Request,
    res: express.Response,
    _next: express.NextFunction
  ) => {
    const tenant = req.params.tenant;
    const schema = req.params.schema;
    const liquibase = new Liquibase(
      config.getUpdateMaintenanceScriptConfig(tenant, schema)
    );

    liquibase
      .run("update")
      .then(() => {
        this.logger.info("Maintenance script updated successfully!");
        const httpResponse = {
          message: "Maintenance script updated successfully!",
          successfulSchemas: [schema],
          failedSchemas: [],
          errorOccurred: false,
        };
        this.logger.info(JSON.stringify(httpResponse));
        res.json(httpResponse);
      })
      .catch((err: Error) => {
        this.logger.error(err);
        const httpResponse = {
          message: "failed to update maintenance script!",
          successfulSchemas: [],
          failedSchemas: [schema],
          errorOccurred: true,
        };
        res.status(500).json(httpResponse);
      });
  };

  //Create Questionnaire Definition
  createQuestionnaireDefinition = (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const schema = req.params.schema;
    const tenant = req.params.tenant;
    const { definition } = req.body;

    this.dbDao.getDBConnectionByTenant(
      tenant,
      req,
      res,
      (err: Error, dbConnection: ConnectionInterface) => {
        if (err) {
          this.logger.error(`Error unable to get DB Connection!\n${err.stack}`);
          return next(err);
        }
        this.dbDao.createQuestionnaireDefinition(
          definition,
          schema,
          dbConnection,
          utils.asyncRouterCallback(
            "Questionnaire definition record has been create sucessfully!",
            "Failed to create a Questionnaire definition record!",
            res,
            next
          )
        );
      }
    );
  };

  getResponsesForQuestionnaire = (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const tenant = req.params.tenant;
    const schema = req.params.schema;

    const questionnaireId = req.params.questionnaire;

    this.dbDao.getDBConnectionByTenant(
      tenant,
      req,
      res,
      (err: Error, dbConnection: ConnectionInterface) => {
        if (err) {
          this.logger.error(
            `Error while getting version history for schemas!\n${err.stack}`
          );
          return next(err);
        }
        this.dbDao.getResponsedByQuestionnaireId(
          questionnaireId,
          schema,
          dbConnection,
          utils.asyncResponseWithCSVCallback(res, next)
        );
      }
    );
  };
}
