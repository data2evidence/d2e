import { REQUEST } from '@nestjs/core'
import { BadRequestException, Inject, Injectable, Scope } from '@nestjs/common'
import { Request } from 'express'
import { JwtPayload, decode } from 'jsonwebtoken'
import { EntityManager } from 'typeorm'
import { FeatureRepository } from './repository/feature.repository'
import { createLogger } from '../logger'
import { IPortalPlugin, IFeatureUpdateDto } from '../types'
import { env } from '../env'
import { TransactionRunner } from '../common/data-source/transaction-runner'

@Injectable({ scope: Scope.REQUEST })
export class FeatureService {
  private readonly NON_PLUGIN_FEATURES = [
    {
      featureFlag: 'datasetFilter',
      enabled: false
    },
    {
      featureFlag: 'datasetSearch',
      enabled: false
    }
  ]

  private readonly logger = createLogger(this.constructor.name)
  private readonly userId: string
  private readonly featurePlugins: IPortalPlugin[]
  private readonly validFeatures: string[]

  constructor(
    @Inject(REQUEST) request: Request,
    private readonly transactionRunner: TransactionRunner,
    private readonly featureRepo: FeatureRepository
  ) {
    try {
      const plugins = JSON.parse(env.PORTAL_PLUGINS || '{}')
      this.logger.debug(`Plugins: ${JSON.stringify(plugins)}`)
      const researcherPlugins = plugins.researcher?.filter(p => Boolean(p.featureFlag)) || []
      const systemadminPlugins = plugins.systemadmin?.filter(p => Boolean(p.featureFlag)) || []
      this.featurePlugins = [...researcherPlugins, ...systemadminPlugins]
    } catch (err) {
      this.logger.error(`Error while loading plugin config: ${err}`)
      throw new Error('Error while loading plugin config in TenantService')
    }

    const pluginFeatureFlags: string[] = []
    this.featurePlugins.forEach(f => {
      if (f.enabled) {
        pluginFeatureFlags.push(f.featureFlag)
      }
      f.children?.forEach(childPlugin => {
        if (childPlugin.enabled) {
          pluginFeatureFlags.push(childPlugin.featureFlag)
        }
      })
    })

    this.validFeatures = [...this.NON_PLUGIN_FEATURES.map(f => f.featureFlag), ...pluginFeatureFlags]

    const token = decode(request.headers['authorization'].replace(/bearer /i, '')) as JwtPayload
    this.userId = token.sub
  }

  async getFeatures() {
    const savedFeatures = (await this.featureRepo.getFeatures()).filter(f => this.validFeatures.includes(f.feature))

    const defaultNonPlugins = this.NON_PLUGIN_FEATURES.filter(
      f => !savedFeatures.map(s => s.feature).includes(f.featureFlag)
    )

    const defaultEnabledPluginFlags = this.validFeatures.filter(
      featureFlag =>
        !savedFeatures.map(s => s.feature).includes(featureFlag) &&
        !defaultNonPlugins.map(s => s.featureFlag).includes(featureFlag)
    )

    return [
      ...savedFeatures.map(f => ({
        feature: f.feature,
        isEnabled: f.isEnabled
      })),
      ...defaultNonPlugins.map(f => ({
        feature: f.featureFlag,
        isEnabled: f.enabled
      })),
      ...defaultEnabledPluginFlags.map(featureFlag => ({
        feature: featureFlag,
        isEnabled: true
      }))
    ]
  }

  async setFeature(featureUpdateDto: IFeatureUpdateDto) {
    const setFeatureFn = async (entityMgr: EntityManager, featureUpdateDto: IFeatureUpdateDto) => {
      const result: { id: number }[] = []
      for (const feat of featureUpdateDto.features) {
        if (!this.validFeatures.includes(feat.feature)) {
          throw new BadRequestException(`Invalid feature flag: ${feat.feature}`)
        }

        const entity = await this.featureRepo.getFeature(feat.feature)
        if (entity) {
          this.logger.info(`Updating feature ${feat.feature} to ${feat.isEnabled ? 'enabled' : 'disabled'}`)
          entity.isEnabled = feat.isEnabled
          result.push(await this.featureRepo.updateFeature(entityMgr, entity.id, this.addOwner(entity)))
        } else {
          this.logger.info(`Creating feature ${feat.feature} to ${feat.isEnabled ? 'enabled' : 'disabled'}`)
          result.push(await this.featureRepo.insertFeature(entityMgr, this.addOwner(feat, true)))
        }
      }

      return { result }
    }
    return this.transactionRunner.run(setFeatureFn, featureUpdateDto)
  }

  private addOwner<T>(object: T, isNewEntity = false) {
    if (isNewEntity) {
      return {
        ...object,
        createdBy: this.userId,
        modifiedBy: this.userId
      }
    }
    return {
      ...object,
      modifiedBy: this.userId
    }
  }
}
