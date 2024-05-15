import 'reflect-metadata'
import * as dotenv from 'dotenv'
dotenv.config()
import { createProxyMiddleware } from 'http-proxy-middleware'
import express, { Request, Response, NextFunction } from 'express'
import { UserMgmtAPI } from './api'
import { ROLES } from './const'
import { MriUser, isClientCredToken } from './mri/MriUser'
import { createLogger } from './Logger'
import * as xsapp from './xs-app.json'
import { app, authc } from './configure/app'
import { probes } from './configure/probes'
import { REQUIRED_URL_SCOPES } from './roles'
import { checkScopes } from './middlewares/scope-check'
import https from 'https'
import querystring from 'query-string'
import { IPlugin, IRouteProp } from './types'
import { env, services } from './env'
import { Container } from 'typedi'
import Routes, { DashboardGateRouter } from './routes'
import { addSubToRequestUserMiddleware } from './middlewares/AddSubToRequestUserMiddleware'
import { AuthcType, exchangeToken, publicURLs } from './authentication'
import { v4 as uuidv4 } from 'uuid'
import { addSqleditorHeaders } from './middlewares/SqleditorMiddleware'
import { addMeilisearchHeaders } from './middlewares/MeilisearchMiddleware'
import { setupGlobalErrorHandling } from './error-handler'

const auth = process.env.SKIP_AUTH === 'TRUE' ? false : true
const PORT = env.GATEWAY_PORT
const logger = createLogger('gateway')
const userMgmtApi = new UserMgmtAPI()
const isDev = process.env.NODE_ENV === 'development'
const alp_version = process.env.ALP_RELEASE || 'local'
const authType = env.GATEWAY_IDP_AUTH_TYPE as AuthcType

let plugins: IPlugin = {
  researcher: [],
  admin: [],
  systemadmin: [],
  superadmin: []
}

try {
  plugins = JSON.parse(env.PLUGINS_JSON)
  logger.debug(`Plugins: ${JSON.stringify(plugins)}`)
} catch (err) {
  // ignore error
  logger.error('Error when loading plugin config', err)
}

function ensureAuthenticated(req, res, next) {
  if (!auth || publicURLs.some(url => req.originalUrl.startsWith(url))) {
    return next()
  }

  authc.authenticate(authType)(req, res, next)
}

async function ensureAuthorized(req, res, next) {
  if (!auth) {
    return next()
  }

  const { originalUrl, method, user: token } = req
  const { oid, sub } = token
  const idpUserId = oid || sub

  const match = REQUIRED_URL_SCOPES.find(
    ({ path, httpMethods }) =>
      new RegExp(path).test(originalUrl) && (typeof httpMethods == 'undefined' || httpMethods.indexOf(method) > -1)
  )

  if (match) {
    let mriUserObj: any

    if (isClientCredToken(token)) {
      mriUserObj = new MriUser(token).adUserObject
    } else {
      try {
        const userGroups = await userMgmtApi.getUserGroups(req.headers.authorization, idpUserId)
        token.userMgmtGroups = userGroups
        mriUserObj = new MriUser(token).b2cUserObject
      } catch (error) {
        logger.error(error)
        return res.sendStatus(500)
      }
    }

    const { scopes } = match
    // the allowed scopes for a url should be found in the user's assigned scopes
    if (scopes.some(i => mriUserObj.mriScopes.includes(i))) {
      logger.info(`AUTHORIZED ACCESS: user ${mriUserObj.userId}, url ${originalUrl}`)
      if (isDev) {
        logger.info(`🚀 inside ensureAuthorized, req.headers: ${JSON.stringify(req.headers)}`)
      }
      return next()
    }
    logger.info(`inside ensureAuthorized: Forbidden, token does not have required scope`)
    return res.sendStatus(403)
  } else {
    return userMgmtApi.getUserGroups(req.headers.authorization, idpUserId).then(userGroups => {
      req.user.userMgmtGroups = userGroups
      return next()
    })
  }
}

async function ensureAlpSysAdminAuthorized(req, res, next) {
  if (!auth) {
    return next()
  }
  const { user } = req
  if (isDev) {
    logger.info(`🚀 inside ensureAlpSysAdminAuthorized, req.headers: ${JSON.stringify(req.headers)}`)
  }
  const userGroupMetadata = await userMgmtApi.getUserGroups(req.headers.authorization, user.sub)
  const alp_role_system_admin = userGroupMetadata.alp_role_system_admin

  if (alp_role_system_admin) {
    logger.info('Authorized access for ALP System Admin')
    return next()
  }
  logger.error('User has no ALP System Admin role')
  return res.status(403).send('User has no ALP System Admin role')
}

