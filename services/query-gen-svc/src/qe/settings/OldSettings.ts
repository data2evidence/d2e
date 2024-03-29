import { utils as Utils } from "@alp/alp-base-utils";

const patient_id = `"PATIENT_ID"`;
const interaction_id = `"INTERACTION_ID"`;
const condition_id = `"CONDITION_ID"`;
const parent_interact_id = `"PARENT_INTERACT_ID"`;
const start = `"START"`;
const end = `"END"`;
const observation_id = `"OBS_ID"`;

// List of all languages supported by the system for configurations
const defaultSupportedLanguages: string[] = ["en", "de", "fr"];

const defaultInterfaceViewsGuardedPholderTable =
    '$$SCHEMA$$."VIEW::OMOP.GDM.PATIENT"';

// Default placeholder-to-table mapping without restricting access
// Using InterfaceViews
const defaultInterfaceViewsPholderTableMap: PholderTableMapType = {
    "@COND": '$$SCHEMA$$."VIEW::OMOP.COND"',
    "@COND.PATIENT_ID": '"PATIENT_ID"',
    "@COND.INTERACTION_ID": '"CONDITION_OCCURRENCE_ID"',
    "@COND.CONDITION_ID": '"CONDITION_OCCURRENCE_ID"',
    "@COND.PARENT_INTERACT_ID": '"CONDITION_OCCURRENCE_ID"',
    "@COND.START": '"CONDITION_START_DATE"',
    "@COND.END": '"CONDITION_END_DATE"',
    "@COND.INTERACTION_TYPE": '"CONDITION_TYPE_NAME"',
    "@VISIT": '$$SCHEMA$$."VIEW::OMOP.VISIT"',
    "@VISIT.PATIENT_ID": '"PATIENT_ID"',
    "@VISIT.INTERACTION_ID": '"VISIT_OCCURRENCE_ID"',
    "@VISIT.CONDITION_ID": '"VISIT_OCCURRENCE_ID"',
    "@VISIT.PARENT_INTERACT_ID": '"VISIT_OCCURRENCE_ID"',
    "@VISIT.START": '"VISIT_START_DATE"',
    "@VISIT.END": '"VISIT_END_DATE"',
    "@VISIT.INTERACTION_TYPE": '"VISIT_TYPE_NAME"',
    "@CONDERA": '$$SCHEMA$$."VIEW::OMOP.COND_ERA"',
    "@CONDERA.PATIENT_ID": '"PATIENT_ID"',
    "@CONDERA.INTERACTION_ID": '"CONDITION_ERA_ID"',
    "@CONDERA.CONDITION_ID": '"CONDITION_ERA_ID"',
    "@CONDERA.PARENT_INTERACT_ID": '"CONDITION_ERA_ID"',
    "@CONDERA.START": '"CONDITION_ERA_START_DATE"',
    "@CONDERA.END": '"CONDITION_ERA_END_DATE"',
    "@CONDERA.INTERACTION_TYPE": '"CONDITION_NAME"',
    "@DEATH": '$$SCHEMA$$."VIEW::OMOP.DEATH"',
    "@DEATH.PATIENT_ID": '"PATIENT_ID"',
    "@DEATH.INTERACTION_ID": '"PATIENT_ID"',
    "@DEATH.CONDITION_ID": '"PATIENT_ID"',
    "@DEATH.PARENT_INTERACT_ID": '"PATIENT_ID"',
    "@DEATH.START": '"DEATH_DATE"',
    "@DEATH.END": '"DEATH_DATE"',
    "@DEATH.INTERACTION_TYPE": '"DEATH_TYPE_NAME"',
    "@DEVEXP": '$$SCHEMA$$."VIEW::OMOP.DEVICE_EXPOSURE"',
    "@DEVEXP.PATIENT_ID": '"PATIENT_ID"',
    "@DEVEXP.INTERACTION_ID": '"DEVICE_EXPOSURE_ID"',
    "@DEVEXP.CONDITION_ID": '"DEVICE_EXPOSURE_ID"',
    "@DEVEXP.PARENT_INTERACT_ID": '"DEVICE_EXPOSURE_ID"',
    "@DEVEXP.START": '"DEVICE_EXPOSURE_START_DATE"',
    "@DEVEXP.END": '"DEVICE_EXPOSURE_END_DATE"',
    "@DEVEXP.INTERACTION_TYPE": '"DEVICE_TYPE_NAME"',
    "@DOSEERA": '$$SCHEMA$$."VIEW::OMOP.DOSE_ERA"',
    "@DOSEERA.PATIENT_ID": '"PATIENT_ID"',
    "@DOSEERA.INTERACTION_ID": '"DOSE_ERA_ID"',
    "@DOSEERA.CONDITION_ID": '"DOSE_ERA_ID"',
    "@DOSEERA.PARENT_INTERACT_ID": '"DOSE_ERA_ID"',
    "@DOSEERA.START": '"DOSE_ERA_START_DATE"',
    "@DOSEERA.END": '"DOSE_ERA_END_DATE"',
    "@DOSEERA.INTERACTION_TYPE": '"DRUG_NAME"',
    "@DRUGERA": '$$SCHEMA$$."VIEW::OMOP.DRUG_ERA"',
    "@DRUGERA.PATIENT_ID": '"PATIENT_ID"',
    "@DRUGERA.INTERACTION_ID": '"DRUG_ERA_ID"',
    "@DRUGERA.CONDITION_ID": '"DRUG_ERA_ID"',
    "@DRUGERA.PARENT_INTERACT_ID": '"DRUG_ERA_ID"',
    "@DRUGERA.START": '"DRUG_ERA_START_DATE"',
    "@DRUGERA.END": '"DRUG_ERA_END_DATE"',
    "@DRUGERA.INTERACTION_TYPE": '"DRUG_NAME"',
    "@DRUGEXP": '$$SCHEMA$$."VIEW::OMOP.DRUG_EXP"',
    "@DRUGEXP.PATIENT_ID": '"PATIENT_ID"',
    "@DRUGEXP.INTERACTION_ID": '"DRUG_EXPOSURE_ID"',
    "@DRUGEXP.CONDITION_ID": '"DRUG_EXPOSURE_ID"',
    "@DRUGEXP.PARENT_INTERACT_ID": '"DRUG_EXPOSURE_ID"',
    "@DRUGEXP.START": '"DRUG_EXPOSURE_START_DATE"',
    "@DRUGEXP.END": '"DRUG_EXPOSURE_END_DATE"',
    "@DRUGEXP.INTERACTION_TYPE": '"DRUG_TYPE_NAME"',
    "@OBS": '$$SCHEMA$$."VIEW::OMOP.OBS"',
    "@OBS.PATIENT_ID": '"PATIENT_ID"',
    "@OBS.INTERACTION_ID": '"OBSERVATION_ID"',
    "@OBS.CONDITION_ID": '"OBSERVATION_ID"',
    "@OBS.PARENT_INTERACT_ID": '"OBSERVATION_ID"',
    "@OBS.START": '"OBSERVATION_DATE"',
    "@OBS.END": '"OBSERVATION_DATE"',
    "@OBS.INTERACTION_TYPE": '"OBSERVATION_TYPE_NAME"',
    "@OBSPER": '$$SCHEMA$$."VIEW::OMOP.OBS_PER"',
    "@OBSPER.PATIENT_ID": '"PATIENT_ID"',
    "@OBSPER.INTERACTION_ID": '"OBSERVATION_PERIOD_ID"',
    "@OBSPER.CONDITION_ID": '"OBSERVATION_PERIOD_ID"',
    "@OBSPER.PARENT_INTERACT_ID": '"OBSERVATION_PERIOD_ID"',
    "@OBSPER.START": '"OBSERVATION_PERIOD_START_DATE"',
    "@OBSPER.END": '"OBSERVATION_PERIOD_END_DATE"',
    "@OBSPER.INTERACTION_TYPE": '"PERIOD_TYPE_NAME"',
    "@PPPER": '$$SCHEMA$$."VIEW::OMOP.PP_PER"',
    "@PPPER.PATIENT_ID": '"PATIENT_ID"',
    "@PPPER.INTERACTION_ID": '"PAYER_PLAN_PERIOD_ID"',
    "@PPPER.CONDITION_ID": '"PAYER_PLAN_PERIOD_ID"',
    "@PPPER.PARENT_INTERACT_ID": '"PAYER_PLAN_PERIOD_ID"',
    "@PPPER.START": '"PAYER_PLAN_PERIOD_START_DATE"',
    "@PPPER.END": '"PAYER_PLAN_PERIOD_END_DATE"',
    "@PPPER.INTERACTION_TYPE": '"PLAN_SOURCE_VALUE"',
    "@SPEC": '$$SCHEMA$$."VIEW::OMOP.SPEC"',
    "@SPEC.PATIENT_ID": '"PATIENT_ID"',
    "@SPEC.INTERACTION_ID": '"SPECIMEN_ID"',
    "@SPEC.CONDITION_ID": '"SPECIMEN_ID"',
    "@SPEC.PARENT_INTERACT_ID": '"SPECIMEN_ID"',
    "@SPEC.START": '"SPECIMEN_DATE"',
    "@SPEC.END": '"SPECIMEN_DATE"',
    "@SPEC.INTERACTION_TYPE": '"SPECIMEN_TYPE_NAME"',
    "@MEAS": '$$SCHEMA$$."VIEW::OMOP.MEAS"',
    "@MEAS.PATIENT_ID": '"PATIENT_ID"',
    "@MEAS.INTERACTION_ID": '"MEASUREMENT_ID"',
    "@MEAS.CONDITION_ID": '"MEASUREMENT_ID"',
    "@MEAS.PARENT_INTERACT_ID": '"MEASUREMENT_ID"',
    "@MEAS.START": '"MEASUREMENT_DATE"',
    "@MEAS.END": '"MEASUREMENT_DATE"',
    "@MEAS.INTERACTION_TYPE": '"MEASUREMENT_TYPE_NAME"',
    "@PROC": '$$SCHEMA$$."VIEW::OMOP.PROC"',
    "@PROC.PATIENT_ID": '"PATIENT_ID"',
    "@PROC.INTERACTION_ID": '"PROCEDURE_OCCURRENCE_ID"',
    "@PROC.CONDITION_ID": '"PROCEDURE_OCCURRENCE_ID"',
    "@PROC.PARENT_INTERACT_ID": '"PROCEDURE_OCCURRENCE_ID"',
    "@PROC.START": '"PROCEDURE_DATE"',
    "@PROC.END": '"PROCEDURE_DATE"',
    "@PROC.INTERACTION_TYPE": '"PROCEDURE_TYPE_NAME"',
    "@CONSENT": '$$SCHEMA$$."VIEW::GDM.CONSENT_BASE"',
    "@CONSENT.PATIENT_ID": '"PERSON_ID"',
    "@CONSENT.INTERACTION_ID": '"ID"',
    "@CONSENT.CONDITION_ID": '"ID"',
    "@CONSENT.PARENT_INTERACT_ID": '"PARENT_CONSENT_DETAIL_ID"',
    "@CONSENT.START": '"CREATED_AT"',
    "@CONSENT.END": '"CREATED_AT"',
    "@CONSENT.INTERACTION_TYPE": '"TYPE"',
    "@RESPONSE": '$$SCHEMA$$."VIEW::GDM.QUESTIONNAIRE_RESPONSE_BASE"',
    "@RESPONSE.PATIENT_ID": '"PERSON_ID"',
    "@RESPONSE.INTERACTION_ID": '"ID"',
    "@RESPONSE.CONDITION_ID": '"ID"',
    "@RESPONSE.PARENT_INTERACT_ID": '"ANSWER_ID"',
    "@RESPONSE.START": '"AUTHORED"',
    "@RESPONSE.END": '"AUTHORED"',
    "@RESPONSE.INTERACTION_TYPE": '"ANSWER_ID"',
    "@PTOKEN": '$$SCHEMA$$."VIEW::OMOP.PARTICIPANT_TOKEN"',
    "@PTOKEN.PATIENT_ID": '"PERSON_ID"',
    "@PTOKEN.INTERACTION_ID": '"ID"',
    "@PTOKEN.CONDITION_ID": '"ID"',
    "@PTOKEN.PARENT_INTERACT_ID": '"ID"',
    "@PTOKEN.START": '"CREATED_DATE"',
    "@PTOKEN.END": '"CREATED_DATE"',
    "@PTOKEN.INTERACTION_TYPE": '"TOKEN"',
    "@PATIENT": '$$SCHEMA$$."VIEW::OMOP.GDM.PATIENT"',
    "@PATIENT.PATIENT_ID": '"PATIENT_ID"',
    "@PATIENT.DOD": '"DEATH_DATE"',
    "@PATIENT.DOB": '"BIRTH_DATE"',
    "@REF": '"CDMVOCAB"."CONCEPT"',
    "@REF.VOCABULARY_ID": '"VOCABULARY_ID"',
    "@REF.CODE": '"CONCEPT_ID"',
    "@REF.TEXT": '"CONCEPT_NAME"',
    "@TEXT": '"CDMVOCAB"."CONCEPT"',
    "@TEXT.INTERACTION_ID": '"CONCEPT_ID"',
    "@TEXT.INTERACTION_TEXT_ID": '"CONCEPT_ID"',
    "@TEXT.VALUE": '"CONCEPT_NAME"',
};

