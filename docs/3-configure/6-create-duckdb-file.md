# Create duckdb database file

After uploading duckdb-plugin in step `docs/2-load/7-load-d2e-plugins.md`
- [D2E-Plugins/duckdb](https://github.com/alp-os/d2e-plugins/tree/main/duckdb)

Follow one of the methods below to create duckdb database file
- [Creating via portal](#gui)
- [Creating programatically](#prog)


<h1 id="gui">Creating via portal</h1>

  - open https://localhost:41100/portal
  - Login as primary admin as
  - Select **Admin** mode
  - Navigate to **Jobs**
  - Click **Execute** on **create-duckdb-file-plugin**
  ![Execeute Duckdb Job](../images/duckdb/ExecuteDuckdbJob.png)

  - Enter values to create duckdb database file for cdmdefault
    name | value | note
    --- | --- | ---
    Flow run | eg. duckdb file for cdmdefault | Arbritrary name for flow run
    Flow parameters | { "schemaName": "cdmdefault", "databaseCode": "alpdev_pg" } | Create duckdb database file for cdmdefault schema

    Example:
    ![Duckdb Flow Input](../images/duckdb/DuckdbFlowInput.png)


  ### Repeat steps above with input a different input for **Flow parameters** to create a duckdb database file for cdmvocab
    name | value | note
    --- | --- | ---
    Flow run | | Arbritrary name for flow run
    Flow parameters | { "schemaName": "cdmvocab", "databaseCode": "alpdev_pg" } | Create duckdb database file for cdmvocab schema


<h1 id="prog">Creating programatically</h1>

  Advanced users can use the following commands to create the search indexes programatically.

  Before running, replace ${BEARER_TOKEN} with user jwt token with admin role
  ```
  docker exec alp-minerva-gateway-1 wget --header="accept: application/json, text/plain, */*" \
    --header="authorization: ${BEARER_TOKEN}" \
    --header="content-type: application/json" \
    --post-data='{"flowRunName":"Search index creation for concept","flowName":"create-duckdb-file-plugin","deploymentName":"create-duckdb-file-plugin_deployment","params":{"options":{"schemaName":"cdmdefault","databaseCode":"alpdev_pg"}}}' \
    --no-check-certificate \
    --output-document - \
    https://alp-minerva-dataflow-mgmt-1.alp.local:41107/prefect/flow-run/deployment

  docker exec alp-minerva-gateway-1 wget --header="accept: application/json, text/plain, */*" \
    --header="authorization: ${BEARER_TOKEN}" \
    --header="content-type: application/json" \
    --post-data='{"flowRunName":"Search index creation for concept","flowName":"create-duckdb-file-plugin","deploymentName":"create-duckdb-file-plugin_deployment","params":{"options":{"schemaName":"cdmvocab","databaseCode":"alpdev_pg"}}}' \
    --no-check-certificate \
    --output-document - \
    https://alp-minerva-dataflow-mgmt-1.alp.local:41107/prefect/flow-run/deployment
  ```