export default {
    filter: {
        configMetadata: {
            id: "92d7c6f8-3118-4256-ab22-f2f7fd19d4e7",
            version: "A",
        },
        cards: {
            content: [
                {
                    content: [
                        {
                            configPath: "patient",
                            instanceNumber: 0,
                            instanceID: "patient",
                            name: "Basic Data",
                            inactive: false,
                            type: "FilterCard",
                            attributes: {
                                content: [],
                                type: "BooleanContainer",
                                op: "AND",
                            },
                            advanceTimeFilter: null,
                        },
                    ],
                    type: "BooleanContainer",
                    op: "OR",
                },
                {
                    content: [
                        {
                            configPath: "patient.interactions.drugera",
                            instanceNumber: 1,
                            instanceID: "patient.interactions.drugera.1",
                            name: "DrugEra A",
                            inactive: false,
                            type: "FilterCard",
                            attributes: {
                                content: [],
                                type: "BooleanContainer",
                                op: "AND",
                            },
                            advanceTimeFilter: null,
                        },
                        {
                            configPath: "patient.interactions.death",
                            instanceNumber: 1,
                            instanceID: "patient.interactions.death.1",
                            name: "Death A",
                            inactive: false,
                            type: "FilterCard",
                            attributes: {
                                content: [],
                                type: "BooleanContainer",
                                op: "AND",
                            },
                            advanceTimeFilter: null,
                        },
                    ],
                    type: "BooleanContainer",
                    op: "OR",
                },
            ],
            type: "BooleanContainer",
            op: "AND",
        },
        sort: "MRI_PA_CHART_SORT_DEFAULT",
    },
    chartType: "stacked",
    axisSelection: [
        { attributeId: "n/a", binsize: "n/a", categoryId: "x1" },
        { attributeId: "n/a", binsize: "n/a", categoryId: "x2" },
        { attributeId: "n/a", binsize: "n/a", categoryId: "x3" },
        { attributeId: "n/a", binsize: "n/a", categoryId: "x4" },
        { attributeId: "patient.attributes.pcount", categoryId: "y1" },
    ],
    metadata: { version: 3 },
    selectedStudyEntityValue: "703c5d8a-a1d9-4d42-a314-5b9aad513390",
};