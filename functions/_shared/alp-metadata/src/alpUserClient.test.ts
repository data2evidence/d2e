import '../env'
import AlpUserClient from './AlpUserClient'
import { defaultUserConfig } from './config'

const start = async () => {
  const t = new AlpUserClient(defaultUserConfig)
  const s = await t.getUserStudies()
  return s
}

start()
