import 'reflect-metadata'
import express, { Application, json, urlencoded } from 'express'
import { Container } from 'typedi'
import { useContainer } from 'class-validator'
import { createLogger } from './logger'
import { env } from './env'
import { Routes } from './routes'
import { setupReqContext, healthCheck } from './common/middleware'
import { runMigrations } from './common/data-source/db-migration'
import dataSource from './common/data-source/data-source'
import { loadLocalDatabaseCredentials } from './local-setup'
import https from 'https'

const PORT = env.PORT || 8000
const logger = createLogger()

export class App {
  private app: Application

  constructor() {
    this.app = express()
  }

  private registerMiddlewares() {
    this.app.use(json())
    this.app.use(urlencoded({ extended: true }))
    this.app.use(setupReqContext)
    this.app.use('/check-liveness', healthCheck)
    this.app.use('/check-readiness', healthCheck)
  }

  private registerRoutes() {
    const routes = Container.get(Routes)
    this.app.use('/db-credentials', routes.getRouter()) //(new Routes(new DbRouter(new DbService()))).getRouter())
  }

  private registerValidatorContainer() {
    useContainer(Container, {
      fallback: true,
      fallbackOnErrors: true
    })
  }

  private async initialiseDataSource() {
    try {
      await dataSource.initialize()
      logger.info('Datasource is initialised')
      await runMigrations()
      if (env.NODE_ENV === 'development') {
        loadLocalDatabaseCredentials(logger)
      }
    } catch (error) {
      //console.log(env.PG_HOST)
      logger.error(`Error while initialising datasource: ${error}`)
      process.exit(0)
    }
  }

  async start() {
    await this.initialiseDataSource()
    this.registerMiddlewares()
    this.registerRoutes()
    this.registerValidatorContainer()

    /*const server = https.createServer(
    //   {
    //     key: env.SSL_PRIVATE_KEY,
    //     cert: env.SSL_PUBLIC_CERT,
    //     maxHeaderSize: 8192 * 10
    //   },
    //   this.app
    // )*/

    this.app.listen(PORT)
    logger.info(`🚀 ALP DB Credentials Manager started successfully!. Server listening on port ${PORT}`)
  }
}

//new App().start()
