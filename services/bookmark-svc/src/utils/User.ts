import { IMRIRequest } from '../types'

export const getUser = (req: Pick<IMRIRequest, 'headers'>) => {
  const userToken: string = Buffer.from(req.headers['x-alp-usersessionclaims'] as string, 'base64').toString('utf8')
  const lang = (req.headers['x-language'] as string) || 'en'
  return { ...JSON.parse(userToken), lang }
}

export const getUserMgmtId = (userObj: any) => {
  return userObj.userMgmtGroups.userId
}
