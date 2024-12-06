import { Controller, Get, Post, Put, Delete, Param, Body, ParseEnumPipe } from '@nestjs/common'
import { UserArtifactService } from './user-artifact.service'
import { CreateArtifactDto, UpdateArtifactDto } from './dto'
import { ServiceName } from './enums'

@Controller()
export class UserArtifactController {
  constructor(private readonly userArtifactService: UserArtifactService) {}

  @Get(':serviceName/list')
  getAllServiceArtifacts(@Param('serviceName', new ParseEnumPipe(ServiceName)) serviceName: ServiceName) {
    return this.userArtifactService.getAllServiceArtifacts(serviceName)
  }

  @Get(':userId/:serviceName/list')
  getServiceArtifact(
    @Param('userId') userId: string,
    @Param('serviceName', new ParseEnumPipe(ServiceName)) serviceName: ServiceName
  ) {
    return this.userArtifactService.getUserServiceArtifact(userId, serviceName)
  }

  @Get(':userId/:serviceName/shared/list')
  getAllUserServiceArtifacts(
    @Param('userId') userId: string,
    @Param('serviceName', new ParseEnumPipe(ServiceName)) serviceName: ServiceName
  ) {
    return this.userArtifactService.getAllUserServiceArtifacts(serviceName, userId)
  }

  @Get(':userId/:serviceName/:id')
  getUserServiceArtifactById(
    @Param('userId') userId: string,
    @Param('serviceName', new ParseEnumPipe(ServiceName)) serviceName: ServiceName,
    @Param('id') id: string
  ) {
    return this.userArtifactService.getUserServiceArtifactById(userId, serviceName, id)
  }

  @Get(':serviceName/:id')
  getServiceArtifactById(
    @Param('serviceName', new ParseEnumPipe(ServiceName)) serviceName: ServiceName,
    @Param('id') id: string
  ) {
    return this.userArtifactService.getServiceArtifactById(serviceName, id)
  }

  @Post(':serviceName')
  createServiceArtifact<T extends { id: string }>(
    @Param('serviceName', new ParseEnumPipe(ServiceName)) serviceName: ServiceName,
    @Body() createArtifactDto: CreateArtifactDto<T>
  ) {
    return this.userArtifactService.createServiceArtifact(serviceName, createArtifactDto)
  }

  @Put(':serviceName/user')
  updateUserServiceArtifact<T>(
    @Param('serviceName') serviceName: ServiceName,
    @Body() updateArtifactDto: UpdateArtifactDto<T>
  ) {
    return this.userArtifactService.updateUserServiceArtifact(serviceName, updateArtifactDto)
  }

  @Put(':serviceName')
  updateServiceArtifactEntity(
    @Param('serviceName', new ParseEnumPipe(ServiceName)) serviceName: ServiceName,
    @Body() updateArtifactDto: Record<string, any>
  ) {
    return this.userArtifactService.updateServiceArtifactEntity(serviceName, updateArtifactDto)
  }

  @Delete(':userId/:serviceName/:id')
  deleteUserServiceArtifact(
    @Param('userId') userId: string,
    @Param('serviceName', new ParseEnumPipe(ServiceName)) serviceName: ServiceName,
    @Param('id') id: string
  ) {
    return this.userArtifactService.deleteUserServiceArtifact(userId, serviceName, id)
  }

  @Delete(':serviceName/:id')
  deleteServiceArtifactEntity(
    @Param('serviceName', new ParseEnumPipe(ServiceName)) serviceName: ServiceName,
    @Param('id') id: string
  ) {
    return this.userArtifactService.deleteServiceArtifactEntity(serviceName, id)
  }
}
