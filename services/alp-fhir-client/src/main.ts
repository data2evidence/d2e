import { createLogger } from './logger';
import https from 'https'
import { env } from './env'
import express from 'express'
import { readAndCreateBotFromConfig } from './utils/botUtils';

const app = express()
const logger = createLogger('FHIR Client');

function load_bots(){
  readAndCreateBotFromConfig()
}

async function bootstrap() {
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
    load_bots()
}
bootstrap()
  