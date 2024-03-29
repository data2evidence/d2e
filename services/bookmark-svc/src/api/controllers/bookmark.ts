import { queryBookmarks } from '../../mri/endpoint/bookmarkservice'
import { EnvVarUtils } from '@alp/alp-base-utils'
import { getUser, getUserMgmtId } from '../../utils/User'
import MRIEndpointErrorHandler from '../../utils/MRIEndpointErrorHandler'
import { IMRIRequest } from '../../types'

export async function getBookmarkList(req: IMRIRequest, res) {
  const { configConnection } = req.dbConnections

  const user = getUser(req)
  const userId = getUserMgmtId(user)
  const language = user.lang

  req.body.cmd = 'loadAll'
  req.body.paConfigId = req.swagger.params.paConfigId.value

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
}

export async function getBookmarksById(req: IMRIRequest, res) {
  const { configConnection } = req.dbConnections
  const user = getUser(req)
  const language = user.lang
  const userId = getUserMgmtId(user)

  req.body.cmd = 'loadByIDs'
  req.body.bmkIds = (req.swagger.params.ids.value as string).split(',')

  queryBookmarks(req.body, userId, EnvVarUtils.getBookmarksTable(), configConnection, (err, data) => {
    if (err) {
      return res.status(500).send(MRIEndpointErrorHandler({ err, language }))
    } else {
      res.status(200).json(data)
    }
  })
}

export async function deleteBookmark(req: IMRIRequest, res) {
  const { configConnection } = req.dbConnections
  const user = getUser(req)
  const language = user.lang
  const userId = getUserMgmtId(user)

  if (!req.swagger.params.bookmarkId.value) {
    res.status(500).send(
      MRIEndpointErrorHandler({
        err: new Error('BookmarkId is required'),
        language,
      })
    )
  }

  req.body.cmd = 'delete'
  req.body.bmkId = req.swagger.params.bookmarkId.value

  queryBookmarks(req.body, userId, EnvVarUtils.getBookmarksTable(), configConnection, (err, data) => {
    if (err) {
      return res.status(500).send(MRIEndpointErrorHandler({ err, language }))
    } else {
      res.status(200).json(data)
    }
  })
}

export async function addBookmark(req, res) {
  const { configConnection } = req.dbConnections
  const user = getUser(req)
  const language = user.lang
  const userId = getUserMgmtId(user)

  if (!req.swagger.params.bookmark.value) {
    res.status(500).send(
      MRIEndpointErrorHandler({
        err: new Error('BookmarkId is required'),
        language,
      })
    )
  }

  req.body.cmd = 'insert'
  req.body.bookmark = req.swagger.params.bookmark.value.bookmark
  req.body.bookmarkname = req.swagger.params.bookmark.value.bookmarkname
  req.body.shareBookmark = req.swagger.params.bookmark.value.shareBookmark

  queryBookmarks(req.body, userId, EnvVarUtils.getBookmarksTable(), configConnection, (err, data) => {
    if (err) {
      return res.status(500).send(MRIEndpointErrorHandler({ err, language }))
    } else {
      res.status(200).json(data)
    }
  })
}

export async function updateBookmark(req, res) {
  const { configConnection } = req.dbConnections
  const user = getUser(req)
  const userId = getUserMgmtId(user)

  const language = user.lang

  if (!req.swagger.params.bookmark.value) {
    res.status(500).send(
      MRIEndpointErrorHandler({
        err: new Error('BookmarkId is required'),
        language,
      })
    )
  }

  if (req.body.cmd === 'update') {
    req.body.bookmark = req.swagger.params.bookmark.value.bookmark
  } else if (req.body.cmd === 'rename') {
    req.body.newName = req.swagger.params.bookmark.value.newName
  } else {
    return res.status(500).send(
      MRIEndpointErrorHandler({
        err: new Error('Not a valid command'),
        language,
      })
    )
  }

  req.body.bmkId = req.swagger.params.bookmarkId.value

  queryBookmarks(req.body, userId, EnvVarUtils.getBookmarksTable(), configConnection, (err, data) => {
    if (err) {
      return res.status(500).send(MRIEndpointErrorHandler({ err, language }))
    } else {
      res.status(200).json(data)
    }
  })
}
