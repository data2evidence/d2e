 /**
 * @file CHP Plugin Registry Request Handler for Patient Summary
 */

import request = require("request");
import qs = require("querystring");
import { Logger } from "@alp/alp-base-utils";
import { DEFAULT_ACTIVE_TAB_EXT, DEFAULT_ACTIVE_WIDGET_EXT } from "./config";
const log = Logger.CreateLogger();

export interface ExtensionPointType {
    component: string;
    description: string;
    multiplicity: string;
    name: string;
    pointId: string;
    version: string;
    xsjslibrary: string;
};

export interface PluginExtensionType {
    extensionId: string;
    extensionName: string;
    extensionAlias: string;
    pluginName: string;
    status: string;
};

export interface PluginExtensionMetadataType {
    annotations: any;
    id: string;
    key: string;
    namespace: string;
    path: string;
    urlParams: any;
    navTargets: any;
    settings: any;
    stretchContent: boolean;
};

/**
 * Makes a GET request to the CHP Plugin Registry service
 * @returns {Object} - parsed JSON response
 */
function callPluginRegistry({req, payload, callback}) {
    try {
        const options = {
            url: `${req.chpUrl}/sap/hc/hph/core/services/PluginRegistry.xsjs`,
            method: "GET",
            qs: payload,
            headers: { "Authorization": req.get("Authorization"),
                       "accept-language": req.get("accept-language") },
        };
        log.info(`[INFO] Sending ${options.method} request to CHP Plugin Registry Service with:
            payload: ${JSON.stringify(options.qs)}`);
        request(options, (err, response, body) => {
            if (err) {
                log.error(err);
                callback(err, null);
            } else if (response.statusCode !== 200) {
                log.error(`[ERROR] Plugin Registry response was not 200!
                    status: ${response.statusCode} '${response.statusMessage}'
                    body: ${body !== "null" ? body : "null"}`);
                callback(new Error("CHP_PLUGIN_REGISTRY_UNEXPECTED_RESPONSE"), null);
            } else {
                log.info(`[INFO] CHP Plugin Registry Service responded with:
                    status: ${response.statusCode} '${response.statusMessage}'
                    body length: ${body !== "null" ? body.length : "null"}`);
                callback(null, JSON.parse(body));
            };
        });
    } catch (err) {
        log.error("[ERROR] There was a problem while calling CHP Plugin Registry Service!");
        log.error(err);
        callback(err, null);
    }
};

/**
 * Gets all extensions of an extension point (aka namespace) with a specific version (mandatory)
 * @returns {PluginExtensionType[]} - list of all extensions for a given extension point (namespace)
 */
async function getAllExtensions(req, namespace: string, version: string): Promise<PluginExtensionType[]> {
    return new Promise<PluginExtensionType[]>(async (resolve, reject) => {
        var payload = {action: "allextensions", extensionpoint: namespace, version: version};
        callPluginRegistry({
            req,
            payload,
            callback: (err, allExtensions) => {
                if (err) {
                    return reject(err);
                };
                return resolve(allExtensions || []);
            }
        });
    });
};

/**
 * Gets only active extensions of an extension point (aka namespace) with a specific version (mandatory)
 * WARNING: if there are no active extensions, Plugin Registry returns 'null' (not an empty array)!
 * @returns {PluginExtensionType[]} - list of all active extensions for a given extension point (namespace)
 */
async function getActiveExtensions(req, namespace: string, version: string): Promise<PluginExtensionType[]> {
    return new Promise<PluginExtensionType[]>(async (resolve, reject) => {
        var payload = {action: "activeextensions", extensionpoint: namespace, version: version};
        callPluginRegistry({
            req,
            payload,
            callback: (err, activeExtensions) => {
                if (err) {
                    return reject(err);
                };
                return resolve(activeExtensions || []);
            }
        });
    });
};

/**
 * Filters provided extensions by given property and value
 * @returns {PluginExtensionType[]} - list of matching extensions
 */
function filterByProperty(extensions, property: string, value: any): PluginExtensionType[] {
    return extensions.filter(extension => extension[property] === value);
};

