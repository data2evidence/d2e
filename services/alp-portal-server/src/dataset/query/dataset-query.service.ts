import { BadRequestException, Inject, Injectable } from '@nestjs/common'
import { REQUEST } from '@nestjs/core'
import { Brackets } from 'typeorm'
import { JwtPayload, decode } from 'jsonwebtoken'
import { IDataset, IDatasetResponseDto, IDatasetQueryDto, IDatasetSearchDto, ITenant } from '../../types'
import { DatasetFilterService } from '../dataset-filter.service'
import { TenantService } from '../../tenant/tenant.service'
import { DatasetRepository, DatasetReleaseRepository, DatasetDashboardRepository } from '../repository'
import { createLogger } from '../../logger'
import { Dataset } from '../entity'
import { UserMgmtService } from '../../user-mgmt/user-mgmt.service'

const SWAP_TO = {
  STUDY: ['dataset', 'study'],
  DATASET: ['study', 'dataset']
}

@Injectable()
export class DatasetQueryService {
  private readonly userId: string
  private readonly logger = createLogger(this.constructor.name)

  constructor(
    @Inject(REQUEST) request: Request,
    private readonly tenantService: TenantService,
    private readonly datasetRepo: DatasetRepository,
    private readonly releaseRepo: DatasetReleaseRepository,
    private readonly dashboardRepo: DatasetDashboardRepository,
    private readonly datasetFilterService: DatasetFilterService,
    private readonly userMgmtService: UserMgmtService
  ) {
    const token = decode(request.headers['authorization'].replace(/bearer /i, '')) as JwtPayload
    this.userId = token.sub
  }

  async hasDataset(searchParams: IDatasetSearchDto) {
    return await this.datasetRepo.findOne({
      where: searchParams
    })
  }

  async getDataset(id: string): Promise<IDataset> {
    const baseColumns = this.getDatasetBaseColumns()
    const dataset = await this.datasetRepo
      .createQueryBuilder('dataset')
      .leftJoin('dataset.datasetDetail', 'datasetDetail')
      .leftJoin('dataset.dashboards', 'dashboard')
      .leftJoin('dataset.tags', 'tag')
      .leftJoin('dataset.attributes', 'attribute')
      .leftJoin('attribute.attributeConfig', 'attributeConfig')
      .where('dataset.id = :id', { id })
      .select(baseColumns)
      .getOne()

    if (!dataset) {
      throw new BadRequestException(`Dataset with id ${id} not found`)
    } else if (!dataset.datasetDetail) {
      throw new BadRequestException(`Dataset detail with dataset id ${id} not found`)
    }

    const tenant = this.tenantService.getTenant()

    const datasetDto = await this.buildDatasetResponseDto(dataset, tenant)
    return this.swapVariables(datasetDto, SWAP_TO.STUDY)
  }

  async getDatasets(queryParams?: IDatasetQueryDto) {
    const { role, searchText, ...filterParams } = queryParams
    const isResearcher = role === 'researcher'
    const hasFilterParams = Object.keys(filterParams).length > 0
    if (!isResearcher && hasFilterParams) {
      this.logger.error(`Non-researcher dataset query with filter params provided: ${JSON.stringify(filterParams)}`)
      throw new BadRequestException('Invalid request')
    }

    const query = this.datasetRepo
      .createQueryBuilder('dataset')
      .leftJoin('dataset.datasetDetail', 'datasetDetail')
      .leftJoin('dataset.dashboards', 'dashboard')
      .leftJoin('dataset.tags', 'tag')
      .leftJoin('dataset.attributes', 'attribute')
      .leftJoin('attribute.attributeConfig', 'attributeConfig')
      .select(this.getDatasetsColumns(role))

    if (searchText) {
      const tsQuery = this.convertToTsqueryFormat(this.sanitizeTsQueryInput(searchText))
      if (tsQuery) {
        query
          .setParameter('searchText', tsQuery)
          .andWhere(
            new Brackets(qb => {
              qb.where('"datasetDetail"."search_tsv" @@ to_tsquery(\'english\', :searchText)').orWhere(
                '"attribute"."search_tsv" @@ to_tsquery(\'english\', :searchText)'
              )
            })
          )
          .orderBy('ts_rank("datasetDetail"."search_tsv", to_tsquery(\'english\', :searchText))', 'DESC')
      }
    }

    if (isResearcher) {
      const datasetIds = await this.userMgmtService.getResearcherDatasetIds(this.userId)
      query.andWhere(
        '(dataset.visibility_status = :hidden AND dataset.id = ANY(:datasetIds) OR dataset.visibility_status != :hidden)',
        { hidden: 'HIDDEN', datasetIds }
      )
    }

    const datasets = await query.getMany()
    const tenant = this.tenantService.getTenant()

    let dbFilterResults
    if (isResearcher && hasFilterParams) {
      dbFilterResults = await this.datasetFilterService.getDatabaseSchemaFilterResults(filterParams, datasets)
      this.logger.debug(`Database schema filter results: ${JSON.stringify(dbFilterResults)}`)
    }

    const datasetDtos = await datasets.reduce<Promise<IDatasetResponseDto[]>>(async (accP, dataset) => {
      const acc = await accP
      const datasetDto = await this.buildDatasetResponseDto(dataset, tenant)

      const { databaseCode, schemaName, dataModel, ...rest } = datasetDto
      const formattedDataModel = dataModel.replace(/\s*\[.*?\]/, '').trim()
      if (!isResearcher) {
        acc.push(datasetDto)
      } else if (!hasFilterParams) {
        acc.push({ dataModel: formattedDataModel, ...rest })
      } else if (databaseCode && Object.keys(dbFilterResults).length > 0) {
        const filterResults = dbFilterResults[databaseCode]
        if (filterResults && filterResults[schemaName] && filterResults[schemaName].isMatched) {
          acc.push({
            ...rest,
            totalSubjects: filterResults[schemaName].totalSubjects,
            dataModel: formattedDataModel
          })
        }
      }
      return acc
    }, Promise.resolve([]))

    return datasetDtos.map(datasetDto => this.swapVariables(datasetDto, SWAP_TO.STUDY))
  }

