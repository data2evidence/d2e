import { Injectable } from '@danet/core';
import { ITenant } from '../types.d.ts';
@Injectable()
export class TenantService {
  private readonly tenant: ITenant;
  private _env = Deno.env.toObject();

  constructor() {
    this.tenant = {
      id: this._env.TENANT_ID,
      name: this._env.TENANT_NAME,
      system: this._env.SYSTEM_NAME
    };
  }

  getTenant() {
    return this.tenant;
  }

  getTenants() {
    return [this.tenant];
  }

  getMyTenants() {
    return [this.tenant];
  }
}