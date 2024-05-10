## Build & Docker Up
see: main [README.md](../../../README.md)

# Build
```bash
yarn build:minerva
```

## Start ui
```bash
yarn start:ui --wait
```

## Start app
- invokes docker compose up
```bash
yarn start:minerva
```
- add `--force-recreate` if rebuild container
> This flag tells Docker Compose to recreate all containers, regardless of whether the images have changed or not. It ensures that any modifications made to the Dockerfile or build context are applied and that the containers are rebuilt from scratch.
```bash
yarn start:minerva --force-recreate
```
- add `--wait` to daemonize. operational approx `sleep 60` after start e.g. 
```bash
yarn start:minerva --wait; sleep 60; open https://localhost:41100/portal/systemadmin/configuration
```

## Open url
```
open https://localhost:41100
```