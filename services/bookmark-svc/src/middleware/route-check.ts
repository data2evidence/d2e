import { IMRIRequest } from '../types'
import { Router, NextFunction, Response } from 'express'
import MRIEndpointErrorHandler from '../utils/MRIEndpointErrorHandler'
import { getUser } from '../utils/User'
import { AnyZodObject } from 'zod'

export const validate = (schema: AnyZodObject) => async (req: IMRIRequest, res: Response, next: NextFunction) => {
  try {
    await schema.parseAsync({
      body: req.body,
      query: req.query,
      params: req.params,
    })
    return next()
  } catch (error) {
    const user = getUser(req)
    const language = user.lang
    return res.status(400).send(error)
  }
  next()
}
