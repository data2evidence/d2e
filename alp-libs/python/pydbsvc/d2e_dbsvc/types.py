from pydantic import BaseModel, Field
from typing import Optional
from enum import Enum


class internalPluginType(str, Enum):
    DATAMODEL_PLUGIN = "datamodel_plugin"


class createDataModelType(BaseModel):
    database_code: str = Field(...)
    data_model: str = Field(...)
    schema_name: str = Field(...)
    cleansed_schema_option: bool = Field(default=False)
    dialect: str = Field(...)
    flow_name: str = Field(...)
    changelog_filepath: Optional[str]
    vocab_schema: str = Field(...)


class updateDataModelType(BaseModel):
    database_code: str = Field(...)
    data_model: str = Field(...)
    schema_name: str = Field(...)
    dialect: str = Field(...)
    flow_name: str = Field(...)
    changelog_filepath: Optional[str]
    vocab_schema: str = Field(...)
