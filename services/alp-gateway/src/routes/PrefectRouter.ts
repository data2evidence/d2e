import express from 'express'
import { createLogger } from '../Logger'
import { Service } from 'typedi'
import { PrefectAPI } from '../api'

@Service()
export class PrefectRouter {
  public router = express.Router()
  private readonly logger = createLogger(this.constructor.name)

  constructor() {
    this.registerRoutes()
  }

  private registerRoutes() {
    this.router.get('/health', async (req, res) => {
      try {
        const token = req.headers.authorization!
        const prefectAPI = new PrefectAPI(token)
        const healthStatus = await prefectAPI.getHealthStatus()
        return res.status(200).json(healthStatus)
      } catch (error) {
        this.logger.info(`Error getting health status: ${error}`)
        throw new Error(`Error getting health status: ${error}`)
      }
    })
  }
}
