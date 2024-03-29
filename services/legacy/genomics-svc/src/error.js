(function (exports) {
	"use strict";

	let stackRegEx = /^\s*at\s+([^\s([]+(?=.*\())?\s*(?:\[as\s+([^\s\]\)]+)\])?\s*(?:\()?([^:)]+)(?::([0-9]+)(?::([0-9]+))?)?(?:\))?\s*$/i;

	class BioInfError extends Error {
		constructor(errorCode, parameters, message, stackTrace, ...params) {
			super(message ? message : undefined, ...params);
			this.errorCode = errorCode;
			this.httpStatusCode = 500;
			this.parameters = Array.isArray(parameters) ? parameters : parameters ? [parameters] : [];
			this.fatal = false;
			if (Array.isArray(stackTrace)) {
				this.stackTrace = stackTrace;
			}
			else if (typeof stackTrace === "string") {
				this.stackTrace = BioInfError.parseStack(stackTrace);
			}
			else {
				this.stackTrace = BioInfError.parseStack(this.stack);
			}
		}

		toJSON() {
			return {
				errorCode: this.errorCode ? this.errorCode : "error.Unknown",
				parameters: this.parameters ? this.parameters : [],
				message: this.message ? this.message : null,
				stack: this.stackTrace
			};
		}

		toString() {
			return JSON.stringify(this.toJSON());
		}

		static parseStack(stack) {
			return stack.split('\n')
				.slice(1)
				.map(
					string => {
						let matches = string.match(stackRegEx);
						return matches ? {
							function: matches[2] ? matches[1].split(".").slice(0, -1).concat([matches[2]]).join(".") : matches[1],
							file: matches[3],
							line: matches[4] ? parseInt(matches[4], 10) : undefined,
							column: matches[5] ? parseInt(matches[5], 10) : undefined
						} : string;
					}
				);
		}
	}

	class BioInfHTTPError extends BioInfError {
		constructor(httpStatusCode, message, ...params) {
			let error = typeof (message) === "string" ? { message: message } : message;
			super(error.errorCode ? error.errorCode : "error.HTTP", error.errorCode && error.parameters ? error.parameters : [httpStatusCode], error.message, error.stack, ...params);
			this.httpStatusCode = httpStatusCode;
		}
	}

	class BioInfFatalError extends BioInfHTTPError {
		constructor(httpStatusCode, message, ...params) {
			super(httpStatusCode, message, ...params);
			this.fatal = true;
		}
	}

	class BioInfSecurityError extends BioInfFatalError {
		constructor(message, ...params) {
			super(403, message, params);
			console.error("SECURITY INCIDENT! " + message);
		}
	}

	function normalize(exception) {
		try {
			if (exception instanceof BioInfError) {
				return exception;
			}
			else {
				return new BioInfError("error.XSJS", [exception.name, exception.message], exception.toString(), typeof (exception.stack) === "string" ? exception.stack : undefined);
			}
		}
		catch (exception) {
			console.error(exception);
			return new BioInfError("error.Internal", [exception], exception.toString());
		}
	}

	exports.BioInfError = BioInfError;
	exports.BioInfHTTPError = BioInfHTTPError;
	exports.BioInfFatalError = BioInfFatalError;
	exports.BioInfSecurityError = BioInfSecurityError;
	exports.normalize = normalize;
})(module.exports);