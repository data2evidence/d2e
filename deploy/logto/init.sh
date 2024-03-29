#! /bin/sh

apk add curl jq

PGPASSWORD=${PG__PASSWORD} psql -h ${PG__HOST} -d ${PG__DB_NAME} -U ${PG__USER} -p ${PG__PORT} -a -f logto/seed.sql

sleep 10

JWT=$(curl -k --location \
  --request POST 'https://host.docker.internal:3001/oidc/token' \
  --header 'Content-Type: application/x-www-form-urlencoded' \
  --data-urlencode 'grant_type=client_credentials' \
  --data-urlencode 'client_id=a560o8tqw79hy2cpn8x1q' \
  --data-urlencode 'client_secret=xk8HP4VDzqJcnXCTpdaQM6Ut2SwrG37u' \
  --data-urlencode 'resource=https://default.logto.app/api' \
  --data-urlencode 'scope=all')
