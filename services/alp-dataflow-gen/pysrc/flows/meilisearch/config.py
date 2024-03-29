CHUNK_SIZE = 50000

MEILISEARCH_INDEX_GLOBAL_SETTINGS = {
    "faceting": {
        "maxValuesPerFacet": 9999
    },
    "pagination": {
        "maxTotalHits": 999999999
    }}

MEILISEARCH_INDEX_CONFIG = {
    "concept": {
        "meilisearch_primary_key": "concept_id",
        "index_settings": {
            "filterableAttributes": [
                "concept_id",
                "domain_id",
                "vocabulary_id",
                "concept_class_id",
                "standard_concept",
                "invalid_reason",
                "concept_name"
            ],
            **MEILISEARCH_INDEX_GLOBAL_SETTINGS
        }
    },
    "concept_relationship": {
        # primary key does not exist in concept_relationship table
        "meilisearch_primary_key": "meilisearch_id",
        "index_settings": {
            "filterableAttributes": [
                "concept_id_2",
                "invalid_reason",
                "relationship_id"
            ],
            **MEILISEARCH_INDEX_GLOBAL_SETTINGS
        }
    },
    "relationship": {
        # relationship_id primary key is a string with spaces, which is incompatible as a meilisearch primary key
        "meilisearch_primary_key": "meilisearch_id",
        "index_settings": {
            "filterableAttributes": ["relationship_id"],
            **MEILISEARCH_INDEX_GLOBAL_SETTINGS
        }
    },
    "vocabulary": {
        # vocabulary_id primary key is a string with spaces, which is incompatible as a meilisearch primary key
        "meilisearch_primary_key": "meilisearch_id",
        "index_settings": {
            "filterableAttributes": [],
            **MEILISEARCH_INDEX_GLOBAL_SETTINGS
        }
    },
    "concept_synonym": {
        # primary key does not exist in concept_synonym table,
        "meilisearch_primary_key": "meilisearch_id",
        "index_settings": {
            "filterableAttributes": [],
            **MEILISEARCH_INDEX_GLOBAL_SETTINGS
        }
    },
    "concept_class": {
        # concept_class_id primary key is a string with spaces, which is incompatible as a meilisearch primary key
        "meilisearch_primary_key": "meilisearch_id",
        "index_settings": {
            "filterableAttributes": [],
            **MEILISEARCH_INDEX_GLOBAL_SETTINGS
        }
    },
    "domain": {
        # domain_id primary key is a string with spaces, which is incompatible as a meilisearch primary key
        "meilisearch_primary_key": "meilisearch_id",
        "index_settings": {
            "filterableAttributes": [],
            **MEILISEARCH_INDEX_GLOBAL_SETTINGS
        }
    },
    "concept_ancestor": {
        # primary key does not exist in concept_ancestor table
        "meilisearch_primary_key": "meilisearch_id",
        "index_settings": {
            "filterableAttributes": [
                "ancestor_concept_id"
            ],
            **MEILISEARCH_INDEX_GLOBAL_SETTINGS
        }
    },
    "concept_recommended": {
        # domain_id primary key is a string with spaces, which is incompatible as a meilisearch primary key
        "meilisearch_primary_key": "meilisearch_id",
        "index_settings": {
            "filterableAttributes": ["concept_id_1"],
            **MEILISEARCH_INDEX_GLOBAL_SETTINGS
        }
    },
}
