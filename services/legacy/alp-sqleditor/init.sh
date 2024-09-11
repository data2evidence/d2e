cd envConverter && yarn generate:envs -s alp-sqleditor
cd ../ 

echo "Generating sqleditor.ini"
sed -i "s/{PG__HOST}/${PG__HOST}/g" sqleditor.ini
sed -i "s/{PG__PORT}/${PG__PORT}/g" sqleditor.ini
sed -i "s/{PG__DB_NAME}/${PG__DB_NAME}/g" sqleditor.ini
sed -i "s/{PG__ADMIN_PASSWORD}/${PG__ADMIN_PASSWORD}/g" sqleditor.ini
sed -i "s/{PG__ADMIN_USER}/${PG__ADMIN_USER}/g" sqleditor.ini

cp sqleditor.ini /usr/share/hue/desktop/conf/z-hue.ini
./startup.sh