// Using DwViews
const defaultPholderTableMap: PholderTableMapType = {
    "@COND": '$$SCHEMA$$."VIEW::OMOP.COND"',
    "@COND.PATIENT_ID": '"PATIENT_ID"',
    "@COND.INTERACTION_ID": '"CONDITION_OCCURRENCE_ID"',
    "@COND.CONDITION_ID": '"CONDITION_OCCURRENCE_ID"',
    "@COND.PARENT_INTERACT_ID": '"CONDITION_OCCURRENCE_ID"',
    "@COND.START": '"CONDITION_START_DATE"',
    "@COND.END": '"CONDITION_END_DATE"',
    "@COND.INTERACTION_TYPE": '"CONDITION_TYPE_NAME"',
    "@VISIT": '$$SCHEMA$$."VIEW::OMOP.VISIT"',
    "@VISIT.PATIENT_ID": '"PATIENT_ID"',
    "@VISIT.INTERACTION_ID": '"VISIT_OCCURRENCE_ID"',
    "@VISIT.CONDITION_ID": '"VISIT_OCCURRENCE_ID"',
    "@VISIT.PARENT_INTERACT_ID": '"VISIT_OCCURRENCE_ID"',
    "@VISIT.START": '"VISIT_START_DATE"',
    "@VISIT.END": '"VISIT_END_DATE"',
    "@VISIT.INTERACTION_TYPE": '"VISIT_TYPE_NAME"',
    "@CONDERA": '$$SCHEMA$$."VIEW::OMOP.COND_ERA"',
    "@CONDERA.PATIENT_ID": '"PATIENT_ID"',
    "@CONDERA.INTERACTION_ID": '"CONDITION_ERA_ID"',
    "@CONDERA.CONDITION_ID": '"CONDITION_ERA_ID"',
    "@CONDERA.PARENT_INTERACT_ID": '"CONDITION_ERA_ID"',
    "@CONDERA.START": '"CONDITION_ERA_START_DATE"',
    "@CONDERA.END": '"CONDITION_ERA_END_DATE"',
    "@CONDERA.INTERACTION_TYPE": '"CONDITION_NAME"',
    "@DEATH": '$$SCHEMA$$."VIEW::OMOP.DEATH"',
    "@DEATH.PATIENT_ID": '"PATIENT_ID"',
    "@DEATH.INTERACTION_ID": '"PATIENT_ID"',
    "@DEATH.CONDITION_ID": '"PATIENT_ID"',
    "@DEATH.PARENT_INTERACT_ID": '"PATIENT_ID"',
    "@DEATH.START": '"DEATH_DATE"',
    "@DEATH.END": '"DEATH_DATE"',
    "@DEATH.INTERACTION_TYPE": '"DEATH_TYPE_NAME"',
    "@DEVEXP": '$$SCHEMA$$."VIEW::OMOP.DEVICE_EXPOSURE"',
    "@DEVEXP.PATIENT_ID": '"PATIENT_ID"',
    "@DEVEXP.INTERACTION_ID": '"DEVICE_EXPOSURE_ID"',
    "@DEVEXP.CONDITION_ID": '"DEVICE_EXPOSURE_ID"',
    "@DEVEXP.PARENT_INTERACT_ID": '"DEVICE_EXPOSURE_ID"',
    "@DEVEXP.START": '"DEVICE_EXPOSURE_START_DATE"',
    "@DEVEXP.END": '"DEVICE_EXPOSURE_END_DATE"',
    "@DEVEXP.INTERACTION_TYPE": '"DEVICE_TYPE_NAME"',
    "@DOSEERA": '$$SCHEMA$$."VIEW::OMOP.DOSE_ERA"',
    "@DOSEERA.PATIENT_ID": '"PATIENT_ID"',
    "@DOSEERA.INTERACTION_ID": '"DOSE_ERA_ID"',
    "@DOSEERA.CONDITION_ID": '"DOSE_ERA_ID"',
    "@DOSEERA.PARENT_INTERACT_ID": '"DOSE_ERA_ID"',
    "@DOSEERA.START": '"DOSE_ERA_START_DATE"',
    "@DOSEERA.END": '"DOSE_ERA_END_DATE"',
    "@DOSEERA.INTERACTION_TYPE": '"DRUG_NAME"',
    "@DRUGERA": '$$SCHEMA$$."VIEW::OMOP.DRUG_ERA"',
    "@DRUGERA.PATIENT_ID": '"PATIENT_ID"',
    "@DRUGERA.INTERACTION_ID": '"DRUG_ERA_ID"',
    "@DRUGERA.CONDITION_ID": '"DRUG_ERA_ID"',
    "@DRUGERA.PARENT_INTERACT_ID": '"DRUG_ERA_ID"',
    "@DRUGERA.START": '"DRUG_ERA_START_DATE"',
    "@DRUGERA.END": '"DRUG_ERA_END_DATE"',
    "@DRUGERA.INTERACTION_TYPE": '"DRUG_NAME"',
    "@DRUGEXP": '$$SCHEMA$$."VIEW::OMOP.DRUG_EXP"',
    "@DRUGEXP.PATIENT_ID": '"PATIENT_ID"',
    "@DRUGEXP.INTERACTION_ID": '"DRUG_EXPOSURE_ID"',
    "@DRUGEXP.CONDITION_ID": '"DRUG_EXPOSURE_ID"',
    "@DRUGEXP.PARENT_INTERACT_ID": '"DRUG_EXPOSURE_ID"',
    "@DRUGEXP.START": '"DRUG_EXPOSURE_START_DATE"',
    "@DRUGEXP.END": '"DRUG_EXPOSURE_END_DATE"',
    "@DRUGEXP.INTERACTION_TYPE": '"DRUG_TYPE_NAME"',
    "@OBS": '$$SCHEMA$$."VIEW::OMOP.OBS"',
    "@OBS.PATIENT_ID": '"PATIENT_ID"',
    "@OBS.INTERACTION_ID": '"OBSERVATION_ID"',
    "@OBS.CONDITION_ID": '"OBSERVATION_ID"',
    "@OBS.PARENT_INTERACT_ID": '"OBSERVATION_ID"',
    "@OBS.START": '"OBSERVATION_DATE"',
    "@OBS.END": '"OBSERVATION_DATE"',
    "@OBS.INTERACTION_TYPE": '"OBSERVATION_TYPE_NAME"',
    "@OBSPER": '$$SCHEMA$$."VIEW::OMOP.OBS_PER"',
    "@OBSPER.PATIENT_ID": '"PATIENT_ID"',
    "@OBSPER.INTERACTION_ID": '"OBSERVATION_PERIOD_ID"',
    "@OBSPER.CONDITION_ID": '"OBSERVATION_PERIOD_ID"',
    "@OBSPER.PARENT_INTERACT_ID": '"OBSERVATION_PERIOD_ID"',
    "@OBSPER.START": '"OBSERVATION_PERIOD_START_DATE"',
    "@OBSPER.END": '"OBSERVATION_PERIOD_END_DATE"',
    "@OBSPER.INTERACTION_TYPE": '"PERIOD_TYPE_NAME"',
    "@PPPER": '$$SCHEMA$$."VIEW::OMOP.PP_PER"',
    "@PPPER.PATIENT_ID": '"PATIENT_ID"',
    "@PPPER.INTERACTION_ID": '"PAYER_PLAN_PERIOD_ID"',
    "@PPPER.CONDITION_ID": '"PAYER_PLAN_PERIOD_ID"',
    "@PPPER.PARENT_INTERACT_ID": '"PAYER_PLAN_PERIOD_ID"',
    "@PPPER.START": '"PAYER_PLAN_PERIOD_START_DATE"',
    "@PPPER.END": '"PAYER_PLAN_PERIOD_END_DATE"',
    "@PPPER.INTERACTION_TYPE": '"PLAN_SOURCE_VALUE"',
    "@SPEC": '$$SCHEMA$$."VIEW::OMOP.SPEC"',
    "@SPEC.PATIENT_ID": '"PATIENT_ID"',
    "@SPEC.INTERACTION_ID": '"SPECIMEN_ID"',
    "@SPEC.CONDITION_ID": '"SPECIMEN_ID"',
    "@SPEC.PARENT_INTERACT_ID": '"SPECIMEN_ID"',
    "@SPEC.START": '"SPECIMEN_DATE"',
    "@SPEC.END": '"SPECIMEN_DATE"',
    "@SPEC.INTERACTION_TYPE": '"SPECIMEN_TYPE_NAME"',
    "@MEAS": '$$SCHEMA$$."VIEW::OMOP.MEAS"',
    "@MEAS.PATIENT_ID": '"PATIENT_ID"',
    "@MEAS.INTERACTION_ID": '"MEASUREMENT_ID"',
    "@MEAS.CONDITION_ID": '"MEASUREMENT_ID"',
    "@MEAS.PARENT_INTERACT_ID": '"MEASUREMENT_ID"',
    "@MEAS.START": '"MEASUREMENT_DATE"',
    "@MEAS.END": '"MEASUREMENT_DATE"',
    "@MEAS.INTERACTION_TYPE": '"MEASUREMENT_TYPE_NAME"',
    "@PROC": '$$SCHEMA$$."VIEW::OMOP.PROC"',
    "@PROC.PATIENT_ID": '"PATIENT_ID"',
    "@PROC.INTERACTION_ID": '"PROCEDURE_OCCURRENCE_ID"',
    "@PROC.CONDITION_ID": '"PROCEDURE_OCCURRENCE_ID"',
    "@PROC.PARENT_INTERACT_ID": '"PROCEDURE_OCCURRENCE_ID"',
    "@PROC.START": '"PROCEDURE_DATE"',
    "@PROC.END": '"PROCEDURE_DATE"',
    "@PROC.INTERACTION_TYPE": '"PROCEDURE_TYPE_NAME"',
    "@CONSENT": '$$SCHEMA$$."VIEW::GDM.CONSENT_BASE"',
    "@CONSENT.PATIENT_ID": '"PERSON_ID"',
    "@CONSENT.INTERACTION_ID": '"ID"',
    "@CONSENT.CONDITION_ID": '"ID"',
    "@CONSENT.PARENT_INTERACT_ID": '"PARENT_CONSENT_DETAIL_ID"',
    "@CONSENT.START": '"CREATED_AT"',
    "@CONSENT.END": '"CREATED_AT"',
    "@CONSENT.INTERACTION_TYPE": '"TYPE"',
    "@RESPONSE": '$$SCHEMA$$."VIEW::GDM.QUESTIONNAIRE_RESPONSE_BASE"',
    "@RESPONSE.PATIENT_ID": '"PERSON_ID"',
    "@RESPONSE.INTERACTION_ID": '"ID"',
    "@RESPONSE.CONDITION_ID": '"ID"',
    "@RESPONSE.PARENT_INTERACT_ID": '"ANSWER_ID"',
    "@RESPONSE.START": '"AUTHORED"',
    "@RESPONSE.END": '"AUTHORED"',
    "@RESPONSE.INTERACTION_TYPE": '"ANSWER_ID"',
    "@PTOKEN": '$$SCHEMA$$."VIEW::OMOP.PARTICIPANT_TOKEN"',
    "@PTOKEN.PATIENT_ID": '"PERSON_ID"',
    "@PTOKEN.INTERACTION_ID": '"ID"',
    "@PTOKEN.CONDITION_ID": '"ID"',
    "@PTOKEN.PARENT_INTERACT_ID": '"ID"',
    "@PTOKEN.START": '"CREATED_DATE"',
    "@PTOKEN.END": '"CREATED_DATE"',
    "@PTOKEN.INTERACTION_TYPE": '"TOKEN"',
    "@PATIENT": '$$SCHEMA$$."VIEW::OMOP.GDM.PATIENT"',
    "@PATIENT.PATIENT_ID": '"PATIENT_ID"',
    "@PATIENT.DOD": '"DEATH_DATE"',
    "@PATIENT.DOB": '"BIRTH_DATE"',
    "@REF": '"CDMVOCAB"."CONCEPT"',
    "@REF.VOCABULARY_ID": '"VOCABULARY_ID"',
    "@REF.CODE": '"CONCEPT_ID"',
    "@REF.TEXT": '"CONCEPT_NAME"',
    "@TEXT": '"CDMVOCAB"."CONCEPT"',
    "@TEXT.INTERACTION_ID": '"CONCEPT_ID"',
    "@TEXT.INTERACTION_TEXT_ID": '"CONCEPT_ID"',
    "@TEXT.VALUE": '"CONCEPT_NAME"',
};

