# HowTo: Docker Compose yaml parse

## anchors & aliases
- https://docs.docker.com/compose/compose-file/10-fragments/
- https://mikefarah.gitbook.io/yq/operators/anchor-and-alias-operators
- yaml anchors and aliases create re-usable blocks for docker-compose
- to validate merged, expanded, envsubst version:
```bash
bash -c "set -o allexport; source .env.local; yq eval-all --from-file internal/scripts/expand.yq docker-compose.yml docker-compose-local.yml" | yq -P 'sort_keys(..)' | tee private.yq.yml
```
- docker compose provides shows internal representation. caveat: some sections maybe missing
```bash
docker compose --env-file .env.local --file docker-compose.yml --file docker-compose-local.yml config | yq -P 'sort_keys(..)' | tee private.dc.yml
```

## grep 
- set DC_FILE
```bash
DC_FILE=docker-compose.yml
DC_FILE=docker-compose-local.yml
```
- by serviceName
```bash
echo DC_FILE=$DC_FILE; cat $DC_FILE | yq -r '.services.* | (path | .[-1]) + " " + (.networks | @yaml | @json)' 
echo DC_FILE=$DC_FILE; cat $DC_FILE | yq -r '.services.* | (path | .[-1]) + " " + (.volumes | @yaml | @json)' 
echo DC_FILE=$DC_FILE; yq '.services | with_entries(select(.key|test("alp-dataflow-gen-agent|alp-dataflow-gen"))) | .* | (path | .[-1]) + " " + (.networks | @yaml | @json)' $DC_FILE
for DC_FILE in docker-compose.yml docker-compose-local.yml; do echo DC_FILE=$DC_FILE; yq '.services | with_entries(select(.key|test("alp-dataflow-gen-agent|alp-dataflow-gen"))) | .* | (path | .[-1]) + " " + (.networks | @yaml | @json)' $DC_FILE; done
```
- by prop
```bash
cat $DC_FILE | yq -o props '.services.*' | grep -E "container_name|volumes"
```

## ports in use
```
export BASE_PORT=1
grep -oP "http.*${BASE_PORT:-1}.*" docker-compose.yml | envsubst | sort -u | awk -F: '{print $3}' | awk -F/ '{print $1}' | sed -e 's/"//' -e 's/,//' | sort -u
```
