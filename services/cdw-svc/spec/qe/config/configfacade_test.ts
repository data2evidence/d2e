import { User } from "@alp/alp-base-utils";
import { ConfigFacade } from "../../../src/qe/config/ConfigFacade";
import { MockHdb } from "../../testutils/testenv/mockHdb";
import { FfhQeConfig } from "../../../src/qe/config/config";
import { Settings } from "../../../src/qe/settings/Settings";
import { AssignmentProxy } from "../../../src/AssignmentProxy";
import { Connection as connLib } from "@alp/alp-base-utils";
import ConnectionInterface = connLib.ConnectionInterface;

const globalSetting = {
  Id: "GlobalSettings",
  Version: "A",
  Status: "A",
  Name: "GLOBAL",
  Type: "HC/HPH/GLOBAL",
  // tslint:disable-next-line:max-line-length
  Data: `{"tableMapping":{"@INTERACTION":"CDMDEFAULT.\"legacy.cdw.db.models::DWViews.Interactions\"", "@OBS":"CDMDEFAULT.\"legacy.cdw.db.models::DWViews.Observations\"", "@CODE":"CDMDEFAULT.\"legacy.cdw.db.models::DWViewsEAV.Interaction_Details\"", "@MEASURE":"CDMDEFAULT.\"legacy.cdw.db.models::DWViewsEAV.Interaction_Measures\"", "@REF":"CDMDEFAULT.\"legacy.ots::Views.ConceptPreferredTerms\"", "@PATIENT":"CDMDEFAULT.\"legacy.cdw.db.models::DWViews.Patient\"", "@TEXT":"CDMDEFAULT.\"legacy.cdw.db.models::DWViewsEAV.Interaction_Text\""},"guardedTableMapping":{ "@PATIENT":"\"CDMDEFAULT\".\"legacy.cdw.db.models::DWViews.V_GuardedPatient\"" },"language":["en", "de", "fr"], "settings":{ "fuzziness":0.7, "maxResultSize":5000, "sqlReturnOn":true, "errorDetailsReturnOn":true, "errorStackTraceReturnOn":true, "hhpSchemaName":"CDMDEFAULT", "refSchemaName":"CDMDEFAULT", "kaplanMeierTable":"CDMDEFAULT.\"pa.db::MRIEntities.KaplanMeierInput\"", "medexSchemaName":"CDMDEFAULT", "vbEnabled":true },"columnMap":{ "CONDITION_ID":"\"ConditionID\"", "INTERACTION_ID":"\"InteractionID\"", "PARENT_INTERACT_ID":"PARENT_INTERACT_ID", "PATIENT_ID":"\"PatientID\"" }}`,
};
const fakeConnection = MockHdb.getConnection([globalSetting]);
const facade = new ConfigFacade(
  fakeConnection,
  new FfhQeConfig(
    fakeConnection as ConnectionInterface,
    fakeConnection as ConnectionInterface,
    new AssignmentProxy([]),
    new Settings(),
    new User("TEST_USER")
  )
);
const ffhQeConfig = facade.getFfhQeConfig();
describe("Testing ConfigFacade,", () => {
  /* it("request.action=\"getFrontendConfig\" should call FfhQeConfig.getFrontendConfig()", function () {
         spyOn(facade, "invokeService").and.callThrough();
         spyOn(ffhQeConfig, "getFrontendConfig");
         let request = {
             "action": "getFrontendConfig"
         };
         facade.invokeService(request, function (err, data) {
             expect(ffhQeConfig.getFrontendConfig).toHaveBeenCalled();
         });
     });*/
  it('request.action="getAdminConfig" should call FfhQeConfig.getAdminConfig()', () => {
    spyOn(facade, "invokeService").and.callThrough();
    spyOn(ffhQeConfig, "getAdminConfig");
    const request = {
      action: "getAdminConfig",
    };
    facade.invokeService(request, (err, data) => {
      expect(ffhQeConfig.getAdminConfig).toHaveBeenCalled();
    });
  });
  it('request.action="countDependingConfig" should call FfhQeConfig.countDependingConfig()', () => {
    spyOn(facade, "invokeService").and.callThrough();
    spyOn(ffhQeConfig, "countDependingConfig");
    const request = {
      action: "countDependingConfig",
    };
    facade.invokeService(request, (err, data) => {
      expect(ffhQeConfig.countDependingConfig).toHaveBeenCalled();
    });
  });
  it('request.action="delete" should call FfhQeConfig.deleteConfig()', () => {
    spyOn(facade, "invokeService").and.callThrough();
    spyOn(ffhQeConfig, "deleteConfig");
    const request = {
      action: "delete",
    };
    facade.invokeService(request, () => {
      expect(ffhQeConfig.deleteConfig).toHaveBeenCalled();
    });
  });
  it('request.action="validate" should call FfhQeConfig.validateConfig()', () => {
    spyOn(facade, "invokeService").and.callThrough();
    spyOn(ffhQeConfig, "validateCDMConfigAndTableMappings");
    const request = {
      action: "validate",
    };
    facade.invokeService(request, () => {
      expect(ffhQeConfig.validateCDMConfigAndTableMappings).toHaveBeenCalled();
    });
  });
  it('request.action="save" should call FfhQeConfig.saveConfig()', () => {
    spyOn(facade, "invokeService").and.callThrough();
    spyOn(ffhQeConfig, "saveConfig");
    const request = {
      action: "save",
    };
    facade.invokeService(request, () => {
      expect(ffhQeConfig.saveConfig).toHaveBeenCalled();
    });
  });
  it('request.action="autosave" should call FfhQeConfig.autoSaveConfig()', () => {
    spyOn(facade, "invokeService").and.callThrough();
    spyOn(ffhQeConfig, "autoSaveConfig");
    const request = {
      action: "autosave",
    };
    facade.invokeService(request, () => {
      expect(ffhQeConfig.autoSaveConfig).toHaveBeenCalled();
    });
  });
  it('request.action="activate" should call FfhQeConfig.activateConfig()', () => {
    spyOn(facade, "invokeService").and.callThrough();
    spyOn(ffhQeConfig, "activateConfig");
    const request = {
      action: "activate",
    };
    facade.invokeService(request, () => {
      expect(ffhQeConfig.activateConfig).toHaveBeenCalled();
    });
  });
  it('request.action="suggest" should call FfhQeConfig.suggestConfig()', () => {
    spyOn(facade, "invokeService").and.callThrough();
    spyOn(ffhQeConfig, "suggestConfig");
    const request = {
      action: "suggest",
    };
    facade.invokeService(request, () => {
      expect(ffhQeConfig.suggestConfig).toHaveBeenCalled();
    });
  });
  it('request.action="configDefaults" should call FfhQeConfig.blankConfig()', () => {
    spyOn(facade, "invokeService").and.callThrough();
    spyOn(ffhQeConfig, "blankConfig");
    const request = {
      action: "configDefaults",
    };
    facade.invokeService(request, () => {
      expect(ffhQeConfig.blankConfig).toHaveBeenCalled();
    });
  });
  it('request.action="getMy" should call FfhQeConfig.getUserConfigs()', () => {
    spyOn(facade, "invokeService").and.callThrough();
    spyOn(ffhQeConfig, "getUserConfigs");
    const request = {
      action: "getMy",
    };
    facade.invokeService(request, () => {
      expect(ffhQeConfig.getUserConfigs).toHaveBeenCalled();
    });
  });
  it('request.action="getAll" should call FfhQeConfig.getAllConfigs()', () => {
    spyOn(facade, "invokeService").and.callThrough();
    spyOn(ffhQeConfig, "getAllConfigs");
    const request = {
      action: "getAll",
    };
    facade.invokeService(request, () => {
      expect(ffhQeConfig.getAllConfigs).toHaveBeenCalled();
    });
  });
  it('request.action="template" should call FfhQeConfig.templateConfig()', () => {
    spyOn(facade, "invokeService").and.callThrough();
    spyOn(ffhQeConfig, "templateConfig");
    const request = {
      action: "template",
    };
    facade.invokeService(request, () => {
      expect(ffhQeConfig.templateConfig).toHaveBeenCalled();
    });
  });
  it('request.action="!@#$%" should throw error for invalid action string', () => {
    spyOn(facade, "invokeService").and.callThrough();
    spyOn(ffhQeConfig, "templateConfig");
    const request = {
      action: "!@#$",
    };
    facade.invokeService(request, (err) => {
      expect(err.message).toEqual("CDW_CONFIG_ERROR_ACTION_NOT_SUPPORTED");
    });
  });
});
