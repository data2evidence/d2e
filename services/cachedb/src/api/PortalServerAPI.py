import requests
from config import Env


class PortalServerAPI:
    def __init__(self, token):

        if Env.PYTHON_VERIFY_SSL == 'true' and Env.TLS__INTERNAL__CA_CRT is None:
            raise ValueError(
                "PYTHON_VERIFY_SSL is true but, TLS__INTERNAL__CA_CRT is undefined")

        # Parse SERVICE_ROUTES and get portalServer
        self.url = Env.SERVICE_ROUTES["portalServer"]
        self.verifySsl = False if Env.PYTHON_VERIFY_SSL == 'false' else Env.TLS__INTERNAL__CA_CRT
        self.token = token

    def get_options(self):
        return {
            "Content-Type": "application/json",
            "Authorization": self.token
        }

    def get_dataset(self, dataset_id: str):
        '''
        Returns dataset from input dataset_id
        '''

        params = {
            'datasetId': dataset_id
        }

        result = requests.get(
            f"{self.url}/dataset",
            headers=self.get_options(),
            verify=self.verifySsl,
            params=params
        )
        return result.json()
