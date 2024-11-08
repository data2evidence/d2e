/**
* @file Patient Inspector Configuration Logic
*/
// import { MRIConfig as FfhQeConfig} from "../../mri/config/config";
import { FFHConfig as ffhConfigLib, GetUser, configTools as utilsLib, validator as validatorLib } from "@alp/alp-config-utils";
//  import { FFHConfig } from "../../mri/config/utils/FFHConfig";
import { Connection, Logger } from "@alp/alp-base-utils";
import CreateLogger = Logger.CreateLogger;
import ConnectionInterface = Connection.ConnectionInterface;
import CallBackInterface = Connection.CallBackInterface;
//  import { Settings } from "../../qe/settings/Settings";
import { Formatter } from "./formatter";
// import * as utilsLib from "../../mri/config/utils/configTools";
// import { Validator } from "../../mri/config/utils/validator";
import PluginHandler from "./PluginHandler";
import * as patientConfigDefinitionLib from "./configDefinition";

let log = CreateLogger();

function hasPermission(action) {
    try {
        // return $.session.hasAppPrivilege("sap.hc.hph.patient.config.services::" + action);
        return true;
    } catch (e) {
        throw new Error("HPH_PAT_CFG_ERROR_APPLICATION_PRIVILEGE_NOT_FOUND");
    }
}

/**
 * Get regex for the patient config header/details pattern
 * @returns {regex} the regex for extracting the patient attributes from pattern field
 */
export function getPlaceholderPatternRegex() {
    let CONFIG_PLACEHOLDER_REGEX = /[^{}]+(?=})/g;
    return CONFIG_PLACEHOLDER_REGEX;
}

/**
 * @constant {String[]} Default active tab extensions.
 */
export const DEFAULT_ACTIVE_TAB_EXT = [
    "sap.hc.hph.patient.plugins.tabs.timeline",
    "sap.hc.hph.patient.plugins.tabs.overview"
];
/**
 * @constant {String[]} Default active widget extensions.
 */
export const DEFAULT_ACTIVE_WIDGET_EXT = [
    "sap.hc.hph.patient.plugins.widgets.masterdata"
];


export class PSConfig {

    private formatter: Formatter;
    private ffhConfig: ffhConfigLib.FFHConfig;

    /**
     * @constant {string} Code for configurations of the patient inspector.
     */
    private CONFIG_TYPE = "HC/HPH/PATIENT";

    /**
     * @constant {object} Codes for the versions of the patient inspector configurations.
     */
    private VERSION = {
        ACTIVE: "A",
        INACTIVE: "I",
    };

    /**
     * @constant {object} Various privileges required for the respective functions.
     */
    private PRIVILEGES = {
        GET: "get",
        VALIDATE: "validate",
        ACTIVATE: "activate",
        DELETE: "delete",
        // SUGGEST: "suggest",
        GET_ALL: "getAll",
        GET_AS_ADMIN: "getAsAdmin",
    };

    // Temporal variable to store other configs during processing
    private configStorage = {};

    /**
     * {object} Global Settings Object
     */

    constructor(
        private oConnection: ConnectionInterface,
        private oUser: GetUser.User,
        private fs: any) {
        this.ffhConfig = new ffhConfigLib.FFHConfig(oConnection, oUser);
        this.formatter = new Formatter();
    }
    /**
     * Checks if the current user has the privilege to for the given action.
     * Throws an Error if the action is invalid.
     * @private
     * @param   {string}  action Name of the action
     * @returns {boolean} True, if authorized.
     */

    /**
     * Assert that the current user has the privilege to for the given action.
     * Throws an Error if the user is not authorized.
     * @private
     * @param {string} action Name of the action
     */
    public assertPermission(action) {
        if (!hasPermission(action)) {
            log.error("SECURITY INCIDENT! Current user does not have required privilege " + action);
            throw new Error("HPH_PAT_CFG_ERROR_MISSING_APPLICATION_PRIVILEGE");
        }
    }

