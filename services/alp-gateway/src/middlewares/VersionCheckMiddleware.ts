import { Request, Response, NextFunction } from 'express'
import { get } from '../api/request-util'
import { createLogger } from '../Logger'
import { services } from '../env'
const alp_version = process.env.ALP_RELEASE || 'local'

const logger = createLogger('VersionCheck')
const url: string = services.appRouter + '/appversion'
let approuterVersionCache

const isCacheExpired = ({ cachedAt }) => {
  return Date.now() - cachedAt > (process.env.APP_CACHE_TTL_IN_MS || 600000)
}

export const VersionCheckMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  logger.debug('gateway alp_version is: ' + alp_version)

  if (process.env.isTestEnv && process.env.isHttpTestRun) {
    return next()
  }

  if (req.originalUrl == '/appversion') {
    logger.info('requesting for app version - ignoring version check')
    return next()
  }

  if (req.url === '/check-readiness' || req.url === '/check-liveness') {
    return next()
  }
  if (!approuterVersionCache || (approuterVersionCache && isCacheExpired(approuterVersionCache))) {
    try {
      logger.debug('approuter url is: ' + url)

      const approuterVersionResponse = await get(url)

      logger.debug('gateway versionCheck:: received version from approuter: ' + approuterVersionResponse.data)

      const match = approuterVersionResponse.data === alp_version

      if (!match) {
        logger.error(
          `This version of gateway is not supported. Approuter version: ${approuterVersionResponse.data}. Gateway version: ${alp_version}`
        )
        return res
          .status(505)
          .send(
            `This version of gateway is not supported. Approuter version: ${approuterVersionResponse.data}. Gateway version: ${alp_version}`
          )
      }
      approuterVersionCache = {
        cachedAt: Date.now(),
        version: approuterVersionResponse.data
      }
      logger.info('gateway versionCheck: updated approuterVersionCache: ' + approuterVersionCache.version)
    } catch (error) {
      logger.error(`Error fetching app version: `, error)
      res.status(500)
    }
  }

  next()
}
