import json
import requests
import os

def GetAlpStudySchema(token):
    res = json.loads(
        requests.post(
            os.environ["PORTAL__API_URL"],
            headers={
                "Authorization": f"Bearer {token}"
            },
            json={
                "query": "query { studiesRaw { id databaseName schemaName tokenStudyCode studySystem { id name } } }"
            },
        ).text
    )["data"]["studiesRaw"]
    return res

def GetDatasetsPortalStandalone(token):
    dataset_url = os.environ['SYSTEM_PORTAL__API_URL' + 'dataset/list?role=systemAdmin'
    response = requests.get(
        dataset_url,
        headers={
            "Authorization": f"Bearer {token}"
        },
        verify=(False if os.getenv("PYTHON_VERIFY_SSL") == 'false' else True)
    )
    return response.json()
