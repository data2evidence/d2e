import { createLogger } from './logger';
import "reflect-metadata";
import https from 'https'
import helmet from 'helmet'
import { env } from './env'
import express from 'express'
const logger = createLogger('FHIR Client');
import { readAndCreateBotFromConfig } from './utils/botUtils';

const initRoutes = async (app: express.Application) => {
  app.use(helmet())
  app.use(express.json({ strict: false, limit: '50mb' }))
  app.use(express.urlencoded({ extended: true, limit: '50mb' }))
}

async function main() {
  const app = express()
  await initRoutes(app)  
  const server = https.createServer(
      {
          key: env.TLS__INTERNAL__KEY,
          cert: env.TLS__INTERNAL__CRT,
          maxHeaderSize: 8192 * 10,
      },
      app
    )
      
    server.listen(env.PORT)
    logger.info(`🚀 ALP FHIR Client started on port ${env.PORT}`)
    readAndCreateBotFromConfig();
}

try {
  main()
} catch (err: any) {
  logger.error(`
        Fhir svc failed to start! Kindly fix the error and restart the application. ${err.message}
        ${err.stack}`)
  process.exit(1)
}
  