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
      const token = req.headers.authorization!
      const fhirApi = new FhirAPI(token)
      const name = req.query.name as string
      const description = req.query.description as string
      try {
        const newProject = await fhirApi.createProject(name, description)
        return res.status(200).json(newProject)
      } catch (error) {
        this.logger.error(`Error creating new project: ${error}`)
        res.status(500).send('Error creating new project')
      }
    })

    this.router.post('/', async (req, res) => {
      const token = req.headers.authorization!
      try {
        const fhirApi = new FhirAPI(token)
        const newProject = await fhirApi.importData(req.body)
        return res.status(200).json(newProject)
      } catch (error) {
        this.logger.error(`Error importing data into fhir: ${error}`)
        res.status(500).send('Error importing data into fhir')
      }
    })
  }
}
