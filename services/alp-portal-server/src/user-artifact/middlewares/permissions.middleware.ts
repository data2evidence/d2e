import { Injectable, NestMiddleware, HttpException, HttpStatus } from '@nestjs/common'
import { Request, Response, NextFunction } from 'express'
import { JwtPayload, decode } from 'jsonwebtoken'
import { ServiceName } from '../enums'

@Injectable()
export class PermissionsMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const permissions = {
      [ServiceName.DATAFLOW]: '777',
      [ServiceName.DATAFLOW_REVISION]: '777',
      [ServiceName.DATAFLOW_RUN]: '777',
      [ServiceName.ANALYSIS_FLOW]: '777',
      [ServiceName.ANALYSIS_FLOW_REVISION]: '777',
      [ServiceName.ANALYSIS_FLOW_RUN]: '777',
      [ServiceName.NOTEBOOKS]: '777',
      [ServiceName.PA_CONFIG]: '777',
      [ServiceName.CDW_CONFIG]: '777',
      [ServiceName.BOOKMARKS]: '777'
    }
    const userIdFromToken = this.extractUserIdFromToken(req)
    const { method } = req
    const { serviceName, userId } = req.params

    const permissionLevel = this.determinePermissionLevel(userIdFromToken, userId)
    const servicePermissions = permissions[serviceName]

    if (!this.hasPermission(method, servicePermissions[permissionLevel])) {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN)
    }

    next()
  }

  private extractUserIdFromToken(req: Request): string {
    const authHeader = req.headers['authorization']
    if (!authHeader) throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED)

    const token = decode(authHeader.replace(/bearer /i, '')) as JwtPayload
    if (!token || !token.sub) throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED)

    return token.sub
  }

  private determinePermissionLevel(userIdFromToken: string, userIdFromParam: string): number {
    if (userIdFromToken === userIdFromParam) {
      return 0
    }
    // TODO: Add logic for group check
    return 2
  }

  private hasPermission(method: string, permissionDigit: string): boolean {
    const permissionValue = parseInt(permissionDigit, 10)

    const permissionMap = {
      GET: 4,
      POST: 2,
      PUT: 2,
      DELETE: 2
    }

    const requiredPermission = permissionMap[method]
    return (permissionValue & requiredPermission) === requiredPermission
  }
}