/**
 * Gets all (optionally, only active) extensions of an extension point regardless of version
 * Useful as the Plugin Registry depends on a specific version as mandatory input when fetching extensions
 * Removes falsy values from the final result, e.g., null or empty results
 * @returns {PluginExtensionType[]} - list of all (active) extensions, all versions
 */
async function getExtensions(req, sExtensionEndPoint, bOnlyActive = false): Promise<PluginExtensionType[]> {
    var aVersions = await getEndPointVersions(req, sExtensionEndPoint);
    let aResults = await Promise.all(aVersions.map(async (sVersion) => {
        var allExtensions = await getAllExtensions(req, sExtensionEndPoint, sVersion) || [];
        if (bOnlyActive) {
            return filterByProperty(allExtensions, "status", "ACTIVE");
        } else {
            return allExtensions;
        };
    }));
    return ([] as PluginExtensionType[]).concat(...aResults).filter(Boolean);
};

/**
 * Gets metadata (e.g., path) for a given extension from Plugin Registry
 * WARNING: if a plugin is missing metadata for any reason, Plugin Registry returns 'null' (NOT an error)!
 * @returns {PluginExtensionMetadataType} - list of extension attributes
 */
async function getActiveExtensionMetadata(req, extensionId: any): Promise<PluginExtensionMetadataType> {
    return new Promise<PluginExtensionMetadataType>(async (resolve, reject) => {
        var payload = {action: "activeextensiondetail", extension: extensionId};
        callPluginRegistry({
            req,
            payload,
            callback: (err, activeExtensionMetadata) => {
                if (err) {
                    return reject(err);
                };
                return resolve(activeExtensionMetadata);
            }
        });
    });
};

/**
 * Gets all extension points (namespaces) available from Plugin Registry
 * @returns {ExtensionPointType[]} - list of extension points
 */
async function getEndPoints(req): Promise<ExtensionPointType[]> {
    return new Promise<ExtensionPointType[]>(async (resolve, reject) => {
        var payload = {action: "extensionpoints"};
        callPluginRegistry({
            req,
            payload,
            callback: (err, extensionPoints) => {
                if (err) {
                    return reject(err);
                };
                return resolve(extensionPoints);
            }
        });
    });
};

/**
 * Gets all extension points (namespaces) & makes an array of versions available for the given namespace
 * @returns {String[]} - list of versions for an extension point
 */
async function getEndPointVersions(req, namespace: string) {
    var allEndpoints = await getEndPoints(req);
    return allEndpoints
        .filter( (mEndpoint) => {
            return mEndpoint.pointId && mEndpoint.pointId === namespace;
        })
        .map( (mEndpoint) => {
            return mEndpoint.version;
    });
};

/**
 * For each extension point, gets all (active) extensions;
 * For each extension, gets metadata in order to return an enriched list of extentions
 * @returns {object} - Contains lists of extensions enriched with extension metadata per extension point
 */
