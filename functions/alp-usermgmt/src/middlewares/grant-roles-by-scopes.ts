import { IDP_SCOPE_ROLE, CONTAINER_KEY, ROLES } from '../const'
import { NextFunction, Request, Response } from 'express'
import { Container } from 'typedi'
import jwt from 'jsonwebtoken'
import { v4 as uuidv4 } from 'uuid'
import { createLogger } from '../Logger'
import { B2cGroupService, UserGroupService, UserService } from '../services'
import { env } from '../env'
import { LogtoAPI } from '../api'
import { ITokenUser } from 'types'
import { UserField } from '../repositories'

const logger = createLogger('GrantRolesByScopes')
const subProp = env.USER_MGMT_IDP_SUBJECT_PROP

export const grantRolesByScopes = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const bearerToken = req.headers.authorization as string
    if (!bearerToken) {
      return next()
    }

    const token = jwt.decode(bearerToken.replace(/bearer /i, '')) as jwt.JwtPayload
    if (!(subProp in token)) {
      return next()
    }

    const userService = Container.get(UserService)

    const { scope, email } = token as { scope: string[]; email: string }
    const sub = token[subProp]
    let user = await userService.getUserByIdpUserId(sub)
    let userId = user?.id

    let username = email
    if (!user) {
      if (env.IDP_FETCH_USER_INFO_TYPE === 'logto') {
        // Fetch user info as Logto's access_token does not contain username
        const logtoApi = Container.get(LogtoAPI)
        const logtoUser = await logtoApi.getUser(sub)
        if (logtoUser != null) {
          // Use username in Logto context (fallback to email if empty)
          username = logtoUser.username ?? logtoUser.primaryEmail
        }
      }

      user = await userService.getUserByUsername(username)
      userId = user?.id

      if (user == null) {
        if (env.IDP_RELYING_PARTY !== 'azure') {
          logger.error(`User "${sub}" or "${username}" does not exist`)
          return res.status(500).send({ message: `User "${sub}" or "${username}" does not exist` })
        }

        logger.info(`First time login for new user, create user: "${sub}"`)
        const newUser: Partial<UserField> = { id: uuidv4(), username: username, idp_user_id: sub }
        await userService.createUser(newUser)
        userId = newUser.id

        const tokenUser: ITokenUser = {
          userId: newUser.id || '',
          idpUserId: sub
        }
        req.user = tokenUser
        Container.set(CONTAINER_KEY.CURRENT_USER, tokenUser)
      } else if (!user.idpUserId) {
        logger.info(`First time login for existing user, update idp_user_id: "${sub}"`)
        await userService.updateUser({ id: user.id, idp_user_id: sub })

        const tokenUser: ITokenUser = {
          userId: user.id || '',
          idpUserId: sub
        }
        req.user = tokenUser
        Container.set(CONTAINER_KEY.CURRENT_USER, tokenUser)
      }
    }

    if (!userId) {
      return next()
    }

    if (env.IDP_RELYING_PARTY === 'azure') {
      const tenantId = env.APP_TENANT_ID
      if (!tenantId) {
        logger.error(`Tenant not found`)
        return res.status(500).send({ message: `Tenant not found` })
      }

      grantOrRevokeTenantRole(userId, tenantId, ROLES.TENANT_VIEWER, scope.includes(IDP_SCOPE_ROLE.TENANT_VIEWER))
      grantOrRevokeSystemRole(userId, ROLES.ALP_SYSTEM_ADMIN, scope.includes(IDP_SCOPE_ROLE.SYSTEM_ADMIN))
      grantOrRevokeSystemRole(userId, ROLES.ALP_USER_ADMIN, scope.includes(IDP_SCOPE_ROLE.USER_ADMIN))
    }

    next()
  } catch (err) {
    logger.error(`Error when assigning roles: ${err}`)
    next(err)
  }
}

const grantOrRevokeTenantRole = async (userId: string, tenantId: string, role: string, isGrant: boolean) => {
  const groupService = Container.get(B2cGroupService)

  let group = await groupService.getGroupByTenantRole(tenantId, role)
  if (!group?.id) {
    await groupService.createGroup({ role, tenantId })
    group = await groupService.getGroupByTenantRole(tenantId, role)
  }

  if (isGrant) {
    await addUserToGroup(userId, group!.id)
  } else {
    await removeUserFromGroup(userId, group!.id)
  }
}

const grantOrRevokeSystemRole = async (userId: string, role: string, isGrant: boolean) => {
  const groupService = Container.get(B2cGroupService)

  const system = env.ALP_SYSTEM_NAME!
  const group = await groupService.getGroupBySystemRole(system, role)

  if (isGrant) {
    await addUserToGroup(userId, group!.id)
  } else {
    await removeUserFromGroup(userId, group!.id)
  }
}

const addUserToGroup = async (userId: string, groupId: string) => {
  logger.info(`Grant ${userId} to ${groupId}`)
  const userGroupService = Container.get(UserGroupService)

  const member = await userGroupService.getUserGroup(userId, groupId)
  if (!member?.id) {
    await userGroupService.addUserToGroup(userId, groupId)
  }
}

const removeUserFromGroup = async (userId: string, groupId: string) => {
  logger.info(`Revoke ${userId} from ${groupId}`)
  const userGroupService = Container.get(UserGroupService)
  await userGroupService.withdrawUserFromGroup(userId, groupId)
}