function addOriginHeader(req: Request, res: Response, next: NextFunction) {
  if (req.headers.host) {
    if (isDev) {
      logger.info(`Detected host ${env.GATEWAY_WO_PROTOCOL_FQDN}`)
    }
    req.headers['x-source-origin'] = env.GATEWAY_WO_PROTOCOL_FQDN
  }

  return next()
}

function addCorrelationIDToHeader(req: Request, res: Response, next: NextFunction) {
  if (!req.headers['x-req-correlation-id']) {
    req.headers['x-req-correlation-id'] = uuidv4()
    logger.info(`Added correlation ID[${req.headers['x-req-correlation-id']}] to header...`)
  }
  return next()
}

function getCreateMiddlewareOptions(serviceUrl: string) {
  return {
    target: {
      protocol: serviceUrl.split('/')[0],
      host: serviceUrl.split('/')[2].split(':')[0],
      port: serviceUrl.split('/')[2].split(':')[1],
      ...(services.dbCredentialsMgr.includes('localhost:')
        ? undefined
        : {
            ca: env.GATEWAY_CA_CERT
          })
    },
    secure: serviceUrl.includes('localhost:') ? false : true,
    proxyTimeout: 300000,
    changeOrigin: serviceUrl.includes('localhost:') ? false : true
  }
}

const routes = xsapp.routes as IRouteProp[]
if (plugins && Object.keys(plugins).length > 0) {
  Object.keys(plugins).forEach((type: keyof IPlugin) => {
    plugins[type].forEach(p => {
      if (p.proxySource && p.proxyDestination) {
        routes.push({ source: p.proxySource, destination: p.proxyDestination })
      }
    })
  })
}

//This should be the first item in the array
if (env.APP_DEPLOY_MODE !== 'standalone') {
  // Route to app-router
  routes.unshift({
    source: '^/portal/env.js',
    destination: 'portal-ui'
  })
}

// attach origin in all requests
app.use(addOriginHeader)

// add request correlation ID for all requests
app.use(addCorrelationIDToHeader)

app.get('/appversion', (_req, res) => {
  logger.info('gateway: sending alp_version: ' + alp_version)
  res.status(200).send(alp_version)
})

app.post('/oauth/token', async (req, res) => {
  logger.info('Exchange code with oauth token')

  const params = new URLSearchParams()
  Object.keys(req.body).forEach(key => {
    params.append(key, req.body[key])
  })

  try {
    const token = await exchangeToken(params)
    return res.send(token)
  } catch (error) {
    logger.error(`Error when exchanging code with token: ${error}`)
    return res.sendStatus(500)
  }
})

