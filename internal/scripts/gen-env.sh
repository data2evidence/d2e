#!/usr/bin/env bash
# generate dotenv file
set -o nounset
set -o errexit

# inputs
dn_dir=${dn_dir:-.}
env_base_name=${npm_package_config_env_base_name:-env}
env_name=${env_name:-local}
env_type=${env_type:-local}
private_only=${private_only:-false}

echo env_name=$env_name 
echo env_type=$env_type

# functions
function merge-yml () { 
    yq eval-all '. as $item ireduce ({}; . * $item ) | sort_keys(..)' ${@} 
}

# vars
dotenv_file=$dn_dir/.$env_base_name.$env_type

# build array of dotenv
if [ $private_only = true ]; then
    env_ymls=($env_base_name.private.yml)
elif [ $env_type = local ]; then
    env_ymls=($env_base_name.base-all.yml $env_base_name.base-$env_type.yml $env_base_name.$env_name.yml $env_base_name.private.yml)
elif [ $env_type = remote ]; then
    env_ymls=($env_base_name.base-all.yml $env_base_name.base-$env_type.yml $env_base_name.$env_name.yml)
fi
dotenv_ymls=($(echo ${env_ymls[@]} | sed -e 's/env/.env/g'))
for file in ${env_ymls[@]} ${dotenv_ymls[@]}; do touch $file; done

# convert maps & arrays to strings
merge-yml ${env_ymls[@]} ${dotenv_ymls[@]} | yq 'with_entries(select(.value|tag|test("!!map|!!seq"))|.value|=(.|@json))' | sed -e 's/{}//' > .env.tmp.yml

# export vars for envsubst
merge-yml ${env_ymls[@]} ${dotenv_ymls[@]} | yq -o shell > .env.tmp; set -a; source .env.tmp; set +a

# generate dotenv_file
echo "# ${dotenv_file##*/} $env_name" > $dotenv_file
[ ! -z ${GITHUB_REPOSITORY+x} ] && echo "# https://github.com/$GITHUB_REPOSITORY/actions/runs/$GITHUB_RUN_ID" >> $dotenv_file
merge-yml ${env_ymls[@]} ${dotenv_ymls[@]} .env.tmp.yml | yq -o sh | envsubst >> $dotenv_file

echo "${env_ymls[@]} + ${dotenv_ymls[@]} => $(wc -l $dotenv_file)"
rm .env.tmp .env.tmp.yml
