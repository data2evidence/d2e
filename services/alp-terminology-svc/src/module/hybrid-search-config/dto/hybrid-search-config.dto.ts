import { IsString, IsNumber, IsBoolean, IsDecimal } from 'class-validator';

export class HybridSearchConfigDto {
  @IsNumber()
  id: number;

  @IsBoolean()
  isEnabled: boolean;

  @IsDecimal()
  semanticRatio: number;

  @IsString()
  model: string;
}
