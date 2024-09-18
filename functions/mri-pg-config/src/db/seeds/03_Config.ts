import { Knex } from "knex";
import {env} from "../../env"

export async function seed(knex: Knex): Promise<void> {
  // Inserts seed entries
  await knex
    .withSchema(env.PG_SCHEMA)
    .into("ConfigDbModels_Config")
    .insert([
      {
        Id: "d10f83a0-ade9-4a33-90ae-cf760813953b",
        Version: "1",
        Status: "A",
        Name: "OMOP_GDM_DM",
        Type: "HC/HPH/CDW",
        Data: cdwConfig,
        ParentId: "",
        ParentVersion: "",
        Creator: "ALICE",
        Created: "2021-09-15 15:30:54",
        Modifier: "ALICE",
        Modified: "2022-09-13 17:56:54",
      },
      {
        Id: "92d7c6f8-3118-4256-ab22-f2f7fd19d4e7",
        Version: "A",
        Status: "",
        Name: "OMOP_GDM_PA_CONF",
        Type: "HC/MRI/PA",
        Data: paConfig,
        ParentId: "d10f83a0-ade9-4a33-90ae-cf760813953b",
        ParentVersion: "1",
        Creator: "ALICE",
        Created: "2021-09-15 15:30:54",
        Modifier: "ALICE",
        Modified: "2022-09-13 17:56:54",
      },
      {
        Id: "e10f83a0-ade9-4a33-90ae-cf760813943c",
        Version: "1",
        Status: "A",
        Name: "OMOP_GDM_DM_DUCKDB",
        Type: "HC/HPH/CDW",
        Data: cdwConfigDuckdb,
        ParentId: "",
        ParentVersion: "",
        Creator: "ALICE",
        Created: "2024-07-26 00:00:00",
        Modifier: "ALICE",
        Modified: "2024-07-26 00:00:00",
      },
      {
        Id: "4fce3cb7-32bf-4b46-8cba-32e4f77a14dd",
        Version: "A",
        Status: "",
        Name: "OMOP_GDM_PA_CONF_DUCKDB",
        Type: "HC/MRI/PA",
        Data: paConfigDuckdb,
        ParentId: "e10f83a0-ade9-4a33-90ae-cf760813943c",
        ParentVersion: "1",
        Creator: "ALICE",
        Created: "2024-07-26 00:00:00",
        Modifier: "ALICE",
        Modified: "2024-07-26 00:00:00",
      },
      {
        Id: "b0717586-7217-4a63-a15c-2bf8d76226be",
        Version: "1",
        Status: "A",
        Name: "I2B2_DM_DUCKDB",
        Type: "HC/HPH/CDW",
        Data: cdwI2b2ConfigDuckdb,
        ParentId: "",
        ParentVersion: "",
        Creator: "ALICE",
        Created: "2024-06-11 15:30:54",
        Modifier: "ALICE",
        Modified: "2024-06-11 17:56:54",
      },
      {
        Id: "d19bfd73-486e-4e02-ae2c-8858d7421c34",
        Version: "A",
        Status: "",
        Name: "I2B2_PA_CONF_DUCKDB",
        Type: "HC/MRI/PA",
        Data: paI2b2ConfigDuckdb,
        ParentId: "b0717586-7217-4a63-a15c-2bf8d76226be",
        ParentVersion: "1",
        Creator: "ALICE",
        Created: "2024-06-11 15:30:54",
        Modifier: "ALICE",
        Modified: "2024-06-11 17:56:54",
      },
    ])
    .onConflict(["Id", "Version"])
    .ignore();
}

const cdwConfig = {
  patient: {
    conditions: {},
    interactions: {
      conditionera: {
        name: 'Condition Era',
        disabledLangName: [
          {
            lang: 'en',
            value: '',
            visible: true,
          },
          {
            lang: 'de',
            value: '',
            visible: true,
          },
          {
            lang: 'fr',
            value: '',
            visible: true,
          },
          {
            lang: 'es',
            value: '',
            visible: true,
          },
          {
            lang: 'pt',
            value: '',
            visible: true,
          },
          {
            lang: 'zh',
            value: '',
            visible: true,
          },
        ],
        defaultFilter: '1=1',
        defaultPlaceholder: '@CONDERA',
        order: 15,
        parentInteraction: [],
        parentInteractionLabel: 'parent',
        attributes: {
          conditionname: {
            name: 'Condition Name',
            disabledLangName: [
              {
                lang: 'en',
                value: '',
                visible: true,
              },
              {
                lang: 'de',
                value: '',
                visible: true,
              },
              {
                lang: 'fr',
                value: '',
                visible: true,
              },
              {
                lang: 'es',
                value: '',
                visible: true,
              },
              {
                lang: 'pt',
                value: '',
                visible: true,
              },
              {
                lang: 'zh',
                value: '',
                visible: true,
              },
            ],
            type: 'text',
            expression: '@CONDERA."CONDITION_NAME"',
            referenceFilter: '@REF.DOMAIN_ID = \'Condition\' AND @REF.STANDARD_CONCEPT = \'S\' AND (@REF.CONCEPT_NAME) LIKE_REGEXPR \'@SEARCH_QUERY\' FLAG \'i\'',
            referenceExpression: '@REF.CONCEPT_NAME',
            order: 0,
            useRefValue: true,
          },
          startdate: {
            name: 'Start Date',
            disabledLangName: [
              {
                lang: 'en',
                value: '',
                visible: true,
              },
              {
                lang: 'de',
                value: '',
                visible: true,
              },
              {
                lang: 'fr',
                value: '',
                visible: true,
              },
              {
                lang: 'es',
                value: '',
                visible: true,
              },
              {
                lang: 'pt',
                value: '',
                visible: true,
              },
              {
                lang: 'zh',
                value: '',
                visible: true,
              },
            ],
            type: 'time',
            expression: '@CONDERA."CONDITION_ERA_START_DATE"',
            order: 1,
          },
          enddate: {
            name: 'End Date',
            disabledLangName: [
              {
                lang: 'en',
                value: '',
                visible: true,
              },
              {
                lang: 'de',
                value: '',
                visible: true,
              },
              {
                lang: 'fr',
                value: '',
                visible: true,
              },
              {
                lang: 'es',
                value: '',
                visible: true,
              },
              {
                lang: 'pt',
                value: '',
                visible: true,
              },
              {
                lang: 'zh',
                value: '',
                visible: true,
              },
            ],
            type: 'time',
            expression: '@CONDERA."CONDITION_ERA_END_DATE"',
            order: 2,
          },
          count: {
            name: 'Condition Occurrence Count',
            disabledLangName: [
              {
                lang: 'en',
                value: '',
                visible: true,
              },
              {
                lang: 'de',
                value: '',
                visible: true,
              },
              {
                lang: 'fr',
                value: '',
                visible: true,
              },
              {
                lang: 'es',
                value: '',
                visible: true,
              },
              {
                lang: 'pt',
                value: '',
                visible: true,
              },
              {
                lang: 'zh',
                value: '',
                visible: true,
              },
            ],
            type: 'num',
            expression: '@CONDERA."CONDITION_OCCURRENCE_COUNT"',
            order: 3,
          },
          pid: {
            name: 'Patient Id',
            disabledLangName: [
              {
                lang: 'en',
                value: '',
                visible: true,
              },
              {
                lang: 'de',
                value: '',
                visible: true,
              },
              {
                lang: 'fr',
                value: '',
                visible: true,
              },
              {
                lang: 'es',
                value: '',
                visible: true,
              },
              {
                lang: 'pt',
                value: '',
                visible: true,
              },
              {
                lang: 'zh',
                value: '',
                visible: true,
              },
            ],
            type: 'text',
            expression: 'CAST (@CONDERA."PATIENT_ID" AS VARCHAR)',
            order: 4,
          },
          conditioneraid: {
            name: 'Condition Era Id',
            disabledLangName: [
              {
                lang: 'en',
                value: '',
                visible: true,
              },
              {
                lang: 'de',
                value: '',
                visible: true,
              },
              {
                lang: 'fr',
                value: '',
                visible: true,
              },
              {
                lang: 'es',
                value: '',
                visible: true,
              },
              {
                lang: 'pt',
                value: '',
                visible: true,
              },
              {
                lang: 'zh',
                value: '',
                visible: true,
              },
            ],
            type: 'text',
            expression: 'CAST (@CONDERA."CONDITION_ERA_ID" AS VARCHAR)',
            order: 5,
          },
          condconceptcode: {
            name: 'Condition concept code',
            disabledLangName: [
              {
                lang: 'en',
                value: '',
                visible: true,
              },
              {
                lang: 'de',
                value: '',
                visible: true,
              },
              {
                lang: 'fr',
                value: '',
                visible: true,
              },
              {
                lang: 'es',
                value: '',
                visible: true,
              },
              {
                lang: 'pt',
                value: '',
                visible: true,
              },
              {
                lang: 'zh',
                value: '',
                visible: true,
              },
            ],
            type: 'text',
            expression: '@CONDERA."CONDITION_CONCEPT_CODE"',
            referenceFilter: '@REF.DOMAIN_ID = \'Condition\' AND @REF.STANDARD_CONCEPT = \'S\' AND (@REF.CONCEPT_CODE) LIKE_REGEXPR \'@SEARCH_QUERY\' FLAG \'i\'',
            referenceExpression: '@REF.CONCEPT_CODE',
            order: 6,
            useRefValue: true,
            useRefText: true,
          },
          conditionconceptid: {
            name: 'Condition concept id',
            disabledLangName: [
              {
                lang: 'en',
                value: '',
                visible: true,
              },
              {
                lang: 'de',
                value: '',
                visible: true,
              },
              {
                lang: 'fr',
                value: '',
                visible: true,
              },
              {
                lang: 'es',
                value: '',
                visible: true,
              },
              {
                lang: 'pt',
                value: '',
                visible: true,
              },
              {
                lang: 'zh',
                value: '',
                visible: true,
              },
            ],
            type: 'text',
            expression: '@CONDERA."CONDITION_CONCEPT_ID"',
            referenceFilter: '@REF.DOMAIN_ID = \'Condition\' AND @REF.STANDARD_CONCEPT = \'S\' AND CAST (@REF.CONCEPT_ID AS VARCHAR) LIKE_REGEXPR \'@SEARCH_QUERY\' FLAG \'i\'',
            referenceExpression: '@REF.CONCEPT_ID',
            order: 7,
            useRefValue: true,
            useRefText: true,
          },
          conditionconceptset: {
            name: 'Condition concept set',
            disabledLangName: [
              {
                lang: 'en',
                value: '',
                visible: true,
              },
              {
                lang: 'de',
                value: '',
                visible: true,
              },
              {
                lang: 'fr',
                value: '',
                visible: true,
              },
              {
                lang: 'es',
                value: '',
                visible: true,
              },
              {
                lang: 'pt',
                value: '',
                visible: true,
              },
              {
                lang: 'zh',
                value: '',
                visible: true,
              },
            ],
            type: 'conceptSet',
            expression: 'CAST (@CONDERA."CONDITION_CONCEPT_ID" AS VARCHAR)',
            order: 8,
            useRefValue: true,
            useRefText: true,
          },
        },
      },
      conditionoccurrence: {
        name: 'Condition Occurrence',
        disabledLangName: [
          {
            lang: 'en',
            value: '',
            visible: true,
          },
          {
            lang: 'de',
            value: '',
            visible: true,
          },
          {
            lang: 'fr',
            value: '',
            visible: true,
          },
          {
            lang: 'es',
            value: '',
            visible: true,
          },
          {
            lang: 'pt',
            value: '',
            visible: true,
          },
          {
            lang: 'zh',
            value: '',
            visible: true,
          },
        ],
        defaultFilter: '1=1',
        defaultPlaceholder: '@COND',
        order: 14,
        parentInteraction: [],
        parentInteractionLabel: 'parent',
        attributes: {
          visitoccurrenceid: {
            name: 'Visit Occurrence Id',
            disabledLangName: [
              {
                lang: 'en',
                value: '',
                visible: true,
              },
              {
                lang: 'de',
                value: '',
                visible: true,
              },
              {
                lang: 'fr',
                value: '',
                visible: true,
              },
              {
                lang: 'es',
                value: '',
                visible: true,
              },
              {
                lang: 'pt',
                value: '',
                visible: true,
              },
              {
                lang: 'zh',
                value: '',
                visible: true,
              },
            ],
            type: 'text',
            expression: 'CAST (@COND."VISIT_OCCURRENCE_ID" AS VARCHAR)',
            order: 0,
          },
          enddate: {
            name: 'End Date',
            disabledLangName: [
              {
                lang: 'en',
                value: '',
                visible: true,
              },
              {
                lang: 'de',
                value: '',
                visible: true,
              },
              {
                lang: 'fr',
                value: '',
                visible: true,
              },
              {
                lang: 'es',
                value: '',
                visible: true,
              },
              {
                lang: 'pt',
                value: '',
                visible: true,
              },
              {
                lang: 'zh',
                value: '',
                visible: true,
              },
            ],
            type: 'time',
            expression: '@COND."CONDITION_END_DATE"',
            order: 1,
          },
          startdate: {
            name: 'Start Date',
            disabledLangName: [
              {
                lang: 'en',
                value: '',
                visible: true,
              },
              {
                lang: 'de',
                value: '',
                visible: true,
              },
              {
                lang: 'fr',
                value: '',
                visible: true,
              },
              {
                lang: 'es',
                value: '',
                visible: true,
              },
              {
                lang: 'pt',
                value: '',
                visible: true,
              },
              {
                lang: 'zh',
                value: '',
                visible: true,
              },
            ],
            type: 'time',
            expression: '@COND."CONDITION_START_DATE"',
            order: 2,
          },
          pid: {
            name: 'Patient Id',
            disabledLangName: [
              {
                lang: 'en',
                value: '',
                visible: true,
              },
              {
                lang: 'de',
                value: '',
                visible: true,
              },
              {
                lang: 'fr',
                value: '',
                visible: true,
              },
              {
                lang: 'es',
                value: '',
                visible: true,
              },
              {
                lang: 'pt',
                value: '',
                visible: true,
              },
              {
                lang: 'zh',
                value: '',
                visible: true,
              },
            ],
            type: 'text',
            expression: 'CAST (@COND."PATIENT_ID" AS VARCHAR)',
            order: 3,
          },
          conditionstatus: {
            name: 'Condition Status',
            disabledLangName: [
              {
                lang: 'en',
                value: '',
                visible: true,
              },
              {
                lang: 'de',
                value: '',
                visible: true,
              },
              {
                lang: 'fr',
                value: '',
                visible: true,
              },
              {
                lang: 'es',
                value: '',
                visible: true,
              },
              {
                lang: 'pt',
                value: '',
                visible: true,
              },
              {
                lang: 'zh',
                value: '',
                visible: true,
              },
            ],
            type: 'text',
            expression: '@COND."CONDITION_STATUS_NAME"',
            referenceFilter: '@REF.DOMAIN_ID = \'Condition Status\' AND @REF.STANDARD_CONCEPT = \'S\' AND (@REF.CONCEPT_NAME) LIKE_REGEXPR \'@SEARCH_QUERY\' FLAG \'i\'',
            referenceExpression: '@REF.CONCEPT_NAME',
            order: 4,
            useRefValue: true,
          },
          conditionsource: {
            name: 'Condition Source',
            disabledLangName: [
              {
                lang: 'en',
                value: '',
                visible: true,
              },
              {
                lang: 'de',
                value: '',
                visible: true,
              },
              {
                lang: 'fr',
                value: '',
                visible: true,
              },
              {
                lang: 'es',
                value: '',
                visible: true,
              },
              {
                lang: 'pt',
                value: '',
                visible: true,
              },
              {
                lang: 'zh',
                value: '',
                visible: true,
              },
            ],
            type: 'text',
            expression: '@COND."CONDITION_SOURCE_NAME"',
            order: 5,
          },
          conditiontype: {
            name: 'Condition Type',
            disabledLangName: [
              {
                lang: 'en',
                value: '',
                visible: true,
              },
              {
                lang: 'de',
                value: '',
                visible: true,
              },
              {
                lang: 'fr',
                value: '',
                visible: true,
              },
              {
                lang: 'es',
                value: '',
                visible: true,
              },
              {
                lang: 'pt',
                value: '',
                visible: true,
              },
              {
                lang: 'zh',
                value: '',
                visible: true,
              },
            ],
            type: 'text',
            expression: '@COND."CONDITION_TYPE_NAME"',
            referenceFilter: '@REF.DOMAIN_ID = \'Type Concept\' AND @REF.CONCEPT_CLASS_ID = \'Condition Type\' AND (@REF.CONCEPT_NAME) LIKE_REGEXPR \'@SEARCH_QUERY\' FLAG \'i\'',
            referenceExpression: '@REF.CONCEPT_NAME',
            order: 6,
            useRefValue: true,
          },
          conditionname: {
            name: 'Condition Name',
            disabledLangName: [
              {
                lang: 'en',
                value: '',
                visible: true,
              },
              {
                lang: 'de',
                value: '',
                visible: true,
              },
              {
                lang: 'fr',
                value: '',
                visible: true,
              },
              {
                lang: 'es',
                value: '',
                visible: true,
              },
              {
                lang: 'pt',
                value: '',
                visible: true,
              },
              {
                lang: 'zh',
                value: '',
                visible: true,
              },
            ],
            type: 'text',
            expression: '@COND."CONDITION_NAME"',
            referenceFilter: '@REF.DOMAIN_ID = \'Condition\' AND @REF.STANDARD_CONCEPT = \'S\' AND (@REF.CONCEPT_NAME) LIKE_REGEXPR \'@SEARCH_QUERY\' FLAG \'i\'',
            referenceExpression: '@REF.CONCEPT_NAME',
            order: 7,
            conceptSetType: 'name',
            useRefValue: true,
          },
          conditionoccurrenceid: {
            name: 'Condition Occurrence Id',
            disabledLangName: [
              {
                lang: 'en',
                value: '',
                visible: true,
              },
              {
                lang: 'de',
                value: '',
                visible: true,
              },
              {
                lang: 'fr',
                value: '',
                visible: true,
              },
              {
                lang: 'es',
                value: '',
                visible: true,
              },
              {
                lang: 'pt',
                value: '',
                visible: true,
              },
              {
                lang: 'zh',
                value: '',
                visible: true,
              },
            ],
            type: 'text',
            expression: 'CAST (@COND."CONDITION_OCCURRENCE_ID" AS VARCHAR)',
            order: 8,
          },
          condconceptcode: {
            name: 'Condition concept code',
            disabledLangName: [
              {
                lang: 'en',
                value: '',
                visible: true,
              },
              {
                lang: 'de',
                value: '',
                visible: true,
              },
              {
                lang: 'fr',
                value: '',
                visible: true,
              },
              {
                lang: 'es',
                value: '',
                visible: true,
              },
              {
                lang: 'pt',
                value: '',
                visible: true,
              },
              {
                lang: 'zh',
                value: '',
                visible: true,
              },
            ],
            type: 'text',
            expression: '@COND."CONDITION_CONCEPT_CODE"',
            referenceFilter: '@REF.DOMAIN_ID = \'Condition\' AND @REF.STANDARD_CONCEPT = \'S\' AND (@REF.CONCEPT_CODE) LIKE_REGEXPR \'@SEARCH_QUERY\' FLAG \'i\'',
            referenceExpression: '@REF.CONCEPT_CODE',
            order: 9,
            useRefValue: true,
            useRefText: true,
          },
          conditiontypeconceptcode: {
            name: 'Condition Type concept code',
            disabledLangName: [
              {
                lang: 'en',
                value: '',
                visible: true,
              },
              {
                lang: 'de',
                value: '',
                visible: true,
              },
              {
                lang: 'fr',
                value: '',
                visible: true,
              },
              {
                lang: 'es',
                value: '',
                visible: true,
              },
              {
                lang: 'pt',
                value: '',
                visible: true,
              },
              {
                lang: 'zh',
                value: '',
                visible: true,
              },
            ],
            type: 'text',
            expression: '@COND."CONDITION_TYPE_CONCEPT_CODE"',
            referenceFilter: '@REF.DOMAIN_ID = \'Type Concept\' AND @REF.CONCEPT_CLASS_ID = \'Condition Type\' AND (@REF.CONCEPT_CODE) LIKE_REGEXPR \'@SEARCH_QUERY\' FLAG \'i\'',
            referenceExpression: '@REF.CONCEPT_CODE',
            order: 10,
            useRefValue: true,
            useRefText: true,
          },
          conditiontypeconceptset: {
            name: 'Condition Type concept set',
            disabledLangName: [
              {
                lang: 'en',
                value: '',
                visible: true,
              },
              {
                lang: 'de',
                value: '',
                visible: true,
              },
              {
                lang: 'fr',
                value: '',
                visible: true,
              },
              {
                lang: 'es',
                value: '',
                visible: true,
              },
              {
                lang: 'pt',
                value: '',
                visible: true,
              },
              {
                lang: 'zh',
                value: '',
                visible: true,
              },
            ],
            type: 'conceptSet',
            expression: 'CAST (@COND."CONDITION_TYPE_CONCEPT_ID" AS VARCHAR)',
            order: 11,
            useRefValue: true,
            useRefText: true,
          },
          conditionsourceconceptcode: {
            name: 'Condition Source concept code',
            disabledLangName: [
              {
                lang: 'en',
                value: '',
                visible: true,
              },
              {
                lang: 'de',
                value: '',
                visible: true,
              },
              {
                lang: 'fr',
                value: '',
                visible: true,
              },
              {
                lang: 'es',
                value: '',
                visible: true,
              },
              {
                lang: 'pt',
                value: '',
                visible: true,
              },
              {
                lang: 'zh',
                value: '',
                visible: true,
              },
            ],
            type: 'text',
            expression: '@COND."CONDITION_SOURCE_CONCEPT_CODE"',
            order: 12,
          },
          conditionsourceconceptset: {
            name: 'Condition Source concept set',
            disabledLangName: [
              {
                lang: 'en',
                value: '',
                visible: true,
              },
              {
                lang: 'de',
                value: '',
                visible: true,
              },
              {
                lang: 'fr',
                value: '',
                visible: true,
              },
              {
                lang: 'es',
                value: '',
                visible: true,
              },
              {
                lang: 'pt',
                value: '',
                visible: true,
              },
              {
                lang: 'zh',
                value: '',
                visible: true,
              },
            ],
            type: 'conceptSet',
            expression: 'CAST (@COND."CONDITION_SOURCE_CONCEPT_ID" AS VARCHAR)',
            order: 13,
          },
          conditionstatusconceptcode: {
            name: 'Condition Status concept code',
            disabledLangName: [
              {
                lang: 'en',
                value: '',
                visible: true,
              },
              {
                lang: 'de',
                value: '',
                visible: true,
              },
              {
                lang: 'fr',
                value: '',
                visible: true,
              },
              {
                lang: 'es',
                value: '',
                visible: true,
              },
              {
                lang: 'pt',
                value: '',
                visible: true,
              },
              {
                lang: 'zh',
                value: '',
                visible: true,
              },
            ],
            type: 'text',
            expression: '@COND."CONDITION_STATUS_CONCEPT_CODE"',
            referenceFilter: '@REF.DOMAIN_ID = \'Condition Status\' AND @REF.STANDARD_CONCEPT = \'S\' AND (@REF.CONCEPT_CODE) LIKE_REGEXPR \'@SEARCH_QUERY\' FLAG \'i\'',
            referenceExpression: '@REF.CONCEPT_CODE',
            order: 14,
            useRefValue: true,
            useRefText: true,
          },
          conditionstatusconceptset: {
            name: 'Condition Status concept set',
            disabledLangName: [
              {
                lang: 'en',
                value: '',
                visible: true,
              },
              {
                lang: 'de',
                value: '',
                visible: true,
              },
              {
                lang: 'fr',
                value: '',
                visible: true,
              },
              {
                lang: 'es',
                value: '',
                visible: true,
              },
              {
                lang: 'pt',
                value: '',
                visible: true,
              },
              {
                lang: 'zh',
                value: '',
                visible: true,
              },
            ],
            type: 'conceptSet',
            expression: 'CAST (@COND."CONDITION_STATUS_CONCEPT_ID" AS VARCHAR)',
            order: 15,
            useRefValue: true,
            useRefText: true,
          },
          conditionconceptid: {
            name: 'Condition concept id',
            disabledLangName: [
              {
                lang: 'en',
                value: '',
                visible: true,
              },
              {
                lang: 'de',
                value: '',
                visible: true,
              },
              {
                lang: 'fr',
                value: '',
                visible: true,
              },
              {
                lang: 'es',
                value: '',
                visible: true,
              },
              {
                lang: 'pt',
                value: '',
                visible: true,
              },
              {
                lang: 'zh',
                value: '',
                visible: true,
              },
            ],
            type: 'text',
            expression: '@COND."CONDITION_CONCEPT_ID"',
            referenceFilter: '@REF.DOMAIN_ID = \'Condition\' AND @REF.STANDARD_CONCEPT = \'S\' AND CAST (@REF.CONCEPT_ID AS VARCHAR) LIKE_REGEXPR \'@SEARCH_QUERY\' FLAG \'i\'',
            referenceExpression: '@REF.CONCEPT_ID',
            order: 16,
            useRefValue: true,
            useRefText: true,
          },
          conditionconceptset: {
            name: 'Condition concept set',
            disabledLangName: [
              {
                lang: 'en',
                value: '',
                visible: true,
              },
              {
                lang: 'de',
                value: '',
                visible: true,
              },
              {
                lang: 'fr',
                value: '',
                visible: true,
              },
              {
                lang: 'es',
                value: '',
                visible: true,
              },
              {
                lang: 'pt',
                value: '',
                visible: true,
              },
              {
                lang: 'zh',
                value: '',
                visible: true,
              },
            ],
            type: 'conceptSet',
            expression: 'CAST (@COND."CONDITION_CONCEPT_ID" AS VARCHAR)',
            order: 17,
            useRefValue: true,
            useRefText: true,
          },
          conditiontypeconceptid: {
            name: 'Condition Type concept id',
            disabledLangName: [
              {
                lang: 'en',
                value: '',
                visible: true,
              },
              {
                lang: 'de',
                value: '',
                visible: true,
              },
              {
                lang: 'fr',
                value: '',
                visible: true,
              },
              {
                lang: 'es',
                value: '',
                visible: true,
              },
              {
                lang: 'pt',
                value: '',
                visible: true,
              },
              {
                lang: 'zh',
                value: '',
                visible: true,
              },
            ],
            type: 'text',
            expression: 'CAST (@COND."CONDITION_TYPE_CONCEPT_ID" AS VARCHAR)',
            order: 18,
            useRefValue: true,
            useRefText: true,
          },
          conditionsourceconceptid: {
            name: 'Condition Source concept id',
            disabledLangName: [
              {
                lang: 'en',
                value: '',
                visible: true,
              },
              {
                lang: 'de',
                value: '',
                visible: true,
              },
              {
                lang: 'fr',
                value: '',
                visible: true,
              },
              {
                lang: 'es',
                value: '',
                visible: true,
              },
              {
                lang: 'pt',
                value: '',
                visible: true,
              },
              {
                lang: 'zh',
                value: '',
                visible: true,
              },
            ],
            type: 'text',
            expression: 'CAST (@COND."CONDITION_SOURCE_CONCEPT_ID" AS VARCHAR)',
            order: 19,
          },
          conditionstatusconceptid: {
            name: 'Condition Status concept id',
            disabledLangName: [
              {
                lang: 'en',
                value: '',
                visible: true,
              },
              {
                lang: 'de',
                value: '',
                visible: true,
              },
              {
                lang: 'fr',
                value: '',
                visible: true,
              },
              {
                lang: 'es',
                value: '',
                visible: true,
              },
              {
                lang: 'pt',
                value: '',
                visible: true,
              },
              {
                lang: 'zh',
                value: '',
                visible: true,
              },
            ],
            type: 'text',
            expression: 'CAST (@COND."CONDITION_STATUS_CONCEPT_ID" AS VARCHAR)',
            order: 20,
            useRefValue: true,
            useRefText: true,
          },
        },
      },
      death: {
        name: 'Death',
        disabledLangName: [
          {
            lang: 'en',
            value: '',
            visible: true,
          },
          {
            lang: 'de',
            value: '',
            visible: true,
          },
          {
            lang: 'fr',
            value: '',
            visible: true,
          },
          {
            lang: 'es',
            value: '',
            visible: true,
          },
          {
            lang: 'pt',
            value: '',
            visible: true,
          },
          {
            lang: 'zh',
            value: '',
            visible: true,
          },
        ],
        defaultFilter: '1=1',
        defaultPlaceholder: '@DEATH',
        order: 13,
        parentInteraction: [],
        parentInteractionLabel: 'parent',
        attributes: {
          deathtypeconceptcode: {
            name: 'Death Type concept code',
            disabledLangName: [
              {
                lang: 'en',
                value: '',
                visible: true,
              },
              {
                lang: 'de',
                value: '',
                visible: true,
              },
              {
                lang: 'fr',
                value: '',
                visible: true,
              },
              {
                lang: 'es',
                value: '',
                visible: true,
              },
              {
                lang: 'pt',
                value: '',
                visible: true,
              },
              {
                lang: 'zh',
                value: '',
                visible: true,
              },
            ],
            type: 'text',
            expression: '@DEATH."DEATH_TYPE_CONCEPT_CODE"',
            referenceFilter: '@REF.DOMAIN_ID = \'Type Concept\' AND @REF.CONCEPT_CLASS_ID = \'Death Type\' AND (@REF.CONCEPT_CODE) LIKE_REGEXPR \'@SEARCH_QUERY\' FLAG \'i\'',
            referenceExpression: '@REF.CONCEPT_CODE',
            order: 0,
            useRefValue: true,
            useRefText: true,
          },
          deathtypeconceptset: {
            name: 'Death Type concept set',
            disabledLangName: [
              {
                lang: 'en',
                value: '',
                visible: true,
              },
              {
                lang: 'de',
                value: '',
                visible: true,
              },
              {
                lang: 'fr',
                value: '',
                visible: true,
              },
              {
                lang: 'es',
                value: '',
                visible: true,
              },
              {
                lang: 'pt',
                value: '',
                visible: true,
              },
              {
                lang: 'zh',
                value: '',
                visible: true,
              },
            ],
            type: 'conceptSet',
            expression: 'CAST (@DEATH."DEATH_TYPE_CONCEPT_ID" AS VARCHAR)',
            order: 1,
            useRefValue: true,
            useRefText: true,
          },
          pid: {
            name: 'Patient Id',
            disabledLangName: [
              {
                lang: 'en',
                value: '',
                visible: true,
              },
              {
                lang: 'de',
                value: '',
                visible: true,
              },
              {
                lang: 'fr',
                value: '',
                visible: true,
              },
              {
                lang: 'es',
                value: '',
                visible: true,
              },
              {
                lang: 'pt',
                value: '',
                visible: true,
              },
              {
                lang: 'zh',
                value: '',
                visible: true,
              },
            ],
            type: 'text',
            expression: 'CAST (@DEATH."PATIENT_ID" AS VARCHAR)',
            order: 2,
          },
          deathdatetime: {
            name: 'Death Date/Time',
            disabledLangName: [
              {
                lang: 'en',
                value: '',
                visible: true,
              },
              {
                lang: 'de',
                value: '',
                visible: true,
              },
              {
                lang: 'fr',
                value: '',
                visible: true,
              },
              {
                lang: 'es',
                value: '',
                visible: true,
              },
              {
                lang: 'pt',
                value: '',
                visible: true,
              },
              {
                lang: 'zh',
                value: '',
                visible: true,
              },
            ],
            type: 'datetime',
            expression: '@DEATH."DEATH_DATETIME"',
            order: 3,
          },
          deathdate: {
            name: 'Death Date',
            disabledLangName: [
              {
                lang: 'en',
                value: '',
                visible: true,
              },
              {
                lang: 'de',
                value: '',
                visible: true,
              },
              {
                lang: 'fr',
                value: '',
                visible: true,
              },
              {
                lang: 'es',
                value: '',
                visible: true,
              },
              {
                lang: 'pt',
                value: '',
                visible: true,
              },
              {
                lang: 'zh',
                value: '',
                visible: true,
              },
            ],
            type: 'time',
            expression: '@DEATH."DEATH_DATE"',
            order: 4,
          },
          deathtype: {
            name: 'Death Type',
            disabledLangName: [
              {
                lang: 'en',
                value: '',
                visible: true,
              },
              {
                lang: 'de',
                value: '',
                visible: true,
              },
              {
                lang: 'fr',
                value: '',
                visible: true,
              },
              {
                lang: 'es',
                value: '',
                visible: true,
              },
              {
                lang: 'pt',
                value: '',
                visible: true,
              },
              {
                lang: 'zh',
                value: '',
                visible: true,
              },
            ],
            type: 'text',
            expression: '@DEATH."DEATH_TYPE_NAME"',
            referenceFilter: '@REF.DOMAIN_ID = \'Type Concept\' AND @REF.CONCEPT_CLASS_ID = \'Death Type\' AND (@REF.CONCEPT_NAME) LIKE_REGEXPR \'@SEARCH_QUERY\' FLAG \'i\'',
            referenceExpression: '@REF.CONCEPT_NAME',
            order: 5,
            useRefValue: true,
          },
          deathtypeconceptid: {
            name: 'Death Type concept id',
            disabledLangName: [
              {
                lang: 'en',
                value: '',
                visible: true,
              },
              {
                lang: 'de',
                value: '',
                visible: true,
              },
              {
                lang: 'fr',
                value: '',
                visible: true,
              },
              {
                lang: 'es',
                value: '',
                visible: true,
              },
              {
                lang: 'pt',
                value: '',
                visible: true,
              },
              {
                lang: 'zh',
                value: '',
                visible: true,
              },
            ],
            type: 'text',
            expression: 'CAST (@DEATH."DEATH_TYPE_CONCEPT_ID" AS VARCHAR)',
            order: 6,
            useRefValue: true,
            useRefText: true,
          },
        },
      },
      deviceexposure: {
        name: 'Device Exposure',
        disabledLangName: [
          {
            lang: 'en',
            value: '',
            visible: true,
          },
          {
            lang: 'de',
            value: '',
            visible: true,
          },
          {
            lang: 'fr',
            value: '',
            visible: true,
          },
          {
            lang: 'es',
            value: '',
            visible: true,
          },
          {
            lang: 'pt',
            value: '',
            visible: true,
          },
          {
            lang: 'zh',
            value: '',
            visible: true,
          },
        ],
        defaultFilter: '1=1',
        defaultPlaceholder: '@DEVEXP',
        order: 12,
        parentInteraction: [],
        parentInteractionLabel: 'parent',
        attributes: {
          enddate: {
            name: 'End Date',
            disabledLangName: [
              {
                lang: 'en',
                value: '',
                visible: true,
              },
              {
                lang: 'de',
                value: '',
                visible: true,
              },
              {
                lang: 'fr',
                value: '',
                visible: true,
              },
              {
                lang: 'es',
                value: '',
                visible: true,
              },
              {
                lang: 'pt',
                value: '',
                visible: true,
              },
              {
                lang: 'zh',
                value: '',
                visible: true,
              },
            ],
            type: 'time',
            expression: '@DEVEXP."DEVICE_EXPOSURE_END_DATE"',
            order: 0,
          },
          startdate: {
            name: 'Start Date',
            disabledLangName: [
              {
                lang: 'en',
                value: '',
                visible: true,
              },
              {
                lang: 'de',
                value: '',
                visible: true,
              },
              {
                lang: 'fr',
                value: '',
                visible: true,
              },
              {
                lang: 'es',
                value: '',
                visible: true,
              },
              {
                lang: 'pt',
                value: '',
                visible: true,
              },
              {
                lang: 'zh',
                value: '',
                visible: true,
              },
            ],
            type: 'time',
            expression: '@DEVEXP."DEVICE_EXPOSURE_START_DATE"',
            order: 1,
          },
          devicename: {
            name: 'Device Name',
            disabledLangName: [
              {
                lang: 'en',
                value: '',
                visible: true,
              },
              {
                lang: 'de',
                value: '',
                visible: true,
              },
              {
                lang: 'fr',
                value: '',
                visible: true,
              },
              {
                lang: 'es',
                value: '',
                visible: true,
              },
              {
                lang: 'pt',
                value: '',
                visible: true,
              },
              {
                lang: 'zh',
                value: '',
                visible: true,
              },
            ],
            type: 'text',
            expression: '@DEVEXP."DEVICE_NAME"',
            referenceFilter: '@REF.DOMAIN_ID = \'Device\' AND @REF.STANDARD_CONCEPT = \'S\' AND (@REF.CONCEPT_NAME) LIKE_REGEXPR \'@SEARCH_QUERY\' FLAG \'i\'',
            referenceExpression: '@REF.CONCEPT_NAME',
            order: 2,
            useRefValue: true,
          },
          pid: {
            name: 'Patient Id',
            disabledLangName: [
              {
                lang: 'en',
                value: '',
                visible: true,
              },
              {
                lang: 'de',
                value: '',
                visible: true,
              },
              {
                lang: 'fr',
                value: '',
                visible: true,
              },
              {
                lang: 'es',
                value: '',
                visible: true,
              },
              {
                lang: 'pt',
                value: '',
                visible: true,
              },
              {
                lang: 'zh',
                value: '',
                visible: true,
              },
            ],
            type: 'text',
            expression: 'CAST (@DEVEXP."PATIENT_ID" AS VARCHAR)',
            order: 3,
          },
          deviceexposureid: {
            name: 'Device Exposure Id',
            disabledLangName: [
              {
                lang: 'en',
                value: '',
                visible: true,
              },
              {
                lang: 'de',
                value: '',
                visible: true,
              },
              {
                lang: 'fr',
                value: '',
                visible: true,
              },
              {
                lang: 'es',
                value: '',
                visible: true,
              },
              {
                lang: 'pt',
                value: '',
                visible: true,
              },
              {
                lang: 'zh',
                value: '',
                visible: true,
              },
            ],
            type: 'text',
            expression: 'CAST (@DEVEXP."DEVICE_EXPOSURE_ID" AS VARCHAR)',
            order: 4,
          },
          devicetypename: {
            name: 'Device Type',
            disabledLangName: [
              {
                lang: 'en',
                value: '',
                visible: true,
              },
              {
                lang: 'de',
                value: '',
                visible: true,
              },
              {
                lang: 'fr',
                value: '',
                visible: true,
              },
              {
                lang: 'es',
                value: '',
                visible: true,
              },
              {
                lang: 'pt',
                value: '',
                visible: true,
              },
              {
                lang: 'zh',
                value: '',
                visible: true,
              },
            ],
            type: 'text',
            expression: '@DEVEXP."DEVICE_TYPE_NAME"',
            referenceFilter: '@REF.DOMAIN_ID = \'Type Concept\' AND @REF.CONCEPT_CLASS_ID = \'Device Type\' AND (@REF.CONCEPT_NAME) LIKE_REGEXPR \'@SEARCH_QUERY\' FLAG \'i\'',
            referenceExpression: '@REF.CONCEPT_NAME',
            order: 5,
            useRefValue: true,
          },
          deviceconceptcode: {
            name: 'Device concept code',
            disabledLangName: [
              {
                lang: 'en',
                value: '',
                visible: true,
              },
              {
                lang: 'de',
                value: '',
                visible: true,
              },
              {
                lang: 'fr',
                value: '',
                visible: true,
              },
              {
                lang: 'es',
                value: '',
                visible: true,
              },
              {
                lang: 'pt',
                value: '',
                visible: true,
              },
              {
                lang: 'zh',
                value: '',
                visible: true,
              },
            ],
            type: 'text',
            expression: '@DEVEXP."DEVICE_CONCEPT_CODE"',
            referenceFilter: '@REF.DOMAIN_ID = \'Device\' AND @REF.STANDARD_CONCEPT = \'S\' AND (@REF.CONCEPT_CODE) LIKE_REGEXPR \'@SEARCH_QUERY\' FLAG \'i\'',
            referenceExpression: '@REF.CONCEPT_CODE',
            order: 6,
            useRefValue: true,
            useRefText: true,
          },
          devicetypeconceptcode: {
            name: 'Device Type concept code',
            disabledLangName: [
              {
                lang: 'en',
                value: '',
                visible: true,
              },
              {
                lang: 'de',
                value: '',
                visible: true,
              },
              {
                lang: 'fr',
                value: '',
                visible: true,
              },
              {
                lang: 'es',
                value: '',
                visible: true,
              },
              {
                lang: 'pt',
                value: '',
                visible: true,
              },
              {
                lang: 'zh',
                value: '',
                visible: true,
              },
            ],
            type: 'text',
            expression: '@DEVEXP."DEVICE_TYPE_CONCEPT_CODE"',
            referenceFilter: '@REF.DOMAIN_ID = \'Type Concept\' AND @REF.CONCEPT_CLASS_ID = \'Device Type\' AND (@REF.CONCEPT_CODE) LIKE_REGEXPR \'@SEARCH_QUERY\' FLAG \'i\'',
            referenceExpression: '@REF.CONCEPT_CODE',
            order: 7,
            useRefValue: true,
            useRefText: true,
          },
          devicetypeconceptset: {
            name: 'Device Type concept set',
            disabledLangName: [
              {
                lang: 'en',
                value: '',
                visible: true,
              },
              {
                lang: 'de',
                value: '',
                visible: true,
              },
              {
                lang: 'fr',
                value: '',
                visible: true,
              },
              {
                lang: 'es',
                value: '',
                visible: true,
              },
              {
                lang: 'pt',
                value: '',
                visible: true,
              },
              {
                lang: 'zh',
                value: '',
                visible: true,
              },
            ],
            type: 'conceptSet',
            expression: 'CAST (@DEVEXP."DEVICE_TYPE_CONCEPT_ID" AS VARCHAR)',
            order: 8,
            useRefValue: true,
            useRefText: true,
          },
          deviceconceptid: {
            name: 'Device concept id',
            disabledLangName: [
              {
                lang: 'en',
                value: '',
                visible: true,
              },
              {
                lang: 'de',
                value: '',
                visible: true,
              },
              {
                lang: 'fr',
                value: '',
                visible: true,
              },
              {
                lang: 'es',
                value: '',
                visible: true,
              },
              {
                lang: 'pt',
                value: '',
                visible: true,
              },
              {
                lang: 'zh',
                value: '',
                visible: true,
              },
            ],
            type: 'text',
            expression: '@DEVEXP."DEVICE_CONCEPT_ID"',
            referenceFilter: '@REF.DOMAIN_ID = \'Device\' AND @REF.STANDARD_CONCEPT = \'S\' AND CAST(@REF.CONCEPT_ID AS VARCHAR) LIKE_REGEXPR \'@SEARCH_QUERY\' FLAG \'i\'',
            referenceExpression: '@REF.CONCEPT_ID',
            order: 9,
            useRefValue: true,
            useRefText: true,
          },
          deviceconceptset: {
            name: 'Device concept set',
            disabledLangName: [
              {
                lang: 'en',
                value: '',
                visible: true,
              },
              {
                lang: 'de',
                value: '',
                visible: true,
              },
              {
                lang: 'fr',
                value: '',
                visible: true,
              },
              {
                lang: 'es',
                value: '',
                visible: true,
              },
              {
                lang: 'pt',
                value: '',
                visible: true,
              },
              {
                lang: 'zh',
                value: '',
                visible: true,
              },
            ],
            type: 'conceptSet',
            expression: 'CAST (@DEVEXP."DEVICE_CONCEPT_ID" AS VARCHAR)',
            order: 10,
            useRefValue: true,
            useRefText: true,
          },
          devicetypeconceptid: {
            name: 'Device Type concept id',
            disabledLangName: [
              {
                lang: 'en',
                value: '',
                visible: true,
              },
              {
                lang: 'de',
                value: '',
                visible: true,
              },
              {
                lang: 'fr',
                value: '',
                visible: true,
              },
              {
                lang: 'es',
                value: '',
                visible: true,
              },
              {
                lang: 'pt',
                value: '',
                visible: true,
              },
              {
                lang: 'zh',
                value: '',
                visible: true,
              },
            ],
            type: 'text',
            expression: 'CAST (@DEVEXP."DEVICE_TYPE_CONCEPT_ID" AS VARCHAR)',
            order: 11,
            useRefValue: true,
            useRefText: true,
          },
        },
      },
      doseera: {
        name: 'Dose Era',
        disabledLangName: [
          {
            lang: 'en',
            value: '',
            visible: true,
          },
          {
            lang: 'de',
            value: '',
            visible: true,
          },
          {
            lang: 'fr',
            value: '',
            visible: true,
          },
          {
            lang: 'es',
            value: '',
            visible: true,
          },
          {
            lang: 'pt',
            value: '',
            visible: true,
          },
          {
            lang: 'zh',
            value: '',
            visible: true,
          },
        ],
        defaultFilter: '1=1',
        defaultPlaceholder: '@DOSEERA',
        order: 11,
        parentInteraction: [],
        parentInteractionLabel: 'parent',
        attributes: {
          unitname: {
            name: 'Unit',
            disabledLangName: [
              {
                lang: 'en',
                value: '',
                visible: true,
              },
              {
                lang: 'de',
                value: '',
                visible: true,
              },
              {
                lang: 'fr',
                value: '',
                visible: true,
              },
              {
                lang: 'es',
                value: '',
                visible: true,
              },
              {
                lang: 'pt',
                value: '',
                visible: true,
              },
              {
                lang: 'zh',
                value: '',
                visible: true,
              },
            ],
            type: 'text',
            expression: '@DOSEERA."UNIT_NAME"',
            referenceFilter: '@REF.DOMAIN_ID = \'Unit\' AND @REF.STANDARD_CONCEPT = \'S\' AND (@REF.CONCEPT_NAME) LIKE_REGEXPR \'@SEARCH_QUERY\' FLAG \'i\'',
            referenceExpression: '@REF.CONCEPT_NAME',
            order: 0,
            useRefValue: true,
          },
          drug: {
            name: 'Drug',
            disabledLangName: [
              {
                lang: 'en',
                value: '',
                visible: true,
              },
              {
                lang: 'de',
                value: '',
                visible: true,
              },
              {
                lang: 'fr',
                value: '',
                visible: true,
              },
              {
                lang: 'es',
                value: '',
                visible: true,
              },
              {
                lang: 'pt',
                value: '',
                visible: true,
              },
              {
                lang: 'zh',
                value: '',
                visible: true,
              },
            ],
            type: 'text',
            expression: '@DOSEERA."DRUG_NAME"',
            referenceFilter: '@REF.DOMAIN_ID = \'Drug\' AND @REF.STANDARD_CONCEPT = \'S\' AND (@REF.CONCEPT_NAME) LIKE_REGEXPR \'@SEARCH_QUERY\' FLAG \'i\'',
            referenceExpression: '@REF.CONCEPT_NAME',
            order: 1,
            useRefValue: true,
          },
          pid: {
            name: 'Patient Id',
            disabledLangName: [
              {
                lang: 'en',
                value: '',
                visible: true,
              },
              {
                lang: 'de',
                value: '',
                visible: true,
              },
              {
                lang: 'fr',
                value: '',
                visible: true,
              },
              {
                lang: 'es',
                value: '',
                visible: true,
              },
              {
                lang: 'pt',
                value: '',
                visible: true,
              },
              {
                lang: 'zh',
                value: '',
                visible: true,
              },
            ],
            type: 'text',
            expression: 'CAST (@DOSEERA."PATIENT_ID" AS VARCHAR)',
            order: 2,
          },
          enddate: {
            name: 'End Date',
            disabledLangName: [
              {
                lang: 'en',
                value: '',
                visible: true,
              },
              {
                lang: 'de',
                value: '',
                visible: true,
              },
              {
                lang: 'fr',
                value: '',
                visible: true,
              },
              {
                lang: 'es',
                value: '',
                visible: true,
              },
              {
                lang: 'pt',
                value: '',
                visible: true,
              },
              {
                lang: 'zh',
                value: '',
                visible: true,
              },
            ],
            type: 'time',
            expression: '@DOSEERA."DOSE_ERA_END_DATE"',
            order: 3,
          },
          startdate: {
            name: 'Start Date',
            disabledLangName: [
              {
                lang: 'en',
                value: '',
                visible: true,
              },
              {
                lang: 'de',
                value: '',
                visible: true,
              },
              {
                lang: 'fr',
                value: '',
                visible: true,
              },
              {
                lang: 'es',
                value: '',
                visible: true,
              },
              {
                lang: 'pt',
                value: '',
                visible: true,
              },
              {
                lang: 'zh',
                value: '',
                visible: true,
              },
            ],
            type: 'time',
            expression: '@DOSEERA."DOSE_ERA_START_DATE"',
            order: 4,
          },
          dosevalue: {
            name: 'Dose Value',
            disabledLangName: [
              {
                lang: 'en',
                value: '',
                visible: true,
              },
              {
                lang: 'de',
                value: '',
                visible: true,
              },
              {
                lang: 'fr',
                value: '',
                visible: true,
              },
              {
                lang: 'es',
                value: '',
                visible: true,
              },
              {
                lang: 'pt',
                value: '',
                visible: true,
              },
              {
                lang: 'zh',
                value: '',
                visible: true,
              },
            ],
            type: 'num',
            expression: '@DOSEERA."DOSE_VALUE"',
            order: 5,
          },
          doseeraid: {
            name: 'Dose Era Id',
            disabledLangName: [
              {
                lang: 'en',
                value: '',
                visible: true,
              },
              {
                lang: 'de',
                value: '',
                visible: true,
              },
              {
                lang: 'fr',
                value: '',
                visible: true,
              },
              {
                lang: 'es',
                value: '',
                visible: true,
              },
              {
                lang: 'pt',
                value: '',
                visible: true,
              },
              {
                lang: 'zh',
                value: '',
                visible: true,
              },
            ],
            type: 'text',
            expression: 'CAST (@DOSEERA."DOSE_ERA_ID" AS VARCHAR)',
            order: 6,
          },
          drugconceptcode: {
            name: 'Drug concept code',
            disabledLangName: [
              {
                lang: 'en',
                value: '',
                visible: true,
              },
              {
                lang: 'de',
                value: '',
                visible: true,
              },
              {
                lang: 'fr',
                value: '',
                visible: true,
              },
              {
                lang: 'es',
                value: '',
                visible: true,
              },
              {
                lang: 'pt',
                value: '',
                visible: true,
              },
              {
                lang: 'zh',
                value: '',
                visible: true,
              },
            ],
            type: 'text',
            expression: '@DOSEERA."DRUG_CONCEPT_CODE"',
            referenceFilter: '@REF.DOMAIN_ID = \'Drug\' AND @REF.STANDARD_CONCEPT = \'S\' AND (@REF.CONCEPT_CODE) LIKE_REGEXPR \'@SEARCH_QUERY\' FLAG \'i\'',
            referenceExpression: '@REF.CONCEPT_CODE',
            order: 7,
            useRefValue: true,
            useRefText: true,
          },
          drugconceptset: {
            name: 'Drug concept set',
            disabledLangName: [
              {
                lang: 'en',
                value: '',
                visible: true,
              },
              {
                lang: 'de',
                value: '',
                visible: true,
              },
              {
                lang: 'fr',
                value: '',
                visible: true,
              },
              {
                lang: 'es',
                value: '',
                visible: true,
              },
              {
                lang: 'pt',
                value: '',
                visible: true,
              },
              {
                lang: 'zh',
                value: '',
                visible: true,
              },
            ],
            type: 'conceptSet',
            expression: 'CAST (@DOSEERA."DRUG_CONCEPT_ID" AS VARCHAR)',
            order: 8,
            useRefValue: true,
            useRefText: true,
          },
          unitconceptcode: {
            name: 'Unit concept code',
            disabledLangName: [
              {
                lang: 'en',
                value: '',
                visible: true,
              },
              {
                lang: 'de',
                value: '',
                visible: true,
              },
              {
                lang: 'fr',
                value: '',
                visible: true,
              },
              {
                lang: 'es',
                value: '',
                visible: true,
              },
              {
                lang: 'pt',
                value: '',
                visible: true,
              },
              {
                lang: 'zh',
                value: '',
                visible: true,
              },
            ],
            type: 'text',
            expression: '@DOSEERA."UNIT_CONCEPT_CODE"',
            referenceFilter: '@REF.DOMAIN_ID = \'Unit\' AND @REF.STANDARD_CONCEPT = \'S\' AND (@REF.CONCEPT_CODE) LIKE_REGEXPR \'@SEARCH_QUERY\' FLAG \'i\'',
            referenceExpression: '@REF.CONCEPT_CODE',
            order: 9,
            useRefValue: true,
            useRefText: true,
          },
          unitconceptset: {
            name: 'Unit concept set',
            disabledLangName: [
              {
                lang: 'en',
                value: '',
                visible: true,
              },
              {
                lang: 'de',
                value: '',
                visible: true,
              },
              {
                lang: 'fr',
                value: '',
                visible: true,
              },
              {
                lang: 'es',
                value: '',
                visible: true,
              },
              {
                lang: 'pt',
                value: '',
                visible: true,
              },
              {
                lang: 'zh',
                value: '',
                visible: true,
              },
            ],
            type: 'conceptSet',
            expression: 'CAST (@DOSEERA."UNIT_CONCEPT_ID" AS VARCHAR)',
            order: 10,
            useRefValue: true,
            useRefText: true,
          },
          drugconceptid: {
            name: 'Drug concept id',
            disabledLangName: [
              {
                lang: 'en',
                value: '',
                visible: true,
              },
              {
                lang: 'de',
                value: '',
                visible: true,
              },
              {
                lang: 'fr',
                value: '',
                visible: true,
              },
              {
                lang: 'es',
                value: '',
                visible: true,
              },
              {
                lang: 'pt',
                value: '',
                visible: true,
              },
              {
                lang: 'zh',
                value: '',
                visible: true,
              },
            ],
            type: 'text',
            expression: 'CAST (@DOSEERA."DRUG_CONCEPT_ID" AS VARCHAR)',
            order: 11,
            useRefValue: true,
            useRefText: true,
          },
          unitconceptid: {
            name: 'Unit concept id',
            disabledLangName: [
              {
                lang: 'en',
                value: '',
                visible: true,
              },
              {
                lang: 'de',
                value: '',
                visible: true,
              },
              {
                lang: 'fr',
                value: '',
                visible: true,
              },
              {
                lang: 'es',
                value: '',
                visible: true,
              },
              {
                lang: 'pt',
                value: '',
                visible: true,
              },
              {
                lang: 'zh',
                value: '',
                visible: true,
              },
            ],
            type: 'text',
            expression: 'CAST (@DOSEERA."UNIT_CONCEPT_ID" AS VARCHAR)',
            order: 12,
            useRefValue: true,
            useRefText: true,
          },
        },
      },
      drugera: {
        name: 'Drug Era',
        disabledLangName: [
          {
            lang: 'en',
            value: '',
            visible: true,
          },
          {
            lang: 'de',
            value: '',
            visible: true,
          },
          {
            lang: 'fr',
            value: '',
            visible: true,
          },
          {
            lang: 'es',
            value: '',
            visible: true,
          },
          {
            lang: 'pt',
            value: '',
            visible: true,
          },
          {
            lang: 'zh',
            value: '',
            visible: true,
          },
        ],
        defaultFilter: '1=1',
        defaultPlaceholder: '@DRUGERA',
        order: 10,
        parentInteraction: [],
        parentInteractionLabel: 'parent',
        attributes: {
          enddate: {
            name: 'End Date',
            disabledLangName: [
              {
                lang: 'en',
                value: '',
                visible: true,
              },
              {
                lang: 'de',
                value: '',
                visible: true,
              },
              {
                lang: 'fr',
                value: '',
                visible: true,
              },
              {
                lang: 'es',
                value: '',
                visible: true,
              },
              {
                lang: 'pt',
                value: '',
                visible: true,
              },
              {
                lang: 'zh',
                value: '',
                visible: true,
              },
            ],
            type: 'time',
            expression: '@DRUGERA."DRUG_ERA_END_DATE"',
            order: 0,
          },
          startdate: {
            name: 'Start Date',
            disabledLangName: [
              {
                lang: 'en',
                value: '',
                visible: true,
              },
              {
                lang: 'de',
                value: '',
                visible: true,
              },
              {
                lang: 'fr',
                value: '',
                visible: true,
              },
              {
                lang: 'es',
                value: '',
                visible: true,
              },
              {
                lang: 'pt',
                value: '',
                visible: true,
              },
              {
                lang: 'zh',
                value: '',
                visible: true,
              },
            ],
            type: 'time',
            expression: '@DRUGERA."DRUG_ERA_START_DATE"',
            order: 1,
          },
          drugname: {
            name: 'Drug Name',
            disabledLangName: [
              {
                lang: 'en',
                value: '',
                visible: true,
              },
              {
                lang: 'de',
                value: '',
                visible: true,
              },
              {
                lang: 'fr',
                value: '',
                visible: true,
              },
              {
                lang: 'es',
                value: '',
                visible: true,
              },
              {
                lang: 'pt',
                value: '',
                visible: true,
              },
              {
                lang: 'zh',
                value: '',
                visible: true,
              },
            ],
            type: 'text',
            expression: '@DRUGERA."DRUG_NAME"',
            referenceFilter: '@REF.DOMAIN_ID = \'Drug\' AND @REF.STANDARD_CONCEPT = \'S\' AND (@REF.CONCEPT_NAME) LIKE_REGEXPR \'@SEARCH_QUERY\' FLAG \'i\'',
            referenceExpression: '@REF.CONCEPT_NAME',
            order: 2,
            useRefValue: true,
          },
          pid: {
            name: 'Patient Id',
            disabledLangName: [
              {
                lang: 'en',
                value: '',
                visible: true,
              },
              {
                lang: 'de',
                value: '',
                visible: true,
              },
              {
                lang: 'fr',
                value: '',
                visible: true,
              },
              {
                lang: 'es',
                value: '',
                visible: true,
              },
              {
                lang: 'pt',
                value: '',
                visible: true,
              },
              {
                lang: 'zh',
                value: '',
                visible: true,
              },
            ],
            type: 'text',
            expression: 'CAST (@DRUGERA."PATIENT_ID" AS VARCHAR)',
            order: 3,
          },
          drugeraid: {
            name: 'Drug Era Id',
            disabledLangName: [
              {
                lang: 'en',
                value: '',
                visible: true,
              },
              {
                lang: 'de',
                value: '',
                visible: true,
              },
              {
                lang: 'fr',
                value: '',
                visible: true,
              },
              {
                lang: 'es',
                value: '',
                visible: true,
              },
              {
                lang: 'pt',
                value: '',
                visible: true,
              },
              {
                lang: 'zh',
                value: '',
                visible: true,
              },
            ],
            type: 'text',
            expression: 'CAST (@DRUGERA."DRUG_ERA_ID" AS VARCHAR)',
            order: 4,
          },
          gapdays: {
            name: 'Gap Days',
            disabledLangName: [
              {
                lang: 'en',
                value: '',
                visible: true,
              },
              {
                lang: 'de',
                value: '',
                visible: true,
              },
              {
                lang: 'fr',
                value: '',
                visible: true,
              },
              {
                lang: 'es',
                value: '',
                visible: true,
              },
              {
                lang: 'pt',
                value: '',
                visible: true,
              },
              {
                lang: 'zh',
                value: '',
                visible: true,
              },
            ],
            type: 'num',
            expression: '@DRUGERA."GAP_DAYS"',
            order: 5,
          },
          drugexpcount: {
            name: 'Drug Exposure Count',
            disabledLangName: [
              {
                lang: 'en',
                value: '',
                visible: true,
              },
              {
                lang: 'de',
                value: '',
                visible: true,
              },
              {
                lang: 'fr',
                value: '',
                visible: true,
              },
              {
                lang: 'es',
                value: '',
                visible: true,
              },
              {
                lang: 'pt',
                value: '',
                visible: true,
              },
              {
                lang: 'zh',
                value: '',
                visible: true,
              },
            ],
            type: 'num',
            expression: 'CAST (@DRUGERA."DRUG_EXPOSURE_COUNT" AS VARCHAR)',
            order: 6,
          },
          drugconceptcode: {
            name: 'Drug concept code',
            disabledLangName: [
              {
                lang: 'en',
                value: '',
                visible: true,
              },
              {
                lang: 'de',
                value: '',
                visible: true,
              },
              {
                lang: 'fr',
                value: '',
                visible: true,
              },
              {
                lang: 'es',
                value: '',
                visible: true,
              },
              {
                lang: 'pt',
                value: '',
                visible: true,
              },
              {
                lang: 'zh',
                value: '',
                visible: true,
              },
            ],
            type: 'text',
            expression: '@DRUGERA."DRUG_CONCEPT_CODE"',
            referenceFilter: '@REF.DOMAIN_ID = \'Drug\' AND @REF.STANDARD_CONCEPT = \'S\' AND (@REF.CONCEPT_CODE) LIKE_REGEXPR \'@SEARCH_QUERY\' FLAG \'i\'',
            referenceExpression: '@REF.CONCEPT_CODE',
            order: 7,
            useRefValue: true,
            useRefText: true,
          },
          drugconceptset: {
            name: 'Drug concept set',
            disabledLangName: [
              {
                lang: 'en',
                value: '',
                visible: true,
              },
              {
                lang: 'de',
                value: '',
                visible: true,
              },
              {
                lang: 'fr',
                value: '',
                visible: true,
              },
              {
                lang: 'es',
                value: '',
                visible: true,
              },
              {
                lang: 'pt',
                value: '',
                visible: true,
              },
              {
                lang: 'zh',
                value: '',
                visible: true,
              },
            ],
            type: 'conceptSet',
            expression: 'CAST (@DRUGERA."DRUG_CONCEPT_ID" AS VARCHAR)',
            order: 8,
            useRefValue: true,
            useRefText: true,
          },
          drugconceptid: {
            name: 'Drug concept id',
            disabledLangName: [
              {
                lang: 'en',
                value: '',
                visible: true,
              },
              {
                lang: 'de',
                value: '',
                visible: true,
              },
              {
                lang: 'fr',
                value: '',
                visible: true,
              },
              {
                lang: 'es',
                value: '',
                visible: true,
              },
              {
                lang: 'pt',
                value: '',
                visible: true,
              },
              {
                lang: 'zh',
                value: '',
                visible: true,
              },
            ],
            type: 'text',
            expression: 'CAST (@DRUGERA."DRUG_CONCEPT_ID" AS VARCHAR)',
            order: 9,
            useRefValue: true,
            useRefText: true,
          },
        },
      },
      drugexposure: {
        name: 'Drug Exposure',
        disabledLangName: [
          {
            lang: 'en',
            value: '',
            visible: true,
          },
          {
            lang: 'de',
            value: '',
            visible: true,
          },
          {
            lang: 'fr',
            value: '',
            visible: true,
          },
          {
            lang: 'es',
            value: '',
            visible: true,
          },
          {
            lang: 'pt',
            value: '',
            visible: true,
          },
          {
            lang: 'zh',
            value: '',
            visible: true,
          },
        ],
        defaultFilter: '1=1',
        defaultPlaceholder: '@DRUGEXP',
        order: 9,
        parentInteraction: [],
        parentInteractionLabel: 'parent',
        attributes: {
          enddatetime: {
            name: 'End Date/Time',
            disabledLangName: [
              {
                lang: 'en',
                value: '',
                visible: true,
              },
              {
                lang: 'de',
                value: '',
                visible: true,
              },
              {
                lang: 'fr',
                value: '',
                visible: true,
              },
              {
                lang: 'es',
                value: '',
                visible: true,
              },
              {
                lang: 'pt',
                value: '',
                visible: true,
              },
              {
                lang: 'zh',
                value: '',
                visible: true,
              },
            ],
            type: 'datetime',
            expression: '@DRUGEXP."DRUG_EXPOSURE_END_DATETIME"',
            order: 0,
          },
          refills: {
            name: 'Refills',
            disabledLangName: [
              {
                lang: 'en',
                value: '',
                visible: true,
              },
              {
                lang: 'de',
                value: '',
                visible: true,
              },
              {
                lang: 'fr',
                value: '',
                visible: true,
              },
              {
                lang: 'es',
                value: '',
                visible: true,
              },
              {
                lang: 'pt',
                value: '',
                visible: true,
              },
              {
                lang: 'zh',
                value: '',
                visible: true,
              },
            ],
            type: 'num',
            expression: 'CAST (@DRUGEXP."REFILLS" AS VARCHAR)',
            order: 1,
          },
          startdatetime: {
            name: 'Start Date/Time',
            disabledLangName: [
              {
                lang: 'en',
                value: '',
                visible: true,
              },
              {
                lang: 'de',
                value: '',
                visible: true,
              },
              {
                lang: 'fr',
                value: '',
                visible: true,
              },
              {
                lang: 'es',
                value: '',
                visible: true,
              },
              {
                lang: 'pt',
                value: '',
                visible: true,
              },
              {
                lang: 'zh',
                value: '',
                visible: true,
              },
            ],
            type: 'datetime',
            expression: '@DRUGEXP."DRUG_EXPOSURE_START_DATETIME"',
            order: 2,
          },
          stopreason: {
            name: 'Stop Reason',
            disabledLangName: [
              {
                lang: 'en',
                value: '',
                visible: true,
              },
              {
                lang: 'de',
                value: '',
                visible: true,
              },
              {
                lang: 'fr',
                value: '',
                visible: true,
              },
              {
                lang: 'es',
                value: '',
                visible: true,
              },
              {
                lang: 'pt',
                value: '',
                visible: true,
              },
              {
                lang: 'zh',
                value: '',
                visible: true,
              },
            ],
            type: 'text',
            expression: '@DRUGEXP."STOP_REASON"',
            order: 3,
          },
          enddate: {
            name: 'End Date',
            disabledLangName: [
              {
                lang: 'en',
                value: '',
                visible: true,
              },
              {
                lang: 'de',
                value: '',
                visible: true,
              },
              {
                lang: 'fr',
                value: '',
                visible: true,
              },
              {
                lang: 'es',
                value: '',
                visible: true,
              },
              {
                lang: 'pt',
                value: '',
                visible: true,
              },
              {
                lang: 'zh',
                value: '',
                visible: true,
              },
            ],
            type: 'time',
            expression: '@DRUGEXP."DRUG_EXPOSURE_END_DATE"',
            order: 4,
          },
          drugtype: {
            name: 'Drug Type',
            disabledLangName: [
              {
                lang: 'en',
                value: '',
                visible: true,
              },
              {
                lang: 'de',
                value: '',
                visible: true,
              },
              {
                lang: 'fr',
                value: '',
                visible: true,
              },
              {
                lang: 'es',
                value: '',
                visible: true,
              },
              {
                lang: 'pt',
                value: '',
                visible: true,
              },
              {
                lang: 'zh',
                value: '',
                visible: true,
              },
            ],
            type: 'text',
            expression: '@DRUGEXP."DRUG_TYPE_NAME"',
            referenceFilter: '@REF.DOMAIN_ID = \'Type Concept\' AND @REF.CONCEPT_CLASS_ID = \'Drug Type\' AND (@REF.CONCEPT_NAME) LIKE_REGEXPR \'@SEARCH_QUERY\' FLAG \'i\'',
            referenceExpression: '@REF.CONCEPT_NAME',
            order: 5,
            useRefValue: true,
          },
          startdate: {
            name: 'Start Date',
            disabledLangName: [
              {
                lang: 'en',
                value: '',
                visible: true,
              },
              {
                lang: 'de',
                value: '',
                visible: true,
              },
              {
                lang: 'fr',
                value: '',
                visible: true,
              },
              {
                lang: 'es',
                value: '',
                visible: true,
              },
              {
                lang: 'pt',
                value: '',
                visible: true,
              },
              {
                lang: 'zh',
                value: '',
                visible: true,
              },
            ],
            type: 'time',
            expression: '@DRUGEXP."DRUG_EXPOSURE_START_DATE"',
            order: 6,
          },
          drugname: {
            name: 'Drug Name',
            disabledLangName: [
              {
                lang: 'en',
                value: '',
                visible: true,
              },
              {
                lang: 'de',
                value: '',
                visible: true,
              },
              {
                lang: 'fr',
                value: '',
                visible: true,
              },
              {
                lang: 'es',
                value: '',
                visible: true,
              },
              {
                lang: 'pt',
                value: '',
                visible: true,
              },
              {
                lang: 'zh',
                value: '',
                visible: true,
              },
            ],
            type: 'text',
            expression: '@DRUGEXP."DRUG_NAME"',
            referenceFilter: '@REF.DOMAIN_ID = \'Drug\' AND @REF.STANDARD_CONCEPT = \'S\' AND (@REF.CONCEPT_NAME) LIKE_REGEXPR \'@SEARCH_QUERY\' FLAG \'i\'',
            referenceExpression: '@REF.CONCEPT_NAME',
            order: 7,
            useRefValue: true,
          },
          lotnumber: {
            name: 'Lot Number',
            disabledLangName: [
              {
                lang: 'en',
                value: '',
                visible: true,
              },
              {
                lang: 'de',
                value: '',
                visible: true,
              },
              {
                lang: 'fr',
                value: '',
                visible: true,
              },
              {
                lang: 'es',
                value: '',
                visible: true,
              },
              {
                lang: 'pt',
                value: '',
                visible: true,
              },
              {
                lang: 'zh',
                value: '',
                visible: true,
              },
            ],
            type: 'text',
            expression: '@DRUGEXP."LOT_NUMBER"',
            order: 8,
          },
          routename: {
            name: 'Route Name',
            disabledLangName: [
              {
                lang: 'en',
                value: '',
                visible: true,
              },
              {
                lang: 'de',
                value: '',
                visible: true,
              },
              {
                lang: 'fr',
                value: '',
                visible: true,
              },
              {
                lang: 'es',
                value: '',
                visible: true,
              },
              {
                lang: 'pt',
                value: '',
                visible: true,
              },
              {
                lang: 'zh',
                value: '',
                visible: true,
              },
            ],
            type: 'text',
            expression: '@DRUGEXP."ROUTE_NAME"',
            referenceFilter: '@REF.DOMAIN_ID = \'Route\' AND @REF.STANDARD_CONCEPT = \'S\' AND (@REF.CONCEPT_NAME) LIKE_REGEXPR \'@SEARCH_QUERY\' FLAG \'i\'',
            referenceExpression: '@REF.CONCEPT_NAME',
            order: 9,
            useRefValue: true,
          },
          drugexposureid: {
            name: 'Drug Exposure Id',
            disabledLangName: [
              {
                lang: 'en',
                value: '',
                visible: true,
              },
              {
                lang: 'de',
                value: '',
                visible: true,
              },
              {
                lang: 'fr',
                value: '',
                visible: true,
              },
              {
                lang: 'es',
                value: '',
                visible: true,
              },
              {
                lang: 'pt',
                value: '',
                visible: true,
              },
              {
                lang: 'zh',
                value: '',
                visible: true,
              },
            ],
            type: 'text',
            expression: 'CAST (@DRUGEXP."DRUG_EXPOSURE_ID" AS VARCHAR)',
            order: 10,
          },
          sig: {
            name: 'Sig',
            disabledLangName: [
              {
                lang: 'en',
                value: '',
                visible: true,
              },
              {
                lang: 'de',
                value: '',
                visible: true,
              },
              {
                lang: 'fr',
                value: '',
                visible: true,
              },
              {
                lang: 'es',
                value: '',
                visible: true,
              },
              {
                lang: 'pt',
                value: '',
                visible: true,
              },
              {
                lang: 'zh',
                value: '',
                visible: true,
              },
            ],
            type: 'text',
            expression: 'CAST (@DRUGEXP."SIG" AS VARCHAR)',
            order: 11,
          },
          pid: {
            name: 'Patient Id',
            disabledLangName: [
              {
                lang: 'en',
                value: '',
                visible: true,
              },
              {
                lang: 'de',
                value: '',
                visible: true,
              },
              {
                lang: 'fr',
                value: '',
                visible: true,
              },
              {
                lang: 'es',
                value: '',
                visible: true,
              },
              {
                lang: 'pt',
                value: '',
                visible: true,
              },
              {
                lang: 'zh',
                value: '',
                visible: true,
              },
            ],
            type: 'text',
            expression: 'CAST (@DRUGEXP."PATIENT_ID" AS VARCHAR)',
            order: 12,
          },
          verbatimenddate: {
            name: 'Verbatim End Date',
            disabledLangName: [
              {
                lang: 'en',
                value: '',
                visible: true,
              },
              {
                lang: 'de',
                value: '',
                visible: true,
              },
              {
                lang: 'fr',
                value: '',
                visible: true,
              },
              {
                lang: 'es',
                value: '',
                visible: true,
              },
              {
                lang: 'pt',
                value: '',
                visible: true,
              },
              {
                lang: 'zh',
                value: '',
                visible: true,
              },
            ],
            type: 'time',
            expression: '@DRUGEXP."VERBATIM_END_DATE"',
            order: 13,
          },
          dayssupply: {
            name: 'Days of supply',
            disabledLangName: [
              {
                lang: 'en',
                value: '',
                visible: true,
              },
              {
                lang: 'de',
                value: '',
                visible: true,
              },
              {
                lang: 'fr',
                value: '',
                visible: true,
              },
              {
                lang: 'es',
                value: '',
                visible: true,
              },
              {
                lang: 'pt',
                value: '',
                visible: true,
              },
              {
                lang: 'zh',
                value: '',
                visible: true,
              },
            ],
            type: 'num',
            expression: 'CAST (@DRUGEXP."DAYS_SUPPLY" AS VARCHAR)',
            order: 14,
          },
          drugconceptcode: {
            name: 'Drug concept code',
            disabledLangName: [
              {
                lang: 'en',
                value: '',
                visible: true,
              },
              {
                lang: 'de',
                value: '',
                visible: true,
              },
              {
                lang: 'fr',
                value: '',
                visible: true,
              },
              {
                lang: 'es',
                value: '',
                visible: true,
              },
              {
                lang: 'pt',
                value: '',
                visible: true,
              },
              {
                lang: 'zh',
                value: '',
                visible: true,
              },
            ],
            type: 'text',
            expression: '@DRUGEXP."DRUG_CONCEPT_CODE"',
            referenceFilter: '@REF.DOMAIN_ID = \'Drug\' AND @REF.STANDARD_CONCEPT = \'S\' AND (@REF.CONCEPT_CODE) LIKE_REGEXPR \'@SEARCH_QUERY\' FLAG \'i\'',
            referenceExpression: '@REF.CONCEPT_CODE',
            order: 15,
            useRefValue: true,
            useRefText: true,
          },
          drugtypeconceptcode: {
            name: 'Drug Type concept code',
            disabledLangName: [
              {
                lang: 'en',
                value: '',
                visible: true,
              },
              {
                lang: 'de',
                value: '',
                visible: true,
              },
              {
                lang: 'fr',
                value: '',
                visible: true,
              },
              {
                lang: 'es',
                value: '',
                visible: true,
              },
              {
                lang: 'pt',
                value: '',
                visible: true,
              },
              {
                lang: 'zh',
                value: '',
                visible: true,
              },
            ],
            type: 'text',
            expression: '@DRUGEXP."DRUG_TYPE_CONCEPT_CODE"',
            referenceFilter: '@REF.DOMAIN_ID = \'Type Concept\' AND @REF.CONCEPT_CLASS_ID = \'Drug Type\' AND (@REF.CONCEPT_CODE) LIKE_REGEXPR \'@SEARCH_QUERY\' FLAG \'i\'',
            referenceExpression: '@REF.CONCEPT_CODE',
            order: 16,
            useRefValue: true,
            useRefText: true,
          },
          routeconceptcode: {
            name: 'Route concept code',
            disabledLangName: [
              {
                lang: 'en',
                value: '',
                visible: true,
              },
              {
                lang: 'de',
                value: '',
                visible: true,
              },
              {
                lang: 'fr',
                value: '',
                visible: true,
              },
              {
                lang: 'es',
                value: '',
                visible: true,
              },
              {
                lang: 'pt',
                value: '',
                visible: true,
              },
              {
                lang: 'zh',
                value: '',
                visible: true,
              },
            ],
            type: 'text',
            expression: '@DRUGEXP."ROUTE_CONCEPT_CODE"',
            referenceFilter: '@REF.DOMAIN_ID = \'Route\' AND @REF.STANDARD_CONCEPT = \'S\' AND (@REF.CONCEPT_CODE) LIKE_REGEXPR \'@SEARCH_QUERY\' FLAG \'i\'',
            referenceExpression: '@REF.CONCEPT_CODE',
            order: 17,
            useRefValue: true,
            useRefText: true,
          },
          drugconceptid: {
            name: 'Drug concept id',
            disabledLangName: [
              {
                lang: 'en',
                value: '',
                visible: true,
              },
              {
                lang: 'de',
                value: '',
                visible: true,
              },
              {
                lang: 'fr',
                value: '',
                visible: true,
              },
              {
                lang: 'es',
                value: '',
                visible: true,
              },
              {
                lang: 'pt',
                value: '',
                visible: true,
              },
              {
                lang: 'zh',
                value: '',
                visible: true,
              },
            ],
            type: 'text',
            expression: '@DRUGEXP."DRUG_CONCEPT_ID"',
            referenceFilter: '@REF.DOMAIN_ID = \'Drug\' AND @REF.STANDARD_CONCEPT = \'S\' AND CAST (@REF.CONCEPT_ID AS VARCHAR) LIKE_REGEXPR \'@SEARCH_QUERY\' FLAG \'i\'',
            referenceExpression: 'CAST (@REF.CONCEPT_ID AS VARCHAR)',
            order: 18,
            useRefValue: true,
            useRefText: true,
          },
          drugconceptset: {
            name: 'Drug concept set',
            disabledLangName: [
              {
                lang: 'en',
                value: '',
                visible: true,
              },
              {
                lang: 'de',
                value: '',
                visible: true,
              },
              {
                lang: 'fr',
                value: '',
                visible: true,
              },
              {
                lang: 'es',
                value: '',
                visible: true,
              },
              {
                lang: 'pt',
                value: '',
                visible: true,
              },
              {
                lang: 'zh',
                value: '',
                visible: true,
              },
            ],
            type: 'conceptSet',
            expression: 'CAST (@DRUGEXP."DRUG_CONCEPT_ID" AS VARCHAR)',
            order: 19,
            useRefValue: true,
            useRefText: true,
          },
          routeconceptid: {
            name: 'Route concept id',
            disabledLangName: [
              {
                lang: 'en',
                value: '',
                visible: true,
              },
              {
                lang: 'de',
                value: '',
                visible: true,
              },
              {
                lang: 'fr',
                value: '',
                visible: true,
              },
              {
                lang: 'es',
                value: '',
                visible: true,
              },
              {
                lang: 'pt',
                value: '',
                visible: true,
              },
              {
                lang: 'zh',
                value: '',
                visible: true,
              },
            ],
            type: 'text',
            expression: '@DRUGEXP."ROUTE_CONCEPT_ID"',
            referenceFilter: '@REF.DOMAIN_ID = \'Route\' AND @REF.STANDARD_CONCEPT = \'S\' AND CAST (@REF.CONCEPT_ID AS VARCHAR) LIKE_REGEXPR \'@SEARCH_QUERY\' FLAG \'i\'',
            referenceExpression: '@REF.CONCEPT_ID',
            order: 20,
            useRefValue: true,
            useRefText: true,
          },
          routeconceptset: {
            name: 'Route concept set',
            disabledLangName: [
              {
                lang: 'en',
                value: '',
                visible: true,
              },
              {
                lang: 'de',
                value: '',
                visible: true,
              },
              {
                lang: 'fr',
                value: '',
                visible: true,
              },
              {
                lang: 'es',
                value: '',
                visible: true,
              },
              {
                lang: 'pt',
                value: '',
                visible: true,
              },
              {
                lang: 'zh',
                value: '',
                visible: true,
              },
            ],
            type: 'conceptSet',
            expression: 'CAST (@DRUGEXP."ROUTE_CONCEPT_ID" AS VARCHAR)',
            order: 21,
            useRefValue: true,
            useRefText: true,
          },
          drugtypeconceptid: {
            name: 'Drug type concept id',
            disabledLangName: [
              {
                lang: 'en',
                value: '',
                visible: true,
              },
              {
                lang: 'de',
                value: '',
                visible: true,
              },
              {
                lang: 'fr',
                value: '',
                visible: true,
              },
              {
                lang: 'es',
                value: '',
                visible: true,
              },
              {
                lang: 'pt',
                value: '',
                visible: true,
              },
              {
                lang: 'zh',
                value: '',
                visible: true,
              },
            ],
            type: 'text',
            expression: '@DRUGEXP."DRUG_TYPE_CONCEPT_ID"',
            referenceFilter: '@REF.DOMAIN_ID = \'Type Concept\' AND @REF.CONCEPT_CLASS_ID = \'Drug Type\' AND CAST (@REF.CONCEPT_ID AS VARCHAR) LIKE_REGEXPR \'@SEARCH_QUERY\' FLAG \'i\'',
            referenceExpression: '@REF.CONCEPT_ID',
            order: 22,
            useRefValue: true,
            useRefText: true,
          },
          drugtypeconceptset: {
            name: 'Drug type concept set',
            disabledLangName: [
              {
                lang: 'en',
                value: '',
                visible: true,
              },
              {
                lang: 'de',
                value: '',
                visible: true,
              },
              {
                lang: 'fr',
                value: '',
                visible: true,
              },
              {
                lang: 'es',
                value: '',
                visible: true,
              },
              {
                lang: 'pt',
                value: '',
                visible: true,
              },
              {
                lang: 'zh',
                value: '',
                visible: true,
              },
            ],
            type: 'conceptSet',
            expression: 'CAST (@DRUGEXP."DRUG_TYPE_CONCEPT_ID" AS VARCHAR)',
            order: 23,
            useRefValue: true,
            useRefText: true,
          },
        },
      },
      measurement: {
        name: 'Measurement',
        disabledLangName: [
          {
            lang: 'en',
            value: '',
            visible: true,
          },
          {
            lang: 'de',
            value: '',
            visible: true,
          },
          {
            lang: 'fr',
            value: '',
            visible: true,
          },
          {
            lang: 'es',
            value: '',
            visible: true,
          },
          {
            lang: 'pt',
            value: '',
            visible: true,
          },
          {
            lang: 'zh',
            value: '',
            visible: true,
          },
        ],
        defaultFilter: '1=1',
        defaultPlaceholder: '@MEAS',
        order: 7,
        parentInteraction: [],
        parentInteractionLabel: 'parent',
        attributes: {
          numval: {
            name: 'Value (numeric)',
            disabledLangName: [
              {
                lang: 'en',
                value: '',
                visible: true,
              },
              {
                lang: 'de',
                value: '',
                visible: true,
              },
              {
                lang: 'fr',
                value: '',
                visible: true,
              },
              {
                lang: 'es',
                value: '',
                visible: true,
              },
              {
                lang: 'pt',
                value: '',
                visible: true,
              },
              {
                lang: 'zh',
                value: '',
                visible: true,
              },
            ],
            type: 'num',
            expression: '@MEAS."VALUE_AS_NUMBER"',
            order: 0,
          },
          measurementname: {
            name: 'Measurement name',
            disabledLangName: [
              {
                lang: 'de',
                value: '',
                visible: true,
              },
              {
                lang: 'fr',
                value: '',
                visible: true,
              },
              {
                lang: 'es',
                value: '',
                visible: true,
              },
              {
                lang: 'pt',
                value: '',
                visible: true,
              },
              {
                lang: 'zh',
                value: '',
                visible: true,
              },
            ],
            type: 'text',
            expression: '@MEAS."MEASUREMENT_NAME"',
            referenceFilter: '@REF.DOMAIN_ID = \'Measurement\' AND (@REF.CONCEPT_NAME) LIKE_REGEXPR \'@SEARCH_QUERY\' FLAG \'i\'',
            referenceExpression: '@REF.CONCEPT_NAME',
            order: 1,
            useRefValue: true,
          },
          measurementtype: {
            name: 'Measurement type',
            disabledLangName: [
              {
                lang: 'en',
                value: '',
                visible: true,
              },
              {
                lang: 'de',
                value: '',
                visible: true,
              },
              {
                lang: 'fr',
                value: '',
                visible: true,
              },
              {
                lang: 'es',
                value: '',
                visible: true,
              },
              {
                lang: 'pt',
                value: '',
                visible: true,
              },
              {
                lang: 'zh',
                value: '',
                visible: true,
              },
            ],
            type: 'text',
            expression: '@MEAS."MEASUREMENT_TYPE_NAME"',
            referenceFilter: '@REF.CONCEPT_CLASS_ID = \'Measurement\' AND (@REF.CONCEPT_NAME) LIKE_REGEXPR \'@SEARCH_QUERY\' FLAG \'i\'',
            referenceExpression: '@REF.CONCEPT_NAME',
            order: 2,
          },
          measurementdate: {
            name: 'Measurement date',
            disabledLangName: [
              {
                lang: 'en',
                value: '',
                visible: true,
              },
              {
                lang: 'de',
                value: '',
                visible: true,
              },
              {
                lang: 'fr',
                value: '',
                visible: true,
              },
              {
                lang: 'es',
                value: '',
                visible: true,
              },
              {
                lang: 'pt',
                value: '',
                visible: true,
              },
              {
                lang: 'zh',
                value: '',
                visible: true,
              },
            ],
            type: 'time',
            expression: '@MEAS."MEASUREMENT_DATE"',
            order: 3,
          },
          pid: {
            name: 'Patient Id',
            disabledLangName: [
              {
                lang: 'en',
                value: '',
                visible: true,
              },
              {
                lang: 'de',
                value: '',
                visible: true,
              },
              {
                lang: 'fr',
                value: '',
                visible: true,
              },
              {
                lang: 'es',
                value: '',
                visible: true,
              },
              {
                lang: 'pt',
                value: '',
                visible: true,
              },
              {
                lang: 'zh',
                value: '',
                visible: true,
              },
            ],
            type: 'text',
            expression: 'CAST (@MEAS."PATIENT_ID" AS VARCHAR)',
            order: 4,
          },
          measurementid: {
            name: 'Measurement Id',
            disabledLangName: [
              {
                lang: 'en',
                value: '',
                visible: true,
              },
              {
                lang: 'de',
                value: '',
                visible: true,
              },
              {
                lang: 'fr',
                value: '',
                visible: true,
              },
              {
                lang: 'es',
                value: '',
                visible: true,
              },
              {
                lang: 'pt',
                value: '',
                visible: true,
              },
              {
                lang: 'zh',
                value: '',
                visible: true,
              },
            ],
            type: 'text',
            expression: 'CAST (@MEAS."MEASUREMENT_ID" AS VARCHAR)',
            order: 5,
          },
          textval: {
            name: 'Value (text)',
            disabledLangName: [
              {
                lang: 'en',
                value: '',
                visible: true,
              },
              {
                lang: 'de',
                value: '',
                visible: true,
              },
              {
                lang: 'fr',
                value: '',
                visible: true,
              },
              {
                lang: 'es',
                value: '',
                visible: true,
              },
              {
                lang: 'pt',
                value: '',
                visible: true,
              },
              {
                lang: 'zh',
                value: '',
                visible: true,
              },
            ],
            type: 'text',
            expression: '@MEAS."MEASUREMENT_VALUE_NAME"',
            order: 6,
          },
          measurementconceptcode: {
            name: 'Measurement concept code',
            disabledLangName: [
              {
                lang: 'en',
                value: '',
                visible: true,
              },
              {
                lang: 'de',
                value: '',
                visible: true,
              },
              {
                lang: 'fr',
                value: '',
                visible: true,
              },
              {
                lang: 'es',
                value: '',
                visible: true,
              },
              {
                lang: 'pt',
                value: '',
                visible: true,
              },
              {
                lang: 'zh',
                value: '',
                visible: true,
              },
            ],
            type: 'text',
            expression: '@MEAS."MEASUREMENT_CONCEPT_CODE"',
            referenceFilter: '@REF.DOMAIN_ID = \'Measurement\' AND (@REF.CONCEPT_CODE) LIKE_REGEXPR \'@SEARCH_QUERY\' FLAG \'i\'',
            referenceExpression: '@REF.CONCEPT_CODE',
            order: 7,
            useRefValue: true,
            useRefText: true,
          },
          measurementtypeconceptcode: {
            name: 'Measurement type concept code',
            disabledLangName: [
              {
                lang: 'en',
                value: '',
                visible: true,
              },
              {
                lang: 'de',
                value: '',
                visible: true,
              },
              {
                lang: 'fr',
                value: '',
                visible: true,
              },
              {
                lang: 'es',
                value: '',
                visible: true,
              },
              {
                lang: 'pt',
                value: '',
                visible: true,
              },
              {
                lang: 'zh',
                value: '',
                visible: true,
              },
            ],
            type: 'text',
            expression: '@MEAS."MEASUREMENT_TYPE_CONCEPT_CODE"',
            referenceFilter: '@REF.CONCEPT_CLASS_ID = \'Measurement\' AND (@REF.CONCEPT_CODE) LIKE_REGEXPR \'@SEARCH_QUERY\' FLAG \'i\'',
            referenceExpression: '@REF.CONCEPT_CODE',
            order: 8,
            useRefValue: true,
            useRefText: true,
          },
          measurementtypeconceptset: {
            name: 'Measurement type concept set',
            disabledLangName: [
              {
                lang: 'en',
                value: '',
                visible: true,
              },
              {
                lang: 'de',
                value: '',
                visible: true,
              },
              {
                lang: 'fr',
                value: '',
                visible: true,
              },
              {
                lang: 'es',
                value: '',
                visible: true,
              },
              {
                lang: 'pt',
                value: '',
                visible: true,
              },
              {
                lang: 'zh',
                value: '',
                visible: true,
              },
            ],
            type: 'conceptSet',
            expression: 'CAST (@MEAS."MEASUREMENT_TYPE_CONCEPT_ID" AS VARCHAR)',
            order: 9,
            useRefValue: true,
            useRefText: true,
          },
          valueasconceptcode: {
            name: 'Value as concept code',
            disabledLangName: [
              {
                lang: 'en',
                value: '',
                visible: true,
              },
              {
                lang: 'de',
                value: '',
                visible: true,
              },
              {
                lang: 'fr',
                value: '',
                visible: true,
              },
              {
                lang: 'es',
                value: '',
                visible: true,
              },
              {
                lang: 'pt',
                value: '',
                visible: true,
              },
              {
                lang: 'zh',
                value: '',
                visible: true,
              },
            ],
            type: 'text',
            expression: '@MEAS."VALUE_AS_CONCEPT_CODE"',
            order: 10,
          },
          valueasconceptset: {
            name: 'Value as concept set',
            disabledLangName: [
              {
                lang: 'en',
                value: '',
                visible: true,
              },
              {
                lang: 'de',
                value: '',
                visible: true,
              },
              {
                lang: 'fr',
                value: '',
                visible: true,
              },
              {
                lang: 'es',
                value: '',
                visible: true,
              },
              {
                lang: 'pt',
                value: '',
                visible: true,
              },
              {
                lang: 'zh',
                value: '',
                visible: true,
              },
            ],
            type: 'conceptSet',
            expression: 'CAST (@MEAS."VALUE_AS_CONCEPT_ID" AS VARCHAR)',
            order: 11,
          },
          unitconceptcode: {
            name: 'Unit concept code',
            disabledLangName: [
              {
                lang: 'en',
                value: '',
                visible: true,
              },
              {
                lang: 'de',
                value: '',
                visible: true,
              },
              {
                lang: 'fr',
                value: '',
                visible: true,
              },
              {
                lang: 'es',
                value: '',
                visible: true,
              },
              {
                lang: 'pt',
                value: '',
                visible: true,
              },
              {
                lang: 'zh',
                value: '',
                visible: true,
              },
            ],
            type: 'text',
            expression: '@MEAS."UNIT_CONCEPT_CODE"',
            referenceFilter: '@REF.DOMAIN_ID = \'Unit\' AND @REF.STANDARD_CONCEPT = \'S\' AND (@REF.CONCEPT_CODE) LIKE_REGEXPR \'@SEARCH_QUERY\' FLAG \'i\'',
            referenceExpression: '@REF.CONCEPT_CODE',
            order: 12,
          },
          unitconceptset: {
            name: 'Unit concept set',
            disabledLangName: [
              {
                lang: 'en',
                value: '',
                visible: true,
              },
              {
                lang: 'de',
                value: '',
                visible: true,
              },
              {
                lang: 'fr',
                value: '',
                visible: true,
              },
              {
                lang: 'es',
                value: '',
                visible: true,
              },
              {
                lang: 'pt',
                value: '',
                visible: true,
              },
              {
                lang: 'zh',
                value: '',
                visible: true,
              },
            ],
            type: 'conceptSet',
            expression: 'CAST (@MEAS."UNIT_CONCEPT_ID" AS VARCHAR)',
            order: 13,
          },
          measurementconceptid: {
            name: 'Measurement concept id',
            disabledLangName: [
              {
                lang: 'en',
                value: '',
                visible: true,
              },
              {
                lang: 'de',
                value: '',
                visible: true,
              },
              {
                lang: 'fr',
                value: '',
                visible: true,
              },
              {
                lang: 'es',
                value: '',
                visible: true,
              },
              {
                lang: 'pt',
                value: '',
                visible: true,
              },
              {
                lang: 'zh',
                value: '',
                visible: true,
              },
            ],
            type: 'text',
            expression: '@MEAS."MEASUREMENT_CONCEPT_ID"',
            referenceFilter: '@REF.DOMAIN_ID = \'Measurement\' AND CAST (@REF.CONCEPT_ID AS VARCHAR) LIKE_REGEXPR \'@SEARCH_QUERY\' FLAG \'i\'',
            referenceExpression: '@REF.CONCEPT_ID',
            order: 14,
            useRefValue: true,
            useRefText: true,
          },
          measurementconceptset: {
            name: 'Measurement concept set',
            disabledLangName: [
              {
                lang: 'en',
                value: '',
                visible: true,
              },
              {
                lang: 'de',
                value: '',
                visible: true,
              },
              {
                lang: 'fr',
                value: '',
                visible: true,
              },
              {
                lang: 'es',
                value: '',
                visible: true,
              },
              {
                lang: 'pt',
                value: '',
                visible: true,
              },
              {
                lang: 'zh',
                value: '',
                visible: true,
              },
            ],
            type: 'conceptSet',
            expression: 'CAST (@MEAS."MEASUREMENT_CONCEPT_ID" AS VARCHAR)',
            order: 15,
            useRefValue: true,
            useRefText: true,
          },
          measurementtypeconceptid: {
            name: 'Measurement type concept id',
            disabledLangName: [
              {
                lang: 'en',
                value: '',
                visible: true,
              },
              {
                lang: 'de',
                value: '',
                visible: true,
              },
              {
                lang: 'fr',
                value: '',
                visible: true,
              },
              {
                lang: 'es',
                value: '',
                visible: true,
              },
              {
                lang: 'pt',
                value: '',
                visible: true,
              },
              {
                lang: 'zh',
                value: '',
                visible: true,
              },
            ],
            type: 'text',
            expression: 'CAST (@MEAS."MEASUREMENT_TYPE_CONCEPT_ID" AS VARCHAR)',
            order: 16,
            useRefValue: true,
            useRefText: true,
          },
          valueasconceptid: {
            name: 'Value as concept id',
            disabledLangName: [
              {
                lang: 'en',
                value: '',
                visible: true,
              },
              {
                lang: 'de',
                value: '',
                visible: true,
              },
              {
                lang: 'fr',
                value: '',
                visible: true,
              },
              {
                lang: 'es',
                value: '',
                visible: true,
              },
              {
                lang: 'pt',
                value: '',
                visible: true,
              },
              {
                lang: 'zh',
                value: '',
                visible: true,
              },
            ],
            type: 'text',
            expression: 'CAST (@MEAS."VALUE_AS_CONCEPT_ID" AS VARCHAR)',
            order: 17,
          },
          unitconceptid: {
            name: 'Unit concept id',
            disabledLangName: [
              {
                lang: 'en',
                value: '',
                visible: true,
              },
              {
                lang: 'de',
                value: '',
                visible: true,
              },
              {
                lang: 'fr',
                value: '',
                visible: true,
              },
              {
                lang: 'es',
                value: '',
                visible: true,
              },
              {
                lang: 'pt',
                value: '',
                visible: true,
              },
              {
                lang: 'zh',
                value: '',
                visible: true,
              },
            ],
            type: 'text',
            expression: 'CAST (@MEAS."UNIT_CONCEPT_ID" AS VARCHAR)',
            order: 18,
          },
        },
      },
      observation: {
        name: 'Observation',
        disabledLangName: [
          {
            lang: 'en',
            value: '',
            visible: true,
          },
          {
            lang: 'de',
            value: '',
            visible: true,
          },
          {
            lang: 'fr',
            value: '',
            visible: true,
          },
          {
            lang: 'es',
            value: '',
            visible: true,
          },
          {
            lang: 'pt',
            value: '',
            visible: true,
          },
          {
            lang: 'zh',
            value: '',
            visible: true,
          },
        ],
        defaultFilter: '1=1',
        defaultPlaceholder: '@OBS',
        order: 6,
        parentInteraction: [],
        parentInteractionLabel: 'parent',
        attributes: {
          unit: {
            name: 'Unit',
            disabledLangName: [
              {
                lang: 'en',
                value: '',
                visible: true,
              },
              {
                lang: 'de',
                value: '',
                visible: true,
              },
              {
                lang: 'fr',
                value: '',
                visible: true,
              },
              {
                lang: 'es',
                value: '',
                visible: true,
              },
              {
                lang: 'pt',
                value: '',
                visible: true,
              },
              {
                lang: 'zh',
                value: '',
                visible: true,
              },
            ],
            type: 'text',
            expression: '@OBS."UNIT_NAME"',
            referenceFilter: '@REF.DOMAIN_ID = \'Unit\' AND @REF.STANDARD_CONCEPT = \'S\' AND (@REF.CONCEPT_NAME) LIKE_REGEXPR \'@SEARCH_QUERY\' FLAG \'i\'',
            referenceExpression: '@REF.CONCEPT_NAME',
            order: 0,
            useRefValue: true,
          },
          obsdatetime: {
            name: 'Observation Date/Time',
            disabledLangName: [
              {
                lang: 'en',
                value: '',
                visible: true,
              },
              {
                lang: 'de',
                value: '',
                visible: true,
              },
              {
                lang: 'fr',
                value: '',
                visible: true,
              },
              {
                lang: 'es',
                value: '',
                visible: true,
              },
              {
                lang: 'pt',
                value: '',
                visible: true,
              },
              {
                lang: 'zh',
                value: '',
                visible: true,
              },
            ],
            type: 'datetime',
            expression: '@OBS."OBSERVATION_DATETIME"',
            order: 1,
          },
          pid: {
            name: 'Patient Id',
            disabledLangName: [
              {
                lang: 'en',
                value: '',
                visible: true,
              },
              {
                lang: 'de',
                value: '',
                visible: true,
              },
              {
                lang: 'fr',
                value: '',
                visible: true,
              },
              {
                lang: 'es',
                value: '',
                visible: true,
              },
              {
                lang: 'pt',
                value: '',
                visible: true,
              },
              {
                lang: 'zh',
                value: '',
                visible: true,
              },
            ],
            type: 'text',
            expression: 'CAST (@OBS."PATIENT_ID" AS VARCHAR)',
            order: 2,
          },
          obsdate: {
            name: 'Observation Date',
            disabledLangName: [
              {
                lang: 'en',
                value: '',
                visible: true,
              },
              {
                lang: 'de',
                value: '',
                visible: true,
              },
              {
                lang: 'fr',
                value: '',
                visible: true,
              },
              {
                lang: 'es',
                value: '',
                visible: true,
              },
              {
                lang: 'pt',
                value: '',
                visible: true,
              },
              {
                lang: 'zh',
                value: '',
                visible: true,
              },
            ],
            type: 'time',
            expression: '@OBS."OBSERVATION_DATE"',
            order: 3,
          },
          observationid: {
            name: 'Observation Id',
            disabledLangName: [
              {
                lang: 'en',
                value: '',
                visible: true,
              },
              {
                lang: 'de',
                value: '',
                visible: true,
              },
              {
                lang: 'fr',
                value: '',
                visible: true,
              },
              {
                lang: 'es',
                value: '',
                visible: true,
              },
              {
                lang: 'pt',
                value: '',
                visible: true,
              },
              {
                lang: 'zh',
                value: '',
                visible: true,
              },
            ],
            type: 'text',
            expression: 'CAST (@OBS."OBSERVATION_ID" AS VARCHAR)',
            order: 4,
          },
          obsname: {
            name: 'Observation Name',
            disabledLangName: [
              {
                lang: 'en',
                value: '',
                visible: true,
              },
              {
                lang: 'de',
                value: '',
                visible: true,
              },
              {
                lang: 'fr',
                value: '',
                visible: true,
              },
              {
                lang: 'es',
                value: '',
                visible: true,
              },
              {
                lang: 'pt',
                value: '',
                visible: true,
              },
              {
                lang: 'zh',
                value: '',
                visible: true,
              },
            ],
            type: 'text',
            expression: '@OBS."OBSERVATION_NAME"',
            referenceFilter: '@REF.DOMAIN_ID = \'Observation\' AND @REF.STANDARD_CONCEPT = \'S\' AND (@REF.CONCEPT_NAME) LIKE_REGEXPR \'@SEARCH_QUERY\' FLAG \'i\'',
            referenceExpression: '@REF.CONCEPT_NAME',
            order: 5,
            useRefValue: true,
          },
          qualifier: {
            name: 'Qualifier',
            disabledLangName: [
              {
                lang: 'en',
                value: '',
                visible: true,
              },
              {
                lang: 'de',
                value: '',
                visible: true,
              },
              {
                lang: 'fr',
                value: '',
                visible: true,
              },
              {
                lang: 'es',
                value: '',
                visible: true,
              },
              {
                lang: 'pt',
                value: '',
                visible: true,
              },
              {
                lang: 'zh',
                value: '',
                visible: true,
              },
            ],
            type: 'text',
            expression: '@OBS."QUALIFIER_NAME"',
            referenceFilter: '@REF.DOMAIN_ID = \'Observation\' AND @REF.STANDARD_CONCEPT = \'S\' AND @REF.CONCEPT_CLASS_ID = \'Qualifier Value\' AND (@REF.CONCEPT_NAME) LIKE_REGEXPR \'@SEARCH_QUERY\' FLAG \'i\'',
            referenceExpression: '@REF.CONCEPT_NAME',
            order: 6,
            useRefValue: true,
          },
          textval: {
            name: 'Value (text)',
            disabledLangName: [
              {
                lang: 'en',
                value: '',
                visible: true,
              },
              {
                lang: 'de',
                value: '',
                visible: true,
              },
              {
                lang: 'fr',
                value: '',
                visible: true,
              },
              {
                lang: 'es',
                value: '',
                visible: true,
              },
              {
                lang: 'pt',
                value: '',
                visible: true,
              },
              {
                lang: 'zh',
                value: '',
                visible: true,
              },
            ],
            type: 'text',
            expression: '@OBS."VALUE_NAME"',
            order: 7,
          },
          verbatimtext: {
            name: 'Value (verbatim)',
            disabledLangName: [
              {
                lang: 'en',
                value: '',
                visible: true,
              },
              {
                lang: 'de',
                value: '',
                visible: true,
              },
              {
                lang: 'fr',
                value: '',
                visible: true,
              },
              {
                lang: 'es',
                value: '',
                visible: true,
              },
              {
                lang: 'pt',
                value: '',
                visible: true,
              },
              {
                lang: 'zh',
                value: '',
                visible: true,
              },
            ],
            type: 'text',
            expression: '@OBS."VALUE_AS_STRING"',
            order: 8,
          },
          numval: {
            name: 'Value (numeric)',
            disabledLangName: [
              {
                lang: 'en',
                value: '',
                visible: true,
              },
              {
                lang: 'de',
                value: '',
                visible: true,
              },
              {
                lang: 'fr',
                value: '',
                visible: true,
              },
              {
                lang: 'es',
                value: '',
                visible: true,
              },
              {
                lang: 'pt',
                value: '',
                visible: true,
              },
              {
                lang: 'zh',
                value: '',
                visible: true,
              },
            ],
            type: 'num',
            expression: '@OBS."VALUE_AS_NUMBER"',
            order: 9,
          },
          obstype: {
            name: 'Observation type',
            disabledLangName: [
              {
                lang: 'en',
                value: '',
                visible: true,
              },
              {
                lang: 'de',
                value: '',
                visible: true,
              },
              {
                lang: 'fr',
                value: '',
                visible: true,
              },
              {
                lang: 'es',
                value: '',
                visible: true,
              },
              {
                lang: 'pt',
                value: '',
                visible: true,
              },
              {
                lang: 'zh',
                value: '',
                visible: true,
              },
            ],
            type: 'text',
            expression: '@OBS."OBSERVATION_TYPE_NAME"',
            referenceFilter: '@REF.DOMAIN_ID = \'Type Concept\' AND @REF.CONCEPT_CLASS_ID = \'Observation Type\' AND (@REF.CONCEPT_NAME) LIKE_REGEXPR \'@SEARCH_QUERY\' FLAG \'i\'',
            referenceExpression: '@REF.CONCEPT_NAME',
            order: 10,
            useRefValue: true,
          },
          obsconceptcode: {
            name: 'Observation concept code',
            disabledLangName: [
              {
                lang: 'en',
                value: '',
                visible: true,
              },
              {
                lang: 'de',
                value: '',
                visible: true,
              },
              {
                lang: 'fr',
                value: '',
                visible: true,
              },
              {
                lang: 'es',
                value: '',
                visible: true,
              },
              {
                lang: 'pt',
                value: '',
                visible: true,
              },
              {
                lang: 'zh',
                value: '',
                visible: true,
              },
            ],
            type: 'text',
            expression: '@OBS."OBSERVATION_CONCEPT_CODE"',
            referenceFilter: '@REF.DOMAIN_ID = \'Observation\' AND @REF.STANDARD_CONCEPT = \'S\' AND (@REF.CONCEPT_CODE) LIKE_REGEXPR \'@SEARCH_QUERY\' FLAG \'i\'',
            referenceExpression: '@REF.CONCEPT_CODE',
            order: 11,
            useRefValue: true,
            useRefText: true,
          },
          obsconceptset: {
            name: 'Observation concept set',
            disabledLangName: [
              {
                lang: 'en',
                value: '',
                visible: true,
              },
              {
                lang: 'de',
                value: '',
                visible: true,
              },
              {
                lang: 'fr',
                value: '',
                visible: true,
              },
              {
                lang: 'es',
                value: '',
                visible: true,
              },
              {
                lang: 'pt',
                value: '',
                visible: true,
              },
              {
                lang: 'zh',
                value: '',
                visible: true,
              },
            ],
            type: 'conceptSet',
            expression: 'CAST (@OBS."OBSERVATION_CONCEPT_ID" AS VARCHAR)',
            order: 12,
            useRefValue: true,
            useRefText: true,
          },
          obstypeconceptcode: {
            name: 'Observation type concept code',
            disabledLangName: [
              {
                lang: 'en',
                value: '',
                visible: true,
              },
              {
                lang: 'de',
                value: '',
                visible: true,
              },
              {
                lang: 'fr',
                value: '',
                visible: true,
              },
              {
                lang: 'es',
                value: '',
                visible: true,
              },
              {
                lang: 'pt',
                value: '',
                visible: true,
              },
              {
                lang: 'zh',
                value: '',
                visible: true,
              },
            ],
            type: 'text',
            expression: '@OBS."OBSERVATION_TYPE_CONCEPT_CODE"',
            referenceFilter: '@REF.DOMAIN_ID = \'Type Concept\' AND @REF.CONCEPT_CLASS_ID = \'Observation Type\' AND (@REF.CONCEPT_CODE) LIKE_REGEXPR \'@SEARCH_QUERY\' FLAG \'i\'',
            referenceExpression: '@REF.CONCEPT_CODE',
            order: 13,
            useRefValue: true,
            useRefText: true,
          },
          valueasconceptcode: {
            name: 'Value as concept code',
            disabledLangName: [
              {
                lang: 'en',
                value: '',
                visible: true,
              },
              {
                lang: 'de',
                value: '',
                visible: true,
              },
              {
                lang: 'fr',
                value: '',
                visible: true,
              },
              {
                lang: 'es',
                value: '',
                visible: true,
              },
              {
                lang: 'pt',
                value: '',
                visible: true,
              },
              {
                lang: 'zh',
                value: '',
                visible: true,
              },
            ],
            type: 'text',
            expression: '@OBS."VALUE_AS_CONCEPT_CODE"',
            order: 14,
          },
          qualifierconceptcode: {
            name: 'Qualifier concept code',
            disabledLangName: [
              {
                lang: 'en',
                value: '',
                visible: true,
              },
              {
                lang: 'de',
                value: '',
                visible: true,
              },
              {
                lang: 'fr',
                value: '',
                visible: true,
              },
              {
                lang: 'es',
                value: '',
                visible: true,
              },
              {
                lang: 'pt',
                value: '',
                visible: true,
              },
              {
                lang: 'zh',
                value: '',
                visible: true,
              },
            ],
            type: 'text',
            expression: '@OBS."QUALIFIER_CONCEPT_CODE"',
            referenceFilter: '@REF.DOMAIN_ID = \'Observation\' AND @REF.STANDARD_CONCEPT = \'S\' AND @REF.CONCEPT_CLASS_ID = \'Qualifier Value\' AND (@REF.CONCEPT_CODE) LIKE_REGEXPR \'@SEARCH_QUERY\' FLAG \'i\'',
            referenceExpression: '@REF.CONCEPT_CODE',
            order: 15,
            useRefValue: true,
            useRefText: true,
          },
          unitconceptcode: {
            name: 'Unit concept code',
            disabledLangName: [
              {
                lang: 'en',
                value: '',
                visible: true,
              },
              {
                lang: 'de',
                value: '',
                visible: true,
              },
              {
                lang: 'fr',
                value: '',
                visible: true,
              },
              {
                lang: 'es',
                value: '',
                visible: true,
              },
              {
                lang: 'pt',
                value: '',
                visible: true,
              },
              {
                lang: 'zh',
                value: '',
                visible: true,
              },
            ],
            type: 'text',
            expression: '@OBS."UNIT_CONCEPT_CODE"',
            referenceFilter: '@REF.DOMAIN_ID = \'Unit\' AND @REF.STANDARD_CONCEPT = \'S\' AND (@REF.CONCEPT_CODE) LIKE_REGEXPR \'@SEARCH_QUERY\' FLAG \'i\'',
            referenceExpression: '@REF.CONCEPT_CODE',
            order: 16,
            useRefValue: true,
            useRefText: true,
          },
          observationtypeconceptid: {
            name: 'Observation type concept id',
            disabledLangName: [
              {
                lang: 'en',
                value: '',
                visible: true,
              },
              {
                lang: 'de',
                value: '',
                visible: true,
              },
              {
                lang: 'fr',
                value: '',
                visible: true,
              },
              {
                lang: 'es',
                value: '',
                visible: true,
              },
              {
                lang: 'pt',
                value: '',
                visible: true,
              },
              {
                lang: 'zh',
                value: '',
                visible: true,
              },
            ],
            type: 'text',
            expression: '@OBS."OBSERVATION_TYPE_CONCEPT_ID"',
            referenceFilter: '@REF.DOMAIN_ID = \'Type Concept\' AND @REF.CONCEPT_CLASS_ID = \'Observation Type\' AND CAST (@REF.CONCEPT_ID AS VARCHAR) LIKE_REGEXPR \'@SEARCH_QUERY\' FLAG \'i\'',
            referenceExpression: 'CAST (@REF.CONCEPT_ID AS VARCHAR)',
            order: 17,
            useRefValue: true,
            useRefText: true,
          },
          observationtypeconceptset: {
            name: 'Observation type concept set',
            disabledLangName: [
              {
                lang: 'en',
                value: '',
                visible: true,
              },
              {
                lang: 'de',
                value: '',
                visible: true,
              },
              {
                lang: 'fr',
                value: '',
                visible: true,
              },
              {
                lang: 'es',
                value: '',
                visible: true,
              },
              {
                lang: 'pt',
                value: '',
                visible: true,
              },
              {
                lang: 'zh',
                value: '',
                visible: true,
              },
            ],
            type: 'conceptSet',
            expression: 'CAST (@OBS."OBSERVATION_TYPE_CONCEPT_ID" AS VARCHAR)',
            order: 18,
            useRefValue: true,
            useRefText: true,
          },
          valueasconceptid: {
            name: 'Value as concept id',
            disabledLangName: [
              {
                lang: 'en',
                value: '',
                visible: true,
              },
              {
                lang: 'de',
                value: '',
                visible: true,
              },
              {
                lang: 'fr',
                value: '',
                visible: true,
              },
              {
                lang: 'es',
                value: '',
                visible: true,
              },
              {
                lang: 'pt',
                value: '',
                visible: true,
              },
              {
                lang: 'zh',
                value: '',
                visible: true,
              },
            ],
            type: 'text',
            expression: 'CAST (@OBS."VALUE_AS_CONCEPT_ID" AS VARCHAR)',
            order: 19,
          },
          valueasconceptset: {
            name: 'Value as concept set',
            disabledLangName: [
              {
                lang: 'en',
                value: '',
                visible: true,
              },
              {
                lang: 'de',
                value: '',
                visible: true,
              },
              {
                lang: 'fr',
                value: '',
                visible: true,
              },
              {
                lang: 'es',
                value: '',
                visible: true,
              },
              {
                lang: 'pt',
                value: '',
                visible: true,
              },
              {
                lang: 'zh',
                value: '',
                visible: true,
              },
            ],
            type: 'conceptSet',
            expression: 'CAST (@OBS."VALUE_AS_CONCEPT_ID" AS VARCHAR)',
            order: 20,
          },
          qualifierconceptid: {
            name: 'Qualifier concept id',
            disabledLangName: [
              {
                lang: 'en',
                value: '',
                visible: true,
              },
              {
                lang: 'de',
                value: '',
                visible: true,
              },
              {
                lang: 'fr',
                value: '',
                visible: true,
              },
              {
                lang: 'es',
                value: '',
                visible: true,
              },
              {
                lang: 'pt',
                value: '',
                visible: true,
              },
              {
                lang: 'zh',
                value: '',
                visible: true,
              },
            ],
            type: 'text',
            expression: '@OBS."QUALIFIER_CONCEPT_ID"',
            referenceFilter: '@REF.DOMAIN_ID = \'Observation\' AND @REF.STANDARD_CONCEPT = \'S\' AND @REF.CONCEPT_CLASS_ID = \'Qualifier Value\' AND CAST (@REF.CONCEPT_ID AS VARCHAR) LIKE_REGEXPR \'@SEARCH_QUERY\' FLAG \'i\'',
            referenceExpression: '@REF.CONCEPT_ID',
            order: 21,
            useRefValue: true,
            useRefText: true,
          },
          qualifierconceptset: {
            name: 'Qualifier concept set',
            disabledLangName: [
              {
                lang: 'en',
                value: '',
                visible: true,
              },
              {
                lang: 'de',
                value: '',
                visible: true,
              },
              {
                lang: 'fr',
                value: '',
                visible: true,
              },
              {
                lang: 'es',
                value: '',
                visible: true,
              },
              {
                lang: 'pt',
                value: '',
                visible: true,
              },
              {
                lang: 'zh',
                value: '',
                visible: true,
              },
            ],
            type: 'conceptSet',
            expression: 'CAST (@OBS."QUALIFIER_CONCEPT_ID" AS VARCHAR)',
            order: 22,
            useRefValue: true,
            useRefText: true,
          },
          unitconceptid: {
            name: 'Unit concept id',
            disabledLangName: [
              {
                lang: 'en',
                value: '',
                visible: true,
              },
              {
                lang: 'de',
                value: '',
                visible: true,
              },
              {
                lang: 'fr',
                value: '',
                visible: true,
              },
              {
                lang: 'es',
                value: '',
                visible: true,
              },
              {
                lang: 'pt',
                value: '',
                visible: true,
              },
              {
                lang: 'zh',
                value: '',
                visible: true,
              },
            ],
            type: 'text',
            expression: '@OBS."UNIT_CONCEPT_ID"',
            referenceFilter: '@REF.DOMAIN_ID = \'Unit\' AND @REF.STANDARD_CONCEPT = \'S\' AND CAST (@REF.CONCEPT_ID AS VARCHAR) LIKE_REGEXPR \'@SEARCH_QUERY\' FLAG \'i\'',
            referenceExpression: 'CAST (@REF.CONCEPT_ID AS VARCHAR)',
            order: 23,
            useRefValue: true,
            useRefText: true,
          },
          unitconceptset: {
            name: 'Unit concept set',
            disabledLangName: [
              {
                lang: 'en',
                value: '',
                visible: true,
              },
              {
                lang: 'de',
                value: '',
                visible: true,
              },
              {
                lang: 'fr',
                value: '',
                visible: true,
              },
              {
                lang: 'es',
                value: '',
                visible: true,
              },
              {
                lang: 'pt',
                value: '',
                visible: true,
              },
              {
                lang: 'zh',
                value: '',
                visible: true,
              },
            ],
            type: 'conceptSet',
            expression: 'CAST (@OBS."UNIT_CONCEPT_ID" AS VARCHAR)',
            order: 24,
            useRefValue: true,
            useRefText: true,
          },
          obsconceptid: {
            name: 'Observation concept id',
            disabledLangName: [
              {
                lang: 'en',
                value: '',
                visible: true,
              },
              {
                lang: 'de',
                value: '',
                visible: true,
              },
              {
                lang: 'fr',
                value: '',
                visible: true,
              },
              {
                lang: 'es',
                value: '',
                visible: true,
              },
              {
                lang: 'pt',
                value: '',
                visible: true,
              },
              {
                lang: 'zh',
                value: '',
                visible: true,
              },
            ],
            type: 'text',
            expression: 'CAST (@OBS."OBSERVATION_CONCEPT_ID" AS VARCHAR)',
            order: 25,
            useRefValue: true,
            useRefText: true,
          },
        },
      },
      obsperiod: {
        name: 'Observation Period',
        disabledLangName: [
          {
            lang: 'en',
            value: '',
            visible: true,
          },
          {
            lang: 'de',
            value: '',
            visible: true,
          },
          {
            lang: 'fr',
            value: '',
            visible: true,
          },
          {
            lang: 'es',
            value: '',
            visible: true,
          },
          {
            lang: 'pt',
            value: '',
            visible: true,
          },
          {
            lang: 'zh',
            value: '',
            visible: true,
          },
        ],
        defaultFilter: '1=1',
        defaultPlaceholder: '@OBSPER',
        order: 5,
        parentInteraction: [],
        parentInteractionLabel: 'parent',
        attributes: {
          enddate: {
            name: 'End Date',
            disabledLangName: [
              {
                lang: 'en',
                value: '',
                visible: true,
              },
              {
                lang: 'de',
                value: '',
                visible: true,
              },
              {
                lang: 'fr',
                value: '',
                visible: true,
              },
              {
                lang: 'es',
                value: '',
                visible: true,
              },
              {
                lang: 'pt',
                value: '',
                visible: true,
              },
              {
                lang: 'zh',
                value: '',
                visible: true,
              },
            ],
            type: 'time',
            expression: '@OBSPER."OBSERVATION_PERIOD_END_DATE"',
            order: 0,
          },
          startdate: {
            name: 'Start Date',
            disabledLangName: [
              {
                lang: 'en',
                value: '',
                visible: true,
              },
              {
                lang: 'de',
                value: '',
                visible: true,
              },
              {
                lang: 'fr',
                value: '',
                visible: true,
              },
              {
                lang: 'es',
                value: '',
                visible: true,
              },
              {
                lang: 'pt',
                value: '',
                visible: true,
              },
              {
                lang: 'zh',
                value: '',
                visible: true,
              },
            ],
            type: 'time',
            expression: '@OBSPER."OBSERVATION_PERIOD_START_DATE"',
            order: 1,
          },
          pid: {
            name: 'Patient Id',
            disabledLangName: [
              {
                lang: 'en',
                value: '',
                visible: true,
              },
              {
                lang: 'de',
                value: '',
                visible: true,
              },
              {
                lang: 'fr',
                value: '',
                visible: true,
              },
              {
                lang: 'es',
                value: '',
                visible: true,
              },
              {
                lang: 'pt',
                value: '',
                visible: true,
              },
              {
                lang: 'zh',
                value: '',
                visible: true,
              },
            ],
            type: 'text',
            expression: 'CAST (@OBSPER."PATIENT_ID" AS VARCHAR)',
            order: 2,
          },
          periodtype: {
            name: 'Period type',
            disabledLangName: [
              {
                lang: 'en',
                value: '',
                visible: true,
              },
              {
                lang: 'de',
                value: '',
                visible: true,
              },
              {
                lang: 'fr',
                value: '',
                visible: true,
              },
              {
                lang: 'es',
                value: '',
                visible: true,
              },
              {
                lang: 'pt',
                value: '',
                visible: true,
              },
              {
                lang: 'zh',
                value: '',
                visible: true,
              },
            ],
            type: 'text',
            expression: '@OBSPER."PERIOD_TYPE_NAME"',
            referenceFilter: '@REF.DOMAIN_ID = \'Type Concept\' AND @REF.CONCEPT_CLASS_ID = \'Obs Period Type\' AND (@REF.CONCEPT_NAME) LIKE_REGEXPR \'@SEARCH_QUERY\' FLAG \'i\'',
            referenceExpression: '@REF.CONCEPT_NAME',
            order: 3,
            useRefValue: true,
          },
          obsperiodid: {
            name: 'Observation period Id',
            disabledLangName: [
              {
                lang: 'en',
                value: '',
                visible: true,
              },
              {
                lang: 'de',
                value: '',
                visible: true,
              },
              {
                lang: 'fr',
                value: '',
                visible: true,
              },
              {
                lang: 'es',
                value: '',
                visible: true,
              },
              {
                lang: 'pt',
                value: '',
                visible: true,
              },
              {
                lang: 'zh',
                value: '',
                visible: true,
              },
            ],
            type: 'text',
            expression: '@OBSPER."OBSERVATION_PERIOD_ID"',
            order: 4,
          },
          periodtypeconceptcode: {
            name: 'Observation period type concept code',
            disabledLangName: [
              {
                lang: 'en',
                value: '',
                visible: true,
              },
              {
                lang: 'de',
                value: '',
                visible: true,
              },
              {
                lang: 'fr',
                value: '',
                visible: true,
              },
              {
                lang: 'es',
                value: '',
                visible: true,
              },
              {
                lang: 'pt',
                value: '',
                visible: true,
              },
              {
                lang: 'zh',
                value: '',
                visible: true,
              },
            ],
            type: 'text',
            expression: '@OBSPER."PERIOD_TYPE_CONCEPT_CODE"',
            referenceFilter: '@REF.DOMAIN_ID = \'Type Concept\' AND @REF.CONCEPT_CLASS_ID = \'Obs Period Type\' AND (@REF.CONCEPT_CODE) LIKE_REGEXPR \'@SEARCH_QUERY\' FLAG \'i\'',
            referenceExpression: '@REF.CONCEPT_CODE',
            order: 5,
            useRefValue: true,
            useRefText: true,
          },
          periodtypeconceptid: {
            name: 'Period type concept id',
            disabledLangName: [
              {
                lang: 'en',
                value: '',
                visible: true,
              },
              {
                lang: 'de',
                value: '',
                visible: true,
              },
              {
                lang: 'fr',
                value: '',
                visible: true,
              },
              {
                lang: 'es',
                value: '',
                visible: true,
              },
              {
                lang: 'pt',
                value: '',
                visible: true,
              },
              {
                lang: 'zh',
                value: '',
                visible: true,
              },
            ],
            type: 'text',
            expression: '@OBSPER."PERIOD_TYPE_CONCEPT_ID"',
            referenceFilter: '@REF.DOMAIN_ID = \'Type Concept\' AND @REF.CONCEPT_CLASS_ID = \'Obs Period Type\' AND CAST (@REF.CONCEPT_ID AS VARCHAR) LIKE_REGEXPR \'@SEARCH_QUERY\' FLAG \'i\'',
            referenceExpression: 'CAST (@REF.CONCEPT_ID AS VARCHAR)',
            order: 6,
            useRefValue: true,
            useRefText: true,
          },
          periodtypeconceptset: {
            name: 'Period type concept set',
            disabledLangName: [
              {
                lang: 'en',
                value: '',
                visible: true,
              },
              {
                lang: 'de',
                value: '',
                visible: true,
              },
              {
                lang: 'fr',
                value: '',
                visible: true,
              },
              {
                lang: 'es',
                value: '',
                visible: true,
              },
              {
                lang: 'pt',
                value: '',
                visible: true,
              },
              {
                lang: 'zh',
                value: '',
                visible: true,
              },
            ],
            type: 'conceptSet',
            expression: 'CAST (@OBSPER."PERIOD_TYPE_CONCEPT_ID" AS VARCHAR)',
            order: 7,
            useRefValue: true,
            useRefText: true,
          },
        },
      },
      ppperiod: {
        name: 'Payer Plan Period',
        disabledLangName: [
          {
            lang: 'en',
            value: '',
            visible: true,
          },
          {
            lang: 'de',
            value: '',
            visible: true,
          },
          {
            lang: 'fr',
            value: '',
            visible: true,
          },
          {
            lang: 'es',
            value: '',
            visible: true,
          },
          {
            lang: 'pt',
            value: '',
            visible: true,
          },
          {
            lang: 'zh',
            value: '',
            visible: true,
          },
        ],
        defaultFilter: '1=1',
        defaultPlaceholder: '@PPPER',
        order: 4,
        parentInteraction: [],
        parentInteractionLabel: 'parent',
        attributes: {
          enddate: {
            name: 'End Date',
            disabledLangName: [
              {
                lang: 'en',
                value: '',
                visible: true,
              },
              {
                lang: 'de',
                value: '',
                visible: true,
              },
              {
                lang: 'fr',
                value: '',
                visible: true,
              },
              {
                lang: 'es',
                value: '',
                visible: true,
              },
              {
                lang: 'pt',
                value: '',
                visible: true,
              },
              {
                lang: 'zh',
                value: '',
                visible: true,
              },
            ],
            type: 'time',
            expression: '@PPPER."PAYER_PLAN_PERIOD_END_DATE"',
            order: 0,
          },
          startdate: {
            name: 'Start Date',
            disabledLangName: [
              {
                lang: 'en',
                value: '',
                visible: true,
              },
              {
                lang: 'de',
                value: '',
                visible: true,
              },
              {
                lang: 'fr',
                value: '',
                visible: true,
              },
              {
                lang: 'es',
                value: '',
                visible: true,
              },
              {
                lang: 'pt',
                value: '',
                visible: true,
              },
              {
                lang: 'zh',
                value: '',
                visible: true,
              },
            ],
            type: 'time',
            expression: '@PPPER."PAYER_PLAN_PERIOD_START_DATE"',
            order: 1,
          },
          pid: {
            name: 'Patient Id',
            disabledLangName: [
              {
                lang: 'en',
                value: '',
                visible: true,
              },
              {
                lang: 'de',
                value: '',
                visible: true,
              },
              {
                lang: 'fr',
                value: '',
                visible: true,
              },
              {
                lang: 'es',
                value: '',
                visible: true,
              },
              {
                lang: 'pt',
                value: '',
                visible: true,
              },
              {
                lang: 'zh',
                value: '',
                visible: true,
              },
            ],
            type: 'text',
            expression: 'CAST (@PPPER."PATIENT_ID" AS VARCHAR)',
            order: 2,
          },
          ppperiodid: {
            name: 'Payer Plan Period Id',
            disabledLangName: [
              {
                lang: 'en',
                value: '',
                visible: true,
              },
              {
                lang: 'de',
                value: '',
                visible: true,
              },
              {
                lang: 'fr',
                value: '',
                visible: true,
              },
              {
                lang: 'es',
                value: '',
                visible: true,
              },
              {
                lang: 'pt',
                value: '',
                visible: true,
              },
              {
                lang: 'zh',
                value: '',
                visible: true,
              },
            ],
            type: 'text',
            expression: 'CAST (@PPPER."PAYER_PLAN_PERIOD_ID" AS VARCHAR)',
            order: 3,
          },
        },
      },
      proc: {
        name: 'Procedure Occurrence',
        disabledLangName: [
          {
            lang: 'en',
            value: '',
            visible: true,
          },
          {
            lang: 'de',
            value: '',
            visible: true,
          },
          {
            lang: 'fr',
            value: '',
            visible: true,
          },
          {
            lang: 'es',
            value: '',
            visible: true,
          },
          {
            lang: 'pt',
            value: '',
            visible: true,
          },
          {
            lang: 'zh',
            value: '',
            visible: true,
          },
        ],
        defaultFilter: '1=1',
        defaultPlaceholder: '@PROC',
        order: 3,
        parentInteraction: [],
        parentInteractionLabel: 'parent',
        attributes: {
          procdatetime: {
            name: 'Procedure Date/Time',
            disabledLangName: [
              {
                lang: 'en',
                value: '',
                visible: true,
              },
              {
                lang: 'de',
                value: '',
                visible: true,
              },
              {
                lang: 'fr',
                value: '',
                visible: true,
              },
              {
                lang: 'es',
                value: '',
                visible: true,
              },
              {
                lang: 'pt',
                value: '',
                visible: true,
              },
              {
                lang: 'zh',
                value: '',
                visible: true,
              },
            ],
            type: 'datetime',
            expression: '@PROC."PROCEDURE_DATETIME"',
            order: 0,
          },
          procconceptid: {
            name: 'Procedure Occurrence Id',
            disabledLangName: [
              {
                lang: 'en',
                value: '',
                visible: true,
              },
              {
                lang: 'de',
                value: '',
                visible: true,
              },
              {
                lang: 'fr',
                value: '',
                visible: true,
              },
              {
                lang: 'es',
                value: '',
                visible: true,
              },
              {
                lang: 'pt',
                value: '',
                visible: true,
              },
              {
                lang: 'zh',
                value: '',
                visible: true,
              },
            ],
            type: 'text',
            expression: 'CAST (@PROC."PROCEDURE_OCCURRENCE_ID" AS VARCHAR)',
            order: 1,
          },
          procconceptset: {
            name: 'Procedure Occurrence Concept Set',
            disabledLangName: [
              {
                lang: 'en',
                value: '',
                visible: true,
              },
              {
                lang: 'de',
                value: '',
                visible: true,
              },
              {
                lang: 'fr',
                value: '',
                visible: true,
              },
              {
                lang: 'es',
                value: '',
                visible: true,
              },
              {
                lang: 'pt',
                value: '',
                visible: true,
              },
              {
                lang: 'zh',
                value: '',
                visible: true,
              },
            ],
            type: 'conceptSet',
            expression: 'CAST (@PROC."PROCEDURE_OCCURRENCE_ID" AS VARCHAR)',
            order: 2,
          },
          procdate: {
            name: 'Procedure Date',
            disabledLangName: [
              {
                lang: 'en',
                value: '',
                visible: true,
              },
              {
                lang: 'de',
                value: '',
                visible: true,
              },
              {
                lang: 'fr',
                value: '',
                visible: true,
              },
              {
                lang: 'es',
                value: '',
                visible: true,
              },
              {
                lang: 'pt',
                value: '',
                visible: true,
              },
              {
                lang: 'zh',
                value: '',
                visible: true,
              },
            ],
            type: 'time',
            expression: '@PROC."PROCEDURE_DATE"',
            order: 3,
          },
          qty: {
            name: 'Quantity',
            disabledLangName: [
              {
                lang: 'en',
                value: '',
                visible: true,
              },
              {
                lang: 'de',
                value: '',
                visible: true,
              },
              {
                lang: 'fr',
                value: '',
                visible: true,
              },
              {
                lang: 'es',
                value: '',
                visible: true,
              },
              {
                lang: 'pt',
                value: '',
                visible: true,
              },
              {
                lang: 'zh',
                value: '',
                visible: true,
              },
            ],
            type: 'num',
            expression: 'CAST (@PROC."QUANTITY" AS VARCHAR)',
            order: 4,
          },
          procname: {
            name: 'Procedure name',
            disabledLangName: [
              {
                lang: 'en',
                value: '',
                visible: true,
              },
              {
                lang: 'de',
                value: '',
                visible: true,
              },
              {
                lang: 'fr',
                value: '',
                visible: true,
              },
              {
                lang: 'es',
                value: '',
                visible: true,
              },
              {
                lang: 'pt',
                value: '',
                visible: true,
              },
              {
                lang: 'zh',
                value: '',
                visible: true,
              },
            ],
            type: 'text',
            expression: '@PROC."PROCEDURE_NAME"',
            referenceFilter: '@REF.DOMAIN_ID = \'Procedure\' AND @REF.STANDARD_CONCEPT = \'S\' AND (@REF.CONCEPT_NAME) LIKE_REGEXPR \'@SEARCH_QUERY\' FLAG \'i\'',
            referenceExpression: '@REF.CONCEPT_NAME',
            order: 5,
            useRefValue: true,
            useRefText: true,
          },
          modifier: {
            name: 'Modifier',
            disabledLangName: [
              {
                lang: 'en',
                value: '',
                visible: true,
              },
              {
                lang: 'de',
                value: '',
                visible: true,
              },
              {
                lang: 'fr',
                value: '',
                visible: true,
              },
              {
                lang: 'es',
                value: '',
                visible: true,
              },
              {
                lang: 'pt',
                value: '',
                visible: true,
              },
              {
                lang: 'zh',
                value: '',
                visible: true,
              },
            ],
            type: 'text',
            expression: '@PROC."MODIFIER_NAME"',
            order: 6,
          },
          pid: {
            name: 'Patient Id',
            disabledLangName: [
              {
                lang: 'en',
                value: '',
                visible: true,
              },
              {
                lang: 'de',
                value: '',
                visible: true,
              },
              {
                lang: 'fr',
                value: '',
                visible: true,
              },
              {
                lang: 'es',
                value: '',
                visible: true,
              },
              {
                lang: 'pt',
                value: '',
                visible: true,
              },
              {
                lang: 'zh',
                value: '',
                visible: true,
              },
            ],
            type: 'text',
            expression: 'CAST (@PROC."PATIENT_ID" AS VARCHAR)',
            order: 7,
          },
          proctype: {
            name: 'Procedure type',
            disabledLangName: [
              {
                lang: 'en',
                value: '',
                visible: true,
              },
              {
                lang: 'de',
                value: '',
                visible: true,
              },
              {
                lang: 'fr',
                value: '',
                visible: true,
              },
              {
                lang: 'es',
                value: '',
                visible: true,
              },
              {
                lang: 'pt',
                value: '',
                visible: true,
              },
              {
                lang: 'zh',
                value: '',
                visible: true,
              },
            ],
            type: 'text',
            expression: '@PROC."PROCEDURE_TYPE_NAME"',
            referenceFilter: '@REF.DOMAIN_ID = \'Type Concept\' AND @REF.CONCEPT_CLASS_ID = \'Procedure Type\' AND (@REF.CONCEPT_NAME) LIKE_REGEXPR \'@SEARCH_QUERY\' FLAG \'i\'',
            referenceExpression: '@REF.CONCEPT_NAME',
            order: 8,
            useRefValue: true,
            useRefText: true,
          },
          procconceptcode: {
            name: 'Procedure concept code',
            disabledLangName: [
              {
                lang: 'en',
                value: '',
                visible: true,
              },
              {
                lang: 'de',
                value: '',
                visible: true,
              },
              {
                lang: 'fr',
                value: '',
                visible: true,
              },
              {
                lang: 'es',
                value: '',
                visible: true,
              },
              {
                lang: 'pt',
                value: '',
                visible: true,
              },
              {
                lang: 'zh',
                value: '',
                visible: true,
              },
            ],
            type: 'text',
            expression: '@PROC."PROCEDURE_CONCEPT_CODE"',
            referenceFilter: '@REF.DOMAIN_ID = \'Procedure\' AND @REF.STANDARD_CONCEPT = \'S\' AND (@REF.CONCEPT_CODE) LIKE_REGEXPR \'@SEARCH_QUERY\' FLAG \'i\'',
            referenceExpression: '@REF.CONCEPT_CODE',
            order: 9,
            useRefValue: true,
            useRefText: true,
          },
          proctypeconceptcode: {
            name: 'Procedure type concept code',
            disabledLangName: [
              {
                lang: 'en',
                value: '',
                visible: true,
              },
              {
                lang: 'de',
                value: '',
                visible: true,
              },
              {
                lang: 'fr',
                value: '',
                visible: true,
              },
              {
                lang: 'es',
                value: '',
                visible: true,
              },
              {
                lang: 'pt',
                value: '',
                visible: true,
              },
              {
                lang: 'zh',
                value: '',
                visible: true,
              },
            ],
            type: 'text',
            expression: '@PROC."PROCEDURE_TYPE_CONCEPT_CODE"',
            referenceFilter: '@REF.DOMAIN_ID = \'Type Concept\' AND @REF.CONCEPT_CLASS_ID = \'Procedure Type\' AND (@REF.CONCEPT_CODE) LIKE_REGEXPR \'@SEARCH_QUERY\' FLAG \'i\'',
            referenceExpression: '@REF.CONCEPT_CODE',
            order: 10,
            useRefValue: true,
            useRefText: true,
          },
          modifierconceptcode: {
            name: 'Modifier concept code',
            disabledLangName: [
              {
                lang: 'en',
                value: '',
                visible: true,
              },
              {
                lang: 'de',
                value: '',
                visible: true,
              },
              {
                lang: 'fr',
                value: '',
                visible: true,
              },
              {
                lang: 'es',
                value: '',
                visible: true,
              },
              {
                lang: 'pt',
                value: '',
                visible: true,
              },
              {
                lang: 'zh',
                value: '',
                visible: true,
              },
            ],
            type: 'text',
            expression: '@PROC."MODIFIER_CONCEPT_CODE"',
            order: 11,
          },
          proctypeconceptid: {
            name: 'Procedure type concept id',
            disabledLangName: [
              {
                lang: 'en',
                value: '',
                visible: true,
              },
              {
                lang: 'de',
                value: '',
                visible: true,
              },
              {
                lang: 'fr',
                value: '',
                visible: true,
              },
              {
                lang: 'es',
                value: '',
                visible: true,
              },
              {
                lang: 'pt',
                value: '',
                visible: true,
              },
              {
                lang: 'zh',
                value: '',
                visible: true,
              },
            ],
            type: 'text',
            expression: '@PROC."PROCEDURE_TYPE_CONCEPT_ID"',
            referenceFilter: '@REF.DOMAIN_ID = \'Type Concept\' AND @REF.CONCEPT_CLASS_ID = \'Procedure Type\' AND CAST (@REF.CONCEPT_ID AS VARCHAR) LIKE_REGEXPR \'@SEARCH_QUERY\' FLAG \'i\'',
            referenceExpression: 'CAST (@REF.CONCEPT_ID AS VARCHAR)',
            order: 12,
            useRefValue: true,
            useRefText: true,
          },
          proctypeconceptset: {
            name: 'Procedure type concept set',
            disabledLangName: [
              {
                lang: 'en',
                value: '',
                visible: true,
              },
              {
                lang: 'de',
                value: '',
                visible: true,
              },
              {
                lang: 'fr',
                value: '',
                visible: true,
              },
              {
                lang: 'es',
                value: '',
                visible: true,
              },
              {
                lang: 'pt',
                value: '',
                visible: true,
              },
              {
                lang: 'zh',
                value: '',
                visible: true,
              },
            ],
            type: 'conceptSet',
            expression: 'CAST (@PROC."PROCEDURE_TYPE_CONCEPT_ID" AS VARCHAR)',
            order: 13,
            useRefValue: true,
            useRefText: true,
          },
          modifierconceptid: {
            name: 'Modifier concept id',
            disabledLangName: [
              {
                lang: 'en',
                value: '',
                visible: true,
              },
              {
                lang: 'de',
                value: '',
                visible: true,
              },
              {
                lang: 'fr',
                value: '',
                visible: true,
              },
              {
                lang: 'es',
                value: '',
                visible: true,
              },
              {
                lang: 'pt',
                value: '',
                visible: true,
              },
              {
                lang: 'zh',
                value: '',
                visible: true,
              },
            ],
            type: 'text',
            expression: 'CAST (@PROC."MODIFIER_CONCEPT_ID" AS VARCHAR)',
            order: 14,
          },
          modifierconceptset: {
            name: 'Modifier concept set',
            disabledLangName: [
              {
                lang: 'en',
                value: '',
                visible: true,
              },
              {
                lang: 'de',
                value: '',
                visible: true,
              },
              {
                lang: 'fr',
                value: '',
                visible: true,
              },
              {
                lang: 'es',
                value: '',
                visible: true,
              },
              {
                lang: 'pt',
                value: '',
                visible: true,
              },
              {
                lang: 'zh',
                value: '',
                visible: true,
              },
            ],
            type: 'conceptSet',
            expression: 'CAST (@PROC."MODIFIER_CONCEPT_ID" AS VARCHAR)',
            order: 15,
          },
        },
      },
      specimen: {
        name: 'Specimen',
        disabledLangName: [
          {
            lang: 'en',
            value: '',
            visible: true,
          },
          {
            lang: 'de',
            value: '',
            visible: true,
          },
          {
            lang: 'fr',
            value: '',
            visible: true,
          },
          {
            lang: 'es',
            value: '',
            visible: true,
          },
          {
            lang: 'pt',
            value: '',
            visible: true,
          },
          {
            lang: 'zh',
            value: '',
            visible: true,
          },
        ],
        defaultFilter: '1=1',
        defaultPlaceholder: '@SPEC',
        order: 2,
        parentInteraction: [],
        parentInteractionLabel: 'parent',
        attributes: {
          specimentype: {
            name: 'Specimen type',
            disabledLangName: [
              {
                lang: 'en',
                value: '',
                visible: true,
              },
              {
                lang: 'de',
                value: '',
                visible: true,
              },
              {
                lang: 'fr',
                value: '',
                visible: true,
              },
              {
                lang: 'es',
                value: '',
                visible: true,
              },
              {
                lang: 'pt',
                value: '',
                visible: true,
              },
              {
                lang: 'zh',
                value: '',
                visible: true,
              },
            ],
            type: 'text',
            expression: '@SPEC."SPECIMEN_TYPE_NAME"',
            referenceFilter: '@REF.DOMAIN_ID = \'Type Concept\' AND @REF.CONCEPT_CLASS_ID = \'Specimen Type\' AND (@REF.CONCEPT_NAME) LIKE_REGEXPR \'@SEARCH_QUERY\' FLAG \'i\'',
            referenceExpression: '@REF.CONCEPT_NAME',
            order: 0,
            useRefValue: true,
          },
          diseasestatus: {
            name: 'Disease status',
            disabledLangName: [
              {
                lang: 'en',
                value: '',
                visible: true,
              },
              {
                lang: 'de',
                value: '',
                visible: true,
              },
              {
                lang: 'fr',
                value: '',
                visible: true,
              },
              {
                lang: 'es',
                value: '',
                visible: true,
              },
              {
                lang: 'pt',
                value: '',
                visible: true,
              },
              {
                lang: 'zh',
                value: '',
                visible: true,
              },
            ],
            type: 'text',
            expression: '@SPEC."DISEASE_STATUS_NAME"',
            referenceFilter: '@REF.DOMAIN_ID = \'Spec Disease Status\' AND @REF.STANDARD_CONCEPT = \'S\' AND (@REF.CONCEPT_NAME) LIKE_REGEXPR \'@SEARCH_QUERY\' FLAG \'i\'',
            referenceExpression: '@REF.CONCEPT_NAME',
            order: 1,
            useRefValue: true,
          },
          specimenname: {
            name: 'Specimen name',
            disabledLangName: [
              {
                lang: 'en',
                value: '',
                visible: true,
              },
              {
                lang: 'de',
                value: '',
                visible: true,
              },
              {
                lang: 'fr',
                value: '',
                visible: true,
              },
              {
                lang: 'es',
                value: '',
                visible: true,
              },
              {
                lang: 'pt',
                value: '',
                visible: true,
              },
              {
                lang: 'zh',
                value: '',
                visible: true,
              },
            ],
            type: 'text',
            expression: '@SPEC."SPECIMEN_NAME"',
            referenceFilter: '@REF.DOMAIN_ID = \'Specimen\' AND @REF.STANDARD_CONCEPT = \'S\' AND (@REF.CONCEPT_NAME) LIKE_REGEXPR \'@SEARCH_QUERY\' FLAG \'i\'',
            referenceExpression: '@REF.CONCEPT_NAME',
            order: 2,
            useRefValue: true,
          },
          anatomicsite: {
            name: 'Anatomic site',
            disabledLangName: [
              {
                lang: 'en',
                value: '',
                visible: true,
              },
              {
                lang: 'de',
                value: '',
                visible: true,
              },
              {
                lang: 'fr',
                value: '',
                visible: true,
              },
              {
                lang: 'es',
                value: '',
                visible: true,
              },
              {
                lang: 'pt',
                value: '',
                visible: true,
              },
              {
                lang: 'zh',
                value: '',
                visible: true,
              },
            ],
            type: 'text',
            expression: '@SPEC."ANATOMIC_SITE_NAME"',
            referenceFilter: '@REF.DOMAIN_ID = \'Spec Anatomic Site\' AND @REF.STANDARD_CONCEPT = \'S\' AND (@REF.CONCEPT_NAME) LIKE_REGEXPR \'@SEARCH_QUERY\' FLAG \'i\'',
            referenceExpression: '@REF.CONCEPT_NAME',
            order: 3,
            useRefValue: true,
          },
          pid: {
            name: 'Patient Id',
            disabledLangName: [
              {
                lang: 'en',
                value: '',
                visible: true,
              },
              {
                lang: 'de',
                value: '',
                visible: true,
              },
              {
                lang: 'fr',
                value: '',
                visible: true,
              },
              {
                lang: 'es',
                value: '',
                visible: true,
              },
              {
                lang: 'pt',
                value: '',
                visible: true,
              },
              {
                lang: 'zh',
                value: '',
                visible: true,
              },
            ],
            type: 'text',
            expression: 'CAST (@SPEC."PATIENT_ID" AS VARCHAR)',
            order: 4,
          },
          specimenid: {
            name: 'Specimen Id',
            disabledLangName: [
              {
                lang: 'en',
                value: '',
                visible: true,
              },
              {
                lang: 'de',
                value: '',
                visible: true,
              },
              {
                lang: 'fr',
                value: '',
                visible: true,
              },
              {
                lang: 'es',
                value: '',
                visible: true,
              },
              {
                lang: 'pt',
                value: '',
                visible: true,
              },
              {
                lang: 'zh',
                value: '',
                visible: true,
              },
            ],
            type: 'text',
            expression: 'CAST (@SPEC."SPECIMEN_ID" AS VARCHAR)',
            order: 5,
          },
          unit: {
            name: 'Unit',
            disabledLangName: [
              {
                lang: 'en',
                value: '',
                visible: true,
              },
              {
                lang: 'de',
                value: '',
                visible: true,
              },
              {
                lang: 'fr',
                value: '',
                visible: true,
              },
              {
                lang: 'es',
                value: '',
                visible: true,
              },
              {
                lang: 'pt',
                value: '',
                visible: true,
              },
              {
                lang: 'zh',
                value: '',
                visible: true,
              },
            ],
            type: 'text',
            expression: '@SPEC."UNIT_NAME"',
            referenceFilter: '@REF.DOMAIN_ID = \'Unit\' AND @REF.STANDARD_CONCEPT = \'S\' AND (@REF.CONCEPT_NAME) LIKE_REGEXPR \'@SEARCH_QUERY\' FLAG \'i\'',
            referenceExpression: '@REF.CONCEPT_NAME',
            order: 6,
            useRefValue: true,
          },
          quantity: {
            name: 'Quantity',
            disabledLangName: [
              {
                lang: 'en',
                value: '',
                visible: true,
              },
              {
                lang: 'de',
                value: '',
                visible: true,
              },
              {
                lang: 'fr',
                value: '',
                visible: true,
              },
              {
                lang: 'es',
                value: '',
                visible: true,
              },
              {
                lang: 'pt',
                value: '',
                visible: true,
              },
              {
                lang: 'zh',
                value: '',
                visible: true,
              },
            ],
            type: 'num',
            expression: '@SPEC."QUANTITY"',
            order: 7,
          },
          specimendatetime: {
            name: 'Specimen Date/Time',
            disabledLangName: [
              {
                lang: 'en',
                value: '',
                visible: true,
              },
              {
                lang: 'de',
                value: '',
                visible: true,
              },
              {
                lang: 'fr',
                value: '',
                visible: true,
              },
              {
                lang: 'es',
                value: '',
                visible: true,
              },
              {
                lang: 'pt',
                value: '',
                visible: true,
              },
              {
                lang: 'zh',
                value: '',
                visible: true,
              },
            ],
            type: 'datetime',
            expression: '@SPEC."SPECIMEN_DATETIME"',
            order: 8,
          },
          specimendate: {
            name: 'Specimen Date',
            disabledLangName: [
              {
                lang: 'en',
                value: '',
                visible: true,
              },
              {
                lang: 'de',
                value: '',
                visible: true,
              },
              {
                lang: 'fr',
                value: '',
                visible: true,
              },
              {
                lang: 'es',
                value: '',
                visible: true,
              },
              {
                lang: 'pt',
                value: '',
                visible: true,
              },
              {
                lang: 'zh',
                value: '',
                visible: true,
              },
            ],
            type: 'time',
            expression: '@SPEC."SPECIMEN_DATE"',
            order: 9,
          },
          specimenconceptcode: {
            name: 'Specimen concept code',
            disabledLangName: [
              {
                lang: 'en',
                value: '',
                visible: true,
              },
              {
                lang: 'de',
                value: '',
                visible: true,
              },
              {
                lang: 'fr',
                value: '',
                visible: true,
              },
              {
                lang: 'es',
                value: '',
                visible: true,
              },
              {
                lang: 'pt',
                value: '',
                visible: true,
              },
              {
                lang: 'zh',
                value: '',
                visible: true,
              },
            ],
            type: 'text',
            expression: '@SPEC."SPECIMEN_CONCEPT_CODE"',
            referenceFilter: '@REF.DOMAIN_ID = \'Specimen\' AND @REF.STANDARD_CONCEPT = \'S\' AND (@REF.CONCEPT_CODE) LIKE_REGEXPR \'@SEARCH_QUERY\' FLAG \'i\'',
            referenceExpression: '@REF.CONCEPT_CODE',
            order: 10,
            useRefValue: true,
            useRefText: true,
          },
          specimentypeconceptcode: {
            name: 'Specimen type concept code',
            disabledLangName: [
              {
                lang: 'en',
                value: '',
                visible: true,
              },
              {
                lang: 'de',
                value: '',
                visible: true,
              },
              {
                lang: 'fr',
                value: '',
                visible: true,
              },
              {
                lang: 'es',
                value: '',
                visible: true,
              },
              {
                lang: 'pt',
                value: '',
                visible: true,
              },
              {
                lang: 'zh',
                value: '',
                visible: true,
              },
            ],
            type: 'text',
            expression: '@SPEC."SPECIMEN_TYPE_CONCEPT_CODE"',
            referenceFilter: '@REF.DOMAIN_ID = \'Type Concept\' AND @REF.CONCEPT_CLASS_ID = \'Specimen Type\' AND (@REF.CONCEPT_CODE) LIKE_REGEXPR \'@SEARCH_QUERY\' FLAG \'i\'',
            referenceExpression: '@REF.CONCEPT_CODE',
            order: 11,
            useRefValue: true,
            useRefText: true,
          },
          unitconceptcode: {
            name: 'Unit concept code',
            disabledLangName: [
              {
                lang: 'en',
                value: '',
                visible: true,
              },
              {
                lang: 'de',
                value: '',
                visible: true,
              },
              {
                lang: 'fr',
                value: '',
                visible: true,
              },
              {
                lang: 'es',
                value: '',
                visible: true,
              },
              {
                lang: 'pt',
                value: '',
                visible: true,
              },
              {
                lang: 'zh',
                value: '',
                visible: true,
              },
            ],
            type: 'text',
            expression: '@SPEC."UNIT_CONCEPT_CODE"',
            referenceFilter: '@REF.DOMAIN_ID = \'Unit\' AND @REF.STANDARD_CONCEPT = \'S\' AND (@REF.CONCEPT_CODE) LIKE_REGEXPR \'@SEARCH_QUERY\' FLAG \'i\'',
            referenceExpression: '@REF.CONCEPT_CODE',
            order: 12,
            useRefValue: true,
            useRefText: true,
          },
          anatomicsiteconceptcode: {
            name: 'Anatomic site concept code',
            disabledLangName: [
              {
                lang: 'en',
                value: '',
                visible: true,
              },
              {
                lang: 'de',
                value: '',
                visible: true,
              },
              {
                lang: 'fr',
                value: '',
                visible: true,
              },
              {
                lang: 'es',
                value: '',
                visible: true,
              },
              {
                lang: 'pt',
                value: '',
                visible: true,
              },
              {
                lang: 'zh',
                value: '',
                visible: true,
              },
            ],
            type: 'text',
            expression: '@SPEC."ANATOMIC_SITE_CONCEPT_CODE"',
            referenceFilter: '@REF.DOMAIN_ID = \'Spec Anatomic Site\' AND @REF.STANDARD_CONCEPT = \'S\' AND (@REF.CONCEPT_CODE) LIKE_REGEXPR \'@SEARCH_QUERY\' FLAG \'i\'',
            referenceExpression: '@REF.CONCEPT_CODE',
            order: 13,
            useRefValue: true,
            useRefText: true,
          },
          diseasestatusconceptcode: {
            name: 'Disease status concept code',
            disabledLangName: [
              {
                lang: 'en',
                value: '',
                visible: true,
              },
              {
                lang: 'de',
                value: '',
                visible: true,
              },
              {
                lang: 'fr',
                value: '',
                visible: true,
              },
              {
                lang: 'es',
                value: '',
                visible: true,
              },
              {
                lang: 'pt',
                value: '',
                visible: true,
              },
              {
                lang: 'zh',
                value: '',
                visible: true,
              },
            ],
            type: 'text',
            expression: '@SPEC."DISEASE_STATUS_CONCEPT_CODE"',
            referenceFilter: '@REF.DOMAIN_ID = \'Spec Disease Status\' AND @REF.STANDARD_CONCEPT = \'S\' AND (@REF.CONCEPT_CODE) LIKE_REGEXPR \'@SEARCH_QUERY\' FLAG \'i\'',
            referenceExpression: '@REF.CONCEPT_CODE',
            order: 14,
            useRefValue: true,
            useRefText: true,
          },
          specimenconceptid: {
            name: 'Specimen concept id',
            disabledLangName: [
              {
                lang: 'en',
                value: '',
                visible: true,
              },
              {
                lang: 'de',
                value: '',
                visible: true,
              },
              {
                lang: 'fr',
                value: '',
                visible: true,
              },
              {
                lang: 'es',
                value: '',
                visible: true,
              },
              {
                lang: 'pt',
                value: '',
                visible: true,
              },
              {
                lang: 'zh',
                value: '',
                visible: true,
              },
            ],
            type: 'text',
            expression: '@SPEC."SPECIMEN_CONCEPT_ID"',
            referenceFilter: '@REF.DOMAIN_ID = \'Specimen\' AND @REF.STANDARD_CONCEPT = \'S\' AND CAST (@REF.CONCEPT_ID AS VARCHAR) LIKE_REGEXPR \'@SEARCH_QUERY\' FLAG \'i\'',
            referenceExpression: 'CAST (@REF.CONCEPT_ID AS VARCHAR)',
            order: 15,
            useRefValue: true,
            useRefText: true,
          },
          specimenconceptset: {
            name: 'Specimen concept set',
            disabledLangName: [
              {
                lang: 'en',
                value: '',
                visible: true,
              },
              {
                lang: 'de',
                value: '',
                visible: true,
              },
              {
                lang: 'fr',
                value: '',
                visible: true,
              },
              {
                lang: 'es',
                value: '',
                visible: true,
              },
              {
                lang: 'pt',
                value: '',
                visible: true,
              },
              {
                lang: 'zh',
                value: '',
                visible: true,
              },
            ],
            type: 'conceptSet',
            expression: 'CAST (@SPEC."SPECIMEN_CONCEPT_ID" AS VARCHAR)',
            order: 16,
            useRefValue: true,
            useRefText: true,
          },
          specimentypeconceptid: {
            name: 'Specimen type concept id',
            disabledLangName: [
              {
                lang: 'en',
                value: '',
                visible: true,
              },
              {
                lang: 'de',
                value: '',
                visible: true,
              },
              {
                lang: 'fr',
                value: '',
                visible: true,
              },
              {
                lang: 'es',
                value: '',
                visible: true,
              },
              {
                lang: 'pt',
                value: '',
                visible: true,
              },
              {
                lang: 'zh',
                value: '',
                visible: true,
              },
            ],
            type: 'text',
            expression: '@SPEC."SPECIMEN_TYPE_CONCEPT_ID"',
            referenceFilter: '@REF.DOMAIN_ID = \'Type Concept\' AND @REF.CONCEPT_CLASS_ID = \'Specimen Type\' AND CAST (@REF.CONCEPT_ID AS VARCHAR) LIKE_REGEXPR \'@SEARCH_QUERY\' FLAG \'i\'',
            referenceExpression: 'CAST (@REF.CONCEPT_ID AS VARCHAR)',
            order: 17,
            useRefValue: true,
            useRefText: true,
          },
          specimentypeconceptset: {
            name: 'Specimen type concept set',
            disabledLangName: [
              {
                lang: 'en',
                value: '',
                visible: true,
              },
              {
                lang: 'de',
                value: '',
                visible: true,
              },
              {
                lang: 'fr',
                value: '',
                visible: true,
              },
              {
                lang: 'es',
                value: '',
                visible: true,
              },
              {
                lang: 'pt',
                value: '',
                visible: true,
              },
              {
                lang: 'zh',
                value: '',
                visible: true,
              },
            ],
            type: 'conceptSet',
            expression: 'CAST (@SPEC."SPECIMEN_TYPE_CONCEPT_ID" AS VARCHAR)',
            order: 18,
            useRefValue: true,
            useRefText: true,
          },
          anatomicsiteconceptid: {
            name: 'Anatomic site concept id',
            disabledLangName: [
              {
                lang: 'en',
                value: '',
                visible: true,
              },
              {
                lang: 'de',
                value: '',
                visible: true,
              },
              {
                lang: 'fr',
                value: '',
                visible: true,
              },
              {
                lang: 'es',
                value: '',
                visible: true,
              },
              {
                lang: 'pt',
                value: '',
                visible: true,
              },
              {
                lang: 'zh',
                value: '',
                visible: true,
              },
            ],
            type: 'text',
            expression: '@SPEC."ANATOMIC_SITE_CONCEPT_ID"',
            referenceFilter: '@REF.DOMAIN_ID = \'Spec Anatomic Site\' AND @REF.STANDARD_CONCEPT = \'S\' AND CAST (@REF.CONCEPT_ID AS VARCHAR) LIKE_REGEXPR \'@SEARCH_QUERY\' FLAG \'i\'',
            referenceExpression: 'CAST (@REF.CONCEPT_ID AS VARCHAR)',
            order: 19,
            useRefValue: true,
            useRefText: true,
          },
          anatomicsiteconceptset: {
            name: 'Anatomic site concept set',
            disabledLangName: [
              {
                lang: 'en',
                value: '',
                visible: true,
              },
              {
                lang: 'de',
                value: '',
                visible: true,
              },
              {
                lang: 'fr',
                value: '',
                visible: true,
              },
              {
                lang: 'es',
                value: '',
                visible: true,
              },
              {
                lang: 'pt',
                value: '',
                visible: true,
              },
              {
                lang: 'zh',
                value: '',
                visible: true,
              },
            ],
            type: 'conceptSet',
            expression: 'CAST (@SPEC."ANATOMIC_SITE_CONCEPT_ID" AS VARCHAR)',
            order: 20,
            useRefValue: true,
            useRefText: true,
          },
          diseasestatusconceptid: {
            name: 'Disease status concept id',
            disabledLangName: [
              {
                lang: 'en',
                value: '',
                visible: true,
              },
              {
                lang: 'de',
                value: '',
                visible: true,
              },
              {
                lang: 'fr',
                value: '',
                visible: true,
              },
              {
                lang: 'es',
                value: '',
                visible: true,
              },
              {
                lang: 'pt',
                value: '',
                visible: true,
              },
              {
                lang: 'zh',
                value: '',
                visible: true,
              },
            ],
            type: 'text',
            expression: '@SPEC."DISEASE_STATUS_CONCEPT_ID"',
            referenceFilter: '@REF.DOMAIN_ID = \'Spec Disease Status\' AND @REF.STANDARD_CONCEPT = \'S\' AND CAST (@REF.CONCEPT_ID AS VARCHAR) LIKE_REGEXPR \'@SEARCH_QUERY\' FLAG \'i\'',
            referenceExpression: 'CAST (@REF.CONCEPT_ID AS VARCHAR)',
            order: 21,
            useRefValue: true,
            useRefText: true,
          },
          diseasestatusconceptset: {
            name: 'Disease status concept set',
            disabledLangName: [
              {
                lang: 'en',
                value: '',
                visible: true,
              },
              {
                lang: 'de',
                value: '',
                visible: true,
              },
              {
                lang: 'fr',
                value: '',
                visible: true,
              },
              {
                lang: 'es',
                value: '',
                visible: true,
              },
              {
                lang: 'pt',
                value: '',
                visible: true,
              },
              {
                lang: 'zh',
                value: '',
                visible: true,
              },
            ],
            type: 'conceptSet',
            expression: 'CAST (@SPEC."DISEASE_STATUS_CONCEPT_ID" AS VARCHAR)',
            order: 22,
            useRefValue: true,
            useRefText: true,
          },
          unitconceptid: {
            name: 'Unit concept id',
            disabledLangName: [
              {
                lang: 'en',
                value: '',
                visible: true,
              },
              {
                lang: 'de',
                value: '',
                visible: true,
              },
              {
                lang: 'fr',
                value: '',
                visible: true,
              },
              {
                lang: 'es',
                value: '',
                visible: true,
              },
              {
                lang: 'pt',
                value: '',
                visible: true,
              },
              {
                lang: 'zh',
                value: '',
                visible: true,
              },
            ],
            type: 'text',
            expression: '@SPEC."UNIT_CONCEPT_ID"',
            referenceFilter: '@REF.DOMAIN_ID = \'Unit\' AND @REF.STANDARD_CONCEPT = \'S\' AND CAST (@REF.CONCEPT_ID AS VARCHAR) LIKE_REGEXPR \'@SEARCH_QUERY\' FLAG \'i\'',
            referenceExpression: 'CAST (@REF.CONCEPT_ID AS VARCHAR)',
            order: 23,
            useRefValue: true,
            useRefText: true,
          },
          unitconceptset: {
            name: 'Unit concept set',
            disabledLangName: [
              {
                lang: 'en',
                value: '',
                visible: true,
              },
              {
                lang: 'de',
                value: '',
                visible: true,
              },
              {
                lang: 'fr',
                value: '',
                visible: true,
              },
              {
                lang: 'es',
                value: '',
                visible: true,
              },
              {
                lang: 'pt',
                value: '',
                visible: true,
              },
              {
                lang: 'zh',
                value: '',
                visible: true,
              },
            ],
            type: 'conceptSet',
            expression: 'CAST (@SPEC."UNIT_CONCEPT_ID" AS VARCHAR)',
            order: 24,
            useRefValue: true,
            useRefText: true,
          },
        },
      },
      visit: {
        name: 'Visit',
        disabledLangName: [
          {
            lang: 'en',
            value: '',
            visible: true,
          },
          {
            lang: 'de',
            value: '',
            visible: true,
          },
          {
            lang: 'fr',
            value: '',
            visible: true,
          },
          {
            lang: 'es',
            value: '',
            visible: true,
          },
          {
            lang: 'pt',
            value: '',
            visible: true,
          },
          {
            lang: 'zh',
            value: '',
            visible: true,
          },
        ],
        defaultFilter: '1=1',
        defaultPlaceholder: '@VISIT',
        order: 0,
        parentInteraction: [],
        parentInteractionLabel: 'parent',
        attributes: {
          enddate: {
            name: 'End Date',
            disabledLangName: [
              {
                lang: 'en',
                value: '',
                visible: true,
              },
              {
                lang: 'de',
                value: '',
                visible: true,
              },
              {
                lang: 'fr',
                value: '',
                visible: true,
              },
              {
                lang: 'es',
                value: '',
                visible: true,
              },
              {
                lang: 'pt',
                value: '',
                visible: true,
              },
              {
                lang: 'zh',
                value: '',
                visible: true,
              },
            ],
            type: 'time',
            expression: '@VISIT."VISIT_END_DATE"',
            order: 0,
          },
          startdate: {
            name: 'Start Date',
            disabledLangName: [
              {
                lang: 'en',
                value: '',
                visible: true,
              },
              {
                lang: 'de',
                value: '',
                visible: true,
              },
              {
                lang: 'fr',
                value: '',
                visible: true,
              },
              {
                lang: 'es',
                value: '',
                visible: true,
              },
              {
                lang: 'pt',
                value: '',
                visible: true,
              },
              {
                lang: 'zh',
                value: '',
                visible: true,
              },
            ],
            type: 'time',
            expression: '@VISIT."VISIT_START_DATE"',
            order: 1,
          },
          pid: {
            name: 'Patient Id',
            disabledLangName: [
              {
                lang: 'en',
                value: '',
                visible: true,
              },
              {
                lang: 'de',
                value: '',
                visible: true,
              },
              {
                lang: 'fr',
                value: '',
                visible: true,
              },
              {
                lang: 'es',
                value: '',
                visible: true,
              },
              {
                lang: 'pt',
                value: '',
                visible: true,
              },
              {
                lang: 'zh',
                value: '',
                visible: true,
              },
            ],
            type: 'text',
            expression: 'CAST (@VISIT."PATIENT_ID" AS VARCHAR)',
            order: 2,
          },
          visittype: {
            name: 'Visit type',
            disabledLangName: [
              {
                lang: 'en',
                value: '',
                visible: true,
              },
              {
                lang: 'de',
                value: '',
                visible: true,
              },
              {
                lang: 'fr',
                value: '',
                visible: true,
              },
              {
                lang: 'es',
                value: '',
                visible: true,
              },
              {
                lang: 'pt',
                value: '',
                visible: true,
              },
              {
                lang: 'zh',
                value: '',
                visible: true,
              },
            ],
            type: 'text',
            expression: '@VISIT."VISIT_TYPE_NAME"',
            referenceFilter: '@REF.DOMAIN_ID = \'Type Concept\' AND @REF.CONCEPT_CLASS_ID = \'Visit Type\' AND (@REF.CONCEPT_NAME) LIKE_REGEXPR \'@SEARCH_QUERY\' FLAG \'i\'',
            referenceExpression: '@REF.CONCEPT_NAME',
            order: 3,
            useRefValue: true,
          },
          visitname: {
            name: 'Visit name',
            disabledLangName: [
              {
                lang: 'en',
                value: '',
                visible: true,
              },
              {
                lang: 'de',
                value: '',
                visible: true,
              },
              {
                lang: 'fr',
                value: '',
                visible: true,
              },
              {
                lang: 'es',
                value: '',
                visible: true,
              },
              {
                lang: 'pt',
                value: '',
                visible: true,
              },
              {
                lang: 'zh',
                value: '',
                visible: true,
              },
            ],
            type: 'text',
            expression: '@VISIT."VISIT_NAME"',
            referenceFilter: '@REF.DOMAIN_ID = \'Visit\' AND @REF.STANDARD_CONCEPT = \'S\' AND (@REF.CONCEPT_NAME) LIKE_REGEXPR \'@SEARCH_QUERY\' FLAG \'i\'',
            referenceExpression: '@REF.CONCEPT_NAME',
            order: 4,
            useRefValue: true,
          },
          visitid: {
            name: 'Visit occurrence Id',
            disabledLangName: [
              {
                lang: 'en',
                value: '',
                visible: true,
              },
              {
                lang: 'de',
                value: '',
                visible: true,
              },
              {
                lang: 'fr',
                value: '',
                visible: true,
              },
              {
                lang: 'es',
                value: '',
                visible: true,
              },
              {
                lang: 'pt',
                value: '',
                visible: true,
              },
              {
                lang: 'zh',
                value: '',
                visible: true,
              },
            ],
            type: 'text',
            expression: 'CAST (@VISIT."VISIT_OCCURRENCE_ID" AS VARCHAR)',
            order: 5,
          },
          visitconceptcode: {
            name: 'Visit concept code',
            disabledLangName: [
              {
                lang: 'en',
                value: '',
                visible: true,
              },
              {
                lang: 'de',
                value: '',
                visible: true,
              },
              {
                lang: 'fr',
                value: '',
                visible: true,
              },
              {
                lang: 'es',
                value: '',
                visible: true,
              },
              {
                lang: 'pt',
                value: '',
                visible: true,
              },
              {
                lang: 'zh',
                value: '',
                visible: true,
              },
            ],
            type: 'text',
            expression: '@VISIT."VISIT_CONCEPT_CODE"',
            referenceFilter: '@REF.DOMAIN_ID = \'Visit\' AND @REF.STANDARD_CONCEPT = \'S\' AND (@REF.CONCEPT_CODE) LIKE_REGEXPR \'@SEARCH_QUERY\' FLAG \'i\'',
            referenceExpression: '@REF.CONCEPT_CODE',
            order: 6,
            useRefValue: true,
            useRefText: true,
          },
          visittypeconceptcode: {
            name: 'Visit type concept code',
            disabledLangName: [
              {
                lang: 'en',
                value: '',
                visible: true,
              },
              {
                lang: 'de',
                value: '',
                visible: true,
              },
              {
                lang: 'fr',
                value: '',
                visible: true,
              },
              {
                lang: 'es',
                value: '',
                visible: true,
              },
              {
                lang: 'pt',
                value: '',
                visible: true,
              },
              {
                lang: 'zh',
                value: '',
                visible: true,
              },
            ],
            type: 'text',
            expression: '@VISIT."VISIT_TYPE_CONCEPT_CODE"',
            referenceFilter: '@REF.DOMAIN_ID = \'Type Concept\' AND @REF.CONCEPT_CLASS_ID = \'Visit Type\' AND (@REF.CONCEPT_CODE) LIKE_REGEXPR \'@SEARCH_QUERY\' FLAG \'i\'',
            referenceExpression: '@REF.CONCEPT_CODE',
            order: 7,
            useRefValue: true,
            useRefText: true,
          },
          visittypeconceptset: {
            name: 'Visit type concept set',
            disabledLangName: [
              {
                lang: 'en',
                value: '',
                visible: true,
              },
              {
                lang: 'de',
                value: '',
                visible: true,
              },
              {
                lang: 'fr',
                value: '',
                visible: true,
              },
              {
                lang: 'es',
                value: '',
                visible: true,
              },
              {
                lang: 'pt',
                value: '',
                visible: true,
              },
              {
                lang: 'zh',
                value: '',
                visible: true,
              },
            ],
            type: 'conceptSet',
            expression: 'CAST (@VISIT."VISIT_TYPE_CONCEPT_ID" AS VARCHAR)',
            order: 8,
            useRefValue: true,
            useRefText: true,
          },
          visitconceptid: {
            name: 'Visit concept Id',
            disabledLangName: [
              {
                lang: 'en',
                value: '',
                visible: true,
              },
              {
                lang: 'de',
                value: '',
                visible: true,
              },
              {
                lang: 'fr',
                value: '',
                visible: true,
              },
              {
                lang: 'es',
                value: '',
                visible: true,
              },
              {
                lang: 'pt',
                value: '',
                visible: true,
              },
              {
                lang: 'zh',
                value: '',
                visible: true,
              },
            ],
            type: 'text',
            expression: '@VISIT."VISIT_CONCEPT_ID"',
            referenceFilter: '@REF.DOMAIN_ID = \'Visit\' AND @REF.STANDARD_CONCEPT = \'S\' AND CAST (@REF.CONCEPT_ID AS VARCHAR) LIKE_REGEXPR \'@SEARCH_QUERY\' FLAG \'i\'',
            referenceExpression: 'CAST (@REF.CONCEPT_ID AS VARCHAR)',
            order: 9,
            useRefValue: true,
            useRefText: true,
          },
          visitconceptset: {
            name: 'Visit concept set',
            disabledLangName: [
              {
                lang: 'en',
                value: '',
                visible: true,
              },
              {
                lang: 'de',
                value: '',
                visible: true,
              },
              {
                lang: 'fr',
                value: '',
                visible: true,
              },
              {
                lang: 'es',
                value: '',
                visible: true,
              },
              {
                lang: 'pt',
                value: '',
                visible: true,
              },
              {
                lang: 'zh',
                value: '',
                visible: true,
              },
            ],
            type: 'conceptSet',
            expression: 'CAST (@VISIT."VISIT_CONCEPT_ID" AS VARCHAR)',
            order: 10,
            useRefValue: true,
            useRefText: true,
          },
          visittypeconceptid: {
            name: 'Visit type concept id',
            disabledLangName: [
              {
                lang: 'en',
                value: '',
                visible: true,
              },
              {
                lang: 'de',
                value: '',
                visible: true,
              },
              {
                lang: 'fr',
                value: '',
                visible: true,
              },
              {
                lang: 'es',
                value: '',
                visible: true,
              },
              {
                lang: 'pt',
                value: '',
                visible: true,
              },
              {
                lang: 'zh',
                value: '',
                visible: true,
              },
            ],
            type: 'text',
            expression: 'CAST (@VISIT."VISIT_TYPE_CONCEPT_ID" AS VARCHAR)',
            order: 11,
            useRefValue: true,
            useRefText: true,
          },
        },
      },
      Consent_74db26d2_bb75_489a_a841_051c85dc897b: {
        name: 'Consent',
        disabledLangName: [
          {
            lang: 'de',
            value: '',
            visible: true,
          },
          {
            lang: 'fr',
            value: '',
            visible: true,
          },
          {
            lang: 'es',
            value: '',
            visible: true,
          },
          {
            lang: 'pt',
            value: '',
            visible: true,
          },
          {
            lang: 'zh',
            value: '',
            visible: true,
          },
        ],
        defaultFilter: '1=1',
        defaultPlaceholder: '@CONSENT',
        order: 8,
        parentInteraction: [
          'patient.interactions.Consent_74db26d2_bb75_489a_a841_051c85dc897b',
        ],
        parentInteractionLabel: 'parent',
        attributes: {
          consentdatetime: {
            name: 'Consent Date/Time',
            disabledLangName: [
              {
                lang: 'en',
                value: '',
                visible: true,
              },
              {
                lang: 'de',
                value: '',
                visible: true,
              },
              {
                lang: 'fr',
                value: '',
                visible: true,
              },
              {
                lang: 'es',
                value: '',
                visible: true,
              },
              {
                lang: 'pt',
                value: '',
                visible: true,
              },
              {
                lang: 'zh',
                value: '',
                visible: true,
              },
            ],
            type: 'datetime',
            expression: '@CONSENT."CREATED_AT"',
            order: 0,
          },
          pid: {
            name: 'Patient Id',
            disabledLangName: [
              {
                lang: 'de',
                value: '',
                visible: true,
              },
              {
                lang: 'fr',
                value: '',
                visible: true,
              },
              {
                lang: 'es',
                value: '',
                visible: true,
              },
              {
                lang: 'pt',
                value: '',
                visible: true,
              },
              {
                lang: 'zh',
                value: '',
                visible: true,
              },
            ],
            type: 'text',
            expression: 'CAST (@CONSENT."PERSON_ID" AS VARCHAR)',
            order: 1,
          },
          parentconsentdetailid: {
            name: 'Parent Consent Detail Id',
            disabledLangName: [
              {
                lang: 'de',
                value: '',
                visible: true,
              },
              {
                lang: 'fr',
                value: '',
                visible: true,
              },
              {
                lang: 'es',
                value: '',
                visible: true,
              },
              {
                lang: 'pt',
                value: '',
                visible: true,
              },
              {
                lang: 'zh',
                value: '',
                visible: true,
              },
            ],
            type: 'text',
            expression: 'CAST (@CONSENT."PARENT_CONSENT_DETAIL_ID" AS VARCHAR)',
            order: 2,
          },
          status: {
            name: 'Status',
            disabledLangName: [
              {
                lang: 'de',
                value: '',
                visible: true,
              },
              {
                lang: 'fr',
                value: '',
                visible: true,
              },
              {
                lang: 'es',
                value: '',
                visible: true,
              },
              {
                lang: 'pt',
                value: '',
                visible: true,
              },
              {
                lang: 'zh',
                value: '',
                visible: true,
              },
            ],
            type: 'text',
            expression: '@CONSENT."STATUS"',
            order: 3,
          },
          textval: {
            name: 'Value',
            disabledLangName: [
              {
                lang: 'de',
                value: '',
                visible: true,
              },
              {
                lang: 'fr',
                value: '',
                visible: true,
              },
              {
                lang: 'es',
                value: '',
                visible: true,
              },
              {
                lang: 'pt',
                value: '',
                visible: true,
              },
              {
                lang: 'zh',
                value: '',
                visible: true,
              },
            ],
            type: 'text',
            expression: '@CONSENT."VALUE"',
            order: 4,
          },
          consentcategory: {
            name: 'Category',
            disabledLangName: [
              {
                lang: 'de',
                value: '',
                visible: true,
              },
              {
                lang: 'fr',
                value: '',
                visible: true,
              },
              {
                lang: 'es',
                value: '',
                visible: true,
              },
              {
                lang: 'pt',
                value: '',
                visible: true,
              },
              {
                lang: 'zh',
                value: '',
                visible: true,
              },
            ],
            type: 'text',
            expression: '@CONSENT."TYPE"',
            order: 5,
          },
          New_Attribute_1_3d0da2a3_f0de_4112_b87c_e7aff266c0d8: {
            name: 'Attribute',
            disabledLangName: [
              {
                lang: 'de',
                value: '',
                visible: true,
              },
              {
                lang: 'fr',
                value: '',
                visible: true,
              },
              {
                lang: 'es',
                value: '',
                visible: true,
              },
              {
                lang: 'pt',
                value: '',
                visible: true,
              },
              {
                lang: 'zh',
                value: '',
                visible: true,
              },
            ],
            type: 'text',
            expression: '@CONSENT."ATTRIBUTE"',
            order: 6,
          },
          Attribute_copy_53f290b7_70e9_4c1e_bd6d_605bc916ce66: {
            name: 'Attribute Group Id',
            disabledLangName: [
              {
                lang: 'de',
                value: '',
                visible: true,
              },
              {
                lang: 'fr',
                value: '',
                visible: true,
              },
              {
                lang: 'es',
                value: '',
                visible: true,
              },
              {
                lang: 'pt',
                value: '',
                visible: true,
              },
              {
                lang: 'zh',
                value: '',
                visible: true,
              },
            ],
            type: 'text',
            expression: '@CONSENT."ATTRIBUTE_GROUP_ID"',
            order: 7,
          },
          Consent_Id_copy_60a4adeb_1e84_4f04_b7d5_8eb1c006f56d: {
            name: 'Consent Detail Id',
            disabledLangName: [
              {
                lang: 'de',
                value: '',
                visible: true,
              },
              {
                lang: 'fr',
                value: '',
                visible: true,
              },
              {
                lang: 'es',
                value: '',
                visible: true,
              },
              {
                lang: 'pt',
                value: '',
                visible: true,
              },
              {
                lang: 'zh',
                value: '',
                visible: true,
              },
            ],
            type: 'text',
            expression: '@CONSENT."CONSENT_DETAIL_ID"',
            order: 8,
          },
        },
      },
      questionnaire: {
        name: 'Questionnaire',
        disabledLangName: [
          {
            lang: 'de',
            value: '',
            visible: true,
          },
          {
            lang: 'fr',
            value: '',
            visible: true,
          },
          {
            lang: 'es',
            value: '',
            visible: true,
          },
          {
            lang: 'pt',
            value: '',
            visible: true,
          },
          {
            lang: 'zh',
            value: '',
            visible: true,
          },
        ],
        defaultPlaceholder: '@RESPONSE',
        order: 1,
        parentInteraction: [],
        parentInteractionLabel: 'parent',
        attributes: {
          linkID: {
            name: 'Link ID',
            disabledLangName: [
              {
                lang: 'en',
                value: '',
                visible: true,
              },
              {
                lang: 'de',
                value: '',
                visible: true,
              },
              {
                lang: 'fr',
                value: '',
              },
              {
                lang: 'es',
                value: '',
              },
              {
                lang: 'pt',
                value: '',
              },
              {
                lang: 'zh',
                value: '',
              },
            ],
            type: 'text',
            expression: '@RESPONSE."LINK_ID"',
            order: 0,
          },
          valueCodingValue: {
            name: 'Value coding value',
            disabledLangName: [
              {
                lang: 'en',
                value: '',
                visible: true,
              },
              {
                lang: 'de',
                value: '',
                visible: true,
              },
              {
                lang: 'fr',
                value: '',
              },
              {
                lang: 'es',
                value: '',
              },
              {
                lang: 'pt',
                value: '',
              },
              {
                lang: 'zh',
                value: '',
              },
            ],
            type: 'text',
            expression: '@RESPONSE."VALUECODING_CODE"',
            order: 1,
          },
          recordID: {
            name: 'Record ID',
            disabledLangName: [
              {
                lang: 'en',
                value: '',
                visible: true,
              },
              {
                lang: 'de',
                value: '',
                visible: true,
              },
              {
                lang: 'fr',
                value: '',
              },
              {
                lang: 'es',
                value: '',
              },
              {
                lang: 'pt',
                value: '',
              },
              {
                lang: 'zh',
                value: '',
              },
            ],
            type: 'text',
            expression: '@RESPONSE."ID"',
            order: 2,
          },
          questionnaireLanguage: {
            name: 'Questionnaire language',
            disabledLangName: [
              {
                lang: 'en',
                value: '',
                visible: true,
              },
              {
                lang: 'de',
                value: '',
                visible: true,
              },
              {
                lang: 'fr',
                value: '',
              },
              {
                lang: 'es',
                value: '',
              },
              {
                lang: 'pt',
                value: '',
              },
              {
                lang: 'zh',
                value: '',
              },
            ],
            type: 'text',
            expression: '@RESPONSE."LANGUAGE"',
            order: 3,
          },
          questionnaireStatus: {
            name: 'Questionnaire status',
            disabledLangName: [
              {
                lang: 'en',
                value: '',
                visible: true,
              },
              {
                lang: 'de',
                value: '',
                visible: true,
              },
              {
                lang: 'fr',
                value: '',
              },
              {
                lang: 'es',
                value: '',
              },
              {
                lang: 'pt',
                value: '',
              },
              {
                lang: 'zh',
                value: '',
              },
            ],
            type: 'text',
            expression: '@RESPONSE."STATUS"',
            order: 4,
          },
          questionnaireAuthored: {
            name: 'Questionnaire authored',
            disabledLangName: [
              {
                lang: 'en',
                value: '',
                visible: true,
              },
              {
                lang: 'de',
                value: '',
                visible: true,
              },
              {
                lang: 'fr',
                value: '',
              },
              {
                lang: 'es',
                value: '',
              },
              {
                lang: 'pt',
                value: '',
              },
              {
                lang: 'zh',
                value: '',
              },
            ],
            type: 'text',
            expression: '@RESPONSE."AUTHORED"',
            order: 5,
          },
          text: {
            name: 'Text',
            disabledLangName: [
              {
                lang: 'en',
                value: '',
                visible: true,
              },
              {
                lang: 'de',
                value: '',
                visible: true,
              },
              {
                lang: 'fr',
                value: '',
              },
              {
                lang: 'es',
                value: '',
              },
              {
                lang: 'pt',
                value: '',
              },
              {
                lang: 'zh',
                value: '',
              },
            ],
            type: 'text',
            expression: '@RESPONSE."TEXT"',
            order: 6,
          },
          valueType: {
            name: 'Value type',
            disabledLangName: [
              {
                lang: 'en',
                value: '',
                visible: true,
              },
              {
                lang: 'de',
                value: '',
                visible: true,
              },
              {
                lang: 'fr',
                value: '',
              },
              {
                lang: 'es',
                value: '',
              },
              {
                lang: 'pt',
                value: '',
              },
              {
                lang: 'zh',
                value: '',
              },
            ],
            type: 'text',
            expression: '@RESPONSE."VALUE_TYPE"',
            order: 7,
          },
          value: {
            name: 'Value',
            disabledLangName: [
              {
                lang: 'en',
                value: '',
                visible: true,
              },
              {
                lang: 'de',
                value: '',
                visible: true,
              },
              {
                lang: 'fr',
                value: '',
              },
              {
                lang: 'es',
                value: '',
              },
              {
                lang: 'pt',
                value: '',
              },
              {
                lang: 'zh',
                value: '',
              },
            ],
            type: 'text',
            expression: '@RESPONSE."VALUE"',
            order: 8,
          },
          questionnaireReference: {
            name: 'Questionnaire reference',
            disabledLangName: [
              {
                lang: 'en',
                value: '',
                visible: true,
              },
              {
                lang: 'de',
                value: '',
                visible: true,
              },
              {
                lang: 'fr',
                value: '',
              },
              {
                lang: 'es',
                value: '',
              },
              {
                lang: 'pt',
                value: '',
              },
              {
                lang: 'zh',
                value: '',
              },
            ],
            type: 'text',
            expression: '@RESPONSE."QUESTIONNAIRE_REFERENCE"',
            order: 9,
          },
          questionnaireVersion: {
            name: 'Questionnaire version',
            disabledLangName: [
              {
                lang: 'en',
                value: '',
                visible: true,
              },
              {
                lang: 'de',
                value: '',
                visible: true,
              },
              {
                lang: 'fr',
                value: '',
              },
              {
                lang: 'es',
                value: '',
              },
              {
                lang: 'pt',
                value: '',
              },
              {
                lang: 'zh',
                value: '',
              },
            ],
            type: 'text',
            expression: '@RESPONSE."QUESTIONNAIRE_VERSION"',
            order: 10,
          },
          extensionEffectiveDateUrl: {
            name: 'Questionaire extension effective date url',
            disabledLangName: [
              {
                lang: 'en',
                value: '',
                visible: true,
              },
              {
                lang: 'de',
                value: '',
                visible: true,
              },
              {
                lang: 'fr',
                value: '',
                visible: true,
              },
              {
                lang: 'es',
                value: '',
                visible: true,
              },
              {
                lang: 'pt',
                value: '',
                visible: true,
              },
              {
                lang: 'zh',
                value: '',
                visible: true,
              },
            ],
            type: 'text',
            expression: '@RESPONSE."EXTENSION_EFFECTIVE_DATE_URL"',
            order: 11,
          },
          extensionValuedate: {
            name: 'Questionaire extension valuedate',
            disabledLangName: [
              {
                lang: 'en',
                value: '',
                visible: true,
              },
              {
                lang: 'de',
                value: '',
                visible: true,
              },
              {
                lang: 'fr',
                value: '',
                visible: true,
              },
              {
                lang: 'es',
                value: '',
                visible: true,
              },
              {
                lang: 'pt',
                value: '',
                visible: true,
              },
              {
                lang: 'zh',
                value: '',
                visible: true,
              },
            ],
            type: 'text',
            expression: '@RESPONSE."EXTENSION_VALUEDATE"',
            order: 12,
          },
        },
      },
      ptoken: {
        name: 'Participation Token',
        disabledLangName: [
          {
            lang: 'en',
            value: '',
            visible: true,
          },
          {
            lang: 'de',
            value: '',
            visible: true,
          },
          {
            lang: 'fr',
            value: '',
            visible: true,
          },
          {
            lang: 'es',
            value: '',
            visible: true,
          },
          {
            lang: 'pt',
            value: '',
            visible: true,
          },
          {
            lang: 'zh',
            value: '',
            visible: true,
          },
        ],
        defaultPlaceholder: '@PTOKEN',
        order: 16,
        parentInteraction: [],
        parentInteractionLabel: 'parent',
        attributes: {
          participationtokenid: {
            name: 'Participation Token Id',
            disabledLangName: [
              {
                lang: 'en',
                value: '',
                visible: true,
              },
              {
                lang: 'de',
                value: '',
                visible: true,
              },
              {
                lang: 'fr',
                value: '',
                visible: true,
              },
              {
                lang: 'es',
                value: '',
                visible: true,
              },
              {
                lang: 'pt',
                value: '',
                visible: true,
              },
              {
                lang: 'zh',
                value: '',
                visible: true,
              },
            ],
            type: 'text',
            expression: '@PTOKEN."ID"',
            order: 0,
          },
          participationtokenstudyid: {
            name: 'Participation Token Study Id',
            disabledLangName: [
              {
                lang: 'en',
                value: '',
                visible: true,
              },
              {
                lang: 'de',
                value: '',
                visible: true,
              },
              {
                lang: 'fr',
                value: '',
                visible: true,
              },
              {
                lang: 'es',
                value: '',
                visible: true,
              },
              {
                lang: 'pt',
                value: '',
                visible: true,
              },
              {
                lang: 'zh',
                value: '',
                visible: true,
              },
            ],
            type: 'text',
            expression: '@PTOKEN."STUDY_ID"',
            order: 1,
          },
          participationtokenexternalid: {
            name: 'Participation Token External Id',
            disabledLangName: [
              {
                lang: 'en',
                value: '',
                visible: true,
              },
              {
                lang: 'de',
                value: '',
                visible: true,
              },
              {
                lang: 'fr',
                value: '',
                visible: true,
              },
              {
                lang: 'es',
                value: '',
                visible: true,
              },
              {
                lang: 'pt',
                value: '',
                visible: true,
              },
              {
                lang: 'zh',
                value: '',
                visible: true,
              },
            ],
            type: 'text',
            expression: '@PTOKEN."EXTERNAL_ID"',
            order: 2,
          },
          participationtoken: {
            name: 'Participation Token',
            disabledLangName: [
              {
                lang: 'en',
                value: '',
                visible: true,
              },
              {
                lang: 'de',
                value: '',
                visible: true,
              },
              {
                lang: 'fr',
                value: '',
                visible: true,
              },
              {
                lang: 'es',
                value: '',
                visible: true,
              },
              {
                lang: 'pt',
                value: '',
                visible: true,
              },
              {
                lang: 'zh',
                value: '',
                visible: true,
              },
            ],
            type: 'text',
            expression: '@PTOKEN."TOKEN"',
            order: 3,
          },
          participationtokencreatedby: {
            name: 'Participant Token Created By',
            disabledLangName: [
              {
                lang: 'en',
                value: '',
                visible: true,
              },
              {
                lang: 'de',
                value: '',
                visible: true,
              },
              {
                lang: 'fr',
                value: '',
                visible: true,
              },
              {
                lang: 'es',
                value: '',
                visible: true,
              },
              {
                lang: 'pt',
                value: '',
                visible: true,
              },
              {
                lang: 'zh',
                value: '',
                visible: true,
              },
            ],
            type: 'text',
            expression: '@PTOKEN."CREATED_BY"',
            order: 4,
          },
          participanttokencreateddate: {
            name: 'Participant Token Created Date',
            disabledLangName: [
              {
                lang: 'en',
                value: '',
                visible: true,
              },
              {
                lang: 'de',
                value: '',
                visible: true,
              },
              {
                lang: 'fr',
                value: '',
                visible: true,
              },
              {
                lang: 'es',
                value: '',
                visible: true,
              },
              {
                lang: 'pt',
                value: '',
                visible: true,
              },
              {
                lang: 'zh',
                value: '',
                visible: true,
              },
            ],
            type: 'datetime',
            expression: '@PTOKEN."CREATED_DATE"',
            order: 5,
          },
          participationtokenmodifiedby: {
            name: 'Participation Token Modified By',
            disabledLangName: [
              {
                lang: 'en',
                value: '',
                visible: true,
              },
              {
                lang: 'de',
                value: '',
                visible: true,
              },
              {
                lang: 'fr',
                value: '',
                visible: true,
              },
              {
                lang: 'es',
                value: '',
                visible: true,
              },
              {
                lang: 'pt',
                value: '',
                visible: true,
              },
              {
                lang: 'zh',
                value: '',
                visible: true,
              },
            ],
            type: 'text',
            expression: '@PTOKEN."MODIFIED_BY"',
            order: 6,
          },
          participationtokenmodifieddate: {
            name: 'Participation Token Modified Date',
            disabledLangName: [
              {
                lang: 'en',
                value: '',
                visible: true,
              },
              {
                lang: 'de',
                value: '',
                visible: true,
              },
              {
                lang: 'fr',
                value: '',
                visible: true,
              },
              {
                lang: 'es',
                value: '',
                visible: true,
              },
              {
                lang: 'pt',
                value: '',
                visible: true,
              },
              {
                lang: 'zh',
                value: '',
                visible: true,
              },
            ],
            type: 'datetime',
            expression: '@PTOKEN."MODIFIED_DATE"',
            order: 7,
          },
          participationtokenstatus: {
            name: 'Participation Token Status',
            disabledLangName: [
              {
                lang: 'en',
                value: '',
                visible: true,
              },
              {
                lang: 'de',
                value: '',
                visible: true,
              },
              {
                lang: 'fr',
                value: '',
                visible: true,
              },
              {
                lang: 'es',
                value: '',
                visible: true,
              },
              {
                lang: 'pt',
                value: '',
                visible: true,
              },
              {
                lang: 'zh',
                value: '',
                visible: true,
              },
            ],
            type: 'text',
            expression: '@PTOKEN."STATUS"',
            order: 8,
          },
          participationtokenlastdonationdate: {
            name: 'Participation Token Last Donation Date',
            disabledLangName: [
              {
                lang: 'en',
                value: '',
                visible: true,
              },
              {
                lang: 'de',
                value: '',
                visible: true,
              },
              {
                lang: 'fr',
                value: '',
                visible: true,
              },
              {
                lang: 'es',
                value: '',
                visible: true,
              },
              {
                lang: 'pt',
                value: '',
                visible: true,
              },
              {
                lang: 'zh',
                value: '',
                visible: true,
              },
            ],
            type: 'datetime',
            expression: '@PTOKEN."LAST_DONATION_DATE"',
            order: 9,
          },
          participationtokenvalidationdate: {
            name: 'Participation Token Validation Date',
            disabledLangName: [
              {
                lang: 'en',
                value: '',
                visible: true,
              },
              {
                lang: 'de',
                value: '',
                visible: true,
              },
              {
                lang: 'fr',
                value: '',
                visible: true,
              },
              {
                lang: 'es',
                value: '',
                visible: true,
              },
              {
                lang: 'pt',
                value: '',
                visible: true,
              },
              {
                lang: 'zh',
                value: '',
                visible: true,
              },
            ],
            type: 'datetime',
            expression: '@PTOKEN."VALIDATION_DATE"',
            order: 10,
          },
          participationtokenpersonid: {
            name: 'Participation Token Person Id',
            disabledLangName: [
              {
                lang: 'en',
                value: '',
                visible: true,
              },
              {
                lang: 'de',
                value: '',
                visible: true,
              },
              {
                lang: 'fr',
                value: '',
                visible: true,
              },
              {
                lang: 'es',
                value: '',
                visible: true,
              },
              {
                lang: 'pt',
                value: '',
                visible: true,
              },
              {
                lang: 'zh',
                value: '',
                visible: true,
              },
            ],
            type: 'text',
            expression: '@PTOKEN."PERSON_ID"',
            order: 11,
          },
        },
      },
      cohort: {
        name: 'Cohort',
        disabledLangName: [
          {
            lang: 'en',
            value: '',
            visible: true,
          },
          {
            lang: 'de',
            value: '',
            visible: true,
          },
          {
            lang: 'fr',
            value: '',
            visible: true,
          },
          {
            lang: 'es',
            value: '',
            visible: true,
          },
          {
            lang: 'pt',
            value: '',
            visible: true,
          },
          {
            lang: 'zh',
            value: '',
            visible: true,
          },
        ],
        defaultFilter: '1=1',
        defaultPlaceholder: '@COHORT',
        order: 17,
        parentInteraction: [],
        parentInteractionLabel: 'parent',
        attributes: {
          cohortdefinitionid: {
            name: 'Cohort ID',
            disabledLangName: [
              {
                lang: 'en',
                value: '',
                visible: true,
              },
              {
                lang: 'de',
                value: '',
                visible: true,
              },
              {
                lang: 'fr',
                value: '',
                visible: true,
              },
              {
                lang: 'es',
                value: '',
                visible: true,
              },
              {
                lang: 'pt',
                value: '',
                visible: true,
              },
              {
                lang: 'zh',
                value: '',
                visible: true,
              },
            ],
            type: 'num',
            expression: '@COHORT.cohort_definition_id',
            order: 0,
            useRefValue: true,
            useRefText: true,
          },
          pid: {
            name: 'Patient Id',
            disabledLangName: [
              {
                lang: 'en',
                value: '',
                visible: true,
              },
              {
                lang: 'de',
                value: '',
                visible: true,
              },
              {
                lang: 'fr',
                value: '',
                visible: true,
              },
              {
                lang: 'es',
                value: '',
                visible: true,
              },
              {
                lang: 'pt',
                value: '',
                visible: true,
              },
              {
                lang: 'zh',
                value: '',
                visible: true,
              },
            ],
            type: 'text',
            expression: 'CAST (@COHORT.subject_id AS VARCHAR)',
            order: 1,
          },
          enddate: {
            name: 'End Date',
            disabledLangName: [
              {
                lang: 'en',
                value: '',
                visible: true,
              },
              {
                lang: 'de',
                value: '',
                visible: true,
              },
              {
                lang: 'fr',
                value: '',
                visible: true,
              },
              {
                lang: 'es',
                value: '',
                visible: true,
              },
              {
                lang: 'pt',
                value: '',
                visible: true,
              },
              {
                lang: 'zh',
                value: '',
                visible: true,
              },
            ],
            type: 'time',
            expression: '@COHORT.cohort_end_date',
            order: 2,
          },
          startdate: {
            name: 'Start Date',
            disabledLangName: [
              {
                lang: 'en',
                value: '',
                visible: true,
              },
              {
                lang: 'de',
                value: '',
                visible: true,
              },
              {
                lang: 'fr',
                value: '',
                visible: true,
              },
              {
                lang: 'es',
                value: '',
                visible: true,
              },
              {
                lang: 'pt',
                value: '',
                visible: true,
              },
              {
                lang: 'zh',
                value: '',
                visible: true,
              },
            ],
            type: 'time',
            expression: '@COHORT.cohort_start_date',
            order: 3,
          },
        },
      },
    },
    attributes: {
      pid: {
        name: 'Patient ID',
        disabledLangName: [],
        type: 'text',
        expression: 'CAST (@PATIENT."PATIENT_ID" AS VARCHAR)',
        order: 0,
        annotations: [
          'patient_id',
        ],
      },
      pcount: {
        name: 'Patient Count',
        disabledLangName: [],
        type: 'num',
        measureExpression: 'COUNT(DISTINCT(@PATIENT."PATIENT_ID"))',
        order: 1,
      },
      monthOfBirth: {
        name: 'Month of Birth',
        disabledLangName: [],
        type: 'num',
        expression: '@PATIENT."MONTH_OF_BIRTH"',
        order: 2,
      },
      yearOfBirth: {
        name: 'Year of Birth',
        disabledLangName: [],
        type: 'num',
        expression: '@PATIENT."YEAR_OF_BIRTH"',
        order: 3,
      },
      dateOfBirth: {
        name: 'Date of Birth',
        disabledLangName: [],
        type: 'datetime',
        expression: '@PATIENT."BIRTH_DATE"',
        order: 4,
        annotations: [
          'date_of_birth',
        ],
      },
      dateOfDeath: {
        name: 'Date of Death',
        disabledLangName: [],
        type: 'datetime',
        expression: '@PATIENT."DEATH_DATE"',
        order: 5,
        annotations: [
          'date_of_death',
        ],
      },
      Race: {
        name: 'Race',
        disabledLangName: [
          {
            lang: 'en',
            value: '',
            visible: true,
          },
          {
            lang: 'de',
            value: '',
            visible: true,
          },
          {
            lang: 'fr',
            value: '',
            visible: true,
          },
          {
            lang: 'es',
            value: '',
            visible: true,
          },
          {
            lang: 'pt',
            value: '',
            visible: true,
          },
          {
            lang: 'zh',
            value: '',
            visible: true,
          },
        ],
        type: 'text',
        expression: '@PATIENT."RACE"',
        referenceFilter: '@REF.DOMAIN_ID = \'Race\' AND @REF.STANDARD_CONCEPT = \'S\' AND (@REF.CONCEPT_NAME) LIKE_REGEXPR \'@SEARCH_QUERY\' FLAG \'i\'',
        referenceExpression: '@REF.CONCEPT_NAME',
        order: 6,
        useRefValue: true,
      },
      Gender: {
        name: 'Gender',
        disabledLangName: [
          {
            lang: 'en',
            value: '',
            visible: true,
          },
          {
            lang: 'de',
            value: '',
            visible: true,
          },
          {
            lang: 'fr',
            value: '',
            visible: true,
          },
          {
            lang: 'es',
            value: '',
            visible: true,
          },
          {
            lang: 'pt',
            value: '',
            visible: true,
          },
          {
            lang: 'zh',
            value: '',
            visible: true,
          },
        ],
        type: 'text',
        expression: '@PATIENT."GENDER"',
        referenceFilter: '@REF.DOMAIN_ID = \'Gender\' AND @REF.STANDARD_CONCEPT = \'S\' AND (@REF.CONCEPT_NAME) LIKE_REGEXPR \'@SEARCH_QUERY\' FLAG \'i\'',
        referenceExpression: '@REF.CONCEPT_NAME',
        order: 7,
        useRefValue: true,
      },
      Ethnicity: {
        name: 'Ethnicity',
        disabledLangName: [
          {
            lang: 'en',
            value: '',
            visible: true,
          },
          {
            lang: 'de',
            value: '',
            visible: true,
          },
          {
            lang: 'fr',
            value: '',
            visible: true,
          },
          {
            lang: 'es',
            value: '',
            visible: true,
          },
          {
            lang: 'pt',
            value: '',
            visible: true,
          },
          {
            lang: 'zh',
            value: '',
            visible: true,
          },
        ],
        type: 'text',
        expression: '@PATIENT."ETHNICITY"',
        referenceFilter: '@REF.DOMAIN_ID = \'Ethnicity\' AND @REF.STANDARD_CONCEPT = \'S\' AND (@REF.CONCEPT_NAME) LIKE_REGEXPR \'@SEARCH_QUERY\' FLAG \'i\'',
        referenceExpression: '@REF.CONCEPT_NAME',
        order: 8,
        useRefValue: true,
      },
      State: {
        name: 'State',
        disabledLangName: [
          {
            lang: 'en',
            value: '',
            visible: true,
          },
          {
            lang: 'de',
            value: '',
            visible: true,
          },
          {
            lang: 'fr',
            value: '',
            visible: true,
          },
          {
            lang: 'es',
            value: '',
            visible: true,
          },
          {
            lang: 'pt',
            value: '',
            visible: true,
          },
          {
            lang: 'zh',
            value: '',
            visible: true,
          },
        ],
        type: 'text',
        expression: '@PATIENT."STATE"',
        order: 9,
      },
      County: {
        name: 'County',
        disabledLangName: [
          {
            lang: 'de',
            value: '',
            visible: true,
          },
          {
            lang: 'fr',
            value: '',
            visible: true,
          },
          {
            lang: 'es',
            value: '',
            visible: true,
          },
          {
            lang: 'pt',
            value: '',
            visible: true,
          },
          {
            lang: 'zh',
            value: '',
            visible: true,
          },
          {
            lang: 'en',
            value: '',
          },
        ],
        type: 'text',
        expression: '@PATIENT."COUNTY"',
        order: 10,
      },
      genderconceptcode: {
        name: 'Gender concept code',
        disabledLangName: [
          {
            lang: 'en',
            value: '',
            visible: true,
          },
          {
            lang: 'de',
            value: '',
            visible: true,
          },
          {
            lang: 'fr',
            value: '',
            visible: true,
          },
          {
            lang: 'es',
            value: '',
            visible: true,
          },
          {
            lang: 'pt',
            value: '',
            visible: true,
          },
          {
            lang: 'zh',
            value: '',
            visible: true,
          },
        ],
        type: 'text',
        expression: '@PATIENT."GENDER_CONCEPT_CODE"',
        referenceFilter: '@REF.DOMAIN_ID = \'Gender\' AND @REF.STANDARD_CONCEPT = \'S\' AND (@REF.CONCEPT_CODE) LIKE_REGEXPR \'@SEARCH_QUERY\' FLAG \'i\'',
        referenceExpression: '@REF.CONCEPT_CODE',
        order: 11,
        useRefValue: true,
        useRefText: true,
      },
      raceconceptcode: {
        name: 'Race concept code',
        disabledLangName: [
          {
            lang: 'en',
            value: '',
            visible: true,
          },
          {
            lang: 'de',
            value: '',
            visible: true,
          },
          {
            lang: 'fr',
            value: '',
            visible: true,
          },
          {
            lang: 'es',
            value: '',
            visible: true,
          },
          {
            lang: 'pt',
            value: '',
            visible: true,
          },
          {
            lang: 'zh',
            value: '',
            visible: true,
          },
        ],
        type: 'text',
        expression: '@PATIENT."RACE_CONCEPT_CODE"',
        referenceFilter: '@REF.DOMAIN_ID = \'Race\' AND @REF.STANDARD_CONCEPT = \'S\' AND (@REF.CONCEPT_CODE) LIKE_REGEXPR \'@SEARCH_QUERY\' FLAG \'i\'',
        referenceExpression: '@REF.CONCEPT_CODE',
        order: 12,
        useRefValue: true,
        useRefText: true,
      },
      ethnicityconceptcode: {
        name: 'Ethnicity concept code',
        disabledLangName: [
          {
            lang: 'en',
            value: '',
            visible: true,
          },
          {
            lang: 'de',
            value: '',
            visible: true,
          },
          {
            lang: 'fr',
            value: '',
            visible: true,
          },
          {
            lang: 'es',
            value: '',
            visible: true,
          },
          {
            lang: 'pt',
            value: '',
            visible: true,
          },
          {
            lang: 'zh',
            value: '',
            visible: true,
          },
        ],
        type: 'text',
        expression: '@PATIENT."ETHNICITY_CONCEPT_CODE"',
        referenceFilter: '@REF.DOMAIN_ID = \'Ethnicity\' AND @REF.STANDARD_CONCEPT = \'S\' AND (@REF.CONCEPT_CODE) LIKE_REGEXPR \'@SEARCH_QUERY\' FLAG \'i\'',
        referenceExpression: '@REF.CONCEPT_CODE',
        order: 13,
        useRefValue: true,
        useRefText: true,
      },
      ethnicityconceptset: {
        name: 'Ethnicity concept set',
        disabledLangName: [
          {
            lang: 'en',
            value: '',
            visible: true,
          },
          {
            lang: 'de',
            value: '',
            visible: true,
          },
          {
            lang: 'fr',
            value: '',
            visible: true,
          },
          {
            lang: 'es',
            value: '',
            visible: true,
          },
          {
            lang: 'pt',
            value: '',
            visible: true,
          },
          {
            lang: 'zh',
            value: '',
            visible: true,
          },
        ],
        type: 'conceptSet',
        expression: '@PATIENT."ETHNICITY_CONCEPT_ID"',
        order: 14,
        useRefValue: true,
        useRefText: true,
      },
      lastAuthoredDate: {
        name: 'Last authored date',
        disabledLangName: [
          {
            lang: 'en',
            value: '',
            visible: true,
          },
          {
            lang: 'de',
            value: '',
            visible: true,
          },
          {
            lang: 'fr',
            value: '',
            visible: true,
          },
          {
            lang: 'es',
            value: '',
            visible: true,
          },
          {
            lang: 'pt',
            value: '',
            visible: true,
          },
          {
            lang: 'zh',
            value: '',
            visible: true,
          },
        ],
        type: 'text',
        expression: '@PATIENT."LAST_DONATION_DATETIME"',
        order: 15,
      },
      genderconceptid: {
        name: 'Gender concept id',
        disabledLangName: [
          {
            lang: 'en',
            value: '',
            visible: true,
          },
          {
            lang: 'de',
            value: '',
            visible: true,
          },
          {
            lang: 'fr',
            value: '',
            visible: true,
          },
          {
            lang: 'es',
            value: '',
            visible: true,
          },
          {
            lang: 'pt',
            value: '',
            visible: true,
          },
          {
            lang: 'zh',
            value: '',
            visible: true,
          },
        ],
        type: 'text',
        expression: '@PATIENT."GENDER_CONCEPT_ID"',
        referenceFilter: '@REF.DOMAIN_ID = \'Gender\' AND @REF.STANDARD_CONCEPT = \'S\' AND CAST (@REF.CONCEPT_ID AS VARCHAR) LIKE_REGEXPR \'@SEARCH_QUERY\' FLAG \'i\'',
        referenceExpression: '@REF.CONCEPT_ID',
        order: 16,
        useRefValue: true,
        useRefText: true,
      },
      genderconceptset: {
        name: 'Gender concept set',
        disabledLangName: [
          {
            lang: 'en',
            value: '',
            visible: true,
          },
          {
            lang: 'de',
            value: '',
            visible: true,
          },
          {
            lang: 'fr',
            value: '',
            visible: true,
          },
          {
            lang: 'es',
            value: '',
            visible: true,
          },
          {
            lang: 'pt',
            value: '',
            visible: true,
          },
          {
            lang: 'zh',
            value: '',
            visible: true,
          },
        ],
        type: 'conceptSet',
        expression: '@PATIENT."GENDER_CONCEPT_ID"',
        order: 17,
        useRefValue: true,
        useRefText: true,
      },
      raceconceptid: {
        name: 'Race concept id',
        disabledLangName: [
          {
            lang: 'en',
            value: '',
            visible: true,
          },
          {
            lang: 'de',
            value: '',
            visible: true,
          },
          {
            lang: 'fr',
            value: '',
            visible: true,
          },
          {
            lang: 'es',
            value: '',
            visible: true,
          },
          {
            lang: 'pt',
            value: '',
            visible: true,
          },
          {
            lang: 'zh',
            value: '',
            visible: true,
          },
        ],
        type: 'text',
        expression: '@PATIENT."RACE_CONCEPT_ID"',
        referenceFilter: '@REF.DOMAIN_ID = \'Race\' AND @REF.STANDARD_CONCEPT = \'S\' AND CAST (@REF.CONCEPT_ID AS VARCHAR) LIKE_REGEXPR \'@SEARCH_QUERY\' FLAG \'i\'',
        referenceExpression: '@REF.CONCEPT_ID',
        order: 18,
        useRefValue: true,
        useRefText: true,
      },
      raceconceptset: {
        name: 'Race concept set',
        disabledLangName: [
          {
            lang: 'en',
            value: '',
            visible: true,
          },
          {
            lang: 'de',
            value: '',
            visible: true,
          },
          {
            lang: 'fr',
            value: '',
            visible: true,
          },
          {
            lang: 'es',
            value: '',
            visible: true,
          },
          {
            lang: 'pt',
            value: '',
            visible: true,
          },
          {
            lang: 'zh',
            value: '',
            visible: true,
          },
        ],
        type: 'conceptSet',
        expression: '@PATIENT."RACE_CONCEPT_ID"',
        order: 19,
        useRefValue: true,
        useRefText: true,
      },
      status: {
        name: 'Status',
        disabledLangName: [
          {
            lang: 'en',
            value: '',
            visible: true,
          },
          {
            lang: 'de',
            value: '',
            visible: true,
          },
          {
            lang: 'fr',
            value: '',
            visible: true,
          },
          {
            lang: 'es',
            value: '',
            visible: true,
          },
          {
            lang: 'pt',
            value: '',
            visible: true,
          },
          {
            lang: 'zh',
            value: '',
            visible: true,
          },
        ],
        type: 'text',
        expression: '@PATIENT."STATUS"',
        order: 20,
      },
      externalid: {
        name: 'External ID',
        disabledLangName: [
          {
            lang: 'en',
            value: '',
            visible: true,
          },
          {
            lang: 'de',
            value: '',
            visible: true,
          },
          {
            lang: 'fr',
            value: '',
            visible: true,
          },
          {
            lang: 'es',
            value: '',
            visible: true,
          },
          {
            lang: 'pt',
            value: '',
            visible: true,
          },
          {
            lang: 'zh',
            value: '',
            visible: true,
          },
        ],
        type: 'text',
        expression: '@PATIENT."SOURCE_INDIVIDUAL_IDENTIFIER_VALUE"',
        order: 21,
      },
      Age: {
        name: 'Age',
        disabledLangName: [
          {
            lang: 'de',
            value: '',
            visible: true,
          },
          {
            lang: 'fr',
            value: '',
            visible: true,
          },
          {
            lang: 'es',
            value: '',
            visible: true,
          },
          {
            lang: 'pt',
            value: '',
            visible: true,
          },
          {
            lang: 'zh',
            value: '',
            visible: true,
          },
        ],
        type: 'num',
        expression: 'YEAR(CURRENT_DATE) - @PATIENT."YEAR_OF_BIRTH"',
        order: 22,
      },
      groupID: {
        name: 'Group ID',
        disabledLangName: [
          {
            lang: 'de',
            value: '',
            visible: true,
          },
          {
            lang: 'fr',
            value: '',
            visible: true,
          },
          {
            lang: 'es',
            value: '',
            visible: true,
          },
          {
            lang: 'pt',
            value: '',
            visible: true,
          },
          {
            lang: 'zh',
            value: '',
            visible: true,
          },
        ],
        type: 'text',
        expression: '@PATIENT."EXTENSION_VALUESTRING"',
        order: 23,
      },
      alpid: {
        name: 'ALP ID',
        disabledLangName: [
          {
            lang: 'de',
            value: '',
            visible: true,
          },
          {
            lang: 'fr',
            value: '',
            visible: true,
          },
          {
            lang: 'es',
            value: '',
            visible: true,
          },
          {
            lang: 'pt',
            value: '',
            visible: true,
          },
          {
            lang: 'zh',
            value: '',
            visible: true,
          },
        ],
        type: 'text',
        expression: '@PATIENT."ALP_ID"',
        order: 24,
      }
    },
  },
  censor: {},
  advancedSettings: {
    tableTypePlaceholderMap: {
      factTable: {
        placeholder: '@PATIENT',
        attributeTables: [],
      },
      dimTables: [
        {
          placeholder: '@COND',
          attributeTables: [],
          hierarchy: true,
          time: true,
          oneToN: true,
          condition: true,
        },
        {
          placeholder: '@VISIT',
          attributeTables: [],
          hierarchy: true,
          time: true,
          oneToN: true,
          condition: true,
        },
        {
          placeholder: '@CONDERA',
          attributeTables: [],
          hierarchy: true,
          time: true,
          oneToN: true,
          condition: true,
        },
        {
          placeholder: '@DEATH',
          attributeTables: [],
          hierarchy: true,
          time: true,
          oneToN: true,
          condition: true,
        },
        {
          placeholder: '@DEVEXP',
          attributeTables: [],
          hierarchy: true,
          time: true,
          oneToN: true,
          condition: true,
        },
        {
          placeholder: '@DOSEERA',
          attributeTables: [],
          hierarchy: true,
          time: true,
          oneToN: true,
          condition: true,
        },
        {
          placeholder: '@DRUGERA',
          attributeTables: [],
          hierarchy: true,
          time: true,
          oneToN: true,
          condition: true,
        },
        {
          placeholder: '@DRUGEXP',
          attributeTables: [],
          hierarchy: true,
          time: true,
          oneToN: true,
          condition: true,
        },
        {
          placeholder: '@OBS',
          attributeTables: [],
          hierarchy: true,
          time: true,
          oneToN: true,
          condition: true,
        },
        {
          placeholder: '@OBSPER',
          attributeTables: [],
          hierarchy: true,
          time: true,
          oneToN: true,
          condition: true,
        },
        {
          placeholder: '@PPPER',
          attributeTables: [],
          hierarchy: true,
          time: true,
          oneToN: true,
          condition: true,
        },
        {
          placeholder: '@SPEC',
          attributeTables: [],
          hierarchy: true,
          time: true,
          oneToN: true,
          condition: true,
        },
        {
          placeholder: '@MEAS',
          attributeTables: [],
          hierarchy: true,
          time: true,
          oneToN: true,
          condition: true,
        },
        {
          placeholder: '@PROC',
          attributeTables: [],
          hierarchy: true,
          time: true,
          oneToN: true,
          condition: true,
        },
        {
          placeholder: '@CONSENT',
          attributeTables: [],
          hierarchy: true,
          time: false,
          oneToN: false,
          condition: false,
        },
        {
          placeholder: '@RESPONSE',
          attributeTables: [],
          hierarchy: true,
          time: true,
          oneToN: true,
          condition: true,
        },
        {
          placeholder: '@PTOKEN',
          attributeTables: [],
          hierarchy: true,
          time: true,
          oneToN: true,
          condition: true,
        },
        {
          placeholder: '@COHORT',
          attributeTables: [],
          hierarchy: true,
          time: true,
          oneToN: true,
          condition: true,
        },
      ],
    },
    tableMapping: {
      '@COND': '$$SCHEMA$$."VIEW::OMOP.COND"',
      '@COND.PATIENT_ID': '"PATIENT_ID"',
      '@COND.INTERACTION_ID': '"CONDITION_OCCURRENCE_ID"',
      '@COND.CONDITION_ID': '"CONDITION_OCCURRENCE_ID"',
      '@COND.PARENT_INTERACT_ID': '"CONDITION_OCCURRENCE_ID"',
      '@COND.START': '"CONDITION_START_DATE"',
      '@COND.END': '"CONDITION_END_DATE"',
      '@COND.INTERACTION_TYPE': '"CONDITION_TYPE_NAME"',
      '@VISIT': '$$SCHEMA$$."VIEW::OMOP.VISIT"',
      '@VISIT.PATIENT_ID': '"PATIENT_ID"',
      '@VISIT.INTERACTION_ID': '"VISIT_OCCURRENCE_ID"',
      '@VISIT.CONDITION_ID': '"VISIT_OCCURRENCE_ID"',
      '@VISIT.PARENT_INTERACT_ID': '"VISIT_OCCURRENCE_ID"',
      '@VISIT.START': '"VISIT_START_DATE"',
      '@VISIT.END': '"VISIT_END_DATE"',
      '@VISIT.INTERACTION_TYPE': '"VISIT_TYPE_NAME"',
      '@CONDERA': '$$SCHEMA$$."VIEW::OMOP.COND_ERA"',
      '@CONDERA.PATIENT_ID': '"PATIENT_ID"',
      '@CONDERA.INTERACTION_ID': '"CONDITION_ERA_ID"',
      '@CONDERA.CONDITION_ID': '"CONDITION_ERA_ID"',
      '@CONDERA.PARENT_INTERACT_ID': '"CONDITION_ERA_ID"',
      '@CONDERA.START': '"CONDITION_ERA_START_DATE"',
      '@CONDERA.END': '"CONDITION_ERA_END_DATE"',
      '@CONDERA.INTERACTION_TYPE': '"CONDITION_NAME"',
      '@DEATH': '$$SCHEMA$$."VIEW::OMOP.DEATH"',
      '@DEATH.PATIENT_ID': '"PATIENT_ID"',
      '@DEATH.INTERACTION_ID': '"PATIENT_ID"',
      '@DEATH.CONDITION_ID': '"PATIENT_ID"',
      '@DEATH.PARENT_INTERACT_ID': '"PATIENT_ID"',
      '@DEATH.START': '"DEATH_DATE"',
      '@DEATH.END': '"DEATH_DATE"',
      '@DEATH.INTERACTION_TYPE': '"DEATH_TYPE_NAME"',
      '@DEVEXP': '$$SCHEMA$$."VIEW::OMOP.DEVICE_EXPOSURE"',
      '@DEVEXP.PATIENT_ID': '"PATIENT_ID"',
      '@DEVEXP.INTERACTION_ID': '"DEVICE_EXPOSURE_ID"',
      '@DEVEXP.CONDITION_ID': '"DEVICE_EXPOSURE_ID"',
      '@DEVEXP.PARENT_INTERACT_ID': '"DEVICE_EXPOSURE_ID"',
      '@DEVEXP.START': '"DEVICE_EXPOSURE_START_DATE"',
      '@DEVEXP.END': '"DEVICE_EXPOSURE_END_DATE"',
      '@DEVEXP.INTERACTION_TYPE': '"DEVICE_TYPE_NAME"',
      '@DOSEERA': '$$SCHEMA$$."VIEW::OMOP.DOSE_ERA"',
      '@DOSEERA.PATIENT_ID': '"PATIENT_ID"',
      '@DOSEERA.INTERACTION_ID': '"DOSE_ERA_ID"',
      '@DOSEERA.CONDITION_ID': '"DOSE_ERA_ID"',
      '@DOSEERA.PARENT_INTERACT_ID': '"DOSE_ERA_ID"',
      '@DOSEERA.START': '"DOSE_ERA_START_DATE"',
      '@DOSEERA.END': '"DOSE_ERA_END_DATE"',
      '@DOSEERA.INTERACTION_TYPE': '"DRUG_NAME"',
      '@DRUGERA': '$$SCHEMA$$."VIEW::OMOP.DRUG_ERA"',
      '@DRUGERA.PATIENT_ID': '"PATIENT_ID"',
      '@DRUGERA.INTERACTION_ID': '"DRUG_ERA_ID"',
      '@DRUGERA.CONDITION_ID': '"DRUG_ERA_ID"',
      '@DRUGERA.PARENT_INTERACT_ID': '"DRUG_ERA_ID"',
      '@DRUGERA.START': '"DRUG_ERA_START_DATE"',
      '@DRUGERA.END': '"DRUG_ERA_END_DATE"',
      '@DRUGERA.INTERACTION_TYPE': '"DRUG_NAME"',
      '@DRUGEXP': '$$SCHEMA$$."VIEW::OMOP.DRUG_EXP"',
      '@DRUGEXP.PATIENT_ID': '"PATIENT_ID"',
      '@DRUGEXP.INTERACTION_ID': '"DRUG_EXPOSURE_ID"',
      '@DRUGEXP.CONDITION_ID': '"DRUG_EXPOSURE_ID"',
      '@DRUGEXP.PARENT_INTERACT_ID': '"DRUG_EXPOSURE_ID"',
      '@DRUGEXP.START': '"DRUG_EXPOSURE_START_DATE"',
      '@DRUGEXP.END': '"DRUG_EXPOSURE_END_DATE"',
      '@DRUGEXP.INTERACTION_TYPE': '"DRUG_TYPE_NAME"',
      '@OBS': '$$SCHEMA$$."VIEW::OMOP.OBS"',
      '@OBS.PATIENT_ID': '"PATIENT_ID"',
      '@OBS.INTERACTION_ID': '"OBSERVATION_ID"',
      '@OBS.CONDITION_ID': '"OBSERVATION_ID"',
      '@OBS.PARENT_INTERACT_ID': '"OBSERVATION_ID"',
      '@OBS.START': '"OBSERVATION_DATE"',
      '@OBS.END': '"OBSERVATION_DATE"',
      '@OBS.INTERACTION_TYPE': '"OBSERVATION_TYPE_NAME"',
      '@OBSPER': '$$SCHEMA$$."VIEW::OMOP.OBS_PER"',
      '@OBSPER.PATIENT_ID': '"PATIENT_ID"',
      '@OBSPER.INTERACTION_ID': '"OBSERVATION_PERIOD_ID"',
      '@OBSPER.CONDITION_ID': '"OBSERVATION_PERIOD_ID"',
      '@OBSPER.PARENT_INTERACT_ID': '"OBSERVATION_PERIOD_ID"',
      '@OBSPER.START': '"OBSERVATION_PERIOD_START_DATE"',
      '@OBSPER.END': '"OBSERVATION_PERIOD_END_DATE"',
      '@OBSPER.INTERACTION_TYPE': '"PERIOD_TYPE_NAME"',
      '@PPPER': '$$SCHEMA$$."VIEW::OMOP.PP_PER"',
      '@PPPER.PATIENT_ID': '"PATIENT_ID"',
      '@PPPER.INTERACTION_ID': '"PAYER_PLAN_PERIOD_ID"',
      '@PPPER.CONDITION_ID': '"PAYER_PLAN_PERIOD_ID"',
      '@PPPER.PARENT_INTERACT_ID': '"PAYER_PLAN_PERIOD_ID"',
      '@PPPER.START': '"PAYER_PLAN_PERIOD_START_DATE"',
      '@PPPER.END': '"PAYER_PLAN_PERIOD_END_DATE"',
      '@PPPER.INTERACTION_TYPE': '"PLAN_SOURCE_VALUE"',
      '@SPEC': '$$SCHEMA$$."VIEW::OMOP.SPEC"',
      '@SPEC.PATIENT_ID': '"PATIENT_ID"',
      '@SPEC.INTERACTION_ID': '"SPECIMEN_ID"',
      '@SPEC.CONDITION_ID': '"SPECIMEN_ID"',
      '@SPEC.PARENT_INTERACT_ID': '"SPECIMEN_ID"',
      '@SPEC.START': '"SPECIMEN_DATE"',
      '@SPEC.END': '"SPECIMEN_DATE"',
      '@SPEC.INTERACTION_TYPE': '"SPECIMEN_TYPE_NAME"',
      '@MEAS': '$$SCHEMA$$."VIEW::OMOP.MEAS"',
      '@MEAS.PATIENT_ID': '"PATIENT_ID"',
      '@MEAS.INTERACTION_ID': '"MEASUREMENT_ID"',
      '@MEAS.CONDITION_ID': '"MEASUREMENT_ID"',
      '@MEAS.PARENT_INTERACT_ID': '"MEASUREMENT_ID"',
      '@MEAS.START': '"MEASUREMENT_DATE"',
      '@MEAS.END': '"MEASUREMENT_DATE"',
      '@MEAS.INTERACTION_TYPE': '"MEASUREMENT_TYPE_NAME"',
      '@PROC': '$$SCHEMA$$."VIEW::OMOP.PROC"',
      '@PROC.PATIENT_ID': '"PATIENT_ID"',
      '@PROC.INTERACTION_ID': '"PROCEDURE_OCCURRENCE_ID"',
      '@PROC.CONDITION_ID': '"PROCEDURE_OCCURRENCE_ID"',
      '@PROC.PARENT_INTERACT_ID': '"PROCEDURE_OCCURRENCE_ID"',
      '@PROC.START': '"PROCEDURE_START_DATE"',
      '@PROC.END': '"PROCEDURE_END_DATE"',
      '@PROC.INTERACTION_TYPE': '"PROCEDURE_TYPE_NAME"',
      '@CONSENT': '$$SCHEMA$$."VIEW::GDM.CONSENT_BASE"',
      '@CONSENT.PATIENT_ID': '"PERSON_ID"',
      '@CONSENT.INTERACTION_ID': '"ID"',
      '@CONSENT.CONDITION_ID': '"ID"',
      '@CONSENT.PARENT_INTERACT_ID': '"PARENT_CONSENT_DETAIL_ID"',
      '@CONSENT.START': '"CREATED_AT"',
      '@CONSENT.END': '"CREATED_AT"',
      '@CONSENT.INTERACTION_TYPE': '"TYPE"',
      '@RESPONSE': '$$SCHEMA$$."VIEW::GDM.QUESTIONNAIRE_RESPONSE_BASE"',
      '@RESPONSE.PATIENT_ID': '"PERSON_ID"',
      '@RESPONSE.INTERACTION_ID': '"ID"',
      '@RESPONSE.CONDITION_ID': '"ID"',
      '@RESPONSE.PARENT_INTERACT_ID': '"ANSWER_ID"',
      '@RESPONSE.START': '"AUTHORED"',
      '@RESPONSE.END': '"AUTHORED"',
      '@RESPONSE.INTERACTION_TYPE': '"ANSWER_ID"',
      '@PTOKEN': '$$SCHEMA$$."VIEW::OMOP.PARTICIPANT_TOKEN"',
      '@PTOKEN.PATIENT_ID': '"PERSON_ID"',
      '@PTOKEN.INTERACTION_ID': '"ID"',
      '@PTOKEN.CONDITION_ID': '"ID"',
      '@PTOKEN.PARENT_INTERACT_ID': '"ID"',
      '@PTOKEN.START': '"CREATED_DATE"',
      '@PTOKEN.END': '"CREATED_DATE"',
      '@PTOKEN.INTERACTION_TYPE': '"TOKEN"',
      '@PATIENT': '$$SCHEMA$$."VIEW::OMOP.GDM.PATIENT"',
      '@PATIENT.PATIENT_ID': '"PATIENT_ID"',
      '@PATIENT.DOD': '"DEATH_DATE"',
      '@PATIENT.DOB': '"BIRTH_DATE"',
      '@REF': '$$VOCAB_SCHEMA$$.CONCEPT',
      '@REF.VOCABULARY_ID': '"VOCABULARY_ID"',
      '@REF.CODE': 'CONCEPT_ID',
      '@REF.TEXT': 'CONCEPT_NAME',
      '@TEXT': '$$VOCAB_SCHEMA$$."CONCEPT"',
      '@TEXT.INTERACTION_ID': 'CONCEPT_ID',
      '@TEXT.INTERACTION_TEXT_ID': 'CONCEPT_ID',
      '@TEXT.VALUE': 'CONCEPT_NAME',
      '@COHORT': '$$SCHEMA$$.cohort',
      '@COHORT.PATIENT_ID': 'subject_id',
      '@COHORT.INTERACTION_TYPE': 'cohort_definition_id',
      "@COHORT.INTERACTION_ID": 'cohort_definition_id',
      "@COHORT.CONDITION_ID": 'cohort_definition_id',
      "@COHORT.PARENT_INTERACT_ID": 'subject_id',
      "@COHORT.START": 'cohort_start_date',
      "@COHORT.END": 'cohort_end_date',
    },
    guardedTableMapping: {
      '@PATIENT': '$$SCHEMA$$."VIEW::OMOP.GDM.PATIENT"',
    },
    ohdsiCohortDefinitionTableMapping: {
      '@COND': 'ConditionOccurrence',
      '@COND."CONDITION_START_DATE"': 'OccurrenceStartDate',
      '@COND."CONDITION_END_DATE"': 'OccurrenceEndDate',
      '@PATIENT."GENDER"': 'Gender',
      'YEAR(CURRENT_DATE) - @PATIENT."YEAR_OF_BIRTH"': 'Age',
      '@CONDERA': 'ConditionEra',
      '@DEATH': 'Death',
      '@DEATH."DEATH_TYPE_NAME"': 'DeathType',
      '@DRUGERA': 'DrugEra',
      '@DRUGERA."DRUG_ERA_START_DATE"': 'EraStartDate',
      '@DRUGERA."DRUG_ERA_END_DATE"': 'EraEndDate',
    },
    language: [
      'en',
      'de',
      'fr',
      'es',
      'pt',
      'zh',
    ],
    others: {},
    settings: {
      fuzziness: 0.7,
      maxResultSize: 5000,
      sqlReturnOn: false,
      errorDetailsReturnOn: false,
      errorStackTraceReturnOn: false,
      enableFreeText: true,
      vbEnabled: true,
      dateFormat: 'YYYY-MM-dd',
      timeFormat: 'HH:mm:ss',
      otsTableMap: {
        '@CODE': '$$VOCAB_SCHEMA$$."CONCEPT"',
      },
    },
    shared: {},
    schemaVersion: '3',
  },
}

const paConfig = {
  filtercards: [
    {
      source: "patient",
      visible: true,
      order: 1,
      initial: true,
      attributes: [
        {
          source: "patient.attributes.Age",
          ordered: true,
          cached: true,
          useRefText: false,
          useRefValue: false,
          category: true,
          measure: true,
          filtercard: {
            initial: true,
            visible: true,
            order: 1,
          },
          patientlist: {
            initial: true,
            visible: true,
            linkColumn: false,
          },
          modelName: "Age",
        },
        {
          source: "patient.attributes.externalid",
          ordered: false,
          cached: true,
          useRefText: false,
          useRefValue: false,
          category: true,
          measure: false,
          filtercard: {
            initial: false,
            visible: true,
            order: 2,
          },
          patientlist: {
            initial: false,
            visible: true,
            linkColumn: false,
          },
          modelName: "External ID",
        },
        {
          source: "patient.attributes.status",
          ordered: false,
          cached: true,
          useRefText: false,
          useRefValue: false,
          category: true,
          measure: false,
          filtercard: {
            initial: false,
            visible: true,
            order: 3,
          },
          patientlist: {
            initial: false,
            visible: true,
            linkColumn: false,
          },
          modelName: "Status",
        },
        {
          source: "patient.attributes.County",
          ordered: false,
          cached: true,
          useRefText: false,
          useRefValue: false,
          category: true,
          measure: false,
          filtercard: {
            initial: false,
            visible: true,
            order: 4,
          },
          patientlist: {
            initial: false,
            visible: true,
            linkColumn: false,
          },
          modelName: "County",
        },
        {
          source: "patient.attributes.State",
          ordered: false,
          cached: true,
          useRefText: false,
          useRefValue: false,
          category: true,
          measure: false,
          filtercard: {
            initial: false,
            visible: true,
            order: 5,
          },
          patientlist: {
            initial: false,
            visible: true,
            linkColumn: false,
          },
          modelName: "State",
        },
        {
          source: "patient.attributes.Ethnicity",
          ordered: false,
          cached: true,
          useRefText: false,
          useRefValue: true,
          category: true,
          measure: false,
          filtercard: {
            initial: false,
            visible: true,
            order: 6,
          },
          patientlist: {
            initial: true,
            visible: true,
            linkColumn: false,
          },
          modelName: "Ethnicity",
        },
        {
          source: "patient.attributes.ethnicityconceptcode",
          ordered: false,
          cached: true,
          useRefText: true,
          useRefValue: true,
          category: true,
          measure: false,
          filtercard: {
            initial: false,
            visible: true,
            order: 7,
          },
          patientlist: {
            initial: false,
            visible: true,
            linkColumn: false,
          },
          modelName: "Ethnicity concept code",
        },
        {
          source: "patient.attributes.ethnicityconceptset",
          ordered: false,
          cached: true,
          useRefText: false,
          useRefValue: false,
          category: false,
          measure: false,
          filtercard: {
            initial: false,
            visible: true,
            order: 8,
          },
          patientlist: {
            initial: false,
            visible: false,
            linkColumn: false,
          },
          modelName: "Ethnicity concept set",
        },
        {
          source: "patient.attributes.lastAuthoredDate",
          ordered: false,
          cached: true,
          useRefText: false,
          useRefValue: false,
          category: true,
          measure: false,
          filtercard: {
            initial: false,
            visible: true,
            order: 9,
          },
          patientlist: {
            initial: false,
            visible: true,
            linkColumn: false,
          },
          modelName: "Last authored date",
        },
        {
          source: "patient.attributes.Gender",
          ordered: false,
          cached: true,
          useRefText: false,
          useRefValue: true,
          category: true,
          measure: false,
          filtercard: {
            initial: true,
            visible: true,
            order: 10,
          },
          patientlist: {
            initial: true,
            visible: true,
            linkColumn: false,
          },
          modelName: "Gender",
        },
        {
          source: "patient.attributes.genderconceptcode",
          ordered: false,
          cached: true,
          useRefText: true,
          useRefValue: true,
          category: true,
          measure: false,
          filtercard: {
            initial: false,
            visible: true,
            order: 11,
          },
          patientlist: {
            initial: false,
            visible: true,
            linkColumn: false,
          },
          modelName: "Gender concept code",
        },
        {
          source: "patient.attributes.genderconceptid",
          ordered: false,
          cached: true,
          useRefText: true,
          useRefValue: true,
          category: true,
          measure: false,
          filtercard: {
            initial: false,
            visible: true,
            order: 12,
          },
          patientlist: {
            initial: false,
            visible: true,
            linkColumn: false,
          },
          modelName: "Gender concept id",
        },
        {
          source: "patient.attributes.genderconceptset",
          ordered: false,
          cached: true,
          useRefText: false,
          useRefValue: false,
          category: false,
          measure: false,
          filtercard: {
            initial: false,
            visible: true,
            order: 13,
          },
          patientlist: {
            initial: false,
            visible: false,
            linkColumn: false,
          },
          modelName: "Gender concept set",
        },
        {
          source: "patient.attributes.Race",
          ordered: false,
          cached: true,
          useRefText: false,
          useRefValue: true,
          category: true,
          measure: false,
          filtercard: {
            initial: false,
            visible: true,
            order: 14,
          },
          patientlist: {
            initial: true,
            visible: true,
            linkColumn: false,
          },
          modelName: "Race",
        },
        {
          source: "patient.attributes.raceconceptcode",
          ordered: false,
          cached: true,
          useRefText: true,
          useRefValue: true,
          category: true,
          measure: false,
          filtercard: {
            initial: false,
            visible: true,
            order: 15,
          },
          patientlist: {
            initial: false,
            visible: true,
            linkColumn: false,
          },
          modelName: "Race concept code",
        },
        {
          source: "patient.attributes.raceconceptid",
          ordered: false,
          cached: true,
          useRefText: true,
          useRefValue: true,
          category: true,
          measure: false,
          filtercard: {
            initial: false,
            visible: true,
            order: 16,
          },
          patientlist: {
            initial: false,
            visible: true,
            linkColumn: false,
          },
          modelName: "Race concept id",
        },
        {
          source: "patient.attributes.raceconceptset",
          ordered: false,
          cached: true,
          useRefText: false,
          useRefValue: false,
          category: false,
          measure: false,
          filtercard: {
            initial: false,
            visible: true,
            order: 17,
          },
          patientlist: {
            initial: false,
            visible: false,
            linkColumn: false,
          },
          modelName: "Race concept set",
        },
        {
          source: "patient.attributes.pid",
          ordered: false,
          cached: true,
          useRefText: false,
          useRefValue: false,
          category: true,
          measure: false,
          filtercard: {
            initial: false,
            visible: true,
            order: 18,
          },
          patientlist: {
            initial: true,
            visible: true,
            linkColumn: false,
          },
          modelName: "Patient ID",
        },
        {
          source: "patient.attributes.pcount",
          ordered: true,
          cached: true,
          useRefText: false,
          useRefValue: false,
          category: false,
          measure: true,
          filtercard: {
            initial: false,
            visible: false,
            order: 19,
          },
          patientlist: {
            initial: false,
            visible: false,
            linkColumn: false,
          },
          modelName: "Patient Count",
        },
        {
          source: "patient.attributes.monthOfBirth",
          ordered: true,
          cached: true,
          useRefText: false,
          useRefValue: false,
          category: true,
          measure: true,
          filtercard: {
            initial: false,
            visible: true,
            order: 20,
          },
          patientlist: {
            initial: false,
            visible: true,
            linkColumn: false,
          },
          modelName: "Month of Birth",
        },
        {
          source: "patient.attributes.yearOfBirth",
          ordered: true,
          cached: true,
          useRefText: false,
          useRefValue: false,
          category: true,
          measure: true,
          filtercard: {
            initial: false,
            visible: true,
            order: 21,
          },
          patientlist: {
            initial: false,
            visible: true,
            linkColumn: false,
          },
          modelName: "Year of Birth",
        },
        {
          source: "patient.attributes.dateOfBirth",
          ordered: false,
          cached: true,
          useRefText: false,
          useRefValue: false,
          category: true,
          measure: false,
          filtercard: {
            initial: false,
            visible: true,
            order: 22,
          },
          patientlist: {
            initial: false,
            visible: true,
            linkColumn: false,
          },
          modelName: "Date of Birth",
        },
        {
          source: "patient.attributes.dateOfDeath",
          ordered: false,
          cached: true,
          useRefText: false,
          useRefValue: false,
          category: true,
          measure: false,
          filtercard: {
            initial: false,
            visible: true,
            order: 23,
          },
          patientlist: {
            initial: false,
            visible: true,
            linkColumn: false,
          },
          modelName: "Date of Death",
        },
        {
          source: "patient.attributes.groupID",
          ordered: false,
          cached: true,
          useRefText: false,
          useRefValue: false,
          category: true,
          measure: false,
          filtercard: {
            initial: false,
            visible: true,
            order: 24,
          },
          patientlist: {
            initial: false,
            visible: true,
            linkColumn: false,
          },
          modelName: "Group ID",
        },
        {
          source: "patient.attributes.alpid",
          ordered: false,
          cached: true,
          useRefText: false,
          useRefValue: false,
          category: true,
          measure: false,
          filtercard: {
            initial: false,
            visible: true,
            order: 25,
          },
          patientlist: {
            initial: false,
            visible: true,
            linkColumn: false,
          },
          modelName: "ALP ID",
        }
      ],
      initialPatientlistColumn: true,
      modelName: "MRI_PA_SERVICES_FILTERCARD_TITLE_BASIC_DATA",
    },
    {
      source: "patient.interactions.conditionoccurrence",
      visible: true,
      order: 2,
      initial: false,
      attributes: [
        {
          source:
            "patient.interactions.conditionoccurrence.attributes.conditionoccurrenceid",
          ordered: false,
          cached: true,
          useRefText: false,
          useRefValue: false,
          category: true,
          measure: false,
          filtercard: {
            initial: false,
            visible: true,
            order: 1,
          },
          patientlist: {
            initial: false,
            visible: true,
            linkColumn: false,
          },
          modelName: "Condition Occurrence Id",
        },
        {
          source:
            "patient.interactions.conditionoccurrence.attributes.conditionconceptid",
          ordered: false,
          cached: true,
          useRefText: true,
          useRefValue: true,
          category: true,
          measure: false,
          filtercard: {
            initial: false,
            visible: true,
            order: 2,
          },
          patientlist: {
            initial: false,
            visible: true,
            linkColumn: false,
          },
          modelName: "Condition concept id",
        },
        {
          source:
            "patient.interactions.conditionoccurrence.attributes.conditionconceptset",
          ordered: false,
          cached: true,
          useRefText: false,
          useRefValue: false,
          category: false,
          measure: false,
          filtercard: {
            initial: true,
            visible: true,
            order: 3,
          },
          patientlist: {
            initial: true,
            visible: true,
            linkColumn: false,
          },
          modelName: "Condition concept set",
        },
        {
          source:
            "patient.interactions.conditionoccurrence.attributes.condconceptcode",
          ordered: false,
          cached: true,
          useRefText: true,
          useRefValue: true,
          category: true,
          measure: false,
          filtercard: {
            initial: false,
            visible: true,
            order: 4,
          },
          patientlist: {
            initial: false,
            visible: true,
            linkColumn: false,
          },
          modelName: "Condition concept code",
        },
        {
          source:
            "patient.interactions.conditionoccurrence.attributes.conditionname",
          ordered: false,
          cached: true,
          useRefText: false,
          useRefValue: true,
          category: true,
          measure: false,
          filtercard: {
            initial: false,
            visible: true,
            order: 5,
          },
          patientlist: {
            initial: true,
            visible: true,
            linkColumn: false,
          },
          modelName: "Condition Name",
        },
        {
          source:
            "patient.interactions.conditionoccurrence.attributes.conditiontype",
          ordered: false,
          cached: true,
          useRefText: false,
          useRefValue: true,
          category: true,
          measure: false,
          filtercard: {
            initial: false,
            visible: true,
            order: 6,
          },
          patientlist: {
            initial: true,
            visible: true,
            linkColumn: false,
          },
          modelName: "Condition Type",
        },
        {
          source:
            "patient.interactions.conditionoccurrence.attributes.conditiontypeconceptcode",
          ordered: false,
          cached: true,
          useRefText: true,
          useRefValue: true,
          category: true,
          measure: false,
          filtercard: {
            initial: false,
            visible: true,
            order: 7,
          },
          patientlist: {
            initial: false,
            visible: true,
            linkColumn: false,
          },
          modelName: "Condition Type concept code",
        },
        {
          source:
            "patient.interactions.conditionoccurrence.attributes.conditiontypeconceptset",
          ordered: false,
          cached: true,
          useRefText: false,
          useRefValue: false,
          category: false,
          measure: false,
          filtercard: {
            initial: true,
            visible: true,
            order: 8,
          },
          patientlist: {
            initial: false,
            visible: true,
            linkColumn: false,
          },
          modelName: "Condition Type concept set",
        },
        {
          source:
            "patient.interactions.conditionoccurrence.attributes.conditionsource",
          ordered: false,
          cached: true,
          useRefText: false,
          useRefValue: false,
          category: true,
          measure: false,
          filtercard: {
            initial: false,
            visible: true,
            order: 9,
          },
          patientlist: {
            initial: true,
            visible: true,
            linkColumn: false,
          },
          modelName: "Condition Source",
        },
        {
          source:
            "patient.interactions.conditionoccurrence.attributes.conditionsourceconceptcode",
          ordered: false,
          cached: true,
          useRefText: false,
          useRefValue: false,
          category: true,
          measure: false,
          filtercard: {
            initial: false,
            visible: true,
            order: 10,
          },
          patientlist: {
            initial: false,
            visible: true,
            linkColumn: false,
          },
          modelName: "Condition Source concept code",
        },
        {
          source:
            "patient.interactions.conditionoccurrence.attributes.conditionsourceconceptset",
          ordered: false,
          cached: true,
          useRefText: false,
          useRefValue: false,
          category: false,
          measure: false,
          filtercard: {
            initial: false,
            visible: true,
            order: 11,
          },
          patientlist: {
            initial: false,
            visible: false,
            linkColumn: false,
          },
          modelName: "Condition Source concept set",
        },
        {
          source:
            "patient.interactions.conditionoccurrence.attributes.conditionstatus",
          ordered: false,
          cached: true,
          useRefText: false,
          useRefValue: true,
          category: true,
          measure: false,
          filtercard: {
            initial: false,
            visible: true,
            order: 12,
          },
          patientlist: {
            initial: false,
            visible: true,
            linkColumn: false,
          },
          modelName: "Condition Status",
        },
        {
          source:
            "patient.interactions.conditionoccurrence.attributes.conditionstatusconceptcode",
          ordered: false,
          cached: true,
          useRefText: true,
          useRefValue: true,
          category: true,
          measure: false,
          filtercard: {
            initial: false,
            visible: true,
            order: 13,
          },
          patientlist: {
            initial: false,
            visible: true,
            linkColumn: false,
          },
          modelName: "Condition Status concept code",
        },
        {
          source:
            "patient.interactions.conditionoccurrence.attributes.conditionstatusconceptset",
          ordered: false,
          cached: true,
          useRefText: false,
          useRefValue: false,
          category: false,
          measure: false,
          filtercard: {
            initial: false,
            visible: true,
            order: 14,
          },
          patientlist: {
            initial: false,
            visible: false,
            linkColumn: false,
          },
          modelName: "Condition Status concept set",
        },
        {
          source: "patient.interactions.conditionoccurrence.attributes.pid",
          ordered: false,
          cached: true,
          useRefText: false,
          useRefValue: false,
          category: true,
          measure: false,
          filtercard: {
            initial: false,
            visible: true,
            order: 15,
          },
          patientlist: {
            initial: false,
            visible: true,
            linkColumn: false,
          },
          modelName: "Patient Id",
        },
        {
          source:
            "patient.interactions.conditionoccurrence.attributes.startdate",
          ordered: false,
          cached: true,
          useRefText: false,
          useRefValue: false,
          category: true,
          measure: false,
          filtercard: {
            initial: false,
            visible: true,
            order: 16,
          },
          patientlist: {
            initial: false,
            visible: true,
            linkColumn: false,
          },
          modelName: "Start Date",
        },
        {
          source: "patient.interactions.conditionoccurrence.attributes.enddate",
          ordered: false,
          cached: true,
          useRefText: false,
          useRefValue: false,
          category: true,
          measure: false,
          filtercard: {
            initial: false,
            visible: true,
            order: 17,
          },
          patientlist: {
            initial: false,
            visible: true,
            linkColumn: false,
          },
          modelName: "End Date",
        },
        {
          source:
            "patient.interactions.conditionoccurrence.attributes.visitoccurrenceid",
          ordered: false,
          cached: true,
          useRefText: false,
          useRefValue: false,
          category: true,
          measure: false,
          filtercard: {
            initial: false,
            visible: true,
            order: 18,
          },
          patientlist: {
            initial: false,
            visible: true,
            linkColumn: false,
          },
          modelName: "Visit Occurrence Id",
        },
        {
          source:
            "patient.interactions.conditionoccurrence.attributes.conditiontypeconceptid",
          ordered: false,
          cached: true,
          useRefText: false,
          useRefValue: false,
          category: true,
          measure: false,
          filtercard: {
            initial: false,
            visible: true,
            order: 19,
          },
          patientlist: {
            initial: false,
            visible: true,
            linkColumn: false,
          },
          modelName: "Condition Type concept id",
        },
        {
          source:
            "patient.interactions.conditionoccurrence.attributes.conditionsourceconceptid",
          ordered: false,
          cached: true,
          useRefText: false,
          useRefValue: false,
          category: true,
          measure: false,
          filtercard: {
            initial: false,
            visible: true,
            order: 20,
          },
          patientlist: {
            initial: false,
            visible: true,
            linkColumn: false,
          },
          modelName: "Condition Source concept id",
        },
        {
          source:
            "patient.interactions.conditionoccurrence.attributes.conditionstatusconceptid",
          ordered: false,
          cached: true,
          useRefText: false,
          useRefValue: false,
          category: true,
          measure: false,
          filtercard: {
            initial: false,
            visible: true,
            order: 21,
          },
          patientlist: {
            initial: false,
            visible: true,
            linkColumn: false,
          },
          modelName: "Condition Status concept id",
        },
      ],
      initialPatientlistColumn: false,
      modelName: "Condition Occurrence",
    },
    {
      source: "patient.interactions.visit",
      visible: true,
      order: 3,
      initial: false,
      attributes: [
        {
          source: "patient.interactions.visit.attributes.visitid",
          ordered: false,
          cached: true,
          useRefText: false,
          useRefValue: false,
          category: true,
          measure: false,
          filtercard: {
            initial: false,
            visible: true,
            order: 1,
          },
          patientlist: {
            initial: false,
            visible: true,
            linkColumn: false,
          },
          modelName: "Visit occurrence Id",
        },
        {
          source: "patient.interactions.visit.attributes.visitconceptid",
          ordered: false,
          cached: true,
          useRefText: true,
          useRefValue: true,
          category: true,
          measure: false,
          filtercard: {
            initial: false,
            visible: true,
            order: 2,
          },
          patientlist: {
            initial: false,
            visible: true,
            linkColumn: false,
          },
          modelName: "Visit concept Id",
        },
        {
          source: "patient.interactions.visit.attributes.visitconceptset",
          ordered: false,
          cached: true,
          useRefText: false,
          useRefValue: false,
          category: false,
          measure: false,
          filtercard: {
            initial: true,
            visible: true,
            order: 3,
          },
          patientlist: {
            initial: false,
            visible: true,
            linkColumn: false,
          },
          modelName: "Visit concept set",
        },
        {
          source: "patient.interactions.visit.attributes.visitconceptcode",
          ordered: false,
          cached: true,
          useRefText: true,
          useRefValue: true,
          category: true,
          measure: false,
          filtercard: {
            initial: false,
            visible: true,
            order: 4,
          },
          patientlist: {
            initial: false,
            visible: true,
            linkColumn: false,
          },
          modelName: "Visit concept code",
        },
        {
          source: "patient.interactions.visit.attributes.visitname",
          ordered: false,
          cached: true,
          useRefText: false,
          useRefValue: true,
          category: true,
          measure: false,
          filtercard: {
            initial: false,
            visible: true,
            order: 5,
          },
          patientlist: {
            initial: true,
            visible: true,
            linkColumn: false,
          },
          modelName: "Visit name",
        },
        {
          source: "patient.interactions.visit.attributes.visittype",
          ordered: false,
          cached: true,
          useRefText: false,
          useRefValue: true,
          category: true,
          measure: false,
          filtercard: {
            initial: false,
            visible: true,
            order: 6,
          },
          patientlist: {
            initial: true,
            visible: true,
            linkColumn: false,
          },
          modelName: "Visit type",
        },
        {
          source: "patient.interactions.visit.attributes.visittypeconceptcode",
          ordered: false,
          cached: true,
          useRefText: true,
          useRefValue: true,
          category: true,
          measure: false,
          filtercard: {
            initial: true,
            visible: true,
            order: 7,
          },
          patientlist: {
            initial: false,
            visible: true,
            linkColumn: false,
          },
          modelName: "Visit type concept code",
        },
        {
          source: "patient.interactions.visit.attributes.visittypeconceptset",
          ordered: false,
          cached: true,
          useRefText: false,
          useRefValue: false,
          category: false,
          measure: false,
          filtercard: {
            initial: false,
            visible: true,
            order: 8,
          },
          patientlist: {
            initial: false,
            visible: false,
            linkColumn: false,
          },
          modelName: "Visit type concept set",
        },
        {
          source: "patient.interactions.visit.attributes.pid",
          ordered: false,
          cached: true,
          useRefText: false,
          useRefValue: false,
          category: true,
          measure: false,
          filtercard: {
            initial: false,
            visible: true,
            order: 9,
          },
          patientlist: {
            initial: false,
            visible: true,
            linkColumn: false,
          },
          modelName: "Patient Id",
        },
        {
          source: "patient.interactions.visit.attributes.startdate",
          ordered: false,
          cached: true,
          useRefText: false,
          useRefValue: false,
          category: true,
          measure: false,
          filtercard: {
            initial: false,
            visible: true,
            order: 10,
          },
          patientlist: {
            initial: true,
            visible: true,
            linkColumn: false,
          },
          modelName: "Start Date",
        },
        {
          source: "patient.interactions.visit.attributes.enddate",
          ordered: false,
          cached: true,
          useRefText: false,
          useRefValue: false,
          category: true,
          measure: false,
          filtercard: {
            initial: false,
            visible: true,
            order: 11,
          },
          patientlist: {
            initial: true,
            visible: true,
            linkColumn: false,
          },
          modelName: "End Date",
        },
        {
          source: "patient.interactions.visit.attributes.visittypeconceptid",
          ordered: false,
          cached: true,
          useRefText: false,
          useRefValue: false,
          category: true,
          measure: false,
          filtercard: {
            initial: false,
            visible: true,
            order: 12,
          },
          patientlist: {
            initial: false,
            visible: true,
            linkColumn: false,
          },
          modelName: "Visit type concept id",
        },
      ],
      initialPatientlistColumn: false,
      modelName: "Visit",
    },
    {
      source: "patient.interactions.questionnaire",
      visible: true,
      order: 4,
      initial: false,
      attributes: [
        {
          source: "patient.interactions.questionnaire.attributes.linkID",
          ordered: false,
          cached: true,
          useRefText: false,
          useRefValue: false,
          category: true,
          measure: false,
          filtercard: {
            initial: false,
            visible: true,
            order: 1,
          },
          patientlist: {
            initial: false,
            visible: true,
            linkColumn: false,
          },
          modelName: "Link ID",
        },
        {
          source:
            "patient.interactions.questionnaire.attributes.valueCodingValue",
          ordered: false,
          cached: true,
          useRefText: false,
          useRefValue: false,
          category: true,
          measure: false,
          filtercard: {
            initial: false,
            visible: true,
            order: 2,
          },
          patientlist: {
            initial: false,
            visible: true,
            linkColumn: false,
          },
          modelName: "Value coding value",
        },
        {
          source: "patient.interactions.questionnaire.attributes.valueType",
          ordered: false,
          cached: true,
          useRefText: false,
          useRefValue: false,
          category: true,
          measure: false,
          filtercard: {
            initial: false,
            visible: true,
            order: 3,
          },
          patientlist: {
            initial: true,
            visible: true,
            linkColumn: false,
          },
          modelName: "Value type",
        },
        {
          source: "patient.interactions.questionnaire.attributes.value",
          ordered: false,
          cached: true,
          useRefText: false,
          useRefValue: false,
          category: true,
          measure: false,
          filtercard: {
            initial: false,
            visible: true,
            order: 4,
          },
          patientlist: {
            initial: true,
            visible: true,
            linkColumn: false,
          },
          modelName: "Value",
        },
        {
          source: "patient.interactions.questionnaire.attributes.recordID",
          ordered: false,
          cached: true,
          useRefText: false,
          useRefValue: false,
          category: true,
          measure: false,
          filtercard: {
            initial: false,
            visible: true,
            order: 5,
          },
          patientlist: {
            initial: false,
            visible: true,
            linkColumn: false,
          },
          modelName: "Record ID",
        },
        {
          source:
            "patient.interactions.questionnaire.attributes.questionnaireLanguage",
          ordered: false,
          cached: true,
          useRefText: false,
          useRefValue: false,
          category: true,
          measure: false,
          filtercard: {
            initial: true,
            visible: true,
            order: 6,
          },
          patientlist: {
            initial: true,
            visible: true,
            linkColumn: false,
          },
          modelName: "Questionnaire language",
        },
        {
          source:
            "patient.interactions.questionnaire.attributes.questionnaireStatus",
          ordered: false,
          cached: true,
          useRefText: false,
          useRefValue: false,
          category: true,
          measure: false,
          filtercard: {
            initial: true,
            visible: true,
            order: 7,
          },
          patientlist: {
            initial: true,
            visible: true,
            linkColumn: false,
          },
          modelName: "Questionnaire status",
        },
        {
          source:
            "patient.interactions.questionnaire.attributes.questionnaireAuthored",
          ordered: false,
          cached: true,
          useRefText: false,
          useRefValue: false,
          category: true,
          measure: false,
          filtercard: {
            initial: false,
            visible: true,
            order: 8,
          },
          patientlist: {
            initial: false,
            visible: true,
            linkColumn: false,
          },
          modelName: "Questionnaire authored",
        },
        {
          source: "patient.interactions.questionnaire.attributes.text",
          ordered: false,
          cached: true,
          useRefText: false,
          useRefValue: false,
          category: true,
          measure: false,
          filtercard: {
            initial: false,
            visible: true,
            order: 9,
          },
          patientlist: {
            initial: false,
            visible: true,
            linkColumn: false,
          },
          modelName: "Text",
        },
        {
          source:
            "patient.interactions.questionnaire.attributes.questionnaireReference",
          ordered: false,
          cached: true,
          useRefText: false,
          useRefValue: false,
          category: true,
          measure: false,
          filtercard: {
            initial: false,
            visible: true,
            order: 10,
          },
          patientlist: {
            initial: false,
            visible: true,
            linkColumn: false,
          },
          modelName: "Questionnaire reference",
        },
        {
          source:
            "patient.interactions.questionnaire.attributes.questionnaireVersion",
          ordered: false,
          cached: true,
          useRefText: false,
          useRefValue: false,
          category: true,
          measure: false,
          filtercard: {
            initial: false,
            visible: true,
            order: 11,
          },
          patientlist: {
            initial: true,
            visible: true,
            linkColumn: false,
          },
          modelName: "Questionnaire version",
        },
      ],
      initialPatientlistColumn: false,
      modelName: "Questionnaire",
    },
    {
      source: "patient.interactions.specimen",
      visible: true,
      order: 5,
      initial: false,
      attributes: [
        {
          source: "patient.interactions.specimen.attributes.specimendate",
          ordered: false,
          cached: true,
          useRefText: false,
          useRefValue: false,
          category: true,
          measure: false,
          filtercard: {
            initial: false,
            visible: true,
            order: 1,
          },
          patientlist: {
            initial: false,
            visible: true,
            linkColumn: false,
          },
          modelName: "Specimen Date",
        },
        {
          source: "patient.interactions.specimen.attributes.specimendatetime",
          ordered: false,
          cached: true,
          useRefText: false,
          useRefValue: false,
          category: true,
          measure: false,
          filtercard: {
            initial: false,
            visible: true,
            order: 2,
          },
          patientlist: {
            initial: false,
            visible: true,
            linkColumn: false,
          },
          modelName: "Specimen Date/Time",
        },
        {
          source: "patient.interactions.specimen.attributes.quantity",
          ordered: true,
          cached: true,
          useRefText: false,
          useRefValue: false,
          category: true,
          measure: true,
          filtercard: {
            initial: true,
            visible: true,
            order: 3,
          },
          patientlist: {
            initial: true,
            visible: true,
            linkColumn: false,
          },
          modelName: "Quantity",
        },
        {
          source: "patient.interactions.specimen.attributes.unit",
          ordered: false,
          cached: true,
          useRefText: false,
          useRefValue: true,
          category: true,
          measure: false,
          filtercard: {
            initial: false,
            visible: true,
            order: 4,
          },
          patientlist: {
            initial: true,
            visible: true,
            linkColumn: false,
          },
          modelName: "Unit",
        },
        {
          source: "patient.interactions.specimen.attributes.unitconceptid",
          ordered: false,
          cached: true,
          useRefText: true,
          useRefValue: true,
          category: true,
          measure: false,
          filtercard: {
            initial: false,
            visible: true,
            order: 5,
          },
          patientlist: {
            initial: false,
            visible: true,
            linkColumn: false,
          },
          modelName: "Unit concept id",
        },
        {
          source: "patient.interactions.specimen.attributes.unitconceptset",
          ordered: false,
          cached: true,
          useRefText: false,
          useRefValue: false,
          category: false,
          measure: false,
          filtercard: {
            initial: true,
            visible: true,
            order: 6,
          },
          patientlist: {
            initial: false,
            visible: true,
            linkColumn: false,
          },
          modelName: "Unit concept set",
        },
        {
          source: "patient.interactions.specimen.attributes.unitconceptcode",
          ordered: false,
          cached: true,
          useRefText: true,
          useRefValue: true,
          category: true,
          measure: false,
          filtercard: {
            initial: false,
            visible: true,
            order: 7,
          },
          patientlist: {
            initial: false,
            visible: true,
            linkColumn: false,
          },
          modelName: "Unit concept code",
        },
        {
          source: "patient.interactions.specimen.attributes.specimenid",
          ordered: false,
          cached: true,
          useRefText: false,
          useRefValue: false,
          category: true,
          measure: false,
          filtercard: {
            initial: false,
            visible: true,
            order: 8,
          },
          patientlist: {
            initial: false,
            visible: true,
            linkColumn: false,
          },
          modelName: "Specimen Id",
        },
        {
          source: "patient.interactions.specimen.attributes.specimenconceptid",
          ordered: false,
          cached: true,
          useRefText: true,
          useRefValue: true,
          category: true,
          measure: false,
          filtercard: {
            initial: false,
            visible: true,
            order: 9,
          },
          patientlist: {
            initial: false,
            visible: true,
            linkColumn: false,
          },
          modelName: "Specimen concept id",
        },
        {
          source: "patient.interactions.specimen.attributes.specimenconceptset",
          ordered: false,
          cached: true,
          useRefText: false,
          useRefValue: false,
          category: false,
          measure: false,
          filtercard: {
            initial: true,
            visible: true,
            order: 10,
          },
          patientlist: {
            initial: false,
            visible: true,
            linkColumn: false,
          },
          modelName: "Specimen concept set",
        },
        {
          source:
            "patient.interactions.specimen.attributes.specimenconceptcode",
          ordered: false,
          cached: true,
          useRefText: true,
          useRefValue: true,
          category: true,
          measure: false,
          filtercard: {
            initial: false,
            visible: true,
            order: 11,
          },
          patientlist: {
            initial: false,
            visible: true,
            linkColumn: false,
          },
          modelName: "Specimen concept code",
        },
        {
          source: "patient.interactions.specimen.attributes.pid",
          ordered: false,
          cached: true,
          useRefText: false,
          useRefValue: false,
          category: true,
          measure: false,
          filtercard: {
            initial: false,
            visible: true,
            order: 12,
          },
          patientlist: {
            initial: false,
            visible: true,
            linkColumn: false,
          },
          modelName: "Patient Id",
        },
        {
          source: "patient.interactions.specimen.attributes.anatomicsite",
          ordered: false,
          cached: true,
          useRefText: false,
          useRefValue: true,
          category: true,
          measure: false,
          filtercard: {
            initial: false,
            visible: true,
            order: 13,
          },
          patientlist: {
            initial: true,
            visible: true,
            linkColumn: false,
          },
          modelName: "Anatomic site",
        },
        {
          source:
            "patient.interactions.specimen.attributes.anatomicsiteconceptid",
          ordered: false,
          cached: true,
          useRefText: true,
          useRefValue: true,
          category: true,
          measure: false,
          filtercard: {
            initial: false,
            visible: true,
            order: 14,
          },
          patientlist: {
            initial: false,
            visible: true,
            linkColumn: false,
          },
          modelName: "Anatomic site concept id",
        },
        {
          source:
            "patient.interactions.specimen.attributes.anatomicsiteconceptset",
          ordered: false,
          cached: true,
          useRefText: false,
          useRefValue: false,
          category: false,
          measure: false,
          filtercard: {
            initial: true,
            visible: true,
            order: 15,
          },
          patientlist: {
            initial: false,
            visible: true,
            linkColumn: false,
          },
          modelName: "Anatomic site concept set",
        },
        {
          source:
            "patient.interactions.specimen.attributes.anatomicsiteconceptcode",
          ordered: false,
          cached: true,
          useRefText: true,
          useRefValue: true,
          category: true,
          measure: false,
          filtercard: {
            initial: false,
            visible: true,
            order: 16,
          },
          patientlist: {
            initial: false,
            visible: true,
            linkColumn: false,
          },
          modelName: "Anatomic site concept code",
        },
        {
          source: "patient.interactions.specimen.attributes.specimenname",
          ordered: false,
          cached: true,
          useRefText: false,
          useRefValue: true,
          category: true,
          measure: false,
          filtercard: {
            initial: false,
            visible: true,
            order: 17,
          },
          patientlist: {
            initial: true,
            visible: true,
            linkColumn: false,
          },
          modelName: "Specimen name",
        },
        {
          source: "patient.interactions.specimen.attributes.diseasestatus",
          ordered: false,
          cached: true,
          useRefText: false,
          useRefValue: true,
          category: true,
          measure: false,
          filtercard: {
            initial: false,
            visible: true,
            order: 18,
          },
          patientlist: {
            initial: true,
            visible: true,
            linkColumn: false,
          },
          modelName: "Disease status",
        },
        {
          source:
            "patient.interactions.specimen.attributes.diseasestatusconceptid",
          ordered: false,
          cached: true,
          useRefText: true,
          useRefValue: true,
          category: true,
          measure: false,
          filtercard: {
            initial: false,
            visible: true,
            order: 19,
          },
          patientlist: {
            initial: false,
            visible: true,
            linkColumn: false,
          },
          modelName: "Disease status concept id",
        },
        {
          source:
            "patient.interactions.specimen.attributes.diseasestatusconceptset",
          ordered: false,
          cached: true,
          useRefText: false,
          useRefValue: false,
          category: false,
          measure: false,
          filtercard: {
            initial: false,
            visible: true,
            order: 20,
          },
          patientlist: {
            initial: false,
            visible: false,
            linkColumn: false,
          },
          modelName: "Disease status concept set",
        },
        {
          source:
            "patient.interactions.specimen.attributes.diseasestatusconceptcode",
          ordered: false,
          cached: true,
          useRefText: true,
          useRefValue: true,
          category: true,
          measure: false,
          filtercard: {
            initial: false,
            visible: true,
            order: 21,
          },
          patientlist: {
            initial: false,
            visible: true,
            linkColumn: false,
          },
          modelName: "Disease status concept code",
        },
        {
          source: "patient.interactions.specimen.attributes.specimentype",
          ordered: false,
          cached: true,
          useRefText: false,
          useRefValue: true,
          category: true,
          measure: false,
          filtercard: {
            initial: false,
            visible: true,
            order: 22,
          },
          patientlist: {
            initial: true,
            visible: true,
            linkColumn: false,
          },
          modelName: "Specimen type",
        },
        {
          source:
            "patient.interactions.specimen.attributes.specimentypeconceptid",
          ordered: false,
          cached: true,
          useRefText: true,
          useRefValue: true,
          category: true,
          measure: false,
          filtercard: {
            initial: false,
            visible: true,
            order: 23,
          },
          patientlist: {
            initial: false,
            visible: true,
            linkColumn: false,
          },
          modelName: "Specimen type concept id",
        },
        {
          source:
            "patient.interactions.specimen.attributes.specimentypeconceptset",
          ordered: false,
          cached: true,
          useRefText: false,
          useRefValue: false,
          category: false,
          measure: false,
          filtercard: {
            initial: false,
            visible: true,
            order: 24,
          },
          patientlist: {
            initial: false,
            visible: false,
            linkColumn: false,
          },
          modelName: "Specimen type concept set",
        },
        {
          source:
            "patient.interactions.specimen.attributes.specimentypeconceptcode",
          ordered: false,
          cached: true,
          useRefText: true,
          useRefValue: true,
          category: true,
          measure: false,
          filtercard: {
            initial: false,
            visible: true,
            order: 25,
          },
          patientlist: {
            initial: false,
            visible: true,
            linkColumn: false,
          },
          modelName: "Specimen type concept code",
        },
      ],
      initialPatientlistColumn: false,
      modelName: "Specimen",
    },
    {
      source: "patient.interactions.proc",
      visible: true,
      order: 6,
      initial: false,
      attributes: [
        {
          source: "patient.interactions.proc.attributes.proctype",
          ordered: false,
          cached: true,
          useRefText: true,
          useRefValue: true,
          category: true,
          measure: false,
          filtercard: {
            initial: false,
            visible: true,
            order: 1,
          },
          patientlist: {
            initial: true,
            visible: true,
            linkColumn: false,
          },
          modelName: "Procedure type",
        },
        {
          source: "patient.interactions.proc.attributes.proctypeconceptid",
          ordered: false,
          cached: true,
          useRefText: true,
          useRefValue: true,
          category: true,
          measure: false,
          filtercard: {
            initial: false,
            visible: true,
            order: 2,
          },
          patientlist: {
            initial: false,
            visible: true,
            linkColumn: false,
          },
          modelName: "Procedure type concept id",
        },
        {
          source: "patient.interactions.proc.attributes.proctypeconceptset",
          ordered: false,
          cached: true,
          useRefText: false,
          useRefValue: false,
          category: false,
          measure: false,
          filtercard: {
            initial: true,
            visible: true,
            order: 3,
          },
          patientlist: {
            initial: false,
            visible: true,
            linkColumn: false,
          },
          modelName: "Procedure type concept set",
        },
        {
          source: "patient.interactions.proc.attributes.proctypeconceptcode",
          ordered: false,
          cached: true,
          useRefText: true,
          useRefValue: true,
          category: true,
          measure: false,
          filtercard: {
            initial: false,
            visible: true,
            order: 4,
          },
          patientlist: {
            initial: false,
            visible: true,
            linkColumn: false,
          },
          modelName: "Procedure type concept code",
        },
        {
          source: "patient.interactions.proc.attributes.pid",
          ordered: false,
          cached: true,
          useRefText: false,
          useRefValue: false,
          category: true,
          measure: false,
          filtercard: {
            initial: false,
            visible: true,
            order: 5,
          },
          patientlist: {
            initial: false,
            visible: true,
            linkColumn: false,
          },
          modelName: "Patient Id",
        },
        {
          source: "patient.interactions.proc.attributes.modifier",
          ordered: false,
          cached: true,
          useRefText: false,
          useRefValue: false,
          category: true,
          measure: false,
          filtercard: {
            initial: false,
            visible: true,
            order: 6,
          },
          patientlist: {
            initial: false,
            visible: true,
            linkColumn: false,
          },
          modelName: "Modifier",
        },
        {
          source: "patient.interactions.proc.attributes.modifierconceptid",
          ordered: false,
          cached: true,
          useRefText: false,
          useRefValue: false,
          category: true,
          measure: false,
          filtercard: {
            initial: false,
            visible: true,
            order: 7,
          },
          patientlist: {
            initial: false,
            visible: true,
            linkColumn: false,
          },
          modelName: "Modifier concept id",
        },
        {
          source: "patient.interactions.proc.attributes.modifierconceptset",
          ordered: false,
          cached: true,
          useRefText: false,
          useRefValue: false,
          category: false,
          measure: false,
          filtercard: {
            initial: false,
            visible: true,
            order: 8,
          },
          patientlist: {
            initial: false,
            visible: false,
            linkColumn: false,
          },
          modelName: "Modifier concept set",
        },
        {
          source: "patient.interactions.proc.attributes.modifierconceptcode",
          ordered: false,
          cached: true,
          useRefText: false,
          useRefValue: false,
          category: true,
          measure: false,
          filtercard: {
            initial: false,
            visible: true,
            order: 9,
          },
          patientlist: {
            initial: false,
            visible: true,
            linkColumn: false,
          },
          modelName: "Modifier concept code",
        },
        {
          source: "patient.interactions.proc.attributes.procname",
          ordered: false,
          cached: true,
          useRefText: true,
          useRefValue: true,
          category: true,
          measure: false,
          filtercard: {
            initial: false,
            visible: true,
            order: 10,
          },
          patientlist: {
            initial: true,
            visible: true,
            linkColumn: false,
          },
          modelName: "Procedure name",
        },
        {
          source: "patient.interactions.proc.attributes.qty",
          ordered: true,
          cached: true,
          useRefText: false,
          useRefValue: false,
          category: true,
          measure: true,
          filtercard: {
            initial: false,
            visible: true,
            order: 11,
          },
          patientlist: {
            initial: true,
            visible: true,
            linkColumn: false,
          },
          modelName: "Quantity",
        },
        {
          source: "patient.interactions.proc.attributes.procdate",
          ordered: false,
          cached: true,
          useRefText: false,
          useRefValue: false,
          category: true,
          measure: false,
          filtercard: {
            initial: false,
            visible: true,
            order: 12,
          },
          patientlist: {
            initial: false,
            visible: true,
            linkColumn: false,
          },
          modelName: "Procedure Date",
        },
        {
          source: "patient.interactions.proc.attributes.procconceptid",
          ordered: false,
          cached: true,
          useRefText: false,
          useRefValue: false,
          category: true,
          measure: false,
          filtercard: {
            initial: false,
            visible: true,
            order: 13,
          },
          patientlist: {
            initial: false,
            visible: true,
            linkColumn: false,
          },
          modelName: "Procedure Occurrence Id",
        },
        {
          source: "patient.interactions.proc.attributes.procconceptset",
          ordered: false,
          cached: true,
          useRefText: false,
          useRefValue: false,
          category: false,
          measure: false,
          filtercard: {
            initial: true,
            visible: true,
            order: 14,
          },
          patientlist: {
            initial: false,
            visible: true,
            linkColumn: false,
          },
          modelName: "Procedure Occurrence Concept Set",
        },
        {
          source: "patient.interactions.proc.attributes.procconceptcode",
          ordered: false,
          cached: true,
          useRefText: true,
          useRefValue: true,
          category: true,
          measure: false,
          filtercard: {
            initial: false,
            visible: true,
            order: 15,
          },
          patientlist: {
            initial: false,
            visible: true,
            linkColumn: false,
          },
          modelName: "Procedure concept code",
        },
        {
          source: "patient.interactions.proc.attributes.procdatetime",
          ordered: false,
          cached: true,
          useRefText: false,
          useRefValue: false,
          category: true,
          measure: false,
          filtercard: {
            initial: false,
            visible: true,
            order: 16,
          },
          patientlist: {
            initial: false,
            visible: true,
            linkColumn: false,
          },
          modelName: "Procedure Date/Time",
        },
      ],
      initialPatientlistColumn: false,
      modelName: "Procedure Occurrence",
    },
    {
      source: "patient.interactions.ppperiod",
      visible: true,
      order: 7,
      initial: false,
      attributes: [
        {
          source: "patient.interactions.ppperiod.attributes.ppperiodid",
          ordered: false,
          cached: true,
          useRefText: false,
          useRefValue: false,
          category: true,
          measure: false,
          filtercard: {
            initial: false,
            visible: true,
            order: 1,
          },
          patientlist: {
            initial: true,
            visible: true,
            linkColumn: false,
          },
          modelName: "Payer Plan Period Id",
        },
        {
          source: "patient.interactions.ppperiod.attributes.pid",
          ordered: false,
          cached: true,
          useRefText: false,
          useRefValue: false,
          category: true,
          measure: false,
          filtercard: {
            initial: true,
            visible: true,
            order: 2,
          },
          patientlist: {
            initial: false,
            visible: true,
            linkColumn: false,
          },
          modelName: "Patient Id",
        },
        {
          source: "patient.interactions.ppperiod.attributes.startdate",
          ordered: false,
          cached: true,
          useRefText: false,
          useRefValue: false,
          category: true,
          measure: false,
          filtercard: {
            initial: false,
            visible: true,
            order: 3,
          },
          patientlist: {
            initial: true,
            visible: true,
            linkColumn: false,
          },
          modelName: "Start Date",
        },
        {
          source: "patient.interactions.ppperiod.attributes.enddate",
          ordered: false,
          cached: true,
          useRefText: false,
          useRefValue: false,
          category: true,
          measure: false,
          filtercard: {
            initial: false,
            visible: true,
            order: 4,
          },
          patientlist: {
            initial: false,
            visible: true,
            linkColumn: false,
          },
          modelName: "End Date",
        },
      ],
      initialPatientlistColumn: false,
      modelName: "Payer Plan Period",
    },
    {
      source: "patient.interactions.obsperiod",
      visible: true,
      order: 8,
      initial: false,
      attributes: [
        {
          source: "patient.interactions.obsperiod.attributes.obsperiodid",
          ordered: false,
          cached: true,
          useRefText: false,
          useRefValue: false,
          category: true,
          measure: false,
          filtercard: {
            initial: false,
            visible: true,
            order: 1,
          },
          patientlist: {
            initial: false,
            visible: true,
            linkColumn: false,
          },
          modelName: "Observation period Id",
        },
        {
          source:
            "patient.interactions.obsperiod.attributes.periodtypeconceptcode",
          ordered: false,
          cached: true,
          useRefText: true,
          useRefValue: true,
          category: true,
          measure: false,
          filtercard: {
            initial: false,
            visible: true,
            order: 2,
          },
          patientlist: {
            initial: false,
            visible: true,
            linkColumn: false,
          },
          modelName: "Observation period type concept code",
        },
        {
          source: "patient.interactions.obsperiod.attributes.periodtype",
          ordered: false,
          cached: true,
          useRefText: false,
          useRefValue: true,
          category: true,
          measure: false,
          filtercard: {
            initial: false,
            visible: true,
            order: 3,
          },
          patientlist: {
            initial: true,
            visible: true,
            linkColumn: false,
          },
          modelName: "Period type",
        },
        {
          source:
            "patient.interactions.obsperiod.attributes.periodtypeconceptid",
          ordered: false,
          cached: true,
          useRefText: true,
          useRefValue: true,
          category: true,
          measure: false,
          filtercard: {
            initial: false,
            visible: true,
            order: 4,
          },
          patientlist: {
            initial: false,
            visible: true,
            linkColumn: false,
          },
          modelName: "Period type concept id",
        },
        {
          source:
            "patient.interactions.obsperiod.attributes.periodtypeconceptset",
          ordered: false,
          cached: true,
          useRefText: false,
          useRefValue: false,
          category: false,
          measure: false,
          filtercard: {
            initial: true,
            visible: true,
            order: 5,
          },
          patientlist: {
            initial: false,
            visible: true,
            linkColumn: false,
          },
          modelName: "Period type concept set",
        },
        {
          source: "patient.interactions.obsperiod.attributes.pid",
          ordered: false,
          cached: true,
          useRefText: false,
          useRefValue: false,
          category: true,
          measure: false,
          filtercard: {
            initial: true,
            visible: true,
            order: 6,
          },
          patientlist: {
            initial: false,
            visible: true,
            linkColumn: false,
          },
          modelName: "Patient Id",
        },
        {
          source: "patient.interactions.obsperiod.attributes.startdate",
          ordered: false,
          cached: true,
          useRefText: false,
          useRefValue: false,
          category: true,
          measure: false,
          filtercard: {
            initial: false,
            visible: true,
            order: 7,
          },
          patientlist: {
            initial: false,
            visible: true,
            linkColumn: false,
          },
          modelName: "Start Date",
        },
        {
          source: "patient.interactions.obsperiod.attributes.enddate",
          ordered: false,
          cached: true,
          useRefText: false,
          useRefValue: false,
          category: true,
          measure: false,
          filtercard: {
            initial: false,
            visible: true,
            order: 8,
          },
          patientlist: {
            initial: false,
            visible: true,
            linkColumn: false,
          },
          modelName: "End Date",
        },
      ],
      initialPatientlistColumn: false,
      modelName: "Observation Period",
    },
    {
      source: "patient.interactions.observation",
      visible: true,
      order: 9,
      initial: false,
      attributes: [
        {
          source: "patient.interactions.observation.attributes.obstype",
          ordered: false,
          cached: true,
          useRefText: false,
          useRefValue: true,
          category: true,
          measure: false,
          filtercard: {
            initial: false,
            visible: true,
            order: 1,
          },
          patientlist: {
            initial: true,
            visible: true,
            linkColumn: false,
          },
          modelName: "Observation type",
        },
        {
          source:
            "patient.interactions.observation.attributes.observationtypeconceptid",
          ordered: false,
          cached: true,
          useRefText: true,
          useRefValue: true,
          category: true,
          measure: false,
          filtercard: {
            initial: false,
            visible: true,
            order: 2,
          },
          patientlist: {
            initial: false,
            visible: true,
            linkColumn: false,
          },
          modelName: "Observation type concept id",
        },
        {
          source:
            "patient.interactions.observation.attributes.observationtypeconceptset",
          ordered: false,
          cached: true,
          useRefText: false,
          useRefValue: false,
          category: false,
          measure: false,
          filtercard: {
            initial: true,
            visible: true,
            order: 3,
          },
          patientlist: {
            initial: false,
            visible: true,
            linkColumn: false,
          },
          modelName: "Observation type concept set",
        },
        {
          source:
            "patient.interactions.observation.attributes.obstypeconceptcode",
          ordered: false,
          cached: true,
          useRefText: true,
          useRefValue: true,
          category: true,
          measure: false,
          filtercard: {
            initial: false,
            visible: true,
            order: 4,
          },
          patientlist: {
            initial: false,
            visible: true,
            linkColumn: false,
          },
          modelName: "Observation type concept code",
        },
        {
          source: "patient.interactions.observation.attributes.numval",
          ordered: true,
          cached: true,
          useRefText: false,
          useRefValue: false,
          category: true,
          measure: true,
          filtercard: {
            initial: false,
            visible: true,
            order: 5,
          },
          patientlist: {
            initial: false,
            visible: true,
            linkColumn: false,
          },
          modelName: "Value (numeric)",
        },
        {
          source:
            "patient.interactions.observation.attributes.valueasconceptcode",
          ordered: false,
          cached: true,
          useRefText: false,
          useRefValue: false,
          category: true,
          measure: false,
          filtercard: {
            initial: false,
            visible: true,
            order: 6,
          },
          patientlist: {
            initial: false,
            visible: true,
            linkColumn: false,
          },
          modelName: "Value as concept code",
        },
        {
          source:
            "patient.interactions.observation.attributes.valueasconceptid",
          ordered: false,
          cached: true,
          useRefText: false,
          useRefValue: false,
          category: true,
          measure: false,
          filtercard: {
            initial: false,
            visible: true,
            order: 7,
          },
          patientlist: {
            initial: false,
            visible: true,
            linkColumn: false,
          },
          modelName: "Value as concept id",
        },
        {
          source:
            "patient.interactions.observation.attributes.valueasconceptset",
          ordered: false,
          cached: true,
          useRefText: false,
          useRefValue: false,
          category: false,
          measure: false,
          filtercard: {
            initial: false,
            visible: true,
            order: 8,
          },
          patientlist: {
            initial: false,
            visible: false,
            linkColumn: false,
          },
          modelName: "Value as concept set",
        },
        {
          source: "patient.interactions.observation.attributes.verbatimtext",
          ordered: false,
          cached: true,
          useRefText: false,
          useRefValue: false,
          category: true,
          measure: false,
          filtercard: {
            initial: false,
            visible: true,
            order: 9,
          },
          patientlist: {
            initial: true,
            visible: true,
            linkColumn: false,
          },
          modelName: "Value (verbatim)",
        },
        {
          source: "patient.interactions.observation.attributes.textval",
          ordered: false,
          cached: true,
          useRefText: false,
          useRefValue: false,
          category: true,
          measure: false,
          filtercard: {
            initial: false,
            visible: true,
            order: 10,
          },
          patientlist: {
            initial: true,
            visible: true,
            linkColumn: false,
          },
          modelName: "Value (text)",
        },
        {
          source: "patient.interactions.observation.attributes.qualifier",
          ordered: false,
          cached: true,
          useRefText: false,
          useRefValue: true,
          category: true,
          measure: false,
          filtercard: {
            initial: false,
            visible: true,
            order: 11,
          },
          patientlist: {
            initial: false,
            visible: true,
            linkColumn: false,
          },
          modelName: "Qualifier",
        },
        {
          source:
            "patient.interactions.observation.attributes.qualifierconceptid",
          ordered: false,
          cached: true,
          useRefText: true,
          useRefValue: true,
          category: true,
          measure: false,
          filtercard: {
            initial: false,
            visible: true,
            order: 12,
          },
          patientlist: {
            initial: false,
            visible: true,
            linkColumn: false,
          },
          modelName: "Qualifier concept id",
        },
        {
          source:
            "patient.interactions.observation.attributes.qualifierconceptset",
          ordered: false,
          cached: true,
          useRefText: false,
          useRefValue: false,
          category: false,
          measure: false,
          filtercard: {
            initial: false,
            visible: true,
            order: 13,
          },
          patientlist: {
            initial: false,
            visible: false,
            linkColumn: false,
          },
          modelName: "Qualifier concept set",
        },
        {
          source:
            "patient.interactions.observation.attributes.qualifierconceptcode",
          ordered: false,
          cached: true,
          useRefText: true,
          useRefValue: true,
          category: true,
          measure: false,
          filtercard: {
            initial: false,
            visible: true,
            order: 14,
          },
          patientlist: {
            initial: false,
            visible: true,
            linkColumn: false,
          },
          modelName: "Qualifier concept code",
        },
        {
          source: "patient.interactions.observation.attributes.obsname",
          ordered: false,
          cached: true,
          useRefText: false,
          useRefValue: true,
          category: true,
          measure: false,
          filtercard: {
            initial: false,
            visible: true,
            order: 15,
          },
          patientlist: {
            initial: true,
            visible: true,
            linkColumn: false,
          },
          modelName: "Observation Name",
        },
        {
          source: "patient.interactions.observation.attributes.observationid",
          ordered: false,
          cached: true,
          useRefText: false,
          useRefValue: false,
          category: true,
          measure: false,
          filtercard: {
            initial: false,
            visible: true,
            order: 16,
          },
          patientlist: {
            initial: false,
            visible: true,
            linkColumn: false,
          },
          modelName: "Observation Id",
        },
        {
          source: "patient.interactions.observation.attributes.obsconceptcode",
          ordered: false,
          cached: true,
          useRefText: true,
          useRefValue: true,
          category: true,
          measure: false,
          filtercard: {
            initial: false,
            visible: true,
            order: 17,
          },
          patientlist: {
            initial: false,
            visible: true,
            linkColumn: false,
          },
          modelName: "Observation concept code",
        },
        {
          source: "patient.interactions.observation.attributes.obsconceptset",
          ordered: false,
          cached: true,
          useRefText: false,
          useRefValue: false,
          category: false,
          measure: false,
          filtercard: {
            initial: true,
            visible: true,
            order: 18,
          },
          patientlist: {
            initial: false,
            visible: true,
            linkColumn: false,
          },
          modelName: "Observation concept set",
        },
        {
          source: "patient.interactions.observation.attributes.obsdate",
          ordered: false,
          cached: true,
          useRefText: false,
          useRefValue: false,
          category: true,
          measure: false,
          filtercard: {
            initial: false,
            visible: true,
            order: 19,
          },
          patientlist: {
            initial: false,
            visible: true,
            linkColumn: false,
          },
          modelName: "Observation Date",
        },
        {
          source: "patient.interactions.observation.attributes.pid",
          ordered: false,
          cached: true,
          useRefText: false,
          useRefValue: false,
          category: true,
          measure: false,
          filtercard: {
            initial: false,
            visible: true,
            order: 20,
          },
          patientlist: {
            initial: false,
            visible: true,
            linkColumn: false,
          },
          modelName: "Patient Id",
        },
        {
          source: "patient.interactions.observation.attributes.obsdatetime",
          ordered: false,
          cached: true,
          useRefText: false,
          useRefValue: false,
          category: true,
          measure: false,
          filtercard: {
            initial: false,
            visible: true,
            order: 21,
          },
          patientlist: {
            initial: false,
            visible: true,
            linkColumn: false,
          },
          modelName: "Observation Date/Time",
        },
        {
          source: "patient.interactions.observation.attributes.unit",
          ordered: false,
          cached: true,
          useRefText: false,
          useRefValue: true,
          category: true,
          measure: false,
          filtercard: {
            initial: false,
            visible: true,
            order: 22,
          },
          patientlist: {
            initial: true,
            visible: true,
            linkColumn: false,
          },
          modelName: "Unit",
        },
        {
          source: "patient.interactions.observation.attributes.unitconceptid",
          ordered: false,
          cached: true,
          useRefText: true,
          useRefValue: true,
          category: true,
          measure: false,
          filtercard: {
            initial: false,
            visible: true,
            order: 23,
          },
          patientlist: {
            initial: false,
            visible: true,
            linkColumn: false,
          },
          modelName: "Unit concept id",
        },
        {
          source: "patient.interactions.observation.attributes.unitconceptset",
          ordered: false,
          cached: true,
          useRefText: false,
          useRefValue: false,
          category: false,
          measure: false,
          filtercard: {
            initial: true,
            visible: true,
            order: 24,
          },
          patientlist: {
            initial: false,
            visible: true,
            linkColumn: false,
          },
          modelName: "Unit concept set",
        },
        {
          source: "patient.interactions.observation.attributes.unitconceptcode",
          ordered: false,
          cached: true,
          useRefText: true,
          useRefValue: true,
          category: true,
          measure: false,
          filtercard: {
            initial: false,
            visible: true,
            order: 25,
          },
          patientlist: {
            initial: false,
            visible: true,
            linkColumn: false,
          },
          modelName: "Unit concept code",
        },
        {
          source: "patient.interactions.observation.attributes.obsconceptid",
          ordered: false,
          cached: true,
          useRefText: false,
          useRefValue: false,
          category: true,
          measure: false,
          filtercard: {
            initial: false,
            visible: true,
            order: 26,
          },
          patientlist: {
            initial: false,
            visible: true,
            linkColumn: false,
          },
          modelName: "Observation concept id",
        },
      ],
      initialPatientlistColumn: false,
      modelName: "Observation",
    },
    {
      source: "patient.interactions.measurement",
      visible: true,
      order: 10,
      initial: false,
      attributes: [
        {
          source: "patient.interactions.measurement.attributes.unitconceptcode",
          ordered: false,
          cached: true,
          useRefText: false,
          useRefValue: false,
          category: true,
          measure: false,
          filtercard: {
            initial: false,
            visible: true,
            order: 1,
          },
          patientlist: {
            initial: false,
            visible: true,
            linkColumn: false,
          },
          modelName: "Unit concept code",
        },
        {
          source: "patient.interactions.measurement.attributes.unitconceptset",
          ordered: false,
          cached: true,
          useRefText: false,
          useRefValue: false,
          category: false,
          measure: false,
          filtercard: {
            initial: false,
            visible: true,
            order: 2,
          },
          patientlist: {
            initial: false,
            visible: false,
            linkColumn: false,
          },
          modelName: "Unit concept set",
        },
        {
          source: "patient.interactions.measurement.attributes.textval",
          ordered: false,
          cached: true,
          useRefText: false,
          useRefValue: false,
          category: true,
          measure: false,
          filtercard: {
            initial: false,
            visible: true,
            order: 3,
          },
          patientlist: {
            initial: true,
            visible: true,
            linkColumn: false,
          },
          modelName: "Value (text)",
        },
        {
          source:
            "patient.interactions.measurement.attributes.valueasconceptcode",
          ordered: false,
          cached: true,
          useRefText: false,
          useRefValue: false,
          category: true,
          measure: false,
          filtercard: {
            initial: false,
            visible: true,
            order: 4,
          },
          patientlist: {
            initial: false,
            visible: true,
            linkColumn: false,
          },
          modelName: "Value as concept code",
        },
        {
          source:
            "patient.interactions.measurement.attributes.valueasconceptset",
          ordered: false,
          cached: true,
          useRefText: false,
          useRefValue: false,
          category: false,
          measure: false,
          filtercard: {
            initial: false,
            visible: true,
            order: 5,
          },
          patientlist: {
            initial: false,
            visible: false,
            linkColumn: false,
          },
          modelName: "Value as concept set",
        },
        {
          source: "patient.interactions.measurement.attributes.measurementid",
          ordered: false,
          cached: true,
          useRefText: false,
          useRefValue: false,
          category: true,
          measure: false,
          filtercard: {
            initial: false,
            visible: true,
            order: 6,
          },
          patientlist: {
            initial: false,
            visible: true,
            linkColumn: false,
          },
          modelName: "Measurement Id",
        },
        {
          source:
            "patient.interactions.measurement.attributes.measurementconceptid",
          ordered: false,
          cached: true,
          useRefText: true,
          useRefValue: true,
          category: true,
          measure: false,
          filtercard: {
            initial: false,
            visible: true,
            order: 7,
          },
          patientlist: {
            initial: false,
            visible: true,
            linkColumn: false,
          },
          modelName: "Measurement concept id",
        },
        {
          source:
            "patient.interactions.measurement.attributes.measurementconceptset",
          ordered: false,
          cached: true,
          useRefText: false,
          useRefValue: false,
          category: false,
          measure: false,
          filtercard: {
            initial: true,
            visible: true,
            order: 8,
          },
          patientlist: {
            initial: false,
            visible: true,
            linkColumn: false,
          },
          modelName: "Measurement concept set",
        },
        {
          source:
            "patient.interactions.measurement.attributes.measurementconceptcode",
          ordered: false,
          cached: true,
          useRefText: true,
          useRefValue: true,
          category: true,
          measure: false,
          filtercard: {
            initial: false,
            visible: true,
            order: 9,
          },
          patientlist: {
            initial: false,
            visible: true,
            linkColumn: false,
          },
          modelName: "Measurement concept code",
        },
        {
          source: "patient.interactions.measurement.attributes.pid",
          ordered: false,
          cached: true,
          useRefText: false,
          useRefValue: false,
          category: true,
          measure: false,
          filtercard: {
            initial: false,
            visible: true,
            order: 10,
          },
          patientlist: {
            initial: false,
            visible: true,
            linkColumn: false,
          },
          modelName: "Patient Id",
        },
        {
          source: "patient.interactions.measurement.attributes.measurementdate",
          ordered: false,
          cached: true,
          useRefText: false,
          useRefValue: false,
          category: true,
          measure: false,
          filtercard: {
            initial: false,
            visible: true,
            order: 11,
          },
          patientlist: {
            initial: false,
            visible: true,
            linkColumn: false,
          },
          modelName: "Measurement date",
        },
        {
          source: "patient.interactions.measurement.attributes.measurementtype",
          ordered: false,
          cached: true,
          useRefText: false,
          useRefValue: false,
          category: true,
          measure: false,
          filtercard: {
            initial: false,
            visible: true,
            order: 12,
          },
          patientlist: {
            initial: true,
            visible: true,
            linkColumn: false,
          },
          modelName: "Measurement type",
        },
        {
          source:
            "patient.interactions.measurement.attributes.measurementtypeconceptcode",
          ordered: false,
          cached: true,
          useRefText: true,
          useRefValue: true,
          category: true,
          measure: false,
          filtercard: {
            initial: false,
            visible: true,
            order: 13,
          },
          patientlist: {
            initial: false,
            visible: true,
            linkColumn: false,
          },
          modelName: "Measurement type concept code",
        },
        {
          source:
            "patient.interactions.measurement.attributes.measurementtypeconceptset",
          ordered: false,
          cached: true,
          useRefText: false,
          useRefValue: false,
          category: false,
          measure: false,
          filtercard: {
            initial: true,
            visible: true,
            order: 14,
          },
          patientlist: {
            initial: false,
            visible: true,
            linkColumn: false,
          },
          modelName: "Measurement type concept set",
        },
        {
          source: "patient.interactions.measurement.attributes.measurementname",
          ordered: false,
          cached: true,
          useRefText: false,
          useRefValue: true,
          category: true,
          measure: false,
          filtercard: {
            initial: false,
            visible: true,
            order: 15,
          },
          patientlist: {
            initial: true,
            visible: true,
            linkColumn: false,
          },
          modelName: "Measurement name",
        },
        {
          source: "patient.interactions.measurement.attributes.numval",
          ordered: true,
          cached: true,
          useRefText: false,
          useRefValue: false,
          category: true,
          measure: true,
          filtercard: {
            initial: false,
            visible: true,
            order: 16,
          },
          patientlist: {
            initial: true,
            visible: true,
            linkColumn: false,
          },
          modelName: "Value (numeric)",
        },
        {
          source:
            "patient.interactions.measurement.attributes.measurementtypeconceptid",
          ordered: false,
          cached: true,
          useRefText: false,
          useRefValue: false,
          category: true,
          measure: false,
          filtercard: {
            initial: false,
            visible: true,
            order: 17,
          },
          patientlist: {
            initial: false,
            visible: true,
            linkColumn: false,
          },
          modelName: "Measurement type concept id",
        },
        {
          source:
            "patient.interactions.measurement.attributes.valueasconceptid",
          ordered: false,
          cached: true,
          useRefText: false,
          useRefValue: false,
          category: true,
          measure: false,
          filtercard: {
            initial: false,
            visible: true,
            order: 18,
          },
          patientlist: {
            initial: false,
            visible: true,
            linkColumn: false,
          },
          modelName: "Value as concept id",
        },
        {
          source: "patient.interactions.measurement.attributes.unitconceptid",
          ordered: false,
          cached: true,
          useRefText: false,
          useRefValue: false,
          category: true,
          measure: false,
          filtercard: {
            initial: false,
            visible: true,
            order: 19,
          },
          patientlist: {
            initial: false,
            visible: true,
            linkColumn: false,
          },
          modelName: "Unit concept id",
        },
      ],
      initialPatientlistColumn: false,
      modelName: "Measurement",
    },
    {
      source:
        "patient.interactions.Consent_74db26d2_bb75_489a_a841_051c85dc897b",
      visible: true,
      order: 11,
      initial: false,
      attributes: [
        {
          source:
            "patient.interactions.Consent_74db26d2_bb75_489a_a841_051c85dc897b.attributes.New_Attribute_1_3d0da2a3_f0de_4112_b87c_e7aff266c0d8",
          ordered: false,
          cached: true,
          useRefText: false,
          useRefValue: false,
          category: true,
          measure: false,
          filtercard: {
            initial: false,
            visible: true,
            order: 1,
          },
          patientlist: {
            initial: true,
            visible: true,
            linkColumn: false,
          },
          modelName: "Attribute",
        },
        {
          source:
            "patient.interactions.Consent_74db26d2_bb75_489a_a841_051c85dc897b.attributes.Attribute_copy_53f290b7_70e9_4c1e_bd6d_605bc916ce66",
          ordered: false,
          cached: true,
          useRefText: false,
          useRefValue: false,
          category: true,
          measure: false,
          filtercard: {
            initial: false,
            visible: true,
            order: 2,
          },
          patientlist: {
            initial: false,
            visible: true,
            linkColumn: false,
          },
          modelName: "Attribute Group ID",
        },
        {
          source:
            "patient.interactions.Consent_74db26d2_bb75_489a_a841_051c85dc897b.attributes.consentcategory",
          ordered: false,
          cached: true,
          useRefText: false,
          useRefValue: false,
          category: true,
          measure: false,
          filtercard: {
            initial: false,
            visible: true,
            order: 3,
          },
          patientlist: {
            initial: true,
            visible: true,
            linkColumn: false,
          },
          modelName: "Category",
        },
        {
          source:
            "patient.interactions.Consent_74db26d2_bb75_489a_a841_051c85dc897b.attributes.textval",
          ordered: false,
          cached: true,
          useRefText: false,
          useRefValue: false,
          category: true,
          measure: false,
          filtercard: {
            initial: true,
            visible: true,
            order: 4,
          },
          patientlist: {
            initial: true,
            visible: true,
            linkColumn: false,
          },
          modelName: "Value",
        },
        {
          source:
            "patient.interactions.Consent_74db26d2_bb75_489a_a841_051c85dc897b.attributes.status",
          ordered: false,
          cached: true,
          useRefText: false,
          useRefValue: false,
          category: true,
          measure: false,
          filtercard: {
            initial: false,
            visible: true,
            order: 5,
          },
          patientlist: {
            initial: false,
            visible: true,
            linkColumn: false,
          },
          modelName: "Status",
        },
        {
          source:
            "patient.interactions.Consent_74db26d2_bb75_489a_a841_051c85dc897b.attributes.parentconsentdetailid",
          ordered: false,
          cached: true,
          useRefText: false,
          useRefValue: false,
          category: true,
          measure: false,
          filtercard: {
            initial: false,
            visible: true,
            order: 6,
          },
          patientlist: {
            initial: false,
            visible: true,
            linkColumn: false,
          },
          modelName: "Parent Consent Detail Id",
        },
        {
          source:
            "patient.interactions.Consent_74db26d2_bb75_489a_a841_051c85dc897b.attributes.Consent_Id_copy_60a4adeb_1e84_4f04_b7d5_8eb1c006f56d",
          ordered: false,
          cached: true,
          useRefText: false,
          useRefValue: false,
          category: true,
          measure: false,
          filtercard: {
            initial: false,
            visible: true,
            order: 7,
          },
          patientlist: {
            initial: false,
            visible: true,
            linkColumn: false,
          },
          modelName: "Consent Detail Id",
        },
        {
          source:
            "patient.interactions.Consent_74db26d2_bb75_489a_a841_051c85dc897b.attributes.pid",
          ordered: false,
          cached: true,
          useRefText: false,
          useRefValue: false,
          category: true,
          measure: false,
          filtercard: {
            initial: false,
            visible: true,
            order: 8,
          },
          patientlist: {
            initial: false,
            visible: true,
            linkColumn: false,
          },
          modelName: "Patient Id",
        },
        {
          source:
            "patient.interactions.Consent_74db26d2_bb75_489a_a841_051c85dc897b.attributes.consentdatetime",
          ordered: false,
          cached: true,
          useRefText: false,
          useRefValue: false,
          category: true,
          measure: false,
          filtercard: {
            initial: true,
            visible: true,
            order: 9,
          },
          patientlist: {
            initial: false,
            visible: true,
            linkColumn: false,
          },
          modelName: "Consent Date/Time",
        },
      ],
      initialPatientlistColumn: false,
      modelName: "Consent",
    },
    {
      source: "patient.interactions.drugexposure",
      visible: true,
      order: 12,
      initial: false,
      attributes: [
        {
          source: "patient.interactions.drugexposure.attributes.dayssupply",
          ordered: true,
          cached: true,
          useRefText: false,
          useRefValue: false,
          category: true,
          measure: true,
          filtercard: {
            initial: false,
            visible: true,
            order: 1,
          },
          patientlist: {
            initial: false,
            visible: true,
            linkColumn: false,
          },
          modelName: "Days of supply",
        },
        {
          source:
            "patient.interactions.drugexposure.attributes.verbatimenddate",
          ordered: false,
          cached: true,
          useRefText: false,
          useRefValue: false,
          category: true,
          measure: false,
          filtercard: {
            initial: false,
            visible: true,
            order: 2,
          },
          patientlist: {
            initial: false,
            visible: true,
            linkColumn: false,
          },
          modelName: "Verbatim End Date",
        },
        {
          source: "patient.interactions.drugexposure.attributes.pid",
          ordered: false,
          cached: true,
          useRefText: false,
          useRefValue: false,
          category: true,
          measure: false,
          filtercard: {
            initial: false,
            visible: true,
            order: 3,
          },
          patientlist: {
            initial: false,
            visible: true,
            linkColumn: false,
          },
          modelName: "Patient Id",
        },
        {
          source: "patient.interactions.drugexposure.attributes.sig",
          ordered: false,
          cached: true,
          useRefText: false,
          useRefValue: false,
          category: true,
          measure: false,
          filtercard: {
            initial: false,
            visible: true,
            order: 4,
          },
          patientlist: {
            initial: false,
            visible: true,
            linkColumn: false,
          },
          modelName: "Sig",
        },
        {
          source: "patient.interactions.drugexposure.attributes.drugexposureid",
          ordered: false,
          cached: true,
          useRefText: false,
          useRefValue: false,
          category: true,
          measure: false,
          filtercard: {
            initial: false,
            visible: true,
            order: 5,
          },
          patientlist: {
            initial: false,
            visible: true,
            linkColumn: false,
          },
          modelName: "Drug Exposure Id",
        },
        {
          source: "patient.interactions.drugexposure.attributes.drugconceptid",
          ordered: false,
          cached: true,
          useRefText: true,
          useRefValue: true,
          category: true,
          measure: false,
          filtercard: {
            initial: false,
            visible: true,
            order: 6,
          },
          patientlist: {
            initial: false,
            visible: true,
            linkColumn: false,
          },
          modelName: "Drug concept id",
        },
        {
          source: "patient.interactions.drugexposure.attributes.drugconceptset",
          ordered: false,
          cached: true,
          useRefText: false,
          useRefValue: false,
          category: false,
          measure: false,
          filtercard: {
            initial: true,
            visible: true,
            order: 7,
          },
          patientlist: {
            initial: false,
            visible: true,
            linkColumn: false,
          },
          modelName: "Drug concept set",
        },
        {
          source:
            "patient.interactions.drugexposure.attributes.drugconceptcode",
          ordered: false,
          cached: true,
          useRefText: true,
          useRefValue: true,
          category: true,
          measure: false,
          filtercard: {
            initial: false,
            visible: true,
            order: 8,
          },
          patientlist: {
            initial: false,
            visible: true,
            linkColumn: false,
          },
          modelName: "Drug concept code",
        },
        {
          source: "patient.interactions.drugexposure.attributes.routename",
          ordered: false,
          cached: true,
          useRefText: false,
          useRefValue: true,
          category: true,
          measure: false,
          filtercard: {
            initial: false,
            visible: true,
            order: 9,
          },
          patientlist: {
            initial: true,
            visible: true,
            linkColumn: false,
          },
          modelName: "Route Name",
        },
        {
          source: "patient.interactions.drugexposure.attributes.routeconceptid",
          ordered: false,
          cached: true,
          useRefText: true,
          useRefValue: true,
          category: true,
          measure: false,
          filtercard: {
            initial: false,
            visible: true,
            order: 10,
          },
          patientlist: {
            initial: false,
            visible: true,
            linkColumn: false,
          },
          modelName: "Route concept id",
        },
        {
          source:
            "patient.interactions.drugexposure.attributes.routeconceptset",
          ordered: false,
          cached: true,
          useRefText: false,
          useRefValue: false,
          category: false,
          measure: false,
          filtercard: {
            initial: false,
            visible: true,
            order: 11,
          },
          patientlist: {
            initial: false,
            visible: false,
            linkColumn: false,
          },
          modelName: "Route concept set",
        },
        {
          source:
            "patient.interactions.drugexposure.attributes.routeconceptcode",
          ordered: false,
          cached: true,
          useRefText: true,
          useRefValue: true,
          category: true,
          measure: false,
          filtercard: {
            initial: false,
            visible: true,
            order: 12,
          },
          patientlist: {
            initial: false,
            visible: true,
            linkColumn: false,
          },
          modelName: "Route concept code",
        },
        {
          source: "patient.interactions.drugexposure.attributes.lotnumber",
          ordered: false,
          cached: true,
          useRefText: false,
          useRefValue: false,
          category: true,
          measure: false,
          filtercard: {
            initial: false,
            visible: true,
            order: 13,
          },
          patientlist: {
            initial: false,
            visible: true,
            linkColumn: false,
          },
          modelName: "Lot Number",
        },
        {
          source: "patient.interactions.drugexposure.attributes.drugname",
          ordered: false,
          cached: true,
          useRefText: false,
          useRefValue: true,
          category: true,
          measure: false,
          filtercard: {
            initial: false,
            visible: true,
            order: 14,
          },
          patientlist: {
            initial: true,
            visible: true,
            linkColumn: false,
          },
          modelName: "Drug Name",
        },
        {
          source: "patient.interactions.drugexposure.attributes.startdate",
          ordered: false,
          cached: true,
          useRefText: false,
          useRefValue: false,
          category: true,
          measure: false,
          filtercard: {
            initial: false,
            visible: true,
            order: 15,
          },
          patientlist: {
            initial: false,
            visible: true,
            linkColumn: false,
          },
          modelName: "Start Date",
        },
        {
          source: "patient.interactions.drugexposure.attributes.drugtype",
          ordered: false,
          cached: true,
          useRefText: false,
          useRefValue: true,
          category: true,
          measure: false,
          filtercard: {
            initial: false,
            visible: true,
            order: 16,
          },
          patientlist: {
            initial: true,
            visible: true,
            linkColumn: false,
          },
          modelName: "Drug Type",
        },
        {
          source:
            "patient.interactions.drugexposure.attributes.drugtypeconceptid",
          ordered: false,
          cached: true,
          useRefText: true,
          useRefValue: true,
          category: true,
          measure: false,
          filtercard: {
            initial: false,
            visible: true,
            order: 17,
          },
          patientlist: {
            initial: false,
            visible: true,
            linkColumn: false,
          },
          modelName: "Drug type concept id",
        },
        {
          source:
            "patient.interactions.drugexposure.attributes.drugtypeconceptset",
          ordered: false,
          cached: true,
          useRefText: false,
          useRefValue: false,
          category: false,
          measure: false,
          filtercard: {
            initial: true,
            visible: true,
            order: 18,
          },
          patientlist: {
            initial: false,
            visible: true,
            linkColumn: false,
          },
          modelName: "Drug type concept set",
        },
        {
          source:
            "patient.interactions.drugexposure.attributes.drugtypeconceptcode",
          ordered: false,
          cached: true,
          useRefText: true,
          useRefValue: true,
          category: true,
          measure: false,
          filtercard: {
            initial: false,
            visible: true,
            order: 19,
          },
          patientlist: {
            initial: false,
            visible: true,
            linkColumn: false,
          },
          modelName: "Drug Type concept code",
        },
        {
          source: "patient.interactions.drugexposure.attributes.enddate",
          ordered: false,
          cached: true,
          useRefText: false,
          useRefValue: false,
          category: true,
          measure: false,
          filtercard: {
            initial: false,
            visible: true,
            order: 20,
          },
          patientlist: {
            initial: false,
            visible: true,
            linkColumn: false,
          },
          modelName: "End Date",
        },
        {
          source: "patient.interactions.drugexposure.attributes.stopreason",
          ordered: false,
          cached: true,
          useRefText: false,
          useRefValue: false,
          category: true,
          measure: false,
          filtercard: {
            initial: true,
            visible: true,
            order: 21,
          },
          patientlist: {
            initial: true,
            visible: true,
            linkColumn: false,
          },
          modelName: "Stop Reason",
        },
        {
          source: "patient.interactions.drugexposure.attributes.startdatetime",
          ordered: false,
          cached: true,
          useRefText: false,
          useRefValue: false,
          category: true,
          measure: false,
          filtercard: {
            initial: false,
            visible: true,
            order: 22,
          },
          patientlist: {
            initial: false,
            visible: true,
            linkColumn: false,
          },
          modelName: "Start Date/Time",
        },
        {
          source: "patient.interactions.drugexposure.attributes.refills",
          ordered: true,
          cached: true,
          useRefText: false,
          useRefValue: false,
          category: true,
          measure: true,
          filtercard: {
            initial: false,
            visible: true,
            order: 23,
          },
          patientlist: {
            initial: false,
            visible: true,
            linkColumn: false,
          },
          modelName: "Refills",
        },
        {
          source: "patient.interactions.drugexposure.attributes.enddatetime",
          ordered: false,
          cached: true,
          useRefText: false,
          useRefValue: false,
          category: true,
          measure: false,
          filtercard: {
            initial: false,
            visible: true,
            order: 24,
          },
          patientlist: {
            initial: false,
            visible: true,
            linkColumn: false,
          },
          modelName: "End Date/Time",
        },
      ],
      initialPatientlistColumn: false,
      modelName: "Drug Exposure",
    },
    {
      source: "patient.interactions.drugera",
      visible: true,
      order: 13,
      initial: false,
      attributes: [
        {
          source: "patient.interactions.drugera.attributes.drugexpcount",
          ordered: true,
          cached: true,
          useRefText: false,
          useRefValue: false,
          category: true,
          measure: true,
          filtercard: {
            initial: true,
            visible: true,
            order: 1,
          },
          patientlist: {
            initial: true,
            visible: true,
            linkColumn: false,
          },
          modelName: "Drug Exposure Count",
        },
        {
          source: "patient.interactions.drugera.attributes.gapdays",
          ordered: true,
          cached: true,
          useRefText: false,
          useRefValue: false,
          category: true,
          measure: true,
          filtercard: {
            initial: false,
            visible: true,
            order: 2,
          },
          patientlist: {
            initial: true,
            visible: true,
            linkColumn: false,
          },
          modelName: "Gap Days",
        },
        {
          source: "patient.interactions.drugera.attributes.drugeraid",
          ordered: false,
          cached: true,
          useRefText: false,
          useRefValue: false,
          category: true,
          measure: false,
          filtercard: {
            initial: false,
            visible: true,
            order: 3,
          },
          patientlist: {
            initial: false,
            visible: true,
            linkColumn: false,
          },
          modelName: "Drug Era Id",
        },
        {
          source: "patient.interactions.drugera.attributes.drugconceptcode",
          ordered: false,
          cached: true,
          useRefText: true,
          useRefValue: true,
          category: true,
          measure: false,
          filtercard: {
            initial: false,
            visible: true,
            order: 4,
          },
          patientlist: {
            initial: false,
            visible: true,
            linkColumn: false,
          },
          modelName: "Drug concept code",
        },
        {
          source: "patient.interactions.drugera.attributes.drugconceptset",
          ordered: false,
          cached: true,
          useRefText: false,
          useRefValue: false,
          category: false,
          measure: false,
          filtercard: {
            initial: true,
            visible: true,
            order: 5,
          },
          patientlist: {
            initial: false,
            visible: true,
            linkColumn: false,
          },
          modelName: "Drug concept set",
        },
        {
          source: "patient.interactions.drugera.attributes.pid",
          ordered: false,
          cached: true,
          useRefText: false,
          useRefValue: false,
          category: true,
          measure: false,
          filtercard: {
            initial: false,
            visible: true,
            order: 6,
          },
          patientlist: {
            initial: false,
            visible: true,
            linkColumn: false,
          },
          modelName: "Patient Id",
        },
        {
          source: "patient.interactions.drugera.attributes.drugname",
          ordered: false,
          cached: true,
          useRefText: false,
          useRefValue: true,
          category: true,
          measure: false,
          filtercard: {
            initial: false,
            visible: true,
            order: 7,
          },
          patientlist: {
            initial: true,
            visible: true,
            linkColumn: false,
          },
          modelName: "Drug Name",
        },
        {
          source: "patient.interactions.drugera.attributes.startdate",
          ordered: false,
          cached: true,
          useRefText: false,
          useRefValue: false,
          category: true,
          measure: false,
          filtercard: {
            initial: false,
            visible: true,
            order: 8,
          },
          patientlist: {
            initial: false,
            visible: true,
            linkColumn: false,
          },
          modelName: "Start Date",
        },
        {
          source: "patient.interactions.drugera.attributes.enddate",
          ordered: false,
          cached: true,
          useRefText: false,
          useRefValue: false,
          category: true,
          measure: false,
          filtercard: {
            initial: false,
            visible: true,
            order: 9,
          },
          patientlist: {
            initial: false,
            visible: true,
            linkColumn: false,
          },
          modelName: "End Date",
        },
        {
          source: "patient.interactions.drugera.attributes.drugconceptid",
          ordered: false,
          cached: true,
          useRefText: false,
          useRefValue: false,
          category: true,
          measure: false,
          filtercard: {
            initial: false,
            visible: true,
            order: 10,
          },
          patientlist: {
            initial: false,
            visible: true,
            linkColumn: false,
          },
          modelName: "Drug concept id",
        },
      ],
      initialPatientlistColumn: false,
      modelName: "Drug Era",
    },
    {
      source: "patient.interactions.doseera",
      visible: true,
      order: 14,
      initial: false,
      attributes: [
        {
          source: "patient.interactions.doseera.attributes.doseeraid",
          ordered: false,
          cached: true,
          useRefText: false,
          useRefValue: false,
          category: true,
          measure: false,
          filtercard: {
            initial: false,
            visible: true,
            order: 1,
          },
          patientlist: {
            initial: false,
            visible: true,
            linkColumn: false,
          },
          modelName: "Dose Era Id",
        },
        {
          source: "patient.interactions.doseera.attributes.drugconceptcode",
          ordered: false,
          cached: true,
          useRefText: true,
          useRefValue: true,
          category: true,
          measure: false,
          filtercard: {
            initial: false,
            visible: true,
            order: 2,
          },
          patientlist: {
            initial: false,
            visible: true,
            linkColumn: false,
          },
          modelName: "Drug concept code",
        },
        {
          source: "patient.interactions.doseera.attributes.drugconceptset",
          ordered: false,
          cached: true,
          useRefText: false,
          useRefValue: false,
          category: false,
          measure: false,
          filtercard: {
            initial: true,
            visible: true,
            order: 3,
          },
          patientlist: {
            initial: false,
            visible: true,
            linkColumn: false,
          },
          modelName: "Drug concept set",
        },
        {
          source: "patient.interactions.doseera.attributes.dosevalue",
          ordered: true,
          cached: true,
          useRefText: false,
          useRefValue: false,
          category: true,
          measure: true,
          filtercard: {
            initial: true,
            visible: true,
            order: 4,
          },
          patientlist: {
            initial: true,
            visible: true,
            linkColumn: false,
          },
          modelName: "Dose Value",
        },
        {
          source: "patient.interactions.doseera.attributes.startdate",
          ordered: false,
          cached: true,
          useRefText: false,
          useRefValue: false,
          category: true,
          measure: false,
          filtercard: {
            initial: false,
            visible: true,
            order: 5,
          },
          patientlist: {
            initial: false,
            visible: true,
            linkColumn: false,
          },
          modelName: "Start Date",
        },
        {
          source: "patient.interactions.doseera.attributes.enddate",
          ordered: false,
          cached: true,
          useRefText: false,
          useRefValue: false,
          category: true,
          measure: false,
          filtercard: {
            initial: false,
            visible: true,
            order: 6,
          },
          patientlist: {
            initial: false,
            visible: true,
            linkColumn: false,
          },
          modelName: "End Date",
        },
        {
          source: "patient.interactions.doseera.attributes.pid",
          ordered: false,
          cached: true,
          useRefText: false,
          useRefValue: false,
          category: true,
          measure: false,
          filtercard: {
            initial: false,
            visible: true,
            order: 7,
          },
          patientlist: {
            initial: false,
            visible: true,
            linkColumn: false,
          },
          modelName: "Patient Id",
        },
        {
          source: "patient.interactions.doseera.attributes.drug",
          ordered: false,
          cached: true,
          useRefText: false,
          useRefValue: true,
          category: true,
          measure: false,
          filtercard: {
            initial: false,
            visible: true,
            order: 8,
          },
          patientlist: {
            initial: true,
            visible: true,
            linkColumn: false,
          },
          modelName: "Drug",
        },
        {
          source: "patient.interactions.doseera.attributes.unitname",
          ordered: false,
          cached: true,
          useRefText: false,
          useRefValue: true,
          category: true,
          measure: false,
          filtercard: {
            initial: false,
            visible: true,
            order: 9,
          },
          patientlist: {
            initial: true,
            visible: true,
            linkColumn: false,
          },
          modelName: "Unit",
        },
        {
          source: "patient.interactions.doseera.attributes.unitconceptcode",
          ordered: false,
          cached: true,
          useRefText: true,
          useRefValue: true,
          category: true,
          measure: false,
          filtercard: {
            initial: false,
            visible: true,
            order: 10,
          },
          patientlist: {
            initial: false,
            visible: true,
            linkColumn: false,
          },
          modelName: "Unit concept code",
        },
        {
          source: "patient.interactions.doseera.attributes.unitconceptset",
          ordered: false,
          cached: true,
          useRefText: false,
          useRefValue: false,
          category: false,
          measure: false,
          filtercard: {
            initial: true,
            visible: true,
            order: 11,
          },
          patientlist: {
            initial: false,
            visible: true,
            linkColumn: false,
          },
          modelName: "Unit concept set",
        },
        {
          source: "patient.interactions.doseera.attributes.drugconceptid",
          ordered: false,
          cached: true,
          useRefText: false,
          useRefValue: false,
          category: true,
          measure: false,
          filtercard: {
            initial: false,
            visible: true,
            order: 12,
          },
          patientlist: {
            initial: false,
            visible: true,
            linkColumn: false,
          },
          modelName: "Drug concept id",
        },
        {
          source: "patient.interactions.doseera.attributes.unitconceptid",
          ordered: false,
          cached: true,
          useRefText: false,
          useRefValue: false,
          category: true,
          measure: false,
          filtercard: {
            initial: false,
            visible: true,
            order: 13,
          },
          patientlist: {
            initial: false,
            visible: true,
            linkColumn: false,
          },
          modelName: "Unit concept id",
        },
      ],
      initialPatientlistColumn: false,
      modelName: "Dose Era",
    },
    {
      source: "patient.interactions.deviceexposure",
      visible: true,
      order: 15,
      initial: false,
      attributes: [
        {
          source:
            "patient.interactions.deviceexposure.attributes.devicetypename",
          ordered: false,
          cached: true,
          useRefText: false,
          useRefValue: true,
          category: true,
          measure: false,
          filtercard: {
            initial: false,
            visible: true,
            order: 1,
          },
          patientlist: {
            initial: true,
            visible: true,
            linkColumn: false,
          },
          modelName: "Device Type",
        },
        {
          source:
            "patient.interactions.deviceexposure.attributes.devicetypeconceptcode",
          ordered: false,
          cached: true,
          useRefText: true,
          useRefValue: true,
          category: true,
          measure: false,
          filtercard: {
            initial: false,
            visible: true,
            order: 2,
          },
          patientlist: {
            initial: false,
            visible: true,
            linkColumn: false,
          },
          modelName: "Device Type concept code",
        },
        {
          source:
            "patient.interactions.deviceexposure.attributes.devicetypeconceptset",
          ordered: false,
          cached: true,
          useRefText: false,
          useRefValue: false,
          category: false,
          measure: false,
          filtercard: {
            initial: true,
            visible: true,
            order: 3,
          },
          patientlist: {
            initial: false,
            visible: true,
            linkColumn: false,
          },
          modelName: "Device Type concept set",
        },
        {
          source:
            "patient.interactions.deviceexposure.attributes.deviceconceptcode",
          ordered: false,
          cached: true,
          useRefText: true,
          useRefValue: true,
          category: true,
          measure: false,
          filtercard: {
            initial: false,
            visible: true,
            order: 4,
          },
          patientlist: {
            initial: false,
            visible: true,
            linkColumn: false,
          },
          modelName: "Device concept code",
        },
        {
          source:
            "patient.interactions.deviceexposure.attributes.deviceexposureid",
          ordered: false,
          cached: true,
          useRefText: false,
          useRefValue: false,
          category: true,
          measure: false,
          filtercard: {
            initial: false,
            visible: true,
            order: 5,
          },
          patientlist: {
            initial: false,
            visible: true,
            linkColumn: false,
          },
          modelName: "Device Exposure Id",
        },
        {
          source: "patient.interactions.deviceexposure.attributes.pid",
          ordered: false,
          cached: true,
          useRefText: false,
          useRefValue: false,
          category: true,
          measure: false,
          filtercard: {
            initial: false,
            visible: true,
            order: 6,
          },
          patientlist: {
            initial: false,
            visible: true,
            linkColumn: false,
          },
          modelName: "Patient Id",
        },
        {
          source: "patient.interactions.deviceexposure.attributes.devicename",
          ordered: false,
          cached: true,
          useRefText: false,
          useRefValue: true,
          category: true,
          measure: false,
          filtercard: {
            initial: false,
            visible: true,
            order: 7,
          },
          patientlist: {
            initial: true,
            visible: true,
            linkColumn: false,
          },
          modelName: "Device Name",
        },
        {
          source:
            "patient.interactions.deviceexposure.attributes.deviceconceptid",
          ordered: false,
          cached: true,
          useRefText: true,
          useRefValue: true,
          category: true,
          measure: false,
          filtercard: {
            initial: false,
            visible: true,
            order: 8,
          },
          patientlist: {
            initial: false,
            visible: true,
            linkColumn: false,
          },
          modelName: "Device concept id",
        },
        {
          source:
            "patient.interactions.deviceexposure.attributes.deviceconceptset",
          ordered: false,
          cached: true,
          useRefText: false,
          useRefValue: false,
          category: false,
          measure: false,
          filtercard: {
            initial: true,
            visible: true,
            order: 9,
          },
          patientlist: {
            initial: false,
            visible: true,
            linkColumn: false,
          },
          modelName: "Device concept set",
        },
        {
          source: "patient.interactions.deviceexposure.attributes.startdate",
          ordered: false,
          cached: true,
          useRefText: false,
          useRefValue: false,
          category: true,
          measure: false,
          filtercard: {
            initial: false,
            visible: true,
            order: 10,
          },
          patientlist: {
            initial: false,
            visible: true,
            linkColumn: false,
          },
          modelName: "Start Date",
        },
        {
          source: "patient.interactions.deviceexposure.attributes.enddate",
          ordered: false,
          cached: true,
          useRefText: false,
          useRefValue: false,
          category: true,
          measure: false,
          filtercard: {
            initial: false,
            visible: true,
            order: 11,
          },
          patientlist: {
            initial: false,
            visible: true,
            linkColumn: false,
          },
          modelName: "End Date",
        },
        {
          source:
            "patient.interactions.deviceexposure.attributes.devicetypeconceptid",
          ordered: false,
          cached: true,
          useRefText: false,
          useRefValue: false,
          category: true,
          measure: false,
          filtercard: {
            initial: false,
            visible: true,
            order: 12,
          },
          patientlist: {
            initial: false,
            visible: true,
            linkColumn: false,
          },
          modelName: "Device Type concept id",
        },
      ],
      initialPatientlistColumn: false,
      modelName: "Device Exposure",
    },
    {
      source: "patient.interactions.death",
      visible: true,
      order: 16,
      initial: false,
      attributes: [
        {
          source: "patient.interactions.death.attributes.deathdate",
          ordered: false,
          cached: true,
          useRefText: false,
          useRefValue: false,
          category: true,
          measure: false,
          filtercard: {
            initial: true,
            visible: true,
            order: 1,
          },
          patientlist: {
            initial: true,
            visible: true,
            linkColumn: false,
          },
          modelName: "Death Date",
        },
        {
          source: "patient.interactions.death.attributes.deathdatetime",
          ordered: false,
          cached: true,
          useRefText: false,
          useRefValue: false,
          category: true,
          measure: false,
          filtercard: {
            initial: false,
            visible: true,
            order: 2,
          },
          patientlist: {
            initial: false,
            visible: true,
            linkColumn: false,
          },
          modelName: "Death Date/Time",
        },
        {
          source: "patient.interactions.death.attributes.pid",
          ordered: false,
          cached: true,
          useRefText: false,
          useRefValue: false,
          category: true,
          measure: false,
          filtercard: {
            initial: false,
            visible: true,
            order: 3,
          },
          patientlist: {
            initial: false,
            visible: true,
            linkColumn: false,
          },
          modelName: "Patient Id",
        },
        {
          source: "patient.interactions.death.attributes.deathtypeconceptcode",
          ordered: false,
          cached: true,
          useRefText: true,
          useRefValue: true,
          category: true,
          measure: false,
          filtercard: {
            initial: false,
            visible: true,
            order: 4,
          },
          patientlist: {
            initial: false,
            visible: true,
            linkColumn: false,
          },
          modelName: "Death Type concept code",
        },
        {
          source: "patient.interactions.death.attributes.deathtypeconceptset",
          ordered: false,
          cached: true,
          useRefText: false,
          useRefValue: false,
          category: false,
          measure: false,
          filtercard: {
            initial: true,
            visible: true,
            order: 5,
          },
          patientlist: {
            initial: false,
            visible: true,
            linkColumn: false,
          },
          modelName: "Death Type concept set",
        },
        {
          source: "patient.interactions.death.attributes.deathtype",
          ordered: false,
          cached: true,
          useRefText: false,
          useRefValue: true,
          category: true,
          measure: false,
          filtercard: {
            initial: false,
            visible: true,
            order: 6,
          },
          patientlist: {
            initial: true,
            visible: true,
            linkColumn: false,
          },
          modelName: "Death Type",
        },
        {
          source: "patient.interactions.death.attributes.deathtypeconceptid",
          ordered: false,
          cached: true,
          useRefText: false,
          useRefValue: false,
          category: true,
          measure: false,
          filtercard: {
            initial: false,
            visible: true,
            order: 7,
          },
          patientlist: {
            initial: false,
            visible: true,
            linkColumn: false,
          },
          modelName: "Death Type concept id",
        },
      ],
      initialPatientlistColumn: false,
      modelName: "Death",
    },
    {
      source: "patient.interactions.conditionera",
      visible: true,
      order: 17,
      initial: false,
      attributes: [
        {
          source: "patient.interactions.conditionera.attributes.conditioneraid",
          ordered: false,
          cached: true,
          useRefText: false,
          useRefValue: false,
          category: true,
          measure: false,
          filtercard: {
            initial: false,
            visible: true,
            order: 1,
          },
          patientlist: {
            initial: false,
            visible: true,
            linkColumn: false,
          },
          modelName: "Condition Era Id",
        },
        {
          source:
            "patient.interactions.conditionera.attributes.conditionconceptid",
          ordered: false,
          cached: true,
          useRefText: true,
          useRefValue: true,
          category: true,
          measure: false,
          filtercard: {
            initial: false,
            visible: true,
            order: 2,
          },
          patientlist: {
            initial: false,
            visible: true,
            linkColumn: false,
          },
          modelName: "Condition concept id",
        },
        {
          source:
            "patient.interactions.conditionera.attributes.condconceptcode",
          ordered: false,
          cached: true,
          useRefText: true,
          useRefValue: true,
          category: true,
          measure: false,
          filtercard: {
            initial: false,
            visible: true,
            order: 3,
          },
          patientlist: {
            initial: false,
            visible: true,
            linkColumn: false,
          },
          modelName: "Condition concept code",
        },
        {
          source:
            "patient.interactions.conditionera.attributes.conditionconceptset",
          ordered: false,
          cached: true,
          useRefText: false,
          useRefValue: false,
          category: false,
          measure: false,
          filtercard: {
            initial: true,
            visible: true,
            order: 4,
          },
          patientlist: {
            initial: false,
            visible: true,
            linkColumn: false,
          },
          modelName: "Condition concept set",
        },
        {
          source: "patient.interactions.conditionera.attributes.pid",
          ordered: false,
          cached: true,
          useRefText: false,
          useRefValue: false,
          category: true,
          measure: false,
          filtercard: {
            initial: false,
            visible: true,
            order: 5,
          },
          patientlist: {
            initial: false,
            visible: true,
            linkColumn: false,
          },
          modelName: "Patient Id",
        },
        {
          source: "patient.interactions.conditionera.attributes.count",
          ordered: true,
          cached: true,
          useRefText: false,
          useRefValue: false,
          category: true,
          measure: true,
          filtercard: {
            initial: false,
            visible: true,
            order: 6,
          },
          patientlist: {
            initial: true,
            visible: true,
            linkColumn: false,
          },
          modelName: "Condition Occurrence Count",
        },
        {
          source: "patient.interactions.conditionera.attributes.enddate",
          ordered: false,
          cached: true,
          useRefText: false,
          useRefValue: false,
          category: true,
          measure: false,
          filtercard: {
            initial: false,
            visible: true,
            order: 7,
          },
          patientlist: {
            initial: false,
            visible: true,
            linkColumn: false,
          },
          modelName: "End Date",
        },
        {
          source: "patient.interactions.conditionera.attributes.startdate",
          ordered: false,
          cached: true,
          useRefText: false,
          useRefValue: false,
          category: true,
          measure: false,
          filtercard: {
            initial: false,
            visible: true,
            order: 8,
          },
          patientlist: {
            initial: false,
            visible: true,
            linkColumn: false,
          },
          modelName: "Start Date",
        },
        {
          source: "patient.interactions.conditionera.attributes.conditionname",
          ordered: false,
          cached: true,
          useRefText: false,
          useRefValue: true,
          category: true,
          measure: false,
          filtercard: {
            initial: false,
            visible: true,
            order: 9,
          },
          patientlist: {
            initial: true,
            visible: true,
            linkColumn: false,
          },
          modelName: "Condition Name",
        },
      ],
      initialPatientlistColumn: false,
      modelName: "Condition Era",
    },
    {
      source: "patient.interactions.ptoken",
      visible: true,
      order: 18,
      initial: false,
      attributes: [
        {
          source: "patient.interactions.ptoken.attributes.participationtokenid",
          ordered: false,
          cached: true,
          useRefText: false,
          useRefValue: false,
          category: true,
          measure: false,
          filtercard: {
            initial: false,
            visible: true,
            order: 1,
          },
          patientlist: {
            initial: false,
            visible: true,
            linkColumn: false,
          },
          modelName: "Participation Token Id",
        },
        {
          source:
            "patient.interactions.ptoken.attributes.participationtokenstudyid",
          ordered: false,
          cached: true,
          useRefText: false,
          useRefValue: false,
          category: true,
          measure: false,
          filtercard: {
            initial: false,
            visible: true,
            order: 2,
          },
          patientlist: {
            initial: false,
            visible: true,
            linkColumn: false,
          },
          modelName: "Participation Token Study Id",
        },
        {
          source:
            "patient.interactions.ptoken.attributes.participationtokenexternalid",
          ordered: false,
          cached: true,
          useRefText: false,
          useRefValue: false,
          category: true,
          measure: false,
          filtercard: {
            initial: false,
            visible: true,
            order: 3,
          },
          patientlist: {
            initial: false,
            visible: true,
            linkColumn: false,
          },
          modelName: "Participation Token External Id",
        },
        {
          source: "patient.interactions.ptoken.attributes.participationtoken",
          ordered: false,
          cached: true,
          useRefText: false,
          useRefValue: false,
          category: true,
          measure: false,
          filtercard: {
            initial: false,
            visible: true,
            order: 4,
          },
          patientlist: {
            initial: true,
            visible: true,
            linkColumn: false,
          },
          modelName: "Participation Token",
        },
        {
          source:
            "patient.interactions.ptoken.attributes.participationtokencreatedby",
          ordered: false,
          cached: true,
          useRefText: false,
          useRefValue: false,
          category: true,
          measure: false,
          filtercard: {
            initial: false,
            visible: true,
            order: 5,
          },
          patientlist: {
            initial: false,
            visible: true,
            linkColumn: false,
          },
          modelName: "Participant Token Created By",
        },
        {
          source:
            "patient.interactions.ptoken.attributes.participanttokencreateddate",
          ordered: false,
          cached: true,
          useRefText: false,
          useRefValue: false,
          category: true,
          measure: false,
          filtercard: {
            initial: true,
            visible: true,
            order: 6,
          },
          patientlist: {
            initial: false,
            visible: true,
            linkColumn: false,
          },
          modelName: "Participant Token Created Date",
        },
        {
          source:
            "patient.interactions.ptoken.attributes.participationtokenmodifiedby",
          ordered: false,
          cached: true,
          useRefText: false,
          useRefValue: false,
          category: true,
          measure: false,
          filtercard: {
            initial: false,
            visible: true,
            order: 7,
          },
          patientlist: {
            initial: false,
            visible: true,
            linkColumn: false,
          },
          modelName: "Participation Token Modified By",
        },
        {
          source:
            "patient.interactions.ptoken.attributes.participationtokenmodifieddate",
          ordered: false,
          cached: true,
          useRefText: false,
          useRefValue: false,
          category: true,
          measure: false,
          filtercard: {
            initial: false,
            visible: true,
            order: 8,
          },
          patientlist: {
            initial: false,
            visible: true,
            linkColumn: false,
          },
          modelName: "Participation Token Modified Date",
        },
        {
          source:
            "patient.interactions.ptoken.attributes.participationtokenstatus",
          ordered: false,
          cached: true,
          useRefText: false,
          useRefValue: false,
          category: true,
          measure: false,
          filtercard: {
            initial: true,
            visible: true,
            order: 9,
          },
          patientlist: {
            initial: true,
            visible: true,
            linkColumn: false,
          },
          modelName: "Participation Token Status",
        },
        {
          source:
            "patient.interactions.ptoken.attributes.participationtokenlastdonationdate",
          ordered: false,
          cached: true,
          useRefText: false,
          useRefValue: false,
          category: true,
          measure: false,
          filtercard: {
            initial: false,
            visible: true,
            order: 10,
          },
          patientlist: {
            initial: false,
            visible: true,
            linkColumn: false,
          },
          modelName: "Participation Token Last Donation Date",
        },
        {
          source:
            "patient.interactions.ptoken.attributes.participationtokenvalidationdate",
          ordered: false,
          cached: true,
          useRefText: false,
          useRefValue: false,
          category: true,
          measure: false,
          filtercard: {
            initial: false,
            visible: true,
            order: 11,
          },
          patientlist: {
            initial: false,
            visible: true,
            linkColumn: false,
          },
          modelName: "Participation Token Validation Date",
        },
        {
          source:
            "patient.interactions.ptoken.attributes.participationtokenpersonid",
          ordered: false,
          cached: true,
          useRefText: false,
          useRefValue: false,
          category: true,
          measure: false,
          filtercard: {
            initial: false,
            visible: true,
            order: 12,
          },
          patientlist: {
            initial: false,
            visible: true,
            linkColumn: false,
          },
          modelName: "Participation Token Person Id",
        },
      ],
      initialPatientlistColumn: false,
      modelName: "Participation Token",
    },
    {
      source: "patient.interactions.cohort",
      visible: true,
      order: 19,
      initial: false,
      attributes: [
        {
          source: "patient.interactions.cohort.attributes.cohortdefinitionid",
          ordered: false,
          cached: true,
          useRefText: false,
          useRefValue: false,
          category: true,
          measure: false,
          filtercard: {
            initial: false,
            visible: true,
            order: 1,
          },
          patientlist: {
            initial: false,
            visible: true,
            linkColumn: false,
          },
          modelName: "Cohort Id",
        },
        {
          source: "patient.interactions.cohort.attributes.pid",
          ordered: false,
          cached: true,
          useRefText: false,
          useRefValue: false,
          category: true,
          measure: false,
          filtercard: {
            initial: false,
            visible: true,
            order: 2,
          },
          patientlist: {
            initial: false,
            visible: true,
            linkColumn: false,
          },
          modelName: "Cohort Patient",
        },
      ],
      initialPatientlistColumn: false,
      modelName: "Cohort",
    },
  ],
  chartOptions: {
    initialAttributes: {
      measures: ["patient.attributes.pcount"],
      categories: ["patient.attributes.Gender"],
    },
    initialChart: "stacked",
    stacked: {
      visible: true,
      pdfDownloadEnabled: true,
      downloadEnabled: true,
      imageDownloadEnabled: true,
      collectionEnabled: true,
      beginVisible: true,
      fillMissingValuesEnabled: true,
    },
    boxplot: {
      visible: true,
      pdfDownloadEnabled: true,
      downloadEnabled: true,
      imageDownloadEnabled: true,
      collectionEnabled: true,
      beginVisible: true,
      fillMissingValuesEnabled: true,
    },
    km: {
      visible: true,
      pdfDownloadEnabled: true,
      downloadEnabled: true,
      imageDownloadEnabled: true,
      collectionEnabled: true,
      beginVisible: true,
      confidenceInterval: 1.95996398454,
      filters: [],
      selectedInteractions: [],
      selectedEndInteractions: [],
    },
    list: {
      visible: true,
      zipDownloadEnabled: true,
      downloadEnabled: true,
      collectionEnabled: true,
      beginVisible: true,
      pageSize: 20,
    },
    vb: {
      visible: true,
      referenceName: "GRCh37",
      enabled: false,
    },
    custom: {
      visible: true,
      customCharts: [],
    },
    sac: {
      visible: false,
      sacCharts: [],
      enabled: false,
    },
    shared: {
      enabled: false,
      systemName: "MRI",
    },
    minCohortSize: 1,
  },
  configInformations: {
    note: "",
  },
  panelOptions: {
    addToCohorts: true,
    domainValuesLimit: 200,
    maxFiltercardCount: 10,
    calcViewAccessPoint: true,
    externalAccessPoints: true
  },
};

const cdwConfigDuckdb = {
  "patient": {
    "conditions": {},
    "interactions": {
        "conditionera": {
            "name": [
                {
                    "lang": "",
                    "value": "Condition Era"
                }
            ],
            "disabledLangName": [
                {
                    "lang": "en",
                    "value": "",
                    "visible": true
                },
                {
                    "lang": "de",
                    "value": "",
                    "visible": true
                },
                {
                    "lang": "fr",
                    "value": "",
                    "visible": true
                },
                {
                    "lang": "es",
                    "value": "",
                    "visible": true
                },
                {
                    "lang": "pt",
                    "value": "",
                    "visible": true
                },
                {
                    "lang": "zh",
                    "value": "",
                    "visible": true
                }
            ],
            "defaultFilter": "1=1",
            "defaultPlaceholder": "@CONDERA",
            "order": 15,
            "parentInteraction": [],
            "parentInteractionLabel": "parent",
            "attributes": {
                "startdate": {
                    "name": [
                        {
                            "lang": "",
                            "value": "Condition Era Start Date"
                        }
                    ],
                    "disabledLangName": [
                        {
                            "lang": "en",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "de",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "fr",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "es",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "pt",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "zh",
                            "value": "",
                            "visible": true
                        }
                    ],
                    "type": "time",
                    "expression": "@CONDERA.\"CONDITION_ERA_START_DATE\"",
                    "order": 1,
                    "domainFilter": "",
                    "standardConceptCodeFilter": ""
                },
                "enddate": {
                    "name": [
                        {
                            "lang": "",
                            "value": "Condition Era End Date"
                        }
                    ],
                    "disabledLangName": [
                        {
                            "lang": "en",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "de",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "fr",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "es",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "pt",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "zh",
                            "value": "",
                            "visible": true
                        }
                    ],
                    "type": "time",
                    "expression": "@CONDERA.\"CONDITION_ERA_END_DATE\"",
                    "order": 2,
                    "domainFilter": "",
                    "standardConceptCodeFilter": ""
                },
                "count": {
                    "name": [
                        {
                            "lang": "",
                            "value": "Condition Occurrence Count"
                        }
                    ],
                    "disabledLangName": [
                        {
                            "lang": "en",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "de",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "fr",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "es",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "pt",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "zh",
                            "value": "",
                            "visible": true
                        }
                    ],
                    "type": "num",
                    "expression": "@CONDERA.\"CONDITION_OCCURRENCE_COUNT\"",
                    "order": 3,
                    "domainFilter": "",
                    "standardConceptCodeFilter": ""
                },
                "pid": {
                    "name": [
                        {
                            "lang": "",
                            "value": "Person id"
                        }
                    ],
                    "disabledLangName": [
                        {
                            "lang": "en",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "de",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "fr",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "es",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "pt",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "zh",
                            "value": "",
                            "visible": true
                        }
                    ],
                    "type": "text",
                    "expression": "@CONDERA.person_id",
                    "order": 4,
                    "domainFilter": "",
                    "standardConceptCodeFilter": ""
                },
                "conditioneraid": {
                    "name": [
                        {
                            "lang": "",
                            "value": "Condition Era Id"
                        }
                    ],
                    "disabledLangName": [
                        {
                            "lang": "en",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "de",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "fr",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "es",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "pt",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "zh",
                            "value": "",
                            "visible": true
                        }
                    ],
                    "type": "text",
                    "expression": "@CONDERA.\"CONDITION_ERA_ID\"",
                    "order": 5,
                    "domainFilter": "",
                    "standardConceptCodeFilter": ""
                },
                "conditionconceptid": {
                    "name": [
                        {
                            "lang": "",
                            "value": "Condition concept id"
                        }
                    ],
                    "disabledLangName": [
                        {
                            "lang": "en",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "de",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "fr",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "es",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "pt",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "zh",
                            "value": "",
                            "visible": true
                        }
                    ],
                    "type": "text",
                    "expression": "@CONDERA.\"CONDITION_CONCEPT_ID\"",
                    "referenceFilter": "@REF.DOMAIN_ID = 'Condition' AND @REF.STANDARD_CONCEPT = 'S' AND JARO_SIMILARITY(CAST(@REF.CONCEPT_ID AS VARCHAR), '@SEARCH_QUERY') >= 0.85",
                    "referenceExpression": "@REF.CONCEPT_ID",
                    "order": 7,
                    "domainFilter": "",
                    "standardConceptCodeFilter": "",
                    "useRefValue": true,
                    "useRefText": true
                },
                "Condition_era_concept_set": {
                    "name": [
                        {
                            "lang": "",
                            "value": "Condition concept set"
                        }
                    ],
                    "disabledLangName": [
                        {
                            "lang": "en",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "de",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "fr",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "es",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "pt",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "zh",
                            "value": "",
                            "visible": true
                        }
                    ],
                    "type": "conceptSet",
                    "expression": "@CONDERA.\"CONDITION_CONCEPT_ID\"",
                    "_referenceFilter": "@REF.DOMAIN_ID = 'Condition' AND @REF.STANDARD_CONCEPT = 'S' AND JARO_SIMILARITY(CAST(@REF.CONCEPT_ID AS VARCHAR), '@SEARCH_QUERY') >= 0.85",
                    "_referenceExpression": "@REF.CONCEPT_ID",
                    "order": 8,
                    "domainFilter": "",
                    "standardConceptCodeFilter": "",
                    "useRefValue": true,
                    "useRefText": true
                }
            }
        },
        "conditionoccurrence": {
            "name": [
                {
                    "lang": "",
                    "value": "Condition Occurrence"
                }
            ],
            "disabledLangName": [
                {
                    "lang": "en",
                    "value": "",
                    "visible": true
                },
                {
                    "lang": "de",
                    "value": "",
                    "visible": true
                },
                {
                    "lang": "fr",
                    "value": "",
                    "visible": true
                },
                {
                    "lang": "es",
                    "value": "",
                    "visible": true
                },
                {
                    "lang": "pt",
                    "value": "",
                    "visible": true
                },
                {
                    "lang": "zh",
                    "value": "",
                    "visible": true
                }
            ],
            "defaultFilter": "1=1",
            "defaultPlaceholder": "@COND",
            "order": 14,
            "parentInteraction": [
                "patient.interactions.visit"
            ],
            "parentInteractionLabel": "Visit Occurrence Parent",
            "attributes": {
                "visitoccurrenceid": {
                    "name": [
                        {
                            "lang": "",
                            "value": "Visit Occurrence Id"
                        }
                    ],
                    "disabledLangName": [
                        {
                            "lang": "en",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "de",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "fr",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "es",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "pt",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "zh",
                            "value": "",
                            "visible": true
                        }
                    ],
                    "type": "text",
                    "expression": "@COND.\"VISIT_OCCURRENCE_ID\"",
                    "order": 1,
                    "domainFilter": "",
                    "standardConceptCodeFilter": ""
                },
                "enddate": {
                    "name": [
                        {
                            "lang": "",
                            "value": "Condition End Date"
                        }
                    ],
                    "disabledLangName": [
                        {
                            "lang": "en",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "de",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "fr",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "es",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "pt",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "zh",
                            "value": "",
                            "visible": true
                        }
                    ],
                    "type": "time",
                    "expression": "@COND.\"CONDITION_END_DATE\"",
                    "order": 2,
                    "domainFilter": "",
                    "standardConceptCodeFilter": ""
                },
                "startdate": {
                    "name": [
                        {
                            "lang": "",
                            "value": "Condition Start Date"
                        }
                    ],
                    "disabledLangName": [
                        {
                            "lang": "en",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "de",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "fr",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "es",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "pt",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "zh",
                            "value": "",
                            "visible": true
                        }
                    ],
                    "type": "time",
                    "expression": "@COND.\"CONDITION_START_DATE\"",
                    "order": 3,
                    "domainFilter": "",
                    "standardConceptCodeFilter": ""
                },
                "pid": {
                    "name": [
                        {
                            "lang": "",
                            "value": "Person id"
                        }
                    ],
                    "disabledLangName": [
                        {
                            "lang": "en",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "de",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "fr",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "es",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "pt",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "zh",
                            "value": "",
                            "visible": true
                        }
                    ],
                    "type": "text",
                    "expression": "@COND.person_id",
                    "order": 4,
                    "domainFilter": "",
                    "standardConceptCodeFilter": ""
                },
                "conditionoccurrenceid": {
                    "name": [
                        {
                            "lang": "",
                            "value": "Condition Occurrence Id"
                        }
                    ],
                    "disabledLangName": [
                        {
                            "lang": "en",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "de",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "fr",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "es",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "pt",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "zh",
                            "value": "",
                            "visible": true
                        }
                    ],
                    "type": "text",
                    "expression": "@COND.\"CONDITION_OCCURRENCE_ID\"",
                    "order": 9,
                    "domainFilter": "",
                    "standardConceptCodeFilter": ""
                },
                "conditiontypeconceptset": {
                    "name": [
                        {
                            "lang": "",
                            "value": "Condition Type concept set"
                        }
                    ],
                    "disabledLangName": [
                        {
                            "lang": "en",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "de",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "fr",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "es",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "pt",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "zh",
                            "value": "",
                            "visible": true
                        }
                    ],
                    "type": "conceptSet",
                    "expression": "@COND.\"CONDITION_TYPE_CONCEPT_ID\"",
                    "order": 12,
                    "domainFilter": "",
                    "standardConceptCodeFilter": "",
                    "useRefValue": true,
                    "useRefText": true
                },
                "conditionsourceconceptset": {
                    "name": [
                        {
                            "lang": "",
                            "value": "Condition Source concept set"
                        }
                    ],
                    "disabledLangName": [
                        {
                            "lang": "en",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "de",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "fr",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "es",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "pt",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "zh",
                            "value": "",
                            "visible": true
                        }
                    ],
                    "type": "conceptSet",
                    "expression": "@COND.\"CONDITION_SOURCE_CONCEPT_ID\"",
                    "order": 14,
                    "domainFilter": "",
                    "standardConceptCodeFilter": ""
                },
                "conditionstatusconceptset": {
                    "name": [
                        {
                            "lang": "",
                            "value": "Condition Status concept set"
                        }
                    ],
                    "disabledLangName": [
                        {
                            "lang": "en",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "de",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "fr",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "es",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "pt",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "zh",
                            "value": "",
                            "visible": true
                        }
                    ],
                    "type": "conceptSet",
                    "expression": "@COND.\"CONDITION_STATUS_CONCEPT_ID\"",
                    "order": 16,
                    "domainFilter": "",
                    "standardConceptCodeFilter": "",
                    "useRefValue": true,
                    "useRefText": true
                },
                "conditionconceptid": {
                    "name": [
                        {
                            "lang": "",
                            "value": "Condition concept id"
                        }
                    ],
                    "disabledLangName": [
                        {
                            "lang": "en",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "de",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "fr",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "es",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "pt",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "zh",
                            "value": "",
                            "visible": true
                        }
                    ],
                    "type": "text",
                    "expression": "@COND.\"CONDITION_CONCEPT_ID\"",
                    "referenceFilter": "@REF.DOMAIN_ID = 'Condition' AND @REF.STANDARD_CONCEPT = 'S' AND JARO_SIMILARITY(CAST(@REF.CONCEPT_ID AS VARCHAR), '@SEARCH_QUERY') >= 0.85",
                    "referenceExpression": "@REF.CONCEPT_ID",
                    "order": 17,
                    "domainFilter": "",
                    "standardConceptCodeFilter": "",
                    "useRefValue": true,
                    "useRefText": true
                },
                "conditionconceptset": {
                    "name": [
                        {
                            "lang": "",
                            "value": "Condition concept set"
                        }
                    ],
                    "disabledLangName": [
                        {
                            "lang": "en",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "de",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "fr",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "es",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "pt",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "zh",
                            "value": "",
                            "visible": true
                        }
                    ],
                    "type": "conceptSet",
                    "expression": "@COND.\"CONDITION_CONCEPT_ID\"",
                    "order": 18,
                    "domainFilter": "",
                    "standardConceptCodeFilter": "",
                    "useRefValue": true,
                    "useRefText": true
                },
                "conditiontypeconceptid": {
                    "name": [
                        {
                            "lang": "",
                            "value": "Condition Type concept id"
                        }
                    ],
                    "disabledLangName": [
                        {
                            "lang": "en",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "de",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "fr",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "es",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "pt",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "zh",
                            "value": "",
                            "visible": true
                        }
                    ],
                    "type": "text",
                    "expression": "@COND.\"CONDITION_TYPE_CONCEPT_ID\"",
                    "referenceFilter": "@REF.DOMAIN_ID = 'Type Concept' AND @REF.CONCEPT_CLASS_ID = 'Condition Type' AND JARO_SIMILARITY(CAST(@REF.CONCEPT_ID AS VARCHAR), '@SEARCH_QUERY') >= 0.85",
                    "referenceExpression": "@REF.CONCEPT_ID",
                    "order": 19,
                    "domainFilter": "",
                    "standardConceptCodeFilter": "",
                    "useRefValue": true,
                    "useRefText": true
                },
                "conditionsourceconceptid": {
                    "name": [
                        {
                            "lang": "",
                            "value": "Condition Source concept id"
                        }
                    ],
                    "disabledLangName": [
                        {
                            "lang": "en",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "de",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "fr",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "es",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "pt",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "zh",
                            "value": "",
                            "visible": true
                        }
                    ],
                    "type": "text",
                    "expression": "@COND.\"CONDITION_SOURCE_CONCEPT_ID\"",
                    "order": 20,
                    "domainFilter": "",
                    "standardConceptCodeFilter": ""
                },
                "conditionstatusconceptid": {
                    "name": [
                        {
                            "lang": "",
                            "value": "Condition Status concept id"
                        }
                    ],
                    "disabledLangName": [
                        {
                            "lang": "en",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "de",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "fr",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "es",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "pt",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "zh",
                            "value": "",
                            "visible": true
                        }
                    ],
                    "type": "text",
                    "expression": "@COND.\"CONDITION_STATUS_CONCEPT_ID\"",
                    "referenceFilter": "@REF.DOMAIN_ID = 'Condition Status' AND JARO_SIMILARITY(CAST(@REF.CONCEPT_ID AS VARCHAR), '@SEARCH_QUERY') >= 0.85",
                    "referenceExpression": "@REF.CONCEPT_ID",
                    "order": 21,
                    "domainFilter": "",
                    "standardConceptCodeFilter": "",
                    "useRefValue": true,
                    "useRefText": true
                },
                "condition_occ_concept_name": {
                    "name": [
                        {
                            "lang": "",
                            "value": "Condition concept Name"
                        }
                    ],
                    "disabledLangName": [
                        {
                            "lang": "en",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "de",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "fr",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "es",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "pt",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "zh",
                            "value": "",
                            "visible": true
                        }
                    ],
                    "type": "text",
                    "expression": "@REF.concept_name",
                    "defaultPlaceholder": "@REF",
                    "defaultFilter": "@REF.concept_id = @COND.condition_concept_id",
                    "referenceFilter": "@REF.DOMAIN_ID = 'Condition' AND @REF.STANDARD_CONCEPT = 'S' AND JARO_SIMILARITY(lower(@REF.CONCEPT_NAME), lower('@SEARCH_QUERY')) >= 0.65",
                    "referenceExpression": "@REF.CONCEPT_NAME",
                    "order": 0,
                    "domainFilter": "",
                    "standardConceptCodeFilter": ""
                }
            }
        },
        "death": {
            "name": [
                {
                    "lang": "",
                    "value": "Death"
                }
            ],
            "disabledLangName": [
                {
                    "lang": "en",
                    "value": "",
                    "visible": true
                },
                {
                    "lang": "de",
                    "value": "",
                    "visible": true
                },
                {
                    "lang": "fr",
                    "value": "",
                    "visible": true
                },
                {
                    "lang": "es",
                    "value": "",
                    "visible": true
                },
                {
                    "lang": "pt",
                    "value": "",
                    "visible": true
                },
                {
                    "lang": "zh",
                    "value": "",
                    "visible": true
                }
            ],
            "defaultFilter": "1=1",
            "defaultPlaceholder": "@DEATH",
            "order": 13,
            "parentInteraction": [],
            "parentInteractionLabel": "parent",
            "attributes": {
                "deathtypeconceptset": {
                    "name": [
                        {
                            "lang": "",
                            "value": "Death Type concept set"
                        }
                    ],
                    "disabledLangName": [
                        {
                            "lang": "en",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "de",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "fr",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "es",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "pt",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "zh",
                            "value": "",
                            "visible": true
                        }
                    ],
                    "type": "conceptSet",
                    "expression": "@DEATH.\"DEATH_TYPE_CONCEPT_ID\"",
                    "order": 2,
                    "domainFilter": "",
                    "standardConceptCodeFilter": "",
                    "useRefValue": true,
                    "useRefText": true
                },
                "pid": {
                    "name": [
                        {
                            "lang": "",
                            "value": "Person id"
                        }
                    ],
                    "disabledLangName": [
                        {
                            "lang": "en",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "de",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "fr",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "es",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "pt",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "zh",
                            "value": "",
                            "visible": true
                        }
                    ],
                    "type": "text",
                    "expression": "@DEATH.person_id",
                    "order": 3,
                    "domainFilter": "",
                    "standardConceptCodeFilter": ""
                },
                "deathdatetime": {
                    "name": [
                        {
                            "lang": "",
                            "value": "Death Datetime"
                        }
                    ],
                    "disabledLangName": [
                        {
                            "lang": "en",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "de",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "fr",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "es",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "pt",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "zh",
                            "value": "",
                            "visible": true
                        }
                    ],
                    "type": "datetime",
                    "expression": "@DEATH.\"DEATH_DATETIME\"",
                    "order": 4,
                    "domainFilter": "",
                    "standardConceptCodeFilter": ""
                },
                "deathdate": {
                    "name": [
                        {
                            "lang": "",
                            "value": "Death Date"
                        }
                    ],
                    "disabledLangName": [
                        {
                            "lang": "en",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "de",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "fr",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "es",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "pt",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "zh",
                            "value": "",
                            "visible": true
                        }
                    ],
                    "type": "time",
                    "expression": "@DEATH.\"DEATH_DATE\"",
                    "order": 5,
                    "domainFilter": "",
                    "standardConceptCodeFilter": ""
                },
                "deathtypeconceptid": {
                    "name": [
                        {
                            "lang": "",
                            "value": "Death Type concept id"
                        }
                    ],
                    "disabledLangName": [
                        {
                            "lang": "en",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "de",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "fr",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "es",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "pt",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "zh",
                            "value": "",
                            "visible": true
                        }
                    ],
                    "type": "text",
                    "expression": "@DEATH.\"DEATH_TYPE_CONCEPT_ID\"",
                    "referenceFilter": "@REF.DOMAIN_ID = 'Type Concept' AND @REF.CONCEPT_CLASS_ID = 'Death Type' AND JARO_SIMILARITY(CAST(@REF.CONCEPT_ID AS VARCHAR), '@SEARCH_QUERY') >= 0.85",
                    "referenceExpression": "@REF.CONCEPT_ID",
                    "order": 7,
                    "domainFilter": "",
                    "standardConceptCodeFilter": "",
                    "useRefValue": true,
                    "useRefText": true
                },
                "death_type_concept_name": {
                    "name": [
                        {
                            "lang": "",
                            "value": "Death Type concept name"
                        }
                    ],
                    "disabledLangName": [
                        {
                            "lang": "en",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "de",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "fr",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "es",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "pt",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "zh",
                            "value": "",
                            "visible": true
                        }
                    ],
                    "type": "text",
                    "expression": "@REF.concept_name",
                    "defaultPlaceholder": "@REF",
                    "defaultFilter": "@REF.concept_id = @DEATH.DEATH_TYPE_CONCEPT_ID",
                    "order": 0,
                    "domainFilter": "",
                    "standardConceptCodeFilter": ""
                }
            }
        },
        "deviceexposure": {
            "name": [
                {
                    "lang": "",
                    "value": "Device Exposure"
                }
            ],
            "disabledLangName": [
                {
                    "lang": "en",
                    "value": "",
                    "visible": true
                },
                {
                    "lang": "de",
                    "value": "",
                    "visible": true
                },
                {
                    "lang": "fr",
                    "value": "",
                    "visible": true
                },
                {
                    "lang": "es",
                    "value": "",
                    "visible": true
                },
                {
                    "lang": "pt",
                    "value": "",
                    "visible": true
                },
                {
                    "lang": "zh",
                    "value": "",
                    "visible": true
                }
            ],
            "defaultFilter": "1=1",
            "defaultPlaceholder": "@DEVEXP",
            "order": 12,
            "parentInteraction": [
                "patient.interactions.visit"
            ],
            "parentInteractionLabel": "Visit Occurrence Parent",
            "attributes": {
                "enddate": {
                    "name": [
                        {
                            "lang": "",
                            "value": "Device Exposure End Date"
                        }
                    ],
                    "disabledLangName": [
                        {
                            "lang": "en",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "de",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "fr",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "es",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "pt",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "zh",
                            "value": "",
                            "visible": true
                        }
                    ],
                    "type": "time",
                    "expression": "@DEVEXP.\"DEVICE_EXPOSURE_END_DATE\"",
                    "order": 1,
                    "domainFilter": "",
                    "standardConceptCodeFilter": ""
                },
                "startdate": {
                    "name": [
                        {
                            "lang": "",
                            "value": "Device Exposure Start Date"
                        }
                    ],
                    "disabledLangName": [
                        {
                            "lang": "en",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "de",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "fr",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "es",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "pt",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "zh",
                            "value": "",
                            "visible": true
                        }
                    ],
                    "type": "time",
                    "expression": "@DEVEXP.\"DEVICE_EXPOSURE_START_DATE\"",
                    "order": 2,
                    "domainFilter": "",
                    "standardConceptCodeFilter": ""
                },
                "pid": {
                    "name": [
                        {
                            "lang": "",
                            "value": "Person id"
                        }
                    ],
                    "disabledLangName": [
                        {
                            "lang": "en",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "de",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "fr",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "es",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "pt",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "zh",
                            "value": "",
                            "visible": true
                        }
                    ],
                    "type": "text",
                    "expression": "@DEVEXP.person_id",
                    "order": 4,
                    "domainFilter": "",
                    "standardConceptCodeFilter": ""
                },
                "deviceexposureid": {
                    "name": [
                        {
                            "lang": "",
                            "value": "Device Exposure Id"
                        }
                    ],
                    "disabledLangName": [
                        {
                            "lang": "en",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "de",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "fr",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "es",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "pt",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "zh",
                            "value": "",
                            "visible": true
                        }
                    ],
                    "type": "text",
                    "expression": "@DEVEXP.\"DEVICE_EXPOSURE_ID\"",
                    "order": 5,
                    "domainFilter": "",
                    "standardConceptCodeFilter": ""
                },
                "devicetypeconceptset": {
                    "name": [
                        {
                            "lang": "",
                            "value": "Device Type concept set"
                        }
                    ],
                    "disabledLangName": [
                        {
                            "lang": "en",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "de",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "fr",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "es",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "pt",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "zh",
                            "value": "",
                            "visible": true
                        }
                    ],
                    "type": "conceptSet",
                    "expression": "@DEVEXP.\"DEVICE_TYPE_CONCEPT_ID\"",
                    "order": 9,
                    "domainFilter": "",
                    "standardConceptCodeFilter": "",
                    "useRefValue": true,
                    "useRefText": true
                },
                "deviceconceptid": {
                    "name": [
                        {
                            "lang": "",
                            "value": "Device concept id"
                        }
                    ],
                    "disabledLangName": [
                        {
                            "lang": "en",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "de",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "fr",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "es",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "pt",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "zh",
                            "value": "",
                            "visible": true
                        }
                    ],
                    "type": "text",
                    "expression": "@DEVEXP.\"DEVICE_CONCEPT_ID\"",
                    "referenceFilter": "@REF.DOMAIN_ID = 'Device' AND @REF.STANDARD_CONCEPT = 'S' AND JARO_SIMILARITY(CAST(@REF.CONCEPT_ID AS VARCHAR), '@SEARCH_QUERY') >= 0.85",
                    "referenceExpression": "@REF.CONCEPT_ID",
                    "order": 10,
                    "domainFilter": "",
                    "standardConceptCodeFilter": "",
                    "useRefValue": true,
                    "useRefText": true
                },
                "deviceconceptset": {
                    "name": [
                        {
                            "lang": "",
                            "value": "Device concept set"
                        }
                    ],
                    "disabledLangName": [
                        {
                            "lang": "en",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "de",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "fr",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "es",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "pt",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "zh",
                            "value": "",
                            "visible": true
                        }
                    ],
                    "type": "conceptSet",
                    "expression": "@DEVEXP.\"DEVICE_CONCEPT_ID\"",
                    "order": 11,
                    "domainFilter": "",
                    "standardConceptCodeFilter": "",
                    "useRefValue": true,
                    "useRefText": true
                },
                "devicetypeconceptid": {
                    "name": [
                        {
                            "lang": "",
                            "value": "Device Type concept id"
                        }
                    ],
                    "disabledLangName": [
                        {
                            "lang": "en",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "de",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "fr",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "es",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "pt",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "zh",
                            "value": "",
                            "visible": true
                        }
                    ],
                    "type": "text",
                    "expression": "@DEVEXP.\"DEVICE_TYPE_CONCEPT_ID\"",
                    "referenceFilter": "@REF.DOMAIN_ID = 'Type Concept' AND @REF.CONCEPT_CLASS_ID = 'Device Type' AND JARO_SIMILARITY(CAST(@REF.CONCEPT_ID AS VARCHAR), '@SEARCH_QUERY') >= 0.85",
                    "referenceExpression": "@REF.CONCEPT_ID",
                    "order": 12,
                    "domainFilter": "",
                    "standardConceptCodeFilter": "",
                    "useRefValue": true,
                    "useRefText": true
                },
                "device_concept_name": {
                    "name": [
                        {
                            "lang": "",
                            "value": "Device concept name"
                        }
                    ],
                    "disabledLangName": [
                        {
                            "lang": "en",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "de",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "fr",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "es",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "pt",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "zh",
                            "value": "",
                            "visible": true
                        }
                    ],
                    "type": "text",
                    "expression": "@REF.concept_name",
                    "defaultPlaceholder": "@REF",
                    "defaultFilter": "@REF.concept_id = @DEVEXP.device_concept_id",
                    "referenceFilter": "@REF.DOMAIN_ID = 'Device' AND @REF.STANDARD_CONCEPT = 'S' AND JARO_SIMILARITY(lower(@REF.CONCEPT_NAME), lower('@SEARCH_QUERY')) >= 0.65",
                    "referenceExpression": "@REF.CONCEPT_NAME",
                    "order": 0,
                    "domainFilter": "",
                    "standardConceptCodeFilter": ""
                }
            }
        },
        "doseera": {
            "name": [
                {
                    "lang": "",
                    "value": "Dose Era"
                }
            ],
            "disabledLangName": [
                {
                    "lang": "en",
                    "value": "",
                    "visible": true
                },
                {
                    "lang": "de",
                    "value": "",
                    "visible": true
                },
                {
                    "lang": "fr",
                    "value": "",
                    "visible": true
                },
                {
                    "lang": "es",
                    "value": "",
                    "visible": true
                },
                {
                    "lang": "pt",
                    "value": "",
                    "visible": true
                },
                {
                    "lang": "zh",
                    "value": "",
                    "visible": true
                }
            ],
            "defaultFilter": "1=1",
            "defaultPlaceholder": "@DOSEERA",
            "order": 11,
            "parentInteraction": [],
            "parentInteractionLabel": "parent",
            "attributes": {
                "pid": {
                    "name": [
                        {
                            "lang": "",
                            "value": "Person id"
                        }
                    ],
                    "disabledLangName": [
                        {
                            "lang": "en",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "de",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "fr",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "es",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "pt",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "zh",
                            "value": "",
                            "visible": true
                        }
                    ],
                    "type": "text",
                    "expression": "@DOSEERA.person_id",
                    "order": 2,
                    "domainFilter": "",
                    "standardConceptCodeFilter": ""
                },
                "enddate": {
                    "name": [
                        {
                            "lang": "",
                            "value": "Dose Era End Date"
                        }
                    ],
                    "disabledLangName": [
                        {
                            "lang": "en",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "de",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "fr",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "es",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "pt",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "zh",
                            "value": "",
                            "visible": true
                        }
                    ],
                    "type": "time",
                    "expression": "@DOSEERA.\"DOSE_ERA_END_DATE\"",
                    "order": 3,
                    "domainFilter": "",
                    "standardConceptCodeFilter": ""
                },
                "startdate": {
                    "name": [
                        {
                            "lang": "",
                            "value": "Dose Era Start Date"
                        }
                    ],
                    "disabledLangName": [
                        {
                            "lang": "en",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "de",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "fr",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "es",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "pt",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "zh",
                            "value": "",
                            "visible": true
                        }
                    ],
                    "type": "time",
                    "expression": "@DOSEERA.\"DOSE_ERA_START_DATE\"",
                    "order": 4,
                    "domainFilter": "",
                    "standardConceptCodeFilter": ""
                },
                "dosevalue": {
                    "name": [
                        {
                            "lang": "",
                            "value": "Dose Value"
                        }
                    ],
                    "disabledLangName": [
                        {
                            "lang": "en",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "de",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "fr",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "es",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "pt",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "zh",
                            "value": "",
                            "visible": true
                        }
                    ],
                    "type": "num",
                    "expression": "@DOSEERA.\"DOSE_VALUE\"",
                    "order": 5,
                    "domainFilter": "",
                    "standardConceptCodeFilter": ""
                },
                "doseeraid": {
                    "name": [
                        {
                            "lang": "",
                            "value": "Dose Era Id"
                        }
                    ],
                    "disabledLangName": [
                        {
                            "lang": "en",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "de",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "fr",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "es",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "pt",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "zh",
                            "value": "",
                            "visible": true
                        }
                    ],
                    "type": "text",
                    "expression": "@DOSEERA.\"DOSE_ERA_ID\"",
                    "order": 6,
                    "domainFilter": "",
                    "standardConceptCodeFilter": ""
                },
                "drugconceptset": {
                    "name": [
                        {
                            "lang": "",
                            "value": "Drug concept set"
                        }
                    ],
                    "disabledLangName": [
                        {
                            "lang": "en",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "de",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "fr",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "es",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "pt",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "zh",
                            "value": "",
                            "visible": true
                        }
                    ],
                    "type": "conceptSet",
                    "expression": "@DOSEERA.\"DRUG_CONCEPT_ID\"",
                    "order": 8,
                    "domainFilter": "",
                    "standardConceptCodeFilter": "",
                    "useRefValue": true,
                    "useRefText": true
                },
                "unitconceptset": {
                    "name": [
                        {
                            "lang": "",
                            "value": "Unit concept set"
                        }
                    ],
                    "disabledLangName": [
                        {
                            "lang": "en",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "de",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "fr",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "es",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "pt",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "zh",
                            "value": "",
                            "visible": true
                        }
                    ],
                    "type": "conceptSet",
                    "expression": "@DOSEERA.\"UNIT_CONCEPT_ID\"",
                    "order": 10,
                    "domainFilter": "",
                    "standardConceptCodeFilter": "",
                    "useRefValue": true,
                    "useRefText": true
                },
                "drugconceptid": {
                    "name": [
                        {
                            "lang": "",
                            "value": "Drug concept id"
                        }
                    ],
                    "disabledLangName": [
                        {
                            "lang": "en",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "de",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "fr",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "es",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "pt",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "zh",
                            "value": "",
                            "visible": true
                        }
                    ],
                    "type": "text",
                    "expression": "@DOSEERA.\"DRUG_CONCEPT_ID\"",
                    "referenceFilter": "@REF.DOMAIN_ID = 'Drug' AND @REF.STANDARD_CONCEPT = 'S' AND JARO_SIMILARITY(CAST(@REF.CONCEPT_ID AS VARCHAR), '@SEARCH_QUERY') >= 0.85",
                    "referenceExpression": "@REF.CONCEPT_ID",
                    "order": 11,
                    "domainFilter": "",
                    "standardConceptCodeFilter": "",
                    "useRefValue": true,
                    "useRefText": true
                },
                "unitconceptid": {
                    "name": [
                        {
                            "lang": "",
                            "value": "Unit concept id"
                        }
                    ],
                    "disabledLangName": [
                        {
                            "lang": "en",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "de",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "fr",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "es",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "pt",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "zh",
                            "value": "",
                            "visible": true
                        }
                    ],
                    "type": "text",
                    "expression": "@DOSEERA.\"UNIT_CONCEPT_ID\"",
                    "referenceFilter": "@REF.DOMAIN_ID = 'Unit' AND @REF.STANDARD_CONCEPT = 'S' AND JARO_SIMILARITY(CAST(@REF.CONCEPT_ID AS VARCHAR), '@SEARCH_QUERY') >= 0.85",
                    "referenceExpression": "@REF.CONCEPT_ID",
                    "order": 12,
                    "domainFilter": "",
                    "standardConceptCodeFilter": "",
                    "useRefValue": true,
                    "useRefText": true
                }
            }
        },
        "drugera": {
            "name": [
                {
                    "lang": "",
                    "value": "Drug Era"
                }
            ],
            "disabledLangName": [
                {
                    "lang": "en",
                    "value": "",
                    "visible": true
                },
                {
                    "lang": "de",
                    "value": "",
                    "visible": true
                },
                {
                    "lang": "fr",
                    "value": "",
                    "visible": true
                },
                {
                    "lang": "es",
                    "value": "",
                    "visible": true
                },
                {
                    "lang": "pt",
                    "value": "",
                    "visible": true
                },
                {
                    "lang": "zh",
                    "value": "",
                    "visible": true
                }
            ],
            "defaultFilter": "1=1",
            "defaultPlaceholder": "@DRUGERA",
            "order": 10,
            "parentInteraction": [],
            "parentInteractionLabel": "parent",
            "attributes": {
                "enddate": {
                    "name": [
                        {
                            "lang": "",
                            "value": "Drug Era End Date"
                        }
                    ],
                    "disabledLangName": [
                        {
                            "lang": "en",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "de",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "fr",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "es",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "pt",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "zh",
                            "value": "",
                            "visible": true
                        }
                    ],
                    "type": "time",
                    "expression": "@DRUGERA.\"DRUG_ERA_END_DATE\"",
                    "order": 0,
                    "domainFilter": "",
                    "standardConceptCodeFilter": ""
                },
                "startdate": {
                    "name": [
                        {
                            "lang": "",
                            "value": "Drug Era Start Date"
                        }
                    ],
                    "disabledLangName": [
                        {
                            "lang": "en",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "de",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "fr",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "es",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "pt",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "zh",
                            "value": "",
                            "visible": true
                        }
                    ],
                    "type": "time",
                    "expression": "@DRUGERA.\"DRUG_ERA_START_DATE\"",
                    "order": 1,
                    "domainFilter": "",
                    "standardConceptCodeFilter": ""
                },
                "pid": {
                    "name": [
                        {
                            "lang": "",
                            "value": "Person id"
                        }
                    ],
                    "disabledLangName": [
                        {
                            "lang": "en",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "de",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "fr",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "es",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "pt",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "zh",
                            "value": "",
                            "visible": true
                        }
                    ],
                    "type": "text",
                    "expression": "@DRUGERA.person_id",
                    "order": 3,
                    "domainFilter": "",
                    "standardConceptCodeFilter": ""
                },
                "drugeraid": {
                    "name": [
                        {
                            "lang": "",
                            "value": "Drug Era Id"
                        }
                    ],
                    "disabledLangName": [
                        {
                            "lang": "en",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "de",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "fr",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "es",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "pt",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "zh",
                            "value": "",
                            "visible": true
                        }
                    ],
                    "type": "text",
                    "expression": "@DRUGERA.\"DRUG_ERA_ID\"",
                    "order": 4,
                    "domainFilter": "",
                    "standardConceptCodeFilter": ""
                },
                "gapdays": {
                    "name": [
                        {
                            "lang": "",
                            "value": "Gap Days"
                        }
                    ],
                    "disabledLangName": [
                        {
                            "lang": "en",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "de",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "fr",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "es",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "pt",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "zh",
                            "value": "",
                            "visible": true
                        }
                    ],
                    "type": "num",
                    "expression": "@DRUGERA.\"GAP_DAYS\"",
                    "order": 5,
                    "domainFilter": "",
                    "standardConceptCodeFilter": ""
                },
                "drugexpcount": {
                    "name": [
                        {
                            "lang": "",
                            "value": "Drug Exposure Count"
                        }
                    ],
                    "disabledLangName": [
                        {
                            "lang": "en",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "de",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "fr",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "es",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "pt",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "zh",
                            "value": "",
                            "visible": true
                        }
                    ],
                    "type": "num",
                    "expression": "@DRUGERA.\"DRUG_EXPOSURE_COUNT\"",
                    "order": 6,
                    "domainFilter": "",
                    "standardConceptCodeFilter": ""
                },
                "drugconceptset": {
                    "name": [
                        {
                            "lang": "",
                            "value": "Drug concept set"
                        }
                    ],
                    "disabledLangName": [
                        {
                            "lang": "en",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "de",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "fr",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "es",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "pt",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "zh",
                            "value": "",
                            "visible": true
                        }
                    ],
                    "type": "conceptSet",
                    "expression": "@DRUGERA.\"DRUG_CONCEPT_ID\"",
                    "order": 8,
                    "domainFilter": "",
                    "standardConceptCodeFilter": "",
                    "useRefValue": true,
                    "useRefText": true
                },
                "drugconceptid": {
                    "name": [
                        {
                            "lang": "",
                            "value": "Drug concept id"
                        }
                    ],
                    "disabledLangName": [
                        {
                            "lang": "en",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "de",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "fr",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "es",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "pt",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "zh",
                            "value": "",
                            "visible": true
                        }
                    ],
                    "type": "text",
                    "expression": "@DRUGERA.\"DRUG_CONCEPT_ID\"",
                    "referenceFilter": "@REF.DOMAIN_ID = 'Drug' AND @REF.STANDARD_CONCEPT = 'S' AND JARO_SIMILARITY(CAST(@REF.CONCEPT_ID AS VARCHAR), '@SEARCH_QUERY') >= 0.85",
                    "referenceExpression": "@REF.CONCEPT_ID",
                    "order": 9,
                    "domainFilter": "",
                    "standardConceptCodeFilter": "",
                    "useRefValue": true,
                    "useRefText": true
                }
            }
        },
        "drugexposure": {
            "name": [
                {
                    "lang": "",
                    "value": "Drug Exposure"
                }
            ],
            "disabledLangName": [
                {
                    "lang": "en",
                    "value": "",
                    "visible": true
                },
                {
                    "lang": "de",
                    "value": "",
                    "visible": true
                },
                {
                    "lang": "fr",
                    "value": "",
                    "visible": true
                },
                {
                    "lang": "es",
                    "value": "",
                    "visible": true
                },
                {
                    "lang": "pt",
                    "value": "",
                    "visible": true
                },
                {
                    "lang": "zh",
                    "value": "",
                    "visible": true
                }
            ],
            "defaultFilter": "1=1",
            "defaultPlaceholder": "@DRUGEXP",
            "order": 9,
            "parentInteraction": [
                "patient.interactions.visit"
            ],
            "parentInteractionLabel": "Visit Occurrence Parent",
            "attributes": {
                "enddatetime": {
                    "name": [
                        {
                            "lang": "",
                            "value": "Drug Exposure End Datetime"
                        }
                    ],
                    "disabledLangName": [
                        {
                            "lang": "en",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "de",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "fr",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "es",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "pt",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "zh",
                            "value": "",
                            "visible": true
                        }
                    ],
                    "type": "datetime",
                    "expression": "@DRUGEXP.\"DRUG_EXPOSURE_END_DATETIME\"",
                    "order": 1,
                    "domainFilter": "",
                    "standardConceptCodeFilter": ""
                },
                "refills": {
                    "name": [
                        {
                            "lang": "",
                            "value": "Refills"
                        }
                    ],
                    "disabledLangName": [
                        {
                            "lang": "en",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "de",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "fr",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "es",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "pt",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "zh",
                            "value": "",
                            "visible": true
                        }
                    ],
                    "type": "num",
                    "expression": "@DRUGEXP.\"REFILLS\"",
                    "order": 2,
                    "domainFilter": "",
                    "standardConceptCodeFilter": ""
                },
                "startdatetime": {
                    "name": [
                        {
                            "lang": "",
                            "value": "Drug Exposure Start Datetime"
                        }
                    ],
                    "disabledLangName": [
                        {
                            "lang": "en",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "de",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "fr",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "es",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "pt",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "zh",
                            "value": "",
                            "visible": true
                        }
                    ],
                    "type": "datetime",
                    "expression": "@DRUGEXP.\"DRUG_EXPOSURE_START_DATETIME\"",
                    "order": 3,
                    "domainFilter": "",
                    "standardConceptCodeFilter": ""
                },
                "stopreason": {
                    "name": [
                        {
                            "lang": "",
                            "value": "Stop Reason"
                        }
                    ],
                    "disabledLangName": [
                        {
                            "lang": "en",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "de",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "fr",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "es",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "pt",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "zh",
                            "value": "",
                            "visible": true
                        }
                    ],
                    "type": "text",
                    "expression": "@DRUGEXP.\"STOP_REASON\"",
                    "order": 4,
                    "domainFilter": "",
                    "standardConceptCodeFilter": ""
                },
                "enddate": {
                    "name": [
                        {
                            "lang": "",
                            "value": "Drug Exposure End Date"
                        }
                    ],
                    "disabledLangName": [
                        {
                            "lang": "en",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "de",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "fr",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "es",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "pt",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "zh",
                            "value": "",
                            "visible": true
                        }
                    ],
                    "type": "time",
                    "expression": "@DRUGEXP.\"DRUG_EXPOSURE_END_DATE\"",
                    "order": 5,
                    "domainFilter": "",
                    "standardConceptCodeFilter": ""
                },
                "startdate": {
                    "name": [
                        {
                            "lang": "",
                            "value": "Drug Exposure Start Date"
                        }
                    ],
                    "disabledLangName": [
                        {
                            "lang": "en",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "de",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "fr",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "es",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "pt",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "zh",
                            "value": "",
                            "visible": true
                        }
                    ],
                    "type": "time",
                    "expression": "@DRUGEXP.\"DRUG_EXPOSURE_START_DATE\"",
                    "order": 7,
                    "domainFilter": "",
                    "standardConceptCodeFilter": ""
                },
                "lotnumber": {
                    "name": [
                        {
                            "lang": "",
                            "value": "Lot Number"
                        }
                    ],
                    "disabledLangName": [
                        {
                            "lang": "en",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "de",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "fr",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "es",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "pt",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "zh",
                            "value": "",
                            "visible": true
                        }
                    ],
                    "type": "text",
                    "expression": "@DRUGEXP.\"LOT_NUMBER\"",
                    "order": 9,
                    "domainFilter": "",
                    "standardConceptCodeFilter": ""
                },
                "drugexposureid": {
                    "name": [
                        {
                            "lang": "",
                            "value": "Drug Exposure Id"
                        }
                    ],
                    "disabledLangName": [
                        {
                            "lang": "en",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "de",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "fr",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "es",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "pt",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "zh",
                            "value": "",
                            "visible": true
                        }
                    ],
                    "type": "text",
                    "expression": "@DRUGEXP.\"DRUG_EXPOSURE_ID\"",
                    "order": 11,
                    "domainFilter": "",
                    "standardConceptCodeFilter": ""
                },
                "sig": {
                    "name": [
                        {
                            "lang": "",
                            "value": "Sig"
                        }
                    ],
                    "disabledLangName": [
                        {
                            "lang": "en",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "de",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "fr",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "es",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "pt",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "zh",
                            "value": "",
                            "visible": true
                        }
                    ],
                    "type": "text",
                    "expression": "@DRUGEXP.\"SIG\"",
                    "order": 12,
                    "domainFilter": "",
                    "standardConceptCodeFilter": ""
                },
                "pid": {
                    "name": [
                        {
                            "lang": "",
                            "value": "Person id"
                        }
                    ],
                    "disabledLangName": [
                        {
                            "lang": "en",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "de",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "fr",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "es",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "pt",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "zh",
                            "value": "",
                            "visible": true
                        }
                    ],
                    "type": "text",
                    "expression": "@DRUGEXP.person_id",
                    "order": 13,
                    "domainFilter": "",
                    "standardConceptCodeFilter": ""
                },
                "verbatimenddate": {
                    "name": [
                        {
                            "lang": "",
                            "value": "Verbatim End Date"
                        }
                    ],
                    "disabledLangName": [
                        {
                            "lang": "en",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "de",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "fr",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "es",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "pt",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "zh",
                            "value": "",
                            "visible": true
                        }
                    ],
                    "type": "time",
                    "expression": "@DRUGEXP.\"VERBATIM_END_DATE\"",
                    "order": 14,
                    "domainFilter": "",
                    "standardConceptCodeFilter": ""
                },
                "dayssupply": {
                    "name": [
                        {
                            "lang": "",
                            "value": "Days of supply"
                        }
                    ],
                    "disabledLangName": [
                        {
                            "lang": "en",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "de",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "fr",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "es",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "pt",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "zh",
                            "value": "",
                            "visible": true
                        }
                    ],
                    "type": "num",
                    "expression": "@DRUGEXP.\"DAYS_SUPPLY\"",
                    "order": 15,
                    "domainFilter": "",
                    "standardConceptCodeFilter": ""
                },
                "drugconceptid": {
                    "name": [
                        {
                            "lang": "",
                            "value": "Drug concept id"
                        }
                    ],
                    "disabledLangName": [
                        {
                            "lang": "en",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "de",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "fr",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "es",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "pt",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "zh",
                            "value": "",
                            "visible": true
                        }
                    ],
                    "type": "text",
                    "expression": "@DRUGEXP.\"DRUG_CONCEPT_ID\"",
                    "referenceFilter": "@REF.DOMAIN_ID = 'Drug' AND @REF.STANDARD_CONCEPT = 'S' AND JARO_SIMILARITY(lower(@REF.CONCEPT_NAME), lower('@SEARCH_QUERY')) >= 0.65",
                    "referenceExpression": "CAST (@REF.CONCEPT_ID AS VARCHAR)",
                    "order": 19,
                    "domainFilter": "",
                    "standardConceptCodeFilter": "",
                    "useRefValue": true,
                    "useRefText": true
                },
                "drugconceptset": {
                    "name": [
                        {
                            "lang": "",
                            "value": "Drug concept set"
                        }
                    ],
                    "disabledLangName": [
                        {
                            "lang": "en",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "de",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "fr",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "es",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "pt",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "zh",
                            "value": "",
                            "visible": true
                        }
                    ],
                    "type": "conceptSet",
                    "expression": "@DRUGEXP.\"DRUG_CONCEPT_ID\"",
                    "order": 20,
                    "domainFilter": "",
                    "standardConceptCodeFilter": "",
                    "useRefValue": true,
                    "useRefText": true
                },
                "routeconceptid": {
                    "name": [
                        {
                            "lang": "",
                            "value": "Route concept id"
                        }
                    ],
                    "disabledLangName": [
                        {
                            "lang": "en",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "de",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "fr",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "es",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "pt",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "zh",
                            "value": "",
                            "visible": true
                        }
                    ],
                    "type": "text",
                    "expression": "@DRUGEXP.\"ROUTE_CONCEPT_ID\"",
                    "referenceFilter": "@REF.DOMAIN_ID = 'Route' AND @REF.STANDARD_CONCEPT = 'S' AND JARO_SIMILARITY(CAST(@REF.CONCEPT_ID AS VARCHAR), '@SEARCH_QUERY') >= 0.85",
                    "referenceExpression": "@REF.CONCEPT_ID",
                    "order": 21,
                    "domainFilter": "",
                    "standardConceptCodeFilter": "",
                    "useRefValue": true,
                    "useRefText": true
                },
                "routeconceptset": {
                    "name": [
                        {
                            "lang": "",
                            "value": "Route concept set"
                        }
                    ],
                    "disabledLangName": [
                        {
                            "lang": "en",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "de",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "fr",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "es",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "pt",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "zh",
                            "value": "",
                            "visible": true
                        }
                    ],
                    "type": "conceptSet",
                    "expression": "@DRUGEXP.\"ROUTE_CONCEPT_ID\"",
                    "order": 22,
                    "domainFilter": "",
                    "standardConceptCodeFilter": "",
                    "useRefValue": true,
                    "useRefText": true
                },
                "drugtypeconceptid": {
                    "name": [
                        {
                            "lang": "",
                            "value": "Drug type concept id"
                        }
                    ],
                    "disabledLangName": [
                        {
                            "lang": "en",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "de",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "fr",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "es",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "pt",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "zh",
                            "value": "",
                            "visible": true
                        }
                    ],
                    "type": "text",
                    "expression": "@DRUGEXP.\"DRUG_TYPE_CONCEPT_ID\"",
                    "referenceFilter": "@REF.DOMAIN_ID = 'Type Concept' AND @REF.CONCEPT_CLASS_ID = 'Drug Type' AND JARO_SIMILARITY(CAST(@REF.CONCEPT_ID AS VARCHAR), '@SEARCH_QUERY') >= 0.85",
                    "referenceExpression": "@REF.CONCEPT_ID",
                    "order": 23,
                    "domainFilter": "",
                    "standardConceptCodeFilter": "",
                    "useRefValue": true,
                    "useRefText": true
                },
                "drugtypeconceptset": {
                    "name": [
                        {
                            "lang": "",
                            "value": "Drug type concept set"
                        }
                    ],
                    "disabledLangName": [
                        {
                            "lang": "en",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "de",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "fr",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "es",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "pt",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "zh",
                            "value": "",
                            "visible": true
                        }
                    ],
                    "type": "conceptSet",
                    "expression": "@DRUGEXP.\"DRUG_TYPE_CONCEPT_ID\"",
                    "order": 24,
                    "domainFilter": "",
                    "standardConceptCodeFilter": "",
                    "useRefValue": true,
                    "useRefText": true
                },
                "drug_concept_name": {
                    "name": [
                        {
                            "lang": "",
                            "value": "Drug concept name"
                        }
                    ],
                    "disabledLangName": [
                        {
                            "lang": "en",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "de",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "fr",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "es",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "pt",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "zh",
                            "value": "",
                            "visible": true
                        }
                    ],
                    "type": "text",
                    "expression": "@REF.concept_name",
                    "defaultPlaceholder": "@REF",
                    "defaultFilter": "@REF.concept_id = @DRUGEXP.drug_concept_id",
                    "referenceFilter": "@REF.DOMAIN_ID = 'Drug' AND @REF.STANDARD_CONCEPT = 'S' AND JARO_SIMILARITY(lower(@REF.CONCEPT_NAME), lower('@SEARCH_QUERY')) >= 0.65",
                    "referenceExpression": "@REF.CONCEPT_NAME",
                    "order": 0,
                    "domainFilter": "",
                    "standardConceptCodeFilter": ""
                }
            }
        },
        "measurement": {
            "name": [
                {
                    "lang": "",
                    "value": "Measurement"
                }
            ],
            "disabledLangName": [
                {
                    "lang": "en",
                    "value": "",
                    "visible": true
                },
                {
                    "lang": "de",
                    "value": "",
                    "visible": true
                },
                {
                    "lang": "fr",
                    "value": "",
                    "visible": true
                },
                {
                    "lang": "es",
                    "value": "",
                    "visible": true
                },
                {
                    "lang": "pt",
                    "value": "",
                    "visible": true
                },
                {
                    "lang": "zh",
                    "value": "",
                    "visible": true
                }
            ],
            "defaultFilter": "1=1",
            "defaultPlaceholder": "@MEAS",
            "order": 7,
            "parentInteraction": [
                "patient.interactions.visit"
            ],
            "parentInteractionLabel": "Visit Occurrence Parent",
            "attributes": {
                "numval": {
                    "name": [
                        {
                            "lang": "",
                            "value": "Value As Number"
                        }
                    ],
                    "disabledLangName": [
                        {
                            "lang": "en",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "de",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "fr",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "es",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "pt",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "zh",
                            "value": "",
                            "visible": true
                        }
                    ],
                    "type": "num",
                    "expression": "@MEAS.\"VALUE_AS_NUMBER\"",
                    "order": 1,
                    "domainFilter": "",
                    "standardConceptCodeFilter": ""
                },
                "measurementdate": {
                    "name": [
                        {
                            "lang": "",
                            "value": "Measurement date"
                        }
                    ],
                    "disabledLangName": [
                        {
                            "lang": "en",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "de",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "fr",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "es",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "pt",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "zh",
                            "value": "",
                            "visible": true
                        }
                    ],
                    "type": "time",
                    "expression": "@MEAS.\"MEASUREMENT_DATE\"",
                    "order": 4,
                    "domainFilter": "",
                    "standardConceptCodeFilter": ""
                },
                "pid": {
                    "name": [
                        {
                            "lang": "",
                            "value": "Person id"
                        }
                    ],
                    "disabledLangName": [
                        {
                            "lang": "en",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "de",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "fr",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "es",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "pt",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "zh",
                            "value": "",
                            "visible": true
                        }
                    ],
                    "type": "text",
                    "expression": "@MEAS.person_id",
                    "order": 5,
                    "domainFilter": "",
                    "standardConceptCodeFilter": ""
                },
                "measurementid": {
                    "name": [
                        {
                            "lang": "",
                            "value": "Measurement Id"
                        }
                    ],
                    "disabledLangName": [
                        {
                            "lang": "en",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "de",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "fr",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "es",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "pt",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "zh",
                            "value": "",
                            "visible": true
                        }
                    ],
                    "type": "text",
                    "expression": "@MEAS.\"MEASUREMENT_ID\"",
                    "order": 6,
                    "domainFilter": "",
                    "standardConceptCodeFilter": ""
                },
                "measurementtypeconceptset": {
                    "name": [
                        {
                            "lang": "",
                            "value": "Measurement type concept set"
                        }
                    ],
                    "disabledLangName": [
                        {
                            "lang": "en",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "de",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "fr",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "es",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "pt",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "zh",
                            "value": "",
                            "visible": true
                        }
                    ],
                    "type": "conceptSet",
                    "expression": "@MEAS.\"MEASUREMENT_TYPE_CONCEPT_ID\"",
                    "order": 10,
                    "domainFilter": "",
                    "standardConceptCodeFilter": "",
                    "useRefValue": true,
                    "useRefText": true
                },
                "valueasconceptset": {
                    "name": [
                        {
                            "lang": "",
                            "value": "Value as concept set"
                        }
                    ],
                    "disabledLangName": [
                        {
                            "lang": "en",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "de",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "fr",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "es",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "pt",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "zh",
                            "value": "",
                            "visible": true
                        }
                    ],
                    "type": "conceptSet",
                    "expression": "@MEAS.\"VALUE_AS_CONCEPT_ID\"",
                    "order": 12,
                    "domainFilter": "",
                    "standardConceptCodeFilter": ""
                },
                "unitconceptset": {
                    "name": [
                        {
                            "lang": "",
                            "value": "Unit concept set"
                        }
                    ],
                    "disabledLangName": [
                        {
                            "lang": "en",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "de",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "fr",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "es",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "pt",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "zh",
                            "value": "",
                            "visible": true
                        }
                    ],
                    "type": "conceptSet",
                    "expression": "@MEAS.\"UNIT_CONCEPT_ID\"",
                    "order": 14,
                    "domainFilter": "",
                    "standardConceptCodeFilter": ""
                },
                "measurementconceptid": {
                    "name": [
                        {
                            "lang": "",
                            "value": "Measurement concept id"
                        }
                    ],
                    "disabledLangName": [
                        {
                            "lang": "en",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "de",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "fr",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "es",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "pt",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "zh",
                            "value": "",
                            "visible": true
                        }
                    ],
                    "type": "text",
                    "expression": "@MEAS.\"MEASUREMENT_CONCEPT_ID\"",
                    "referenceFilter": "@REF.DOMAIN_ID = 'Measurement' AND JARO_SIMILARITY(CAST(@REF.CONCEPT_ID AS VARCHAR), '@SEARCH_QUERY') >= 0.85",
                    "referenceExpression": "@REF.CONCEPT_ID",
                    "order": 15,
                    "domainFilter": "",
                    "standardConceptCodeFilter": "",
                    "useRefValue": true,
                    "useRefText": true
                },
                "measurementconceptset": {
                    "name": [
                        {
                            "lang": "",
                            "value": "Measurement concept set"
                        }
                    ],
                    "disabledLangName": [
                        {
                            "lang": "en",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "de",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "fr",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "es",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "pt",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "zh",
                            "value": "",
                            "visible": true
                        }
                    ],
                    "type": "conceptSet",
                    "expression": "@MEAS.\"MEASUREMENT_CONCEPT_ID\"",
                    "order": 16,
                    "domainFilter": "",
                    "standardConceptCodeFilter": "",
                    "useRefValue": true,
                    "useRefText": true
                },
                "measurementtypeconceptid": {
                    "name": [
                        {
                            "lang": "",
                            "value": "Measurement type concept id"
                        }
                    ],
                    "disabledLangName": [
                        {
                            "lang": "en",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "de",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "fr",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "es",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "pt",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "zh",
                            "value": "",
                            "visible": true
                        }
                    ],
                    "type": "text",
                    "expression": "@MEAS.\"MEASUREMENT_TYPE_CONCEPT_ID\"",
                    "referenceFilter": "@REF.DOMAIN_ID = 'Type Concept' AND @REF.CONCEPT_CLASS_ID = 'Meas Type' AND JARO_SIMILARITY(CAST(@REF.CONCEPT_ID AS VARCHAR), '@SEARCH_QUERY') >= 0.85",
                    "referenceExpression": "@REF.CONCEPT_ID",
                    "order": 17,
                    "domainFilter": "",
                    "standardConceptCodeFilter": "",
                    "useRefValue": true,
                    "useRefText": true
                },
                "valueasconceptid": {
                    "name": [
                        {
                            "lang": "",
                            "value": "Value as concept id"
                        }
                    ],
                    "disabledLangName": [
                        {
                            "lang": "en",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "de",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "fr",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "es",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "pt",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "zh",
                            "value": "",
                            "visible": true
                        }
                    ],
                    "type": "text",
                    "expression": "@MEAS.\"VALUE_AS_CONCEPT_ID\"",
                    "order": 18,
                    "domainFilter": "",
                    "standardConceptCodeFilter": ""
                },
                "unitconceptid": {
                    "name": [
                        {
                            "lang": "",
                            "value": "Unit concept id"
                        }
                    ],
                    "disabledLangName": [
                        {
                            "lang": "en",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "de",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "fr",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "es",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "pt",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "zh",
                            "value": "",
                            "visible": true
                        }
                    ],
                    "type": "text",
                    "expression": "@MEAS.\"UNIT_CONCEPT_ID\"",
                    "order": 19,
                    "domainFilter": "",
                    "standardConceptCodeFilter": ""
                },
                "meas_concept_name": {
                    "name": [
                        {
                            "lang": "",
                            "value": "Measurement concept name"
                        }
                    ],
                    "disabledLangName": [
                        {
                            "lang": "en",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "de",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "fr",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "es",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "pt",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "zh",
                            "value": "",
                            "visible": true
                        }
                    ],
                    "type": "text",
                    "expression": "@REF.concept_name",
                    "defaultPlaceholder": "@REF",
                    "defaultFilter": "@REF.concept_id = @MEAS.measurement_concept_id",
                    "referenceFilter": "@REF.DOMAIN_ID = 'Measurement' AND @REF.STANDARD_CONCEPT = 'S' AND JARO_SIMILARITY(lower(@REF.CONCEPT_NAME), lower('@SEARCH_QUERY')) >= 0.65",
                    "referenceExpression": "@REF.CONCEPT_NAME",
                    "order": 0,
                    "domainFilter": "",
                    "standardConceptCodeFilter": ""
                }
            }
        },
        "observation": {
            "name": [
                {
                    "lang": "",
                    "value": "Observation"
                }
            ],
            "disabledLangName": [
                {
                    "lang": "en",
                    "value": "",
                    "visible": true
                },
                {
                    "lang": "de",
                    "value": "",
                    "visible": true
                },
                {
                    "lang": "fr",
                    "value": "",
                    "visible": true
                },
                {
                    "lang": "es",
                    "value": "",
                    "visible": true
                },
                {
                    "lang": "pt",
                    "value": "",
                    "visible": true
                },
                {
                    "lang": "zh",
                    "value": "",
                    "visible": true
                }
            ],
            "defaultFilter": "1=1",
            "defaultPlaceholder": "@OBS",
            "order": 6,
            "parentInteraction": [
                "patient.interactions.visit"
            ],
            "parentInteractionLabel": "Visit Occurrence Parent",
            "attributes": {
                "obsdatetime": {
                    "name": [
                        {
                            "lang": "",
                            "value": "Observation Datetime"
                        }
                    ],
                    "disabledLangName": [
                        {
                            "lang": "en",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "de",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "fr",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "es",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "pt",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "zh",
                            "value": "",
                            "visible": true
                        }
                    ],
                    "type": "datetime",
                    "expression": "@OBS.\"OBSERVATION_DATETIME\"",
                    "order": 2,
                    "domainFilter": "",
                    "standardConceptCodeFilter": ""
                },
                "pid": {
                    "name": [
                        {
                            "lang": "",
                            "value": "Person id"
                        }
                    ],
                    "disabledLangName": [
                        {
                            "lang": "en",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "de",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "fr",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "es",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "pt",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "zh",
                            "value": "",
                            "visible": true
                        }
                    ],
                    "type": "text",
                    "expression": "@OBS.person_id",
                    "order": 3,
                    "domainFilter": "",
                    "standardConceptCodeFilter": ""
                },
                "obsdate": {
                    "name": [
                        {
                            "lang": "",
                            "value": "Observation Date"
                        }
                    ],
                    "disabledLangName": [
                        {
                            "lang": "en",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "de",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "fr",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "es",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "pt",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "zh",
                            "value": "",
                            "visible": true
                        }
                    ],
                    "type": "time",
                    "expression": "@OBS.\"OBSERVATION_DATE\"",
                    "order": 4,
                    "domainFilter": "",
                    "standardConceptCodeFilter": ""
                },
                "observationid": {
                    "name": [
                        {
                            "lang": "",
                            "value": "Observation Id"
                        }
                    ],
                    "disabledLangName": [
                        {
                            "lang": "en",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "de",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "fr",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "es",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "pt",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "zh",
                            "value": "",
                            "visible": true
                        }
                    ],
                    "type": "text",
                    "expression": "@OBS.\"OBSERVATION_ID\"",
                    "order": 5,
                    "domainFilter": "",
                    "standardConceptCodeFilter": ""
                },
                "verbatimtext": {
                    "name": [
                        {
                            "lang": "",
                            "value": "Value as string"
                        }
                    ],
                    "disabledLangName": [
                        {
                            "lang": "en",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "de",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "fr",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "es",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "pt",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "zh",
                            "value": "",
                            "visible": true
                        }
                    ],
                    "type": "text",
                    "expression": "@OBS.\"VALUE_AS_STRING\"",
                    "order": 9,
                    "domainFilter": "",
                    "standardConceptCodeFilter": ""
                },
                "numval": {
                    "name": [
                        {
                            "lang": "",
                            "value": "Value as number"
                        }
                    ],
                    "disabledLangName": [
                        {
                            "lang": "en",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "de",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "fr",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "es",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "pt",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "zh",
                            "value": "",
                            "visible": true
                        }
                    ],
                    "type": "num",
                    "expression": "@OBS.\"VALUE_AS_NUMBER\"",
                    "order": 10,
                    "domainFilter": "",
                    "standardConceptCodeFilter": ""
                },
                "obsconceptset": {
                    "name": [
                        {
                            "lang": "",
                            "value": "Observation concept set"
                        }
                    ],
                    "disabledLangName": [
                        {
                            "lang": "en",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "de",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "fr",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "es",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "pt",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "zh",
                            "value": "",
                            "visible": true
                        }
                    ],
                    "type": "conceptSet",
                    "expression": "@OBS.\"OBSERVATION_CONCEPT_ID\"",
                    "order": 13,
                    "domainFilter": "",
                    "standardConceptCodeFilter": "",
                    "useRefValue": true,
                    "useRefText": true
                },
                "observationtypeconceptid": {
                    "name": [
                        {
                            "lang": "",
                            "value": "Observation type concept id"
                        }
                    ],
                    "disabledLangName": [
                        {
                            "lang": "en",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "de",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "fr",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "es",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "pt",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "zh",
                            "value": "",
                            "visible": true
                        }
                    ],
                    "type": "text",
                    "expression": "@OBS.\"OBSERVATION_TYPE_CONCEPT_ID\"",
                    "referenceFilter": "@REF.DOMAIN_ID = 'Type Concept' AND @REF.CONCEPT_CLASS_ID = 'Observation Type' AND JARO_SIMILARITY(lower(@REF.CONCEPT_NAME), lower('@SEARCH_QUERY')) >= 0.65",
                    "referenceExpression": "CAST (@REF.CONCEPT_ID AS VARCHAR)",
                    "order": 18,
                    "domainFilter": "",
                    "standardConceptCodeFilter": "",
                    "useRefValue": true,
                    "useRefText": true
                },
                "observationtypeconceptset": {
                    "name": [
                        {
                            "lang": "",
                            "value": "Observation type concept set"
                        }
                    ],
                    "disabledLangName": [
                        {
                            "lang": "en",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "de",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "fr",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "es",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "pt",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "zh",
                            "value": "",
                            "visible": true
                        }
                    ],
                    "type": "conceptSet",
                    "expression": "@OBS.\"OBSERVATION_TYPE_CONCEPT_ID\"",
                    "order": 19,
                    "domainFilter": "",
                    "standardConceptCodeFilter": "",
                    "useRefValue": true,
                    "useRefText": true
                },
                "valueasconceptid": {
                    "name": [
                        {
                            "lang": "",
                            "value": "Value as concept id"
                        }
                    ],
                    "disabledLangName": [
                        {
                            "lang": "en",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "de",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "fr",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "es",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "pt",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "zh",
                            "value": "",
                            "visible": true
                        }
                    ],
                    "type": "text",
                    "expression": "@OBS.\"VALUE_AS_CONCEPT_ID\"",
                    "order": 20,
                    "domainFilter": "",
                    "standardConceptCodeFilter": ""
                },
                "valueasconceptset": {
                    "name": [
                        {
                            "lang": "",
                            "value": "Value as concept set"
                        }
                    ],
                    "disabledLangName": [
                        {
                            "lang": "en",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "de",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "fr",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "es",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "pt",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "zh",
                            "value": "",
                            "visible": true
                        }
                    ],
                    "type": "conceptSet",
                    "expression": "@OBS.\"VALUE_AS_CONCEPT_ID\"",
                    "order": 21,
                    "domainFilter": "",
                    "standardConceptCodeFilter": ""
                },
                "qualifierconceptid": {
                    "name": [
                        {
                            "lang": "",
                            "value": "Qualifier concept id"
                        }
                    ],
                    "disabledLangName": [
                        {
                            "lang": "en",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "de",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "fr",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "es",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "pt",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "zh",
                            "value": "",
                            "visible": true
                        }
                    ],
                    "type": "text",
                    "expression": "@OBS.\"QUALIFIER_CONCEPT_ID\"",
                    "referenceFilter": "@REF.DOMAIN_ID = 'Observation' AND @REF.STANDARD_CONCEPT = 'S' AND @REF.CONCEPT_CLASS_ID = 'Qualifier Value' AND JARO_SIMILARITY(CAST(@REF.CONCEPT_ID AS VARCHAR), '@SEARCH_QUERY') >= 0.85",
                    "referenceExpression": "@REF.CONCEPT_ID",
                    "order": 22,
                    "domainFilter": "",
                    "standardConceptCodeFilter": "",
                    "useRefValue": true,
                    "useRefText": true
                },
                "qualifierconceptset": {
                    "name": [
                        {
                            "lang": "",
                            "value": "Qualifier concept set"
                        }
                    ],
                    "disabledLangName": [
                        {
                            "lang": "en",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "de",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "fr",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "es",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "pt",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "zh",
                            "value": "",
                            "visible": true
                        }
                    ],
                    "type": "conceptSet",
                    "expression": "@OBS.\"QUALIFIER_CONCEPT_ID\"",
                    "order": 23,
                    "domainFilter": "",
                    "standardConceptCodeFilter": "",
                    "useRefValue": true,
                    "useRefText": true
                },
                "unitconceptid": {
                    "name": [
                        {
                            "lang": "",
                            "value": "Unit concept id"
                        }
                    ],
                    "disabledLangName": [
                        {
                            "lang": "en",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "de",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "fr",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "es",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "pt",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "zh",
                            "value": "",
                            "visible": true
                        }
                    ],
                    "type": "text",
                    "expression": "@OBS.\"UNIT_CONCEPT_ID\"",
                    "referenceFilter": "@REF.DOMAIN_ID = 'Unit' AND @REF.STANDARD_CONCEPT = 'S' AND JARO_SIMILARITY(lower(@REF.CONCEPT_NAME), lower('@SEARCH_QUERY')) >= 0.65",
                    "referenceExpression": "CAST (@REF.CONCEPT_ID AS VARCHAR)",
                    "order": 24,
                    "domainFilter": "",
                    "standardConceptCodeFilter": "",
                    "useRefValue": true,
                    "useRefText": true
                },
                "unitconceptset": {
                    "name": [
                        {
                            "lang": "",
                            "value": "Unit concept set"
                        }
                    ],
                    "disabledLangName": [
                        {
                            "lang": "en",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "de",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "fr",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "es",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "pt",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "zh",
                            "value": "",
                            "visible": true
                        }
                    ],
                    "type": "conceptSet",
                    "expression": "@OBS.\"UNIT_CONCEPT_ID\"",
                    "order": 25,
                    "domainFilter": "",
                    "standardConceptCodeFilter": "",
                    "useRefValue": true,
                    "useRefText": true
                },
                "obsconceptid": {
                    "name": [
                        {
                            "lang": "",
                            "value": "Observation concept id"
                        }
                    ],
                    "disabledLangName": [
                        {
                            "lang": "en",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "de",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "fr",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "es",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "pt",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "zh",
                            "value": "",
                            "visible": true
                        }
                    ],
                    "type": "text",
                    "expression": "@OBS.\"OBSERVATION_CONCEPT_ID\"",
                    "referenceFilter": "@REF.DOMAIN_ID = 'Observation' AND @REF.STANDARD_CONCEPT = 'S' AND JARO_SIMILARITY(CAST(@REF.CONCEPT_ID AS VARCHAR), '@SEARCH_QUERY') >= 0.85",
                    "referenceExpression": "@REF.CONCEPT_ID",
                    "order": 26,
                    "domainFilter": "",
                    "standardConceptCodeFilter": "",
                    "useRefValue": true,
                    "useRefText": true
                },
                "obs_concept_name": {
                    "name": [
                        {
                            "lang": "",
                            "value": "Observation concept name"
                        }
                    ],
                    "disabledLangName": [
                        {
                            "lang": "en",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "de",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "fr",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "es",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "pt",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "zh",
                            "value": "",
                            "visible": true
                        }
                    ],
                    "type": "text",
                    "expression": "@REF.concept_name",
                    "defaultPlaceholder": "@REF",
                    "defaultFilter": "@REF.concept_id = @OBS.observation_concept_id",
                    "referenceFilter": "@REF.DOMAIN_ID = 'Observation' AND @REF.STANDARD_CONCEPT = 'S' AND JARO_SIMILARITY(lower(@REF.CONCEPT_NAME), lower('@SEARCH_QUERY')) >= 0.65",
                    "referenceExpression": "@REF.CONCEPT_NAME",
                    "order": 0,
                    "domainFilter": "",
                    "standardConceptCodeFilter": ""
                }
            }
        },
        "obsperiod": {
            "name": [
                {
                    "lang": "",
                    "value": "Observation Period"
                }
            ],
            "disabledLangName": [
                {
                    "lang": "en",
                    "value": "",
                    "visible": true
                },
                {
                    "lang": "de",
                    "value": "",
                    "visible": true
                },
                {
                    "lang": "fr",
                    "value": "",
                    "visible": true
                },
                {
                    "lang": "es",
                    "value": "",
                    "visible": true
                },
                {
                    "lang": "pt",
                    "value": "",
                    "visible": true
                },
                {
                    "lang": "zh",
                    "value": "",
                    "visible": true
                }
            ],
            "defaultFilter": "1=1",
            "defaultPlaceholder": "@OBSPER",
            "order": 5,
            "parentInteraction": [],
            "parentInteractionLabel": "parent",
            "attributes": {
                "enddate": {
                    "name": [
                        {
                            "lang": "",
                            "value": "Observation Period End Date"
                        }
                    ],
                    "disabledLangName": [
                        {
                            "lang": "en",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "de",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "fr",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "es",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "pt",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "zh",
                            "value": "",
                            "visible": true
                        }
                    ],
                    "type": "time",
                    "expression": "@OBSPER.\"OBSERVATION_PERIOD_END_DATE\"",
                    "order": 0,
                    "domainFilter": "",
                    "standardConceptCodeFilter": ""
                },
                "startdate": {
                    "name": [
                        {
                            "lang": "",
                            "value": "Observation Period Start Date"
                        }
                    ],
                    "disabledLangName": [
                        {
                            "lang": "en",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "de",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "fr",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "es",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "pt",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "zh",
                            "value": "",
                            "visible": true
                        }
                    ],
                    "type": "time",
                    "expression": "@OBSPER.\"OBSERVATION_PERIOD_START_DATE\"",
                    "order": 1,
                    "domainFilter": "",
                    "standardConceptCodeFilter": ""
                },
                "pid": {
                    "name": [
                        {
                            "lang": "",
                            "value": "Person id"
                        }
                    ],
                    "disabledLangName": [
                        {
                            "lang": "en",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "de",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "fr",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "es",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "pt",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "zh",
                            "value": "",
                            "visible": true
                        }
                    ],
                    "type": "text",
                    "expression": "@OBSPER.person_id",
                    "order": 2,
                    "domainFilter": "",
                    "standardConceptCodeFilter": ""
                },
                "obsperiodid": {
                    "name": [
                        {
                            "lang": "",
                            "value": "Observation period Id"
                        }
                    ],
                    "disabledLangName": [
                        {
                            "lang": "en",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "de",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "fr",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "es",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "pt",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "zh",
                            "value": "",
                            "visible": true
                        }
                    ],
                    "type": "text",
                    "expression": "@OBSPER.\"OBSERVATION_PERIOD_ID\"",
                    "order": 4,
                    "domainFilter": "",
                    "standardConceptCodeFilter": ""
                },
                "periodtypeconceptid": {
                    "name": [
                        {
                            "lang": "",
                            "value": "Period type concept id"
                        }
                    ],
                    "disabledLangName": [
                        {
                            "lang": "en",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "de",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "fr",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "es",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "pt",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "zh",
                            "value": "",
                            "visible": true
                        }
                    ],
                    "type": "text",
                    "expression": "@OBSPER.\"PERIOD_TYPE_CONCEPT_ID\"",
                    "referenceFilter": "@REF.DOMAIN_ID = 'Type Concept' AND @REF.CONCEPT_CLASS_ID = 'Obs Period Type' AND JARO_SIMILARITY(lower(@REF.CONCEPT_NAME), lower('@SEARCH_QUERY')) >= 0.65",
                    "referenceExpression": "@REF.CONCEPT_ID",
                    "order": 6,
                    "domainFilter": "",
                    "standardConceptCodeFilter": "",
                    "useRefValue": true,
                    "useRefText": true
                },
                "periodtypeconceptset": {
                    "name": [
                        {
                            "lang": "",
                            "value": "Period type concept set"
                        }
                    ],
                    "disabledLangName": [
                        {
                            "lang": "en",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "de",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "fr",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "es",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "pt",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "zh",
                            "value": "",
                            "visible": true
                        }
                    ],
                    "type": "conceptSet",
                    "expression": "@OBSPER.\"PERIOD_TYPE_CONCEPT_ID\"",
                    "order": 7,
                    "domainFilter": "",
                    "standardConceptCodeFilter": "",
                    "useRefValue": true,
                    "useRefText": true
                }
            }
        },
        "ppperiod": {
            "name": [
                {
                    "lang": "",
                    "value": "Payer Plan Period"
                }
            ],
            "disabledLangName": [
                {
                    "lang": "en",
                    "value": "",
                    "visible": true
                },
                {
                    "lang": "de",
                    "value": "",
                    "visible": true
                },
                {
                    "lang": "fr",
                    "value": "",
                    "visible": true
                },
                {
                    "lang": "es",
                    "value": "",
                    "visible": true
                },
                {
                    "lang": "pt",
                    "value": "",
                    "visible": true
                },
                {
                    "lang": "zh",
                    "value": "",
                    "visible": true
                }
            ],
            "defaultFilter": "1=1",
            "defaultPlaceholder": "@PPPER",
            "order": 4,
            "parentInteraction": [],
            "parentInteractionLabel": "parent",
            "attributes": {
                "enddate": {
                    "name": [
                        {
                            "lang": "",
                            "value": "Payer Plan Period End Date"
                        }
                    ],
                    "disabledLangName": [
                        {
                            "lang": "en",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "de",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "fr",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "es",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "pt",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "zh",
                            "value": "",
                            "visible": true
                        }
                    ],
                    "type": "time",
                    "expression": "@PPPER.\"PAYER_PLAN_PERIOD_END_DATE\"",
                    "order": 0,
                    "domainFilter": "",
                    "standardConceptCodeFilter": ""
                },
                "startdate": {
                    "name": [
                        {
                            "lang": "",
                            "value": "Payer Plan Period Start Date"
                        }
                    ],
                    "disabledLangName": [
                        {
                            "lang": "en",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "de",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "fr",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "es",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "pt",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "zh",
                            "value": "",
                            "visible": true
                        }
                    ],
                    "type": "time",
                    "expression": "@PPPER.\"PAYER_PLAN_PERIOD_START_DATE\"",
                    "order": 1,
                    "domainFilter": "",
                    "standardConceptCodeFilter": ""
                },
                "pid": {
                    "name": [
                        {
                            "lang": "",
                            "value": "Person id"
                        }
                    ],
                    "disabledLangName": [
                        {
                            "lang": "en",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "de",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "fr",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "es",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "pt",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "zh",
                            "value": "",
                            "visible": true
                        }
                    ],
                    "type": "text",
                    "expression": "@PPPER.person_id",
                    "order": 2,
                    "domainFilter": "",
                    "standardConceptCodeFilter": ""
                },
                "ppperiodid": {
                    "name": [
                        {
                            "lang": "",
                            "value": "Payer Plan Period Id"
                        }
                    ],
                    "disabledLangName": [
                        {
                            "lang": "en",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "de",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "fr",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "es",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "pt",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "zh",
                            "value": "",
                            "visible": true
                        }
                    ],
                    "type": "text",
                    "expression": "@PPPER.\"PAYER_PLAN_PERIOD_ID\"",
                    "order": 3,
                    "domainFilter": "",
                    "standardConceptCodeFilter": ""
                }
            }
        },
        "proc": {
            "name": [
                {
                    "lang": "",
                    "value": "Procedure Occurrence"
                }
            ],
            "disabledLangName": [
                {
                    "lang": "en",
                    "value": "",
                    "visible": true
                },
                {
                    "lang": "de",
                    "value": "",
                    "visible": true
                },
                {
                    "lang": "fr",
                    "value": "",
                    "visible": true
                },
                {
                    "lang": "es",
                    "value": "",
                    "visible": true
                },
                {
                    "lang": "pt",
                    "value": "",
                    "visible": true
                },
                {
                    "lang": "zh",
                    "value": "",
                    "visible": true
                }
            ],
            "defaultFilter": "1=1",
            "defaultPlaceholder": "@PROC",
            "order": 3,
            "parentInteraction": [
                "patient.interactions.visit"
            ],
            "parentInteractionLabel": "Visit Occurrence Parent",
            "attributes": {
                "procdatetime": {
                    "name": [
                        {
                            "lang": "",
                            "value": "Procedure Datetime"
                        }
                    ],
                    "disabledLangName": [
                        {
                            "lang": "en",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "de",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "fr",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "es",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "pt",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "zh",
                            "value": "",
                            "visible": true
                        }
                    ],
                    "type": "datetime",
                    "expression": "@PROC.\"PROCEDURE_DATETIME\"",
                    "order": 1,
                    "domainFilter": "",
                    "standardConceptCodeFilter": ""
                },
                "procconceptid": {
                    "name": [
                        {
                            "lang": "",
                            "value": "Procedure Occurrence Id"
                        }
                    ],
                    "disabledLangName": [
                        {
                            "lang": "en",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "de",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "fr",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "es",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "pt",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "zh",
                            "value": "",
                            "visible": true
                        }
                    ],
                    "type": "text",
                    "expression": "@PROC.\"PROCEDURE_OCCURRENCE_ID\"",
                    "order": 2,
                    "domainFilter": "",
                    "standardConceptCodeFilter": ""
                },
                "procconceptset": {
                    "name": [
                        {
                            "lang": "",
                            "value": "Procedure Occurrence Concept Set"
                        }
                    ],
                    "disabledLangName": [
                        {
                            "lang": "en",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "de",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "fr",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "es",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "pt",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "zh",
                            "value": "",
                            "visible": true
                        }
                    ],
                    "type": "conceptSet",
                    "expression": "@PROC.\"PROCEDURE_OCCURRENCE_ID\"",
                    "order": 3,
                    "domainFilter": "",
                    "standardConceptCodeFilter": ""
                },
                "procdate": {
                    "name": [
                        {
                            "lang": "",
                            "value": "Procedure Date"
                        }
                    ],
                    "disabledLangName": [
                        {
                            "lang": "en",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "de",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "fr",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "es",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "pt",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "zh",
                            "value": "",
                            "visible": true
                        }
                    ],
                    "type": "time",
                    "expression": "@PROC.\"PROCEDURE_DATE\"",
                    "order": 4,
                    "domainFilter": "",
                    "standardConceptCodeFilter": ""
                },
                "qty": {
                    "name": [
                        {
                            "lang": "",
                            "value": "Quantity"
                        }
                    ],
                    "disabledLangName": [
                        {
                            "lang": "en",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "de",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "fr",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "es",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "pt",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "zh",
                            "value": "",
                            "visible": true
                        }
                    ],
                    "type": "num",
                    "expression": "@PROC.\"QUANTITY\"",
                    "order": 5,
                    "domainFilter": "",
                    "standardConceptCodeFilter": ""
                },
                "pid": {
                    "name": [
                        {
                            "lang": "",
                            "value": "Person id"
                        }
                    ],
                    "disabledLangName": [
                        {
                            "lang": "en",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "de",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "fr",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "es",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "pt",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "zh",
                            "value": "",
                            "visible": true
                        }
                    ],
                    "type": "text",
                    "expression": "@PROC.person_id",
                    "order": 8,
                    "domainFilter": "",
                    "standardConceptCodeFilter": ""
                },
                "proctypeconceptid": {
                    "name": [
                        {
                            "lang": "",
                            "value": "Procedure type concept id"
                        }
                    ],
                    "disabledLangName": [
                        {
                            "lang": "en",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "de",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "fr",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "es",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "pt",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "zh",
                            "value": "",
                            "visible": true
                        }
                    ],
                    "type": "text",
                    "expression": "@PROC.\"PROCEDURE_TYPE_CONCEPT_ID\"",
                    "referenceFilter": "@REF.DOMAIN_ID = 'Type Concept' AND @REF.CONCEPT_CLASS_ID = 'Procedure Type' AND JARO_SIMILARITY(lower(@REF.CONCEPT_NAME), lower('@SEARCH_QUERY')) >= 0.65",
                    "referenceExpression": "CAST (@REF.CONCEPT_ID AS VARCHAR)",
                    "order": 13,
                    "domainFilter": "",
                    "standardConceptCodeFilter": "",
                    "useRefValue": true,
                    "useRefText": true
                },
                "proctypeconceptset": {
                    "name": [
                        {
                            "lang": "",
                            "value": "Procedure type concept set"
                        }
                    ],
                    "disabledLangName": [
                        {
                            "lang": "en",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "de",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "fr",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "es",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "pt",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "zh",
                            "value": "",
                            "visible": true
                        }
                    ],
                    "type": "conceptSet",
                    "expression": "@PROC.\"PROCEDURE_TYPE_CONCEPT_ID\"",
                    "order": 15,
                    "domainFilter": "",
                    "standardConceptCodeFilter": "",
                    "useRefValue": true,
                    "useRefText": true
                },
                "modifierconceptid": {
                    "name": [
                        {
                            "lang": "",
                            "value": "Modifier concept id"
                        }
                    ],
                    "disabledLangName": [
                        {
                            "lang": "en",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "de",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "fr",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "es",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "pt",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "zh",
                            "value": "",
                            "visible": true
                        }
                    ],
                    "type": "text",
                    "expression": "@PROC.\"MODIFIER_CONCEPT_ID\"",
                    "order": 16,
                    "domainFilter": "",
                    "standardConceptCodeFilter": ""
                },
                "modifierconceptset": {
                    "name": [
                        {
                            "lang": "",
                            "value": "Modifier concept set"
                        }
                    ],
                    "disabledLangName": [
                        {
                            "lang": "en",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "de",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "fr",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "es",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "pt",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "zh",
                            "value": "",
                            "visible": true
                        }
                    ],
                    "type": "conceptSet",
                    "expression": "@PROC.\"MODIFIER_CONCEPT_ID\"",
                    "order": 17,
                    "domainFilter": "",
                    "standardConceptCodeFilter": ""
                },
                "proc_occ_concept_name": {
                    "name": [
                        {
                            "lang": "",
                            "value": "Procedure concept name"
                        }
                    ],
                    "disabledLangName": [
                        {
                            "lang": "en",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "de",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "fr",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "es",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "pt",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "zh",
                            "value": "",
                            "visible": true
                        }
                    ],
                    "type": "text",
                    "expression": "@REF.concept_name",
                    "defaultPlaceholder": "@REF",
                    "defaultFilter": "@REF.concept_id = @PROC.PROCEDURE_CONCEPT_ID",
                    "referenceFilter": "@REF.DOMAIN_ID = 'Procedure' AND @REF.STANDARD_CONCEPT = 'S' AND JARO_SIMILARITY(lower(@REF.CONCEPT_NAME), lower('@SEARCH_QUERY')) >= 0.65",
                    "referenceExpression": "@REF.CONCEPT_NAME",
                    "order": 0,
                    "domainFilter": "",
                    "standardConceptCodeFilter": ""
                },
                "Procedure_concept_id_copy_cf2468c2_0849_4d67_8fa7_e876aef757a1": {
                    "name": [
                        {
                            "lang": "",
                            "value": "Procedure concept id"
                        }
                    ],
                    "disabledLangName": [
                        {
                            "lang": "en",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "de",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "fr",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "es",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "pt",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "zh",
                            "value": "",
                            "visible": true
                        }
                    ],
                    "type": "text",
                    "expression": "@PROC.PROCEDURE_CONCEPT_ID",
                    "referenceFilter": "@REF.DOMAIN_ID = 'Procedure' AND @REF.STANDARD_CONCEPT = 'S' AND JARO_SIMILARITY(lower(@REF.CONCEPT_NAME), lower('@SEARCH_QUERY')) >= 0.65",
                    "referenceExpression": "CAST (@REF.CONCEPT_ID AS VARCHAR)",
                    "order": 14,
                    "domainFilter": "",
                    "standardConceptCodeFilter": "",
                    "useRefValue": true,
                    "useRefText": true
                }
            }
        },
        "specimen": {
            "name": [
                {
                    "lang": "",
                    "value": "Specimen"
                }
            ],
            "disabledLangName": [
                {
                    "lang": "en",
                    "value": "",
                    "visible": true
                },
                {
                    "lang": "de",
                    "value": "",
                    "visible": true
                },
                {
                    "lang": "fr",
                    "value": "",
                    "visible": true
                },
                {
                    "lang": "es",
                    "value": "",
                    "visible": true
                },
                {
                    "lang": "pt",
                    "value": "",
                    "visible": true
                },
                {
                    "lang": "zh",
                    "value": "",
                    "visible": true
                }
            ],
            "defaultFilter": "1=1",
            "defaultPlaceholder": "@SPEC",
            "order": 2,
            "parentInteraction": [],
            "parentInteractionLabel": "parent",
            "attributes": {
                "pid": {
                    "name": [
                        {
                            "lang": "",
                            "value": "Person id"
                        }
                    ],
                    "disabledLangName": [
                        {
                            "lang": "en",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "de",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "fr",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "es",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "pt",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "zh",
                            "value": "",
                            "visible": true
                        }
                    ],
                    "type": "text",
                    "expression": "@SPEC.person_id",
                    "order": 5,
                    "domainFilter": "",
                    "standardConceptCodeFilter": ""
                },
                "specimenid": {
                    "name": [
                        {
                            "lang": "",
                            "value": "Specimen Id"
                        }
                    ],
                    "disabledLangName": [
                        {
                            "lang": "en",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "de",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "fr",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "es",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "pt",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "zh",
                            "value": "",
                            "visible": true
                        }
                    ],
                    "type": "text",
                    "expression": "@SPEC.\"SPECIMEN_ID\"",
                    "order": 6,
                    "domainFilter": "",
                    "standardConceptCodeFilter": ""
                },
                "quantity": {
                    "name": [
                        {
                            "lang": "",
                            "value": "Quantity"
                        }
                    ],
                    "disabledLangName": [
                        {
                            "lang": "en",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "de",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "fr",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "es",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "pt",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "zh",
                            "value": "",
                            "visible": true
                        }
                    ],
                    "type": "num",
                    "expression": "@SPEC.\"QUANTITY\"",
                    "order": 8,
                    "domainFilter": "",
                    "standardConceptCodeFilter": ""
                },
                "specimendatetime": {
                    "name": [
                        {
                            "lang": "",
                            "value": "Specimen Datetime"
                        }
                    ],
                    "disabledLangName": [
                        {
                            "lang": "en",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "de",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "fr",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "es",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "pt",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "zh",
                            "value": "",
                            "visible": true
                        }
                    ],
                    "type": "datetime",
                    "expression": "@SPEC.\"SPECIMEN_DATETIME\"",
                    "order": 9,
                    "domainFilter": "",
                    "standardConceptCodeFilter": ""
                },
                "specimendate": {
                    "name": [
                        {
                            "lang": "",
                            "value": "Specimen Date"
                        }
                    ],
                    "disabledLangName": [
                        {
                            "lang": "en",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "de",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "fr",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "es",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "pt",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "zh",
                            "value": "",
                            "visible": true
                        }
                    ],
                    "type": "time",
                    "expression": "@SPEC.\"SPECIMEN_DATE\"",
                    "order": 10,
                    "domainFilter": "",
                    "standardConceptCodeFilter": ""
                },
                "specimenconceptid": {
                    "name": [
                        {
                            "lang": "",
                            "value": "Specimen concept id"
                        }
                    ],
                    "disabledLangName": [
                        {
                            "lang": "en",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "de",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "fr",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "es",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "pt",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "zh",
                            "value": "",
                            "visible": true
                        }
                    ],
                    "type": "text",
                    "expression": "@SPEC.\"SPECIMEN_CONCEPT_ID\"",
                    "referenceFilter": "@REF.DOMAIN_ID = 'Specimen' AND @REF.STANDARD_CONCEPT = 'S' AND JARO_SIMILARITY(lower(@REF.CONCEPT_NAME), lower('@SEARCH_QUERY')) >= 0.65",
                    "referenceExpression": "CAST (@REF.CONCEPT_ID AS VARCHAR)",
                    "order": 16,
                    "domainFilter": "",
                    "standardConceptCodeFilter": "",
                    "useRefValue": true,
                    "useRefText": true
                },
                "specimenconceptset": {
                    "name": [
                        {
                            "lang": "",
                            "value": "Specimen concept set"
                        }
                    ],
                    "disabledLangName": [
                        {
                            "lang": "en",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "de",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "fr",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "es",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "pt",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "zh",
                            "value": "",
                            "visible": true
                        }
                    ],
                    "type": "conceptSet",
                    "expression": "@SPEC.\"SPECIMEN_CONCEPT_ID\"",
                    "order": 17,
                    "domainFilter": "",
                    "standardConceptCodeFilter": "",
                    "useRefValue": true,
                    "useRefText": true
                },
                "specimentypeconceptid": {
                    "name": [
                        {
                            "lang": "",
                            "value": "Specimen type concept id"
                        }
                    ],
                    "disabledLangName": [
                        {
                            "lang": "en",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "de",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "fr",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "es",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "pt",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "zh",
                            "value": "",
                            "visible": true
                        }
                    ],
                    "type": "text",
                    "expression": "@SPEC.\"SPECIMEN_TYPE_CONCEPT_ID\"",
                    "referenceFilter": "@REF.DOMAIN_ID = 'Type Concept' AND @REF.CONCEPT_CLASS_ID = 'Specimen Type' AND JARO_SIMILARITY(lower(@REF.CONCEPT_NAME), lower('@SEARCH_QUERY')) >= 0.65",
                    "referenceExpression": "CAST (@REF.CONCEPT_ID AS VARCHAR)",
                    "order": 18,
                    "domainFilter": "",
                    "standardConceptCodeFilter": "",
                    "useRefValue": true,
                    "useRefText": true
                },
                "specimentypeconceptset": {
                    "name": [
                        {
                            "lang": "",
                            "value": "Specimen type concept set"
                        }
                    ],
                    "disabledLangName": [
                        {
                            "lang": "en",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "de",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "fr",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "es",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "pt",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "zh",
                            "value": "",
                            "visible": true
                        }
                    ],
                    "type": "conceptSet",
                    "expression": "@SPEC.\"SPECIMEN_TYPE_CONCEPT_ID\"",
                    "order": 19,
                    "domainFilter": "",
                    "standardConceptCodeFilter": "",
                    "useRefValue": true,
                    "useRefText": true
                },
                "anatomicsiteconceptid": {
                    "name": [
                        {
                            "lang": "",
                            "value": "Anatomic site concept id"
                        }
                    ],
                    "disabledLangName": [
                        {
                            "lang": "en",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "de",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "fr",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "es",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "pt",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "zh",
                            "value": "",
                            "visible": true
                        }
                    ],
                    "type": "text",
                    "expression": "@SPEC.\"ANATOMIC_SITE_CONCEPT_ID\"",
                    "referenceFilter": "@REF.DOMAIN_ID = 'Spec Anatomic Site' AND @REF.STANDARD_CONCEPT = 'S' AND JARO_SIMILARITY(lower(@REF.CONCEPT_NAME), lower('@SEARCH_QUERY')) >= 0.65",
                    "referenceExpression": "CAST (@REF.CONCEPT_ID AS VARCHAR)",
                    "order": 20,
                    "domainFilter": "",
                    "standardConceptCodeFilter": "",
                    "useRefValue": true,
                    "useRefText": true
                },
                "anatomicsiteconceptset": {
                    "name": [
                        {
                            "lang": "",
                            "value": "Anatomic site concept set"
                        }
                    ],
                    "disabledLangName": [
                        {
                            "lang": "en",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "de",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "fr",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "es",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "pt",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "zh",
                            "value": "",
                            "visible": true
                        }
                    ],
                    "type": "conceptSet",
                    "expression": "@SPEC.\"ANATOMIC_SITE_CONCEPT_ID\"",
                    "order": 21,
                    "domainFilter": "",
                    "standardConceptCodeFilter": "",
                    "useRefValue": true,
                    "useRefText": true
                },
                "diseasestatusconceptid": {
                    "name": [
                        {
                            "lang": "",
                            "value": "Disease status concept id"
                        }
                    ],
                    "disabledLangName": [
                        {
                            "lang": "en",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "de",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "fr",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "es",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "pt",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "zh",
                            "value": "",
                            "visible": true
                        }
                    ],
                    "type": "text",
                    "expression": "@SPEC.\"DISEASE_STATUS_CONCEPT_ID\"",
                    "referenceFilter": "@REF.DOMAIN_ID = 'Spec Disease Status' AND @REF.STANDARD_CONCEPT = 'S' AND JARO_SIMILARITY(lower(@REF.CONCEPT_NAME), lower('@SEARCH_QUERY')) >= 0.65",
                    "referenceExpression": "CAST (@REF.CONCEPT_ID AS VARCHAR)",
                    "order": 22,
                    "domainFilter": "",
                    "standardConceptCodeFilter": "",
                    "useRefValue": true,
                    "useRefText": true
                },
                "diseasestatusconceptset": {
                    "name": [
                        {
                            "lang": "",
                            "value": "Disease status concept set"
                        }
                    ],
                    "disabledLangName": [
                        {
                            "lang": "en",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "de",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "fr",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "es",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "pt",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "zh",
                            "value": "",
                            "visible": true
                        }
                    ],
                    "type": "conceptSet",
                    "expression": "@SPEC.\"DISEASE_STATUS_CONCEPT_ID\"",
                    "order": 23,
                    "domainFilter": "",
                    "standardConceptCodeFilter": "",
                    "useRefValue": true,
                    "useRefText": true
                },
                "unitconceptid": {
                    "name": [
                        {
                            "lang": "",
                            "value": "Unit concept id"
                        }
                    ],
                    "disabledLangName": [
                        {
                            "lang": "en",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "de",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "fr",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "es",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "pt",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "zh",
                            "value": "",
                            "visible": true
                        }
                    ],
                    "type": "text",
                    "expression": "@SPEC.\"UNIT_CONCEPT_ID\"",
                    "referenceFilter": "@REF.DOMAIN_ID = 'Unit' AND @REF.STANDARD_CONCEPT = 'S' AND JARO_SIMILARITY(lower(@REF.CONCEPT_NAME), lower('@SEARCH_QUERY')) >= 0.65",
                    "referenceExpression": "CAST (@REF.CONCEPT_ID AS VARCHAR)",
                    "order": 24,
                    "domainFilter": "",
                    "standardConceptCodeFilter": "",
                    "useRefValue": true,
                    "useRefText": true
                },
                "unitconceptset": {
                    "name": [
                        {
                            "lang": "",
                            "value": "Unit concept set"
                        }
                    ],
                    "disabledLangName": [
                        {
                            "lang": "en",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "de",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "fr",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "es",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "pt",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "zh",
                            "value": "",
                            "visible": true
                        }
                    ],
                    "type": "conceptSet",
                    "expression": "@SPEC.\"UNIT_CONCEPT_ID\"",
                    "order": 25,
                    "domainFilter": "",
                    "standardConceptCodeFilter": "",
                    "useRefValue": true,
                    "useRefText": true
                },
                "specimen_concept_name": {
                    "name": [
                        {
                            "lang": "",
                            "value": "Specimen concept name"
                        }
                    ],
                    "disabledLangName": [
                        {
                            "lang": "en",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "de",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "fr",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "es",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "pt",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "zh",
                            "value": "",
                            "visible": true
                        }
                    ],
                    "type": "text",
                    "expression": "@REF.concept_name",
                    "defaultPlaceholder": "@REF",
                    "defaultFilter": "@REF.concept_id = @SPEC.specimen_concept_id",
                    "referenceFilter": "@REF.DOMAIN_ID = 'Specimen' AND @REF.STANDARD_CONCEPT = 'S' AND JARO_SIMILARITY(lower(@REF.CONCEPT_NAME), lower('@SEARCH_QUERY')) >= 0.65",
                    "referenceExpression": "@REF.CONCEPT_NAME",
                    "order": 0,
                    "domainFilter": "",
                    "standardConceptCodeFilter": ""
                }
            }
        },
        "visit": {
            "name": [
                {
                    "lang": "",
                    "value": "Visit"
                }
            ],
            "disabledLangName": [
                {
                    "lang": "en",
                    "value": "",
                    "visible": true
                },
                {
                    "lang": "de",
                    "value": "",
                    "visible": true
                },
                {
                    "lang": "fr",
                    "value": "",
                    "visible": true
                },
                {
                    "lang": "es",
                    "value": "",
                    "visible": true
                },
                {
                    "lang": "pt",
                    "value": "",
                    "visible": true
                },
                {
                    "lang": "zh",
                    "value": "",
                    "visible": true
                }
            ],
            "defaultFilter": "1=1",
            "defaultPlaceholder": "@VISIT",
            "order": 0,
            "parentInteraction": [],
            "parentInteractionLabel": "parent",
            "attributes": {
                "enddate": {
                    "name": [
                        {
                            "lang": "",
                            "value": "Visit End Date"
                        }
                    ],
                    "disabledLangName": [
                        {
                            "lang": "en",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "de",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "fr",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "es",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "pt",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "zh",
                            "value": "",
                            "visible": true
                        }
                    ],
                    "type": "time",
                    "expression": "@VISIT.\"VISIT_END_DATE\"",
                    "order": 1,
                    "domainFilter": "",
                    "standardConceptCodeFilter": ""
                },
                "startdate": {
                    "name": [
                        {
                            "lang": "",
                            "value": "Visit Start Date"
                        }
                    ],
                    "disabledLangName": [
                        {
                            "lang": "en",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "de",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "fr",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "es",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "pt",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "zh",
                            "value": "",
                            "visible": true
                        }
                    ],
                    "type": "time",
                    "expression": "@VISIT.\"VISIT_START_DATE\"",
                    "order": 2,
                    "domainFilter": "",
                    "standardConceptCodeFilter": ""
                },
                "pid": {
                    "name": [
                        {
                            "lang": "",
                            "value": "Person id"
                        }
                    ],
                    "disabledLangName": [
                        {
                            "lang": "en",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "de",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "fr",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "es",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "pt",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "zh",
                            "value": "",
                            "visible": true
                        }
                    ],
                    "type": "text",
                    "expression": "@VISIT.person_id",
                    "order": 3,
                    "domainFilter": "",
                    "standardConceptCodeFilter": ""
                },
                "visitid": {
                    "name": [
                        {
                            "lang": "",
                            "value": "Visit occurrence Id"
                        }
                    ],
                    "disabledLangName": [
                        {
                            "lang": "en",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "de",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "fr",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "es",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "pt",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "zh",
                            "value": "",
                            "visible": true
                        }
                    ],
                    "type": "text",
                    "expression": "@VISIT.\"VISIT_OCCURRENCE_ID\"",
                    "order": 6,
                    "domainFilter": "",
                    "standardConceptCodeFilter": ""
                },
                "visittypeconceptset": {
                    "name": [
                        {
                            "lang": "",
                            "value": "Visit type concept set"
                        }
                    ],
                    "disabledLangName": [
                        {
                            "lang": "en",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "de",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "fr",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "es",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "pt",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "zh",
                            "value": "",
                            "visible": true
                        }
                    ],
                    "type": "conceptSet",
                    "expression": "@VISIT.\"VISIT_TYPE_CONCEPT_ID\"",
                    "order": 9,
                    "domainFilter": "",
                    "standardConceptCodeFilter": "",
                    "useRefValue": true,
                    "useRefText": true
                },
                "visitconceptid": {
                    "name": [
                        {
                            "lang": "",
                            "value": "Visit concept Id"
                        }
                    ],
                    "disabledLangName": [
                        {
                            "lang": "en",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "de",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "fr",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "es",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "pt",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "zh",
                            "value": "",
                            "visible": true
                        }
                    ],
                    "type": "text",
                    "expression": "@VISIT.\"VISIT_CONCEPT_ID\"",
                    "referenceFilter": "@REF.DOMAIN_ID = 'Visit' AND @REF.STANDARD_CONCEPT = 'S' AND JARO_SIMILARITY(lower(@REF.CONCEPT_NAME), lower('@SEARCH_QUERY')) >= 0.65",
                    "referenceExpression": "CAST (@REF.CONCEPT_ID AS VARCHAR)",
                    "order": 10,
                    "domainFilter": "",
                    "standardConceptCodeFilter": "",
                    "useRefValue": true,
                    "useRefText": true
                },
                "visitconceptset": {
                    "name": [
                        {
                            "lang": "",
                            "value": "Visit concept set"
                        }
                    ],
                    "disabledLangName": [
                        {
                            "lang": "en",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "de",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "fr",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "es",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "pt",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "zh",
                            "value": "",
                            "visible": true
                        }
                    ],
                    "type": "conceptSet",
                    "expression": "@VISIT.\"VISIT_CONCEPT_ID\"",
                    "order": 11,
                    "domainFilter": "",
                    "standardConceptCodeFilter": "",
                    "useRefValue": true,
                    "useRefText": true
                },
                "visittypeconceptid": {
                    "name": [
                        {
                            "lang": "",
                            "value": "Visit type concept id"
                        }
                    ],
                    "disabledLangName": [
                        {
                            "lang": "en",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "de",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "fr",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "es",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "pt",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "zh",
                            "value": "",
                            "visible": true
                        }
                    ],
                    "type": "text",
                    "expression": "@VISIT.\"VISIT_TYPE_CONCEPT_ID\"",
                    "referenceFilter": "@REF.DOMAIN_ID = 'Type Concept' AND @REF.CONCEPT_CLASS_ID = 'Visit Type' AND JARO_SIMILARITY(CAST(@REF.CONCEPT_ID AS VARCHAR), '@SEARCH_QUERY') >= 0.85",
                    "referenceExpression": "@REF.CONCEPT_ID",
                    "order": 12,
                    "domainFilter": "",
                    "standardConceptCodeFilter": "",
                    "useRefValue": true,
                    "useRefText": true
                },
                "visit_occ_concept_name": {
                    "name": [
                        {
                            "lang": "",
                            "value": "Visit concept name"
                        }
                    ],
                    "disabledLangName": [
                        {
                            "lang": "en",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "de",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "fr",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "es",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "pt",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "zh",
                            "value": "",
                            "visible": true
                        }
                    ],
                    "type": "text",
                    "expression": "@REF.concept_name",
                    "defaultPlaceholder": "@REF",
                    "defaultFilter": "@REF.concept_id = @VISIT.VISIT_CONCEPT_ID",
                    "referenceFilter": "@REF.DOMAIN_ID = 'Visit' AND @REF.STANDARD_CONCEPT = 'S' AND JARO_SIMILARITY(lower(@REF.CONCEPT_NAME), lower('@SEARCH_QUERY')) >= 0.65",
                    "referenceExpression": "@REF.CONCEPT_NAME",
                    "order": 0,
                    "domainFilter": "",
                    "standardConceptCodeFilter": ""
                }
            }
        },
        "Consent_74db26d2_bb75_489a_a841_051c85dc897b": {
            "name": [
                {
                    "lang": "",
                    "value": "Consent"
                }
            ],
            "disabledLangName": [
                {
                    "lang": "de",
                    "value": "",
                    "visible": true
                },
                {
                    "lang": "fr",
                    "value": "",
                    "visible": true
                },
                {
                    "lang": "es",
                    "value": "",
                    "visible": true
                },
                {
                    "lang": "pt",
                    "value": "",
                    "visible": true
                },
                {
                    "lang": "zh",
                    "value": "",
                    "visible": true
                },
                {
                    "lang": "en",
                    "value": "",
                    "visible": true
                }
            ],
            "defaultFilter": "1=1",
            "defaultPlaceholder": "@CONSENT",
            "order": 8,
            "parentInteraction": [
                "patient.interactions.Consent_74db26d2_bb75_489a_a841_051c85dc897b"
            ],
            "parentInteractionLabel": "parent",
            "attributes": {
                "consentdatetime": {
                    "name": [
                        {
                            "lang": "",
                            "value": "Consent Datetime"
                        }
                    ],
                    "disabledLangName": [
                        {
                            "lang": "en",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "de",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "fr",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "es",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "pt",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "zh",
                            "value": "",
                            "visible": true
                        }
                    ],
                    "type": "datetime",
                    "expression": "@CONSENT.\"CREATED_AT\"",
                    "order": 0,
                    "domainFilter": "",
                    "standardConceptCodeFilter": ""
                },
                "pid": {
                    "name": [
                        {
                            "lang": "",
                            "value": "Person id"
                        }
                    ],
                    "disabledLangName": [
                        {
                            "lang": "de",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "fr",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "es",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "pt",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "zh",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "en",
                            "value": ""
                        }
                    ],
                    "type": "text",
                    "expression": "@CONSENT.\"PERSON_ID\"",
                    "order": 1,
                    "domainFilter": "",
                    "standardConceptCodeFilter": ""
                },
                "parentconsentdetailid": {
                    "name": [
                        {
                            "lang": "",
                            "value": "Parent Consent Detail Id"
                        }
                    ],
                    "disabledLangName": [
                        {
                            "lang": "de",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "fr",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "es",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "pt",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "zh",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "en",
                            "value": ""
                        }
                    ],
                    "type": "text",
                    "expression": "@CONSENT.\"PARENT_CONSENT_DETAIL_ID\"",
                    "order": 2,
                    "domainFilter": "",
                    "standardConceptCodeFilter": ""
                },
                "status": {
                    "name": [
                        {
                            "lang": "",
                            "value": "Status"
                        }
                    ],
                    "disabledLangName": [
                        {
                            "lang": "de",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "fr",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "es",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "pt",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "zh",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "en",
                            "value": ""
                        }
                    ],
                    "type": "text",
                    "expression": "@CONSENT.\"STATUS\"",
                    "order": 3,
                    "domainFilter": "",
                    "standardConceptCodeFilter": ""
                },
                "textval": {
                    "name": [
                        {
                            "lang": "",
                            "value": "Value"
                        }
                    ],
                    "disabledLangName": [
                        {
                            "lang": "de",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "fr",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "es",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "pt",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "zh",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "en",
                            "value": ""
                        }
                    ],
                    "type": "text",
                    "expression": "@CONSENT.\"VALUE\"",
                    "order": 4,
                    "domainFilter": "",
                    "standardConceptCodeFilter": ""
                },
                "consentcategory": {
                    "name": [
                        {
                            "lang": "",
                            "value": "Category"
                        }
                    ],
                    "disabledLangName": [
                        {
                            "lang": "de",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "fr",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "es",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "pt",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "zh",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "en",
                            "value": ""
                        }
                    ],
                    "type": "text",
                    "expression": "@CONSENT.\"TYPE\"",
                    "order": 5,
                    "domainFilter": "",
                    "standardConceptCodeFilter": ""
                },
                "New_Attribute_1_3d0da2a3_f0de_4112_b87c_e7aff266c0d8": {
                    "name": [
                        {
                            "lang": "",
                            "value": "Attribute"
                        }
                    ],
                    "disabledLangName": [
                        {
                            "lang": "de",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "fr",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "es",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "pt",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "zh",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "en",
                            "value": ""
                        }
                    ],
                    "type": "text",
                    "expression": "@CONSENT.\"ATTRIBUTE\"",
                    "order": 6,
                    "domainFilter": "",
                    "standardConceptCodeFilter": ""
                },
                "Attribute_copy_53f290b7_70e9_4c1e_bd6d_605bc916ce66": {
                    "name": [
                        {
                            "lang": "",
                            "value": "Attribute Group Id"
                        }
                    ],
                    "disabledLangName": [
                        {
                            "lang": "de",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "fr",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "es",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "pt",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "zh",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "en",
                            "value": ""
                        }
                    ],
                    "type": "text",
                    "expression": "@CONSENT.\"ATTRIBUTE_GROUP_ID\"",
                    "order": 7,
                    "domainFilter": "",
                    "standardConceptCodeFilter": ""
                },
                "Consent_Id_copy_60a4adeb_1e84_4f04_b7d5_8eb1c006f56d": {
                    "name": [
                        {
                            "lang": "",
                            "value": "Consent Detail Id"
                        }
                    ],
                    "disabledLangName": [
                        {
                            "lang": "de",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "fr",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "es",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "pt",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "zh",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "en",
                            "value": ""
                        }
                    ],
                    "type": "text",
                    "expression": "@CONSENT.\"CONSENT_DETAIL_ID\"",
                    "order": 8,
                    "domainFilter": "",
                    "standardConceptCodeFilter": ""
                }
            }
        },
        "questionnaire": {
            "name": [
                {
                    "lang": "",
                    "value": "Questionnaire"
                }
            ],
            "disabledLangName": [
                {
                    "lang": "de",
                    "value": "",
                    "visible": true
                },
                {
                    "lang": "fr",
                    "value": "",
                    "visible": true
                },
                {
                    "lang": "es",
                    "value": "",
                    "visible": true
                },
                {
                    "lang": "pt",
                    "value": "",
                    "visible": true
                },
                {
                    "lang": "zh",
                    "value": "",
                    "visible": true
                },
                {
                    "lang": "en",
                    "value": "",
                    "visible": true
                }
            ],
            "defaultFilter": "1=1",
            "defaultPlaceholder": "@RESPONSE",
            "order": 1,
            "parentInteraction": [],
            "parentInteractionLabel": "parent",
            "attributes": {
                "linkID": {
                    "name": [
                        {
                            "lang": "",
                            "value": "Link ID"
                        }
                    ],
                    "disabledLangName": [
                        {
                            "lang": "en",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "de",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "fr",
                            "value": ""
                        },
                        {
                            "lang": "es",
                            "value": ""
                        },
                        {
                            "lang": "pt",
                            "value": ""
                        },
                        {
                            "lang": "zh",
                            "value": ""
                        }
                    ],
                    "type": "text",
                    "expression": "@RESPONSE.\"LINK_ID\"",
                    "order": 0,
                    "domainFilter": "",
                    "standardConceptCodeFilter": ""
                },
                "valueCodingValue": {
                    "name": [
                        {
                            "lang": "",
                            "value": "Value coding value"
                        }
                    ],
                    "disabledLangName": [
                        {
                            "lang": "en",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "de",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "fr",
                            "value": ""
                        },
                        {
                            "lang": "es",
                            "value": ""
                        },
                        {
                            "lang": "pt",
                            "value": ""
                        },
                        {
                            "lang": "zh",
                            "value": ""
                        }
                    ],
                    "type": "text",
                    "expression": "@RESPONSE.\"VALUECODING_CODE\"",
                    "order": 1,
                    "domainFilter": "",
                    "standardConceptCodeFilter": ""
                },
                "recordID": {
                    "name": [
                        {
                            "lang": "",
                            "value": "Record ID"
                        }
                    ],
                    "disabledLangName": [
                        {
                            "lang": "en",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "de",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "fr",
                            "value": ""
                        },
                        {
                            "lang": "es",
                            "value": ""
                        },
                        {
                            "lang": "pt",
                            "value": ""
                        },
                        {
                            "lang": "zh",
                            "value": ""
                        }
                    ],
                    "type": "text",
                    "expression": "@RESPONSE.\"ID\"",
                    "order": 2,
                    "domainFilter": "",
                    "standardConceptCodeFilter": ""
                },
                "questionnaireLanguage": {
                    "name": [
                        {
                            "lang": "",
                            "value": "Questionnaire language"
                        }
                    ],
                    "disabledLangName": [
                        {
                            "lang": "en",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "de",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "fr",
                            "value": ""
                        },
                        {
                            "lang": "es",
                            "value": ""
                        },
                        {
                            "lang": "pt",
                            "value": ""
                        },
                        {
                            "lang": "zh",
                            "value": ""
                        }
                    ],
                    "type": "text",
                    "expression": "@RESPONSE.\"LANGUAGE\"",
                    "order": 3,
                    "domainFilter": "",
                    "standardConceptCodeFilter": ""
                },
                "questionnaireStatus": {
                    "name": [
                        {
                            "lang": "",
                            "value": "Questionnaire status"
                        }
                    ],
                    "disabledLangName": [
                        {
                            "lang": "en",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "de",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "fr",
                            "value": ""
                        },
                        {
                            "lang": "es",
                            "value": ""
                        },
                        {
                            "lang": "pt",
                            "value": ""
                        },
                        {
                            "lang": "zh",
                            "value": ""
                        }
                    ],
                    "type": "text",
                    "expression": "@RESPONSE.\"STATUS\"",
                    "order": 4,
                    "domainFilter": "",
                    "standardConceptCodeFilter": ""
                },
                "questionnaireAuthored": {
                    "name": [
                        {
                            "lang": "",
                            "value": "Questionnaire authored"
                        }
                    ],
                    "disabledLangName": [
                        {
                            "lang": "en",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "de",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "fr",
                            "value": ""
                        },
                        {
                            "lang": "es",
                            "value": ""
                        },
                        {
                            "lang": "pt",
                            "value": ""
                        },
                        {
                            "lang": "zh",
                            "value": ""
                        }
                    ],
                    "type": "text",
                    "expression": "@RESPONSE.\"AUTHORED\"",
                    "order": 5,
                    "domainFilter": "",
                    "standardConceptCodeFilter": ""
                },
                "text": {
                    "name": [
                        {
                            "lang": "",
                            "value": "Text"
                        }
                    ],
                    "disabledLangName": [
                        {
                            "lang": "en",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "de",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "fr",
                            "value": ""
                        },
                        {
                            "lang": "es",
                            "value": ""
                        },
                        {
                            "lang": "pt",
                            "value": ""
                        },
                        {
                            "lang": "zh",
                            "value": ""
                        }
                    ],
                    "type": "text",
                    "expression": "@RESPONSE.\"TEXT\"",
                    "order": 6,
                    "domainFilter": "",
                    "standardConceptCodeFilter": ""
                },
                "valueType": {
                    "name": [
                        {
                            "lang": "",
                            "value": "Value type"
                        }
                    ],
                    "disabledLangName": [
                        {
                            "lang": "en",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "de",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "fr",
                            "value": ""
                        },
                        {
                            "lang": "es",
                            "value": ""
                        },
                        {
                            "lang": "pt",
                            "value": ""
                        },
                        {
                            "lang": "zh",
                            "value": ""
                        }
                    ],
                    "type": "text",
                    "expression": "@RESPONSE.\"VALUE_TYPE\"",
                    "order": 7,
                    "domainFilter": "",
                    "standardConceptCodeFilter": ""
                },
                "value": {
                    "name": [
                        {
                            "lang": "",
                            "value": "Value"
                        }
                    ],
                    "disabledLangName": [
                        {
                            "lang": "en",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "de",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "fr",
                            "value": ""
                        },
                        {
                            "lang": "es",
                            "value": ""
                        },
                        {
                            "lang": "pt",
                            "value": ""
                        },
                        {
                            "lang": "zh",
                            "value": ""
                        }
                    ],
                    "type": "text",
                    "expression": "@RESPONSE.\"VALUE\"",
                    "order": 8,
                    "domainFilter": "",
                    "standardConceptCodeFilter": ""
                },
                "questionnaireReference": {
                    "name": [
                        {
                            "lang": "",
                            "value": "Questionnaire reference"
                        }
                    ],
                    "disabledLangName": [
                        {
                            "lang": "en",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "de",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "fr",
                            "value": ""
                        },
                        {
                            "lang": "es",
                            "value": ""
                        },
                        {
                            "lang": "pt",
                            "value": ""
                        },
                        {
                            "lang": "zh",
                            "value": ""
                        }
                    ],
                    "type": "text",
                    "expression": "@RESPONSE.\"QUESTIONNAIRE_REFERENCE\"",
                    "order": 9,
                    "domainFilter": "",
                    "standardConceptCodeFilter": ""
                },
                "questionnaireVersion": {
                    "name": [
                        {
                            "lang": "",
                            "value": "Questionnaire version"
                        }
                    ],
                    "disabledLangName": [
                        {
                            "lang": "en",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "de",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "fr",
                            "value": ""
                        },
                        {
                            "lang": "es",
                            "value": ""
                        },
                        {
                            "lang": "pt",
                            "value": ""
                        },
                        {
                            "lang": "zh",
                            "value": ""
                        }
                    ],
                    "type": "text",
                    "expression": "@RESPONSE.\"QUESTIONNAIRE_VERSION\"",
                    "order": 10,
                    "domainFilter": "",
                    "standardConceptCodeFilter": ""
                },
                "extensionEffectiveDateUrl": {
                    "name": [
                        {
                            "lang": "",
                            "value": "Questionaire extension effective date url"
                        }
                    ],
                    "disabledLangName": [
                        {
                            "lang": "en",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "de",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "fr",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "es",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "pt",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "zh",
                            "value": "",
                            "visible": true
                        }
                    ],
                    "type": "text",
                    "expression": "@RESPONSE.\"EXTENSION_EFFECTIVE_DATE_URL\"",
                    "order": 11,
                    "domainFilter": "",
                    "standardConceptCodeFilter": ""
                },
                "extensionValuedate": {
                    "name": [
                        {
                            "lang": "",
                            "value": "Questionaire extension valuedate"
                        }
                    ],
                    "disabledLangName": [
                        {
                            "lang": "en",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "de",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "fr",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "es",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "pt",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "zh",
                            "value": "",
                            "visible": true
                        }
                    ],
                    "type": "text",
                    "expression": "@RESPONSE.\"EXTENSION_VALUEDATE\"",
                    "order": 12,
                    "domainFilter": "",
                    "standardConceptCodeFilter": ""
                }
            }
        },
        "cohort": {
            "name": [
                {
                    "lang": "",
                    "value": "Cohort"
                }
            ],
            "disabledLangName": [
                {
                    "lang": "en",
                    "value": "",
                    "visible": true
                },
                {
                    "lang": "de",
                    "value": "",
                    "visible": true
                },
                {
                    "lang": "fr",
                    "value": "",
                    "visible": true
                },
                {
                    "lang": "es",
                    "value": "",
                    "visible": true
                },
                {
                    "lang": "pt",
                    "value": "",
                    "visible": true
                },
                {
                    "lang": "zh",
                    "value": "",
                    "visible": true
                }
            ],
            "defaultFilter": "1=1",
            "defaultPlaceholder": "@COHORT",
            "order": 16,
            "parentInteraction": [],
            "parentInteractionLabel": "parent",
            "attributes": {
                "cohortdefinitionid": {
                    "name": [
                        {
                            "lang": "",
                            "value": "Cohort Definition Id"
                        }
                    ],
                    "disabledLangName": [
                        {
                            "lang": "en",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "de",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "fr",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "es",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "pt",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "zh",
                            "value": "",
                            "visible": true
                        }
                    ],
                    "type": "num",
                    "expression": "@COHORT.\"cohort_definition_id\"",
                    "order": 0,
                    "domainFilter": "",
                    "standardConceptCodeFilter": "",
                    "useRefValue": true,
                    "useRefText": true
                },
                "pid": {
                    "name": [
                        {
                            "lang": "",
                            "value": "Subject Id"
                        }
                    ],
                    "disabledLangName": [
                        {
                            "lang": "en",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "de",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "fr",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "es",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "pt",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "zh",
                            "value": "",
                            "visible": true
                        }
                    ],
                    "type": "text",
                    "expression": "@COHORT.\"subject_id\"",
                    "order": 1,
                    "domainFilter": "",
                    "standardConceptCodeFilter": ""
                },
                "enddate": {
                    "name": [
                        {
                            "lang": "",
                            "value": "End Date"
                        }
                    ],
                    "disabledLangName": [
                        {
                            "lang": "en",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "de",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "fr",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "es",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "pt",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "zh",
                            "value": "",
                            "visible": true
                        }
                    ],
                    "type": "time",
                    "expression": "@COHORT.\"cohort_end_date\"",
                    "order": 2,
                    "domainFilter": "",
                    "standardConceptCodeFilter": ""
                },
                "startdate": {
                    "name": [
                        {
                            "lang": "",
                            "value": "Start Date"
                        }
                    ],
                    "disabledLangName": [
                        {
                            "lang": "en",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "de",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "fr",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "es",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "pt",
                            "value": "",
                            "visible": true
                        },
                        {
                            "lang": "zh",
                            "value": "",
                            "visible": true
                        }
                    ],
                    "type": "time",
                    "expression": "@COHORT.\"cohort_start_date\"",
                    "order": 3,
                    "domainFilter": "",
                    "standardConceptCodeFilter": ""
                }
            }
        }
    },
    "attributes": {
        "pid": {
            "name": [
                {
                    "lang": "",
                    "value": "Person id"
                }
            ],
            "disabledLangName": [
                {
                    "lang": "en",
                    "value": ""
                },
                {
                    "lang": "de",
                    "value": ""
                },
                {
                    "lang": "fr",
                    "value": ""
                },
                {
                    "lang": "es",
                    "value": ""
                },
                {
                    "lang": "pt",
                    "value": ""
                },
                {
                    "lang": "zh",
                    "value": ""
                }
            ],
            "type": "text",
            "expression": "@PATIENT.\"person_id\"",
            "order": 0,
            "annotations": [
                "person_id"
            ],
            "domainFilter": "",
            "standardConceptCodeFilter": ""
        },
        "pcount": {
            "name": [
                {
                    "lang": "",
                    "value": "Patient Count"
                }
            ],
            "disabledLangName": [
                {
                    "lang": "en",
                    "value": ""
                },
                {
                    "lang": "de",
                    "value": ""
                },
                {
                    "lang": "fr",
                    "value": ""
                },
                {
                    "lang": "es",
                    "value": ""
                },
                {
                    "lang": "pt",
                    "value": ""
                },
                {
                    "lang": "zh",
                    "value": ""
                }
            ],
            "type": "num",
            "measureExpression": "COUNT(DISTINCT(@PATIENT.\"person_id\"))",
            "order": 1,
            "domainFilter": "",
            "standardConceptCodeFilter": ""
        },
        "monthOfBirth": {
            "name": [
                {
                    "lang": "",
                    "value": "Month of Birth"
                }
            ],
            "disabledLangName": [
                {
                    "lang": "en",
                    "value": ""
                },
                {
                    "lang": "de",
                    "value": ""
                },
                {
                    "lang": "fr",
                    "value": ""
                },
                {
                    "lang": "es",
                    "value": ""
                },
                {
                    "lang": "pt",
                    "value": ""
                },
                {
                    "lang": "zh",
                    "value": ""
                }
            ],
            "type": "num",
            "expression": "@PATIENT.\"MONTH_OF_BIRTH\"",
            "order": 2,
            "domainFilter": "",
            "standardConceptCodeFilter": ""
        },
        "yearOfBirth": {
            "name": [
                {
                    "lang": "",
                    "value": "Year of Birth"
                }
            ],
            "disabledLangName": [
                {
                    "lang": "en",
                    "value": ""
                },
                {
                    "lang": "de",
                    "value": ""
                },
                {
                    "lang": "fr",
                    "value": ""
                },
                {
                    "lang": "es",
                    "value": ""
                },
                {
                    "lang": "pt",
                    "value": ""
                },
                {
                    "lang": "zh",
                    "value": ""
                }
            ],
            "type": "num",
            "expression": "@PATIENT.\"YEAR_OF_BIRTH\"",
            "order": 3,
            "domainFilter": "",
            "standardConceptCodeFilter": ""
        },
        "dateOfBirth": {
            "name": [
                {
                    "lang": "",
                    "value": "Birth Datetime"
                }
            ],
            "disabledLangName": [
                {
                    "lang": "en",
                    "value": ""
                },
                {
                    "lang": "de",
                    "value": ""
                },
                {
                    "lang": "fr",
                    "value": ""
                },
                {
                    "lang": "es",
                    "value": ""
                },
                {
                    "lang": "pt",
                    "value": ""
                },
                {
                    "lang": "zh",
                    "value": ""
                }
            ],
            "type": "datetime",
            "expression": "@PATIENT.\"birth_datetime\"",
            "order": 4,
            "annotations": [
                "birth_datetime"
            ],
            "domainFilter": "",
            "standardConceptCodeFilter": ""
        },
        "ethnicityconceptid": {
            "name": [
                {
                    "lang": "",
                    "value": "Ethnicity concept id"
                }
            ],
            "disabledLangName": [
                {
                    "lang": "en",
                    "value": "",
                    "visible": true
                },
                {
                    "lang": "de",
                    "value": "",
                    "visible": true
                },
                {
                    "lang": "fr",
                    "value": "",
                    "visible": true
                },
                {
                    "lang": "es",
                    "value": "",
                    "visible": true
                },
                {
                    "lang": "pt",
                    "value": "",
                    "visible": true
                },
                {
                    "lang": "zh",
                    "value": "",
                    "visible": true
                }
            ],
            "type": "text",
            "expression": "@PATIENT.\"ethnicity_concept_id\"",
            "referenceFilter": "@REF.DOMAIN_ID = 'Ethnicity' AND @REF.STANDARD_CONCEPT = 'S' AND JARO_SIMILARITY(lower(@REF.CONCEPT_NAME), lower('@SEARCH_QUERY')) >= 0.65",
            "referenceExpression": "@REF.CONCEPT_NAME",
            "order": 8,
            "domainFilter": "",
            "standardConceptCodeFilter": "",
            "useRefValue": true
        },
        "locationid": {
            "name": [
                {
                    "lang": "",
                    "value": "Location id"
                }
            ],
            "disabledLangName": [
                {
                    "lang": "en",
                    "value": "",
                    "visible": true
                },
                {
                    "lang": "de",
                    "value": "",
                    "visible": true
                },
                {
                    "lang": "fr",
                    "value": "",
                    "visible": true
                },
                {
                    "lang": "es",
                    "value": "",
                    "visible": true
                },
                {
                    "lang": "pt",
                    "value": "",
                    "visible": true
                },
                {
                    "lang": "zh",
                    "value": "",
                    "visible": true
                }
            ],
            "type": "text",
            "expression": "@PATIENT.\"location_id\"",
            "order": 9,
            "domainFilter": "",
            "standardConceptCodeFilter": ""
        },
        "gendersourcevalue": {
            "name": [
                {
                    "lang": "",
                    "value": "Gender source value"
                }
            ],
            "disabledLangName": [
                {
                    "lang": "en",
                    "value": "",
                    "visible": true
                },
                {
                    "lang": "de",
                    "value": "",
                    "visible": true
                },
                {
                    "lang": "fr",
                    "value": "",
                    "visible": true
                },
                {
                    "lang": "es",
                    "value": "",
                    "visible": true
                },
                {
                    "lang": "pt",
                    "value": "",
                    "visible": true
                },
                {
                    "lang": "zh",
                    "value": "",
                    "visible": true
                }
            ],
            "type": "text",
            "expression": "@PATIENT.\"gender_source_value\"",
            "referenceFilter": "@REF.DOMAIN_ID = 'Gender' AND @REF.STANDARD_CONCEPT = 'S' AND JARO_SIMILARITY(CAST(@REF.CONCEPT_CODE AS VARCHAR), '@SEARCH_QUERY') >= 0.85",
            "referenceExpression": "@REF.CONCEPT_CODE",
            "order": 11,
            "domainFilter": "",
            "standardConceptCodeFilter": "",
            "useRefValue": true,
            "useRefText": true
        },
        "racesourcevalue": {
            "name": [
                {
                    "lang": "",
                    "value": "Race source value"
                }
            ],
            "disabledLangName": [
                {
                    "lang": "en",
                    "value": "",
                    "visible": true
                },
                {
                    "lang": "de",
                    "value": "",
                    "visible": true
                },
                {
                    "lang": "fr",
                    "value": "",
                    "visible": true
                },
                {
                    "lang": "es",
                    "value": "",
                    "visible": true
                },
                {
                    "lang": "pt",
                    "value": "",
                    "visible": true
                },
                {
                    "lang": "zh",
                    "value": "",
                    "visible": true
                }
            ],
            "type": "text",
            "expression": "@PATIENT.\"race_source_value\"",
            "referenceFilter": "@REF.DOMAIN_ID = 'Race' AND @REF.STANDARD_CONCEPT = 'S' AND JARO_SIMILARITY(CAST(@REF.CONCEPT_CODE AS VARCHAR), '@SEARCH_QUERY') >= 0.85",
            "referenceExpression": "@REF.CONCEPT_CODE",
            "order": 12,
            "domainFilter": "",
            "standardConceptCodeFilter": "",
            "useRefValue": true,
            "useRefText": true
        },
        "ethnicitysourcevalue": {
            "name": [
                {
                    "lang": "",
                    "value": "Ethnicity source value"
                }
            ],
            "disabledLangName": [
                {
                    "lang": "en",
                    "value": "",
                    "visible": true
                },
                {
                    "lang": "de",
                    "value": "",
                    "visible": true
                },
                {
                    "lang": "fr",
                    "value": "",
                    "visible": true
                },
                {
                    "lang": "es",
                    "value": "",
                    "visible": true
                },
                {
                    "lang": "pt",
                    "value": "",
                    "visible": true
                },
                {
                    "lang": "zh",
                    "value": "",
                    "visible": true
                }
            ],
            "type": "text",
            "expression": "@PATIENT.\"ethnicity_source_value\"",
            "referenceFilter": "@REF.DOMAIN_ID = 'Ethnicity' AND @REF.STANDARD_CONCEPT = 'S' AND JARO_SIMILARITY(CAST(@REF.CONCEPT_CODE AS VARCHAR), '@SEARCH_QUERY') >= 0.85",
            "referenceExpression": "@REF.CONCEPT_CODE",
            "order": 13,
            "domainFilter": "",
            "standardConceptCodeFilter": "",
            "useRefValue": true,
            "useRefText": true
        },
        "genderconceptid": {
            "name": [
                {
                    "lang": "",
                    "value": "Gender concept id"
                }
            ],
            "disabledLangName": [
                {
                    "lang": "en",
                    "value": "",
                    "visible": true
                },
                {
                    "lang": "de",
                    "value": "",
                    "visible": true
                },
                {
                    "lang": "fr",
                    "value": "",
                    "visible": true
                },
                {
                    "lang": "es",
                    "value": "",
                    "visible": true
                },
                {
                    "lang": "pt",
                    "value": "",
                    "visible": true
                },
                {
                    "lang": "zh",
                    "value": "",
                    "visible": true
                }
            ],
            "type": "text",
            "expression": "@PATIENT.\"GENDER_CONCEPT_ID\"",
            "referenceFilter": "@REF.DOMAIN_ID = 'Gender' AND @REF.STANDARD_CONCEPT = 'S' AND JARO_SIMILARITY(CAST(@REF.CONCEPT_ID AS VARCHAR), '@SEARCH_QUERY') >= 0.85",
            "referenceExpression": "@REF.CONCEPT_ID",
            "order": 16,
            "domainFilter": "",
            "standardConceptCodeFilter": "",
            "useRefValue": true,
            "useRefText": true
        },
        "Gender_concept_name": {
            "name": [
                {
                    "lang": "",
                    "value": "Gender"
                }
            ],
            "disabledLangName": [
                {
                    "lang": "en",
                    "value": "",
                    "visible": true
                },
                {
                    "lang": "de",
                    "value": "",
                    "visible": true
                },
                {
                    "lang": "fr",
                    "value": "",
                    "visible": true
                },
                {
                    "lang": "es",
                    "value": "",
                    "visible": true
                },
                {
                    "lang": "pt",
                    "value": "",
                    "visible": true
                },
                {
                    "lang": "zh",
                    "value": "",
                    "visible": true
                }
            ],
            "type": "text",
            "expression": "@REF.concept_name",
            "defaultPlaceholder": "@REF",
            "defaultFilter": "@REF.concept_id = @PATIENT.gender_concept_id",
            "referenceFilter": "@REF.DOMAIN_ID = 'Gender' AND @REF.STANDARD_CONCEPT = 'S' AND JARO_SIMILARITY(lower(@REF.CONCEPT_NAME), lower('@SEARCH_QUERY')) >= 0.65",
            "referenceExpression": "@REF.CONCEPT_NAME",
            "order": 17,
            "domainFilter": "",
            "standardConceptCodeFilter": "",
            "useRefValue": true,
            "useRefText": true
        },
        "raceconceptid": {
            "name": [
                {
                    "lang": "",
                    "value": "Race concept id"
                }
            ],
            "disabledLangName": [
                {
                    "lang": "en",
                    "value": "",
                    "visible": true
                },
                {
                    "lang": "de",
                    "value": "",
                    "visible": true
                },
                {
                    "lang": "fr",
                    "value": "",
                    "visible": true
                },
                {
                    "lang": "es",
                    "value": "",
                    "visible": true
                },
                {
                    "lang": "pt",
                    "value": "",
                    "visible": true
                },
                {
                    "lang": "zh",
                    "value": "",
                    "visible": true
                }
            ],
            "type": "text",
            "expression": "@PATIENT.\"RACE_CONCEPT_ID\"",
            "referenceFilter": "@REF.DOMAIN_ID = 'Race' AND @REF.STANDARD_CONCEPT = 'S' AND JARO_SIMILARITY(CAST(@REF.CONCEPT_ID AS VARCHAR), '@SEARCH_QUERY') >= 0.85",
            "referenceExpression": "@REF.CONCEPT_ID",
            "order": 20,
            "domainFilter": "",
            "standardConceptCodeFilter": "",
            "useRefValue": true,
            "useRefText": true
        },
        "Age": {
            "name": [
                {
                    "lang": "",
                    "value": "Age"
                }
            ],
            "disabledLangName": [
                {
                    "lang": "de",
                    "value": "",
                    "visible": true
                },
                {
                    "lang": "fr",
                    "value": "",
                    "visible": true
                },
                {
                    "lang": "es",
                    "value": "",
                    "visible": true
                },
                {
                    "lang": "pt",
                    "value": "",
                    "visible": true
                },
                {
                    "lang": "zh",
                    "value": "",
                    "visible": true
                },
                {
                    "lang": "en",
                    "value": ""
                }
            ],
            "type": "num",
            "expression": "YEAR(CURRENT_DATE) - @PATIENT.\"YEAR_OF_BIRTH\"",
            "order": 24,
            "domainFilter": "",
            "standardConceptCodeFilter": ""
        },
        "raceName": {
            "name": [
                {
                    "lang": "",
                    "value": "Race"
                }
            ],
            "disabledLangName": [
                {
                    "lang": "en",
                    "value": "",
                    "visible": true
                },
                {
                    "lang": "de",
                    "value": "",
                    "visible": true
                },
                {
                    "lang": "fr",
                    "value": "",
                    "visible": true
                },
                {
                    "lang": "es",
                    "value": "",
                    "visible": true
                },
                {
                    "lang": "pt",
                    "value": "",
                    "visible": true
                },
                {
                    "lang": "zh",
                    "value": "",
                    "visible": true
                }
            ],
            "type": "text",
            "expression": "@REF.concept_name",
            "defaultPlaceholder": "@REF",
            "defaultFilter": "@REF.concept_id = @PATIENT.race_concept_id",
            "referenceFilter": "@REF.DOMAIN_ID = 'Race' AND @REF.STANDARD_CONCEPT = 'S' AND JARO_SIMILARITY(lower(@REF.CONCEPT_NAME), lower('@SEARCH_QUERY')) >= 0.65",
            "referenceExpression": "@REF.CONCEPT_NAME",
            "order": 18,
            "domainFilter": "",
            "standardConceptCodeFilter": "",
            "useRefValue": true,
            "useRefText": true
        },
        "ethnicityName": {
            "name": [
                {
                    "lang": "",
                    "value": "Ethnicity"
                }
            ],
            "disabledLangName": [
                {
                    "lang": "en",
                    "value": "",
                    "visible": true
                },
                {
                    "lang": "de",
                    "value": "",
                    "visible": true
                },
                {
                    "lang": "fr",
                    "value": "",
                    "visible": true
                },
                {
                    "lang": "es",
                    "value": "",
                    "visible": true
                },
                {
                    "lang": "pt",
                    "value": "",
                    "visible": true
                },
                {
                    "lang": "zh",
                    "value": "",
                    "visible": true
                }
            ],
            "type": "text",
            "expression": "@REF.concept_name",
            "defaultPlaceholder": "@REF",
            "defaultFilter": "@REF.concept_id = @PATIENT.ethnicity_concept_id",
            "referenceFilter": "@REF.DOMAIN_ID = 'Ethnicity' AND @REF.STANDARD_CONCEPT = 'S' AND JARO_SIMILARITY(lower(@REF.CONCEPT_NAME), lower('@SEARCH_QUERY')) >= 0.65",
            "referenceExpression": "@REF.CONCEPT_NAME",
            "order": 19,
            "domainFilter": "",
            "standardConceptCodeFilter": "",
            "useRefValue": true,
            "useRefText": true
        }
    }
  },
  "censor": {},
  "advancedSettings": {
      "tableTypePlaceholderMap": {
          "factTable": {
              "placeholder": "@PATIENT",
              "attributeTables": []
          },
          "dimTables": [
              {
                  "placeholder": "@COND",
                  "attributeTables": [],
                  "hierarchy": false,
                  "time": true,
                  "oneToN": false,
                  "condition": false
              },
              {
                  "placeholder": "@VISIT",
                  "attributeTables": [],
                  "hierarchy": false,
                  "time": true,
                  "oneToN": false,
                  "condition": false
              },
              {
                  "placeholder": "@CONDERA",
                  "attributeTables": [],
                  "hierarchy": false,
                  "time": true,
                  "oneToN": false,
                  "condition": false
              },
              {
                  "placeholder": "@DEATH",
                  "attributeTables": [],
                  "hierarchy": false,
                  "time": true,
                  "oneToN": false,
                  "condition": false
              },
              {
                  "placeholder": "@DEVEXP",
                  "attributeTables": [],
                  "hierarchy": false,
                  "time": true,
                  "oneToN": false,
                  "condition": false
              },
              {
                  "placeholder": "@DOSEERA",
                  "attributeTables": [],
                  "hierarchy": false,
                  "time": true,
                  "oneToN": false,
                  "condition": false
              },
              {
                  "placeholder": "@DRUGERA",
                  "attributeTables": [],
                  "hierarchy": false,
                  "time": true,
                  "oneToN": false,
                  "condition": false
              },
              {
                  "placeholder": "@DRUGEXP",
                  "attributeTables": [],
                  "hierarchy": false,
                  "time": true,
                  "oneToN": false,
                  "condition": false
              },
              {
                  "placeholder": "@OBS",
                  "attributeTables": [],
                  "hierarchy": false,
                  "time": true,
                  "oneToN": true,
                  "condition": false
              },
              {
                  "placeholder": "@OBSPER",
                  "attributeTables": [],
                  "hierarchy": false,
                  "time": true,
                  "oneToN": false,
                  "condition": false
              },
              {
                  "placeholder": "@PPPER",
                  "attributeTables": [],
                  "hierarchy": false,
                  "time": true,
                  "oneToN": false,
                  "condition": false
              },
              {
                  "placeholder": "@SPEC",
                  "attributeTables": [],
                  "hierarchy": false,
                  "time": true,
                  "oneToN": false,
                  "condition": false
              },
              {
                  "placeholder": "@MEAS",
                  "attributeTables": [],
                  "hierarchy": false,
                  "time": true,
                  "oneToN": false,
                  "condition": false
              },
              {
                  "placeholder": "@PROC",
                  "attributeTables": [],
                  "hierarchy": false,
                  "time": true,
                  "oneToN": false,
                  "condition": false
              },
              {
                  "placeholder": "@CONSENT",
                  "attributeTables": [],
                  "hierarchy": true,
                  "time": true,
                  "oneToN": false,
                  "condition": false
              },
              {
                  "placeholder": "@RESPONSE",
                  "attributeTables": [],
                  "hierarchy": false,
                  "time": true,
                  "oneToN": false,
                  "condition": false
              },
              {
                  "placeholder": "@COHORT",
                  "attributeTables": [],
                  "hierarchy": false,
                  "time": true,
                  "oneToN": false,
                  "condition": false
              }
          ]
      },
      "tableMapping": {
          "@COND": "$$SCHEMA$$.\"condition_occurrence\"",
          "@COND.PATIENT_ID": "\"person_id\"",
          "@COND.INTERACTION_ID": "\"condition_occurrence_id\"",
          "@COND.CONDITION_ID": "\"condition_concept_id\"",
          "@COND.PARENT_INTERACT_ID": "\"visit_occurrence_id\"",
          "@COND.START": "\"condition_start_datetime\"",
          "@COND.END": "\"condition_end_datetime\"",
          "@COND.INTERACTION_TYPE": "\"condition_type_concept_id\"",
          "@VISIT": "$$SCHEMA$$.\"visit_occurrence\"",
          "@VISIT.PATIENT_ID": "\"person_id\"",
          "@VISIT.INTERACTION_ID": "\"visit_occurrence_id\"",
          "@VISIT.CONDITION_ID": "\"visit_concept_id\"",
          "@VISIT.PARENT_INTERACT_ID": "\"visit_occurrence_id\"",
          "@VISIT.START": "\"visit_start_datetime\"",
          "@VISIT.END": "\"visit_end_datetime\"",
          "@VISIT.INTERACTION_TYPE": "\"visit_type_concept_id\"",
          "@CONDERA": "$$SCHEMA$$.\"condition_era\"",
          "@CONDERA.PATIENT_ID": "\"person_id\"",
          "@CONDERA.INTERACTION_ID": "\"condition_era_id\"",
          "@CONDERA.CONDITION_ID": "\"condition_concept_id\"",
          "@CONDERA.PARENT_INTERACT_ID": "\"condition_era_id\"",
          "@CONDERA.START": "\"condition_era_start_date\"",
          "@CONDERA.END": "\"condition_era_end_date\"",
          "@CONDERA.INTERACTION_TYPE": "\"condition_concept_id\"",
          "@DEATH": "$$SCHEMA$$.\"death\"",
          "@DEATH.PATIENT_ID": "\"person_id\"",
          "@DEATH.INTERACTION_ID": "\"person_id\"",
          "@DEATH.CONDITION_ID": "\"cause_concept_id\"",
          "@DEATH.PARENT_INTERACT_ID": "\"person_id\"",
          "@DEATH.START": "\"death_datetime\"",
          "@DEATH.END": "\"death_datetime\"",
          "@DEATH.INTERACTION_TYPE": "\"death_type_concept_id\"",
          "@DEVEXP": "$$SCHEMA$$.\"device_exposure\"",
          "@DEVEXP.PATIENT_ID": "\"person_id\"",
          "@DEVEXP.INTERACTION_ID": "\"device_exposure_id\"",
          "@DEVEXP.CONDITION_ID": "\"device_concept_id\"",
          "@DEVEXP.PARENT_INTERACT_ID": "\"visit_occurrence_id\"",
          "@DEVEXP.START": "\"device_exposure_start_datetime\"",
          "@DEVEXP.END": "\"device_exposure_end_datetime\"",
          "@DEVEXP.INTERACTION_TYPE": "\"device_type_concept_id\"",
          "@DOSEERA": "$$SCHEMA$$.\"dose_era\"",
          "@DOSEERA.PATIENT_ID": "\"person_id\"",
          "@DOSEERA.INTERACTION_ID": "\"dose_era_id\"",
          "@DOSEERA.CONDITION_ID": "\"drug_concept_id\"",
          "@DOSEERA.PARENT_INTERACT_ID": "\"dose_era_id\"",
          "@DOSEERA.START": "\"dose_era_start_date\"",
          "@DOSEERA.END": "\"dose_era_end_date\"",
          "@DOSEERA.INTERACTION_TYPE": "\"drug_concept_id\"",
          "@DRUGERA": "$$SCHEMA$$.\"drug_era\"",
          "@DRUGERA.PATIENT_ID": "\"person_id\"",
          "@DRUGERA.INTERACTION_ID": "\"drug_era_id\"",
          "@DRUGERA.CONDITION_ID": "\"drug_concept_id\"",
          "@DRUGERA.PARENT_INTERACT_ID": "\"drug_era_id\"",
          "@DRUGERA.START": "\"drug_era_start_date\"",
          "@DRUGERA.END": "\"drug_era_end_date\"",
          "@DRUGERA.INTERACTION_TYPE": "\"drug_concept_id\"",
          "@DRUGEXP": "$$SCHEMA$$.\"drug_exposure\"",
          "@DRUGEXP.PATIENT_ID": "\"person_id\"",
          "@DRUGEXP.INTERACTION_ID": "\"drug_exposure_id\"",
          "@DRUGEXP.CONDITION_ID": "\"drug_concept_id\"",
          "@DRUGEXP.PARENT_INTERACT_ID": "\"visit_occurrence_id\"",
          "@DRUGEXP.START": "\"drug_exposure_start_datetime\"",
          "@DRUGEXP.END": "\"drug_exposure_end_datetime\"",
          "@DRUGEXP.INTERACTION_TYPE": "\"drug_type_concept_id\"",
          "@OBS": "$$SCHEMA$$.\"observation\"",
          "@OBS.PATIENT_ID": "\"person_id\"",
          "@OBS.INTERACTION_ID": "\"observation_id\"",
          "@OBS.CONDITION_ID": "\"observation_concept_id\"",
          "@OBS.PARENT_INTERACT_ID": "\"visit_occurrence_id\"",
          "@OBS.START": "\"observation_datetime\"",
          "@OBS.END": "\"observation_datetime\"",
          "@OBS.INTERACTION_TYPE": "\"observation_type_concept_id\"",
          "@OBSPER": "$$SCHEMA$$.\"observation_period\"",
          "@OBSPER.PATIENT_ID": "\"person_id\"",
          "@OBSPER.INTERACTION_ID": "\"observation_period_id\"",
          "@OBSPER.CONDITION_ID": "\"period_type_concept_id\"",
          "@OBSPER.PARENT_INTERACT_ID": "\"observation_period_id\"",
          "@OBSPER.START": "\"observation_period_start_date\"",
          "@OBSPER.END": "\"observation_period_end_date\"",
          "@OBSPER.INTERACTION_TYPE": "\"period_type_concept_id\"",
          "@PPPER": "$$SCHEMA$$.\"payer_plan_period\"",
          "@PPPER.PATIENT_ID": "\"person_id\"",
          "@PPPER.INTERACTION_ID": "\"payer_plan_period_id\"",
          "@PPPER.CONDITION_ID": "\"payer_concept_id\"",
          "@PPPER.PARENT_INTERACT_ID": "\"payer_plan_period_id\"",
          "@PPPER.START": "\"payer_plan_period_start_date\"",
          "@PPPER.END": "\"payer_plan_period_end_date\"",
          "@PPPER.INTERACTION_TYPE": "\"plan_concept_id\"",
          "@SPEC": "$$SCHEMA$$.\"specimen\"",
          "@SPEC.PATIENT_ID": "\"person_id\"",
          "@SPEC.INTERACTION_ID": "\"specimen_id\"",
          "@SPEC.CONDITION_ID": "\"specimen_concept_id\"",
          "@SPEC.PARENT_INTERACT_ID": "\"specimen_id\"",
          "@SPEC.START": "\"specimen_datetime\"",
          "@SPEC.END": "\"specimen_datetime\"",
          "@SPEC.INTERACTION_TYPE": "\"specimen_type_concept_id\"",
          "@MEAS": "$$SCHEMA$$.\"measurement\"",
          "@MEAS.PATIENT_ID": "\"person_id\"",
          "@MEAS.INTERACTION_ID": "\"measurement_id\"",
          "@MEAS.CONDITION_ID": "\"measurement_concept_id\"",
          "@MEAS.PARENT_INTERACT_ID": "\"visit_occurrence_id\"",
          "@MEAS.START": "\"measurement_datetime\"",
          "@MEAS.END": "\"measurement_datetime\"",
          "@MEAS.INTERACTION_TYPE": "\"measurement_type_concept_id\"",
          "@PROC": "$$SCHEMA$$.\"procedure_occurrence\"",
          "@PROC.PATIENT_ID": "\"person_id\"",
          "@PROC.INTERACTION_ID": "\"procedure_occurrence_id\"",
          "@PROC.CONDITION_ID": "\"procedure_concept_id\"",
          "@PROC.PARENT_INTERACT_ID": "\"visit_occurrence_id\"",
          "@PROC.START": "\"procedure_datetime\"",
          "@PROC.END": "\"procedure_end_datetime\"",
          "@PROC.INTERACTION_TYPE": "\"procedure_type_concept_id\"",
          "@CONSENT": "$$SCHEMA$$.\"VIEW::GDM.CONSENT_BASE\"",
          "@CONSENT.PATIENT_ID": "\"PERSON_ID\"",
          "@CONSENT.INTERACTION_ID": "\"CONSENT_DETAIL_ID\"",
          "@CONSENT.CONDITION_ID": "\"ATTRIBUTE\"",
          "@CONSENT.PARENT_INTERACT_ID": "\"PARENT_CONSENT_DETAIL_ID\"",
          "@CONSENT.START": "\"CREATED_AT\"",
          "@CONSENT.END": "\"CREATED_AT\"",
          "@CONSENT.INTERACTION_TYPE": "\"TYPE\"",
          "@RESPONSE": "$$SCHEMA$$.\"VIEW::GDM.QUESTIONNAIRE_RESPONSE_BASE\"",
          "@RESPONSE.PATIENT_ID": "\"PERSON_ID\"",
          "@RESPONSE.INTERACTION_ID": "\"ID\"",
          "@RESPONSE.CONDITION_ID": "\"VALUE\"",
          "@RESPONSE.PARENT_INTERACT_ID": "\"ANSWER_ID\"",
          "@RESPONSE.START": "\"AUTHORED\"",
          "@RESPONSE.END": "\"AUTHORED\"",
          "@RESPONSE.INTERACTION_TYPE": "\"VALUE_TYPE\"",
          "@COHORT": "$$SCHEMA$$.cohort",
          "@COHORT.PATIENT_ID": "\"subject_id\"",
          "@COHORT.INTERACTION_ID": "\"cohort_definition_id\"",
          "@COHORT.CONDITION_ID": "\"cohort_definition_id\"",
          "@COHORT.PARENT_INTERACT_ID": "\"cohort_definition_id\"",
          "@COHORT.START": "\"cohort_start_date\"",
          "@COHORT.END": "\"cohort_end_date\"",
          "@COHORT.INTERACTION_TYPE": "\"cohort_definition_id\"",
          "@PATIENT": "$$SCHEMA$$.\"person\"",
          "@PATIENT.PATIENT_ID": "\"person_id\"",
          "@PATIENT.DOD": "\"birth_datetime\"",
          "@PATIENT.DOB": "\"birth_datetime\"",
          "@REF": "$$VOCAB_SCHEMA$$.\"concept\"",
          "@REF.VOCABULARY_ID": "\"vocabulary_id\"",
          "@REF.CODE": "\"concept_id\"",
          "@REF.TEXT": "\"concept_name\"",
          "@TEXT": "$$VOCAB_SCHEMA$$.\"concept\"",
          "@TEXT.INTERACTION_ID": "\"concept_id\"",
          "@TEXT.INTERACTION_TEXT_ID": "\"concept_id\"",
          "@TEXT.VALUE": "\"concept_name\""
      },
      "guardedTableMapping": {
          "@PATIENT": "$$SCHEMA$$.\"person\""
      },
      "language": [
          "en",
          "de",
          "fr",
          "es",
          "pt",
          "zh"
      ],
      "others": {},
      "settings": {
          "fuzziness": 0.7,
          "maxResultSize": 5000,
          "sqlReturnOn": false,
          "errorDetailsReturnOn": false,
          "errorStackTraceReturnOn": false,
          "enableFreeText": true,
          "vbEnabled": true,
          "dateFormat": "YYYY-MM-dd",
          "timeFormat": "HH:mm:ss",
          "otsTableMap": {
              "@CODE": "$$VOCAB_SCHEMA$$.\"concept\""
          }
      },
      "shared": {},
      "schemaVersion": "3"
  }
};

const paConfigDuckdb = {
  "filtercards": [
      {
          "source": "patient",
          "visible": true,
          "order": 1,
          "initial": true,
          "attributes": [
              {
                  "source": "patient.attributes.pid",
                  "ordered": false,
                  "cached": true,
                  "useRefText": false,
                  "useRefValue": false,
                  "category": true,
                  "measure": false,
                  "filtercard": {
                      "initial": false,
                      "visible": true,
                      "order": 1
                  },
                  "patientlist": {
                      "initial": false,
                      "visible": true,
                      "linkColumn": false
                  },
                  "modelName": "Person id"
              },
              {
                  "source": "patient.attributes.pcount",
                  "ordered": true,
                  "cached": true,
                  "useRefText": false,
                  "useRefValue": false,
                  "category": false,
                  "measure": true,
                  "filtercard": {
                      "initial": false,
                      "visible": false,
                      "order": 2
                  },
                  "patientlist": {
                      "initial": false,
                      "visible": false,
                      "linkColumn": false
                  },
                  "modelName": "Patient Count"
              },
              {
                  "source": "patient.attributes.monthOfBirth",
                  "ordered": true,
                  "cached": true,
                  "useRefText": false,
                  "useRefValue": false,
                  "category": true,
                  "measure": true,
                  "filtercard": {
                      "initial": false,
                      "visible": true,
                      "order": 3
                  },
                  "patientlist": {
                      "initial": false,
                      "visible": true,
                      "linkColumn": false
                  },
                  "modelName": "Month of Birth"
              },
              {
                  "source": "patient.attributes.yearOfBirth",
                  "ordered": true,
                  "cached": true,
                  "useRefText": false,
                  "useRefValue": false,
                  "category": true,
                  "measure": true,
                  "filtercard": {
                      "initial": false,
                      "visible": true,
                      "order": 4
                  },
                  "patientlist": {
                      "initial": false,
                      "visible": true,
                      "linkColumn": false
                  },
                  "modelName": "Year of Birth"
              },
              {
                  "source": "patient.attributes.dateOfBirth",
                  "ordered": false,
                  "cached": true,
                  "useRefText": false,
                  "useRefValue": false,
                  "category": true,
                  "measure": false,
                  "filtercard": {
                      "initial": false,
                      "visible": true,
                      "order": 5
                  },
                  "patientlist": {
                      "initial": false,
                      "visible": true,
                      "linkColumn": false
                  },
                  "modelName": "Birth Datetime"
              },
              {
                  "source": "patient.attributes.ethnicityconceptid",
                  "ordered": false,
                  "cached": true,
                  "useRefText": true,
                  "useRefValue": true,
                  "category": true,
                  "measure": false,
                  "filtercard": {
                      "initial": false,
                      "visible": true,
                      "order": 6
                  },
                  "patientlist": {
                      "initial": false,
                      "visible": true,
                      "linkColumn": false
                  },
                  "modelName": "Ethnicity concept id"
              },
              {
                  "source": "patient.attributes.locationid",
                  "ordered": false,
                  "cached": true,
                  "useRefText": false,
                  "useRefValue": false,
                  "category": true,
                  "measure": false,
                  "filtercard": {
                      "initial": false,
                      "visible": true,
                      "order": 7
                  },
                  "patientlist": {
                      "initial": false,
                      "visible": true,
                      "linkColumn": false
                  },
                  "modelName": "Location id"
              },
              {
                  "source": "patient.attributes.gendersourcevalue",
                  "ordered": false,
                  "cached": true,
                  "useRefText": true,
                  "useRefValue": true,
                  "category": true,
                  "measure": false,
                  "filtercard": {
                      "initial": false,
                      "visible": true,
                      "order": 8
                  },
                  "patientlist": {
                      "initial": false,
                      "visible": true,
                      "linkColumn": false
                  },
                  "modelName": "Gender source value"
              },
              {
                  "source": "patient.attributes.racesourcevalue",
                  "ordered": false,
                  "cached": true,
                  "useRefText": true,
                  "useRefValue": true,
                  "category": true,
                  "measure": false,
                  "filtercard": {
                      "initial": false,
                      "visible": true,
                      "order": 9
                  },
                  "patientlist": {
                      "initial": false,
                      "visible": true,
                      "linkColumn": false
                  },
                  "modelName": "Race source value"
              },
              {
                  "source": "patient.attributes.ethnicitysourcevalue",
                  "ordered": false,
                  "cached": true,
                  "useRefText": true,
                  "useRefValue": true,
                  "category": true,
                  "measure": false,
                  "filtercard": {
                      "initial": false,
                      "visible": true,
                      "order": 10
                  },
                  "patientlist": {
                      "initial": false,
                      "visible": true,
                      "linkColumn": false
                  },
                  "modelName": "Ethnicity source value"
              },
              {
                  "source": "patient.attributes.genderconceptid",
                  "ordered": false,
                  "cached": true,
                  "useRefText": true,
                  "useRefValue": true,
                  "category": true,
                  "measure": false,
                  "filtercard": {
                      "initial": false,
                      "visible": true,
                      "order": 11
                  },
                  "patientlist": {
                      "initial": false,
                      "visible": true,
                      "linkColumn": false
                  },
                  "modelName": "Gender concept id"
              },
              {
                  "source": "patient.attributes.raceconceptid",
                  "ordered": false,
                  "cached": true,
                  "useRefText": true,
                  "useRefValue": true,
                  "category": true,
                  "measure": false,
                  "filtercard": {
                      "initial": false,
                      "visible": true,
                      "order": 12
                  },
                  "patientlist": {
                      "initial": false,
                      "visible": true,
                      "linkColumn": false
                  },
                  "modelName": "Race concept id"
              },
              {
                  "source": "patient.attributes.Age",
                  "ordered": true,
                  "cached": true,
                  "useRefText": false,
                  "useRefValue": false,
                  "category": true,
                  "measure": true,
                  "filtercard": {
                      "initial": true,
                      "visible": true,
                      "order": 13
                  },
                  "patientlist": {
                      "initial": false,
                      "visible": true,
                      "linkColumn": false
                  },
                  "modelName": "Age"
              },
              {
                  "source": "patient.attributes.Gender_concept_name",
                  "ordered": false,
                  "cached": true,
                  "useRefText": true,
                  "useRefValue": true,
                  "category": true,
                  "measure": false,
                  "filtercard": {
                      "initial": true,
                      "visible": true,
                      "order": 14
                  },
                  "patientlist": {
                      "initial": false,
                      "visible": true,
                      "linkColumn": false
                  },
                  "modelName": "Gender"
              },
              {
                  "source": "patient.attributes.raceName",
                  "ordered": false,
                  "cached": true,
                  "useRefText": true,
                  "useRefValue": true,
                  "category": true,
                  "measure": false,
                  "filtercard": {
                      "initial": false,
                      "visible": true,
                      "order": 15
                  },
                  "patientlist": {
                      "initial": false,
                      "visible": true,
                      "linkColumn": false
                  },
                  "modelName": "Race"
              },
              {
                  "source": "patient.attributes.ethnicityName",
                  "ordered": false,
                  "cached": true,
                  "useRefText": true,
                  "useRefValue": true,
                  "category": true,
                  "measure": false,
                  "filtercard": {
                      "initial": false,
                      "visible": true,
                      "order": 16
                  },
                  "patientlist": {
                      "initial": false,
                      "visible": true,
                      "linkColumn": false
                  },
                  "modelName": "Ethnicity"
              }
          ],
          "initialPatientlistColumn": true,
          "modelName": "MRI_PA_SERVICES_FILTERCARD_TITLE_BASIC_DATA"
      },
      {
          "source": "patient.interactions.visit",
          "visible": true,
          "order": 2,
          "initial": false,
          "attributes": [
              {
                  "source": "patient.interactions.visit.attributes.enddate",
                  "ordered": false,
                  "cached": true,
                  "useRefText": false,
                  "useRefValue": false,
                  "category": true,
                  "measure": false,
                  "filtercard": {
                      "initial": false,
                      "visible": true,
                      "order": 1
                  },
                  "patientlist": {
                      "initial": false,
                      "visible": true,
                      "linkColumn": false
                  },
                  "modelName": "Visit End Date"
              },
              {
                  "source": "patient.interactions.visit.attributes.startdate",
                  "ordered": false,
                  "cached": true,
                  "useRefText": false,
                  "useRefValue": false,
                  "category": true,
                  "measure": false,
                  "filtercard": {
                      "initial": false,
                      "visible": true,
                      "order": 2
                  },
                  "patientlist": {
                      "initial": false,
                      "visible": true,
                      "linkColumn": false
                  },
                  "modelName": "Visit Start Date"
              },
              {
                  "source": "patient.interactions.visit.attributes.pid",
                  "ordered": false,
                  "cached": true,
                  "useRefText": false,
                  "useRefValue": false,
                  "category": true,
                  "measure": false,
                  "filtercard": {
                      "initial": false,
                      "visible": true,
                      "order": 3
                  },
                  "patientlist": {
                      "initial": false,
                      "visible": true,
                      "linkColumn": false
                  },
                  "modelName": "Person id"
              },
              {
                  "source": "patient.interactions.visit.attributes.visitid",
                  "ordered": false,
                  "cached": true,
                  "useRefText": false,
                  "useRefValue": false,
                  "category": true,
                  "measure": false,
                  "filtercard": {
                      "initial": false,
                      "visible": true,
                      "order": 4
                  },
                  "patientlist": {
                      "initial": false,
                      "visible": true,
                      "linkColumn": false
                  },
                  "modelName": "Visit occurrence Id"
              },
              {
                  "source": "patient.interactions.visit.attributes.visittypeconceptset",
                  "ordered": false,
                  "cached": true,
                  "useRefText": false,
                  "useRefValue": false,
                  "category": true,
                  "measure": false,
                  "filtercard": {
                      "initial": false,
                      "visible": true,
                      "order": 5
                  },
                  "patientlist": {
                      "initial": false,
                      "visible": true,
                      "linkColumn": false
                  },
                  "modelName": "Visit type concept set"
              },
              {
                  "source": "patient.interactions.visit.attributes.visitconceptid",
                  "ordered": false,
                  "cached": true,
                  "useRefText": true,
                  "useRefValue": true,
                  "category": true,
                  "measure": false,
                  "filtercard": {
                      "initial": false,
                      "visible": true,
                      "order": 6
                  },
                  "patientlist": {
                      "initial": false,
                      "visible": true,
                      "linkColumn": false
                  },
                  "modelName": "Visit concept Id"
              },
              {
                  "source": "patient.interactions.visit.attributes.visitconceptset",
                  "ordered": false,
                  "cached": true,
                  "useRefText": false,
                  "useRefValue": false,
                  "category": true,
                  "measure": false,
                  "filtercard": {
                      "initial": true,
                      "visible": true,
                      "order": 7
                  },
                  "patientlist": {
                      "initial": false,
                      "visible": true,
                      "linkColumn": false
                  },
                  "modelName": "Visit concept set"
              },
              {
                  "source": "patient.interactions.visit.attributes.visittypeconceptid",
                  "ordered": false,
                  "cached": true,
                  "useRefText": true,
                  "useRefValue": true,
                  "category": true,
                  "measure": false,
                  "filtercard": {
                      "initial": false,
                      "visible": true,
                      "order": 8
                  },
                  "patientlist": {
                      "initial": false,
                      "visible": true,
                      "linkColumn": false
                  },
                  "modelName": "Visit type concept id"
              },
              {
                  "source": "patient.interactions.visit.attributes.visit_occ_concept_name",
                  "ordered": false,
                  "cached": true,
                  "useRefText": true,
                  "useRefValue": true,
                  "category": true,
                  "measure": false,
                  "filtercard": {
                      "initial": true,
                      "visible": true,
                      "order": 9
                  },
                  "patientlist": {
                      "initial": false,
                      "visible": true,
                      "linkColumn": false
                  },
                  "modelName": "Visit concept name"
              }
          ],
          "initialPatientlistColumn": false,
          "modelName": "Visit"
      },
      {
          "source": "patient.interactions.questionnaire",
          "visible": true,
          "order": 3,
          "initial": false,
          "attributes": [
              {
                  "source": "patient.interactions.questionnaire.attributes.linkID",
                  "ordered": false,
                  "cached": true,
                  "useRefText": false,
                  "useRefValue": false,
                  "category": true,
                  "measure": false,
                  "filtercard": {
                      "initial": false,
                      "visible": true,
                      "order": 1
                  },
                  "patientlist": {
                      "initial": false,
                      "visible": true,
                      "linkColumn": false
                  },
                  "modelName": "Link ID"
              },
              {
                  "source": "patient.interactions.questionnaire.attributes.valueCodingValue",
                  "ordered": false,
                  "cached": true,
                  "useRefText": false,
                  "useRefValue": false,
                  "category": true,
                  "measure": false,
                  "filtercard": {
                      "initial": false,
                      "visible": true,
                      "order": 2
                  },
                  "patientlist": {
                      "initial": false,
                      "visible": true,
                      "linkColumn": false
                  },
                  "modelName": "Value coding value"
              },
              {
                  "source": "patient.interactions.questionnaire.attributes.recordID",
                  "ordered": false,
                  "cached": true,
                  "useRefText": false,
                  "useRefValue": false,
                  "category": true,
                  "measure": false,
                  "filtercard": {
                      "initial": false,
                      "visible": true,
                      "order": 3
                  },
                  "patientlist": {
                      "initial": false,
                      "visible": true,
                      "linkColumn": false
                  },
                  "modelName": "Record ID"
              },
              {
                  "source": "patient.interactions.questionnaire.attributes.questionnaireLanguage",
                  "ordered": false,
                  "cached": true,
                  "useRefText": false,
                  "useRefValue": false,
                  "category": true,
                  "measure": false,
                  "filtercard": {
                      "initial": false,
                      "visible": true,
                      "order": 4
                  },
                  "patientlist": {
                      "initial": false,
                      "visible": true,
                      "linkColumn": false
                  },
                  "modelName": "Questionnaire language"
              },
              {
                  "source": "patient.interactions.questionnaire.attributes.questionnaireStatus",
                  "ordered": false,
                  "cached": true,
                  "useRefText": false,
                  "useRefValue": false,
                  "category": true,
                  "measure": false,
                  "filtercard": {
                      "initial": false,
                      "visible": true,
                      "order": 5
                  },
                  "patientlist": {
                      "initial": false,
                      "visible": true,
                      "linkColumn": false
                  },
                  "modelName": "Questionnaire status"
              },
              {
                  "source": "patient.interactions.questionnaire.attributes.questionnaireAuthored",
                  "ordered": false,
                  "cached": true,
                  "useRefText": false,
                  "useRefValue": false,
                  "category": true,
                  "measure": false,
                  "filtercard": {
                      "initial": false,
                      "visible": true,
                      "order": 6
                  },
                  "patientlist": {
                      "initial": false,
                      "visible": true,
                      "linkColumn": false
                  },
                  "modelName": "Questionnaire authored"
              },
              {
                  "source": "patient.interactions.questionnaire.attributes.text",
                  "ordered": false,
                  "cached": true,
                  "useRefText": false,
                  "useRefValue": false,
                  "category": true,
                  "measure": false,
                  "filtercard": {
                      "initial": false,
                      "visible": true,
                      "order": 7
                  },
                  "patientlist": {
                      "initial": false,
                      "visible": true,
                      "linkColumn": false
                  },
                  "modelName": "Text"
              },
              {
                  "source": "patient.interactions.questionnaire.attributes.valueType",
                  "ordered": false,
                  "cached": true,
                  "useRefText": false,
                  "useRefValue": false,
                  "category": true,
                  "measure": false,
                  "filtercard": {
                      "initial": false,
                      "visible": true,
                      "order": 8
                  },
                  "patientlist": {
                      "initial": false,
                      "visible": true,
                      "linkColumn": false
                  },
                  "modelName": "Value type"
              },
              {
                  "source": "patient.interactions.questionnaire.attributes.value",
                  "ordered": false,
                  "cached": true,
                  "useRefText": false,
                  "useRefValue": false,
                  "category": true,
                  "measure": false,
                  "filtercard": {
                      "initial": false,
                      "visible": true,
                      "order": 9
                  },
                  "patientlist": {
                      "initial": false,
                      "visible": true,
                      "linkColumn": false
                  },
                  "modelName": "Value"
              },
              {
                  "source": "patient.interactions.questionnaire.attributes.questionnaireReference",
                  "ordered": false,
                  "cached": true,
                  "useRefText": false,
                  "useRefValue": false,
                  "category": true,
                  "measure": false,
                  "filtercard": {
                      "initial": false,
                      "visible": true,
                      "order": 10
                  },
                  "patientlist": {
                      "initial": false,
                      "visible": true,
                      "linkColumn": false
                  },
                  "modelName": "Questionnaire reference"
              },
              {
                  "source": "patient.interactions.questionnaire.attributes.questionnaireVersion",
                  "ordered": false,
                  "cached": true,
                  "useRefText": false,
                  "useRefValue": false,
                  "category": true,
                  "measure": false,
                  "filtercard": {
                      "initial": false,
                      "visible": true,
                      "order": 11
                  },
                  "patientlist": {
                      "initial": false,
                      "visible": true,
                      "linkColumn": false
                  },
                  "modelName": "Questionnaire version"
              },
              {
                  "source": "patient.interactions.questionnaire.attributes.extensionEffectiveDateUrl",
                  "ordered": false,
                  "cached": true,
                  "useRefText": false,
                  "useRefValue": false,
                  "category": true,
                  "measure": false,
                  "filtercard": {
                      "initial": false,
                      "visible": true,
                      "order": 12
                  },
                  "patientlist": {
                      "initial": false,
                      "visible": true,
                      "linkColumn": false
                  },
                  "modelName": "Questionaire extension effective date url"
              },
              {
                  "source": "patient.interactions.questionnaire.attributes.extensionValuedate",
                  "ordered": false,
                  "cached": true,
                  "useRefText": false,
                  "useRefValue": false,
                  "category": true,
                  "measure": false,
                  "filtercard": {
                      "initial": false,
                      "visible": true,
                      "order": 13
                  },
                  "patientlist": {
                      "initial": false,
                      "visible": true,
                      "linkColumn": false
                  },
                  "modelName": "Questionaire extension valuedate"
              }
          ],
          "initialPatientlistColumn": false,
          "modelName": "Questionnaire"
      },
      {
          "source": "patient.interactions.specimen",
          "visible": true,
          "order": 4,
          "initial": false,
          "attributes": [
              {
                  "source": "patient.interactions.specimen.attributes.pid",
                  "ordered": false,
                  "cached": true,
                  "useRefText": false,
                  "useRefValue": false,
                  "category": true,
                  "measure": false,
                  "filtercard": {
                      "initial": false,
                      "visible": true,
                      "order": 1
                  },
                  "patientlist": {
                      "initial": false,
                      "visible": true,
                      "linkColumn": false
                  },
                  "modelName": "Person id"
              },
              {
                  "source": "patient.interactions.specimen.attributes.specimenid",
                  "ordered": false,
                  "cached": true,
                  "useRefText": false,
                  "useRefValue": false,
                  "category": true,
                  "measure": false,
                  "filtercard": {
                      "initial": false,
                      "visible": true,
                      "order": 2
                  },
                  "patientlist": {
                      "initial": false,
                      "visible": true,
                      "linkColumn": false
                  },
                  "modelName": "Specimen Id"
              },
              {
                  "source": "patient.interactions.specimen.attributes.quantity",
                  "ordered": true,
                  "cached": true,
                  "useRefText": false,
                  "useRefValue": false,
                  "category": true,
                  "measure": true,
                  "filtercard": {
                      "initial": false,
                      "visible": true,
                      "order": 3
                  },
                  "patientlist": {
                      "initial": false,
                      "visible": true,
                      "linkColumn": false
                  },
                  "modelName": "Quantity"
              },
              {
                  "source": "patient.interactions.specimen.attributes.specimendatetime",
                  "ordered": false,
                  "cached": true,
                  "useRefText": false,
                  "useRefValue": false,
                  "category": true,
                  "measure": false,
                  "filtercard": {
                      "initial": false,
                      "visible": true,
                      "order": 4
                  },
                  "patientlist": {
                      "initial": false,
                      "visible": true,
                      "linkColumn": false
                  },
                  "modelName": "Specimen Datetime"
              },
              {
                  "source": "patient.interactions.specimen.attributes.specimendate",
                  "ordered": false,
                  "cached": true,
                  "useRefText": false,
                  "useRefValue": false,
                  "category": true,
                  "measure": false,
                  "filtercard": {
                      "initial": false,
                      "visible": true,
                      "order": 5
                  },
                  "patientlist": {
                      "initial": false,
                      "visible": true,
                      "linkColumn": false
                  },
                  "modelName": "Specimen Date"
              },
              {
                  "source": "patient.interactions.specimen.attributes.specimenconceptid",
                  "ordered": false,
                  "cached": true,
                  "useRefText": true,
                  "useRefValue": true,
                  "category": true,
                  "measure": false,
                  "filtercard": {
                      "initial": false,
                      "visible": true,
                      "order": 6
                  },
                  "patientlist": {
                      "initial": false,
                      "visible": true,
                      "linkColumn": false
                  },
                  "modelName": "Specimen concept id"
              },
              {
                  "source": "patient.interactions.specimen.attributes.specimenconceptset",
                  "ordered": false,
                  "cached": true,
                  "useRefText": false,
                  "useRefValue": false,
                  "category": true,
                  "measure": false,
                  "filtercard": {
                      "initial": true,
                      "visible": true,
                      "order": 7
                  },
                  "patientlist": {
                      "initial": false,
                      "visible": true,
                      "linkColumn": false
                  },
                  "modelName": "Specimen concept set"
              },
              {
                  "source": "patient.interactions.specimen.attributes.specimentypeconceptid",
                  "ordered": false,
                  "cached": true,
                  "useRefText": true,
                  "useRefValue": true,
                  "category": true,
                  "measure": false,
                  "filtercard": {
                      "initial": false,
                      "visible": true,
                      "order": 8
                  },
                  "patientlist": {
                      "initial": false,
                      "visible": true,
                      "linkColumn": false
                  },
                  "modelName": "Specimen type concept id"
              },
              {
                  "source": "patient.interactions.specimen.attributes.specimentypeconceptset",
                  "ordered": false,
                  "cached": true,
                  "useRefText": false,
                  "useRefValue": false,
                  "category": true,
                  "measure": false,
                  "filtercard": {
                      "initial": false,
                      "visible": true,
                      "order": 9
                  },
                  "patientlist": {
                      "initial": false,
                      "visible": true,
                      "linkColumn": false
                  },
                  "modelName": "Specimen type concept set"
              },
              {
                  "source": "patient.interactions.specimen.attributes.anatomicsiteconceptid",
                  "ordered": false,
                  "cached": true,
                  "useRefText": true,
                  "useRefValue": true,
                  "category": true,
                  "measure": false,
                  "filtercard": {
                      "initial": false,
                      "visible": true,
                      "order": 10
                  },
                  "patientlist": {
                      "initial": false,
                      "visible": true,
                      "linkColumn": false
                  },
                  "modelName": "Anatomic site concept id"
              },
              {
                  "source": "patient.interactions.specimen.attributes.anatomicsiteconceptset",
                  "ordered": false,
                  "cached": true,
                  "useRefText": false,
                  "useRefValue": false,
                  "category": true,
                  "measure": false,
                  "filtercard": {
                      "initial": false,
                      "visible": true,
                      "order": 11
                  },
                  "patientlist": {
                      "initial": false,
                      "visible": true,
                      "linkColumn": false
                  },
                  "modelName": "Anatomic site concept set"
              },
              {
                  "source": "patient.interactions.specimen.attributes.diseasestatusconceptid",
                  "ordered": false,
                  "cached": true,
                  "useRefText": true,
                  "useRefValue": true,
                  "category": true,
                  "measure": false,
                  "filtercard": {
                      "initial": false,
                      "visible": true,
                      "order": 12
                  },
                  "patientlist": {
                      "initial": false,
                      "visible": true,
                      "linkColumn": false
                  },
                  "modelName": "Disease status concept id"
              },
              {
                  "source": "patient.interactions.specimen.attributes.diseasestatusconceptset",
                  "ordered": false,
                  "cached": true,
                  "useRefText": false,
                  "useRefValue": false,
                  "category": true,
                  "measure": false,
                  "filtercard": {
                      "initial": false,
                      "visible": true,
                      "order": 13
                  },
                  "patientlist": {
                      "initial": false,
                      "visible": true,
                      "linkColumn": false
                  },
                  "modelName": "Disease status concept set"
              },
              {
                  "source": "patient.interactions.specimen.attributes.unitconceptid",
                  "ordered": false,
                  "cached": true,
                  "useRefText": true,
                  "useRefValue": true,
                  "category": true,
                  "measure": false,
                  "filtercard": {
                      "initial": false,
                      "visible": true,
                      "order": 14
                  },
                  "patientlist": {
                      "initial": false,
                      "visible": true,
                      "linkColumn": false
                  },
                  "modelName": "Unit concept id"
              },
              {
                  "source": "patient.interactions.specimen.attributes.unitconceptset",
                  "ordered": false,
                  "cached": true,
                  "useRefText": false,
                  "useRefValue": false,
                  "category": true,
                  "measure": false,
                  "filtercard": {
                      "initial": false,
                      "visible": true,
                      "order": 15
                  },
                  "patientlist": {
                      "initial": false,
                      "visible": true,
                      "linkColumn": false
                  },
                  "modelName": "Unit concept set"
              },
              {
                  "source": "patient.interactions.specimen.attributes.specimen_concept_name",
                  "ordered": false,
                  "cached": true,
                  "useRefText": true,
                  "useRefValue": true,
                  "category": true,
                  "measure": false,
                  "filtercard": {
                      "initial": true,
                      "visible": true,
                      "order": 16
                  },
                  "patientlist": {
                      "initial": false,
                      "visible": true,
                      "linkColumn": false
                  },
                  "modelName": "Specimen concept name"
              }
          ],
          "initialPatientlistColumn": false,
          "modelName": "Specimen"
      },
      {
          "source": "patient.interactions.proc",
          "visible": true,
          "order": 5,
          "initial": false,
          "attributes": [
              {
                  "source": "patient.interactions.proc.attributes.procdatetime",
                  "ordered": false,
                  "cached": true,
                  "useRefText": false,
                  "useRefValue": false,
                  "category": true,
                  "measure": false,
                  "filtercard": {
                      "initial": false,
                      "visible": true,
                      "order": 1
                  },
                  "patientlist": {
                      "initial": false,
                      "visible": true,
                      "linkColumn": false
                  },
                  "modelName": "Procedure Datetime"
              },
              {
                  "source": "patient.interactions.proc.attributes.procconceptid",
                  "ordered": false,
                  "cached": true,
                  "useRefText": false,
                  "useRefValue": false,
                  "category": true,
                  "measure": false,
                  "filtercard": {
                      "initial": false,
                      "visible": true,
                      "order": 2
                  },
                  "patientlist": {
                      "initial": false,
                      "visible": true,
                      "linkColumn": false
                  },
                  "modelName": "Procedure Occurrence Id"
              },
              {
                  "source": "patient.interactions.proc.attributes.procconceptset",
                  "ordered": false,
                  "cached": true,
                  "useRefText": false,
                  "useRefValue": false,
                  "category": true,
                  "measure": false,
                  "filtercard": {
                      "initial": true,
                      "visible": true,
                      "order": 3
                  },
                  "patientlist": {
                      "initial": false,
                      "visible": true,
                      "linkColumn": false
                  },
                  "modelName": "Procedure Occurrence Concept Set"
              },
              {
                  "source": "patient.interactions.proc.attributes.procdate",
                  "ordered": false,
                  "cached": true,
                  "useRefText": false,
                  "useRefValue": false,
                  "category": true,
                  "measure": false,
                  "filtercard": {
                      "initial": false,
                      "visible": true,
                      "order": 4
                  },
                  "patientlist": {
                      "initial": false,
                      "visible": true,
                      "linkColumn": false
                  },
                  "modelName": "Procedure Date"
              },
              {
                  "source": "patient.interactions.proc.attributes.qty",
                  "ordered": true,
                  "cached": true,
                  "useRefText": false,
                  "useRefValue": false,
                  "category": true,
                  "measure": true,
                  "filtercard": {
                      "initial": false,
                      "visible": true,
                      "order": 5
                  },
                  "patientlist": {
                      "initial": false,
                      "visible": true,
                      "linkColumn": false
                  },
                  "modelName": "Quantity"
              },
              {
                  "source": "patient.interactions.proc.attributes.pid",
                  "ordered": false,
                  "cached": true,
                  "useRefText": false,
                  "useRefValue": false,
                  "category": true,
                  "measure": false,
                  "filtercard": {
                      "initial": false,
                      "visible": true,
                      "order": 6
                  },
                  "patientlist": {
                      "initial": false,
                      "visible": true,
                      "linkColumn": false
                  },
                  "modelName": "Person id"
              },
              {
                  "source": "patient.interactions.proc.attributes.proctypeconceptid",
                  "ordered": false,
                  "cached": true,
                  "useRefText": true,
                  "useRefValue": true,
                  "category": true,
                  "measure": false,
                  "filtercard": {
                      "initial": false,
                      "visible": true,
                      "order": 7
                  },
                  "patientlist": {
                      "initial": false,
                      "visible": true,
                      "linkColumn": false
                  },
                  "modelName": "Procedure type concept id"
              },
              {
                  "source": "patient.interactions.proc.attributes.proctypeconceptset",
                  "ordered": false,
                  "cached": true,
                  "useRefText": false,
                  "useRefValue": false,
                  "category": true,
                  "measure": false,
                  "filtercard": {
                      "initial": false,
                      "visible": true,
                      "order": 8
                  },
                  "patientlist": {
                      "initial": false,
                      "visible": true,
                      "linkColumn": false
                  },
                  "modelName": "Procedure type concept set"
              },
              {
                  "source": "patient.interactions.proc.attributes.modifierconceptid",
                  "ordered": false,
                  "cached": true,
                  "useRefText": false,
                  "useRefValue": false,
                  "category": true,
                  "measure": false,
                  "filtercard": {
                      "initial": false,
                      "visible": true,
                      "order": 9
                  },
                  "patientlist": {
                      "initial": false,
                      "visible": true,
                      "linkColumn": false
                  },
                  "modelName": "Modifier concept id"
              },
              {
                  "source": "patient.interactions.proc.attributes.modifierconceptset",
                  "ordered": false,
                  "cached": true,
                  "useRefText": false,
                  "useRefValue": false,
                  "category": true,
                  "measure": false,
                  "filtercard": {
                      "initial": false,
                      "visible": true,
                      "order": 10
                  },
                  "patientlist": {
                      "initial": false,
                      "visible": true,
                      "linkColumn": false
                  },
                  "modelName": "Modifier concept set"
              },
              {
                  "source": "patient.interactions.proc.attributes.proc_occ_concept_name",
                  "ordered": false,
                  "cached": true,
                  "useRefText": true,
                  "useRefValue": true,
                  "category": true,
                  "measure": false,
                  "filtercard": {
                      "initial": true,
                      "visible": true,
                      "order": 11
                  },
                  "patientlist": {
                      "initial": false,
                      "visible": true,
                      "linkColumn": false
                  },
                  "modelName": "Procedure concept name"
              },
              {
                  "source": "patient.interactions.proc.attributes.Procedure_concept_id_copy_cf2468c2_0849_4d67_8fa7_e876aef757a1",
                  "ordered": false,
                  "cached": true,
                  "useRefText": true,
                  "useRefValue": true,
                  "category": true,
                  "measure": false,
                  "filtercard": {
                      "initial": false,
                      "visible": true,
                      "order": 12
                  },
                  "patientlist": {
                      "initial": false,
                      "visible": true,
                      "linkColumn": false
                  },
                  "modelName": "Procedure concept id"
              }
          ],
          "initialPatientlistColumn": false,
          "modelName": "Procedure Occurrence"
      },
      {
          "source": "patient.interactions.ppperiod",
          "visible": true,
          "order": 6,
          "initial": false,
          "attributes": [
              {
                  "source": "patient.interactions.ppperiod.attributes.enddate",
                  "ordered": false,
                  "cached": true,
                  "useRefText": false,
                  "useRefValue": false,
                  "category": true,
                  "measure": false,
                  "filtercard": {
                      "initial": false,
                      "visible": true,
                      "order": 1
                  },
                  "patientlist": {
                      "initial": false,
                      "visible": true,
                      "linkColumn": false
                  },
                  "modelName": "Payer Plan Period End Date"
              },
              {
                  "source": "patient.interactions.ppperiod.attributes.startdate",
                  "ordered": false,
                  "cached": true,
                  "useRefText": false,
                  "useRefValue": false,
                  "category": true,
                  "measure": false,
                  "filtercard": {
                      "initial": false,
                      "visible": true,
                      "order": 2
                  },
                  "patientlist": {
                      "initial": false,
                      "visible": true,
                      "linkColumn": false
                  },
                  "modelName": "Payer Plan Period Start Date"
              },
              {
                  "source": "patient.interactions.ppperiod.attributes.pid",
                  "ordered": false,
                  "cached": true,
                  "useRefText": false,
                  "useRefValue": false,
                  "category": true,
                  "measure": false,
                  "filtercard": {
                      "initial": false,
                      "visible": true,
                      "order": 3
                  },
                  "patientlist": {
                      "initial": false,
                      "visible": true,
                      "linkColumn": false
                  },
                  "modelName": "Person id"
              },
              {
                  "source": "patient.interactions.ppperiod.attributes.ppperiodid",
                  "ordered": false,
                  "cached": true,
                  "useRefText": false,
                  "useRefValue": false,
                  "category": true,
                  "measure": false,
                  "filtercard": {
                      "initial": false,
                      "visible": true,
                      "order": 4
                  },
                  "patientlist": {
                      "initial": false,
                      "visible": true,
                      "linkColumn": false
                  },
                  "modelName": "Payer Plan Period Id"
              }
          ],
          "initialPatientlistColumn": false,
          "modelName": "Payer Plan Period"
      },
      {
          "source": "patient.interactions.obsperiod",
          "visible": true,
          "order": 7,
          "initial": false,
          "attributes": [
              {
                  "source": "patient.interactions.obsperiod.attributes.enddate",
                  "ordered": false,
                  "cached": true,
                  "useRefText": false,
                  "useRefValue": false,
                  "category": true,
                  "measure": false,
                  "filtercard": {
                      "initial": false,
                      "visible": true,
                      "order": 1
                  },
                  "patientlist": {
                      "initial": false,
                      "visible": true,
                      "linkColumn": false
                  },
                  "modelName": "Observation Period End Date"
              },
              {
                  "source": "patient.interactions.obsperiod.attributes.startdate",
                  "ordered": false,
                  "cached": true,
                  "useRefText": false,
                  "useRefValue": false,
                  "category": true,
                  "measure": false,
                  "filtercard": {
                      "initial": false,
                      "visible": true,
                      "order": 2
                  },
                  "patientlist": {
                      "initial": false,
                      "visible": true,
                      "linkColumn": false
                  },
                  "modelName": "Observation Period Start Date"
              },
              {
                  "source": "patient.interactions.obsperiod.attributes.pid",
                  "ordered": false,
                  "cached": true,
                  "useRefText": false,
                  "useRefValue": false,
                  "category": true,
                  "measure": false,
                  "filtercard": {
                      "initial": false,
                      "visible": true,
                      "order": 3
                  },
                  "patientlist": {
                      "initial": false,
                      "visible": true,
                      "linkColumn": false
                  },
                  "modelName": "Person id"
              },
              {
                  "source": "patient.interactions.obsperiod.attributes.obsperiodid",
                  "ordered": false,
                  "cached": true,
                  "useRefText": false,
                  "useRefValue": false,
                  "category": true,
                  "measure": false,
                  "filtercard": {
                      "initial": false,
                      "visible": true,
                      "order": 4
                  },
                  "patientlist": {
                      "initial": false,
                      "visible": true,
                      "linkColumn": false
                  },
                  "modelName": "Observation period Id"
              },
              {
                  "source": "patient.interactions.obsperiod.attributes.periodtypeconceptid",
                  "ordered": false,
                  "cached": true,
                  "useRefText": true,
                  "useRefValue": true,
                  "category": true,
                  "measure": false,
                  "filtercard": {
                      "initial": false,
                      "visible": true,
                      "order": 5
                  },
                  "patientlist": {
                      "initial": false,
                      "visible": true,
                      "linkColumn": false
                  },
                  "modelName": "Period type concept id"
              },
              {
                  "source": "patient.interactions.obsperiod.attributes.periodtypeconceptset",
                  "ordered": false,
                  "cached": true,
                  "useRefText": false,
                  "useRefValue": false,
                  "category": true,
                  "measure": false,
                  "filtercard": {
                      "initial": false,
                      "visible": true,
                      "order": 6
                  },
                  "patientlist": {
                      "initial": false,
                      "visible": true,
                      "linkColumn": false
                  },
                  "modelName": "Period type concept set"
              }
          ],
          "initialPatientlistColumn": false,
          "modelName": "Observation Period"
      },
      {
          "source": "patient.interactions.observation",
          "visible": true,
          "order": 8,
          "initial": false,
          "attributes": [
              {
                  "source": "patient.interactions.observation.attributes.obsdatetime",
                  "ordered": false,
                  "cached": true,
                  "useRefText": false,
                  "useRefValue": false,
                  "category": true,
                  "measure": false,
                  "filtercard": {
                      "initial": false,
                      "visible": true,
                      "order": 1
                  },
                  "patientlist": {
                      "initial": false,
                      "visible": true,
                      "linkColumn": false
                  },
                  "modelName": "Observation Datetime"
              },
              {
                  "source": "patient.interactions.observation.attributes.pid",
                  "ordered": false,
                  "cached": true,
                  "useRefText": false,
                  "useRefValue": false,
                  "category": true,
                  "measure": false,
                  "filtercard": {
                      "initial": false,
                      "visible": true,
                      "order": 2
                  },
                  "patientlist": {
                      "initial": false,
                      "visible": true,
                      "linkColumn": false
                  },
                  "modelName": "Person id"
              },
              {
                  "source": "patient.interactions.observation.attributes.obsdate",
                  "ordered": false,
                  "cached": true,
                  "useRefText": false,
                  "useRefValue": false,
                  "category": true,
                  "measure": false,
                  "filtercard": {
                      "initial": false,
                      "visible": true,
                      "order": 3
                  },
                  "patientlist": {
                      "initial": false,
                      "visible": true,
                      "linkColumn": false
                  },
                  "modelName": "Observation Date"
              },
              {
                  "source": "patient.interactions.observation.attributes.observationid",
                  "ordered": false,
                  "cached": true,
                  "useRefText": false,
                  "useRefValue": false,
                  "category": true,
                  "measure": false,
                  "filtercard": {
                      "initial": false,
                      "visible": true,
                      "order": 4
                  },
                  "patientlist": {
                      "initial": false,
                      "visible": true,
                      "linkColumn": false
                  },
                  "modelName": "Observation Id"
              },
              {
                  "source": "patient.interactions.observation.attributes.verbatimtext",
                  "ordered": false,
                  "cached": true,
                  "useRefText": false,
                  "useRefValue": false,
                  "category": true,
                  "measure": false,
                  "filtercard": {
                      "initial": false,
                      "visible": true,
                      "order": 5
                  },
                  "patientlist": {
                      "initial": false,
                      "visible": true,
                      "linkColumn": false
                  },
                  "modelName": "Value as string"
              },
              {
                  "source": "patient.interactions.observation.attributes.numval",
                  "ordered": true,
                  "cached": true,
                  "useRefText": false,
                  "useRefValue": false,
                  "category": true,
                  "measure": true,
                  "filtercard": {
                      "initial": false,
                      "visible": true,
                      "order": 6
                  },
                  "patientlist": {
                      "initial": false,
                      "visible": true,
                      "linkColumn": false
                  },
                  "modelName": "Value as number"
              },
              {
                  "source": "patient.interactions.observation.attributes.obsconceptset",
                  "ordered": false,
                  "cached": true,
                  "useRefText": false,
                  "useRefValue": false,
                  "category": true,
                  "measure": false,
                  "filtercard": {
                      "initial": true,
                      "visible": true,
                      "order": 7
                  },
                  "patientlist": {
                      "initial": false,
                      "visible": true,
                      "linkColumn": false
                  },
                  "modelName": "Observation concept set"
              },
              {
                  "source": "patient.interactions.observation.attributes.observationtypeconceptid",
                  "ordered": false,
                  "cached": true,
                  "useRefText": true,
                  "useRefValue": true,
                  "category": true,
                  "measure": false,
                  "filtercard": {
                      "initial": false,
                      "visible": true,
                      "order": 8
                  },
                  "patientlist": {
                      "initial": false,
                      "visible": true,
                      "linkColumn": false
                  },
                  "modelName": "Observation type concept id"
              },
              {
                  "source": "patient.interactions.observation.attributes.observationtypeconceptset",
                  "ordered": false,
                  "cached": true,
                  "useRefText": false,
                  "useRefValue": false,
                  "category": true,
                  "measure": false,
                  "filtercard": {
                      "initial": false,
                      "visible": true,
                      "order": 9
                  },
                  "patientlist": {
                      "initial": false,
                      "visible": true,
                      "linkColumn": false
                  },
                  "modelName": "Observation type concept set"
              },
              {
                  "source": "patient.interactions.observation.attributes.valueasconceptid",
                  "ordered": false,
                  "cached": true,
                  "useRefText": false,
                  "useRefValue": false,
                  "category": true,
                  "measure": false,
                  "filtercard": {
                      "initial": false,
                      "visible": true,
                      "order": 10
                  },
                  "patientlist": {
                      "initial": false,
                      "visible": true,
                      "linkColumn": false
                  },
                  "modelName": "Value as concept id"
              },
              {
                  "source": "patient.interactions.observation.attributes.valueasconceptset",
                  "ordered": false,
                  "cached": true,
                  "useRefText": false,
                  "useRefValue": false,
                  "category": true,
                  "measure": false,
                  "filtercard": {
                      "initial": false,
                      "visible": true,
                      "order": 11
                  },
                  "patientlist": {
                      "initial": false,
                      "visible": true,
                      "linkColumn": false
                  },
                  "modelName": "Value as concept set"
              },
              {
                  "source": "patient.interactions.observation.attributes.qualifierconceptid",
                  "ordered": false,
                  "cached": true,
                  "useRefText": true,
                  "useRefValue": true,
                  "category": true,
                  "measure": false,
                  "filtercard": {
                      "initial": false,
                      "visible": true,
                      "order": 12
                  },
                  "patientlist": {
                      "initial": false,
                      "visible": true,
                      "linkColumn": false
                  },
                  "modelName": "Qualifier concept id"
              },
              {
                  "source": "patient.interactions.observation.attributes.qualifierconceptset",
                  "ordered": false,
                  "cached": true,
                  "useRefText": false,
                  "useRefValue": false,
                  "category": true,
                  "measure": false,
                  "filtercard": {
                      "initial": false,
                      "visible": true,
                      "order": 13
                  },
                  "patientlist": {
                      "initial": false,
                      "visible": true,
                      "linkColumn": false
                  },
                  "modelName": "Qualifier concept set"
              },
              {
                  "source": "patient.interactions.observation.attributes.unitconceptid",
                  "ordered": false,
                  "cached": true,
                  "useRefText": true,
                  "useRefValue": true,
                  "category": true,
                  "measure": false,
                  "filtercard": {
                      "initial": false,
                      "visible": true,
                      "order": 14
                  },
                  "patientlist": {
                      "initial": false,
                      "visible": true,
                      "linkColumn": false
                  },
                  "modelName": "Unit concept id"
              },
              {
                  "source": "patient.interactions.observation.attributes.unitconceptset",
                  "ordered": false,
                  "cached": true,
                  "useRefText": false,
                  "useRefValue": false,
                  "category": true,
                  "measure": false,
                  "filtercard": {
                      "initial": false,
                      "visible": true,
                      "order": 15
                  },
                  "patientlist": {
                      "initial": false,
                      "visible": true,
                      "linkColumn": false
                  },
                  "modelName": "Unit concept set"
              },
              {
                  "source": "patient.interactions.observation.attributes.obsconceptid",
                  "ordered": false,
                  "cached": true,
                  "useRefText": true,
                  "useRefValue": true,
                  "category": true,
                  "measure": false,
                  "filtercard": {
                      "initial": false,
                      "visible": true,
                      "order": 16
                  },
                  "patientlist": {
                      "initial": false,
                      "visible": true,
                      "linkColumn": false
                  },
                  "modelName": "Observation concept id"
              },
              {
                  "source": "patient.interactions.observation.attributes.obs_concept_name",
                  "ordered": false,
                  "cached": true,
                  "useRefText": true,
                  "useRefValue": true,
                  "category": true,
                  "measure": false,
                  "filtercard": {
                      "initial": true,
                      "visible": true,
                      "order": 17
                  },
                  "patientlist": {
                      "initial": false,
                      "visible": true,
                      "linkColumn": false
                  },
                  "modelName": "Observation concept name"
              }
          ],
          "initialPatientlistColumn": false,
          "modelName": "Observation"
      },
      {
          "source": "patient.interactions.measurement",
          "visible": true,
          "order": 9,
          "initial": false,
          "attributes": [
              {
                  "source": "patient.interactions.measurement.attributes.numval",
                  "ordered": true,
                  "cached": true,
                  "useRefText": false,
                  "useRefValue": false,
                  "category": true,
                  "measure": true,
                  "filtercard": {
                      "initial": false,
                      "visible": true,
                      "order": 1
                  },
                  "patientlist": {
                      "initial": false,
                      "visible": true,
                      "linkColumn": false
                  },
                  "modelName": "Value As Number"
              },
              {
                  "source": "patient.interactions.measurement.attributes.measurementdate",
                  "ordered": false,
                  "cached": true,
                  "useRefText": false,
                  "useRefValue": false,
                  "category": true,
                  "measure": false,
                  "filtercard": {
                      "initial": false,
                      "visible": true,
                      "order": 2
                  },
                  "patientlist": {
                      "initial": false,
                      "visible": true,
                      "linkColumn": false
                  },
                  "modelName": "Measurement date"
              },
              {
                  "source": "patient.interactions.measurement.attributes.pid",
                  "ordered": false,
                  "cached": true,
                  "useRefText": false,
                  "useRefValue": false,
                  "category": true,
                  "measure": false,
                  "filtercard": {
                      "initial": false,
                      "visible": true,
                      "order": 3
                  },
                  "patientlist": {
                      "initial": false,
                      "visible": true,
                      "linkColumn": false
                  },
                  "modelName": "Person id"
              },
              {
                  "source": "patient.interactions.measurement.attributes.measurementid",
                  "ordered": false,
                  "cached": true,
                  "useRefText": false,
                  "useRefValue": false,
                  "category": true,
                  "measure": false,
                  "filtercard": {
                      "initial": false,
                      "visible": true,
                      "order": 4
                  },
                  "patientlist": {
                      "initial": false,
                      "visible": true,
                      "linkColumn": false
                  },
                  "modelName": "Measurement Id"
              },
              {
                  "source": "patient.interactions.measurement.attributes.measurementtypeconceptset",
                  "ordered": false,
                  "cached": true,
                  "useRefText": false,
                  "useRefValue": false,
                  "category": true,
                  "measure": false,
                  "filtercard": {
                      "initial": false,
                      "visible": true,
                      "order": 5
                  },
                  "patientlist": {
                      "initial": false,
                      "visible": true,
                      "linkColumn": false
                  },
                  "modelName": "Measurement type concept set"
              },
              {
                  "source": "patient.interactions.measurement.attributes.valueasconceptset",
                  "ordered": false,
                  "cached": true,
                  "useRefText": false,
                  "useRefValue": false,
                  "category": true,
                  "measure": false,
                  "filtercard": {
                      "initial": false,
                      "visible": true,
                      "order": 6
                  },
                  "patientlist": {
                      "initial": false,
                      "visible": true,
                      "linkColumn": false
                  },
                  "modelName": "Value as concept set"
              },
              {
                  "source": "patient.interactions.measurement.attributes.unitconceptset",
                  "ordered": false,
                  "cached": true,
                  "useRefText": false,
                  "useRefValue": false,
                  "category": true,
                  "measure": false,
                  "filtercard": {
                      "initial": false,
                      "visible": true,
                      "order": 7
                  },
                  "patientlist": {
                      "initial": false,
                      "visible": true,
                      "linkColumn": false
                  },
                  "modelName": "Unit concept set"
              },
              {
                  "source": "patient.interactions.measurement.attributes.measurementconceptid",
                  "ordered": false,
                  "cached": true,
                  "useRefText": true,
                  "useRefValue": true,
                  "category": true,
                  "measure": false,
                  "filtercard": {
                      "initial": false,
                      "visible": true,
                      "order": 8
                  },
                  "patientlist": {
                      "initial": false,
                      "visible": true,
                      "linkColumn": false
                  },
                  "modelName": "Measurement concept id"
              },
              {
                  "source": "patient.interactions.measurement.attributes.measurementconceptset",
                  "ordered": false,
                  "cached": true,
                  "useRefText": false,
                  "useRefValue": false,
                  "category": true,
                  "measure": false,
                  "filtercard": {
                      "initial": true,
                      "visible": true,
                      "order": 9
                  },
                  "patientlist": {
                      "initial": false,
                      "visible": true,
                      "linkColumn": false
                  },
                  "modelName": "Measurement concept set"
              },
              {
                  "source": "patient.interactions.measurement.attributes.measurementtypeconceptid",
                  "ordered": false,
                  "cached": true,
                  "useRefText": true,
                  "useRefValue": true,
                  "category": true,
                  "measure": false,
                  "filtercard": {
                      "initial": false,
                      "visible": true,
                      "order": 10
                  },
                  "patientlist": {
                      "initial": false,
                      "visible": true,
                      "linkColumn": false
                  },
                  "modelName": "Measurement type concept id"
              },
              {
                  "source": "patient.interactions.measurement.attributes.valueasconceptid",
                  "ordered": false,
                  "cached": true,
                  "useRefText": false,
                  "useRefValue": false,
                  "category": true,
                  "measure": false,
                  "filtercard": {
                      "initial": false,
                      "visible": true,
                      "order": 11
                  },
                  "patientlist": {
                      "initial": false,
                      "visible": true,
                      "linkColumn": false
                  },
                  "modelName": "Value as concept id"
              },
              {
                  "source": "patient.interactions.measurement.attributes.unitconceptid",
                  "ordered": false,
                  "cached": true,
                  "useRefText": false,
                  "useRefValue": false,
                  "category": true,
                  "measure": false,
                  "filtercard": {
                      "initial": false,
                      "visible": true,
                      "order": 12
                  },
                  "patientlist": {
                      "initial": false,
                      "visible": true,
                      "linkColumn": false
                  },
                  "modelName": "Unit concept id"
              },
              {
                  "source": "patient.interactions.measurement.attributes.meas_concept_name",
                  "ordered": false,
                  "cached": true,
                  "useRefText": true,
                  "useRefValue": true,
                  "category": true,
                  "measure": false,
                  "filtercard": {
                      "initial": true,
                      "visible": true,
                      "order": 13
                  },
                  "patientlist": {
                      "initial": false,
                      "visible": true,
                      "linkColumn": false
                  },
                  "modelName": "Measurement concept name"
              }
          ],
          "initialPatientlistColumn": false,
          "modelName": "Measurement"
      },
      {
          "source": "patient.interactions.Consent_74db26d2_bb75_489a_a841_051c85dc897b",
          "visible": true,
          "order": 10,
          "initial": false,
          "attributes": [
              {
                  "source": "patient.interactions.Consent_74db26d2_bb75_489a_a841_051c85dc897b.attributes.consentdatetime",
                  "ordered": false,
                  "cached": true,
                  "useRefText": false,
                  "useRefValue": false,
                  "category": true,
                  "measure": false,
                  "filtercard": {
                      "initial": false,
                      "visible": true,
                      "order": 1
                  },
                  "patientlist": {
                      "initial": false,
                      "visible": true,
                      "linkColumn": false
                  },
                  "modelName": "Consent Datetime"
              },
              {
                  "source": "patient.interactions.Consent_74db26d2_bb75_489a_a841_051c85dc897b.attributes.pid",
                  "ordered": false,
                  "cached": true,
                  "useRefText": false,
                  "useRefValue": false,
                  "category": true,
                  "measure": false,
                  "filtercard": {
                      "initial": false,
                      "visible": true,
                      "order": 2
                  },
                  "patientlist": {
                      "initial": false,
                      "visible": true,
                      "linkColumn": false
                  },
                  "modelName": "Person id"
              },
              {
                  "source": "patient.interactions.Consent_74db26d2_bb75_489a_a841_051c85dc897b.attributes.parentconsentdetailid",
                  "ordered": false,
                  "cached": true,
                  "useRefText": false,
                  "useRefValue": false,
                  "category": true,
                  "measure": false,
                  "filtercard": {
                      "initial": false,
                      "visible": true,
                      "order": 3
                  },
                  "patientlist": {
                      "initial": false,
                      "visible": true,
                      "linkColumn": false
                  },
                  "modelName": "Parent Consent Detail Id"
              },
              {
                  "source": "patient.interactions.Consent_74db26d2_bb75_489a_a841_051c85dc897b.attributes.status",
                  "ordered": false,
                  "cached": true,
                  "useRefText": false,
                  "useRefValue": false,
                  "category": true,
                  "measure": false,
                  "filtercard": {
                      "initial": false,
                      "visible": true,
                      "order": 4
                  },
                  "patientlist": {
                      "initial": false,
                      "visible": true,
                      "linkColumn": false
                  },
                  "modelName": "Status"
              },
              {
                  "source": "patient.interactions.Consent_74db26d2_bb75_489a_a841_051c85dc897b.attributes.textval",
                  "ordered": false,
                  "cached": true,
                  "useRefText": false,
                  "useRefValue": false,
                  "category": true,
                  "measure": false,
                  "filtercard": {
                      "initial": false,
                      "visible": true,
                      "order": 5
                  },
                  "patientlist": {
                      "initial": false,
                      "visible": true,
                      "linkColumn": false
                  },
                  "modelName": "Value"
              },
              {
                  "source": "patient.interactions.Consent_74db26d2_bb75_489a_a841_051c85dc897b.attributes.consentcategory",
                  "ordered": false,
                  "cached": true,
                  "useRefText": false,
                  "useRefValue": false,
                  "category": true,
                  "measure": false,
                  "filtercard": {
                      "initial": false,
                      "visible": true,
                      "order": 6
                  },
                  "patientlist": {
                      "initial": false,
                      "visible": true,
                      "linkColumn": false
                  },
                  "modelName": "Category"
              },
              {
                  "source": "patient.interactions.Consent_74db26d2_bb75_489a_a841_051c85dc897b.attributes.New_Attribute_1_3d0da2a3_f0de_4112_b87c_e7aff266c0d8",
                  "ordered": false,
                  "cached": true,
                  "useRefText": false,
                  "useRefValue": false,
                  "category": true,
                  "measure": false,
                  "filtercard": {
                      "initial": false,
                      "visible": true,
                      "order": 7
                  },
                  "patientlist": {
                      "initial": false,
                      "visible": true,
                      "linkColumn": false
                  },
                  "modelName": "Attribute"
              },
              {
                  "source": "patient.interactions.Consent_74db26d2_bb75_489a_a841_051c85dc897b.attributes.Attribute_copy_53f290b7_70e9_4c1e_bd6d_605bc916ce66",
                  "ordered": false,
                  "cached": true,
                  "useRefText": false,
                  "useRefValue": false,
                  "category": true,
                  "measure": false,
                  "filtercard": {
                      "initial": false,
                      "visible": true,
                      "order": 8
                  },
                  "patientlist": {
                      "initial": false,
                      "visible": true,
                      "linkColumn": false
                  },
                  "modelName": "Attribute Group Id"
              },
              {
                  "source": "patient.interactions.Consent_74db26d2_bb75_489a_a841_051c85dc897b.attributes.Consent_Id_copy_60a4adeb_1e84_4f04_b7d5_8eb1c006f56d",
                  "ordered": false,
                  "cached": true,
                  "useRefText": false,
                  "useRefValue": false,
                  "category": true,
                  "measure": false,
                  "filtercard": {
                      "initial": false,
                      "visible": true,
                      "order": 9
                  },
                  "patientlist": {
                      "initial": false,
                      "visible": true,
                      "linkColumn": false
                  },
                  "modelName": "Consent Detail Id"
              }
          ],
          "initialPatientlistColumn": false,
          "modelName": "Consent"
      },
      {
          "source": "patient.interactions.drugexposure",
          "visible": true,
          "order": 11,
          "initial": false,
          "attributes": [
              {
                  "source": "patient.interactions.drugexposure.attributes.enddatetime",
                  "ordered": false,
                  "cached": true,
                  "useRefText": false,
                  "useRefValue": false,
                  "category": true,
                  "measure": false,
                  "filtercard": {
                      "initial": false,
                      "visible": true,
                      "order": 1
                  },
                  "patientlist": {
                      "initial": false,
                      "visible": true,
                      "linkColumn": false
                  },
                  "modelName": "Drug Exposure End Datetime"
              },
              {
                  "source": "patient.interactions.drugexposure.attributes.refills",
                  "ordered": true,
                  "cached": true,
                  "useRefText": false,
                  "useRefValue": false,
                  "category": true,
                  "measure": true,
                  "filtercard": {
                      "initial": false,
                      "visible": true,
                      "order": 2
                  },
                  "patientlist": {
                      "initial": false,
                      "visible": true,
                      "linkColumn": false
                  },
                  "modelName": "Refills"
              },
              {
                  "source": "patient.interactions.drugexposure.attributes.startdatetime",
                  "ordered": false,
                  "cached": true,
                  "useRefText": false,
                  "useRefValue": false,
                  "category": true,
                  "measure": false,
                  "filtercard": {
                      "initial": false,
                      "visible": true,
                      "order": 3
                  },
                  "patientlist": {
                      "initial": false,
                      "visible": true,
                      "linkColumn": false
                  },
                  "modelName": "Drug Exposure Start Datetime"
              },
              {
                  "source": "patient.interactions.drugexposure.attributes.stopreason",
                  "ordered": false,
                  "cached": true,
                  "useRefText": false,
                  "useRefValue": false,
                  "category": true,
                  "measure": false,
                  "filtercard": {
                      "initial": false,
                      "visible": true,
                      "order": 4
                  },
                  "patientlist": {
                      "initial": false,
                      "visible": true,
                      "linkColumn": false
                  },
                  "modelName": "Stop Reason"
              },
              {
                  "source": "patient.interactions.drugexposure.attributes.enddate",
                  "ordered": false,
                  "cached": true,
                  "useRefText": false,
                  "useRefValue": false,
                  "category": true,
                  "measure": false,
                  "filtercard": {
                      "initial": false,
                      "visible": true,
                      "order": 5
                  },
                  "patientlist": {
                      "initial": false,
                      "visible": true,
                      "linkColumn": false
                  },
                  "modelName": "Drug Exposure End Date"
              },
              {
                  "source": "patient.interactions.drugexposure.attributes.startdate",
                  "ordered": false,
                  "cached": true,
                  "useRefText": false,
                  "useRefValue": false,
                  "category": true,
                  "measure": false,
                  "filtercard": {
                      "initial": false,
                      "visible": true,
                      "order": 6
                  },
                  "patientlist": {
                      "initial": false,
                      "visible": true,
                      "linkColumn": false
                  },
                  "modelName": "Drug Exposure Start Date"
              },
              {
                  "source": "patient.interactions.drugexposure.attributes.lotnumber",
                  "ordered": false,
                  "cached": true,
                  "useRefText": false,
                  "useRefValue": false,
                  "category": true,
                  "measure": false,
                  "filtercard": {
                      "initial": false,
                      "visible": true,
                      "order": 7
                  },
                  "patientlist": {
                      "initial": false,
                      "visible": true,
                      "linkColumn": false
                  },
                  "modelName": "Lot Number"
              },
              {
                  "source": "patient.interactions.drugexposure.attributes.drugexposureid",
                  "ordered": false,
                  "cached": true,
                  "useRefText": false,
                  "useRefValue": false,
                  "category": true,
                  "measure": false,
                  "filtercard": {
                      "initial": false,
                      "visible": true,
                      "order": 8
                  },
                  "patientlist": {
                      "initial": false,
                      "visible": true,
                      "linkColumn": false
                  },
                  "modelName": "Drug Exposure Id"
              },
              {
                  "source": "patient.interactions.drugexposure.attributes.sig",
                  "ordered": false,
                  "cached": true,
                  "useRefText": false,
                  "useRefValue": false,
                  "category": true,
                  "measure": false,
                  "filtercard": {
                      "initial": false,
                      "visible": true,
                      "order": 9
                  },
                  "patientlist": {
                      "initial": false,
                      "visible": true,
                      "linkColumn": false
                  },
                  "modelName": "Sig"
              },
              {
                  "source": "patient.interactions.drugexposure.attributes.pid",
                  "ordered": false,
                  "cached": true,
                  "useRefText": false,
                  "useRefValue": false,
                  "category": true,
                  "measure": false,
                  "filtercard": {
                      "initial": false,
                      "visible": true,
                      "order": 10
                  },
                  "patientlist": {
                      "initial": false,
                      "visible": true,
                      "linkColumn": false
                  },
                  "modelName": "Person id"
              },
              {
                  "source": "patient.interactions.drugexposure.attributes.verbatimenddate",
                  "ordered": false,
                  "cached": true,
                  "useRefText": false,
                  "useRefValue": false,
                  "category": true,
                  "measure": false,
                  "filtercard": {
                      "initial": false,
                      "visible": true,
                      "order": 11
                  },
                  "patientlist": {
                      "initial": false,
                      "visible": true,
                      "linkColumn": false
                  },
                  "modelName": "Verbatim End Date"
              },
              {
                  "source": "patient.interactions.drugexposure.attributes.dayssupply",
                  "ordered": true,
                  "cached": true,
                  "useRefText": false,
                  "useRefValue": false,
                  "category": true,
                  "measure": true,
                  "filtercard": {
                      "initial": false,
                      "visible": true,
                      "order": 12
                  },
                  "patientlist": {
                      "initial": false,
                      "visible": true,
                      "linkColumn": false
                  },
                  "modelName": "Days of supply"
              },
              {
                  "source": "patient.interactions.drugexposure.attributes.drugconceptid",
                  "ordered": false,
                  "cached": true,
                  "useRefText": true,
                  "useRefValue": true,
                  "category": true,
                  "measure": false,
                  "filtercard": {
                      "initial": false,
                      "visible": true,
                      "order": 13
                  },
                  "patientlist": {
                      "initial": false,
                      "visible": true,
                      "linkColumn": false
                  },
                  "modelName": "Drug concept id"
              },
              {
                  "source": "patient.interactions.drugexposure.attributes.drugconceptset",
                  "ordered": false,
                  "cached": true,
                  "useRefText": false,
                  "useRefValue": false,
                  "category": true,
                  "measure": false,
                  "filtercard": {
                      "initial": true,
                      "visible": true,
                      "order": 14
                  },
                  "patientlist": {
                      "initial": false,
                      "visible": true,
                      "linkColumn": false
                  },
                  "modelName": "Drug concept set"
              },
              {
                  "source": "patient.interactions.drugexposure.attributes.routeconceptid",
                  "ordered": false,
                  "cached": true,
                  "useRefText": true,
                  "useRefValue": true,
                  "category": true,
                  "measure": false,
                  "filtercard": {
                      "initial": false,
                      "visible": true,
                      "order": 15
                  },
                  "patientlist": {
                      "initial": false,
                      "visible": true,
                      "linkColumn": false
                  },
                  "modelName": "Route concept id"
              },
              {
                  "source": "patient.interactions.drugexposure.attributes.routeconceptset",
                  "ordered": false,
                  "cached": true,
                  "useRefText": false,
                  "useRefValue": false,
                  "category": true,
                  "measure": false,
                  "filtercard": {
                      "initial": false,
                      "visible": true,
                      "order": 16
                  },
                  "patientlist": {
                      "initial": false,
                      "visible": true,
                      "linkColumn": false
                  },
                  "modelName": "Route concept set"
              },
              {
                  "source": "patient.interactions.drugexposure.attributes.drugtypeconceptid",
                  "ordered": false,
                  "cached": true,
                  "useRefText": true,
                  "useRefValue": true,
                  "category": true,
                  "measure": false,
                  "filtercard": {
                      "initial": false,
                      "visible": true,
                      "order": 17
                  },
                  "patientlist": {
                      "initial": false,
                      "visible": true,
                      "linkColumn": false
                  },
                  "modelName": "Drug type concept id"
              },
              {
                  "source": "patient.interactions.drugexposure.attributes.drugtypeconceptset",
                  "ordered": false,
                  "cached": true,
                  "useRefText": false,
                  "useRefValue": false,
                  "category": true,
                  "measure": false,
                  "filtercard": {
                      "initial": false,
                      "visible": true,
                      "order": 18
                  },
                  "patientlist": {
                      "initial": false,
                      "visible": true,
                      "linkColumn": false
                  },
                  "modelName": "Drug type concept set"
              },
              {
                  "source": "patient.interactions.drugexposure.attributes.drug_concept_name",
                  "ordered": false,
                  "cached": true,
                  "useRefText": true,
                  "useRefValue": true,
                  "category": true,
                  "measure": false,
                  "filtercard": {
                      "initial": true,
                      "visible": true,
                      "order": 19
                  },
                  "patientlist": {
                      "initial": false,
                      "visible": true,
                      "linkColumn": false
                  },
                  "modelName": "Drug concept name"
              }
          ],
          "initialPatientlistColumn": false,
          "modelName": "Drug Exposure"
      },
      {
          "source": "patient.interactions.drugera",
          "visible": true,
          "order": 12,
          "initial": false,
          "attributes": [
              {
                  "source": "patient.interactions.drugera.attributes.enddate",
                  "ordered": false,
                  "cached": true,
                  "useRefText": false,
                  "useRefValue": false,
                  "category": true,
                  "measure": false,
                  "filtercard": {
                      "initial": false,
                      "visible": true,
                      "order": 1
                  },
                  "patientlist": {
                      "initial": false,
                      "visible": true,
                      "linkColumn": false
                  },
                  "modelName": "Drug Era End Date"
              },
              {
                  "source": "patient.interactions.drugera.attributes.startdate",
                  "ordered": false,
                  "cached": true,
                  "useRefText": false,
                  "useRefValue": false,
                  "category": true,
                  "measure": false,
                  "filtercard": {
                      "initial": false,
                      "visible": true,
                      "order": 2
                  },
                  "patientlist": {
                      "initial": false,
                      "visible": true,
                      "linkColumn": false
                  },
                  "modelName": "Drug Era Start Date"
              },
              {
                  "source": "patient.interactions.drugera.attributes.pid",
                  "ordered": false,
                  "cached": true,
                  "useRefText": false,
                  "useRefValue": false,
                  "category": true,
                  "measure": false,
                  "filtercard": {
                      "initial": false,
                      "visible": true,
                      "order": 3
                  },
                  "patientlist": {
                      "initial": false,
                      "visible": true,
                      "linkColumn": false
                  },
                  "modelName": "Person id"
              },
              {
                  "source": "patient.interactions.drugera.attributes.drugeraid",
                  "ordered": false,
                  "cached": true,
                  "useRefText": false,
                  "useRefValue": false,
                  "category": true,
                  "measure": false,
                  "filtercard": {
                      "initial": false,
                      "visible": true,
                      "order": 4
                  },
                  "patientlist": {
                      "initial": false,
                      "visible": true,
                      "linkColumn": false
                  },
                  "modelName": "Drug Era Id"
              },
              {
                  "source": "patient.interactions.drugera.attributes.gapdays",
                  "ordered": true,
                  "cached": true,
                  "useRefText": false,
                  "useRefValue": false,
                  "category": true,
                  "measure": true,
                  "filtercard": {
                      "initial": false,
                      "visible": true,
                      "order": 5
                  },
                  "patientlist": {
                      "initial": false,
                      "visible": true,
                      "linkColumn": false
                  },
                  "modelName": "Gap Days"
              },
              {
                  "source": "patient.interactions.drugera.attributes.drugexpcount",
                  "ordered": true,
                  "cached": true,
                  "useRefText": false,
                  "useRefValue": false,
                  "category": true,
                  "measure": true,
                  "filtercard": {
                      "initial": false,
                      "visible": true,
                      "order": 6
                  },
                  "patientlist": {
                      "initial": false,
                      "visible": true,
                      "linkColumn": false
                  },
                  "modelName": "Drug Exposure Count"
              },
              {
                  "source": "patient.interactions.drugera.attributes.drugconceptset",
                  "ordered": false,
                  "cached": true,
                  "useRefText": false,
                  "useRefValue": false,
                  "category": true,
                  "measure": false,
                  "filtercard": {
                      "initial": true,
                      "visible": true,
                      "order": 7
                  },
                  "patientlist": {
                      "initial": false,
                      "visible": true,
                      "linkColumn": false
                  },
                  "modelName": "Drug concept set"
              },
              {
                  "source": "patient.interactions.drugera.attributes.drugconceptid",
                  "ordered": false,
                  "cached": true,
                  "useRefText": true,
                  "useRefValue": true,
                  "category": true,
                  "measure": false,
                  "filtercard": {
                      "initial": false,
                      "visible": true,
                      "order": 8
                  },
                  "patientlist": {
                      "initial": false,
                      "visible": true,
                      "linkColumn": false
                  },
                  "modelName": "Drug concept id"
              }
          ],
          "initialPatientlistColumn": false,
          "modelName": "Drug Era"
      },
      {
          "source": "patient.interactions.doseera",
          "visible": true,
          "order": 13,
          "initial": false,
          "attributes": [
              {
                  "source": "patient.interactions.doseera.attributes.pid",
                  "ordered": false,
                  "cached": true,
                  "useRefText": false,
                  "useRefValue": false,
                  "category": true,
                  "measure": false,
                  "filtercard": {
                      "initial": false,
                      "visible": true,
                      "order": 1
                  },
                  "patientlist": {
                      "initial": false,
                      "visible": true,
                      "linkColumn": false
                  },
                  "modelName": "Person id"
              },
              {
                  "source": "patient.interactions.doseera.attributes.enddate",
                  "ordered": false,
                  "cached": true,
                  "useRefText": false,
                  "useRefValue": false,
                  "category": true,
                  "measure": false,
                  "filtercard": {
                      "initial": false,
                      "visible": true,
                      "order": 2
                  },
                  "patientlist": {
                      "initial": false,
                      "visible": true,
                      "linkColumn": false
                  },
                  "modelName": "Dose Era End Date"
              },
              {
                  "source": "patient.interactions.doseera.attributes.startdate",
                  "ordered": false,
                  "cached": true,
                  "useRefText": false,
                  "useRefValue": false,
                  "category": true,
                  "measure": false,
                  "filtercard": {
                      "initial": false,
                      "visible": true,
                      "order": 3
                  },
                  "patientlist": {
                      "initial": false,
                      "visible": true,
                      "linkColumn": false
                  },
                  "modelName": "Dose Era Start Date"
              },
              {
                  "source": "patient.interactions.doseera.attributes.dosevalue",
                  "ordered": true,
                  "cached": true,
                  "useRefText": false,
                  "useRefValue": false,
                  "category": true,
                  "measure": true,
                  "filtercard": {
                      "initial": false,
                      "visible": true,
                      "order": 4
                  },
                  "patientlist": {
                      "initial": false,
                      "visible": true,
                      "linkColumn": false
                  },
                  "modelName": "Dose Value"
              },
              {
                  "source": "patient.interactions.doseera.attributes.doseeraid",
                  "ordered": false,
                  "cached": true,
                  "useRefText": false,
                  "useRefValue": false,
                  "category": true,
                  "measure": false,
                  "filtercard": {
                      "initial": false,
                      "visible": true,
                      "order": 5
                  },
                  "patientlist": {
                      "initial": false,
                      "visible": true,
                      "linkColumn": false
                  },
                  "modelName": "Dose Era Id"
              },
              {
                  "source": "patient.interactions.doseera.attributes.drugconceptset",
                  "ordered": false,
                  "cached": true,
                  "useRefText": false,
                  "useRefValue": false,
                  "category": true,
                  "measure": false,
                  "filtercard": {
                      "initial": true,
                      "visible": true,
                      "order": 6
                  },
                  "patientlist": {
                      "initial": false,
                      "visible": true,
                      "linkColumn": false
                  },
                  "modelName": "Drug concept set"
              },
              {
                  "source": "patient.interactions.doseera.attributes.unitconceptset",
                  "ordered": false,
                  "cached": true,
                  "useRefText": false,
                  "useRefValue": false,
                  "category": true,
                  "measure": false,
                  "filtercard": {
                      "initial": false,
                      "visible": true,
                      "order": 7
                  },
                  "patientlist": {
                      "initial": false,
                      "visible": true,
                      "linkColumn": false
                  },
                  "modelName": "Unit concept set"
              },
              {
                  "source": "patient.interactions.doseera.attributes.drugconceptid",
                  "ordered": false,
                  "cached": true,
                  "useRefText": true,
                  "useRefValue": true,
                  "category": true,
                  "measure": false,
                  "filtercard": {
                      "initial": false,
                      "visible": true,
                      "order": 8
                  },
                  "patientlist": {
                      "initial": false,
                      "visible": true,
                      "linkColumn": false
                  },
                  "modelName": "Drug concept id"
              },
              {
                  "source": "patient.interactions.doseera.attributes.unitconceptid",
                  "ordered": false,
                  "cached": true,
                  "useRefText": true,
                  "useRefValue": true,
                  "category": true,
                  "measure": false,
                  "filtercard": {
                      "initial": false,
                      "visible": true,
                      "order": 9
                  },
                  "patientlist": {
                      "initial": false,
                      "visible": true,
                      "linkColumn": false
                  },
                  "modelName": "Unit concept id"
              }
          ],
          "initialPatientlistColumn": false,
          "modelName": "Dose Era"
      },
      {
          "source": "patient.interactions.deviceexposure",
          "visible": true,
          "order": 14,
          "initial": false,
          "attributes": [
              {
                  "source": "patient.interactions.deviceexposure.attributes.enddate",
                  "ordered": false,
                  "cached": true,
                  "useRefText": false,
                  "useRefValue": false,
                  "category": true,
                  "measure": false,
                  "filtercard": {
                      "initial": false,
                      "visible": true,
                      "order": 1
                  },
                  "patientlist": {
                      "initial": false,
                      "visible": true,
                      "linkColumn": false
                  },
                  "modelName": "Device Exposure End Date"
              },
              {
                  "source": "patient.interactions.deviceexposure.attributes.startdate",
                  "ordered": false,
                  "cached": true,
                  "useRefText": false,
                  "useRefValue": false,
                  "category": true,
                  "measure": false,
                  "filtercard": {
                      "initial": false,
                      "visible": true,
                      "order": 2
                  },
                  "patientlist": {
                      "initial": false,
                      "visible": true,
                      "linkColumn": false
                  },
                  "modelName": "Device Exposure Start Date"
              },
              {
                  "source": "patient.interactions.deviceexposure.attributes.pid",
                  "ordered": false,
                  "cached": true,
                  "useRefText": false,
                  "useRefValue": false,
                  "category": true,
                  "measure": false,
                  "filtercard": {
                      "initial": false,
                      "visible": true,
                      "order": 3
                  },
                  "patientlist": {
                      "initial": false,
                      "visible": true,
                      "linkColumn": false
                  },
                  "modelName": "Person id"
              },
              {
                  "source": "patient.interactions.deviceexposure.attributes.deviceexposureid",
                  "ordered": false,
                  "cached": true,
                  "useRefText": false,
                  "useRefValue": false,
                  "category": true,
                  "measure": false,
                  "filtercard": {
                      "initial": false,
                      "visible": true,
                      "order": 4
                  },
                  "patientlist": {
                      "initial": false,
                      "visible": true,
                      "linkColumn": false
                  },
                  "modelName": "Device Exposure Id"
              },
              {
                  "source": "patient.interactions.deviceexposure.attributes.devicetypeconceptset",
                  "ordered": false,
                  "cached": true,
                  "useRefText": false,
                  "useRefValue": false,
                  "category": true,
                  "measure": false,
                  "filtercard": {
                      "initial": false,
                      "visible": true,
                      "order": 5
                  },
                  "patientlist": {
                      "initial": false,
                      "visible": true,
                      "linkColumn": false
                  },
                  "modelName": "Device Type concept set"
              },
              {
                  "source": "patient.interactions.deviceexposure.attributes.deviceconceptid",
                  "ordered": false,
                  "cached": true,
                  "useRefText": true,
                  "useRefValue": true,
                  "category": true,
                  "measure": false,
                  "filtercard": {
                      "initial": false,
                      "visible": true,
                      "order": 6
                  },
                  "patientlist": {
                      "initial": false,
                      "visible": true,
                      "linkColumn": false
                  },
                  "modelName": "Device concept id"
              },
              {
                  "source": "patient.interactions.deviceexposure.attributes.deviceconceptset",
                  "ordered": false,
                  "cached": true,
                  "useRefText": false,
                  "useRefValue": false,
                  "category": true,
                  "measure": false,
                  "filtercard": {
                      "initial": true,
                      "visible": true,
                      "order": 7
                  },
                  "patientlist": {
                      "initial": false,
                      "visible": true,
                      "linkColumn": false
                  },
                  "modelName": "Device concept set"
              },
              {
                  "source": "patient.interactions.deviceexposure.attributes.devicetypeconceptid",
                  "ordered": false,
                  "cached": true,
                  "useRefText": true,
                  "useRefValue": true,
                  "category": true,
                  "measure": false,
                  "filtercard": {
                      "initial": false,
                      "visible": true,
                      "order": 8
                  },
                  "patientlist": {
                      "initial": false,
                      "visible": true,
                      "linkColumn": false
                  },
                  "modelName": "Device Type concept id"
              },
              {
                  "source": "patient.interactions.deviceexposure.attributes.device_concept_name",
                  "ordered": false,
                  "cached": true,
                  "useRefText": true,
                  "useRefValue": true,
                  "category": true,
                  "measure": false,
                  "filtercard": {
                      "initial": true,
                      "visible": true,
                      "order": 9
                  },
                  "patientlist": {
                      "initial": false,
                      "visible": true,
                      "linkColumn": false
                  },
                  "modelName": "Device concept name"
              }
          ],
          "initialPatientlistColumn": false,
          "modelName": "Device Exposure"
      },
      {
          "source": "patient.interactions.death",
          "visible": true,
          "order": 15,
          "initial": false,
          "attributes": [
              {
                  "source": "patient.interactions.death.attributes.deathtypeconceptset",
                  "ordered": false,
                  "cached": true,
                  "useRefText": false,
                  "useRefValue": false,
                  "category": true,
                  "measure": false,
                  "filtercard": {
                      "initial": true,
                      "visible": true,
                      "order": 1
                  },
                  "patientlist": {
                      "initial": false,
                      "visible": true,
                      "linkColumn": false
                  },
                  "modelName": "Death Type concept set"
              },
              {
                  "source": "patient.interactions.death.attributes.pid",
                  "ordered": false,
                  "cached": true,
                  "useRefText": false,
                  "useRefValue": false,
                  "category": true,
                  "measure": false,
                  "filtercard": {
                      "initial": false,
                      "visible": true,
                      "order": 2
                  },
                  "patientlist": {
                      "initial": false,
                      "visible": true,
                      "linkColumn": false
                  },
                  "modelName": "Person id"
              },
              {
                  "source": "patient.interactions.death.attributes.deathdatetime",
                  "ordered": false,
                  "cached": true,
                  "useRefText": false,
                  "useRefValue": false,
                  "category": true,
                  "measure": false,
                  "filtercard": {
                      "initial": false,
                      "visible": true,
                      "order": 3
                  },
                  "patientlist": {
                      "initial": false,
                      "visible": true,
                      "linkColumn": false
                  },
                  "modelName": "Death Datetime"
              },
              {
                  "source": "patient.interactions.death.attributes.deathdate",
                  "ordered": false,
                  "cached": true,
                  "useRefText": false,
                  "useRefValue": false,
                  "category": true,
                  "measure": false,
                  "filtercard": {
                      "initial": false,
                      "visible": true,
                      "order": 4
                  },
                  "patientlist": {
                      "initial": false,
                      "visible": true,
                      "linkColumn": false
                  },
                  "modelName": "Death Date"
              },
              {
                  "source": "patient.interactions.death.attributes.deathtypeconceptid",
                  "ordered": false,
                  "cached": true,
                  "useRefText": true,
                  "useRefValue": true,
                  "category": true,
                  "measure": false,
                  "filtercard": {
                      "initial": false,
                      "visible": true,
                      "order": 5
                  },
                  "patientlist": {
                      "initial": false,
                      "visible": true,
                      "linkColumn": false
                  },
                  "modelName": "Death Type concept id"
              },
              {
                  "source": "patient.interactions.death.attributes.death_type_concept_name",
                  "ordered": false,
                  "cached": true,
                  "useRefText": false,
                  "useRefValue": false,
                  "category": true,
                  "measure": false,
                  "filtercard": {
                      "initial": false,
                      "visible": true,
                      "order": 6
                  },
                  "patientlist": {
                      "initial": false,
                      "visible": true,
                      "linkColumn": false
                  },
                  "modelName": "Death Type concept name"
              }
          ],
          "initialPatientlistColumn": false,
          "modelName": "Death"
      },
      {
          "source": "patient.interactions.conditionoccurrence",
          "visible": true,
          "order": 16,
          "initial": false,
          "attributes": [
              {
                  "source": "patient.interactions.conditionoccurrence.attributes.condition_occ_concept_name",
                  "ordered": false,
                  "cached": true,
                  "useRefText": true,
                  "useRefValue": true,
                  "category": true,
                  "measure": false,
                  "filtercard": {
                      "initial": true,
                      "visible": true,
                      "order": 1
                  },
                  "patientlist": {
                      "initial": false,
                      "visible": true,
                      "linkColumn": false
                  },
                  "modelName": "Condition concept Name"
              },
              {
                  "source": "patient.interactions.conditionoccurrence.attributes.visitoccurrenceid",
                  "ordered": false,
                  "cached": true,
                  "useRefText": false,
                  "useRefValue": false,
                  "category": true,
                  "measure": false,
                  "filtercard": {
                      "initial": false,
                      "visible": true,
                      "order": 2
                  },
                  "patientlist": {
                      "initial": false,
                      "visible": true,
                      "linkColumn": false
                  },
                  "modelName": "Visit Occurrence Id"
              },
              {
                  "source": "patient.interactions.conditionoccurrence.attributes.enddate",
                  "ordered": false,
                  "cached": true,
                  "useRefText": false,
                  "useRefValue": false,
                  "category": true,
                  "measure": false,
                  "filtercard": {
                      "initial": false,
                      "visible": true,
                      "order": 3
                  },
                  "patientlist": {
                      "initial": false,
                      "visible": true,
                      "linkColumn": false
                  },
                  "modelName": "Condition End Date"
              },
              {
                  "source": "patient.interactions.conditionoccurrence.attributes.startdate",
                  "ordered": false,
                  "cached": true,
                  "useRefText": false,
                  "useRefValue": false,
                  "category": true,
                  "measure": false,
                  "filtercard": {
                      "initial": false,
                      "visible": true,
                      "order": 4
                  },
                  "patientlist": {
                      "initial": false,
                      "visible": true,
                      "linkColumn": false
                  },
                  "modelName": "Condition Start Date"
              },
              {
                  "source": "patient.interactions.conditionoccurrence.attributes.pid",
                  "ordered": false,
                  "cached": true,
                  "useRefText": false,
                  "useRefValue": false,
                  "category": true,
                  "measure": false,
                  "filtercard": {
                      "initial": false,
                      "visible": true,
                      "order": 5
                  },
                  "patientlist": {
                      "initial": false,
                      "visible": true,
                      "linkColumn": false
                  },
                  "modelName": "Person id"
              },
              {
                  "source": "patient.interactions.conditionoccurrence.attributes.conditionoccurrenceid",
                  "ordered": false,
                  "cached": true,
                  "useRefText": false,
                  "useRefValue": false,
                  "category": true,
                  "measure": false,
                  "filtercard": {
                      "initial": false,
                      "visible": true,
                      "order": 6
                  },
                  "patientlist": {
                      "initial": false,
                      "visible": true,
                      "linkColumn": false
                  },
                  "modelName": "Condition Occurrence Id"
              },
              {
                  "source": "patient.interactions.conditionoccurrence.attributes.conditiontypeconceptset",
                  "ordered": false,
                  "cached": true,
                  "useRefText": false,
                  "useRefValue": false,
                  "category": true,
                  "measure": false,
                  "filtercard": {
                      "initial": false,
                      "visible": true,
                      "order": 7
                  },
                  "patientlist": {
                      "initial": false,
                      "visible": true,
                      "linkColumn": false
                  },
                  "modelName": "Condition Type concept set"
              },
              {
                  "source": "patient.interactions.conditionoccurrence.attributes.conditionsourceconceptset",
                  "ordered": false,
                  "cached": true,
                  "useRefText": false,
                  "useRefValue": false,
                  "category": true,
                  "measure": false,
                  "filtercard": {
                      "initial": false,
                      "visible": true,
                      "order": 8
                  },
                  "patientlist": {
                      "initial": false,
                      "visible": true,
                      "linkColumn": false
                  },
                  "modelName": "Condition Source concept set"
              },
              {
                  "source": "patient.interactions.conditionoccurrence.attributes.conditionstatusconceptset",
                  "ordered": false,
                  "cached": true,
                  "useRefText": false,
                  "useRefValue": false,
                  "category": true,
                  "measure": false,
                  "filtercard": {
                      "initial": false,
                      "visible": true,
                      "order": 9
                  },
                  "patientlist": {
                      "initial": false,
                      "visible": true,
                      "linkColumn": false
                  },
                  "modelName": "Condition Status concept set"
              },
              {
                  "source": "patient.interactions.conditionoccurrence.attributes.conditionconceptid",
                  "ordered": false,
                  "cached": true,
                  "useRefText": true,
                  "useRefValue": true,
                  "category": true,
                  "measure": false,
                  "filtercard": {
                      "initial": false,
                      "visible": true,
                      "order": 10
                  },
                  "patientlist": {
                      "initial": false,
                      "visible": true,
                      "linkColumn": false
                  },
                  "modelName": "Condition concept id"
              },
              {
                  "source": "patient.interactions.conditionoccurrence.attributes.conditionconceptset",
                  "ordered": false,
                  "cached": true,
                  "useRefText": false,
                  "useRefValue": false,
                  "category": true,
                  "measure": false,
                  "filtercard": {
                      "initial": true,
                      "visible": true,
                      "order": 11
                  },
                  "patientlist": {
                      "initial": false,
                      "visible": true,
                      "linkColumn": false
                  },
                  "modelName": "Condition concept set"
              },
              {
                  "source": "patient.interactions.conditionoccurrence.attributes.conditiontypeconceptid",
                  "ordered": false,
                  "cached": true,
                  "useRefText": true,
                  "useRefValue": true,
                  "category": true,
                  "measure": false,
                  "filtercard": {
                      "initial": false,
                      "visible": true,
                      "order": 12
                  },
                  "patientlist": {
                      "initial": false,
                      "visible": true,
                      "linkColumn": false
                  },
                  "modelName": "Condition Type concept id"
              },
              {
                  "source": "patient.interactions.conditionoccurrence.attributes.conditionsourceconceptid",
                  "ordered": false,
                  "cached": true,
                  "useRefText": false,
                  "useRefValue": false,
                  "category": true,
                  "measure": false,
                  "filtercard": {
                      "initial": false,
                      "visible": true,
                      "order": 13
                  },
                  "patientlist": {
                      "initial": false,
                      "visible": true,
                      "linkColumn": false
                  },
                  "modelName": "Condition Source concept id"
              },
              {
                  "source": "patient.interactions.conditionoccurrence.attributes.conditionstatusconceptid",
                  "ordered": false,
                  "cached": true,
                  "useRefText": true,
                  "useRefValue": true,
                  "category": true,
                  "measure": false,
                  "filtercard": {
                      "initial": false,
                      "visible": true,
                      "order": 14
                  },
                  "patientlist": {
                      "initial": false,
                      "visible": true,
                      "linkColumn": false
                  },
                  "modelName": "Condition Status concept id"
              }
          ],
          "initialPatientlistColumn": false,
          "modelName": "Condition Occurrence"
      },
      {
          "source": "patient.interactions.conditionera",
          "visible": true,
          "order": 17,
          "initial": false,
          "attributes": [
              {
                  "source": "patient.interactions.conditionera.attributes.startdate",
                  "ordered": false,
                  "cached": true,
                  "useRefText": false,
                  "useRefValue": false,
                  "category": true,
                  "measure": false,
                  "filtercard": {
                      "initial": false,
                      "visible": true,
                      "order": 1
                  },
                  "patientlist": {
                      "initial": false,
                      "visible": true,
                      "linkColumn": false
                  },
                  "modelName": "Condition Era Start Date"
              },
              {
                  "source": "patient.interactions.conditionera.attributes.enddate",
                  "ordered": false,
                  "cached": true,
                  "useRefText": false,
                  "useRefValue": false,
                  "category": true,
                  "measure": false,
                  "filtercard": {
                      "initial": false,
                      "visible": true,
                      "order": 2
                  },
                  "patientlist": {
                      "initial": false,
                      "visible": true,
                      "linkColumn": false
                  },
                  "modelName": "Condition Era End Date"
              },
              {
                  "source": "patient.interactions.conditionera.attributes.count",
                  "ordered": true,
                  "cached": true,
                  "useRefText": false,
                  "useRefValue": false,
                  "category": true,
                  "measure": true,
                  "filtercard": {
                      "initial": false,
                      "visible": true,
                      "order": 3
                  },
                  "patientlist": {
                      "initial": false,
                      "visible": true,
                      "linkColumn": false
                  },
                  "modelName": "Condition Occurrence Count"
              },
              {
                  "source": "patient.interactions.conditionera.attributes.pid",
                  "ordered": false,
                  "cached": true,
                  "useRefText": false,
                  "useRefValue": false,
                  "category": true,
                  "measure": false,
                  "filtercard": {
                      "initial": false,
                      "visible": true,
                      "order": 4
                  },
                  "patientlist": {
                      "initial": false,
                      "visible": true,
                      "linkColumn": false
                  },
                  "modelName": "Person id"
              },
              {
                  "source": "patient.interactions.conditionera.attributes.conditioneraid",
                  "ordered": false,
                  "cached": true,
                  "useRefText": false,
                  "useRefValue": false,
                  "category": true,
                  "measure": false,
                  "filtercard": {
                      "initial": false,
                      "visible": true,
                      "order": 5
                  },
                  "patientlist": {
                      "initial": false,
                      "visible": true,
                      "linkColumn": false
                  },
                  "modelName": "Condition Era Id"
              },
              {
                  "source": "patient.interactions.conditionera.attributes.conditionconceptid",
                  "ordered": false,
                  "cached": true,
                  "useRefText": true,
                  "useRefValue": true,
                  "category": true,
                  "measure": false,
                  "filtercard": {
                      "initial": false,
                      "visible": true,
                      "order": 6
                  },
                  "patientlist": {
                      "initial": false,
                      "visible": true,
                      "linkColumn": false
                  },
                  "modelName": "Condition concept id"
              },
              {
                  "source": "patient.interactions.conditionera.attributes.Condition_era_concept_set",
                  "ordered": false,
                  "cached": true,
                  "useRefText": false,
                  "useRefValue": false,
                  "category": true,
                  "measure": false,
                  "filtercard": {
                      "initial": true,
                      "visible": true,
                      "order": 7
                  },
                  "patientlist": {
                      "initial": false,
                      "visible": true,
                      "linkColumn": false
                  },
                  "modelName": "Condition concept set"
              }
          ],
          "initialPatientlistColumn": false,
          "modelName": "Condition Era"
      },
      {
          "source": "patient.interactions.cohort",
          "visible": true,
          "order": 18,
          "initial": false,
          "attributes": [
              {
                  "source": "patient.interactions.cohort.attributes.cohortdefinitionid",
                  "ordered": true,
                  "cached": true,
                  "useRefText": false,
                  "useRefValue": false,
                  "category": true,
                  "measure": true,
                  "filtercard": {
                      "initial": true,
                      "visible": true,
                      "order": 1
                  },
                  "patientlist": {
                      "initial": false,
                      "visible": true,
                      "linkColumn": false
                  },
                  "modelName": "Cohort Definition Id"
              },
              {
                  "source": "patient.interactions.cohort.attributes.pid",
                  "ordered": false,
                  "cached": true,
                  "useRefText": false,
                  "useRefValue": false,
                  "category": true,
                  "measure": false,
                  "filtercard": {
                      "initial": false,
                      "visible": true,
                      "order": 2
                  },
                  "patientlist": {
                      "initial": false,
                      "visible": true,
                      "linkColumn": false
                  },
                  "modelName": "Subject Id"
              },
              {
                  "source": "patient.interactions.cohort.attributes.enddate",
                  "ordered": false,
                  "cached": true,
                  "useRefText": false,
                  "useRefValue": false,
                  "category": true,
                  "measure": false,
                  "filtercard": {
                      "initial": false,
                      "visible": true,
                      "order": 3
                  },
                  "patientlist": {
                      "initial": false,
                      "visible": true,
                      "linkColumn": false
                  },
                  "modelName": "End Date"
              },
              {
                  "source": "patient.interactions.cohort.attributes.startdate",
                  "ordered": false,
                  "cached": true,
                  "useRefText": false,
                  "useRefValue": false,
                  "category": true,
                  "measure": false,
                  "filtercard": {
                      "initial": false,
                      "visible": true,
                      "order": 4
                  },
                  "patientlist": {
                      "initial": false,
                      "visible": true,
                      "linkColumn": false
                  },
                  "modelName": "Start Date"
              }
          ],
          "initialPatientlistColumn": false,
          "modelName": "Cohort"
      }
  ],
  "chartOptions": {
      "initialAttributes": {
          "measures": [
              "patient.attributes.pcount"
          ],
          "categories": []
      },
      "initialChart": "stacked",
      "stacked": {
          "visible": true,
          "pdfDownloadEnabled": true,
          "downloadEnabled": true,
          "imageDownloadEnabled": true,
          "collectionEnabled": true,
          "beginVisible": true,
          "fillMissingValuesEnabled": true
      },
      "boxplot": {
          "visible": true,
          "pdfDownloadEnabled": true,
          "downloadEnabled": true,
          "imageDownloadEnabled": true,
          "collectionEnabled": true,
          "beginVisible": true,
          "fillMissingValuesEnabled": true
      },
      "km": {
          "visible": true,
          "pdfDownloadEnabled": true,
          "downloadEnabled": true,
          "imageDownloadEnabled": true,
          "collectionEnabled": true,
          "beginVisible": true,
          "confidenceInterval": 1.95996398454,
          "filters": [],
          "selectedInteractions": [],
          "selectedEndInteractions": []
      },
      "list": {
          "visible": true,
          "zipDownloadEnabled": true,
          "downloadEnabled": true,
          "collectionEnabled": true,
          "beginVisible": true,
          "pageSize": 20
      },
      "vb": {
          "visible": true,
          "referenceName": "GRCh37",
          "enabled": false
      },
      "custom": {
          "visible": true,
          "customCharts": []
      },
      "sac": {
          "visible": false,
          "sacCharts": [],
          "enabled": true
      },
      "shared": {
          "enabled": false,
          "systemName": "MRI"
      },
      "minCohortSize": 0
  },
  "configInformations": {
      "note": ""
  },
  "panelOptions": {
      "addToCohorts": true,
      "domainValuesLimit": 5000,
      "calcViewAccessPoint": true,
      "externalAccessPoints": true
  }
};

const cdwI2b2ConfigDuckdb = {
  patient: {
    conditions: {},
    interactions: {
      visit: {
        name: 'Visit',
        disabledLangName: [
          {
            lang: 'en',
            value: '',
            visible: true,
          },
          {
            lang: 'de',
            value: '',
            visible: true,
          },
          {
            lang: 'fr',
            value: '',
            visible: true,
          },
          {
            lang: 'es',
            value: '',
            visible: true,
          },
          {
            lang: 'pt',
            value: '',
            visible: true,
          },
          {
            lang: 'zh',
            value: '',
            visible: true,
          },
        ],
        defaultFilter: '1=1',
        defaultPlaceholder: '@VISIT',
        order: 0,
        parentInteraction: [],
        parentInteractionLabel: 'parent',
        attributes: {
          encounternum: {
            name: 'Encounter Number',
            disabledLangName: [
              {
                lang: 'en',
                value: '',
                visible: true,
              },
              {
                lang: 'de',
                value: '',
                visible: true,
              },
              {
                lang: 'fr',
                value: '',
                visible: true,
              },
              {
                lang: 'es',
                value: '',
                visible: true,
              },
              {
                lang: 'pt',
                value: '',
                visible: true,
              },
              {
                lang: 'zh',
                value: '',
                visible: true,
              },
            ],
            type: 'text',
            expression: 'CAST (@VISIT.encounter_num AS VARCHAR)',
            order: 0,
          },
          pid: {
            name: 'Person id',
            disabledLangName: [
              {
                lang: 'en',
                value: '',
                visible: true,
              },
              {
                lang: 'de',
                value: '',
                visible: true,
              },
              {
                lang: 'fr',
                value: '',
                visible: true,
              },
              {
                lang: 'es',
                value: '',
                visible: true,
              },
              {
                lang: 'pt',
                value: '',
                visible: true,
              },
              {
                lang: 'zh',
                value: '',
                visible: true,
              },
            ],
            type: 'text',
            expression: 'CAST (@VISIT.patient_num AS VARCHAR)',
            order: 1,
          },
          enddate: {
            name: 'Visit End Date',
            disabledLangName: [
              {
                lang: 'en',
                value: '',
                visible: true,
              },
              {
                lang: 'de',
                value: '',
                visible: true,
              },
              {
                lang: 'fr',
                value: '',
                visible: true,
              },
              {
                lang: 'es',
                value: '',
                visible: true,
              },
              {
                lang: 'pt',
                value: '',
                visible: true,
              },
              {
                lang: 'zh',
                value: '',
                visible: true,
              },
            ],
            type: 'time',
            expression: '@VISIT."end_date"',
            order: 2,
          },
          startdate: {
            name: 'Visit Start Date',
            disabledLangName: [
              {
                lang: 'en',
                value: '',
                visible: true,
              },
              {
                lang: 'de',
                value: '',
                visible: true,
              },
              {
                lang: 'fr',
                value: '',
                visible: true,
              },
              {
                lang: 'es',
                value: '',
                visible: true,
              },
              {
                lang: 'pt',
                value: '',
                visible: true,
              },
              {
                lang: 'zh',
                value: '',
                visible: true,
              },
            ],
            type: 'time',
            expression: '@VISIT."start_date"',
            order: 3,
          },
          // ActiveStatus:{
          //   name: 'Active Status Concept Id',
          //   disabledLangName: [
          //     {
          //       lang: 'en',
          //       value: '',
          //       visible: true,
          //     },
          //     {
          //       lang: 'de',
          //       value: '',
          //       visible: true,
          //     },
          //     {
          //       lang: 'fr',
          //       value: '',
          //       visible: true,
          //     },
          //     {
          //       lang: 'es',
          //       value: '',
          //       visible: true,
          //     },
          //     {
          //       lang: 'pt',
          //       value: '',
          //       visible: true,
          //     },
          //     {
          //       lang: 'zh',
          //       value: '',
          //       visible: true,
          //     },
          //   ],
          //   type: 'text',
          //   expression: '@VISIT."active_status_cd"',
          //   referenceFilter: 'CAST (@REF.name_char AS VARCHAR) SIMILAR TO \'@SEARCH_QUERY\'',
          //   referenceExpression: '@REF.name_char',
          //   order: 4,
          //   useRefValue: true,
          //   useRefText: true,
          // },
          InOut: {
            name: 'In out Concept Id',
            disabledLangName: [
              {
                lang: 'en',
                value: '',
                visible: true,
              },
              {
                lang: 'de',
                value: '',
                visible: true,
              },
              {
                lang: 'fr',
                value: '',
                visible: true,
              },
              {
                lang: 'es',
                value: '',
                visible: true,
              },
              {
                lang: 'pt',
                value: '',
                visible: true,
              },
              {
                lang: 'zh',
                value: '',
                visible: true,
              },
            ],
            type: 'text',
            expression: '@VISIT."inout_cd"',
            referenceFilter: 'JARO_SIMILARITY(CAST(@REF.concept_cd AS VARCHAR), \'@SEARCH_QUERY\') >= 0.85',
            referenceExpression: '@REF.concept_cd',
            order: 5,
            useRefValue: true,
            useRefText: true,
          },
          // Location:{
          //   name: 'Location Concept Id',
          //   disabledLangName: [
          //     {
          //       lang: 'en',
          //       value: '',
          //       visible: true,
          //     },
          //     {
          //       lang: 'de',
          //       value: '',
          //       visible: true,
          //     },
          //     {
          //       lang: 'fr',
          //       value: '',
          //       visible: true,
          //     },
          //     {
          //       lang: 'es',
          //       value: '',
          //       visible: true,
          //     },
          //     {
          //       lang: 'pt',
          //       value: '',
          //       visible: true,
          //     },
          //     {
          //       lang: 'zh',
          //       value: '',
          //       visible: true,
          //     },
          //   ],
          //   type: 'text',
          //   expression: '@VISIT."location_cd"',
          //   referenceFilter: 'CAST (@REF.name_char AS VARCHAR) SIMILAR TO \'@SEARCH_QUERY\'',
          //   referenceExpression: '@REF.name_char',
          //   order: 6,
          //   useRefValue: true,
          //   useRefText: true,
          // },
          // LenghtOfStay:{
          //   name: 'Lenght of stay',
          //   disabledLangName: [
          //     {
          //       lang: 'en',
          //       value: '',
          //       visible: true,
          //     },
          //     {
          //       lang: 'de',
          //       value: '',
          //       visible: true,
          //     },
          //     {
          //       lang: 'fr',
          //       value: '',
          //       visible: true,
          //     },
          //     {
          //       lang: 'es',
          //       value: '',
          //       visible: true,
          //     },
          //     {
          //       lang: 'pt',
          //       value: '',
          //       visible: true,
          //     },
          //     {
          //       lang: 'zh',
          //       value: '',
          //       visible: true,
          //     },
          //   ],
          //   type: 'num',
          //   expression: '@VISIT.length_of_stay',
          //   order: 7,
          // },
          // SourceSystem:{
          //   name: 'Source System Concept Id',
          //   disabledLangName: [
          //     {
          //       lang: 'en',
          //       value: '',
          //       visible: true,
          //     },
          //     {
          //       lang: 'de',
          //       value: '',
          //       visible: true,
          //     },
          //     {
          //       lang: 'fr',
          //       value: '',
          //       visible: true,
          //     },
          //     {
          //       lang: 'es',
          //       value: '',
          //       visible: true,
          //     },
          //     {
          //       lang: 'pt',
          //       value: '',
          //       visible: true,
          //     },
          //     {
          //       lang: 'zh',
          //       value: '',
          //       visible: true,
          //     },
          //   ],
          //   expression: '@VISIT."sourcesystem_cd"',
          //   referenceFilter: 'CAST (@REF.name_char AS VARCHAR) SIMILAR TO \'@SEARCH_QUERY\'',
          //   referenceExpression: '@REF.name_char',
          //   order: 8,
          //   useRefValue: true,
          //   useRefText: true,
          // }
        },
      },
      observation: {
        name: 'Observation Fact',
        disabledLangName: [
          {
            lang: 'en',
            value: '',
            visible: true,
          },
          {
            lang: 'de',
            value: '',
            visible: true,
          },
          {
            lang: 'fr',
            value: '',
            visible: true,
          },
          {
            lang: 'es',
            value: '',
            visible: true,
          },
          {
            lang: 'pt',
            value: '',
            visible: true,
          },
          {
            lang: 'zh',
            value: '',
            visible: true,
          },
        ],
        defaultFilter: '1=1',
        defaultPlaceholder: '@OBSERVATION',
        order: 0,
        parentInteraction: [],
        parentInteractionLabel: 'parent',
        attributes: {
          encounternum: {
            name: 'Encounter Number',
            disabledLangName: [
              {
                lang: 'en',
                value: '',
                visible: true,
              },
              {
                lang: 'de',
                value: '',
                visible: true,
              },
              {
                lang: 'fr',
                value: '',
                visible: true,
              },
              {
                lang: 'es',
                value: '',
                visible: true,
              },
              {
                lang: 'pt',
                value: '',
                visible: true,
              },
              {
                lang: 'zh',
                value: '',
                visible: true,
              },
            ],
            type: 'text',
            expression: 'CAST (@OBSERVATION.encounter_num AS VARCHAR)',
            order: 0
          },
          pid: {
            name: 'Person id',
            disabledLangName: [
              {
                lang: 'en',
                value: '',
                visible: true,
              },
              {
                lang: 'de',
                value: '',
                visible: true,
              },
              {
                lang: 'fr',
                value: '',
                visible: true,
              },
              {
                lang: 'es',
                value: '',
                visible: true,
              },
              {
                lang: 'pt',
                value: '',
                visible: true,
              },
              {
                lang: 'zh',
                value: '',
                visible: true,
              },
            ],
            type: 'text',
            expression: 'CAST (@OBSERVATION.patient_num AS VARCHAR)',
            order: 1,
          },
          observationconceptid: {
            name: 'Concept code for observation of interest',
            disabledLangName: [
              {
                lang: 'en',
                value: '',
                visible: true,
              },
              {
                lang: 'de',
                value: '',
                visible: true,
              },
              {
                lang: 'fr',
                value: '',
                visible: true,
              },
              {
                lang: 'es',
                value: '',
                visible: true,
              },
              {
                lang: 'pt',
                value: '',
                visible: true,
              },
              {
                lang: 'zh',
                value: '',
                visible: true,
              },
            ],
            type: 'text',
            expression: 'CAST (@OBSERVATION.concept_cd AS VARCHAR)',
            referenceFilter: 'JARO_SIMILARITY(CAST(@REF.concept_cd AS VARCHAR), \'@SEARCH_QUERY\') >= 0.85',
            referenceExpression: '@REF.concept_cd',
            order: 2,
            useRefValue: true,
            useRefText: true,
          },
          providerId: {
            name: 'Provider Id',
            disabledLangName: [
              {
                lang: 'en',
                value: '',
                visible: true,
              },
              {
                lang: 'de',
                value: '',
                visible: true,
              },
              {
                lang: 'fr',
                value: '',
                visible: true,
              },
              {
                lang: 'es',
                value: '',
                visible: true,
              },
              {
                lang: 'pt',
                value: '',
                visible: true,
              },
              {
                lang: 'zh',
                value: '',
                visible: true,
              },
            ],
            type: 'text',
            expression: 'CAST (@OBSERVATION.provider_id AS VARCHAR)',
            order: 3
          },
          startdate: {
            name: 'Observation Start Date',
            disabledLangName: [
              {
                lang: 'en',
                value: '',
                visible: true,
              },
              {
                lang: 'de',
                value: '',
                visible: true,
              },
              {
                lang: 'fr',
                value: '',
                visible: true,
              },
              {
                lang: 'es',
                value: '',
                visible: true,
              },
              {
                lang: 'pt',
                value: '',
                visible: true,
              },
              {
                lang: 'zh',
                value: '',
                visible: true,
              },
            ],
            type: 'time',
            expression: '@OBSERVATION."start_date"',
            order: 4,
          },
          modifierconceptid: {
            name: 'Modifier concept Id',
            disabledLangName: [
              {
                lang: 'en',
                value: '',
                visible: true,
              },
              {
                lang: 'de',
                value: '',
                visible: true,
              },
              {
                lang: 'fr',
                value: '',
                visible: true,
              },
              {
                lang: 'es',
                value: '',
                visible: true,
              },
              {
                lang: 'pt',
                value: '',
                visible: true,
              },
              {
                lang: 'zh',
                value: '',
                visible: true,
              },
            ],
            type: 'text',
            expression: 'CAST (@OBSERVATION.modifier_cd AS VARCHAR)',
            referenceFilter: 'JARO_SIMILARITY(CAST(@REF.concept_cd AS VARCHAR), \'@SEARCH_QUERY\') >= 0.85',
            referenceExpression: '@REF.concept_cd',
            order: 5,
            useRefValue: true,
            useRefText: true,
          },
          enddate: {
            name: 'Observation End Date',
            disabledLangName: [
              {
                lang: 'en',
                value: '',
                visible: true,
              },
              {
                lang: 'de',
                value: '',
                visible: true,
              },
              {
                lang: 'fr',
                value: '',
                visible: true,
              },
              {
                lang: 'es',
                value: '',
                visible: true,
              },
              {
                lang: 'pt',
                value: '',
                visible: true,
              },
              {
                lang: 'zh',
                value: '',
                visible: true,
              },
            ],
            type: 'time',
            expression: '@OBSERVATION."end_date"',
            order: 6,
          },
          unitconceptid: {
            name: 'Unit concept Id',
            disabledLangName: [
              {
                lang: 'en',
                value: '',
                visible: true,
              },
              {
                lang: 'de',
                value: '',
                visible: true,
              },
              {
                lang: 'fr',
                value: '',
                visible: true,
              },
              {
                lang: 'es',
                value: '',
                visible: true,
              },
              {
                lang: 'pt',
                value: '',
                visible: true,
              },
              {
                lang: 'zh',
                value: '',
                visible: true,
              },
            ],
            type: 'text',
            expression: 'CAST (@OBSERVATION.units_cd AS VARCHAR)',
            referenceFilter: 'JARO_SIMILARITY(CAST(@REF.concept_cd AS VARCHAR), \'@SEARCH_QUERY\') >= 0.85',
            referenceExpression: '@REF.concept_cd',
            order: 6,
            useRefValue: true,
            useRefText: true,
          },
          verbatimtext: {
            name: 'Value as text',
            disabledLangName: [
              {
                lang: 'en',
                value: '',
                visible: true,
              },
              {
                lang: 'de',
                value: '',
                visible: true,
              },
              {
                lang: 'fr',
                value: '',
                visible: true,
              },
              {
                lang: 'es',
                value: '',
                visible: true,
              },
              {
                lang: 'pt',
                value: '',
                visible: true,
              },
              {
                lang: 'zh',
                value: '',
                visible: true,
              },
            ],
            type: 'text',
            expression: '@OBSERVATION."tval_char"',
            order: 7,
          },
          numval: {
            name: 'Value as number',
            disabledLangName: [
              {
                lang: 'en',
                value: '',
                visible: true,
              },
              {
                lang: 'de',
                value: '',
                visible: true,
              },
              {
                lang: 'fr',
                value: '',
                visible: true,
              },
              {
                lang: 'es',
                value: '',
                visible: true,
              },
              {
                lang: 'pt',
                value: '',
                visible: true,
              },
              {
                lang: 'zh',
                value: '',
                visible: true,
              },
            ],
            type: 'num',
            expression: '@OBSERVATION."tval_num"',
            order: 8,
          }
        }
      }
    },
    attributes: {
      pid: {
        name: 'Person id',
        disabledLangName: [],
        type: 'text',
        expression: 'CAST (@PATIENT."patient_num" AS VARCHAR)',
        order: 0,
        annotations: [
          'person_id',
        ],
      },
      pcount: {
        name: 'Patient Count',
        disabledLangName: [],
        type: 'num',
        measureExpression: 'COUNT(DISTINCT(@PATIENT."patient_num"))',
        order: 1,
      },
      dateOfBirth: {
        name: 'Birth Datetime',
        disabledLangName: [],
        type: 'datetime',
        expression: '@PATIENT."birth_date"',
        order: 2,
        annotations: [
          'birth_datetime',
        ],
      },
      Gender: {
        name: 'Gender concept id',
        disabledLangName: [
          {
            lang: 'en',
            value: '',
            visible: true,
          },
          {
            lang: 'de',
            value: '',
            visible: true,
          },
          {
            lang: 'fr',
            value: '',
            visible: true,
          },
          {
            lang: 'es',
            value: '',
            visible: true,
          },
          {
            lang: 'pt',
            value: '',
            visible: true,
          },
          {
            lang: 'zh',
            value: '',
            visible: true,
          },
        ],
        type: 'text',
        expression: '@PATIENT."sex_cd"',
        referenceFilter: 'JARO_SIMILARITY(CAST(@REF.concept_cd AS VARCHAR), \'@SEARCH_QUERY\') >= 0.85',
        referenceExpression: '@REF.concept_cd',
        order: 4,
        useRefValue: true,
      },
      Age: {
        name: 'Age',
        disabledLangName: [
          {
            lang: 'de',
            value: '',
            visible: true,
          },
          {
            lang: 'fr',
            value: '',
            visible: true,
          },
          {
            lang: 'es',
            value: '',
            visible: true,
          },
          {
            lang: 'pt',
            value: '',
            visible: true,
          },
          {
            lang: 'zh',
            value: '',
            visible: true,
          },
        ],
        type: 'num',
        expression: '@PATIENT."age_in_years_num"',
        order: 5,
      },
      raceconceptid: {
        name: 'Race concept id',
        disabledLangName: [
          {
            lang: 'en',
            value: '',
            visible: true,
          },
          {
            lang: 'de',
            value: '',
            visible: true,
          },
          {
            lang: 'fr',
            value: '',
            visible: true,
          },
          {
            lang: 'es',
            value: '',
            visible: true,
          },
          {
            lang: 'pt',
            value: '',
            visible: true,
          },
          {
            lang: 'zh',
            value: '',
            visible: true,
          },
        ],
        type: 'text',
        expression: '@PATIENT."race_cd"',
        referenceFilter: 'JARO_SIMILARITY(CAST(@REF.concept_cd AS VARCHAR), \'@SEARCH_QUERY\') >= 0.85',
        referenceExpression: '@REF.concept_cd',
        order: 7,
        useRefValue: true,
        useRefText: true,
      },
      ZipCode: {
        name: 'Zip Code Concept Id',
        disabledLangName: [
          {
            lang: 'en',
            value: '',
            visible: true,
          },
          {
            lang: 'de',
            value: '',
            visible: true,
          },
          {
            lang: 'fr',
            value: '',
            visible: true,
          },
          {
            lang: 'es',
            value: '',
            visible: true,
          },
          {
            lang: 'pt',
            value: '',
            visible: true,
          },
          {
            lang: 'zh',
            value: '',
            visible: true,
          },
        ],
        type: 'text',
        expression: '@PATIENT."zip_cd"',
        referenceFilter: 'JARO_SIMILARITY(CAST(@REF.concept_cd AS VARCHAR), \'@SEARCH_QUERY\') >= 0.85',
        referenceExpression: '@REF.concept_cd',
        order: 9,
        useRefValue: true,
        useRefText: true,
      }
    }
  },
  censor: {},
  advancedSettings: {
    tableTypePlaceholderMap: {
      factTable: {
        placeholder: '@PATIENT',
        attributeTables: [],
      },
      dimTables: [
        {
          placeholder: '@VISIT',
          attributeTables: [],
          hierarchy: true,
          time: true,
          oneToN: true,
          condition: true,
        },
        {
          placeholder: '@OBSERVATION',
          attributeTables: [],
          hierarchy: true,
          time: true,
          oneToN: true,
          condition: true,
        },
      ]
    },
    tableMapping: {
      '@VISIT': '$$SCHEMA$$."visit_dimension"',
      '@VISIT.PATIENT_ID': '"patient_num"',
      '@VISIT.INTERACTION_ID': '"encounter_num"',
      '@VISIT.CONDITION_ID': '"encounter_num"',
      '@VISIT.PARENT_INTERACT_ID': '"encounter_num"',
      '@VISIT.START': '"start_date"',
      '@VISIT.END': '"end_date"',
      '@VISIT.INTERACTION_TYPE': '"inout_cd"',
      '@OBSERVATION': '$$SCHEMA$$."observation_fact"',
      '@OBSERVATION.PATIENT_ID': '"patient_num"',
      '@OBSERVATION.INTERACTION_ID': '"encounter_num"',
      '@OBSERVATION.CONDITION_ID': '"encounter_num"',
      '@OBSERVATION.PARENT_INTERACT_ID': '"encounter_num"',
      '@OBSERVATION.START': '"start_date"',
      '@OBSERVATION.END': '"end_date"',
      '@OBSERVATION.INTERACTION_TYPE': '"concept_cd"',
      '@REF': '"concept_dimension"',
      '@REF.VOCABULARY_ID': '"sourcesystem_cd"',
      '@REF.CODE': '"concept_cd"',
      '@REF.TEXT': '"name_char"',
      '@TEXT': '"concept_dimension"',
      '@TEXT.INTERACTION_ID': '"concept_cd"',
      '@TEXT.INTERACTION_TEXT_ID': '"concept_cd"',
      '@TEXT.VALUE': '"name_char"',
      '@PATIENT': '$$SCHEMA$$."patient_dimension"',
      '@PATIENT.PATIENT_ID': '"patient_num"',
      '@PATIENT.DOD': '"death_date"',
      '@PATIENT.DOB': '"birth_date"',
    },
    guardedTableMapping: {
      '@PATIENT': '$$SCHEMA$$."patient_dimension"',
    },
    ohdsiCohortDefinitionTableMapping: {
      '@PATIENT."GENDER"': 'Gender',
    },
    language: [
      'en',
      'de',
      'fr',
      'es',
      'pt',
      'zh',
    ],
    others: {},
    settings: {
      fuzziness: 0.7,
      maxResultSize: 5000,
      sqlReturnOn: false,
      errorDetailsReturnOn: false,
      errorStackTraceReturnOn: false,
      enableFreeText: true,
      vbEnabled: true,
      dateFormat: 'YYYY-MM-dd',
      timeFormat: 'HH:mm:ss',
      otsTableMap: {
        '@CODE': '"concept_dimension"',
      },
    },
    shared: {},
    schemaVersion: '3',
  }
}

const paI2b2ConfigDuckdb = {
  filtercards: [
    {
      source: "patient",
      visible: true,
      order: 1,
      initial: true,
      attributes: [
        {
          source: "patient.attributes.Age",
          ordered: true,
          cached: true,
          useRefText: false,
          useRefValue: false,
          category: true,
          measure: true,
          filtercard: {
            initial: true,
            visible: true,
            order: 1,
          },
          patientlist: {
            initial: true,
            visible: true,
            linkColumn: false,
          },
          modelName: "Age",
        },
        {
          source: "patient.attributes.ZipCode",
          ordered: false,
          cached: true,
          useRefText: false,
          useRefValue: false,
          category: true,
          measure: false,
          filtercard: {
            initial: false,
            visible: true,
            order: 2,
          },
          patientlist: {
            initial: false,
            visible: true,
            linkColumn: false,
          },
          modelName: "Location id",
        },
        {
          source: "patient.attributes.Gender",
          ordered: false,
          cached: true,
          useRefText: false,
          useRefValue: true,
          category: true,
          measure: false,
          filtercard: {
            initial: true,
            visible: true,
            order: 3,
          },
          patientlist: {
            initial: true,
            visible: true,
            linkColumn: false,
          },
          modelName: "Gender",
        },
        {
          source: "patient.attributes.raceconceptid",
          ordered: false,
          cached: true,
          useRefText: true,
          useRefValue: true,
          category: true,
          measure: false,
          filtercard: {
            initial: false,
            visible: true,
            order: 4,
          },
          patientlist: {
            initial: false,
            visible: true,
            linkColumn: false,
          },
          modelName: "Race concept id",
        },
        {
          source: "patient.attributes.pid",
          ordered: false,
          cached: true,
          useRefText: false,
          useRefValue: false,
          category: true,
          measure: false,
          filtercard: {
            initial: false,
            visible: true,
            order: 5,
          },
          patientlist: {
            initial: true,
            visible: true,
            linkColumn: false,
          },
          modelName: "Person id",
        },
        {
          source: "patient.attributes.pcount",
          ordered: true,
          cached: true,
          useRefText: false,
          useRefValue: false,
          category: false,
          measure: true,
          filtercard: {
            initial: false,
            visible: false,
            order: 6,
          },
          patientlist: {
            initial: false,
            visible: false,
            linkColumn: false,
          },
          modelName: "Patient Count",
        },
        {
          source: "patient.attributes.dateOfBirth",
          ordered: false,
          cached: true,
          useRefText: false,
          useRefValue: false,
          category: true,
          measure: false,
          filtercard: {
            initial: false,
            visible: true,
            order: 7,
          },
          patientlist: {
            initial: false,
            visible: true,
            linkColumn: false,
          },
          modelName: "Birth Datetime",
        },
      ],
      initialPatientlistColumn: true,
      modelName: "MRI_PA_SERVICES_FILTERCARD_TITLE_BASIC_DATA",
    },
    {
      source: "patient.interactions.visit",
      visible: true,
      order: 2,
      initial: false,
      attributes: [
        {
          source: "patient.interactions.visit.attributes.encounternum",
          ordered: false,
          cached: true,
          useRefText: false,
          useRefValue: false,
          category: true,
          measure: false,
          filtercard: {
            initial: false,
            visible: true,
            order: 1,
          },
          patientlist: {
            initial: false,
            visible: true,
            linkColumn: false,
          },
          modelName: "Visit encounter num",
        },
        {
          source: "patient.interactions.visit.attributes.InOut",
          ordered: false,
          cached: true,
          useRefText: true,
          useRefValue: true,
          category: true,
          measure: false,
          filtercard: {
            initial: false,
            visible: true,
            order: 2,
          },
          patientlist: {
            initial: false,
            visible: true,
            linkColumn: false,
          },
          modelName: "Visit concept Id",
        },
        {
          source: "patient.interactions.visit.attributes.pid",
          ordered: false,
          cached: true,
          useRefText: false,
          useRefValue: false,
          category: true,
          measure: false,
          filtercard: {
            initial: false,
            visible: true,
            order: 3,
          },
          patientlist: {
            initial: false,
            visible: true,
            linkColumn: false,
          },
          modelName: "Person id",
        },
        {
          source: "patient.interactions.visit.attributes.startdate",
          ordered: false,
          cached: true,
          useRefText: false,
          useRefValue: false,
          category: true,
          measure: false,
          filtercard: {
            initial: false,
            visible: true,
            order: 4,
          },
          patientlist: {
            initial: true,
            visible: true,
            linkColumn: false,
          },
          modelName: "Visit Start Date",
        },
        {
          source: "patient.interactions.visit.attributes.enddate",
          ordered: false,
          cached: true,
          useRefText: false,
          useRefValue: false,
          category: true,
          measure: false,
          filtercard: {
            initial: false,
            visible: true,
            order: 5,
          },
          patientlist: {
            initial: true,
            visible: true,
            linkColumn: false,
          },
          modelName: "Visit End Date",
        },
      ],
      initialPatientlistColumn: false,
      modelName: "Visit",
    },
    {
      source: "patient.interactions.observation",
      visible: true,
      order: 3,
      initial: false,
      attributes: [
        {
          source:
            "patient.interactions.observation.attributes.encounternum",
          ordered: false,
          cached: true,
          useRefText: true,
          useRefValue: true,
          category: true,
          measure: false,
          filtercard: {
            initial: false,
            visible: true,
            order: 1,
          },
          patientlist: {
            initial: false,
            visible: true,
            linkColumn: false,
          },
          modelName: "Observation visit encounter num",
        },
        {
          source: "patient.interactions.observation.attributes.numval",
          ordered: true,
          cached: true,
          useRefText: false,
          useRefValue: false,
          category: true,
          measure: true,
          filtercard: {
            initial: false,
            visible: true,
            order: 2,
          },
          patientlist: {
            initial: false,
            visible: true,
            linkColumn: false,
          },
          modelName: "Value as number",
        },
        {
          source: "patient.interactions.observation.attributes.verbatimtext",
          ordered: false,
          cached: true,
          useRefText: false,
          useRefValue: false,
          category: true,
          measure: false,
          filtercard: {
            initial: false,
            visible: true,
            order: 3,
          },
          patientlist: {
            initial: true,
            visible: true,
            linkColumn: false,
          },
          modelName: "Value as string",
        },
        {
          source:
            "patient.interactions.observation.attributes.providerId",
          ordered: false,
          cached: true,
          useRefText: true,
          useRefValue: true,
          category: true,
          measure: false,
          filtercard: {
            initial: false,
            visible: true,
            order: 4,
          },
          patientlist: {
            initial: false,
            visible: true,
            linkColumn: false,
          },
          modelName: "Provider id",
        },
        {
          source: "patient.interactions.observation.attributes.observationconceptid",
          ordered: false,
          cached: true,
          useRefText: false,
          useRefValue: false,
          category: true,
          measure: false,
          filtercard: {
            initial: false,
            visible: true,
            order: 5,
          },
          patientlist: {
            initial: false,
            visible: true,
            linkColumn: false,
          },
          modelName: "Observation concept",
        },
        {
          source: "patient.interactions.observation.attributes.pid",
          ordered: false,
          cached: true,
          useRefText: false,
          useRefValue: false,
          category: true,
          measure: false,
          filtercard: {
            initial: false,
            visible: true,
            order: 6,
          },
          patientlist: {
            initial: false,
            visible: true,
            linkColumn: false,
          },
          modelName: "Person id",
        },
        {
          source: "patient.interactions.observation.attributes.startdate",
          ordered: false,
          cached: true,
          useRefText: false,
          useRefValue: false,
          category: true,
          measure: false,
          filtercard: {
            initial: false,
            visible: true,
            order: 7,
          },
          patientlist: {
            initial: false,
            visible: true,
            linkColumn: false,
          },
          modelName: "Observation Start Date",
        },
        {
          source: "patient.interactions.observation.attributes.unitconceptid",
          ordered: false,
          cached: true,
          useRefText: true,
          useRefValue: true,
          category: true,
          measure: false,
          filtercard: {
            initial: false,
            visible: true,
            order: 8,
          },
          patientlist: {
            initial: false,
            visible: true,
            linkColumn: false,
          },
          modelName: "Unit concept id",
        },
      ],
      initialPatientlistColumn: false,
      modelName: "Observation",
    }
  ],
  chartOptions: {
    initialAttributes: {
      measures: ["patient.attributes.pcount"],
      categories: ["patient.attributes.Gender"],
    },
    initialChart: "stacked",
    stacked: {
      visible: true,
      pdfDownloadEnabled: true,
      downloadEnabled: true,
      imageDownloadEnabled: true,
      collectionEnabled: true,
      beginVisible: true,
      fillMissingValuesEnabled: true,
    },
    boxplot: {
      visible: true,
      pdfDownloadEnabled: true,
      downloadEnabled: true,
      imageDownloadEnabled: true,
      collectionEnabled: true,
      beginVisible: true,
      fillMissingValuesEnabled: true,
    },
    km: {
      visible: true,
      pdfDownloadEnabled: true,
      downloadEnabled: true,
      imageDownloadEnabled: true,
      collectionEnabled: true,
      beginVisible: true,
      confidenceInterval: 1.95996398454,
      filters: [],
      selectedInteractions: [],
      selectedEndInteractions: [],
    },
    list: {
      visible: true,
      zipDownloadEnabled: true,
      downloadEnabled: true,
      collectionEnabled: true,
      beginVisible: true,
      pageSize: 20,
    },
    vb: {
      visible: true,
      referenceName: "GRCh37",
      enabled: false,
    },
    custom: {
      visible: true,
      customCharts: [],
    },
    sac: {
      visible: false,
      sacCharts: [],
      enabled: false,
    },
    shared: {
      enabled: false,
      systemName: "MRI",
    },
    minCohortSize: 1,
  },
  configInformations: {
    note: "",
  },
  panelOptions: {
    addToCohorts: true,
    domainValuesLimit: 200,
    maxFiltercardCount: 10,
    calcViewAccessPoint: true,
    externalAccessPoints: true
  },
};