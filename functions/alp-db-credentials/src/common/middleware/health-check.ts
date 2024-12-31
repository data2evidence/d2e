import { Request, Response } from 'express'
import dataSource from '../data-source/data-source'
import { createLogger } from '../../logger'

const logger = createLogger('HealthCheck')

export const healthCheck = async (_req: Request, res: Response): Promise<void> => {
  const healthCheck = {
    // uptime: process.uptime(),
    message: 'OK',
    timestamp: Date.now()
  }
  try {
    // Check db connection
    const runner = dataSource.createQueryRunner('slave')
    await runner.query('SELECT 1')
    await runner.release()
    res.send(healthCheck)
  } catch (e) {
    healthCheck.message = e
    logger.error(e.message)
    res.send(503)
  }
}
