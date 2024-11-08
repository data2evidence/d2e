import { Router } from 'express'
jest.mock('./db.service')
import { DbService } from './db.service'
import { DbRouter } from './db.router'

describe('DbRouter', () => {
  let router: Router
  beforeAll(() => {
    const MockDbService = <jest.Mock<DbService>>DbService
    const service = new MockDbService()
    router = new DbRouter(service).getRouter()
  })
  describe('has routes', () => {
    const routes = [
      { path: '/list', method: 'get' },
      { path: `/:id`, method: 'get' },
      { path: '/', method: 'post' },
      { path: '/', method: 'put' },
      { path: `/:id`, method: 'delete' }
    ]

    test.each(routes)('`$method` exists on $path', route => {
      expect(router.stack.some(s => Object.keys(s.route.methods).includes(route.method))).toBe(true)
      expect(router.stack.some(s => s.route.path === route.path)).toBe(true)
    })
  })
})
