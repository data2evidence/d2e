import { BadRequestException, Body, Controller, Delete, Get, Middleware, Param, Post, Put, Req } from '@danet/core'
import { ServiceName } from './enums/index.ts'
import { PermissionsMiddleware } from './middlewares/permissions.middleware.ts'
import { UserArtifactService } from './user-artifact.service.ts'

// @Middleware(PermissionsMiddleware)
@Controller("system-portal/user-artifact")
export class UserArtifactController {
  constructor(private readonly userArtifactService: UserArtifactService) { }

  @Get(':serviceName/list')
  getAllServiceArtifacts(@Param('serviceName') serviceName: ServiceName) {
    if (!(Object.values(ServiceName).includes(serviceName))) {
      throw new BadRequestException(`Invalid service name: ${serviceName}`)
    }
    return this.userArtifactService.getAllServiceArtifacts(serviceName)
  }

  @Get(':userId/:serviceName/list')
  getUserServiceArtifact(
    @Param('userId') userId: string,
    @Param('serviceName') serviceName: string
  ) {
    if (!(Object.values(ServiceName).includes(serviceName))) {
      throw new BadRequestException(`Invalid service name: ${serviceName}`)
    }
    return this.userArtifactService.getUserServiceArtifact(userId, serviceName)
  }

  @Get(':userId/:serviceName/shared/list')
  getAllUserServiceArtifacts(
    @Param('userId') userId: string,
    @Param('serviceName') serviceName: ServiceName
  ) {
    if (!(Object.values(ServiceName).includes(serviceName))) {
      throw new BadRequestException(`Invalid service name: ${serviceName}`)
    }
    return this.userArtifactService.getAllUserServiceArtifacts(serviceName, userId)
  }

  @Get(':userId/:serviceName/:id')
  getUserServiceArtifactById(
    @Param('userId') userId: string,
    @Param('serviceName') serviceName: string,
    @Param('id') id: string
  ) {
    if (!(Object.values(ServiceName).includes(serviceName))) {
      throw new BadRequestException(`Invalid service name: ${serviceName}`)
    }
    return this.userArtifactService.getUserServiceArtifactById(userId, serviceName, id)
  }

  @Get(':serviceName/:id')
  getServiceArtifactById(
    @Param('serviceName') serviceName: ServiceName,
    @Param('id') id: string
  ) {
    if (!(Object.values(ServiceName).includes(serviceName))) {
      throw new BadRequestException(`Invalid service name: ${serviceName}`)
    }
    return this.userArtifactService.getServiceArtifactById(serviceName, id)
  }

  @Post(':serviceName')
  createServiceArtifact(@Body() createArtifactDto: any, @Req() request: any) {
    const token = request.raw.headers.get('authorization')?.replace(/bearer /i, '')
    return this.userArtifactService.createServiceArtifact(createArtifactDto, token)
  }

  @Put(':serviceName/user')
  updateUserServiceArtifact(
    @Param('serviceName') serviceName: ServiceName,
    @Body() updateArtifactDto: any,
    @Req() request: any
  ) {
    if (!(Object.values(ServiceName).includes(serviceName))) {
      throw new BadRequestException(`Invalid service name: ${serviceName}`)
    }
    const token = request.raw.headers.get('authorization')?.replace(/bearer /i, '')
    return this.userArtifactService.updateUserServiceArtifactEntity(serviceName, updateArtifactDto, token)
  }

  @Put(':serviceName')
  updateServiceArtifact(
    @Param('serviceName') serviceName: ServiceName,
    @Body() updateArtifactDto: any
  ) {
    if (!(Object.values(ServiceName).includes(serviceName))) {
      throw new BadRequestException(`Invalid service name: ${serviceName}`)
    }
    return this.userArtifactService.updateServiceArtifactEntity(serviceName, updateArtifactDto)
  }

  @Delete(':userId/:serviceName/:id')
  deleteUserServiceArtifact(
    @Param('userId') userId: string,
    @Param('serviceName') serviceName: ServiceName | string,
    @Param('id') id: string
  ) {
    if (!(Object.values(ServiceName).includes(serviceName))) {
      throw new BadRequestException(`Invalid service name: ${serviceName}`)
    }
    return this.userArtifactService.deleteUserServiceArtifact(userId, serviceName, id)
  }

  @Delete(':serviceName/:id')
  deleteServiceArtifactEntity(
    @Param('serviceName') serviceName: ServiceName,
    @Param('id') id: string
  ) {
    if (!(Object.values(ServiceName).includes(serviceName))) {
      throw new BadRequestException(`Invalid service name: ${serviceName}`)
    }
    return this.userArtifactService.deleteServiceArtifactEntity(serviceName, id)
  }
}