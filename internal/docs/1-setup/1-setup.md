# Set Environment Variables

- `export OVERWRITE=true` - to overwrite `.env.${ENV_NAME}.yml` on local filesystem `get:env` action
- `export OVERWRITE_OP=true` - to overwrite `.env.${ENV_NAME}.yml` on 1password during `put:env` action
- `alias ni='npm run internal'` - shortcut
- `alias yi='yarn internal'` - shortcut

- ENV_TYPE
  - local - local macos
  - remote - VM with FQDN

## Get env-var yaml files from 1password

```bash
yarn internal get:env:all
```

## Generate dotenv file by flatten

- merge relevant cache env yml to flat yml in git_dir

```bash
yarn internal flatten:env:all
```

## Generate DotEnv file

- Invokes 3 scripts

## set:env

- convert `.env.$ENV_NAME.yml` & `.env.$ENV_TYPE.private.yml` to `.env.${ENV_TYPE}`

## gen:tls

- generate wildcard certificate `*.alp.local` with Caddy for TLS inter-service communications

## gen:resource-limits

- generate docker resource limits based on available system resources

```bash
yarn internal gen:env
```

## Randomize Environment Variables - optional

```bash
yarn gen:dotenv
```

### Clean

- Needed if randomize variables
- removes all volumes

```bash
yarn clean:minerva
```

### Persist Environment Variables

- Needed if randomize variables
- Persists env from `.env.$ENV_TYPE` file to `.env.$ENV_TYPE.private.yml`

```bash
yarn internal persist:env
```

## Initalize Logto Apps

```bash
yarn init:logto
```
