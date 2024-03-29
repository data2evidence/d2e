import { Controller, Get } from '@nestjs/common'
import { TenantService } from './tenant.service'

@Controller()
export class TenantController {
  constructor(private readonly tenantService: TenantService) {}

  @Get('list')
  async getTenants() {
    return await this.tenantService.getTenants()
  }

  @Get('list/me')
  async getMyTenants() {
    return await this.tenantService.getMyTenants()
  }
}
