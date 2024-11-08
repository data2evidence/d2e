import { Router, NextFunction, Request, Response } from 'express'
import { Service } from 'typedi'
import { plainToInstance } from 'class-transformer'
import { createLogger } from '../logger'
import { DbService } from './db.service'
import { checkDbId, checkServiceScope, validateDbDto } from '../common/middleware/route-check'
import { DbCredentialUpdateDto, DbDto, DbUpdateDto } from './dto/db.dto'

@Service()
export class DbRouter {
  private readonly router = Router()
  private readonly logger = createLogger(this.constructor.name)

  constructor(private readonly dbService: DbService) {
    this.registerRoutes()
  }

  getRouter() {
    return this.router
  }

  private registerRoutes() {
    this.router.get('/list', async (_req: Request, res: Response, next: NextFunction) => {
      this.logger.info(`Get db list`)

      try {
        const db = await this.dbService.list()
        res.status(200).json(db)
      } catch (err) {
        this.logger.error(`Error when getting db list: ${JSON.stringify(err)}`)
        next(err)
      }
    })

    this.router.get('/:id', checkDbId, checkServiceScope, async (req: Request, res: Response, next: NextFunction) => {
      const { id } = req.params
      const serviceScope = req.query.serviceScope as string
      this.logger.info(`Get db with scope ${serviceScope}: ${id}`)

      try {
        const db = await this.dbService.get(id, serviceScope)
        res.status(200).json(db)
      } catch (err) {
        this.logger.error(`Error when getting db ${id}: ${JSON.stringify(err)}`)
        next(err)
      }
    })

    this.router.get('/:dialect/vocab-schema/list', async (req: Request, res: Response, next: NextFunction) => {
      const { dialect } = req.params
      this.logger.info(`Get ${dialect} db vocab schema list`)

      try {
        const vocabSchemas = await this.dbService.getVocabSchemas(dialect)
        res.status(200).json(vocabSchemas)
      } catch (err) {
        this.logger.error(`Error when getting db vocab schema list: ${JSON.stringify(err)}`)
        next(err)
      }
    })

    this.router.post('/', validateDbDto, async (req: Request, res: Response, next: NextFunction) => {
      const dbDto = plainToInstance(DbDto, req.body)

      try {
        const db = await this.dbService.create(dbDto)
        return res.status(201).json(db)
      } catch (err) {
        this.logger.error(`Error when creating db: ${JSON.stringify(err)}`)
        next(err)
      }
    })

    this.router.put('/', validateDbDto, async (req: Request, res: Response, next: NextFunction) => {
      const dbDto = plainToInstance(DbUpdateDto, req.body)

      try {
        const db = await this.dbService.update(dbDto)
        return res.status(200).json(db)
      } catch (err) {
        this.logger.error(`Error when updating db: ${JSON.stringify(err)}`)
        next(err)
      }
    })

    this.router.put('/credential', validateDbDto, async (req: Request, res: Response, next: NextFunction) => {
      const dbCredentialDto = plainToInstance(DbCredentialUpdateDto, req.body)

      try {
        const db = await this.dbService.updateCredentials(dbCredentialDto)
        return res.status(200).json(db)
      } catch (err) {
        this.logger.error(`Error when updating db credential: ${JSON.stringify(err)}`)
        next(err)
      }
    })

    this.router.delete('/:id', checkDbId, async (req: Request, res: Response, next: NextFunction) => {
      const { id } = req.params

      this.logger.info(`Delete db: ${id}`)

      try {
        await this.dbService.delete(id)
        res.status(200).json({ id })
      } catch (err) {
        this.logger.error(`Error when deleting db ${id}: ${JSON.stringify(err)}`)
        next(err)
      }
    })
  }
}
