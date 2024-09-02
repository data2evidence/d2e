import {
  IsOptional,
  IsUUID,
  IsString,
  IsNumber,
  Min,
  Max,
  IsArray,
  ValidateNested,
  IsObject,
} from 'class-validator';
import { Type } from 'class-transformer';

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
  @Type(() => Number)
  conceptId: number;

  @IsNumber()
  @Min(1)
  @Max(10)
  @Type(() => Number)
  depth: number;
}
class GetStandardConceptsSingleDto {
  @IsNumber()
  index: number;

  @IsString()
  searchText: string;

  @IsOptional()
  @IsString()
  domainId?: string;
}

export class GetStandardConceptsDto {
  @IsArray()
  @Type(() => GetStandardConceptsSingleDto)
  data: GetStandardConceptsSingleDto[];

  @IsUUID()
  datasetId: string;
}
