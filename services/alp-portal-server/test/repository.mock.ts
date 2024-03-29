import { DatasetAttributeRepository } from 'src/dataset/repository'
import { Repository } from 'typeorm'
import { MockType } from './type.mock'

export const repositoryMockFactory: () => MockType<Repository<any>> = jest.fn(() => ({
  createQueryBuilder: jest.fn()
}))

export const datasetAttributeRepositoryMockFactory: () => MockType<DatasetAttributeRepository> = jest.fn(() => ({
  getAttributeDto: jest.fn()
}))
