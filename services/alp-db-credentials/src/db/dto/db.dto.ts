import { Type } from 'class-transformer'
import {
  ArrayMinSize,
  IsNotEmpty,
  IsNumber,
  IsArray,
  IsIn,
  IsOptional,
  IsString,
  ValidateNested,
  IsUUID,
  MaxLength,
  IsObject
} from 'class-validator'
import { DbDialect, IDbCredentialDto, IDbCredentialUpdateDto, IDbDto, IDbExtraDto, IDbUpdateDto } from '../../types'
import { SERVICE_SCOPES, DB_DIALECTS, SERVICE_SCOPE, USER_SCOPES } from '../../common/const'
import { IsExistingDb, IsValidSchema, IsValidSchemaUpdate } from '../../common/validator'

export class DbExtraDto implements IDbExtraDto {
  @IsOptional()
  @IsNotEmpty()
  @IsObject()
  [SERVICE_SCOPE.INTERNAL]: object;
  @IsOptional()
  @IsNotEmpty()
  @IsObject()
  [SERVICE_SCOPE.DATA_PLATFORM]: object
}

export class DbDto implements IDbDto {
  @IsNotEmpty()
  @IsString()
  host: string

  @IsNumber()
  port: number

  @IsNotEmpty()
  @IsString()
  code: string

  @IsNotEmpty()
  @IsString()
  name: string

  @IsNotEmpty()
  @IsIn(DB_DIALECTS)
  dialect: DbDialect

  @ValidateNested()
  @Type(() => DbExtraDto)
  extra: DbExtraDto

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => DbCredentialDto)
  credentials: DbCredentialDto[]

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(1)
  @IsValidSchema({ each: true })
  vocabSchemas: string[]
}

export class DbUpdateDto implements IDbUpdateDto {
  @IsUUID()
  @IsExistingDb()
  id: string

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(1)
  @IsValidSchemaUpdate({ each: true })
  vocabSchemas: string[]

  @IsOptional()
  @ValidateNested()
  @Type(() => DbExtraDto)
  extra: DbExtraDto
}

export class DbCredentialUpdateDto implements IDbCredentialUpdateDto {
  @IsUUID()
  @IsExistingDb()
  id: string

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => DbCredentialDto)
  credentials: DbCredentialDto[]
}

export class DbCredentialDto implements IDbCredentialDto {
  @IsNotEmpty()
  @IsString()
  username: string

  @IsNotEmpty()
  @IsString()
  @MaxLength(684)
  password: string

  @IsNotEmpty()
  @IsString()
  salt: string

  @IsNotEmpty()
  @IsIn(USER_SCOPES)
  userScope: string

  @IsNotEmpty()
  @IsIn(SERVICE_SCOPES)
  serviceScope: string
}
