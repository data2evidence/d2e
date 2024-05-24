import { NextFunction, Request, Response } from 'express'
import pako from 'pako'
import { createLogger } from '../Logger'

const logger = createLogger('ensure dataset authorized')

function convertZlibBase64ToJson(base64String: string) {
  try {
    return JSON.parse(
      pako.inflate(
        Buffer.from(base64String, 'base64')
          .toString('binary')
          .split('')
          .map(x => x.charCodeAt(0)),
        { to: 'string' }
      )
    )
  } catch (err) {
    throw new Error('There was en error converting the input to JSON')
  }
}

export const ensureAnalyticsDatasetAuthorized = async (req, res: Response, next: NextFunction) => {
  const allowedDatasets = req.user.userMgmtGroups.alp_role_study_researcher
  let dataset

  switch (req.method) {
    case 'GET':
      if (req.query && req.query.mriquery) {
        dataset = convertZlibBase64ToJson(req.query.mriquery).selectedStudyEntityValue
      } else {
        let datasetKey = Object.keys(req.query)
          .filter(query => ['selectedStudyId', 'selectedStudyEntityValue', 'studyId'].includes(query))
          .toString()
        dataset = req.query[datasetKey]
      }

    case 'POST':
      if (req.body.mriquery) {
        let dataset = convertZlibBase64ToJson(req.body.mriquery).selectedStudyEntityValue
        console.log(dataset)
      }
  }

  if (dataset && !allowedDatasets.includes(dataset)) {
    logger.info(`inside ensureDatasetAuthorized: User does not have access to dataset`)
    return res.sendStatus(403)
  }
  return next()
}

export const ensureDataflowMgmtDatasetAuthorized = async (req, res: Response, next: NextFunction) => {
  const allowedDatasets = req.user.userMgmtGroups.alp_role_study_researcher
  let dataset

  switch (req.method) {
    case 'GET':
      if (req.params && req.params.datasetId) {
        dataset = req.params.datasetId
      }
    case 'POST':
      const { options } = req.body
      dataset = options?.datasetId
  }

  if (dataset && !allowedDatasets.includes(dataset)) {
    logger.info(`inside ensureDatasetAuthorized: User does not have access to dataset`)
    return res.sendStatus(403)
  }
  return next()
}
