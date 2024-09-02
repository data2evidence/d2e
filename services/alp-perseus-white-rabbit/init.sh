PGPASSWORD=${PG_SUPER_PASSWORD} psql -h ${PG__HOST} -d ${PG__DB_NAME} -U ${PG_SUPER_USER} -p ${PG__PORT} -a \
-c "CREATE SCHEMA white_rabbit;" \
-c "GRANT ALL PRIVILEGES ON SCHEMA white_rabbit TO $PG_SUPER_USER;"

java ${JAVA_OPTS} -jar /app.jar ${0} ${@}