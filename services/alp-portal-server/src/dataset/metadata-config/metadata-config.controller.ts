import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common'
import { createLogger } from '../../logger'
import { MetadataConfigService } from './metadata-config.service'
import { MetadataConfigTagDto, MetdataConfigAttributeDto } from '../dto'

@Controller()
export class MetadataConfigController {
  private readonly logger = createLogger(this.constructor.name)
  constructor(private readonly metadataConfigService: MetadataConfigService) {}

  @Get('tag/list')
  async getTagConfigs() {
    return await this.metadataConfigService.getTagConfigNames()
  }

  @Post('tag')
  async insertTagConfig(@Body() metadataConfigTagDto: MetadataConfigTagDto) {
    return await this.metadataConfigService.insertTagConfig(metadataConfigTagDto)
  }

  @Delete('tag/:name')
  async deleteTagConfig(@Param('name') name: string) {
    return await this.metadataConfigService.deleteTagConfig(name)
  }

  @Get('attribute/list')
  async getAttributeConfigs() {
    return await this.metadataConfigService.getAttributeConfigs()
  }

  @Post('attribute')
  async insertAttributeConfig(@Body() metdataConfigAttributeDto: MetdataConfigAttributeDto) {
    return await this.metadataConfigService.insertAttributeConfig(metdataConfigAttributeDto)
  }

  @Put('attribute')
  async updateAttributeConfig(@Body() metdataConfigAttributeDto: MetdataConfigAttributeDto) {
    return await this.metadataConfigService.updateAttributeConfig(metdataConfigAttributeDto)
  }

  @Delete('attribute/:id')
  async deleteAttributeConfig(@Param('id') id: string) {
    return await this.metadataConfigService.deleteAttributeConfig(id)
  }
}
