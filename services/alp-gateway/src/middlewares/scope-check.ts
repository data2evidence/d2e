import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { ROLES } from '../const'
import { UserMgmtAPI } from '../api'
import { createLogger } from '../Logger'
import { REQUIRED_URL_SCOPES, ROLE_SCOPES } from '../scopes'
import { env } from '../env'
import { IToken } from '../types'

const logger = createLogger('ScopeCheck')
const userMgmtApi = new UserMgmtAPI()
const subProp = env.GATEWAY_IDP_SUBJECT_PROP
const PUBLIC_API_PATHS = ['^/system-portal/dataset/public/list(.*)', '^/system-portal/config/public(.*)']

export const checkScopes = async (req: Request, res: Response, next: NextFunction) => {
  const bearerToken = req.headers.authorization
  const { originalUrl, method } = req
  if (PUBLIC_API_PATHS.some(path => new RegExp(path).test(originalUrl))) {
    return next()
  } else if (!bearerToken) {
    logger.error(`No bearer token is found for url: ${originalUrl}`)
    return res.status(401).send()
  }

  try {
    const match = REQUIRED_URL_SCOPES.find(
      ({ path, httpMethods }) =>
        new RegExp(path).test(originalUrl) && (typeof httpMethods == 'undefined' || httpMethods.indexOf(method) > -1)
    )

    if (match) {
      const { scopes } = match
      const userScopes = await getUserScopes(bearerToken, originalUrl)
      if (scopes.some(i => userScopes.includes(i))) {
        logger.debug(`User scopes allowed for url ${originalUrl}`)
        return next()
      }
    }
    logger.error(`User scopes not allowed for url ${originalUrl}`)
    return res.status(403).send()
  } catch (err) {
    logger.error(`Error during scope check: ${err}`)
    logger.error(err.stack)
    return res.status(500).send()
  }
}

export const checkScopesByQueryString = async (req: Request, res: Response, next: NextFunction) => {
  const bearerToken = req.query.token as string
  const { originalUrl, method } = req
  if (PUBLIC_API_PATHS.some(path => new RegExp(path).test(originalUrl))) {
    return next()
  } else if (!bearerToken) {
    logger.error(`No bearer token is found for url: ${originalUrl}`)
    return res.status(401).send()
  }

  try {
    const match = REQUIRED_URL_SCOPES.find(
      ({ path, httpMethods }) =>
        new RegExp(path).test(originalUrl) && (typeof httpMethods == 'undefined' || httpMethods.indexOf(method) > -1)
    )

    if (match) {
      const { scopes } = match
      const userScopes = await getUserScopes(bearerToken, originalUrl)
      if (scopes.some(i => userScopes.includes(i))) {
        logger.debug(`User scopes allowed for url ${originalUrl}`)
        return next()
      }
    }
    logger.error(`User scopes not allowed for url ${originalUrl}`)
    return res.status(403).send()
  } catch (err) {
    logger.error(`Error during scope check: ${err}`)
    return res.status(500).send()
  }
}

const getUserScopes = async (bearerToken: string, url: string) => {
  const token = jwt.decode(bearerToken.replace(/bearer /i, '')) as IToken
  const { client_id, grant_type } = token
  const sub = token[subProp]
  const ctxRoles: string[] = []

  if (grant_type === 'client_credentials' || sub === client_id) {
    ctxRoles.push(sub)
  } else {
    const ctxUserGroups = await userMgmtApi.getUserGroups(bearerToken, sub)
    if (ctxUserGroups.alp_role_user_admin === true) {
      ctxRoles.push(ROLES.ALP_USER_ADMIN)
    }
    if (ctxUserGroups.alp_role_system_admin === true) {
      ctxRoles.push(ROLES.ALP_SYSTEM_ADMIN)
    }
    if (ctxUserGroups.alp_role_alp_sqleditor_admin === true) {
      ctxRoles.push(ROLES.ALP_SQLEDITOR_ADMIN)
    }
    if (ctxUserGroups.alp_role_nifi_admin === true) {
      ctxRoles.push(ROLES.ALP_NIFI_ADMIN)
    }
    if (ctxUserGroups.alp_role_dashboard_viewer === true) {
      ctxRoles.push(ROLES.ALP_DASHBOARD_VIEWER)
    }
    if (ctxUserGroups.alp_role_tenant_viewer?.length > 0) {
      ctxRoles.push(ROLES.TENANT_VIEWER)
    }
    if (ctxUserGroups.alp_role_study_researcher?.length > 0) {
      for (const datasetId of ctxUserGroups.alp_role_study_researcher) {
        if (url.includes(datasetId) || url.includes('/system-portal/notebook') || url.includes('/terminology')) {
          ctxRoles.push(ROLES.STUDY_RESEARCHER)
          break
        }
      }
    }
  }

  const roleScopesMap: Map<string, string[]> = new Map(Object.entries(ROLE_SCOPES))
  const userScopes: string[] = []
  ctxRoles.forEach(ctxRole => {
    const roleScopes = roleScopesMap.get(ctxRole)
    if (roleScopes) {
      userScopes.push(...roleScopes)
    }
  })
  return Array.from(new Set(userScopes))
}