    /**
     * Check if the current user has this config assigned.
     * @private
     * @param {string}   configId      Config Id
     * @param {string}   configVersion Config version
     * @param {function} callback      Callback to handle after checking if the user has this config assigned.
     */
    public checkConfigAssignment(configId, configVersion, callback) {
        // TODO: NEED ASSIGNMENT CHECK!
        callback(null, true);
    }

    /**
     * Throw an Error if the user does not have this config assigned.
     * @private
     * @param {string}   configId      Config Id
     * @param {string}   configVersion Config version
     * @param {function} callback      Callback to throw an error, if the config is not assigned to the user
     */
    public assertConfigAssignment({ configId, configVersion, callback }) {
        this.checkConfigAssignment(configId, configVersion, (err, assigned) => {
            if (err) {
                callback(err, null);
                return;
            }
            if (!assigned) {
                log.error("SECURITY INCIDENT! Current user tried to access not assigned config (Id: " + configId + " Version: " + configVersion);
                callback(new Error("HPH_PAT_CFG_ERROR_NOT_ALLOWED_TO_USE_CONFIG"), null);
                return;
            }
            callback(null, null);
        });
    }

    /**
     * Get a CDW config object.
     * @private
     * @param {string}   configId      CDW config Id
     * @param {string}   configVersion CDW config version
     * @param {function} callback      Callback for handling the CDW config object
     */
    public async getCDWConfig({ req, configId, configVersion, lang, callback }:
        { req: any, configId: string, configVersion: string, lang: string, callback: CallBackInterface }) {
        let key = configId + configVersion;
        if (this.configStorage.hasOwnProperty(key)) {
            callback(null, this.configStorage[key]);
        } else {
            this.ffhConfig.getCDWConfig({
                configId, configVersion, lang, callback: (err, config) => {
                    if (err) {
                        callback(err, null);
                        return;
                    }
                    this.configStorage[key] = config;
                    callback(null, this.configStorage[key]);
                }
            });
        }
    }

    /**
     * Get a config object defined by id and version. If no config version is
     * specified, query the active one.
     * @private
     * @param {string}   configId          Config Id
     * @param {string}   configVersion     Config version
     * @param {Function} formatter         Formatter function
     * @param {boolean}  noAssignmentCheck True, if an assignment check should not be performed
     * @param {function} callback          Callback for handling the config object
     */
    public getConfig({ req, configId, configVersion, formatter, noAssignmentCheck, lang, callback }) {
        if (!configId) {
            callback(new Error("HPH_PAT_CFG_CONFIG_ERROR_NO_CONFIG_ID_SPECIFIED"), null);
            return;
        }
        if (!configVersion) {
            configVersion = this.VERSION.ACTIVE;
        }
        let postExecute = async () => {
            try {
                let cdwConfig;
                let configObj = await this.ffhConfig.getConfig({
                    configId,
                    configVersion,
                });

                // Check if the config is empty:
                if (!Object.keys(configObj.config).length) {
                    callback(new Error("HPH_PAT_CFG_ERROR_PI_CONFIG_NOT_FOUND"), null);
                    return;
                }


                // TODO: Commented out due to PluginHandler being unavailable
                // Get extension information
                // let aExtensions = await PluginHandler.getAllExtensionsWithMetadata(req);

                let validateAndFormatConfig = async () => {
                    if (!cdwConfig) {
                        callback(Error("HPH_PAT_CFG_ERROR_DEPENDENT_CDW_CONFIG_NOT_FOUND"), null);
                    }

                    // TODO: Removed aExtensions from formatter() due to PluginHandler being unavailable
                    // if (formatter) {
                    //     configObj.config = await formatter(req, configObj.config, cdwConfig, aExtensions);
                    // }
                    if (formatter) {
                        configObj.config = await formatter(req, configObj.config, cdwConfig);
                    }

                    // TODO: Commented out due to PluginHandler being unavailable
                    // configObj.extensions = {
                    //     interaction: aExtensions.interaction,
                    // };
                    callback(null, configObj);
                };

                if (configObj.meta.dependentConfig && configObj.meta.dependentConfig.configId) {
                    this.getCDWConfig({
                        req,
                        configId: configObj.meta.dependentConfig.configId,
                        configVersion: configObj.meta.dependentConfig.configVersion,
                        lang,
                        callback: (err, result) => {
                            if (err) {
                                callback(err, null);
                                return;
                            }
                            cdwConfig = result;
                            validateAndFormatConfig();
                        }
                    });
                } else {
                    validateAndFormatConfig();
                };
            } catch (err) {
                callback(err, null);
            }
        };

        if (!noAssignmentCheck) {
            this.assertConfigAssignment({
                configId,
                configVersion,
                callback: (err, result) => {
                    if (err) {
                        callback(err, null);
                        return;
                    }
                    postExecute();
                }
            });
        } else {
            postExecute();
        }
    }

