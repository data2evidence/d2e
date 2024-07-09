import express from 'express'
import { Service } from 'typedi'
import { FhirRouter } from './fhir/fhir.routes'

@Service()
class Routes {
  private readonly router = express.Router()
  
  constructor(private readonly fhirRouter: FhirRouter) {
    this.router.use('/fhir', this.fhirRouter.getRouter())
  }

  getRouter() {
    return this.router
  }
}

export default Routes
