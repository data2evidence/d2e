import { Injectable } from '@nestjs/common'
import { IDatasetResponseDto } from '../../types'
import { TenantService } from '../../tenant/tenant.service'
import { DatasetRepository } from '../repository'

const SWAP_TO = {
  STUDY: ['dataset', 'study'],
  DATASET: ['study', 'dataset']
}

@Injectable()
export class PublicDatasetQueryService {
  constructor(private readonly tenantService: TenantService, private readonly datasetRepo: DatasetRepository) {}

  async getDatasets() {
    const datasets = await this.datasetRepo
      .createQueryBuilder('dataset')
      .leftJoin('dataset.datasetDetail', 'datasetDetail')
      .leftJoin('dataset.tags', 'tag')
      .leftJoin('dataset.attributes', 'attribute')
      .leftJoin('attribute.attributeConfig', 'attributeConfig')
      .where('dataset.visibilityStatus = :visibilityStatus', { visibilityStatus: 'PUBLIC' })
      .select([
        'dataset.id',
        'dataset.tokenDatasetCode',
        'dataset.databaseCode',
        'dataset.schemaName',
        'datasetDetail.id',
        'datasetDetail.name',
        'datasetDetail.description',
        'datasetDetail.summary',
        'datasetDetail.showRequestAccess',
        'tag.id',
        'tag.name',
        'attribute.attributeId',
        'attribute.value',
        'attributeConfig.name',
        'attributeConfig.dataType',
        'attributeConfig.isDisplayed'
      ])
      .getMany()

    const tenant = this.tenantService.getTenant()

    const datasetDtos = await datasets.reduce<Promise<IDatasetResponseDto[]>>(async (accP, dataset) => {
      const acc = await accP

      const datasetDto: IDatasetResponseDto = {
        ...dataset,
        tenant
      }

      const { ...rest } = datasetDto
      acc.push(rest)
      return acc
    }, Promise.resolve([]))

    return datasetDtos.map(datasetDto => this.swapVariables(datasetDto, SWAP_TO.STUDY))
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
}
