import { Injectable } from '@danet/core';
import { env } from '../env.ts';
import { createLogger } from '../logger.ts';
import { IPortalPlugin } from '../types.d.ts';

@Injectable()
export class SystemService {
  private readonly logger = createLogger(this.constructor.name);
  private readonly systemAdminPlugins: IPortalPlugin[];

  constructor() {
    try {
      const plugins = JSON.parse(env.PORTAL_PLUGINS || '{}')
      this.systemAdminPlugins = plugins.systemadmin || []
      this.logger.info(`Plugins: ${JSON.stringify(plugins)}`)
    } catch (err) {
      this.logger.error(`Error while loading plugin config: ${err}`)
      throw new Error('Error while loading plugin config in StandaloneSystemService')
    }
  }

  getSystemFeatures() {
    const enabledFeatures = this.systemAdminPlugins.filter(p => p.enabled || false)
    return enabledFeatures.map(f => {
      return { feature: f.featureFlag, enabled: f.enabled }
    })
  }
}
