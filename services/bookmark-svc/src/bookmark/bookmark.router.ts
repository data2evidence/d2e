import { Logger } from '@alp/alp-base-utils'
import { EnvVarUtils } from '@alp/alp-base-utils'
import { Router, NextFunction, Response } from 'express'
import { IMRIRequest } from '../types'
import { Service } from 'typedi'
import { plainToInstance } from 'class-transformer'
import { queryBookmarks } from './bookmarkservice'
import { getUser, getUserMgmtId } from '../utils/User'
import MRIEndpointErrorHandler from '../utils/MRIEndpointErrorHandler'

@Service()
export class BookmarkRouter {
  private readonly router = Router()
  private readonly log = Logger.CreateLogger(this.constructor.name)

  constructor() {
    this.registerRoutes()
  }
  getRouter() {
    return this.router
  }

  private registerRoutes() {
    this.router.get('/', async (req: IMRIRequest, res: Response, next: NextFunction) => {
      this.log.info('Get bookmark list')

      try {
        const { configConnection } = req.dbConnections
        const user = getUser(req)
        const userId = getUserMgmtId(user)
        const language = user.lang

        req.body.cmd = 'loadAll'
        req.body.paConfigId = req.query.paConfigId

        queryBookmarks(req.body, userId, EnvVarUtils.getBookmarksTable(), configConnection, (err, data) => {
          if (err) {
            return res.status(500).send(MRIEndpointErrorHandler({ err, language }))
          } else {
            if (data && data.bookmarks && data.bookmarks.length > 0) {
              data.bookmarks.forEach(el => {
                if (el.ViewName && el.ViewName === 'NoValue') {
                  el.ViewName = ''
                }
              })
            }
            res.status(200).json(data)
          }
        })
      } catch (err) {
        this.log.error(`Failed to load all bookamarks: ${JSON.stringify(err)}`)
      }
    })

    this.router.post('/', async (req: IMRIRequest, res: Response, next: NextFunction) => {
      this.log.info('Create bookmark')
      try {
        const { configConnection } = req.dbConnections
        const user = getUser(req)
        const language = user.lang
        const userId = getUserMgmtId(user)

        if (!req.body.bookmark) {
          res.status(500).send(
            MRIEndpointErrorHandler({
              err: new Error('BookmarkId is required'),
              language,
            })
          )
        }
        req.body.cmd = 'insert'

        queryBookmarks(req.body, userId, EnvVarUtils.getBookmarksTable(), configConnection, (err, data) => {
          if (err) {
            return res.status(500).send(MRIEndpointErrorHandler({ err, language }))
          } else {
            res.status(200).json(data)
          }
        })
      } catch (err) {
        this.log.error(`Failed to create bookamark: ${JSON.stringify(err)}`)
      }
    })

    this.router.put('/:bookmarkId', async (req: IMRIRequest, res: Response, next: NextFunction) => {
      this.log.info('Update bookmark')
      try {
        const { configConnection } = req.dbConnections
        const user = getUser(req)
        const language = user.lang
        const userId = getUserMgmtId(user)

        const { bookmarkId } = req.params
        if (!bookmarkId) {
          res.status(500).send(
            MRIEndpointErrorHandler({
              err: new Error('BookmarkId is required'),
              language,
            })
          )
        }

        if (req.body.cmd !== 'update' && req.body.cmd !== 'rename') {
          return res.status(500).send(
            MRIEndpointErrorHandler({
              err: new Error('Not a valid command'),
              language,
            })
          )
        }

        if (req.body.cmd === 'update') {
          req.body.bookmark = req.params.bookmark
        }

        req.body.bmkId = bookmarkId

        queryBookmarks(req.body, userId, EnvVarUtils.getBookmarksTable(), configConnection, (err, data) => {
          if (err) {
            return res.status(500).send(MRIEndpointErrorHandler({ err, language }))
          } else {
            res.status(200).json(data)
          }
        })
      } catch (err) {
        this.log.error(`Failed to update bookamark: ${JSON.stringify(err)}`)
      }
    })

    this.router.delete('/:bookmarkId', async (req: IMRIRequest, res: Response, next: NextFunction) => {
      this.log.info('Delete bookmark')

      try {
        const { configConnection } = req.dbConnections
        const user = getUser(req)
        const language = user.lang
        const userId = getUserMgmtId(user)

        const { bookmarkId } = req.params
        if (!bookmarkId) {
          res.status(500).send(
            MRIEndpointErrorHandler({
              err: new Error('BookmarkId is required'),
              language,
            })
          )
        }

        req.body.cmd = 'delete'
        req.body.bmkId = bookmarkId

        queryBookmarks(req.body, userId, EnvVarUtils.getBookmarksTable(), configConnection, (err, data) => {
          if (err) {
            return res.status(500).send(MRIEndpointErrorHandler({ err, language }))
          } else {
            res.status(200).json(data)
          }
        })
      } catch (err) {
        this.log.error(`Failed to delete bookamark: ${JSON.stringify(err)}`)
      }
    })

    this.router.get('/bookmarkIds', async (req: IMRIRequest, res: Response, next: NextFunction) => {
      this.log.info('Get bookmark ids')

      try {
        const { configConnection } = req.dbConnections
        const user = getUser(req)
        const language = user.lang
        const userId = getUserMgmtId(user)

        req.body.cmd = 'loadByIDs'
        req.body.bmkIds = (req.query.ids as string).split(',')

        queryBookmarks(req.body, userId, EnvVarUtils.getBookmarksTable(), configConnection, (err, data) => {
          if (err) {
            return res.status(500).send(MRIEndpointErrorHandler({ err, language }))
          } else {
            res.status(200).json(data)
          }
        })
      } catch (err) {
        this.log.error(`Failed to load bookmarks by Ids: ${JSON.stringify(err)}`)
      }
    })
  }
}
