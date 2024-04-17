from typing import List
from flows.testflowbrandan.types import DatamartBaseConfig

DatamartBaseConfigList: List[DatamartBaseConfig] = [
    {
        "name": "GDM.QUESTIONNAIRE_RESPONSE",
        "timestamp_column": "AUTHORED",
        "personId_column": "PERSON_ID"
    },
    {
        "name": "GDM_QUESTIONNAIRE_RESPONSE",
        "timestamp_column": "AUTHORED",
        "personId_column": "PERSON_ID"
    },
    {
        "name": "GDM.RESEARCH_SUBJECT",
        "timestamp_column": "",
        "personId_column": "PERSON_ID"
    },
    {
        "name": "GDM_RESEARCH_SUBJECT",
        "timestamp_column": "",
        "personId_column": "PERSON_ID"
    },
    {
        "name": "CONCEPT",
        "timestamp_column": "VALID_START_DATE",
        "personId_column": ""
    },
    {
        "name": "DOMAIN",
        "timestamp_column": "",
        "personId_column": ""
    },
    {
        "name": "CONCEPT_CLASS",
        "timestamp_column": "",
        "personId_column": ""
    },
    {
        "name": "CONCEPT_RELATIONSHIP",
        "timestamp_column": "VALID_START_DATE",
        "personId_column": ""
    },
    {
        "name": "RELATIONSHIP",
        "timestamp_column": "",
        "personId_column": ""
    },
    {
        "name": "CONCEPT_SYNONYM",
        "timestamp_column": "",
        "personId_column": ""
    },
    {
        "name": "CONCEPT_ANCESTOR",
        "timestamp_column": "",
        "personId_column": ""
    },
    {
        "name": "SOURCE_TO_CONCEPT_MAP",
        "timestamp_column": "VALID_START_DATE",
        "personId_column": ""
    },
    {
        "name": "DRUG_STRENGTH",
        "timestamp_column": "VALID_START_DATE",
        "personId_column": ""
    },
    {
        "name": "COHORT_DEFINITION",
        "timestamp_column": "COHORT_INITIATION_DATE",
        "personId_column": "",
    },
    {
        "name": "COHORT_ATTRIBUTE",
        "timestamp_column": "COHORT_START_DATE",
        "personId_column": ""
    },
    {
        "name": "ATTRIBUTE_DEFINITION",
        "timestamp_column": "",
        "personId_column": ""
    },
    {
        "name": "PERSON",
        "timestamp_column": "",
        "personId_column": "PERSON_ID"
    },
    {
        "name": "OBSERVATION_PERIOD",
        "timestamp_column": "OBSERVATION_PERIOD_START_DATE",
        "personId_column": "PERSON_ID",
    },
    {
        "name": "SPECIMEN",
        "timestamp_column": "SPECIMEN_DATE",
        "personId_column": "PERSON_ID"
    },
    {
        "name": "DEATH",
        "timestamp_column": "DEATH_DATE",
        "personId_column": "PERSON_ID"
    },
    {
        "name": "VISIT_OCCURRENCE",
        "timestamp_column": "VISIT_START_DATE",
        "personId_column": "PERSON_ID"
    },
    {
        "name": "PROCEDURE_OCCURRENCE",
        "timestamp_column": "PROCEDURE_DATETIME",
        "personId_column": "PERSON_ID"
    },
    {
        "name": "DRUG_EXPOSURE",
        "timestamp_column": "DRUG_EXPOSURE_START_DATETIME",
        "personId_column": "PERSON_ID",
    },
    {
        "name": "DEVICE_EXPOSURE",
        "timestamp_column": "DEVICE_EXPOSURE_START_DATETIME",
        "personId_column": "PERSON_ID",
    },
    {
        "name": "CONDITION_OCCURRENCE",
        "timestamp_column": "CONDITION_START_DATETIME",
        "personId_column": "PERSON_ID",
    },
    {
        "name": "MEASUREMENT",
        "timestamp_column": "MEASUREMENT_DATE",
        "personId_column": "PERSON_ID"
    },
    {
        "name": "NOTE",
        "timestamp_column": "NOTE_DATE",
        "personId_column": "PERSON_ID"
    },
    {
        "name": "NOTE_NLP",
        "timestamp_column": "NLP_DATE",
        "personId_column": ""
    },
    {
        "name": "OBSERVATION",
        "timestamp_column": "OBSERVATION_DATE",
        "personId_column": "PERSON_ID"
    },
    {
        "name": "FACT_RELATIONSHIP",
        "timestamp_column": "",
        "personId_column": ""
    },
    {
        "name": "CARE_SITE",
        "timestamp_column": "",
        "personId_column": ""
    },
    {
        "name": "PROVIDER",
        "timestamp_column": "",
        "personId_column": ""
    },
    {
        "name": "PAYER_PLAN_PERIOD",
        "timestamp_column": "PAYER_PLAN_PERIOD_START_DATE",
        "personId_column": "PERSON_ID",
    },
    {
        "name": "COST",
        "timestamp_column": "",
        "personId_column": "PAID_BY_PATIENT"
    },
    {
        "name": "COHORT",
        "timestamp_column": "COHORT_START_DATE",
        "personId_column": ""
    },
    {
        "name": "COHORT_ATTRIBUTE",
        "timestamp_column": "COHORT_START_DATE",
        "personId_column": ""
    },
    {
        "name": "DRUG_ERA",
        "timestamp_column": "DRUG_ERA_START_DATE",
        "personId_column": "PERSON_ID",
    },
    {
        "name": "DOSE_ERA",
        "timestamp_column": "DOSE_ERA_START_DATE",
        "personId_column": "PERSON_ID",
    },
    {
        "name": "CONDITION_ERA",
        "timestamp_column": "CONDITION_ERA_START_DATE",
        "personId_column": "PERSON_ID",
    },
    {
        "name": "CONCEPT_RECOMMENDED",
        "timestamp_column": "",
        "personId_column": ""
    }
]
