from collections import OrderedDict
from prefect import get_run_logger
from datetime import date, datetime
import re
from api.MeilisearchSvcAPI import MeilisearchSvcAPI
from utils.types import Terminology_HybridSearchConfig, meilisearchAddIndexType
from dao.VocabDao import VocabDao
from flows.meilisearch.config import CHUNK_SIZE, MEILISEARCH_INDEX_CONFIG
from itertools import islice
from transformers import AutoTokenizer, AutoModel
import torch
from api.TerminologySvcAPI import TerminologySvcAPI

def execute_add_index_flow(options: meilisearchAddIndexType):
    logger = get_run_logger()
    database_code = options.databaseCode
    vocab_schema_name = options.vocabSchemaName
    table_name = options.tableName

    # Check if options.vocabSchemaName is valid
    if not re.match(r"^\w+$", vocab_schema_name):
        error_message = "VocabSchemaName is invalid"
        logger.error(error_message)
        raise ValueError(error_message)

    # Check if table_name is supported for adding as meilisearch index
    # Case insensitive search on MEILISEARCH_INDEX_CONFIG.keys()
    if table_name.lower() not in MEILISEARCH_INDEX_CONFIG.keys():
        errorMessage = f"table_name:{table_name.lower()} has not been configured for adding as a meilisearch index"
        logger.error(errorMessage)
        raise ValueError(errorMessage)

    index_name = f"{database_code}_{vocab_schema_name}_{table_name}"
    # Initialize helper classes
    meilisearch_svc_api = MeilisearchSvcAPI()
    vocab_dao = VocabDao(database_code, vocab_schema_name)
    # logger.info(f"Getting stream connection")
    conn = vocab_dao.get_stream_connection(yield_per=CHUNK_SIZE)
    try:
        if table_name.lower() == 'concept_synonym':
            
            stream_result_set = vocab_dao.get_stream_result_set_concept_synonym(conn, vocab_schema_name)
            res_dict = dict(stream_result_set)
            for key,value in res_dict.items():
                res_dict[key] = list(set(value.split(',')))
   
            def chunks(data):
                it = iter(data.items())
                for i in range(0, len(data), CHUNK_SIZE):
                    yield dict(islice(it, CHUNK_SIZE))

            concept_table_name = "CONCEPT" if table_name.isupper() else "concept"        
            # Update concept name with synonyms
            index_name = f"{database_code}_{vocab_schema_name}_{concept_table_name}"
            for item in chunks(res_dict):
                logger.info(f"Put concept name with synonyms in meilisearch in chunks of {CHUNK_SIZE}...")
                meilisearch_svc_api.update_synonym_index(index_name, item)
            
            logger.info(
                f"Concepts successfully sent to meilisearch for update")
            return True
        else:
            meilisearch_primary_key = MEILISEARCH_INDEX_CONFIG[table_name.lower()]["meilisearch_primary_key"]
            index_settings = MEILISEARCH_INDEX_CONFIG[table_name.lower(
            )]["index_settings"]
             # Get table information
            table_length = vocab_dao.get_table_length(table_name)
            column_names = vocab_dao.get_column_names(table_name)

            # Add table column names to meilisearch settings as searchableAttributes
            index_settings["searchableAttributes"] = column_names

            # Create meilisearch index
            logger.info(f"Creating meilisearch index with name: {index_name}")
            meilisearch_svc_api.create_index(
                index_name, meilisearch_primary_key)

            logger.info(f"Updating settings for index with name: {index_name}")
            meilisearch_svc_api.update_index_settings(
                index_name, index_settings)

            # Check if meilisearch_primary_key defined in config is in table column_names
            is_meilisearch_primary_key_in_table = meilisearch_primary_key in column_names

            # If meilisearch primary key does not exist for table, add meilisearch_primary_key to column names
            if not is_meilisearch_primary_key_in_table:
                column_names.insert(0, meilisearch_primary_key)
            stream_result_set = vocab_dao.get_stream_result_set(conn, table_name)
            chunk_iteration = 0
            # Iterate through stream_result_set, parse and post data to meilisearch index
            logger.info(f"Posting {table_name} data to meilisearch index in chunks of {CHUNK_SIZE}...")
            for data in stream_result_set.partitions():
                logger.info(
                    f"Progress: {(CHUNK_SIZE*chunk_iteration)+len(data)}/{table_length}")
                # Convert each element in data from sqlalchemy.engine.row.Row to list
                data = [list(row) for row in data]

                # If meilisearch primary key does not exist for table, add running index as primary key to data
                if not is_meilisearch_primary_key_in_table:
                    [row.insert(0, idx+(CHUNK_SIZE*chunk_iteration))
                    for idx, row in enumerate(data)]

                # Parse date/datetime values into formatted string
                data = [parseDates(row) for row in data]

                # Map column names to data for insertion into meilisearch index
                mappedData = [dict(zip(column_names, row))
                            for row in data]

                # Add documents to index
                meilisearch_svc_api.add_documents_to_index(
                    index_name, meilisearch_primary_key, mappedData)
                chunk_iteration += 1

            logger.info(
                f"{table_length} rows successfully sent to meilisearch for indexing")
            return True
    except Exception as err:
        logger.error(err)
        raise err
    finally:
        conn.close()

