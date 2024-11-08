import winston, { Logger, format, transports } from 'winston'
import { NextFunction, Request, Response } from 'express'
import { env } from './env'

export const createLogger = (className = ''): any => {
  return console;
  /*return winston.createLogger({
    level: env.LOG_LEVEL,
    format: format.json(),
    transports: [
      new transports.Console({
        format: format.combine(
          format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
          format.colorize(),
          format.printf(nfo => {
            const cName = className ? `[${className}]` : ''
            return `[${nfo.timestamp}]${cName} ${nfo.level}: ${nfo.message}`
          })
        )
      })
    ]
  })*/
}

const logger = createLogger()

const EXCLUSION_URLS = ['/check-readiness', '/check-liveness']

export const createLoggingMiddleware = (req: Request, _res: Response, next: NextFunction): void => {
  const url = `${req.baseUrl}${req.url}`

  if (!EXCLUSION_URLS.some(excl => url.includes(excl))) {
    logger.info(`START ${req.method} ${req.baseUrl}${req.url}`)

    req.on('close', () => {
      logger.info(`END ${req.method} ${req.baseUrl}${req.url}`)
    })
  }

  next()
}
