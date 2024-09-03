PGPASSWORD=${PG_SUPER_PASSWORD} psql -h ${PG__HOST} -d ${PG__DB_NAME} -U ${PG_SUPER_USER} -p ${PG__PORT} -a \
-c "CREATE SCHEMA "white_rabbit";"

java ${JAVA_OPTS} -jar /app.jar ${0} ${@}