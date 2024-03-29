import { knex } from 'knex'
import pg from 'pg'
import config from './knexfile'
import { Logger } from '@alp/alp-base-utils'

const log = Logger.CreateLogger('bookmark-log')

const parseFn = (val: string) => {
  return val === null ? null : new Date(Date.parse(val + 'z'))
}
// 1114 represents type timestamp without timezone in pg
pg.types.setTypeParser(1114, parseFn)

const db = knex(config)

db.client.validateConnection = (connection: any) => {
  if (connection.__knex__disposed) {
    log.info(`Connection error ${connection.__knex__disposed}`)
    return false
  } else {
    return true
  }
}

const pool = db.client.pool
pool.on('release', () => {
  log.debug('Pool release')
  process.nextTick(() => {
    log.debug('Pool check')
    pool.check()
  })
})

export { db }
