import requests
import os
import json


class AnalyticsSvcAPI:
    def __init__(self, token):
        if os.getenv('ANALYTICS_SVC__API_BASE_URL') is None:
            raise ValueError("ANALYTICS_SVC__API_BASE_URL is undefined")
        if os.getenv("PYTHON_VERIFY_SSL") == 'true' and os.getenv('TLS__INTERNAL__CA_CRT') is None:
            raise ValueError("TLS__INTERNAL__CA_CRT is undefined")
        self.url = os.getenv('ANALYTICS_SVC__API_BASE_URL')
        self.token = token
        self.verifySsl = False if os.getenv(
            "PYTHON_VERIFY_SSL") == 'false' else os.getenv('TLS__INTERNAL__CA_CRT')

    def getOptions(self):
        return {
            "Authorization": self.token
        }

    def create_cohort_definition(self, datasetId: str,
                                 description: str,
                                 owner: str,
                                 syntax: str,
                                 name: str) -> int:
        url = f"{self.url}api/services/cohort-definition"
        headers = self.getOptions()
        data = {
            "studyId": datasetId,
            "name": name,
            "description": description,
            "owner": owner,
            "syntax": syntax
        }
        result = requests.post(
            url,
            headers=headers,
            json=data,
            verify=self.verifySsl
        )
        if ((result.status_code >= 400) and (result.status_code < 600)):
            raise Exception(
                f"AnalyticsSvcAPI Failed to create create_cohort_definition schema, {result.content}")
        else:
            cohortDefinitionId = json.loads(result.content)['data']
            return cohortDefinitionId
