import { DB_DIALECTS, SERVICE_SCOPE } from './common/const'

export type ReqContext = {
  userId: string
  grantType: string
}

export interface IDbDto {
  host: string
  port: number
  code: string
  name: string
  dialect: DbDialect
  extra: IDbExtraDto
  credentials: IDbCredentialDto[]
  vocabSchemas: string[]
}

export interface IDbUpdateDto {
  id: string
  vocabSchemas?: string[]
  extra?: IDbExtraDto
}

export interface IDbCredentialUpdateDto {
  id: string
  credentials: IDbCredentialDto[]
}

export interface IDbExtraDto {
  [SERVICE_SCOPE.INTERNAL]?: object
  [SERVICE_SCOPE.DATA_PLATFORM]?: object
}

export type DbDialect = (typeof DB_DIALECTS)[number]
export type UserScope = (typeof USER_SCOPE)[number]
export type ServiceScope = (typeof SERVICE_SCOPE)[number]

export interface IDbCredentialDto {
  username: string
  password: string
  salt: string
  userScope: UserScope
  serviceScope: ServiceScope
}
