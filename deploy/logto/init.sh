#! /bin/sh

apk add curl jq

PGPASSWORD=${PG__PASSWORD} psql -h ${PG__HOST} -d ${PG__DB_NAME} -U ${PG__USER} -p ${PG__PORT} -a -f logto/seed.sql

sleep 10

# Authorization header with Basic authentication will include 'scope: all' in the token
# Basic authentication is `clientid:clientsecret` in base64 encoded format
JWT=$(curl -k --location \
  --request POST 'https://host.docker.internal:3001/oidc/token' \
  --header 'Content-Type: application/x-www-form-urlencoded' \
  --header 'Authorization: Basic YTU2MG84dHF3NzloeTJjcG44eDFxOnhrOEhQNFZEenFKY25YQ1RwZGFRTTZVdDJTd3JHMzd1' \
  --data-urlencode 'grant_type=client_credentials' \
  --data-urlencode 'resource=https://default.logto.app/api' \
  --data-urlencode 'scope=all')