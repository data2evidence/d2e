import { Express } from 'express'
import passport from 'passport'
import { Strategy as JwtStrategy } from 'passport-jwt'
import { Service } from 'typedi'
import { AuthcType, logtoAuthOptions } from './authc-config'
import { createLogger } from '../Logger'

@Service()
export class Authc {
  private readonly logger = createLogger(this.constructor.name)

  useLogto(name: AuthcType = 'logto') {
    this.logger.info('Using Logto')
    passport.use(
      name,
      new JwtStrategy(logtoAuthOptions, (token, done) => {
        done(null, token)
      })
    )
  }

  authenticate(name: AuthcType) {
    this.logger.info(`Authenticate with ${name}`)
    return passport.authenticate(name, { session: false })
  }

  initialize(app: Express) {
    this.logger.info('Initializing...')
    app.use(passport.initialize())
    app.use(passport.session())
  }
}
