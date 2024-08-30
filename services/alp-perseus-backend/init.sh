PGPASSWORD=${PG_SUPER_PASSWORD} psql -h ${PG__HOST} -d ${PG__DB_NAME} -U ${PG_SUPER_USER} -p ${PG__PORT} -a \
-c "CREATE SCHEMA perseus;" \
-c "GRANT ALL PRIVILEGES ON SCHEMA perseus TO $PG_SUPER_USER;" \
-c "CREATE DATABASE source;" \
-c "GRANT ALL PRIVILEGES ON DATABASE source TO $PG_SUPER_USER;"

echo "Generating database credentials in config.py"
sed -i "s/{PG__HOST}/${PG__HOST}/g" config.py
sed -i "s/{PG__PORT}/${PG__PORT}/g" config.py
sed -i "s/{PG__DB_NAME}/${PG__DB_NAME}/g" config.py
sed -i "s/{PG_SUPER_PASSWORD}/${PG_SUPER_PASSWORD}/g" config.py
sed -i "s/{PG__SUPER_USER}/${PG__SUPER_USER}/g" config.py

cp ./config/config.py ./config.py

./entrypoint.sh
