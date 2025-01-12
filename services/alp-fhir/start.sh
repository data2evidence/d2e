#!/bin/bash
envsubst < config.json | jq '.database.port |= tonumber | .redis.port |= tonumber' > temp.json
cp temp.json /home/docker/app/medplum/packages/server/medplum.config.json

node --require ./packages/server/dist/otel/instrumentation.js packages/server/dist/index.js