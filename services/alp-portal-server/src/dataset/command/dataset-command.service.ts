import { BadRequestException, Inject, Injectable, Optional, Scope } from '@nestjs/common'
import { REQUEST } from '@nestjs/core'
import { Request } from 'express'
import { EntityManager, In } from 'typeorm'
import { JwtPayload, decode } from 'jsonwebtoken'
import { v4 as uuidv4 } from 'uuid'
import { TenantService } from '../../tenant/tenant.service'
import {
  DatasetDetailRepository,
  DatasetAttributeRepository,
  DatasetRepository,
  DatasetTagRepository,
  DatasetReleaseRepository,
  DatasetDashboardRepository
} from '../repository'
import { SharedPortalApi } from '../../shared-portal/shared-portal.api'
import {
  IDatasetAttribute,
  IDatasetDto,
  IDatasetAttributeDto,
  IDatasetReleaseDto,
  IDatasetSnapshotDto,
  IDatasetDetailMetadataUpdateDto,
  IDatasetDetailBaseDto,
  IDatasetDashboardBaseDto,
  IStudyDto
} from '../../types'
import { Dataset, DatasetDetail, DatasetTag } from '../entity'
import { createLogger } from '../../logger'
import { env } from '../../env'
import { TransactionRunner } from '../../common/data-source/transaction-runner'

const isProxy = env.APP_DEPLOY_MODE === 'proxy'
const SWAP_TO = {
  STUDY: ['dataset', 'study'],
  DATASET: ['study', 'dataset']
}

@Injectable({ scope: Scope.REQUEST })
export class DatasetCommandService {
  private readonly userId: string
  private readonly logger = createLogger(this.constructor.name)

  constructor(
    @Inject(REQUEST) request: Request,
    @Optional() private readonly portalApi: SharedPortalApi,
    private readonly transactionRunner: TransactionRunner,
    private readonly tenantService: TenantService,
    private readonly datasetRepo: DatasetRepository,
    private readonly releaseRepo: DatasetReleaseRepository,
    private readonly detailRepo: DatasetDetailRepository,
    private readonly dashboardRepo: DatasetDashboardRepository,
    private readonly attributeRepo: DatasetAttributeRepository,
    private readonly tagRepo: DatasetTagRepository
  ) {
    const token = decode(request.headers['authorization'].replace(/bearer /i, '')) as JwtPayload
    this.userId = token.sub
  }

  async createDataset(datasetDto: IDatasetDto) {
    const createDatasetFn = async (entityMgr: EntityManager, datasetDto: IDatasetDto) => {
      const tenant = this.tenantService.getTenant()
      if (datasetDto.tenantId !== tenant.id) {
        throw new BadRequestException(`Invalid tenantId ${datasetDto.tenantId} provided`)
      }
      const { detail, dashboards, attributes, tags, ...dataset } = datasetDto
      const { id } = dataset

      const entity = this.datasetRepo.create(this.swapVariables<Dataset>(dataset, SWAP_TO.DATASET))
      const result = await this.datasetRepo.insertDataset(entityMgr, this.addOwner(entity, true))

      const detailEntity = this.detailRepo.create({
        id: uuidv4(),
        datasetId: id,
        ...this.addOwner(detail, true)
      })

      await this.detailRepo.insertDetail(entityMgr, detailEntity)

      dashboards.forEach(async dashboard => {
        const dashboardEntity = this.dashboardRepo.create({
          id: uuidv4(),
          datasetId: id,
          ...this.addOwner(dashboard, true)
        })
        await this.dashboardRepo.insertDashboard(entityMgr, dashboardEntity)
      })

      attributes.forEach(async attribute => {
        const attributeEntity = this.attributeRepo.create({
          datasetId: id,
          ...this.addOwner(attribute, true)
        })
        await this.attributeRepo.insertAttribute(entityMgr, attributeEntity)
      })

      tags.forEach(async tag => {
        const tagEntity = this.tagRepo.create({
          datasetId: id,
          name: tag
        })
        await this.tagRepo.insertTag(entityMgr, this.addOwner(tagEntity, true))
      })

      if (isProxy) {
        const studyDto = this.swapVariables<IStudyDto>(dataset, SWAP_TO.STUDY)
        this.logger.info(`Creating dataset in shared portal...`)
        await this.portalApi.createStudy(studyDto)
        this.logger.info(`Successfully created dataset with id ${id} in shared portal`)

        this.swapVariables(detail, SWAP_TO.STUDY)
        this.logger.info(`Creating dataset detail in shared portal... ${JSON.stringify(detail)}`)
        await this.portalApi.createStudyDetail({ ...detail, studyId: id })
        this.logger.info(`Successfully created dataset detail for dataset ${id} in shared portal`)
      }
      return result
    }
    return this.transactionRunner.run(createDatasetFn, datasetDto)
  }

