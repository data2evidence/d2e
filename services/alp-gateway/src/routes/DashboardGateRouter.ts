import express from 'express'
import { Service } from 'typedi'
import { createProxyMiddleware } from 'http-proxy-middleware'
import axios from 'axios'
import { createLogger } from '../Logger'
import { PortalAPI } from '../api'
import { checkScopes, checkScopesByQueryString } from '../middlewares/scope-check'
import { getClientCredentialsToken } from '../authentication'
import { Dataset, DatasetDashboard } from '../types'

@Service()
export class DashboardGateRouter {
  public router = express.Router()
  private readonly logger = createLogger(this.constructor.name)
  private datasets: Dataset[] = []

  constructor() {
    this.registerRoutes()
    this.registerDashboardRoutes()
  }

  private registerRoutes() {
    this.router.get('/dashboard-gate/:dashboardId/content', checkScopesByQueryString, async (req, res) => {
      const token = req.query.token as string
      if (!token) {
        return res.sendStatus(401)
      }

      const { dashboardId } = req.params

      try {
        const dashboard = this.findDashboard(dashboardId)
        if (!dashboard || !dashboard.url) {
          return res.status(404).send({ message: `Unable to find dashboard ${dashboardId} or the URL is empty` })
        }

        const url = new URL(dashboard.url)
        const response = await axios.get(url.toString(), { responseType: 'document' })
        res.send(response.data)
      } catch (error) {
        this.logger.error(`Error when getting dashboard content for ${dashboardId}: ${JSON.stringify(error)}`)
        res.status(500).send('Error when getting dashboard content')
      }
    })

    this.router.post('/dashboard-gate/register', checkScopes, async (req, res) => {
      try {
        this.removeDashboardRoutes()
        await this.registerDashboardRoutes()
        res.status(204).send()
      } catch (error) {
        this.logger.error(`Error when registering dashboard routes: ${JSON.stringify(error)}`)
        res.status(500).send('Error when registering dashboard routes')
      }
    })
  }

  private async registerDashboardRoutes() {
    const token = await getClientCredentialsToken()

    if (!token?.access_token) {
      this.logger.error('Unable to get client credentials token')
      return
    }

    const portalAPI = new PortalAPI(token?.access_token ? `Bearer ${token.access_token}` : '')
    this.datasets = await portalAPI.getDatasets()

    for (const dataset of this.datasets) {
      if (!Array.isArray(dataset.dashboards)) {
        continue
      }

      for (const dashboard of dataset.dashboards) {
        const url = new URL(dashboard?.url)

        let basePath = dashboard.basePath
        if (!basePath) continue

        basePath = this.prepareBasePath(basePath)

        this.router.use(
          `${basePath}*`,
          createProxyMiddleware({
            target: `${url.origin}${basePath}`,
            pathRewrite: { [basePath]: '' },
            changeOrigin: true,
            secure: true
          })
        )
      }
    }
  }

  private removeDashboardRoutes() {
    for (const dataset of this.datasets) {
      for (const dashboard of dataset.dashboards) {
        let i = this.router.stack.length
        while (i--) {
          const stack = this.router.stack[i]
          dashboard.basePath = this.prepareBasePath(dashboard.basePath)
          const matched = dashboard.basePath.match(stack.regexp)
          if (matched) {
            this.router.stack.splice(i, 1)
          }
        }
      }
    }
  }

  private findDashboard(id: string): DatasetDashboard | undefined {
    let dashboard: DatasetDashboard | undefined
    for (const dataset of this.datasets) {
      dashboard = dataset.dashboards.find(ds => ds.id === id)
      if (dashboard) break
    }
    return dashboard
  }

  private prepareBasePath(basePath: string): string {
    if (!basePath.startsWith('/')) basePath = '/' + basePath
    if (!basePath.endsWith('/')) basePath = basePath + '/'
    return basePath
  }
}
