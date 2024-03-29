(function (exports) {
	"use strict";

	let hdb = require(__base + "hdb-promise");
	let error = require(__base + "error");
	let http = require("http");
	let https = require("https");
	let xsenv = require("@sap/xsenv");
	let uuid = require("uuid/v1");
	let url = require('url');
	let cdwEndPoint = "/hc/hph/cdw/config/services/config.xsjs";
	let extensionLibs = {};
	let keywords = {
		"true": true,
		"false": false,
		"null": null,
		"undefined": undefined
	};
	let numericRegEx = /^(\+|-)?(\d*\.?)\d+([eE](\+|-)?\d+)?$/;
	let externalExtensionRegEx = /^\/hc\/hph\/genomics\/services\/external\/(.*)?$/;
	let externalExtensionURLRegEx = /^([^:/]+):(.*)?$/;
	let slashesRegEx = /\//g;
	let doubleSlashesRegEx = /\/(?=\/)/g;
	let jsonContentTypeRegEx = /application\/json(;.*)/;

	// get the function related to an extension

	function getFunction(extension) {
		if (!extension) {
			throw new error.BioInfError("error.NoRequestSpecified");
		}

		if (externalExtensionURLRegEx.test(extension)) // URL style requests are always external
		{
			let urlComponents = extension.match(externalExtensionURLRegEx);
			extension = "external" + urlComponents[1] + urlComponents[1].replace(slashesRegEx, ".");
		}

		let extensionComponents = extension.split(".");
		if (extensionComponents.length < 2) {
			throw new error.BioInfError("error.MissingExtensionPrefix", [extension]);
		}

		if (extensionComponents[0] === "external") {
			let serviceName = extensionComponents[1];
			let path = "/" + extensionComponents.slice(2).join("/");
			if (externalExtensionRegEx.test(path)) {
				throw new error.BioInfError("error.LoadingExtension", [extensionComponents.join("."), "Cyclic extension calling detected"]);
			}
			else {
				return async (context, parameters) => {
					let queryParameters = null;
					if (parameters.queryParameters) {
						queryParameters = parameters.queryParameters;
						delete parameters.queryParameters;
					}
					return context.sendRequest(serviceName, {
						method: "POST",
						path: path,
						queryParameters: queryParameters,
						body: parameters
					});
				}
			}
		}
		else {
			let functionName = extensionComponents.pop();
			let extensionLib = extensionLibs[extensionComponents.join(".")];

			if (!extensionLib) {
				try {
					extensionLib = require(__base + "extensions/" + extensionComponents.join("/"));
					extensionLibs[extensionComponents.join(".")] = extensionLib;
				}
				catch (exception) {
					throw new error.BioInfError("error.LoadingExtension", [extensionComponents.join("."), exception.toString()]);
				}
			}

			let extensionFunction = extensionLib.api[functionName];
			if (typeof extensionFunction === "function") {
				return extensionFunction;
			}
			else {
				throw new error.BioInfError("error.unknownFunction", [functionName, extensionComponents.join(".")]);
			}
		}
	}

	// decode text based parameters

	function decodeParameters(parameters) {
		if (typeof parameters === "object") {
			return Object.keys(parameters).reduce(
				(decodedParameters, key) => {
					if (parameters[key].toLowerCase() in keywords) {
						decodedParameters[key] = keywords[parameters[key].toLowerCase()];
					}
					else if (numericRegEx.test(parameters[key])) {
						decodedParameters[key] = parseFloat(parameters[key]);
					}
					else {
						decodedParameters[key] = parameters[key];
					}
					return decodedParameters;
				},
				{}
			);
		}
		else {
			return {};
		}
	}

	// merge parameters from multiple objects into one similar to $.extend( {}, ... ) of jQuery

	function mergeParameters(...parameters) {
		return parameters.reduce(
			function (mergedParameters, newParameters) {
				if (typeof newParameters === "object") {
					for (let parameterName in newParameters) {
						if (newParameters.hasOwnProperty(parameterName)) {
							mergedParameters[parameterName] = newParameters[parameterName];
						}
					}
				}
				return mergedParameters;
			},
			{}
		);
	}

	// context class for keeping request-local information

	class Context {
		constructor(httpRequest, connection) {
			this.requests = [];
			this.initRequests = [];
			this.globalParameters = decodeParameters(httpRequest.query);
			this.singleRequest = true;
			this.directResult = false;
			this.debug = false;
			this.validationPlugin = null;
			this.validationParameters = {};
			this.method = httpRequest.method ? httpRequest.method + ":" : "http:";
			if (httpRequest.headers && httpRequest.headers["host"]) {
				let hostComponents = httpRequest.headers["host"].split(":");
				this.hostName = hostComponents[0];
				this.port = hostComponents[1] ? hostComponents[1] : 80;
			}
			else {
				this.hostName = "localhost";
				this.port = "80";
			}
			this.headers = httpRequest.headers ? httpRequest.headers : {};
			this.connection = connection;
			this.globalConfig = null;
			this.trace = httpRequest.loggingContext ? httpRequest.loggingContext.getTracer("extensions.Context") : {
				debug: message => console.log("[DEBUG] " + message),
				path: message => console.log("[PATH] " + message),
				info: message => console.log("[INFO] " + message),
				warning: message => console.log("[WARNING] " + message),
				error: message => console.error("[ERROR] " + message),
				fatal: message => console.error("[FATAL] " + message),
				getLevel: () => "debug",
				isEnabled: level => true
			};
			this.log = httpRequest.loggingContext ? httpRequest.loggingContext.getLogger("/hc/hph/genomics/services/") : {
				info: message => console.log("[INFO] " + message),
				warning: message => console.log("[WARNING] " + message),
				error: message => console.error("[ERROR] " + message),
				fatal: message => console.error("[FATAL] " + message),
				getLevel: () => "info",
				isEnabled: level => true
			};

			// parse request and parameters
			if (httpRequest.method === "GET") {
				this.requests.push({ name: httpRequest.params[0].split("/").filter(component => component).join(".") });
				if (this.globalParameters.validationPlugin) {
					this.setValidationPlugin(this.globalParameters.validationPlugin, this.globalParameters.validationParameters ? JSON.parse(this.globalParameters.validationParameters) : {});
					delete this.globalParameters.validationPlugin;
					delete this.globalParameters.validationParameters;
				}
				this.singleRequest = true;
				this.directResult = this.globalParameters.directResult !== "0";
				delete this.globalParameters.directResult;
				if (this.globalParameters.debug) {
					this.debug = true;
					delete this.globalParameters.debug;
				}
			}
			else if (httpRequest.method === "POST") {
				if (Array.isArray(httpRequest.body.requests)) {
					if (httpRequest.params[0] || httpRequest.body.request) {
						throw new error.BioInfError("error.CouldNotDetermine", [httpRequest.body.requests], "Conflicting request definitions");
					}
					this.requests = httpRequest.body.requests;
					this.singleRequest = false;
				}
				else if (httpRequest.body.request) {
					if (httpRequest.params[0] || httpRequest.body.requests) {
						throw new error.BioInfError("error.CouldNotDetermine", [httpRequest.body.requests], "Conflicting request definitions");
					}
					this.requests.push({name: httpRequest.body.request});
					this.singleRequest = true;
					if (httpRequest.body.directResult) {
						this.directResult = true;
					}
				}
				else if (httpRequest.params && httpRequest.params[0]) {
					if (httpRequest.body.request || httpRequest.body.requests) {
						throw new error.BioInfError("error.CouldNotDetermine", [httpRequest.body.requests], "Conflicting request definitions");
					}
					this.requests.push({ name: httpRequest.params[0].split("/").filter(component => component).join(".") });
					this.singleRequest = true;
					if (httpRequest.body.directResult || httpRequest.body.directResult === undefined || httpRequest.body.directResult === null) {
						this.directResult = true;
					}
				}
				this.globalParameters = mergeParameters(this.globalParameters, httpRequest.body.parameters);
				if (httpRequest.body.initRequests) {
					this.initRequests = httpRequest.body.initRequests;
				}
				if (httpRequest.body.validationPlugin) {
					this.setValidationPlugin(httpRequest.body.validationPlugin, httpRequest.body.validationParameters);
				}
				if (httpRequest.body.debug) {
					this.debug = true;
				}
			}

			this.iAuditLoggingThreshold = null;
			this.httpRequest = httpRequest;
		}

		async close() {
			if (this.connection) {
				(await this.connection).close();
				this.connection = null;
			}
		}

		setValidationPlugin(validationPlugin, validationParameters) {
			this.validationPlugin = validationPlugin;
			this.validationParameters = validationParameters;
		}

		async setSamplesFromDataset(dataset) {
			if (!dataset) {
				throw new error.BioInfError("error.MissingRequestParameter", ["dataset"]);
			}
			else {
				let datasetClass = dataset.split(":")[0];
				let datasetClassElements = datasetClass.split(".");
				let datasetPlugin;
				if (datasetClassElements.length === 1) {
					datasetPlugin = getFunction("datasets." + datasetClass + ".setSamples");
				}
				else if (datasetClassElements.length === 2) {
					datasetPlugin = getFunction(datasetClassElements[0] + ".datasets." + datasetClassElements[1] + ".setSamples");
				}
				else {
					throw new error.BioInfError("error.InvalidDataset", [dataset]);
				}
				let sampleListTableName = await this.createTemporarySampleTable();
				await datasetPlugin(this, {groupId: dataset.slice(datasetClass.length + 1), tableName: sampleListTableName});
				if (this.validationPlugin) {
					let validationFunction = getFunction(this.validationPlugin + ".validateSamples");
					let validationParameters = this.validationParameters ? mergeParameters(this.validationParameters, {tableName: sampleListTableName} ) : {tableName: sampleListTableName};
					let validatedSampleListTableName = await validationFunction(this, validationParameters);
					return validatedSampleListTableName ? validatedSampleListTableName : sampleListTableName;
				}
				else {
					throw new error.BioInfSecurityError("Validation plugin not provided");
				}
			}
		}

		generateTemporaryTableName() {
			return '#TMP' + uuid().replace(/-/g, "").toUpperCase();
		}

		async createTemporarySampleTable() {
			let tableName = this.generateTemporaryTableName();
			await this.connection.executeUpdate('CREATE LOCAL TEMPORARY TABLE "' + tableName + '" ( "SampleIndex" INTEGER )');
			return tableName;
		}

		async createTemporarySampleGroupsTable() {
			let tableName = this.generateTemporaryTableName();
			await this.connection.executeUpdate('CREATE LOCAL TEMPORARY TABLE "' + tableName + '" ( "SampleGroup" NVARCHAR(255), "SampleIndex" INTEGER )');
			return tableName;
		}

		async createTemporaryDWAuditIDTable() {
			let tableName = this.generateTemporaryTableName();
			await this.connection.executeUpdate('CREATE LOCAL TEMPORARY TABLE "' + tableName + '" ( "DWAuditID" BIGINT )');
			return tableName;
		}

		async createTemporaryVariantGroupingTable() {
			let tableName = this.generateTemporaryTableName();
			await this.connection.executeUpdate('CREATE LOCAL TEMPORARY TABLE "' + tableName + '" ( "DWAuditID" BIGINT, "VariantIndex" INTEGER, "AlleleIndex" INTEGER, "Grouping" TINYINT )');
			return tableName;
		}

		getGlobalConfig(...keys) {
			// load config if not already done
			if (!this.globalConfig) {
				this.globalConfig = this.connection.executeQuery("SELECT \"Data\" FROM \"hc.hph.config.db.models::Configuration.Config\" where \"Id\" = 'GlobalSettings' AND \"Version\" = 'A'")
					.then(result => {
						if (result.length === 0) // default configuration
						{
							return this.sendRequest('cdw', {
								method: "GET",
								path: cdwEndPoint,
								queryParameters: { action: "getDefaultAdvancedSettings" }
							}, 10).then(responseContent => {
								var customViewObject = {
									guardedTableMapping: { "@PATIENT": responseContent.guardedTableMapping["@PATIENT"] }
								};
								if (customViewObject.guardedTableMapping["@PATIENT"] === undefined || customViewObject.guardedTableMapping["@PATIENT"] === null || customViewObject.guardedTableMapping["@PATIENT"] === '') {
									customViewObject.guardedTableMapping["@PATIENT"] = responseContent.tableMapping["@PATIENT"];
								}
								return customViewObject;
							});
						}
						else if (result.length === 1) {
							return JSON.parse(result[0].Data);
						}
						else {
							return null;
						}
					});
			}

			// return key
			return this.globalConfig.then(globalConfig => keys.reduce((config, key) => config ? config[key] : config, globalConfig));
		}

		getExtension(extension, globalParameters) {
			let extensionFunction;
			if (typeof extension === "string") {
				extensionFunction = getFunction(extension);
			}
			else if (extension instanceof Function) {
				extensionFunction = extension;
			}
			else {
				throw new error.BioInfError("error.unknownFunction");
			}
			if (!globalParameters) {
				globalParameters = this.globalParameters;
			}
			return async parameters => extensionFunction(this, mergeParameters(globalParameters, parameters));
		}

		async executeRequest(request, globalParameters) {
			if (request !== null) {
				let executionStartTime = Date.now();
				let response = {};
				try {
					// execute main request
					if (typeof request === "string") {
						this.trace.debug("Executing " + request + " with parameters " + JSON.stringify(globalParameters));
						response.result = await this.getExtension(request, globalParameters)();
						this.trace.debug("Returned result " + response.result);
					}
					else if ((request instanceof Object) && request.name) {
						this.trace.debug("Executing " + request.name + " with parameters " + JSON.stringify(globalParameters) + " and " + JSON.stringify(request.parameters));
						response.result = await this.getExtension(request.name, globalParameters)(request.parameters);
						if (request.suppressResult) {
							response.suppressResult = true;
							if (request.exceptionsFatal === null || request.exceptionsFatal === undefined) {
								request.exceptionsFatal = true;
							}
						}
						this.trace.debug("Returned result " + response.result);
					}
					else {
						throw new error.BioInfError("error.CouldNotDetermine", [request]);
					}

					// execute sub-requests in parallel based on main request result if present
					if ((request instanceof Object) && Array.isArray(request.subRequests) && response.hasOwnProperty("result")) {
						response.subResults = await Promise.all(
							request.subRequests.map(
								async subRequest => {
									// copy parameters from main request into sub-requests
									if (!subRequest.parameters) {
										subRequest.parameters = {};
									}
									if ((typeof subRequest.attribute === "string") || (typeof subRequest.attribute === "number")) {
										subRequest.parameters[subRequest.attribute] = response.result[subRequest.attribute];
									}
									else if (Array.isArray(subRequest.attribute)) {
										for (attribute of subRequest.attribute) {
											subRequest.parameters[attribute] = response.result[attribute];
										}
									}

									// execute sub-request recursively
									return this.executeRequest(subRequest, request.parameters ? mergeParameters(globalParameters, request.parameters) : globalParameters);
								}
							)
						);
					}
				}
				catch (exception) {
					if (exception.fatal || (request.parameters && (request.parameters.exceptionsFatal || ((request.parameters.exceptionsFatal !== false) && globalParameters.exceptionsFatal)))) {
						this.trace.error("Request execution failed with fatal exception " + exception);
						throw exception;
					}
					else {
						this.trace.warning("Request execution failed with exception " + exception);
						delete response.result;
						response.error = error.normalize(exception);
					}
				}
				if (this.debug) {
					response.executionTime = Date.now() - executionStartTime;
					response.request = request;
				}
				return response;
			}
			else {
				return null;
			}
		}

		async executeAllRequests() {
			// execute initial requests sequentially
			let initResults = [];
			if (this.initRequests && Array.isArray(this.initRequests)) {
				for (let request of this.initRequests) {
					initResults.push(await this.executeRequest(request, this.globalParameters));
				}
			}

			// execute main requests in parallel
			if (this.requests && Array.isArray(this.requests) && (this.requests.length > 0)) {
				return initResults.concat(await Promise.all(this.requests.map(request => this.executeRequest(request, this.globalParameters))));
			}
			else if (this.initRequests && Array.isArray(this.initRequests) && (this.initRequests.length > 0)) {
				return initResults;
			}
			else {
				throw new error.BioInfError("error.NoRequestSpecified");
			}
		}

		async sendRequest(serviceName, options, retries) {
			// get service endpoint
			const serviceRegistry = JSON.parse(process.env["registry"]);
			const serviceURL = serviceRegistry.reduce( (resolvedService, service) => {
				if (resolvedService) {
					return resolvedService;
				}
				else if (service.name === serviceName) {
					return url.parse(service.url);
				}
				else {
					return null;
				}
			}, null );
			if (!serviceURL) {
				throw new error.BioInfError('error.Internal', [serviceName], `Could not resolve service ${serviceName}`);
			}

			// adjust request options
			let requestOptions = mergeParameters(options, {protocol: serviceURL.protocol, hostname: serviceURL.hostname, port: serviceURL.port});
			if (!options.path) {
				requestOptions.path = serviceURL.path;
			}
			else {
				requestOptions.path = (serviceURL.path + '/' + options.path).replace(doubleSlashesRegEx, '');
			}
			delete requestOptions.host;
			if (options.queryParameters) {
				requestOptions.path += "?" + Object.entries(options.queryParameters).map(entry => encodeURIComponent(entry[0]) + "=" + encodeURIComponent(entry[1])).join("&");
				delete requestOptions.queryParameters;
			}
			requestOptions.headers = options.headers ? mergeParameters(options.headers, {authorization: this.headers.authorization}) : {authorization: this.headers.authorization};
			let payload = options.body;
			if (payload && typeof(payload) === "object") {
				requestOptions.headers["content-type"] = "application/json;charse=utf-8";
				payload = JSON.stringify(payload);
			}
			delete requestOptions.body;
			requestOptions.headers["content-length"] = payload ? payload.length.toString() : "0";

			// send asynchronous request
			return new Promise(
				(resolve, reject) => {
					let request = (requestOptions.protocol === 'http:' ? http : https).request(
						requestOptions,
						response => {
							let body = "";
							response
								.on("data", chunk => body += chunk);
							if (response.statusCode >= 200 && response.statusCode < 300) {
								response.on("end",
									() => {
										try {
											if (!body) {
												resolve(null);
											}
											else if (jsonContentTypeRegEx.test(response.headers['content-type'])) {
												resolve(JSON.parse(body));
											}
											else {
												resolve(body);
											}
										}
										catch (exception) {
											reject(error.normalize(exception));
										}
									}
								);
							}
							else if (retries > 0 && (response.statusCode === 502 || response.statusCode === 503 || response.statusCode === 504)) {
								setTimeout(() => this.sendRequest(serviceName, options, retries - 1).then(resolve).catch(reject), 500);
							}
							else {
								response.on("end",
									() => {
										try {
											if (!body) {
												body = null;
											}
											else if (jsonContentTypeRegEx.test(response.headers['content-type'])) {
												body = JSON.parse(body);
											}
											this.trace.error(body);
											reject(new error.BioInfHTTPError(response.statusCode, body && body.errorCode ? body : `${options.method} ${serviceName}:${options.path} failed: ${response.statusMessage}`));
										}
										catch (exception) {
											reject(error.normalize(exception));
										}
									}
								);
							}
						}
					);
					request.on("error", exception => reject(error.normalize(exception)));
					if (payload) {
						request.write(payload);
					}
					request.end();
				}
			);
		}
	}

	// create new request context

	async function createContext(httpRequest, connection) {
		if (!connection) {
			connection = httpRequest.db ? new hdb.Connection(httpRequest.db) : await hdb.connect(xsenv.getServices({ hana: { tag: "hana" } }).hana);
		}
		return new Context(httpRequest, connection);
	}

	// HTTP request handler

	async function handleRequest(httpRequest, httpResponse, next) {
		try {
			let context = await createContext(httpRequest);
			let responses = (await context.executeAllRequests()).filter(response => !response.suppressResult);
			if (context.singleRequest) {
				if ((responses.length == 0) || ((!responses[0].hasOwnProperty("error")) && (responses[0].result === undefined))) {
					httpResponse.status(204); // no content
					httpResponse.send();
				}
				else if (context.directResult) {
					if (responses[0].hasOwnProperty("error")) {
						throw responses[0].error;
					}
					else if (Array.isArray(responses[0].result) || (responses[0].result !== null && ((typeof (responses[0].result) === "object") || (typeof (responses[0].result) === "string")))) {
						httpResponse.status(200);
						httpResponse.json(responses[0].result);
					}
					else {
						httpResponse.status(204); // no content
						httpResponse.send();
					}
				}
				else {
					httpResponse.status(200);
					httpResponse.json(responses[0]);
				}
			}
			else {
				httpResponse.status(200);
				httpResponse.json(responses);
			}
			context.close()
				.catch(exception => console.error(`Error while closing context: ${exception}`));
		}
		catch (exception) {
			let normalizedException = error.normalize(exception);
			httpResponse.status(normalizedException.httpStatusCode);
			httpResponse.json(normalizedException);
		}
	}

	// export shared functions and objects

	exports.getFunction = getFunction;
	exports.mergeParameters = mergeParameters;
	exports.handleRequest = handleRequest;
	exports.createContext = createContext;
})(module.exports);
