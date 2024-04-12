#!/usr/bin/env bash
# vackup all docker volumes

GIT_BASE_DIR="$(git rev-parse --show-toplevel)"
cd $GIT_BASE_DIR/cache/vackup

DATETIME_STAMP=$(date +%Y%m%dT%H%M)Z;
echo DATETIME_STAMP=$DATETIME_STAMP
echo

docker volume ls | grep alp_
echo

VOLUMES=($(docker volume ls -q | grep alp_))
for VOLUME in ${VOLUMES[@]}; do
  SECONDS=0
  vackup export $VOLUME $DATETIME_STAMP.$VOLUME.tar.zst
  echo $FILE in $(($SECONDS/60)) minutes | tee -a private-$DATETIME_STAMP.log
  echo
done