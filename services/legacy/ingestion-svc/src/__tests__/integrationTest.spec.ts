import http from 'http'

import { mock_bi_events } from './data/integrationTest/mock_bi_events'
import { mock_rki } from './data/integrationTest/mock_rki'
import { mock_phdp } from './data/integrationTest/mock_phdp'
import { mock_s4h } from './data/integrationTest/mock_s4h'
import { mock_rki_bundle } from './data/integrationTest/mock_rki_bundle'

const app = require('../app')
const supertest = require('supertest')

const server = http.createServer(app)
server.setTimeout(300000)
const api = supertest(server)

let ingestionBasePath: string
let dialect: string
let tenantDatabase: string
let fhirIngestionSchema: string

beforeAll(done => {
  ingestionBasePath = 'alp-ingestion'
  dialect = 'pg'
  tenantDatabase = 'alp'
  fhirIngestionSchema = 'fhir_data'
  done()
}, 600000)

describe('POST - API successful scenario integration test', () => {
  test('[Success] Ingest BI Events', async () => {
    const data = mock_bi_events.data
    const response = await api.post(`/${ingestionBasePath}/${dialect}/data-donation/bi-events`).send({ data: data })
    expect(response.text).toEqual('BI Records inserted successfully')
  }, 10000)

  test('[Success] Ingest RKI Donations', async () => {
    const patientUUID = mock_rki.patientUUID
    const data = mock_rki.data
    const response = await api
      .post(`/${ingestionBasePath}/${dialect}/data-donation/rki/explore`)
      .attach(patientUUID, Buffer.from(JSON.stringify(data)), `${patientUUID}.json`)

    expect(response.text).toEqual('RKI donation inserted successfully')
  }, 10000)

  test('[Success] Ingest RKI Donations with malformed JSON', async () => {
    const patientUUID = mock_rki.patientUUID
    const dataBuffer = Buffer.from(JSON.stringify(mock_rki.data))
    const malformedData = dataBuffer.subarray(0, dataBuffer.length - 1)
    const response = await api
      .post(`/${ingestionBasePath}/${dialect}/data-donation/rki/explore`)
      .attach(patientUUID, malformedData, `${patientUUID}.json`)
    expect(response.text).toEqual(
      'RKI donation inserted with error: Malformed json object detected by study data donation api'
    )
  }, 10000)

  test('[Success] Ingest RKI Donations with FHIR Bundle', async () => {
    const resourceType = mock_rki_bundle.resourceType
    const type = mock_rki_bundle.type
    const entry = mock_rki_bundle.entry
    const response = await api
      .post(`/${ingestionBasePath}/${dialect}/data-donation/rki/explore/fhirBundle`)
      .send({ resourceType: resourceType, type: type, entry: entry })

    expect(response.text).toEqual('RKI donation inserted successfully')
  }, 10000)

  test('[Success] Ingest PHDP Donations', async () => {
    const studyId = mock_phdp.studyId
    const encryptedText = mock_phdp.encryptedText
    const response = await api
      .post(`/${ingestionBasePath}/${dialect}/data-donation/${studyId}`)
      .attach(studyId, Buffer.from(encryptedText, 'base64'), `${studyId}.json`)

    expect(response.text).toEqual('PHDP donations inserted successfully')
  }, 10000)

  // TODO: implement this test case
  // test('[Success] Ingest PHDP Donations with malformed JSON', async () => {
  //   const studyId = mock_phdp.studyId
  //   const encryptedText = mock_phdp.encryptedText
  //   const dataBuffer = Buffer.from(encryptedText, 'base64')
  //   const malformedData = // TODO: need ciphertext that decrypts to valid UTF-8 string that contains malformed JSON
  //   const response = await api
  //     .post(`/${ingestionBasePath}/${dialect}/data-donation/${studyId}`)
  //     .attach(studyId, malformedData, `${studyId}.json`)

  //   expect(response.text).toEqual(
  //     'PHDP donations inserted with error: Malformed json object detected by study data donation api'
  //   )
  // }, 10000)

  test('[Success] Ingest S4H Donations', async () => {
    const resourceType = mock_s4h.resourceType
    const type = mock_s4h.type
    const entry = mock_s4h.entry
    const response = await api
      .post(`/${ingestionBasePath}/${dialect}/data-donation/s4h`)
      .send({ resourceType: resourceType, type: type, entry: entry })

    expect(response.text).toEqual('S4H donation inserted successfully')
  }, 10000)
})

