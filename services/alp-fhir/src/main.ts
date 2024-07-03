//1. Connects to medplum client
//2. Creates each of the bots defined in config.json - Needs project Id?
import { createLogger } from './logger';
import https from 'https'
import { env } from './env'
import express from 'express'
const app = express()

const logger = createLogger('FHIR Server');

function load_bots(){

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
      
    server.listen(8103)
    logger.info(`🚀 ALP FHIR Server started on port 8103`)
    load_bots()
  }
bootstrap()
  