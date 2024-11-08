import { AsyncLocalStorage } from 'async_hooks'
import { ReqContext } from '../../types'

const asyncLocalStorage = new AsyncLocalStorage<ReqContext>()

export const createReqContext = (context: ReqContext) => {
  asyncLocalStorage.enterWith(context)
}

export const getReqContext = () => {
  const context = asyncLocalStorage.getStore()
  if (context) {
    return context
  }
  throw new Error('Request context is missing')
}
