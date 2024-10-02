const he = {
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
                order: 17,
                parentInteraction: [],
                parentInteractionLabel: "parent",
                attributes: {
                    startdate: {
                        name: [
                            {
                                lang: "",
                                value: "Condition Era Start Date",
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
                        order: 1,
                        domainFilter: "",
                        standardConceptCodeFilter: "",
                        cohortDefinitionKey: "EraStartDate",
                    },
                    enddate: {
                        name: [
                            {
                                lang: "",
                                value: "Condition Era End Date",
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
                        order: 2,
                        domainFilter: "",
                        standardConceptCodeFilter: "",
                        cohortDefinitionKey: "EraEndDate",
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
                        order: 3,
                        domainFilter: "",
                        standardConceptCodeFilter: "",
                    },
                    pid: {
                        name: [
                            {
                                lang: "",
                                value: "Person id",
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
                        expression: "@CONDERA.person_id",
                        order: 4,
                        domainFilter: "",
                        standardConceptCodeFilter: "",
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
                        order: 5,
                        domainFilter: "",
                        standardConceptCodeFilter: "",
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
                            "@REF.DOMAIN_ID = 'Condition' AND @REF.STANDARD_CONCEPT = 'S' AND JARO_SIMILARITY(CAST(@REF.CONCEPT_ID AS VARCHAR), '@SEARCH_QUERY') >= 0.85",
                        referenceExpression: "@REF.CONCEPT_ID",
                        order: 7,
                        domainFilter: "",
                        standardConceptCodeFilter: "",
                        useRefValue: true,
                        useRefText: true,
                    },
                    Condition_era_concept_set: {
                        name: [
                            {
                                lang: "",
                                value: "Condition concept set",
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
                        type: "conceptSet",
                        expression: '@CONDERA."CONDITION_CONCEPT_ID"',
                        _referenceFilter:
                            "@REF.DOMAIN_ID = 'Condition' AND @REF.STANDARD_CONCEPT = 'S' AND JARO_SIMILARITY(CAST(@REF.CONCEPT_ID AS VARCHAR), '@SEARCH_QUERY') >= 0.85",
                        _referenceExpression: "@REF.CONCEPT_ID",
                        order: 8,
                        domainFilter: "",
                        standardConceptCodeFilter: "",
                        useRefValue: true,
                        useRefText: true,
                    },
                },
                cohortDefinitionKey: "ConditionEra",
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
                order: 16,
                parentInteraction: ["patient.interactions.visit"],
                parentInteractionLabel: "Visit Occurrence Parent",
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
                        order: 1,
                        domainFilter: "",
                        standardConceptCodeFilter: "",
                    },
                    enddate: {
                        name: [
                            {
                                lang: "",
                                value: "Condition End Date",
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
                        order: 2,
                        domainFilter: "",
                        standardConceptCodeFilter: "",
                        cohortDefinitionKey: "OccurrenceEndDate",
                    },
                    startdate: {
                        name: [
                            {
                                lang: "",
                                value: "Condition Start Date",
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
                        order: 3,
                        domainFilter: "",
                        standardConceptCodeFilter: "",
                        cohortDefinitionKey: "OccurrenceStartDate",
                    },
                    pid: {
                        name: [
                            {
                                lang: "",
                                value: "Person id",
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
                        expression: "@COND.person_id",
                        order: 4,
                        domainFilter: "",
                        standardConceptCodeFilter: "",
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
                        order: 9,
                        domainFilter: "",
                        standardConceptCodeFilter: "",
                    },
                    conditiontypeconceptset: {
                        name: [
                            {
                                lang: "",
                                value: "Condition Type concept set",
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
                        type: "conceptSet",
                        expression: '@COND."CONDITION_TYPE_CONCEPT_ID"',
                        order: 12,
                        domainFilter: "",
                        standardConceptCodeFilter: "",
                        useRefValue: true,
                        useRefText: true,
                    },
                    conditionsourceconceptset: {
                        name: [
                            {
                                lang: "",
                                value: "Condition Source concept set",
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
                        type: "conceptSet",
                        expression: '@COND."CONDITION_SOURCE_CONCEPT_ID"',
                        order: 14,
                        domainFilter: "",
                        standardConceptCodeFilter: "",
                    },
                    conditionstatusconceptset: {
                        name: [
                            {
                                lang: "",
                                value: "Condition Status concept set",
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
                        type: "conceptSet",
                        expression: '@COND."CONDITION_STATUS_CONCEPT_ID"',
                        order: 16,
                        domainFilter: "",
                        standardConceptCodeFilter: "",
                        useRefValue: true,
                        useRefText: true,
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
                            "@REF.DOMAIN_ID = 'Condition' AND @REF.STANDARD_CONCEPT = 'S' AND JARO_SIMILARITY(CAST(@REF.CONCEPT_ID AS VARCHAR), '@SEARCH_QUERY') >= 0.85",
                        referenceExpression: "@REF.CONCEPT_ID",
                        order: 17,
                        domainFilter: "",
                        standardConceptCodeFilter: "",
                        useRefValue: true,
                        useRefText: true,
                    },
                    conditionconceptset: {
                        name: [
                            {
                                lang: "",
                                value: "Condition concept set",
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
                        type: "conceptSet",
                        expression: '@COND."CONDITION_CONCEPT_ID"',
                        order: 18,
                        domainFilter: "",
                        standardConceptCodeFilter: "",
                        useRefValue: true,
                        useRefText: true,
                    },
                    conditiontypeconceptid: {
                        name: [
                            {
                                lang: "",
                                value: "Condition Type concept id",
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
                        expression: '@COND."CONDITION_TYPE_CONCEPT_ID"',
                        referenceFilter:
                            "@REF.DOMAIN_ID = 'Type Concept' AND @REF.CONCEPT_CLASS_ID = 'Condition Type' AND JARO_SIMILARITY(CAST(@REF.CONCEPT_ID AS VARCHAR), '@SEARCH_QUERY') >= 0.85",
                        referenceExpression: "@REF.CONCEPT_ID",
                        order: 19,
                        domainFilter: "",
                        standardConceptCodeFilter: "",
                        useRefValue: true,
                        useRefText: true,
                    },
                    conditionsourceconceptid: {
                        name: [
                            {
                                lang: "",
                                value: "Condition Source concept id",
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
                        expression: '@COND."CONDITION_SOURCE_CONCEPT_ID"',
                        order: 20,
                        domainFilter: "",
                        standardConceptCodeFilter: "",
                    },
                    conditionstatusconceptid: {
                        name: [
                            {
                                lang: "",
                                value: "Condition Status concept id",
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
                        expression: '@COND."CONDITION_STATUS_CONCEPT_ID"',
                        referenceFilter:
                            "@REF.DOMAIN_ID = 'Condition Status' AND JARO_SIMILARITY(CAST(@REF.CONCEPT_ID AS VARCHAR), '@SEARCH_QUERY') >= 0.85",
                        referenceExpression: "@REF.CONCEPT_ID",
                        order: 21,
                        domainFilter: "",
                        standardConceptCodeFilter: "",
                        useRefValue: true,
                        useRefText: true,
                    },
                    condition_occ_concept_name: {
                        name: [
                            {
                                lang: "",
                                value: "Condition concept Name",
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
                        expression: "@REF.concept_name",
                        defaultPlaceholder: "@REF",
                        defaultFilter:
                            "@REF.concept_id = @COND.condition_concept_id",
                        referenceFilter:
                            "@REF.DOMAIN_ID = 'Condition' AND @REF.STANDARD_CONCEPT = 'S' AND JARO_SIMILARITY(lower(@REF.CONCEPT_NAME), lower('@SEARCH_QUERY')) >= 0.65",
                        referenceExpression: "@REF.CONCEPT_NAME",
                        order: 0,
                        domainFilter: "",
                        standardConceptCodeFilter: "",
                    },
                },
                cohortDefinitionKey: "ConditionOccurrence",
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
                order: 15,
                parentInteraction: [],
                parentInteractionLabel: "parent",
                attributes: {
                    deathtypeconceptset: {
                        name: [
                            {
                                lang: "",
                                value: "Death Type concept set",
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
                        type: "conceptSet",
                        expression: '@DEATH."DEATH_TYPE_CONCEPT_ID"',
                        order: 2,
                        domainFilter: "",
                        standardConceptCodeFilter: "",
                        useRefValue: true,
                        useRefText: true,
                    },
                    pid: {
                        name: [
                            {
                                lang: "",
                                value: "Person id",
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
                        expression: "@DEATH.person_id",
                        order: 3,
                        domainFilter: "",
                        standardConceptCodeFilter: "",
                    },
                    deathdatetime: {
                        name: [
                            {
                                lang: "",
                                value: "Death Datetime",
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
                        order: 4,
                        domainFilter: "",
                        standardConceptCodeFilter: "",
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
                        order: 5,
                        domainFilter: "",
                        standardConceptCodeFilter: "",
                        cohortDefinitionKey: "OccurrenceStartDate",
                    },
                    deathtypeconceptid: {
                        name: [
                            {
                                lang: "",
                                value: "Death Type concept id",
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
                        expression: '@DEATH."DEATH_TYPE_CONCEPT_ID"',
                        referenceFilter:
                            "@REF.DOMAIN_ID = 'Type Concept' AND @REF.CONCEPT_CLASS_ID = 'Death Type' AND JARO_SIMILARITY(CAST(@REF.CONCEPT_ID AS VARCHAR), '@SEARCH_QUERY') >= 0.85",
                        referenceExpression: "@REF.CONCEPT_ID",
                        order: 7,
                        domainFilter: "",
                        standardConceptCodeFilter: "",
                        useRefValue: true,
                        useRefText: true,
                    },
                    death_type_concept_name: {
                        name: [
                            {
                                lang: "",
                                value: "Death Type concept name",
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
                        expression: "@REF.concept_name",
                        defaultPlaceholder: "@REF",
                        defaultFilter:
                            "@REF.concept_id = @DEATH.DEATH_TYPE_CONCEPT_ID",
                        order: 0,
                        domainFilter: "",
                        standardConceptCodeFilter: "",
                        cohortDefinitionKey: "DeathType",
                    },
                },
                cohortDefinitionKey: "Death",
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
                order: 14,
                parentInteraction: ["patient.interactions.visit"],
                parentInteractionLabel: "Visit Occurrence Parent",
                attributes: {
                    enddate: {
                        name: [
                            {
                                lang: "",
                                value: "Device Exposure End Date",
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
                        order: 1,
                        domainFilter: "",
                        standardConceptCodeFilter: "",
                        cohortDefinitionKey: "OccurrenceEndDate",
                    },
                    startdate: {
                        name: [
                            {
                                lang: "",
                                value: "Device Exposure Start Date",
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
                        order: 2,
                        domainFilter: "",
                        standardConceptCodeFilter: "",
                        cohortDefinitionKey: "OccurrenceStartDate",
                    },
                    pid: {
                        name: [
                            {
                                lang: "",
                                value: "Person id",
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
                        expression: "@DEVEXP.person_id",
                        order: 4,
                        domainFilter: "",
                        standardConceptCodeFilter: "",
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
                        order: 5,
                        domainFilter: "",
                        standardConceptCodeFilter: "",
                    },
                    devicetypeconceptset: {
                        name: [
                            {
                                lang: "",
                                value: "Device Type concept set",
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
                        type: "conceptSet",
                        expression: '@DEVEXP."DEVICE_TYPE_CONCEPT_ID"',
                        order: 9,
                        domainFilter: "",
                        standardConceptCodeFilter: "",
                        useRefValue: true,
                        useRefText: true,
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
                            "@REF.DOMAIN_ID = 'Device' AND @REF.STANDARD_CONCEPT = 'S' AND JARO_SIMILARITY(CAST(@REF.CONCEPT_ID AS VARCHAR), '@SEARCH_QUERY') >= 0.85",
                        referenceExpression: "@REF.CONCEPT_ID",
                        order: 10,
                        domainFilter: "",
                        standardConceptCodeFilter: "",
                        useRefValue: true,
                        useRefText: true,
                    },
                    deviceconceptset: {
                        name: [
                            {
                                lang: "",
                                value: "Device concept set",
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
                        type: "conceptSet",
                        expression: '@DEVEXP."DEVICE_CONCEPT_ID"',
                        order: 11,
                        domainFilter: "",
                        standardConceptCodeFilter: "",
                        useRefValue: true,
                        useRefText: true,
                    },
                    devicetypeconceptid: {
                        name: [
                            {
                                lang: "",
                                value: "Device Type concept id",
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
                        expression: '@DEVEXP."DEVICE_TYPE_CONCEPT_ID"',
                        referenceFilter:
                            "@REF.DOMAIN_ID = 'Type Concept' AND @REF.CONCEPT_CLASS_ID = 'Device Type' AND JARO_SIMILARITY(CAST(@REF.CONCEPT_ID AS VARCHAR), '@SEARCH_QUERY') >= 0.85",
                        referenceExpression: "@REF.CONCEPT_ID",
                        order: 12,
                        domainFilter: "",
                        standardConceptCodeFilter: "",
                        useRefValue: true,
                        useRefText: true,
                    },
                    device_concept_name: {
                        name: [
                            {
                                lang: "",
                                value: "Device concept name",
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
                        expression: "@REF.concept_name",
                        defaultPlaceholder: "@REF",
                        defaultFilter:
                            "@REF.concept_id = @DEVEXP.device_concept_id",
                        referenceFilter:
                            "@REF.DOMAIN_ID = 'Device' AND @REF.STANDARD_CONCEPT = 'S' AND JARO_SIMILARITY(lower(@REF.CONCEPT_NAME), lower('@SEARCH_QUERY')) >= 0.65",
                        referenceExpression: "@REF.CONCEPT_NAME",
                        order: 0,
                        domainFilter: "",
                        standardConceptCodeFilter: "",
                    },
                },
                cohortDefinitionKey: "DeviceExposure",
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
                order: 13,
                parentInteraction: [],
                parentInteractionLabel: "parent",
                attributes: {
                    pid: {
                        name: [
                            {
                                lang: "",
                                value: "Person id",
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
                        expression: "@DOSEERA.person_id",
                        order: 2,
                        domainFilter: "",
                        standardConceptCodeFilter: "",
                    },
                    enddate: {
                        name: [
                            {
                                lang: "",
                                value: "Dose Era End Date",
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
                        order: 3,
                        domainFilter: "",
                        standardConceptCodeFilter: "",
                        cohortDefinitionKey: "EraEndDate",
                    },
                    startdate: {
                        name: [
                            {
                                lang: "",
                                value: "Dose Era Start Date",
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
                        order: 4,
                        domainFilter: "",
                        standardConceptCodeFilter: "",
                        cohortDefinitionKey: "EraStartDate",
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
                        order: 5,
                        domainFilter: "",
                        standardConceptCodeFilter: "",
                        cohortDefinitionKey: "DoseValue",
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
                        order: 6,
                        domainFilter: "",
                        standardConceptCodeFilter: "",
                    },
                    drugconceptset: {
                        name: [
                            {
                                lang: "",
                                value: "Drug concept set",
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
                        type: "conceptSet",
                        expression: '@DOSEERA."DRUG_CONCEPT_ID"',
                        order: 8,
                        domainFilter: "",
                        standardConceptCodeFilter: "",
                        useRefValue: true,
                        useRefText: true,
                    },
                    unitconceptset: {
                        name: [
                            {
                                lang: "",
                                value: "Unit concept set",
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
                        type: "conceptSet",
                        expression: '@DOSEERA."UNIT_CONCEPT_ID"',
                        order: 10,
                        domainFilter: "",
                        standardConceptCodeFilter: "",
                        useRefValue: true,
                        useRefText: true,
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
                        expression: '@DOSEERA."DRUG_CONCEPT_ID"',
                        referenceFilter:
                            "@REF.DOMAIN_ID = 'Drug' AND @REF.STANDARD_CONCEPT = 'S' AND JARO_SIMILARITY(CAST(@REF.CONCEPT_ID AS VARCHAR), '@SEARCH_QUERY') >= 0.85",
                        referenceExpression: "@REF.CONCEPT_ID",
                        order: 11,
                        domainFilter: "",
                        standardConceptCodeFilter: "",
                        useRefValue: true,
                        useRefText: true,
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
                        expression: '@DOSEERA."UNIT_CONCEPT_ID"',
                        referenceFilter:
                            "@REF.DOMAIN_ID = 'Unit' AND @REF.STANDARD_CONCEPT = 'S' AND JARO_SIMILARITY(CAST(@REF.CONCEPT_ID AS VARCHAR), '@SEARCH_QUERY') >= 0.85",
                        referenceExpression: "@REF.CONCEPT_ID",
                        order: 12,
                        domainFilter: "",
                        standardConceptCodeFilter: "",
                        useRefValue: true,
                        useRefText: true,
                    },
                },
                cohortDefinitionKey: "DoseEra",
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
                order: 12,
                parentInteraction: [],
                parentInteractionLabel: "parent",
                attributes: {
                    enddate: {
                        name: [
                            {
                                lang: "",
                                value: "Drug Era End Date",
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
                        order: 0,
                        domainFilter: "",
                        standardConceptCodeFilter: "",
                        cohortDefinitionKey: "EraEndDate",
                    },
                    startdate: {
                        name: [
                            {
                                lang: "",
                                value: "Drug Era Start Date",
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
                        order: 1,
                        domainFilter: "",
                        standardConceptCodeFilter: "",
                        cohortDefinitionKey: "EraStartDate",
                    },
                    pid: {
                        name: [
                            {
                                lang: "",
                                value: "Person id",
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
                        expression: "@DRUGERA.person_id",
                        order: 3,
                        domainFilter: "",
                        standardConceptCodeFilter: "",
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
                        order: 4,
                        domainFilter: "",
                        standardConceptCodeFilter: "",
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
                        order: 5,
                        domainFilter: "",
                        standardConceptCodeFilter: "",
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
                        order: 6,
                        domainFilter: "",
                        standardConceptCodeFilter: "",
                    },
                    drugconceptset: {
                        name: [
                            {
                                lang: "",
                                value: "Drug concept set",
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
                        type: "conceptSet",
                        expression: '@DRUGERA."DRUG_CONCEPT_ID"',
                        order: 8,
                        domainFilter: "",
                        standardConceptCodeFilter: "",
                        useRefValue: true,
                        useRefText: true,
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
                        expression: '@DRUGERA."DRUG_CONCEPT_ID"',
                        referenceFilter:
                            "@REF.DOMAIN_ID = 'Drug' AND @REF.STANDARD_CONCEPT = 'S' AND JARO_SIMILARITY(CAST(@REF.CONCEPT_ID AS VARCHAR), '@SEARCH_QUERY') >= 0.85",
                        referenceExpression: "@REF.CONCEPT_ID",
                        order: 9,
                        domainFilter: "",
                        standardConceptCodeFilter: "",
                        useRefValue: true,
                        useRefText: true,
                    },
                },
                cohortDefinitionKey: "DrugEra",
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
                order: 11,
                parentInteraction: ["patient.interactions.visit"],
                parentInteractionLabel: "Visit Occurrence Parent",
                attributes: {
                    enddatetime: {
                        name: [
                            {
                                lang: "",
                                value: "Drug Exposure End Datetime",
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
                        order: 1,
                        domainFilter: "",
                        standardConceptCodeFilter: "",
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
                        order: 2,
                        domainFilter: "",
                        standardConceptCodeFilter: "",
                        cohortDefinitionKey: "Refills",
                    },
                    startdatetime: {
                        name: [
                            {
                                lang: "",
                                value: "Drug Exposure Start Datetime",
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
                        order: 3,
                        domainFilter: "",
                        standardConceptCodeFilter: "",
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
                        order: 4,
                        domainFilter: "",
                        standardConceptCodeFilter: "",
                    },
                    enddate: {
                        name: [
                            {
                                lang: "",
                                value: "Drug Exposure End Date",
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
                        order: 5,
                        domainFilter: "",
                        standardConceptCodeFilter: "",
                        cohortDefinitionKey: "OccurrenceEndDate",
                    },
                    startdate: {
                        name: [
                            {
                                lang: "",
                                value: "Drug Exposure Start Date",
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
                        order: 7,
                        domainFilter: "",
                        standardConceptCodeFilter: "",
                        cohortDefinitionKey: "OccurrenceStartDate",
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
                        order: 9,
                        domainFilter: "",
                        standardConceptCodeFilter: "",
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
                        order: 11,
                        domainFilter: "",
                        standardConceptCodeFilter: "",
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
                        expression: '@DRUGEXP."SIG"',
                        order: 12,
                        domainFilter: "",
                        standardConceptCodeFilter: "",
                    },
                    pid: {
                        name: [
                            {
                                lang: "",
                                value: "Person id",
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
                        expression: "@DRUGEXP.person_id",
                        order: 13,
                        domainFilter: "",
                        standardConceptCodeFilter: "",
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
                        order: 14,
                        domainFilter: "",
                        standardConceptCodeFilter: "",
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
                        order: 15,
                        domainFilter: "",
                        standardConceptCodeFilter: "",
                        cohortDefinitionKey: "DaysSupply",
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
                            "@REF.DOMAIN_ID = 'Drug' AND @REF.STANDARD_CONCEPT = 'S' AND JARO_SIMILARITY(lower(@REF.CONCEPT_NAME), lower('@SEARCH_QUERY')) >= 0.65",
                        referenceExpression:
                            "CAST (@REF.CONCEPT_ID AS VARCHAR)",
                        order: 19,
                        domainFilter: "",
                        standardConceptCodeFilter: "",
                        useRefValue: true,
                        useRefText: true,
                    },
                    drugconceptset: {
                        name: [
                            {
                                lang: "",
                                value: "Drug concept set",
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
                        type: "conceptSet",
                        expression: '@DRUGEXP."DRUG_CONCEPT_ID"',
                        order: 20,
                        domainFilter: "",
                        standardConceptCodeFilter: "",
                        useRefValue: true,
                        useRefText: true,
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
                            "@REF.DOMAIN_ID = 'Route' AND @REF.STANDARD_CONCEPT = 'S' AND JARO_SIMILARITY(CAST(@REF.CONCEPT_ID AS VARCHAR), '@SEARCH_QUERY') >= 0.85",
                        referenceExpression: "@REF.CONCEPT_ID",
                        order: 21,
                        domainFilter: "",
                        standardConceptCodeFilter: "",
                        useRefValue: true,
                        useRefText: true,
                    },
                    routeconceptset: {
                        name: [
                            {
                                lang: "",
                                value: "Route concept set",
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
                        type: "conceptSet",
                        expression: '@DRUGEXP."ROUTE_CONCEPT_ID"',
                        order: 22,
                        domainFilter: "",
                        standardConceptCodeFilter: "",
                        useRefValue: true,
                        useRefText: true,
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
                            "@REF.DOMAIN_ID = 'Type Concept' AND @REF.CONCEPT_CLASS_ID = 'Drug Type' AND JARO_SIMILARITY(CAST(@REF.CONCEPT_ID AS VARCHAR), '@SEARCH_QUERY') >= 0.85",
                        referenceExpression: "@REF.CONCEPT_ID",
                        order: 23,
                        domainFilter: "",
                        standardConceptCodeFilter: "",
                        useRefValue: true,
                        useRefText: true,
                    },
                    drugtypeconceptset: {
                        name: [
                            {
                                lang: "",
                                value: "Drug type concept set",
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
                        type: "conceptSet",
                        expression: '@DRUGEXP."DRUG_TYPE_CONCEPT_ID"',
                        order: 24,
                        domainFilter: "",
                        standardConceptCodeFilter: "",
                        useRefValue: true,
                        useRefText: true,
                    },
                    drug_concept_name: {
                        name: [
                            {
                                lang: "",
                                value: "Drug concept name",
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
                        expression: "@REF.concept_name",
                        defaultPlaceholder: "@REF",
                        defaultFilter:
                            "@REF.concept_id = @DRUGEXP.drug_concept_id",
                        referenceFilter:
                            "@REF.DOMAIN_ID = 'Drug' AND @REF.STANDARD_CONCEPT = 'S' AND JARO_SIMILARITY(lower(@REF.CONCEPT_NAME), lower('@SEARCH_QUERY')) >= 0.65",
                        referenceExpression: "@REF.CONCEPT_NAME",
                        order: 0,
                        domainFilter: "",
                        standardConceptCodeFilter: "",
                    },
                },
                cohortDefinitionKey: "DrugExposure",
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
                order: 9,
                parentInteraction: ["patient.interactions.visit"],
                parentInteractionLabel: "Visit Occurrence Parent",
                attributes: {
                    numval: {
                        name: [
                            {
                                lang: "",
                                value: "Value As Number",
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
                        order: 1,
                        domainFilter: "",
                        standardConceptCodeFilter: "",
                        cohortDefinitionKey: "ValueAsNumber",
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
                        order: 4,
                        domainFilter: "",
                        standardConceptCodeFilter: "",
                        cohortDefinitionKey: "OccurrenceStartDate",
                    },
                    pid: {
                        name: [
                            {
                                lang: "",
                                value: "Person id",
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
                        expression: "@MEAS.person_id",
                        order: 5,
                        domainFilter: "",
                        standardConceptCodeFilter: "",
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
                        order: 6,
                        domainFilter: "",
                        standardConceptCodeFilter: "",
                    },
                    measurementtypeconceptset: {
                        name: [
                            {
                                lang: "",
                                value: "Measurement type concept set",
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
                        type: "conceptSet",
                        expression: '@MEAS."MEASUREMENT_TYPE_CONCEPT_ID"',
                        order: 10,
                        domainFilter: "",
                        standardConceptCodeFilter: "",
                        useRefValue: true,
                        useRefText: true,
                        cohortDefinitionKey: "MeasurementType",
                    },
                    valueasconceptset: {
                        name: [
                            {
                                lang: "",
                                value: "Value as concept set",
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
                        type: "conceptSet",
                        expression: '@MEAS."VALUE_AS_CONCEPT_ID"',
                        order: 12,
                        domainFilter: "",
                        standardConceptCodeFilter: "",
                    },
                    unitconceptset: {
                        name: [
                            {
                                lang: "",
                                value: "Unit concept set",
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
                        type: "conceptSet",
                        expression: '@MEAS."UNIT_CONCEPT_ID"',
                        order: 14,
                        domainFilter: "",
                        standardConceptCodeFilter: "",
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
                            "@REF.DOMAIN_ID = 'Measurement' AND JARO_SIMILARITY(CAST(@REF.CONCEPT_ID AS VARCHAR), '@SEARCH_QUERY') >= 0.85",
                        referenceExpression: "@REF.CONCEPT_ID",
                        order: 15,
                        domainFilter: "",
                        standardConceptCodeFilter: "",
                        useRefValue: true,
                        useRefText: true,
                    },
                    measurementconceptset: {
                        name: [
                            {
                                lang: "",
                                value: "Measurement concept set",
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
                        type: "conceptSet",
                        expression: '@MEAS."MEASUREMENT_CONCEPT_ID"',
                        order: 16,
                        domainFilter: "",
                        standardConceptCodeFilter: "",
                        useRefValue: true,
                        useRefText: true,
                    },
                    measurementtypeconceptid: {
                        name: [
                            {
                                lang: "",
                                value: "Measurement type concept id",
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
                        expression: '@MEAS."MEASUREMENT_TYPE_CONCEPT_ID"',
                        referenceFilter:
                            "@REF.DOMAIN_ID = 'Type Concept' AND @REF.CONCEPT_CLASS_ID = 'Meas Type' AND JARO_SIMILARITY(CAST(@REF.CONCEPT_ID AS VARCHAR), '@SEARCH_QUERY') >= 0.85",
                        referenceExpression: "@REF.CONCEPT_ID",
                        order: 17,
                        domainFilter: "",
                        standardConceptCodeFilter: "",
                        useRefValue: true,
                        useRefText: true,
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
                        expression: '@MEAS."VALUE_AS_CONCEPT_ID"',
                        order: 18,
                        domainFilter: "",
                        standardConceptCodeFilter: "",
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
                        expression: '@MEAS."UNIT_CONCEPT_ID"',
                        order: 19,
                        domainFilter: "",
                        standardConceptCodeFilter: "",
                    },
                    meas_concept_name: {
                        name: [
                            {
                                lang: "",
                                value: "Measurement concept name",
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
                        expression: "@REF.concept_name",
                        defaultPlaceholder: "@REF",
                        defaultFilter:
                            "@REF.concept_id = @MEAS.measurement_concept_id",
                        referenceFilter:
                            "@REF.DOMAIN_ID = 'Measurement' AND @REF.STANDARD_CONCEPT = 'S' AND JARO_SIMILARITY(lower(@REF.CONCEPT_NAME), lower('@SEARCH_QUERY')) >= 0.65",
                        referenceExpression: "@REF.CONCEPT_NAME",
                        order: 0,
                        domainFilter: "",
                        standardConceptCodeFilter: "",
                    },
                },
                cohortDefinitionKey: "Measurement",
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
                order: 8,
                parentInteraction: ["patient.interactions.visit"],
                parentInteractionLabel: "Visit Occurrence Parent",
                attributes: {
                    obsdatetime: {
                        name: [
                            {
                                lang: "",
                                value: "Observation Datetime",
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
                        order: 2,
                        domainFilter: "",
                        standardConceptCodeFilter: "",
                    },
                    pid: {
                        name: [
                            {
                                lang: "",
                                value: "Person id",
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
                        expression: "@OBS.person_id",
                        order: 3,
                        domainFilter: "",
                        standardConceptCodeFilter: "",
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
                        order: 4,
                        domainFilter: "",
                        standardConceptCodeFilter: "",
                        cohortDefinitionKey: "OccurrenceStartDate",
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
                        order: 5,
                        domainFilter: "",
                        standardConceptCodeFilter: "",
                    },
                    verbatimtext: {
                        name: [
                            {
                                lang: "",
                                value: "Value as string",
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
                        order: 9,
                        domainFilter: "",
                        standardConceptCodeFilter: "",
                    },
                    numval: {
                        name: [
                            {
                                lang: "",
                                value: "Value as number",
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
                        order: 10,
                        domainFilter: "",
                        standardConceptCodeFilter: "",
                        cohortDefinitionKey: "ValueAsNumber",
                    },
                    obsconceptset: {
                        name: [
                            {
                                lang: "",
                                value: "Observation concept set",
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
                        type: "conceptSet",
                        expression: '@OBS."OBSERVATION_CONCEPT_ID"',
                        order: 13,
                        domainFilter: "",
                        standardConceptCodeFilter: "",
                        useRefValue: true,
                        useRefText: true,
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
                            "@REF.DOMAIN_ID = 'Type Concept' AND @REF.CONCEPT_CLASS_ID = 'Observation Type' AND JARO_SIMILARITY(lower(@REF.CONCEPT_NAME), lower('@SEARCH_QUERY')) >= 0.65",
                        referenceExpression:
                            "CAST (@REF.CONCEPT_ID AS VARCHAR)",
                        order: 18,
                        domainFilter: "",
                        standardConceptCodeFilter: "",
                        useRefValue: true,
                        useRefText: true,
                    },
                    observationtypeconceptset: {
                        name: [
                            {
                                lang: "",
                                value: "Observation type concept set",
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
                        type: "conceptSet",
                        expression: '@OBS."OBSERVATION_TYPE_CONCEPT_ID"',
                        order: 19,
                        domainFilter: "",
                        standardConceptCodeFilter: "",
                        useRefValue: true,
                        useRefText: true,
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
                        order: 20,
                        domainFilter: "",
                        standardConceptCodeFilter: "",
                    },
                    valueasconceptset: {
                        name: [
                            {
                                lang: "",
                                value: "Value as concept set",
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
                        type: "conceptSet",
                        expression: '@OBS."VALUE_AS_CONCEPT_ID"',
                        order: 21,
                        domainFilter: "",
                        standardConceptCodeFilter: "",
                    },
                    qualifierconceptid: {
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
                            "@REF.DOMAIN_ID = 'Observation' AND @REF.STANDARD_CONCEPT = 'S' AND @REF.CONCEPT_CLASS_ID = 'Qualifier Value' AND JARO_SIMILARITY(CAST(@REF.CONCEPT_ID AS VARCHAR), '@SEARCH_QUERY') >= 0.85",
                        referenceExpression: "@REF.CONCEPT_ID",
                        order: 22,
                        domainFilter: "",
                        standardConceptCodeFilter: "",
                        useRefValue: true,
                        useRefText: true,
                    },
                    qualifierconceptset: {
                        name: [
                            {
                                lang: "",
                                value: "Qualifier concept set",
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
                        type: "conceptSet",
                        expression: '@OBS."QUALIFIER_CONCEPT_ID"',
                        order: 23,
                        domainFilter: "",
                        standardConceptCodeFilter: "",
                        useRefValue: true,
                        useRefText: true,
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
                            "@REF.DOMAIN_ID = 'Unit' AND @REF.STANDARD_CONCEPT = 'S' AND JARO_SIMILARITY(lower(@REF.CONCEPT_NAME), lower('@SEARCH_QUERY')) >= 0.65",
                        referenceExpression:
                            "CAST (@REF.CONCEPT_ID AS VARCHAR)",
                        order: 24,
                        domainFilter: "",
                        standardConceptCodeFilter: "",
                        useRefValue: true,
                        useRefText: true,
                    },
                    unitconceptset: {
                        name: [
                            {
                                lang: "",
                                value: "Unit concept set",
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
                        type: "conceptSet",
                        expression: '@OBS."UNIT_CONCEPT_ID"',
                        order: 25,
                        domainFilter: "",
                        standardConceptCodeFilter: "",
                        useRefValue: true,
                        useRefText: true,
                        cohortDefinitionKey: "Unit",
                    },
                    obsconceptid: {
                        name: [
                            {
                                lang: "",
                                value: "Observation concept id",
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
                        expression: '@OBS."OBSERVATION_CONCEPT_ID"',
                        referenceFilter:
                            "@REF.DOMAIN_ID = 'Observation' AND @REF.STANDARD_CONCEPT = 'S' AND JARO_SIMILARITY(CAST(@REF.CONCEPT_ID AS VARCHAR), '@SEARCH_QUERY') >= 0.85",
                        referenceExpression: "@REF.CONCEPT_ID",
                        order: 26,
                        domainFilter: "",
                        standardConceptCodeFilter: "",
                        useRefValue: true,
                        useRefText: true,
                    },
                    obs_concept_name: {
                        name: [
                            {
                                lang: "",
                                value: "Observation concept name",
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
                        expression: "@REF.concept_name",
                        defaultPlaceholder: "@REF",
                        defaultFilter:
                            "@REF.concept_id = @OBS.observation_concept_id",
                        referenceFilter:
                            "@REF.DOMAIN_ID = 'Observation' AND @REF.STANDARD_CONCEPT = 'S' AND JARO_SIMILARITY(lower(@REF.CONCEPT_NAME), lower('@SEARCH_QUERY')) >= 0.65",
                        referenceExpression: "@REF.CONCEPT_NAME",
                        order: 0,
                        domainFilter: "",
                        standardConceptCodeFilter: "",
                    },
                },
                cohortDefinitionKey: "Observation",
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
                order: 7,
                parentInteraction: [],
                parentInteractionLabel: "parent",
                attributes: {
                    enddate: {
                        name: [
                            {
                                lang: "",
                                value: "Observation Period End Date",
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
                        order: 0,
                        domainFilter: "",
                        standardConceptCodeFilter: "",
                        cohortDefinitionKey: "PeriodEndDate",
                    },
                    startdate: {
                        name: [
                            {
                                lang: "",
                                value: "Observation Period Start Date",
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
                        order: 1,
                        domainFilter: "",
                        standardConceptCodeFilter: "",
                        cohortDefinitionKey: "PeriodStartDate",
                    },
                    pid: {
                        name: [
                            {
                                lang: "",
                                value: "Person id",
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
                        expression: "@OBSPER.person_id",
                        order: 2,
                        domainFilter: "",
                        standardConceptCodeFilter: "",
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
                        order: 4,
                        domainFilter: "",
                        standardConceptCodeFilter: "",
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
                            "@REF.DOMAIN_ID = 'Type Concept' AND @REF.CONCEPT_CLASS_ID = 'Obs Period Type' AND JARO_SIMILARITY(lower(@REF.CONCEPT_NAME), lower('@SEARCH_QUERY')) >= 0.65",
                        referenceExpression: "@REF.CONCEPT_ID",
                        order: 6,
                        domainFilter: "",
                        standardConceptCodeFilter: "",
                        useRefValue: true,
                        useRefText: true,
                    },
                    periodtypeconceptset: {
                        name: [
                            {
                                lang: "",
                                value: "Period type concept set",
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
                        type: "conceptSet",
                        expression: '@OBSPER."PERIOD_TYPE_CONCEPT_ID"',
                        order: 7,
                        domainFilter: "",
                        standardConceptCodeFilter: "",
                        useRefValue: true,
                        useRefText: true,
                    },
                },
                cohortDefinitionKey: "ObservationPeriod",
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
                order: 6,
                parentInteraction: [],
                parentInteractionLabel: "parent",
                attributes: {
                    enddate: {
                        name: [
                            {
                                lang: "",
                                value: "Payer Plan Period End Date",
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
                        order: 0,
                        domainFilter: "",
                        standardConceptCodeFilter: "",
                        cohortDefinitionKey: "PeriodEndDate",
                    },
                    startdate: {
                        name: [
                            {
                                lang: "",
                                value: "Payer Plan Period Start Date",
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
                        order: 1,
                        domainFilter: "",
                        standardConceptCodeFilter: "",
                        cohortDefinitionKey: "PeriodStartDate",
                    },
                    pid: {
                        name: [
                            {
                                lang: "",
                                value: "Person id",
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
                        expression: "@PPPER.person_id",
                        order: 2,
                        domainFilter: "",
                        standardConceptCodeFilter: "",
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
                        order: 3,
                        domainFilter: "",
                        standardConceptCodeFilter: "",
                    },
                },
                cohortDefinitionKey: "PayerPlanPeriod",
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
                order: 5,
                parentInteraction: ["patient.interactions.visit"],
                parentInteractionLabel: "Visit Occurrence Parent",
                attributes: {
                    procdatetime: {
                        name: [
                            {
                                lang: "",
                                value: "Procedure Datetime",
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
                        order: 1,
                        domainFilter: "",
                        standardConceptCodeFilter: "",
                        cohortDefinitionKey: "OccurrenceStartDate",
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
                        order: 2,
                        domainFilter: "",
                        standardConceptCodeFilter: "",
                    },
                    procconceptset: {
                        name: [
                            {
                                lang: "",
                                value: "Procedure Occurrence Concept Set",
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
                        type: "conceptSet",
                        expression: '@PROC."PROCEDURE_OCCURRENCE_ID"',
                        order: 3,
                        domainFilter: "",
                        standardConceptCodeFilter: "",
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
                        order: 4,
                        domainFilter: "",
                        standardConceptCodeFilter: "",
                        cohortDefinitionKey: "OccurrenceStartDate",
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
                        order: 5,
                        domainFilter: "",
                        standardConceptCodeFilter: "",
                        cohortDefinitionKey: "Quantity",
                    },
                    pid: {
                        name: [
                            {
                                lang: "",
                                value: "Person id",
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
                        expression: "@PROC.person_id",
                        order: 8,
                        domainFilter: "",
                        standardConceptCodeFilter: "",
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
                            "@REF.DOMAIN_ID = 'Type Concept' AND @REF.CONCEPT_CLASS_ID = 'Procedure Type' AND JARO_SIMILARITY(lower(@REF.CONCEPT_NAME), lower('@SEARCH_QUERY')) >= 0.65",
                        referenceExpression:
                            "CAST (@REF.CONCEPT_ID AS VARCHAR)",
                        order: 13,
                        domainFilter: "",
                        standardConceptCodeFilter: "",
                        useRefValue: true,
                        useRefText: true,
                    },
                    proctypeconceptset: {
                        name: [
                            {
                                lang: "",
                                value: "Procedure type concept set",
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
                        type: "conceptSet",
                        expression: '@PROC."PROCEDURE_TYPE_CONCEPT_ID"',
                        order: 15,
                        domainFilter: "",
                        standardConceptCodeFilter: "",
                        useRefValue: true,
                        useRefText: true,
                        cohortDefinitionKey: "ProcedureType",
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
                        order: 16,
                        domainFilter: "",
                        standardConceptCodeFilter: "",
                    },
                    modifierconceptset: {
                        name: [
                            {
                                lang: "",
                                value: "Modifier concept set",
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
                        type: "conceptSet",
                        expression: '@PROC."MODIFIER_CONCEPT_ID"',
                        order: 17,
                        domainFilter: "",
                        standardConceptCodeFilter: "",
                    },
                    proc_occ_concept_name: {
                        name: [
                            {
                                lang: "",
                                value: "Procedure concept name",
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
                        expression: "@REF.concept_name",
                        defaultPlaceholder: "@REF",
                        defaultFilter:
                            "@REF.concept_id = @PROC.PROCEDURE_CONCEPT_ID",
                        referenceFilter:
                            "@REF.DOMAIN_ID = 'Procedure' AND @REF.STANDARD_CONCEPT = 'S' AND JARO_SIMILARITY(lower(@REF.CONCEPT_NAME), lower('@SEARCH_QUERY')) >= 0.65",
                        referenceExpression: "@REF.CONCEPT_NAME",
                        order: 0,
                        domainFilter: "",
                        standardConceptCodeFilter: "",
                    },
                    Procedure_concept_id_copy_cf2468c2_0849_4d67_8fa7_e876aef757a1:
                        {
                            name: [
                                {
                                    lang: "",
                                    value: "Procedure concept id",
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
                            expression: "@PROC.PROCEDURE_CONCEPT_ID",
                            referenceFilter:
                                "@REF.DOMAIN_ID = 'Procedure' AND @REF.STANDARD_CONCEPT = 'S' AND JARO_SIMILARITY(lower(@REF.CONCEPT_NAME), lower('@SEARCH_QUERY')) >= 0.65",
                            referenceExpression:
                                "CAST (@REF.CONCEPT_ID AS VARCHAR)",
                            order: 14,
                            domainFilter: "",
                            standardConceptCodeFilter: "",
                            useRefValue: true,
                            useRefText: true,
                        },
                },
                cohortDefinitionKey: "ProcedureOccurrence",
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
                order: 4,
                parentInteraction: [],
                parentInteractionLabel: "parent",
                attributes: {
                    pid: {
                        name: [
                            {
                                lang: "",
                                value: "Person id",
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
                        expression: "@SPEC.person_id",
                        order: 5,
                        domainFilter: "",
                        standardConceptCodeFilter: "",
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
                        domainFilter: "",
                        standardConceptCodeFilter: "",
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
                        order: 8,
                        domainFilter: "",
                        standardConceptCodeFilter: "",
                        cohortDefinitionKey: "Quantity",
                    },
                    specimendatetime: {
                        name: [
                            {
                                lang: "",
                                value: "Specimen Datetime",
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
                        order: 9,
                        domainFilter: "",
                        standardConceptCodeFilter: "",
                        cohortDefinitionKey: "OccurrenceStartDate",
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
                        order: 10,
                        domainFilter: "",
                        standardConceptCodeFilter: "",
                        cohortDefinitionKey: "OccurrenceStartDate",
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
                            "@REF.DOMAIN_ID = 'Specimen' AND @REF.STANDARD_CONCEPT = 'S' AND JARO_SIMILARITY(lower(@REF.CONCEPT_NAME), lower('@SEARCH_QUERY')) >= 0.65",
                        referenceExpression:
                            "CAST (@REF.CONCEPT_ID AS VARCHAR)",
                        order: 16,
                        domainFilter: "",
                        standardConceptCodeFilter: "",
                        useRefValue: true,
                        useRefText: true,
                    },
                    specimenconceptset: {
                        name: [
                            {
                                lang: "",
                                value: "Specimen concept set",
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
                        type: "conceptSet",
                        expression: '@SPEC."SPECIMEN_CONCEPT_ID"',
                        order: 17,
                        domainFilter: "",
                        standardConceptCodeFilter: "",
                        useRefValue: true,
                        useRefText: true,
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
                            "@REF.DOMAIN_ID = 'Type Concept' AND @REF.CONCEPT_CLASS_ID = 'Specimen Type' AND JARO_SIMILARITY(lower(@REF.CONCEPT_NAME), lower('@SEARCH_QUERY')) >= 0.65",
                        referenceExpression:
                            "CAST (@REF.CONCEPT_ID AS VARCHAR)",
                        order: 18,
                        domainFilter: "",
                        standardConceptCodeFilter: "",
                        useRefValue: true,
                        useRefText: true,
                    },
                    specimentypeconceptset: {
                        name: [
                            {
                                lang: "",
                                value: "Specimen type concept set",
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
                        type: "conceptSet",
                        expression: '@SPEC."SPECIMEN_TYPE_CONCEPT_ID"',
                        order: 19,
                        domainFilter: "",
                        standardConceptCodeFilter: "",
                        useRefValue: true,
                        useRefText: true,
                        cohortDefinitionKey: "SpecimenType",
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
                            "@REF.DOMAIN_ID = 'Spec Anatomic Site' AND @REF.STANDARD_CONCEPT = 'S' AND JARO_SIMILARITY(lower(@REF.CONCEPT_NAME), lower('@SEARCH_QUERY')) >= 0.65",
                        referenceExpression:
                            "CAST (@REF.CONCEPT_ID AS VARCHAR)",
                        order: 20,
                        domainFilter: "",
                        standardConceptCodeFilter: "",
                        useRefValue: true,
                        useRefText: true,
                    },
                    anatomicsiteconceptset: {
                        name: [
                            {
                                lang: "",
                                value: "Anatomic site concept set",
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
                        type: "conceptSet",
                        expression: '@SPEC."ANATOMIC_SITE_CONCEPT_ID"',
                        order: 21,
                        domainFilter: "",
                        standardConceptCodeFilter: "",
                        useRefValue: true,
                        useRefText: true,
                        cohortDefinitionKey: "AnatomicSite",
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
                            "@REF.DOMAIN_ID = 'Spec Disease Status' AND @REF.STANDARD_CONCEPT = 'S' AND JARO_SIMILARITY(lower(@REF.CONCEPT_NAME), lower('@SEARCH_QUERY')) >= 0.65",
                        referenceExpression:
                            "CAST (@REF.CONCEPT_ID AS VARCHAR)",
                        order: 22,
                        domainFilter: "",
                        standardConceptCodeFilter: "",
                        useRefValue: true,
                        useRefText: true,
                    },
                    diseasestatusconceptset: {
                        name: [
                            {
                                lang: "",
                                value: "Disease status concept set",
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
                        type: "conceptSet",
                        expression: '@SPEC."DISEASE_STATUS_CONCEPT_ID"',
                        order: 23,
                        domainFilter: "",
                        standardConceptCodeFilter: "",
                        useRefValue: true,
                        useRefText: true,
                        cohortDefinitionKey: "DiseaseStatus",
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
                            "@REF.DOMAIN_ID = 'Unit' AND @REF.STANDARD_CONCEPT = 'S' AND JARO_SIMILARITY(lower(@REF.CONCEPT_NAME), lower('@SEARCH_QUERY')) >= 0.65",
                        referenceExpression:
                            "CAST (@REF.CONCEPT_ID AS VARCHAR)",
                        order: 24,
                        domainFilter: "",
                        standardConceptCodeFilter: "",
                        useRefValue: true,
                        useRefText: true,
                    },
                    unitconceptset: {
                        name: [
                            {
                                lang: "",
                                value: "Unit concept set",
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
                        type: "conceptSet",
                        expression: '@SPEC."UNIT_CONCEPT_ID"',
                        order: 25,
                        domainFilter: "",
                        standardConceptCodeFilter: "",
                        useRefValue: true,
                        useRefText: true,
                        cohortDefinitionKey: "Unit",
                    },
                    specimen_concept_name: {
                        name: [
                            {
                                lang: "",
                                value: "Specimen concept name",
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
                        expression: "@REF.concept_name",
                        defaultPlaceholder: "@REF",
                        defaultFilter:
                            "@REF.concept_id = @SPEC.specimen_concept_id",
                        referenceFilter:
                            "@REF.DOMAIN_ID = 'Specimen' AND @REF.STANDARD_CONCEPT = 'S' AND JARO_SIMILARITY(lower(@REF.CONCEPT_NAME), lower('@SEARCH_QUERY')) >= 0.65",
                        referenceExpression: "@REF.CONCEPT_NAME",
                        order: 0,
                        domainFilter: "",
                        standardConceptCodeFilter: "",
                    },
                },
                cohortDefinitionKey: "Specimen",
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
                                value: "Visit End Date",
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
                        order: 1,
                        domainFilter: "",
                        standardConceptCodeFilter: "",
                        cohortDefinitionKey: "VisitDetailEndDate",
                    },
                    startdate: {
                        name: [
                            {
                                lang: "",
                                value: "Visit Start Date",
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
                        order: 2,
                        domainFilter: "",
                        standardConceptCodeFilter: "",
                        cohortDefinitionKey: "VisitDetailStartDate",
                    },
                    pid: {
                        name: [
                            {
                                lang: "",
                                value: "Person id",
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
                        expression: "@VISIT.person_id",
                        order: 3,
                        domainFilter: "",
                        standardConceptCodeFilter: "",
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
                        order: 6,
                        domainFilter: "",
                        standardConceptCodeFilter: "",
                    },
                    visittypeconceptset: {
                        name: [
                            {
                                lang: "",
                                value: "Visit type concept set",
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
                        type: "conceptSet",
                        expression: '@VISIT."VISIT_TYPE_CONCEPT_ID"',
                        order: 9,
                        domainFilter: "",
                        standardConceptCodeFilter: "",
                        useRefValue: true,
                        useRefText: true,
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
                            "@REF.DOMAIN_ID = 'Visit' AND @REF.STANDARD_CONCEPT = 'S' AND JARO_SIMILARITY(lower(@REF.CONCEPT_NAME), lower('@SEARCH_QUERY')) >= 0.65",
                        referenceExpression:
                            "CAST (@REF.CONCEPT_ID AS VARCHAR)",
                        order: 10,
                        domainFilter: "",
                        standardConceptCodeFilter: "",
                        useRefValue: true,
                        useRefText: true,
                    },
                    visitconceptset: {
                        name: [
                            {
                                lang: "",
                                value: "Visit concept set",
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
                        type: "conceptSet",
                        expression: '@VISIT."VISIT_CONCEPT_ID"',
                        order: 11,
                        domainFilter: "",
                        standardConceptCodeFilter: "",
                        useRefValue: true,
                        useRefText: true,
                    },
                    visittypeconceptid: {
                        name: [
                            {
                                lang: "",
                                value: "Visit type concept id",
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
                        expression: '@VISIT."VISIT_TYPE_CONCEPT_ID"',
                        referenceFilter:
                            "@REF.DOMAIN_ID = 'Type Concept' AND @REF.CONCEPT_CLASS_ID = 'Visit Type' AND JARO_SIMILARITY(CAST(@REF.CONCEPT_ID AS VARCHAR), '@SEARCH_QUERY') >= 0.85",
                        referenceExpression: "@REF.CONCEPT_ID",
                        order: 12,
                        domainFilter: "",
                        standardConceptCodeFilter: "",
                        useRefValue: true,
                        useRefText: true,
                    },
                    visit_occ_concept_name: {
                        name: [
                            {
                                lang: "",
                                value: "Visit concept name",
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
                        expression: "@REF.concept_name",
                        defaultPlaceholder: "@REF",
                        defaultFilter:
                            "@REF.concept_id = @VISIT.VISIT_CONCEPT_ID",
                        referenceFilter:
                            "@REF.DOMAIN_ID = 'Visit' AND @REF.STANDARD_CONCEPT = 'S' AND JARO_SIMILARITY(lower(@REF.CONCEPT_NAME), lower('@SEARCH_QUERY')) >= 0.65",
                        referenceExpression: "@REF.CONCEPT_NAME",
                        order: 0,
                        domainFilter: "",
                        standardConceptCodeFilter: "",
                    },
                },
                cohortDefinitionKey: "VisitDetail",
            },
            Consent_74db26d2_bb75_489a_a841_051c85dc897b: {
                name: [
                    {
                        lang: "",
                        value: "Consent",
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
                        visible: true,
                    },
                ],
                defaultFilter: "1=1",
                defaultPlaceholder: "@CONSENT",
                order: 10,
                parentInteraction: [
                    "patient.interactions.Consent_74db26d2_bb75_489a_a841_051c85dc897b",
                ],
                parentInteractionLabel: "parent",
                attributes: {
                    consentdatetime: {
                        name: [
                            {
                                lang: "",
                                value: "Consent Datetime",
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
                        order: 0,
                        domainFilter: "",
                        standardConceptCodeFilter: "",
                    },
                    pid: {
                        name: [
                            {
                                lang: "",
                                value: "Person id",
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
                        expression: '@CONSENT."PERSON_ID"',
                        order: 1,
                        domainFilter: "",
                        standardConceptCodeFilter: "",
                    },
                    parentconsentdetailid: {
                        name: [
                            {
                                lang: "",
                                value: "Parent Consent Detail Id",
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
                        expression: '@CONSENT."PARENT_CONSENT_DETAIL_ID"',
                        order: 2,
                        domainFilter: "",
                        standardConceptCodeFilter: "",
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
                                lang: "de",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "fr",
                                value: "",
                                visible: true,
                            },
                            {
                                lang: "es",
                                value: "",
                                visible: true,
                            },
                            {
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
                        expression: '@CONSENT."STATUS"',
                        order: 3,
                        domainFilter: "",
                        standardConceptCodeFilter: "",
                    },
                    textval: {
                        name: [
                            {
                                lang: "",
                                value: "Value",
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
                        expression: '@CONSENT."VALUE"',
                        order: 4,
                        domainFilter: "",
                        standardConceptCodeFilter: "",
                    },
                    consentcategory: {
                        name: [
                            {
                                lang: "",
                                value: "Category",
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
                        expression: '@CONSENT."TYPE"',
                        order: 5,
                        domainFilter: "",
                        standardConceptCodeFilter: "",
                    },
                    New_Attribute_1_3d0da2a3_f0de_4112_b87c_e7aff266c0d8: {
                        name: [
                            {
                                lang: "",
                                value: "Attribute",
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
                        expression: '@CONSENT."ATTRIBUTE"',
                        order: 6,
                        domainFilter: "",
                        standardConceptCodeFilter: "",
                    },
                    Attribute_copy_53f290b7_70e9_4c1e_bd6d_605bc916ce66: {
                        name: [
                            {
                                lang: "",
                                value: "Attribute Group Id",
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
                        expression: '@CONSENT."ATTRIBUTE_GROUP_ID"',
                        order: 7,
                        domainFilter: "",
                        standardConceptCodeFilter: "",
                    },
                    Consent_Id_copy_60a4adeb_1e84_4f04_b7d5_8eb1c006f56d: {
                        name: [
                            {
                                lang: "",
                                value: "Consent Detail Id",
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
                        expression: '@CONSENT."CONSENT_DETAIL_ID"',
                        order: 8,
                        domainFilter: "",
                        standardConceptCodeFilter: "",
                    },
                },
            },
            questionnaire: {
                name: [
                    {
                        lang: "",
                        value: "Questionnaire",
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
                        visible: true,
                    },
                ],
                defaultFilter: "1=1",
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
                        domainFilter: "",
                        standardConceptCodeFilter: "",
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
                        domainFilter: "",
                        standardConceptCodeFilter: "",
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
                        order: 2,
                        domainFilter: "",
                        standardConceptCodeFilter: "",
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
                        order: 3,
                        domainFilter: "",
                        standardConceptCodeFilter: "",
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
                        order: 4,
                        domainFilter: "",
                        standardConceptCodeFilter: "",
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
                        order: 5,
                        domainFilter: "",
                        standardConceptCodeFilter: "",
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
                        order: 6,
                        domainFilter: "",
                        standardConceptCodeFilter: "",
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
                        order: 7,
                        domainFilter: "",
                        standardConceptCodeFilter: "",
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
                        order: 8,
                        domainFilter: "",
                        standardConceptCodeFilter: "",
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
                        domainFilter: "",
                        standardConceptCodeFilter: "",
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
                        domainFilter: "",
                        standardConceptCodeFilter: "",
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
                        domainFilter: "",
                        standardConceptCodeFilter: "",
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
                        domainFilter: "",
                        standardConceptCodeFilter: "",
                    },
                },
            },
            cohort: {
                name: [
                    {
                        lang: "",
                        value: "Cohort",
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
                defaultPlaceholder: "@COHORT",
                order: 18,
                parentInteraction: [],
                parentInteractionLabel: "parent",
                attributes: {
                    cohortdefinitionid: {
                        name: [
                            {
                                lang: "",
                                value: "Cohort Definition Id",
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
                        expression: '@COHORT."cohort_definition_id"',
                        order: 0,
                        domainFilter: "",
                        standardConceptCodeFilter: "",
                        useRefValue: true,
                        useRefText: true,
                    },
                    pid: {
                        name: [
                            {
                                lang: "",
                                value: "Subject Id",
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
                        expression: '@COHORT."subject_id"',
                        order: 1,
                        domainFilter: "",
                        standardConceptCodeFilter: "",
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
                        expression: '@COHORT."cohort_end_date"',
                        order: 2,
                        domainFilter: "",
                        standardConceptCodeFilter: "",
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
                        expression: '@COHORT."cohort_start_date"',
                        order: 3,
                        domainFilter: "",
                        standardConceptCodeFilter: "",
                    },
                },
            },
            answer: {
                name: [
                    {
                        lang: "",
                        value: "Answer",
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
                        visible: true,
                    },
                ],
                defaultFilter: "1=1",
                defaultPlaceholder: "@ANSWER",
                order: 3,
                parentInteraction: ["patient.interactions.item"],
                parentInteractionLabel: "Item Parent",
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
                        expression: '@ANSWER."LINK_ID"',
                        order: 0,
                        domainFilter: "",
                        standardConceptCodeFilter: "",
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
                        expression: '@ANSWER."VALUECODING_CODE"',
                        order: 1,
                        domainFilter: "",
                        standardConceptCodeFilter: "",
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
                        expression: '@ANSWER."VALUE_TYPE"',
                        order: 2,
                        domainFilter: "",
                        standardConceptCodeFilter: "",
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
                        expression: '@ANSWER."VALUE"',
                        order: 3,
                        domainFilter: "",
                        standardConceptCodeFilter: "",
                    },
                },
            },
            item: {
                name: [
                    {
                        lang: "",
                        value: "Item",
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
                        visible: true,
                    },
                ],
                defaultFilter: "1=1",
                defaultPlaceholder: "@ITEM",
                order: 2,
                parentInteraction: ["patient.interactions.questionnaire"],
                parentInteractionLabel: "Questionnaire Parent",
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
                        expression: '@ITEM."LINK_ID"',
                        order: 0,
                        domainFilter: "",
                        standardConceptCodeFilter: "",
                    },
                    recordID: {
                        name: [
                            {
                                lang: "",
                                value: "Item ID",
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
                        expression: '@ITEM."ITEM_ID"',
                        order: 1,
                        domainFilter: "",
                        standardConceptCodeFilter: "",
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
                        expression: '@ITEM."TEXT"',
                        order: 2,
                        domainFilter: "",
                        standardConceptCodeFilter: "",
                    },
                },
            },
        },
        attributes: {
            pid: {
                name: [
                    {
                        lang: "",
                        value: "Person id",
                    },
                ],
                disabledLangName: [
                    {
                        lang: "en",
                        value: "",
                    },
                    {
                        lang: "de",
                        value: "",
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
                expression: '@PATIENT."person_id"',
                order: 0,
                annotations: ["person_id"],
                domainFilter: "",
                standardConceptCodeFilter: "",
            },
            pcount: {
                name: [
                    {
                        lang: "",
                        value: "Patient Count",
                    },
                ],
                disabledLangName: [
                    {
                        lang: "en",
                        value: "",
                    },
                    {
                        lang: "de",
                        value: "",
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
                type: "num",
                measureExpression: 'COUNT(DISTINCT(@PATIENT."person_id"))',
                order: 1,
                domainFilter: "",
                standardConceptCodeFilter: "",
            },
            monthOfBirth: {
                name: [
                    {
                        lang: "",
                        value: "Month of Birth",
                    },
                ],
                disabledLangName: [
                    {
                        lang: "en",
                        value: "",
                    },
                    {
                        lang: "de",
                        value: "",
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
                type: "num",
                expression: '@PATIENT."MONTH_OF_BIRTH"',
                order: 2,
                domainFilter: "",
                standardConceptCodeFilter: "",
            },
            yearOfBirth: {
                name: [
                    {
                        lang: "",
                        value: "Year of Birth",
                    },
                ],
                disabledLangName: [
                    {
                        lang: "en",
                        value: "",
                    },
                    {
                        lang: "de",
                        value: "",
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
                type: "num",
                expression: '@PATIENT."YEAR_OF_BIRTH"',
                order: 3,
                domainFilter: "",
                standardConceptCodeFilter: "",
            },
            dateOfBirth: {
                name: [
                    {
                        lang: "",
                        value: "Birth Datetime",
                    },
                ],
                disabledLangName: [
                    {
                        lang: "en",
                        value: "",
                    },
                    {
                        lang: "de",
                        value: "",
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
                type: "datetime",
                expression: '@PATIENT."birth_datetime"',
                order: 4,
                annotations: ["birth_datetime"],
                domainFilter: "",
                standardConceptCodeFilter: "",
            },
            ethnicityconceptid: {
                name: [
                    {
                        lang: "",
                        value: "Ethnicity concept id",
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
                expression: '@PATIENT."ethnicity_concept_id"',
                referenceFilter:
                    "@REF.DOMAIN_ID = 'Ethnicity' AND @REF.STANDARD_CONCEPT = 'S' AND JARO_SIMILARITY(CAST(@REF.CONCEPT_ID AS VARCHAR), '@SEARCH_QUERY') >= 0.65",
                referenceExpression: "@REF.CONCEPT_ID",
                order: 8,
                domainFilter: "",
                standardConceptCodeFilter: "",
                useRefValue: true,
                useRefText: true,
                cohortDefinitionKey: "Ethnicity",
                conceptSetType: "id",
            },
            locationid: {
                name: [
                    {
                        lang: "",
                        value: "Location id",
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
                expression: '@PATIENT."location_id"',
                order: 9,
                domainFilter: "",
                standardConceptCodeFilter: "",
            },
            gendersourcevalue: {
                name: [
                    {
                        lang: "",
                        value: "Gender source value",
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
                expression: '@PATIENT."gender_source_value"',
                referenceFilter:
                    "@REF.DOMAIN_ID = 'Gender' AND @REF.STANDARD_CONCEPT = 'S' AND JARO_SIMILARITY(CAST(@REF.CONCEPT_CODE AS VARCHAR), '@SEARCH_QUERY') >= 0.85",
                referenceExpression: "@REF.CONCEPT_CODE",
                order: 11,
                domainFilter: "",
                standardConceptCodeFilter: "",
                useRefValue: true,
                useRefText: true,
            },
            racesourcevalue: {
                name: [
                    {
                        lang: "",
                        value: "Race source value",
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
                expression: '@PATIENT."race_source_value"',
                referenceFilter:
                    "@REF.DOMAIN_ID = 'Race' AND @REF.STANDARD_CONCEPT = 'S' AND JARO_SIMILARITY(CAST(@REF.CONCEPT_CODE AS VARCHAR), '@SEARCH_QUERY') >= 0.85",
                referenceExpression: "@REF.CONCEPT_CODE",
                order: 12,
                domainFilter: "",
                standardConceptCodeFilter: "",
                useRefValue: true,
                useRefText: true,
            },
            ethnicitysourcevalue: {
                name: [
                    {
                        lang: "",
                        value: "Ethnicity source value",
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
                expression: '@PATIENT."ethnicity_source_value"',
                referenceFilter:
                    "@REF.DOMAIN_ID = 'Ethnicity' AND @REF.STANDARD_CONCEPT = 'S' AND JARO_SIMILARITY(CAST(@REF.CONCEPT_CODE AS VARCHAR), '@SEARCH_QUERY') >= 0.85",
                referenceExpression: "@REF.CONCEPT_CODE",
                order: 13,
                domainFilter: "",
                standardConceptCodeFilter: "",
                useRefValue: true,
                useRefText: true,
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
                    "@REF.DOMAIN_ID = 'Gender' AND @REF.STANDARD_CONCEPT = 'S' AND JARO_SIMILARITY(CAST(@REF.CONCEPT_ID AS VARCHAR), '@SEARCH_QUERY') >= 0.85",
                referenceExpression: "@REF.CONCEPT_ID",
                order: 16,
                domainFilter: "",
                standardConceptCodeFilter: "",
                useRefValue: true,
                useRefText: true,
                cohortDefinitionKey: "Gender",
                conceptSetType: "id",
            },
            Gender_concept_name: {
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
                expression: "@REF.concept_name",
                defaultPlaceholder: "@REF",
                defaultFilter: "@REF.concept_id = @PATIENT.gender_concept_id",
                referenceFilter:
                    "@REF.DOMAIN_ID = 'Gender' AND @REF.STANDARD_CONCEPT = 'S' AND JARO_SIMILARITY(lower(@REF.CONCEPT_NAME), lower('@SEARCH_QUERY')) >= 0.65",
                referenceExpression: "@REF.CONCEPT_NAME",
                order: 17,
                domainFilter: "",
                standardConceptCodeFilter: "",
                useRefValue: true,
                useRefText: true,
                cohortDefinitionKey: "Gender",
                conceptSetType: "name",
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
                    "@REF.DOMAIN_ID = 'Race' AND @REF.STANDARD_CONCEPT = 'S' AND JARO_SIMILARITY(CAST(@REF.CONCEPT_ID AS VARCHAR), '@SEARCH_QUERY') >= 0.85",
                referenceExpression: "@REF.CONCEPT_ID",
                order: 20,
                domainFilter: "",
                standardConceptCodeFilter: "",
                useRefValue: true,
                useRefText: true,
                cohortDefinitionKey: "Race",
                conceptSetType: "id",
            },
            Age: {
                name: [
                    {
                        lang: "",
                        value: "Age",
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
                type: "num",
                expression: 'YEAR(CURRENT_DATE) - @PATIENT."YEAR_OF_BIRTH"',
                order: 24,
                domainFilter: "",
                standardConceptCodeFilter: "",
                cohortDefinitionKey: "Age",
            },
            raceName: {
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
                expression: "@REF.concept_name",
                defaultPlaceholder: "@REF",
                defaultFilter: "@REF.concept_id = @PATIENT.race_concept_id",
                referenceFilter:
                    "@REF.DOMAIN_ID = 'Race' AND @REF.STANDARD_CONCEPT = 'S' AND JARO_SIMILARITY(lower(@REF.CONCEPT_NAME), lower('@SEARCH_QUERY')) >= 0.65",
                referenceExpression: "@REF.CONCEPT_NAME",
                order: 18,
                domainFilter: "",
                standardConceptCodeFilter: "",
                useRefValue: true,
                useRefText: true,
                cohortDefinitionKey: "Race",
                conceptSetType: "name",
            },
            ethnicityName: {
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
                expression: "@REF.concept_name",
                defaultPlaceholder: "@REF",
                defaultFilter:
                    "@REF.concept_id = @PATIENT.ethnicity_concept_id",
                referenceFilter:
                    "@REF.DOMAIN_ID = 'Ethnicity' AND @REF.STANDARD_CONCEPT = 'S' AND JARO_SIMILARITY(lower(@REF.CONCEPT_NAME), lower('@SEARCH_QUERY')) >= 0.65",
                referenceExpression: "@REF.CONCEPT_NAME",
                order: 19,
                domainFilter: "",
                standardConceptCodeFilter: "",
                useRefValue: true,
                useRefText: true,
                cohortDefinitionKey: "Ethnicity",
                conceptSetType: "name",
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
                    hierarchy: false,
                    time: true,
                    oneToN: false,
                    condition: false,
                },
                {
                    placeholder: "@VISIT",
                    attributeTables: [],
                    hierarchy: false,
                    time: true,
                    oneToN: false,
                    condition: false,
                },
                {
                    placeholder: "@CONDERA",
                    attributeTables: [],
                    hierarchy: false,
                    time: true,
                    oneToN: false,
                    condition: false,
                },
                {
                    placeholder: "@DEATH",
                    attributeTables: [],
                    hierarchy: false,
                    time: true,
                    oneToN: false,
                    condition: false,
                },
                {
                    placeholder: "@DEVEXP",
                    attributeTables: [],
                    hierarchy: false,
                    time: true,
                    oneToN: false,
                    condition: false,
                },
                {
                    placeholder: "@DOSEERA",
                    attributeTables: [],
                    hierarchy: false,
                    time: true,
                    oneToN: false,
                    condition: false,
                },
                {
                    placeholder: "@DRUGERA",
                    attributeTables: [],
                    hierarchy: false,
                    time: true,
                    oneToN: false,
                    condition: false,
                },
                {
                    placeholder: "@DRUGEXP",
                    attributeTables: [],
                    hierarchy: false,
                    time: true,
                    oneToN: false,
                    condition: false,
                },
                {
                    placeholder: "@OBS",
                    attributeTables: [],
                    hierarchy: false,
                    time: true,
                    oneToN: true,
                    condition: false,
                },
                {
                    placeholder: "@OBSPER",
                    attributeTables: [],
                    hierarchy: false,
                    time: true,
                    oneToN: false,
                    condition: false,
                },
                {
                    placeholder: "@PPPER",
                    attributeTables: [],
                    hierarchy: false,
                    time: true,
                    oneToN: false,
                    condition: false,
                },
                {
                    placeholder: "@SPEC",
                    attributeTables: [],
                    hierarchy: false,
                    time: true,
                    oneToN: false,
                    condition: false,
                },
                {
                    placeholder: "@MEAS",
                    attributeTables: [],
                    hierarchy: false,
                    time: true,
                    oneToN: false,
                    condition: false,
                },
                {
                    placeholder: "@PROC",
                    attributeTables: [],
                    hierarchy: false,
                    time: true,
                    oneToN: false,
                    condition: false,
                },
                {
                    placeholder: "@CONSENT",
                    attributeTables: [],
                    hierarchy: true,
                    time: true,
                    oneToN: false,
                    condition: false,
                },
                {
                    placeholder: "@RESPONSE",
                    attributeTables: [],
                    hierarchy: false,
                    time: true,
                    oneToN: false,
                    condition: false,
                },
                {
                    placeholder: "@COHORT",
                    attributeTables: [],
                    hierarchy: false,
                    time: true,
                    oneToN: false,
                    condition: false,
                },
                {
                    placeholder: "@ANSWER",
                    attributeTables: [],
                    hierarchy: false,
                    time: true,
                    oneToN: false,
                    condition: false,
                },
                {
                    placeholder: "@ITEM",
                    attributeTables: [],
                    hierarchy: false,
                    time: true,
                    oneToN: false,
                    condition: false,
                },
            ],
        },
        tableMapping: {
            "@COND": '$$SCHEMA$$."condition_occurrence"',
            "@COND.PATIENT_ID": '"person_id"',
            "@COND.INTERACTION_ID": '"condition_occurrence_id"',
            "@COND.CONDITION_ID": '"condition_concept_id"',
            "@COND.PARENT_INTERACT_ID": '"visit_occurrence_id"',
            "@COND.START": '"condition_start_datetime"',
            "@COND.END": '"condition_end_datetime"',
            "@COND.INTERACTION_TYPE": '"condition_type_concept_id"',
            "@VISIT": '$$SCHEMA$$."visit_occurrence"',
            "@VISIT.PATIENT_ID": '"person_id"',
            "@VISIT.INTERACTION_ID": '"visit_occurrence_id"',
            "@VISIT.CONDITION_ID": '"visit_concept_id"',
            "@VISIT.PARENT_INTERACT_ID": '"visit_occurrence_id"',
            "@VISIT.START": '"visit_start_datetime"',
            "@VISIT.END": '"visit_end_datetime"',
            "@VISIT.INTERACTION_TYPE": '"visit_type_concept_id"',
            "@CONDERA": '$$SCHEMA$$."condition_era"',
            "@CONDERA.PATIENT_ID": '"person_id"',
            "@CONDERA.INTERACTION_ID": '"condition_era_id"',
            "@CONDERA.CONDITION_ID": '"condition_concept_id"',
            "@CONDERA.PARENT_INTERACT_ID": '"condition_era_id"',
            "@CONDERA.START": '"condition_era_start_date"',
            "@CONDERA.END": '"condition_era_end_date"',
            "@CONDERA.INTERACTION_TYPE": '"condition_concept_id"',
            "@DEATH": '$$SCHEMA$$."death"',
            "@DEATH.PATIENT_ID": '"person_id"',
            "@DEATH.INTERACTION_ID": '"person_id"',
            "@DEATH.CONDITION_ID": '"cause_concept_id"',
            "@DEATH.PARENT_INTERACT_ID": '"person_id"',
            "@DEATH.START": '"death_datetime"',
            "@DEATH.END": '"death_datetime"',
            "@DEATH.INTERACTION_TYPE": '"death_type_concept_id"',
            "@DEVEXP": '$$SCHEMA$$."device_exposure"',
            "@DEVEXP.PATIENT_ID": '"person_id"',
            "@DEVEXP.INTERACTION_ID": '"device_exposure_id"',
            "@DEVEXP.CONDITION_ID": '"device_concept_id"',
            "@DEVEXP.PARENT_INTERACT_ID": '"visit_occurrence_id"',
            "@DEVEXP.START": '"device_exposure_start_datetime"',
            "@DEVEXP.END": '"device_exposure_end_datetime"',
            "@DEVEXP.INTERACTION_TYPE": '"device_type_concept_id"',
            "@DOSEERA": '$$SCHEMA$$."dose_era"',
            "@DOSEERA.PATIENT_ID": '"person_id"',
            "@DOSEERA.INTERACTION_ID": '"dose_era_id"',
            "@DOSEERA.CONDITION_ID": '"drug_concept_id"',
            "@DOSEERA.PARENT_INTERACT_ID": '"dose_era_id"',
            "@DOSEERA.START": '"dose_era_start_date"',
            "@DOSEERA.END": '"dose_era_end_date"',
            "@DOSEERA.INTERACTION_TYPE": '"drug_concept_id"',
            "@DRUGERA": '$$SCHEMA$$."drug_era"',
            "@DRUGERA.PATIENT_ID": '"person_id"',
            "@DRUGERA.INTERACTION_ID": '"drug_era_id"',
            "@DRUGERA.CONDITION_ID": '"drug_concept_id"',
            "@DRUGERA.PARENT_INTERACT_ID": '"drug_era_id"',
            "@DRUGERA.START": '"drug_era_start_date"',
            "@DRUGERA.END": '"drug_era_end_date"',
            "@DRUGERA.INTERACTION_TYPE": '"drug_concept_id"',
            "@DRUGEXP": '$$SCHEMA$$."drug_exposure"',
            "@DRUGEXP.PATIENT_ID": '"person_id"',
            "@DRUGEXP.INTERACTION_ID": '"drug_exposure_id"',
            "@DRUGEXP.CONDITION_ID": '"drug_concept_id"',
            "@DRUGEXP.PARENT_INTERACT_ID": '"visit_occurrence_id"',
            "@DRUGEXP.START": '"drug_exposure_start_datetime"',
            "@DRUGEXP.END": '"drug_exposure_end_datetime"',
            "@DRUGEXP.INTERACTION_TYPE": '"drug_type_concept_id"',
            "@OBS": '$$SCHEMA$$."observation"',
            "@OBS.PATIENT_ID": '"person_id"',
            "@OBS.INTERACTION_ID": '"observation_id"',
            "@OBS.CONDITION_ID": '"observation_concept_id"',
            "@OBS.PARENT_INTERACT_ID": '"visit_occurrence_id"',
            "@OBS.START": '"observation_datetime"',
            "@OBS.END": '"observation_datetime"',
            "@OBS.INTERACTION_TYPE": '"observation_type_concept_id"',
            "@OBSPER": '$$SCHEMA$$."observation_period"',
            "@OBSPER.PATIENT_ID": '"person_id"',
            "@OBSPER.INTERACTION_ID": '"observation_period_id"',
            "@OBSPER.CONDITION_ID": '"period_type_concept_id"',
            "@OBSPER.PARENT_INTERACT_ID": '"observation_period_id"',
            "@OBSPER.START": '"observation_period_start_date"',
            "@OBSPER.END": '"observation_period_end_date"',
            "@OBSPER.INTERACTION_TYPE": '"period_type_concept_id"',
            "@PPPER": '$$SCHEMA$$."payer_plan_period"',
            "@PPPER.PATIENT_ID": '"person_id"',
            "@PPPER.INTERACTION_ID": '"payer_plan_period_id"',
            "@PPPER.CONDITION_ID": '"payer_concept_id"',
            "@PPPER.PARENT_INTERACT_ID": '"payer_plan_period_id"',
            "@PPPER.START": '"payer_plan_period_start_date"',
            "@PPPER.END": '"payer_plan_period_end_date"',
            "@PPPER.INTERACTION_TYPE": '"plan_concept_id"',
            "@SPEC": '$$SCHEMA$$."specimen"',
            "@SPEC.PATIENT_ID": '"person_id"',
            "@SPEC.INTERACTION_ID": '"specimen_id"',
            "@SPEC.CONDITION_ID": '"specimen_concept_id"',
            "@SPEC.PARENT_INTERACT_ID": '"specimen_id"',
            "@SPEC.START": '"specimen_datetime"',
            "@SPEC.END": '"specimen_datetime"',
            "@SPEC.INTERACTION_TYPE": '"specimen_type_concept_id"',
            "@MEAS": '$$SCHEMA$$."measurement"',
            "@MEAS.PATIENT_ID": '"person_id"',
            "@MEAS.INTERACTION_ID": '"measurement_id"',
            "@MEAS.CONDITION_ID": '"measurement_concept_id"',
            "@MEAS.PARENT_INTERACT_ID": '"visit_occurrence_id"',
            "@MEAS.START": '"measurement_datetime"',
            "@MEAS.END": '"measurement_datetime"',
            "@MEAS.INTERACTION_TYPE": '"measurement_type_concept_id"',
            "@PROC": '$$SCHEMA$$."procedure_occurrence"',
            "@PROC.PATIENT_ID": '"person_id"',
            "@PROC.INTERACTION_ID": '"procedure_occurrence_id"',
            "@PROC.CONDITION_ID": '"procedure_concept_id"',
            "@PROC.PARENT_INTERACT_ID": '"visit_occurrence_id"',
            "@PROC.START": '"procedure_datetime"',
            "@PROC.END": '"procedure_end_datetime"',
            "@PROC.INTERACTION_TYPE": '"procedure_type_concept_id"',
            "@CONSENT": '$$SCHEMA$$."VIEW::GDM.CONSENT_BASE"',
            "@CONSENT.PATIENT_ID": '"PERSON_ID"',
            "@CONSENT.INTERACTION_ID": '"CONSENT_DETAIL_ID"',
            "@CONSENT.CONDITION_ID": '"ATTRIBUTE"',
            "@CONSENT.PARENT_INTERACT_ID": '"PARENT_CONSENT_DETAIL_ID"',
            "@CONSENT.START": '"CREATED_AT"',
            "@CONSENT.END": '"CREATED_AT"',
            "@CONSENT.INTERACTION_TYPE": '"TYPE"',
            "@RESPONSE": '$$SCHEMA$$."VIEW::GDM.QUESTIONNAIRE_RESPONSE_BASE"',
            "@RESPONSE.PATIENT_ID": '"PERSON_ID"',
            "@RESPONSE.INTERACTION_ID": '"ID"',
            "@RESPONSE.CONDITION_ID": '"VALUE"',
            "@RESPONSE.PARENT_INTERACT_ID": '"ANSWER_ID"',
            "@RESPONSE.START": '"AUTHORED"',
            "@RESPONSE.END": '"AUTHORED"',
            "@RESPONSE.INTERACTION_TYPE": '"VALUE_TYPE"',
            "@COHORT": "$$SCHEMA_DIRECT_CONN$$.cohort",
            "@COHORT.PATIENT_ID": '"subject_id"',
            "@COHORT.INTERACTION_ID": '"cohort_definition_id"',
            "@COHORT.CONDITION_ID": '"cohort_definition_id"',
            "@COHORT.PARENT_INTERACT_ID": '"cohort_definition_id"',
            "@COHORT.START": '"cohort_start_date"',
            "@COHORT.END": '"cohort_end_date"',
            "@COHORT.INTERACTION_TYPE": '"cohort_definition_id"',
            "@ANSWER": '$$SCHEMA$$."VIEW::GDM.QUESTIONNAIRE_RESPONSE_BASE"',
            "@ANSWER.PATIENT_ID": '"PERSON_ID"',
            "@ANSWER.INTERACTION_ID": '"ANSWER_ID"',
            "@ANSWER.CONDITION_ID": '"VALUE"',
            "@ANSWER.PARENT_INTERACT_ID": '"ITEM_ID"',
            "@ANSWER.START": '"AUTHORED"',
            "@ANSWER.END": '"AUTHORED"',
            "@ANSWER.INTERACTION_TYPE": '"VALUE_TYPE"',
            "@ITEM": '$$SCHEMA$$."VIEW::GDM.QUESTIONNAIRE_RESPONSE_BASE"',
            "@ITEM.PATIENT_ID": '"PERSON_ID"',
            "@ITEM.INTERACTION_ID": '"ITEM_ID"',
            "@ITEM.CONDITION_ID": '"VALUE"',
            "@ITEM.PARENT_INTERACT_ID": '"QUESTIONNAIRE_REFERENCE"',
            "@ITEM.START": '"AUTHORED"',
            "@ITEM.END": '"AUTHORED"',
            "@ITEM.INTERACTION_TYPE": '"VALUE_TYPE"',
            "@PATIENT": '$$SCHEMA$$."person"',
            "@PATIENT.PATIENT_ID": '"person_id"',
            "@PATIENT.DOD": '"birth_datetime"',
            "@PATIENT.DOB": '"birth_datetime"',
            "@REF": '$$VOCAB_SCHEMA$$."concept"',
            "@REF.VOCABULARY_ID": '"vocabulary_id"',
            "@REF.CODE": '"concept_id"',
            "@REF.TEXT": '"concept_name"',
            "@TEXT": '$$VOCAB_SCHEMA$$."concept"',
            "@TEXT.INTERACTION_ID": '"concept_id"',
            "@TEXT.INTERACTION_TEXT_ID": '"concept_id"',
            "@TEXT.VALUE": '"concept_name"',
        },
        guardedTableMapping: {
            "@PATIENT": '$$SCHEMA$$."person"',
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
                "@CODE": '$$VOCAB_SCHEMA$$."concept"',
            },
        },
        shared: {},
        schemaVersion: "3",
    },
};