    /**
     * Get the meta information of the config that is set as default for the
     * current user. Throws an Error if the user is not authorized to get a
     * config.
     * @private
     * @param {function} callback Callback for handling the config meta object, with configId and configVersion.
     */
    public getDefaultConfigMetadata({ req, user, callback }) {
        this.assertPermission(this.PRIVILEGES.GET);
        this.ffhConfig.getDefault(user, this.CONFIG_TYPE, callback);
    }

    /**
     * Remove the current default assignment for the current user. Throws an
     * Error if the user is not authorized to get a config.
     * @private
     * @param {function} callback Callback for handling the delete result. True, if successful
     */
    public clearDefault({ req, user, callback }) {
        this.assertPermission(this.PRIVILEGES.GET);
        this.ffhConfig.clearDefault(user, this.CONFIG_TYPE, callback);
    }

    /**
     * Get the config object formatted for the frontend use defined by id and
     * version or the default one. Throws an Error if the user is not authorized
     * to get a config or the config does not exist.
     * @param {string}   [configId]      Config Id
     * @param {string}   [configVersion] Config version
     * @param {function} callback        Callback for handling formatted config object
     */
    public getFrontendConfig({ req, user, configId, configVersion, lang, callback }) {
        this.assertPermission(this.PRIVILEGES.GET);
        if (!configId) {
            this.getDefaultConfigMetadata({
                req, user, callback: (err, defaultConfig) => {
                    configId = defaultConfig.configId;
                    configVersion = defaultConfig.configVersion;
                    this.getConfig({
                        req,
                        configId,
                        configVersion,
                        formatter: this.formatter.formatFrontendConfig.bind(this.formatter),
                        noAssignmentCheck: false,
                        lang,
                        callback,
                    });
                }
            });
        } else {
            this.getConfig({
                req,
                configId,
                configVersion,
                formatter: this.formatter.formatFrontendConfig.bind(this.formatter),
                noAssignmentCheck: false,
                lang,
                callback,
            });
        }
    }

    /**
     * Get the config object formatted for the backend use defined by id and
     * version or the default one. Throws an Error if the user is not authorized
     * to get a config or the config does not exist.
     * @param {string}   [configId]      Config Id
     * @param {string}   [configVersion] Config version
     * @param {function} callback        Callback for handling formatted config object
     */
    public getBackendConfig({ req, user, configId, configVersion, lang, callback }) {
        this.assertPermission(this.PRIVILEGES.GET);
        if (!configId) {
            this.getDefaultConfigMetadata({
                req, user, callback: (err, defaultConfig) => {
                    configId = defaultConfig.configId;
                    configVersion = defaultConfig.configVersion;
                    this.getConfig({
                        req,
                        configId,
                        configVersion,
                        formatter: this.formatter.formatBackendConfig.bind(this.formatter),
                        noAssignmentCheck: false,
                        lang,
                        callback,
                    });
                }
            });
        } else {
            this.getConfig({
                req,
                configId,
                configVersion,
                formatter: this.formatter.formatBackendConfig.bind(this.formatter),
                noAssignmentCheck: false,
                lang,
                callback,
            });
        }
    }

