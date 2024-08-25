import { SqleditorAPI } from '../api'

const sqleditorApi = new SqleditorAPI()

export async function addSqleditorHeaders(req: Request, res, next) {
  const sqleditorToken = await sqleditorApi.getAccessToken()
  if (!sqleditorToken) return res.sendStatus(500)

  req.headers['authorization'] = `Bearer ${sqleditorToken}`
  return next()
}
