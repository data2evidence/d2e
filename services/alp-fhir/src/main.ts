import { createLogger } from './logger';
import "reflect-metadata";
import https from 'https'
import helmet from 'helmet'
import { env } from './env'
import express from 'express'
import { readAndCreateBotFromConfig } from './utils/botUtils';
import { Container } from 'typedi'
import Routes from './routes';
import { Connection } from '@alp/alp-base-utils';
import path from 'path';
import { access, constants } from "node:fs/promises";
//import { getDuckdbDBConnection } from './utils/DuckdbConnection';

const logger = createLogger('FHIR Client');

function load_bots(){
  readAndCreateBotFromConfig()
}

// const getDBConnections = async ({
//   credentials: any
//   userObj: any,
// }): Promise<{
//   connection: Connection.ConnectionInterface;
// }> => {
//   // Define defaults for both analytics & Vocab connections
//   let connectionPromise;

//   const duckdbSchemaFileName = `${credentials.code}_${credentials.schema}`;
//   const duckdbVocabSchemaFileName = `${credentials.code}_${credentials.vocabSchema}`;

//       try {
//           // // Check duckdb dataset access
//           // await access(
//           //     path.join(env.DUCKDB__DATA_FOLDER, duckdbSchemaFileName),
//           //     constants.R_OK
//           // );
//           // await access(
//           //     path.join(env.DUCKDB__DATA_FOLDER, duckdbVocabSchemaFileName),
//           //     constants.R_OK
//           // );
//           // logger.debug(
//           //     `Duckdb accessible at paths ${path.join(
//           //         env.DUCKDB__DATA_FOLDER,
//           //         duckdbSchemaFileName
//           //     )} AND ${path.join(
//           //         env.DUCKDB__DATA_FOLDER,
//           //         duckdbVocabSchemaFileName
//           //     )}`
//           // );

//           connectionPromise = new Promise(
//               async (resolve, _reject) => {
//                   try {
//                       const conn = await getDuckdbDBConnection(
//                           duckdbSchemaFileName,
//                           duckdbVocabSchemaFileName
//                       );
//                       resolve(conn);
//                   } catch (err) {
//                       resolve(err);
//                   }
//               }
//           );
//       } catch (e) {
//           logger.error(e);
//           logger.warn(
//               `Duckdb Inaccessible at following paths ${path.join(
//                   env.DUCKDB__DATA_FOLDER,
//                   duckdbSchemaFileName
//               )} OR ${path.join(
//                   env.DUCKDB__DATA_FOLDER,
//                   duckdbVocabSchemaFileName
//               )}. Hence fallback to Postgres dialect connection`
//           );
//       }

//   const [connection] = await Promise.all([
//       connectionPromise,
//   ]);

//   return {
//       connection,
//   };
// };

const initRoutes = async (app: express.Application) => {
  app.use(helmet())
  app.use(express.json({ strict: false, limit: '50mb' }))
  app.use(express.urlencoded({ extended: true, limit: '50mb' }))
}
//   if (envVarUtils.isStageLocalDev()) {
//     app.use(timerMiddleware())
//   }

//   configCredentials = {
//     database: env.PG__DB_NAME,
//     schema: env.PG_SCHEMA,
//     dialect: env.PG__DIALECT,
//     host: env.PG__HOST,
//     port: env.PG__PORT,
//     user: env.PG_USER,
//     password: env.PG_PASSWORD,
//     max: env.PG__MAX_POOL,
//     min: env.PG__MIN_POOL,
//     idleTimeoutMillis: env.PG__IDLE_TIMEOUT_IN_MS
//   }

//   app.use(async (req: IMRIRequest, res, next) => {
//     if (!utils.isHealthProbesReq(req)) {
//       log.debug(`🚀 ~ file: main.ts ~ line 141 ~ app.use ~ req.headers: ${JSON.stringify(req.headers, null, 2)}`)
//       let userObj: User
//       try {
//         userObj = getUser(req)
//         log.debug(`🚀 ~ file: main.ts ~ line 146 ~ app.use ~ req.headers: ${JSON.stringify(req.headers, null, 2)}`)
//         log.debug(`🚀 ~ file: main.ts ~ line 146 ~ app.use ~ currentUser: ${JSON.stringify(userObj, null, 2)}`)
//       } catch (err) {
//         log.debug(`No user found in request:${err.stack}`)
//       }

//       try {
//         let credentials = null

//         const configConnection = await dbConnectionUtil.DBConnectionUtil.getDBConnection({
//           credentials: configCredentials,
//           schemaName: configCredentials.schema,
//           userObj,
//         })

//         req.dbConnections = {
//           analyticsConnection: null,
//           configConnection,
//         }
//       } catch (err) {
//         next(err)
//       }
//     }
//     next()
//   })

//   logger.info('Initialized express routes..')
//   Promise.resolve()
// }

const registerRoutes = async (app: express.Application) => {
  const routes = Container.get(Routes)
  app.use('/', routes.getRouter())
}

async function main() {
  const app = express()
  await initRoutes(app)
  await registerRoutes(app)
  
  const server = https.createServer(
      {
          key: process.env.TLS__INTERNAL__KEY,
          cert: process.env.TLS__INTERNAL__CRT,
          maxHeaderSize: 8192 * 10,
      },
      app
    )
      
    server.listen(process.env.PORT)
    logger.info(`🚀 ALP FHIR Client started on port ${env.PORT}`)
    load_bots()
}

try {
  main()
} catch (err: any) {
  logger.error(`
        Bookmark svc failed to start! Kindly fix the error and restart the application. ${err.message}
        ${err.stack}`)
  process.exit(1)
}
  