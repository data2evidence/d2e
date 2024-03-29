import { CdmConfig } from "../types";

export default {
    patient: {
        conditions: {},
        interactions: {
            conditionera: {
                name: [
                    {
                        lang: "",
                        value: "Condition Era",
                    },
                ],
                disabledLangName: [
                    {
                        lang: "en",
                        value: "",
                        visible: true,
                    },
                    {
                        lang: "de",
                        value: "",
                        visible: true,
                    },
                    {
                        lang: "fr",
                        value: "",
                        visible: true,
                    },
                    {
                        lang: "es",
                        value: "",
                        visible: true,
                    },
                    {
                        lang: "pt",
                        value: "",
                        visible: true,
                    },
                    {
                        lang: "zh",
                        value: "",
                        visible: true,
                    },
                ],
                defaultFilter: "1=1",
                defaultPlaceholder: "@CONDERA",
                order: 15,
                parentInteraction: [],
                parentInteractionLabel: "parent",
                attributes: {
                    conditionname: {
                        name: [
                            {
                                lang: "",
                                value: "Condition Name",
                            },
                        ],
                        disabledLangName: [
                            {
                                lang: "en",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "de",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "fr",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "es",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "pt",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "zh",
                                value: "",
                                visible: true,
                            },
                        ],
                        type: "text",
                        expression: '@CONDERA."CONDITION_NAME"',
                        referenceFilter:
                            "@REF.\"DOMAIN_ID\" = 'Condition' AND @REF.\"STANDARD_CONCEPT\" = 'S' AND (@REF.\"CONCEPT_NAME\") LIKE_REGEXPR '@SEARCH_QUERY' FLAG 'i'",
                        referenceExpression: '@REF."CONCEPT_NAME"',
                        order: 7,
                    },
                    startdate: {
                        name: [
                            {
                                lang: "",
                                value: "Start Date",
                            },
                        ],
                        disabledLangName: [
                            {
                                lang: "en",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "de",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "fr",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "es",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "pt",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "zh",
                                value: "",
                                visible: true,
                            },
                        ],
                        type: "time",
                        expression: '@CONDERA."CONDITION_ERA_START_DATE"',
                        order: 6,
                    },
                    enddate: {
                        name: [
                            {
                                lang: "",
                                value: "End Date",
                            },
                        ],
                        disabledLangName: [
                            {
                                lang: "en",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "de",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "fr",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "es",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "pt",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "zh",
                                value: "",
                                visible: true,
                            },
                        ],
                        type: "time",
                        expression: '@CONDERA."CONDITION_ERA_END_DATE"',
                        order: 5,
                    },
                    count: {
                        name: [
                            {
                                lang: "",
                                value: "Condition Occurrence Count",
                            },
                        ],
                        disabledLangName: [
                            {
                                lang: "en",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "de",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "fr",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "es",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "pt",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "zh",
                                value: "",
                                visible: true,
                            },
                        ],
                        type: "num",
                        expression: '@CONDERA."CONDITION_OCCURRENCE_COUNT"',
                        order: 4,
                    },
                    pid: {
                        name: [
                            {
                                lang: "",
                                value: "Patient Id",
                            },
                        ],
                        disabledLangName: [
                            {
                                lang: "en",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "de",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "fr",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "es",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "pt",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "zh",
                                value: "",
                                visible: true,
                            },
                        ],
                        type: "text",
                        expression: 'CAST (@CONDERA."PATIENT_ID" AS VARCHAR)',
                        order: 3,
                    },
                    conditioneraid: {
                        name: [
                            {
                                lang: "",
                                value: "Condition Era Id",
                            },
                        ],
                        disabledLangName: [
                            {
                                lang: "en",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "de",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "fr",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "es",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "pt",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "zh",
                                value: "",
                                visible: true,
                            },
                        ],
                        type: "text",
                        expression: '@CONDERA."CONDITION_ERA_ID"',
                        order: 0,
                    },
                    condconceptcode: {
                        name: [
                            {
                                lang: "",
                                value: "Condition concept code",
                            },
                        ],
                        disabledLangName: [
                            {
                                lang: "en",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "de",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "fr",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "es",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "pt",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "zh",
                                value: "",
                                visible: true,
                            },
                        ],
                        type: "text",
                        expression: '@CONDERA."CONDITION_CONCEPT_CODE"',
                        referenceFilter:
                            "@REF.\"DOMAIN_ID\" = 'Condition' AND @REF.\"STANDARD_CONCEPT\" = 'S' AND (@REF.\"CONCEPT_CODE\") LIKE_REGEXPR '@SEARCH_QUERY' FLAG 'i'",
                        referenceExpression: '@REF."CONCEPT_CODE"',
                        order: 2,
                    },
                    conditionconceptid: {
                        name: [
                            {
                                lang: "",
                                value: "Condition concept id",
                            },
                        ],
                        disabledLangName: [
                            {
                                lang: "en",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "de",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "fr",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "es",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "pt",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "zh",
                                value: "",
                                visible: true,
                            },
                        ],
                        type: "text",
                        expression: '@CONDERA."CONDITION_CONCEPT_ID"',
                        referenceFilter:
                            "@REF.\"DOMAIN_ID\" = 'Condition' AND @REF.\"STANDARD_CONCEPT\" = 'S' AND (@REF.\"CONCEPT_ID\") LIKE_REGEXPR '@SEARCH_QUERY' FLAG 'i'",
                        referenceExpression: '@REF."CONCEPT_ID"',
                        order: 1,
                    },
                },
            },
            conditionoccurrence: {
                name: [
                    {
                        lang: "",
                        value: "Condition Occurrence",
                    },
                ],
                disabledLangName: [
                    {
                        lang: "en",
                        value: "",
                        visible: true,
                    },
                    {
                        lang: "de",
                        value: "",
                        visible: true,
                    },
                    {
                        lang: "fr",
                        value: "",
                        visible: true,
                    },
                    {
                        lang: "es",
                        value: "",
                        visible: true,
                    },
                    {
                        lang: "pt",
                        value: "",
                        visible: true,
                    },
                    {
                        lang: "zh",
                        value: "",
                        visible: true,
                    },
                ],
                defaultFilter: "1=1",
                defaultPlaceholder: "@COND",
                order: 14,
                parentInteraction: [],
                parentInteractionLabel: "parent",
                attributes: {
                    visitoccurrenceid: {
                        name: [
                            {
                                lang: "",
                                value: "Visit Occurrence Id",
                            },
                        ],
                        disabledLangName: [
                            {
                                lang: "en",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "de",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "fr",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "es",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "pt",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "zh",
                                value: "",
                                visible: true,
                            },
                        ],
                        type: "text",
                        expression: '@COND."VISIT_OCCURRENCE_ID"',
                        order: 13,
                    },
                    enddate: {
                        name: [
                            {
                                lang: "",
                                value: "End Date",
                            },
                        ],
                        disabledLangName: [
                            {
                                lang: "en",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "de",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "fr",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "es",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "pt",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "zh",
                                value: "",
                                visible: true,
                            },
                        ],
                        type: "time",
                        expression: '@COND."CONDITION_END_DATE"',
                        order: 12,
                    },
                    startdate: {
                        name: [
                            {
                                lang: "",
                                value: "Start Date",
                            },
                        ],
                        disabledLangName: [
                            {
                                lang: "en",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "de",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "fr",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "es",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "pt",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "zh",
                                value: "",
                                visible: true,
                            },
                        ],
                        type: "time",
                        expression: '@COND."CONDITION_START_DATE"',
                        order: 11,
                    },
                    pid: {
                        name: [
                            {
                                lang: "",
                                value: "Patient Id",
                            },
                        ],
                        disabledLangName: [
                            {
                                lang: "en",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "de",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "fr",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "es",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "pt",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "zh",
                                value: "",
                                visible: true,
                            },
                        ],
                        type: "text",
                        expression: 'CAST (@COND."PATIENT_ID" AS VARCHAR)',
                        order: 10,
                    },
                    conditionstatus: {
                        name: [
                            {
                                lang: "",
                                value: "Condition Status",
                            },
                        ],
                        disabledLangName: [
                            {
                                lang: "en",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "de",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "fr",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "es",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "pt",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "zh",
                                value: "",
                                visible: true,
                            },
                        ],
                        type: "text",
                        expression: '@COND."CONDITION_STATUS_NAME"',
                        referenceFilter:
                            "@REF.\"DOMAIN_ID\" = 'Condition Status' AND @REF.\"STANDARD_CONCEPT\" = 'S' AND (@REF.\"CONCEPT_NAME\") LIKE_REGEXPR '@SEARCH_QUERY' FLAG 'i'",
                        referenceExpression: '@REF."CONCEPT_NAME"',
                        order: 8,
                    },
                    conditionsource: {
                        name: [
                            {
                                lang: "",
                                value: "Condition Source",
                            },
                        ],
                        disabledLangName: [
                            {
                                lang: "en",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "de",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "fr",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "es",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "pt",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "zh",
                                value: "",
                                visible: true,
                            },
                        ],
                        type: "text",
                        expression: '@COND."CONDITION_SOURCE_NAME"',
                        order: 6,
                    },
                    conditiontype: {
                        name: [
                            {
                                lang: "",
                                value: "Condition Type",
                            },
                        ],
                        disabledLangName: [
                            {
                                lang: "en",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "de",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "fr",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "es",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "pt",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "zh",
                                value: "",
                                visible: true,
                            },
                        ],
                        type: "text",
                        expression: '@COND."CONDITION_TYPE_NAME"',
                        referenceFilter:
                            "@REF.\"DOMAIN_ID\" = 'Type Concept' AND @REF.\"CONCEPT_CLASS_ID\" = 'Condition Type' AND (@REF.\"CONCEPT_NAME\") LIKE_REGEXPR '@SEARCH_QUERY' FLAG 'i'",
                        referenceExpression: '@REF."CONCEPT_NAME"',
                        order: 4,
                    },
                    conditionname: {
                        name: [
                            {
                                lang: "",
                                value: "Condition Name",
                            },
                        ],
                        disabledLangName: [
                            {
                                lang: "en",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "de",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "fr",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "es",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "pt",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "zh",
                                value: "",
                                visible: true,
                            },
                        ],
                        type: "text",
                        expression: '@COND."CONDITION_NAME"',
                        referenceFilter:
                            "@REF.\"DOMAIN_ID\" = 'Condition' AND @REF.\"STANDARD_CONCEPT\" = 'S' AND (@REF.\"CONCEPT_NAME\") LIKE_REGEXPR '@SEARCH_QUERY' FLAG 'i'",
                        referenceExpression: '@REF."CONCEPT_NAME"',
                        order: 3,
                        conceptSetType: "name",
                    },
                    conditionoccurrenceid: {
                        name: [
                            {
                                lang: "",
                                value: "Condition Occurrence Id",
                            },
                        ],
                        disabledLangName: [
                            {
                                lang: "en",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "de",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "fr",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "es",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "pt",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "zh",
                                value: "",
                                visible: true,
                            },
                        ],
                        type: "text",
                        expression: '@COND."CONDITION_OCCURRENCE_ID"',
                        order: 0,
                    },
                    condconceptcode: {
                        name: [
                            {
                                lang: "",
                                value: "Condition concept code",
                            },
                        ],
                        disabledLangName: [
                            {
                                lang: "en",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "de",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "fr",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "es",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "pt",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "zh",
                                value: "",
                                visible: true,
                            },
                        ],
                        type: "text",
                        expression: '@COND."CONDITION_CONCEPT_CODE"',
                        referenceFilter:
                            "@REF.\"DOMAIN_ID\" = 'Condition' AND @REF.\"STANDARD_CONCEPT\" = 'S' AND (@REF.\"CONCEPT_CODE\") LIKE_REGEXPR '@SEARCH_QUERY' FLAG 'i'",
                        referenceExpression: '@REF."CONCEPT_CODE"',
                        order: 2,
                    },
                    conditiontypeconceptcode: {
                        name: [
                            {
                                lang: "",
                                value: "Condition Type concept code",
                            },
                        ],
                        disabledLangName: [
                            {
                                lang: "en",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "de",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "fr",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "es",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "pt",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "zh",
                                value: "",
                                visible: true,
                            },
                        ],
                        type: "text",
                        expression: '@COND."CONDITION_TYPE_CONCEPT_CODE"',
                        referenceFilter:
                            "@REF.\"DOMAIN_ID\" = 'Type Concept' AND @REF.\"CONCEPT_CLASS_ID\" = 'Condition Type' AND (@REF.\"CONCEPT_CODE\") LIKE_REGEXPR '@SEARCH_QUERY' FLAG 'i'",
                        referenceExpression: '@REF."CONCEPT_CODE"',
                        order: 5,
                    },
                    conditionsourceconceptcode: {
                        name: [
                            {
                                lang: "",
                                value: "Condition Source concept code",
                            },
                        ],
                        disabledLangName: [
                            {
                                lang: "en",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "de",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "fr",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "es",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "pt",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "zh",
                                value: "",
                                visible: true,
                            },
                        ],
                        type: "text",
                        expression: '@COND."CONDITION_SOURCE_CONCEPT_CODE"',
                        order: 7,
                    },
                    conditionstatusconceptcode: {
                        name: [
                            {
                                lang: "",
                                value: "Condition Status concept code",
                            },
                        ],
                        disabledLangName: [
                            {
                                lang: "en",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "de",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "fr",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "es",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "pt",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "zh",
                                value: "",
                                visible: true,
                            },
                        ],
                        type: "text",
                        expression: '@COND."CONDITION_STATUS_CONCEPT_CODE"',
                        referenceFilter:
                            "@REF.\"DOMAIN_ID\" = 'Condition Status' AND @REF.\"STANDARD_CONCEPT\" = 'S' AND (@REF.\"CONCEPT_CODE\") LIKE_REGEXPR '@SEARCH_QUERY' FLAG 'i'",
                        referenceExpression: '@REF."CONCEPT_CODE"',
                        order: 9,
                    },
                    conditionconceptid: {
                        name: [
                            {
                                lang: "",
                                value: "Condition concept id",
                            },
                        ],
                        disabledLangName: [
                            {
                                lang: "en",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "de",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "fr",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "es",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "pt",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "zh",
                                value: "",
                                visible: true,
                            },
                        ],
                        type: "text",
                        expression: '@COND."CONDITION_CONCEPT_ID"',
                        referenceFilter:
                            "@REF.\"DOMAIN_ID\" = 'Condition' AND @REF.\"STANDARD_CONCEPT\" = 'S' AND (@REF.\"CONCEPT_ID\") LIKE_REGEXPR '@SEARCH_QUERY' FLAG 'i'",
                        referenceExpression: '@REF."CONCEPT_ID"',
                        order: 1,
                    },
                },
            },
            death: {
                name: [
                    {
                        lang: "",
                        value: "Death",
                    },
                ],
                disabledLangName: [
                    {
                        lang: "en",
                        value: "",
                        visible: true,
                    },
                    {
                        lang: "de",
                        value: "",
                        visible: true,
                    },
                    {
                        lang: "fr",
                        value: "",
                        visible: true,
                    },
                    {
                        lang: "es",
                        value: "",
                        visible: true,
                    },
                    {
                        lang: "pt",
                        value: "",
                        visible: true,
                    },
                    {
                        lang: "zh",
                        value: "",
                        visible: true,
                    },
                ],
                defaultFilter: "1=1",
                defaultPlaceholder: "@DEATH",
                order: 13,
                parentInteraction: [],
                parentInteractionLabel: "parent",
                attributes: {
                    deathtypeconceptcode: {
                        name: [
                            {
                                lang: "",
                                value: "Death Type concept code",
                            },
                        ],
                        disabledLangName: [
                            {
                                lang: "en",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "de",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "fr",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "es",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "pt",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "zh",
                                value: "",
                                visible: true,
                            },
                        ],
                        type: "text",
                        expression: '@DEATH."DEATH_TYPE_CONCEPT_CODE"',
                        referenceFilter:
                            "@REF.\"DOMAIN_ID\" = 'Type Concept' AND @REF.\"CONCEPT_CLASS_ID\" = 'Death Type' AND (@REF.\"CONCEPT_CODE\") LIKE_REGEXPR '@SEARCH_QUERY' FLAG 'i'",
                        referenceExpression: '@REF."CONCEPT_CODE"',
                        order: 3,
                    },
                    pid: {
                        name: [
                            {
                                lang: "",
                                value: "Patient Id",
                            },
                        ],
                        disabledLangName: [
                            {
                                lang: "en",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "de",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "fr",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "es",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "pt",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "zh",
                                value: "",
                                visible: true,
                            },
                        ],
                        type: "text",
                        expression: 'CAST (@DEATH."PATIENT_ID" AS VARCHAR)',
                        order: 2,
                    },
                    deathdatetime: {
                        name: [
                            {
                                lang: "",
                                value: "Death Date/Time",
                            },
                        ],
                        disabledLangName: [
                            {
                                lang: "en",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "de",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "fr",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "es",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "pt",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "zh",
                                value: "",
                                visible: true,
                            },
                        ],
                        type: "datetime",
                        expression: '@DEATH."DEATH_DATETIME"',
                        order: 1,
                    },
                    deathdate: {
                        name: [
                            {
                                lang: "",
                                value: "Death Date",
                            },
                        ],
                        disabledLangName: [
                            {
                                lang: "en",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "de",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "fr",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "es",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "pt",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "zh",
                                value: "",
                                visible: true,
                            },
                        ],
                        type: "time",
                        expression: '@DEATH."DEATH_DATE"',
                        order: 0,
                    },
                    deathtype: {
                        name: [
                            {
                                lang: "",
                                value: "Death Type",
                            },
                        ],
                        disabledLangName: [
                            {
                                lang: "en",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "de",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "fr",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "es",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "pt",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "zh",
                                value: "",
                                visible: true,
                            },
                        ],
                        type: "text",
                        expression: '@DEATH."DEATH_TYPE_NAME"',
                        referenceFilter:
                            "@REF.\"DOMAIN_ID\" = 'Type Concept' AND @REF.\"CONCEPT_CLASS_ID\" = 'Death Type' AND (@REF.\"CONCEPT_NAME\") LIKE_REGEXPR '@SEARCH_QUERY' FLAG 'i'",
                        referenceExpression: '@REF."CONCEPT_NAME"',
                        order: 4,
                    },
                },
            },
            deviceexposure: {
                name: [
                    {
                        lang: "",
                        value: "Device Exposure",
                    },
                ],
                disabledLangName: [
                    {
                        lang: "en",
                        value: "",
                        visible: true,
                    },
                    {
                        lang: "de",
                        value: "",
                        visible: true,
                    },
                    {
                        lang: "fr",
                        value: "",
                        visible: true,
                    },
                    {
                        lang: "es",
                        value: "",
                        visible: true,
                    },
                    {
                        lang: "pt",
                        value: "",
                        visible: true,
                    },
                    {
                        lang: "zh",
                        value: "",
                        visible: true,
                    },
                ],
                defaultFilter: "1=1",
                defaultPlaceholder: "@DEVEXP",
                order: 12,
                parentInteraction: [],
                parentInteractionLabel: "parent",
                attributes: {
                    enddate: {
                        name: [
                            {
                                lang: "",
                                value: "End Date",
                            },
                        ],
                        disabledLangName: [
                            {
                                lang: "en",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "de",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "fr",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "es",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "pt",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "zh",
                                value: "",
                                visible: true,
                            },
                        ],
                        type: "time",
                        expression: '@DEVEXP."DEVICE_EXPOSURE_END_DATE"',
                        order: 8,
                    },
                    startdate: {
                        name: [
                            {
                                lang: "",
                                value: "Start Date",
                            },
                        ],
                        disabledLangName: [
                            {
                                lang: "en",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "de",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "fr",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "es",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "pt",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "zh",
                                value: "",
                                visible: true,
                            },
                        ],
                        type: "time",
                        expression: '@DEVEXP."DEVICE_EXPOSURE_START_DATE"',
                        order: 7,
                    },
                    devicename: {
                        name: [
                            {
                                lang: "",
                                value: "Device Name",
                            },
                        ],
                        disabledLangName: [
                            {
                                lang: "en",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "de",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "fr",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "es",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "pt",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "zh",
                                value: "",
                                visible: true,
                            },
                        ],
                        type: "text",
                        expression: '@DEVEXP."DEVICE_NAME"',
                        referenceFilter:
                            "@REF.\"DOMAIN_ID\" = 'Device' AND @REF.\"STANDARD_CONCEPT\" = 'S' AND (@REF.\"CONCEPT_NAME\") LIKE_REGEXPR '@SEARCH_QUERY' FLAG 'i'",
                        referenceExpression: '@REF."CONCEPT_NAME"',
                        order: 5,
                    },
                    pid: {
                        name: [
                            {
                                lang: "",
                                value: "Patient Id",
                            },
                        ],
                        disabledLangName: [
                            {
                                lang: "en",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "de",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "fr",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "es",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "pt",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "zh",
                                value: "",
                                visible: true,
                            },
                        ],
                        type: "text",
                        expression: 'CAST (@DEVEXP."PATIENT_ID" AS VARCHAR)',
                        order: 4,
                    },
                    deviceexposureid: {
                        name: [
                            {
                                lang: "",
                                value: "Device Exposure Id",
                            },
                        ],
                        disabledLangName: [
                            {
                                lang: "en",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "de",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "fr",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "es",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "pt",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "zh",
                                value: "",
                                visible: true,
                            },
                        ],
                        type: "text",
                        expression: '@DEVEXP."DEVICE_EXPOSURE_ID"',
                        order: 3,
                    },
                    devicetypename: {
                        name: [
                            {
                                lang: "",
                                value: "Device Type",
                            },
                        ],
                        disabledLangName: [
                            {
                                lang: "en",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "de",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "fr",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "es",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "pt",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "zh",
                                value: "",
                                visible: true,
                            },
                        ],
                        type: "text",
                        expression: '@DEVEXP."DEVICE_TYPE_NAME"',
                        referenceFilter:
                            "@REF.\"DOMAIN_ID\" = 'Type Concept' AND @REF.\"CONCEPT_CLASS_ID\" = 'Device Type' AND (@REF.\"CONCEPT_NAME\") LIKE_REGEXPR '@SEARCH_QUERY' FLAG 'i'",
                        referenceExpression: '@REF."CONCEPT_NAME"',
                        order: 0,
                    },
                    deviceconceptcode: {
                        name: [
                            {
                                lang: "",
                                value: "Device concept code",
                            },
                        ],
                        disabledLangName: [
                            {
                                lang: "en",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "de",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "fr",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "es",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "pt",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "zh",
                                value: "",
                                visible: true,
                            },
                        ],
                        type: "text",
                        expression: '@DEVEXP."DEVICE_CONCEPT_CODE"',
                        referenceFilter:
                            "@REF.\"DOMAIN_ID\" = 'Device' AND @REF.\"STANDARD_CONCEPT\" = 'S' AND (@REF.\"CONCEPT_CODE\") LIKE_REGEXPR '@SEARCH_QUERY' FLAG 'i'",
                        referenceExpression: '@REF."CONCEPT_CODE"',
                        order: 2,
                    },
                    devicetypeconceptcode: {
                        name: [
                            {
                                lang: "",
                                value: "Device Type concept code",
                            },
                        ],
                        disabledLangName: [
                            {
                                lang: "en",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "de",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "fr",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "es",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "pt",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "zh",
                                value: "",
                                visible: true,
                            },
                        ],
                        type: "text",
                        expression: '@DEVEXP."DEVICE_TYPE_CONCEPT_CODE"',
                        referenceFilter:
                            "@REF.\"DOMAIN_ID\" = 'Type Concept' AND @REF.\"CONCEPT_CLASS_ID\" = 'Device Type' AND (@REF.\"CONCEPT_CODE\") LIKE_REGEXPR '@SEARCH_QUERY' FLAG 'i'",
                        referenceExpression: '@REF."CONCEPT_CODE"',
                        order: 1,
                    },
                    deviceconceptid: {
                        name: [
                            {
                                lang: "",
                                value: "Device concept id",
                            },
                        ],
                        disabledLangName: [
                            {
                                lang: "en",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "de",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "fr",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "es",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "pt",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "zh",
                                value: "",
                                visible: true,
                            },
                        ],
                        type: "text",
                        expression: '@DEVEXP."DEVICE_CONCEPT_ID"',
                        referenceFilter:
                            "@REF.\"DOMAIN_ID\" = 'Device' AND @REF.\"STANDARD_CONCEPT\" = 'S' AND (@REF.\"CONCEPT_ID\") LIKE_REGEXPR '@SEARCH_QUERY' FLAG 'i'",
                        referenceExpression: '@REF."CONCEPT_ID"',
                        order: 6,
                    },
                },
            },
            doseera: {
                name: [
                    {
                        lang: "",
                        value: "Dose Era",
                    },
                ],
                disabledLangName: [
                    {
                        lang: "en",
                        value: "",
                        visible: true,
                    },
                    {
                        lang: "de",
                        value: "",
                        visible: true,
                    },
                    {
                        lang: "fr",
                        value: "",
                        visible: true,
                    },
                    {
                        lang: "es",
                        value: "",
                        visible: true,
                    },
                    {
                        lang: "pt",
                        value: "",
                        visible: true,
                    },
                    {
                        lang: "zh",
                        value: "",
                        visible: true,
                    },
                ],
                defaultFilter: "1=1",
                defaultPlaceholder: "@DOSEERA",
                order: 11,
                parentInteraction: [],
                parentInteractionLabel: "parent",
                attributes: {
                    unitname: {
                        name: [
                            {
                                lang: "",
                                value: "Unit",
                            },
                        ],
                        disabledLangName: [
                            {
                                lang: "en",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "de",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "fr",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "es",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "pt",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "zh",
                                value: "",
                                visible: true,
                            },
                        ],
                        type: "text",
                        expression: '@DOSEERA."UNIT_NAME"',
                        referenceFilter:
                            "@REF.\"DOMAIN_ID\" = 'Unit' AND @REF.\"STANDARD_CONCEPT\" = 'S' AND (@REF.\"CONCEPT_NAME\") LIKE_REGEXPR '@SEARCH_QUERY' FLAG 'i'",
                        referenceExpression: '@REF."CONCEPT_NAME"',
                        order: 7,
                    },
                    drug: {
                        name: [
                            {
                                lang: "",
                                value: "Drug",
                            },
                        ],
                        disabledLangName: [
                            {
                                lang: "en",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "de",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "fr",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "es",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "pt",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "zh",
                                value: "",
                                visible: true,
                            },
                        ],
                        type: "text",
                        expression: '@DOSEERA."DRUG_NAME"',
                        referenceFilter:
                            "@REF.\"DOMAIN_ID\" = 'Drug' AND @REF.\"STANDARD_CONCEPT\" = 'S' AND (@REF.\"CONCEPT_NAME\") LIKE_REGEXPR '@SEARCH_QUERY' FLAG 'i'",
                        referenceExpression: '@REF."CONCEPT_NAME"',
                        order: 6,
                    },
                    pid: {
                        name: [
                            {
                                lang: "",
                                value: "Patient Id",
                            },
                        ],
                        disabledLangName: [
                            {
                                lang: "en",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "de",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "fr",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "es",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "pt",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "zh",
                                value: "",
                                visible: true,
                            },
                        ],
                        type: "text",
                        expression: 'CAST (@DOSEERA."PATIENT_ID" AS VARCHAR)',
                        order: 5,
                    },
                    enddate: {
                        name: [
                            {
                                lang: "",
                                value: "End Date",
                            },
                        ],
                        disabledLangName: [
                            {
                                lang: "en",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "de",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "fr",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "es",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "pt",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "zh",
                                value: "",
                                visible: true,
                            },
                        ],
                        type: "time",
                        expression: '@DOSEERA."DOSE_ERA_END_DATE"',
                        order: 4,
                    },
                    startdate: {
                        name: [
                            {
                                lang: "",
                                value: "Start Date",
                            },
                        ],
                        disabledLangName: [
                            {
                                lang: "en",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "de",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "fr",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "es",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "pt",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "zh",
                                value: "",
                                visible: true,
                            },
                        ],
                        type: "time",
                        expression: '@DOSEERA."DOSE_ERA_START_DATE"',
                        order: 3,
                    },
                    dosevalue: {
                        name: [
                            {
                                lang: "",
                                value: "Dose Value",
                            },
                        ],
                        disabledLangName: [
                            {
                                lang: "en",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "de",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "fr",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "es",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "pt",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "zh",
                                value: "",
                                visible: true,
                            },
                        ],
                        type: "num",
                        expression: '@DOSEERA."DOSE_VALUE"',
                        order: 2,
                    },
                    doseeraid: {
                        name: [
                            {
                                lang: "",
                                value: "Dose Era Id",
                            },
                        ],
                        disabledLangName: [
                            {
                                lang: "en",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "de",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "fr",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "es",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "pt",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "zh",
                                value: "",
                                visible: true,
                            },
                        ],
                        type: "text",
                        expression: '@DOSEERA."DOSE_ERA_ID"',
                        order: 0,
                    },
                    drugconceptcode: {
                        name: [
                            {
                                lang: "",
                                value: "Drug concept code",
                            },
                        ],
                        disabledLangName: [
                            {
                                lang: "en",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "de",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "fr",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "es",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "pt",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "zh",
                                value: "",
                                visible: true,
                            },
                        ],
                        type: "text",
                        expression: '@DOSEERA."DRUG_CONCEPT_CODE"',
                        referenceFilter:
                            "@REF.\"DOMAIN_ID\" = 'Drug' AND @REF.\"STANDARD_CONCEPT\" = 'S' AND (@REF.\"CONCEPT_CODE\") LIKE_REGEXPR '@SEARCH_QUERY' FLAG 'i'",
                        referenceExpression: '@REF."CONCEPT_CODE"',
                        order: 1,
                    },
                    unitconceptcode: {
                        name: [
                            {
                                lang: "",
                                value: "Unit concept code",
                            },
                        ],
                        disabledLangName: [
                            {
                                lang: "en",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "de",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "fr",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "es",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "pt",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "zh",
                                value: "",
                                visible: true,
                            },
                        ],
                        type: "text",
                        expression: '@DOSEERA."UNIT_CONCEPT_CODE"',
                        referenceFilter:
                            "@REF.\"DOMAIN_ID\" = 'Unit' AND @REF.\"STANDARD_CONCEPT\" = 'S' AND (@REF.\"CONCEPT_CODE\") LIKE_REGEXPR '@SEARCH_QUERY' FLAG 'i'",
                        referenceExpression: '@REF."CONCEPT_CODE"',
                        order: 8,
                    },
                },
            },
            drugera: {
                name: [
                    {
                        lang: "",
                        value: "Drug Era",
                    },
                ],
                disabledLangName: [
                    {
                        lang: "en",
                        value: "",
                        visible: true,
                    },
                    {
                        lang: "de",
                        value: "",
                        visible: true,
                    },
                    {
                        lang: "fr",
                        value: "",
                        visible: true,
                    },
                    {
                        lang: "es",
                        value: "",
                        visible: true,
                    },
                    {
                        lang: "pt",
                        value: "",
                        visible: true,
                    },
                    {
                        lang: "zh",
                        value: "",
                        visible: true,
                    },
                ],
                defaultFilter: "1=1",
                defaultPlaceholder: "@DRUGERA",
                order: 10,
                parentInteraction: [],
                parentInteractionLabel: "parent",
                attributes: {
                    enddate: {
                        name: [
                            {
                                lang: "",
                                value: "End Date",
                            },
                        ],
                        disabledLangName: [
                            {
                                lang: "en",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "de",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "fr",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "es",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "pt",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "zh",
                                value: "",
                                visible: true,
                            },
                        ],
                        type: "time",
                        expression: '@DRUGERA."DRUG_ERA_END_DATE"',
                        order: 7,
                    },
                    startdate: {
                        name: [
                            {
                                lang: "",
                                value: "Start Date",
                            },
                        ],
                        disabledLangName: [
                            {
                                lang: "en",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "de",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "fr",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "es",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "pt",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "zh",
                                value: "",
                                visible: true,
                            },
                        ],
                        type: "time",
                        expression: '@DRUGERA."DRUG_ERA_START_DATE"',
                        order: 6,
                    },
                    drugname: {
                        name: [
                            {
                                lang: "",
                                value: "Drug Name",
                            },
                        ],
                        disabledLangName: [
                            {
                                lang: "en",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "de",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "fr",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "es",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "pt",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "zh",
                                value: "",
                                visible: true,
                            },
                        ],
                        type: "text",
                        expression: '@DRUGERA."DRUG_NAME"',
                        referenceFilter:
                            "@REF.\"DOMAIN_ID\" = 'Drug' AND @REF.\"STANDARD_CONCEPT\" = 'S' AND (@REF.\"CONCEPT_NAME\") LIKE_REGEXPR '@SEARCH_QUERY' FLAG 'i'",
                        referenceExpression: '@REF."CONCEPT_NAME"',
                        conceptSetType: "name",
                        order: 5,
                    },
                    pid: {
                        name: [
                            {
                                lang: "",
                                value: "Patient Id",
                            },
                        ],
                        disabledLangName: [
                            {
                                lang: "en",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "de",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "fr",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "es",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "pt",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "zh",
                                value: "",
                                visible: true,
                            },
                        ],
                        type: "text",
                        expression: 'CAST (@DRUGERA."PATIENT_ID" AS VARCHAR)',
                        order: 4,
                    },
                    drugeraid: {
                        name: [
                            {
                                lang: "",
                                value: "Drug Era Id",
                            },
                        ],
                        disabledLangName: [
                            {
                                lang: "en",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "de",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "fr",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "es",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "pt",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "zh",
                                value: "",
                                visible: true,
                            },
                        ],
                        type: "text",
                        expression: '@DRUGERA."DRUG_ERA_ID"',
                        order: 2,
                    },
                    gapdays: {
                        name: [
                            {
                                lang: "",
                                value: "Gap Days",
                            },
                        ],
                        disabledLangName: [
                            {
                                lang: "en",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "de",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "fr",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "es",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "pt",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "zh",
                                value: "",
                                visible: true,
                            },
                        ],
                        type: "num",
                        expression: '@DRUGERA."GAP_DAYS"',
                        order: 1,
                    },
                    drugexpcount: {
                        name: [
                            {
                                lang: "",
                                value: "Drug Exposure Count",
                            },
                        ],
                        disabledLangName: [
                            {
                                lang: "en",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "de",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "fr",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "es",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "pt",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "zh",
                                value: "",
                                visible: true,
                            },
                        ],
                        type: "num",
                        expression: '@DRUGERA."DRUG_EXPOSURE_COUNT"',
                        order: 0,
                    },
                    drugconceptcode: {
                        name: [
                            {
                                lang: "",
                                value: "Drug concept code",
                            },
                        ],
                        disabledLangName: [
                            {
                                lang: "en",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "de",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "fr",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "es",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "pt",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "zh",
                                value: "",
                                visible: true,
                            },
                        ],
                        type: "text",
                        expression: '@DRUGERA."DRUG_CONCEPT_CODE"',
                        referenceFilter:
                            "@REF.\"DOMAIN_ID\" = 'Drug' AND @REF.\"STANDARD_CONCEPT\" = 'S' AND (@REF.\"CONCEPT_CODE\") LIKE_REGEXPR '@SEARCH_QUERY' FLAG 'i'",
                        referenceExpression: '@REF."CONCEPT_CODE"',
                        order: 3,
                    },
                },
            },
            drugexposure: {
                name: [
                    {
                        lang: "",
                        value: "Drug Exposure",
                    },
                ],
                disabledLangName: [
                    {
                        lang: "en",
                        value: "",
                        visible: true,
                    },
                    {
                        lang: "de",
                        value: "",
                        visible: true,
                    },
                    {
                        lang: "fr",
                        value: "",
                        visible: true,
                    },
                    {
                        lang: "es",
                        value: "",
                        visible: true,
                    },
                    {
                        lang: "pt",
                        value: "",
                        visible: true,
                    },
                    {
                        lang: "zh",
                        value: "",
                        visible: true,
                    },
                ],
                defaultFilter: "1=1",
                defaultPlaceholder: "@DRUGEXP",
                order: 9,
                parentInteraction: [],
                parentInteractionLabel: "parent",
                attributes: {
                    enddatetime: {
                        name: [
                            {
                                lang: "",
                                value: "End Date/Time",
                            },
                        ],
                        disabledLangName: [
                            {
                                lang: "en",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "de",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "fr",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "es",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "pt",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "zh",
                                value: "",
                                visible: true,
                            },
                        ],
                        type: "datetime",
                        expression: '@DRUGEXP."DRUG_EXPOSURE_END_DATETIME"',
                        order: 20,
                    },
                    refills: {
                        name: [
                            {
                                lang: "",
                                value: "Refills",
                            },
                        ],
                        disabledLangName: [
                            {
                                lang: "en",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "de",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "fr",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "es",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "pt",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "zh",
                                value: "",
                                visible: true,
                            },
                        ],
                        type: "num",
                        expression: '@DRUGEXP."REFILLS"',
                        order: 19,
                    },
                    startdatetime: {
                        name: [
                            {
                                lang: "",
                                value: "Start Date/Time",
                            },
                        ],
                        disabledLangName: [
                            {
                                lang: "en",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "de",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "fr",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "es",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "pt",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "zh",
                                value: "",
                                visible: true,
                            },
                        ],
                        type: "datetime",
                        expression: '@DRUGEXP."DRUG_EXPOSURE_START_DATETIME"',
                        order: 18,
                    },
                    stopreason: {
                        name: [
                            {
                                lang: "",
                                value: "Stop Reason",
                            },
                        ],
                        disabledLangName: [
                            {
                                lang: "en",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "de",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "fr",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "es",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "pt",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "zh",
                                value: "",
                                visible: true,
                            },
                        ],
                        type: "text",
                        expression: '@DRUGEXP."STOP_REASON"',
                        order: 17,
                    },
                    enddate: {
                        name: [
                            {
                                lang: "",
                                value: "End Date",
                            },
                        ],
                        disabledLangName: [
                            {
                                lang: "en",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "de",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "fr",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "es",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "pt",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "zh",
                                value: "",
                                visible: true,
                            },
                        ],
                        type: "time",
                        expression: '@DRUGEXP."DRUG_EXPOSURE_END_DATE"',
                        order: 16,
                    },
                    drugtype: {
                        name: [
                            {
                                lang: "",
                                value: "Drug Type",
                            },
                        ],
                        disabledLangName: [
                            {
                                lang: "en",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "de",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "fr",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "es",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "pt",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "zh",
                                value: "",
                                visible: true,
                            },
                        ],
                        type: "text",
                        expression: '@DRUGEXP."DRUG_TYPE_NAME"',
                        referenceFilter:
                            "@REF.\"DOMAIN_ID\" = 'Type Concept' AND @REF.\"CONCEPT_CLASS_ID\" = 'Drug Type' AND (@REF.\"CONCEPT_NAME\") LIKE_REGEXPR '@SEARCH_QUERY' FLAG 'i'",
                        referenceExpression: '@REF."CONCEPT_NAME"',
                        order: 13,
                    },
                    startdate: {
                        name: [
                            {
                                lang: "",
                                value: "Start Date",
                            },
                        ],
                        disabledLangName: [
                            {
                                lang: "en",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "de",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "fr",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "es",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "pt",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "zh",
                                value: "",
                                visible: true,
                            },
                        ],
                        type: "time",
                        expression: '@DRUGEXP."DRUG_EXPOSURE_START_DATE"',
                        order: 12,
                    },
                    drugname: {
                        name: [
                            {
                                lang: "",
                                value: "Drug Name",
                            },
                        ],
                        disabledLangName: [
                            {
                                lang: "en",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "de",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "fr",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "es",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "pt",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "zh",
                                value: "",
                                visible: true,
                            },
                        ],
                        type: "text",
                        expression: '@DRUGEXP."DRUG_NAME"',
                        referenceFilter:
                            "@REF.\"DOMAIN_ID\" = 'Drug' AND @REF.\"STANDARD_CONCEPT\" = 'S' AND (@REF.\"CONCEPT_NAME\") LIKE_REGEXPR '@SEARCH_QUERY' FLAG 'i'",
                        referenceExpression: '@REF."CONCEPT_NAME"',
                        order: 11,
                    },
                    lotnumber: {
                        name: [
                            {
                                lang: "",
                                value: "Lot Number",
                            },
                        ],
                        disabledLangName: [
                            {
                                lang: "en",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "de",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "fr",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "es",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "pt",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "zh",
                                value: "",
                                visible: true,
                            },
                        ],
                        type: "text",
                        expression: '@DRUGEXP."LOT_NUMBER"',
                        order: 10,
                    },
                    routename: {
                        name: [
                            {
                                lang: "",
                                value: "Route Name",
                            },
                        ],
                        disabledLangName: [
                            {
                                lang: "en",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "de",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "fr",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "es",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "pt",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "zh",
                                value: "",
                                visible: true,
                            },
                        ],
                        type: "text",
                        expression: '@DRUGEXP."ROUTE_NAME"',
                        referenceFilter:
                            "@REF.\"DOMAIN_ID\" = 'Route' AND @REF.\"STANDARD_CONCEPT\" = 'S' AND (@REF.\"CONCEPT_NAME\") LIKE_REGEXPR '@SEARCH_QUERY' FLAG 'i'",
                        referenceExpression: '@REF."CONCEPT_NAME"',
                        order: 7,
                    },
                    drugexposureid: {
                        name: [
                            {
                                lang: "",
                                value: "Drug Exposure Id",
                            },
                        ],
                        disabledLangName: [
                            {
                                lang: "en",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "de",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "fr",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "es",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "pt",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "zh",
                                value: "",
                                visible: true,
                            },
                        ],
                        type: "text",
                        expression: '@DRUGEXP."DRUG_EXPOSURE_ID"',
                        order: 4,
                    },
                    sig: {
                        name: [
                            {
                                lang: "",
                                value: "Sig",
                            },
                        ],
                        disabledLangName: [
                            {
                                lang: "en",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "de",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "fr",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "es",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "pt",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "zh",
                                value: "",
                                visible: true,
                            },
                        ],
                        type: "text",
                        expression: 'CAST (@DRUGEXP."SIG" AS VARCHAR)',
                        order: 3,
                    },
                    pid: {
                        name: [
                            {
                                lang: "",
                                value: "Patient Id",
                            },
                        ],
                        disabledLangName: [
                            {
                                lang: "en",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "de",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "fr",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "es",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "pt",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "zh",
                                value: "",
                                visible: true,
                            },
                        ],
                        type: "text",
                        expression: 'CAST (@DRUGEXP."PATIENT_ID" AS VARCHAR)',
                        order: 2,
                    },
                    verbatimenddate: {
                        name: [
                            {
                                lang: "",
                                value: "Verbatim End Date",
                            },
                        ],
                        disabledLangName: [
                            {
                                lang: "en",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "de",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "fr",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "es",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "pt",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "zh",
                                value: "",
                                visible: true,
                            },
                        ],
                        type: "time",
                        expression: '@DRUGEXP."VERBATIM_END_DATE"',
                        order: 1,
                    },
                    dayssupply: {
                        name: [
                            {
                                lang: "",
                                value: "Days of supply",
                            },
                        ],
                        disabledLangName: [
                            {
                                lang: "en",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "de",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "fr",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "es",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "pt",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "zh",
                                value: "",
                                visible: true,
                            },
                        ],
                        type: "num",
                        expression: '@DRUGEXP."DAYS_SUPPLY"',
                        order: 0,
                    },
                    drugconceptcode: {
                        name: [
                            {
                                lang: "",
                                value: "Drug concept code",
                            },
                        ],
                        disabledLangName: [
                            {
                                lang: "en",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "de",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "fr",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "es",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "pt",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "zh",
                                value: "",
                                visible: true,
                            },
                        ],
                        type: "text",
                        expression: '@DRUGEXP."DRUG_CONCEPT_CODE"',
                        referenceFilter:
                            "@REF.\"DOMAIN_ID\" = 'Drug' AND @REF.\"STANDARD_CONCEPT\" = 'S' AND (@REF.\"CONCEPT_CODE\") LIKE_REGEXPR '@SEARCH_QUERY' FLAG 'i'",
                        referenceExpression: '@REF."CONCEPT_CODE"',
                        order: 6,
                    },
                    drugtypeconceptcode: {
                        name: [
                            {
                                lang: "",
                                value: "Drug Type concept code",
                            },
                        ],
                        disabledLangName: [
                            {
                                lang: "en",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "de",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "fr",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "es",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "pt",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "zh",
                                value: "",
                                visible: true,
                            },
                        ],
                        type: "text",
                        expression: '@DRUGEXP."DRUG_TYPE_CONCEPT_CODE"',
                        referenceFilter:
                            "@REF.\"DOMAIN_ID\" = 'Type Concept' AND @REF.\"CONCEPT_CLASS_ID\" = 'Drug Type' AND (@REF.\"CONCEPT_CODE\") LIKE_REGEXPR '@SEARCH_QUERY' FLAG 'i'",
                        referenceExpression: '@REF."CONCEPT_CODE"',
                        order: 15,
                    },
                    routeconceptcode: {
                        name: [
                            {
                                lang: "",
                                value: "Route concept code",
                            },
                        ],
                        disabledLangName: [
                            {
                                lang: "en",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "de",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "fr",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "es",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "pt",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "zh",
                                value: "",
                                visible: true,
                            },
                        ],
                        type: "text",
                        expression: '@DRUGEXP."ROUTE_CONCEPT_CODE"',
                        referenceFilter:
                            "@REF.\"DOMAIN_ID\" = 'Route' AND @REF.\"STANDARD_CONCEPT\" = 'S' AND (@REF.\"CONCEPT_CODE\") LIKE_REGEXPR '@SEARCH_QUERY' FLAG 'i'",
                        referenceExpression: '@REF."CONCEPT_CODE"',
                        order: 9,
                    },
                    drugconceptid: {
                        name: [
                            {
                                lang: "",
                                value: "Drug concept id",
                            },
                        ],
                        disabledLangName: [
                            {
                                lang: "en",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "de",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "fr",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "es",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "pt",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "zh",
                                value: "",
                                visible: true,
                            },
                        ],
                        type: "text",
                        expression: '@DRUGEXP."DRUG_CONCEPT_ID"',
                        referenceFilter:
                            "@REF.\"DOMAIN_ID\" = 'Drug' AND @REF.\"STANDARD_CONCEPT\" = 'S' AND (@REF.\"CONCEPT_ID\") LIKE_REGEXPR '@SEARCH_QUERY' FLAG 'i'",
                        referenceExpression: '@REF."CONCEPT_ID"',
                        order: 5,
                    },
                    routeconceptid: {
                        name: [
                            {
                                lang: "",
                                value: "Route concept id",
                            },
                        ],
                        disabledLangName: [
                            {
                                lang: "en",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "de",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "fr",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "es",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "pt",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "zh",
                                value: "",
                                visible: true,
                            },
                        ],
                        type: "text",
                        expression: '@DRUGEXP."ROUTE_CONCEPT_ID"',
                        referenceFilter:
                            "@REF.\"DOMAIN_ID\" = 'Route' AND @REF.\"STANDARD_CONCEPT\" = 'S' AND (@REF.\"CONCEPT_ID\") LIKE_REGEXPR '@SEARCH_QUERY' FLAG 'i'",
                        referenceExpression: '@REF."CONCEPT_ID"',
                        order: 8,
                    },
                    drugtypeconceptid: {
                        name: [
                            {
                                lang: "",
                                value: "Drug type concept id",
                            },
                        ],
                        disabledLangName: [
                            {
                                lang: "en",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "de",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "fr",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "es",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "pt",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "zh",
                                value: "",
                                visible: true,
                            },
                        ],
                        type: "text",
                        expression: '@DRUGEXP."DRUG_TYPE_CONCEPT_ID"',
                        referenceFilter:
                            "@REF.\"DOMAIN_ID\" = 'Type Concept' AND @REF.\"CONCEPT_CLASS_ID\" = 'Drug Type' AND (@REF.\"CONCEPT_ID\") LIKE_REGEXPR '@SEARCH_QUERY' FLAG 'i'",
                        referenceExpression: '@REF."CONCEPT_ID"',
                        order: 14,
                    },
                },
            },
            measurement: {
                name: [
                    {
                        lang: "",
                        value: "Measurement",
                    },
                ],
                disabledLangName: [
                    {
                        lang: "en",
                        value: "",
                        visible: true,
                    },
                    {
                        lang: "de",
                        value: "",
                        visible: true,
                    },
                    {
                        lang: "fr",
                        value: "",
                        visible: true,
                    },
                    {
                        lang: "es",
                        value: "",
                        visible: true,
                    },
                    {
                        lang: "pt",
                        value: "",
                        visible: true,
                    },
                    {
                        lang: "zh",
                        value: "",
                        visible: true,
                    },
                ],
                defaultFilter: "1=1",
                defaultPlaceholder: "@MEAS",
                order: 7,
                parentInteraction: [],
                parentInteractionLabel: "parent",
                attributes: {
                    numval: {
                        name: [
                            {
                                lang: "",
                                value: "Value (numeric)",
                            },
                        ],
                        disabledLangName: [
                            {
                                lang: "en",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "de",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "fr",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "es",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "pt",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "zh",
                                value: "",
                                visible: true,
                            },
                        ],
                        type: "num",
                        expression: '@MEAS."VALUE_AS_NUMBER"',
                        order: 11,
                    },
                    measurementname: {
                        name: [
                            {
                                lang: "",
                                value: "Measurement name",
                            },
                            {
                                lang: "en",
                                value: "Measurement name",
                                visible: true,
                            },
                        ],
                        disabledLangName: [
                            {
                                lang: "de",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "fr",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "es",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "pt",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "zh",
                                value: "",
                                visible: true,
                            },
                        ],
                        type: "text",
                        expression: '@MEAS."MEASUREMENT_NAME"',
                        referenceFilter:
                            "@REF.\"DOMAIN_ID\" = 'Measurement' AND (@REF.\"CONCEPT_NAME\") LIKE_REGEXPR '@SEARCH_QUERY' FLAG 'i'",
                        referenceExpression: '@REF."CONCEPT_NAME"',
                        order: 10,
                    },
                    measurementtype: {
                        name: [
                            {
                                lang: "",
                                value: "Measurement type",
                            },
                        ],
                        disabledLangName: [
                            {
                                lang: "en",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "de",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "fr",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "es",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "pt",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "zh",
                                value: "",
                                visible: true,
                            },
                        ],
                        type: "text",
                        expression: '@MEAS."MEASUREMENT_TYPE_NAME"',
                        referenceFilter:
                            "@REF.\"CONCEPT_CLASS_ID\" = 'Measurement' AND (@REF.\"CONCEPT_NAME\") LIKE_REGEXPR '@SEARCH_QUERY' FLAG 'i'",
                        referenceExpression: '@REF."CONCEPT_NAME"',
                        order: 8,
                    },
                    measurementdate: {
                        name: [
                            {
                                lang: "",
                                value: "Measurement date",
                            },
                        ],
                        disabledLangName: [
                            {
                                lang: "en",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "de",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "fr",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "es",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "pt",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "zh",
                                value: "",
                                visible: true,
                            },
                        ],
                        type: "time",
                        expression: '@MEAS."MEASUREMENT_DATE"',
                        order: 7,
                    },
                    pid: {
                        name: [
                            {
                                lang: "",
                                value: "Patient Id",
                            },
                        ],
                        disabledLangName: [
                            {
                                lang: "en",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "de",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "fr",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "es",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "pt",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "zh",
                                value: "",
                                visible: true,
                            },
                        ],
                        type: "text",
                        expression: 'CAST (@MEAS."PATIENT_ID" AS VARCHAR)',
                        order: 6,
                    },
                    measurementid: {
                        name: [
                            {
                                lang: "",
                                value: "Measurement Id",
                            },
                        ],
                        disabledLangName: [
                            {
                                lang: "en",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "de",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "fr",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "es",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "pt",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "zh",
                                value: "",
                                visible: true,
                            },
                        ],
                        type: "text",
                        expression: '@MEAS."MEASUREMENT_ID"',
                        order: 3,
                    },
                    textval: {
                        name: [
                            {
                                lang: "",
                                value: "Value (text)",
                            },
                        ],
                        disabledLangName: [
                            {
                                lang: "en",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "de",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "fr",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "es",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "pt",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "zh",
                                value: "",
                                visible: true,
                            },
                        ],
                        type: "text",
                        expression: '@MEAS."MEASUREMENT_VALUE_NAME"',
                        order: 1,
                    },
                    measurementconceptcode: {
                        name: [
                            {
                                lang: "",
                                value: "Measurement concept code",
                            },
                        ],
                        disabledLangName: [
                            {
                                lang: "en",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "de",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "fr",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "es",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "pt",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "zh",
                                value: "",
                                visible: true,
                            },
                        ],
                        type: "text",
                        expression: '@MEAS."MEASUREMENT_CONCEPT_CODE"',
                        referenceFilter:
                            "@REF.\"DOMAIN_ID\" = 'Measurement' AND (@REF.\"CONCEPT_CODE\") LIKE_REGEXPR '@SEARCH_QUERY' FLAG 'i'",
                        referenceExpression: '@REF."CONCEPT_CODE"',
                        order: 5,
                    },
                    measurementtypeconceptcode: {
                        name: [
                            {
                                lang: "",
                                value: "Measurement type concept code",
                            },
                        ],
                        disabledLangName: [
                            {
                                lang: "en",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "de",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "fr",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "es",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "pt",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "zh",
                                value: "",
                                visible: true,
                            },
                        ],
                        type: "text",
                        expression: '@MEAS."MEASUREMENT_TYPE_CONCEPT_CODE"',
                        referenceFilter:
                            "@REF.\"CONCEPT_CLASS_ID\" = 'Measurement' AND (@REF.\"CONCEPT_CODE\") LIKE_REGEXPR '@SEARCH_QUERY' FLAG 'i'",
                        referenceExpression: '@REF."CONCEPT_CODE"',
                        order: 9,
                    },
                    valueasconceptcode: {
                        name: [
                            {
                                lang: "",
                                value: "Value as concept code",
                            },
                        ],
                        disabledLangName: [
                            {
                                lang: "en",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "de",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "fr",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "es",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "pt",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "zh",
                                value: "",
                                visible: true,
                            },
                        ],
                        type: "text",
                        expression: '@MEAS."VALUE_AS_CONCEPT_CODE"',
                        order: 2,
                    },
                    unitconceptcode: {
                        name: [
                            {
                                lang: "",
                                value: "Unit concept code",
                            },
                        ],
                        disabledLangName: [
                            {
                                lang: "en",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "de",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "fr",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "es",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "pt",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "zh",
                                value: "",
                                visible: true,
                            },
                        ],
                        type: "text",
                        expression: '@MEAS."UNIT_CONCEPT_CODE"',
                        referenceFilter:
                            "@REF.\"DOMAIN_ID\" = 'Unit' AND @REF.\"STANDARD_CONCEPT\" = 'S' AND (@REF.\"CONCEPT_CODE\") LIKE_REGEXPR '@SEARCH_QUERY' FLAG 'i'",
                        referenceExpression: '@REF."CONCEPT_CODE"',
                        order: 0,
                    },
                    measurementconceptid: {
                        name: [
                            {
                                lang: "",
                                value: "Measurement concept id",
                            },
                        ],
                        disabledLangName: [
                            {
                                lang: "en",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "de",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "fr",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "es",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "pt",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "zh",
                                value: "",
                                visible: true,
                            },
                        ],
                        type: "text",
                        expression: '@MEAS."MEASUREMENT_CONCEPT_ID"',
                        referenceFilter:
                            "@REF.\"DOMAIN_ID\" = 'Measurement' AND (@REF.\"CONCEPT_ID\") LIKE_REGEXPR '@SEARCH_QUERY' FLAG 'i'",
                        referenceExpression: '@REF."CONCEPT_ID"',
                        order: 4,
                    },
                },
            },
            observation: {
                name: [
                    {
                        lang: "",
                        value: "Observation",
                    },
                ],
                disabledLangName: [
                    {
                        lang: "en",
                        value: "",
                        visible: true,
                    },
                    {
                        lang: "de",
                        value: "",
                        visible: true,
                    },
                    {
                        lang: "fr",
                        value: "",
                        visible: true,
                    },
                    {
                        lang: "es",
                        value: "",
                        visible: true,
                    },
                    {
                        lang: "pt",
                        value: "",
                        visible: true,
                    },
                    {
                        lang: "zh",
                        value: "",
                        visible: true,
                    },
                ],
                defaultFilter: "1=1",
                defaultPlaceholder: "@OBS",
                order: 6,
                parentInteraction: [],
                parentInteractionLabel: "parent",
                attributes: {
                    unit: {
                        name: [
                            {
                                lang: "",
                                value: "Unit",
                            },
                        ],
                        disabledLangName: [
                            {
                                lang: "en",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "de",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "fr",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "es",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "pt",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "zh",
                                value: "",
                                visible: true,
                            },
                        ],
                        type: "text",
                        expression: '@OBS."UNIT_NAME"',
                        referenceFilter:
                            "@REF.\"DOMAIN_ID\" = 'Unit' AND @REF.\"STANDARD_CONCEPT\" = 'S' AND (@REF.\"CONCEPT_NAME\") LIKE_REGEXPR '@SEARCH_QUERY' FLAG 'i'",
                        referenceExpression: '@REF."CONCEPT_NAME"',
                        order: 17,
                    },
                    obsdatetime: {
                        name: [
                            {
                                lang: "",
                                value: "Observation Date/Time",
                            },
                        ],
                        disabledLangName: [
                            {
                                lang: "en",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "de",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "fr",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "es",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "pt",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "zh",
                                value: "",
                                visible: true,
                            },
                        ],
                        type: "datetime",
                        expression: '@OBS."OBSERVATION_DATETIME"',
                        order: 16,
                    },
                    pid: {
                        name: [
                            {
                                lang: "",
                                value: "Patient Id",
                            },
                        ],
                        disabledLangName: [
                            {
                                lang: "en",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "de",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "fr",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "es",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "pt",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "zh",
                                value: "",
                                visible: true,
                            },
                        ],
                        type: "text",
                        expression: 'CAST (@OBS."PATIENT_ID" AS VARCHAR)',
                        order: 15,
                    },
                    obsdate: {
                        name: [
                            {
                                lang: "",
                                value: "Observation Date",
                            },
                        ],
                        disabledLangName: [
                            {
                                lang: "en",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "de",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "fr",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "es",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "pt",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "zh",
                                value: "",
                                visible: true,
                            },
                        ],
                        type: "time",
                        expression: '@OBS."OBSERVATION_DATE"',
                        order: 14,
                    },
                    observationid: {
                        name: [
                            {
                                lang: "",
                                value: "Observation Id",
                            },
                        ],
                        disabledLangName: [
                            {
                                lang: "en",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "de",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "fr",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "es",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "pt",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "zh",
                                value: "",
                                visible: true,
                            },
                        ],
                        type: "text",
                        expression: '@OBS."OBSERVATION_ID"',
                        order: 12,
                    },
                    obsname: {
                        name: [
                            {
                                lang: "",
                                value: "Observation Name",
                            },
                        ],
                        disabledLangName: [
                            {
                                lang: "en",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "de",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "fr",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "es",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "pt",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "zh",
                                value: "",
                                visible: true,
                            },
                        ],
                        type: "text",
                        expression: '@OBS."OBSERVATION_NAME"',
                        referenceFilter:
                            "@REF.\"DOMAIN_ID\" = 'Observation' AND @REF.\"STANDARD_CONCEPT\" = 'S' AND (@REF.\"CONCEPT_NAME\") LIKE_REGEXPR '@SEARCH_QUERY' FLAG 'i'",
                        referenceExpression: '@REF."CONCEPT_NAME"',
                        order: 11,
                    },
                    qualifier: {
                        name: [
                            {
                                lang: "",
                                value: "Qualifier",
                            },
                        ],
                        disabledLangName: [
                            {
                                lang: "en",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "de",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "fr",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "es",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "pt",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "zh",
                                value: "",
                                visible: true,
                            },
                        ],
                        type: "text",
                        expression: '@OBS."QUALIFIER_NAME"',
                        referenceFilter:
                            "@REF.\"DOMAIN_ID\" = 'Observation' AND @REF.\"STANDARD_CONCEPT\" = 'S' AND @REF.\"CONCEPT_CLASS_ID\" = 'Qualifier Value' AND (@REF.\"CONCEPT_NAME\") LIKE_REGEXPR '@SEARCH_QUERY' FLAG 'i'",
                        referenceExpression: '@REF."CONCEPT_NAME"',
                        order: 8,
                    },
                    textval: {
                        name: [
                            {
                                lang: "",
                                value: "Value (text)",
                            },
                        ],
                        disabledLangName: [
                            {
                                lang: "en",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "de",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "fr",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "es",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "pt",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "zh",
                                value: "",
                                visible: true,
                            },
                        ],
                        type: "text",
                        expression: '@OBS."VALUE_NAME"',
                        order: 7,
                    },
                    verbatimtext: {
                        name: [
                            {
                                lang: "",
                                value: "Value (verbatim)",
                            },
                        ],
                        disabledLangName: [
                            {
                                lang: "en",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "de",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "fr",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "es",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "pt",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "zh",
                                value: "",
                                visible: true,
                            },
                        ],
                        type: "text",
                        expression: '@OBS."VALUE_AS_STRING"',
                        order: 6,
                    },
                    numval: {
                        name: [
                            {
                                lang: "",
                                value: "Value (numeric)",
                            },
                        ],
                        disabledLangName: [
                            {
                                lang: "en",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "de",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "fr",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "es",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "pt",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "zh",
                                value: "",
                                visible: true,
                            },
                        ],
                        type: "num",
                        expression: '@OBS."VALUE_AS_NUMBER"',
                        order: 3,
                    },
                    obstype: {
                        name: [
                            {
                                lang: "",
                                value: "Observation type",
                            },
                        ],
                        disabledLangName: [
                            {
                                lang: "en",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "de",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "fr",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "es",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "pt",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "zh",
                                value: "",
                                visible: true,
                            },
                        ],
                        type: "text",
                        expression: '@OBS."OBSERVATION_TYPE_NAME"',
                        referenceFilter:
                            "@REF.\"DOMAIN_ID\" = 'Type Concept' AND @REF.\"CONCEPT_CLASS_ID\" = 'Observation Type' AND (@REF.\"CONCEPT_NAME\") LIKE_REGEXPR '@SEARCH_QUERY' FLAG 'i'",
                        referenceExpression: '@REF."CONCEPT_NAME"',
                        order: 0,
                    },
                    obsconceptcode: {
                        name: [
                            {
                                lang: "",
                                value: "Observation concept code",
                            },
                        ],
                        disabledLangName: [
                            {
                                lang: "en",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "de",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "fr",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "es",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "pt",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "zh",
                                value: "",
                                visible: true,
                            },
                        ],
                        type: "text",
                        expression: '@OBS."OBSERVATION_CONCEPT_CODE"',
                        referenceFilter:
                            "@REF.\"DOMAIN_ID\" = 'Observation' AND @REF.\"STANDARD_CONCEPT\" = 'S' AND (@REF.\"CONCEPT_CODE\") LIKE_REGEXPR '@SEARCH_QUERY' FLAG 'i'",
                        referenceExpression: '@REF."CONCEPT_CODE"',
                        order: 13,
                    },
                    obstypeconceptcode: {
                        name: [
                            {
                                lang: "",
                                value: "Observation type concept code",
                            },
                        ],
                        disabledLangName: [
                            {
                                lang: "en",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "de",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "fr",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "es",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "pt",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "zh",
                                value: "",
                                visible: true,
                            },
                        ],
                        type: "text",
                        expression: '@OBS."OBSERVATION_TYPE_CONCEPT_CODE"',
                        referenceFilter:
                            "@REF.\"DOMAIN_ID\" = 'Type Concept' AND @REF.\"CONCEPT_CLASS_ID\" = 'Observation Type' AND (@REF.\"CONCEPT_CODE\") LIKE_REGEXPR '@SEARCH_QUERY' FLAG 'i'",
                        referenceExpression: '@REF."CONCEPT_CODE"',
                        order: 2,
                    },
                    valueasconceptcode: {
                        name: [
                            {
                                lang: "",
                                value: "Value as concept code",
                            },
                        ],
                        disabledLangName: [
                            {
                                lang: "en",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "de",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "fr",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "es",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "pt",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "zh",
                                value: "",
                                visible: true,
                            },
                        ],
                        type: "text",
                        expression: '@OBS."VALUE_AS_CONCEPT_CODE"',
                        order: 4,
                    },
                    qualifierconceptcode: {
                        name: [
                            {
                                lang: "",
                                value: "Qualifier concept code",
                            },
                        ],
                        disabledLangName: [
                            {
                                lang: "en",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "de",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "fr",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "es",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "pt",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "zh",
                                value: "",
                                visible: true,
                            },
                        ],
                        type: "text",
                        expression: '@OBS."QUALIFIER_CONCEPT_CODE"',
                        referenceFilter:
                            "@REF.\"DOMAIN_ID\" = 'Observation' AND @REF.\"STANDARD_CONCEPT\" = 'S' AND @REF.\"CONCEPT_CLASS_ID\" = 'Qualifier Value' AND (@REF.\"CONCEPT_CODE\") LIKE_REGEXPR '@SEARCH_QUERY' FLAG 'i'",
                        referenceExpression: '@REF."CONCEPT_CODE"',
                        order: 10,
                    },
                    unitconceptcode: {
                        name: [
                            {
                                lang: "",
                                value: "Unit concept code",
                            },
                        ],
                        disabledLangName: [
                            {
                                lang: "en",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "de",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "fr",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "es",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "pt",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "zh",
                                value: "",
                                visible: true,
                            },
                        ],
                        type: "text",
                        expression: '@OBS."UNIT_CONCEPT_CODE"',
                        referenceFilter:
                            "@REF.\"DOMAIN_ID\" = 'Unit' AND @REF.\"STANDARD_CONCEPT\" = 'S' AND (@REF.\"CONCEPT_CODE\") LIKE_REGEXPR '@SEARCH_QUERY' FLAG 'i'",
                        referenceExpression: '@REF."CONCEPT_CODE"',
                        order: 19,
                    },
                    observationtypeconceptid: {
                        name: [
                            {
                                lang: "",
                                value: "Observation type concept id",
                            },
                        ],
                        disabledLangName: [
                            {
                                lang: "en",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "de",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "fr",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "es",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "pt",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "zh",
                                value: "",
                                visible: true,
                            },
                        ],
                        type: "text",
                        expression: '@OBS."OBSERVATION_TYPE_CONCEPT_ID"',
                        referenceFilter:
                            "@REF.\"DOMAIN_ID\" = 'Type Concept' AND @REF.\"CONCEPT_CLASS_ID\" = 'Observation Type' AND (@REF.\"CONCEPT_ID\") LIKE_REGEXPR '@SEARCH_QUERY' FLAG 'i'",
                        referenceExpression: '@REF."CONCEPT_ID"',
                        order: 1,
                    },
                    valueasconceptid: {
                        name: [
                            {
                                lang: "",
                                value: "Value as concept id",
                            },
                        ],
                        disabledLangName: [
                            {
                                lang: "en",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "de",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "fr",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "es",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "pt",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "zh",
                                value: "",
                                visible: true,
                            },
                        ],
                        type: "text",
                        expression: '@OBS."VALUE_AS_CONCEPT_ID"',
                        order: 5,
                    },
                    quailifierconceptid: {
                        name: [
                            {
                                lang: "",
                                value: "Qualifier concept id",
                            },
                        ],
                        disabledLangName: [
                            {
                                lang: "en",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "de",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "fr",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "es",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "pt",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "zh",
                                value: "",
                                visible: true,
                            },
                        ],
                        type: "text",
                        expression: '@OBS."QUALIFIER_CONCEPT_ID"',
                        referenceFilter:
                            "@REF.\"DOMAIN_ID\" = 'Observation' AND @REF.\"STANDARD_CONCEPT\" = 'S' AND @REF.\"CONCEPT_CLASS_ID\" = 'Qualifier Value' AND (@REF.\"CONCEPT_ID\") LIKE_REGEXPR '@SEARCH_QUERY' FLAG 'i'",
                        referenceExpression: '@REF."CONCEPT_ID"',
                        order: 9,
                    },
                    unitconceptid: {
                        name: [
                            {
                                lang: "",
                                value: "Unit concept id",
                            },
                        ],
                        disabledLangName: [
                            {
                                lang: "en",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "de",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "fr",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "es",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "pt",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "zh",
                                value: "",
                                visible: true,
                            },
                        ],
                        type: "text",
                        expression: '@OBS."UNIT_CONCEPT_ID"',
                        referenceFilter:
                            "@REF.\"DOMAIN_ID\" = 'Unit' AND @REF.\"STANDARD_CONCEPT\" = 'S' AND (@REF.\"CONCEPT_ID\") LIKE_REGEXPR '@SEARCH_QUERY' FLAG 'i'",
                        referenceExpression: '@REF."CONCEPT_ID"',
                        order: 18,
                    },
                },
            },
            obsperiod: {
                name: [
                    {
                        lang: "",
                        value: "Observation Period",
                    },
                ],
                disabledLangName: [
                    {
                        lang: "en",
                        value: "",
                        visible: true,
                    },
                    {
                        lang: "de",
                        value: "",
                        visible: true,
                    },
                    {
                        lang: "fr",
                        value: "",
                        visible: true,
                    },
                    {
                        lang: "es",
                        value: "",
                        visible: true,
                    },
                    {
                        lang: "pt",
                        value: "",
                        visible: true,
                    },
                    {
                        lang: "zh",
                        value: "",
                        visible: true,
                    },
                ],
                defaultFilter: "1=1",
                defaultPlaceholder: "@OBSPER",
                order: 5,
                parentInteraction: [],
                parentInteractionLabel: "parent",
                attributes: {
                    enddate: {
                        name: [
                            {
                                lang: "",
                                value: "End Date",
                            },
                        ],
                        disabledLangName: [
                            {
                                lang: "en",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "de",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "fr",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "es",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "pt",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "zh",
                                value: "",
                                visible: true,
                            },
                        ],
                        type: "time",
                        expression: '@OBSPER."OBSERVATION_PERIOD_END_DATE"',
                        order: 6,
                    },
                    startdate: {
                        name: [
                            {
                                lang: "",
                                value: "Start Date",
                            },
                        ],
                        disabledLangName: [
                            {
                                lang: "en",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "de",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "fr",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "es",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "pt",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "zh",
                                value: "",
                                visible: true,
                            },
                        ],
                        type: "time",
                        expression: '@OBSPER."OBSERVATION_PERIOD_START_DATE"',
                        order: 5,
                    },
                    pid: {
                        name: [
                            {
                                lang: "",
                                value: "Patient Id",
                            },
                        ],
                        disabledLangName: [
                            {
                                lang: "en",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "de",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "fr",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "es",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "pt",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "zh",
                                value: "",
                                visible: true,
                            },
                        ],
                        type: "text",
                        expression: 'CAST (@OBSPER."PATIENT_ID" AS VARCHAR)',
                        order: 4,
                    },
                    periodtype: {
                        name: [
                            {
                                lang: "",
                                value: "Period type",
                            },
                        ],
                        disabledLangName: [
                            {
                                lang: "en",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "de",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "fr",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "es",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "pt",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "zh",
                                value: "",
                                visible: true,
                            },
                        ],
                        type: "text",
                        expression: '@OBSPER."PERIOD_TYPE_NAME"',
                        referenceFilter:
                            "@REF.\"DOMAIN_ID\" = 'Type Concept' AND @REF.\"CONCEPT_CLASS_ID\" = 'Obs Period Type' AND (@REF.\"CONCEPT_NAME\") LIKE_REGEXPR '@SEARCH_QUERY' FLAG 'i'",
                        referenceExpression: '@REF."CONCEPT_NAME"',
                        order: 2,
                    },
                    obsperiodid: {
                        name: [
                            {
                                lang: "",
                                value: "Observation period Id",
                            },
                        ],
                        disabledLangName: [
                            {
                                lang: "en",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "de",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "fr",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "es",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "pt",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "zh",
                                value: "",
                                visible: true,
                            },
                        ],
                        type: "text",
                        expression: '@OBSPER."OBSERVATION_PERIOD_ID"',
                        order: 0,
                    },
                    periodtypeconceptcode: {
                        name: [
                            {
                                lang: "",
                                value: "Observation period type concept code",
                            },
                        ],
                        disabledLangName: [
                            {
                                lang: "en",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "de",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "fr",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "es",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "pt",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "zh",
                                value: "",
                                visible: true,
                            },
                        ],
                        type: "text",
                        expression: '@OBSPER."PERIOD_TYPE_CONCEPT_CODE"',
                        referenceFilter:
                            "@REF.\"DOMAIN_ID\" = 'Type Concept' AND @REF.\"CONCEPT_CLASS_ID\" = 'Obs Period Type' AND (@REF.\"CONCEPT_CODE\") LIKE_REGEXPR '@SEARCH_QUERY' FLAG 'i'",
                        referenceExpression: '@REF."CONCEPT_CODE"',
                        order: 1,
                    },
                    periodtypeconceptid: {
                        name: [
                            {
                                lang: "",
                                value: "Period type concept id",
                            },
                        ],
                        disabledLangName: [
                            {
                                lang: "en",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "de",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "fr",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "es",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "pt",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "zh",
                                value: "",
                                visible: true,
                            },
                        ],
                        type: "text",
                        expression: '@OBSPER."PERIOD_TYPE_CONCEPT_ID"',
                        referenceFilter:
                            "@REF.\"DOMAIN_ID\" = 'Type Concept' AND @REF.\"CONCEPT_CLASS_ID\" = 'Obs Period Type' AND (@REF.\"CONCEPT_ID\") LIKE_REGEXPR '@SEARCH_QUERY' FLAG 'i'",
                        referenceExpression: '@REF."CONCEPT_ID"',
                        order: 3,
                    },
                },
            },
            ppperiod: {
                name: [
                    {
                        lang: "",
                        value: "Payer Plan Period",
                    },
                ],
                disabledLangName: [
                    {
                        lang: "en",
                        value: "",
                        visible: true,
                    },
                    {
                        lang: "de",
                        value: "",
                        visible: true,
                    },
                    {
                        lang: "fr",
                        value: "",
                        visible: true,
                    },
                    {
                        lang: "es",
                        value: "",
                        visible: true,
                    },
                    {
                        lang: "pt",
                        value: "",
                        visible: true,
                    },
                    {
                        lang: "zh",
                        value: "",
                        visible: true,
                    },
                ],
                defaultFilter: "1=1",
                defaultPlaceholder: "@PPPER",
                order: 4,
                parentInteraction: [],
                parentInteractionLabel: "parent",
                attributes: {
                    enddate: {
                        name: [
                            {
                                lang: "",
                                value: "End Date",
                            },
                        ],
                        disabledLangName: [
                            {
                                lang: "en",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "de",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "fr",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "es",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "pt",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "zh",
                                value: "",
                                visible: true,
                            },
                        ],
                        type: "time",
                        expression: '@PPPER."PAYER_PLAN_PERIOD_END_DATE"',
                        order: 3,
                    },
                    startdate: {
                        name: [
                            {
                                lang: "",
                                value: "Start Date",
                            },
                        ],
                        disabledLangName: [
                            {
                                lang: "en",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "de",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "fr",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "es",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "pt",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "zh",
                                value: "",
                                visible: true,
                            },
                        ],
                        type: "time",
                        expression: '@PPPER."PAYER_PLAN_PERIOD_START_DATE"',
                        order: 2,
                    },
                    pid: {
                        name: [
                            {
                                lang: "",
                                value: "Patient Id",
                            },
                        ],
                        disabledLangName: [
                            {
                                lang: "en",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "de",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "fr",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "es",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "pt",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "zh",
                                value: "",
                                visible: true,
                            },
                        ],
                        type: "text",
                        expression: 'CAST (@PPPER."PATIENT_ID" AS VARCHAR)',
                        order: 1,
                    },
                    ppperiodid: {
                        name: [
                            {
                                lang: "",
                                value: "Payer Plan Period Id",
                            },
                        ],
                        disabledLangName: [
                            {
                                lang: "en",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "de",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "fr",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "es",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "pt",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "zh",
                                value: "",
                                visible: true,
                            },
                        ],
                        type: "text",
                        expression: '@PPPER."PAYER_PLAN_PERIOD_ID"',
                        order: 0,
                    },
                },
            },
            proc: {
                name: [
                    {
                        lang: "",
                        value: "Procedure Occurrence",
                    },
                ],
                disabledLangName: [
                    {
                        lang: "en",
                        value: "",
                        visible: true,
                    },
                    {
                        lang: "de",
                        value: "",
                        visible: true,
                    },
                    {
                        lang: "fr",
                        value: "",
                        visible: true,
                    },
                    {
                        lang: "es",
                        value: "",
                        visible: true,
                    },
                    {
                        lang: "pt",
                        value: "",
                        visible: true,
                    },
                    {
                        lang: "zh",
                        value: "",
                        visible: true,
                    },
                ],
                defaultFilter: "1=1",
                defaultPlaceholder: "@PROC",
                order: 3,
                parentInteraction: [],
                parentInteractionLabel: "parent",
                attributes: {
                    procdatetime: {
                        name: [
                            {
                                lang: "",
                                value: "Procedure Date/Time",
                            },
                        ],
                        disabledLangName: [
                            {
                                lang: "en",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "de",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "fr",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "es",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "pt",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "zh",
                                value: "",
                                visible: true,
                            },
                        ],
                        type: "datetime",
                        expression: '@PROC."PROCEDURE_DATETIME"',
                        order: 12,
                    },
                    procconceptid: {
                        name: [
                            {
                                lang: "",
                                value: "Procedure Occurrence Id",
                            },
                        ],
                        disabledLangName: [
                            {
                                lang: "en",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "de",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "fr",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "es",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "pt",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "zh",
                                value: "",
                                visible: true,
                            },
                        ],
                        type: "text",
                        expression: '@PROC."PROCEDURE_OCCURRENCE_ID"',
                        order: 10,
                    },
                    procdate: {
                        name: [
                            {
                                lang: "",
                                value: "Procedure Date",
                            },
                        ],
                        disabledLangName: [
                            {
                                lang: "en",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "de",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "fr",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "es",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "pt",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "zh",
                                value: "",
                                visible: true,
                            },
                        ],
                        type: "time",
                        expression: '@PROC."PROCEDURE_DATE"',
                        order: 9,
                    },
                    qty: {
                        name: [
                            {
                                lang: "",
                                value: "Quantity",
                            },
                        ],
                        disabledLangName: [
                            {
                                lang: "en",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "de",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "fr",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "es",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "pt",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "zh",
                                value: "",
                                visible: true,
                            },
                        ],
                        type: "num",
                        expression: '@PROC."QUANTITY"',
                        order: 8,
                    },
                    procname: {
                        name: [
                            {
                                lang: "",
                                value: "Procedure name",
                            },
                        ],
                        disabledLangName: [
                            {
                                lang: "en",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "de",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "fr",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "es",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "pt",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "zh",
                                value: "",
                                visible: true,
                            },
                        ],
                        type: "text",
                        expression: '@PROC."PROCEDURE_NAME"',
                        referenceFilter:
                            "@REF.\"DOMAIN_ID\" = 'Procedure' AND @REF.\"STANDARD_CONCEPT\" = 'S' AND (@REF.\"CONCEPT_NAME\") LIKE_REGEXPR '@SEARCH_QUERY' FLAG 'i'",
                        referenceExpression: '@REF."CONCEPT_NAME"',
                        order: 7,
                    },
                    modifier: {
                        name: [
                            {
                                lang: "",
                                value: "Modifier",
                            },
                        ],
                        disabledLangName: [
                            {
                                lang: "en",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "de",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "fr",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "es",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "pt",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "zh",
                                value: "",
                                visible: true,
                            },
                        ],
                        type: "text",
                        expression: '@PROC."MODIFIER_NAME"',
                        order: 4,
                    },
                    pid: {
                        name: [
                            {
                                lang: "",
                                value: "Patient Id",
                            },
                        ],
                        disabledLangName: [
                            {
                                lang: "en",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "de",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "fr",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "es",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "pt",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "zh",
                                value: "",
                                visible: true,
                            },
                        ],
                        type: "text",
                        expression: 'CAST (@PROC."PATIENT_ID" AS VARCHAR)',
                        order: 3,
                    },
                    proctype: {
                        name: [
                            {
                                lang: "",
                                value: "Procedure type",
                            },
                        ],
                        disabledLangName: [
                            {
                                lang: "en",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "de",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "fr",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "es",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "pt",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "zh",
                                value: "",
                                visible: true,
                            },
                        ],
                        type: "text",
                        expression: '@PROC."PROCEDURE_TYPE_NAME"',
                        referenceFilter:
                            "@REF.\"DOMAIN_ID\" = 'Type Concept' AND @REF.\"CONCEPT_CLASS_ID\" = 'Procedure Type' AND (@REF.\"CONCEPT_NAME\") LIKE_REGEXPR '@SEARCH_QUERY' FLAG 'i'",
                        referenceExpression: '@REF."CONCEPT_NAME"',
                        order: 0,
                    },
                    procconceptcode: {
                        name: [
                            {
                                lang: "",
                                value: "Procedure concept code",
                            },
                        ],
                        disabledLangName: [
                            {
                                lang: "en",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "de",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "fr",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "es",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "pt",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "zh",
                                value: "",
                                visible: true,
                            },
                        ],
                        type: "text",
                        expression: '@PROC."PROCEDURE_CONCEPT_CODE"',
                        referenceFilter:
                            "@REF.\"DOMAIN_ID\" = 'Procedure' AND @REF.\"STANDARD_CONCEPT\" = 'S' AND (@REF.\"CONCEPT_CODE\") LIKE_REGEXPR '@SEARCH_QUERY' FLAG 'i'",
                        referenceExpression: '@REF."CONCEPT_CODE"',
                        order: 11,
                    },
                    proctypeconceptcode: {
                        name: [
                            {
                                lang: "",
                                value: "Procedure type concept code",
                            },
                        ],
                        disabledLangName: [
                            {
                                lang: "en",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "de",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "fr",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "es",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "pt",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "zh",
                                value: "",
                                visible: true,
                            },
                        ],
                        type: "text",
                        expression: '@PROC."PROCEDURE_TYPE_CONCEPT_CODE"',
                        referenceFilter:
                            "@REF.\"DOMAIN_ID\" = 'Type Concept' AND @REF.\"CONCEPT_CLASS_ID\" = 'Procedure Type' AND (@REF.\"CONCEPT_CODE\") LIKE_REGEXPR '@SEARCH_QUERY' FLAG 'i'",
                        referenceExpression: '@REF."CONCEPT_CODE"',
                        order: 2,
                    },
                    modifierconceptcode: {
                        name: [
                            {
                                lang: "",
                                value: "Modifier concept code",
                            },
                        ],
                        disabledLangName: [
                            {
                                lang: "en",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "de",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "fr",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "es",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "pt",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "zh",
                                value: "",
                                visible: true,
                            },
                        ],
                        type: "text",
                        expression: '@PROC."MODIFIER_CONCEPT_CODE"',
                        order: 6,
                    },
                    proctypeconceptid: {
                        name: [
                            {
                                lang: "",
                                value: "Procedure type concept id",
                            },
                        ],
                        disabledLangName: [
                            {
                                lang: "en",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "de",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "fr",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "es",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "pt",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "zh",
                                value: "",
                                visible: true,
                            },
                        ],
                        type: "text",
                        expression: '@PROC."PROCEDURE_TYPE_CONCEPT_ID"',
                        referenceFilter:
                            "@REF.\"DOMAIN_ID\" = 'Type Concept' AND @REF.\"CONCEPT_CLASS_ID\" = 'Procedure Type' AND (@REF.\"CONCEPT_ID\") LIKE_REGEXPR '@SEARCH_QUERY' FLAG 'i'",
                        referenceExpression: '@REF."CONCEPT_ID"',
                        order: 1,
                    },
                    modifierconceptid: {
                        name: [
                            {
                                lang: "",
                                value: "Modifier concept id",
                            },
                        ],
                        disabledLangName: [
                            {
                                lang: "en",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "de",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "fr",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "es",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "pt",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "zh",
                                value: "",
                                visible: true,
                            },
                        ],
                        type: "text",
                        expression: '@PROC."MODIFIER_CONCEPT_ID"',
                        order: 5,
                    },
                },
            },
            specimen: {
                name: [
                    {
                        lang: "",
                        value: "Specimen",
                    },
                ],
                disabledLangName: [
                    {
                        lang: "en",
                        value: "",
                        visible: true,
                    },
                    {
                        lang: "de",
                        value: "",
                        visible: true,
                    },
                    {
                        lang: "fr",
                        value: "",
                        visible: true,
                    },
                    {
                        lang: "es",
                        value: "",
                        visible: true,
                    },
                    {
                        lang: "pt",
                        value: "",
                        visible: true,
                    },
                    {
                        lang: "zh",
                        value: "",
                        visible: true,
                    },
                ],
                defaultFilter: "1=1",
                defaultPlaceholder: "@SPEC",
                order: 2,
                parentInteraction: [],
                parentInteractionLabel: "parent",
                attributes: {
                    specimentype: {
                        name: [
                            {
                                lang: "",
                                value: "Specimen type",
                            },
                        ],
                        disabledLangName: [
                            {
                                lang: "en",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "de",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "fr",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "es",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "pt",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "zh",
                                value: "",
                                visible: true,
                            },
                        ],
                        type: "text",
                        expression: '@SPEC."SPECIMEN_TYPE_NAME"',
                        referenceFilter:
                            "@REF.\"DOMAIN_ID\" = 'Type Concept' AND @REF.\"CONCEPT_CLASS_ID\" = 'Specimen Type' AND (@REF.\"CONCEPT_NAME\") LIKE_REGEXPR '@SEARCH_QUERY' FLAG 'i'",
                        referenceExpression: '@REF."CONCEPT_NAME"',
                        order: 17,
                    },
                    diseasestatus: {
                        name: [
                            {
                                lang: "",
                                value: "Disease status",
                            },
                        ],
                        disabledLangName: [
                            {
                                lang: "en",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "de",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "fr",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "es",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "pt",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "zh",
                                value: "",
                                visible: true,
                            },
                        ],
                        type: "text",
                        expression: '@SPEC."DISEASE_STATUS_NAME"',
                        referenceFilter:
                            "@REF.\"DOMAIN_ID\" = 'Spec Disease Status' AND @REF.\"STANDARD_CONCEPT\" = 'S' AND (@REF.\"CONCEPT_NAME\") LIKE_REGEXPR '@SEARCH_QUERY' FLAG 'i'",
                        referenceExpression: '@REF."CONCEPT_NAME"',
                        order: 14,
                    },
                    specimenname: {
                        name: [
                            {
                                lang: "",
                                value: "Specimen name",
                            },
                        ],
                        disabledLangName: [
                            {
                                lang: "en",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "de",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "fr",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "es",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "pt",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "zh",
                                value: "",
                                visible: true,
                            },
                        ],
                        type: "text",
                        expression: '@SPEC."SPECIMEN_NAME"',
                        referenceFilter:
                            "@REF.\"DOMAIN_ID\" = 'Specimen' AND @REF.\"STANDARD_CONCEPT\" = 'S' AND (@REF.\"CONCEPT_NAME\") LIKE_REGEXPR '@SEARCH_QUERY' FLAG 'i'",
                        referenceExpression: '@REF."CONCEPT_NAME"',
                        order: 13,
                    },
                    anatomicsite: {
                        name: [
                            {
                                lang: "",
                                value: "Anatomic site",
                            },
                        ],
                        disabledLangName: [
                            {
                                lang: "en",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "de",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "fr",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "es",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "pt",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "zh",
                                value: "",
                                visible: true,
                            },
                        ],
                        type: "text",
                        expression: '@SPEC."ANATOMIC_SITE_NAME"',
                        referenceFilter:
                            "@REF.\"DOMAIN_ID\" = 'Spec Anatomic Site' AND @REF.\"STANDARD_CONCEPT\" = 'S' AND (@REF.\"CONCEPT_NAME\") LIKE_REGEXPR '@SEARCH_QUERY' FLAG 'i'",
                        referenceExpression: '@REF."CONCEPT_NAME"',
                        order: 10,
                    },
                    pid: {
                        name: [
                            {
                                lang: "",
                                value: "Patient Id",
                            },
                        ],
                        disabledLangName: [
                            {
                                lang: "en",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "de",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "fr",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "es",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "pt",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "zh",
                                value: "",
                                visible: true,
                            },
                        ],
                        type: "text",
                        expression: 'CAST (@SPEC."PATIENT_ID" AS VARCHAR)',
                        order: 9,
                    },
                    specimenid: {
                        name: [
                            {
                                lang: "",
                                value: "Specimen Id",
                            },
                        ],
                        disabledLangName: [
                            {
                                lang: "en",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "de",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "fr",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "es",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "pt",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "zh",
                                value: "",
                                visible: true,
                            },
                        ],
                        type: "text",
                        expression: '@SPEC."SPECIMEN_ID"',
                        order: 6,
                    },
                    unit: {
                        name: [
                            {
                                lang: "",
                                value: "Unit",
                            },
                        ],
                        disabledLangName: [
                            {
                                lang: "en",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "de",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "fr",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "es",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "pt",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "zh",
                                value: "",
                                visible: true,
                            },
                        ],
                        type: "text",
                        expression: '@SPEC."UNIT_NAME"',
                        referenceFilter:
                            "@REF.\"DOMAIN_ID\" = 'Unit' AND @REF.\"STANDARD_CONCEPT\" = 'S' AND (@REF.\"CONCEPT_NAME\") LIKE_REGEXPR '@SEARCH_QUERY' FLAG 'i'",
                        referenceExpression: '@REF."CONCEPT_NAME"',
                        order: 3,
                    },
                    quantity: {
                        name: [
                            {
                                lang: "",
                                value: "Quantity",
                            },
                        ],
                        disabledLangName: [
                            {
                                lang: "en",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "de",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "fr",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "es",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "pt",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "zh",
                                value: "",
                                visible: true,
                            },
                        ],
                        type: "num",
                        expression: '@SPEC."QUANTITY"',
                        order: 2,
                    },
                    specimendatetime: {
                        name: [
                            {
                                lang: "",
                                value: "Specimen Date/Time",
                            },
                        ],
                        disabledLangName: [
                            {
                                lang: "en",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "de",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "fr",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "es",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "pt",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "zh",
                                value: "",
                                visible: true,
                            },
                        ],
                        type: "datetime",
                        expression: '@SPEC."SPECIMEN_DATETIME"',
                        order: 1,
                    },
                    specimendate: {
                        name: [
                            {
                                lang: "",
                                value: "Specimen Date",
                            },
                        ],
                        disabledLangName: [
                            {
                                lang: "en",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "de",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "fr",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "es",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "pt",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "zh",
                                value: "",
                                visible: true,
                            },
                        ],
                        type: "time",
                        expression: '@SPEC."SPECIMEN_DATE"',
                        order: 0,
                    },
                    specimenconceptcode: {
                        name: [
                            {
                                lang: "",
                                value: "Specimen concept code",
                            },
                        ],
                        disabledLangName: [
                            {
                                lang: "en",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "de",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "fr",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "es",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "pt",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "zh",
                                value: "",
                                visible: true,
                            },
                        ],
                        type: "text",
                        expression: '@SPEC."SPECIMEN_CONCEPT_CODE"',
                        referenceFilter:
                            "@REF.\"DOMAIN_ID\" = 'Specimen' AND @REF.\"STANDARD_CONCEPT\" = 'S' AND (@REF.\"CONCEPT_CODE\") LIKE_REGEXPR '@SEARCH_QUERY' FLAG 'i'",
                        referenceExpression: '@REF."CONCEPT_CODE"',
                        order: 8,
                    },
                    specimentypeconceptcode: {
                        name: [
                            {
                                lang: "",
                                value: "Specimen type concept code",
                            },
                        ],
                        disabledLangName: [
                            {
                                lang: "en",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "de",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "fr",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "es",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "pt",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "zh",
                                value: "",
                                visible: true,
                            },
                        ],
                        type: "text",
                        expression: '@SPEC."SPECIMEN_TYPE_CONCEPT_CODE"',
                        referenceFilter:
                            "@REF.\"DOMAIN_ID\" = 'Type Concept' AND @REF.\"CONCEPT_CLASS_ID\" = 'Specimen Type' AND (@REF.\"CONCEPT_CODE\") LIKE_REGEXPR '@SEARCH_QUERY' FLAG 'i'",
                        referenceExpression: '@REF."CONCEPT_CODE"',
                        order: 19,
                    },
                    unitconceptcode: {
                        name: [
                            {
                                lang: "",
                                value: "Unit concept code",
                            },
                        ],
                        disabledLangName: [
                            {
                                lang: "en",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "de",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "fr",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "es",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "pt",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "zh",
                                value: "",
                                visible: true,
                            },
                        ],
                        type: "text",
                        expression: '@SPEC."UNIT_CONCEPT_CODE"',
                        referenceFilter:
                            "@REF.\"DOMAIN_ID\" = 'Unit' AND @REF.\"STANDARD_CONCEPT\" = 'S' AND (@REF.\"CONCEPT_CODE\") LIKE_REGEXPR '@SEARCH_QUERY' FLAG 'i'",
                        referenceExpression: '@REF."CONCEPT_CODE"',
                        order: 5,
                    },
                    anatomicsiteconceptcode: {
                        name: [
                            {
                                lang: "",
                                value: "Anatomic site concept code",
                            },
                        ],
                        disabledLangName: [
                            {
                                lang: "en",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "de",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "fr",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "es",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "pt",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "zh",
                                value: "",
                                visible: true,
                            },
                        ],
                        type: "text",
                        expression: '@SPEC."ANATOMIC_SITE_CONCEPT_CODE"',
                        referenceFilter:
                            "@REF.\"DOMAIN_ID\" = 'Spec Anatomic Site' AND @REF.\"STANDARD_CONCEPT\" = 'S' AND (@REF.\"CONCEPT_CODE\") LIKE_REGEXPR '@SEARCH_QUERY' FLAG 'i'",
                        referenceExpression: '@REF."CONCEPT_CODE"',
                        order: 12,
                    },
                    diseasestatusconceptcode: {
                        name: [
                            {
                                lang: "",
                                value: "Disease status concept code",
                            },
                        ],
                        disabledLangName: [
                            {
                                lang: "en",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "de",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "fr",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "es",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "pt",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "zh",
                                value: "",
                                visible: true,
                            },
                        ],
                        type: "text",
                        expression: '@SPEC."DISEASE_STATUS_CONCEPT_CODE"',
                        referenceFilter:
                            "@REF.\"DOMAIN_ID\" = 'Spec Disease Status' AND @REF.\"STANDARD_CONCEPT\" = 'S' AND (@REF.\"CONCEPT_CODE\") LIKE_REGEXPR '@SEARCH_QUERY' FLAG 'i'",
                        referenceExpression: '@REF."CONCEPT_CODE"',
                        order: 16,
                    },
                    specimenconceptid: {
                        name: [
                            {
                                lang: "",
                                value: "Specimen concept id",
                            },
                        ],
                        disabledLangName: [
                            {
                                lang: "en",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "de",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "fr",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "es",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "pt",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "zh",
                                value: "",
                                visible: true,
                            },
                        ],
                        type: "text",
                        expression: '@SPEC."SPECIMEN_CONCEPT_ID"',
                        referenceFilter:
                            "@REF.\"DOMAIN_ID\" = 'Specimen' AND @REF.\"STANDARD_CONCEPT\" = 'S' AND (@REF.\"CONCEPT_ID\") LIKE_REGEXPR '@SEARCH_QUERY' FLAG 'i'",
                        referenceExpression: '@REF."CONCEPT_ID"',
                        order: 7,
                    },
                    specimentypeconceptid: {
                        name: [
                            {
                                lang: "",
                                value: "Specimen type concept id",
                            },
                        ],
                        disabledLangName: [
                            {
                                lang: "en",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "de",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "fr",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "es",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "pt",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "zh",
                                value: "",
                                visible: true,
                            },
                        ],
                        type: "text",
                        expression: '@SPEC."SPECIMEN_TYPE_CONCEPT_ID"',
                        referenceFilter:
                            "@REF.\"DOMAIN_ID\" = 'Type Concept' AND @REF.\"CONCEPT_CLASS_ID\" = 'Specimen Type' AND (@REF.\"CONCEPT_ID\") LIKE_REGEXPR '@SEARCH_QUERY' FLAG 'i'",
                        referenceExpression: '@REF."CONCEPT_ID"',
                        order: 18,
                    },
                    anatomicsiteconceptid: {
                        name: [
                            {
                                lang: "",
                                value: "Anatomic site concept id",
                            },
                        ],
                        disabledLangName: [
                            {
                                lang: "en",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "de",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "fr",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "es",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "pt",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "zh",
                                value: "",
                                visible: true,
                            },
                        ],
                        type: "text",
                        expression: '@SPEC."ANATOMIC_SITE_CONCEPT_ID"',
                        referenceFilter:
                            "@REF.\"DOMAIN_ID\" = 'Spec Anatomic Site' AND @REF.\"STANDARD_CONCEPT\" = 'S' AND (@REF.\"CONCEPT_ID\") LIKE_REGEXPR '@SEARCH_QUERY' FLAG 'i'",
                        referenceExpression: '@REF."CONCEPT_ID"',
                        order: 11,
                    },
                    diseasestatusconceptid: {
                        name: [
                            {
                                lang: "",
                                value: "Disease status concept id",
                            },
                        ],
                        disabledLangName: [
                            {
                                lang: "en",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "de",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "fr",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "es",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "pt",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "zh",
                                value: "",
                                visible: true,
                            },
                        ],
                        type: "text",
                        expression: '@SPEC."DISEASE_STATUS_CONCEPT_ID"',
                        referenceFilter:
                            "@REF.\"DOMAIN_ID\" = 'Spec Disease Status' AND @REF.\"STANDARD_CONCEPT\" = 'S' AND (@REF.\"CONCEPT_ID\") LIKE_REGEXPR '@SEARCH_QUERY' FLAG 'i'",
                        referenceExpression: '@REF."CONCEPT_ID"',
                        order: 15,
                    },
                    unitconceptid: {
                        name: [
                            {
                                lang: "",
                                value: "Unit concept id",
                            },
                        ],
                        disabledLangName: [
                            {
                                lang: "en",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "de",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "fr",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "es",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "pt",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "zh",
                                value: "",
                                visible: true,
                            },
                        ],
                        type: "text",
                        expression: '@SPEC."UNIT_CONCEPT_ID"',
                        referenceFilter:
                            "@REF.\"DOMAIN_ID\" = 'Unit' AND @REF.\"STANDARD_CONCEPT\" = 'S' AND (@REF.\"CONCEPT_ID\") LIKE_REGEXPR '@SEARCH_QUERY' FLAG 'i'",
                        referenceExpression: '@REF."CONCEPT_ID"',
                        order: 4,
                    },
                },
            },
            visit: {
                name: [
                    {
                        lang: "",
                        value: "Visit",
                    },
                ],
                disabledLangName: [
                    {
                        lang: "en",
                        value: "",
                        visible: true,
                    },
                    {
                        lang: "de",
                        value: "",
                        visible: true,
                    },
                    {
                        lang: "fr",
                        value: "",
                        visible: true,
                    },
                    {
                        lang: "es",
                        value: "",
                        visible: true,
                    },
                    {
                        lang: "pt",
                        value: "",
                        visible: true,
                    },
                    {
                        lang: "zh",
                        value: "",
                        visible: true,
                    },
                ],
                defaultFilter: "1=1",
                defaultPlaceholder: "@VISIT",
                order: 0,
                parentInteraction: [],
                parentInteractionLabel: "parent",
                attributes: {
                    enddate: {
                        name: [
                            {
                                lang: "",
                                value: "End Date",
                            },
                        ],
                        disabledLangName: [
                            {
                                lang: "en",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "de",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "fr",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "es",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "pt",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "zh",
                                value: "",
                                visible: true,
                            },
                        ],
                        type: "time",
                        expression: '@VISIT."VISIT_END_DATE"',
                        order: 8,
                    },
                    startdate: {
                        name: [
                            {
                                lang: "",
                                value: "Start Date",
                            },
                        ],
                        disabledLangName: [
                            {
                                lang: "en",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "de",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "fr",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "es",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "pt",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "zh",
                                value: "",
                                visible: true,
                            },
                        ],
                        type: "time",
                        expression: '@VISIT."VISIT_START_DATE"',
                        order: 7,
                    },
                    pid: {
                        name: [
                            {
                                lang: "",
                                value: "Patient Id",
                            },
                        ],
                        disabledLangName: [
                            {
                                lang: "en",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "de",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "fr",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "es",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "pt",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "zh",
                                value: "",
                                visible: true,
                            },
                        ],
                        type: "text",
                        expression: 'CAST (@VISIT."PATIENT_ID" AS VARCHAR)',
                        order: 6,
                    },
                    visittype: {
                        name: [
                            {
                                lang: "",
                                value: "Visit type",
                            },
                        ],
                        disabledLangName: [
                            {
                                lang: "en",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "de",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "fr",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "es",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "pt",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "zh",
                                value: "",
                                visible: true,
                            },
                        ],
                        type: "text",
                        expression: '@VISIT."VISIT_TYPE_NAME"',
                        referenceFilter:
                            "@REF.\"DOMAIN_ID\" = 'Type Concept' AND @REF.\"CONCEPT_CLASS_ID\" = 'Visit Type' AND (@REF.\"CONCEPT_NAME\") LIKE_REGEXPR '@SEARCH_QUERY' FLAG 'i'",
                        referenceExpression: '@REF."CONCEPT_NAME"',
                        order: 4,
                    },
                    visitname: {
                        name: [
                            {
                                lang: "",
                                value: "Visit name",
                            },
                        ],
                        disabledLangName: [
                            {
                                lang: "en",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "de",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "fr",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "es",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "pt",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "zh",
                                value: "",
                                visible: true,
                            },
                        ],
                        type: "text",
                        expression: '@VISIT."VISIT_NAME"',
                        referenceFilter:
                            "@REF.\"DOMAIN_ID\" = 'Visit' AND @REF.\"STANDARD_CONCEPT\" = 'S' AND (@REF.\"CONCEPT_NAME\") LIKE_REGEXPR '@SEARCH_QUERY' FLAG 'i'",
                        referenceExpression: '@REF."CONCEPT_NAME"',
                        order: 3,
                    },
                    visitid: {
                        name: [
                            {
                                lang: "",
                                value: "Visit occurrence Id",
                            },
                        ],
                        disabledLangName: [
                            {
                                lang: "en",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "de",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "fr",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "es",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "pt",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "zh",
                                value: "",
                                visible: true,
                            },
                        ],
                        type: "text",
                        expression: '@VISIT."VISIT_OCCURRENCE_ID"',
                        order: 0,
                    },
                    visitconceptcode: {
                        name: [
                            {
                                lang: "",
                                value: "Visit concept code",
                            },
                        ],
                        disabledLangName: [
                            {
                                lang: "en",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "de",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "fr",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "es",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "pt",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "zh",
                                value: "",
                                visible: true,
                            },
                        ],
                        type: "text",
                        expression: '@VISIT."VISIT_CONCEPT_CODE"',
                        referenceFilter:
                            "@REF.\"DOMAIN_ID\" = 'Visit' AND @REF.\"STANDARD_CONCEPT\" = 'S' AND (@REF.\"CONCEPT_CODE\") LIKE_REGEXPR '@SEARCH_QUERY' FLAG 'i'",
                        referenceExpression: '@REF."CONCEPT_CODE"',
                        order: 2,
                    },
                    visittypeconceptcode: {
                        name: [
                            {
                                lang: "",
                                value: "Visit type concept code",
                            },
                        ],
                        disabledLangName: [
                            {
                                lang: "en",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "de",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "fr",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "es",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "pt",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "zh",
                                value: "",
                                visible: true,
                            },
                        ],
                        type: "text",
                        expression: '@VISIT."VISIT_TYPE_CONCEPT_CODE"',
                        referenceFilter:
                            "@REF.\"DOMAIN_ID\" = 'Type Concept' AND @REF.\"CONCEPT_CLASS_ID\" = 'Visit Type' AND (@REF.\"CONCEPT_CODE\") LIKE_REGEXPR '@SEARCH_QUERY' FLAG 'i'",
                        referenceExpression: '@REF."CONCEPT_CODE"',
                        order: 5,
                    },
                    visitconceptid: {
                        name: [
                            {
                                lang: "",
                                value: "Visit concept Id",
                            },
                        ],
                        disabledLangName: [
                            {
                                lang: "en",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "de",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "fr",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "es",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "pt",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "zh",
                                value: "",
                                visible: true,
                            },
                        ],
                        type: "text",
                        expression: '@VISIT."VISIT_CONCEPT_ID"',
                        referenceFilter:
                            "@REF.\"DOMAIN_ID\" = 'Visit' AND @REF.\"STANDARD_CONCEPT\" = 'S' AND (@REF.\"CONCEPT_ID\") LIKE_REGEXPR '@SEARCH_QUERY' FLAG 'i'",
                        referenceExpression: '@REF."CONCEPT_ID"',
                        order: 1,
                    },
                },
            },
            Consent_74db26d2_bb75_489a_a841_051c85dc897b: {
                name: [
                    {
                        lang: "",
                        value: "Consent",
                    },
                    {
                        lang: "en",
                        value: "Consent",
                        visible: true,
                    },
                ],
                disabledLangName: [
                    {
                        lang: "de",
                        value: "",
                        visible: true,
                    },
                    {
                        lang: "fr",
                        value: "",
                        visible: true,
                    },
                    {
                        lang: "es",
                        value: "",
                        visible: true,
                    },
                    {
                        lang: "pt",
                        value: "",
                        visible: true,
                    },
                    {
                        lang: "zh",
                        value: "",
                        visible: true,
                    },
                ],
                defaultFilter: "1=1",
                defaultPlaceholder: "@CONSENT",
                order: 8,
                parentInteraction: [
                    "patient.interactions.Consent_74db26d2_bb75_489a_a841_051c85dc897b",
                ],
                parentInteractionLabel: "parent",
                attributes: {
                    consentdatetime: {
                        name: [
                            {
                                lang: "",
                                value: "Consent Date/Time",
                            },
                        ],
                        disabledLangName: [
                            {
                                lang: "en",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "de",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "fr",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "es",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "pt",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "zh",
                                value: "",
                                visible: true,
                            },
                        ],
                        type: "datetime",
                        expression: '@CONSENT."CREATED_AT"',
                        order: 8,
                    },
                    pid: {
                        name: [
                            {
                                lang: "",
                                value: "Patient Id",
                            },
                            {
                                lang: "en",
                                value: "Patient Id",
                                visible: true,
                            },
                        ],
                        disabledLangName: [
                            {
                                lang: "de",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "fr",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "es",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "pt",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "zh",
                                value: "",
                                visible: true,
                            },
                        ],
                        type: "text",
                        expression: 'CAST (@CONSENT."PERSON_ID" AS VARCHAR)',
                        order: 7,
                    },
                    parentconsentdetailid: {
                        name: [
                            {
                                lang: "",
                                value: "Parent Consent Detail Id",
                            },
                            {
                                lang: "en",
                                value: "Parent Consent Detail Id",
                                visible: true,
                            },
                        ],
                        disabledLangName: [
                            {
                                lang: "de",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "fr",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "es",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "pt",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "zh",
                                value: "",
                                visible: true,
                            },
                        ],
                        type: "text",
                        expression: '@CONSENT."PARENT_CONSENT_DETAIL_ID"',
                        order: 5,
                    },
                    status: {
                        name: [
                            {
                                lang: "",
                                value: "Status",
                            },
                            {
                                lang: "en",
                                value: "Status",
                                visible: true,
                            },
                        ],
                        disabledLangName: [
                            {
                                lang: "de",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "fr",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "es",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "pt",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "zh",
                                value: "",
                                visible: true,
                            },
                        ],
                        type: "text",
                        expression: '@CONSENT."STATUS"',
                        order: 4,
                    },
                    textval: {
                        name: [
                            {
                                lang: "",
                                value: "Value",
                            },
                            {
                                lang: "en",
                                value: "Value",
                                visible: true,
                            },
                        ],
                        disabledLangName: [
                            {
                                lang: "de",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "fr",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "es",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "pt",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "zh",
                                value: "",
                                visible: true,
                            },
                        ],
                        type: "text",
                        expression: '@CONSENT."VALUE"',
                        order: 3,
                    },
                    consentcategory: {
                        name: [
                            {
                                lang: "",
                                value: "Category",
                            },
                            {
                                lang: "en",
                                value: "Category",
                                visible: true,
                            },
                        ],
                        disabledLangName: [
                            {
                                lang: "de",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "fr",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "es",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "pt",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "zh",
                                value: "",
                                visible: true,
                            },
                        ],
                        type: "text",
                        expression: '@CONSENT."TYPE"',
                        order: 2,
                    },
                    New_Attribute_1_3d0da2a3_f0de_4112_b87c_e7aff266c0d8: {
                        name: [
                            {
                                lang: "",
                                value: "Attribute",
                            },
                            {
                                lang: "en",
                                value: "Attribute",
                                visible: true,
                            },
                        ],
                        disabledLangName: [
                            {
                                lang: "de",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "fr",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "es",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "pt",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "zh",
                                value: "",
                                visible: true,
                            },
                        ],
                        type: "text",
                        expression: '@CONSENT."ATTRIBUTE"',
                        order: 0,
                    },
                    Attribute_copy_53f290b7_70e9_4c1e_bd6d_605bc916ce66: {
                        name: [
                            {
                                lang: "",
                                value: "Attribute Group Id",
                            },
                            {
                                lang: "en",
                                value: "Attribute Group ID",
                                visible: true,
                            },
                        ],
                        disabledLangName: [
                            {
                                lang: "de",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "fr",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "es",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "pt",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "zh",
                                value: "",
                                visible: true,
                            },
                        ],
                        type: "text",
                        expression: '@CONSENT."ATTRIBUTE_GROUP_ID"',
                        order: 1,
                    },
                    Consent_Id_copy_60a4adeb_1e84_4f04_b7d5_8eb1c006f56d: {
                        name: [
                            {
                                lang: "",
                                value: "Consent Detail Id",
                            },
                            {
                                lang: "en",
                                value: "Consent Detail Id",
                                visible: true,
                            },
                        ],
                        disabledLangName: [
                            {
                                lang: "de",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "fr",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "es",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "pt",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "zh",
                                value: "",
                                visible: true,
                            },
                        ],
                        type: "text",
                        expression: '@CONSENT."CONSENT_DETAIL_ID"',
                        order: 6,
                    },
                },
            },
            questionnaire: {
                name: [
                    {
                        lang: "",
                        value: "Questionnaire",
                    },
                    {
                        lang: "en",
                        value: "Questionnaire",
                        visible: true,
                    },
                ],
                disabledLangName: [
                    {
                        lang: "de",
                        value: "",
                        visible: true,
                    },
                    {
                        lang: "fr",
                        value: "",
                        visible: true,
                    },
                    {
                        lang: "es",
                        value: "",
                        visible: true,
                    },
                    {
                        lang: "pt",
                        value: "",
                        visible: true,
                    },
                    {
                        lang: "zh",
                        value: "",
                        visible: true,
                    },
                ],
                defaultPlaceholder: "@RESPONSE",
                order: 1,
                parentInteraction: [],
                parentInteractionLabel: "parent",
                attributes: {
                    linkID: {
                        name: [
                            {
                                lang: "",
                                value: "Link ID",
                            },
                        ],
                        disabledLangName: [
                            {
                                lang: "en",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "de",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "fr",
                                value: "",
                            },
                            {
                                lang: "es",
                                value: "",
                            },
                            {
                                lang: "pt",
                                value: "",
                            },
                            {
                                lang: "zh",
                                value: "",
                            },
                        ],
                        type: "text",
                        expression: '@RESPONSE."LINK_ID"',
                        order: 0,
                    },
                    valueCodingValue: {
                        name: [
                            {
                                lang: "",
                                value: "Value coding value",
                            },
                        ],
                        disabledLangName: [
                            {
                                lang: "en",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "de",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "fr",
                                value: "",
                            },
                            {
                                lang: "es",
                                value: "",
                            },
                            {
                                lang: "pt",
                                value: "",
                            },
                            {
                                lang: "zh",
                                value: "",
                            },
                        ],
                        type: "text",
                        expression: '@RESPONSE."VALUECODING_CODE"',
                        order: 1,
                    },
                    recordID: {
                        name: [
                            {
                                lang: "",
                                value: "Record ID",
                            },
                        ],
                        disabledLangName: [
                            {
                                lang: "en",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "de",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "fr",
                                value: "",
                            },
                            {
                                lang: "es",
                                value: "",
                            },
                            {
                                lang: "pt",
                                value: "",
                            },
                            {
                                lang: "zh",
                                value: "",
                            },
                        ],
                        type: "text",
                        expression: '@RESPONSE."ID"',
                        order: 4,
                    },
                    questionnaireLanguage: {
                        name: [
                            {
                                lang: "",
                                value: "Questionnaire language",
                            },
                        ],
                        disabledLangName: [
                            {
                                lang: "en",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "de",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "fr",
                                value: "",
                            },
                            {
                                lang: "es",
                                value: "",
                            },
                            {
                                lang: "pt",
                                value: "",
                            },
                            {
                                lang: "zh",
                                value: "",
                            },
                        ],
                        type: "text",
                        expression: '@RESPONSE."LANGUAGE"',
                        order: 5,
                    },
                    questionnaireStatus: {
                        name: [
                            {
                                lang: "",
                                value: "Questionnaire status",
                            },
                        ],
                        disabledLangName: [
                            {
                                lang: "en",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "de",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "fr",
                                value: "",
                            },
                            {
                                lang: "es",
                                value: "",
                            },
                            {
                                lang: "pt",
                                value: "",
                            },
                            {
                                lang: "zh",
                                value: "",
                            },
                        ],
                        type: "text",
                        expression: '@RESPONSE."STATUS"',
                        order: 6,
                    },
                    questionnaireAuthored: {
                        name: [
                            {
                                lang: "",
                                value: "Questionnaire authored",
                            },
                        ],
                        disabledLangName: [
                            {
                                lang: "en",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "de",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "fr",
                                value: "",
                            },
                            {
                                lang: "es",
                                value: "",
                            },
                            {
                                lang: "pt",
                                value: "",
                            },
                            {
                                lang: "zh",
                                value: "",
                            },
                        ],
                        type: "text",
                        expression: '@RESPONSE."AUTHORED"',
                        order: 7,
                    },
                    text: {
                        name: [
                            {
                                lang: "",
                                value: "Text",
                            },
                        ],
                        disabledLangName: [
                            {
                                lang: "en",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "de",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "fr",
                                value: "",
                            },
                            {
                                lang: "es",
                                value: "",
                            },
                            {
                                lang: "pt",
                                value: "",
                            },
                            {
                                lang: "zh",
                                value: "",
                            },
                        ],
                        type: "text",
                        expression: '@RESPONSE."TEXT"',
                        order: 8,
                    },
                    valueType: {
                        name: [
                            {
                                lang: "",
                                value: "Value type",
                            },
                        ],
                        disabledLangName: [
                            {
                                lang: "en",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "de",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "fr",
                                value: "",
                            },
                            {
                                lang: "es",
                                value: "",
                            },
                            {
                                lang: "pt",
                                value: "",
                            },
                            {
                                lang: "zh",
                                value: "",
                            },
                        ],
                        type: "text",
                        expression: '@RESPONSE."VALUE_TYPE"',
                        order: 2,
                    },
                    value: {
                        name: [
                            {
                                lang: "",
                                value: "Value",
                            },
                        ],
                        disabledLangName: [
                            {
                                lang: "en",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "de",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "fr",
                                value: "",
                            },
                            {
                                lang: "es",
                                value: "",
                            },
                            {
                                lang: "pt",
                                value: "",
                            },
                            {
                                lang: "zh",
                                value: "",
                            },
                        ],
                        type: "text",
                        expression: '@RESPONSE."VALUE"',
                        order: 3,
                    },
                    questionnaireReference: {
                        name: [
                            {
                                lang: "",
                                value: "Questionnaire reference",
                            },
                        ],
                        disabledLangName: [
                            {
                                lang: "en",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "de",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "fr",
                                value: "",
                            },
                            {
                                lang: "es",
                                value: "",
                            },
                            {
                                lang: "pt",
                                value: "",
                            },
                            {
                                lang: "zh",
                                value: "",
                            },
                        ],
                        type: "text",
                        expression: '@RESPONSE."QUESTIONNAIRE_REFERENCE"',
                        order: 9,
                    },
                    questionnaireVersion: {
                        name: [
                            {
                                lang: "",
                                value: "Questionnaire version",
                            },
                        ],
                        disabledLangName: [
                            {
                                lang: "en",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "de",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "fr",
                                value: "",
                            },
                            {
                                lang: "es",
                                value: "",
                            },
                            {
                                lang: "pt",
                                value: "",
                            },
                            {
                                lang: "zh",
                                value: "",
                            },
                        ],
                        type: "text",
                        expression: '@RESPONSE."QUESTIONNAIRE_VERSION"',
                        order: 10,
                    },
                    extensionEffectiveDateUrl: {
                        name: [
                            {
                                lang: "",
                                value: "Questionaire extension effective date url",
                            },
                        ],
                        disabledLangName: [
                            {
                                lang: "en",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "de",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "fr",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "es",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "pt",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "zh",
                                value: "",
                                visible: true,
                            },
                        ],
                        type: "text",
                        expression: '@RESPONSE."EXTENSION_EFFECTIVE_DATE_URL"',
                        order: 11,
                    },
                    extensionValuedate: {
                        name: [
                            {
                                lang: "",
                                value: "Questionaire extension valuedate",
                            },
                        ],
                        disabledLangName: [
                            {
                                lang: "en",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "de",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "fr",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "es",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "pt",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "zh",
                                value: "",
                                visible: true,
                            },
                        ],
                        type: "text",
                        expression: '@RESPONSE."EXTENSION_VALUEDATE"',
                        order: 12,
                    },
                },
            },
            ptoken: {
                name: [
                    {
                        lang: "",
                        value: "Participation Token",
                    },
                ],
                disabledLangName: [
                    {
                        lang: "en",
                        value: "",
                        visible: true,
                    },
                    {
                        lang: "de",
                        value: "",
                        visible: true,
                    },
                    {
                        lang: "fr",
                        value: "",
                        visible: true,
                    },
                    {
                        lang: "es",
                        value: "",
                        visible: true,
                    },
                    {
                        lang: "pt",
                        value: "",
                        visible: true,
                    },
                    {
                        lang: "zh",
                        value: "",
                        visible: true,
                    },
                ],
                defaultPlaceholder: "@PTOKEN",
                order: 16,
                parentInteraction: [],
                parentInteractionLabel: "parent",
                attributes: {
                    participationtokenid: {
                        name: [
                            {
                                lang: "",
                                value: "Participation Token Id",
                            },
                        ],
                        disabledLangName: [
                            {
                                lang: "en",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "de",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "fr",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "es",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "pt",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "zh",
                                value: "",
                                visible: true,
                            },
                        ],
                        type: "text",
                        expression: '@PTOKEN."ID"',
                        order: 0,
                    },
                    participationtokenstudyid: {
                        name: [
                            {
                                lang: "",
                                value: "Participation Token Study Id",
                            },
                        ],
                        disabledLangName: [
                            {
                                lang: "en",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "de",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "fr",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "es",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "pt",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "zh",
                                value: "",
                                visible: true,
                            },
                        ],
                        type: "text",
                        expression: '@PTOKEN."STUDY_ID"',
                        order: 1,
                    },
                    participationtokenexternalid: {
                        name: [
                            {
                                lang: "",
                                value: "Participation Token External Id",
                            },
                        ],
                        disabledLangName: [
                            {
                                lang: "en",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "de",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "fr",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "es",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "pt",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "zh",
                                value: "",
                                visible: true,
                            },
                        ],
                        type: "text",
                        expression: '@PTOKEN."EXTERNAL_ID"',
                        order: 2,
                    },
                    participationtoken: {
                        name: [
                            {
                                lang: "",
                                value: "Participation Token",
                            },
                        ],
                        disabledLangName: [
                            {
                                lang: "en",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "de",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "fr",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "es",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "pt",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "zh",
                                value: "",
                                visible: true,
                            },
                        ],
                        type: "text",
                        expression: '@PTOKEN."TOKEN"',
                        order: 3,
                    },
                    participationtokencreatedby: {
                        name: [
                            {
                                lang: "",
                                value: "Participant Token Created By",
                            },
                        ],
                        disabledLangName: [
                            {
                                lang: "en",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "de",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "fr",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "es",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "pt",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "zh",
                                value: "",
                                visible: true,
                            },
                        ],
                        type: "text",
                        expression: '@PTOKEN."CREATED_BY"',
                        order: 4,
                    },
                    participanttokencreateddate: {
                        name: [
                            {
                                lang: "",
                                value: "Participant Token Created Date",
                            },
                        ],
                        disabledLangName: [
                            {
                                lang: "en",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "de",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "fr",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "es",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "pt",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "zh",
                                value: "",
                                visible: true,
                            },
                        ],
                        type: "datetime",
                        expression: '@PTOKEN."CREATED_DATE"',
                        order: 5,
                    },
                    participationtokenmodifiedby: {
                        name: [
                            {
                                lang: "",
                                value: "Participation Token Modified By",
                            },
                        ],
                        disabledLangName: [
                            {
                                lang: "en",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "de",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "fr",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "es",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "pt",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "zh",
                                value: "",
                                visible: true,
                            },
                        ],
                        type: "text",
                        expression: '@PTOKEN."MODIFIED_BY"',
                        order: 6,
                    },
                    participationtokenmodifieddate: {
                        name: [
                            {
                                lang: "",
                                value: "Participation Token Modified Date",
                            },
                        ],
                        disabledLangName: [
                            {
                                lang: "en",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "de",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "fr",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "es",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "pt",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "zh",
                                value: "",
                                visible: true,
                            },
                        ],
                        type: "datetime",
                        expression: '@PTOKEN."MODIFIED_DATE"',
                        order: 7,
                    },
                    participationtokenstatus: {
                        name: [
                            {
                                lang: "",
                                value: "Participation Token Status",
                            },
                        ],
                        disabledLangName: [
                            {
                                lang: "en",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "de",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "fr",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "es",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "pt",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "zh",
                                value: "",
                                visible: true,
                            },
                        ],
                        type: "text",
                        expression: '@PTOKEN."STATUS"',
                        order: 8,
                    },
                    participationtokenlastdonationdate: {
                        name: [
                            {
                                lang: "",
                                value: "Participation Token Last Donation Date",
                            },
                        ],
                        disabledLangName: [
                            {
                                lang: "en",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "de",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "fr",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "es",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "pt",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "zh",
                                value: "",
                                visible: true,
                            },
                        ],
                        type: "datetime",
                        expression: '@PTOKEN."LAST_DONATION_DATE"',
                        order: 9,
                    },
                    participationtokenvalidationdate: {
                        name: [
                            {
                                lang: "",
                                value: "Participation Token Validation Date",
                            },
                        ],
                        disabledLangName: [
                            {
                                lang: "en",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "de",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "fr",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "es",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "pt",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "zh",
                                value: "",
                                visible: true,
                            },
                        ],
                        type: "datetime",
                        expression: '@PTOKEN."VALIDATION_DATE"',
                        order: 10,
                    },
                    participationtokenpersonid: {
                        name: [
                            {
                                lang: "",
                                value: "Participation Token Person Id",
                            },
                        ],
                        disabledLangName: [
                            {
                                lang: "en",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "de",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "fr",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "es",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "pt",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "zh",
                                value: "",
                                visible: true,
                            },
                        ],
                        type: "text",
                        expression: '@PTOKEN."PERSON_ID"',
                        order: 11,
                    },
                },
            },
        },
        attributes: {
            pid: {
                name: [
                    {
                        lang: "",
                        value: "Patient ID",
                    },
                    {
                        lang: "en",
                        value: "Patient ID",
                    },
                    {
                        lang: "de",
                        value: "Patienten-ID",
                    },
                    {
                        lang: "fr",
                        value: "ID du patient",
                    },
                    {
                        lang: "es",
                        value: "ID de paciente",
                    },
                    {
                        lang: "pt",
                        value: "ID do paciente",
                    },
                    {
                        lang: "zh",
                        value: "病患标识",
                    },
                ],
                disabledLangName: [],
                type: "text",
                expression: 'CAST (@PATIENT."PATIENT_ID" AS VARCHAR)',
                order: 14,
                annotations: ["patient_id"],
            },
            pcount: {
                name: [
                    {
                        lang: "",
                        value: "Patient Count",
                    },
                    {
                        lang: "en",
                        value: "Patient Count",
                    },
                    {
                        lang: "de",
                        value: "Patientenanzahl",
                    },
                    {
                        lang: "fr",
                        value: "Nombre de patients",
                    },
                    {
                        lang: "es",
                        value: "Número de pacientes",
                    },
                    {
                        lang: "pt",
                        value: "Número de pacientes",
                    },
                    {
                        lang: "zh",
                        value: "病患计数",
                    },
                ],
                disabledLangName: [],
                type: "num",
                measureExpression: 'COUNT(DISTINCT(@PATIENT."PATIENT_ID"))',
                order: 15,
            },
            monthOfBirth: {
                name: [
                    {
                        lang: "",
                        value: "Month of Birth",
                    },
                    {
                        lang: "en",
                        value: "Month of Birth",
                    },
                    {
                        lang: "de",
                        value: "Geburtsmonat",
                    },
                    {
                        lang: "fr",
                        value: "Mois de naissance",
                    },
                    {
                        lang: "es",
                        value: "Mes de nacimiento",
                    },
                    {
                        lang: "pt",
                        value: "Mês de nascimento",
                    },
                    {
                        lang: "zh",
                        value: "出生月份",
                    },
                ],
                disabledLangName: [],
                type: "num",
                expression: '@PATIENT."MONTH_OF_BIRTH"',
                order: 16,
            },
            yearOfBirth: {
                name: [
                    {
                        lang: "",
                        value: "Year of Birth",
                    },
                    {
                        lang: "en",
                        value: "Year of Birth",
                    },
                    {
                        lang: "de",
                        value: "Geburtsjahr",
                    },
                    {
                        lang: "fr",
                        value: "Année de naissance",
                    },
                    {
                        lang: "es",
                        value: "Año de nacimiento",
                    },
                    {
                        lang: "pt",
                        value: "Ano de nascimento",
                    },
                    {
                        lang: "zh",
                        value: "出生年",
                    },
                ],
                disabledLangName: [],
                type: "num",
                expression: '@PATIENT."YEAR_OF_BIRTH"',
                order: 17,
            },
            dateOfBirth: {
                name: [
                    {
                        lang: "",
                        value: "Date of Birth",
                    },
                    {
                        lang: "en",
                        value: "Date of Birth",
                    },
                    {
                        lang: "de",
                        value: "Geburtsdatum",
                    },
                    {
                        lang: "fr",
                        value: "Date de naissance",
                    },
                    {
                        lang: "es",
                        value: "Fecha de nacimiento",
                    },
                    {
                        lang: "pt",
                        value: "Data de nascimento",
                    },
                    {
                        lang: "zh",
                        value: "出生日期",
                    },
                ],
                disabledLangName: [],
                type: "datetime",
                expression: '@PATIENT."BIRTH_DATE"',
                order: 18,
                annotations: ["date_of_birth"],
            },
            dateOfDeath: {
                name: [
                    {
                        lang: "",
                        value: "Date of Death",
                    },
                    {
                        lang: "en",
                        value: "Date of Death",
                    },
                    {
                        lang: "de",
                        value: "Todesdatum",
                    },
                    {
                        lang: "fr",
                        value: "Date du décès",
                    },
                    {
                        lang: "es",
                        value: "Fecha de fallecimiento",
                    },
                    {
                        lang: "pt",
                        value: "Data do óbito",
                    },
                    {
                        lang: "zh",
                        value: "死亡日期",
                    },
                ],
                disabledLangName: [],
                type: "datetime",
                expression: '@PATIENT."DEATH_DATE"',
                order: 19,
                annotations: ["date_of_death"],
            },
            Race: {
                name: [
                    {
                        lang: "",
                        value: "Race",
                    },
                ],
                disabledLangName: [
                    {
                        lang: "en",
                        value: "",
                        visible: true,
                    },
                    {
                        lang: "de",
                        value: "",
                        visible: true,
                    },
                    {
                        lang: "fr",
                        value: "",
                        visible: true,
                    },
                    {
                        lang: "es",
                        value: "",
                        visible: true,
                    },
                    {
                        lang: "pt",
                        value: "",
                        visible: true,
                    },
                    {
                        lang: "zh",
                        value: "",
                        visible: true,
                    },
                ],
                type: "text",
                expression: '@PATIENT."RACE"',
                referenceFilter:
                    "@REF.\"DOMAIN_ID\" = 'Race' AND @REF.\"STANDARD_CONCEPT\" = 'S' AND (@REF.\"CONCEPT_NAME\") LIKE_REGEXPR '@SEARCH_QUERY' FLAG 'i'",
                referenceExpression: '@REF."CONCEPT_NAME"',
                order: 11,
            },
            Gender: {
                name: [
                    {
                        lang: "",
                        value: "Gender",
                    },
                ],
                disabledLangName: [
                    {
                        lang: "en",
                        value: "",
                        visible: true,
                    },
                    {
                        lang: "de",
                        value: "",
                        visible: true,
                    },
                    {
                        lang: "fr",
                        value: "",
                        visible: true,
                    },
                    {
                        lang: "es",
                        value: "",
                        visible: true,
                    },
                    {
                        lang: "pt",
                        value: "",
                        visible: true,
                    },
                    {
                        lang: "zh",
                        value: "",
                        visible: true,
                    },
                ],
                type: "text",
                expression: '@PATIENT."GENDER"',
                referenceFilter:
                    "@REF.\"DOMAIN_ID\" = 'Gender' AND @REF.\"STANDARD_CONCEPT\" = 'S' AND (@REF.\"CONCEPT_NAME\") LIKE_REGEXPR '@SEARCH_QUERY' FLAG 'i'",
                referenceExpression: '@REF."CONCEPT_NAME"',
                order: 8,
            },
            Ethnicity: {
                name: [
                    {
                        lang: "",
                        value: "Ethnicity",
                    },
                ],
                disabledLangName: [
                    {
                        lang: "en",
                        value: "",
                        visible: true,
                    },
                    {
                        lang: "de",
                        value: "",
                        visible: true,
                    },
                    {
                        lang: "fr",
                        value: "",
                        visible: true,
                    },
                    {
                        lang: "es",
                        value: "",
                        visible: true,
                    },
                    {
                        lang: "pt",
                        value: "",
                        visible: true,
                    },
                    {
                        lang: "zh",
                        value: "",
                        visible: true,
                    },
                ],
                type: "text",
                expression: '@PATIENT."ETHNICITY"',
                referenceFilter:
                    "@REF.\"DOMAIN_ID\" = 'Ethnicity' AND @REF.\"STANDARD_CONCEPT\" = 'S' AND (@REF.\"CONCEPT_NAME\") LIKE_REGEXPR '@SEARCH_QUERY' FLAG 'i'",
                referenceExpression: '@REF."CONCEPT_NAME"',
                order: 5,
            },
            State: {
                name: [
                    {
                        lang: "",
                        value: "State",
                    },
                ],
                disabledLangName: [
                    {
                        lang: "en",
                        value: "",
                        visible: true,
                    },
                    {
                        lang: "de",
                        value: "",
                        visible: true,
                    },
                    {
                        lang: "fr",
                        value: "",
                        visible: true,
                    },
                    {
                        lang: "es",
                        value: "",
                        visible: true,
                    },
                    {
                        lang: "pt",
                        value: "",
                        visible: true,
                    },
                    {
                        lang: "zh",
                        value: "",
                        visible: true,
                    },
                ],
                type: "text",
                expression: '@PATIENT."STATE"',
                order: 4,
            },
            County: {
                name: [
                    {
                        lang: "",
                        value: "County",
                    },
                ],
                disabledLangName: [
                    {
                        lang: "de",
                        value: "",
                        visible: true,
                    },
                    {
                        lang: "fr",
                        value: "",
                        visible: true,
                    },
                    {
                        lang: "es",
                        value: "",
                        visible: true,
                    },
                    {
                        lang: "pt",
                        value: "",
                        visible: true,
                    },
                    {
                        lang: "zh",
                        value: "",
                        visible: true,
                    },
                    {
                        lang: "en",
                        value: "",
                    },
                ],
                type: "text",
                expression: '@PATIENT."COUNTY"',
                order: 3,
            },
            genderconceptcode: {
                name: [
                    {
                        lang: "",
                        value: "Gender concept code",
                    },
                ],
                disabledLangName: [
                    {
                        lang: "en",
                        value: "",
                        visible: true,
                    },
                    {
                        lang: "de",
                        value: "",
                        visible: true,
                    },
                    {
                        lang: "fr",
                        value: "",
                        visible: true,
                    },
                    {
                        lang: "es",
                        value: "",
                        visible: true,
                    },
                    {
                        lang: "pt",
                        value: "",
                        visible: true,
                    },
                    {
                        lang: "zh",
                        value: "",
                        visible: true,
                    },
                ],
                type: "text",
                expression: '@PATIENT."GENDER_CONCEPT_CODE"',
                referenceFilter:
                    "@REF.\"DOMAIN_ID\" = 'Gender' AND @REF.\"STANDARD_CONCEPT\" = 'S' AND (@REF.\"CONCEPT_CODE\") LIKE_REGEXPR '@SEARCH_QUERY' FLAG 'i'",
                referenceExpression: '@REF."CONCEPT_CODE"',
                order: 9,
            },
            raceconceptcode: {
                name: [
                    {
                        lang: "",
                        value: "Race concept code",
                    },
                ],
                disabledLangName: [
                    {
                        lang: "en",
                        value: "",
                        visible: true,
                    },
                    {
                        lang: "de",
                        value: "",
                        visible: true,
                    },
                    {
                        lang: "fr",
                        value: "",
                        visible: true,
                    },
                    {
                        lang: "es",
                        value: "",
                        visible: true,
                    },
                    {
                        lang: "pt",
                        value: "",
                        visible: true,
                    },
                    {
                        lang: "zh",
                        value: "",
                        visible: true,
                    },
                ],
                type: "text",
                expression: '@PATIENT."RACE_CONCEPT_CODE"',
                referenceFilter:
                    "@REF.\"DOMAIN_ID\" = 'Race' AND @REF.\"STANDARD_CONCEPT\" = 'S' AND (@REF.\"CONCEPT_CODE\") LIKE_REGEXPR '@SEARCH_QUERY' FLAG 'i'",
                referenceExpression: '@REF."CONCEPT_CODE"',
                order: 12,
            },
            ethnicityconceptcode: {
                name: [
                    {
                        lang: "",
                        value: "Ethnicity concept code",
                    },
                ],
                disabledLangName: [
                    {
                        lang: "en",
                        value: "",
                        visible: true,
                    },
                    {
                        lang: "de",
                        value: "",
                        visible: true,
                    },
                    {
                        lang: "fr",
                        value: "",
                        visible: true,
                    },
                    {
                        lang: "es",
                        value: "",
                        visible: true,
                    },
                    {
                        lang: "pt",
                        value: "",
                        visible: true,
                    },
                    {
                        lang: "zh",
                        value: "",
                        visible: true,
                    },
                ],
                type: "text",
                expression: '@PATIENT."ETHNICITY_CONCEPT_CODE"',
                referenceFilter:
                    "@REF.\"DOMAIN_ID\" = 'Ethnicity' AND @REF.\"STANDARD_CONCEPT\" = 'S' AND (@REF.\"CONCEPT_CODE\") LIKE_REGEXPR '@SEARCH_QUERY' FLAG 'i'",
                referenceExpression: '@REF."CONCEPT_CODE"',
                order: 6,
            },
            lastAuthoredDate: {
                name: [
                    {
                        lang: "",
                        value: "Last authored date",
                    },
                ],
                disabledLangName: [
                    {
                        lang: "en",
                        value: "",
                        visible: true,
                    },
                    {
                        lang: "de",
                        value: "",
                        visible: true,
                    },
                    {
                        lang: "fr",
                        value: "",
                        visible: true,
                    },
                    {
                        lang: "es",
                        value: "",
                        visible: true,
                    },
                    {
                        lang: "pt",
                        value: "",
                        visible: true,
                    },
                    {
                        lang: "zh",
                        value: "",
                        visible: true,
                    },
                ],
                type: "text",
                expression: '@PATIENT."LAST_DONATION_DATETIME"',
                order: 7,
            },
            genderconceptid: {
                name: [
                    {
                        lang: "",
                        value: "Gender concept id",
                    },
                ],
                disabledLangName: [
                    {
                        lang: "en",
                        value: "",
                        visible: true,
                    },
                    {
                        lang: "de",
                        value: "",
                        visible: true,
                    },
                    {
                        lang: "fr",
                        value: "",
                        visible: true,
                    },
                    {
                        lang: "es",
                        value: "",
                        visible: true,
                    },
                    {
                        lang: "pt",
                        value: "",
                        visible: true,
                    },
                    {
                        lang: "zh",
                        value: "",
                        visible: true,
                    },
                ],
                type: "text",
                expression: '@PATIENT."GENDER_CONCEPT_ID"',
                referenceFilter:
                    "@REF.\"DOMAIN_ID\" = 'Gender' AND @REF.\"STANDARD_CONCEPT\" = 'S' AND (@REF.\"CONCEPT_ID\") LIKE_REGEXPR '@SEARCH_QUERY' FLAG 'i'",
                referenceExpression: '@REF."CONCEPT_ID"',
                order: 10,
            },
            raceconceptid: {
                name: [
                    {
                        lang: "",
                        value: "Race concept id",
                    },
                ],
                disabledLangName: [
                    {
                        lang: "en",
                        value: "",
                        visible: true,
                    },
                    {
                        lang: "de",
                        value: "",
                        visible: true,
                    },
                    {
                        lang: "fr",
                        value: "",
                        visible: true,
                    },
                    {
                        lang: "es",
                        value: "",
                        visible: true,
                    },
                    {
                        lang: "pt",
                        value: "",
                        visible: true,
                    },
                    {
                        lang: "zh",
                        value: "",
                        visible: true,
                    },
                ],
                type: "text",
                expression: '@PATIENT."RACE_CONCEPT_ID"',
                referenceFilter:
                    "@REF.\"DOMAIN_ID\" = 'Race' AND @REF.\"STANDARD_CONCEPT\" = 'S' AND (@REF.\"CONCEPT_ID\") LIKE_REGEXPR '@SEARCH_QUERY' FLAG 'i'",
                referenceExpression: '@REF."CONCEPT_ID"',
                order: 13,
            },
            status: {
                name: [
                    {
                        lang: "",
                        value: "Status",
                    },
                ],
                disabledLangName: [
                    {
                        lang: "en",
                        value: "",
                        visible: true,
                    },
                    {
                        lang: "de",
                        value: "",
                        visible: true,
                    },
                    {
                        lang: "fr",
                        value: "",
                        visible: true,
                    },
                    {
                        lang: "es",
                        value: "",
                        visible: true,
                    },
                    {
                        lang: "pt",
                        value: "",
                        visible: true,
                    },
                    {
                        lang: "zh",
                        value: "",
                        visible: true,
                    },
                ],
                type: "text",
                expression: '@PATIENT."STATUS"',
                order: 2,
            },
            externalid: {
                name: [
                    {
                        lang: "",
                        value: "External ID",
                    },
                ],
                disabledLangName: [
                    {
                        lang: "en",
                        value: "",
                        visible: true,
                    },
                    {
                        lang: "de",
                        value: "",
                        visible: true,
                    },
                    {
                        lang: "fr",
                        value: "",
                        visible: true,
                    },
                    {
                        lang: "es",
                        value: "",
                        visible: true,
                    },
                    {
                        lang: "pt",
                        value: "",
                        visible: true,
                    },
                    {
                        lang: "zh",
                        value: "",
                        visible: true,
                    },
                ],
                type: "text",
                expression: '@PATIENT."SOURCE_INDIVIDUAL_IDENTIFIER_VALUE"',
                order: 1,
            },
            Age: {
                name: [
                    {
                        lang: "",
                        value: "Age",
                    },
                    {
                        lang: "en",
                        value: "Age",
                        visible: true,
                    },
                ],
                disabledLangName: [
                    {
                        lang: "de",
                        value: "",
                        visible: true,
                    },
                    {
                        lang: "fr",
                        value: "",
                        visible: true,
                    },
                    {
                        lang: "es",
                        value: "",
                        visible: true,
                    },
                    {
                        lang: "pt",
                        value: "",
                        visible: true,
                    },
                    {
                        lang: "zh",
                        value: "",
                        visible: true,
                    },
                ],
                type: "num",
                expression: 'YEAR(CURRENT_DATE) - @PATIENT."YEAR_OF_BIRTH"',
                order: 0,
            },
            groupID: {
                name: [
                    {
                        lang: "",
                        value: "Group ID",
                    },
                    {
                        lang: "en",
                        value: "Group ID",
                        visible: true,
                    },
                ],
                disabledLangName: [
                    {
                        lang: "de",
                        value: "",
                        visible: true,
                    },
                    {
                        lang: "fr",
                        value: "",
                        visible: true,
                    },
                    {
                        lang: "es",
                        value: "",
                        visible: true,
                    },
                    {
                        lang: "pt",
                        value: "",
                        visible: true,
                    },
                    {
                        lang: "zh",
                        value: "",
                        visible: true,
                    },
                ],
                type: "text",
                expression: '@PATIENT."EXTENSION_VALUESTRING"',
                order: 20,
            },
            alpid: {
                name: [
                    {
                        lang: "",
                        value: "ALP ID",
                    },
                    {
                        lang: "en",
                        value: "ALP ID",
                        visible: true,
                    },
                ],
                disabledLangName: [
                    {
                        lang: "de",
                        value: "",
                        visible: true,
                    },
                    {
                        lang: "fr",
                        value: "",
                        visible: true,
                    },
                    {
                        lang: "es",
                        value: "",
                        visible: true,
                    },
                    {
                        lang: "pt",
                        value: "",
                        visible: true,
                    },
                    {
                        lang: "zh",
                        value: "",
                        visible: true,
                    },
                ],
                type: "text",
                expression: '@PATIENT."ALP_ID"',
                order: 21,
            },
        },
    },
    censor: {},
    advancedSettings: {
        tableTypePlaceholderMap: {
            factTable: {
                placeholder: "@PATIENT",
                attributeTables: [],
            },
            dimTables: [
                {
                    placeholder: "@COND",
                    attributeTables: [],
                    hierarchy: true,
                    time: true,
                    oneToN: true,
                    condition: true,
                },
                {
                    placeholder: "@VISIT",
                    attributeTables: [],
                    hierarchy: true,
                    time: true,
                    oneToN: true,
                    condition: true,
                },
                {
                    placeholder: "@CONDERA",
                    attributeTables: [],
                    hierarchy: true,
                    time: true,
                    oneToN: true,
                    condition: true,
                },
                {
                    placeholder: "@DEATH",
                    attributeTables: [],
                    hierarchy: true,
                    time: true,
                    oneToN: true,
                    condition: true,
                },
                {
                    placeholder: "@DEVEXP",
                    attributeTables: [],
                    hierarchy: true,
                    time: true,
                    oneToN: true,
                    condition: true,
                },
                {
                    placeholder: "@DOSEERA",
                    attributeTables: [],
                    hierarchy: true,
                    time: true,
                    oneToN: true,
                    condition: true,
                },
                {
                    placeholder: "@DRUGERA",
                    attributeTables: [],
                    hierarchy: true,
                    time: true,
                    oneToN: true,
                    condition: true,
                },
                {
                    placeholder: "@DRUGEXP",
                    attributeTables: [],
                    hierarchy: true,
                    time: true,
                    oneToN: true,
                    condition: true,
                },
                {
                    placeholder: "@OBS",
                    attributeTables: [],
                    hierarchy: true,
                    time: true,
                    oneToN: true,
                    condition: true,
                },
                {
                    placeholder: "@OBSPER",
                    attributeTables: [],
                    hierarchy: true,
                    time: true,
                    oneToN: true,
                    condition: true,
                },
                {
                    placeholder: "@PPPER",
                    attributeTables: [],
                    hierarchy: true,
                    time: true,
                    oneToN: true,
                    condition: true,
                },
                {
                    placeholder: "@SPEC",
                    attributeTables: [],
                    hierarchy: true,
                    time: true,
                    oneToN: true,
                    condition: true,
                },
                {
                    placeholder: "@MEAS",
                    attributeTables: [],
                    hierarchy: true,
                    time: true,
                    oneToN: true,
                    condition: true,
                },
                {
                    placeholder: "@PROC",
                    attributeTables: [],
                    hierarchy: true,
                    time: true,
                    oneToN: true,
                    condition: true,
                },
                {
                    placeholder: "@CONSENT",
                    attributeTables: [],
                    hierarchy: true,
                    time: false,
                    oneToN: false,
                    condition: false,
                },
                {
                    placeholder: "@RESPONSE",
                    attributeTables: [],
                    hierarchy: true,
                    time: true,
                    oneToN: true,
                    condition: true,
                },
                {
                    placeholder: "@PTOKEN",
                    attributeTables: [],
                    hierarchy: true,
                    time: true,
                    oneToN: true,
                    condition: true,
                },
            ],
        },
        tableMapping: {
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
        },
        guardedTableMapping: {
            "@PATIENT": '$$SCHEMA$$."VIEW::OMOP.GDM.PATIENT"',
        },
        // This mapping could be added into each attribute as a key/value,
        // however it was easier to develop with clear view of what was mapped.
        // To do this will require some refactoring to target the new value.
        extCohortDefinitionTableMapping: {
            "@COND": "ConditionOccurrence",
            '@COND."CONDITION_START_DATE"': "OccurrenceStartDate",
            '@COND."CONDITION_END_DATE"': "OccurrenceEndDate",
            '@PATIENT."GENDER"': "Gender",
            'YEAR(CURRENT_DATE) - @PATIENT."YEAR_OF_BIRTH"': "Age",
            "@CONDERA": "ConditionEra",
            "@DEATH": "Death",
            '@DEATH."DEATH_TYPE_NAME"': "DeathType",
            "@DRUGERA": "DrugEra",
            '@DRUGERA."DRUG_ERA_START_DATE"': "EraStartDate",
            '@DRUGERA."DRUG_ERA_END_DATE"': "EraEndDate",
        },
        language: ["en", "de", "fr", "es", "pt", "zh"],
        others: {},
        settings: {
            fuzziness: 0.7,
            maxResultSize: 5000,
            sqlReturnOn: false,
            errorDetailsReturnOn: false,
            errorStackTraceReturnOn: false,
            enableFreeText: true,
            vbEnabled: true,
            dateFormat: "YYYY-MM-dd",
            timeFormat: "HH:mm:ss",
            otsTableMap: {
                "@CODE": '"CDMVOCAB"."CONCEPT"',
            },
        },
        shared: {},
        schemaVersion: "3",
    },
} as CdmConfig;
