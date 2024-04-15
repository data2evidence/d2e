from pydantic import BaseModel, Field
from typing import Optional, Dict
from enum import Enum


class requestType(str, Enum):
    GET = "get"
    POST = "post"
    PUT = "put"
    DELETE = "delete"


class internalPluginType(str, Enum):
    DATAMODEL_PLUGIN = "data_management_plugin"


class dataModelBase(BaseModel):
    database_code: str = Field(...)
    data_model: str = Field(...)
    schema_name: str = Field(...)
    dialect: str = Field(...)
    flow_name: str = Field(...)
    changelog_filepath: Optional[str]


class createDataModelType(dataModelBase):
    cleansed_schema_option: bool = Field(default=False)
    vocab_schema: str = Field(...)
    update_count: int = Field(default=0)


class updateDataModelType(dataModelBase):
    vocab_schema: str = Field(...)


class rollbackCountType(dataModelBase):
    rollback_count: int = Field(...)


class rollbackTagType(dataModelBase):
    rollback_tag: str = Field(...)


class createSnapshotType(dataModelBase):
    source_schema: str
    snapshot_copy_config: Dict


class createParquetSnapshotType(dataModelBase):
    source_schema: str
    snapshot_copy_config: Dict


class questionnaireDefinitionType(dataModelBase):
    questionnaire_definition: Dict


class questionnaireResponseType(dataModelBase):
    questionnaire_id: str
