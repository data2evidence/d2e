import { Logger } from '@alp/alp-base-utils'
import express from 'express'
import { IMRIRequest } from 'src/utils/types'
import { Service } from 'typedi'
import { FhirService } from './fhir.service'
import { Resource } from '@medplum/fhirtypes'

@Service()
export class FhirRouter {
  private readonly router = express.Router()
  private readonly log = Logger.CreateLogger(this.constructor.name)

  constructor() {
    this.registerRoutes()
  }
  getRouter() {
    return this.router
  }
  private registerRoutes() {
    this.router.post(
      '/',
      async (req,  res) => {
        this.log.info('Import fhir data')
        try {
            let fhirService = new FhirService()
            await fhirService.importData(req.body)
            res.sendStatus(200)
        } catch (err) {
          this.log.error(`Failed to import data into fhir server: ${err}`)
          res.sendStatus(500)
        }
      })
  }
}

