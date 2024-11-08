import fetch from 'node-fetch'
import { ConfigType } from './types'

export const getAccessToken = async (config: ConfigType): Promise<string> => {
  try {
    const details: Record<string, string> = {
      grant_type: 'client_credentials',
      client_id: config.appId || '',
      client_secret: config.appSecret || '',
      scope: config.alpMetadataScope || ''
    }

    const body = Object.keys(details)
      .map(property => `${encodeURIComponent(property)}=${encodeURIComponent(details[property])}`)
      .join('&')

    const response = await fetch(`https://login.microsoftonline.com/${config.alpTenantId}/oauth2/v2.0/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body
    })

    const json = await response.json()

    if (json.error) {
      throw json
    }
    return json.access_token
  } catch (err) {
    console.error(JSON.stringify(err))
    return Promise.reject('Error getting access token')
  }
}
