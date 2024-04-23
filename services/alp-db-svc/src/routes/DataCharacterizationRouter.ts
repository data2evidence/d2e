import express from "express";
import util from "util";
import { Liquibase } from "../utils/liquibase";
import * as config from "../utils/config";
import { registerRouterHandler, HTTP_METHOD } from "../utils/httpUtils";
import UserDAO from "../dao/UserDAO";
import DBDAO from "../dao/DBDAO";
import { param, query, body } from "express-validator";
import { ConnectionInterface } from "../utils/Connection";

export default class DataCharacterizationRouter {
  public router: express.Router = express.Router();
  private logger = config.getLogger();
  private properties = config.getProperties();
  private dbDao;
  private userDao;
  private dbObjectNameValidationRegExp = /^\w+$/;
  private dataCharacterizationSchemaNameRegExp =
    /^[\w]+(_DATA_CHARACTERIZATION_)(\d{13})$/i; // E.g {ANY_WORD}{_DATA_CHARACTERIZATION_}{EPOCH_MILLISECOND_TIMESTAMP}
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
          .matches(this.dataCharacterizationSchemaNameRegExp)
          .withMessage("DataCharacterization results schema name is invalid"),
        body("cdmSchema").notEmpty().withMessage("CDM Schema name is empty"),
        body("customChangelogFilepath").optional(),
        body("customClasspath").optional(),
        body("vocabSchema").custom((vocabSchema, { req }) => {
          return (
            config
              .getProperties()
              ["omop_vocab_schema"].concat(req.body?.cdmSchema)
              .indexOf(vocabSchema) > -1 //Because vocab schema could be a dataset cdm schema as well
          );
        }),
      ],
      [this.createDataCharacterizationResultsSchema]
    );

    registerRouterHandler(
      this.router,
      HTTP_METHOD.DELETE,
      "/database/:tenant/schema/:schema",
      [
        param("tenant")
          .isIn(config.getTenants(dialect))
          .notEmpty()
          .matches(this.dbObjectNameValidationRegExp)
          .withMessage("Tenant database name is invalid"),
        param("schema")
          .notEmpty()
          .matches(this.dataCharacterizationSchemaNameRegExp)
          .withMessage("DataCharacterization results schema name is invalid"),
        body("customChangelogFilepath").optional(),
        body("customClasspath").optional(),
      ],
      [this.dropDataCharacterizationResultsSchema]
    );
  }

  createDataCharacterizationResultsSchema = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const tenant = req.params.tenant;
    const schema = req.params.schema;
    const tenantConfig = this.tenantConfigs[tenant];
    const vocabSchema = config.handleCaseByDialect(
      req.params.dialect,
      req.body.vocabSchema
    );
    const pluginChangelogFilepath = req.body.customChangelogFilepath;
    const pluginClasspath = req.body.customClasspath;

    try {
      const dbConnection = await this.dbDao.getDBConnectionByTenantPromise(
        tenant,
        req,
        res
      );

      const result = await this.createDataCharacterizationResultsSchemaTasks(
        res,
        schema,
        { tenantConfig, tenant },
        dbConnection,
        vocabSchema,
        pluginChangelogFilepath,
        pluginClasspath
      );

      res.json(result);
    } catch (err: any) {
      next(err);
    }
  };

  createDataCharacterizationResultsSchemaTasks = (
    res: express.Response,
    schema: string,
    { tenant, tenantConfig }: { tenant: string; tenantConfig: any },
    dbConnection: ConnectionInterface,
    vocabSchema: string,
    pluginChangelogFilepath: string | undefined,
    pluginClasspath: string | undefined
  ) => {
    return new Promise(async (resolve, reject) => {
      // Create new schema
      try {
        const createSchemaPromise = util.promisify(this.dbDao.createSchema);
        await createSchemaPromise(tenant, schema, dbConnection);
        //
        // Check if these steps are needed
        // enableAuditing
        // createSystemAuditPolicy
        // createSchemaAuditPolicy
      } catch (err) {
        this.logger.error(
          `Failed to create dataCharacterization results schema: ${schema}, Error: ${err}`
        );
        reject(err);
        return;
      }

      try {
        let liquibaseAction: String = "update";
        let liquibaseActionParams: Array<string> = [];
        let liquibase;

        liquibase = new Liquibase(
          config.getMigrationToolConfig(
            this.dialect,
            tenant,
            schema,
            config.CDM.CHARACTERIZATION,
            pluginChangelogFilepath,
            pluginClasspath
          )
        );

        liquibaseActionParams.push(
          `-DDATA_CHARACTERIZATION_SCHEMA=${schema}`,
          `-DVOCAB_SCHEMA=${vocabSchema}`
        );

        await liquibase.run(liquibaseAction, liquibaseActionParams);
        this.logger.info(
          `Schema ${schema} populated with ${config.CDM.CHARACTERIZATION}`
        );
      } catch (err) {
        // Drop schema if liquibase migration has failed
        if (
          process.env.ROLLBACK_SCHEMA_CREATION_FOR_LIQUIBASE_SCRIPT_FAILURE ===
          "TRUE"
        ) {
          try {
            const rollbackSchemaPromise = util.promisify(
              this.dbDao.rollbackSchema
            );
            await rollbackSchemaPromise(err, schema, dbConnection);
          } catch (rollbackSchemaErr) {
            reject(rollbackSchemaErr);
            return;
          }
        } else {
          // Return errors other than failed migration script
          this.logger.error("Failed to create characterization tables");
          reject(err);
          return;
        }
      }
      // Grant privileges for newly created schema for roles
      try {
        await this.userDao.grantReadPrivileges(
          dbConnection,
          schema,
          this.properties[this.tenantConfigKeys.readRole]
        );
      } catch (err) {
        this.logger.error(
          `Failed to grant privileges for dataCharacterization results schema: ${schema}, Error: ${err}`
        );
        reject(err);
        return;
      }
      resolve({
        message: `DataCharacterization results schema successfully created and privileges assigned!`,
        successfulSchema: schema,
      });
    });
  };

  dropDataCharacterizationResultsSchema = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const tenant = req.params.tenant;
    const schema = req.params.schema;

    try {
      const dbConnection = await this.dbDao.getDBConnectionByTenantPromise(
        tenant,
        req,
        res
      );

      const result = await this.dbDao.dropSchema(dbConnection, schema);

      res.json(result);
    } catch (err: any) {
      res
        .status(500)
        .json("Failed to drop data characterization schema, " + err);
    }
  };
}
