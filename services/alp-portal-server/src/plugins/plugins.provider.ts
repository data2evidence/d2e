import { REQUEST } from '@nestjs/core'
import { HttpModule, HttpService } from '@nestjs/axios'
import { Module, Scope } from '@nestjs/common'
import { Agent } from 'https'
import { firstValueFrom, map } from 'rxjs'

import { env } from '../env'

export const PluginsProvider = {
  provide: 'PLUGINS_JSON_PROVIDER',
  useFactory: async (request, httpService: HttpService) => {
    try {
      const res = httpService.get(`${env.TREX_API_URL}/portal/plugin.json`, {
        headers: {
          Authorization: request.headers['authorization']
        },
        httpsAgent: new Agent({
          rejectUnauthorized: true,
          ca: env.SSL_CA_CERT
        })
      })
      return await firstValueFrom(res.pipe(map(result => result.data)))
    } catch (error) {
      throw error
    }
  },
  scope: Scope.REQUEST,
  inject: [REQUEST, HttpService]
}

@Module({
  imports: [HttpModule],
  providers: [PluginsProvider],
  exports: [PluginsProvider]
})
export class PluginsModule {}
