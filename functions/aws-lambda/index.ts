import { getAccessTokenAndCallApi } from "./src/chat";
import axios,{ AxiosResponse } from "axios";
import express, { Application } from "express";
import { Request, Response } from "express";
import { env } from './src/env';

const CogClientId = env.COGNITO_CLIENT_ID;
const CogClientSecret = env.COGNITO_CLIENT_SECRET;
const CogTokenEndpoint = env.COGNITO_TOKEN_ENDPOINT;
const lambdaApiEndpoint = env.LAMBDA_API_ENDPOINT;

export class CodeSuggestion {
    private codeOrigin: string;
    private accessToken: string;
    private lambdaApiEndpoint: string;
    private readonly logger = console;

    constructor(codeOrigin: string, accessToken: string, lambdaApiEndpoint: string) {
        this.codeOrigin = codeOrigin;
        this.accessToken = accessToken;
        this.lambdaApiEndpoint = lambdaApiEndpoint;
    }
    public async getCodeSuggestion(): Promise<string> {
        try {
            const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.accessToken}`,
          };

            const response: AxiosResponse = await axios.post(this.lambdaApiEndpoint, this.codeOrigin, { headers }); //for ui
            const codeSuggest: string = response.data;
            return codeSuggest;
            } 
        catch (error) {
            this.logger.error('Error fetching code suggestion:', error);
            throw error;
        }
      }
    }

export class App {
  private app: Application;
  private readonly logger = console;

  constructor() {
    this.app = express();
  }

  async start() {
    this.app.use(express.json());
    this.app.post('/aws-lambda/api/me',
      async (req,res) => {
        const accessToken = await getAccessTokenAndCallApi(CogClientId, CogClientSecret, CogTokenEndpoint);
        const codeSuggestion = new CodeSuggestion(req.body, accessToken, lambdaApiEndpoint);
        const suggestion = await codeSuggestion.getCodeSuggestion();
        res.send(suggestion)
      }
    );
    this.app.listen(8000);
  }
}

let app_test = new App();
app_test.start();

