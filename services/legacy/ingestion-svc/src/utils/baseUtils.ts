import express from 'express'
import async from 'async'
import * as config from './config'

export const strUC = (input: any) => {
  if (input === undefined || input === null) {
    //As long as the input is not null / undefined
    throw new Error('Invalid input to capitalize string')
  } else {
    return String(input).toUpperCase()
  }
}

export const getBoolean = (input: any) => {
  return strUC(input) === 'TRUE'
}

export const runAsyncParallel = (tasks: any[], callback: (err: any, results: any) => any) => {
  async.parallelLimit(
    async.reflectAll(tasks),
    3, //Limit to 3 concurrent tasks at a time
    // optional callback
    (err, results: any) => {
      callback(err, results)
    }
  )
}

export const prepareResponseForAsyncParallel = (
  results: any,
  successKeyName: string = 'successfulSchemas',
  failureKeyName: string = 'failedSchemas'
) => {
  const response: any = {
    message: '',
    [successKeyName]: [],
    [failureKeyName]: [],
    errorOccurred: false
  }
  // values
  // results[0].value = 'one'
  // results[1].error = Error('bad stuff happened')
  // results[2].value = 'two'
  results.forEach((result: any) => {
    if (result.error) {
      response.errorOccurred = true
      response[failureKeyName].push(result.error.message)
    } else {
      response[successKeyName].push(result.value)
    }
  })

  return response
}

export const sendResponseWithResults = (
  response: any,
  successMessage: string,
  failMessage: string,
  res: express.Response,
  next: express.NextFunction
) => {
  if (response.errorOccurred) {
    response.message = failMessage
    next(new Error(JSON.stringify(response)))
  } else {
    response.message = successMessage
    res.send(response)
  }
}

export const asyncRouterCallback = (
  successMessage: string,
  failMessage: string,
  res: express.Response,
  next: express.NextFunction,
  successKeyName = 'successfulSchemas',
  failureKeyName = 'failedSchemas'
) => {
  return (err: any, results: any) => {
    const response = prepareResponseForAsyncParallel(results, successKeyName, failureKeyName)
    sendResponseWithResults(response, successMessage, failMessage, res, next)
  }
}

export let printLogs = (results: any) => {
  for (let result of results) {
    if (typeof result === 'object') {
      let resultArray = Array.isArray(result) ? result : [result]
      for (let resultItem of resultArray) {
        config.getLogger().info(JSON.stringify(resultItem))
      }
    } else {
      config.getLogger().info(result) //Assuming its a string
    }
  }
}

export const isValidJson = (text: string) => {
  try {
    JSON.parse(text)
    return true
  } catch {
    return false
  }
}