routes.forEach((route: IRouteProp) => {
  try {
    const changeOriginForAppRouter: boolean =
      services.appRouter.startsWith('https://localhost:') ||
      services.appRouter.startsWith('https://alp-mercury-approuter:')
        ? false
        : true

    const source = route.source
      .replace('/(.*)$', '')
      .replace('/(.*)', '')
      .replace('(.*)$', '')
      .replace('(.*)', '')
      .replace('^', '')

    switch (route.destination) {
      case 'sqleditor':
        const onProxyReq = (proxyReq, req) => {
          const contentType = proxyReq.getHeader('Content-Type')
          const writeBody = (bodyData: string) => {
            proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData))
            proxyReq.write(bodyData)
          }

          if (contentType === 'application/json') {
            writeBody(JSON.stringify(req.body))
            logger.debug(`JSON body is written for Sqleditor proxy at url: ${req.originalUrl}`)
          }

          if (contentType === 'application/x-www-form-urlencoded') {
            writeBody(querystring.stringify(req.body))
            logger.debug(`Form body is written for Sqleditor proxy at url: ${req.originalUrl}`)
          }
        }
        app.use(
          source,
          ensureAuthenticated,
          addSqleditorHeaders,
          createProxyMiddleware({
            target: services.sqlEditor,
            pathRewrite: { '^/alp-sqleditor': '' },
            changeOrigin: true,
            onProxyReq
          })
        )
        break
      case 'public-analytics-svc':
        app.use(
          source,
          createProxyMiddleware({
            target: services.analytics,
            proxyTimeout: 300000
          })
        )
        break
      case 'analytics-svc':
        app.use(
          source,
          ensureAuthenticated,
          addSubToRequestUserMiddleware,
          ensureAuthorized,
          createProxyMiddleware({
            ...getCreateMiddlewareOptions(services.analytics),
            logLevel: 'debug',
            headers: { Connection: 'keep-alive' }
          })
        )
        break
      case 'portal-ui':
        app.use(
          source,
          createProxyMiddleware({
            target: services.appRouter,
            secure: changeOriginForAppRouter,
            proxyTimeout: 100000,
            changeOrigin: changeOriginForAppRouter
          })
        )
        break
      case 'usermgmt':
        app.use(
          source,
          ensureAuthenticated,
          checkScopes,
          createProxyMiddleware(getCreateMiddlewareOptions(services.usermgmt))
        )
        break
      case 'db-credentials-mgr':
        app.use(
          source,
          ensureAuthenticated,
          checkScopes,
          createProxyMiddleware({
            ...getCreateMiddlewareOptions(services.dbCredentialsMgr),
            pathRewrite: path => path.replace('/db-credentials', '')
          })
        )
        break
      case 'system-portal':
        app.use(
          source,
          ensureAuthenticated,
          checkScopes,
          createProxyMiddleware({
            ...getCreateMiddlewareOptions(services.portalServer),
            pathRewrite: path => path.replace('/system-portal', '')
          })
        )
        break
      case 'dataflow-mgmt':
        app.use(
          source,
          ensureAuthenticated,
          checkScopes,
          createProxyMiddleware({
            ...getCreateMiddlewareOptions(services.dataflowMgmt),
            pathRewrite: path => path.replace('/dataflow-mgmt', '')
          })
        )
        break
      case 'meilisearch-svc':
        app.use(
          source,
          ensureAuthenticated,
          checkScopes,
          addMeilisearchHeaders,
          createProxyMiddleware({
            target: services.meilisearch,
            proxyTimeout: 300000,
            pathRewrite: path => path.replace('/meilisearch-svc', '')
          })
        )
        break
      case 'bookmark-svc':
        app.use(
          source,
          ensureAuthenticated,
          ensureAuthorized,
          createProxyMiddleware(getCreateMiddlewareOptions(services.bookmark))
        )
        break
      case 'alp-terminology-svc':
        app.use(
          source,
          ensureAuthenticated,
          checkScopes,
          createProxyMiddleware(getCreateMiddlewareOptions(services.terminology))
        )
        break
      case 'pa-config':
        app.use(
          source,
          ensureAuthenticated,
          addSubToRequestUserMiddleware,
          ensureAuthorized,
          createProxyMiddleware({
            ...getCreateMiddlewareOptions(services.paConfig),
            headers: { Connection: 'keep-alive' }
          })
        )
        break
      case 'cdw':
        app.use(
          source,
          ensureAuthenticated,
          addSubToRequestUserMiddleware,
          ensureAuthorized,
          createProxyMiddleware({
            ...getCreateMiddlewareOptions(services.cdw),
            headers: { Connection: 'keep-alive' }
          })
        )
        break
      case 'ps-config':
        app.use(
          source,
          ensureAuthenticated,
          ensureAuthorized,
          createProxyMiddleware({
            ...getCreateMiddlewareOptions(services.psConfig),
            headers: { Connection: 'keep-alive' }
          })
        )
        break
      default:
        if (plugins && Object.keys(plugins).length > 0) {
          Object.keys(plugins).forEach((type: keyof IPlugin) => {
            plugins[type].forEach(p => {
              if (route.destination === p.proxyDestination) {
                app.use(
                  source,
                  createProxyMiddleware({
                    target: p.proxyTarget,
                    proxyTimeout: p.proxyTimeout,
                    changeOrigin: true
                  })
                )
              }
            })
          })
        } else {
          logger.info('ERROR: unknown destination')
        }
        break
    }
  } catch (e) {
    logger.error(`Error: ${e}, route @ ${route.source}`)
  }
})

app.use('/check-liveness', probes.livenessProbe)
app.use('/check-readiness', probes.readinessProbe)

const apiRoutes = Container.get(Routes)
app.use(
  '/gateway/api',
  ensureAuthenticated,
  addSubToRequestUserMiddleware,
  ensureAlpSysAdminAuthorized,
  express.json(),
  checkScopes,
  apiRoutes.router
)

const dashboardGateRoutes = Container.get(DashboardGateRouter)
app.use(dashboardGateRoutes.router)

if (env.SSL_PRIVATE_KEY === undefined || env.SSL_PUBLIC_CERT === undefined) {
  logger.error('Unable to launch ALP Gateway due to missing SSL env variable.')
  process.exit(1)
}

setupGlobalErrorHandling(app, logger)

const server = https.createServer(
  {
    key: env.SSL_PRIVATE_KEY,
    cert: env.SSL_PUBLIC_CERT,
    maxHeaderSize: 8192 * 10
  },
  app
)

server.listen(PORT)
logger.info(`🚀 ALP Gateway started on port ${PORT}`)
