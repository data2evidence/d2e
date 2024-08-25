import {utils as utilsLib} from "@alp/alp-base-utils";
import { ConfigFormatterOptionsType } from "../types";

const defaultOptions: ConfigFormatterOptionsType = {
    restrictToLanguage: true,
    applyDefaultAttributes: true,
    includeDisabledElements: false,
    concatOTSAttributes: true,
};

export function format({ config, options, lang = "" }: { config: any, options: ConfigFormatterOptionsType, lang: string }) {
    const configWalkFunction = utilsLib.getJsonWalkFunction(config);

    // set default values
    options = {
        ...options,
        ...defaultOptions,
    };

    // call formatting functions
    if (options.restrictToLanguage) {
        _restrictToLanguage(config, configWalkFunction, lang);
    }
    if (options.applyDefaultAttributes) {
        _applyDefaultAttributes(config, configWalkFunction);
    }
    if (!options.includeDisabledElements) {
        _excludeDisabledElements(config, configWalkFunction);
    }
    if (options.concatOTSAttributes) {
        _concatOTSAttributes(config, configWalkFunction);
    }

    return config;
}

export function _getRequestedLanguage() {
    const requestedLanguage = "";
    /** TODO: Replace with node.js compatably code
    // Take language from the request
    //requestedLanguage = $.request ? $.request.language : "";

    // If requestedLanguage was not found in the request, try
    // with the session
    //if (!requestedLanguage || requestedLanguage === "") {
    //    requestedLanguage = $.session.language;
    //}
    // If requestedLanguage still is not found, do 'dev'
    if (!requestedLanguage || requestedLanguage === "") {
        requestedLanguage = "";
    }
    // Make string lowercase (e.g., because Firefox reports de-de
    // while Chrome reports de-DE)
    requestedLanguage = requestedLanguage.toLowerCase();
    if (requestedLanguage.indexOf("-") !== -1) {
        requestedLanguage = requestedLanguage.substring(0,
            requestedLanguage.indexOf("-"));
    }*/
    return requestedLanguage;
}

export function _getNameFromNameObj(nameObj, requestedLanguage) {
    let val = "";
    if (typeof (nameObj) === "string") {
        return nameObj;
    }
    nameObj.some((name) => {
        if (name.lang === requestedLanguage) {
            val = name.value;
            return true;
        } else if (name.lang === "") {
            val = name.value;
        }
    });
    return val;
}

export function _restrictToLanguage(config, configWalkFunction, requestedLanguage: string = "") {
    configWalkFunction("**.name")
        .forEach((name) => {
            const translation = _getNameFromNameObj(name.obj, requestedLanguage);
            utilsLib.replaceObjectByPath(config, name.path, translation);
        });
}

export function _applyDefaultAttributes(config, configWalkFunction) {
    const defaultAttributeKeys = Object.keys(config.patient.attributes).filter(
        (key) => {
            const attr = config.patient.attributes[key];
            return attr.isDefault;
        });
    configWalkFunction("**.interactions.*")
        .forEach((interaction) => {
            defaultAttributeKeys.forEach((key) => {
                const path = interaction.path + ".attributes." + key;
                const value = config.patient.attributes[key];
                utilsLib.createPathInObject(config, path, value);
            });
        });
    for (let i = 0; i < defaultAttributeKeys.length; i++) {
        delete config.patient.attributes[defaultAttributeKeys[i]];
    }
}

export function _excludeDisabledElements(config, configWalkFunction) {
    const elements = configWalkFunction("**.interactions.*").concat(configWalkFunction("**.attributes.*"));
    elements.forEach((element) => {
        if (element.obj.isDisabled) {
            utilsLib.deleteObjectByPath(config, element.path);
        }
    });
}

export function _concatOTSAttributes(config, configWalkFunction) {
    const elements = configWalkFunction("**.interactions.*.attributes.*");

    elements.forEach((element) => {
        const concatArr = [];
        if (element.obj.defaultFilter) {
            concatArr.push(element.obj.defaultFilter);
        }

        // lets check if all preconditions for an OTS attribute are fulfilled:
        // 1 - having a custom table:
        // 2 - having all properties: otsLanguage, otsSubject and otsHierarchyLevel
        if (element.obj.from && element.obj.from["@CODE"] && element.obj.otsLanguage && element.obj.otsSubject && element.obj.otsHierarchyLevel) {

            if (!element.obj.otsTermContext) { element.obj.otsTermContext = "cancer"; }

            const otsExpression = `(@CODE."LANGUAGE" = '${element.obj.otsLanguage}' AND
                @CODE."SUBJECT" = '${element.obj.otsSubject}' AND
                @CODE."HIERARCHY_LEVEL" = '${element.obj.otsHierarchyLevel}' AND
                @CODE."TERM_CONTEXT" = '${element.obj.otsTermContext}') `;

            concatArr.push(otsExpression);
        }

        element.obj.defaultFilter = concatArr.join(" AND ");
    });
}
