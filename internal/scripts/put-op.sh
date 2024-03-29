#!/usr/bin/env bash
# put 1password item
set -o nounset
set -o errexit

# inputs
env_base_name=${npm_package_config_env_base_name:-env}
env_name=${env_name:-local}
op_vault_name=$npm_package_config_op_vault_name
overwrite=${overwrite:-false}

echo env_name=$env_name

# vars
dotenv_file=.$env_base_name.$env_name.yml
if [ ! -f $dotenv_file ]; then echo INFO $dotenv_file not found; exit 1; fi

dir=private-generated; mkdir -p $dir
op_dotenv_file=$dir/${dotenv_file/.yml/.generated.yml}

# get latest for comparison
op read op://$op_vault_name/$dotenv_file/notesPlain > $op_dotenv_file
sed -i.bak -e '$a\' $op_dotenv_file

# vscode diff if changes
# add newline at end of file, if missing
sed -i.bak -e '$a\' $dotenv_file; rm $dotenv_file.bak
set +o errexit
if diff -q $op_dotenv_file $dotenv_file; then 
    echo INFO: no changes
else
    # echo INFO: diff
    diff $op_dotenv_file $dotenv_file
    echo
    code --diff $op_dotenv_file $dotenv_file
    if [ $overwrite != true ]; then
        read -p "Put $dotenv_file [YyNn]? " -n 1 yn
    fi
    echo
    if [ $overwrite = true ] || [[ $yn =~ ^[Yy]$ ]]; then 
        op item edit --format json --vault $op_vault_name ${dotenv_file} "notesPlain[text]=$(cat ${dotenv_file})" | yq '{"reference": .fields[0].reference, "updated_at": .updated_at}'
    else 
        echo INFO skipped
    fi
fi