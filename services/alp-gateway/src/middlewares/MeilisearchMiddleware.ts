import { NextFunction, Request, Response } from 'express'
import { env } from '../env'

const meilisearchMasterKey = env.MEILI_MASTER_KEY

export const addMeilisearchHeaders = (req: Request, res: Response, next: NextFunction) => {
  // Replace authorization header with meilisearch master key bearer token
  req.headers.authorization = `Bearer ${meilisearchMasterKey}`
  return next()
}
