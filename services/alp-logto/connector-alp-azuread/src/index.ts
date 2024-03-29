import { assert, conditional } from "@silverhand/essentials";
import { got, HTTPError } from "got";
import { jwtDecode } from "jwt-decode";
import path from "node:path";

import type {
  AuthorizationCodeRequest,
  AuthorizationUrlRequest,
} from "@azure/msal-node";
import {
  ConfidentialClientApplication,
  CryptoProvider,
} from "@azure/msal-node";
import type {
  GetAuthorizationUri,
  GetUserInfo,
  GetConnectorConfig,
  CreateConnector,
  SocialConnector,
} from "@logto/connector-kit";
import {
  ConnectorError,
  ConnectorErrorCodes,
  validateConfig,
  ConnectorType,
  parseJson,
} from "@logto/connector-kit";

import {
  scopes,
  defaultMetadata,
  defaultTimeout,
  graphAPIEndpoint,
} from "./constant.js";
import type { AzureADConfig } from "./types.js";
import {
  azureADConfigGuard,
  accessTokenResponseGuard,
  userInfoResponseGuard,
  authResponseGuard,
} from "./types.js";

// eslint-disable-next-line @silverhand/fp/no-let
let authCodeRequest: AuthorizationCodeRequest;

// This `cryptoProvider` seems not used.
// Temporarily keep this as this is a refactor, which should not change the logics.
const cryptoProvider = new CryptoProvider();

const getAuthorizationUri =
  (getConfig: GetConnectorConfig): GetAuthorizationUri =>
  async ({ state, redirectUri }) => {
    const config = await getConfig(defaultMetadata.id);

    validateConfig(config, azureADConfigGuard);
    const { clientId, clientSecret, cloudInstance, tenantId } = config;

    const defaultAuthCodeUrlParameters: AuthorizationUrlRequest = {
      scopes,
      state,
      redirectUri,
    };

    const clientApplication = new ConfidentialClientApplication({
      auth: {
        clientId,
        clientSecret,
        authority: new URL(path.join(cloudInstance, tenantId)).toString(),
      },
    });

    const authCodeUrlParameters = {
      ...defaultAuthCodeUrlParameters,
    };

    const authCodeUrl = await clientApplication.getAuthCodeUrl(
      authCodeUrlParameters
    );

    return authCodeUrl;
  };

const getAccessToken = async (
  config: AzureADConfig,
  code: string,
  redirectUri: string
) => {
  const codeRequest: AuthorizationCodeRequest = {
    ...authCodeRequest,
    redirectUri,
    scopes: ["User.Read"],
    code,
  };

  const { clientId, clientSecret, cloudInstance, tenantId } = config;

  const clientApplication = new ConfidentialClientApplication({
    auth: {
      clientId,
      clientSecret,
      authority: new URL(path.join(cloudInstance, tenantId)).toString(),
    },
  });

  const authResult = await clientApplication.acquireTokenByCode(codeRequest);

  await assignLogtoRolesByAzureGroups(
    authResult.idToken,
    authResult.accessToken
  );

  const result = accessTokenResponseGuard.safeParse(authResult);

  if (!result.success) {
    throw new ConnectorError(ConnectorErrorCodes.InvalidResponse, result.error);
  }

  const { accessToken } = result.data;

  assert(
    accessToken,
    new ConnectorError(ConnectorErrorCodes.SocialAuthCodeInvalid)
  );

  return { accessToken };
};

const assignLogtoRolesByAzureGroups = async (
  idToken: string,
  accessToken: string
) => {
  // decode id token
  const decodedIdToken: any = jwtDecode(idToken);
  const decodedAccessToken: any = jwtDecode(accessToken);

  // check groups and compare with env
  const azureGroups = decodedIdToken["groups"];
  const rolesGroupMap = JSON.parse(process.env.LOGTO_ROLES_AZ_GROUPS_MAPPING!);
  const eligibleLogtoRoles = Object.keys(rolesGroupMap).filter(
    (role) => azureGroups.indexOf(rolesGroupMap[role]) > -1
  );

  const email = decodedAccessToken["email"] || decodedAccessToken["upn"]; // For D4L & MS
  const logtoAPItoken: any = await getM2MLogtoAPIToken();
  const logtoUserID: any = await getLogtoUserId(email, logtoAPItoken);

  if (logtoUserID) {
    const logtoRoles = await getLogtoRoles(logtoAPItoken);
    const toBeAssignedLogtoRoles = logtoRoles.filter(
      (role: any) => eligibleLogtoRoles.indexOf(role.name) > -1
    );
    // console.log(`TO BE ASSIGNED LOGTO ROLES ${JSON.stringify(toBeAssignedLogtoRoles)}`);
    toBeAssignedLogtoRoles.forEach(async (logtoRole: any) => {
      await assignRolesToUser(logtoRole.id, logtoUserID, logtoAPItoken);
    });
  }
};

