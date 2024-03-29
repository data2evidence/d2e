import express from 'express'
import { Service } from 'typedi'
import { createProxyMiddleware } from 'http-proxy-middleware'
import axios from 'axios'
import { createLogger } from '../Logger'
import { PortalAPI } from '../api'
import { checkScopesByQueryString } from '../middlewares/scope-check'
import { getClientCredentialsToken } from '../authentication'

@Service()
export class DashboardGateRouter {
  public router = express.Router()
  private readonly logger = createLogger(this.constructor.name)

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

      let dashboardUrl = ''
      try {
        const portalAPI = new PortalAPI(token)
        const dashboard = await portalAPI.getDatasetDashboard(dashboardId)
        dashboardUrl = dashboard?.url
        const url = new URL(dashboardUrl)

        const response = await axios.get(url.toString(), { responseType: 'document' })
        res.send(response.data)
      } catch (error) {
        this.logger.error(`Error when getting dashboard content for ${dashboardUrl}: ${JSON.stringify(error)}`)
        res.status(500).send('Error when getting dashboard content')
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
    const datasets = await portalAPI.getDatasets()

    for (const dataset of datasets) {
      if (!Array.isArray(dataset.dashboards)) {
        continue
      }

      for (const dashboard of dataset.dashboards) {
        const url = new URL(dashboard?.url)

        let basePath = dashboard.basePath
        if (!basePath) continue

        if (!basePath.startsWith('/')) basePath = '/' + basePath
        if (basePath.endsWith('/')) basePath = basePath.slice(0, -1)

        this.router.use(
          `${basePath}/*`,
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
}
