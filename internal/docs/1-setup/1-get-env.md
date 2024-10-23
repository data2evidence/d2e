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
