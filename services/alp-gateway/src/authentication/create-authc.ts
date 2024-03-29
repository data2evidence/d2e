import { Express } from 'express'
import Container from 'typedi'
import { env } from '../env'
import { Authc } from './Authc'
import { AuthcType } from './authc-config'

const authType = env.GATEWAY_IDP_AUTH_TYPE as AuthcType

export const createAuthc = (app: Express) => {
  const authc = Container.get(Authc)

  if (authType === 'logto') {
    authc.useLogto()
  }

  authc.initialize(app)

  return authc
}
