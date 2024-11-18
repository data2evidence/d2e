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
    return this.userArtifactService.getServiceArtifact(userId, serviceName)
  }

  @Get(':userId/:serviceName/:id')
  getServiceArtifactById(
    @Param('userId') userId: string,
    @Param('serviceName', new ParseEnumPipe(ServiceName)) serviceName: ServiceName,
    @Param('id') id: string
  ) {
    return this.userArtifactService.getServiceArtifactById(userId, serviceName, id)
  }

  @Post('/')
  createServiceArtifact<T>(@Body() createArtifactDto: CreateArtifactDto<T>) {
    return this.userArtifactService.createServiceArtifact(createArtifactDto)
  }

  @Put(':serviceName')
  updateServiceArtifact<T>(
    @Param('serviceName') serviceName: ServiceName,
    @Body() updateArtifactDto: UpdateArtifactDto<T>
  ) {
    return this.userArtifactService.updateServiceArtifact(serviceName, updateArtifactDto)
  }

  @Delete(':userId/:serviceName/:id')
  deleteServiceArtifact(
    @Param('userId') userId: string,
    @Param('serviceName', new ParseEnumPipe(ServiceName)) serviceName: ServiceName,
    @Param('id') id: string
  ) {
    return this.userArtifactService.deleteServiceArtifact(userId, serviceName, id)
  }
}
