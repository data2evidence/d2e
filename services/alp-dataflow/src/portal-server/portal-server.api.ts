import { AxiosRequestConfig } from 'axios'
import { Injectable, InternalServerErrorException, Inject, Scope } from '@nestjs/common'
import { HttpService } from '@nestjs/axios'
import { REQUEST } from '@nestjs/core'
import { firstValueFrom, map } from 'rxjs'
import { Agent } from 'https'
import { env } from '../env'
import { createLogger } from '../logger'

@Injectable({ scope: Scope.REQUEST })
export class PortalServerAPI {
  private readonly jwt: string
  private readonly url: string
  private readonly httpsAgent: Agent
  private readonly logger = createLogger(this.constructor.name)

  constructor(@Inject(REQUEST) request: Request, private readonly httpService: HttpService) {
    this.jwt = request.headers['authorization']
    if (env.PORTAL_SERVER_API_URL) {
      this.url = env.PORTAL_SERVER_API_URL
      this.httpsAgent = new Agent({
        rejectUnauthorized: this.isAuthorized(),
        ca: this.isAuthorized() ? env.SSL_CA_CERT : undefined
      })
    } else {
      throw new Error('No url is set for PortalServerAPI')
    }
  }

  isAuthorized(): boolean {
    return this.url.startsWith('https://localhost:') || this.url.startsWith('https://alp-minerva-gateway-')
      ? false
      : true
  }

  async getDatasetReleaseById(releaseId: string): Promise<{ releaseDate: string }> {
    const errorMessage = 'Error while getting dataset release by id'
    try {
      const options = await this.createOptions()
      const url = `${this.url}dataset/release/${releaseId}`
      const obs = this.httpService.get(url, options)
      return firstValueFrom(obs.pipe(map(result => result.data)))
    } catch (error) {
      this.logger.error(`${errorMessage}: ${error}`)
      throw new InternalServerErrorException(errorMessage)
    }
  }

  async getDataset(datasetId: string) {
    const errorMessage = 'Error while getting dataset by datasetId'
    try {
      const options = await this.createOptions()
      const url = `${this.url}dataset/${datasetId}`
      const obs = this.httpService.get(url, options)
      return firstValueFrom(obs.pipe(map(result => result.data)))
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
