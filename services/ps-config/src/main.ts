import { env, envVarUtils } from "./configs";
import {
  DBConnectionUtil as dbConnectionUtil,
  healthCheckMiddleware,
  Connection,
  SecurityUtils as securityLib,
  Logger,
  Constants,
} from "@alp/alp-base-utils";
import * as xsenv from "@sap/xsenv";
import * as express from "express";
import { createServer } from "https";
import bodyParser = require("body-parser");
import appConfigEndpoint from "./psconfig/configAppEndpoint";
import configEndpoint from "./psconfig/configEndpoint";
import * as auth from "./authentication";
import { GetUser } from "@alp/alp-config-utils";
import { IDBCredentialsType } from "./types";
const User = GetUser.User;
const SecurityUtils = securityLib.SecurityUtils;
const securityUtils = new SecurityUtils();
const log = Logger.CreateLogger();
let credentials;
let isTestEnvironment = false;
let configConnection;
let chpUrl;
const port = env.PORT || 3003;
const app = express();
app.use("/check-liveness", healthCheckMiddleware);
const checkAuth = (req, res, next) => next();

if (!env.STAGE) {
  // Setting the application running mode.
  // If no value is configured to environment variable STAGE, then assume that CDW is running as XSA application.
  env.STAGE = "XSA";
}

const noCache = (req, res, next) => {
  res.header("Cache-Control", "private, no-cache, no-store, must-revalidate");
  res.header("Expires", "-1");
  res.header("Pragma", "no-cache");
  next();
};

const getUser = (req) => {
  if (!envVarUtils.isStageLocalDev()) {
    return req.user.id;
  } else {
    return auth.DUMMY_USER;
  }
};

let initSettingsFromEnvVars = () => {
  xsenv.loadEnv(envVarUtils.getEnvFile("../../default-env.json"));

  if (envVarUtils.isTestEnv()) {
    // reset configDB.host to point to analyticsDB.host, schema name will be the supplied TESTSCHEMA name
    credentials = xsenv.cfServiceCredentials("httptest");
    console.log("TESTSCHEMA :" + credentials.schema);
  } else {
    credentials = {
      database: env.PG__DB_NAME,
      schema: env.PG_SCHEMA,
      dialect: env.PG__DIALECT,
      host: env.PG__HOST,
      port: env.PG__PORT,
      user: env.PG_USER,
      password: env.PG_PASSWORD,
      max: env.PG__MAX_POOL,
      min: env.PG__MIN_POOL,
      idleTimeoutMillis: env.PG__IDLE_TIMEOUT_IN_MS
    } as IDBCredentialsType
  }

  if (!envVarUtils.isStageLocalDev()) {
    securityUtils.authenticateRequest(app, xsenv);
    app.use(securityUtils.authorizeRequest());
  }

  try {
    chpUrl = Constants.getInstance().getAppUrl("chpUrl");
  } catch (err) {
    console.log("Error while getting chpUrl!");
    console.log(err);
  }

  log.debug(JSON.stringify(Constants.getInstance().getAllEnvVars(), null, 4));
  log.debug(JSON.stringify(Constants.getInstance().getAllAppUrls(), null, 4));
  log.info("Loaded env variables." + port);
};

const getConfigDbConnection = async (
  credentials
): Promise<Connection.ConnectionInterface> => {
  const db = await dbConnectionUtil.DBConnectionUtil.getDBConnection({
    credentials,
    schema: credentials.configSchema || credentials.schema,
  });

  return db;
};

function initRoutes(conn) {
  app.use(bodyParser.json({ strict: false, limit: "50mb" }));
  app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));
  app.use(noCache);
  app.use((req, res, next) => {
    req[auth.SESSION_CLAIMS_PROP] = {
      sub: getUser(req),
      lang: "en",
    };
    (<any>req).chpUrl = chpUrl;
    next();
  });

  app.use(
    "/ps-config-svc/hc/hph/patient/app/services/config.xsjs",
    checkAuth,
    appConfigEndpoint(conn)
  );
  app.use(
    "/ps-config-svc/hc/hph/patient/config/services/config.xsjs",
    checkAuth,
    configEndpoint(conn)
  );

  app.use("/check-readiness", healthCheckMiddleware);

  const server = createServer(
    {
      key: env.TLS__INTERNAL__KEY,
      cert: env.TLS__INTERNAL__CRT,
      maxHeaderSize: 8192 * 10,
    },
    app
  );

  server.listen(port);
  console.log("====================================================");
  console.log("PS Config started on port " + port);
  console.log("====================================================");
}

const main = async () => {
  // Entry point
  initSettingsFromEnvVars();
  const configDbConnection = await getConfigDbConnection(credentials);
  initRoutes(configDbConnection);
};

main();
