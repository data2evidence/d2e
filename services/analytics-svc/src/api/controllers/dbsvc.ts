import { Logger } from "@alp/alp-base-utils";
import * as config from "../../utils/DBSvcConfig";
import * as dbUtils from "../../utils/DBSvcDBUtils";
import { DBDAO } from "../../dao/DBDAO";

const logger = Logger.CreateLogger("analytics-log");

export async function getCDMVersion(req, res, next) {
    let dialect: string = req.swagger.params.databaseType.value;
    let tenant: string = req.swagger.params.tenant.value;
    let schema: string = req.swagger.params.schemaName.value;

    try {
        let dbDao = new DBDAO(dialect, tenant);
        const dbConnection = await dbDao.getDBConnectionByTenantPromise(
            tenant,
            req,
            res
        );

        const cdmVersion = await dbDao.getCDMVersion(dbConnection, schema);

        let hanaKey = "CDM_VERSION";
        let cdmVersionKey =
            dialect === config.DB.HANA
                ? hanaKey
                : dbUtils.convertNameToPg(hanaKey);
        res.status(200).json(cdmVersion[0][cdmVersionKey]);
    } catch (err) {
        logger.error(`Error retrieving CDM version: ${err}`);
        const httpResponse = {
            status: 500,
            message: "Something went wrong when retrieving data",
            data: [],
        };
        res.status(200).json(httpResponse);
    }
}

export async function checkIfSchemaExists(req, res, next) {
    let dialect: string = req.swagger.params.databaseType.value;
    let tenant: string = req.swagger.params.tenant.value;
    let schema: string = req.swagger.params.schemaName.value;

    try {
        let dbDao = new DBDAO(dialect, tenant);
        const dbConnection = await dbDao.getDBConnectionByTenantPromise(
            tenant,
            req,
            res
        );
        const schemaExists = await dbDao.checkIfSchemaExists(
            dbConnection,
            schema
        );
        res.status(200).send(schemaExists);
    } catch (err) {
        logger.error(`Error checking if schema exists: ${err}`);
        const httpResponse = {
            status: 500,
            message: "Something went wrong when checking if schema exists",
            data: [],
        };
        res.status(500).json(httpResponse);
    }
}

// hana only
export async function getSnapshotSchemaMetadata(req, res, next) {
    let dialect: string = req.swagger.params.databaseType.value;
    let tenant: string = req.swagger.params.tenant.value;
    let schema = req.swagger.params.schemaName.value;

    try {
        if (dialect === config.DB.POSTGRES) {
            throw new Error("Route is not supported for this dialect!");
        }

        let dbDao = new DBDAO(dialect, tenant);
        const dbConnection = await dbDao.getDBConnectionByTenantPromise(
            tenant,
            req,
            res
        );
        const results = await dbDao.getSnapshotSchemaMetadata(
            dbConnection,
            schema
        );
        res.status(200).json(results);
    } catch (err: any) {
        logger.error("Error while getting schema snapshot metadata");
        return next(err);
    }
}
