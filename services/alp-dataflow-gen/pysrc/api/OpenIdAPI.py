import requests
import os
import jwt
from datetime import datetime


class OpenIdAPI:
    def __init__(self):
        if os.getenv('IDP__ISSUER_URL') is None:
            raise ValueError("IDP__ISSUER_URL is undefined")

        if os.getenv('IDP__ALP_DATA__CLIENT_ID') is None:
            raise ValueError("IDP__ALP_DATA__CLIENT_ID is undefined")

        if os.getenv('IDP__ALP_DATA__CLIENT_SECRET') is None:
            raise ValueError("IDP__ALP_DATA__CLIENT_SECRET is undefined")

        if os.getenv("PYTHON_VERIFY_SSL") == 'true' and os.getenv('TLS__INTERNAL__CA_CRT') is None:
            raise ValueError("TLS__INTERNAL__CA_CRT is undefined")

        self.url = os.getenv('IDP__ISSUER_URL')
        self.clientId = os.getenv('IDP__ALP_DATA__CLIENT_ID')
        self.clientSecret = os.getenv('IDP__ALP_DATA__CLIENT_SECRET')
        self.verifySsl = False if os.getenv(
            "PYTHON_VERIFY_SSL") == 'false' else os.getenv('TLS__INTERNAL__CA_CRT')

    def getOptions(self):
        return {
            "Content-Type": "application/json",
        }

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

        decodedToken = jwt.decode(token, options={'verify_signature': False})
        return int(datetime.now().timestamp()) > decodedToken['exp']
