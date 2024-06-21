import { ExtractJwt, StrategyOptions } from 'passport-jwt'
import jwksRsa from 'jwks-rsa'
import https from 'https'
import { env } from '../env'
import { createLogger } from '../Logger'

export type AuthcType = 'logto'

export const publicURLs = [
  '/portalsvc/public-graphql',
  '/usermgmt/api/user-group/public',
  '/system-portal/dataset/public/list',
  '/system-portal/feature/list',
  '/system-portal/overview-description/public'
]

const logger = createLogger('AuthcConfig')

export const logtoAuthOptions: StrategyOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKeyProvider: jwksRsa.passportJwtSecret({
    jwksUri: `${env.LOGTO_ISSUER}/jwks`,
    handleSigningKeyError: (err, cb) => {
      logger.error(`Signing key error: [${err?.name}] ${err?.message} ${err?.stack}`)
      return cb(err)
    }
  }),
  issuer: `https://${env.GATEWAY_WO_PROTOCOL_FQDN}/oidc`,
  audience: [env.LOGTO_CLIENT_ID!, ...(env.LOGTO_AUDIENCES ? env.LOGTO_AUDIENCES.split(' ') : [])]
}
