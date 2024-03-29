//Imports
import http from 'http'
import express from 'express'
import winston from 'winston'
import { createTerminus } from '@godaddy/terminus'
require('dotenv').config({ debug: process.env.DEBUG })

import Routes from './routes'
import * as config from './utils/config'

class App {
  private app: express.Application
  private port: number
  private logger: winston.Logger

  constructor() {
    this.app = express()
    this.port = config.getProperties()['ALP_INGESTION_HTTP_PORT'] || 3444
    this.logger = config.getLogger()
    this.initializeMiddlewares()
    this.initializeEntryPoint()
  }

  private initializeMiddlewares() {
    this.app.use(express.json())
    this.app.use(express.urlencoded({ extended: true }))
  }

  private initializeEntryPoint() {
    //This is only for Main entry point. Please add other the routes in the Routes constructor of routes/index.ts
    this.app.use(config.getProperties()['ALP_INGESTION_BASE_PATH'] || '/', new Routes().getRouter())

    //Error Handling finally
    this.app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
      this.logger.error(err.message)
      this.logger.error(err.stack)
      res.status(500).json(err.message)
    })

    //404
    this.app.use((req: express.Request, res: express.Response) => {
      const err = `Unable to find the requested resource: ${req.protocol}://${req.get('host')}${req.originalUrl}`
      this.logger.error(err)
      res.status(404).json({ message: err })
    })
  }

  public start() {
    const server = http.createServer(this.app)
    this.logger.error
    createTerminus(server, config.getTerminusOptions(this.logger, config.getProperties()['ALP_INGESTION_BASE_PATH']))
    server.listen(this.port)
    this.startUpMessage()
  }

  public getConfiguredApp = () => {
    return this.app
  }

  private startUpMessage = () => {
    this.logger.log('info', `********************************************************`)
    this.logger.log('info', `ALP Ingestion service is listening on port ${this.port}`)
    this.logger.log('info', `********************************************************`)
  }
}

if (process.env.NODE_ENV === 'TEST') {
  module.exports = new App().getConfiguredApp()
} else {
  new App().start()
}