async function getAllExtensionsWithMetadata(req, bOnlyActive = false) {
    let extensions = {
        interaction: [],
        tab: [],
        widget: [],
    };
    var interactionExtensions = await getExtensions(req, "sap.hc.hph.patient.app.interaction", bOnlyActive);
    var tabExtensions = await getExtensions(req, "sap.hc.hph.patient.app.tab", bOnlyActive);
    var widgetExtensions = await getExtensions(req, "sap.hc.hph.patient.app.widget", bOnlyActive);
    extensions.interaction = (await Promise.all(interactionExtensions.map(async (activeExtension) => {
        if (activeExtension) {
            let contribution = await getActiveExtensionMetadata(req, activeExtension.extensionId);
            // NOTE: workaround for Plugin Registry returning 'null' if no metadata instead of an error, change in next release
            if (contribution) {
                return {
                    id: activeExtension.extensionId,
                    name: activeExtension.pluginName,
                    annotations: contribution.annotations,
                    namespace: contribution.namespace,
                    path: contribution.path,
                    status: activeExtension.status
                };
            } else {
                log.warn(`[WARNING] Plugin Registry did not return any metadata for the following active extension, will skip!
                    id: ${activeExtension.extensionId}
                    name: ${activeExtension.pluginName}
                    extension point: sap.hc.hph.patient.app.interaction`);
                return null;
            };
        };
    }))).filter(Boolean);
    extensions.tab = (await Promise.all(tabExtensions.map(async (activeExtension) => {
        if (activeExtension) {
            let contribution = await getActiveExtensionMetadata(req, activeExtension.extensionId);
            // NOTE: workaround for Plugin Registry returning 'null' if no metadata instead of an error, change in next release
            if (contribution) {
                return {
                    annotations: contribution.annotations,
                    id: activeExtension.extensionId,
                    name: activeExtension.extensionName,
                    alias: activeExtension.extensionAlias || activeExtension.extensionName,
                    key: contribution.key,
                    namespace: contribution.namespace,
                    path: contribution.path,
                    settings: contribution.settings,
                    stretchContent: contribution.stretchContent,
                    urlParams: contribution.urlParams || contribution.navTargets,
                    status: activeExtension.status
                };
            } else {
                log.warn(`[WARNING] Plugin Registry did not return any metadata for the following active extension, will skip!
                    id: ${activeExtension.extensionId}
                    name: ${activeExtension.pluginName}
                    extension point: sap.hc.hph.patient.app.tab`);
                return null;
            };
        };
    }))).filter(Boolean);
    extensions.widget = (await Promise.all(widgetExtensions.map(async (activeExtension) => {
        if (activeExtension) {
            let contribution = await getActiveExtensionMetadata(req, activeExtension.extensionId);
            // NOTE: workaround for Plugin Registry returning 'null' if no metadata instead of an error, change in next release
            if (contribution) {
                return {
                    id: activeExtension.extensionId,
                    name: activeExtension.extensionName,
                    alias: activeExtension.extensionAlias || activeExtension.extensionName,
                    namespace: contribution.namespace,
                    path: contribution.path,
                    settings: contribution.settings,
                    status: activeExtension.status
                };
            } else {
                log.warn(`[WARNING] Plugin Registry did not return any metadata for the following active extension, will skip!
                    id: ${activeExtension.extensionId}
                    name: ${activeExtension.pluginName}
                    extension point: sap.hc.hph.patient.app.widget`);
                return null;
            };
        };
    }))).filter(Boolean);
    return extensions;
};

async function getExtensionsWithNames({req, psConfig, callback}) {
    try {
        psConfig.assertPermission(psConfig.PRIVILEGES.GET_AS_ADMIN);
        let aPRTabExtensions = await getExtensions(req, "sap.hc.hph.patient.app.tab");
        let aTabExtensions = aPRTabExtensions.map(function (oExtension) {
            let visible = DEFAULT_ACTIVE_TAB_EXT.indexOf(oExtension.extensionId) >= 0;
            let enabled = oExtension.status === "ACTIVE";
            return {
                extensionId: oExtension.extensionId,
                name: oExtension.extensionName,
                alias: oExtension.extensionAlias,
                visible: visible && enabled,
                enabled: enabled
            };
        });
        let aPRWidgetExtensions = await getExtensions(req, "sap.hc.hph.patient.app.widget");
        let aWidgetExtensions = aPRWidgetExtensions.map(function (oExtension) {
            let visible = DEFAULT_ACTIVE_WIDGET_EXT.indexOf(oExtension.extensionId) >= 0;
            let enabled = oExtension.status === "ACTIVE";
            return {
                extensionId: oExtension.extensionId,
                name: oExtension.extensionName,
                alias: oExtension.extensionAlias,
                visible: visible && enabled,
                enabled: enabled
            };
        });
        callback(null, {
            tabs: aTabExtensions,
            widgets: aWidgetExtensions
        });
    } catch (e) {
        callback("error", e.message);
    }
};

export default {
    getAllExtensions,
    getActiveExtensions,
    getAllExtensionsWithMetadata,
    getExtensions,
    getExtensionsWithNames,
    getActiveExtensionMetadata,
    getEndPoints,
    getEndPointVersions
};

