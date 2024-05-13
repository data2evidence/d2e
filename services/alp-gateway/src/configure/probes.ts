import { healthCheckMiddleware } from '../middlewares/HealthCheckMiddleware'
import { env, services } from '../env'
import { createLogger } from '../Logger'
import http from 'http'

const logger = createLogger('HealthCheck')

const livenessCheck = url =>
  new Promise((resolve, reject) => {
    const options = {
      port: url.split(':')[2],
      host: 'localhost',
      method: 'GET',
      path: '/check-readiness'
    }

    const request = http.get(options, res => {
      if (res.statusCode !== 200) {
        reject(`${url} not yet live!`)
        return
      }
      resolve(`${url} is live!`)
    })

    request.on('error', err => {
      logger.error(`Encountered an error trying to make a request: ${err.message}`)
      reject(`${url} not yet live!`)
    })
  })

const probes = {
  livenessProbe: healthCheckMiddleware,
  readinessProbe: (req, res) => {
    try {
      const keys = Object.keys(services)
      Promise.all(keys.map(key => livenessCheck(services[key])))
        .then(result => {
          res.send(result)
        })
        .catch(err => {
          logger.error(err)
          res.send(503)
        })
    } catch (err) {
      logger.error(err)
      res.send(503)
    }
  }
}

export { probes }
