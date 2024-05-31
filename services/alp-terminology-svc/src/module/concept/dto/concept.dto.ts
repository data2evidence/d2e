import { IsOptional, IsUUID, IsString, IsNumber } from 'class-validator';

export class ConceptFilterOptionsDto {
  @IsUUID()
  datasetId: string;

  @IsString()
  searchText: string;

  @IsString()
  @IsOptional()
  filter?: string;
}

export class ConceptHierarchyDto {
  @IsUUID()
  datasetId: string;

  @IsNumber()
  conceptId: number;

  @IsNumber()
  depth: number;
}
