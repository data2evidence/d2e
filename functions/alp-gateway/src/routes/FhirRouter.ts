import express from 'express'
import { createLogger } from '../Logger'
import { Service } from 'typedi'
import { FhirAPI } from '../api'

@Service()
export class FhirRouter {
  public router = express.Router()
  private readonly logger = createLogger(this.constructor.name)

  constructor() {
    this.registerRoutes()
  }

  private registerRoutes() {
    this.router.post('/createProject', async (req, res) => {
      const fhirApi = new FhirAPI()
      const name = req.body.name as string
      const description = req.body.description as string
      try {
        const projectId = await fhirApi.createProject(name, description)
        return res.status(200).json(projectId)
      } catch (error) {
        this.logger.error(`Error creating new project: ${error}`)
        res.status(500).send('Error creating new project')
      }
    })

    this.router.post('/:resource/:projectName?', async (req, res) => {
      try {
        const fhirApi = new FhirAPI()
        const { resource, projectName } = req.params
        const response = await fhirApi.createResource(resource, req.body, projectName)
        return res.status(response.status).json(response.data)
      } catch (error) {
        this.logger.error(`Error creating resource on fhir server: ${JSON.stringify(error)}`)
        res.status(500).send('Error creating resource on fhir server')
      }
    })
  }
}