  private getDatasetBaseColumns() {
    return [
      'dataset.id',
      'dataset.dialect',
      'dataset.databaseCode',
      'dataset.schemaName',
      'dataset.vocabSchemaName',
      'dataset.dataModel',
      'datasetDetail.name',
      'datasetDetail.description',
      'datasetDetail.summary',
      'datasetDetail.showRequestAccess',
      'attribute.attributeId',
      'attribute.value',
      'attributeConfig.name',
      'attributeConfig.dataType',
      'attributeConfig.isDisplayed',
      'tag.id',
      'tag.name',
      'dashboard.id',
      'dashboard.name',
      'dashboard.url',
      'dashboard.basePath'
    ]
  }

  private getDatasetsColumns(role?: string) {
    const baseColumns = [...this.getDatasetBaseColumns(), 'dataset.tokenDatasetCode']
    if (role === 'systemAdmin') {
      return baseColumns.concat(['dataset.paConfigId', 'dataset.type', 'dataset.visibilityStatus'])
    }
    return baseColumns
  }

  async getDatasetReleases(datasetId: string) {
    const releases = await this.releaseRepo
      .createQueryBuilder('dataset_release')
      .where('dataset_release.datasetId = :datasetId', { datasetId })
      .getMany()

    return releases.map(release => {
      return {
        id: release.id,
        name: release.name,
        releaseDate: new Date(release.releaseDate).toISOString().substring(0, 10)
      }
    })
  }

  async getDatasetReleaseById(id: number) {
    const release = await this.releaseRepo
      .createQueryBuilder('dataset_release')
      .where('dataset_release.id = :id', { id })
      .getOne()

    return {
      id: release.id,
      name: release.name,
      datasetId: release.datasetId,
      releaseDate: release.releaseDate
    }
  }

  async getDashboards() {
    return await this.dashboardRepo.createQueryBuilder('dataset_dashboard').getMany()
  }

  async getDatasetDashboardByName(name: string) {
    const formattedName = name.replace(/-/g, ' ')
    const dashboard = await this.dashboardRepo
      .createQueryBuilder('dataset_dashboard')
      .where('dataset_dashboard.name = :name', { name: formattedName })
      .getOne()

    return {
      id: dashboard.id,
      name: dashboard.name,
      url: dashboard.url
    }
  }

  async buildDatasetResponseDto(dataset: Dataset, tenant: ITenant): Promise<IDatasetResponseDto> {
    const { databaseCode, ...entity } = dataset
    return {
      // TODO: Remove on 16 February 2024
      databaseName: databaseCode,
      databaseCode,
      ...entity,
      tenant
    }
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

  private sanitizeTsQueryInput(input: string) {
    return input.replace(/[^a-zA-Z0-9\s]/g, '').trim()
  }

  private convertToTsqueryFormat(input: string) {
    const normalizedInput = input.replace(/\s+/g, ' ')
    const terms = normalizedInput.split(' ').filter(term => term.length > 0)
    return terms.join(' | ')
  }
}
