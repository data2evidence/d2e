import axios,{ AxiosResponse } from "axios";
import { AWSTokenAPI } from "../api/AWSTokenAPI";
import { env } from '../env';
import { IUICodeSnippet } from "../type";

const lambdaApiEndpoint = env.LAMBDA_API_ENDPOINT;
const accessToken = await new AWSTokenAPI().getAccessToken();

export const getCodeSuggestion = async (uiCode: IUICodeSnippet) => {
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
