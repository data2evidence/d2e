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
        const datasetKey = Object.keys(req.query)
          .filter(query => ['selectedStudyId', 'selectedStudyEntityValue', 'studyId'].includes(query))
          .toString()
        dataset = req.query[datasetKey]
      }
      break

    case 'POST':
      if (req.body.mriquery) {
        dataset = convertZlibBase64ToJson(req.body.mriquery).selectedStudyEntityValue
      } else if (req.query.studyId) {
        dataset = req.query.studyId
      }
      break
  }

  if (dataset && !allowedDatasets.includes(dataset)) {
    logger.info(`inside ensureDatasetAuthorized: User does not have access to dataset`)
    return res.sendStatus(403)
  }
  return next()
}

export const ensureDataflowMgmtDatasetAuthorized = async (req, res: Response, next: NextFunction) => {
  // This middleware should be used after checkScopes
  // Skip dataset authorization check for admin role
  if (req.user.userMgmtGroups.alp_role_system_admin) return next()

  const allowedDatasets = req.user.userMgmtGroups.alp_role_study_researcher
  let dataset

  switch (req.method) {
    case 'GET':
      if (req.params && req.params.datasetId) {
        dataset = req.params.datasetId
      }
      break

    case 'POST':
      const { options } = req.body
      dataset = options?.datasetId
      break
  }

  if (dataset && !allowedDatasets.includes(dataset)) {
    logger.info(`inside ensureDatasetAuthorized: User does not have access to dataset`)
    return res.sendStatus(403)
  }
  return next()
}

export const ensureTerminologyDatasetAuthorized = async (req, res: Response, next: NextFunction) => {
  const allowedDatasets = req.user.userMgmtGroups.alp_role_study_researcher
  let dataset

  switch (req.method) {
    case 'GET':
      if (req.query && req.query.datasetId) {
        dataset = req.query.datasetId
      }
      break

    case 'POST':
      const { datasetId } = req.body
      dataset = datasetId
      break
  }

  if (dataset && !allowedDatasets.includes(dataset)) {
    logger.info(`inside ensureDatasetAuthorized: User does not have access to dataset`)
    return res.sendStatus(403)
  }
  return next()
}