import { Router } from 'express'
import { Service } from 'typedi'
import { DbRouter } from './db/db.router'
import { VocabRouter } from './vocab/vocab.router'

@Service()
export class Routes {
  private readonly router = Router()

  constructor(
    private readonly dbRouter: DbRouter,
    private readonly vocabRouter: VocabRouter
  ) {
    this.router.use('/db', this.dbRouter.getRouter())
    this.router.use('/vocab', this.vocabRouter.getRouter())
  }

  getRouter() {
    return this.router
  }
}

export default Routes