def execute_add_index_with_embeddings_flow(options: meilisearchAddIndexType):
    logger = get_run_logger()
    database_code = options.databaseCode
    vocab_schema_name = options.vocabSchemaName
    table_name = options.tableName

    # Check if options.vocabSchemaName is valid
    if not re.match(r"^\w+$", vocab_schema_name):
        error_message = "VocabSchemaName is invalid"
        logger.error(error_message)
        raise ValueError(error_message)

    # Check if table_name is supported for adding as meilisearch index
    # Case insensitive search on MEILISEARCH_INDEX_CONFIG.keys()
    if table_name.lower() not in MEILISEARCH_INDEX_CONFIG.keys():
        errorMessage = f"table_name:{table_name.lower()} has not been configured for adding as a meilisearch index"
        logger.error(errorMessage)
        raise ValueError(errorMessage)

    # Initialize helper classes
    meilisearch_svc_api = MeilisearchSvcAPI()
    terminology_svc_api = TerminologySvcAPI()

    config: Terminology_HybridSearchConfig = terminology_svc_api.get_hybridSearchConfig()
    
    hybridSearchName = f"{config.source.replace('/', '')}_{config.model.replace('/', '')}";
    index_name = f"{database_code}_{vocab_schema_name}_{table_name}_{hybridSearchName}"
    
    vocab_dao = VocabDao(database_code, vocab_schema_name)
    # logger.info(f"Getting stream connection")
    conn = vocab_dao.get_stream_connection(yield_per=CHUNK_SIZE)
    try:
        meilisearch_primary_key = MEILISEARCH_INDEX_CONFIG[table_name.lower()]["meilisearch_primary_key"]
        index_settings = MEILISEARCH_INDEX_CONFIG[table_name.lower()]["index_settings"]
        # Get table information
        table_length = vocab_dao.get_table_length(table_name)
        column_names = vocab_dao.get_column_names(table_name)

        # Add table column names to meilisearch settings as searchableAttributes
        index_settings["searchableAttributes"] = column_names
        index_settings["embedders"] = {
                "default": {
                    "source": f"{config.source}",
                    "model": f"{config.model}"
                }
            }

        # Create meilisearch index
        logger.info(f"Creating meilisearch index with name: {index_name}")
        meilisearch_svc_api.create_index(
            index_name, meilisearch_primary_key)

        logger.info(f"Updating settings for index with name: {index_name}")
        meilisearch_svc_api.update_index_settings(
            index_name, index_settings)

        # Check if meilisearch_primary_key defined in config is in table column_names
        is_meilisearch_primary_key_in_table = meilisearch_primary_key in column_names

        # If meilisearch primary key does not exist for table, add meilisearch_primary_key to column names
        if not is_meilisearch_primary_key_in_table:
            column_names.insert(0, meilisearch_primary_key)
        
        #Add _vectors in the list of column_names to store embeddings
        column_names.append("_vectors")
        
        stream_result_set = vocab_dao.get_stream_result_set(conn, table_name)
        chunk_iteration = 0
        # Iterate through stream_result_set, parse and post data to meilisearch index
        logger.info(f"Posting {table_name} data to meilisearch index in chunks of {CHUNK_SIZE}...")
        for data in stream_result_set.partitions():
            logger.info(
                f"Progress: {(CHUNK_SIZE*chunk_iteration)+len(data)}/{table_length}")
            # Convert each element in data from sqlalchemy.engine.row.Row to list
            data = [list(row) for row in data]

            # If meilisearch primary key does not exist for table, add running index as primary key to data
            if not is_meilisearch_primary_key_in_table:
                [row.insert(0, idx+(CHUNK_SIZE*chunk_iteration))
                for idx, row in enumerate(data)]

            # Parse date/datetime values into formatted string
            data = [parseDates(row) for row in data]

            # Calculate embeddings and append them to the row
            data = calculate_embeddings(data)
            
            # Map column names to data for insertion into meilisearch index
            mappedData = [dict(zip(column_names, row))
                        for row in data]

            # Add documents to index
            meilisearch_svc_api.add_documents_to_index(
                index_name, meilisearch_primary_key, mappedData)
            chunk_iteration += 1
    
    except Exception as err:
        logger.error(err)
        raise err
    finally:
        conn.close()

def calculate_embeddings(rows:list[list]):
    
    # Sentences we want sentence embeddings for
    for row in rows:
        sentence = " ".join(str(r) for r in row);
        row.append(sentence)
        
    # Mean Pooling - Take attention mask into account for correct averaging
    def meanpooling(output, mask):
        embeddings = output[0] # First element of model_output contains all token embeddings
        mask = mask.unsqueeze(-1).expand(embeddings.size()).float()
        return torch.sum(embeddings * mask, 1) / torch.clamp(mask.sum(1), min=1e-9)

    # Get configured hyrbid search model
    terminology_svc_api = TerminologySvcAPI()
    config: Terminology_HybridSearchConfig = terminology_svc_api.get_hybridSearchConfig()
   
    # Load model from HuggingFace Hub
    tokenizer = AutoTokenizer.from_pretrained(config.model)
    model = AutoModel.from_pretrained(config.model)

    for row in rows:
        inputs = tokenizer(row[len(row)-1], padding=True, truncation=True, return_tensors='pt')
        # Compute token embeddings
        with torch.no_grad():
            output = model(**inputs)

        # Perform pooling. In this case, mean pooling.
        embeddings = meanpooling(output, inputs['attention_mask'])
        row.pop() # Remove sentences
        row.append(embeddings.tolist()[0]) # Append calculated embeddings

    return rows
    
def parseDates(row):
    result = []
    for element in row:
        if isinstance(element, date):
            datetime_element = datetime.combine(element, datetime.min.time())
            result.append(int(datetime_element.timestamp()))
        elif isinstance(element, datetime):
            result.append(int(element.timestamp()))
        else:
            result.append(element)
    return result

def isDateType(element) -> bool:
    return isinstance(element, date) or isinstance(element, datetime)
