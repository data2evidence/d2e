#!/usr/bin/env bash
# vackup all volumes
docker volume ls | grep alp_

DATETIME_STAMP=$(date +%Y%m%dT%H%M)Z;
echo DATETIME_STAMP=$DATETIME_STAMP
VOLUMES=($(docker volume ls -q | grep alp_))
for VOLUME in ${VOLUMES[@]}; do 
  vackup export $VOLUME $DATETIME_STAMP.$VOLUME.tar.zst
done