    /**
     * Returns the configuration for the current user. Throws an Error if the
     * user is not authorized to get a config.
     * @param {function} callback Callback for handling config object
     */
    public getUserConfig({ req, user, lang, callback }) {
        this.assertPermission(this.PRIVILEGES.GET);

        let getAssignedConfig = () => {
            // return the list of assigned configs
            this.ffhConfig.getAssignedConfigs(this.CONFIG_TYPE, user, (err, assignedConfigsList) => {
                if (err) {
                    callback(err, []);
                    return;
                }
                let loadParentCDWConfig = (psConfig) => {
                    if (psConfig) {
                        this.getCDWConfig({
                            req,
                            configId: psConfig.dependentConfig.configId,
                            configVersion: psConfig.dependentConfig.configVersion,
                            lang,
                            callback: async (err, result) => {
                                if (err) {
                                    callback(err, null);
                                    return;
                                }
                                if (!result) {
                                    callback(new Error("HPH_PAT_CFG_ERROR_DEPENDENT_CDW_CONFIG_NOT_FOUND"), null);
                                }
                                else {
                                    let patientConfig = psConfig.config;
                                    delete psConfig.config;
                                    let extensions = await PluginHandler.getAllExtensionsWithMetadata(req, true);
                                    try {
                                        let formattedConfig = this.formatter.formatFrontendConfig(req, patientConfig, result, extensions, lang);
                                        callback(null, [{
                                            meta: psConfig,
                                            extensions: {
                                                interaction: extensions.interaction,
                                            },
                                            config: formattedConfig,
                                        }]);
                                    } catch (err) {
                                        callback(err, null);
                                        return;
                                    }
                                }
                            }
                        });
                    } else {
                        callback(null, []);
                    }
                }

                if (assignedConfigsList.length > 1) {
                    // if the user has multiple configs assigned, return a list of configs for further selection
                    // at this point we also now, that there is no default configuration
                    callback(null, this.formatter.formatUserList(assignedConfigsList, {}));
                    return;
                } else if (assignedConfigsList.length === 1) {
                    loadParentCDWConfig(assignedConfigsList[0]);
                } else {
                    this.ffhConfig.getDefaultConfigAssignment(this.CONFIG_TYPE, (err, aStandardConfigs) => {
                        if (err) {
                            callback(err, []);
                            return;
                        }
                        if (aStandardConfigs) {
                            loadParentCDWConfig(aStandardConfigs);
                        } else {
                            callback(null, []);
                        }
                    });
                }
            });
        };

        this.getDefaultConfigMetadata({
            req,
            user,
            callback: (err, defaultConfigMeta) => {
                if (err) {
                    callback(err, null);
                    return;
                }
                if (defaultConfigMeta) {
                    // return the default config, if the user got one
                    try {
                        this.getFrontendConfig({
                            req,
                            user,
                            lang,
                            configId: defaultConfigMeta.configId,
                            configVersion: defaultConfigMeta.configVersion,
                            callback: (err, defaultConfig) => {
                                if (err) {
                                    callback(err, null);
                                    return;
                                }
                                callback(null, [defaultConfig]);
                            }
                        });
                    } catch (e) {
                        // can't get the default config. e.g. config is
                        // missing or assignment got deleted
                        this.clearDefault({
                            req,
                            user,
                            callback: (err, result) => {
                                getAssignedConfig();
                            }
                        });
                    }
                } else {
                    getAssignedConfig();
                }
            }
        });
    }

