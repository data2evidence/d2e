import { Response } from "express";
import { PSConfig } from "./config";
//import { Settings } from "../../qe/settings/Settings";
//import { MRIRequest } from "../types";
import { SESSION_CLAIMS_PROP } from "../authentication";
import { GetUser } from "@alp/alp-config-utils";
import { Connection, Logger } from "@alp/alp-base-utils";
import ConnectionInterface = Connection.ConnectionInterface;
const log = Logger.CreateLogger();

export default (configConnection) => (req: any, res: Response, next) => {
  const user = req[SESSION_CLAIMS_PROP].sub;
  const lang = req[SESSION_CLAIMS_PROP].lang;
  const psConfig = new PSConfig(configConnection, new GetUser.User(user), null);
  const responseCallback = (err, result) => {
    if (err) {
      log.error(err);
      if (process.env.devMode === "1") {
        return res.status(500).send(
          JSON.stringify({
            code: err.code,
            message: err.message,
            stack: err.stack,
          })
        );
      } else {
        return res.status(500).send(err);
      }
    }
    res.status(200).send(result);
  };
  const responseJSONCallback = (err, result) => {
    if (err) {
      log.error(err);
      if (process.env.devMode === "1") {
        return res.status(500).send(
          JSON.stringify({
            code: err.code,
            message: err.message,
            stack: err.stack,
          })
        );
      } else {
        return res.status(500).send(err);
      }
    }
    res.status(200).send(JSON.stringify(result));
  };

  log.info(`[INFO] Config app endpoint received request with:
        method: ${req.method}
        parameters: ${
          req.method == "GET"
            ? JSON.stringify(req.query)
            : JSON.stringify(req.body)
        }`);

  try {
    if (req.method === "GET") {
      switch (req.query.action) {
        case "getMyConfig":
          return psConfig.getUserConfig({
            req,
            user,
            lang,
            callback: responseCallback,
          });
        case "getMyConfigList":
          return psConfig.getUserConfigList({
            req,
            user,
            callback: responseCallback,
          });
        default:
          throw new Error("HPH_PA_CONFIG_ERROR_ACTION_NOT_SUPPORTED");
      }
    }

    if (req.method === "POST") {
      switch (req.body.action) {
        case "getCDWConfig":
          return psConfig.getCDWConfig({
            req,
            lang,
            configId: req.body.configId,
            configVersion: req.body.configVersion,
            callback: responseJSONCallback,
          });
        case "getFrontendConfig":
          console.log("enter getFrontendConfig");
          return psConfig.getFrontendConfig({
            req,
            user,
            lang,
            configId: req.body.configId,
            configVersion: req.body.configVersion,
            callback: responseJSONCallback,
          });
        case "setDefault":
          return psConfig.setDefault({
            req,
            user,
            configId: req.body.configId,
            configVersion: req.body.configVersion,
            callback: responseJSONCallback,
          });
        case "clearDefault":
          return psConfig.clearDefault({
            req,
            user,
            callback: responseJSONCallback,
          });
        default:
          throw new Error("HPH_PA_CONFIG_ERROR_ACTION_NOT_SUPPORTED");
      }
    }
    next();
  } catch (err) {
    log.debug(err);
    res.status(500).send(err);
  }
};