  async createRelease(datasetReleaseDto: IDatasetReleaseDto) {
    const createReleaseFn = async (entityMgr: EntityManager, datasetReleaseDto: IDatasetReleaseDto) => {
      const entity = this.releaseRepo.create(datasetReleaseDto)
      const existingRecord = await this.releaseRepo.getReleaseByDatasetIdAndName(entity.datasetId, entity.name)
      if (existingRecord.length > 0) {
        throw new BadRequestException(`Dataset with release name '${entity.name}' already exists`)
      }
      const result = await this.releaseRepo.insertRelease(entityMgr, this.addOwner(entity, true))

      if (isProxy) {
        this.logger.info(`Creating dataset release in shared portal...`)
        await this.portalApi.createRelease(datasetReleaseDto)
        this.logger.info(`Successfully created dataset with id ${datasetReleaseDto.name} in shared portal`)
      }
      return result
    }
    return this.transactionRunner.run(createReleaseFn, datasetReleaseDto)
  }

  async offboardDataset(id: string) {
    const deleteDatasetFn = async (entityMgr: EntityManager, id: string) => {
      const result = await entityMgr.getRepository(Dataset).delete(id)
      if (result.affected === 0) {
        throw new BadRequestException(`Invalid dataset ID provided: ${id}`)
      } else {
        if (isProxy) {
          this.logger.info(`Deleting dataset in shared portal...`)
          await this.portalApi.offboardStudy(id)
          this.logger.info(`Successfully deleted dataset with id ${id} in shared portal`)
        }
        return {
          id
        }
      }
    }
    return this.transactionRunner.run(deleteDatasetFn, id)
  }

