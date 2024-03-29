# Shell scripts

files:
- [create-op.sh](create-op.sh) - create 1password entry
- [env-vars.yml](env-vars.yml) - document environment variables
- [envsubst.yq](envsubst.yq) - envsubst for yaml. ref: https://mikefarah.gitbook.io/yq/operators/env-variable-operators. not referenced in any script
- [expand.yq](expand.yq) - merge | explode (targets & aliases) | envsubst. ref: https://mikefarah.gitbook.io/yq/operators/anchor-and-alias-operators#explode-with-no-aliases-or-anchors. not referenced in any script
- [gen-doc.sh](gen-doc.sh) - generate env.example & README-vars.md
- [gen-env.sh](gen-env.sh) - merge op dotenv.yml & git env.yml to generate dotenv for consummption by docker
- [gen-sec.sh](gen-sec.sh) - auto generate all secrets to $dotenv_yml (default .env.sec.yml)
- [get-op.sh](get-op.sh) - get dotenv from 1password
- [gha-mask.sh](gha-mask.sh) - mask secrets for GitHubActions
- [put-op.sh](put-op.sh) - push dotenv to 1password
- [sort-env.sh](sort-env.sh) - sort env yml files

# Usage

## individually
- get/put individual dotenv
```
yarn op:{get|put} ${NAME}
```

### alp-dev-sg-1 
- yarn gen:env alp-dev-sg-1
	- yml:(base-all + base-remote + alp-dev-sg-1){env, .env} => .remote
```
yarn op:get alp-dev-sg-1 
yarn gen:env alp-dev-sg-1
yarn op:put alp-dev-sg-1
```

## by group
### refresh dev related env.yml
- user local remote base-all base-local base-remote alp-dev-sg-1
```
yarn op:get:dev
yarn op:put:dev
```
- optionally add `overwrite` to clobber local file. Otherwise .env.generated.yml is written. 
```
yarn op:get:dev overwrite
yarn op:put:dev overwrite
```
