/**
 * @file Patient Summary Configuration Definition
 */

import {ruleValidator as rulesLib} from "@alp/alp-config-utils";
import * as patientCustomRules from "./customRules";
/* eslint-enable no-multi-spaces *//* beautify preserve:end */

/**
 * Get the validity definition object for the config.
 * @private
 * @param   {object} cdwConfig CDW config object, used for reference
 * @returns {object} Validity object
 */
function getValidDefinition(cdwConfig) {
    const colors = [
        "LightOrange", "LightGreen", "LightGold", "LightPurple",
        "LightPink", "MediumOrange", "MediumGreen", "MediumGold",
        "MediumPurple", "MediumPink", "DarkOrange", "DarkGreen",
        "DarkGold", "DarkPurple", "DarkPink"
    ];
    const timeBasedZoomOptions = ["1m", "3m", "6m", "1y", "3y", "5y"];
    const dataBasedZoomOptions = ["lifespan", "interactions", "firstDOD"];
    const initialZoomOptions = ["leftZoom", "middleZoom", "rightZoom"];

    let rules = {
        sourceExistsInCDWConfig: {
            name: "The specified attribute does not exist in the CDW config",
            messageKey: "HPH_PAT_CFG_VALIDATION_ERROR_SOURCE_DOES_NOT_EXIST",
            rule: new patientCustomRules.PathExistsInConfig(cdwConfig),
            isWarning: false,
        },
        sourceExistsInCDWConfigAsMasterdata: {
            name: "The specified attribute does not exist in the patient attributes of the CDW config",
            messageKey: "HPH_PAT_CFG_VALIDATION_ERROR_SOURCE_DOES_NOT_EXIST_MASTERDATA",
            rule: new patientCustomRules.PathExistsInConfig(cdwConfig, "patient.attributes."),
            isWarning: false,
        },
        placeholderExistsInCDWConfigAsMasterdata: {
            name: "The specified attribute does not exist in the patient attributes of the CDW config",
            messageKey: "HPH_PAT_CFG_VALIDATION_ERROR_SOURCE_DOES_NOT_EXIST_MASTERDATA",
            rule: new patientCustomRules.PatternPlaceholderExistsInConfig(cdwConfig, "patient.attributes."),
            isWarning: false,
        },
        oneEntryWithDefaultName: {
            name: "There should be exactly one entry for the default name",
            messageKey: "CONFIG_VALIDATION_ERROR_DEFAULT_NAME_AMBIGUOUSLY_DEFINED",
            rule: new rulesLib.CompareValueValidation(
                new rulesLib.CountSelector(
                    new rulesLib.CompareValueValidation(
                        new rulesLib.ChildPropertySelector(
                            new rulesLib.BaseSelector(), "lang"), "eq", "")), "eq", 1),
        },
        uniqueLanguageKey: {
            name: "Each language can only be defined once",
            messageKey: "CONFIG_VALID_MULTIPLE_LANG",
            rule: new rulesLib.UniqueValidation(
                new rulesLib.ChildPropertySelector(
                    new rulesLib.BaseSelector(), "lang")),
        },
        validColor: {
            name: "Color has to be one of (Light|Medium|Dark)(Orange|Green|Gold|Purple|Pink)",
            messageKey: "HPH_PAT_CFG_VALIDATION_ERROR_INVALID_COLOR",
            rule: new patientCustomRules.ValueIncludedInArray(colors),
        },
        notFirstAndSecondTileAttribute: {
            name: "An Attribute is not allowed to be first and second tile attribute",
            messageKey: "VALIDATION_ERROR_FIRST_AND_SECOND_TILE_ATTRIBUTE",
            rule: new rulesLib.CompareValueValidation(
                new rulesLib.CountSelector(
                    new rulesLib.UnionOperator(
                        [
                            new rulesLib.PropertySelector(null, "firstTileAttribute"),
                            new rulesLib.PropertySelector(null, "secondTileAttribute"),
                        ],
                    ),
                ),
                "le",
                1,
            ),
            defines: ["firstTileAttribute", "secondTileAttribute"],
        },
        uniqueLaneOrder: {
            name: "Each lane requires a unique order",
            messageKey: "VALIDATION_ERROR_UNIQUE_LANE_ORDER",
            rule: new rulesLib.UniqueValidation(
                new rulesLib.ChildPropertySelector(
                    new rulesLib.BaseSelector(), "order")),
        },
        sequentialLaneOrder: {
            name: "Lane orders should be sequential and start at 0",
            messageKey: "VALIDATION_ERROR_SEQUENTIAL_LANE_ORDER",
            rule: new patientCustomRules.NumbersAreSequential(
                new rulesLib.ChildPropertySelector(
                    new rulesLib.BaseSelector(),
                    "order"),
                0),
        },
        uniqueAttributeOrder: {
            name: "Each attribute within an interaction requires a unique order",
            messageKey: "VALIDATION_ERROR_UNIQUE_ATTRIBUTE_ORDER",
            rule: new rulesLib.UniqueValidation(
                new rulesLib.ChildPropertySelector(
                    new rulesLib.BaseSelector(), "order")),
        },
        sequentialAttributeOrder: {
            name: "Attribute orders should be sequential and start at 0",
            messageKey: "VALIDATION_ERROR_SEQUENTIAL_ATTRIBUTE_ORDER",
            rule: new patientCustomRules.NumbersAreSequential(
                new rulesLib.ChildPropertySelector(
                    new rulesLib.BaseSelector(),
                    "order"),
                0),
        },
        atLeastOneLane: {
            name: "There should be at least one lane",
            messageKey: "HPH_PAT_CFG_VALIDATION_ERROR_REQUIRE_LANE",
            rule: new patientCustomRules.AtLeastOneChild(
                new rulesLib.BaseSelector(),
            ),
        },
        uniqueLaneId: {
            name: "Each lane requires a unique laneId",
            messageKey: "VALIDATION_ERROR_UNIQUE_LANE_ID",
            rule: new rulesLib.UniqueValidation(
                new rulesLib.ChildPropertySelector(
                    new rulesLib.BaseSelector(), "laneId")),
        },
        validAttributeFormatter: {
            name: "Attribute formatter can only refer to attributes in the same interaction",
            messageKey: "HPH_PAT_CFG_VALIDATION_ERROR_INVALID_ATTRIBUTE_IN_FORMATTER",
            rule: new patientCustomRules.ValidAttributeFormatter(cdwConfig),
        },
        validTimeBasedZoomOption: {
            name: "timelineTimebasedZoomOption has to be one of 1m, 3m, 6m, 1y, 3y, 5y",
            messageKey: "HPH_PAT_CFG_VALIDATION_ERROR_INVALID_TIMELINE_TIME_ZOOM_OPTION",
            rule: new patientCustomRules.ValueIncludedInArray(timeBasedZoomOptions)
        },
        validDataBasedZoomOption: {
            name: "timelineDatabasedZoomOption has to be one of lifespan, interactions, firstDOD",
            messageKey: "HPH_PAT_CFG_VALIDATION_ERROR_INVALID_TIMELINE_DATABASED_ZOOM_OPTION",
            rule: new patientCustomRules.ValueIncludedInArray(dataBasedZoomOptions)
        },
        validInitialZoomOption: {
            name: "initialZoom has to be one of leftZoom, middleZoom, rightZoom",
            messageKey: "HPH_PAT_CFG_VALIDATION_ERROR_INVALID_TIMELINE_INITIAL_ZOOM_OPTION",
            rule: new patientCustomRules.ValueIncludedInArray(initialZoomOptions)
        },
        atLeastOneVisibleTab: {
            name: "There should be at least one visible tab",
            messageKey: "VALIDATION_ERROR_NO_VISIBLE_TAB",
            rule: new rulesLib.CompareValueValidation(
                new rulesLib.CountSelector(
                    new rulesLib.CompareValueValidation(
                        new rulesLib.ChildPropertySelector(
                            new rulesLib.BaseSelector(), "visible"), "eq", true)), "ge", 1)
        },
    };

    let patternValuesArray = [{
        name: "pattern",
        type: "string",
        mandatory: true,
        strict: true,
        minLength: 1,
    }, {
        name: "values",
        type: "array",
        mandatory: false,
        strict: false,
        children: [{
            type: "string",
            regex: "^\\w+$",
        }],
    }];

    let masterDataObject = {
        name: "masterdata",
        type: "object",
        mandatory: true,
        strict: true,
        children: [{
            name: "title",
            type: "array",
            minLength: 1,
            maxLength: 1,
            mandatory: true,
            strict: true,
            children: [{
                type: "object",
                strict: true,
                children: patternValuesArray,
                rules: [rules.placeholderExistsInCDWConfigAsMasterdata],
            }],
        }, {
            name: "details",
            type: "array",
            mandatory: true,
            strict: true,
            children: [{
                type: "object",
                strict: true,
                children: patternValuesArray,
                rules: [rules.placeholderExistsInCDWConfigAsMasterdata],
            }],
        }],
    };

    let inspectorOptionsObject = {
        name: "inspectorOptions",
        type: "object",
        mandatory: true,
        strict: true,
        children: [{
            name: "tabExtensions",
            type: "array",
            mandatory: false,
            rules: [rules.atLeastOneVisibleTab],
            strict: true,
            children: [{
                type: "object",
                strict: true,
                children: [{
                    name: "extensionId",
                    type: "string",
                    minLength: 1,
                    mandatory: true,
                }, {
                    name: "visible",
                    type: "boolean",
                    mandatory: true,
                }, {
                    name: "enabled",
                    type: "boolean",
                    mandatory: false,
                }],
            }],
        }, {
            name: "widgetExtensions",
            type: "array",
            mandatory: false,
            strict: true,
            children: [{
                type: "object",
                strict: true,
                children: [{
                    name: "extensionId",
                    type: "string",
                    minLength: 1,
                    mandatory: true
                }, {
                    name: "visible",
                    type: "boolean",
                    mandatory: true
                }, {
                    name: "enabled",
                    type: "boolean",
                    mandatory: false
                }],
            }],
        }, {
            name: "timeline",
            type: "object",
            mandatory: true,
            strict: true,
            children: [{
                name: "zoom",
                type: "object",
                mandatory: true,
                children: [{
                    name: "initialZoom",
                    type: "string",
                    rules: [rules.validInitialZoomOption],
                    mandatory: true
                }, {
                    name: "leftZoom",
                    type: "string",
                    rules: [rules.validTimeBasedZoomOption],
                    mandatory: true
                }, {
                    name: "middleZoom",
                    type: "string",
                    rules: [rules.validTimeBasedZoomOption],
                    mandatory: true
                }, {
                    name: "rightZoom",
                    type: "string",
                    rules: [rules.validDataBasedZoomOption],
                    mandatory: true
                }],
            }],
        }],
    };

    let titleObject = {
        name: "title",
        type: "array",
        mandatory: true,
        strict: true,
        minLength: 1,
        maxLength: false,
        rules: [rules.oneEntryWithDefaultName, rules.uniqueLanguageKey],
        children: [{
            type: "object",
            children: [{
                name: "lang",
                type: "string",
                mandatory: true,
                regex: "^$|^[a-zA-Z]{2}$",
            }, {
                name: "value",
                type: "string",
                mandatory: true,
                minLength: 1,
                regex: "^.*\\S.*$",
            }],
        }],
    };

    let attributeObject = {
        type: "object",
        strict: true,
        rules: [
            rules.notFirstAndSecondTileAttribute,
            rules.validAttributeFormatter,
        ],
        children: [
            {
                name: "source",
                type: "string",
                mandatory: true,
                rules: [rules.sourceExistsInCDWConfig],
                regex: "^patient\\.(?:conditions\\.\\w+\\.)?interactions\\.\\w+\\.attributes\\.\\w+$",
            }, {
                name: "visible",
                type: "boolean",
                mandatory: false,
            }, {
                name: "plottable",
                type: "boolean",
                mandatory: false,
            }, {
                name: "numerical", // internal flag, will be removed before saving the config
                type: "boolean",
                mandatory: false,
            }, {
                name: "annotations",
                type: "array",
                mandatory: false,
                strict: true,
                children: [{
                    type: "string",
                    minLength: 1,
                }],
            }, {
                name: "firstTileAttribute",
                type: "boolean",
            }, {
                name: "secondTileAttribute",
                type: "boolean",
            }, {
                name: "formatter",
                type: "object",
                strict: true,
                mandatory: false,
                children: patternValuesArray,
            }, {
                name: "order",
                type: "number",
                mandatory: false,
                isInteger: true,
                rangeMin: 0,
            },
        ],
    };

    let laneInteractionsObject = {
        name: "interactions",
        type: "array",
        children: [{
            type: "object",
            strict: true,
            children: [
                {
                    name: "source",
                    type: "string",
                    mandatory: true,
                    rules: [rules.sourceExistsInCDWConfig],
                    regex: "^patient\\.(?:conditions\\.\\w+\\.)?interactions\\.\\w+$",
                }, {
                    name: "visible",
                    type: "boolean",
                    mandatory: false,
                }, {
                    name: "attributes",
                    type: "array",
                    rules: [rules.uniqueAttributeOrder, rules.sequentialAttributeOrder],
                    strict: true,
                    children: [attributeObject],
                },
                {
                    name: "plotGeneratedAttr",
                    type: "boolean",
                    mandatory: false,
                },
                {
                    name: "allowedPlottableAttr",
                    type: "array",
                    children: [{type: "string"}],
                    mandatory: false
                },
            ],
        }],
    };

    let laneObject = {
        type: "object",
        strict: true,
        children: [titleObject, {
            name: "laneId",
            type: "string",
            mandatory: true,
        }, {
            name: "color",
            type: "string",
            mandatory: true,
            rules: [rules.validColor],
        }, {
            name: "visible",
            type: "boolean",
            mandatory: false,
        }, {
            name: "order",
            type: "number",
            mandatory: false,
            isInteger: true,
            rangeMin: 0,
        }, {
            name: "initiallyFiltered",
            type: "boolean",
            mandatory: false,
        }, {
            name: "laneType",
            type: "string",
            mandatory: true,
        }, {
            name: "tilesHidden",
            type: "boolean",
            mandatory: false,
        },
        laneInteractionsObject],
    };

    let lanesObject = {
        name: "lanes",
        type: "array",
        strict: true,
        mandatory: true,
        rules: [rules.uniqueLaneOrder, rules.sequentialLaneOrder, rules.atLeastOneLane, rules.uniqueLaneId],
        children: [laneObject],
    };

    let configInformations = {
        name: "configInformations",
        type: "object",
        strict: true,
        mandatory: false,
        children: [
            {
                name: "note",
                type: "string",
                mandatory: false,
            },
        ],
    };

    let validDefinition = {
        type: "object",
        strict: true,
        children: [masterDataObject, inspectorOptionsObject, lanesObject, configInformations],
    };

    return validDefinition;
}

/**
 * Get the validity definition object for the config.
 * @param   {object} cdwConfig CDW config object, used for reference
 * @returns {object} Validity object
 */
export function getDefinition(cdwConfig) {
    return getValidDefinition(cdwConfig);
}
