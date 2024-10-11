# Generate DotEnv file

- generate `.env.${ENV_TYPE}`

<!-- ## Generate dotenv file by merge - old

- generate `.env.${ENV_TYPE}` by merge relevant `.env.*.yml`

```bash
npm run internal gen:env
``` -->

## Convert env-var yaml to dotenv

- add env-vars from relevant `.env2.${ENV_NAME}.yml`
- auto-generate `TLS__INTERNAL_*` certificates

```bash
npm run internal gen:env2
wc -l .env.local
```
