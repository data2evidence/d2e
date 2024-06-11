/**
 * Backend functionality for the bookmark functionality
 */
import * as crypto from 'crypto'
import * as async from 'async'
import { Connection as connLib } from '@alp/alp-base-utils'
import ConnectionInterface = connLib.ConnectionInterface
import CallBackInterface = connLib.CallBackInterface
import { QueryObject as qo } from '@alp/alp-base-utils'
import QueryObject = qo.QueryObject
export import utils = require('@alp/alp-base-utils')
import { IBookmark, QueryObjectResultType, BookmarkQueryResultType } from '../types'
/**
 * This method was created so it can be spied on during testing (without affecting utils)
 */
export function _createGuid() {
  return utils.createGuid()
}

/**
 * Generate a bookmarkid based on bookmark name and some random numbers. Then just get last 40 characters as this is the db column limit
 */
export function createBookmarkId(bookmarkName: string) {
  return `${bookmarkName.replace(/[^a-zA-Z0-9]/g, '')}_${crypto.randomBytes(4).toString('hex')}`.substr(-40)
}

/**
 * Get the SQL query for fetching all bookmarks.
 *
 * @private
 * @param {string}
 *            table Name of table to use
 * @returns {string} complete SQL query
 */
export function getAllBookmarksQuery(table) {
  return `SELECT 
  user_id,
  bookmark_name as bookmarkname, 
  bookmark, 
  id as "bmkId", 
  view_name as viewname, 
  modified, 
  shared,
  version
  FROM ${table} 
  WHERE pa_config_id = %s
  ORDER BY bookmark_name`
}

/**
 * Get the SQL query for fetching a single bookmark.
 *
 * @private
 * @param {string}
 *            table Name of table to use
 * @returns {string} complete SQL query
 */
export function getSingleBookmarkQuery(table) {
  return `SELECT 
       bookmark_name as "bookmarkname", 
       bookmark as "bookmark", 
       id as "bmkId",
       user_id as "userId",
       view_name as "viewname",
       modified as "modified", 
       version as "version"
     FROM ${table} 
     WHERE id = %s 
       AND pa_config_id = %s
       AND (type = 'BOOKMARK' OR type IS NULL)`
}

/**
 * Load all bookmarks for a given user id.
 *
 * @param {string}
 *            userid userid
 * @param {string}
 *            table Name of table to use
 * @param {object}
 *            dbConnection DB connection to be used
 * @returns {object[]} Updated bookmaks, ordered by bookmark name
 */

export function _loadAllBookmarks(
  userId,
  paConfigId,
  table,
  connection: ConnectionInterface,
  callback: CallBackInterface
) {
  let query: QueryObject = QueryObject.format(getAllBookmarksQuery(table), paConfigId)
  query.executeQuery(connection, (err, result) => {
    if (err) {
      callback(err, null)
      return
    }
    connection.commit()

    // TODO: this is a temp code, will be used until ViewName column added to the CI DB.
    result.data.forEach(el => {
      if (el.ViewName && el.ViewName === 'NoValue') {
        el.ViewName = null
      }
    })

    let returnValue = {
      schemaName: connection.schemaName,
      bookmarks: result.data,
    }
    callback(err, _convertBookmarkIFR(returnValue))
  })
}

/**
 * Loads a single bookmark for a given user id and bookmark id.
 *
 * @param {string}
 *            bookmarkId Bookmark Id
 * @param {string}
 *            userId userid
 * @param {string}
 *            table Name of table to use
 * @param {object}
 *            dbConnection DB connection to be used
 * @returns {object[]} Updated bookmakrs, ordered by bookmark name
 */
export async function loadSingleBookmark(
  bookmarkId,
  paConfigId,
  table,
  connection: ConnectionInterface,
  callback?: CallBackInterface
) {
  let query: QueryObject = QueryObject.format(getSingleBookmarkQuery(table), bookmarkId, paConfigId)

  return new Promise<{ bookmarks: IBookmark[] }>(async (resolve, reject) => {
    try {
      const result: QueryObjectResultType<Array<BookmarkQueryResultType>> = await query.executeQuery(connection)

      // TODO: this is a temp code, will be used until ViewName column added to the CI DB.
      if (result && result.data && result.data.length > 0) {
        result.data.forEach(el => {
          if (el.viewname && el.viewname === 'NoValue') {
            el.viewname = null
          }
        })
      }

      let returnValue = _convertBookmarkIFR({
        bookmarks: result.data,
      })
      if (callback) {
        return callback(null, returnValue)
      }
      resolve(returnValue)
    } catch (err) {
      if (callback) {
        return callback(err, null)
      }
      reject(err)
    }
  })
}

/**
 * Insert a bookmark.
 *
 * @param {string}
 *            bookname name
 * @param {string}
 *            bookmark contents
 * @param {string}
 *            user Id
 * @param {string}
 *            last modified user name
 * @param {string}
 *            table Name of table to use
 * @param {object}
 *            dbConnection DB connection to be used
 */
