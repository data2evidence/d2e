# Get Development Environment Variables

## Get env-var yaml files from 1password

- Hints
  - `export OVERWRITE=true` - to overwrite existing
  - `alias ni='npm run internal'` - shortcut
  - `alias yi='yarn internal'` - shortcut

```bash
yarn internal get:env:all
```

## Generate dotenv file by flatten

- merge relevant cache env yml to flat yml in git_dir

```bash
yarn internal flatten:env:all
```

# Generate DotEnv file

- generate DotEnv filename `.env.${ENV_TYPE}` where ENV_TYPE:

  - local - local macos
  - remote - with FQDN

- convert env yaml to dotenv
- generate wildcard certificate `*.alp.local` with Caddy for TLS inter-service communications
- generate docker resource limits based on available system resources

```bash
yarn internal gen:env
wc -l .env.local
```

# Set plugins repo branch/CommitId - optional

- defaults to main

```bash
echo >> .env.local
echo GIT_COMMIT_ID__PLUGINS_REPO=rc-v0.4.0-beta >> .env.local
grep GIT_COMMIT_ID__PLUGINS_REPO .env.local
```

# Randomize Environment Variables - optional

```bash
yarn gen:env
```

# Persist Environment Variables - optional

- Persists env from .env.$ENV_TYPE file to .env.$ENV_TYPE.private.yml
- Typically run after `yarn init:logto` step

```bash
yarn internal persist:env
```
