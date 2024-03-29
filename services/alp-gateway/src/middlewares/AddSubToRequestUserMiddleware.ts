import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { env } from '../env'

const subProp = env.GATEWAY_IDP_SUBJECT_PROP

// Add sub to request.user as required by MriUser
export const addSubToRequestUserMiddleware = (req: Request, res: Response, next: NextFunction) => {
  if (req.user && !req.user['sub']) {
    const token = getDecodedToken(req)
    if (token) {
      req.user['sub'] = token[subProp]
    }
  }

  return next()
}

const getDecodedToken = (req: Request) => {
  const authHeader = req.headers.authorization
  if (!authHeader) {
    return null
  }
  const token = authHeader.replace(/bearer /i, '')
  const decodedToken = jwt.decode(token) as jwt.JwtPayload

  return decodedToken
}
