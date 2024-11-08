import { Router } from 'express'
import { Service } from 'typedi'
import { DbRouter } from './db/db.router'

@Service()
export class Routes {
  private readonly router = Router()

  constructor(private readonly dbRouter: DbRouter) {
    this.router.use('/db', this.dbRouter.getRouter())
  }

  getRouter() {
    return this.router
  }
}

export default Routes