const defaultSettings: GlobalSettingsType = {
    // Text search fuzziness
    fuzziness: 0.7,
    maxResultSize: 5000,
    // flags controlling the information which is returned from backend
    // Note: all flags should be set to false for productive systems
    sqlReturnOn: false,
    errorDetailsReturnOn: false,
    errorStackTraceReturnOn: false,
    vbEnabled: true,
    dateFormat: "YYYY-MM-dd",
    timeFormat: "HH:mm:ss",
};

const defaultGuardedPholderTable = '$$SCHEMA$$."VIEW::OMOP.GDM.PATIENT"';

export type PholderTableMapType = object;

export type SettingsType = {
    configId: string;
    tableMapping: PholderTableMapType;
    guardedTableMapping: PholderTableMapType;
    language: String[];
    settings: GlobalSettingsType;
    shared: any;
    others: any;
    schemaVersion: any;
};

export type ValidationMessageType = {
    source: string;
    message: string;
};

export type GlobalSettingsType = {
    fuzziness: number;
    maxResultSize: number;
    // flags controlling the information which is returned from backend
    // Note: all flags should be set to false for productive systems
    sqlReturnOn: boolean;
    errorDetailsReturnOn: boolean;
    errorStackTraceReturnOn: boolean;
    vbEnabled: boolean;
    dateFormat: string;
    timeFormat: string;
};

