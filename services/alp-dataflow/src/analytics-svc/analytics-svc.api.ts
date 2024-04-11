import { AxiosRequestConfig } from 'axios'
import { Injectable, InternalServerErrorException, Inject, Scope } from '@nestjs/common'
import { HttpService } from '@nestjs/axios'
import { REQUEST } from '@nestjs/core'
import { firstValueFrom, map } from 'rxjs'
import { Agent } from 'https'
import { env } from '../env'
import { createLogger } from '../logger'

@Injectable({ scope: Scope.REQUEST })
export class AnalyticsSvcAPI {
  private readonly jwt: string
  private readonly url: string
  private readonly httpsAgent: Agent
  private readonly logger = createLogger(this.constructor.name)

  constructor(@Inject(REQUEST) request: Request, private readonly httpService: HttpService) {
    this.jwt = request.headers['authorization']
    if (env.ANALYTICS_SVC_API_URL) {
      this.url = env.ANALYTICS_SVC_API_URL
      this.httpsAgent = new Agent({
        rejectUnauthorized: this.isAuthorized(),
        ca: this.isAuthorized() ? env.DATAFLOW_CA_CERT : undefined
      })
    } else {
      throw new Error('No url is set for AnalyticsSvcAPI')
    }
  }

  isAuthorized(): boolean {
    return this.url.startsWith('https://localhost:') || this.url.startsWith('https://alp-minerva-gateway-')
      ? false
      : true
  }

  async getDataCharacterizationResults(
    databaseCode: string,
    resultsSchema: string,
    sourceKey: string,
    vocabSchema: string,
    datasetId: string
  ) {
    const errorMessage = 'Error while getting data characterization results'
    try {
      this.logger.info(`vocabSchema ${vocabSchema} datasetId ${datasetId}`)
      const options = await this.createOptions()
      //add studyid
      const url = `${
        this.url
      }api/services/data-characterization/${databaseCode}/${vocabSchema}/${resultsSchema.toLowerCase()}/${sourceKey}?studyId=${datasetId}`
      const obs = this.httpService.get(url, options)
      return await firstValueFrom(obs.pipe(map(result => result.data)))
    } catch (error) {
      this.logger.error(`${errorMessage}: ${error}`)
      throw new InternalServerErrorException(errorMessage)
    }
  }

  async getDataCharacterizationResultsDrilldown(
    databaseCode: string,
    resultsSchema: string,
    sourceKey: string,
    conceptId: string,
    vocabSchema: string,
    datasetId: string
  ) {
    const errorMessage = 'Error while getting data characterization results drilldown'
    try {
      const options = await this.createOptions()
      const url = `${
        this.url
      }api/services/data-characterization/${databaseCode}/${vocabSchema}/${resultsSchema.toLowerCase()}/${sourceKey}/${conceptId}?studyId=${datasetId}`
      const obs = this.httpService.get(url, options)
      return await firstValueFrom(obs.pipe(map(result => result.data)))
    } catch (error) {
      this.logger.error(`${errorMessage}: ${error}`)
      throw new InternalServerErrorException(errorMessage)
    }
  }

  async getCdmVersion(dialect: string, databaseCode: string, schema: string) {
    const errorMessage = 'Error while getting cdm version'
    try {
      const options = await this.createOptions()
      const url = `${this.url}api/services/alpdb/${dialect}/database/${databaseCode}/cdmversion/schema/${schema}`
      const obs = this.httpService.get(url, options)
      return await firstValueFrom(obs.pipe(map(result => result.data)))
    } catch (error) {
      this.logger.error(`${errorMessage}: ${error}`)
      throw new InternalServerErrorException(errorMessage)
    }
  }

  async getVocabSchemaFromCdmSchema(dialect: string, databaseCode: string, schema: string) {
    const errorMessage = 'Error while getting vocab schema from cdm schema'
    try {
      const options = await this.createOptions()
      const url = `${this.url}api/services/alpdb/${dialect}/database/${databaseCode}/vocabSchema/schema/${schema}`
      const obs = this.httpService.get(url, options)
      return await firstValueFrom(obs.pipe(map(result => result.data)))
    } catch (error) {
      this.logger.error(`${errorMessage}: ${error}`)
      throw new InternalServerErrorException(errorMessage)
    }
  }

  private async createOptions(): Promise<AxiosRequestConfig> {
    return {
      headers: {
        Authorization: this.jwt
      },
      httpsAgent: this.httpsAgent
    }
  }
}
