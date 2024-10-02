const d = {
    patient: {
        conditions: {},
        interactions: {
            conditionera: {
                name: "Condition Era",
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
                        name: "Condition Name",
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
                            "@REF.DOMAIN_ID = 'Condition' AND @REF.STANDARD_CONCEPT = 'S' AND (@REF.CONCEPT_NAME) LIKE_REGEXPR '@SEARCH_QUERY' FLAG 'i'",
                        referenceExpression: "@REF.CONCEPT_NAME",
                        order: 0,
                        useRefValue: true,
                    },
                    startdate: {
                        name: "Start Date",
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
                        order: 1,
                        cohortDefinitionKey: "EraStartDate",
                    },
                    enddate: {
                        name: "End Date",
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
                        order: 2,
                        cohortDefinitionKey: "EraEndDate",
                    },
                    count: {
                        name: "Condition Occurrence Count",
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
                        order: 3,
                    },
                    pid: {
                        name: "Patient Id",
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
                        order: 4,
                    },
                    conditioneraid: {
                        name: "Condition Era Id",
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
                        expression:
                            'CAST (@CONDERA."CONDITION_ERA_ID" AS VARCHAR)',
                        order: 5,
                    },
                    condconceptcode: {
                        name: "Condition concept code",
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
                            "@REF.DOMAIN_ID = 'Condition' AND @REF.STANDARD_CONCEPT = 'S' AND (@REF.CONCEPT_CODE) LIKE_REGEXPR '@SEARCH_QUERY' FLAG 'i'",
                        referenceExpression: "@REF.CONCEPT_CODE",
                        order: 6,
                        useRefValue: true,
                        useRefText: true,
                    },
                    conditionconceptid: {
                        name: "Condition concept id",
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
                            "@REF.DOMAIN_ID = 'Condition' AND @REF.STANDARD_CONCEPT = 'S' AND CAST (@REF.CONCEPT_ID AS VARCHAR) LIKE_REGEXPR '@SEARCH_QUERY' FLAG 'i'",
                        referenceExpression: "@REF.CONCEPT_ID",
                        order: 7,
                        useRefValue: true,
                        useRefText: true,
                    },
                    conditionconceptset: {
                        name: "Condition concept set",
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
                        type: "conceptSet",
                        expression:
                            'CAST (@CONDERA."CONDITION_CONCEPT_ID" AS VARCHAR)',
                        order: 8,
                        useRefValue: true,
                        useRefText: true,
                    },
                },
                cohortDefinitionKey: "ConditionEra",
            },
            conditionoccurrence: {
                name: "Condition Occurrence",
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
                        name: "Visit Occurrence Id",
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
                        expression:
                            'CAST (@COND."VISIT_OCCURRENCE_ID" AS VARCHAR)',
                        order: 0,
                    },
                    enddate: {
                        name: "End Date",
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
                        order: 1,
                        cohortDefinitionKey: "OccurrenceEndDate",
                    },
                    startdate: {
                        name: "Start Date",
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
                        order: 2,
                        cohortDefinitionKey: "OccurrenceStartDate",
                    },
                    pid: {
                        name: "Patient Id",
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
                        order: 3,
                    },
                    conditionstatus: {
                        name: "Condition Status",
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
                            "@REF.DOMAIN_ID = 'Condition Status' AND @REF.STANDARD_CONCEPT = 'S' AND (@REF.CONCEPT_NAME) LIKE_REGEXPR '@SEARCH_QUERY' FLAG 'i'",
                        referenceExpression: "@REF.CONCEPT_NAME",
                        order: 4,
                        useRefValue: true,
                        cohortDefinitionKey: "ConditionStatus",
                    },
                    conditionsource: {
                        name: "Condition Source",
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
                        order: 5,
                    },
                    conditiontype: {
                        name: "Condition Type",
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
                            "@REF.DOMAIN_ID = 'Type Concept' AND @REF.CONCEPT_CLASS_ID = 'Condition Type' AND (@REF.CONCEPT_NAME) LIKE_REGEXPR '@SEARCH_QUERY' FLAG 'i'",
                        referenceExpression: "@REF.CONCEPT_NAME",
                        order: 6,
                        useRefValue: true,
                        cohortDefinitionKey: "ConditionType",
                    },
                    conditionname: {
                        name: "Condition Name",
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
                            "@REF.DOMAIN_ID = 'Condition' AND @REF.STANDARD_CONCEPT = 'S' AND (@REF.CONCEPT_NAME) LIKE_REGEXPR '@SEARCH_QUERY' FLAG 'i'",
                        referenceExpression: "@REF.CONCEPT_NAME",
                        order: 7,
                        conceptIdentifierType: "name",
                        useRefValue: true,
                    },
                    conditionoccurrenceid: {
                        name: "Condition Occurrence Id",
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
                        expression:
                            'CAST (@COND."CONDITION_OCCURRENCE_ID" AS VARCHAR)',
                        order: 8,
                    },
                    condconceptcode: {
                        name: "Condition concept code",
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
                            "@REF.DOMAIN_ID = 'Condition' AND @REF.STANDARD_CONCEPT = 'S' AND (@REF.CONCEPT_CODE) LIKE_REGEXPR '@SEARCH_QUERY' FLAG 'i'",
                        referenceExpression: "@REF.CONCEPT_CODE",
                        order: 9,
                        useRefValue: true,
                        useRefText: true,
                    },
                    conditiontypeconceptcode: {
                        name: "Condition Type concept code",
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
                            "@REF.DOMAIN_ID = 'Type Concept' AND @REF.CONCEPT_CLASS_ID = 'Condition Type' AND (@REF.CONCEPT_CODE) LIKE_REGEXPR '@SEARCH_QUERY' FLAG 'i'",
                        referenceExpression: "@REF.CONCEPT_CODE",
                        order: 10,
                        useRefValue: true,
                        useRefText: true,
                    },
                    conditiontypeconceptset: {
                        name: "Condition Type concept set",
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
                        type: "conceptSet",
                        expression:
                            'CAST (@COND."CONDITION_TYPE_CONCEPT_ID" AS VARCHAR)',
                        order: 11,
                        useRefValue: true,
                        useRefText: true,
                    },
                    conditionsourceconceptcode: {
                        name: "Condition Source concept code",
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
                        order: 12,
                    },
                    conditionsourceconceptset: {
                        name: "Condition Source concept set",
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
                        type: "conceptSet",
                        expression:
                            'CAST (@COND."CONDITION_SOURCE_CONCEPT_ID" AS VARCHAR)',
                        order: 13,
                    },
                    conditionstatusconceptcode: {
                        name: "Condition Status concept code",
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
                            "@REF.DOMAIN_ID = 'Condition Status' AND @REF.STANDARD_CONCEPT = 'S' AND (@REF.CONCEPT_CODE) LIKE_REGEXPR '@SEARCH_QUERY' FLAG 'i'",
                        referenceExpression: "@REF.CONCEPT_CODE",
                        order: 14,
                        useRefValue: true,
                        useRefText: true,
                    },
                    conditionstatusconceptset: {
                        name: "Condition Status concept set",
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
                        type: "conceptSet",
                        expression:
                            'CAST (@COND."CONDITION_STATUS_CONCEPT_ID" AS VARCHAR)',
                        order: 15,
                        useRefValue: true,
                        useRefText: true,
                    },
                    conditionconceptid: {
                        name: "Condition concept id",
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
                            "@REF.DOMAIN_ID = 'Condition' AND @REF.STANDARD_CONCEPT = 'S' AND CAST (@REF.CONCEPT_ID AS VARCHAR) LIKE_REGEXPR '@SEARCH_QUERY' FLAG 'i'",
                        referenceExpression: "@REF.CONCEPT_ID",
                        order: 16,
                        useRefValue: true,
                        useRefText: true,
                    },
                    conditionconceptset: {
                        name: "Condition concept set",
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
                        type: "conceptSet",
                        expression:
                            'CAST (@COND."CONDITION_CONCEPT_ID" AS VARCHAR)',
                        order: 17,
                        useRefValue: true,
                        useRefText: true,
                    },
                    conditiontypeconceptid: {
                        name: "Condition Type concept id",
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
                        expression:
                            'CAST (@COND."CONDITION_TYPE_CONCEPT_ID" AS VARCHAR)',
                        order: 18,
                        useRefValue: true,
                        useRefText: true,
                    },
                    conditionsourceconceptid: {
                        name: "Condition Source concept id",
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
                        expression:
                            'CAST (@COND."CONDITION_SOURCE_CONCEPT_ID" AS VARCHAR)',
                        order: 19,
                    },
                    conditionstatusconceptid: {
                        name: "Condition Status concept id",
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
                        expression:
                            'CAST (@COND."CONDITION_STATUS_CONCEPT_ID" AS VARCHAR)',
                        order: 20,
                        useRefValue: true,
                        useRefText: true,
                    },
                },
                cohortDefinitionKey: "ConditionOccurrence",
            },
            death: {
                name: "Death",
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
                        name: "Death Type concept code",
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
                            "@REF.DOMAIN_ID = 'Type Concept' AND @REF.CONCEPT_CLASS_ID = 'Death Type' AND (@REF.CONCEPT_CODE) LIKE_REGEXPR '@SEARCH_QUERY' FLAG 'i'",
                        referenceExpression: "@REF.CONCEPT_CODE",
                        order: 0,
                        useRefValue: true,
                        useRefText: true,
                    },
                    deathtypeconceptset: {
                        name: "Death Type concept set",
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
                        type: "conceptSet",
                        expression:
                            'CAST (@DEATH."DEATH_TYPE_CONCEPT_ID" AS VARCHAR)',
                        order: 1,
                        useRefValue: true,
                        useRefText: true,
                    },
                    pid: {
                        name: "Patient Id",
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
                        name: "Death Date/Time",
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
                        order: 3,
                    },
                    deathdate: {
                        name: "Death Date",
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
                        order: 4,
                        cohortDefinitionKey: "OccurrenceStartDate",
                    },
                    deathtype: {
                        name: "Death Type",
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
                            "@REF.DOMAIN_ID = 'Type Concept' AND @REF.CONCEPT_CLASS_ID = 'Death Type' AND (@REF.CONCEPT_NAME) LIKE_REGEXPR '@SEARCH_QUERY' FLAG 'i'",
                        referenceExpression: "@REF.CONCEPT_NAME",
                        order: 5,
                        useRefValue: true,
                        cohortDefinitionKey: "DeathType",
                    },
                    deathtypeconceptid: {
                        name: "Death Type concept id",
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
                        expression:
                            'CAST (@DEATH."DEATH_TYPE_CONCEPT_ID" AS VARCHAR)',
                        order: 6,
                        useRefValue: true,
                        useRefText: true,
                    },
                },
                cohortDefinitionKey: "Death",
            },
            deviceexposure: {
                name: "Device Exposure",
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
                        name: "End Date",
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
                        order: 0,
                        cohortDefinitionKey: "OccurrenceEndDate",
                    },
                    startdate: {
                        name: "Start Date",
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
                        order: 1,
                        cohortDefinitionKey: "OccurrenceStartDate",
                    },
                    devicename: {
                        name: "Device Name",
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
                            "@REF.DOMAIN_ID = 'Device' AND @REF.STANDARD_CONCEPT = 'S' AND (@REF.CONCEPT_NAME) LIKE_REGEXPR '@SEARCH_QUERY' FLAG 'i'",
                        referenceExpression: "@REF.CONCEPT_NAME",
                        order: 2,
                        useRefValue: true,
                        cohortDefinitionKey: "OccurrenceEndDate",
                    },
                    pid: {
                        name: "Patient Id",
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
                        order: 3,
                    },
                    deviceexposureid: {
                        name: "Device Exposure Id",
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
                        expression:
                            'CAST (@DEVEXP."DEVICE_EXPOSURE_ID" AS VARCHAR)',
                        order: 4,
                    },
                    devicetypename: {
                        name: "Device Type",
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
                            "@REF.DOMAIN_ID = 'Type Concept' AND @REF.CONCEPT_CLASS_ID = 'Device Type' AND (@REF.CONCEPT_NAME) LIKE_REGEXPR '@SEARCH_QUERY' FLAG 'i'",
                        referenceExpression: "@REF.CONCEPT_NAME",
                        order: 5,
                        useRefValue: true,
                        cohortDefinitionKey: "DeviceType",
                    },
                    deviceconceptcode: {
                        name: "Device concept code",
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
                            "@REF.DOMAIN_ID = 'Device' AND @REF.STANDARD_CONCEPT = 'S' AND (@REF.CONCEPT_CODE) LIKE_REGEXPR '@SEARCH_QUERY' FLAG 'i'",
                        referenceExpression: "@REF.CONCEPT_CODE",
                        order: 6,
                        useRefValue: true,
                        useRefText: true,
                    },
                    devicetypeconceptcode: {
                        name: "Device Type concept code",
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
                            "@REF.DOMAIN_ID = 'Type Concept' AND @REF.CONCEPT_CLASS_ID = 'Device Type' AND (@REF.CONCEPT_CODE) LIKE_REGEXPR '@SEARCH_QUERY' FLAG 'i'",
                        referenceExpression: "@REF.CONCEPT_CODE",
                        order: 7,
                        useRefValue: true,
                        useRefText: true,
                    },
                    devicetypeconceptset: {
                        name: "Device Type concept set",
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
                        type: "conceptSet",
                        expression:
                            'CAST (@DEVEXP."DEVICE_TYPE_CONCEPT_ID" AS VARCHAR)',
                        order: 8,
                        useRefValue: true,
                        useRefText: true,
                    },
                    deviceconceptid: {
                        name: "Device concept id",
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
                            "@REF.DOMAIN_ID = 'Device' AND @REF.STANDARD_CONCEPT = 'S' AND CAST(@REF.CONCEPT_ID AS VARCHAR) LIKE_REGEXPR '@SEARCH_QUERY' FLAG 'i'",
                        referenceExpression: "@REF.CONCEPT_ID",
                        order: 9,
                        useRefValue: true,
                        useRefText: true,
                    },
                    deviceconceptset: {
                        name: "Device concept set",
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
                        type: "conceptSet",
                        expression:
                            'CAST (@DEVEXP."DEVICE_CONCEPT_ID" AS VARCHAR)',
                        order: 10,
                        useRefValue: true,
                        useRefText: true,
                    },
                    devicetypeconceptid: {
                        name: "Device Type concept id",
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
                        expression:
                            'CAST (@DEVEXP."DEVICE_TYPE_CONCEPT_ID" AS VARCHAR)',
                        order: 11,
                        useRefValue: true,
                        useRefText: true,
                    },
                },
                cohortDefinitionKey: "DeviceExposure",
            },
            doseera: {
                name: "Dose Era",
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
                        name: "Unit",
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
                            "@REF.DOMAIN_ID = 'Unit' AND @REF.STANDARD_CONCEPT = 'S' AND (@REF.CONCEPT_NAME) LIKE_REGEXPR '@SEARCH_QUERY' FLAG 'i'",
                        referenceExpression: "@REF.CONCEPT_NAME",
                        order: 0,
                        useRefValue: true,
                        cohortDefinitionKey: "Unit",
                    },
                    drug: {
                        name: "Drug",
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
                            "@REF.DOMAIN_ID = 'Drug' AND @REF.STANDARD_CONCEPT = 'S' AND (@REF.CONCEPT_NAME) LIKE_REGEXPR '@SEARCH_QUERY' FLAG 'i'",
                        referenceExpression: "@REF.CONCEPT_NAME",
                        order: 1,
                        useRefValue: true,
                    },
                    pid: {
                        name: "Patient Id",
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
                        order: 2,
                    },
                    enddate: {
                        name: "End Date",
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
                        order: 3,
                        cohortDefinitionKey: "EraEndDate",
                    },
                    startdate: {
                        name: "Start Date",
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
                        order: 4,
                        cohortDefinitionKey: "EraStartDate",
                    },
                    dosevalue: {
                        name: "Dose Value",
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
                        order: 5,
                        cohortDefinitionKey: "DoseValue",
                    },
                    doseeraid: {
                        name: "Dose Era Id",
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
                        expression: 'CAST (@DOSEERA."DOSE_ERA_ID" AS VARCHAR)',
                        order: 6,
                    },
                    drugconceptcode: {
                        name: "Drug concept code",
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
                            "@REF.DOMAIN_ID = 'Drug' AND @REF.STANDARD_CONCEPT = 'S' AND (@REF.CONCEPT_CODE) LIKE_REGEXPR '@SEARCH_QUERY' FLAG 'i'",
                        referenceExpression: "@REF.CONCEPT_CODE",
                        order: 7,
                        useRefValue: true,
                        useRefText: true,
                    },
                    drugconceptset: {
                        name: "Drug concept set",
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
                        type: "conceptSet",
                        expression:
                            'CAST (@DOSEERA."DRUG_CONCEPT_ID" AS VARCHAR)',
                        order: 8,
                        useRefValue: true,
                        useRefText: true,
                    },
                    unitconceptcode: {
                        name: "Unit concept code",
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
                            "@REF.DOMAIN_ID = 'Unit' AND @REF.STANDARD_CONCEPT = 'S' AND (@REF.CONCEPT_CODE) LIKE_REGEXPR '@SEARCH_QUERY' FLAG 'i'",
                        referenceExpression: "@REF.CONCEPT_CODE",
                        order: 9,
                        useRefValue: true,
                        useRefText: true,
                    },
                    unitconceptset: {
                        name: "Unit concept set",
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
                        type: "conceptSet",
                        expression:
                            'CAST (@DOSEERA."UNIT_CONCEPT_ID" AS VARCHAR)',
                        order: 10,
                        useRefValue: true,
                        useRefText: true,
                    },
                    drugconceptid: {
                        name: "Drug concept id",
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
                        expression:
                            'CAST (@DOSEERA."DRUG_CONCEPT_ID" AS VARCHAR)',
                        order: 11,
                        useRefValue: true,
                        useRefText: true,
                    },
                    unitconceptid: {
                        name: "Unit concept id",
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
                        expression:
                            'CAST (@DOSEERA."UNIT_CONCEPT_ID" AS VARCHAR)',
                        order: 12,
                        useRefValue: true,
                        useRefText: true,
                    },
                },
                cohortDefinitionKey: "DoseEra",
            },
            drugera: {
                name: "Drug Era",
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
                        name: "End Date",
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
                        order: 0,
                        cohortDefinitionKey: "EraEndDate",
                    },
                    startdate: {
                        name: "Start Date",
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
                        order: 1,
                        cohortDefinitionKey: "EraStartDate",
                    },
                    drugname: {
                        name: "Drug Name",
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
                            "@REF.DOMAIN_ID = 'Drug' AND @REF.STANDARD_CONCEPT = 'S' AND (@REF.CONCEPT_NAME) LIKE_REGEXPR '@SEARCH_QUERY' FLAG 'i'",
                        referenceExpression: "@REF.CONCEPT_NAME",
                        order: 2,
                        useRefValue: true,
                    },
                    pid: {
                        name: "Patient Id",
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
                        order: 3,
                    },
                    drugeraid: {
                        name: "Drug Era Id",
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
                        expression: 'CAST (@DRUGERA."DRUG_ERA_ID" AS VARCHAR)',
                        order: 4,
                    },
                    gapdays: {
                        name: "Gap Days",
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
                        order: 5,
                    },
                    drugexpcount: {
                        name: "Drug Exposure Count",
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
                        expression:
                            'CAST (@DRUGERA."DRUG_EXPOSURE_COUNT" AS VARCHAR)',
                        order: 6,
                    },
                    drugconceptcode: {
                        name: "Drug concept code",
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
                            "@REF.DOMAIN_ID = 'Drug' AND @REF.STANDARD_CONCEPT = 'S' AND (@REF.CONCEPT_CODE) LIKE_REGEXPR '@SEARCH_QUERY' FLAG 'i'",
                        referenceExpression: "@REF.CONCEPT_CODE",
                        order: 7,
                        useRefValue: true,
                        useRefText: true,
                    },
                    drugconceptset: {
                        name: "Drug concept set",
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
                        type: "conceptSet",
                        expression:
                            'CAST (@DRUGERA."DRUG_CONCEPT_ID" AS VARCHAR)',
                        order: 8,
                        useRefValue: true,
                        useRefText: true,
                    },
                    drugconceptid: {
                        name: "Drug concept id",
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
                        expression:
                            'CAST (@DRUGERA."DRUG_CONCEPT_ID" AS VARCHAR)',
                        order: 9,
                        useRefValue: true,
                        useRefText: true,
                    },
                },
                cohortDefinitionKey: "DrugEra",
            },
            drugexposure: {
                name: "Drug Exposure",
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
                        name: "End Date/Time",
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
                        order: 0,
                    },
                    refills: {
                        name: "Refills",
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
                        expression: 'CAST (@DRUGEXP."REFILLS" AS VARCHAR)',
                        order: 1,
                        cohortDefinitionKey: "Refills",
                    },
                    startdatetime: {
                        name: "Start Date/Time",
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
                        order: 2,
                    },
                    stopreason: {
                        name: "Stop Reason",
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
                        order: 3,
                    },
                    enddate: {
                        name: "End Date",
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
                        order: 4,
                        cohortDefinitionKey: "OccurrenceEndDate",
                    },
                    drugtype: {
                        name: "Drug Type",
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
                            "@REF.DOMAIN_ID = 'Type Concept' AND @REF.CONCEPT_CLASS_ID = 'Drug Type' AND (@REF.CONCEPT_NAME) LIKE_REGEXPR '@SEARCH_QUERY' FLAG 'i'",
                        referenceExpression: "@REF.CONCEPT_NAME",
                        order: 5,
                        useRefValue: true,
                        cohortDefinitionKey: "DrugType",
                    },
                    startdate: {
                        name: "Start Date",
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
                        order: 6,
                        cohortDefinitionKey: "OccurrenceStartDate",
                    },
                    drugname: {
                        name: "Drug Name",
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
                            "@REF.DOMAIN_ID = 'Drug' AND @REF.STANDARD_CONCEPT = 'S' AND (@REF.CONCEPT_NAME) LIKE_REGEXPR '@SEARCH_QUERY' FLAG 'i'",
                        referenceExpression: "@REF.CONCEPT_NAME",
                        order: 7,
                        useRefValue: true,
                    },
                    lotnumber: {
                        name: "Lot Number",
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
                        order: 8,
                    },
                    routename: {
                        name: "Route Name",
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
                            "@REF.DOMAIN_ID = 'Route' AND @REF.STANDARD_CONCEPT = 'S' AND (@REF.CONCEPT_NAME) LIKE_REGEXPR '@SEARCH_QUERY' FLAG 'i'",
                        referenceExpression: "@REF.CONCEPT_NAME",
                        order: 9,
                        useRefValue: true,
                    },
                    drugexposureid: {
                        name: "Drug Exposure Id",
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
                        expression:
                            'CAST (@DRUGEXP."DRUG_EXPOSURE_ID" AS VARCHAR)',
                        order: 10,
                    },
                    sig: {
                        name: "Sig",
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
                        order: 11,
                    },
                    pid: {
                        name: "Patient Id",
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
                        order: 12,
                    },
                    verbatimenddate: {
                        name: "Verbatim End Date",
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
                        order: 13,
                    },
                    dayssupply: {
                        name: "Days of supply",
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
                        expression: 'CAST (@DRUGEXP."DAYS_SUPPLY" AS VARCHAR)',
                        order: 14,
                        cohortDefinitionKey: "DaysSupply",
                    },
                    drugconceptcode: {
                        name: "Drug concept code",
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
                            "@REF.DOMAIN_ID = 'Drug' AND @REF.STANDARD_CONCEPT = 'S' AND (@REF.CONCEPT_CODE) LIKE_REGEXPR '@SEARCH_QUERY' FLAG 'i'",
                        referenceExpression: "@REF.CONCEPT_CODE",
                        order: 15,
                        useRefValue: true,
                        useRefText: true,
                    },
                    drugtypeconceptcode: {
                        name: "Drug Type concept code",
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
                            "@REF.DOMAIN_ID = 'Type Concept' AND @REF.CONCEPT_CLASS_ID = 'Drug Type' AND (@REF.CONCEPT_CODE) LIKE_REGEXPR '@SEARCH_QUERY' FLAG 'i'",
                        referenceExpression: "@REF.CONCEPT_CODE",
                        order: 16,
                        useRefValue: true,
                        useRefText: true,
                    },
                    routeconceptcode: {
                        name: "Route concept code",
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
                            "@REF.DOMAIN_ID = 'Route' AND @REF.STANDARD_CONCEPT = 'S' AND (@REF.CONCEPT_CODE) LIKE_REGEXPR '@SEARCH_QUERY' FLAG 'i'",
                        referenceExpression: "@REF.CONCEPT_CODE",
                        order: 17,
                        useRefValue: true,
                        useRefText: true,
                    },
                    drugconceptid: {
                        name: "Drug concept id",
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
                            "@REF.DOMAIN_ID = 'Drug' AND @REF.STANDARD_CONCEPT = 'S' AND CAST (@REF.CONCEPT_ID AS VARCHAR) LIKE_REGEXPR '@SEARCH_QUERY' FLAG 'i'",
                        referenceExpression:
                            "CAST (@REF.CONCEPT_ID AS VARCHAR)",
                        order: 18,
                        useRefValue: true,
                        useRefText: true,
                    },
                    drugconceptset: {
                        name: "Drug concept set",
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
                        type: "conceptSet",
                        expression:
                            'CAST (@DRUGEXP."DRUG_CONCEPT_ID" AS VARCHAR)',
                        order: 19,
                        useRefValue: true,
                        useRefText: true,
                    },
                    routeconceptid: {
                        name: "Route concept id",
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
                            "@REF.DOMAIN_ID = 'Route' AND @REF.STANDARD_CONCEPT = 'S' AND CAST (@REF.CONCEPT_ID AS VARCHAR) LIKE_REGEXPR '@SEARCH_QUERY' FLAG 'i'",
                        referenceExpression: "@REF.CONCEPT_ID",
                        order: 20,
                        useRefValue: true,
                        useRefText: true,
                    },
                    routeconceptset: {
                        name: "Route concept set",
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
                        type: "conceptSet",
                        expression:
                            'CAST (@DRUGEXP."ROUTE_CONCEPT_ID" AS VARCHAR)',
                        order: 21,
                        useRefValue: true,
                        useRefText: true,
                    },
                    drugtypeconceptid: {
                        name: "Drug type concept id",
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
                            "@REF.DOMAIN_ID = 'Type Concept' AND @REF.CONCEPT_CLASS_ID = 'Drug Type' AND CAST (@REF.CONCEPT_ID AS VARCHAR) LIKE_REGEXPR '@SEARCH_QUERY' FLAG 'i'",
                        referenceExpression: "@REF.CONCEPT_ID",
                        order: 22,
                        useRefValue: true,
                        useRefText: true,
                    },
                    drugtypeconceptset: {
                        name: "Drug type concept set",
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
                        type: "conceptSet",
                        expression:
                            'CAST (@DRUGEXP."DRUG_TYPE_CONCEPT_ID" AS VARCHAR)',
                        order: 23,
                        useRefValue: true,
                        useRefText: true,
                    },
                },
                cohortDefinitionKey: "DrugExposure",
            },
            measurement: {
                name: "Measurement",
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
                        name: "Value (numeric)",
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
                        order: 0,
                        cohortDefinitionKey: "ValueAsNumber",
                    },
                    measurementname: {
                        name: "Measurement name",
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
                            "@REF.DOMAIN_ID = 'Measurement' AND (@REF.CONCEPT_NAME) LIKE_REGEXPR '@SEARCH_QUERY' FLAG 'i'",
                        referenceExpression: "@REF.CONCEPT_NAME",
                        order: 1,
                        useRefValue: true,
                    },
                    measurementtype: {
                        name: "Measurement type",
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
                            "@REF.CONCEPT_CLASS_ID = 'Measurement' AND (@REF.CONCEPT_NAME) LIKE_REGEXPR '@SEARCH_QUERY' FLAG 'i'",
                        referenceExpression: "@REF.CONCEPT_NAME",
                        order: 2,
                        cohortDefinitionKey: "MeasurementType",
                    },
                    measurementdate: {
                        name: "Measurement date",
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
                        order: 3,
                        cohortDefinitionKey: "OccurrenceStartDate",
                    },
                    pid: {
                        name: "Patient Id",
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
                        order: 4,
                    },
                    measurementid: {
                        name: "Measurement Id",
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
                        expression: 'CAST (@MEAS."MEASUREMENT_ID" AS VARCHAR)',
                        order: 5,
                    },
                    textval: {
                        name: "Value (text)",
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
                        order: 6,
                        cohortDefinitionKey: "ValueAsConcept",
                    },
                    measurementconceptcode: {
                        name: "Measurement concept code",
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
                            "@REF.DOMAIN_ID = 'Measurement' AND (@REF.CONCEPT_CODE) LIKE_REGEXPR '@SEARCH_QUERY' FLAG 'i'",
                        referenceExpression: "@REF.CONCEPT_CODE",
                        order: 7,
                        useRefValue: true,
                        useRefText: true,
                    },
                    measurementtypeconceptcode: {
                        name: "Measurement type concept code",
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
                            "@REF.CONCEPT_CLASS_ID = 'Measurement' AND (@REF.CONCEPT_CODE) LIKE_REGEXPR '@SEARCH_QUERY' FLAG 'i'",
                        referenceExpression: "@REF.CONCEPT_CODE",
                        order: 8,
                        useRefValue: true,
                        useRefText: true,
                    },
                    measurementtypeconceptset: {
                        name: "Measurement type concept set",
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
                        type: "conceptSet",
                        expression:
                            'CAST (@MEAS."MEASUREMENT_TYPE_CONCEPT_ID" AS VARCHAR)',
                        order: 9,
                        useRefValue: true,
                        useRefText: true,
                        cohortDefinitionKey: "MeasurementType",
                    },
                    valueasconceptcode: {
                        name: "Value as concept code",
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
                        order: 10,
                    },
                    valueasconceptset: {
                        name: "Value as concept set",
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
                        type: "conceptSet",
                        expression:
                            'CAST (@MEAS."VALUE_AS_CONCEPT_ID" AS VARCHAR)',
                        order: 11,
                    },
                    unitconceptcode: {
                        name: "Unit concept code",
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
                            "@REF.DOMAIN_ID = 'Unit' AND @REF.STANDARD_CONCEPT = 'S' AND (@REF.CONCEPT_CODE) LIKE_REGEXPR '@SEARCH_QUERY' FLAG 'i'",
                        referenceExpression: "@REF.CONCEPT_CODE",
                        order: 12,
                    },
                    unitconceptset: {
                        name: "Unit concept set",
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
                        type: "conceptSet",
                        expression: 'CAST (@MEAS."UNIT_CONCEPT_ID" AS VARCHAR)',
                        order: 13,
                    },
                    measurementconceptid: {
                        name: "Measurement concept id",
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
                            "@REF.DOMAIN_ID = 'Measurement' AND CAST (@REF.CONCEPT_ID AS VARCHAR) LIKE_REGEXPR '@SEARCH_QUERY' FLAG 'i'",
                        referenceExpression: "@REF.CONCEPT_ID",
                        order: 14,
                        useRefValue: true,
                        useRefText: true,
                    },
                    measurementconceptset: {
                        name: "Measurement concept set",
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
                        type: "conceptSet",
                        expression:
                            'CAST (@MEAS."MEASUREMENT_CONCEPT_ID" AS VARCHAR)',
                        order: 15,
                        useRefValue: true,
                        useRefText: true,
                    },
                    measurementtypeconceptid: {
                        name: "Measurement type concept id",
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
                        expression:
                            'CAST (@MEAS."MEASUREMENT_TYPE_CONCEPT_ID" AS VARCHAR)',
                        order: 16,
                        useRefValue: true,
                        useRefText: true,
                    },
                    valueasconceptid: {
                        name: "Value as concept id",
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
                        expression:
                            'CAST (@MEAS."VALUE_AS_CONCEPT_ID" AS VARCHAR)',
                        order: 17,
                    },
                    unitconceptid: {
                        name: "Unit concept id",
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
                        expression: 'CAST (@MEAS."UNIT_CONCEPT_ID" AS VARCHAR)',
                        order: 18,
                    },
                },
                cohortDefinitionKey: "Measurement",
            },
            observation: {
                name: "Observation",
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
                        name: "Unit",
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
                            "@REF.DOMAIN_ID = 'Unit' AND @REF.STANDARD_CONCEPT = 'S' AND (@REF.CONCEPT_NAME) LIKE_REGEXPR '@SEARCH_QUERY' FLAG 'i'",
                        referenceExpression: "@REF.CONCEPT_NAME",
                        order: 0,
                        useRefValue: true,
                        cohortDefinitionKey: "Unit",
                    },
                    obsdatetime: {
                        name: "Observation Date/Time",
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
                        order: 1,
                    },
                    pid: {
                        name: "Patient Id",
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
                        order: 2,
                    },
                    obsdate: {
                        name: "Observation Date",
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
                        order: 3,
                        cohortDefinitionKey: "OccurrenceStartDate",
                    },
                    observationid: {
                        name: "Observation Id",
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
                        expression: 'CAST (@OBS."OBSERVATION_ID" AS VARCHAR)',
                        order: 4,
                    },
                    obsname: {
                        name: "Observation Name",
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
                            "@REF.DOMAIN_ID = 'Observation' AND @REF.STANDARD_CONCEPT = 'S' AND (@REF.CONCEPT_NAME) LIKE_REGEXPR '@SEARCH_QUERY' FLAG 'i'",
                        referenceExpression: "@REF.CONCEPT_NAME",
                        order: 5,
                        useRefValue: true,
                    },
                    qualifier: {
                        name: "Qualifier",
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
                            "@REF.DOMAIN_ID = 'Observation' AND @REF.STANDARD_CONCEPT = 'S' AND @REF.CONCEPT_CLASS_ID = 'Qualifier Value' AND (@REF.CONCEPT_NAME) LIKE_REGEXPR '@SEARCH_QUERY' FLAG 'i'",
                        referenceExpression: "@REF.CONCEPT_NAME",
                        order: 6,
                        useRefValue: true,
                    },
                    textval: {
                        name: "Value (text)",
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
                        cohortDefinitionKey: "ValueAsString",
                    },
                    verbatimtext: {
                        name: "Value (verbatim)",
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
                        order: 8,
                    },
                    numval: {
                        name: "Value (numeric)",
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
                        order: 9,
                        cohortDefinitionKey: "ValueAsNumber",
                    },
                    obstype: {
                        name: "Observation type",
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
                            "@REF.DOMAIN_ID = 'Type Concept' AND @REF.CONCEPT_CLASS_ID = 'Observation Type' AND (@REF.CONCEPT_NAME) LIKE_REGEXPR '@SEARCH_QUERY' FLAG 'i'",
                        referenceExpression: "@REF.CONCEPT_NAME",
                        order: 10,
                        useRefValue: true,
                    },
                    obsconceptcode: {
                        name: "Observation concept code",
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
                            "@REF.DOMAIN_ID = 'Observation' AND @REF.STANDARD_CONCEPT = 'S' AND (@REF.CONCEPT_CODE) LIKE_REGEXPR '@SEARCH_QUERY' FLAG 'i'",
                        referenceExpression: "@REF.CONCEPT_CODE",
                        order: 11,
                        useRefValue: true,
                        useRefText: true,
                    },
                    obsconceptset: {
                        name: "Observation concept set",
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
                        type: "conceptSet",
                        expression:
                            'CAST (@OBS."OBSERVATION_CONCEPT_ID" AS VARCHAR)',
                        order: 12,
                        useRefValue: true,
                        useRefText: true,
                    },
                    obstypeconceptcode: {
                        name: "Observation type concept code",
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
                            "@REF.DOMAIN_ID = 'Type Concept' AND @REF.CONCEPT_CLASS_ID = 'Observation Type' AND (@REF.CONCEPT_CODE) LIKE_REGEXPR '@SEARCH_QUERY' FLAG 'i'",
                        referenceExpression: "@REF.CONCEPT_CODE",
                        order: 13,
                        useRefValue: true,
                        useRefText: true,
                    },
                    valueasconceptcode: {
                        name: "Value as concept code",
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
                        order: 14,
                    },
                    qualifierconceptcode: {
                        name: "Qualifier concept code",
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
                            "@REF.DOMAIN_ID = 'Observation' AND @REF.STANDARD_CONCEPT = 'S' AND @REF.CONCEPT_CLASS_ID = 'Qualifier Value' AND (@REF.CONCEPT_CODE) LIKE_REGEXPR '@SEARCH_QUERY' FLAG 'i'",
                        referenceExpression: "@REF.CONCEPT_CODE",
                        order: 15,
                        useRefValue: true,
                        useRefText: true,
                    },
                    unitconceptcode: {
                        name: "Unit concept code",
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
                            "@REF.DOMAIN_ID = 'Unit' AND @REF.STANDARD_CONCEPT = 'S' AND (@REF.CONCEPT_CODE) LIKE_REGEXPR '@SEARCH_QUERY' FLAG 'i'",
                        referenceExpression: "@REF.CONCEPT_CODE",
                        order: 16,
                        useRefValue: true,
                        useRefText: true,
                    },
                    observationtypeconceptid: {
                        name: "Observation type concept id",
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
                            "@REF.DOMAIN_ID = 'Type Concept' AND @REF.CONCEPT_CLASS_ID = 'Observation Type' AND CAST (@REF.CONCEPT_ID AS VARCHAR) LIKE_REGEXPR '@SEARCH_QUERY' FLAG 'i'",
                        referenceExpression:
                            "CAST (@REF.CONCEPT_ID AS VARCHAR)",
                        order: 17,
                        useRefValue: true,
                        useRefText: true,
                    },
                    observationtypeconceptset: {
                        name: "Observation type concept set",
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
                        type: "conceptSet",
                        expression:
                            'CAST (@OBS."OBSERVATION_TYPE_CONCEPT_ID" AS VARCHAR)',
                        order: 18,
                        useRefValue: true,
                        useRefText: true,
                    },
                    valueasconceptid: {
                        name: "Value as concept id",
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
                        expression:
                            'CAST (@OBS."VALUE_AS_CONCEPT_ID" AS VARCHAR)',
                        order: 19,
                    },
                    valueasconceptset: {
                        name: "Value as concept set",
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
                        type: "conceptSet",
                        expression:
                            'CAST (@OBS."VALUE_AS_CONCEPT_ID" AS VARCHAR)',
                        order: 20,
                    },
                    qualifierconceptid: {
                        name: "Qualifier concept id",
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
                            "@REF.DOMAIN_ID = 'Observation' AND @REF.STANDARD_CONCEPT = 'S' AND @REF.CONCEPT_CLASS_ID = 'Qualifier Value' AND CAST (@REF.CONCEPT_ID AS VARCHAR) LIKE_REGEXPR '@SEARCH_QUERY' FLAG 'i'",
                        referenceExpression: "@REF.CONCEPT_ID",
                        order: 21,
                        useRefValue: true,
                        useRefText: true,
                    },
                    qualifierconceptset: {
                        name: "Qualifier concept set",
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
                        type: "conceptSet",
                        expression:
                            'CAST (@OBS."QUALIFIER_CONCEPT_ID" AS VARCHAR)',
                        order: 22,
                        useRefValue: true,
                        useRefText: true,
                    },
                    unitconceptid: {
                        name: "Unit concept id",
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
                            "@REF.DOMAIN_ID = 'Unit' AND @REF.STANDARD_CONCEPT = 'S' AND CAST (@REF.CONCEPT_ID AS VARCHAR) LIKE_REGEXPR '@SEARCH_QUERY' FLAG 'i'",
                        referenceExpression:
                            "CAST (@REF.CONCEPT_ID AS VARCHAR)",
                        order: 23,
                        useRefValue: true,
                        useRefText: true,
                    },
                    unitconceptset: {
                        name: "Unit concept set",
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
                        type: "conceptSet",
                        expression: 'CAST (@OBS."UNIT_CONCEPT_ID" AS VARCHAR)',
                        order: 24,
                        useRefValue: true,
                        useRefText: true,
                    },
                    obsconceptid: {
                        name: "Observation concept id",
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
                        expression:
                            'CAST (@OBS."OBSERVATION_CONCEPT_ID" AS VARCHAR)',
                        order: 25,
                        useRefValue: true,
                        useRefText: true,
                    },
                },
                cohortDefinitionKey: "Observation",
            },
            obsperiod: {
                name: "Observation Period",
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
                        name: "End Date",
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
                        order: 0,
                        cohortDefinitionKey: "PeriodEndDate",
                    },
                    startdate: {
                        name: "Start Date",
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
                        order: 1,
                        cohortDefinitionKey: "PeriodStartDate",
                    },
                    pid: {
                        name: "Patient Id",
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
                        order: 2,
                    },
                    periodtype: {
                        name: "Period type",
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
                            "@REF.DOMAIN_ID = 'Type Concept' AND @REF.CONCEPT_CLASS_ID = 'Obs Period Type' AND (@REF.CONCEPT_NAME) LIKE_REGEXPR '@SEARCH_QUERY' FLAG 'i'",
                        referenceExpression: "@REF.CONCEPT_NAME",
                        order: 3,
                        useRefValue: true,
                        cohortDefinitionKey: "PeriodType",
                    },
                    obsperiodid: {
                        name: "Observation period Id",
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
                        order: 4,
                    },
                    periodtypeconceptcode: {
                        name: "Observation period type concept code",
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
                            "@REF.DOMAIN_ID = 'Type Concept' AND @REF.CONCEPT_CLASS_ID = 'Obs Period Type' AND (@REF.CONCEPT_CODE) LIKE_REGEXPR '@SEARCH_QUERY' FLAG 'i'",
                        referenceExpression: "@REF.CONCEPT_CODE",
                        order: 5,
                        useRefValue: true,
                        useRefText: true,
                    },
                    periodtypeconceptid: {
                        name: "Period type concept id",
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
                            "@REF.DOMAIN_ID = 'Type Concept' AND @REF.CONCEPT_CLASS_ID = 'Obs Period Type' AND CAST (@REF.CONCEPT_ID AS VARCHAR) LIKE_REGEXPR '@SEARCH_QUERY' FLAG 'i'",
                        referenceExpression:
                            "CAST (@REF.CONCEPT_ID AS VARCHAR)",
                        order: 6,
                        useRefValue: true,
                        useRefText: true,
                    },
                    periodtypeconceptset: {
                        name: "Period type concept set",
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
                        type: "conceptSet",
                        expression:
                            'CAST (@OBSPER."PERIOD_TYPE_CONCEPT_ID" AS VARCHAR)',
                        order: 7,
                        useRefValue: true,
                        useRefText: true,
                    },
                },
                cohortDefinitionKey: "ObservationPeriod",
            },
            ppperiod: {
                name: "Payer Plan Period",
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
                        name: "End Date",
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
                        order: 0,
                        cohortDefinitionKey: "PeriodEndDate",
                    },
                    startdate: {
                        name: "Start Date",
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
                        order: 1,
                        cohortDefinitionKey: "PeriodStartDate",
                    },
                    pid: {
                        name: "Patient Id",
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
                        order: 2,
                    },
                    ppperiodid: {
                        name: "Payer Plan Period Id",
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
                        expression:
                            'CAST (@PPPER."PAYER_PLAN_PERIOD_ID" AS VARCHAR)',
                        order: 3,
                    },
                },
                cohortDefinitionKey: "PayerPlanPeriod",
            },
            proc: {
                name: "Procedure Occurrence",
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
                        name: "Procedure Date/Time",
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
                        order: 0,
                        cohortDefinitionKey: "OccurrenceStartDate",
                    },
                    procconceptid: {
                        name: "Procedure Occurrence Id",
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
                        expression:
                            'CAST (@PROC."PROCEDURE_OCCURRENCE_ID" AS VARCHAR)',
                        order: 1,
                    },
                    procconceptset: {
                        name: "Procedure Occurrence Concept Set",
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
                        type: "conceptSet",
                        expression:
                            'CAST (@PROC."PROCEDURE_OCCURRENCE_ID" AS VARCHAR)',
                        order: 2,
                    },
                    procdate: {
                        name: "Procedure Date",
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
                        order: 3,
                        cohortDefinitionKey: "OccurrenceStartDate",
                    },
                    qty: {
                        name: "Quantity",
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
                        expression: 'CAST (@PROC."QUANTITY" AS VARCHAR)',
                        order: 4,
                        cohortDefinitionKey: "Quantity",
                    },
                    procname: {
                        name: "Procedure name",
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
                            "@REF.DOMAIN_ID = 'Procedure' AND @REF.STANDARD_CONCEPT = 'S' AND (@REF.CONCEPT_NAME) LIKE_REGEXPR '@SEARCH_QUERY' FLAG 'i'",
                        referenceExpression: "@REF.CONCEPT_NAME",
                        order: 5,
                        useRefValue: true,
                        useRefText: true,
                    },
                    modifier: {
                        name: "Modifier",
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
                        order: 6,
                        cohortDefinitionKey: "Modifier",
                    },
                    pid: {
                        name: "Patient Id",
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
                        order: 7,
                    },
                    proctype: {
                        name: "Procedure type",
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
                            "@REF.DOMAIN_ID = 'Type Concept' AND @REF.CONCEPT_CLASS_ID = 'Procedure Type' AND (@REF.CONCEPT_NAME) LIKE_REGEXPR '@SEARCH_QUERY' FLAG 'i'",
                        referenceExpression: "@REF.CONCEPT_NAME",
                        order: 8,
                        useRefValue: true,
                        useRefText: true,
                        cohortDefinitionKey: "ProcedureType",
                    },
                    procconceptcode: {
                        name: "Procedure concept code",
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
                            "@REF.DOMAIN_ID = 'Procedure' AND @REF.STANDARD_CONCEPT = 'S' AND (@REF.CONCEPT_CODE) LIKE_REGEXPR '@SEARCH_QUERY' FLAG 'i'",
                        referenceExpression: "@REF.CONCEPT_CODE",
                        order: 9,
                        useRefValue: true,
                        useRefText: true,
                    },
                    proctypeconceptcode: {
                        name: "Procedure type concept code",
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
                            "@REF.DOMAIN_ID = 'Type Concept' AND @REF.CONCEPT_CLASS_ID = 'Procedure Type' AND (@REF.CONCEPT_CODE) LIKE_REGEXPR '@SEARCH_QUERY' FLAG 'i'",
                        referenceExpression: "@REF.CONCEPT_CODE",
                        order: 10,
                        useRefValue: true,
                        useRefText: true,
                    },
                    modifierconceptcode: {
                        name: "Modifier concept code",
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
                        order: 11,
                    },
                    proctypeconceptid: {
                        name: "Procedure type concept id",
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
                            "@REF.DOMAIN_ID = 'Type Concept' AND @REF.CONCEPT_CLASS_ID = 'Procedure Type' AND CAST (@REF.CONCEPT_ID AS VARCHAR) LIKE_REGEXPR '@SEARCH_QUERY' FLAG 'i'",
                        referenceExpression:
                            "CAST (@REF.CONCEPT_ID AS VARCHAR)",
                        order: 12,
                        useRefValue: true,
                        useRefText: true,
                    },
                    proctypeconceptset: {
                        name: "Procedure type concept set",
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
                        type: "conceptSet",
                        expression:
                            'CAST (@PROC."PROCEDURE_TYPE_CONCEPT_ID" AS VARCHAR)',
                        order: 13,
                        useRefValue: true,
                        useRefText: true,
                    },
                    modifierconceptid: {
                        name: "Modifier concept id",
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
                        expression:
                            'CAST (@PROC."MODIFIER_CONCEPT_ID" AS VARCHAR)',
                        order: 14,
                    },
                    modifierconceptset: {
                        name: "Modifier concept set",
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
                        type: "conceptSet",
                        expression:
                            'CAST (@PROC."MODIFIER_CONCEPT_ID" AS VARCHAR)',
                        order: 15,
                    },
                },
                cohortDefinitionKey: "ProcedureOccurrence",
            },
            specimen: {
                name: "Specimen",
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
                        name: "Specimen type",
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
                            "@REF.DOMAIN_ID = 'Type Concept' AND @REF.CONCEPT_CLASS_ID = 'Specimen Type' AND (@REF.CONCEPT_NAME) LIKE_REGEXPR '@SEARCH_QUERY' FLAG 'i'",
                        referenceExpression: "@REF.CONCEPT_NAME",
                        order: 0,
                        useRefValue: true,
                        cohortDefinitionKey: "SpecimenType",
                    },
                    diseasestatus: {
                        name: "Disease status",
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
                            "@REF.DOMAIN_ID = 'Spec Disease Status' AND @REF.STANDARD_CONCEPT = 'S' AND (@REF.CONCEPT_NAME) LIKE_REGEXPR '@SEARCH_QUERY' FLAG 'i'",
                        referenceExpression: "@REF.CONCEPT_NAME",
                        order: 1,
                        useRefValue: true,
                        cohortDefinitionKey: "DiseaseStatus",
                    },
                    specimenname: {
                        name: "Specimen name",
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
                            "@REF.DOMAIN_ID = 'Specimen' AND @REF.STANDARD_CONCEPT = 'S' AND (@REF.CONCEPT_NAME) LIKE_REGEXPR '@SEARCH_QUERY' FLAG 'i'",
                        referenceExpression: "@REF.CONCEPT_NAME",
                        order: 2,
                        useRefValue: true,
                    },
                    anatomicsite: {
                        name: "Anatomic site",
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
                            "@REF.DOMAIN_ID = 'Spec Anatomic Site' AND @REF.STANDARD_CONCEPT = 'S' AND (@REF.CONCEPT_NAME) LIKE_REGEXPR '@SEARCH_QUERY' FLAG 'i'",
                        referenceExpression: "@REF.CONCEPT_NAME",
                        order: 3,
                        useRefValue: true,
                        cohortDefinitionKey: "AnatomicSite",
                    },
                    pid: {
                        name: "Patient Id",
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
                        order: 4,
                    },
                    specimenid: {
                        name: "Specimen Id",
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
                        expression: 'CAST (@SPEC."SPECIMEN_ID" AS VARCHAR)',
                        order: 5,
                    },
                    unit: {
                        name: "Unit",
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
                            "@REF.DOMAIN_ID = 'Unit' AND @REF.STANDARD_CONCEPT = 'S' AND (@REF.CONCEPT_NAME) LIKE_REGEXPR '@SEARCH_QUERY' FLAG 'i'",
                        referenceExpression: "@REF.CONCEPT_NAME",
                        order: 6,
                        useRefValue: true,
                        cohortDefinitionKey: "Unit",
                    },
                    quantity: {
                        name: "Quantity",
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
                        order: 7,
                        cohortDefinitionKey: "Quantity",
                    },
                    specimendatetime: {
                        name: "Specimen Date/Time",
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
                        order: 8,
                        cohortDefinitionKey: "OccurrenceStartDate",
                    },
                    specimendate: {
                        name: "Specimen Date",
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
                        order: 9,
                        cohortDefinitionKey: "OccurrenceStartDate",
                    },
                    specimenconceptcode: {
                        name: "Specimen concept code",
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
                            "@REF.DOMAIN_ID = 'Specimen' AND @REF.STANDARD_CONCEPT = 'S' AND (@REF.CONCEPT_CODE) LIKE_REGEXPR '@SEARCH_QUERY' FLAG 'i'",
                        referenceExpression: "@REF.CONCEPT_CODE",
                        order: 10,
                        useRefValue: true,
                        useRefText: true,
                    },
                    specimentypeconceptcode: {
                        name: "Specimen type concept code",
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
                            "@REF.DOMAIN_ID = 'Type Concept' AND @REF.CONCEPT_CLASS_ID = 'Specimen Type' AND (@REF.CONCEPT_CODE) LIKE_REGEXPR '@SEARCH_QUERY' FLAG 'i'",
                        referenceExpression: "@REF.CONCEPT_CODE",
                        order: 11,
                        useRefValue: true,
                        useRefText: true,
                    },
                    unitconceptcode: {
                        name: "Unit concept code",
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
                            "@REF.DOMAIN_ID = 'Unit' AND @REF.STANDARD_CONCEPT = 'S' AND (@REF.CONCEPT_CODE) LIKE_REGEXPR '@SEARCH_QUERY' FLAG 'i'",
                        referenceExpression: "@REF.CONCEPT_CODE",
                        order: 12,
                        useRefValue: true,
                        useRefText: true,
                    },
                    anatomicsiteconceptcode: {
                        name: "Anatomic site concept code",
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
                            "@REF.DOMAIN_ID = 'Spec Anatomic Site' AND @REF.STANDARD_CONCEPT = 'S' AND (@REF.CONCEPT_CODE) LIKE_REGEXPR '@SEARCH_QUERY' FLAG 'i'",
                        referenceExpression: "@REF.CONCEPT_CODE",
                        order: 13,
                        useRefValue: true,
                        useRefText: true,
                    },
                    diseasestatusconceptcode: {
                        name: "Disease status concept code",
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
                            "@REF.DOMAIN_ID = 'Spec Disease Status' AND @REF.STANDARD_CONCEPT = 'S' AND (@REF.CONCEPT_CODE) LIKE_REGEXPR '@SEARCH_QUERY' FLAG 'i'",
                        referenceExpression: "@REF.CONCEPT_CODE",
                        order: 14,
                        useRefValue: true,
                        useRefText: true,
                    },
                    specimenconceptid: {
                        name: "Specimen concept id",
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
                            "@REF.DOMAIN_ID = 'Specimen' AND @REF.STANDARD_CONCEPT = 'S' AND CAST (@REF.CONCEPT_ID AS VARCHAR) LIKE_REGEXPR '@SEARCH_QUERY' FLAG 'i'",
                        referenceExpression:
                            "CAST (@REF.CONCEPT_ID AS VARCHAR)",
                        order: 15,
                        useRefValue: true,
                        useRefText: true,
                    },
                    specimenconceptset: {
                        name: "Specimen concept set",
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
                        type: "conceptSet",
                        expression:
                            'CAST (@SPEC."SPECIMEN_CONCEPT_ID" AS VARCHAR)',
                        order: 16,
                        useRefValue: true,
                        useRefText: true,
                    },
                    specimentypeconceptid: {
                        name: "Specimen type concept id",
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
                            "@REF.DOMAIN_ID = 'Type Concept' AND @REF.CONCEPT_CLASS_ID = 'Specimen Type' AND CAST (@REF.CONCEPT_ID AS VARCHAR) LIKE_REGEXPR '@SEARCH_QUERY' FLAG 'i'",
                        referenceExpression:
                            "CAST (@REF.CONCEPT_ID AS VARCHAR)",
                        order: 17,
                        useRefValue: true,
                        useRefText: true,
                    },
                    specimentypeconceptset: {
                        name: "Specimen type concept set",
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
                        type: "conceptSet",
                        expression:
                            'CAST (@SPEC."SPECIMEN_TYPE_CONCEPT_ID" AS VARCHAR)',
                        order: 18,
                        useRefValue: true,
                        useRefText: true,
                        cohortDefinitionKey: "SpecimenType",
                    },
                    anatomicsiteconceptid: {
                        name: "Anatomic site concept id",
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
                            "@REF.DOMAIN_ID = 'Spec Anatomic Site' AND @REF.STANDARD_CONCEPT = 'S' AND CAST (@REF.CONCEPT_ID AS VARCHAR) LIKE_REGEXPR '@SEARCH_QUERY' FLAG 'i'",
                        referenceExpression:
                            "CAST (@REF.CONCEPT_ID AS VARCHAR)",
                        order: 19,
                        useRefValue: true,
                        useRefText: true,
                    },
                    anatomicsiteconceptset: {
                        name: "Anatomic site concept set",
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
                        type: "conceptSet",
                        expression:
                            'CAST (@SPEC."ANATOMIC_SITE_CONCEPT_ID" AS VARCHAR)',
                        order: 20,
                        useRefValue: true,
                        useRefText: true,
                    },
                    diseasestatusconceptid: {
                        name: "Disease status concept id",
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
                            "@REF.DOMAIN_ID = 'Spec Disease Status' AND @REF.STANDARD_CONCEPT = 'S' AND CAST (@REF.CONCEPT_ID AS VARCHAR) LIKE_REGEXPR '@SEARCH_QUERY' FLAG 'i'",
                        referenceExpression:
                            "CAST (@REF.CONCEPT_ID AS VARCHAR)",
                        order: 21,
                        useRefValue: true,
                        useRefText: true,
                    },
                    diseasestatusconceptset: {
                        name: "Disease status concept set",
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
                        type: "conceptSet",
                        expression:
                            'CAST (@SPEC."DISEASE_STATUS_CONCEPT_ID" AS VARCHAR)',
                        order: 22,
                        useRefValue: true,
                        useRefText: true,
                        cohortDefinitionKey: "DiseaseStatus",
                    },
                    unitconceptid: {
                        name: "Unit concept id",
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
                            "@REF.DOMAIN_ID = 'Unit' AND @REF.STANDARD_CONCEPT = 'S' AND CAST (@REF.CONCEPT_ID AS VARCHAR) LIKE_REGEXPR '@SEARCH_QUERY' FLAG 'i'",
                        referenceExpression:
                            "CAST (@REF.CONCEPT_ID AS VARCHAR)",
                        order: 23,
                        useRefValue: true,
                        useRefText: true,
                    },
                    unitconceptset: {
                        name: "Unit concept set",
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
                        type: "conceptSet",
                        expression: 'CAST (@SPEC."UNIT_CONCEPT_ID" AS VARCHAR)',
                        order: 24,
                        useRefValue: true,
                        useRefText: true,
                        cohortDefinitionKey: "Unit",
                    },
                },
                cohortDefinitionKey: "Specimen",
            },
            visit: {
                name: "Visit",
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
                        name: "End Date",
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
                        order: 0,
                        cohortDefinitionKey: "VisitDetailEndDate",
                    },
                    startdate: {
                        name: "Start Date",
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
                        order: 1,
                        cohortDefinitionKey: "VisitDetailStartDate",
                    },
                    pid: {
                        name: "Patient Id",
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
                        order: 2,
                    },
                    visittype: {
                        name: "Visit type",
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
                            "@REF.DOMAIN_ID = 'Type Concept' AND @REF.CONCEPT_CLASS_ID = 'Visit Type' AND (@REF.CONCEPT_NAME) LIKE_REGEXPR '@SEARCH_QUERY' FLAG 'i'",
                        referenceExpression: "@REF.CONCEPT_NAME",
                        order: 3,
                        useRefValue: true,
                        cohortDefinitionKey: "VisitDetailTypeCS",
                    },
                    visitname: {
                        name: "Visit name",
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
                            "@REF.DOMAIN_ID = 'Visit' AND @REF.STANDARD_CONCEPT = 'S' AND (@REF.CONCEPT_NAME) LIKE_REGEXPR '@SEARCH_QUERY' FLAG 'i'",
                        referenceExpression: "@REF.CONCEPT_NAME",
                        order: 4,
                        useRefValue: true,
                    },
                    visitid: {
                        name: "Visit occurrence Id",
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
                        expression:
                            'CAST (@VISIT."VISIT_OCCURRENCE_ID" AS VARCHAR)',
                        order: 5,
                    },
                    visitconceptcode: {
                        name: "Visit concept code",
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
                            "@REF.DOMAIN_ID = 'Visit' AND @REF.STANDARD_CONCEPT = 'S' AND (@REF.CONCEPT_CODE) LIKE_REGEXPR '@SEARCH_QUERY' FLAG 'i'",
                        referenceExpression: "@REF.CONCEPT_CODE",
                        order: 6,
                        useRefValue: true,
                        useRefText: true,
                    },
                    visittypeconceptcode: {
                        name: "Visit type concept code",
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
                            "@REF.DOMAIN_ID = 'Type Concept' AND @REF.CONCEPT_CLASS_ID = 'Visit Type' AND (@REF.CONCEPT_CODE) LIKE_REGEXPR '@SEARCH_QUERY' FLAG 'i'",
                        referenceExpression: "@REF.CONCEPT_CODE",
                        order: 7,
                        useRefValue: true,
                        useRefText: true,
                    },
                    visittypeconceptset: {
                        name: "Visit type concept set",
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
                        type: "conceptSet",
                        expression:
                            'CAST (@VISIT."VISIT_TYPE_CONCEPT_ID" AS VARCHAR)',
                        order: 8,
                        useRefValue: true,
                        useRefText: true,
                    },
                    visitconceptid: {
                        name: "Visit concept Id",
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
                            "@REF.DOMAIN_ID = 'Visit' AND @REF.STANDARD_CONCEPT = 'S' AND CAST (@REF.CONCEPT_ID AS VARCHAR) LIKE_REGEXPR '@SEARCH_QUERY' FLAG 'i'",
                        referenceExpression:
                            "CAST (@REF.CONCEPT_ID AS VARCHAR)",
                        order: 9,
                        useRefValue: true,
                        useRefText: true,
                    },
                    visitconceptset: {
                        name: "Visit concept set",
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
                        type: "conceptSet",
                        expression:
                            'CAST (@VISIT."VISIT_CONCEPT_ID" AS VARCHAR)',
                        order: 10,
                        useRefValue: true,
                        useRefText: true,
                    },
                    visittypeconceptid: {
                        name: "Visit type concept id",
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
                        expression:
                            'CAST (@VISIT."VISIT_TYPE_CONCEPT_ID" AS VARCHAR)',
                        order: 11,
                        useRefValue: true,
                        useRefText: true,
                    },
                },
                cohortDefinitionKey: "VisitDetail",
            },
            Consent_74db26d2_bb75_489a_a841_051c85dc897b: {
                name: "Consent",
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
                        name: "Consent Date/Time",
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
                        order: 0,
                    },
                    pid: {
                        name: "Patient Id",
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
                        order: 1,
                    },
                    parentconsentdetailid: {
                        name: "Parent Consent Detail Id",
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
                        expression:
                            'CAST (@CONSENT."PARENT_CONSENT_DETAIL_ID" AS VARCHAR)',
                        order: 2,
                    },
                    status: {
                        name: "Status",
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
                        order: 3,
                    },
                    textval: {
                        name: "Value",
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
                        order: 4,
                    },
                    consentcategory: {
                        name: "Category",
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
                        order: 5,
                    },
                    New_Attribute_1_3d0da2a3_f0de_4112_b87c_e7aff266c0d8: {
                        name: "Attribute",
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
                        order: 6,
                    },
                    Attribute_copy_53f290b7_70e9_4c1e_bd6d_605bc916ce66: {
                        name: "Attribute Group Id",
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
                        order: 7,
                    },
                    Consent_Id_copy_60a4adeb_1e84_4f04_b7d5_8eb1c006f56d: {
                        name: "Consent Detail Id",
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
                        order: 8,
                    },
                },
            },
            questionnaire: {
                name: "Questionnaire",
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
                        name: "Link ID",
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
                        name: "Value coding value",
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
                        name: "Record ID",
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
                        order: 2,
                    },
                    questionnaireLanguage: {
                        name: "Questionnaire language",
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
                        order: 3,
                    },
                    questionnaireStatus: {
                        name: "Questionnaire status",
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
                        order: 4,
                    },
                    questionnaireAuthored: {
                        name: "Questionnaire authored",
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
                        order: 5,
                    },
                    text: {
                        name: "Text",
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
                        order: 6,
                    },
                    valueType: {
                        name: "Value type",
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
                        order: 7,
                    },
                    value: {
                        name: "Value",
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
                        order: 8,
                    },
                    questionnaireReference: {
                        name: "Questionnaire reference",
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
                        name: "Questionnaire version",
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
                        name: "Questionaire extension effective date url",
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
                        name: "Questionaire extension valuedate",
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
                name: "Participation Token",
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
                        name: "Participation Token Id",
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
                        name: "Participation Token Study Id",
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
                        name: "Participation Token External Id",
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
                        name: "Participation Token",
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
                        name: "Participant Token Created By",
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
                        name: "Participant Token Created Date",
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
                        name: "Participation Token Modified By",
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
                        name: "Participation Token Modified Date",
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
                        name: "Participation Token Status",
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
                        name: "Participation Token Last Donation Date",
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
                        name: "Participation Token Validation Date",
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
                        name: "Participation Token Person Id",
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
            cohort: {
                name: "Cohort",
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
                defaultPlaceholder: "@COHORT",
                order: 17,
                parentInteraction: [],
                parentInteractionLabel: "parent",
                attributes: {
                    cohortdefinitionid: {
                        name: "Cohort ID",
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
                        expression: "@COHORT.cohort_definition_id",
                        order: 0,
                        useRefValue: true,
                        useRefText: true,
                    },
                    pid: {
                        name: "Patient Id",
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
                        expression: "CAST (@COHORT.subject_id AS VARCHAR)",
                        order: 1,
                    },
                    enddate: {
                        name: "End Date",
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
                        expression: "@COHORT.cohort_end_date",
                        order: 2,
                    },
                    startdate: {
                        name: "Start Date",
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
                        expression: "@COHORT.cohort_start_date",
                        order: 3,
                    },
                },
            },
        },
        attributes: {
            pid: {
                name: "Patient ID",
                disabledLangName: [],
                type: "text",
                expression: 'CAST (@PATIENT."PATIENT_ID" AS VARCHAR)',
                order: 0,
                annotations: ["patient_id"],
            },
            pcount: {
                name: "Patient Count",
                disabledLangName: [],
                type: "num",
                measureExpression: 'COUNT(DISTINCT(@PATIENT."PATIENT_ID"))',
                order: 1,
            },
            monthOfBirth: {
                name: "Month of Birth",
                disabledLangName: [],
                type: "num",
                expression: '@PATIENT."MONTH_OF_BIRTH"',
                order: 2,
            },
            yearOfBirth: {
                name: "Year of Birth",
                disabledLangName: [],
                type: "num",
                expression: '@PATIENT."YEAR_OF_BIRTH"',
                order: 3,
            },
            dateOfBirth: {
                name: "Date of Birth",
                disabledLangName: [],
                type: "datetime",
                expression: '@PATIENT."BIRTH_DATE"',
                order: 4,
                annotations: ["date_of_birth"],
            },
            dateOfDeath: {
                name: "Date of Death",
                disabledLangName: [],
                type: "datetime",
                expression: '@PATIENT."DEATH_DATE"',
                order: 5,
                annotations: ["date_of_death"],
            },
            Race: {
                name: "Race",
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
                    "@REF.DOMAIN_ID = 'Race' AND @REF.STANDARD_CONCEPT = 'S' AND (@REF.CONCEPT_NAME) LIKE_REGEXPR '@SEARCH_QUERY' FLAG 'i'",
                referenceExpression: "@REF.CONCEPT_NAME",
                order: 6,
                useRefValue: true,
                cohortDefinitionKey: "Race",
                conceptIdentifierType: "name",
            },
            Gender: {
                name: "Gender",
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
                    "@REF.DOMAIN_ID = 'Gender' AND @REF.STANDARD_CONCEPT = 'S' AND (@REF.CONCEPT_NAME) LIKE_REGEXPR '@SEARCH_QUERY' FLAG 'i'",
                referenceExpression: "@REF.CONCEPT_NAME",
                order: 7,
                useRefValue: true,
                cohortDefinitionKey: "Gender",
                conceptIdentifierType: "name",
            },
            Ethnicity: {
                name: "Ethnicity",
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
                    "@REF.DOMAIN_ID = 'Ethnicity' AND @REF.STANDARD_CONCEPT = 'S' AND (@REF.CONCEPT_NAME) LIKE_REGEXPR '@SEARCH_QUERY' FLAG 'i'",
                referenceExpression: "@REF.CONCEPT_NAME",
                order: 8,
                useRefValue: true,
                cohortDefinitionKey: "Ethnicity",
                conceptIdentifierType: "name",
            },
            State: {
                name: "State",
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
                order: 9,
            },
            County: {
                name: "County",
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
                order: 10,
            },
            genderconceptcode: {
                name: "Gender concept code",
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
                    "@REF.DOMAIN_ID = 'Gender' AND @REF.STANDARD_CONCEPT = 'S' AND (@REF.CONCEPT_CODE) LIKE_REGEXPR '@SEARCH_QUERY' FLAG 'i'",
                referenceExpression: "@REF.CONCEPT_CODE",
                order: 11,
                useRefValue: true,
                useRefText: true,
                cohortDefinitionKey: "Gender",
                conceptIdentifierType: "code",
            },
            raceconceptcode: {
                name: "Race concept code",
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
                    "@REF.DOMAIN_ID = 'Race' AND @REF.STANDARD_CONCEPT = 'S' AND (@REF.CONCEPT_CODE) LIKE_REGEXPR '@SEARCH_QUERY' FLAG 'i'",
                referenceExpression: "@REF.CONCEPT_CODE",
                order: 12,
                useRefValue: true,
                useRefText: true,
                cohortDefinitionKey: "Race",
                conceptIdentifierType: "code",
            },
            ethnicityconceptcode: {
                name: "Ethnicity concept code",
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
                    "@REF.DOMAIN_ID = 'Ethnicity' AND @REF.STANDARD_CONCEPT = 'S' AND (@REF.CONCEPT_CODE) LIKE_REGEXPR '@SEARCH_QUERY' FLAG 'i'",
                referenceExpression: "@REF.CONCEPT_CODE",
                order: 13,
                useRefValue: true,
                useRefText: true,
                cohortDefinitionKey: "Ethnicity",
                conceptIdentifierType: "code",
            },
            ethnicityconceptset: {
                name: "Ethnicity concept set",
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
                type: "conceptSet",
                expression: '@PATIENT."ETHNICITY_CONCEPT_ID"',
                order: 14,
                useRefValue: true,
                useRefText: true,
                cohortDefinitionKey: "Ethnicity",
                conceptIdentifierType: "",
            },
            lastAuthoredDate: {
                name: "Last authored date",
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
                order: 15,
            },
            genderconceptid: {
                name: "Gender concept id",
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
                    "@REF.DOMAIN_ID = 'Gender' AND @REF.STANDARD_CONCEPT = 'S' AND CAST (@REF.CONCEPT_ID AS VARCHAR) LIKE_REGEXPR '@SEARCH_QUERY' FLAG 'i'",
                referenceExpression: "@REF.CONCEPT_ID",
                order: 16,
                useRefValue: true,
                useRefText: true,
                cohortDefinitionKey: "Gender",
                conceptIdentifierType: "id",
            },
            genderconceptset: {
                name: "Gender concept set",
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
                type: "conceptSet",
                expression: '@PATIENT."GENDER_CONCEPT_ID"',
                order: 17,
                useRefValue: true,
                useRefText: true,
                cohortDefinitionKey: "Gender",
                conceptIdentifierType: "",
            },
            raceconceptid: {
                name: "Race concept id",
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
                    "@REF.DOMAIN_ID = 'Race' AND @REF.STANDARD_CONCEPT = 'S' AND CAST (@REF.CONCEPT_ID AS VARCHAR) LIKE_REGEXPR '@SEARCH_QUERY' FLAG 'i'",
                referenceExpression: "@REF.CONCEPT_ID",
                order: 18,
                useRefValue: true,
                useRefText: true,
            },
            raceconceptset: {
                name: "Race concept set",
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
                type: "conceptSet",
                expression: '@PATIENT."RACE_CONCEPT_ID"',
                order: 19,
                useRefValue: true,
                useRefText: true,
            },
            status: {
                name: "Status",
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
                order: 20,
            },
            externalid: {
                name: "External ID",
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
                order: 21,
            },
            Age: {
                name: "Age",
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
                order: 22,
                cohortDefinitionKey: "Age",
            },
            groupID: {
                name: "Group ID",
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
                order: 23,
            },
            alpid: {
                name: "ALP ID",
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
                order: 24,
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
                {
                    placeholder: "@COHORT",
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
            "@PROC.START": '"PROCEDURE_START_DATE"',
            "@PROC.END": '"PROCEDURE_END_DATE"',
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
            "@REF": "$$VOCAB_SCHEMA$$.CONCEPT",
            "@REF.VOCABULARY_ID": '"VOCABULARY_ID"',
            "@REF.CODE": "CONCEPT_ID",
            "@REF.TEXT": "CONCEPT_NAME",
            "@TEXT": '$$VOCAB_SCHEMA$$."CONCEPT"',
            "@TEXT.INTERACTION_ID": "CONCEPT_ID",
            "@TEXT.INTERACTION_TEXT_ID": "CONCEPT_ID",
            "@TEXT.VALUE": "CONCEPT_NAME",
            "@COHORT": "$$SCHEMA$$.cohort",
            "@COHORT.PATIENT_ID": "subject_id",
            "@COHORT.INTERACTION_TYPE": "cohort_definition_id",
            "@COHORT.INTERACTION_ID": "cohort_definition_id",
            "@COHORT.CONDITION_ID": "cohort_definition_id",
            "@COHORT.PARENT_INTERACT_ID": "subject_id",
            "@COHORT.START": "cohort_start_date",
            "@COHORT.END": "cohort_end_date",
        },
        guardedTableMapping: {
            "@PATIENT": '$$SCHEMA$$."VIEW::OMOP.GDM.PATIENT"',
        },
        ohdsiCohortDefinitionTableMapping: {
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
                "@CODE": '$$VOCAB_SCHEMA$$."CONCEPT"',
            },
        },
        shared: {},
        schemaVersion: "3",
    },
};
