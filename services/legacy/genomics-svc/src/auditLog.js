(function (exports) {

    "use strict";

    let xsenv = require("@sap/xsenv");
    let audit = require('@sap/audit-logging');
    let error = require(__base + "error");

    function getSubAccountId(context) {
        var sContext = context.httpRequest.authInfo;
        var sAID = "ONPREMISE";
        if (sContext !== undefined) {
            sAID = sContext.getSubaccountId !== undefined ? sContext.getSubaccountId() : sContext.getIdentityZone();
        }
        return sAID;
    }

    async function isAuditLogEnabled(context) {
        var query = 'SELECT TO_NVARCHAR("Data") as DATA FROM "hc.hph.config.db.models::Configuration.Config" WHERE "Id" = ? and "Version" = ? ';
        var res = await context.connection.executeQuery(query, 'chp.audit', '2');
        if (res.length > 0) {
            var status = res[0].DATA;
            return status.toLowerCase() === 'true' ? true : false;
        } else {
            throw new error.BioInfError("error.auditLogDisabled", []);
        }
    }

    function auditlogConfig() {
        return new Promise(
            (resolve, reject) => {
                var auditLogCredentials = xsenv.getServices({ auditlog: 'chp-auditlog' }).auditlog;
                audit.v2(
                    auditLogCredentials,
                    (error, auditLog) => {
                        if (error) {
                            reject(console.log('Error:', error));
                        }
                        else {
                            resolve(auditLog);
                        }
                    }
                );
            }
        );
    }

    async function logAttributes(context, sampleListTable, channel, objectType, attributes, logAll, groupConfig) {
        if ((objectType !== "Patient") && (objectType !== "Interaction")) {
            throw new BioInfError("error.Internal", [objectType], "Invalid object type for logging");
        }
        if (await isAuditLogEnabled(context)) {
            if (context.iAuditLoggingThreshold === null) {
                const resultSet = await context.connection.executeQuery("SELECT MAX( CAST(\"Data\" AS INTEGER) ) AS \"Threshold\" FROM \"hc.hph.config.db.models::Configuration.Config\" WHERE \"Id\" = 'CHPAuditLogThreshold' AND \"Status\" = 'A'");
                context.iAuditLoggingThreshold = (resultSet.length === 1) && (resultSet[0].Threshold !== null) ? resultSet[0].Threshold : 10;
            }
            const objects = await context.connection.executeQuery("SELECT DISTINCT BINTOHEX(\"" + objectType + "DWID\") AS \"id\" FROM \"hc.hph.genomics.db.models::General.Samples\" AS \"Samples\" INNER JOIN \""+sampleListTable+"\" AS \"SampleList\" ON \"Samples\".\"SampleIndex\" = \"SampleList\".\"SampleIndex\"");
            if ((!logAll) && (objects.length > context.iAuditLoggingThreshold)) {
                return;
            }
            
            var user = context.httpRequest.user.id;
            var auditLog = await auditlogConfig();
            try {
                await Promise.all(objects.map(
                    object => {
                        var message = auditLog.read({ type: objectType, id: { key: objectType + " Id: " + object.id } });
                        for (var i = 0; i < attributes.length; i++) {
                            message.attribute(attributes[i]);
                        }
                        if (groupConfig && groupConfig.table && groupConfig.attribute) {
                            message.attribute({name: `hc.hph.genomics.db.models::SNV.${groupConfig.table}.${groupConfig.attribute}`, successful: true});
                        }
                        message.dataSubject({ type: objectType, id: { key: object.id } });
                        message.accessChannel(channel);
                        message.tenant(getSubAccountId(context));
                        message.by(user);
                        return new Promise((resolve, reject) => {
                            message.log(function (err) {
                                if (err) {
                                    reject(error.normalize(err));
                                }
                                else {
                                    resolve();
                                }
                            });
                        });
                    }
                ));
            }
            catch (exception) {
                context.trace.error("Error while adding audit log: error code: " + exception.errorCode + ", error message: " + exception.message);
                throw exception;
            }
        }
    }
    exports.getSubAccountId = getSubAccountId;
    exports.isAuditLogEnabled = isAuditLogEnabled;
    exports.auditlogConfig = auditlogConfig;
    exports.logAttributes = logAttributes;
})(module.exports);