/*
 * In this file we collect settings for the applications.
 * At some point these type of settings may become part of the admin ui.
 *
 */
export class Settings {
    // Default placeholder-to-table mapping WITH RESTRICTED ACCESS
    protected defaultGuardedPholderTableMap: PholderTableMapType;
    protected defaultInterfaceViewsGuardedPholderTableMap: PholderTableMapType;
    protected customGuardedPholderTableMap: any;
    //private otherSettings: any;
    //private user: string;
    protected userSpecificAdavancedSettings: any;

    constructor() {
        //this.user = user;
        this.defaultGuardedPholderTableMap = Utils.cloneJson(
            defaultPholderTableMap
        );
        this.defaultGuardedPholderTableMap["@PATIENT"] =
            defaultGuardedPholderTable;
        this.defaultInterfaceViewsGuardedPholderTableMap = Utils.cloneJson(
            defaultInterfaceViewsPholderTableMap
        );
        this.defaultInterfaceViewsGuardedPholderTableMap["@PATIENT"] =
            defaultInterfaceViewsGuardedPholderTable;
        this.customGuardedPholderTableMap = {};
        //this.otherSettings = Utils.cloneJson(otherSettings);
    }

    public initAdvancedSettings(userSpecificAdavancedSettings: any) {
        this.userSpecificAdavancedSettings = userSpecificAdavancedSettings;
        return this;
    }

