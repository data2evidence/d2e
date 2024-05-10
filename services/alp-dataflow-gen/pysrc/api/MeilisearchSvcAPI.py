import requests
import os
import json
from typing import Union
from api.OpenIdAPI import OpenIdAPI


class MeilisearchSvcAPI:
    def __init__(self):
        if os.getenv('MEILISEARCH_SVC__API_BASE_URL') is None:
            raise ValueError("MEILISEARCH_SVC__API_BASE_URL is undefined")
        if os.getenv("PYTHON_VERIFY_SSL") == 'true' and os.getenv('TLS__INTERNAL__CA_CRT') is None:
            raise ValueError("TLS__INTERNAL__CA_CRT is undefined")
        self.url = os.getenv('MEILISEARCH_SVC__API_BASE_URL')
        self.openIdAPI = OpenIdAPI()
        self.token = None
        self.verifySsl = False if os.getenv(
            "PYTHON_VERIFY_SSL") == 'false' else os.getenv('TLS__INTERNAL__CA_CRT')

    def getOptions(self):
        # Get new client credential token if it is empty or has expired
        if self.openIdAPI.isTokenExpiredOrEmpty(self.token):
            self.token = self.openIdAPI.getClientCredentialToken()

        return {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {self.token}"
        }

    def create_index(self, index_name: str, primary_key: str):
        url = f"{self.url}indexes"

        headers = self.getOptions()
        result = requests.post(
            url,
            headers=headers,
            verify=self.verifySsl,
            json={"uid": index_name, "primaryKey": primary_key}
        )
        if ((result.status_code >= 400) and (result.status_code < 600)):
            raise Exception(
                f"MeilisearchAPI Failed to create index:{index_name}, {result.content}")

        return result

    def update_index_settings(self, index_name: str, settings: dict):
        url = f"{self.url}indexes/{index_name}/settings"

        headers = self.getOptions()
        result = requests.patch(
            url,
            headers=headers,
            verify=self.verifySsl,
            json=settings
        )
        if ((result.status_code >= 400) and (result.status_code < 600)):
            raise Exception(
                f"MeilisearchAPI Failed to update settings for:{index_name}, {result.content}")

        return result

    def add_documents_to_index(self, index_name: str, primary_key: Union[str, int], documents: []):
        url = f"{self.url}indexes/{index_name}/documents?primaryKey={primary_key}"

        headers = self.getOptions()
        result = requests.put(
            url,
            headers=headers,
            verify=self.verifySsl,
            json=documents
        )
        if ((result.status_code >= 400) and (result.status_code < 600)):
            raise Exception(
                f"MeilisearchAPI Failed add document to index:{index_name}, {result.content}")

        return result

    def update_synonym_index(self, index_name: str, documents):
        url = f"{self.url}indexes/{index_name}/settings/synonyms"

        headers = self.getOptions()
        result = requests.put(
            url,
            headers=headers,
            verify=self.verifySsl,
            json=documents
        )
        if ((result.status_code >= 400) and (result.status_code < 600)):
            raise Exception(
                f"MeilisearchAPI Failed to update concept table index:{index_name} with synonyms. {result.content}")
