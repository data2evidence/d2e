import { env } from '../env'
// import { Dataset } from "../types";
import https from 'https'
import axios, { AxiosRequestConfig } from 'axios'

interface CreateBookmarkDto {
  serviceName: string
  serviceArtifact: any
}
interface UpdateBookmarkDto {
  serviceName: string
  serviceArtifact: any
}

export class PortalAPI {
  private readonly baseURL: string
  private readonly token: string
  private readonly userId: string
  private readonly logger = console
  private readonly httpsAgent: https.Agent

  constructor(token: string, userId: string) {
    this.userId = userId || ''
    this.token = token
    if (!token) {
      throw new Error('No token passed for Portal API!')
    }
    if (env.SERVICE_ROUTES.portalServer) {
      this.baseURL = env.SERVICE_ROUTES.portalServer
      this.httpsAgent = new https.Agent({
        rejectUnauthorized: true,
      })
    } else {
      throw new Error('No url is set for PortalAPI')
    }
  }

  private async getRequestConfig() {
    let options: AxiosRequestConfig = {
      headers: {
        Authorization: this.token,
      },
      httpsAgent: this.httpsAgent,
    }

    return options
  }

  async getBookmarks(): Promise<any> {
    try {
      const options = await this.getRequestConfig()
      const url = `${this.baseURL}/user-artifact/bookmarks/list`
      console.log({ url })

      const result = await axios.get(url, options)
      console.log({ result })

      return result.data
    } catch (error) {
      console.log(error)
      this.logger.error(`Error while getting user artifacts for Bookmarks`)
      throw new Error(`Error while getting user artifacts for Bookmarks`)
    }
  }

  async createBookmark(input: CreateBookmarkDto): Promise<any> {
    try {
      const options = await this.getRequestConfig()
      const url = `${this.baseURL}/user-artifact`
      const result = await axios.post(url, input, options)
      return result.data
    } catch (error) {
      console.log(error)
      this.logger.error(`Error while creating Bookmark`)
      throw new Error(`Error while creating Bookmark`)
    }
  }

  async updateBookmark(input: UpdateBookmarkDto): Promise<any> {
    try {
      const options = await this.getRequestConfig()
      const url = `${this.baseURL}/user-artifact/bookmark`
      const result = await axios.put(url, input, options)
      return result.data
    } catch (error) {
      console.log(error)
      this.logger.error(`Error while updating Bookmark`)
      throw new Error(`Error while updating Bookmark`)
    }
  }

  async deleteBookmark(userId: string, bookmarkId: string): Promise<any> {
    try {
      const options = await this.getRequestConfig()
      const url = `${this.baseURL}/user-artifact/${userId}/bookmark/${bookmarkId}`
      const result = await axios.delete(url, options)
      return result.data
    } catch (error) {
      console.log(error)
      this.logger.error(`Error while deleting Bookmark`)
      throw new Error(`Error while deleting Bookmark`)
    }
  }
}