const getM2MLogtoAPIToken = async () => {
  try {
    const httpResponse = await got.post(`${process.env.ENDPOINT}/oidc/token`, {
      form: {
        grant_type: "client_credentials",
        client_id: process.env.LOGTO_API_M2M_CLIENT_ID,
        client_secret: process.env.LOGTO_API_M2M_CLIENT_SECRET,
        resource: "https://default.logto.app/api",
        scope: "all",
      },
      headers: {
        "content-type": "application/x-www-form-urlencoded",
      },
      timeout: { request: defaultTimeout },
      https: {
        rejectUnauthorized: false,
      },
    });

    // console.log(`API TOKEN ${JSON.stringify(httpResponse.body)}`);

    return JSON.parse(httpResponse.body).access_token!;
  } catch (e) {
    console.error(e);
  }
};

const getLogtoUserId = async (email: string, apiToken: string) => {
  try {
    const httpResponse = await got.get(`${process.env.ENDPOINT}/api/users`, {
      searchParams: {
        search: email,
      },
      headers: {
        authorization: `Bearer ${apiToken}`,
      },
      timeout: { request: defaultTimeout },
      https: {
        rejectUnauthorized: false,
      },
    });

    // console.log(`Logto USER INFO ${JSON.stringify(httpResponse.body)}`);

    return JSON.parse(httpResponse.body)[0].id!;
  } catch (e) {
    console.error(e);
  }
};

const getLogtoRoles = async (apiToken: string) => {
  try {
    const httpResponse = await got.get(`${process.env.ENDPOINT}/api/roles`, {
      headers: {
        authorization: `Bearer ${apiToken}`,
      },
      timeout: { request: defaultTimeout },
      https: {
        rejectUnauthorized: false,
      },
    });

    // console.log(`Logto Roles ${JSON.stringify(httpResponse.body)}`);

    return JSON.parse(httpResponse.body);
  } catch (e) {
    console.error(e);
  }
};

const assignRolesToUser = async (
  roleId: string,
  userId: string,
  apiToken: string
) => {
  try {
    console.log(`assignRolesToUser roleid ${roleId}, userId ${userId}`);
    const httpResponse = await got.post(
      `${process.env.ENDPOINT}/api/roles/${roleId}/users`,
      {
        headers: {
          authorization: `Bearer ${apiToken}`,
          "content-type": "application/json",
        },
        json: {
          userIds: [userId],
        },
        timeout: { request: defaultTimeout },
        https: {
          rejectUnauthorized: false,
        },
      }
    );

    // console.log(`Logto Roles assignment ${JSON.stringify(httpResponse)}`);
  } catch (e) {
    console.error(e);
  }
};

const getUserInfo =
  (getConfig: GetConnectorConfig): GetUserInfo =>
  async (data) => {
    const { code, redirectUri } = await authorizationCallbackHandler(data);

    // Temporarily keep this as this is a refactor, which should not change the logics.
    const config = await getConfig(defaultMetadata.id);
    validateConfig(config, azureADConfigGuard);

    const { accessToken } = await getAccessToken(config, code, redirectUri);

    // throw new Error("asdfasdfasdfasdfsd")

    try {
      const httpResponse = await got.get(graphAPIEndpoint, {
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
        timeout: { request: defaultTimeout },
      });

      const result = userInfoResponseGuard.safeParse(
        parseJson(httpResponse.body)
      );

      if (!result.success) {
        throw new ConnectorError(
          ConnectorErrorCodes.InvalidResponse,
          result.error
        );
      }

      const { id, mail, displayName } = result.data;

      return {
        id,
        email: conditional(mail),
        name: conditional(displayName),
      };
    } catch (error: unknown) {
      if (error instanceof HTTPError) {
        const { statusCode, body: rawBody } = error.response;

        if (statusCode === 401) {
          throw new ConnectorError(
            ConnectorErrorCodes.SocialAccessTokenInvalid
          );
        }

        throw new ConnectorError(
          ConnectorErrorCodes.General,
          JSON.stringify(rawBody)
        );
      }

      throw error;
    }
  };

const authorizationCallbackHandler = async (parameterObject: unknown) => {
  const result = authResponseGuard.safeParse(parameterObject);

  if (!result.success) {
    throw new ConnectorError(
      ConnectorErrorCodes.General,
      JSON.stringify(parameterObject)
    );
  }

  return result.data;
};

const createAzureAdConnector: CreateConnector<SocialConnector> = async ({
  getConfig,
}) => {
  return {
    metadata: defaultMetadata,
    type: ConnectorType.Social,
    configGuard: azureADConfigGuard,
    getAuthorizationUri: getAuthorizationUri(getConfig),
    getUserInfo: getUserInfo(getConfig),
  };
};

export default createAzureAdConnector;