describe('POST - API failure scenario integration test', () => {
  test('[Failure due to missing data] Ingest BI Events', async () => {
    const expectedError = {
      errors: [{ msg: "Cannot find 'data' key in the request body.", param: 'data', location: 'body' }]
    }

    const response = await api.post(`/${ingestionBasePath}/${dialect}/data-donation/bi-events`).send({})
    expect(response.body).toEqual(expectedError)
  }, 10000)

  test('[Failure due to missing form-data] Ingest RKI Donations', async () => {
    const expectedError = { message: 'Request has no files (form-data)' }
    const response = await api.post(`/${ingestionBasePath}/${dialect}/data-donation/rki/explore`)

    expect(response.body).toEqual(expectedError)
  }, 10000)

  test('[Failure due to missing data] Ingest RKI FHIR Bundle Donations', async () => {
    const expectedError = {
      errors: [
        { msg: "Cannot find 'resourceType' key in the request body.", param: 'resourceType', location: 'body' },
        { msg: "Cannot find 'type' key in the request body.", param: 'type', location: 'body' },
        { msg: "Cannot find 'entry' key in the request body.", param: 'entry', location: 'body' }
      ]
    }

    const response = await api.post(`/${ingestionBasePath}/${dialect}/data-donation/rki/explore/fhirBundle`).send({})
    expect(response.body).toEqual(expectedError)
  }, 10000)

  test('[Failure due to missing form-data] Ingest PHDP Donations', async () => {
    const expectedError = { message: 'Request has no files (form-data)' }
    const studyId = mock_phdp.studyId
    const response = await api.post(`/${ingestionBasePath}/${dialect}/data-donation/${studyId}`)

    expect(response.body).toEqual(expectedError)
  }, 10000)

  test('[Failure due to attaching more than 20 files] Ingest RKI Donations', async () => {
    const expectedError = { message: 'Request can only accept 20 or fewer files' }
    const patientUUID = mock_rki.patientUUID
    const data = mock_rki.data
    const jsonDataBuffer = Buffer.from(JSON.stringify(data))
    const fileName = `${patientUUID}.json`
    const response = await api
      .post(`/${ingestionBasePath}/${dialect}/data-donation/rki/explore`)
      .attach(patientUUID, jsonDataBuffer, fileName)
      .attach(patientUUID, jsonDataBuffer, fileName)
      .attach(patientUUID, jsonDataBuffer, fileName)
      .attach(patientUUID, jsonDataBuffer, fileName)
      .attach(patientUUID, jsonDataBuffer, fileName)
      .attach(patientUUID, jsonDataBuffer, fileName)
      .attach(patientUUID, jsonDataBuffer, fileName)
      .attach(patientUUID, jsonDataBuffer, fileName)
      .attach(patientUUID, jsonDataBuffer, fileName)
      .attach(patientUUID, jsonDataBuffer, fileName)
      .attach(patientUUID, jsonDataBuffer, fileName)
      .attach(patientUUID, jsonDataBuffer, fileName)
      .attach(patientUUID, jsonDataBuffer, fileName)
      .attach(patientUUID, jsonDataBuffer, fileName)
      .attach(patientUUID, jsonDataBuffer, fileName)
      .attach(patientUUID, jsonDataBuffer, fileName)
      .attach(patientUUID, jsonDataBuffer, fileName)
      .attach(patientUUID, jsonDataBuffer, fileName)
      .attach(patientUUID, jsonDataBuffer, fileName)
      .attach(patientUUID, jsonDataBuffer, fileName)
      .attach(patientUUID, jsonDataBuffer, fileName)
      .attach(patientUUID, jsonDataBuffer, fileName) // attach 21 files
    expect(response.body).toEqual(expectedError)
  }, 10000)

  test('[Failure due to incorrect encryptedText] Ingest PHDP Donations', async () => {
    const studyId = mock_phdp.studyId
    const IncorrectencryptedText = 'corruptEncryptedText' + mock_phdp.encryptedText

    const response = await api
      .post(`/${ingestionBasePath}/${dialect}/data-donation/${studyId}`)
      .attach(studyId, Buffer.from(IncorrectencryptedText, 'base64'), `${studyId}.json`)

    // Might need to change the return message to something like "Decryption error" instead
    expect(response.text).toEqual('PHDP donations inserted successfully')
  }, 10000)

  test('[Failure due to missing data] Ingest S4H Donations', async () => {
    const expectedError = {
      errors: [
        { msg: "Cannot find 'resourceType' key in the request body.", param: 'resourceType', location: 'body' },
        { msg: "Cannot find 'type' key in the request body.", param: 'type', location: 'body' },
        { msg: "Cannot find 'entry' key in the request body.", param: 'entry', location: 'body' }
      ]
    }

    const response = await api.post(`/${ingestionBasePath}/${dialect}/data-donation/s4h`).send({})
    expect(response.body).toEqual(expectedError)
  }, 10000)
})

afterAll(() => {
  server.close()
})
