import requests
from env import env


class PortalServerAPI:
    def __init__(self, token):

        if env["PYTHON_VERIFY_SSL"] == 'true' and env["TLS__INTERNAL__CA_CRT"] is None:
            raise ValueError(
                "PYTHON_VERIFY_SSL is true but, TLS__INTERNAL__CA_CRT is undefined")

        # Parse SERVICE_ROUTES and get portalServer
        self.url = env["SERVICE_ROUTES"]["portalServer"]
        self.verifySsl = False if env["PYTHON_VERIFY_SSL"] == 'false' else env["TLS__INTERNAL__CA_CRT"]
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

        result = requests.get(
            f"{self.url}/dataset/{dataset_id}",
            headers=self.get_options(),
            verify=self.verifySsl,
        )
        return result.json()
