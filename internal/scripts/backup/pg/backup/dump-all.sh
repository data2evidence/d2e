#!/usr/bin/env bash
# pg_dumpall sql backup

CONTAINER_NAME=alp-minerva-postgres-1
DATETIME_STAMP=$(date +%Y%m%dT%H%M)Z
BACKUP_DIR=/backup
BACKUP_FILE=$BACKUP_DIR/$DATETIME_STAMP.all.sql.gz
docker exec -it $CONTAINER_NAME sh -c "pg_dumpall --verbose -U postgres | gzip > $BACKUP_FILE; ls -lh $BACKUP_FILE"