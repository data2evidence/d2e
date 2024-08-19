import express from 'express'
import { Service } from 'typedi'
import { DatasetRouter } from './DatasetRouter'
import { DBRouter } from './DBRouter'
import { FhirRouter } from './FhirRouter'

@Service()
class Routes {
  public router = express.Router()

  constructor(
    private readonly datasetRouter: DatasetRouter,
    private readonly dbRouter: DBRouter,
    private readonly fhirRouter: FhirRouter
  ) {
    this.router.use('/dataset', this.datasetRouter.router)
    this.router.use('/db', this.dbRouter.router)
    this.router.use('/fhir', this.fhirRouter.router)
  }
}

export default Routes
export * from './DashboardGateRouter'
