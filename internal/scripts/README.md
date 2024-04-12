# Shell scripts

files:
- [create-op.sh](create-op.sh) - create 1password entry
- [env-vars.yml](env-vars.yml) - document environment variables
- [envsubst.yq](envsubst.yq) - envsubst for yaml
- [expand.yq](expand.yq) - merge | explode (targets & aliases) | envsubst
- [gen-env.sh](gen-env.sh) - merge op dotenv.yml & git env.yml to generate dotenv for consummption by docker
- [get-op.sh](get-op.sh) - get dotenv from 1password
- [gha-mask.sh](gha-mask.sh) - mask secrets for GitHubActions
- [load-permissions.sh](load-permissions.sh)
- [load-synpuf1k.sh](load-synpuf1k.sh)
- [load-vocab.sh](load-vocab.sh)
- [put-op.sh](put-op.sh) - push dotenv to 1password
- [sort-env.sh](sort-env.sh) - sort env yml files
poc:
- [gen-doc.sh](gen-doc.sh) - generate env.example & README-vars.md
- [gen-privenv.sh](gen-privenv.sh) - generate private dotenv file from yaml

## individually
- get/put individual dotenv
```
ENV_NAME=$ENV_NAME yarn op:{get|put}
```

### alp-dev-sg-1 
- yarn gen:env alp-dev-sg-1
	- yml:(base-all + base-remote + alp-dev-sg-1){env, .env} => .remote
```
ENV_NAME=alp-dev-sg-1 yarn op:get
ENV_NAME=alp-dev-sg-1 yarn gen:env 
ENV_NAME=alp-dev-sg-1 yarn op:put
```

## by group
### refresh dev related env.yml
- user local remote base-all base-local base-remote alp-dev-sg-1
```
yarn op:get:dev
yarn op:put:dev
```
- optionally add `OVERWRITE` to clobber local file. Otherwise .env.generated.yml is written. 
```
OVERWRITE=true yarn op:get:dev 
OVERWRITE=true yarn op:put:dev
```
