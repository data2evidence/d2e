/**
 * this file should have all the types in this repo
 */
import { Connection } from '@alp/alp-base-utils'
import ConnectionInterface = Connection.ConnectionInterface
import { Request } from 'express'
export interface IMRIRequest extends Request {
  dbConnections: {
    analyticsConnection: ConnectionInterface
    vocabConnection: ConnectionInterface
    configConnection: ConnectionInterface
  }
  studiesDbMetadata: {
    studies: any
    cachedAt: number
  }
  fileName?: string
}
export interface Map<T> {
  [key: string]: T
}

export type Partial<T> = {
  [P in keyof T]?: T[P]
}

export type QueryObjectResultType<T> = {
  data: T
  sql: string
  sqlParameters: any[]
}

export type BookmarkQueryResultType = {
  bmkId: string
  bookmark: string
  bookmarkname: string
  modified: Date
  userid: string
  version: number
  viewname: string
}

export interface IBookmark {
  bookmarkname: string
  bookmark: string
  bmkId: string
}
