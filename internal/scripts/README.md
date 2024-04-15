# Shell scripts

files:
- [create-op.sh](create-op.sh) - create 1password entry
- [env-vars.yml](env-vars.yml) - document environment variables
- [envsubst.yq](envsubst.yq) - envsubst for yaml
- [expand.yq](expand.yq) - merge | explode (targets & aliases) | envsubst
- [gen-doc.sh](gen-doc.sh) - generate env.example & README-vars.md
- [gen-env.sh](gen-env.sh) - merge op dotenv.yml & git env.yml to generate dotenv for consummption by docker
- [get-op.sh](get-op.sh) - get dotenv from 1password
- [gha-mask.sh](gha-mask.sh) - mask secrets for GitHubActions
- [load-permissions.sh](load-permissions.sh)
- [load-synpuf1k.sh](load-synpuf1k.sh)
- [load-vocab.sh](load-vocab.sh)
- [put-op.sh](put-op.sh) - push dotenv to 1password
- [sort-env.sh](sort-env.sh) - sort env yml files