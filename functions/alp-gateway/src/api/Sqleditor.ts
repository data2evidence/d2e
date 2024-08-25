import { env, services } from '../env'
import { AxiosRequestConfig } from 'axios'
import { createLogger } from '../Logger'
import axios from 'axios'
import jwt from 'jsonwebtoken'

interface SqleditorToken {
  access: string
  refresh: string
}

export class SqleditorAPI {
  private readonly baseURL: string
  private readonly logger = createLogger(this.constructor.name)
  private token: SqleditorToken

  constructor() {
    if (services.sqlEditor) {
      this.baseURL = services.sqlEditor
    } else {
      //throw new Error('No url is set for SqleditorAPI')
    }
  }

  private async getRequestConfig() {
    let options: AxiosRequestConfig = {}

    options = {
      headers: {
        'Content-Type': 'application/json'
      }
    }

    return options
  }

  async fetchUserToken() {
    const data = {
      username: env.SQLEDITOR__TECHNICAL_USERNAME,
      password: env.SQLEDITOR__TECHNICAL_USER_PASSWD
    }
    const url = `${this.baseURL}/api/token/auth/`
    const result = await axios.post(url, data, this.getRequestConfig() as AxiosRequestConfig)
    return result.data
  }

  async isTokenExp(token) {
    const decodedToken = jwt.decode(token) as jwt.JwtPayload
    return decodedToken?.exp && decodedToken.exp < Date.now() / 1000
  }

  async refreshToken(token) {
    const data = {
      refresh: token
    }
    const url = `${this.baseURL}/api/token/refresh/`
    const options = await this.getRequestConfig()
    const result = await axios.post(url, data, options)
    return result.data.access
  }

  async getAccessToken() {
    try {
      if (!this.token) {
        this.token = await this.fetchUserToken()
      } else if (await this.isTokenExp(this.token.access)) {
        this.logger.debug(`Sqleditor expired token: ${JSON.stringify(this.token)}`)
        this.token.access = await this.refreshToken(this.token.refresh)
      }
      return this.token.access
    } catch (error) {
      this.logger.error(`Error when generating token: ${error}`)
    }
  }
}
