import express from 'npm:express'

import { DataflowMgmtAPI }from './api/DataflowMgmtAPI.ts'
//import { createLogger } from '../Logger'

export class DBRouter {
  public router = express.Router()
  private readonly logger = console//createLogger(this.constructor.name)

  constructor() {
    this.registerRoutes()
  }

  private registerRoutes() {
    this.router.get('/dataset/version-info', async (req, res) => {
      try {
        const token = req.headers.authorization!
        const dataflowMgmtAPI = new DataflowMgmtAPI(token)
        const result = await dataflowMgmtAPI.getSchemasVersionInformation()
        return res.status(200).json(result)
      } catch (error) {
        this.logger.error(`Error when getting schemas version information: ${JSON.stringify(error)}`)
        res.status(500).send('Error when getting schemas version information')
      }
    })

    this.router.put('/schema', async (req, res) => {
      const { schemaName, dataModel: dataModelName, databaseCode, vocabSchemaValue } = req.body
      try {
        const token = req.headers.authorization!
        const dataflowMgmtAPI = new DataflowMgmtAPI(token)

        const dataModel = dataModelName.split(' ')[0]
        const datamodels = await dataflowMgmtAPI.getDatamodels()
        const dmInfo = datamodels.find(model => model.name === dataModelName)

        const options = {
          options: {
            flow_action_type: 'update_datamodel',
            database_code: databaseCode,
            data_model: dataModel,
            schema_name: schemaName,
            vocab_schema: vocabSchemaValue
          }
        }

        const result = await dataflowMgmtAPI.createFlowRunByMetadata(
          options,
          'datamodel',
          dmInfo.flowId,
          `datamodel-update-${schemaName}`
        )
        return res.status(200).json(result)
      } catch (error) {
        this.logger.error(`Error when updating schema ${schemaName}: ${JSON.stringify(error)}`)
        res.status(500).send(`Error when updating schema ${schemaName}`)
      }
    })
  }
}
