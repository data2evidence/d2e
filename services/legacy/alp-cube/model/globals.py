from cube import TemplateContext
import requests
import json

template = TemplateContext()

@template.function('load_single_dataset')
def load_single_dataset():
    client = MyApiClient("example.com")
    return client.load_single_dataset()

@template.function('load_multiple_datasets')
def load_multiple_datasets():
    client = MyApiClient("example.com")
    return client.load_multiple_datasets()

@template.function('get_schemas')
def get_schemas():
    client = MyApiClient("example.com")
    return client.get_schemas()


class MyApiClient:
    def __init__(self, api_url):
        self.api_url = api_url

    def load_multiple_datasets(self):
        # example response from calling an endpoint that retrieves the person_id, gender_source_value columns etc. from the person table
        api_response = {
            "cubes": [
                {
                    "name": "person",
                    "measures": [
                        {"name": "count", "type": "count"}
                    ],
                    "dimensions": [
                        {"name": "person_id", "sql": "person_id", "type": "number"},
                        {"name": "gender_source_value", "sql": "gender_source_value", "type": "number"},
                        {"name": "year_of_birth", "sql": "year_of_birth", "type": "number"},
                        {"name": "month_of_birth", "sql": "month_of_birth", "type": "number"},
                        {"name": "day_of_birth", "sql": "day_of_birth", "type": "number"},
                    ]
                }
            ]
        }
        return api_response

    
    def load_single_dataset(self):
        # example response from calling an endpoint that retrieves some columns from the GDM_RESEARCH_SUBJECT and CONDITION_OCCURRENCE tables
        api_response = {
            "cubes": [
                {
                    "name": "gdm_research_subject",
                    "measures": [
                        {"name": "count", "type": "count"}
                    ],
                    "dimensions": [
                        {"name": "alp_id", "sql": "alp_id", "type": "string", "primary_key": True, "public": True},
                        {"name": "id", "sql": "id", "type": "string"},
                        {"name": "person_id", "sql": "person_id", "type": "number"},
                        {"name": "status", "sql": "status", "type": "string"},
                        {"name": "period_start", "sql": "period_start", "type": "time"},
                        {"name": "period_end", "sql": "period_end", "type": "time"},
                    ]
                },
                {
                    "name": "condition_occurrence",
                    "measures": [
                        {"name": "count", "type": "count"}
                    ],
                    "dimensions": [
                        {"name": "condition_occurrence_id", "sql": "condition_occurrence_id", "type": "number"},
                        {"name": "person_id", "sql": "person_id", "type": "number"},
                        {"name": "condition_concept_id", "sql": "condition_concept_id", "type": "number"},
                        {"name": "condition_start_date", "sql": "condition_start_date", "type": "time"},
                        {"name": "condition_end_date", "sql": "condition_end_date", "type": "time"},
                    ]
                }
            ]
        }
        return api_response
    
    def get_schemas(self):
        # example response from calling an endpoint that retrieves list of schemas in db
        return ["cdmvocab", "cdmdefault"]