    /**
     * Deletes the specified configuration. Throws an Error if the user is not
     * authorized to delete a config.
     * @param {string}   configId        Config Id
     * @param {string}   [configVersion] Config Version
     * @param {function} callback        Callback for handling the delete result. True, if successful
     */
    public deleteConfig({ req, configId, configVersion, callback }) {
        this.assertPermission(this.PRIVILEGES.DELETE);
        if (!configId) {
            callback(new Error("HPH_PAT_CFG_ERROR_NO_CONFIG_SPECIFIED"), null);
            return;
        }

        if (configVersion) { // delete one state
            this.ffhConfig.deleteConfig({
                configId,
                configVersion,
            }, callback);
        } else { // delete active and inactive
            this.ffhConfig.deleteConfig({
                configId,
            }, callback);
        }
    }

    /**
     * Get the config object to be used in the config administration app. Throws
     * an Error if the user is not authorized to get an admin config.
     * @param {string}   configId      Config Id
     * @param {string}   configVersion Config version
     * @param {function} callback      Callback for handling the config object
     */
    public getAdminConfig({ req, configId, configVersion, callback, lang }) {
        this.assertPermission(this.PRIVILEGES.GET_AS_ADMIN);
        if (!configId) {
            callback(new Error("HPH_PAT_CFG_CONFIG_ERROR_NO_CONFIG_ID_SPECIFIED"), null);
            return;
        }
        let noAssignmentCheck = true;
        this.getConfig({
            req,
            lang,
            configId,
            configVersion,
            formatter: this.formatter.formatAdminConfig.bind(this.formatter),
            noAssignmentCheck,
            callback,
        });
    }

    /**
     * Saves the Patient Inspector configuration and assigns it to the invoking
     * user.
     * @private
     * @param {string}   configId        Config Id
     * @param {string}   configVersion   Config version
     * @param {string}   configName      Config name
     * @param {object}   config          Actual config object
     * @param {object}   dependentConfig Object with configId and configVersion of dependent CDW config
     * @param {function} callback        Callback for handling the saved config including status and meta data.
     */
    public saveConfig({ req, configId, configVersion, configName, config, dependentConfig, callback, lang }) {
        let saveResult = {
            saved: false,
            meta: {
                configId: "",
                configVersion: "",
            },
            config: {},
        };

        this.ffhConfig.saveConfig({
            configId,
            configVersion,
            configType: this.CONFIG_TYPE,
            configName,
            config,
            dependentConfig,
        }, (err, result) => {
            if (err) {
                callback(err, null);
                return;
            }
            saveResult = result;
            if (saveResult.saved) {
                this.getAdminConfig({
                    req,
                    lang,
                    configId: saveResult.meta.configId,
                    configVersion: saveResult.meta.configVersion,
                    callback: (err, newConfig) => {
                        if (err) {
                            callback(err, null);
                            return;
                        }
                        saveResult.meta = newConfig.meta;
                        saveResult.config = newConfig.config;
                        callback(null, saveResult);
                    },
                });
            } else {
                callback(null, saveResult);
            }
        });
    }

    /**
     * Check if the configuration passed as parameter is valid (in particular in
     * the context of the dependent CDW config). A config is considered valid if
     * there are no errors, a valid config can have warnings. Throws an Error if
     * the user is not authorized to validate a config.
     * @param {object}   config          Actual config object
     * @param {object}   dependentConfig Object with configId and configVersion of dependent CDW config
     * @param {function} callback        Callback for handling the validation result. Included a list of errors, warnings and valid status.
     */
    public validateConfig({ req, config, dependentConfig, lang, callback }) {
        this.assertPermission(this.PRIVILEGES.VALIDATE);
        this.getCDWConfig({
            req,
            configId: dependentConfig.configId,
            configVersion: dependentConfig.configVersion,
            lang,
            callback: (err, cdwConfig) => {
                if (err) {
                    callback(err, null);
                    return;
                }
                this._validateConfig(req, config, cdwConfig, callback);
            }
        });
    }

