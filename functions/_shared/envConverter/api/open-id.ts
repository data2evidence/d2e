import { AxiosResponse } from "axios";
import { decode, JwtPayload } from "jsonwebtoken";
import { Agent } from "https";
import { post } from "./request-util";

interface IClientMetadata {
  issuerUrl: string;
}

interface IClientCredentials {
  clientId: string;
  clientSecret: string;
  scope: string;
}

interface ITokenResponse {
  access_token: string;
}

export class OpenIdApi {
  private readonly issuerUrl: string;
  private readonly httpsAgent: Agent;

  constructor({ issuerUrl }: IClientMetadata) {
    this.issuerUrl = issuerUrl.endsWith("/") ? issuerUrl : `${issuerUrl}/`;

    this.httpsAgent = new Agent({
      rejectUnauthorized: this.issuerUrl.startsWith("https://alp-logto-")
        ? false
        : true,
    });
  }

  async getClientCredentialsToken({
    clientId,
    clientSecret,
    scope,
  }: IClientCredentials) {
    const params: any = {
      grant_type: "client_credentials",
      client_id: clientId,
      client_secret: clientSecret,
      scope,
    };

    const body = Object.keys(params)
      .map(
        (key) => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`
      )
      .join("&");

    let result: AxiosResponse<ITokenResponse> | undefined;
    try {
      result = await post<ITokenResponse>(`${this.issuerUrl}token`, body, {
        httpsAgent: this.httpsAgent,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });
    } catch (err) {
      console.error("Error when getting client credentials token", err);
    }

    return result?.data;
  }

  isTokenExpiredOrEmpty(token?: string) {
    if (!token) {
      return true;
    } else {
      const decodedToken = decode(token) as JwtPayload;
      return decodedToken?.exp && decodedToken.exp < Date.now() / 1000;
    }
  }
}