  async createDatasetSnapshot(snapshotDto: IDatasetSnapshotDto) {
    const createSnapshotFn = async (entityMgr: EntityManager, snapshotDto: IDatasetSnapshotDto) => {
      const { id: snapshotId, sourceDatasetId, newDatasetName, schemaName, timestamp } = snapshotDto
      const sourceDataset = await this.datasetRepo.getDataset(sourceDatasetId)
      if (!sourceDataset) {
        throw new BadRequestException(`Dataset with id ${sourceDatasetId} not found`)
      }

      const { type, tenantId, databaseCode, vocabSchemaName, tokenDatasetCode, paConfigId, dataModel } = sourceDataset
      // Copy dataset with new schema name
      const datasetSnapshot: Partial<Dataset> = {
        id: snapshotId,
        type,
        tenantId,
        databaseCode,
        schemaName,
        vocabSchemaName,
        tokenDatasetCode: `${tokenDatasetCode}_copy_${newDatasetName.trim()}`,
        paConfigId,
        dataModel,
        sourceDatasetId
      }
      this.logger.info(`Create dataset snapshot with id ${snapshotId} from source dataset ${sourceDatasetId}`)
      const datasetEntity = this.datasetRepo.create(datasetSnapshot)
      const newDatasetResult = await this.datasetRepo.insertDataset(entityMgr, this.addOwner(datasetEntity, true))

      // Copy dataset detail with new dataset name
      const sourceDatasetDetail = await this.detailRepo.getDetail(sourceDatasetId)
      const datasetDetail: DatasetDetail = {
        ...sourceDatasetDetail,
        id: uuidv4(),
        datasetId: snapshotId,
        name: newDatasetName
      }
      this.logger.info(`Copy dataset detail: ${newDatasetName}`)
      await this.detailRepo.insertDetail(entityMgr, this.addOwner(datasetDetail, true))

      // Create version attribute
      const version = String(timestamp.valueOf())
      const newVersionAttribute: IDatasetAttribute = {
        attributeId: 'version',
        // Unix timestamp
        value: version
      }
      await this.addCustomAttribute(entityMgr, snapshotId, newVersionAttribute)

      // Create source dataset id attribute
      const newDatasetIdAttribute: IDatasetAttribute = {
        attributeId: 'source_dataset_id',
        value: sourceDatasetId
      }
      await this.addCustomAttribute(entityMgr, snapshotId, newDatasetIdAttribute)

      // Create source dataset name attribute
      const newDatasetNameAttribute: IDatasetAttribute = {
        attributeId: 'source_dataset_name',
        value: sourceDatasetDetail.name
      }
      await this.addCustomAttribute(entityMgr, snapshotId, newDatasetNameAttribute)

      // Copy dataset attribute (excluding the ones inserted previously)
      const sourceDatasetAttributes = await this.attributeRepo.getAttributeDto(sourceDatasetId)
      const existingAttributes = await this.attributeRepo.getAttributeDto(snapshotId, entityMgr)
      const existingAttributeIds = existingAttributes.map(att => att.attributeId)

      for (const attribute of sourceDatasetAttributes.filter(att => !existingAttributeIds.includes(att.attributeId))) {
        this.logger.info(`Copy dataset attribute: ${attribute.attributeId}`)
        const newAttributes = this.attributeRepo.createAttribute(snapshotId, attribute)
        await this.attributeRepo.insertAttribute(entityMgr, this.addOwner(newAttributes, true))
      }

      // Copy dataset tags
      const sourceDatasetTags = await this.tagRepo.getTags(sourceDatasetId)
      for (const datasetTag of sourceDatasetTags) {
        const newTag: Partial<DatasetTag> = {
          datasetId: snapshotId,
          name: datasetTag.name
        }
        this.logger.info(`Copy dataset tag: ${datasetTag.name}`)
        await this.tagRepo.insertTag(entityMgr, this.addOwner(newTag, true))
      }

      if (isProxy) {
        this.logger.info(`Copying dataset in shared portal...`)
        await this.portalApi.copyStudy({
          tokenStudyCode: datasetSnapshot.tokenDatasetCode,
          paConfigId: datasetSnapshot.paConfigId,
          tenantId: datasetSnapshot.tenantId,
          ...snapshotDto
        })
        this.logger.info(`Successfully copied dataset in shared portal`)
      }

      return newDatasetResult
    }
    return this.transactionRunner.run(createSnapshotFn, snapshotDto)
  }

  async updateDatasetDetailMetadata(datasetDetailMetadataUpdateDto: IDatasetDetailMetadataUpdateDto) {
    const updateDatasetDetailMetadataFn = async (
      entityMgr: EntityManager,
      datasetUpdateDto: IDatasetDetailMetadataUpdateDto
    ) => {
      const { id: datasetId, detail, dashboards, tags, attributes } = datasetUpdateDto

      await this.updateDataset(entityMgr, datasetUpdateDto)
      await this.updateDatasetDetail(entityMgr, datasetId, detail)
      await this.updateDatasetDashboards(entityMgr, datasetId, dashboards)
      await this.updateDatasetTags(entityMgr, datasetId, tags)
      await this.updateDatasetAttributes(entityMgr, datasetId, attributes)

      return {
        id: datasetId
      }
    }
    return this.transactionRunner.run(updateDatasetDetailMetadataFn, datasetDetailMetadataUpdateDto)
  }

  private async updateDataset(entityMgr: EntityManager, datasetUpdateDto: IDatasetDetailMetadataUpdateDto) {
    const { id: datasetId, type, tokenDatasetCode, paConfigId, visibilityStatus } = datasetUpdateDto

    const currDataset = await this.datasetRepo.getDataset(datasetId)

    if (!currDataset) {
      throw new BadRequestException(`Dataset with id ${datasetId} not found`)
    }
    const dataset: Partial<Dataset> = {
      ...currDataset,
      type,
      tokenDatasetCode,
      visibilityStatus,
      paConfigId
    }
    await this.datasetRepo.updateDataset(entityMgr, datasetId, this.addOwner(dataset))
  }

