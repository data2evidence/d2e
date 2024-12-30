# Analytics Platform (D2E)

[![DockerCompose AzureTest CD](https://github.com/alp-os/d2e/actions/workflows/az-dc-cd.yml/badge.svg)](https://github.com/alp-os/d2e/actions/workflows/az-dc-cd.yml) &nbsp;&nbsp; [![Docker Build & Push](https://github.com/alp-os/d2e/actions/workflows/docker-push.yml/badge.svg)](https://github.com/alp-os/d2e/actions/workflows/docker-push.yml) &nbsp;&nbsp; [![Docker compose Build & Up](https://github.com/alp-os/d2e/actions/workflows/docker-compose-up.yml/badge.svg)](https://github.com/alp-os/d2e/actions/workflows/docker-compose-up.yml)

## Install pre-requisites
see: [1-setup](docs/1-setup/README.md)

## Clone repository
- see: [Cloning a GitHub repository](https://docs.github.com/en/repositories/creating-and-managing-repositories/cloning-a-repository)

## Authenticate to private docker registry
- Request credentials from D2E support
```bash
docker login -u $ACR_USERNAME -p "$ACR_PASSWORD" $REGISTRY_URL
```

## Generate dotenv
- see: [environment variables](docs/1-setup/environment-variables.md)
- auto-generate secrets from [env.example](env.example) template to `.env.local`
```bash
yarn gen:dotenv
```
#### Initalize Logto Apps
```bash
yarn init:logto
```
## Build
- Standard build
```bash
yarn build:minerva
```

## (Re)Start App
- Docker compose up - approx 5 minutes
```bash
yarn start:minerva; sleep 60
```

## View Logs
```bash
yarn logs:minerva
```

## Data Load
- see: [2-load](docs/2-load)

## Configure
- see: [3-configure](docs/3-configure)

## Stop
- Stop all containers
```bash
yarn stop:minerva
```

## Clean-up
- **caution**: removes all containers & volumes
```bash
yarn clean:minerva
```

## Extra information
### Setting resource limits
- see: [Resource limits](docs/1-setup/resource-limits.md)
