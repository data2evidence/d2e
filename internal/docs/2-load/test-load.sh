# set passwords
export POSTGRES_TENANT_READ_PASSWORD=xxx
export POSTGRES_TENANT_ADMIN_PASSWORD=xxx

MD_FILE=docs/2-load/4-set-pg-permissions.md
# ls $MD_FILE | xargs -n1 rundoc run --inherit-env
ls $MD_FILE | xargs -n1 rundoc list-blocks | jq -r "(.code_blocks[] | {code}).code" | tee $MD_FILE.private.sh
bash -x $MD_FILE.private.sh

MD_FILE=docs/2-load/5-load-synpuf1k.md
ls $MD_FILE | xargs -n1 rundoc list-blocks | jq -r "(.code_blocks[] | {code}).code" | tee $MD_FILE.private.sh
bash -x $MD_FILE.private.sh

MD_FILE=docs/2-load/6-load-vocab.md
rundoc list-blocks $MD_FILE | jq -r "(.code_blocks[] | {code}).code" | tee $MD_FILE.private.sh
bash -x $MD_FILE.private.sh
code $MD_FILE # run psql load if failed