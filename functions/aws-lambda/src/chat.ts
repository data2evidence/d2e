import axios from "axios";
import { env } from './env.ts';


export const getAccessTokenAndCallApi = async (
  client_id: string, 
  client_secret: string, 
  tokenEndpoint: string,
): Promise<any> => {
  let logger = console
  try {
    if (env.COGNITO_CLIENT_ID && env.COGNITO_CLIENT_SECRET) {
        client_id = env.COGNITO_CLIENT_ID
        client_secret = env.COGNITO_CLIENT_SECRET
    } else {
        logger.error('No client credentials are set for Fhir')
        throw new Error('No client credentials are set for Fhir')
    }
    // Get CognitoAccessToken
    const tokenResponse = await axios.post(tokenEndpoint, 
      new URLSearchParams({
        'grant_type': 'client_credentials',
        'client_id': client_id,
        'client_secret': client_secret
      }), 
      {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      }
    );

    const accessToken = tokenResponse.data.access_token;
    return accessToken;
  } catch (error) {
    console.error('Error getting access token:', error);
    throw error;
  }
};