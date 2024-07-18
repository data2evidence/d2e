// import { Logger } from '@alp/alp-base-utils'
import express from 'express'
import { Service } from 'typedi'
import { FhirService } from './fhir.service'
@Service()
export class FhirRouter {
  private readonly router = express.Router()
  // private readonly log = Logger.CreateLogger(this.constructor.name)

  constructor() {
    this.registerRoutes()
  }
  getRouter() {
    return this.router
  }
  private registerRoutes() {
      this.router.post(
        '/createProject',
        async (req,  res) => {
          // this.log.info('Create project resource')
          try {
              let fhirService = new FhirService()
              await fhirService.createProject(req.query.name as string, req.query.description as string)
              res.sendStatus(200)
          } catch (err) {
            // this.log.error(`Failed to create project in fhir server: ${err}`)
            res.sendStatus(500)
          }
        })
  }
}

