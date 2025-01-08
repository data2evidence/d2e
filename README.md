# Analytics Platform (D2E)

[![DockerCompose AzureTest CD](https://github.com/alp-os/d2e/actions/workflows/az-dc-cd.yml/badge.svg)](https://github.com/alp-os/d2e/actions/workflows/az-dc-cd.yml) &nbsp;&nbsp; [![Docker Build & Push](https://github.com/alp-os/d2e/actions/workflows/docker-push.yml/badge.svg)](https://github.com/alp-os/d2e/actions/workflows/docker-push.yml) &nbsp;&nbsp; [![Docker compose Build & Up](https://github.com/alp-os/d2e/actions/workflows/docker-compose-up.yml/badge.svg)](https://github.com/alp-os/d2e/actions/workflows/docker-compose-up.yml)

# Getting Started

## Pre-requisites

- Install pre-requisite software for running D2E. See: installation guide [here](./1-setup/README.md)

- Clone `d2e` GitHub repository. See: [Cloning a GitHub repository](https://docs.github.com/en/repositories/creating-and-managing-repositories/cloning-a-repository)

```bash
git clone --branch develop https://github.com/alp-os/d2e.git
```

- Clone `d2e-plugins` GitHub repository

```bash
git clone --branch trex https://github.com/alp-os/d2e-plugins.git
```

- Authenticate to private docker registry with credentials provided by [D2E Support](#d2e-support)

```bash
docker login -u $ACR_USERNAME -p "$ACR_PASSWORD" $REGISTRY_URL
```

## Environment Variables and Credentials Setup

- Invoke the following command to populate `.env.local` with random secrets. See: environment variables document [here](env-vars.md)

```bash
yarn gen:dotenv
```

- Append `GH_TOKEN` provided by [D2E Support](#d2e-support) for trex container to read GitHub repos

```bash
echo GH_TOKEN='<GH_TOKEN>' >> .env.local
```

- Initalize Logto Apps
  - note: [clean-up](README.md#clean-up) first to re-initialize

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
