import { IDataCharacterizationResult, IDataQualityResult } from '../types'

export const isDataQualityResult = (result: object): result is IDataQualityResult => {
  if (result) {
    for (const key of ['Metadata', 'Overview', 'CheckResults']) {
      if (!result.hasOwnProperty(key) || result[key] === undefined) return false
    }
    return true
  }
  return false
}

export const isDataCharacterizationResult = (result: object): result is IDataCharacterizationResult => {
  if (result && result.hasOwnProperty('exportToAres')) {
    const aresResult = result['exportToAres']
    for (const key of ['cdmReleaseDate', 'records-by-domain']) {
      if (!aresResult.hasOwnProperty(key) || aresResult[key] === undefined) return false
    }
    return true
  }
  return false
}
