# Create meilisearch indexes

D2E requires the following tables from the OMOP concept schema to have meilisearch indexes created for concept set functionality to work

- concept
- concept_relationship
- relationship
- vocabulary
- concept_synonym
- concept_class
- domain
- concept_ancestor
- concept_recommended

Follow the steps below to create search indexes for the following tables mentioned above

After uploading meilisearch-plugin in step `docs/2-load/7-load-d2e-plugins.md`

- [D2E-Plugins/meilisearch](https://github.com/alp-os/d2e-plugins/tree/main/meilisearch)

<h1 id="prog">Creating programatically </h1>

Run the following commands to create the search indexes programatically.

Before running, replace ${BEARER_TOKEN} with user jwt token with admin role

```
docker exec alp-minerva-gateway-1 wget --header="accept: application/json, text/plain, */*" \
  --header="authorization: ${BEARER_TOKEN}" \
  --header="content-type: application/json" \
  --post-data='{"flowRunName":"Search index creation for concept","flowName":"add-search-index-plugin","deploymentName":"add-search-index-plugin_deployment","params":{"options":{"tableName":"concept","databaseCode":"alpdev_pg","vocabSchemaName":"cdmvocab"}}}' \
  --no-check-certificate \
  --output-document - \
  https://alp-minerva-dataflow-mgmt-1.alp.local:41107/prefect/flow-run/deployment

docker exec alp-minerva-gateway-1 wget --header="accept: application/json, text/plain, */*" \
  --header="authorization: ${BEARER_TOKEN}" \
  --header="content-type: application/json" \
  --post-data='{"flowRunName":"Search index creation for concept_relationship","flowName":"add-search-index-plugin","deploymentName":"add-search-index-plugin_deployment","params":{"options":{"tableName":"concept_relationship","databaseCode":"alpdev_pg","vocabSchemaName":"cdmvocab"}}}' \
  --no-check-certificate \
  --output-document - \
  https://alp-minerva-dataflow-mgmt-1.alp.local:41107/prefect/flow-run/deployment

docker exec alp-minerva-gateway-1 wget --header="accept: application/json, text/plain, */*" \
  --header="authorization: ${BEARER_TOKEN}" \
  --header="content-type: application/json" \
  --post-data='{"flowRunName":"Search index creation for relationship","flowName":"add-search-index-plugin","deploymentName":"add-search-index-plugin_deployment","params":{"options":{"tableName":"relationship","databaseCode":"alpdev_pg","vocabSchemaName":"cdmvocab"}}}' \
  --no-check-certificate \
  --output-document - \
  https://alp-minerva-dataflow-mgmt-1.alp.local:41107/prefect/flow-run/deployment

docker exec alp-minerva-gateway-1 wget --header="accept: application/json, text/plain, */*" \
  --header="authorization: ${BEARER_TOKEN}" \
  --header="content-type: application/json" \
  --post-data='{"flowRunName":"Search index creation for vocabulary","flowName":"add-search-index-plugin","deploymentName":"add-search-index-plugin_deployment","params":{"options":{"tableName":"vocabulary","databaseCode":"alpdev_pg","vocabSchemaName":"cdmvocab"}}}' \
  --no-check-certificate \
  --output-document - \
  https://alp-minerva-dataflow-mgmt-1.alp.local:41107/prefect/flow-run/deployment

docker exec alp-minerva-gateway-1 wget --header="accept: application/json, text/plain, */*" \
  --header="authorization: ${BEARER_TOKEN}" \
  --header="content-type: application/json" \
  --post-data='{"flowRunName":"Search index creation for concept_synonym","flowName":"add-search-index-plugin","deploymentName":"add-search-index-plugin_deployment","params":{"options":{"tableName":"concept_synonym","databaseCode":"alpdev_pg","vocabSchemaName":"cdmvocab"}}}' \
  --no-check-certificate \
  --output-document - \
  https://alp-minerva-dataflow-mgmt-1.alp.local:41107/prefect/flow-run/deployment

docker exec alp-minerva-gateway-1 wget --header="accept: application/json, text/plain, */*" \
  --header="authorization: ${BEARER_TOKEN}" \
  --header="content-type: application/json" \
  --post-data='{"flowRunName":"Search index creation for concept_class","flowName":"add-search-index-plugin","deploymentName":"add-search-index-plugin_deployment","params":{"options":{"tableName":"concept_class","databaseCode":"alpdev_pg","vocabSchemaName":"cdmvocab"}}}' \
  --no-check-certificate \
  --output-document - \
  https://alp-minerva-dataflow-mgmt-1.alp.local:41107/prefect/flow-run/deployment

docker exec alp-minerva-gateway-1 wget --header="accept: application/json, text/plain, */*" \
  --header="authorization: ${BEARER_TOKEN}" \
  --header="content-type: application/json" \
  --post-data='{"flowRunName":"Search index creation for domain","flowName":"add-search-index-plugin","deploymentName":"add-search-index-plugin_deployment","params":{"options":{"tableName":"domain","databaseCode":"alpdev_pg","vocabSchemaName":"cdmvocab"}}}' \
  --no-check-certificate \
  --output-document - \
  https://alp-minerva-dataflow-mgmt-1.alp.local:41107/prefect/flow-run/deployment

docker exec alp-minerva-gateway-1 wget --header="accept: application/json, text/plain, */*" \
  --header="authorization: ${BEARER_TOKEN}" \
  --header="content-type: application/json" \
  --post-data='{"flowRunName":"Search index creation for concept_ancestor","flowName":"add-search-index-plugin","deploymentName":"add-search-index-plugin_deployment","params":{"options":{"tableName":"concept_ancestor","databaseCode":"alpdev_pg","vocabSchemaName":"cdmvocab"}}}' \
  --no-check-certificate \
  --output-document - \
  https://alp-minerva-dataflow-mgmt-1.alp.local:41107/prefect/flow-run/deployment

docker exec alp-minerva-gateway-1 wget --header="accept: application/json, text/plain, */*" \
  --header="authorization: ${BEARER_TOKEN}" \
  --header="content-type: application/json" \
  --post-data='{"flowRunName":"Search index creation for concept_recommended","flowName":"add-search-index-plugin","deploymentName":"add-search-index-plugin_deployment","params":{"options":{"tableName":"concept_recommended","databaseCode":"alpdev_pg","vocabSchemaName":"cdmvocab"}}}' \
  --no-check-certificate \
  --output-document - \
  https://alp-minerva-dataflow-mgmt-1.alp.local:41107/prefect/flow-run/deployment
```
