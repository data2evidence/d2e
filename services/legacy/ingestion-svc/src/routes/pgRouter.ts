import express from 'express'
const multer = require('multer')
import * as config from '../utils/config'
import { registerRouterHandler, HTTP_METHOD, Roles } from '../utils/httpUtils'
import PGDAO from '../dao/pgDao'
import { body, param } from 'express-validator'
import { decrypt_v1, generateUUID } from '../utils/decrypt'
import { createSwiftContainer, createSwiftObjects } from '../utils/swiftUtils'
import { isValidJson } from '../utils/baseUtils'

const upload = multer({
  limits: {
    fileSize: 8000000
  }
}).any()
const uploadHandler = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  upload(req, res, (err: any) => {
    // Guard clauses
    if (err) {
      return res
        .status(400)
        .json({
          message: `Bad request, ${err.message}`
        })
        .end()
    }
    const files = (<any>req).files
    if (!files || files.length < 1) {
      return res
        .status(400)
        .json({
          message: `Request has no files (form-data)`
        })
        .end()
    }
    if (files.length > 20) {
      return res
        .status(400)
        .json({
          message: `Request can only accept 20 or fewer files`
        })
        .end()
    }
    req.body.files = files
    return next()
  })
}

export default class PGRouter {
  public router
  private logger
  private properties
  private dbDao
  private postgres_config
  private postgres_credentials
  private postgres_database_name
  private postgres_database_schema
  private env

  constructor() {
    this.router = express.Router()
    this.logger = config.getLogger()
    this.dbDao = new PGDAO()
    this.postgres_config = config.getProperties().POSTGRES_CONNECTION_CONFIG
    this.postgres_credentials = config.getProperties().POSTGRES_DATABASES_CREDENTIALS
    this.properties = config.getProperties()
    this.postgres_database_name = config.getProperties().POSTGRES_DATABASE_NAME
    this.postgres_database_schema = this.postgres_credentials[this.postgres_database_name].schema
    this.env = config.getProperties().NODE_ENV

    //data-donation/bi-events
    registerRouterHandler(
      this.router,
      HTTP_METHOD.POST,
      '/data-donation/bi-events',
      this.postgres_database_name, //Should match the key in POSTGRES_DATABASES_CREDENTIALS env
      [body(['data']).exists().withMessage("Cannot find 'data' key in the request body.")],
      [this.ingestBIEvents]
    )

    //data-donation/s4h
    registerRouterHandler(
      this.router,
      HTTP_METHOD.POST,
      '/data-donation/s4h',
      this.postgres_database_name, //Should match the key in POSTGRES_DATABASES_CREDENTIALS env
      [
        body(['resourceType']).exists().withMessage("Cannot find 'resourceType' key in the request body."),
        body(['type']).exists().withMessage("Cannot find 'type' key in the request body."),
        body(['entry']).exists().withMessage("Cannot find 'entry' key in the request body.")
      ],
      [this.ingestS4HDonations]
    )

    //data-donation/rki/explore
    registerRouterHandler(
      this.router,
      HTTP_METHOD.POST,
      '/data-donation/rki/explore',
      this.postgres_database_name, //Should match the key in POSTGRES_DATABASES_CREDENTIALS env
      [],
      [uploadHandler, this.ingestRKIDonations],
      [Roles.AZURE_AD_INGEST_SVC_RKI_DONATIONS]
    )

    //data-donation/:studyId
    registerRouterHandler(
      this.router,
      HTTP_METHOD.POST,
      '/data-donation/:studyId',
      this.postgres_database_name, //Should match the key in POSTGRES_DATABASES_CREDENTIALS env
      [param('studyId').notEmpty().withMessage('Study ID is invalid')],
      [uploadHandler, this.ingestPHDPDonations],
      [Roles.AZURE_AD_INGEST_SVC_PHDP_DONATIONS]
    )

    //data-donation/rki/explore/fhirBundle
    registerRouterHandler(
      this.router,
      HTTP_METHOD.POST,
      '/data-donation/rki/explore/fhirBundle',
      this.postgres_database_name, //Should match the key in POSTGRES_DATABASES_CREDENTIALS env
      [
        body(['resourceType']).exists().withMessage("Cannot find 'resourceType' key in the request body."),
        body(['type']).exists().withMessage("Cannot find 'type' key in the request body."),
        body(['entry']).exists().withMessage("Cannot find 'entry' key in the request body.")
      ],
      [this.ingestRKIDonationsFhirBundle],
      [Roles.AZURE_AD_INGEST_SVC_RKI_DONATIONS]
    )
  }

