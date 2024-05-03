# pg_dumpall backup restore to new volume
- https://dbdeveloper.medium.com/easy-steps-to-backup-your-postgresql-database-in-2024-15a25a232c7f

- Run the following commands to restore the database.
- Decompress SQL backup to this directory
```bash
gunzip 20231230.all.sql.gz
```
- docker compose stop
```bash
yarn local:standalone:minerva down
yarn remote:standalone:minerva down
```
- Remove volume for recreate by docker-compose - full restore
```bash
docker volume rm alp_pg-minerva-data-1
```
- create PG volume
```bash
DOCKER_COMPOSE_VERSION=$(docker compose version | awk '{print $NF}' | awk -F- '{print $1}' | sed -e 's/^v//'); echo DOCKER_COMPOSE_VERSION=$DOCKER_COMPOSE_VERSION
COMPOSE_PROJECT_NAME=alp
VOLUME_NAME=pg-minerva-data-1
COMPOSE_VOLUME_NAME=${COMPOSE_PROJECT_NAME}_${VOLUME_NAME}
docker volume create --label com.docker.compose.project=$COMPOSE_PROJECT_NAME --label=com.docker.compose.version=$DOCKER_COMPOSE_VERSION --label com.docker.compose.volume=$VOLUME_NAME $COMPOSE_VOLUME_NAME
docker volume ls | grep $COMPOSE_VOLUME_NAME
docker volume inspect $COMPOSE_VOLUME_NAME
```
- Start PG container with logs to stdout
```bash
CONTAINER_NAME=alp-minerva-postgres-1
CONTAINER_BACKUP_DIR=/backup
source /d2e/_work/d2e/d2e/.env.remote
docker run --rm --workdir /backup -v ./:$CONTAINER_BACKUP_DIR -v $COMPOSE_VOLUME_NAME:/var/lib/postgresql/data --name $CONTAINER_NAME -e POSTGRES_PASSWORD=$PG_SUPER_PASSWORD postgres:15-alpine 
```
- Open a new terminal
```bash
alias psql='docker exec -it $CONTAINER_NAME psql --username=postgres'
```
- Create tmp DB
```bash
psql -U postgres -c 'CREATE DATABASE tmp;'
```
- Connect to tmp DB to other databases
```bash
for DB_NAME in postgres alp alpdev_pg; do
	psql -U postgres -d tmp -c "DROP DATABASE IF EXISTS $DB_NAME;"
done
```
- Connect to tmp DB to create empty postgres
```bash
psql -U postgres -d tmp -c 'CREATE DATABASE postgres;'
```
- exec to container
```bash
docker exec -it $CONTAINER_NAME sh 
```
- Restore
```bash
RESTORE_FILE=20240216T0300Z.all.sql.gz
gzip -cd $RESTORE_FILE | grep alp-dev-sg
gzip -cd $RESTORE_FILE | psql -U postgres -d tmp | tee ${RESTORE_FILE//.sql/}.log
```
- Remove tmp DB
```bash
psql -U postgres -c 'DROP DATABASE tmp'
psql -U postgres -c 'DROP DATABASE tmp2'
```