    private _validateConfig(req, config, cdmConfig, callback) {
        let definition = patientConfigDefinitionLib.getDefinition(cdmConfig);
        let configToValidate = this.formatter.trimConfigForSaving(config, cdmConfig);
        let validator = new validatorLib.Validator(this.oConnection);
        let validationResult = validator.validateConfiguration(configToValidate, definition);
        callback(null, {
            errors: validationResult.errors,
            warnings: validationResult.warnings,
            valid: validationResult.errors.length === 0,
        });
    }

    /**
     * Marks a configuration as active. If no config object is specified, try to
     * get an inactive version of the given id. Throws an Error if the user is
     * not authorized to activate a config.
     * @param {string}   inConfigId          Config Id
     * @param {string}   inConfigName        Config Name
     * @param {object}   [inConfig]          Actual config object
     * @param {object}   [inDependentConfig] Object with configId and configVersion of dependent CDW config
     * @param {function} callback            Callback for handling activation result.
     *                                       Includes the validation result, containing activated state, meta and config objects.
     */
    public activateConfig({ req, inConfigId, inConfigName, inConfig, inDependentConfig, lang, callback }) {
        this.assertPermission(this.PRIVILEGES.ACTIVATE);
        let configId = inConfigId;
        let config = inConfig;
        let dependentConfig = inDependentConfig;
        let validateAndSaveConfig = () => {
            if (!config) {
                callback(new Error("HPH_PAT_CFG_ERROR_CONFIG_NO_TO_ACTIVATE"), null);
                return;
            }
            this.getCDWConfig({
                req,
                configId: dependentConfig.configId,
                configVersion: dependentConfig.configVersion,
                lang,
                callback: (err, cdmConfig) => {
                    if (err) {
                        callback(err, null);
                        return;
                    }
                    config = this.formatter.trimConfigForSaving(config, cdmConfig);
                    // validate the config before activating
                    this._validateConfig(req, config, cdmConfig, (err, validationResult) => {
                        if (err) {
                            callback(err, null);
                            return;
                        }
                        if (!validationResult.valid) {
                            validationResult.activated = false;
                            callback(null, validationResult);
                        } else {
                            // save as active version
                            this.saveConfig({
                                req,
                                lang,
                                configId,
                                configVersion: this.VERSION.ACTIVE,
                                configName: inConfigName,
                                config,
                                dependentConfig,
                                callback: (saveError, saveResult) => {
                                    if (saveError) {
                                        callback(saveError, null);
                                        return;
                                    }
                                    // remove inactive version after activating successfully
                                    let modifyValidationResult = () => {
                                        validationResult.activated = saveResult.saved;
                                        validationResult.meta = saveResult.meta;
                                        validationResult.config = saveResult.config;
                                        callback(null, validationResult);
                                    };
                                    if (saveResult.saved) {
                                        configId = saveResult.meta.configId;
                                        this.deleteConfig({
                                            req,
                                            configId,
                                            configVersion: this.VERSION.INACTIVE,
                                            callback: (deleteError, result) => {
                                                if (deleteError) {
                                                    callback(deleteError, null);
                                                    return;
                                                }
                                                modifyValidationResult();
                                            }
                                        });
                                    } else {
                                        modifyValidationResult();
                                    }
                                }
                            });
                        }
                    });
                }
            });
        };

        if (!config) {
            this.getAdminConfig({
                req,
                lang,
                configId,
                configVersion: this.VERSION.INACTIVE,
                callback: (err, inactiveConfig) => {
                    if (err) {
                        callback(err, null);
                        return;
                    }
                    config = inactiveConfig.config;
                    dependentConfig = inactiveConfig.meta.dependentConfig;
                    validateAndSaveConfig();
                }
            });
        } else {
            validateAndSaveConfig();
        }
    }