export function _insertBookmark(
  bookmarkName,
  bookmark,
  userId,
  paConfigId,
  cdmConfigId,
  cdmConfigVersion,
  shareBookmark,
  table,
  connection: ConnectionInterface,
  callback: CallBackInterface
) {
  let INSERT_BOOKMARKS = `INSERT INTO ${table} (id, user_id, bookmark_name, bookmark, pa_config_id, cdm_config_id, cdm_config_version, shared, modified) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, CURRENT_TIMESTAMP)`

  let bmkId = createBookmarkId(bookmarkName)

  let query: QueryObject = QueryObject.format(
    INSERT_BOOKMARKS,
    bmkId,
    userId,
    bookmarkName,
    bookmark,
    paConfigId,
    cdmConfigId,
    cdmConfigVersion,
    shareBookmark.toString()
  )

  query.executeUpdate(connection, (err, result) => {
    if (err) {
      callback(err, null)
      return
    }
    connection.commit()
    callback(err, result)
  })
}

/**
 * Delete an existing bookmark.
 *
 * @param {string}
 *            bookmarkId Bookmark ID
 * @param {string}
 *            user ID
 * @param {string}
 *            pa config Id
 * @param {string}
 *            table Name of table to use
 * @param {object}
 *            dbConnection DB connection to be used
 */
export function _deleteBookmark(
  bookmarkId,
  userId,
  paConfigId,
  table,
  configConnection: ConnectionInterface,
  callback: CallBackInterface
) {
  if (!bookmarkId || !userId || bookmarkId === '' || userId === '') {
    callback(null, null)
  }
  // first get the bookmark record for the given params
  let fnGetBookmark = cb => {
    let qry: QueryObject = QueryObject.format(getSingleBookmarkQuery(table), bookmarkId, userId)
    qry.executeQuery(configConnection, (err, bookmarks) => {
      if (err) {
        cb(err)
      } else {
        cb(null, bookmarks)
      }
    })
  }

  // lastly, delete the bookmark record
  let fnDeleteBookmark = (bookmarks, cb) => {
    if (bookmarks && bookmarks.data && bookmarks.data.length > 0) {
      let DELETE_BOOKMARK = `DELETE FROM ${table} WHERE user_id = %s AND id = %s AND pa_config_id = %s AND(type = 'BOOKMARK' OR type IS NULL)`

      let query: QueryObject = QueryObject.format(
        DELETE_BOOKMARK,
        bookmarks.data[0].userId,
        bookmarks.data[0].bmkId,
        paConfigId
      )

      query.executeUpdate(configConnection, (err, result) => {
        if (err) {
          cb(err)
        } else {
          configConnection.commit()
          cb(null, result)
        }
      })
    } else {
      cb(null, null)
    }
  }

  async.waterfall([fnGetBookmark, fnDeleteBookmark], (err, result) => {
    if (err) {
      callback(err, null)
    } else {
      callback(null, result)
    }
  })
}

/**
 * Rename an existing bookmark.
 *
 * @param {string}
 *            bookmarkId Bookmark ID
 * @param {string}
 *            newBookmarkName New Bookmark Name
 * @param {string}
 *            user Id
 * @param {string}
 *            pa config Id
 * @param {string}
 *            cdm config Id
 * @param {string}
 *            cdm config version
 * @param {string}
 *            table Name of table to use
 * @param {object}
 *            dbConnection DB connection to be used
 *  @param {object}
 *            callback
 */
export function _renameBookmark(
  bookmarkId,
  newBookmarkName,
  userId,
  paConfigId,
  cdmConfigId,
  cdmConfigVersion,
  table,
  connection: ConnectionInterface,
  callback: CallBackInterface
) {
  let UPDATE_BOOKMARK = `UPDATE ${table} SET bookmark_name = %s, modified = CURRENT_TIMESTAMP, version = version + 1, pa_config_id = %s, cdm_config_id = %s, cdm_config_version = %s WHERE user_id = %s AND id = %s AND (type = 'BOOKMARK' OR type IS NULL)`

  let query: QueryObject = QueryObject.format(
    UPDATE_BOOKMARK,
    newBookmarkName,
    paConfigId,
    cdmConfigId,
    cdmConfigVersion,
    userId,
    bookmarkId
  )

  query.executeUpdate(connection, (err, result) => {
    if (err) {
      callback(err, null)
      return
    }
    connection.commit()
    callback(err, result)
  })
}

/**
 * Update an existing bookmark.
 *
 * @param {string}
 *            bookmarkId Bookmark ID
 * @param {string}
 *            bookmark New Bookmark Data
 * @param {string}
 *            user Id
 * @param {string}
 *            pa config Id
 * @param {string}
 *            cdm config Id
 * @param {string}
 *            cdm config version
 * * @param {boolean}
 *            defines whethers the bookmark is shared between users
 * @param {string}
 *            table Name of table to use
 * @param {object}
 *            dbConnection DB connection to be used
 * @param {object}
 *            callback
 */
