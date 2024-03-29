require('dotenv').config({ debug: process.env.DEBUG })
import { HealthCheckError } from '@godaddy/terminus'
import winston from 'winston'
import { readFileSync } from 'fs'

let properties: object
let logger: winston.Logger

export const getProperties = (): any => {
  if (!properties) {
    properties = {
      ALP_INGESTION_HTTP_PORT: Number(process.env.ALP_INGESTION_HTTP_PORT),
      ALP_INGESTION_BASE_PATH: String(process.env.ALP_INGESTION_BASE_PATH),
      POSTGRES_CONNECTION_CONFIG: JSON.parse(getEnv('POSTGRES_CONNECTION_CONFIG')),
      POSTGRES_DATABASES_CREDENTIALS: JSON.parse(getEnv('POSTGRES_DATABASES_CREDENTIALS')),
      PHDP_DD_DECRYPTION_PRIVATE_KEYS: JSON.parse(getEnv('PHDP_DD_DECRYPTION_PRIVATE_KEYS')),
      POSTGRES_DATABASE_NAME: String(process.env.PG__DATA_INGESTION__DB_NAME),
      SWIFT_URL: String(process.env.SWIFT_OAUTH_URL),
      SWIFT_USERNAME: String(process.env.SWIFT_USERNAME),
      SWIFT_PASSWORD: String(process.env.SWIFT_PASSWORD),
      SWIFT_TENANT: String(process.env.SWIFT_TENANT),
      NODE_ENV: String(process.env.NODE_ENV).toUpperCase(),
      ALP_SYSTEM_ID: String(process.env.ALP_SYSTEM_ID)
    }

    // Load and replace credentials and config with integration test values
    if (process.env.NODE_ENV === 'TEST') {
      properties = {
        ...properties,
        POSTGRES_CONNECTION_CONFIG: JSON.parse(getEnv('INTEGRATION_TEST__POSTGRES_CONNECTION_CONFIG')),
        POSTGRES_DATABASES_CREDENTIALS: JSON.parse(getEnv('INTEGRATION_TEST__POSTGRES_DATABASES_CREDENTIALS'))
      }
    }
  }
  return properties
}

const getEnv = (envKey: string): string => {
  const isProd = process.env.NODE_ENV === 'production'
  const k8sPathPrefix = '/var/alp-ingestion-svc'
  return isProd ? readFileSync(`${k8sPathPrefix}/${envKey}`, 'utf-8') : process.env[envKey]!
}

export function getLogger() {
  if (!logger) {
    logger = winston.createLogger({
      level: process.env.ALP_INGESTION_LOGLEVEL,
      format: winston.format.json(),
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
            winston.format.colorize(),
            winston.format.printf(info => {
              return `[${info.timestamp}] ${info.level}: ${info.message}`
            })
          )
        })
      ]
    })
  }
  return logger
}

export function getTerminusOptions(logger: winston.Logger, appBasePath: string): object {
  const options: any = {
    // cleanup options
    timeout: 5000, // [optional = 1000] number of milliseconds before forceful exiting
    logger: logger.error, // [optional] logger function to be called with errors.
    onShutdown: () => {
      logger.error('Server shutting down..')
    }
  }

  const health: any = {
    verbatim: true // [optional = false] use object returned from /healthcheck verbatim in response
  }

  health[`${appBasePath}/health`] = async function () {
    // a function returning a promise indicating service health,
    const errors: any[] = []
    return Promise.all(
      [
        // all your health checks goes here
      ].map((p: any) =>
        p.catch((error: Error) => {
          // silently collecting all the errors
          errors.push(error)
          return undefined
        })
      )
    ).then(() => {
      if (errors.length) {
        throw new HealthCheckError('healthcheck failed', errors)
      }
    })
  }
  options['healthChecks'] = health // health check options
  return options
}

export enum DB {
  HANA,
  POSTGRES
}
