"use strict";

global.__base = __dirname + "/";

let express = require("express");
let passport = require("passport");
let hdbext = require("@sap/hdbext");
let xsenv = require("@sap/xsenv");
let xssec = require("@sap/xssec");
let logging = require("@sap/logging");
let bodyParser = require("body-parser");
let extensions = require(__base + "extensions");
let auditLib = require(__base + "auditLog");
let error = require(__base + "error");

let app = express();
let appContext = logging.createAppContext();

async function checkScope(httpRequest, httpResponse, next) {
	if (httpRequest.authInfo.checkLocalScope("chp.Genomics.svc")) {
		next();
	}
	else {
		await auditLib.auditlogConfig().then(auditLog => new Promise((resolve, reject) => {
			auditLog
				.securityMessage('missing scope %s', "chp.Genomics.svc")
				.by((!httpRequest.user) || httpRequest.user.id === undefined ? "undefined" : httpRequest.user.id)
				.tenant(httpRequest.authInfo !== undefined ? httpRequest.authInfo.getSubaccountId !== undefined ? httpRequest.authInfo.getSubaccountId() : httpRequest.authInfo.getIdentityZone() : "ONPREMISE")
				.log(function (err) {
					if (err) {
						reject(err);
					}
					else {
						resolve();
					}
				});
		}));
		httpResponse.status(403).send("Not authorized to call Genomics Backend Services");
	}
}

app
	.use(logging.expressMiddleware(appContext))
	.use(passport.initialize())
	// .use(passport.authenticate("JWT", { session: false }))
	// .use(checkScope)
	.use(hdbext.middleware(xsenv.getServices({ hana: { tag: "hana" } }).hana))
	.use(bodyParser.json());

// define application routes
app.get("/hc/hph/genomics/services/?\*", extensions.handleRequest);
app.post("/hc/hph/genomics/services/?\*", extensions.handleRequest);

// start server
let port = process.env.PORT || 3011;
app.listen(
	port,
	function () {
		console.log("Listening on port " + port);
	}
);