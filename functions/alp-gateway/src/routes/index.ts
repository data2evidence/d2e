import express from 'express'
import { Service } from 'typedi'
import { DatasetRouter } from './DatasetRouter'
import { DBRouter } from './DBRouter'
import { FhirRouter } from './FhirRouter'
import { PrefectRouter } from './PrefectRouter'

@Service()
class Routes {
  public router = express.Router()

  constructor(
    private readonly datasetRouter: DatasetRouter,
    private readonly dbRouter: DBRouter,
    private readonly fhirRouter: FhirRouter,
    private readonly prefectRouter: PrefectRouter
  ) {
    this.router.use('/dataset', this.datasetRouter.router)
    this.router.use('/db', this.dbRouter.router)
    this.router.use('/fhir', this.fhirRouter.router)
    this.router.use('/prefect', this.prefectRouter.router)
  }
}

export default Routes
export * from './DashboardGateRouter'
