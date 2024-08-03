// tslint:disable:no-console
import * as dotenv from "dotenv";
import {
    Logger,
    EnvVarUtils,
    healthCheckMiddleware,
    utils,
} from "@alp/alp-base-utils";
import express from "express";
import helmet from "helmet";
import path from "path";
import * as xsenv from "@sap/xsenv";
import * as swagger from "@alp/swagger-node-runner";
import noCacheMiddleware from "./middleware/NoCache";
import timerMiddleware from "./middleware/Timer";
import os = require("os");
import https from "https";

dotenv.config();
const log = Logger.CreateLogger("query-gen-log");
const envVarUtils = new EnvVarUtils(process.env);

const initRoutes = async (app: express.Application) => {
    app.use(helmet());
    app.use(express.json({ strict: false, limit: "50mb" }));
    app.use(express.urlencoded({ extended: true, limit: "50mb" }));
    app.use(noCacheMiddleware);

    app.use((req, res, next) => {
        log.addRequestCorrelationID(req);
        next();
    });

    if (envVarUtils.isStageLocalDev()) {
        app.use(timerMiddleware());
    }

    app.use("/check-readiness", healthCheckMiddleware);

    log.info("Initialized express routes..");
    Promise.resolve();
};

const initSwaggerRoutes = async (app: express.Application) => {
    const config = {
        appRoot: __dirname, // required config
        swaggerFile: path.join(
            `${process.cwd()}`,
            "api",
            "swagger",
            "swagger.yaml"
        ),
    };

    swagger.create(config, (err, swaggerRunner) => {
        if (err) {
            return Promise.reject(err);
        }
        try {
            let swaggerExpress = swaggerRunner.expressMiddleware();
            swaggerExpress.register(app); // install middleware
            log.info("Swagger routes Initialized..");
            Promise.resolve();
        } catch (err) {
            log.error("Error initializing swagger routes: " + err);
            Promise.reject(err);
        }
    });
};

const main = async () => {
    const port = process.env.PORT || 3006;

    //initialize Express
    const app = express();

    app.use("/check-liveness", healthCheckMiddleware);

    /**
     * Call Startup Functions
     */

    await initRoutes(app);
    await initSwaggerRoutes(app);
    utils.setupGlobalErrorHandling(app, log);

    if (envVarUtils.isTestEnv() && !envVarUtils.isHttpTestRun()) {
        app.listen(port);
        log.info(
            `Test mode details: [isTestEnv: ${envVarUtils.isTestEnv()}, test schema name: ${
                process.env.TESTSCHEMA
            }]`
        );
    } else {
        const server = https.createServer(
            {
                key: process.env.TLS__INTERNAL__KEY?.replace(/\\n/g, "\n"),
                cert: process.env.TLS__INTERNAL__CRT?.replace(/\\n/g, "\n"),
                ca: process.env.TLS__INTERNAL__CA_CRT?.replace(/\\n/g, "\n"),
                maxHeaderSize: 8192 * 10,
            },
            app
        );

        server.listen(port, () => {
            log.info(
                `🚀 Query-gen svc started successfully!. Server listening on port ${port} [hostname: ${os.hostname}...`
            );
        });
    }
};

try {
    main();
} catch (err) {
    log.error(`
        Query-gen svc failed to start! Kindly fix the error and restart the application. ${err.message}
        ${err.stack}`);
    process.exit(1);
}
