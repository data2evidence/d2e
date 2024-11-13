#!/usr/bin/env bash
# pg_dump directory compressed backup
# https://www.postgresql.org/docs/current/app-pgdump.html

CONTAINER_NAME=alp-minerva-postgres-1
DATETIME_STAMP=$(date +%Y%m%dT%H%M)Z
BACKUP_DIR=/backup
CMD=(docker exec -t alp-minerva-postgres-1)

for DB_NAME in postgres alp alpdev_pg; do
	BACKUP_FILE=$BACKUP_DIR/$DATETIME_STAMP.$DB_NAME
	echo $BACKUP_FILE ...
	${CMD[@]} sh -c "pg_dump -U postgres --format=d --compress=9 --clean --create --dbname $DB_NAME --file $BACKUP_FILE; ls -lh $BACKUP_FILE"
done