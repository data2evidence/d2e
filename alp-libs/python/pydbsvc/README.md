# PyDBSvc

This library transforms alp-db-svc into a pip package and installs it during the building of alp-dataflow-gen.

# How To Use

- To create a data model
```
from d2e_dbsvc import create_datamodel

create_datamodel(
    dialect = "postgres",
    database_code = "alpdev_pg"
    schema_name = "cdmtest",
    data_model = "pathology",
    cleansed_schema_option = False,
    custom_changelog_filepath = "pathology_changelog.xml"
)

```

- To update a data model
```
from d2e_dbsvc import update_datamodel

update_datamodel(
    dialect = "postgres",
    database_code = "alpdev_pg"
    schema_name = "cdmtest",
    data_model = "pathology",
    custom_changelog_filepath = "pathology_changelog.xml"
)
```

- To run a dbsvc command
```
from d2e_dbsvc import run_db_svc_shell_command

run_db_svc_shell_command(
    request_type = "post"
    request_url = "alpdb/exampleroute",
    request_body = {"cleansedSchemaOption": False}
)
```
