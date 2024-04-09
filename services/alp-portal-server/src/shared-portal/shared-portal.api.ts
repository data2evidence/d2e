import { AxiosRequestConfig } from 'axios'
import { BadRequestException, InternalServerErrorException, Inject, Injectable, Scope } from '@nestjs/common'
import { HttpService } from '@nestjs/axios'
import { REQUEST } from '@nestjs/core'
import { Request } from 'express'
import { firstValueFrom, map } from 'rxjs'
import { Agent } from 'https'
import { env } from '../env'
import { createLogger } from '../logger'
import { query, QueryType, QueryAction } from './query'
import { IStudyDetailDto, IDatasetMetadataUpdateDto, ISystemNameDto, IDatasetReleaseDto, IStudyDto } from '../types'

@Injectable({ scope: Scope.REQUEST })
export class SharedPortalApi {
  private readonly jwt: string
  private readonly url: string
  private readonly httpsAgent: Agent
  private readonly logger = createLogger(this.constructor.name)

  constructor(@Inject(REQUEST) request: Request, protected readonly httpService: HttpService) {
    this.jwt = request.headers['authorization']
    if (env.PORTAL_API_URL) {
      this.url = env.PORTAL_API_URL
      this.httpsAgent = new Agent({
        rejectUnauthorized: this.isAuthorized(),
        ca: this.isAuthorized() ? env.PORTAL_SERVER_CA_CERT : null
      })
    } else {
      throw new Error('No url is set for PortalAPI')
    }
  }

  isAuthorized(): boolean {
    return this.url.startsWith('https://localhost:') || this.url.startsWith('https://alp-minerva-gateway-')
      ? false
      : true
  }

  async getStudy(id: string) {
    const data = this.buildRequestBody(query.GET_STUDY, { id })
    const result = await this.executeQuery(data, this.generateErrorMessage(QueryType.GET_STUDY, id))

    return result.study
  }

  async getStudies(role?: string) {
    if (role === 'systemAdmin') {
      const data = this.buildRequestBody(query.GET_STUDIES_AS_SYSTEM_ADMIN)
      const result = await this.executeQuery(data, this.generateErrorMessage(QueryType.GET_STUDIES_AS_SYSTEM_ADMIN))
      return result.studiesAsSystemAdmin
    }
    const data = this.buildRequestBody(query.GET_STUDIES)
    const result = await this.executeQuery(data, this.generateErrorMessage(QueryType.GET_STUDIES))
    return result.studies
  }

  async createStudy(datasetDto: IStudyDto) {
    const data = this.buildRequestBody(query.CREATE_STUDY, { datasetDto })
    const result = await this.executeQuery(data, this.generateErrorMessage(QueryType.CREATE_STUDY))
    return result.createStudy
  }

  async createRelease(datasetReleaseDto: IDatasetReleaseDto) {
    const data = this.buildRequestBody(query.CREATE_HANA_RELEASE, {
      input: {
        studyId: datasetReleaseDto.datasetId,
        name: datasetReleaseDto.name,
        releaseDate: datasetReleaseDto.releaseDate
      }
    })
    const result = await this.executeQuery(data, this.generateErrorMessage(QueryType.CREATE_HANA_RELEASE))
    return result.createHanaRelease
  }

  async offboardStudy(id: string) {
    const data = this.buildRequestBody(query.OFFBOARD_STUDY, { input: { studyId: id } })
    const result = await this.executeQuery(data, this.generateErrorMessage(QueryType.OFFBOARD_STUDY))
    return result.offboardStudy
  }

  async copyStudy(datasetDto: IStudyDto) {
    const data = this.buildRequestBody(query.COPY_STUDY, { datasetDto })
    const result = await this.executeQuery(data, this.generateErrorMessage(QueryType.COPY_STUDY))
    return result.copyStudy
  }

  async createStudyDetail(datasetDetailDto: IStudyDetailDto) {
    const data = this.buildRequestBody(query.CREATE_STUDY_DETAIL, { datasetDetailDto })
    const result = await this.executeQuery(
      data,
      this.generateErrorMessage(QueryType.CREATE_STUDY_DETAIL, datasetDetailDto.studyId)
    )
    return result.createStudyDetail
  }

  async updateStudyDetail(datasetDetailDto: IStudyDetailDto) {
    const data = this.buildRequestBody(query.UPDATE_STUDY_DETAIL, { datasetDetailDto })
    const result = await this.executeQuery(
      data,
      this.generateErrorMessage(QueryType.UPDATE_STUDY_DETAIL, datasetDetailDto.studyId)
    )
    return result.updateStudyDetail
  }

  async updateStudyMetadata(datasetMetadataDto: IDatasetMetadataUpdateDto) {
    const data = this.buildRequestBody(query.UPDATE_STUDY_METADATA, { datasetMetadataDto })
    const result = await this.executeQuery(
      data,
      this.generateErrorMessage(QueryType.UPDATE_STUDY_METADATA, datasetMetadataDto.id)
    )
    return result.updateStudyMetadata
  }

  async getSystemFeatures(systemNameDto: ISystemNameDto) {
    const data = this.buildRequestBody(query.GET_SYSTEM_FEATURES, { systemNameDto })
    const result = await this.executeQuery(
      data,
      this.generateErrorMessage(QueryType.GET_SYSTEM_FEATURES, systemNameDto)
    )
    return result.getSystemAllFeatures
  }

  private async createOptions(): Promise<AxiosRequestConfig> {
    return {
      headers: {
        Authorization: this.jwt
      },
      httpsAgent: this.httpsAgent
    }
  }

  private async executeQuery(data: object, errorMessagePrefix: string) {
    const options = await this.createOptions()
    const obs = this.httpService.post(this.url, data, options)
    const result = await firstValueFrom(obs.pipe(map(result => result.data)))
    if (result.errors) {
      this.handleErrors(result.errors, errorMessagePrefix)
    }
    return result.data
  }

  private handleErrors(errors, errorMessagePrefix) {
    if (errors.length === 1) {
      const error = errors[0]
      const errorMessage = error.message
      this.logger.error(`${errorMessagePrefix}: ${errorMessage}`)
      if (['BAD_REQUEST', 'BAD_USER_INPUT'].includes(error.extensions.code)) {
        throw new BadRequestException(errorMessage)
      }
      throw new InternalServerErrorException(errorMessage)
    }
    this.logger.error(`${errorMessagePrefix}: ${errors}`)
    throw new InternalServerErrorException(errors)
  }

  private buildRequestBody(query, variables?) {
    return {
      query,
      variables
    }
  }

  private generateErrorMessage(queryType: string, params?: string | object) {
    const message = `Error while ${QueryAction[queryType]}`
    if (params) {
      return `${message}: ${typeof params === 'string' ? params : JSON.stringify(params)}`
    }
    return message
  }
}
