import { env, envVarUtils } from "./configs";
import * as xsenv from "@sap/xsenv";
import {
  getUser,
  Logger,
  EnvVarUtils,
  DBConnectionUtil as dbConnectionUtil,
  healthCheckMiddleware,
  Constants,
  User,
  Connection,
  utils,
} from "@alp/alp-base-utils";
import express from "express";
import { SettingsFacade } from "./qe/settings/SettingsFacade";
import { ConfigFacade } from "./cfg-utils/ConfigFacade";
import { ConfigFacade as CdwConfigFacade } from "./qe/config/ConfigFacade";
import { CDWServicesFacade } from "./qe/config/CDWServicesFacade";
import { FfhQeConfig, MESSAGES } from "./qe/config/config";
import { AssignmentProxy } from "./AssignmentProxy";
import { Settings } from "./qe/settings/Settings";
import { ICDWRequest } from "./types";
import { getDuckdbDBConnection, getFileName } from "./utils/DuckdbConnection";

const log = Logger.CreateLogger("cdw-log");

const noCache = (req, res, next) => {
  res.header("Cache-Control", "private, no-cache, no-store, must-revalidate");
  res.header("Expires", "-1");
  res.header("Pragma", "no-cache");
  next();
};

const main = () => {
  const app = express();
  app.use("/check-liveness", healthCheckMiddleware);
  const mountPath = env.NODE_ENV === "production" ? env.ENV_MOUNT_PATH : "../../";
  const envFile = `${mountPath}default-env.json`;
  xsenv.loadEnv(envVarUtils.getEnvFile(envFile));

  const port = env.PORT || 41114;

  //Determine if this application is being run for Development / testing / Production
  let analyticsCredential;
  let configCredentials;
  let isTestEnvironment = false;

  if (envVarUtils.isTestEnv()) {
    // reset configDB.host to point to analyticsDB.host, schema name will be the supplied TESTSCHEMA name
    analyticsCredential = xsenv.cfServiceCredentials({ tag: "httptest" });
    configCredentials = xsenv.cfServiceCredentials({ tag: "httptest" });
    isTestEnvironment = true;
    // set default cdw config path
    log.info("TESTSCHEMA :" + configCredentials.schema);
  } else {
    let cdwService = xsenv.filterServices({ tag: "cdw" }).map(db => db.credentials);
    if(env.USE_DUCKDB !== "true"){
      cdwService = cdwService.filter((db) => db.dialect == 'hana')
      analyticsCredential = cdwService[0];
    }
    configCredentials = JSON.parse(env.CONFIG_CONNECTION);
  }

  EnvVarUtils.loadDevSettings();

  log.info(`CDW audit threshold: ${EnvVarUtils.getCDWAuditThreshold()}`);

  initRoutes(app, configCredentials, analyticsCredential, isTestEnvironment);

  // global error handler
  app.use((err, req, res, next) => {
    if (err) {
      log.error(err);
    }
    next(err);
  });
  const server = app.listen(port);
  log.info(
    `🚀 CDW Config Application started successfully!. Server listening on port ${port}`
  );
};

const handleStartupError = (err) => {
  log.error(err);
  process.exit(1);
};

const getConnections = async ({
  analyticsCredentials,
  configCredentials,
  userObj,
}): Promise<{
  analyticsConnection: Connection.ConnectionInterface;
  configConnection: Connection.ConnectionInterface;
}> => {
  let analyticsConnection;
  if (env.USE_DUCKDB === "true") {
    log.info("Use Duckdb")
    // Use duckdb as analyticsConnection if USE_DUCKDB flag is set to true
    const { duckdbSchemaFileName, vocabSchemaFileName } = await getFileName(env.DUCKDB_DB_NAME, env.DUCKDB_SCHEMA, env.DUCKDB_VOCAB_SCHEMA)
    analyticsConnection =  await getDuckdbDBConnection(duckdbSchemaFileName, vocabSchemaFileName)
} else {
  analyticsConnection =
    await dbConnectionUtil.DBConnectionUtil.getDBConnection({
      credentials: analyticsCredentials,
      schema: analyticsCredentials.cdwSchema || analyticsCredentials.schema,
      userObj,
    });
  }
  const configConnection =
    await dbConnectionUtil.DBConnectionUtil.getDBConnection({
      credentials: configCredentials,
      schema: configCredentials.configSchema || configCredentials.schema,
      userObj,
    });

  return {
    analyticsConnection,
    configConnection,
  };
};