  ingestBIEvents = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    let client
    try {
      const database = (<any>req)._dbName
      let config = { ...this.postgres_config, ...this.postgres_credentials[database], database }
      client = await this.dbDao.openConnection(config)

      //Data Ex: {"createdAt":"2021-09-06T13:12:46Z","BIAlpID":"5d00c936-f776-4dc9-a0d7-876028cd8972","studyID":"rki.panel","type":"bi_data_type_1","data":{"data":{"end-date":"2021-09-06T13:12:45.29Z","survey-id":"22d208a9-e87e-4450-9cee-767ba62baf26","start-date":null},"hostname":"survey-api-5cfd866c8f-pmg7b","tenant-id":"d4l","timestamp":"2021-09-06T13:12:46Z","event-type":"bi-event","event-source":"\/app\/pkg\/handlers\/subscriptionHandler.go:168","service-name":"cov-survey-api","activity-type":"survey-subscribe","service-version":"v0.19.0-3-gfd93600 ","consent-document-key":"d4l.contact.interview"}}
      this.logger.debug(`Request Body: ${JSON.stringify(req.body)}`)
      await this.dbDao.insertRecords(client, 'd4l_dd_studies_bi_events', this.postgres_database_schema, ['text'], {
        text: req.body
      })
      if (this.env !== 'TEST' && this.env !== 'DEVELOPMENT') {
        //Take backup in Swift
        let container = await createSwiftContainer()
        await createSwiftObjects(
          container,
          `BIEvents\\biEvents-${new Date().valueOf().toString()}.txt`,
          JSON.stringify(req.body),
          false
        )
      }
      res.send('BI Records inserted successfully')
    } catch (e) {
      next(e)
    } finally {
      await this.dbDao.closeConnection(client)
    }
  }

  ingestS4HDonations = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    let client
    try {
      const database = (<any>req)._dbName
      let config = { ...this.postgres_config, ...this.postgres_credentials[database], database }
      client = await this.dbDao.openConnection(config)

      this.logger.debug(`Request Body: ${JSON.stringify(req.body)}`)
      await this.dbDao.insertRecords(client, 'd4l_dd_s4h', this.postgres_database_schema, ['text'], { text: req.body })

      if (this.env !== 'TEST' && this.env !== 'DEVELOPMENT') {
        //Take backup in Swift
        let container = await createSwiftContainer()
        await createSwiftObjects(
          container,
          `S4H\\s4h-${new Date().valueOf().toString()}.txt`,
          JSON.stringify(req.body),
          false
        )
      }
      res.send('S4H donation inserted successfully')
    } catch (e) {
      next(e)
    } finally {
      await this.dbDao.closeConnection(client)
    }
  }

  ingestPHDPDonations = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const database = (<any>req)._dbName
    const config = {
      ...this.postgres_config,
      ...this.postgres_credentials[database],
      database
    }
    const client = await this.dbDao.openConnection(config)

    const files = req.body.files
    const contextIdentifier = generateUUID()
    const totalNumberOfFragments = files.length
    const columns = [
      'text',
      'alp_id',
      'encrypted_text',
      'http_context_identifier',
      'http_multipart_fragments_sequence_number',
      'http_multipart_fragments_total_number',
      'record_id',
      'donation_from'
    ]

    const malformedJsonErrorReason = 'Malformed json object detected by study data donation api'
    let malformedJsonDetected = false

    try {
      await client.query('BEGIN')

      for (const [index, file] of files.entries()) {
        const PHDP_DD_DECRYPTION_PRIVATE_KEYS: any = this.properties.PHDP_DD_DECRYPTION_PRIVATE_KEYS

        const text = Object.entries(PHDP_DD_DECRYPTION_PRIVATE_KEYS)
          .map(([_, key]) => {
            try {
              return decrypt_v1(file.buffer, <string>key).text
            } catch (err) {
              this.logger.info(`Decryption error: ${err}`)
            }
            return ''
          })
          .reduce((prevText: string, currText: string) => currText || prevText)
        this.logger.info(`text: ${text}`)

        const data: any = {
          text,
          alp_id: file.fieldname, // key name in form-data
          record_id: file.originalname, // file name
          encrypted_text: file.buffer.toString('base64'),
          http_context_identifier: contextIdentifier,
          http_multipart_fragments_sequence_number: index + 1,
          http_multipart_fragments_total_number: totalNumberOfFragments,
          donation_from: 'ingestion-svc'
        }

        if (text && text.length === 0) {
          await this.dbDao.insertRecords(client, 'd4l_dd_studies', this.postgres_database_schema, columns, data)
          continue
        }
        this.logger.debug(`Request Body: ${text}`)
        if (text && !isValidJson(text)) {
          malformedJsonDetected = true
          await this.dbDao.insertRecords(
            client,
            'd4l_dd_studies_with_error',
            this.postgres_database_schema,
            [...columns, 'error_reason'],
            {
              ...data,
              error_reason: malformedJsonErrorReason
            }
          )
          continue
        }
        await this.dbDao.insertRecords(client, 'd4l_dd_studies', this.postgres_database_schema, columns, data)
      }

      await client.query('COMMIT')

      if (this.env !== 'TEST' && this.env !== 'DEVELOPMENT') {
        //Take backup in Swift
        const container = await createSwiftContainer()

        //Upload each file to the container
        for (const file of files) {
          const src = file.buffer.toString('utf-8')
          try {
            await createSwiftObjects(container, `PHDP\\${file.originalname}`, src, true, {
              fieldname: file.fieldname,
              totalNumberOfFragments
            })
          } catch (e: any) {
            this.logger.debug(e.message)
          }
        }
      }

      if (malformedJsonDetected) {
        res.send(`PHDP donations inserted with error: ${malformedJsonErrorReason}`)
      } else {
        res.send('PHDP donations inserted successfully')
      }
    } catch (e) {
      await client.query('ROLLBACK')
      next(e)
    } finally {
      await this.dbDao.closeConnection(client)
    }
  }

  ingestRKIDonations = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const database = (<any>req)._dbName
    const config = {
      ...this.postgres_config,
      ...this.postgres_credentials[database],
      database
    }
    const client = await this.dbDao.openConnection(config)

    const files = req.body.files
    const contextIdentifier = generateUUID()
    const totalNumberOfFragments = files.length
    const columns = [
      'text',
      'alp_id',
      'encrypted_text',
      'http_context_identifier',
      'http_multipart_fragments_sequence_number',
      'http_multipart_fragments_total_number',
      'record_id',
      'donation_from'
    ]

    const malformedJsonErrorReason = 'Malformed json object detected by study data donation api'
    let malformedJsonDetected = false

    try {
      await client.query('BEGIN')

      for (const [index, file] of files.entries()) {
        const text = file.buffer.toString()
        const data: any = {
          text,
          alp_id: file.fieldname,
          record_id: file.originalname,
          encrypted_text: '',
          http_context_identifier: contextIdentifier,
          http_multipart_fragments_sequence_number: index + 1,
          http_multipart_fragments_total_number: totalNumberOfFragments,
          donation_from: 'ingestion-svc'
        }

        if (text.length > 0) {
          this.logger.debug(`Request Body: ${text}`)
        }
        if (text.length > 0 && !isValidJson(text)) {
          malformedJsonDetected = true

          await this.dbDao.insertRecords(
            client,
            'd4l_dd_studies_with_error',
            this.postgres_database_schema,
            [...columns, 'error_reason'],
            {
              ...data,
              error_reason: malformedJsonErrorReason
            }
          )
          continue
        }
        await this.dbDao.insertRecords(client, 'd4l_dd_studies', this.postgres_database_schema, columns, data)
      }

      await client.query('COMMIT')

      if (this.env !== 'TEST' && this.env !== 'DEVELOPMENT') {
        //Take backup in Swift
        const container = await createSwiftContainer()
        for (const file of files) {
          const src = file.buffer.toString('utf-8')
          try {
            await createSwiftObjects(container, `RKI\\${file.originalname}`, src, true, {
              fieldname: file.fieldname,
              totalNumberOfFragments
            })
            console.log('Uploaded to Swift storage')
          } catch (e: any) {
            this.logger.debug(e.message)
          }
        }
      }

      if (malformedJsonDetected) {
        res.send(`RKI donation inserted with error: ${malformedJsonErrorReason}`)
      } else {
        res.send('RKI donation inserted successfully')
      }
    } catch (e) {
      await client.query('ROLLBACK')
      next(e)
    } finally {
      await this.dbDao.closeConnection(client)
    }
  }

  ingestRKIDonationsFhirBundle = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    let client: any
    try {
      const database = (<any>req)._dbName
      let config = { ...this.postgres_config, ...this.postgres_credentials[database], database }
      client = await this.dbDao.openConnection(config)

      this.logger.debug(`Request Body: ${JSON.stringify(req.body)}`)
      await this.dbDao.insertRecords(client, 'd4l_dd_studies_with_bundle', this.postgres_database_schema, ['text'], {
        text: req.body
      })
      await client.query('COMMIT')
      //Take backup in Swift
      if (this.env !== 'TEST' && this.env !== 'DEVELOPMENT') {
        let container = await createSwiftContainer()

        if (container !== undefined && container !== null)
          await createSwiftObjects(
            container,
            `RKI\\RKI_FHIR_Bundle-${new Date().valueOf().toString()}.txt`,
            JSON.stringify(req.body),
            false
          )
        else this.logger.error('Error creating Swift container')
      }
      res.send('RKI donation inserted successfully')
    } catch (e: any) {
      this.logger.error(e.message)
      this.logger.error(e.stack)
      await client.query('ROLLBACK')
      next(e.message)
    } finally {
      await this.dbDao.closeConnection(client)
    }
  }
}
