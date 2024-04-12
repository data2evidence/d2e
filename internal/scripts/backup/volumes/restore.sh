#!/usr/bin/env bash
DATETIME_STAMP=$1
COMPOSE_PROJECT_NAME=alp
COMPOSE_VERSION=$(docker compose version | awk '{print $NF}' | awk -F- '{print $1}' | sed -e 's/^v//'); echo COMPOSE_VERSION=$COMPOSE_VERSION
SECONDS=0
cd /alp-backup

FILES=($(ls $DATETIME_STAMP*.zst | grep -Ev 'alp_caddy'))
for FILE in ${FILES[@]}; do 
  COMPOSE_VOLUME_NAME=$(echo $FILE | awk -F. '{print $3}')
  echo docker volume rm $COMPOSE_VOLUME_NAME
  echo docker volume create --label com.docker.compose.project=$COMPOSE_PROJECT_NAME --label=com.docker.compose.version=$COMPOSE_VERSION --label com.docker.compose.volume=$VOLUME_NAME $COMPOSE_VOLUME_NAME
  CMD=(vackup import $FILE $COMPOSE_VOLUME_NAME)
  echo . ${CMD[@]}
  ${CMD[@]}
  echo $FILE in $(($SECONDS/60)) minutes | tee private-$DATETIME_STAMP.log
  echo
done
