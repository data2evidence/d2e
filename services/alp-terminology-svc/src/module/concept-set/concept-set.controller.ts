import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Put,
  Delete,
  Query,
} from '@nestjs/common';
import { ConceptSetService } from './concept-set.service';
import { ConceptSet } from '../../entity';

@Controller()
export class ConceptSetController {
  constructor(private readonly appService: ConceptSetService) {}

  @Get()
  async getConceptSets(): Promise<any> {
    return await this.appService.getConceptSets();
  }

  @Post()
  async createConceptSet(@Body() conceptSetData: ConceptSet): Promise<any> {
    return await this.appService.createConceptSet(conceptSetData);
  }

  @Get(':conceptSetId')
  async getConceptSet(
    @Param('conceptSetId') conceptSetId: string,
    @Query('datasetId') datasetId: string,
  ): Promise<any> {
    return await this.appService.getConceptSet(conceptSetId, datasetId);
  }

  @Put(':conceptSetId')
  async updateConceptSet(
    @Param('conceptSetId') conceptSetId: string,
    @Body() conceptSetData: Partial<ConceptSet>,
  ): Promise<any> {
    return await this.appService.updateConceptSet(conceptSetId, conceptSetData);
  }

  @Delete(':conceptSetId')
  async removeConceptSet(
    @Param('conceptSetId') conceptSetId: string,
  ): Promise<any> {
    return await this.appService.removeConceptSet(conceptSetId);
  }

  @Post('included-concepts')
  async getIncludedConcepts(
    @Body() body: { datasetId: string; conceptSetIds: string[] },
  ): Promise<any> {
    return await this.appService.getIncludedConcepts(body);
  }
}
