import express from 'express'
import { AnalyticsSvcAPI, DataflowMgmtAPI } from '../api'
import { Service } from 'typedi'
import { createLogger } from '../Logger'

@Service()
export class DBRouter {
  public router = express.Router()
  private readonly logger = createLogger(this.constructor.name)

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
            flow_action_type: 'update',
            database_code: databaseCode,
            data_model: dataModel,
            schema_name: schemaName,
            cleansed_schema_option: false,
            vocab_schema: vocabSchemaValue
          }
        }

        const result = await dataflowMgmtAPI.createFlowRunByMetadata(
          options,
          'datamodel',
          dmInfo.flowId,
          'datamodel-update'
        )
        return res.status(200).json(result)
      } catch (error) {
        this.logger.error(`Error when updating schema ${schemaName}: ${JSON.stringify(error)}`)
        res.status(500).send(`Error when updating schema ${schemaName}`)
      }
    })
  }
}