    /*public getUser() {
        // Tests will not initialize user, because mostly user is not used.
        // Just as a precautionary measure, If user is null then returning some fixed value for tests.
        return (this.user) ? this.user : "TEST_USER";
    }*/

    public getSettings(): GlobalSettingsType {
        if (this.userSpecificAdavancedSettings) {
            return Utils.cloneJson(this.userSpecificAdavancedSettings.settings);
        } else {
            return Utils.cloneJson(defaultSettings);
        }
    }

    public getPlaceholderMap(): PholderTableMapType {
        if (this.userSpecificAdavancedSettings) {
            return Utils.cloneJson(
                this.userSpecificAdavancedSettings.tableMapping
            );
        } else {
            // TODO: should only return default settings during tests
            // throw new Error("userSpecificAdavancedSettings was not initialized!");
            return Utils.cloneJson(defaultPholderTableMap);
        }
    }

    /*public getGuardedPlaceholderMap(): PholderTableMapType {
        let guardedPholderTableMap = Utils.extend(
            this.customGuardedPholderTableMap, this.defaultGuardedPholderTableMap);
        let placeholderMap = this.getPlaceholderMap();
        if (this.userSpecificAdavancedSettings) {
            placeholderMap["@PATIENT"] = this.userSpecificAdavancedSettings.guardedTableMapping["@PATIENT"];
        } else {
            placeholderMap["@PATIENT"] = guardedPholderTableMap["@PATIENT"];
        }
        return placeholderMap;
    }*/

    public getDefaultAdvancedSettings() {
        let returnObj: any = {};
        returnObj.configId = "";

        returnObj.tableMapping = Utils.cloneJson(defaultPholderTableMap);
        returnObj.guardedTableMapping = Utils.cloneJson(
            this.defaultGuardedPholderTableMap
        );
        returnObj.language = Utils.cloneJson(defaultSupportedLanguages);

        let settingsWithShared = this.getSettings();
        //let otherSettingsWithShared = this.getOtherSettings();

        let settings = JSON.parse(JSON.stringify(settingsWithShared));
        //let others = JSON.parse(JSON.stringify(otherSettingsWithShared));
        let shared = {};

        settings = Utils.extend(Utils.extend(settings, shared), {});
        returnObj.others = {};
        returnObj.settings = settings;
        returnObj.shared = shared;

        return returnObj;
    }
}
