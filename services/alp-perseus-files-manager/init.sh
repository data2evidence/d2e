PGPASSWORD=${PG_SUPER_PASSWORD} psql -h ${PG__HOST} -d ${PG__DB_NAME} -U ${PG_SUPER_USER} -p ${PG__PORT} -a \
-c "CREATE SCHEMA files_manager;" \
-c "GRANT ALL PRIVILEGES ON SCHEMA files_manager TO $PG_SUPER_USER;" 


# echo "Generating database credentials in application-docker.yml"
sed -i "s/{PG__HOST}/${PG__HOST}/g" ./config/application-docker.yml
sed -i "s/{PG__PORT}/${PG__PORT}/g" ./config/application-docker.yml
sed -i "s/{PG__DB_NAME}/${PG__DB_NAME}/g" ./config/application-docker.yml
sed -i "s/{PG_SUPER_PASSWORD}/${PG_SUPER_PASSWORD}/g" ./config/application-docker.yml
sed -i "s/{PG_SUPER_USER}/${PG_SUPER_USER}/g" ./config/application-docker.yml

./entrypoint.sh