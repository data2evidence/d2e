# Shell scripts

files:
- [create-op.sh](create-op.sh) - create 1password entry
- [env-vars.yml](env-vars.yml) - structured environment variables document
- [envsubst.yq](envsubst.yq) - envsubst for yaml
- [expand.yq](expand.yq) - merge | explode (targets & aliases) | envsubst
- [gen-doc.sh](gen-doc.sh) - generate env.example & README-vars.md
- [gen-env.sh](gen-env.sh) - merge multiple .env.${ENV_NAME}.yml to create .env.${ENV_TYPE}
- [get-op.sh](get-op.sh) - get dotenv from 1password
- [gha-mask.sh](gha-mask.sh) - mask secrets for GitHubActions
- [load-permissions.sh](load-permissions.sh) - set permissions before load
- [load-synpuf1k.sh](load-synpuf1k.sh) - load synpuf1k data
- [load-vocab.sh](load-vocab.sh) - load Athena vocab data
- [put-op.sh](put-op.sh) - put dotenv to 1password
- [sort-env.sh](sort-env.sh) - sort env yml files