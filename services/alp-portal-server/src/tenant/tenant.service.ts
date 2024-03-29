import { Injectable } from '@nestjs/common'
import { ITenant } from '../types'
import { env } from '../env'

@Injectable()
export class TenantService {
  private readonly tenant: ITenant

  constructor() {
    this.tenant = {
      id: env.TENANT_ID,
      name: env.TENANT_NAME,
      system: env.SYSTEM_NAME
    }
  }
  getTenant() {
    return this.tenant
  }
  getTenants() {
    return [this.tenant]
  }
  getMyTenants() {
    return [this.tenant]
  }
}
