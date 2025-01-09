import axios from "axios";
import { env } from '../env';

export class AWSTokenAPI {
  private readonly tokenEndpoint: string;
  private readonly clientID: string;
  private readonly clientSecret: string;

  constructor() {
    // Validate the client_id, client_secret, and token_endpoint
    if (!(env.COGNITO_CLIENT_ID && env.COGNITO_CLIENT_SECRET)) {
      throw new Error('No client credentials are set for Code Suggestion')
    }
    else if (!env.COGNITO_TOKEN_ENDPOINT) {
      throw new Error('No url is set to get access token')
    }
    else {
      this.tokenEndpoint = env.COGNITO_TOKEN_ENDPOINT
      this.clientID = env.COGNITO_CLIENT_ID
      this.clientSecret = env.COGNITO_CLIENT_SECRET
    }
  }

  async getAccessToken(): Promise<string> {
    try {
      // Get CognitoAccessToken
      const tokenResponse = await axios.post(this.tokenEndpoint, 
        new URLSearchParams({
          'grant_type': 'client_credentials',
          'client_id': this.clientID,
          'client_secret': this.clientSecret
        }), 
        {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }
      );
      const accessToken = tokenResponse.data.access_token;
      return accessToken;
    } catch (error) {
      throw new Error('Error getting access token:', error);
    }
  }
}