const initRoutes = (
  app: express.Application,
  configCredentials,
  analyticsCredentials,
  isTestEnvironment
) => {
  app.use(express.json({ strict: false, limit: "50mb" }));
  app.use(express.urlencoded({ extended: true, limit: "50mb" }));

  app.use(async (req: ICDWRequest, res, next) => {
    if (!utils.isHealthProbesReq(req)) {
      let userObj: User;
      try {
        userObj = getUser(req);
      } catch (err) {
        log.debug("No user found in request");
      }

      try {
        req.dbConnections = await getConnections({
          analyticsCredentials,
          configCredentials,
          userObj,
        });
      } catch (err) {
        next(err);
      }
    }
    next();
  });

  app.use((req, res, next) => {
    if (!utils.isHealthProbesReq(req)) {
      dbConnectionUtil.DBConnectionUtil.cleanupMiddleware()(
        req as any,
        res,
        next
      );
    } else {
      next();
    }
  });

  app.post("/hc/hph/config/services/global.xsjs", (req: ICDWRequest, res) => {
    const { analyticsConnection, configConnection } = req.dbConnections;
    const user = getUser(req);
    const assignment = new AssignmentProxy(req.assignment);
    const facade = new SettingsFacade(analyticsConnection);
    const ffhQeConfig = new FfhQeConfig(
      configConnection,
      analyticsConnection,
      assignment,
      new Settings(),
      user,
      isTestEnvironment
    );
    facade.setFfhQeConfig(ffhQeConfig);
    facade.invokeAdminServices(req.body, (err, result) => {
      if (err) {
        log.error(err);
        if (err.message === MESSAGES.NO_DEFAULT_CDW_CONFIG_ASSIGNED_ERR_MSG) {
          return res.status(299).json(new Settings().getSettings());
        } else {
          return res.status(500).send(err.message);
        }
      }
      res.status(200).json(result);
    });
  });

  app.post(
    "/hc/hph/config/user/global_enduser.xsjs",
    (req: ICDWRequest, res) => {
      const { analyticsConnection, configConnection } = req.dbConnections;
      const user = getUser(req);
      const facade = new SettingsFacade(analyticsConnection);
      const assignment = new AssignmentProxy(req.assignment);
      const ffhQeConfig = new FfhQeConfig(
        configConnection,
        analyticsConnection,
        assignment,
        new Settings(),
        user,
        isTestEnvironment
      );
      facade.setFfhQeConfig(ffhQeConfig);
      facade.invokeEndUserServices(
        req.body,
        user,
        (err, result) => {
          if (err) {
            log.error(err);
            if (
              err.message === MESSAGES.NO_DEFAULT_CDW_CONFIG_ASSIGNED_ERR_MSG
            ) {
              return res.status(299).json(new Settings().getSettings());
            } else {
              return res.status(500).send(err.message);
            }
          }
          res.status(200).json(result);
        },
        null
      );
    }
  );

  app.post("/hc/hph/config/services/config.xsjs", (req: ICDWRequest, res) => {
    new ConfigFacade(
      req.dbConnections.configConnection,
      isTestEnvironment
    ).invokeService(req.body, (err, result) => {
      if (err) {
        log.error(err);
        return res.status(500).json({});
      }
      res.status(200).json(result);
    });
  });

  app.use(
    "/hc/hph/cdw/config/services/config.xsjs",
    noCache,
    (req: ICDWRequest, res) => {
      const { analyticsConnection, configConnection } = req.dbConnections;
      const user = getUser(req);
      const assignment = new AssignmentProxy(req.assignment); //TODO: Send http req instead of getting it from req.
      try {
        const settings = new Settings();
        let input;
        if (req.method === "GET") {
          input = req.query;
        } else if (req.method === "POST") {
          input = req.body;
        }
        new CdwConfigFacade(
          configConnection,
          new FfhQeConfig(
            configConnection,
            analyticsConnection,
            assignment,
            settings,
            user,
            isTestEnvironment
          ),
          isTestEnvironment
        ).invokeService(
          input,
          (err, result) => {
            if (err) {
              log.error(err);
              res.status(500).send(err.message);
            } else {
              res.status(200).json(result);
            }
          },
          null
        );
      } catch (err) {
        log.error(err);
        res.status(500).json(err.message);
      }
    }
  );

  app.post(
    "/hc/hph/cdw/services/cdw_services.xsjs",
    (req: ICDWRequest, res) => {
      const { analyticsConnection, configConnection } = req.dbConnections;
      const assignment = new AssignmentProxy(req.assignment); //TODO: Send http req instead of getting it from req.
      const user = getUser(req);
      const settings = new Settings();
      new CDWServicesFacade(
        analyticsConnection,
        new FfhQeConfig(
          configConnection,
          analyticsConnection,
          assignment,
          settings,
          user,
          isTestEnvironment
        ),
        isTestEnvironment
      ).invokeService(req.query.action, req.body, false, (err, result) => {
        if (err) {
          log.error(err);
          return res.status(500).send({});
        }
        res.status(200).send(result);
      });
    }
  );

  app.use("/check-readiness", healthCheckMiddleware);

  log.info("Initialized express routes..");
};

try {
  main();
} catch (err) {
  handleStartupError(err);
}
