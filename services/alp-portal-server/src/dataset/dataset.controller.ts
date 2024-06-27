import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
  ParseIntPipe,
  Head,
  HttpException,
  HttpStatus
} from '@nestjs/common'
import { DatasetQueryService } from './query/dataset-query.service'
import { DatasetFilterService } from './dataset-filter.service'
import { DatasetCommandService } from './command/dataset-command.service'
import { IDataset } from '../types'
import { transformPipe } from '../common/pipe/TransformPipe'
import {
  DatasetDto,
  DatasetSnapshotDto,
  DatasetQueryDto,
  DatasetReleaseDto,
  DatasetSearchDto,
  DatasetAttributeDto
} from './dto'
import { DatasetDetailMetadataUpdateDto } from './dto/dataset-detail-metadata.update.dto'

@Controller()
export class DatasetController {
  constructor(
    private readonly datasetQueryService: DatasetQueryService,
    private readonly datasetCommandService: DatasetCommandService,
    private readonly datasetFilterService: DatasetFilterService
  ) {}

  @Head()
  async hasDataset(@Query() searchParams: DatasetSearchDto) {
    const dataset = await this.datasetQueryService.hasDataset(searchParams)
    if (dataset) {
      return
    }
    throw new HttpException('', HttpStatus.NO_CONTENT)
  }

  @Get('list')
  async getDatasets(@Query(transformPipe) queryParams: DatasetQueryDto) {
    return await this.datasetQueryService.getDatasets(queryParams)
  }

  @Get('filter-scopes')
  async getDatasetFilterScopes() {
    return await this.datasetFilterService.getFilterScopes()
  }

  @Get(':id')
  async getDataset(@Param('id', ParseUUIDPipe) id): Promise<IDataset> {
    return await this.datasetQueryService.getDataset(id)
  }

  @Put()
  async updateDatasetDetailMetadata(@Body() datasetDetailMetadataDto: DatasetDetailMetadataUpdateDto) {
    return await this.datasetCommandService.updateDatasetDetailMetadata(datasetDetailMetadataDto)
  }

  @Post('snapshot')
  async createDatasetSnapshot(@Body(transformPipe) datasetSnapshotDto: DatasetSnapshotDto) {
    return await this.datasetCommandService.createDatasetSnapshot(datasetSnapshotDto)
  }

  @Post()
  async createDataset(@Body() datasetDto: DatasetDto) {
    return await this.datasetCommandService.createDataset(datasetDto)
  }

  @Delete(':id')
  async offboardDataset(@Param('id', ParseUUIDPipe) id) {
    return await this.datasetCommandService.offboardDataset(id)
  }

  @Put('attribute')
  async updateDatasetAttribute(@Body() datasetAttributeDto: DatasetAttributeDto) {
    return await this.datasetCommandService.updateDatasetAttribute(datasetAttributeDto)
  }

  @Post('release')
  async createRelease(@Body() datasetReleaseDto: DatasetReleaseDto) {
    return await this.datasetCommandService.createRelease(datasetReleaseDto)
  }

  @Get(':datasetId/release/list')
  async getReleases(@Param('datasetId', ParseUUIDPipe) datasetId: string) {
    return await this.datasetQueryService.getDatasetReleases(datasetId)
  }

  @Get('release/:id')
  async getReleaseById(@Param('id', ParseIntPipe) id: number) {
    return await this.datasetQueryService.getDatasetReleaseById(id)
  }

  @Get('dashboard/:name')
  async getDashboardByName(@Param('name') name) {
    return await this.datasetQueryService.getDatasetDashboardByName(name)
  }

  @Get('dashboards/list')
  async getDashboards() {
    return await this.datasetQueryService.getDashboards()
  }
}
