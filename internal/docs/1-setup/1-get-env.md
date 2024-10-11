# Get Development Environment Variables

## Get env-var yaml files from 1password

- Hints
  - `export OVERWRITE=true`
  - `alias ni='npm run internal'`

```bash
npm run internal get:env:dev
```

## Generate dotenv file by flatten - new

- merge relevant `.env.*.yml` to flat `.env2.*.yml`

```bash
npm run internal flatten:env:dev
```
