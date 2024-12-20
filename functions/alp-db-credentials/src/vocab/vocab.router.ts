import { Router, NextFunction, Request, Response } from 'express'
import { Service } from 'typedi'
import { createLogger } from '../logger'
import { VocabService } from './vocab.service.ts'

@Service()
export class VocabRouter {
  private readonly router = Router()
  private readonly logger = createLogger(this.constructor.name)

  constructor(private readonly vocabService: VocabService) {
    this.registerRoutes()
  }

  getRouter() {
    return this.router
  }

  private registerRoutes() {
    this.router.get('/:dialect/schema/list', async (req: Request, res: Response, next: NextFunction) => {
      const { dialect } = req.params
      this.logger.info(`Get ${dialect} vocab schema list`)

      try {
        const vocabSchemas = await this.vocabService.getVocabSchemas(dialect)
        res.status(200).json(vocabSchemas)
      } catch (err) {
        this.logger.error(`Error when getting vocab schema list: ${JSON.stringify(err)}`)
        next(err)
      }
    })
  }
}
