import 'reflect-metadata'
import express, { Application, json, urlencoded } from 'express'
import { Container } from 'typedi'
import { useContainer } from 'class-validator'
import { createLogger } from './logger'
import { env } from './env'
import Routes from './routes'
import { setupReqContext, healthCheck } from './common/middleware'
import { runMigrations } from './common/data-source/db-migration'
import dataSource from './common/data-source/data-source'
import { loadLocalDatabaseCredentials } from './local-setup'

const PORT = env.PORT || 8000
const logger = createLogger()

class App {
  private app: Application

  constructor() {
    this.app = express()

    this.initialiseDataSource()
    this.registerMiddlewares()
    this.registerRoutes()
    this.registerValidatorContainer()
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
    this.app.use('/', routes.getRouter())
  }

  private registerValidatorContainer() {
    useContainer(Container, {
      fallback: true,
      fallbackOnErrors: true
    })
  }

  private initialiseDataSource() {
    dataSource
      .initialize()
      .then(() => {
        logger.info('Datasource is initialised')
        if (env.NODE_ENV === 'development') {
          loadLocalDatabaseCredentials(logger)
        }
      })
      .catch(error => {
        logger.error(`Error while initialising datasource: ${error}`)
        process.exit(0)
      })
  }

  start() {
    runMigrations().then(() => {
      this.app.listen(PORT)
      logger.info(`🚀 ALP DB Credentials Manager started successfully!. Server listening on port ${PORT}`)
    })
  }
}

new App().start()
