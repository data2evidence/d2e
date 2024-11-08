import { PSConfig } from "./config";
import PluginHandler from "./PluginHandler";
//import { Settings } from "../../../mri/src/qe/settings/Settings";
//import { MRIRequest } from "../../../mri/src/types";
import { SESSION_CLAIMS_PROP } from "../authentication";
import { GetUser } from "@alp/alp-config-utils";
import { Logger } from "@alp/alp-base-utils";
const log = Logger.CreateLogger();

export default (configConnection) => (req: any, res, next) => {
    const user = req[SESSION_CLAIMS_PROP].sub;
    const lang = req[SESSION_CLAIMS_PROP].lang;
    const psConfig = new PSConfig(
        configConnection,
        new GetUser.User(user),
        null,
    );

    try {
        log.info(`[INFO] Config endpoint received request with:
            method: ${req.method}
            parameters: ${req.method == "GET" ? JSON.stringify(req.query) : JSON.stringify(req.body)}`);
        if (req.method === "GET") {
            switch (req.query.action) {
                case "export":
                    return psConfig.getAdminConfig({
                        req,
                        lang,
                        configId: req.query.configId,
                        configVersion: req.query.configVersion,
                        callback: (err, result) => {
                        if (err) {
                            log.debug(err);
                            return res.status(500).send(err);
                        }

                        let result_string = JSON.stringify(result.config, null, 4);
                        let configName = "PatientSummaryConfig";
                        if (result && result.hasOwnProperty("meta") && result.meta.hasOwnProperty("configName")) {
                            configName = result.meta.configName;
                        }
                        let filename = configName + ".json";
                        res.setHeader("content-disposition", "attachment; filename=" + filename);
                        res.status(200).send(result_string);
                    }});
                default:
                    throw new Error("HPH_PAT_CFG_ERROR_ACTION_NOT_SUPPORTED");
            }
        }

        if (req.method === "POST") {
            switch (req.body.action) {
                case "getAdminConfig":
                    return psConfig.getAdminConfig({
                        req,
                        lang,
                        configId: req.body.configId,
                        configVersion: req.body.configVersion,
                        callback: (err, result) => {
                            if (err) {
                                log.debug(err);
                                return res
                                .status(500)
                                .send(err);
                            }
                            res
                            .status(200)
                            .send(result);
                        },
                    });
                case "delete":
                    return psConfig.deleteConfig({
                        req,
                        configId: req.body.configId,
                        configVersion: req.body.configVersion,
                        callback: (err, result) => {
                            if (err) {
                                log.debug(err);
                                return res
                                .status(500)
                                .send(err);
                            }
                            res
                            .status(200)
                            .send(JSON.stringify(result));
                        },
                    });
                case "validate":
                    return psConfig.validateConfig({
                        req,
                        config: req.body.config,
                        dependentConfig: req.body.dependentConfig,
                        lang,
                        callback: (err, result) => {
                            if (err) {
                                log.debug(err);
                                return res
                                .status(500)
                                .send(err);
                            }
                            res
                            .status(200)
                            .send(result);
                        },
                    });
                case "getExtensions":
                    return PluginHandler.getExtensionsWithNames({
                        req,
                        psConfig,
                        callback: (err, result) => {
                            if (err) {
                                log.debug(err);
                                return res
                                .status(500)
                                .send(err);
                            }
                            res
                            .status(200)
                            .send(result);
                    }});
                case "getTemplateData":
                    return psConfig.getTemplateData({
                        req,
                        lang,
                        cdwConfig: req.body.dependentConfig,
                        callback: (err, result) => {
                            if (err) {
                                log.debug(err);
                                return res
                                .status(500)
                                .send(err);
                            }
                            res
                            .status(200)
                            .send(result);
                    }});
                case "activate":
                    return psConfig.activateConfig({
                        req,
                        lang,
                        inConfigId: req.body.configId,
                        inConfigName: req.body.configName,
                        inConfig: req.body.config,
                        inDependentConfig: req.body.dependentConfig,
                        callback: (err, result) => {
                            if (err) {
                                log.debug(err);
                                return res
                                .status(500)
                                .send(err);
                            }
                            res
                            .status(200)
                            .send(result);
                    }});
                case "getAll":
                    return psConfig.getAllConfigs({
                        req,
                        callback: (err, result) => {
                            if (err) {
                                log.debug(err);
                                return res
                                .status(500)
                                .send(err);
                            }
                            res
                            .status(200)
                            .send(result);
                    }});
                case "getStaticContent":
                    return res
                    .status(200)
                    .send(psConfig.getStaticContent());
                default:
                    throw new Error("HPH_PAT_CFG_ERROR_ACTION_NOT_SUPPORTED");
            }
        }
        next();

    } catch (err) {
        res
            .status(500)
            .send(err);
    }
};