  private async updateDatasetDetail(entityMgr: EntityManager, datasetId: string, detail: IDatasetDetailBaseDto) {
    const detailEntity = await entityMgr.getRepository(DatasetDetail).findOne({ where: { datasetId } })

    if (detailEntity) {
      await entityMgr.getRepository(DatasetDetail).update({ datasetId }, this.addOwner(detail))
    } else {
      throw new BadRequestException(`Dataset detail with datasetId ${datasetId} not found`)
    }

    if (isProxy) {
      this.logger.info(`Updating dataset detail in shared portal...`)
      await this.portalApi.updateStudyDetail({
        studyId: datasetId,
        ...detail
      })
      this.logger.info(`Successfully updated dataset detail in shared portal`)
    }
  }

  private async updateDatasetDashboards(
    entityMgr: EntityManager,
    datasetId: string,
    dashboards: IDatasetDashboardBaseDto[]
  ) {
    const { deletedDashboards, newDashboards } = await this.filterDashboardChanges(datasetId, dashboards)
    for (const dashboard of deletedDashboards) {
      const { name, url, basePath } = dashboard
      this.logger.debug(`Delete dataset ${datasetId} dashboard: ${name}`)
      await this.dashboardRepo.deleteDashboard(entityMgr, { name, url, basePath })
    }
    for (const dashboard of newDashboards) {
      const entity = this.dashboardRepo.create({ datasetId, ...dashboard, id: uuidv4() })
      this.logger.debug(`Create dataset ${datasetId} dashboard ${JSON.stringify(entity)}`)
      await this.dashboardRepo.insertDashboard(entityMgr, this.addOwner(entity, true))
    }
  }

  private async updateDatasetTags(entityMgr: EntityManager, datasetId: string, tags: string[]) {
    const tagChanges = await this.filterTagChanges(datasetId, tags)
    if (tagChanges.deletedTags) {
      this.logger.debug(`Delete dataset ${datasetId} tags: ${JSON.stringify(tagChanges.deletedTags)}`)
      await this.tagRepo.deleteTag(entityMgr, { datasetId, name: In(tagChanges.deletedTags) })
    }
    for (const tag of tagChanges.newTags) {
      const newDatasetTag: Partial<DatasetTag> = {
        datasetId,
        name: tag
      }
      this.logger.debug(`Create dataset ${datasetId} tag ${tag}`)
      await this.tagRepo.insertTag(entityMgr, this.addOwner(newDatasetTag, true))
    }
  }

  private async updateDatasetAttributes(entityMgr: EntityManager, datasetId: string, attributes: IDatasetAttribute[]) {
    const { deletedAttributes, newAttributes } = await this.filterAttributeChanges(datasetId, attributes)
    for (const attribute of deletedAttributes) {
      const criteria = this.attributeRepo.createAttribute(datasetId, attribute)
      this.logger.debug(`Delete dataset ${datasetId} attribute: ${JSON.stringify(criteria)}`)
      await this.attributeRepo.deleteAttribute(entityMgr, criteria)
    }
    for (const attribute of newAttributes) {
      const entity = this.attributeRepo.createAttribute(datasetId, attribute)
      this.logger.debug(`Create dataset ${datasetId} attribute ${JSON.stringify(entity)}`)
      await this.attributeRepo.insertAttribute(entityMgr, this.addOwner(entity, true))
    }
  }

  async updateDatasetAttribute(datasetAttributeDto: IDatasetAttributeDto) {
    const updateAttributeFn = async (_entityMgr: EntityManager, datasetAttributeDto: IDatasetAttributeDto) => {
      const { studyId: datasetId } = datasetAttributeDto
      const attribute = await this.attributeRepo.getDatasetAttribute(datasetId, datasetAttributeDto.attributeId)
      const isNewEntity = !attribute

      const dataAttributeEntity = this.addOwner(
        this.attributeRepo.createAttribute(datasetId, datasetAttributeDto),
        isNewEntity
      )

      // Add previous user to created entity if is not new entity
      if (!isNewEntity) {
        dataAttributeEntity.createdBy = attribute.createdBy
      }

      const result = await this.attributeRepo.upsert(dataAttributeEntity, ['datasetId', 'attributeId'])
      return result.identifiers[0].id
    }

    return this.transactionRunner.run(updateAttributeFn, datasetAttributeDto)
  }

