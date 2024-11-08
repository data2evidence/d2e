import '../env'
import AlpClient from './AlpClient'
import { defaultUserConfig } from './config'

const start = async () => {
  const t = new AlpClient(defaultUserConfig)
  const s = await t.getStudies()
  return s
}

start()
