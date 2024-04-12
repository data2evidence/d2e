# pgdump
- https://dan.langille.org/2013/06/10/using-compression-with-postgresqls-pg_dump/
- https://sqlbak.com/blog/how-to-automate-postgresql-database-backups-in-linux/
- https://www.postgresql.org/docs/current/app-pgdump.html
```bash
DB_NAME=tmp
pg_dump -U postgres -Fc $DB_NAME > $DB_NAME.backup
cat $DB_NAME.backup
```

# backup
To perform a backup with this utility, just call it and specify the destination file:

```bash
DATETIME_STAMP=$(date +%Y%m%dT%H%M)Z;
${CMD[@]} pg_dumpall -U postgres | gzip > $BACKUP_FILE
# CMD=(/usr/bin/time --format "%E" /usr/bin/docker exec -it alp-minerva-postgres-1) # linux
CMD=(/usr/bin/time -h /usr/local/bin/docker exec -it alp-minerva-postgres-1) # macos

for DB_NAME in postgres alp alpdev_pg; do
	BACKUP_FILE=$DATETIME_STAMP.$DB_NAME.sql.gz
	echo $BACKUP_FILE ...
	${CMD[@]} pg_dump -U postgres --format=p --clean --create $DB_NAME | gzip > $BACKUP_FILE
done
```