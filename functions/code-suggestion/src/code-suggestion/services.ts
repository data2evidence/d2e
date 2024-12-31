import axios,{ AxiosResponse } from "axios";
import { PortalAPI } from "../api/PortalAPI";
import { env } from '../env';
import { UICodeSnippet } from "../type";

const lambdaApiEndpoint = env.LAMBDA_API_ENDPOINT;
const accessToken = await new PortalAPI().getAccessToken();

export const getCodeSuggestion = async (uiCode: UICodeSnippet) => {
  try {
      const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    };
      const response: AxiosResponse = await axios.post(lambdaApiEndpoint, uiCode, { headers }); //for ui
      const codeSuggest: string = response.data;
      return codeSuggest;
      } 
  catch (error) {
      throw new Error('Error fetching code suggestion:', error);
  }
  }
