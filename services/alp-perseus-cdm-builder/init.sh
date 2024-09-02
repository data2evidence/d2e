PGPASSWORD=${PG_SUPER_PASSWORD} psql -h ${PG__HOST} -d ${PG__DB_NAME} -U ${PG_SUPER_USER} -p ${PG__PORT} -a \
-c "CREATE SCHEMA builder;" \
-c "GRANT ALL PRIVILEGES ON SCHEMA builder TO $PG_SUPER_USER;" \

echo "Generating database credentials in appsettings.Docker.json"
sed -i "s/{PG__HOST}/${PG__HOST}/g" ./config/appsettings.Docker.json
sed -i "s/{PG__PORT}/${PG__PORT}/g" ./config/appsettings.Docker.json
sed -i "s/{PG__DB_NAME}/${PG__DB_NAME}/g" ./config/appsettings.Docker.json
sed -i "s/{PG_SUPER_PASSWORD}/${PG_SUPER_PASSWORD}/g" ./config/appsettings.Docker.json
sed -i "s/{PG_SUPER_USER}/${PG_SUPER_USER}/g" ./config/appsettings.Docker.json

cp ./config/appsettings.Docker.json ./appsettings.Docker.json 

dotnet org.ohdsi.cdm.presentation.builderwebapi.dll