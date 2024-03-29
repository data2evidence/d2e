#!/usr/bin/env bash
# get 1password item
set -o nounset
set -o errexit

# inputs
env_base_name=${npm_package_config_env_base_name:-env}
env_name=${env_name:-local}
op_vault_name=$npm_package_config_op_vault_name
overwrite=${overwrite:-false}

# echo env_name=$env_name

# vars
dotenv_file=.$env_base_name.$env_name.yml
dir=private-generated; mkdir -p $dir
op_dotenv_file=$dir/$dotenv_file
echo get $dotenv_file ...

# get
op read op://$op_vault_name/$dotenv_file/notesPlain | sed -e '$a\' > $op_dotenv_file

if [ ! -s $op_dotenv_file ]; then 
    echo ERROR empty/failed $op_dotenv_file
    exit 1
fi

if [ $overwrite = true ] || [ ! -f $dotenv_file ]; then
    echo ALERT: overwrite $dotenv_file
    cp $op_dotenv_file $dotenv_file
    exit 0
fi

# vscode diff if changes
set +o errexit
if diff -q $op_dotenv_file $dotenv_file; then 
    echo INFO: no diff
else
    echo INFO: diff
    diff $op_dotenv_file $dotenv_file
    code --diff $op_dotenv_file $dotenv_file
fi