  private async addCustomAttribute(entityMgr: EntityManager, datasetId: string, customAttribute: IDatasetAttribute) {
    const { attributeId, value } = customAttribute
    this.logger.info(`Create ${attributeId} attribute: ${value}`)
    const entity = this.attributeRepo.createAttribute(datasetId, customAttribute)
    await this.attributeRepo.insertAttribute(entityMgr, this.addOwner(entity, true))
  }

  private swapVariables<T>(object, swapPair: string[]) {
    const from = swapPair[0]
    const to = swapPair[1]
    const fromCapitalised = from.charAt(0).toUpperCase() + from.slice(1)
    for (const key in object) {
      if (key.includes(from)) {
        const newKey = key.replace(from, to)
        object[newKey] = object[key]
        delete object[key]
      } else if (key.includes(fromCapitalised)) {
        const toCapitalised = to.charAt(0).toUpperCase() + to.slice(1)
        const newKey = key.replace(fromCapitalised, toCapitalised)
        object[newKey] = object[key]
        delete object[key]
      }
    }
    return <T>object
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

  private async filterAttributeChanges(
    datasetId,
    attributes: IDatasetAttribute[]
  ): Promise<{ [key: string]: IDatasetAttribute[] }> {
    const currDatasetAttributes = await this.attributeRepo.getAttributeDto(datasetId)
    const currAttributes = currDatasetAttributes.reduce<IDatasetAttribute[]>((acc, currDatasetAttribute) => {
      const { studyId: _studyId, ...customAttribute } = currDatasetAttribute
      acc.push(customAttribute)
      return acc
    }, [])

    const isSameAttribute = (a: IDatasetAttribute, b: IDatasetAttribute) =>
      a.attributeId === b.attributeId && a.value === b.value

    const deletedAttributes = this.onlyInLeft<IDatasetAttribute>(currAttributes, attributes, isSameAttribute) || []
    const newAttributes = this.onlyInLeft<IDatasetAttribute>(attributes, currAttributes, isSameAttribute) || []

    return {
      deletedAttributes,
      newAttributes
    }
  }

  private async filterTagChanges(datasetId, tags): Promise<{ [key: string]: string[] }> {
    const currDatasetTags = await this.tagRepo.getTags(datasetId)
    const currTags = currDatasetTags.map(datasetTag => datasetTag.name)
    const [remainingTags, deletedTags] = currTags.reduce(
      ([remainingTags, deletedTags], tag) => {
        return tags.includes(tag) ? [[...remainingTags, tag], deletedTags] : [remainingTags, [...deletedTags, tag]]
      },
      [[], []]
    )
    const newTags = tags.filter(tag => !remainingTags.includes(tag))
    return {
      deletedTags,
      newTags
    }
  }

  private async filterDashboardChanges(
    datasetId: string,
    dashboards: IDatasetDashboardBaseDto[]
  ): Promise<{ [key: string]: IDatasetDashboardBaseDto[] }> {
    const currDashboards = await this.dashboardRepo.find({ where: { datasetId } })

    const isSameDashboard = (a: IDatasetDashboardBaseDto, b: IDatasetDashboardBaseDto) =>
      a.name === b.name && a.url === b.url && a.basePath === b.basePath

    const deletedDashboards =
      this.onlyInLeft<IDatasetDashboardBaseDto>(currDashboards, dashboards, isSameDashboard) || []
    const newDashboards = this.onlyInLeft<IDatasetDashboardBaseDto>(dashboards, currDashboards, isSameDashboard) || []

    return {
      deletedDashboards,
      newDashboards
    }
  }

  private onlyInLeft<T>(left: T[], right: T[], compareFunction: (a: T, b: T) => boolean) {
    return left.filter(leftItems => !right.some(rightItems => compareFunction(leftItems, rightItems)))
  }
}
