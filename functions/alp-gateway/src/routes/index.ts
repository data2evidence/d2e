import express from 'express'
import { Service } from 'typedi'
import { DatasetRouter } from './DatasetRouter'
import { DBRouter } from './DBRouter'

@Service()
class Routes {
  public router = express.Router()

  constructor(private readonly datasetRouter: DatasetRouter, private readonly dbRouter: DBRouter) {
    this.router.use('/dataset', this.datasetRouter.router)
    this.router.use('/db', this.dbRouter.router)
  }
}

export default Routes
export * from './DashboardGateRouter'
