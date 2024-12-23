import {
  Body,
  Controller,
  Delete,
  HTTP_STATUS,
  HttpException,
  Middleware,
  Param,
  Post,
} from "@danet/core";
import { RequestContextMiddleware } from "../../common/request-context.middleware.ts";
import { GroupService } from "./group.service.ts";

@Middleware(RequestContextMiddleware)
@Controller("system-portal/user-artifact/group")
export class GroupController {
  constructor(private readonly groupsService: GroupService) {}

  @Post()
  async addUserToGroup(@Body("userId") userId: string) {
    if (!userId) {
      throw new HttpException(HTTP_STATUS.BAD_REQUEST, "userId is required");
    }

    const userExists = await this.groupsService.userExists(userId);
    if (userExists) {
      throw new HttpException(
        HTTP_STATUS.CONFLICT,
        "User already exists in the group"
      );
    }

    return this.groupsService.addUserToGroup(userId);
  }

  @Delete(":userId")
  async removeUserFromGroup(@Param("userId") userId: string) {
    await this.groupsService.removeUserFromGroup(userId);
    return { message: `User ${userId} removed from group` };
  }
}
