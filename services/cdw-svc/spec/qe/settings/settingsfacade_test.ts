"use strict";

import { SettingsFacade } from "../../../src/qe/settings/SettingsFacade";
import { MockConnection as MockConnection } from "../../testutils/testenv/MockConnection";
import { MockHdb } from "../../testutils/testenv/mockHdb";
let conn = new MockConnection();
let globalSetting = {
  Id: "GlobalSettings",
  Version: "A",
  Status: "A",
  Name: "GLOBAL",
  Type: "HC/HPH/GLOBAL",
  // tslint:disable-next-line: max-line-length
  Data: `{"tableMapping":{"@INTERACTION":"CDMDEFAULT.\"legacy.cdw.db.models::DWViews.Interactions\"", "@OBS":"CDMDEFAULT.\"legacy.cdw.db.models::DWViews.Observations\"", "@CODE":"CDMDEFAULT.\"legacy.cdw.db.models::DWViewsEAV.Interaction_Details\"", "@MEASURE":"CDMDEFAULT.\"legacy.cdw.db.models::DWViewsEAV.Interaction_Measures\"", "@REF":"CDMDEFAULT.\"legacy.ots::Views.ConceptPreferredTerms\"", "@PATIENT":"CDMDEFAULT.\"legacy.cdw.db.models::DWViews.Patient\"", "@TEXT":"CDMDEFAULT.\"legacy.cdw.db.models::DWViewsEAV.Interaction_Text\""},"guardedTableMapping":{ "@PATIENT":"\"CDMDEFAULT\".\"legacy.cdw.db.models::DWViews.V_GuardedPatient\"" },"language":["en", "de", "fr"], "settings":{ "fuzziness":0.7, "maxResultSize":5000, "sqlReturnOn":true, "errorDetailsReturnOn":true, "errorStackTraceReturnOn":true, "hhpSchemaName":"CDMDEFAULT", "refSchemaName":"CDMDEFAULT", "kaplanMeierTable":"CDMDEFAULT.\"pa.db::MRIEntities.KaplanMeierInput\"", "medexSchemaName":"CDMDEFAULT", "vbEnabled":true},"columnMap":{ "CONDITION_ID":"\"ConditionID\"", "INTERACTION_ID":"\"InteractionID\"", "PARENT_INTERACT_ID":"PARENT_INTERACT_ID", "PATIENT_ID":"\"PatientID\"" }}`,
};

let fakeConnection = MockHdb.getConnection([globalSetting]);
let facade = new SettingsFacade(fakeConnection);
let settings = facade.getSettings();
let dbMeta = facade.getDbMeta();
const actionKey = "action";

describe("Testing SettingsFacade,", () => {
  it('request.action="getDefaultSettings" should call Settings.getDefaultGlobalSettings()', () => {
    spyOn(facade, "invokeAdminServices").and.callThrough();
    spyOn(settings, "getDefaultAdvancedSettings");
    let request = {};
    request[actionKey] = "getDefaultSettings";
    facade.invokeAdminServices(request, (err, data) => {
      expect(settings.getDefaultAdvancedSettings).toHaveBeenCalled();
    });
  });
  it('request.action="getColumns" should call DbMeta.getColumns()', () => {
    spyOn(facade, "invokeAdminServices").and.callThrough();
    spyOn(dbMeta, "getColumns");
    let request = {};
    request[actionKey] = "getColumns";
    facade.invokeAdminServices(request, (err, data) => {
      expect(dbMeta.getColumns).toHaveBeenCalled();
    });
  });
});