export function _updateBookmark( //TODO remove user input
  bookmarkId,
  bookmark,
  userId,
  paConfigId,
  cdmConfigId,
  cdmConfigVersion,
  shareBookmark,
  table,
  connection: ConnectionInterface,
  callback: CallBackInterface
) {
  let UPDATE_BOOKMARK = `UPDATE ${table} SET bookmark = %s, modified = CURRENT_TIMESTAMP, version = version + 1, shared = %s, pa_config_id = %s, cdm_config_id = %s, cdm_config_version = %s WHERE user_id = %s AND  id = %s AND (type = 'BOOKMARK' OR type IS NULL)`

  let query: QueryObject = QueryObject.format(
    UPDATE_BOOKMARK,
    bookmark,
    shareBookmark.toString(),
    paConfigId,
    cdmConfigId,
    cdmConfigVersion,
    userId,
    bookmarkId
  )

  query.executeUpdate(connection, (err, result) => {
    if (err) {
      callback(err, null)
      return
    }
    connection.commit()
    callback(err, result)
  })
}

/**
 * Returns a list of bookmarks with supplied bookmark id's
 *
 * @param {{ bookmarkIds: string[]; table: string; user: string, configConnection: ConnectionInterface }}
 *  bookmarkIds - list of bookmark ids
 *  table - bookmark table name
 *  userId - userid
 *  configConnection - connection object
 * @returns array of bookmarks
 */
export async function loadBookmarks({
  bookmarkIds,
  table,
  paConfigId,
  configConnection,
  callback,
}: {
  bookmarkIds: string[]
  table: string
  paConfigId: string
  configConnection: ConnectionInterface
  callback: CallBackInterface
}) {
  const list = await Promise.all(
    bookmarkIds.map(bookmarkid =>
      loadSingleBookmark(bookmarkid, paConfigId, table, configConnection, null).then(result => result.bookmarks[0])
    )
  )
    .then(data => {
      callback(null, data)
    })
    .catch(err => {
      callback(err, null)
    })
  return list
}

/**
 * Process data passed to the bookmark REST-service.
 *
 * @param {object}
 *            requestParameters Parameters passed in request to REST-service
 * @param {string}
 *            user User id
 * @param {string}
 *            table Name of table to use
 * @param {object}
 *            dbConnection DB connection to be used
 * @returns {object} Always return new Bookmark list to keep the frontend
 *          up-to-date.
 */
export function queryBookmarks(
  requestParameters,
  userId,
  table,
  configConnection: ConnectionInterface,
  callback: CallBackInterface
) {
  try {
    let cmd: string = requestParameters.cmd
    let bookmark: string = requestParameters.bookmark
    let bookmarkId: string = requestParameters.bmkId
    let bookmarkIds: string[] = requestParameters.bmkIds
    let viewName: string = requestParameters.viewName
    let paConfigId: string = requestParameters.paConfigId
    let cdmConfigId: string = requestParameters.cdmConfigId
    let cdmConfigVersion: string = requestParameters.cdmConfigVersion
    let shareBookmark: boolean = requestParameters.shareBookmark

    let cb = (err, result) => {
      if (err) {
        callback(err, null)
        return
      }
      callback(err, `success`)
    }

    switch (cmd) {
      case 'insert':
        // 'this' has to be used so we can use spyON in the tests
        _insertBookmark(
          requestParameters.bookmarkname,
          bookmark,
          userId,
          paConfigId,
          cdmConfigId,
          cdmConfigVersion,
          shareBookmark,
          table,
          configConnection,
          cb
        )
        break
      case 'delete':
        _deleteBookmark(bookmarkId, userId, paConfigId, table, configConnection, cb)
        break
      case 'update':
        _updateBookmark(
          bookmarkId,
          bookmark,
          userId,
          paConfigId,
          cdmConfigId,
          cdmConfigVersion,
          shareBookmark,
          table,
          configConnection,
          cb
        )
        break
      case 'rename':
        _renameBookmark(
          bookmarkId,
          requestParameters.newName,
          userId,
          paConfigId,
          cdmConfigId,
          cdmConfigVersion,
          table,
          configConnection,
          cb
        )
        break
      case 'loadSingle':
        loadSingleBookmark(bookmarkId, paConfigId, table, configConnection, callback)
        break
      case 'loadByIDs':
        loadBookmarks({
          bookmarkIds,
          table,
          paConfigId,
          configConnection,
          callback,
        })
        break
      case 'loadAll':
        _loadAllBookmarks(userId, paConfigId, table, configConnection, callback)
        break
      default:
        throw new Error('unknown command: ' + cmd)
    }
  } catch (error) {
    callback(error, null)
  }
}

/**
 * If bookmark IFR is in Uint8Array format then converts it to string.
 * @param   {Object} result - queried result
 * @returns {Object} - updated result
 */
function _convertBookmarkIFR(result) {
  if (result && result.bookmarks && result.bookmarks.length > 0) {
    result.bookmarks.forEach(el => {
      if (ArrayBuffer.isView(el.bookmark)) {
        el.bookmark = utils.toString(el.bookmark)
      } else if (ArrayBuffer.isView(el.cohortDefinition)) {
        el.cohortDefinition = utils.toString(el.cohortDefinition)
      }
    })
  }
  return result
}