    /**
     * Sets a configuration as default for the current user.
     * @param {string}   configId      Config Id
     * @param {string}   configVersion Config Version
     * @param {function} callback      Callback for handling the save result. True, if successful
     */
    public setDefault({ req, user, configId, configVersion, callback }) {
        this.assertPermission(this.PRIVILEGES.GET);
        this.assertConfigAssignment({
            configId,
            configVersion,
            callback: (err, result) => {
                if (err) {
                    callback(err, null);
                    return;
                }
                this.ffhConfig.setDefault(user, this.CONFIG_TYPE, configId, configVersion, callback);
            }
        });
    }

    /**
     * Loads a configuration from the HANA repository. Throws an Error if the
     * user is not authorized to activate a config or the file extension is not
     * json.
     * @param {string}   filePath        Path to file. Package, name, and file extension separated by dots.
     * @param {string}   configId        Config Id
     * @param {string}   configName      Config name
     * @param {object}   dependentConfig Object with configId and configVersion of dependent CDW config
     * @param {function} callback        Callback for handling the activation Result.
     *                                   Includtion the validation result, activated state, meta data, and config object.
     */
    public loadFromFile({ req, filePath, configId, configName, dependentConfig, callback, lang }) {
        this.assertPermission(this.PRIVILEGES.ACTIVATE);
        if (!dependentConfig || !dependentConfig.configId || !dependentConfig.configVersion) {
            callback(new Error("HPH_PAT_CFG_ERROR_MISSING_DEPENDENT_CONFIG_DETAILS"), null);
            return;
        }
        let filenameParts = utilsLib.extractPackageAndFile(filePath);
        if (filenameParts[2] !== "json") {
            callback(new Error("HPH_PAT_CFG_ERROR_LOAD_FILE_ERROR_INVALID_FILE_EXTENSION"), null);
            return;
        }
        let config = utilsLib.loadFile(filenameParts[0], filenameParts[1], filenameParts[2], null);
        this.activateConfig({
            req,
            lang,
            inConfigId: configId,
            inConfigName: configName,
            inConfig: config,
            inDependentConfig: dependentConfig,
            callback: (err, saveResult) => {
                if (err) {
                    callback(err, null);
                    return;
                }
                callback(null, this.formatter.loadFromFileResult(saveResult));
            }
        });
    }

    /**
     * Given a cdw config id, build template data for both patient's master data
     * as well as an empty lane that can be used by the Admin UI too add new
     * lanes. The empty lane is built using the interactions and attributes of
     * the associated CDW configuration
     * @param {string}   cdwConfig CDW configuration
     * @param {function} callback  Callback for handling the lane template
     */
    public getTemplateData({ req, cdwConfig, callback, lang }) {
        this.assertPermission(this.PRIVILEGES.GET_AS_ADMIN);
        let validateAndFormatConfig = () => {
            if (!cdwConfig) {
                callback(new Error("HPH_PAT_CFG_ERROR_DEPENDENT_CDW_CONFIG_NOT_FOUND"), null);
                return;
            }
            callback(null, this.formatter.formatTemplateData(cdwConfig));
        };
        if (!cdwConfig || !cdwConfig.configId) {
            callback(new Error("HPH_PAT_CFG_CONFIG_ERROR_NO_CONFIG_ID_SPECIFIED"), null);
            return;
        }
        let configVersion = cdwConfig.configVersion || this.VERSION.ACTIVE;

        if (cdwConfig.configId && configVersion) {
            this.getCDWConfig({
                req,
                lang,
                configId: cdwConfig.configId,
                configVersion,
                callback: (err, result) => {
                    if (err) {
                        callback(err, null);
                        return;
                    }
                    cdwConfig = result;
                    validateAndFormatConfig();
                }
            });
        } else {
            validateAndFormatConfig();
        }
    }

