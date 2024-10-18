echo "Generating database credentials in config.py"
sed -i "s/{PG__HOST}/${PG__HOST}/g" config.py
sed -i "s/{PG__PORT}/${PG__PORT}/g" config.py
sed -i "s/{PG__DB_NAME}/${PG__DB_NAME}/g" config.py
sed -i "s/{PG_ADMIN_PASSWORD}/${PG_ADMIN_PASSWORD}/g" config.py
sed -i "s/{PG_ADMIN_USER}/${PG_ADMIN_USER}/g" config.py

cp ./config/config.py ./config.py

./entrypoint.sh
