import requests
import os
import jwt
import json


class OpenIdAPI:
    def __init__(self):

        if os.getenv('SERVICE_ROUTES') is None:
            raise ValueError("SERVICE_ROUTES is undefined")

        if os.getenv('IDP__ALP_DATA__CLIENT_ID') is None:
            raise ValueError("IDP__ALP_DATA__CLIENT_ID is undefined")

        if os.getenv('IDP__ALP_DATA__CLIENT_SECRET') is None:
            raise ValueError("IDP__ALP_DATA__CLIENT_SECRET is undefined")

        if os.getenv('IDP__SCOPE') is None:
            raise ValueError("IDP__SCOPE is undefined")

        if os.getenv("PYTHON_VERIFY_SSL") == 'true' and os.getenv('TLS__INTERNAL__CA_CRT') is None:
            raise ValueError("TLS__INTERNAL__CA_CRT is undefined")

        # Parse SERVICE_ROUTES and get idIssuerUrl
        self.url = json.loads(os.getenv('SERVICE_ROUTES'))["idIssuerUrl"]
        self.clientId = os.getenv('IDP__ALP_DATA__CLIENT_ID')
        self.clientSecret = os.getenv('IDP__ALP_DATA__CLIENT_SECRET')
        self.scope = os.getenv('IDP__SCOPE')
        self.verifySsl = False if os.getenv(
            "PYTHON_VERIFY_SSL") == 'false' else os.getenv('TLS__INTERNAL__CA_CRT')

    def getOptions(self):
        return {
            "Content-Type": "application/json",
        }

    def getSigningKey(self, token):
        jwks_client = jwt.PyJWKClient(f"{self.url}/jwks")
        signing_key = jwks_client.get_signing_key_from_jwt(token)
        return signing_key.key

    def getClientCredentialToken(self) -> str:
        params = {
            'grant_type': "client_credentials",
            'client_id': self.clientId,
            'client_secret': self.clientSecret,
        }

        result = requests.post(
            f"{self.url}/token",
            headers=self.getOptions(),
            verify=self.verifySsl,
            json=params
        )

        if ((result.status_code >= 400) and (result.status_code < 600)):
            raise Exception(
                f"OpenIdAPI Failed to get client credential token, {result.content}")
        else:
            return result.json()['access_token']

    def isTokenExpiredOrEmpty(self, token: str | None):
        if (not token):
            return True

        signing_key = self.getSigningKey(token)
        try:
            jwt.decode(token, signing_key, audience=self.scope,
                       algorithms=["ES384"])
            # Token can be successfully decoded and is still valid.
            return False
        except jwt.ExpiredSignatureError:
            # Token has expired
            return True
