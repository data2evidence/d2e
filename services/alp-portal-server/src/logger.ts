import { LogLevel } from '@nestjs/common/services/logger.service'
import { Logger, format, transports, createLogger as createWinstonLogger } from 'winston'
import { env } from './env'

export const createLogger = (className = ''): Logger => {
  return createWinstonLogger({
    level: env.PORTAL_SERVER_LOG_LEVEL,
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
  })
}

export const getLogLevels = (): LogLevel[] => {
  if (env.NODE_ENV === 'production') {
    return ['log', 'warn', 'error']
  }
  return ['log', 'warn', 'error', 'verbose', 'debug']
}
