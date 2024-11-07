import { Controller, Post, Delete, Param, Body, HttpException, HttpStatus } from '@nestjs/common'
import { GroupService } from './group.service'

@Controller()
export class GroupController {
  constructor(private readonly groupsService: GroupService) {}

  @Post()
  async addUserToGroup(@Body('userId') userId: string) {
    if (!userId) {
      throw new HttpException('userId is required', HttpStatus.BAD_REQUEST)
    }

    const userExists = await this.groupsService.userExists(userId)
    if (userExists) {
      throw new HttpException('User already exists in the group', HttpStatus.CONFLICT)
    }

    return this.groupsService.addUserToGroup(userId)
  }

  @Delete(':userId')
  async removeUserFromGroup(@Param('userId') userId: string) {
    await this.groupsService.removeUserFromGroup(userId)
    return { message: `User ${userId} removed from group` }
  }
}
