import { User } from "@alp/alp-base-utils";
import { CDWServicesFacade } from "../../../src/qe/config/CDWServicesFacade";
import { FfhQeConfig } from "../../../src/qe/config/config";
import { AssignmentProxy } from "../../../src/AssignmentProxy";

import { Settings } from "../../../src/qe/settings/Settings";
import { MockHdb } from "../../testutils/testenv/mockHdb";
/*
let attributeInfosServiceLib = qe.attribute_infos_service;
let columnSuggestionServiceLib = qe.column_suggestion_service;
let domainValuesServiceLib = qe.domain_values_service;
let tableSuggestionServiceLib = qe.table_suggestion_service;
*/
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
const facade = new CDWServicesFacade(
  fakeConnection,
  new FfhQeConfig(
    fakeConnection,
    fakeConnection,
    new AssignmentProxy([]),
    new Settings(),
    new User("TEST_USER")
  )
);

/*
TODOTODOTODO TODO: reenable
describe("Testing CDWServicesFacade,", function () {
    it("request.action=\"attribute_infos_service\" should call attribute_infos_service.processRequest()", function () {
        spyOn(facade, "invokeService").and.callThrough();
        spyOn(ffhQeConfig, "validateConfig").and.callFake(function () {
            return { valid: true };
        });
        spyOn(attributeInfosServiceLib, "processRequest");
        let action = "attribute_infos_service";
        let body = {};
        facade.invokeService(action, body, true, function (err, data) {
            expect(ffhQeConfig.validateConfig).toHaveBeenCalled();
            expect(attributeInfosServiceLib.processRequest).toHaveBeenCalled();
        });
    });
    it("request.action=\"attribute_infos_service\" should throw error during config validation", function () {
        spyOn(facade, "invokeService").and.callThrough();
        spyOn(ffhQeConfig, "validateConfig").and.callFake(function () {
            return { valid: false };
        });
        spyOn(attributeInfosServiceLib, "processRequest");
        let action = "attribute_infos_service";
        let body = {};
        facade.invokeService(action, body, true, function (err, data) {
            expect(err.message).toEqual("HPH_CDM_CFG_VALIDITY_ERROR");
        });
    });
    it("request.action=\"domain_values_service\" should call domain_values_service.processRequest()", function () {
        spyOn(facade, "invokeService").and.callThrough();
        spyOn(ffhQeConfig, "validateConfig").and.callFake(function () {
            return { valid: true };
        });
        spyOn(domainValuesServiceLib, "processRequest");
        let action = "domain_values_service";
        let body = {};
        facade.invokeService(action, body, true, function (err, data) {
            expect(ffhQeConfig.validateConfig).toHaveBeenCalled();
            expect(domainValuesServiceLib.processRequest).toHaveBeenCalled();
        });
    });
    it("request.action=\"domain_values_service\" should throw error during config validation", function () {
        spyOn(facade, "invokeService").and.callThrough();
        spyOn(ffhQeConfig, "validateConfig").and.callFake(function () {
            return { valid: false };
        });
        spyOn(domainValuesServiceLib, "processRequest");
        let action = "domain_values_service";
        let body = {};
        facade.invokeService(action, body, true, function (err, data) {
            expect(err.message).toEqual("HPH_CDM_CFG_VALIDITY_ERROR");
        });
    });
    it("request.action=\"table_suggestion_service\" should call table_suggestion_service.processRequest()",
        function () {
            spyOn(facade, "invokeService");
            spyOn(tableSuggestionServiceLib, "processRequest");
            let action = "table_suggestion_service";
            let body = {};
            facade.invokeService(action, body, true, function (err, data) {
                expect(ffhQeConfig.validateConfig).toHaveBeenCalled();
                expect(tableSuggestionServiceLib.processRequest).toHaveBeenCalled();
            });
        });
    it("request.action=\"column_suggestion_service\" should call column_suggestion_service.processRequest()",
        function () {
            spyOn(facade, "invokeService");
            spyOn(columnSuggestionServiceLib, "processRequest");
            let action = "column_suggestion_service";
            let body = {};
            facade.invokeService(action, body, true, function (err, data) {
                expect(ffhQeConfig.validateConfig).toHaveBeenCalled();
                expect(columnSuggestionServiceLib.processRequest).toHaveBeenCalled();
            });
        });
    it("request.action=\"!@#$%\" should throw error for invalid action string", function () {
        spyOn(facade, "invokeService").and.callThrough();
        spyOn(ffhQeConfig, "validateConfig").and.callFake(function () {
            return { valid: true };
        });
        spyOn(domainValuesServiceLib, "processRequest");
        let action = "!@#$%";
        let body = {};
        facade.invokeService(action, body, true, function (err, data) {
            expect(err.message).toEqual("CDW_SERVICES_ERROR_ACTION_NOT_SUPPORTED");
        });
    });
});*/
