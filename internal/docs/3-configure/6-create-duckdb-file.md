# Create duckdb database file

After uploading duckdb-plugin in step `docs/2-load/5-load-d2e-plugins.md`

- [D2E-Plugins/duckdb](https://github.com/data2evidence/d2e-flows/tree/main/flows/create_cachedb_file_plugin)

<h1 id="prog">Creating programatically</h1>

Run the following commands to create the duckdb files programatically.

Before running, replace ${BEARER_TOKEN} with user jwt token with admin role

```
docker exec alp-minerva-gateway-1 wget --header="accept: application/json, text/plain, */*" \
  --header="authorization: ${BEARER_TOKEN}" \
  --header="content-type: application/json" \
  --post-data='{"flowRunName":"duckdb file for cdmdefault","flowName":"create-cachedb-file-plugin","deploymentName":"create-cachedb-file-plugin_deployment","params":{"options":{"schemaName":"cdmdefault","databaseCode":"alpdev_pg"}}}' \
  --no-check-certificate \
  --output-document - \
  https://alp-minerva-dataflow-mgmt-1.alp.local:41107/prefect/flow-run/deployment

docker exec alp-minerva-gateway-1 wget --header="accept: application/json, text/plain, */*" \
  --header="authorization: ${BEARER_TOKEN}" \
  --header="content-type: application/json" \
  --post-data='{"flowRunName":"duckdb file for cdmvocab","flowName":"create-cachedb-file-plugin","deploymentName":"create-cachedb-file-plugin_deployment","params":{"options":{"schemaName":"cdmvocab","databaseCode":"alpdev_pg"}}}' \
  --no-check-certificate \
  --output-document - \
  https://alp-minerva-dataflow-mgmt-1.alp.local:41107/prefect/flow-run/deployment
```
