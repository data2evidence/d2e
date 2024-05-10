password_length=30
tmp_file=.env.my
function set-password {
    export password_name=$1
    echo INFO set password:$password_name ...
    export password_value=$(LC_ALL=C tr -dc 'A-Za-z0-9' </dev/urandom | head -c $password_length)
    echo ${password_name}=${password_value} >> $tmp_file
}
set-password POSTGRES_TENANT_READ_PASSWORD
set-password POSTGRES_TENANT_ADMIN_PASSWORD

tmp_file=.env.my; set -o allexport; source $tmp_file; set +o allexport; cat $tmp_file
echo -n POSTGRES_TENANT_ADMIN_PASSWORD=; echo $POSTGRES_TENANT_ADMIN_PASSWORD | pbcopy; pbpaste
echo -n POSTGRES_TENANT_READ_PASSWORD=; echo $POSTGRES_TENANT_READ_PASSWORD | pbcopy; pbpaste
