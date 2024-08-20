import { Controller, Get, Query, Post, Body } from '@nestjs/common';
import { ConceptService } from './concept.service';
import { transformPipe } from '../../utils/TransformPipe';
import {
  ConceptFilterOptionsDto,
  ConceptHierarchyDto,
  GetFirstConceptsDto,
} from './dto/concept.dto';
import { HybridSearchConfigService } from '../hybrid-search-config/hybrid-search-config.service';
@Controller()
export class ConceptController {
  constructor(
    private readonly appService: ConceptService,
    private readonly hybridSearchConfigService: HybridSearchConfigService,
  ) {}

  @Get('filter-options')
  async getConceptFilterOptions(
    @Query() conceptFilterOptionsDto: ConceptFilterOptionsDto,
  ): Promise<any> {
    const datasetId = conceptFilterOptionsDto.datasetId;
    const searchText = conceptFilterOptionsDto.searchText;
    const filters = conceptFilterOptionsDto?.filter
      ? JSON.parse(conceptFilterOptionsDto.filter)
      : {};

    const conceptClassId = filters.conceptClassId || [];
    const domainId = filters.domainId || [];
    const vocabularyId = filters.vocabularyId || [];
    const standardConcept = filters.standardConcept || [];
    const validity = filters.validity || [];
    return await this.appService.getConceptFilterOptions(
      datasetId,
      searchText,
      { conceptClassId, domainId, vocabularyId, standardConcept, validity },
    );
  }

  @Post('searchByName')
  async searchConceptByName(
    @Body()
    body: {
      conceptName: string;
      datasetId: string;
    },
  ): Promise<any> {
    return await this.appService.searchConceptByName(body);
  }

  @Post('recommended/list')
  async getRecommendedConcepts(
    @Body()
    { conceptIds, datasetId }: { conceptIds: number[]; datasetId: string },
  ): Promise<any> {
    return await this.appService.getRecommendedConcepts(conceptIds, datasetId);
  }

  @Get('hierarchy')
  async getConceptHierarchy(
    @Query(transformPipe) conceptHierarchyDto: ConceptHierarchyDto,
  ): Promise<any> {
    return await this.appService.getConceptHierarchy(
      conceptHierarchyDto.datasetId,
      conceptHierarchyDto.conceptId,
      conceptHierarchyDto.depth,
    );
  }

  @Post(`getFirstConcepts`)
  async getFirstConcepts(
    @Body() getFirstConceptsDto: GetFirstConceptsDto,
  ): Promise<any> {
    return await this.appService.getFirstConcepts(
      getFirstConceptsDto,
      this.hybridSearchConfigService,
    );
  }
}
