# pgrestore
- https://www.postgresql.org/docs/current/app-pgrestore.html
- https://www.postgresql.org/docs/current/app-psql.html
- supports selective restore

# Setup
- Start PG container with logs to stdout
```bash
cd ~/backup
DB_NAME=tmp
BACKUP_FILE=$DB_NAME.backup
COMPOSE_PROJECT_NAME=alp-data-node
CONTAINER_BACKUP_DIR=/backup
CONTAINER_NAME=alp-minerva-postgres-1
VOLUME_NAME=pg-minerva-data-1
COMPOSE_VOLUME_NAME=${COMPOSE_PROJECT_NAME}_${VOLUME_NAME}
```
# Backup
```
docker run --workdir /backup -v ./:$CONTAINER_BACKUP_DIR -v $COMPOSE_VOLUME_NAME:/var/lib/postgresql/data --name $CONTAINER_NAME postgres:15-alpine
```
- dumped a database called tmp into a custom-format dump file:
```bash
CMD=(/usr/bin/time -h docker exec -it alp-minerva-postgres-1)
${CMD[@]} pg_dump --compress=9 -U postgres -Fc $DB_NAME -f $CONTAINER_BACKUP_DIR/$BACKUP_FILE
```
# Restore to same DB Name
- drop connections
```bash
${CMD[@]} psql -U postgres -c "SELECT pg_terminate_backend(pg_stat_activity.pid) FROM pg_stat_activity WHERE pg_stat_activity.datname in ('$DB_NAME')";
${CMD[@]} dropdb -U postgres $DB_NAME
```
- To drop the database and recreate it from the dump:
```bash
echo $BACKUP_FILE 
${CMD[@]} pg_restore --verbose --verbose -U postgres --format c -C -d postgres $CONTAINER_BACKUP_DIR/$BACKUP_FILE
${CMD[@]} cat $CONTAINER_BACKUP_DIR/$BACKUP_FILE
```
- The database named in the -d switch can be any database existing in the cluster; pg_restore only uses it to issue the CREATE DATABASE command for tmp. With -C, data is always restored into the database name that appears in the dump file.

# To restore the dump into a new database called newdb:
```bash
DB_NAME=tmp2
${CMD[@]} dropdb -U postgres $DB_NAME
${CMD[@]} createdb -U postgres -T template0 $DB_NAME
${CMD[@]} pg_restore --verbose --verbose -U postgres -d $DB_NAME $BACKUP_FILE
```
- Notice we don't use -C, and instead connect directly to the database to be restored into. Also note that we clone the new database from template0 not template1, to ensure it is initially empty.

# reorder database items
- To reorder database items, it is first necessary to dump the table of contents of the archive:
```bash
${CMD[@]} pg_restore -l $BACKUP_FILE -f $BACKUP_FILE.list
```
- the listing file consists of a header and one line for each item
- Semicolons start a comment, and the numbers at the start of lines refer to the internal archive ID assigned to each item.
- Lines in the file can be commented out, deleted, and reordered. For example,
```
10; 145433 TABLE map_resolutions postgres
;2; 145344 TABLE species postgres
;4; 145359 TABLE nt_header postgres
6; 145402 TABLE species_records postgres
;8; 145416 TABLE ss_old postgres
```
- could be used as input to pg_restore and would only restore items 10 and 6, in that order:
```bash
${CMD[@]} pg_restore --verbose --verbose -U postgres -L $BACKUP_FILE.list -d $DB_NAME $BACKUP_FILE
```