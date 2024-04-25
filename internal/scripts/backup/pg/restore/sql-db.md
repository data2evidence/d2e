# pg_dump restore single DB to existing docker volume
- https://www.postgresql.org/docs/current/app-pgrestore.html
- https://dbdeveloper.medium.com/easy-steps-to-backup-your-postgresql-database-in-2024-15a25a232c7f

- create PG volume, if needed
```bash
COMPOSE_PROJECT_NAME=alp-data-node
# COMPOSE_PROJECT_NAME=alp
VOLUME_NAME=pg-minerva-data-1
COMPOSE_VOLUME_NAME=${COMPOSE_PROJECT_NAME}_${VOLUME_NAME}
docker volume ls | grep $COMPOSE_VOLUME_NAME
docker volume inspect $COMPOSE_VOLUME_NAME
```

- Start PG container with logs to stdout
```bash
cd ~/backups
CONTAINER_NAME=alp-minerva-postgres-1
CONTAINER_BACKUP_DIR=/backup
docker container run --publish 41190:5432 --workdir /backup -v ./:$CONTAINER_BACKUP_DIR -v $COMPOSE_VOLUME_NAME:/var/lib/postgresql/data --name $CONTAINER_NAME postgres:15-alpine
```

- exec to container
```bash
docker exec -it $CONTAINER_NAME sh 
```
- Restore
```bash
DB_NAME=alpdev_pg
DB_NAME=alp
RESTORE_FILE=20240216T0300Z.$DB_NAME.sql.gz
gzip -cd $RESTORE_FILE | psql -U postgres | tee ${RESTORE_FILE//.sql/}.log
```