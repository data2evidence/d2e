import { NextFunction, Request, Response } from 'express'
import { v4 as uuidv4 } from 'uuid'
import { createLogger } from '../Logger'
import { CDMSchemaTypes, DbDialect } from '../const'
import { AnalyticsSvcAPI, PortalAPI } from '../api'

const logger = createLogger('generate-dataset-schema')

export const generateDatasetSchema = async (req: Request, res: Response, next: NextFunction) => {
  const { tokenStudyCode, dialect, databaseCode, schemaOption, cdmSchemaValue } = req.body

  const token = req.headers.authorization!
  const portalAPI = new PortalAPI(token)
  const analyticsSvcAPI = new AnalyticsSvcAPI(token)

  const id = uuidv4()

  req.body.id = id

  //CDM Schema preparation
  logger.info('Option for schema: ' + schemaOption + ' with the value: ' + cdmSchemaValue)
  if (schemaOption === CDMSchemaTypes.CustomCDM || schemaOption === CDMSchemaTypes.ExistingCDM) {
    const datasets = await portalAPI.getStudiesAsSystemAdmin()

    const schemaExists = await analyticsSvcAPI.checkIfSchemaExists(dialect, databaseCode, cdmSchemaValue)

    const foundDataset = datasets.find(
      dataset => dataset.schemaName === cdmSchemaValue && dataset.databaseCode === databaseCode
    )

    if (foundDataset) {
      return badRequest(res, 'This schema is already in use')
    } else if (schemaOption === CDMSchemaTypes.CustomCDM && schemaExists) {
      return badRequest(res, 'This schema already exists')
    } else if (schemaOption === CDMSchemaTypes.ExistingCDM && !schemaExists) {
      return badRequest(res, 'This schema does not exist')
    }

    req.body.schemaName = getSchemaCase(cdmSchemaValue, dialect)
  } else if (schemaOption == CDMSchemaTypes.CreateCDM) {
    const formattedTokenDatasetCode = tokenStudyCode.toUpperCase().replace(/_/g, '')
    req.body.schemaName = getSchemaCase(`CDM_${formattedTokenDatasetCode}_${id}`.replace(/-/g, ''), dialect)
  }

  next()
}

function getSchemaCase(schemaName: string, dialect: DbDialect) {
  switch (dialect) {
    case DbDialect.Hana:
      return schemaName.toUpperCase()
    case DbDialect.Postgres:
      return schemaName.toLowerCase()
    default:
      return schemaName
  }
}

function badRequest(res: Response, errorMessage: string) {
  logger.error(errorMessage)
  return res.status(400).send(errorMessage)
}
