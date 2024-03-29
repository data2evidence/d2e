import { Controller, Get, Query } from '@nestjs/common';
import { ConceptService } from './concept.service';
import { SupportedFhirVersion } from '../../utils/types';

@Controller()
export class FhirController {
  constructor(private readonly appService: ConceptService) {}

  @Get(`${SupportedFhirVersion}/valueset/\\$expand`)
  async getConcepts(
    @Query('code') code: string,
    @Query('offset') offset: number,
    @Query('count') count: number,
    @Query('datasetId') datasetId: string,
    @Query('filter') filter?: string,
  ): Promise<any> {
    return await this.appService.getConcepts(
      offset,
      count,
      datasetId,
      code,
      JSON.parse(filter),
    );
  }

  @Get(`${SupportedFhirVersion}/conceptmap/\\$translate`)
  async getConceptMap(
    @Query('conceptId') conceptId: number,
    @Query('datasetId') datasetId: string,
  ): Promise<any> {
    return await this.appService.getTerminologyDetailsWithRelationships(
      conceptId,
      datasetId,
    );
  }
}
