import { IMRIRequest } from '../types'
import { Router, NextFunction, Response } from 'express'
import MRIEndpointErrorHandler from '../utils/MRIEndpointErrorHandler'
import { getUser } from '../utils/User'

export const checkBookmarkId = (req: IMRIRequest, res: Response, next: NextFunction) => {
  const { bookmarkId } = req.params || {}

  if (!bookmarkId) {
    const user = getUser(req)
    const language = user.lang

    return res.status(400).send(
      MRIEndpointErrorHandler({
        err: new Error('BookmarkId is required'),
        language,
      })
    )
  }
  next()
}

export const checkValidCommand = (req: IMRIRequest, res: Response, next: NextFunction) => {
  if (req.body.cmd !== 'update' && req.body.cmd !== 'rename') {
    const user = getUser(req)
    const language = user.lang

    return res.status(400).send(
      MRIEndpointErrorHandler({
        err: new Error('Not a valid command'),
        language,
      })
    )
  }
  next()
}

export const checkContainsBookmark = (req: IMRIRequest, res: Response, next: NextFunction) => {
  if (!req.body.bookmark) {
    const user = getUser(req)
    const language = user.lang

    return res.status(400).send(
      MRIEndpointErrorHandler({
        err: new Error('Bookmark is required'),
        language,
      })
    )
  }
  next()
}
