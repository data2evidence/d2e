from typing import List
from flows.testflowbrandan.types import DatamartBaseConfig

DatamartBaseConfigList: List[DatamartBaseConfig] = [
    {
        "tableName": "GDM.QUESTIONNAIRE_RESPONSE",
        "timestamp_column": "AUTHORED",
        "personId_column": "PERSON_ID"
    },
    {
        "tableName": "GDM_QUESTIONNAIRE_RESPONSE",
        "timestamp_column": "AUTHORED",
        "personId_column": "PERSON_ID"
    },
    {
        "tableName": "GDM.RESEARCH_SUBJECT",
        "timestamp_column": "",
        "personId_column": "PERSON_ID"
    },
    {
        "tableName": "GDM_RESEARCH_SUBJECT",
        "timestamp_column": "",
        "personId_column": "PERSON_ID"
    },
    {
        "tableName": "CONCEPT",
        "timestamp_column": "VALID_START_DATE",
        "personId_column": ""
    },
    {
        "tableName": "DOMAIN",
        "timestamp_column": "",
        "personId_column": ""
    },
    {
        "tableName": "CONCEPT_CLASS",
        "timestamp_column": "",
        "personId_column": ""
    },
    {
        "tableName": "CONCEPT_RELATIONSHIP",
        "timestamp_column": "VALID_START_DATE",
        "personId_column": ""
    },
    {
        "tableName": "RELATIONSHIP",
        "timestamp_column": "",
        "personId_column": ""
    },
    {
        "tableName": "CONCEPT_SYNONYM",
        "timestamp_column": "",
        "personId_column": ""
    },
    {
        "tableName": "CONCEPT_ANCESTOR",
        "timestamp_column": "",
        "personId_column": ""
    },
    {
        "tableName": "SOURCE_TO_CONCEPT_MAP",
        "timestamp_column": "VALID_START_DATE",
        "personId_column": ""
    },
    {
        "tableName": "DRUG_STRENGTH",
        "timestamp_column": "VALID_START_DATE",
        "personId_column": ""
    },
    {
        "tableName": "COHORT_DEFINITION",
        "timestamp_column": "COHORT_INITIATION_DATE",
        "personId_column": "",
    },
    {
        "tableName": "COHORT_ATTRIBUTE",
        "timestamp_column": "COHORT_START_DATE",
        "personId_column": ""
    },
    {
        "tableName": "ATTRIBUTE_DEFINITION",
        "timestamp_column": "",
        "personId_column": ""
    },
    {
        "tableName": "PERSON",
        "timestamp_column": "",
        "personId_column": "PERSON_ID"
    },
    {
        "tableName": "OBSERVATION_PERIOD",
        "timestamp_column": "OBSERVATION_PERIOD_START_DATE",
        "personId_column": "PERSON_ID",
    },
    {
        "tableName": "SPECIMEN",
        "timestamp_column": "SPECIMEN_DATE",
        "personId_column": "PERSON_ID"
    },
    {
        "tableName": "DEATH",
        "timestamp_column": "DEATH_DATE",
        "personId_column": "PERSON_ID"
    },
    {
        "tableName": "VISIT_OCCURRENCE",
        "timestamp_column": "VISIT_START_DATE",
        "personId_column": "PERSON_ID"
    },
    {
        "tableName": "PROCEDURE_OCCURRENCE",
        "timestamp_column": "PROCEDURE_DATETIME",
        "personId_column": "PERSON_ID"
    },
    {
        "tableName": "DRUG_EXPOSURE",
        "timestamp_column": "DRUG_EXPOSURE_START_DATETIME",
        "personId_column": "PERSON_ID",
    },
    {
        "tableName": "DEVICE_EXPOSURE",
        "timestamp_column": "DEVICE_EXPOSURE_START_DATETIME",
        "personId_column": "PERSON_ID",
    },
    {
        "tableName": "CONDITION_OCCURRENCE",
        "timestamp_column": "CONDITION_START_DATETIME",
        "personId_column": "PERSON_ID",
    },
    {
        "tableName": "MEASUREMENT",
        "timestamp_column": "MEASUREMENT_DATE",
        "personId_column": "PERSON_ID"
    },
    {
        "tableName": "NOTE",
        "timestamp_column": "NOTE_DATE",
        "personId_column": "PERSON_ID"
    },
    {
        "tableName": "NOTE_NLP",
        "timestamp_column": "NLP_DATE",
        "personId_column": ""
    },
    {
        "tableName": "OBSERVATION",
        "timestamp_column": "OBSERVATION_DATE",
        "personId_column": "PERSON_ID"
    },
    {
        "tableName": "FACT_RELATIONSHIP",
        "timestamp_column": "",
        "personId_column": ""
    },
    {
        "tableName": "CARE_SITE",
        "timestamp_column": "",
        "personId_column": ""
    },
    {
        "tableName": "PROVIDER",
        "timestamp_column": "",
        "personId_column": ""
    },
    {
        "tableName": "PAYER_PLAN_PERIOD",
        "timestamp_column": "PAYER_PLAN_PERIOD_START_DATE",
        "personId_column": "PERSON_ID",
    },
    {
        "tableName": "COST",
        "timestamp_column": "",
        "personId_column": "PAID_BY_PATIENT"
    },
    {
        "tableName": "COHORT",
        "timestamp_column": "COHORT_START_DATE",
        "personId_column": ""
    },
    {
        "tableName": "COHORT_ATTRIBUTE",
        "timestamp_column": "COHORT_START_DATE",
        "personId_column": ""
    },
    {
        "tableName": "DRUG_ERA",
        "timestamp_column": "DRUG_ERA_START_DATE",
        "personId_column": "PERSON_ID",
    },
    {
        "tableName": "DOSE_ERA",
        "timestamp_column": "DOSE_ERA_START_DATE",
        "personId_column": "PERSON_ID",
    },
    {
        "tableName": "CONDITION_ERA",
        "timestamp_column": "CONDITION_ERA_START_DATE",
        "personId_column": "PERSON_ID",
    },
    {
        "tableName": "CONCEPT_RECOMMENDED",
        "timestamp_column": "",
        "personId_column": ""
    }
]
