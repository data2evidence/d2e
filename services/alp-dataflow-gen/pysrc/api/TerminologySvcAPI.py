import requests
import os

class TerminologySvcAPI:
    def __init__(self, token):
        if os.getenv('TERMINOLOGY_SVC__API_BASE_URL') is None:
            raise ValueError("TERMINOLOGY_SVC__API_BASE_URL is undefined")
        if os.getenv("PYTHON_VERIFY_SSL") == 'true' and os.getenv('TLS__INTERNAL__CA_CRT') is None:
            raise ValueError("TLS__INTERNAL__CA_CRT is undefined")
        self.url = os.getenv('TERMINOLOGY_SVC__API_BASE_URL')
        self.token = token
        self.verifySsl = False if os.getenv(
            "PYTHON_VERIFY_SSL") == 'false' else os.getenv('TLS__INTERNAL__CA_CRT')

    def getOptions(self):
        return {
            "Authorization": self.token
        }

    def get_hybridSearchConfig(self):
        url = f"{self.url}hybrid-search-config"
        headers = self.getOptions()
        result = requests.get(
            url,
            headers=headers,
            verify=self.verifySsl
        )
        if ((result.status_code >= 400) and (result.status_code < 600)):
            raise Exception(
                f"TerminologySvcAPI Failed to get hybrid search config, {result.content}")
        else:
            hybridSearchConfig = result.json()
            return hybridSearchConfig