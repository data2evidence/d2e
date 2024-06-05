import { IsNotEmpty, IsString, IsObject } from 'class-validator'
import { IPrefectFlowRunByDeploymentDto } from '../../types'

export class PrefectFlowRunByDeploymentDto implements IPrefectFlowRunByDeploymentDto {
  @IsNotEmpty()
  @IsString()
  flowRunName: string

  @IsNotEmpty()
  @IsString()
  flowName: string

  @IsNotEmpty()
  @IsString()
  deploymentName: string

  @IsObject()
  params: object

  schedule: string | null
}
