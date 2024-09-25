import express from "express";
import async from "async";
import * as config from "./DBSvcConfig";

export const strUC = (input: any) => {
    if (input === undefined || input === null) {
        //As long as the input is not null / undefined
        throw new Error("Invalid input to capitalize string");
    } else {
        return String(input).toUpperCase();
    }
};

export const strLC = (input: any) => {
    if (input === undefined || input === null) {
        //As long as the input is not null / undefined
        throw new Error("Invalid input to capitalize string");
    } else {
        return String(input).toLowerCase();
    }
};

export const getBoolean = (input: any) => {
    return strUC(input) === "TRUE";
};

export const runAsyncParallel = (
    tasks: any[],
    callback: (err: any, results: any) => any
) => {
    async.parallelLimit(
        async.reflectAll(tasks),
        3, //Limit to 3 concurrent tasks at a time
        // optional callback
        (err, results: any) => {
            callback(err, results);
        }
    );
};

export const prepareResponseForAsyncParallel = (
    results: any,
    successKeyName: string = "successfulSchemas",
    failureKeyName: string = "failedSchemas"
) => {
    const response: any = {
        message: "",
        [successKeyName]: [],
        [failureKeyName]: [],
        errorOccurred: false,
    };
    // values
    // results[0].value = 'one'
    // results[1].error = Error('bad stuff happened')
    // results[2].value = 'two'
    results.forEach((result: any) => {
        if (result.error) {
            response.errorOccurred = true;
            response[failureKeyName].push(result.error.message);
        } else {
            response[successKeyName].push(result.value);
        }
    });

    return response;
};

export const sendResponseWithResults = (
    response: any,
    successMessage: string,
    failMessage: string,
    res: express.Response,
    next: express.NextFunction
) => {
    if (response.errorOccurred) {
        response.message = failMessage;
        next(new Error(JSON.stringify(response)));
    } else {
        response.message = successMessage;
        res.send(response);
    }
};

export const asyncRouterCallback = (
    successMessage: string,
    failMessage: string,
    res: express.Response,
    next: express.NextFunction,
    successKeyName = "successfulSchemas",
    failureKeyName = "failedSchemas"
) => {
    return (err: any, results: any) => {
        const response = prepareResponseForAsyncParallel(
            results,
            successKeyName,
            failureKeyName
        );
        sendResponseWithResults(
            response,
            successMessage,
            failMessage,
            res,
            next
        );
    };
};

export const asyncResponseWithCSVCallback = (
    res: express.Response,
    next: express.NextFunction
) => {
    return (err: any, result: any) => {
        var response: any;
        if (result.error) {
            response = {
                message: result.error.message,
                errorOccurred: true,
            };
            next(new Error(JSON.stringify(response)));
        } else {
            res.set({
                "Content-Type": "text/csv",
                "Content-Disposition": `attachment; filename="Questionnaire_AND_Response.csv"`,
            }).send(result);
        }
    };
};

export const asyncResponseWithJSONCallback = (
    res: express.Response,
    next: express.NextFunction
) => {
    return (err: any, result: any) => {
        var response: any;
        if (result.error) {
            response = {
                message: result.error.message,
                errorOccurred: true,
            };
            next(new Error(JSON.stringify(response)));
        } else {
            res.send(result);
        }
    };
};

class MultiLogs {
    log: string; //Visible in K8s Kibana
    auditLog: object; //Visible in Audit Kibana
    baseAuditMessage = {
        "log-type": "audit",
        "app": "alp-db-svc",
    };

    constructor(
        genericLog: string,
        auditLog: object,
        isError: boolean = false
    ) {
        (this.log = genericLog), //Visible in K8s Kibana
            (this.auditLog = {
                ...this.baseAuditMessage,
                ...{ op: genericLog },
                ...auditLog,
                isError,
            });
    }

    print() {
        config
            .getLogger()
            .log(
                (<any>this.auditLog)["isError"] ? "error" : "info",
                JSON.stringify(this.log)
            );
        config
            .getLogger()
            .log(
                (<any>this.auditLog)["isError"] ? "error" : "info",
                JSON.stringify(this.auditLog)
            );
    }
}

export let createMultiLogs = (
    genericMessage: string,
    audit: object,
    isError: boolean = false
) => {
    return new MultiLogs(genericMessage, audit, isError);
};

export let printLogs = (results: any) => {
    for (let result of results) {
        if (typeof result === "object") {
            let resultArray = Array.isArray(result) ? result : [result];
            for (let resultItem of resultArray) {
                if (resultItem instanceof MultiLogs) {
                    resultItem.print();
                } else {
                    config.getLogger().info(JSON.stringify(resultItem));
                }
            }
        } else {
            config.getLogger().info(result); //Assuming its a string
        }
    }
};

/*const originalStderrWrite = process.stderr.write.bind(process.stderr);
const originalStOutWrite = process.stdout.write.bind(process.stdout);

export const enablePasswordMask = () => {
    process.stderr.write = (data: string | Buffer, cb?: any): boolean => {
        let msg = data.toString().replace(/password=\S+/i, "***");
        return originalStderrWrite(msg, cb);
    };
    process.stdout.write = (data: string | Buffer, cb?: any): boolean => {
        let msg = data.toString().replace(/password=\S+/i, "***");
        return originalStOutWrite(msg, cb);
    };
};*/
