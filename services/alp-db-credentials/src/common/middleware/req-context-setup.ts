import { Request, Response, NextFunction } from 'express'
import { decode, JwtPayload } from 'jsonwebtoken'
import { createReqContext } from '../hook'

const EXCLUDED_PATHS = ['/check-readiness', '/check-liveness']

export const setupReqContext = (req: Request, res: Response, next: NextFunction) => {
  const { authorization } = req.headers
  if (authorization) {
    const token = decode(authorization.replace(/bearer /i, '')) as JwtPayload
    createReqContext({ userId: token.sub!, grantType: getGrantType(token) })
    return next()
  } else if (EXCLUDED_PATHS.some(path => req.url.endsWith(path))) {
    return next()
  }
  res.sendStatus(401)
}

const getGrantType = (token: JwtPayload) => {
  let grantType = token.grant_type
  if (grantType == null && token.sub === token.client_id) {
    grantType = 'client_credentials'
  }
  return grantType
}
