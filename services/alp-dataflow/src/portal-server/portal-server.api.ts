import { AxiosRequestConfig } from 'axios'
import { Injectable, InternalServerErrorException, Inject, Scope } from '@nestjs/common'
import { HttpService } from '@nestjs/axios'
import { REQUEST } from '@nestjs/core'
import { firstValueFrom, map } from 'rxjs'
import { Agent } from 'https'
import { env, services } from '../env'
import { createLogger } from '../logger'

@Injectable({ scope: Scope.REQUEST })
export class PortalServerAPI {
  private readonly jwt: string
  private readonly url: string
  private readonly httpsAgent: Agent
  private readonly logger = createLogger(this.constructor.name)

  constructor(@Inject(REQUEST) request: Request, private readonly httpService: HttpService) {
    this.jwt = request.headers['authorization']
    if (services.portalServer) {
      this.url = services.portalServer
      this.httpsAgent = new Agent({
        rejectUnauthorized: true,
        ca: env.SSL_CA_CERT
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
      const url = `${this.url}/dataset/release/${releaseId}`
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
      const url = `${this.url}/dataset/${datasetId}`
      const obs = this.httpService.get(url, options)
      return firstValueFrom(obs.pipe(map(result => result.data)))
    } catch (error) {
      this.logger.error(`${errorMessage}: ${error}`)
      throw new InternalServerErrorException(errorMessage)
    }
  }

  async deleteDeploymentFiles(deploymentFolderPath: string) {
    const errorMessage = 'Error while deleting deployment files'
    try {
      const options = await this.createOptions()
      const url = `${this.url}/prefect-deployment?filePath=${deploymentFolderPath}&bucketName=${env.ADHOC_DEPLOYMENT_FLOWS_BUCKET_NAME}`
      this.logger.info(url)
      const obs = this.httpService.delete(url, options)
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
