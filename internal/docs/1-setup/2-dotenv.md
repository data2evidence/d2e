# docker-compose dotenv config yml merge
- 1password dotenv contains `DATABASE_CREDENTIALS` dbcreds seed & other development related env-vars
- recommend source shared `zshrc` - otherwise `OP_VAULT_NAME` & `GOOGLE_DRIVE_DATA_DIR` must be set explicitly
- certificates expected with linebreaks in .env.yml
- code must handle env-var with linebreaks or literal '\n'

## Quickstart
- get dotenv needed for local development - caution: overwrites existing files
```bash
OVERWRITE=true yarn op:get:dev
```
- Generate .env.local
```bash
yarn gen:env
```

## Key
Usage:
```bash
OVERWRITE={true|false} ENV_NAME=$ENV_NAME yarn op:{get|put}:$ENV_TYPE
```
- **ENV_NAME**: environment names 
  - `local` (default), `alp-{dev|stg}-{de|sg}-[1-3]`
- **ENV_TYPE**: environment types
  - `local` (local environment), `remote` (all other environments)
  - dotenv file naming is `.env.$ENV_TYPE`
- **OVERWRITE**{true|false} - overwrite local yml with version from 1password
- **diff** where local & 1password versions differ, invoke `vscode --diff` with
  - `cache/op/.env.${ENV_NAME}.yml` - from 1password - for compare
  - `.env.${ENV_NAME}.yml` - dev file - for yml merge
- **config** package.json 
  - `env_names_dev` defines `dev` group of env-vars
  - `env_names_all` defines `all` group of env-vars

## 1 - get dotenv from 1password
- get `dev` group of yml from 1password
```bash
yarn op:get:dev
```
- to get & overwrite local `dev` config yml
```bash
OVERWRITE=true yarn op:get:dev
```
- to get & overwrite local `all` config yml
```bash
OVERWRITE=true yarn op:get:all
```
e.g. 
```bash
% OVERWRITE=true yarn op:get:dev
yarn run v1.22.21
$ for ENV_NAME in ${npm_package_config_env_names_dev[@]}; do OVERWRITE=$OVERWRITE ENV_NAME=$ENV_NAME yarn op:get; done
$ internal/scripts/get-op.sh
cache/op/.env.local.yml
ALERT: OVERWRITE .env.local.yml
$ internal/scripts/get-op.sh
cache/op/.env.remote.yml
ALERT: OVERWRITE .env.remote.yml
$ internal/scripts/get-op.sh
cache/op/.env.base-all.yml
ALERT: OVERWRITE .env.base-all.yml
$ internal/scripts/get-op.sh
cache/op/.env.base-local.yml
ALERT: OVERWRITE .env.base-local.yml
$ internal/scripts/get-op.sh
cache/op/.env.base-remote.yml
ALERT: OVERWRITE .env.base-remote.yml
$ internal/scripts/get-op.sh
cache/op/.env.alp-dev-sg-1.yml
ALERT: OVERWRITE .env.alp-dev-sg-1.yml
✨  Done in 18.09s. 
```

#  2 - generate .env.local
- combine relevant yml:{env, .env} to create .env.{local|remote} input to docker-compose
- yarn gen:env local
  - yml:(base-all + base-local + local){env, .env} => .local
- long form
```bash
ENV_NAME=local yarn gen:env
```
- short form - `ENV_NAME` defaults to `local`
```bash
yarn gen:env
```
note: 
- invokes `yarn gen:tls` which retrieves TLS INTERNAL certificates from caddy & adds to dotenv file
```bash
yarn gen:tls
```
if TLS__INTERNAL_* lines are missing from .env.local the following error occurs
> Gateway is throwing an error related to tls [2024-03-22 01:32:18] error: post https://localhost:41100/oauth/token Error: write EPROTO 004DC693FFFF0000:error:0A000410:SSL routines:ssl3_read_bytes:sslv3 alert handshake failure:../deps/openssl/openssl/ssl/record/rec_layer_s3.c:1600:SSL alert number 40

e.g. 
```bash
% yarn gen:env
yarn run v1.22.21
$ internal/scripts/gen-env.sh && yarn gen:tls
ENV_NAME=local
ENV_TYPE=remote
.env.base-all.yml .env.base-remote.yml .env.local.yml => 93 ./.env.remote
$ scripts/gen-tls.sh
added 3xTLS__INTERNAL to .env.remote
✨  Done in 1.37s.

% yarn gen:env
yarn run v1.22.21
$ internal/scripts/gen-env.sh && yarn gen:tls
ENV_NAME=local
ENV_TYPE=remote
.env.base-all.yml .env.base-remote.yml .env.local.yml => 93 ./.env.remote
$ scripts/gen-tls.sh
added 3xTLS__INTERNAL to .env.remote
✨  Done in 1.18s.
```

# 3 - put dotenv to 1password
- put `dev` group of yml to 1password
```bash
yarn op:put:dev
```

e.g. 
```bash
% yarn op:put:dev
yarn run v1.22.21
$ for ENV_NAME in ${npm_package_config_env_names_dev[@]}; do OVERWRITE=$OVERWRITE ENV_NAME=$ENV_NAME yarn op:put; done
$ internal/scripts/put-op.sh
cache/op/.env.local.yml
INFO: no changes
$ internal/scripts/put-op.sh
cache/op/.env.remote.yml
INFO: no changes
$ internal/scripts/put-op.sh
cache/op/.env.base-all.yml
INFO: no changes
$ internal/scripts/put-op.sh
cache/op/.env.base-local.yml
INFO: no changes
$ internal/scripts/put-op.sh
cache/op/.env.base-remote.yml
INFO: no changes
$ internal/scripts/put-op.sh
cache/op/.env.alp-dev-sg-1.yml
INFO: no changes
✨  Done in 19.65s.
```