    /**
     * Return a list of configurations.
     * @param {function} callback Callback for handling the list of CDW configurations with depending PI configurations
     */
    public getAllConfigs({ req, callback }) {
        this.assertPermission(this.PRIVILEGES.GET_ALL);
        this.ffhConfig.getAllConfigs("HC/HPH/CDW", (getCDWError, cdwConfigs) => {
            if (getCDWError) {
                callback(getCDWError, null);
                return;
            }
            this.ffhConfig.getAllConfigs(this.CONFIG_TYPE, (getPVError, configs) => {
                if (getPVError) {
                    callback(getPVError, null);
                    return;
                }
                callback(null, this.formatter.formatList(configs, cdwConfigs));
            });
        });
    }

    /**
     * Specifies and returns the static content for lanes
     * @returns {object} Static content, namely a list of allowed colors
     */
    public getStaticContent() {
        return {
            colorPalette: [{
                code: "#EB7300",
                key: "LightOrange",
                name: "HPH_PAT_CFG_LANE_COLOR_LIGHT_ORANGE",
            }, {
                code: "#93C939",
                key: "LightGreen",
                name: "HPH_PAT_CFG_LANE_COLOR_LIGHT_GREEN",
            }, {
                code: "#F0AB00",
                key: "LightGold",
                name: "HPH_PAT_CFG_LANE_COLOR_LIGHT_GOLD",
            }, {
                code: "#960981",
                key: "LightPurple",
                name: "HPH_PAT_CFG_LANE_COLOR_LIGHT_PURPLE",
            }, {
                code: "#EB7396",
                key: "LightPink",
                name: "HPH_PAT_CFG_LANE_COLOR_LIGHT_PINK",
            }, {
                code: "#E35500",
                key: "MediumOrange",
                name: "HPH_PAT_CFG_LANE_COLOR_MEDIUM_ORANGE",
            }, {
                code: "#4FB81C",
                key: "MediumGreen",
                name: "HPH_PAT_CFG_LANE_COLOR_MEDIUM_GREEN",
            }, {
                code: "#D29600",
                key: "MediumGold",
                name: "HPH_PAT_CFG_LANE_COLOR_MEDIUM_GOLD",
            }, {
                code: "#760A85",
                key: "MediumPurple",
                name: "HPH_PAT_CFG_LANE_COLOR_MEDIUM_PURPLE",
            }, {
                code: "#C87396",
                key: "MediumPink",
                name: "HPH_PAT_CFG_LANE_COLOR_MEDIUM_PINK",
            }, {
                code: "#BC3618",
                key: "DarkOrange",
                name: "HPH_PAT_CFG_LANE_COLOR_DARK_ORANGE",
            }, {
                code: "#247230",
                key: "DarkGreen",
                name: "HPH_PAT_CFG_LANE_COLOR_DARK_GREEN",
            }, {
                code: "#BE8200",
                key: "DarkGold",
                name: "HPH_PAT_CFG_LANE_COLOR_DARK_GOLD",
            }, {
                code: "#45157E",
                key: "DarkPurple",
                name: "HPH_PAT_CFG_LANE_COLOR_DARK_PURPLE",
            }, {
                code: "#A07396",
                key: "DarkPink",
                name: "HPH_PAT_CFG_LANE_COLOR_DARK_PINK",
            }],
        };
    }


    /**
     * @constant {regex} regex for the patient config masterdata title and details.
     */


    /**
     * Returns a list with the metadata of the configurations that this user is
     * allowed to see.
     * @param {function} callback Callback for handling after the configs retrieved assigned to the user
     */
    public getUserConfigList({ req, user, callback }) {
        this.getDefaultConfigMetadata({
            req,
            user,
            callback: (err, defaultConfigMeta) => {
                if (err) {
                    callback(err, null);
                    return;
                }
                this.ffhConfig.getAssignedConfigs(this.CONFIG_TYPE, user, (err, configs) => {
                    if (err) {
                        callback(err, null);
                        return;
                    };
                    try {
                        let formattedUserList = this.formatter.formatUserList(configs, defaultConfigMeta);
                        callback(null, formattedUserList);
                    } catch (err) {
                        callback(err, null);
                        return;
                    };
                });
            }
        });
    }

}
