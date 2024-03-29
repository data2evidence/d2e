export import queryutils = require("./qe/utils/queryutils");
export import qe = require("./qe/query_engine");
export import utils = require("./utils/utils");

//chp-qe-settings
export { DbMeta } from "./qe/settings/DbMeta";
export { Settings } from "./qe/settings/Settings";
export { SettingsFacade } from "./qe/settings/SettingsFacade";

//qe-config
import { FfhQeConfig } from "./qe/config/config";
import ffhQeConfigDefinition = require("./qe/config/configDefinition");
import ffhQeConfigSuggestion = require("./qe/config/configSuggestion");
import ffhQeConfigTemplate = require("./qe/config/configTemplate");
import ffhQeFormatter = require("./qe/config/formatter");
import { CDWServicesFacade } from "./qe/config/CDWServicesFacade";
import { ConfigFacade } from "./qe/config/ConfigFacade";

export let qe_config = {
  FfhQeConfig,
  ffhQeConfigDefinition,
  ffhQeConfigSuggestion,
  ffhQeConfigTemplate,
  ffhQeFormatter,
  ConfigFacade,
  CDWServicesFacade,
};
