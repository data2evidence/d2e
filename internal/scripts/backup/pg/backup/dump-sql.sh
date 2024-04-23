#!/usr/bin/env bash
# pg_dump sql backup

CONTAINER_NAME=alp-minerva-postgres-1
DATETIME_STAMP=$(date +%Y%m%dT%H%M)Z
BACKUP_DIR=/backup
CMD=(docker exec -it alp-minerva-postgres-1)

for DB_NAME in postgres alp alpdev_pg; do
	BACKUP_FILE=$BACKUP_DIR/$DATETIME_STAMP.$DB_NAME.sql.gz
	echo $BACKUP_FILE ...
	${CMD[@]} sh -c "pg_dump -U postgres --format=p --clean --create $DB_NAME | gzip > $BACKUP_FILE; ls -lh $BACKUP_FILE"
done