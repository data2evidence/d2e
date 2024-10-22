import { createProject, createResourceInCacheDB, createResourceInProject } from './services';
import express from 'npm:express'
export class FhirRouter {
  public router = express.Router();
  private readonly logger = console

  constructor() {
    this.registerRoutes()
  }

  private registerRoutes() {
    //Endpoint to create a new project for the incoming dataset name in FHIR server
    this.router.post('/createProject', async (req, res) => {
        const name = req.body.name as string
        const description = req.body.description as string
        try {
            const projectId = await createProject(name, description)
            return res.status(200).json(projectId)
        } catch (error) {
            this.logger.error(`Error creating new project: ${error}`)
            res.status(500).send('Error creating new project')
        }
    })

    //Endpoint to create resource in FHIR server which triggers the subscription
    this.router.post('/ingest/:resource/:projectName?', async (req, res) => {
        try {
          const { resource, projectName } = req.params
          const token = req.headers.authorization!
          const response = await createResourceInProject(token, resource, req.body, projectName)
          if(response)
            return res.status(200).json('FHIR Resource successfully created!')
          else
          return res.status(500).json('Failed to create FHIR Resource')
        } catch (error) {
          this.logger.error(`Error creating resource on fhir server: ${JSON.stringify(error)}`)
          res.status(500).send('Error creating resource on fhir server')
        }
    })

    //Endpoint to ingest data into fhir data model in cachedb
    this.router.post('/createResource/:resource', async(req, res) =>{
      try{
        this.logger.info('Ingest into FHIR Data model')
        const response = await createResourceInCacheDB(req.body)
        if(response)
          return res.status(200).json('FHIR Resource successfully ingested!')
        else
        return res.status(500).json('Failed to ingest FHIR Resource')
      }catch(error){
        this.logger.error(`Error ingesting resource in cachedb:  ${JSON.stringify(error)}`)
        res.status(500).send('Error ingesting resource in cachedb')
      }
    })
  }
}