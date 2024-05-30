# Create duckdb database file

After uploading duckdb-plugin in step `docs/2-load/7-load-d2e-plugins.md`
- [D2E-Plugins/duckdb](https://github.com/alp-os/d2e-plugins/tree/main/duckdb)


<h1 id="prog">Creating programatically</h1>

  Run the following commands to create the duckdb files programatically.

  Before running, replace ${BEARER_TOKEN} with user jwt token with admin role
  ```
  docker exec alp-minerva-gateway-1 wget --header="accept: application/json, text/plain, */*" \
    --header="authorization: ${BEARER_TOKEN}" \
    --header="content-type: application/json" \
    --post-data='{"flowRunName":"duckdb file for cdmdefault","flowName":"create-duckdb-file-plugin","deploymentName":"create-duckdb-file-plugin_deployment","params":{"options":{"schemaName":"cdmdefault","databaseCode":"alpdev_pg"}}}' \
    --no-check-certificate \
    --output-document - \
    https://alp-minerva-dataflow-mgmt-1.alp.local:41107/prefect/flow-run/deployment

  docker exec alp-minerva-gateway-1 wget --header="accept: application/json, text/plain, */*" \
    --header="authorization: ${BEARER_TOKEN}" \
    --header="content-type: application/json" \
    --post-data='{"flowRunName":"duckdb file for cdmvocab","flowName":"create-duckdb-file-plugin","deploymentName":"create-duckdb-file-plugin_deployment","params":{"options":{"schemaName":"cdmvocab","databaseCode":"alpdev_pg"}}}' \
    --no-check-certificate \
    --output-document - \
    https://alp-minerva-dataflow-mgmt-1.alp.local:41107/prefect/flow-run/deployment
  ```